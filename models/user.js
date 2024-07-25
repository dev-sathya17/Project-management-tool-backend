// Importing the mongoose library
const mongoose = require("mongoose");

// Defining a schema for the users collection
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["employee", "admin", "teamLeader"],
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  authString: {
    type: String,
    default: "",
  },
  salaryPerMonth: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "avatar.png",
  },
});

// Exporting the User model for use in other parts of the application
module.exports = mongoose.model("User", userSchema, "users");
