var mysql = require("mysql");
var mysqlPW = require("./pw.js"); 


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
  connection.end();
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

}

//creates a new item in the roles table 
function addRole(){

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



