// Importing the express library
const express = require("express");

// Creating a router instance
const taskRouter = express.Router();

// Importing middleware
const auth = require("../middlewares/auth");
const taskController = require("../controllers/taskController");

// Route for creating a new task
taskRouter.post(
  "/:projectId/tasks",
  auth.authenticate,
  auth.authorize,
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
  "/tasks/user-tasks",
  auth.authenticate,
  taskController.getAllTasksByUserId
);

// Route for updating a task
taskRouter.put(
  "/tasks/:taskId",
  auth.authenticate,
  auth.authorize,
  taskController.updateTask
);

// Route for deleting a task
taskRouter.delete(
  "/:projectId/tasks/:taskId",
  auth.authenticate,
  auth.authorize,
  taskController.deleteTask
);

// Route to get the task completion percentage
taskRouter.get(
  "/tasks/:taskId/completion",
  auth.authenticate,
  auth.authorize,
  taskController.getTaskCompletionPercentage
);

// Route to change status of a task
taskRouter.put(
  "/tasks/:taskId/status",
  auth.authenticate,
  taskController.updateStatus
);

// Admin routes

// API to fetch overall task progress
taskRouter.get(
  "/tasks/admin/progress",
  auth.authenticate,
  auth.isAdmin,
  taskController.getOverallTaskProgress
);

// Exporting the router
module.exports = taskRouter;
