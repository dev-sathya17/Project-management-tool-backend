// Importing the express library
const express = require("express");

// Importing the project Controller
const projectController = require("../controllers/projectController");

// Importing middleware
const auth = require("../middlewares/auth");
const files = require("../middlewares/multer");

// Creating a router
const projectRouter = express.Router();

// Route to create a new project
projectRouter.post(
  "/",
  auth.authenticate,
  auth.authorize,
  projectController.createProject
);

// Route to get all projects
projectRouter.get(
  "/",
  auth.authenticate,
  auth.authorize,
  projectController.getAllProjects
);

// Route to get a specific project
projectRouter.get("/team", auth.authenticate, projectController.getTeam);

// Route to get a specific project
projectRouter.get(
  "/:id",
  auth.authenticate,
  auth.authorize,
  projectController.getProjectById
);

// Route to update a project
projectRouter.put(
  "/:id",
  auth.authenticate,
  auth.authorize,
  projectController.updateProject
);

// Route to delete a project
projectRouter.delete(
  "/:id",
  auth.authenticate,
  auth.authorize,
  projectController.deleteProject
);

// Route to remove members from a project
projectRouter.delete(
  "/:id/members/:memberId",
  auth.authenticate,
  auth.authorize,
  projectController.removeMembers
);

// Route to fetch completion percentage of a project
projectRouter.get(
  "/:id/completion",
  auth.authenticate,
  auth.authorize,
  projectController.getCompletionPercentage
);

// Route to get a specific project's risk assessment
projectRouter.get(
  "/:id/risks",
  auth.authenticate,
  auth.authorize,
  projectController.getProjectRiskLevels
);

// Route to get a project's task statuses
projectRouter.get(
  "/:id/task-status",
  auth.authenticate,
  auth.authorize,
  projectController.getProjectTaskStatus
);

// Route to get today's pending project task count
projectRouter.get(
  "/:id/pending",
  auth.authenticate,
  auth.authorize,
  projectController.getTotalTasksPendingForToday
);

// Route to fetch pending project duration
projectRouter.get(
  "/:id/pending-duration",
  auth.authenticate,
  projectController.getPendingProjectDuration
);

// Route to fetch the project productivity data
projectRouter.get(
  "/:id/productivity",
  auth.authenticate,
  projectController.getProjectProductivity
);

// Admin routes

//Route to get the total sum invested across all projects
projectRouter.get(
  "/admin/totalSum",
  auth.authenticate,
  auth.isAdmin,
  projectController.getTotalSumInvested
);

// Route to get project status count
projectRouter.get(
  "/admin/statusCount",
  auth.authenticate,
  auth.isAdmin,
  projectController.getProjectStatusCount
);

// Route to get project with highest risk level
projectRouter.get(
  "/admin/highestRisk",
  auth.authenticate,
  auth.isAdmin,
  projectController.getProjectWithHighestRiskLevels
);

// Route to get all projects
projectRouter.get(
  "/admin/all",
  auth.authenticate,
  auth.isAdmin,
  projectController.getAllProjects
);

// Exporting the router
module.exports = projectRouter;
