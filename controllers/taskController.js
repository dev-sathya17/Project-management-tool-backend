// Importing the Task, Project and User schema
const Task = require("../models/task");
const Project = require("../models/project");
const User = require("../models/user");

// Creating a controller object
const taskController = {
  //API to create a task
  createTask: async (req, res) => {
    try {
      // Destructuring the request body
      const { title, description, deadline, priority, assignedTo } = req.body;

      //Getting project id from request params
      const projectId = req.params.projectId;

      // Fetching the project to which the task will be added
      const project = await Project.findById(projectId);

      // Check if the project id is existing
      if (!project) {
        return res.status(404).json({ message: "Project id is invalid" });
      }

      // Getting the user instance to which the task will be assigned to
      const assignedUser = await User.findById(assignedTo);

      // Check if the user id is existing
      if (!assignedUser) {
        return res.status(404).json({ message: "User id is invalid" });
      }

      // Creating a new task in the database
      const newTask = new Task({
        title,
        description,
        deadline: new Date(deadline),
        priority,
        assignedTo: assignedUser._id,
        attachments: req.files ? req.files.map((file) => file.path) : [],
      });

      await newTask.save();

      // Add the new task to the project
      project.tasks.push(newTask._id);
      await project.save();

      // Sending a success response with the created task
      res.status(201).json({ message: "Task created successfully", newTask });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to get all tasks by project id
  getAllTasksByProjectId: async (req, res) => {
    try {
      // Getting project id from request params
      const projectId = req.params.projectId;
      // Fetching the project to which the tasks will be fetched
      const project = await Project.findById(projectId).populate("tasks");
      // Check if the project id is existing
      if (!project) {
        return res.status(404).json({ message: "Project id is invalid" });
      }
      // Sending a success response with the fetched tasks
      res.json(project.tasks);
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to get all tasks by the user it is assigned to
  getAllTasksByUserId: async (req, res) => {
    try {
      // Getting user id from request params
      const userId = req.params.userId;
      // Fetching the user to which the tasks will be fetched
      const user = await User.findById(userId);
      // Check if the user id is existing
      if (!user) {
        return res.status(404).json({ message: "User id is invalid" });
      }
      // Fetching all tasks assigned to the user
      const tasks = await Task.find({ assignedTo: user._id });
      // Sending a success response with the fetched tasks
      res.json(tasks);
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },
};

// Exporting the controller object
module.exports = taskController;
