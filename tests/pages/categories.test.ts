// @ts-check
import { test, expect } from '@playwright/test';
import { format } from 'date-fns';

test('page has title', async ({ page }) => {
  await page.goto('http://localhost:3000/categories/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Transact/);
});

// heading and section heading tests
test('page has "Categories" heading', async ({ page }) => {
  await page.goto('http://localhost:3000/categories/');

  // Expects page to have a heading with the name of Categories.
  await expect(page.locator('h1').filter({ hasText: "Categories" })).toBeVisible();
});

test('page has "Analysis" h2', async ({ page }) => {
  await page.goto('http://localhost:3000/categories/');

  // Expects page to have a heading with the name of Analysis.
  await expect(page.locator('h2').filter({ hasText: "Analysis" })).toBeVisible();
});

test('page has data range selector', async ({ page }) => {
  await page.goto('http://localhost:3000/categories/');

  let currentDate = new Date();
  let date = `${format(new Date(currentDate.getFullYear(), currentDate.getMonth()-1, currentDate.getDate()), 'MMM dd, yyyy')} - ${format(currentDate, 'MMM dd,')}`

  await expect(page.getByRole('button', { name: date })).toBeVisible();
  await page.getByRole('button', { name: date }).click();

  await expect(page.getByRole('dialog').locator('div').filter({ hasText: `${currentDate.getMonth()-1}` }).first()).toBeVisible();
  await page.getByRole('button', { name: date }).click();
  await expect(page.getByRole('button', { name: date })).toBeVisible();
});

test('page has add category button', async ({ page }) => {
  await page.goto('http://localhost:3000/categories/');

  await expect(page.getByRole('button', { name: 'Add Category' })).toBeVisible();

  await page.getByRole('button', { name: 'Add Category' }).click();

  await page.getByRole('textbox', { name: 'Name' }).waitFor({ state: 'visible' });

  await expect(page.getByRole('dialog', { name: 'Create a new Category' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Create a new Category' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Color' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: '#' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Create a Category' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
});

test.describe('category actions', () => {
  test('user can create a category', async ({ page }) => {
    await page.goto('http://localhost:3000/categories/');

    await page.getByRole('button', { name: 'Add Category' }).click();
    await page.getByRole('textbox', { name: 'Name' }).waitFor({ state: 'visible' });

    await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Name' }).focus();
    await page.getByRole('textbox', { name: 'Name' }).fill('Snacks');
    await page.getByRole('slider', { name: 'Color' }).click();
    await page.getByRole('slider', { name: 'Color' }).locator('div').first().click();
    await page.getByRole('button', { name: 'Create a Category' }).click();
    
    await expect(page.getByRole('cell', { name: 'Snacks' })).toBeVisible();
    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();
  });

  test('user can edit a category', async ({ page }) => {
    await page.goto('http://localhost:3000/categories/');

    await page.getByRole('row', { name: 'Groceries 0 Open menu' }).getByRole('button').click();
    await page.getByRole('row', { name: 'Groceries 0 Open menu' }).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Edit Category' }).click();
    await expect(page.getByRole('dialog', { name: 'Edit Groceries' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Groceries1');
    await page.getByRole('slider', { name: 'Color' }).click();
    await page.getByRole('button', { name: 'Edit Category' }).click();

    await expect(page.getByRole('cell', { name: 'Groceries1' })).toBeVisible();

    await page.getByRole('row', { name: 'Groceries1 0 Open menu' }).getByRole('button').click();
    await page.getByRole('row', { name: 'Groceries1 0 Open menu' }).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Edit Category' }).click();
    
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Groceries1');

    // webkit has a different color value when color picker is selected
    const browser = page.context().browser();
    if (browser && browser.browserType().name() === 'webkit') {
      await expect(page.getByRole('textbox', { name: '#' })).toHaveValue('#408058');
    } else {
      await expect(page.getByRole('textbox', { name: '#' })).toHaveValue('#408057');
    }

    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();
  });

  test('user can delete a category', async ({ page }) => {
    await page.goto('http://localhost:3000/categories/');

    await page.getByRole('row', { name: 'Groceries 0 Open menu' }).getByRole('button').click();
    await page.getByRole('row', { name: 'Groceries 0 Open menu' }).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Delete Category' }).click();
    await expect(page.getByRole('alertdialog', { name: 'Are you sure you want to' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();

    await page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('button').click();

    // check if category is deleted
    await expect(page.locator('td').filter({ hasText: 'Groceries' }).first()).toBeHidden();
  });
});

test.describe('Categories Cards', () => {
  test('page has most used categories card', async ({ page }) => {
    await page.goto('http://localhost:3000/categories');

    await expect(page.locator('div').filter({ hasText: /^Most Used CategoryBy number of transactions$/ }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^No transactions$/ }).first()).toBeVisible();
  });

  test('page has highest valued categories card', async ({ page }) => {
    await page.goto('http://localhost:3000/categories');

    await expect(page.locator('div').filter({ hasText: /^Highest Valued CategoryBy total amount$/ }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^No transactions$/ }).first()).toBeVisible();
  });
});

test('page has category pie chart', async ({ page }) => {
  await page.goto('http://localhost:3000/categories');

  await expect(page.getByText('Transactions by CategoryDistribution of transactions (income & expenses) across')).toBeVisible();
  await expect(page.locator('.recharts-surface')).toBeVisible();
});

test('page has category list', async ({ page }) => {
  await page.goto('http://localhost:3000/categories');

  await expect(page.locator('#top div').filter({ hasText: 'NameUsageGroceries0Open' }).nth(2)).toBeVisible();
});