const { calculateDurationInMonths } = require("../helpers/projectHelper");

const Project = require("../models/project");

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
};

// Exporting the controller
module.exports = projectController;
