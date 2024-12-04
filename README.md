# School Management System

This repository contains a robust school management system web application. It uses MySQL for database management, Express.js for server-side logic, EJS for dynamic content rendering, and Passport.js for authentication. This application facilitates the organization of student details, results, classrooms, teachers, and subjects, enhancing administrative efficiency.

## Prerequisites

Ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MySQL
- MongoDB

## Installation

1. Clone the repository:

git clone https://github.com/Adityapatwari193/School-Management-System.git
cd School-Management-System


2. Install the required npm packages:
npm install


3. Set up the MySQL database:


CREATE DATABASE student;
USE student;

CREATE TABLE student (
    std_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    dob DATE,
    gender VARCHAR(10),
    address VARCHAR(255)
);

CREATE TABLE section (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    section_name VARCHAR(50)
);

CREATE TABLE standard (
    standard_id INT AUTO_INCREMENT PRIMARY KEY,
    standard_name VARCHAR(50)
);

CREATE TABLE sat (
    allot_id INT AUTO_INCREMENT PRIMARY KEY,
    std_id INT,
    section_id INT,
    standard_id INT,
    FOREIGN KEY (std_id) REFERENCES student(std_id),
    FOREIGN KEY (section_id) REFERENCES section(section_id),
    FOREIGN KEY (standard_id) REFERENCES standard(standard_id)
);

CREATE TABLE subject (
    sub_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(50),
    subject_code VARCHAR(10)
);

CREATE TABLE marks (
    mark_id INT AUTO_INCREMENT PRIMARY KEY,
    allot_id INT,
    sub_id INT,
    marks INT,
    FOREIGN KEY (allot_id) REFERENCES sat(allot_id),
    FOREIGN KEY (sub_id) REFERENCES subject(sub_id)
);


4. Set up the MongoDB database:


# Start the MongoDB server
mongod --dbpath /path/to/your/mongodb/data

# In a new terminal, start the MongoDB shell and create the database
mongo
use student


5. Configure the database connection:

Update the MySQL and MongoDB connection details in your `app.js` file if necessary.
const dburl='mongodb://127.0.0.1:27017/student';


## Running the Application

1. Start the server:
node app.js


2. Open your browser and navigate to:
http://localhost:3000


## Features

- User authentication using Passport.js
- Session management with express-session
- CRUD operations for student data
- Flash messages for user feedback

## Routes

- `/index` - View all students (requires login)
- `/student/:id` - View details of a specific student
- `/upload` - Form to add a new student
- `/marks/:id` - Form to add marks for a student
- `/result` - View the results for a student

## Middleware

- `isLoggedIn` - Middleware to check if the user is logged in

## Error Handling

If an error occurs, the server will log the error stack and return a 500 status code with a message "Something Broke".
For more details, visit the repository: [School Management System](https://github.com/Adityapatwari193/School-Management-System).
