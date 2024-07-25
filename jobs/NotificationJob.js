const cron = require("node-cron");
const {
  notifyDeadlines,
  notifyProjectDeadlines,
  markTaskAsBacklog,
} = require("../helpers/notificationHelper");

// Schedule the job to run every hour
cron.schedule("0 * * * *", () => {
  console.log("Checking task deadlines...");
  notifyDeadlines();
  notifyProjectDeadlines();
  markTaskAsBacklog();
});
