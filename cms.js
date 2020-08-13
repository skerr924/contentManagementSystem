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
        if (answer.startRequest === "Add a department") {
          addDepartment();
        } else if(answer.startRequest === "Add a role") {
          addRole();
        } else if (answer.startRequest === "View all departments"){
            viewDepartments(); 
        } else if (answer.startRequest === "View all roles"){ 
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


// function queryAllAuctions() {
//   var query = connection.query("SELECT * FROM auctions", function(err, res) {
//     if (err) throw err;
//     console.log(res);
//     console.log(query.sql);

//   });
// }


