INSERT INTO department (name) 
VALUES
('HR'),
('Financing');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales', 80000, 2),
('Human Resources', 80000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("John", "Smith", 2, 1),
("Diego", "Rivera", 1, 1),
("Veronica", "Rivera", 1, 1);