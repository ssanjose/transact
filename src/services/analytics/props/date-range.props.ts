enum SelectedDateRange {
  DAY,
  WEEK,
  MONTH,
  YEAR
}
const SelectedDateRangeOptions = Object.values(SelectedDateRange).filter((value) => typeof value === "string");

export { SelectedDateRange, SelectedDateRangeOptions };