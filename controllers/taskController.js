// Importing the Task, Project and User schema
const Task = require("../models/task");
const Project = require("../models/project");
const User = require("../models/user");

// Importing the fs library to delete files
const fs = require("fs");
const path = require("path");

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
      const project = await Project.findById(projectId)
        .populate("members")
        .populate({
          path: "tasks",
          populate: [
            {
              path: "subTasks",
              model: "SubTask",
            },
            {
              path: "assignedTo",
              model: "User",
            },
          ],
        });

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
      });

      assignedUser.task = newTask._id;

      await newTask.save();
      await assignedUser.save();

      // Add the new task to the project
      project.tasks.push(newTask._id);
      await project.save();

      // Sending a success response with the created task
      res
        .status(201)
        .json({ message: "Task created successfully", project, newTask });
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
      console.log("here");
      const userId = req.userId;
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

  // API to update a task
  updateTask: async (req, res) => {
    try {
      // Getting task id from request params
      const taskId = req.params.taskId;

      // Destructuring the request body
      const { title, description, deadline, priority, assignedTo, status } =
        req.body;

      // Fetching the task to be updated
      const task = await Task.findById(taskId);

      // Check if the task id is existing
      if (!task) {
        return res.status(404).json({ message: "Task id is invalid" });
      }

      const oldUser = User.find({ _id: task.assignedTo });

      // Updating the task properties
      task.title = title || task.title;
      task.description = description || task.description;
      task.deadline = deadline ? new Date(deadline) : task.deadline;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      task.assignedTo = assignedTo
        ? await User.findById(assignedTo)
        : task.assignedTo;

      if (assignedTo) {
        const newUser = User.find({ _id: assignedTo });
        newUser.task = task._id;
        await newUser.save();

        oldUser.task = null;
        await oldUser.save();
      }

      await task.save();

      // Sending a success response with the updated task
      res.json({ message: "Task updated successfully", task });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to delete a task
  deleteTask: async (req, res) => {
    try {
      // Getting task id from request params
      const taskId = req.params.taskId;

      // Fetching the task to be deleted
      const task = await Task.findById(taskId);

      // Check if the task id is existing
      if (!task) {
        return res.status(404).json({ message: "Task id is invalid" });
      }

      // Deleting the task from the database
      await task.deleteOne({ _id: taskId });

      // Removing the task from the project
      await Project.findByIdAndUpdate(
        req.params.projectId,
        { $pull: { tasks: taskId } },
        { new: true }
      );

      // Sending a success response
      res.json({ message: "Task deleted successfully" });

      // Sending a success response
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to get the task completion percentage
  getTaskCompletionPercentage: async (req, res) => {
    try {
      // Getting task id from request params
      const id = req.params.taskId;

      // Fetching the task to calculate completion percentage
      const task = await Task.findById(id).populate("subTasks");

      // Check if the task id is existing
      if (!task) {
        return res.status(404).json({ message: "Task id is invalid" });
      }

      // Calculating completion percentage
      const completedTasks = task.subTasks.filter((task) => {
        return task.status === "completed";
      }).length;
      const totalTasks = task.subTasks.length;
      const completionPercentage = (completedTasks / totalTasks) * 100 || 0;

      // Sending a success response with the completion percentage
      res.json({
        message: "Completion percentage calculated successfully",
        completionPercentage,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to mark a task's status
  updateStatus: async (req, res) => {
    try {
      // Getting task id from request parameters
      const taskId = req.params.taskId;

      const { status } = req.body;

      // Finding and updating the task status to completed in the database using the task id in the request parameters.
      const task = await Task.findById(taskId);
      // If task not found, return error response
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // If task found, update task data
      task.status = status || task.status;

      // If status is completed, update completedOn with current date and time.
      if (status === "completed") {
        task.completedOn = new Date().toISOString().split("T")[0];
      }

      await task.save();

      res.status(200).json({
        message: "Task marked as completed successfully",
        task,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // Admin Functionalities

  // API to fetch task progress by status
  getOverallTaskProgress: async (req, res) => {
    try {
      // Fetching all tasks
      const tasks = await Task.find({});

      // Initializing counters for each status
      let completedTasks = 0;
      let inProgressTasks = 0;
      let pendingTasks = 0;
      let overdueTasks = 0;

      // Iterating through each task to update the counters
      tasks.forEach((task) => {
        switch (task.status) {
          case "completed":
            completedTasks++;
            break;
          case "in-progress":
            inProgressTasks++;
            break;
          case "idle":
            pendingTasks++;
            break;
          case "backlog":
            overdueTasks++;
            break;
        }
      });

      // Sending a success response with the progress data
      res.json({
        message: "Task progress data fetched successfully",
        progressData: {
          completedTasks,
          inProgressTasks,
          pendingTasks,
          overdueTasks,
        },
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },
};

// Exporting the controller object
module.exports = taskController;
