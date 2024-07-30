// Importing the express library
const express = require("express");

// Importing the user router
const userRouter = require("./routes/userRoutes");

// Importing the project router
const projectRouter = require("./routes/projectRoutes");

// Importing the task router
const taskRouter = require("./routes/taskRoutes");

// Importing the sub tasks router
const subTaskRouter = require("./routes/subTaskRoutes");

// Importing the morgan library to log requests
const morgan = require("morgan");

// Importing the cors library
const cors = require("cors");

// Importing the cookie parser library
const cookieParser = require("cookie-parser");

// Custom error handler middleware
const errorHandler = require("./utils/Error");

// Adding the notification job
require("./jobs/NotificationJob");

// Creating an express application
const app = express();

// Adding the cors middleware to allow cross-origin requests
app.use(
  cors({
    origin: "https://pro-manager-tool.netlify.app/",
    credentials: true,
  })
);

// Serving static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

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
app.use("/api/v1/tasks", subTaskRouter);

// Handle 404 error
app.use(errorHandler);

// Export the express app
module.exports = app;
