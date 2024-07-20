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

// Route for getting all tasks for a project

taskRouter.get(
  "/:projectId/tasks",
  auth.authenticate,
  auth.authorize,
  taskController.getAllTasksByProjectId
);

// Route for getting all tasks by user it is assigned to

taskRouter.get(
  "/tasks/:userId",
  auth.authenticate,
  auth.authorize,
  taskController.getAllTasksByUserId
);

// Route for updating a task
taskRouter.put(
  "/tasks/:taskId",
  auth.authenticate,
  auth.authorize,
  files.array("attachments"),
  taskController.updateTask
);

// Exporting the router
module.exports = taskRouter;
