// Importing bcrypt library for encrypting passwords
const bcrypt = require("bcrypt");

// Importing the jwt library
const jwt = require("jsonwebtoken");

// Importing the User model
const User = require("../models/user");

// Importing the Task model
const Task = require("../models/task");

// Importing the Project model
const Project = require("../models/project");

// Importing the EMAIL_ID from the configuration file
const { SECRET_KEY } = require("../utils/config");

// Importing the user helper function to generate an auth string
const { generateRandomString } = require("../helpers/userHelper");
const sendEmail = require("../helpers/emailHelper");

const userController = {
  // API for registering users
  register: async (req, res) => {
    try {
      // Destructuring the request body
      const {
        firstName,
        lastName,
        email,
        password,
        salaryPerMonth,
        mobile,
        role,
      } = req.body;

      // Checking if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.json({ message: "User with this email already exists" });
      }

      // Encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creating a new user
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        salaryPerMonth,
        mobile,
        role,
        image: req.file ? req.file.path : "avatar.png",
      });

      // Saving the user to the database
      await user.save();

      const subject = "Activate your account";
      const text = `Click here to activate your account: http://localhost:3000/users/activate/${user._id}`;

      // Sending an email notification
      sendEmail(email, subject, text);

      // Sending a success response
      res.status(201).json({
        message:
          "Your account has been created successfully. Check your email to activate your account.",
        user,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to Activate user profile
  activateUser: async (req, res) => {
    try {
      // Fetching the id from url params
      const { id } = req.params;

      // Checking if the id is valid
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Updating the user status to active
      user.isActive = true;
      await user.save();

      // Sending a success response
      res.status(200).send({ message: "User activated successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).send({ message: error.message });
    }
  },

  // API for user login
  login: async (req, res) => {
    try {
      // getting the user email and password from the request body
      const { email, password } = req.body;

      // checking if the user exists in the database
      const user = await User.findOne({ email });

      // if the user does not exist, return an error response
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // if the user is not active, return an error response
      if (!user.isActive) {
        return res.status(403).send({ message: "User account is not active" });
      }

      // if the user exists check the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // if the password is invalid, return an error response
      if (!isPasswordValid) {
        return res.status(400).send({ message: "Invalid password" });
      }

      // generating a JWT token
      const token = jwt.sign({ id: user._id }, SECRET_KEY);

      // setting the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
      });

      // Setting user role as cookie
      res.cookie("role", user.role, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
      });

      // sending a success response
      res.status(200).json({
        message: "Login successful",
        user,
      });
    } catch (error) {
      // sending an error response
      res.status(500).send({ message: error.message });
    }
  },

  // API for user logout
  logout: async (req, res) => {
    try {
      // clearing the cookie
      res.clearCookie("token");
      res.clearCookie("role");

      // sending a success response
      res.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).send({ message: error.message });
    }
  },

  // API for sending email for the user when user wants to reset password
  forgotPassword: async (req, res) => {
    try {
      // Extracting values from request body
      const { email } = req.body;

      // Checking if this email is of a valid user
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this email does not exist" });
      }
      // Generating auth string
      const authString = generateRandomString();

      // Update user
      user.authString = authString;
      await user.save();

      const subject = "Reset Password";
      const message = `Click here to reset your password: http://localhost:3000/verify/${authString}`;

      // Sending an email
      sendEmail(email, subject, message);

      // Sending a success response
      res.status(200).json({
        message: "Password reset link has been sent to your email address",
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API for verifying the user auth string
  authVerify: async (req, res) => {
    try {
      // Extracting values from request params
      const { authString } = req.params;

      // Checking if this auth string is of a valid user
      const user = await User.findOne({ authString });
      if (!user) {
        return res.status(404).json({ message: "Auth string does not match!" });
      }

      // Sending a success response
      res.status(200).json({
        message: "Auth String verified successfully",
        email: user.email,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API for resetting password
  resetPassword: async (req, res) => {
    try {
      // Extracting values from request body
      const { email, password } = req.body;

      // Checking if this email is of a valid user
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this email does not exist" });
      }

      // Encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user
      user.password = hashedPassword;
      user.authString = "";
      await user.save();

      // Sending a success response
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to get user profile information
  getProfile: async (req, res) => {
    try {
      // Getting user id from request parameters
      const id = req.userId;

      // Fetching the user from the database
      const user = await User.findById(
        id,
        "-password -isActive -authString -__v"
      );

      // If user not found, return error response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If user found, return the user data
      res.json(user);
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to update user profile information
  updateProfile: async (req, res) => {
    try {
      // Getting user id from request parameters
      const id = req.userId;
      const { firstName, lastName, salaryPerMonth, email, mobile } = req.body;

      const user = await User.findById(id);

      // If user not found, return error response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Updating user profile information
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.salaryPerMonth = salaryPerMonth || user.salaryPerMonth;
      user.email = email || user.email;
      user.mobile = mobile || user.mobile;
      user.image = req.file ? req.file.path : user.image;

      // Saving info to the database
      const updatedUser = await user.save();

      // If user found, return the updated user data
      res.json({ message: "User profile updated successfully", updatedUser });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to delete user
  deleteUser: async (req, res) => {
    try {
      // Getting user id from request parameters
      const id = req.userId;

      // Finding and deleting the user from the database using the id in the request parameters.
      const user = await User.findByIdAndDelete(id);

      // If user not found, return error response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Removing the user cookie
      res.clearCookie("token");

      // returning success response, if user is deleted
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch task details for the user
  getUserTasks: async (req, res) => {
    try {
      // Getting user id from request parameters
      const id = req.userId;
      // Fetching user tasks from the database using the user id
      const tasks = await Task.find({ assignedTo: id });

      // Fetching completed tasks
      const completedTasks = tasks.filter(
        (task) => task.status === "completed"
      );

      // Fetching pending tasks
      const pendingTasks = tasks.filter((task) => task.status !== "completed");

      // Fetching any task that needs to be completed today
      const todayTasks = tasks.filter(
        (task) =>
          task.deadline.toISOString().slice(0, 10) ===
            new Date().toISOString().slice(0, 10) && task.status !== "completed"
      );

      // Returning the fetched tasks
      res.json({
        pending: pendingTasks.length,
        completed: completedTasks.length,
        today: todayTasks.length,
        total: tasks.length,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch all projects of the team leader
  getTeamLeaderProjects: async (req, res) => {
    try {
      // Getting team leader id from request params
      const id = req.userId;
      // Fetching the team leader's projects
      const projects = await Project.find({ owner: id })
        .populate("members")
        .populate("tasks");
      // Sending a success response with the team leader's projects
      res.json({ message: "Projects fetched successfully", projects });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch task count by status
  getTaskStatusCount: async (req, res) => {
    try {
      // Fetching all tasks from the database
      const tasks = await Task.find({ assignedTo: req.params.id });

      // Initializing task counts
      const statusCounts = {
        idle: 0,
        "in-progress": 0,
        completed: 0,
        backlog: 0,
      };
      // Iterating through tasks and updating status counts
      tasks.forEach((task) => {
        statusCounts[task.status]++;
      });
      // Sending a success response with task counts by status
      res.json({ message: "Task counts fetched successfully", statusCounts });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch total task count pending for today
  getTotalTasksPendingToday: async (req, res) => {
    try {
      // Fetching all tasks from the database
      const tasks = await Task.find({ assignedTo: req.params.id });

      // Initializing task count
      let totalTasksPendingToday = 0;

      // Iterating through tasks and updating total tasks pending for today
      tasks.forEach((task) => {
        if (
          task.deadline.toISOString().slice(0, 10) ===
            new Date().toISOString().slice(0, 10) &&
          task.status !== "completed"
        ) {
          totalTasksPendingToday++;
        }
      });

      // Sending a success response with total tasks pending for today
      res.json({
        message: "Total tasks pending for today fetched successfully",
        totalTasksPendingToday,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to calculate user performance percentage
  getUserPerformancePercentage: async (req, res) => {
    try {
      // Getting user id from request parameters
      const id = req.userId;
      // Fetching user's tasks from the database using the user id
      const tasks = await Task.find({ assignedTo: id });
      // Initializing variables for calculating performance metrics
      let totalTasks = tasks.length;

      let completedTasks = tasks.filter(
        (task) => task.status === "completed"
      ).length;

      // Calculating performance percentage
      const performancePercentage = (completedTasks / totalTasks) * 100 || 0;
      // Sending a success response with user performance percentage
      res.json({
        message: "User performance percentage fetched successfully",
        performancePercentage,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch user productivity
  getUserProductivity: async (req, res) => {
    try {
      // Getting user id from request parameters

      const id = req.userId;

      // Fetching user's tasks from the database using the user id
      const tasks = await Task.find({ assignedTo: id });

      // Fetching count of tasks completed by date
      const completedTasksByDate = {};
      tasks.forEach((task) => {
        const deadlineDate = task.completedOn.toISOString().slice(0, 10);
        if (completedTasksByDate[deadlineDate]) {
          completedTasksByDate[deadlineDate]++;
        } else {
          completedTasksByDate[deadlineDate] = 1;
        }
      });

      res.json({
        message: "User productivity metrics fetched successfully",
        completedTasksByDate,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to check authentication
  checkAuthentication: async (req, res) => {
    try {
      const token = req.cookies.token;
      const role = req.cookies.role;

      // If token does not exist
      if (!token) {
        return res.status(401).json({ message: "Access Denied" });
      }

      // Verifying the token using JWT
      try {
        const verified = jwt.verify(token, SECRET_KEY);
        res.status(200).json({ message: "Authentication successful", role });
      } catch (error) {
        // Sending an error response
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // Admin Functionalities

  // API to fetch all users from the database
  getAllUsers: async (req, res) => {
    try {
      // Fetching all users from the database
      const users = await User.find();

      // Returning the fetched users
      res.json(users);
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch total number of Team Leaders and employees
  getUserTypeCount: async (req, res) => {
    try {
      // Fetching all users from the database
      const users = await User.find();

      // Initializing counters for Team Leaders and employees
      let teamLeaders = 0;
      let employees = 0;

      // Iterating through users and updating counters
      users.forEach((user) => {
        if (user.role === "teamLeader") {
          teamLeaders++;
        } else if (user.role === "employee") {
          employees++;
        }
      });

      // Sending a success response with total number of Team Leaders and employees
      res.json({
        message: "User type count fetched successfully",
        teamLeaders,
        employees,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
