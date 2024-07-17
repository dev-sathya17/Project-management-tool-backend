// Importing the express library
const express = require("express");

// Importing the user Controller
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

// Creating a router
const userRouter = express.Router();

// Route to register a user
userRouter.post("/", userController.register);

// Route for user login
userRouter.post("/login", userController.login);

// Route for user logout
userRouter.get("/logout", auth.authenticate, userController.logout);

// Route to activate user account
userRouter.get("/activate/:id", userController.activateUser);

// Route for forgot password
userRouter.post("/forgot", userController.forgotPassword);

// Route for verifying auth string
userRouter.get("/verify/:authString", userController.authVerify);

// Route for resetting the password
userRouter.post("/reset", userController.resetPassword);

// Exporting the router
module.exports = userRouter;
