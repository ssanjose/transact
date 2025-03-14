// @ts-check
import { test, expect } from '@playwright/test';
import { format } from 'date-fns';

test('page has title', async ({ page }) => {
  await page.goto('http://localhost:3000/account/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Transact/);
});

// heading and section heading tests
test('page has "Settings" heading', async ({ page }) => {
  await page.goto('http://localhost:3000/analysis/settings/');

  // Expects page to have a heading with the name of Categories.
  await expect(page.locator('h1').filter({ hasText: "Settings" })).toBeVisible();
});

test('page has "Settings Form" h2', async ({ page }) => {
  await page.goto('http://localhost:3000/analysis/settings/');

  // Expects page to have a h2 with the name of Settings Form.
  await expect(page.locator('h2').filter({ hasText: "Settings Form" })).toBeVisible();
});

test('page has "Transactions" h3', async ({ page }) => {
  await page.goto('http://localhost:3000/analysis/settings/');

  // Expects page to have a h3 with the name of Transactions.
  await expect(page.locator('h3').filter({ hasText: "Transactions" })).toBeVisible();
});

test('page has "Preferences" h3', async ({ page }) => {
  await page.goto('http://localhost:3000/analysis/settings/');

  // Expects page to have a h3 with the name of Preferences.
  await expect(page.locator('h3').filter({ hasText: "Preferences" })).toBeVisible();
});

test('page has "Notifications" h3', async ({ page }) => {
  await page.goto('http://localhost:3000/analysis/settings/');

  // Expects page to have a h3 with the name of Notifications.
  await expect(page.locator('h3').filter({ hasText: "Notifications" })).toBeVisible();
});

test('page has "Data" h3', async ({ page }) => {
  await page.goto('http://localhost:3000/analysis/settings/');

  // Expects page to have a h3 with the name of Data.
  await expect(page.locator('h3').filter({ hasText: "Data" })).toBeVisible();
});

test.describe('transactions section', () => {
  test('page has recurring transactions form toggle', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/settings/');

    // Expects page to have a toggle for recurring transactions.
    await expect(page.locator('form')).toContainText('Recurring transactionsAutomatically add new transactions when a new month starts.');
    await expect(page.getByRole('switch', { name: 'Recurring transactions' })).toBeVisible();

    await page.getByRole('switch', { name: 'Recurring transactions' }).click();
    await page.getByRole('switch', { name: 'Recurring transactions' }).click();
  });

  test('page has recent transaction limit input', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/settings/');

    // Expects page to have an input for recent transaction limit.
    await expect(page.locator('div').filter({ hasText: /^Recent transaction limitThe number of recent transactions that can be displayed\.$/ }).first()).toBeVisible();
    await page.getByRole('spinbutton', { name: 'Recent transaction limit' }).click();
    await page.getByRole('spinbutton', { name: 'Recent transaction limit' }).press('ArrowUp');
    await expect(page.getByRole('spinbutton', { name: 'Recent transaction limit' })).toHaveValue('4');

    await page.getByRole('spinbutton', { name: 'Recent transaction limit' }).press('ArrowDown');
    await expect(page.getByRole('spinbutton', { name: 'Recent transaction limit' })).toHaveValue('3');
  });

  test('page has upcoming transaction limit input', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/settings/');

    // Expects page to have an input for upcoming transaction limit.
    await expect(page.locator('div').filter({ hasText: /^Upcoming transaction limitThe number of upcoming transactions that can be displayed\.$/ }).first()).toBeVisible();
    await page.getByRole('spinbutton', { name: 'Upcoming transaction limit' }).click();
    await page.getByRole('spinbutton', { name: 'Upcoming transaction limit' }).press('ArrowUp');
    await expect(page.getByRole('spinbutton', { name: 'Upcoming transaction limit' })).toHaveValue('4');

    await page.getByRole('spinbutton', { name: 'Upcoming transaction limit' }).press('ArrowDown');
    await expect(page.getByRole('spinbutton', { name: 'Upcoming transaction limit' })).toHaveValue('3');
  });
});

