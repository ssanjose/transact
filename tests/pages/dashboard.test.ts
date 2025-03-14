// @ts-check
import { test, expect } from '@playwright/test';
import { format } from 'date-fns';

test('page has title', async ({ page }) => {
  await page.goto('http://localhost:3000/account/');

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
  test('page has "Highest Valued Account by balance" card', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/dashboard/');
  
    // Expects page to have a card with the name of Highest Valued Account by balance.
    await expect(page.locator('div').filter({ hasText: 'Highest Valued Account by balance' }).first()).toBeVisible();
    await expect(page.locator('#top')).toContainText('Highest Valued Account by balance');
    await expect(page.locator('#top')).toContainText(/^0.00NaN% change since December 31, 1969$/);
  });

  test('page has "Most Used Account by frequency" card', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/dashboard/');
  
    // Expects page to have a card with the name of Most Used Account by frequency.
    await expect(page.locator('#top').filter({ hasText: 'Most Used Account by frequency' }).first()).toBeVisible();
    await expect(page.locator('#top')).toContainText('Most Used Account by frequency');
    await expect(page.locator('#top')).toContainText(/^0Transactions since December 31, 1969$/);
  });

  test('page has "Highest Growth Account by monthly balance" card', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/dashboard/');
  
    // Expects page to have a card with the name of Highest Growth Account by monthly balance.
    await expect(page.locator('div').filter({ hasText: 'Highest Growth Account by monthly balance' }).first()).toBeVisible();
    await expect(page.locator('#top')).toContainText('Highest Growth Account by monthly balance');
    await expect(page.locator('#top')).toContainText(/^0.00NaN% change since December 31, 1969$/);
  });

  test('page has "Lowest Growth Account by monthly balance" card', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/dashboard/');
  
    // Expects page to have a card with the name of Lowest Growth Account by monthly balance.
    await expect(page.locator('div').filter({ hasText: 'Lowest Growth Account by monthly balance' }).first()).toBeVisible();
    await expect(page.locator('#top')).toContainText('Lowest Growth Account by monthly balance');
    await expect(page.locator('#top')).toContainText(/^0.00NaN% change since December 31, 1969$/);
  });
});

test('page has "Transaction Amount Trend Bar Chart"', async ({ page }) => {
  await page.goto('http://localhost:3000/analysis/dashboard/');

  // Expects page to have a Transaction Amount Trend bar chart.
  await expect(page.locator('div').filter({ hasText: /^Overview$/ }).first()).toBeVisible();
});