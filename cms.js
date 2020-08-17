var mysql = require("mysql");
var mysqlPW = require("./js/pw"); 
var inquirer = require("inquirer");
var Employee = require("./js/employee")
var Role = require("./js/role")
var Department = require("./js/department")

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: mysqlPW,
  database: "cms_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  startingPrompt(); 
});

function startingPrompt(){ 
    inquirer
      .prompt({
        name: "startRequest",
        type: "list",
        message: "What would you like to do?",
        choices: ["Add a department", "Add a role", "Add an employee", "View all departments", "View all roles", 
        "View all employees", "Update an employee's role", "Update an employee's manager", "Delete an employee", "I'm done! Exit"]
      })
      .then(function(answer) {

        // based on their answer, call various functions 
        // replace with switch operator later!! 
        if (answer.startRequest==="Add a department") {
          addDepartment();
        } else if(answer.startRequest==="Add a role") {
          addRole();
        } else if(answer.startRequest==="Add an employee") {
            addEmployee();
        } else if (answer.startRequest==="View all departments"){
            viewDepartments(); 
        } else if (answer.startRequest==="View all roles"){ 
            viewRoles(); 
        } else if (answer.startRequest==="View all employees"){ 
            viewEmployees(); 
        } else if(answer.startRequest==="Update an employee's role"){ 
            updateEmployeeRole(); 
        } else if(answer.startRequest==="Update an employee's manager"){ 
            updateEmployeeManager(); 
        } else if(answer.startRequest==="Delete an employee"){ 
            deleteEmployee(); 
        }else{
          connection.end();
        }
      });

}

//creates a new item in the departments table 
function addDepartment(){ 
    inquirer.prompt({
        name: "dept",
        type: "input",
        message: "What is the name of the new departmnet?",
    }).then(function(answer){ 
        const newDept = new Department(answer.dept);
        connection.query("INSERT INTO departments SET dept_name = ?", [newDept.dept_name], function(err, res){ 
            if (err) throw err; 
            console.log (res.affectedRows + " was inserted into departments!\n")
        })
        startingPrompt(); 
    })
};

//creates a new item in the roles table 
function addRole(){
    connection.query("SELECT * FROM departments", function(err,res){ 
        if (err) throw err;  
        for (i=0; i<res.length; i++){ 
            res[i].value = res[i].id; 
            res[i].name = res[i].dept_name; 
            delete res[i].dept_name
            delete res[i].id; 
        }
        var deptOptions = res; 
        rolePrompt(deptOptions); 
    })
    

    function rolePrompt(deptOptions){ 
        inquirer.prompt([{
            name: "role",
            type: "input",
            message: "What is the name of the new role?"
        },
        { 
            name: "salary", 
            type: "input", 
            message: "What is the salary for this new position? (Please enter only a number value - no '$'"
        }, 
        { 
            name: "dept_id", 
            type: "list", 
            message: "What department is the new role in?",
            choices: deptOptions
        }])
        
        .then(function(answer){ 
            console.log(answer); 
            const newRole = new Role(answer.role, answer.salary, answer.dept_id);
            console.log(newRole); 
            connection.query("INSERT INTO roles SET ?", newRole, function(err, res){ 
                if (err) throw err; 
                console.log (res.affectedRows + " was inserted into roles!\n")
            })
            startingPrompt(); 

        })
    }

}

//creates a new item in the employees table 
function addEmployee(){
    connection.query("SELECT * FROM roles", function(err,res){ 
        if (err) throw err;  
        for (i=0; i<res.length; i++){ 
            res[i].name = res[i].title; 
            res[i].value = res[i].id; 
            delete res[i].id; 
            delete res[i].title;  
        }
        roleOptions = res; 
        addEmployeeStepTwo(roleOptions); 
    })
    function addEmployeeStepTwo(roleOptions){ 
        connection.query("SELECT * FROM employees", function(err,res){ 
            if (err) throw err;  
            for (i=0; i<res.length; i++){ 
                var fullName = res[i].first_name + " " + res[i].last_name; 
                res[i].name = fullName;  
                res[i].value = res[i].role_id; 
                delete res[i].employee_id;  
                delete res[i].first_name; 
                delete res[i].last_name; 
            }
            managerOptions = res; 
            employeePrompt(roleOptions, managerOptions); 
        })
    }

    function employeePrompt(roleOptions, managerOptions){ 
    
        inquirer.prompt([{
            name: "first_name",
            type: "input",
            message: "What is the first name of the new employee?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the last name of the new employee?"
        },
        { 
            name: "role_id", 
            type: "list", 
            message: "What is the employee's role?",
            choices: roleOptions
        }, 
        { 
            name: "manager_id", 
            type: "list", 
            message: "Who is the employee's manager?",
            choices: managerOptions
        }])
        
        .then(function(answer){ 
            const newEmployee = new Employee(answer.first_name, answer.last_name, answer.role_id, answer.manager_id);
            connection.query("INSERT INTO employees SET ?", newEmployee, function(err, res){ 
                if (err) throw err; 
                console.log (res.affectedRows + " was inserted into employees!\n")
                startingPrompt(); 

            })
          
        })
    }

}

