import { format } from "date-fns";
import { AppSettings } from "@/lib/types/settings";

/**
 * Formats a date to a string
 * @param date Date to format
 * @returns Formatted date string
 * @example
 * ```typescript
 * const date = new Date();
 * const formattedDate = formatDate(date);
 * console.log(formattedDate); // "February 11, 2025"
 * ```
 */
export const formatDate = (date: Date, dateFormat: string): string => {
  return format(date, dateFormat);
};