// @ts-check
import { test, expect } from '@playwright/test';

test('page has title', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Transact/);
});

// hero section tests
test('page has heading', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Transact' })).toBeVisible();
});

test('page has free and open source link', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expects page to have a link with the name of Free and open source.
  await expect(page.getByRole('link', { name: 'Free and open source!' })).toBeVisible();
});

test('page has get started link', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expects page to have a link with the name of Get Started.
  await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
});

test('page has github link', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expects page to have a link with the name of Get Started.
  await expect(page.getByRole('link', { name: /GitHub/ })).toBeVisible();
});

// features section tests
test('page has features section', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expects page to have a section with the name of Features.
  await expect(page.getByRole('heading', { name: 'Features' })).toBeVisible();
});

// snapshot section tests
test('page has want more section', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expects page to have a section with the name of Want more?.
  await expect(page.getByRole('heading', { name: 'Want more?' })).toBeVisible();
});

// footer section tests
test('page has a fully open source heading', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expects page to have a heading with the name of Fully Open Source.
  await expect(page.getByRole('heading', { name: 'Fully Open Source' })).toBeVisible();
});

test('page has a github link', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expects page to have a link with the name of on Github.
  await expect(page.getByRole('link', { name: /on Github/ })).toBeVisible();
});

test('page has a all rights reserved text', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expects page to have a text with the name of All rights reserved.
  await expect(page.getByText('All rights reserved')).toBeVisible();
});