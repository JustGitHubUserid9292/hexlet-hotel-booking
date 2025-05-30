import { test, expect } from '@playwright/test';
import { fillLoginForm } from '../fixtures/fillLoginForm';

test.describe('Login form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('.profile'); 
    await page.click('.reg-check a'); 
    await expect(page.locator('.modal-overlay.show .signin-form')).toBeVisible();
  });

  test('Successful login with valid data', async ({ page }) => {
    await fillLoginForm(page);
    const loginButton = page.locator('.signin-form button.signin-confirm');
    await loginButton.click();

    await expect(loginButton).toHaveClass(/success/,);
    await expect(page.locator('#root modal-overlay')).toHaveCount(0);
  });

  test('Invalid password outputs error', async ({ page }) => {
    await fillLoginForm(page, {password: 'invalid'});
    await page.click('.signin-form button.signin-confirm');
    
    const errors = page.locator('p.form-error-text', { hasText: 'Incorrect password or email' });
    await expect(errors).toHaveCount(2); 
    await expect(errors.nth(0)).toBeVisible();
    await expect(errors.nth(1)).toBeVisible();
  });

  test('Empty fields output error', async ({ page }) => {
    await page.click('.signin-form button.signin-confirm');

    await expect(page.locator('p.form-error-text', { hasText: 'Email is required' })).toBeVisible();
    await expect(page.locator('p.form-error-text', { hasText: 'Password is required' })).toBeVisible();
  });

  test('Move to profile after login', async ({ page }) => {
    await fillLoginForm(page);
    await page.click('.signin-form button.signin-confirm');
    await page.waitForSelector('.modal-overlay.show .signin-form', { state: 'detached' });
    await page.click('.profile'); 

    await expect(page).toHaveURL(/.*\/profile/);
    await expect(
        page.locator('.profile-page-field', { hasText: 'Email:' }).locator('.profile-page-value')
      ).toHaveText('dan_kapustin@mail.ru');
  });
});