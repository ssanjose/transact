import { add, format } from "date-fns";

/**
 * Generates complete date range array. Padding essentially.
 * @param startDate Start date
 * @param endDate End date
 * @returns Array of dates in 'yyyy-MM-dd' format
 */
export function generateDateRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dates.push(format(currentDate, 'yyyy-MM-dd'));
    currentDate = add(currentDate, { days: 1 });
  }

  return dates;
}