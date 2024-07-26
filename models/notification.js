// Importing the mongoose library
const mongoose = require("mongoose");

// Defining the schema
const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["low", "medium", "high", "very high"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

// Exporting the notification schema
module.exports = mongoose.model(
  "Notification",
  notificationSchema,
  "notifications"
);
