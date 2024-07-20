// Importing the express library
const express = require("express");

// Creating a router
const subTaskRouter = express.Router();

// Importing the middleware
const auth = require("../middlewares/auth");

// Importing the controller
const subTaskController = require("../controllers/subTaskController");

// Route to create a subtask
subTaskRouter.post(
  "/:taskId/subTasks",
  auth.authenticate,
  auth.authorize,
  subTaskController.createSubTask
);

// Route to update a subtask
subTaskRouter.put(
  "/subTasks/:subTaskId",
  auth.authenticate,
  auth.authorize,
  subTaskController.updateSubTask
);

// Route to delete a subtask
subTaskRouter.delete(
  "/:taskId/subTasks/:subTaskId",
  auth.authenticate,
  auth.authorize,
  subTaskController.deleteSubTask
);

// Exporting the router
module.exports = subTaskRouter;
