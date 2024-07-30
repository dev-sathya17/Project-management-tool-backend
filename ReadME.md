# Pro-Manager Backend

Welcome to the Pro-Manager Backend repository! This project provides a robust backend to support the Pro-Manager frontend application, handling various functionalities such as user management, task management, project management, and more.

## Features

- **Email Notifications:** Used `node-cron` to send email notifications every hour for deadline reminders.
- **Password Hashing:** Secure password storage using `bcrypt`.
- **Email Sending:** Utilized `nodemailer` for sending emails.
- **Authentication and Authorization:** Implemented middlewares to handle user authentication and authorization.
- **File Uploads:** Managed file uploads using `multer`.

## Dependencies

The project uses the following dependencies:

- `node-cron`: Scheduled task runner.
- `multer`: Middleware for handling `multipart/form-data`.
- `bcrypt`: Library for hashing passwords.
- `dotenv`: Module for loading environment variables.
- `express`: Web framework for Node.js.
- `cookie-parser`: Middleware for parsing cookies.
- `cors`: Middleware for enabling Cross-Origin Resource Sharing.
- `mongoose`: MongoDB object modeling tool.
- `morgan`: HTTP request logger middleware.
- `nodemailer`: Module for sending emails.
- `jsonwebtoken`: Library for generating and verifying JSON Web Tokens.

## Folder Structure

src/
│
├── controllers/ # Controllers for handling requests
├── helpers/ # Helper functions and utilities
├── jobs/ # Scheduled jobs using node-cron
├── middlewares/ # Middleware functions for authentication and authorization
├── models/ # Mongoose models for database entities
├── routes/ # Route definitions
├── utils/ # Utility functions and configurations
├── app.js # Main application file
└── ...

## Entities

- **Users:** Manage user data and authentication.
- **Tasks:** Handle task-related operations.
- **Projects:** Manage project-related operations.
- **Subtasks:** Handle subtask-related operations.

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm
- MongoDB

### Installation

1. Pull the repository to your local machine.

```
git pull
```

2. To install all the dependencies:

```
npm install
```

3. Once everything is installed successfully, now it's time to run the server.

```
npm run dev
```

### Configuration

```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```
