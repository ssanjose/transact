import { DateRange } from "react-day-picker";
import { SelectedDateRange } from "@/services/analytics/props/date-range.props";

/**
 * Get DateRange from SelectedDateRange
 * @param selectedDateRange SelectedDateRange
 * @returns DateRange
 */
export function getDateRangeFromSelectedRange(selectedDateRange: SelectedDateRange): DateRange {
  const currentDate = new Date();
  let from: Date;
  let to: Date;

  switch (selectedDateRange) {
    case SelectedDateRange.DAY:
      from = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
      to = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
      break;
    case SelectedDateRange.WEEK:
      from = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
      to = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6);
      break;
    case SelectedDateRange.MONTH:
      from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      break;
    default: // YEAR
      from = new Date(currentDate.getFullYear(), 0, 1);
      to = new Date(currentDate.getFullYear(), 11, 31);
      break;
  }

  return { from, to };
}