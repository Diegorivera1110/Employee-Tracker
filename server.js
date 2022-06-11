const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "team",
});

const dbActions = () => {
  inquirer
    .prompt({
      type: "list",
      name: "firstAction",
      message: "Waht would you like to do?",
      choices: [
        "View All Employees",
        "View all Roles",
        "View all Departments",
        "Add Role",
        "Add Department",
        "add Employees",
        "Update Employee Role",
        "Quit"
      ],
    })
    .then((answer) => {
      console.log(answer);
    });
};

db.connect((err) => {
  if (err) throw err;

  dbActions();

  // console.log("Sucessfully connected")
});
