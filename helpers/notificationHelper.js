const Task = require("../models/task");
const Project = require("../models/project");
const sendEmail = require("../helpers/emailHelper");
const Notification = require("../models/notification");
// Function to send email notifications for tasks due within the next two days or today.
const notifyDeadlines = async () => {
  const date = new Date();
  const currentDate = `${date.getFullYear()}-${
    parseInt(date.getMonth()) + 1
  }-${date.getDate()}`;
  const now = new Date(currentDate);
  const twoDaysFromNow = 48 * 60 * 60 * 1000;
  const oneDayFromNow = 24 * 60 * 60 * 1000;
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd = new Date(now.setHours(23, 59, 59, 999));

  // Fetching all tasks
  const tasks = await Task.find()
    .populate("assignedTo")
    .populate("notifications");

  // Iterating over tasks and sending email notifications
  tasks.forEach((task) => {
    const timeToDeadline = task.deadline - now;

    if (timeToDeadline <= twoDaysFromNow && timeToDeadline > oneDayFromNow) {
      const isNotificationSent = task.notifications.filter(
        (notification) => notification.type === "low"
      );

      if (!isNotificationSent) {
        const notification = new Notification({
          title: "Task Deadline Alert",
          content: `Your task ${task.title} is due in 2 days.`,
          createdAt: new Date(),
          type: "low",
        });
        notification.save();
        task.notifications.push(notification._id);
        task.save();
        sendEmail(
          task.assignedTo.email,
          "Task Deadline Alert",
          "Your task is pending in 2 days."
        );
        console.log("Email sent for 2 days alert");
      }
    } else if (timeToDeadline <= oneDayFromNow && timeToDeadline > 0) {
      const isNotificationSent = task.notifications.filter(
        (notification) => notification.type === "medium"
      );
      if (!isNotificationSent) {
        const notification = new Notification({
          title: "Task Deadline Alert",
          content: `Your task ${task.title} is due in 1 day.`,
          createdAt: new Date(),
          type: "medium",
        });
        notification.save();
        task.notifications.push(notification._id);
        task.save();
        sendEmail(
          task.assignedTo.email,
          "Task Deadline Alert",
          "Your task is pending in 1 day."
        );
        console.log("Email sent for 1 day alert");
      }
    } else if (task.deadline >= todayStart && task.deadline <= todayEnd) {
      const isNotificationSent = task.notifications.filter(
        (notification) => notification.type === "high"
      );
      if (!isNotificationSent) {
        const notification = new Notification({
          title: "Task Deadline Alert",
          content: `Your task ${task.title} is due in 1 day.`,
          createdAt: new Date(),
          type: "high",
        });
        notification.save();
        task.notifications.push(notification._id);
        task.save();
        sendEmail(
          task.assignedTo.email,
          "Task Deadline Alert",
          "Your task deadline is today."
        );
        console.log("Email sent for todays alert");
      }
    } else {
      console.log("No deadline alerts to send for task", task.title);
    }
  });
};

// Function to send email notifications for projects with a deadline of today, within a week or within a month
const notifyProjectDeadlines = async () => {
  const date = new Date();
  const currentDate = `${date.getFullYear()}-${
    parseInt(date.getMonth()) + 1
  }-${date.getDate()}`;
  const now = new Date(currentDate);
  const weekFromNow = 7 * 24 * 60 * 60 * 1000;
  const monthFromNow = 30 * 24 * 60 * 60 * 1000;
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd = new Date(now.setHours(23, 59, 59, 999));
  const oneDayFromNow = 24 * 60 * 60 * 1000;

  // Fetching all projects
  const projects = await Project.find()
    .populate("owner")
    .populate("notifications");

  // Iterating over projects and sending email notifications
  projects.forEach((project) => {
    const timeToDeadline = project.endDate - now;
    if (
      timeToDeadline <= weekFromNow &&
      timeToDeadline > 0 &&
      project.endDate >= todayStart &&
      project.endDate <= todayEnd
    ) {
      const isNotificationSent = project.notifications.filter(
        (notification) => notification.type === "medium"
      );

      if (!isNotificationSent) {
        const notification = new Notification({
          title: "Project Deadline Alert",
          content: `Your Project ${project.title} is due in 7 days.`,
          createdAt: new Date(),
          type: "medium",
        });
        notification.save();
        project.notifications.push(notification._id);
        project.save();
        sendEmail(
          project.owner.email,
          "Project Deadline Alert",
          "Your project deadline is in 7 days."
        );
        console.log("Email sent for 7 days alert");
      }
    } else if (
      timeToDeadline <= monthFromNow &&
      timeToDeadline > 0 &&
      project.endDate >= todayStart &&
      project.endDate <= todayEnd
    ) {
      const isNotificationSent = project.notifications.filter(
        (notification) => notification.type === "low"
      );

      if (!isNotificationSent) {
        const notification = new Notification({
          title: "Project Deadline Alert",
          content: `Your Project ${project.title} is due in 30 days.`,
          createdAt: new Date(),
          type: "low",
        });
        notification.save();
        project.notifications.push(notification._id);
        project.save();
        sendEmail(
          project.owner.email,
          "Project Deadline Alert",
          "Your project deadline is in 30 days."
        );
        console.log("Email sent for 30 days alert");
      }
    } else if (timeToDeadline <= oneDayFromNow && timeToDeadline > 0) {
      const isNotificationSent = project.notifications.filter(
        (notification) => notification.type === "high"
      );

      if (!isNotificationSent) {
        const notification = new Notification({
          title: "Project Deadline Alert",
          content: `Your Project ${project.title} is due in 1 day.`,
          createdAt: new Date(),
          type: "high",
        });
        notification.save();
        project.notifications.push(notification._id);
        project.save();
        sendEmail(
          project.owner.email,
          "Project Deadline Alert",
          "Your Project is pending in 1 day."
        );
        console.log("Email sent for 1 day alert");
      }
    } else if (project.endDate >= todayStart && project.endDate <= todayEnd) {
      const isNotificationSent = project.notifications.filter(
        (notification) => notification.type === "very high"
      );

      if (!isNotificationSent) {
        const notification = new Notification({
          title: "Project Deadline Alert",
          content: `Your Project ${project.title} is due today.`,
          createdAt: new Date(),
          type: "very high",
        });
        notification.save();
        project.notifications.push(notification._id);
        project.save();
        sendEmail(
          project.owner.email,
          "Project Deadline Alert",
          "Your Project deadline is today."
        );
        console.log("Email sent for todays alert");
      }
    } else {
      console.log("No deadline alerts to send for project", project.title);
    }
  });
};

// Function to update task as backlog once deadline is reached and task is not completed
const markTaskAsBacklog = async () => {
  const tasks = await Task.find({
    deadline: { $lte: new Date() },
    status: { $ne: "completed" },
  });
  tasks.forEach((task) => {
    if (task.status !== "backlog") {
      task.status = "backlog";
      task.save();
      console.log("Task marked as backlog:", task.title);
    }
  });
};

module.exports = { notifyDeadlines, notifyProjectDeadlines, markTaskAsBacklog };
