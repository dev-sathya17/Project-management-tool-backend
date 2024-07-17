// Importing the express library
const express = require("express");

// Importing the user router
const userRouter = require("./routes/userRoutes");

// Importing the morgan library to log requests
const morgan = require("morgan");

// Creating an express application
const app = express();

// Adding middleware to parse the request body
app.use(express.json());

// to log requests
app.use(morgan("dev"));

// Creating routes
app.use("/users", userRouter);

// Export the express app
module.exports = app;
