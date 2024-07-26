// Importing the express library
const express = require("express");

// Creating a router instance
const notificationRouter = express.Router();

// Importing middleware
const auth = require("../middlewares/auth");

// Importing the notification controller
const notificationController = require("../controllers/notificationController");

// Route for getting employee notifications
notificationRouter.get(
  "/employee",
  auth.authenticate,
  notificationController.getEmployeeNotifications
);

// Route for getting team leader notifications
notificationRouter.get(
  "/teamLeader",
  auth.authenticate,
  auth.authorize,
  notificationController.getTeamLeaderNotifications
);

// Route for marking a notification as read
notificationRouter.put(
  "/:notificationId/markRead",
  auth.authenticate,
  notificationController.markNotificationAsRead
);

// Route for deleting a notification
notificationRouter.delete(
  "/:notificationId",
  auth.authenticate,
  notificationController.deleteNotification
);

module.exports = notificationRouter;
