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

module.exports = { calculateDurationInMonths };
