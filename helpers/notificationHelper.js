const Task = require("../models/task");
const sendEmail = require("../helpers/emailHelper");

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
  const tasks = await Task.find().populate("assignedTo");

  // Iterating over tasks and sending email notifications
  tasks.forEach((task) => {
    const timeToDeadline = task.deadline - now;
    if (timeToDeadline <= twoDaysFromNow && timeToDeadline > oneDayFromNow) {
      sendEmail(
        task.assignedTo.email,
        "Task Deadline Alert",
        "Your task is pending in 2 days."
      );
      console.log("Email sent for 2 days alert");
    } else if (timeToDeadline <= oneDayFromNow && timeToDeadline > 0) {
      sendEmail(
        task.assignedTo.email,
        "Task Deadline Alert",
        "Your task is pending in 1 day."
      );
      console.log("Email sent for 1 day alert");
    } else if (task.deadline >= todayStart && task.deadline <= todayEnd) {
      sendEmail(
        task.assignedTo.email,
        "Task Deadline Alert",
        "Your task deadline is today."
      );
      console.log("Email sent for todays alert");
    } else {
      console.log("No deadline alerts to send for task", task.title);
    }
  });
};

module.exports = notifyDeadlines;
