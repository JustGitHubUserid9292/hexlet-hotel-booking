import { test, expect } from '@playwright/test';
import { login } from '../fixtures/login';

const HOTEL_CARD_SELECTOR = '.hotel-card';

test.describe('Hotels Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/hotels');
  });

  test.skip('should show list of hotels', async ({ page }) => {
    await expect(page.locator(HOTEL_CARD_SELECTOR)).toHaveCountGreaterThan(0);
  });

  test.skip('should open hotel details page', async ({ page }) => {
    const firstHotel = page.locator(HOTEL_CARD_SELECTOR).first();
    await firstHotel.click();
    await expect(page).toHaveURL(/\/hotels\//);
    await expect(page.locator('.hotel-details')).toBeVisible();
  });

  test.skip('should search hotels if search input is present', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]');
    if (await searchInput.count()) {
      await searchInput.fill('Москва');
      await page.keyboard.press('Enter');
      await expect(page.locator(HOTEL_CARD_SELECTOR)).toHaveCountGreaterThan(0);
    }
  });
});