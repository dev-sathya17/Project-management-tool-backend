// Importing the express library
const express = require("express");

// Creating a router instance
const taskRouter = express.Router();

// Importing middleware
const auth = require("../middlewares/auth");
const taskController = require("../controllers/taskController");

// Importing multer middleware
const files = require("../middlewares/multer");

// Route for creating a new task
taskRouter.post(
  "/:projectId/tasks",
  auth.authenticate,
  auth.authorize,
  files.array("attachments"),
  taskController.createTask
);

// Exporting the router
module.exports = taskRouter;
