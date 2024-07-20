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
  files.array("attachments"),
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
  files.array("attachments"),
  projectController.updateProject
);

// Route to delete a project
projectRouter.delete(
  "/:id",
  auth.authenticate,
  auth.authorize,
  projectController.deleteProject
);

// Route to remove attachments from a project
projectRouter.delete(
  "/:id/attachments/:filename",
  auth.authenticate,
  auth.authorize,
  projectController.removeAttachments
);

// Route to remove members from a project
projectRouter.delete(
  "/:id/members/:memberId",
  auth.authenticate,
  auth.authorize,
  projectController.removeMembers
);

// Exporting the router
module.exports = projectRouter;
