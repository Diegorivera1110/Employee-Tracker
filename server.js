const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const figlet = require("figlet");
// const Connection = require('mysql2/typings/mysql/lib/Connection');

require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "team",
});

db.connect((err) => {
  if (err) throw err;
  managerPrompt();

  // console.log("Sucessfully connected")
});

figlet("EMPLOYEE MANAGER", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});

const managerPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "firstAction",
        message: "Waht would you like to do?",
        choices: [
          "View All Employees",
          "View all Roles",
          "View all Departments",
          "Add Role",
          "Add Department",
          "Add Employees",
          "Update Employee Role",
          "Update Employee Manager",
          // 'View All Employees be Department',

          "Quit",
        ],
      },
    ])
    .then((answers) => {
      const { firstAction } = answers;
      if (firstAction === "View All Employees") {
        viewEmployees();
      }
      console.log("roles are working");
      if (firstAction === "View all Roles") {
        viewRoles();
      }
      if (firstAction === "View all Departments") {
        viewDepartments();
      }
      if (firstAction === "Add Role") {
        addRole();
      }
      if (firstAction === "Add Department") {
        addDepartment();
      }
      if (firstAction === "Add Employees") {
        addEmployee();
      }
      if (firstAction === "Update Employee Role") {
        updateEmployee();
      }
      if (firstAction === "Update Employee Manager") {
        updateManager();
      }
      if (firstAction === "Quit") {
        console.log("quit is working");
        db.end();
        managerPrompt();
      }
      // console.log(answers);
    });
};

// function for user to view all Employees within company
viewEmployees = () => {
  console.log("All Employees within company...");
  const sql = `SELECT employee.id,
  employee.first_name, 
  employee.last_name, 
  role.title AS role, 
  department.name 
  AS department, 
  role.salary,
    IF(ISNULL(employee.manager_id)=1, 'null', CONCAT(manager.first_name, ' ', manager.last_name)) AS manager
    FROM employee
    LEFT JOIN role on employee.role_id = role.id
    LEFT JOIN department on role.department_id = department.id
    LEFT JOIN employee manager on manager.id = employee.manager_id`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    managerPrompt();
  });
};

// function for user to view all Roles within company
viewRoles = () => {
  console.log('All Roles within company...');
  const sql = `SELECT role.id,
   role.title as role,
   role.salary,
   department.name AS department 
   FROM role
   LEFT JOIN department ON role.department_id = department.id`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    managerPrompt();
  });
};

// function for user to view all departments within company
viewDepartments = () => {
  console.log('All Departments within company...');
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    managerPrompt();
  });
};

// function for user to add department to company
addDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'newDept',
        message: 'What will the new Department be called? (Reuired)',
        validate: (deptInput) => {
          if (deptInput) {
            return true;
          } else {
            console.log('Please enter the name of the Department');
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (name) VALUES (?)`;
      db.query(sql, answer.newDept, (err, res) => {
        if (err) throw err;
        console.log(answer.name + ' Has been added to Departments');
        viewDepartments();
      });
    });
};

// functionality for user to add role to company
addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What is the title of this new Role? (Required)",
        validate: (roleInput) => {
          if (roleInput) {
            return true;
          } else {
            console.log("Please enter the name of the Role");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this role? (Required)",
        validate: (salaryInput) => {
          if (isNaN(salaryInput)) {
            console.log('Please enter an amount for the salary');
            return false;
          } else {
            return true;
          }
        },
      },
    ])
    .then((answer) => {
      const roleInput = [answer.role, answer.salary];

      const roleData = `SELECT name, id FROM department`;

      db.query(roleData, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer
          .prompt([
            {
              tpye: 'list',
              name: 'dept',
              message:
                "Which department will this role belong? (Enter Dept. ID #)",
              choices: dept,
            },
          ])
          .then((selectedDept) => {
            const dept = selectedDept.dept;
            roleInput.push(dept);

            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

            db.query(sql, roleInput, (err, res) => {
              if (err) throw err;
              console.log(answer.role + " role has been added to the team");

              viewRoles();
            });
          });
      });
    });
};

// funciotn to add an employee to company
addEmployee = () => {
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'first',
      message: 'What is the Employees first name? (Required)',
      validate: (nameInput) => {
        if (nameInput) {
          return true;
        } else {
          console.log('Please enter a first name');
          return false
        }
      } 
    },
    {
      type: 'input',
      name: 'last',
      message: 'What is the Employees last name? (Required)',
      validate: (lastInput) => {
        if (lastInput) {
          return true;
        } else {
          console.log('Please enter a last name');
          return false;
        }
      }
    }
  ])
  .then(answer => {
    const employeeInput = [answer.first, answer.last]

    const roleData = `SELECT role.id, role.title FROM role`;

    db.query(roleData, (err, data) => {
      if (err) throw err;

      const role = data.map(({ id, title }) => ({ name: title, vlaue: id }));

      inquirer.prompt([
        {
          tpye: 'list',
          name: 'role',
          message: 'What will the Employees role be?',
          choices: role,
        }
      ])
      .then((selectedRole) => {
        const role = selectedRole.role;
        employeeInput.push(role);

        const managerData = `SELECT * FROM employee`;
        
        db.query(managerData, (err, data) => {
          if (err) throw err;

          const manager = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

          inquirer.prompt([
            {
              type: 'list',
              name: 'manager',
              message: 'Who will be this employees manager?',
              choices: manager
            }
          ])
          .then(selectecManager => {
            const manager = selectecManager.manager;
            employeeInput.push(manager);

            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

            db.query(sql, employeeInput, (err, res) => {
              if (err) throw err;
              console.log("Employee added to company");

              viewEmployees();
            });
          })
        })
      })
    })
  })
}