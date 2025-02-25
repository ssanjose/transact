// @ts-check
import { test, expect } from '@playwright/test';

test('page has title', async ({ page }) => {
  await page.goto('http://localhost:3000/account/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Transact/);
});

// heading and section heading tests
test('page has "Accounts" heading', async ({ page }) => {
  await page.goto('http://localhost:3000/account/');

  // Expects page to have a heading with the name of Accounts.
  await expect(page.locator('h1').filter({ hasText: "Accounts" })).toBeVisible();
});

test('page has "Accounts" h2', async ({ page }) => {
  await page.goto('http://localhost:3000/account/');

  // Expects page to have a heading with the name of Accounts.
  await expect(page.locator('h2').filter({ hasText: "Account and Transaction Lists" })).toBeVisible();
});

test('page has "Account Trend" h2', async ({ page }) => {
  await page.goto('http://localhost:3000/account/');

  // Expects page to have a heading with the name of Accounts.
  await expect(page.locator('h2').filter({ hasText: "Account Trend" })).toBeVisible();
});

// accounts and transaction list tests
test.describe('Accounts Card', () => {
  test('page has Accounts card', async ({ page }) => {
    await page.goto('http://localhost:3000/account');

    await expect(page.locator('div').filter({ hasText: 'AccountsNo accounts foundCreate a new Account' }).nth(3)).toBeVisible();
  });

  test('page has Account heading', async ({ page }) => {
    await page.goto('http://localhost:3000/account');

    await expect(page.getByRole('button', { name: 'Accounts' })).toBeVisible();
  });

  test('page has a "Create a new Account" button', async ({ page }) => {
    await page.goto('http://localhost:3000/account/');

    // Expects page to have a button with the name of Create a new Account.
    await expect(page.getByRole('button', { name: 'Create a new Account' })).toBeVisible();
    await page.getByRole('button', { name: 'Create a new Account' }).click();
    await expect(page.getByRole('dialog', { name: 'Create a new Account' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('button', { name: 'Create a new Account' })).toBeVisible();
  });
});

test.describe('Transactions List', () => {
  test('page has Upcoming Transaction card', async ({ page }) => {
    await page.goto('http://localhost:3000/account/');

    // Expects page to have a heading with the name of Transactions.
    await expect(page.locator('div').filter({ hasText: /^UpcomingTransactionsNo upcoming transactions$/ })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Upcoming' })).toBeVisible();
    await expect(page.getByRole('table', { name: 'Upcoming Transactions' }).getByRole('paragraph')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'No upcoming transactions' })).toBeVisible();
  });

  test('page has Recent Transaction card', async ({ page }) => {
    await page.goto('http://localhost:3000/account/');

    // Expects page to have a heading with the name of Transactions.
    await expect(page.locator('div').filter({ hasText: /^RecentTransactionsNo recent transactions$/ })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Recent' })).toBeVisible();
    await expect(page.getByRole('table', { name: 'Recent Transactions' }).getByRole('paragraph')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'No recent transactions' })).toBeVisible();
  });
});

// account trend tests
test('page has Account Trend card', async ({ page }) => {
  await page.goto('http://localhost:3000/account');

  await expect(page.locator('div').filter({ hasText: /^Total AccountsTotal Amount for All Accounts$/ }).first()).toBeVisible();
  await expect(page.getByText('Total Accounts')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^\$0\.00\$1\.00\$2\.00\$3\.00\$4\.00$/ }).first()).toBeVisible();
});