//displays entire departments table 
function viewDepartments(){ 
    connection.query("SELECT * FROM departments", function(err,res){ 
        if (err) throw err; 
        console.table(res); 
        startingPrompt(); 

    })

}

//displays entire roles table 
function viewRoles(){ 
    connection.query("SELECT roles.title, roles.salary, departments.dept_name FROM roles INNER JOIN departments ON roles.department_id = departments.id", function(err,res){ 
        if (err) throw err; 
        console.table(res); 
        startingPrompt(); 

    })
}

//displays entire employees table 
function viewEmployees(){ 
    connection.query("SELECT employees.first_name, employees.last_name, roles.title FROM employees INNER JOIN roles ON employees.role_id = roles.id", function(err,res){ 
        if (err) throw err; 
        console.table(res); 
        startingPrompt(); 

    })

}

//allows user to update an employee's role 
function updateEmployeeRole(){
    connection.query("SELECT * FROM roles", function(err,res){ 
        if (err) throw err;  
        for (i=0; i<res.length; i++){ 
            res[i].name = res[i].title; 
            res[i].value = res[i].id; 
            delete res[i].id; 
            delete res[i].title;  
        }
        roleOptions = res; 
        updateEmployeeStepTwo(roleOptions); 
    })

    function updateEmployeeStepTwo(roleOptions){
        connection.query("SELECT * FROM employees", function(err,res){ 
            if (err) throw err;  
            for (i=0; i<res.length; i++){ 
                var fullName = res[i].first_name + " " + res[i].last_name; 
                res[i].name = fullName;  
                res[i].value = res[i].role_id; 
                delete res[i].employee_id;  
                delete res[i].first_name; 
                delete res[i].last_name; 
            }
            employeeOptions = res; 
            updateEmployeeRolePrompt(employeeOptions, roleOptions); 
        }) 
    }

    function updateEmployeeRolePrompt(employeeOptions, roleOptions){ 
    
        inquirer.prompt([{
            name: "employee",
            type: "list",
            message: "Which employee would you like to update?", 
            choices: employeeOptions
        },
        {
            name: "newRole",
            type: "list",
            message: "What is their new role?",
            choices: roleOptions
        }
        ]).then(function(answer){ 
            connection.query("UPDATE employees SET ? WHERE ?", [{role_id: answer.newRole}, {id: answer.employee}], function(err, res){ 
                if (err) throw err; 
                console.log (res.affectedRows + " was updated in the employees table!\n")
                startingPrompt(); 

            })

        })
    }

}

//allows user to update an employee's manager 
function updateEmployeeManager(){ 
    connection.query("SELECT * FROM employees", function(err,res){ 
        if (err) throw err;  
        for (i=0; i<res.length; i++){ 
            var fullName = res[i].first_name + " " + res[i].last_name; 
            res[i].name = fullName;  
            res[i].value = res[i].role_id; 
            delete res[i].employee_id;  
            delete res[i].first_name; 
            delete res[i].last_name; 
        }
        allEmployees = res; 
        updateEmployeeManagerPrompt(allEmployees); 
    }) 

    function updateEmployeeManagerPrompt(allEmployees){ 
    
        inquirer.prompt([{
            name: "employee",
            type: "list",
            message: "Which employee would you like to update?", 
            choices: allEmployees
        },
        {
            name: "newManager",
            type: "list",
            message: "Who is their new manager? If the employee does not have a manager, select their own name from the drop down.",
            choices: allEmployees
        }
        ]).then(function(answer){ 
            connection.query("UPDATE employees SET ? WHERE ?", [{manager_id: answer.newManager}, {id: answer.employee}], function(err, res){ 
                if (err) throw err; 
                console.log (res.affectedRows + " was updated in the employees table!\n")
                startingPrompt(); 
            })
           

        })
    }

}

function deleteEmployee(){

    connection.query("SELECT * FROM employees", function(err,res){ 
        if (err) throw err;  
        for (i=0; i<res.length; i++){ 
            var fullName = res[i].first_name + " " + res[i].last_name; 
            res[i].name = fullName;  
            res[i].value = res[i].role_id; 
            delete res[i].employee_id;  
            delete res[i].first_name; 
            delete res[i].last_name; 
        }
        employees = res; 
        deletePrompt(employees); 
    })
    

    function deletePrompt(employees){ 
    
        inquirer.prompt([
        { 
            name: "employee_gone", 
            type: "list", 
            message: "Which employee would you like to delete?",
            choices: employees
        }])
        
        .then(function(answer){ 
            connection.query("DELETE FROM employees WHERE ?", {id: answer.employee_gone}, function(err, res){ 
                if (err) {
                    console.log("Oops! This employee manages other employees. Let's provide their subordinates with a new manager, first.")
                    updateEmployeeManager();
                }
                else {
                    console.log (res.affectedRows + " was removed from the system!\n")
                    startingPrompt(); 

                }
            })

        })
    }


}