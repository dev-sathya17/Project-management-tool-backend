// Importing the mongoose library
const mongoose = require("mongoose");

// Defining the schema
const subTaskSchema = new mongoose.Schema({
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
    enum: ["idle", "in-progress", "completed"],
    default: "idle",
  },
});

// Exporting the SubTask model for use in other parts of the application
module.exports = mongoose.model("SubTask", subTaskSchema, "subTasks");
