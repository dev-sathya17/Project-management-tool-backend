// Importing the Task schema
const Task = require("../models/task");

// Importing the SubTask schema
const SubTask = require("../models/subTask");

// Creating a controller object
const subTaskController = {
  // API to create a new sub-task
  createSubTask: async (req, res) => {
    try {
      // Getting the task id from the request parameters
      const taskId = req.params.taskId;

      // Fetching the task from the database
      const task = await Task.findById(taskId);

      // If the task is not found, return a 404 status and an error message
      if (!task) {
        return res.status(404).send({ message: "Task not found" });
      }

      // Destructuring the request body
      const { title, description } = req.body;

      // Creating a new sub-task object from the request body
      const subTask = new SubTask({
        title,
        description,
      });

      // Saving the sub-task to the database
      await subTask.save();

      // Adding the new sub-task to the task's subTasks array
      task.subTasks.push(subTask._id);
      await task.save();

      // Returning a success response with the created sub-task
      res.status(201).json({ message: "sub task added successfully", task });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to update a SubTask
  updateSubTask: async (req, res) => {
    try {
      // Getting the sub-task id from the request parameters
      const subTaskId = req.params.subTaskId;

      // Fetching the sub task from the database
      const subTask = await SubTask.findById(subTaskId);

      // If the sub-task is not found, return a 404 status and an error message
      if (!subTask) {
        return res.status(404).send({ message: "Sub-task not found" });
      }

      // Destructuring the request body
      const { title, description, status } = req.body;

      // Updating the sub-task in the database
      subTask.title = title || subTask.title;
      subTask.description = description || subTask.description;
      subTask.status = status || subTask.status;

      // Saving the updated sub-task to the database
      await subTask.save();

      // Returning a success response with the updated sub-task
      res.json({ message: "Sub-task updated successfully", subTask });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to delete a SubTask
  deleteSubTask: async (req, res) => {
    try {
      // Getting the sub-task id from the request parameters
      const subTaskId = req.params.subTaskId;

      // Fetching the sub-task from the database
      const subTask = await SubTask.findById(subTaskId);

      // If the sub-task is not found, return a 404 status and an error message
      if (!subTask) {
        return res.status(404).send({ message: "Sub-task not found" });
      }

      // Deleting the sub-task from the database
      await subTask.deleteOne({ _id: subTaskId });

      // Removing the sub-task from the task's subTasks array
      const task = await Task.findByIdAndUpdate(
        req.params.taskId,
        { $pull: { subTasks: subTaskId } },
        { new: true }
      );

      // Saving the updated task to the database
      await task.save();

      // Returning a success response with a message
      res.json({ message: "Sub-task deleted successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },
};

// Exporting the controller object
module.exports = subTaskController;
