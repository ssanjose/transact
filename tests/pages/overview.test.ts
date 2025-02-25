// @ts-check
import { test, expect } from '@playwright/test';

test('page has title', async ({ page }) => {
  await page.goto('http://localhost:3000/overview/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Transact/);
});

// heading tests
test('page has "overview" heading', async ({ page }) => {
  await page.goto('http://localhost:3000/overview/');

  // Expects page to have a heading with the name of Overview.
  await expect(page.getByRole('heading', { name: 'Overview' }).filter({ hasNotText: "Transactions", hasText: "Overview" })).toBeVisible();
});

test('page has "Accounts" heading', async ({ page }) => {
  await page.goto('http://localhost:3000/overview/');

  // Expects page to have a heading with the name of Accounts.
  await expect(page.locator('h2').filter({ hasText: "Accounts" })).toBeVisible();
});

test('page has "Transactions Overview" heading', async ({ page }) => {
  await page.goto('http://localhost:3000/overview/');

  // Expects page to have a heading with the name of Transactions Overview.
  await expect(page.getByRole('heading', { name: 'Transactions Overview' })).toBeVisible();
});

// button and input tests
test('page has a "Create a new Account" button', async ({ page }) => {
  await page.goto('http://localhost:3000/overview/');

  // Expects page to have a button with the name of Create a new Account.
  await expect(page.getByRole('button', { name: 'Create a new Account' })).toBeVisible();
  await page.getByRole('button', { name: 'Create a new Account' }).click();
  await expect(page.getByRole('dialog', { name: 'Create a new Account' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('Toggle SidebaroverviewOverviewAccountsAccountsNo accounts foundCreate a new')).toBeVisible();
});

test('page has a combo box to select date range type', async ({ page }) => {
  await page.goto('http://localhost:3000/overview/');

  // Expects page to have a combo box with the name of MONTH.
  await expect(page.getByRole('combobox', { name: 'Select Date Range' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Select Date Range' }).click();
  await expect(page.getByText('DAYWEEKMONTHYEAR')).toBeVisible();
  await expect(page.getByRole('option', { name: 'DAY' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'WEEK' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'MONTH' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'YEAR' })).toBeVisible();
  await page.getByRole('option', { name: 'YEAR' }).click();
  await expect(page.getByRole('combobox', { name: 'Select Date Range' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Select Date Range' }).click();
  await expect(page.getByRole('option', { name: 'YEAR' }).locator('svg')).toBeVisible();
});

test('overview has UpcomingTransactions card', async ({ page }) => {
  await page.goto('http://localhost:3000/overview');

  await expect(page.locator('div').filter({ hasText: 'UpcomingTransactionsNo' }).nth(4)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Upcoming' })).toBeVisible();
  await page.getByRole('table', { name: 'Upcoming Transactions' }).getByRole('paragraph').click();
  await expect(page.getByRole('cell', { name: 'No upcoming transactions' })).toBeVisible();
});

test('page has a transaction card summaries', async ({ page }) => {
  await page.goto('http://localhost:3000/overview/');

  await expect(page.locator('div').filter({ hasText: /^0Transactions$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^No income received$/ }).nth(1)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^No expenses made$/ }).nth(1)).toBeVisible();
});

test('page has transaction amount trends', async ({ page }) => {
  await page.goto('http://localhost:3000/overview/');

  await expect(page.getByText('MONTH0TransactionsNo income')).toBeVisible();

  await expect(page.locator('div').filter({ hasText: /^Transaction TrendIncome and Expenses$/ }).first()).toBeVisible();
  await expect(page.locator('div:nth-child(5) > div:nth-child(3) > div > div:nth-child(2)').first()).toBeVisible();

  await expect(page.locator('div').filter({ hasText: /^Expense TrendExpenses by category$/ }).first()).toBeVisible();
  await expect(page.locator('div:nth-child(3) > div:nth-child(2) > div:nth-child(2)')).toBeVisible();

  await expect(page.locator('div').filter({ hasText: /^Expense TrendExpenses by category$/ }).first()).toBeVisible();
  await expect(page.locator('div:nth-child(3) > div:nth-child(3) > div:nth-child(2)')).toBeVisible();
});

// footer
test('page has a all rights reserved text', async ({ page }) => {
  await page.goto('http://localhost:3000/overview/');

  // Expects page to have a text with the name of All rights reserved.
  await expect(page.getByText('© 2025 Transact App. All')).toBeVisible();
});