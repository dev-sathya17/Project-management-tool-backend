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

// Exporting the router
module.exports = projectRouter;
