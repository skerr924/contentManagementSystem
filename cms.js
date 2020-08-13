var mysql = require("mysql");
var mysqlPW = require("./pw"); 
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
        "View all employees", "Update an employee's role", "Update an employee's manager"]
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
        } else{
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
    })
};

//creates a new item in the roles table 
function addRole(){
    let deptOptions = []; 
    connection.query("SELECT * FROM departments", function(err,res){ 
        if (err) throw err; 
        console.log(res); 
        for (i=0; i<res.length; i++){ 
            res[i].value = res[i].id; 
            res[i].name = res[i].dept_name;
        } 
        console.log(res); 
        deptOptions = res; 
    })


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
        // const newDept = new Department(answer.dept);
        // connection.query("INSERT INTO departments SET dept_name = ?", [newDept.dept_name], function(err, res){ 
        //     if (err) throw err; 
        //     console.log (res.affectedRows + " was inserted into departments!\n")
        // })
    })
}

//creates a new item in the employees table 
function addEmployee(){

}

//displays entire departments table 
function viewDepartments(){ 

}

//displays entire roles table 
function viewRoles(){ 

}

//displays entire employees table 
function viewEmployees(){ 

}

//allows user to update an employee's role 
function updateEmployeeRole(){ 

}

//allows user to update an employee's manager 
function updateEmployeeManager(){ 

}



