// Importing the required schemas
const Task = require("../models/task");
const Project = require("../models/project");
const Notification = require("../models/notification");

// Defining a controller for notifications.
const notificationController = {
  // API to get notifications for an employee
  getEmployeeNotifications: async (req, res) => {
    try {
      // Getting user id from request parameters
      const userId = req.userId;

      // Fetching user notifications from the database using the user id
      const tasks = await Task.find({ assignedTo: userId }).populate(
        "notifications"
      );

      // Sending a success response
      res.status(200).json({ notifications: tasks.notifications });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to mark a notification as read
  markNotificationAsRead: async (req, res) => {
    try {
      // Getting notification id from request parameters
      const notificationId = req.params.notificationId;

      // Fetching the notification to be marked as read
      const notification = await Notification.findById(notificationId);

      // Checking if the notification exists
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      // Updating the notification status to read
      notification.isRead = true;

      // Saving the updated notification
      await notification.save();

      // Sending a success response
      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch notifications for a team leader
  getTeamLeaderNotifications: async (req, res) => {
    try {
      // Fetching the project to which the notifications will be fetched
      const projects = await Project.find({ owner: req.userId }).populate(
        "notifications"
      );

      // Sending a success response
      res.status(200).json({ notifications: projects.notifications });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to delete a notification
  deleteNotification: async (req, res) => {
    try {
      // Getting notification id from request parameters
      const notificationId = req.params.notificationId;

      // Fetching the notification to be deleted
      const notification = await Notification.findByIdAndDelete(notificationId);

      // Checking if the notification exists
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      // Sending a success response
      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },
};

// Exporting the controller
module.exports = notificationController;
