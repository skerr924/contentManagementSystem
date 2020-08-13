/* adding departments */

INSERT INTO departments (dept_name)
VALUES ("Management"), ("IT"), ("Marketing");

/* adding roles */

INSERT INTO roles (title, salary, department_id)
VALUES ("Owner", 220000, 1), ("CTO", 100000, 2), ("Software Intern", 80000, 2), ("Marketing Intern", 80000, 3);


/* adding employees */

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Sarah", "Kerr", 1, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Ivan", "Santos", 2, 1), ("Alejandra", "Narvaez", 3, 2), ("Susan", "Smith", 4, 3); 