DROP DATABASE IF EXISTS cms_DB;
CREATE DATABASE cms_DB;

USE cms_DB;

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL, 
    manager_id INT, 
    PRIMARY KEY(id), 
    FOREIGN KEY(role_id) REFERENCES roles(id), 
    FOREIGN KEY(manager_id) REFERENCES employees(id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30), 
    salary DECIMAL(10,2), 
    department_id INT NOT NULL, 
    PRIMARY KEY(id), 
    FOREIGN KEY(department_id) REFERENCES departments(id)
); 

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT, 
    dept_name VARCHAR(30), 
    PRIMARY KEY(id)
)