test.describe('preferences section', () => {
  test('page has currency form selectbox', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/settings/');

    // Expects page to have a selectbox for currency.
    await expect(page.locator('#top div').filter({ hasText: 'Currency FormatThe default' }).nth(2)).toBeVisible();
    await expect(page.getByLabel('Currency Format')).toContainText('USD');

    await page.getByRole('combobox', { name: 'Currency Format' }).click();
    await page.getByRole('option', { name: 'EUR' }).click();
    await expect(page.getByLabel('Currency Format')).toContainText('EUR');

    await page.getByRole('button', { name: 'Save' }).click();

    await page.getByRole('main').getByRole('button', { name: 'Toggle Sidebar' }).click();
    await page.getByRole('link', { name: 'Overview' }).first().click();

    await page.getByRole('button', { name: 'Create a new Account' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('test1');
    await page.getByRole('spinbutton', { name: 'Balance' }).click();
    await page.getByRole('spinbutton', { name: 'Balance' }).fill('200');
    await page.getByRole('button', { name: 'Create an Account' }).click();

    await page.getByRole('link', { name: 'Overview' }).first().click();
    await expect(page.getByLabel('Accounts').locator('tbody')).toContainText('€200.00');
  });

  test('page has date format form input', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/settings/');

    // Expects page to have an input for date format.
    await expect(page.locator('div').filter({ hasText: /^Date formatThe format for displaying dates\.$/ }).first()).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Date format' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Date format' }).click();
    await page.getByRole('textbox', { name: 'Date format' }).press('ArrowLeft');
    await page.getByRole('textbox', { name: 'Date format' }).press('ArrowLeft');
    await page.getByRole('textbox', { name: 'Date format' }).press('ArrowLeft');
    await page.getByRole('textbox', { name: 'Date format' }).press('ArrowLeft');
    await page.getByRole('textbox', { name: 'Date format' }).press('ArrowLeft');
    await page.getByRole('textbox', { name: 'Date format' }).press('ArrowLeft');
    await page.getByRole('textbox', { name: 'Date format' }).press('ArrowLeft');
    await page.getByRole('textbox', { name: 'Date format' }).fill('MMM d, yyyy');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('main').getByRole('button', { name: 'Toggle Sidebar' }).click();
    await page.getByRole('link', { name: 'Overview' }).first().click();
    await page.getByRole('button', { name: 'Create a new Account' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('test1');
    await page.getByRole('button', { name: 'Create an Account' }).click();
    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('test1');
    await page.getByRole('textbox', { name: 'Name' }).press('Tab');
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('100');
    await page.getByRole('button', { name: 'Create an Transaction' }).click();

    let currentDate = format(new Date(), 'MMM d, yyyy');
    await expect(page.locator('tbody')).toContainText(new RegExp(currentDate));
  });
});

test.describe('notifications section', () => {
  test('page has "app updates" form toggle', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/settings/');

    // Expects page to have a toggle for app updates.
    await expect(page.locator('div').filter({ hasText: /^App updatesReceive a notification when a new version of the app is available\.$/ }).first()).toBeVisible();
    await expect(page.getByRole('switch', { name: 'App updates' })).toBeVisible();
    
    await page.getByRole('switch', { name: 'App updates' }).click();
    await page.getByRole('switch', { name: 'App updates' }).click();
  });

  test('page has "transaction updates" form toggle', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/settings/');

    // Expects page to have a toggle for transaction updates.
    await expect(page.locator('div').filter({ hasText: /^Transaction updatesReceive notifications when transactions are committed\.$/ }).first()).toBeVisible();
    await expect(page.getByRole('switch', { name: 'Transaction updates' })).toBeVisible();
    
    await page.getByRole('switch', { name: 'Transaction updates' }).click();
    await page.getByRole('switch', { name: 'Transaction updates' }).click();
  });
});

// todo: incomplete test
// needs to test if transaction data is reset
// needs to test if category data is reset
test.describe('data section', () => {
  test('page has "Delete all accounts" form button', async ({ page }) => {
    await page.goto('http://localhost:3000/analysis/settings/');

    // Expects page to have a button for deleting all accounts.
    await expect(page.locator('#top')).toContainText('Delete All AccountsThis action will permanently delete all accounts and associated transactions.Delete');
    await expect(page.locator('#top')).toContainText('Delete');

    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('alertdialog', { name: 'Are you sure you want to' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();
    
    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();
  });

  test('user can delete all data with ""Delete all data" form button', async ({ page }) => {
    await page.goto('http://localhost:3000/overview/');

    await page.getByRole('button', { name: 'Create a new Account' }).click();
    await page.getByRole('textbox', { name: 'Name' }).waitFor({ state: 'visible' });

    await page.getByRole('textbox', { name: 'Name' }).fill('test1');
    await page.getByRole('spinbutton', { name: 'Balance' }).click();
    await page.getByRole('spinbutton', { name: 'Balance' }).fill('200');
    await page.getByRole('button', { name: 'Create an Account' }).click();

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();

    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('test2');
    await page.getByRole('spinbutton', { name: 'Amount' }).click();
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('100');
    await page.getByRole('switch', { name: 'Expense' }).click();
    await page.getByRole('button', { name: 'Create an Transaction' }).click();

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();

    await expect(page.getByRole('cell', { name: 'test2' })).toBeVisible();
    await expect(page.locator('tbody')).toContainText('$100.00');

    await page.locator('button').filter({ hasText: 'Toggle Sidebar' }).click();
    await page.getByRole('link', { name: 'Overview' }).first().click();
    await expect(page.getByLabel('Accounts').locator('tbody')).toContainText('$300.00');

    await page.getByRole('link', { name: 'Settings' }).click();

    // Expects page to have a button for deleting all data.
    await expect(page.locator('#top')).toContainText('Delete All AccountsThis action will permanently delete all accounts and associated transactions.Delete');
    await expect(page.locator('#top')).toContainText('Delete');

    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('alertdialog', { name: 'Are you sure you want to' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();
    
    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();

    await page.getByRole('link', { name: 'Overview' }).first().click();
    await expect(page.getByLabel('Accounts').getByRole('cell')).toContainText('No accounts found');
  });
});