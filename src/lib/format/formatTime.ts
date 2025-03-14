import { format } from "date-fns";

/**
 * Formats a date to a string with consistent timezone handling
 * @param date Date to format
 * @param dateFormat Date format string
 * @returns Formatted date string
 * @example
 * ```typescript
 * const date = new Date();
 * const formattedDate = formatDate(date, "MMMM d, yyyy");
 * console.log(formattedDate); // "February 11, 2025"
 * ```
 */
export const formatDate = (date: Date, dateFormat: string): string => {
  // Create a UTC date to ensure consistent timezone handling
  const utcDate = new Date(Date.UTC(
    date.getFullYear(), 
    date.getMonth(), 
    date.getDate()
  ));
  return format(utcDate, dateFormat);
};