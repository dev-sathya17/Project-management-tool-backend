const { calculateDurationInMonths } = require("../helpers/projectHelper");

const Project = require("../models/project");
const User = require("../models/user");

const fs = require("fs");
const path = require("path");

// Creating a controller object
const projectController = {
  // API to create a new project
  createProject: async (req, res) => {
    try {
      // destructuring the request body
      const { title, description, startDate, endDate, members, budget } =
        req.body;

      const duration = calculateDurationInMonths(
        new Date(startDate),
        new Date(endDate)
      );

      // Creating a project in
      const project = new Project({
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        members,
        budget,
        duration,
        attachments: req.files ? req.files.map((file) => file.path) : [],
      });

      // Saving the project to the database
      await project.save();

      // Sending a success response with the created project
      res.status(201).json({ message: "Project created successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message, error });
    }
  },

  // API to retrieve all projects
  getAllProjects: async (req, res) => {
    try {
      // Finding all projects in the database
      const projects = await Project.find({});
      // Sending a success response with the fetched projects
      res.json(projects);
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to retrieve a specific project by its ID
  getProjectById: async (req, res) => {
    try {
      // Finding the project by its ID in the database
      const project = await Project.findById(req.params.id);
      // Sending a success response with the fetched project
      res.json(project);
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to update a specific project by its ID
  updateProject: async (req, res) => {
    try {
      // Extracting the values from the request body
      const { title, description, startDate, endDate, members, budget } =
        req.body;
      const duration = calculateDurationInMonths(
        new Date(startDate),
        new Date(endDate)
      );

      // Fetching project to be updated
      const project = await Project.findById(req.params.id);

      project.title = title || project.title;
      project.description = description || project.description;
      project.startDate = startDate ? new Date(startDate) : project.startDate;
      project.endDate = endDate ? new Date(endDate) : project.endDate;
      project.budget = budget || project.budget;
      project.duration = duration || project.duration;

      if (members) {
        members.forEach((member) => {
          // Fetch user object using id value in member
          const user = User.findById(member);

          // Check if user exists
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          // If user does not exist in the project's members array, add them
          if (!project.members.includes(member)) {
            project.members.push(member);
          }
        });
      }

      if (req.files) {
        const updatedFiles = req.files.map((file) => file.path);
        project.attachments.push(...updatedFiles);
      }

      // Updating the project in the database
      const updatedProject = await project.save();

      // Sending a success response with the updated project
      res.json({ message: "Project updated successfully", updatedProject });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to delete a specific project by its ID
  deleteProject: async (req, res) => {
    try {
      // Finding the project by its ID in the database
      const project = await Project.findById(req.params.id);

      // If project has no files, then deleting directly
      if (project.attachments.length === 0) {
        await project.deleteOne({ _id: req.params.id });
        return res.json({ message: "Project deleted successfully" });
      }

      // Flag variable to delete project only after files are removed
      let isFilesDeleted = false;

      // Deleting associated attachments from the directory
      project.attachments.forEach((attachment) => {
        const [folder, filename] = attachment.split("\\");
        const filePath = path.join(folder, filename);
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
          isFilesDeleted = true;
        } catch (err) {
          console.error(`Error deleting file: ${filePath}`, err);
          isFilesDeleted = false;
        }
      });

      // Deleting the project from the database after file deletion
      console.log(isFilesDeleted);
      if (isFilesDeleted) {
        await project.deleteOne({ _id: req.params.id });
        // Sending a success response
        res.json({ message: "Project deleted successfully" });
      } else {
        res.status(500).json({
          message:
            "There was an error with deleting attachments of the project",
        });
      }
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },
};

// Exporting the controller
module.exports = projectController;
