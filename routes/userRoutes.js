// Importing the express library
const express = require("express");

// Importing the user Controller
const userController = require("../controllers/userController");

// Importing middleware
const auth = require("../middlewares/auth");
const files = require("../middlewares/multer");

// Creating a router
const userRouter = express.Router();

// Route to verify authentication

userRouter.get("/checkAuth", userController.checkAuthentication);

// Route to register a user
userRouter.post("/", files.single("image"), userController.register);

// Route for user login
userRouter.post("/login", auth.isActivated, userController.login);

// Route for user logout
userRouter.get(
  "/logout",
  auth.authenticate,
  auth.isActivated,
  userController.logout
);

// Route to activate user account
userRouter.get("/activate/:id", userController.activateUser);

// Route for forgot password
userRouter.post("/forgot", auth.isActivated, userController.forgotPassword);

// Route for verifying auth string
userRouter.get("/verify/:authString", userController.authVerify);

// Route for resetting the password
userRouter.post("/reset", auth.isActivated, userController.resetPassword);

// Route for getting user profile
userRouter.get(
  "/",
  auth.authenticate,
  auth.isActivated,
  userController.getProfile
);

// Route for updating user profile
userRouter.put(
  "/",
  auth.authenticate,
  auth.isActivated,
  files.single("image"),
  userController.updateProfile
);

// Route for deleting user
userRouter.delete(
  "/",
  auth.authenticate,
  auth.isActivated,
  userController.deleteUser
);

// Route to fetch user task details
userRouter.get(
  "/tasks",
  auth.authenticate,
  auth.isActivated,
  userController.getUserTasks
);

// Route to fetch team leader's projects
userRouter.get(
  "/projects",
  auth.authenticate,
  auth.authorize,
  auth.isActivated,
  userController.getTeamLeaderProjects
);

// Route to fetch user's task progress
userRouter.get(
  "/:id/tasks/status",
  auth.authenticate,
  auth.isActivated,
  userController.getTaskStatusCount
);

// Route to fetch user's tasks pending for the day
userRouter.get(
  "/:id/tasks/pending",
  auth.authenticate,
  auth.isActivated,
  userController.getTotalTasksPendingToday
);

// Route to fetch user's performance percentage
userRouter.get(
  "/:id/performance",
  auth.authenticate,
  auth.isActivated,
  userController.getUserPerformancePercentage
);

// Route to fetch user's productivity
userRouter.get(
  "/:id/productivity",
  auth.authenticate,
  auth.isActivated,
  userController.getUserProductivity
);

// Admin Routes

// Fetching all users
userRouter.get(
  "/admin",
  auth.authenticate,
  auth.isAdmin,
  userController.getAllUsers
);

// Fetching user types with their counts
userRouter.get(
  "/admin/user-types",
  auth.authenticate,
  auth.isAdmin,
  userController.getUserTypeCount
);

// Fetching overall productivity across all users and projects
userRouter.get(
  "/admin/overall-productivity",
  auth.authenticate,
  auth.isAdmin,
  userController.getOverallProductivity
);

// Exporting the router
module.exports = userRouter;
