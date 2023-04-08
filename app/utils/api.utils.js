exports.convertHoursToMilliseconds = function (hours) {
  if (Number.isNaN(parseInt(hours, 10))) return 0;
  return parseInt(hours, 10) * 3.6e+6;
};
