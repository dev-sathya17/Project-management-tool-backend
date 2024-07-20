// Importing the express library
const express = require("express");

// Importing the user router
const userRouter = require("./routes/userRoutes");

// Importing the project router
const projectRouter = require("./routes/projectRoutes");

// Importing the task router
const taskRouter = require("./routes/taskRoutes");

// Importing the morgan library to log requests
const morgan = require("morgan");

// Importing the cookie parser library
const cookieParser = require("cookie-parser");

// Creating an express application
const app = express();

// parse the cookies of the request
app.use(cookieParser());

// Adding middleware to parse the request body
app.use(express.json());

// to log requests
app.use(morgan("dev"));

// Creating routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/projects", taskRouter);

// Export the express app
module.exports = app;
