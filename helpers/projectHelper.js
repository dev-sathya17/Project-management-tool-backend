function calculateDurationInMonths(startDate, endDate) {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const startDay = startDate.getDate();

  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();
  const endDay = endDate.getDate();

  // Calculate year and month difference
  let yearDiff = endYear - startYear;
  let monthDiff = endMonth - startMonth;

  // Calculate the total months difference
  let totalMonths = yearDiff * 12 + monthDiff;

  // Calculate the day difference and adjusting total months
  let dayDiff = endDay - startDay;
  let daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate();

  // Add the fraction of the month
  totalMonths += dayDiff / daysInStartMonth;

  return totalMonths;
}

function calculateRiskLevel(project) {
  // Calculating the budget based risk
  const pay = project.members.reduce((acc, member) => {
    acc += member.salaryPerMonth;
    return acc;
  }, 0);

  const cost = pay * project.duration;

  let budgetRiskPercentage = 0,
    durationRiskPercentage = 0;

  if (cost > project.budget) {
    budgetRiskPercentage = ((cost / project.budget) * 100).toFixed(2);
  }

  // Calculating the project duration based risk

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
    let difference = (project.duration - remainingDuration).toFixed(2);
    durationRiskPercentage = (
      (riskObj.difference / project.duration) *
      100
    ).toFixed(2);
  }

  const projectRisk = (
    (durationRiskPercentage + taskCompletionPercentage) /
    2
  ).toFixed(2);

  return projectRisk;
}

module.exports = { calculateDurationInMonths };
