enum SelectedDateRange {
  DAY,
  WEEK,
  MONTH,
  YEAR
}
const SelectedDateRangeOptions = Object.values(SelectedDateRange).filter((value) => typeof value === "string");

enum DateArrangement {
  DATE,
  MONTH,
  YEAR,
}

export { SelectedDateRange, SelectedDateRangeOptions, DateArrangement };