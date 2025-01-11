import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine multiple class names into a single string
 * @param inputs The class names to combine
 * @returns A single string with all class names combined
 * @example
 * cn('text-red-500', 'bg-blue-500') // 'text-red-500 bg-blue-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sleep for a given number of milliseconds
 * @param ms The number of milliseconds to sleep
 * @returns A promise that resolves after the given number of milliseconds
 * @example
 * await Sleep(1000) // Sleep for 1 second
 */
export function Sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks if an object exists and throws an error if it does not.
 * @param {T} obj - The object to check.
 * @returns {T} - The object if it exists.
 * @throws {Error} - An error is thrown if the object does not exist.
 */
export function checkIfExists<T>(obj: T | undefined): T {
  if (obj === undefined)
    throw new Error(`${typeof obj} not found`);
  return obj;
}

/**
 * Recalculate the account balance based on a transaction when a transaction is reverted
 * @param accountBalance The current account balance
 * @param transactionAmount The amount of the transaction
 * @param transactionType The type of the transaction
 * @returns The new account balance
 * @example
 * RecalculateBalanceOnRevert(100, 50, TransactionType.Income) // 50
 * RecalculateBalanceOnRevert(100, 50, TransactionType.Expense) // 150
 *

export function RecalculateBalanceOnRevert(accountBalance: number, transactionAmount: number, transactionType: TransactionType) {
  return transactionType === TransactionType.Income
    ? accountBalance - transactionAmount
    : accountBalance + transactionAmount
}
    */