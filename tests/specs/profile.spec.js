import { test, expect } from '@playwright/test';
import { login } from '../fixtures/login';

const updatedUser = {
  name: 'Алексей',
  surname: 'Иванов'
};

test.describe('User Profile', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/profile');
  });

  test.skip('should show current user information', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toHaveValue(/\w+/);
    await expect(page.locator('input[name="surname"]')).toHaveValue(/\w+/);
    await expect(page.locator('input[name="id"]')).toBeVisible();
  });

  test.skip('should allow user to update name and surname', async ({ page }) => {
    await page.fill('input[name="name"]', updatedUser.name);
    await page.fill('input[name="surname"]', updatedUser.surname);
    await page.click('button.save-profile');

    await expect(page.locator('button.save-profile')).toHaveClass(/success/);
    await page.reload();
    await expect(page.locator('input[name="name"]')).toHaveValue(updatedUser.name);
    await expect(page.locator('input[name="surname"]')).toHaveValue(updatedUser.surname);
  });

  test.skip('should log out user', async ({ page }) => {
    await page.click('button.logout');
    await expect(page.locator('.signin-form')).toBeVisible();
  });
});