const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const figlet = require('figlet');

require('dotenv').config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'team',
});

db.connect((err) => {
  if (err) throw err;
  managerPrompt();

  // console.log("Sucessfully connected")
});

figlet('EMPLOYEE MANAGER', function(err, data) {
  if (err) {
    console.log('Something went wrong...');
    console.dir(err);
    return;
  }
  console.log(data)
});

const managerPrompt = () => {
  inquirer
    .prompt([
      {
      type: 'list',
      name: 'firstAction',
      message: 'Waht would you like to do?',
      choices: [
        'View All Employees',
        'View all Roles',
        'View all Departments',
        'Add Role',
        'Add Department',
        'Add Employees',
        'Update Employee Role',
        'Update Employee Manager',
        // 'View All Employees be Department',

        'Quit'
      ],
    }
  ])
    .then((answers) => {
      const { choices } = answers;

      if (choices === 'View All Employees') {
        viewEmployees();
      }
      if (choices === 'View All Roles') {
        viewRoles();
      }
      if (choices === 'View all Departments') {
        viewDepartments();
      }
      if (choices === 'Add Role') {
        addRole();
      }
      if (choices === 'Add Department') {
        addDepartment();
      }
      if (choices === 'Add Employees') {
        addEmployee();
      }
      if (choices === 'Update Employee Role') {
        updateEmployee();
      }
      if (choices === 'Update Employee Manager') {
        updateManager();
      }
      if (choices === 'Quit') {
        db.end();
      };
      // console.log(answers);
    });
};


