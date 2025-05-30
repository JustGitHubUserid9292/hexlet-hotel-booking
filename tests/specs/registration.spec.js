import { test, expect } from '@playwright/test';
import { generateUserData } from '../utils/generateUserData';
import { fillRegistrationForm } from '../fixtures/fillRegistrationForm';
test.describe('Registration', () => {

  test('Successful registration with valid data', async ({ page }) => {
    const user = generateUserData();

    await page.goto('/');

    await page.click('.profile');
    await page.waitForSelector('.modal-overlay.show .registration-form');

    await fillRegistrationForm(page, user)

    await page.click('.registration-form button.registration-confirm');

    const registerButton = page.locator('.registration-form button.registration-confirm');
    await expect(registerButton).toHaveClass(/success/)
  });

  test.describe('Valid registation form', () => {

    test('Empty fields output errors', async ({ page }) => {
      await page.goto('/');
      await page.click('.profile');
      await page.waitForSelector('.modal-overlay.show .registration-form');

      await page.click('.registration-form button.registration-confirm');

      await expect(page.locator('p.form-error-text', { hasText: /^Name is required$/ })).toBeVisible();
      await expect(page.locator('p.form-error-text', { hasText: 'Surname is required' })).toBeVisible();
      await expect(page.locator('p.form-error-text', { hasText: 'Email is required' })).toBeVisible();
      await expect(page.locator('p.form-error-text', { hasText: 'Password is required' })).toBeVisible();
      await expect(page.locator('p.form-error-text', { hasText: 'Confirm your password' })).toBeVisible();
    });

    test('Invalid email outputs error', async ({ page }) => {
      await page.goto('/');
      await page.click('.profile');
      await page.waitForSelector('.modal-overlay.show .registration-form');
      
      await fillRegistrationForm(page, {email: 'invalid'})

      await page.click('.registration-form button.registration-confirm');

      await expect(page.locator('p.form-error-text', { hasText: 'Invalid email' })).toBeVisible();;
    });

    test('Invalid password outputs error', async ({ page }) => {
      await page.goto('/');
      await page.click('.profile');
      await page.waitForSelector('.modal-overlay.show .registration-form');

      await fillRegistrationForm(page, {password: 'lol'})

      await page.click('.registration-form button.registration-confirm');

      await expect(page.locator('p.form-error-text', { hasText: 'Password must be at least 6 characters' })).toBeVisible();;
    });

  });

  test('Already in use email outputs error', async ({ page }) => {
    
    const existingEmail = 'dan_kapustin@mail.ru';

    await page.goto('/');
    await page.click('.profile');
    await page.waitForSelector('.modal-overlay.show .registration-form');

    await fillRegistrationForm(page, {email: existingEmail})

    await page.click('.registration-form button.registration-confirm');

    await expect(page.locator('p.form-error-text', { hasText: 'Email already in use' })).toBeVisible();;
  });

})