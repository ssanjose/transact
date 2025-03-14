// @ts-check
import { test, expect } from '@playwright/test';

test('page has title', async ({ page }) => {
  await page.goto('http://localhost:3000/account/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Transact/);
});

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

  test('user can create an Account with "Create a new Account" button', async ({ page }) => {
    await page.goto('http://localhost:3000/account/');

    await page.getByRole('button', { name: 'Create a new Account' }).click();
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Chequing');
    await page.getByRole('spinbutton', { name: 'Balance' }).click();
    await page.getByRole('spinbutton', { name: 'Balance' }).fill('200');
    await page.getByRole('button', { name: 'Create an Account' }).click();
    await expect(page.locator('h1')).toContainText('Chequing');

    await page.goto('http://localhost:3000/account/');

    await expect(page.getByLabel('Accounts').locator('tbody')).toContainText('Chequing');
    await expect(page.getByLabel('Accounts').locator('tbody')).toContainText('$200.00');
  });
});

test.describe('transaction actions', () => {
  test('user can create a transaction', async ({ page }) => {
    await page.goto('http://localhost:3000/account');
    await page.getByRole('button', { name: 'Create a new Account' }).click();

    await page.getByRole('textbox', { name: 'Name' }).waitFor({ state: 'visible' });

    await page.getByRole('textbox', { name: 'Name' }).fill('Chequing');
    await page.getByRole('textbox', { name: 'Name' }).press('Tab');
    await page.getByRole('spinbutton', { name: 'Balance' }).fill('200');
    await page.getByRole('button', { name: 'Create an Account' }).click();
    await expect(page.locator('h1')).toContainText('Chequing(1)');

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();

    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page.getByRole('heading')).toContainText('Transaction');
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Test1');
    await page.getByRole('textbox', { name: 'Name' }).press('Tab');
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('200');
    await page.getByRole('spinbutton', { name: 'Amount' }).press('Tab');
    await page.getByRole('button', { name: 'Date' }).press('Tab');
    await page.getByRole('switch', { name: 'Expense' }).click();
    await page.getByRole('combobox', { name: 'Frequency' }).click();
    await page.getByRole('option', { name: 'OneTime' }).click();
    await page.getByRole('combobox', { name: 'Category' }).click();
    await page.getByRole('option', { name: 'Groceries Open menu' }).click();
    await page.getByRole('dialog').locator('div').filter({ hasText: 'GroceriesOpen menuRentOpen' }).first().press('Escape');
    await page.getByRole('button', { name: 'Create an Transaction' }).click();

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();
  });

  test('user can read a transaction', async ({ page }) => {
    await page.goto('http://localhost:3000/account');
    await page.getByRole('button', { name: 'Create a new Account' }).click();

    await page.getByRole('textbox', { name: 'Name' }).waitFor({ state: 'visible' });

    await page.getByRole('textbox', { name: 'Name' }).fill('Chequing');
    await page.getByRole('textbox', { name: 'Name' }).press('Tab');
    await page.getByRole('spinbutton', { name: 'Balance' }).fill('200');
    await page.getByRole('button', { name: 'Create an Account' }).click();
    await expect(page.locator('h1')).toContainText('Chequing(1)');

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();

    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page.getByRole('heading')).toContainText('Transaction');
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Test1');
    await page.getByRole('textbox', { name: 'Name' }).press('Tab');
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('200');
    await page.getByRole('spinbutton', { name: 'Amount' }).press('Tab');
    await page.getByRole('button', { name: 'Date' }).press('Tab');
    await page.getByRole('switch', { name: 'Expense' }).click();
    await page.getByRole('combobox', { name: 'Frequency' }).click();
    await page.getByRole('option', { name: 'OneTime' }).click();
    await page.getByRole('combobox', { name: 'Category' }).click();
    await page.getByRole('option', { name: 'Groceries Open menu' }).click();
    await page.getByRole('dialog').locator('div').filter({ hasText: 'GroceriesOpen menuRentOpen' }).first().press('Escape');
    await page.getByRole('button', { name: 'Create an Transaction' }).click();

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();

    await expect(page.locator('tbody')).toContainText('Test1');
    await expect(page.locator('tbody')).toContainText('processed');
    await expect(page.locator('tbody')).toContainText('$200.00');
    await expect(page.locator('tbody')).toContainText('Open menu');
  });

  test('user can edit a transaction', async ({ page }) => {
    await page.goto('http://localhost:3000/account');
    await page.getByRole('button', { name: 'Create a new Account' }).click();

    await page.getByRole('textbox', { name: 'Name' }).waitFor({ state: 'visible' });

    await page.getByRole('textbox', { name: 'Name' }).fill('Chequing');
    await page.getByRole('textbox', { name: 'Name' }).press('Tab');
    await page.getByRole('spinbutton', { name: 'Balance' }).fill('200');
    await page.getByRole('button', { name: 'Create an Account' }).click();
    await expect(page.locator('h1')).toContainText('Chequing(1)');

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();

    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page.getByRole('heading')).toContainText('Transaction');
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Test1');
    await page.getByRole('textbox', { name: 'Name' }).press('Tab');
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('200');
    await page.getByRole('spinbutton', { name: 'Amount' }).press('Tab');
    await page.getByRole('button', { name: 'Date' }).press('Tab');
    await page.getByRole('switch', { name: 'Expense' }).click();
    await page.getByRole('combobox', { name: 'Frequency' }).click();
    await page.getByRole('option', { name: 'OneTime' }).click();
    await page.getByRole('combobox', { name: 'Category' }).click();
    await page.getByRole('option', { name: 'Groceries Open menu' }).click();
    await page.getByRole('dialog').locator('div').filter({ hasText: 'GroceriesOpen menuRentOpen' }).first().press('Escape');
    await page.getByRole('button', { name: 'Create an Transaction' }).click();

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();

    await page.getByRole('button', { name: 'Open menu' }).focus();
    await page.getByRole('button', { name: 'Open menu' }).click({ delay: 100 });
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('button', { name: 'Open menu' }).click({ delay: 100 });

    const browser = page.context().browser();
    if (browser && (browser.browserType().name() === 'firefox' || browser.browserType().name() === 'webkit')) {
      if (browser.browserType().name() === 'webkit')
        await page.getByRole('button', { name: 'Open menu' }).focus();
      await page.getByRole('button', { name: 'Open menu' }).click({ delay: 100 });
    }

    await page.getByRole('menuitem', { name: 'Edit Transaction' }).click();

    await page.getByRole('textbox', { name: 'Name' }).waitFor({ state: 'visible' });
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Test2');
    await expect(page.getByRole('heading')).toContainText('Edit a Transaction');
    await page.getByRole('button', { name: 'Edit Transaction' }).click();

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();

    await expect(page.locator('tbody')).toContainText('Test2');
  });

  test('user can delete a transaction', async ({ page }) => {
    await page.goto('http://localhost:3000/account');

    await page.getByRole('button', { name: 'Create a new Account' }).click();

    await page.getByRole('textbox', { name: 'Name' }).waitFor({ state: 'visible' });

    await page.getByRole('textbox', { name: 'Name' }).fill('Chequing');
    await page.getByRole('textbox', { name: 'Name' }).press('Tab');
    await page.getByRole('spinbutton', { name: 'Balance' }).fill('200');
    await page.getByRole('button', { name: 'Create an Account' }).click();

    await expect(page.locator('h1')).toContainText('Chequing(1)');

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();

    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page.getByRole('heading')).toContainText('Transaction');
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Test1');
    await page.getByRole('textbox', { name: 'Name' }).press('Tab');
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('200');
    await page.getByRole('spinbutton', { name: 'Amount' }).press('Tab');
    await page.getByRole('button', { name: 'Date' }).press('Tab');
    await page.getByRole('switch', { name: 'Expense' }).click();
    await page.getByRole('combobox', { name: 'Frequency' }).click();
    await page.getByRole('option', { name: 'OneTime' }).click();
    await page.getByRole('combobox', { name: 'Category' }).click();
    await page.getByRole('option', { name: 'Groceries Open menu' }).click();
    await page.getByRole('dialog').locator('div').filter({ hasText: 'GroceriesOpen menuRentOpen' }).first().press('Escape');
    await page.getByRole('button', { name: 'Create an Transaction' }).click();

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();

    await page.getByRole('button', { name: 'Open menu' }).focus();
    await page.getByRole('button', { name: 'Open menu' }).click({ delay: 100 });
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('button', { name: 'Open menu' }).click({ delay: 100 });

    const browser = page.context().browser();
    if (browser && (browser.browserType().name() === 'firefox' || browser.browserType().name() === 'webkit')) {
      if (browser.browserType().name() === 'webkit')
        await page.getByRole('button', { name: 'Open menu' }).focus();
      await page.getByRole('button', { name: 'Open menu' }).click({delay: 100});
    }

    await page.getByRole('menuitem', { name: 'Delete Transaction' }).click();

    await expect(page.getByLabel('Are you sure you want to')).toContainText('Cancel');
    await expect(page.getByLabel('Are you sure you want to')).toContainText('Delete');
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('cell', { name: 'No results.' })).toBeVisible();

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();
  });
});