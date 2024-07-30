// Importing the mongoose library
const mongoose = require("mongoose");

// Defining the schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["idle", "in-progress", "completed", "backlog"],
    default: "idle",
  },
  deadline: {
    type: Date,
    required: true,
  },
  subTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubTask",
    },
  ],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
  },
  completedOn: {
    type: Date,
    default: null,
  },
});

// Exporting the Task model for use in other parts of the application
module.exports = mongoose.model("Task", taskSchema, "tasks");
