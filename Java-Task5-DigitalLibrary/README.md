# Digital Library Management System

A web-based Digital Library Management System developed using React, Spring Boot, and MySQL. The system provides a centralized platform for managing books, students/members, issuing and returning books, and viewing library information.

## Features

### Admin / Library Management
- Secure login
- Dashboard
- Add new books
- Edit existing books
- Delete books
- View available books
- Manage student/member records
- Issue books
- Return books
- View library reports
- Search and manage library records

### User Interaction
- User registration and login
- View available books
- Search library records
- Issue and return book operations
- View relevant library information

## Technologies Used

### Frontend
- React.js
- HTML
- CSS
- JavaScript

### Backend
- Java
- Spring Boot
- REST API

### Database
- MySQL

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Maven
- Node.js

## System Architecture

The application follows a three-layer architecture:

React Frontend  
↓  
REST API  
↓  
Spring Boot Backend  
↓  
MySQL Database

The React frontend communicates with the Spring Boot backend through REST APIs. The backend processes requests and stores or retrieves data from the MySQL database.

## Main Modules

1. Login
2. Dashboard
3. Book Management
4. Student/Member Management
5. Issue Book
6. Return Book
7. Reports

## Project Structure

```text
Java-Task5-DigitalLibrary/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
├── backend/
│   ├── src/
│   └── pom.xml
│
├── Screenshots/
│   ├── 01-login.png
│   ├── 02-Books.png
│   ├── 02-dashboard.png
│   ├── 03-issue book.png
│   └── 04-return book.png
│
└── README.md