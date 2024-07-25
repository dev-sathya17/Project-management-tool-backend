// Importing mongoose library
const mongoose = require("mongoose");

// Defining the schema
const projectSchema = new mongoose.Schema({
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
    enum: ["active", "inactive", "completed"],
    default: "active",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  duration: {
    type: Number,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  attachments: [
    {
      type: String,
      default: "",
    },
  ],
});

// Exporting the Project model for use in other parts of the application
module.exports = mongoose.model("Project", projectSchema, "projects");
