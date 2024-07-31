const {
  calculateDurationInMonths,
  calculateRiskLevel,
} = require("../helpers/projectHelper");

const Project = require("../models/project");
const User = require("../models/user");

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
        owner: req.userId,
      });

      // Saving the project to the database
      await project.save();

      members.forEach(async (member) => {
        // Finding the user by their ID in the database
        const user = await User.findById(member);

        // If user not found, return error response
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        user.assignedTo = project._id;

        await user.save();
      });

      // Sending a success response with the created project
      res.status(201).json({ message: "Project created successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message, error });
    }
  },

  // API to retrieve all projects
  getAllOwnerProjects: async (req, res) => {
    try {
      // Finding all projects in the database
      const projects = await Project.find({ owner: req.userId });
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
      const project = await Project.findById(req.params.id)
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
      const {
        title,
        description,
        startDate,
        endDate,
        members,
        budget,
        status,
      } = req.body;
      const duration = calculateDurationInMonths(
        new Date(startDate),
        new Date(endDate)
      );

      // Fetching project to be updated
      const project = await Project.findById(req.params.id);

      //checking if the project exists
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      project.title = title || project.title;
      project.description = description || project.description;
      project.startDate = startDate ? new Date(startDate) : project.startDate;
      project.endDate = endDate ? new Date(endDate) : project.endDate;
      project.budget = budget || project.budget;
      project.duration = duration || project.duration;
      project.status = status || project.status;

      // Updating the project in the database
      const updatedProject = await project.save();

      if (members) {
        members.forEach(async (member) => {
          try {
            // Fetch user object using id value in member
            const user = await User.findById(member);

            // Check if user exists
            if (!user) {
              return res.status(404).json({ error: "User not found" });
            }

            console.log(user);

            // add them to the project's members array
            project.members.push(member);

            user.assignedTo = project._id;

            // Save the user object with updated assignedTo value
            await user.save();
            await project.save();
          } catch (err) {
            return res
              .status(500)
              .json({ error: "An error occurred while updating the user" });
          }
        });
      }

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

      // Deleting the project from the database after file deletion
      await project.deleteOne({ _id: req.params.id });
      // Sending a success response
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to remove project members from the project
  removeMembers: async (req, res) => {
    try {
      // Getting project id from request params
      const id = req.params.id;
      // Getting the members to be removed from the request body
      const memberId = req.params.memberId;

      // Fetching the project to which the members will be removed
      const project = await Project.findById(id);

      // Check if the project id is existing
      if (!project) {
        return res.status(404).json({ message: "Project id is invalid" });
      }

      // Removing the specified members from the project
      project.members = project.members.filter(
        (member) => member.toString() !== memberId
      );

      // Saving the updated project to the database
      await project.save();

      try {
        const user = await User.findById(memberId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        user.assignedTo = null;
        await user.save();
      } catch (error) {
        console.error(`Error while removing user from project ${id}:`, error);
        res
          .status(500)
          .send(`Error while removing user from project ${id}:`, error);
      }

      // Sending a success response with the updated project
      res.json({ message: "Member removed successfully", project });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to find completion percentage of the project
  getCompletionPercentage: async (req, res) => {
    try {
      // Getting project id from request params
      const id = req.params.id;

      // Fetching the project to calculate completion percentage
      const project = await Project.findById(id).populate("tasks");

      // Check if the project id is existing
      if (!project) {
        return res.status(404).json({ message: "Project id is invalid" });
      }

      // Calculating completion percentage
      const completedTasks = project.tasks.filter((task) => {
        return task.status === "completed";
      }).length;
      const totalTasks = project.tasks.length;
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

  // API to calculate project's risk levels
  getProjectRiskLevels: async (req, res) => {
    try {
      // Getting project id from request params
      const id = req.params.id;

      // Fetching the project to calculate risk levels
      const project = await Project.findById(id)
        .populate("tasks")
        .populate("members");

      // Check if the project id is existing
      if (!project) {
        return res.status(404).json({ message: "Project id is invalid" });
      }

      const risk = [];

      // Calculating risk based on budget
      const pay = project.members.reduce((acc, member) => {
        acc += member.salaryPerMonth;
        return acc;
      }, 0);

      const cost = pay * project.duration;

      if (cost > project.budget) {
        const riskObj = {};
        riskObj.type = "budget";
        riskObj.difference = cost - project.budget;
        riskObj.percentage = (
          (riskObj.difference / project.budget) *
          100
        ).toFixed(2);
        if (riskObj.percentage < 30) {
          riskObj.impact = "low";
        } else if (riskObj.percentage >= 30 && riskObj.percentage < 60) {
          riskObj.impact = "medium";
        } else {
          riskObj.impact = "high";
        }
        riskObj.description = `Project is over the stipulated budget of ${project.budget}. Either increase budget by ${riskObj.difference} or layoff a member from the project`;
        risk.push(riskObj);
      } else {
        const riskObj = {};
        riskObj.type = "budget";
        riskObj.difference = 0;
        riskObj.percentage = 0;
        riskObj.impact = "none";
        riskObj.description = "Project is within budget";
        risk.push(riskObj);
      }

      // Calculating risk based on task completion percentage
      const completedTasks = project.tasks.filter((task) => {
        return task.status === "completed";
      }).length;
      const totalTasks = project.tasks.length;
      const taskCompletionPercentage = (completedTasks / totalTasks) * 100;

      // Calculating remaining duration for the project
      const date = new Date();
      const today = `${date.getFullYear()}-${
        parseInt(date.getMonth()) + 1
      }-${date.getDate()}`;

      const remainingDuration = calculateDurationInMonths(
        new Date(today),
        new Date(project.endDate)
      );

      const durationPercentage = (remainingDuration / project.duration) * 100;

      if (durationPercentage < taskCompletionPercentage) {
        const riskObj = {};

        riskObj.type = "time";
        riskObj.difference = (project.duration - remainingDuration).toFixed(2);
        riskObj.percentage = (
          (riskObj.difference / project.duration) *
          100
        ).toFixed(2);

        if (riskObj.percentage < 30) {
          riskObj.impact = "low";
        } else if (riskObj.percentage >= 30 && riskObj.percentage < 60) {
          riskObj.impact = "medium";
        } else {
          riskObj.impact = "high";
        }

        riskObj.description = `Project is ${
          riskObj.percentage
        }% behind schedule. It is suggested to increase the duration by ${
          riskObj.difference < 1
            ? `${riskObj.difference * 30} days`
            : `${riskObj.difference} months`
        }`;

        risk.push(riskObj);
      } else {
        const riskObj = {};

        riskObj.type = "time";
        riskObj.difference = 0;
        riskObj.percentage = 0;
        riskObj.impact = "none";
        riskObj.description = "Project is on schedule";

        risk.push(riskObj);
      }

      // Sending a success response
      res.json({
        message: "Risk levels calculated successfully",
        risk,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch task status information for a project
  getProjectTaskStatus: async (req, res) => {
    try {
      // Getting project id from request params
      const id = req.params.id;

      // Fetching the project to calculate task status
      const project = await Project.findById(id).populate("tasks");

      // Check if the project id is existing
      if (!project) {
        return res.status(404).json({ message: "Project id is invalid" });
      }

      // Initializing task status counters
      let pending = 0,
        completed = 0,
        backlogs = 0,
        idle = 0;

      // Iterating through tasks to count task status
      project.tasks.forEach((task) => {
        switch (task.status) {
          case "in-progress":
            pending++;
            break;
          case "completed":
            completed++;
            break;
          case "backlog":
            backlogs++;
            break;
          case "idle":
            idle++;
            break;
        }
      });

      // Sending a success response with task status counts
      res.json({
        message: "Task status information fetched successfully",
        pending,
        completed,
        backlogs,
        idle,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch total tasks pending for the day
  getTotalTasksPendingForToday: async (req, res) => {
    try {
      // Getting project id from request params
      const id = req.params.id;

      // Fetching the project to calculate task status
      const project = await Project.findById(id).populate("tasks");

      // Check if the project id is existing
      if (!project) {
        return res.status(404).json({ message: "Project id is invalid" });
      }

      // Fetching the current date
      const date = new Date();

      const today = new Date(
        `${date.getFullYear()}-${
          parseInt(date.getMonth()) + 1
        }-${date.getDate()}`
      ).toDateString();

      const tomorrow = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      ).toDateString();

      // Fetching all tasks for the current date
      const filteredTasks = project.tasks.filter((task) => {
        return task.deadline.toDateString() === today;
      });

      console.log(today, tomorrow);

      // Sending a success response with total tasks pending for the day
      res.json({
        message: "Total tasks pending for the day fetched successfully",
        count: filteredTasks.length,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch pending project duration
  getPendingProjectDuration: async (req, res) => {
    try {
      // Getting project id from request params
      const id = req.params.id;

      // Fetching the project to calculate task status
      const project = await Project.findById(id).populate("tasks");

      // Check if the project id is existing
      if (!project) {
        return res.status(404).json({ message: "Project id is invalid" });
      }

      const duration = calculateDurationInMonths(new Date(), project.endDate);

      // Sending a success response with pending project duration
      res.json({
        message: "Pending project duration fetched successfully",
        duration,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch project productivity information
  getProjectProductivity: async (req, res) => {
    try {
      const id = req.params.id;
      const project = await Project.findById(id).populate("tasks");

      if (!project) {
        return res.status(404).json({ message: "Project id is invalid" });
      }

      // Finding count of tasks completed on each date
      const productivity = {};
      project.tasks.forEach((task) => {
        if (task.completedOn) {
          const date = new Date(task.completedOn);
          const dateKey = `${date.getFullYear()}-${
            parseInt(date.getMonth()) + 1
          }-${date.getDate()}`;
          if (productivity[dateKey]) {
            productivity[dateKey]++;
          } else {
            productivity[dateKey] = 1;
          }
        }
      });

      const productivityData = [];

      for (const [key, value] of Object.entries(productivity)) {
        const obj = {};
        obj["date"] = key;
        obj["value"] = value;
        productivityData.push(obj);
      }

      // Sending a success response with project productivity information
      res.json({
        message: "Project productivity information fetched successfully",
        productivityData,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  getTeam: async (req, res) => {
    try {
      const userId = req.userId;

      // Fetching user information
      const user = await User.findById(userId);

      const id = user.assignedTo;

      const project = await Project.findById(id).populate("members");

      const team = project.members;

      console.log(team);

      // Sending a success response with team members
      res.json({
        message: "Team members fetched successfully",
        team,
      });
    } catch (error) {
      // sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  //Admin Functionalities

  // API to fetch total sum invested across all projects
  getTotalSumInvested: async (req, res) => {
    try {
      // Fetching all projects
      const projects = await Project.find({});

      // Iterating through projects to calculate total sum invested
      const totalSumInvested = projects.reduce((accumulator, project) => {
        accumulator += project.budget;
        return accumulator;
      }, 0);

      // Sending a success response with total sum invested across all projects
      res.json({
        message: "Total sum invested fetched successfully",
        totalSumInvested,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch project statistics
  getProjectStatusCount: async (req, res) => {
    try {
      // Fetching all projects
      const projects = await Project.find({});

      // Initializing project status count object
      const projectStatusCount = {
        active: 0,
        inactive: 0,
        completed: 0,
      };
      projects.forEach((project) => {
        projectStatusCount[project.status]++;
      });
      const progressData = [];
      for (let key in projectStatusCount) {
        const obj = {};
        if (key === "active") {
          obj["name"] = "Active";
          obj["value"] = projectStatusCount[key];
          progressData.push(obj);
        } else if (key === "inactive") {
          obj["name"] = "Inactive";
          obj["value"] = projectStatusCount[key];
          progressData.push(obj);
        } else if (key === "completed") {
          obj["name"] = "Completed";
          obj["value"] = projectStatusCount[key];
          progressData.push(obj);
        }
      }

      // Sending a success response with project status count
      res.json({
        message: "Project status count fetched successfully",
        progressData,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to fetch the project with highest risk levels
  getProjectWithHighestRiskLevels: async (req, res) => {
    try {
      // Fetching all projects
      const projects = await Project.find({});

      // Initializing project with highest risk level object
      let projectWithHighestRiskLevels = null;
      let highestRiskLevel = 0;
      projects.forEach((project) => {
        const riskLevel = calculateRiskLevel(project);
        if (riskLevel > highestRiskLevel) {
          projectWithHighestRiskLevels = project;
          highestRiskLevel = riskLevel;
        }
      });
      // Sending a success response with project with highest risk levels
      res.json({
        message: "Project with highest risk levels fetched successfully",
        project: projectWithHighestRiskLevels
          ? projectWithHighestRiskLevels
          : "No project is at risk",
        highestRiskLevel,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to retrieve all projects
  getAllProjects: async (req, res) => {
    try {
      // Finding all projects in the database
      const projects = await Project.find({})
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
      // Sending a success response with the fetched projects
      res.json({ message: "Projects fetched successfully", projects });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },
};

// Exporting the controller
module.exports = projectController;
