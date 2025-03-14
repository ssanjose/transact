// @ts-check
import { test, expect } from '@playwright/test';
import { format } from 'date-fns';
import { formatDate } from '../../src/lib/format/formatTime';

test('page has title', async ({ page }) => {
  await page.goto('http://localhost:3000/analysis/dashboard');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Transact/);
});

// heading and section heading tests
test('page has "Dashboard" heading', async ({ page }) => {
  await page.goto('http://localhost:3000/analysis/dashboard/');

  // Expects page to have a heading with the name of Dashboard.
  await expect(page.locator('h1').filter({ hasText: "Dashboard" })).toBeVisible();
});

test('page has "Analytics" h2', async ({ page }) => {
  await page.goto('http://localhost:3000/analysis/dashboard/');

  // Expects page to have a h2 with the name of Analytics.
  await expect(page.locator('h2').filter({ hasText: "Analytics" })).toBeVisible();
});

test('page has data range selector', async ({ page }) => {
  await page.goto('http://localhost:3000/analysis/dashboard/');

  let currentDate = new Date();
  let date = `${format(new Date(currentDate.getFullYear(), currentDate.getMonth()-1, currentDate.getDate()), 'MMM dd, yyyy')} - ${format(currentDate, 'MMM dd,')}`

  await expect(page.getByRole('button', { name: date })).toBeVisible();
  await page.getByRole('button', { name: date }).click();

  await expect(page.getByRole('dialog').locator('div').filter({ hasText: `${currentDate.getMonth()-1}` }).first()).toBeVisible();
  await page.getByRole('button', { name: date }).click();
  await expect(page.getByRole('button', { name: date })).toBeVisible();
});

test.describe('Dashboard page has 4 summary cards', () => {
  // Format epoch date (January 1, 1970) consistently using the same formatDate function used in the app
  const epochDate = new Date(0); // Unix epoch timestamp 0
  const formattedEpochDate = formatDate(epochDate, 'MMMM d, yyyy');

  test('page has "Highest Valued Account by balance" card', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/dashboard/');
  
    // Expects page to have a card with the name of Highest Valued Account by balance.
    await expect(page.locator('div').filter({ hasText: 'Highest Valued Account by balance' }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Highest Valued Account by balance$/ }).first()).toBeVisible();
    await expect(page.locator('[id="Highest\\ Valued\\ Account\\ by\\ balance"]').getByText(`$0.00NaN% change since ${formattedEpochDate}`)).toBeVisible();
  });

  test('page has "Most Used Account by frequency" card', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/dashboard/');
  
    // Expects page to have a card with the name of Most Used Account by frequency.
    await expect(page.locator('div').filter({ hasText: 'Most Used Account by frequency' }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Most Used Account by frequency$/ }).first()).toBeVisible();
    await expect(page.locator('[id="Most\\ Used\\ Account\\ by\\ frequency"]').getByText(`0Transactions since ${formattedEpochDate}`)).toBeVisible();
  });

  test('page has "Highest Growth Account by monthly balance" card', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/dashboard/');
  
    // Expects page to have a card with the name of Highest Growth Account by monthly balance.
    await expect(page.locator('div').filter({ hasText: 'Highest Growth Account by monthly balance' }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Highest Growth Account by monthly balance$/ }).first()).toBeVisible();
    await expect(page.locator('[id="Highest\\ Growth\\ Account\\ by\\ monthly\\ balance"]').getByText(`0.00NaN% change since ${formattedEpochDate}`)).toBeVisible();
  });

  test('page has "Lowest Growth Account by monthly balance" card', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/dashboard/');
  
    // Expects page to have a card with the name of Lowest Growth Account by monthly balance.
    await expect(page.locator('div').filter({ hasText: 'Lowest Growth Account by monthly balance' }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Lowest Growth Account by monthly balance$/ }).first()).toBeVisible();
    await expect(page.locator('[id="Lowest\\ Growth\\ Account\\ by\\ monthly\\ balance"]').getByText(`0.00NaN% change since ${formattedEpochDate}`)).toBeVisible();
  });
});

test('page has "Transaction Amount Trend Bar Chart"', async ({ page }) => {
  await page.goto('http://localhost:3000/analysis/dashboard/');

  // Expects page to have a Transaction Amount Trend bar chart.
  await expect(page.locator('div').filter({ hasText: /^Overview$/ }).first()).toBeVisible();
});