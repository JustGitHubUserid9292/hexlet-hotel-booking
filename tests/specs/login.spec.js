import { test, expect } from '@playwright/test';
import { login } from "../fixtures/login.js";

test('user can log in', async ({ page }) => {

    await page.goto('/')

    await login(page)

    await page.click('.profile')

    await expect(page).toHaveURL(/.*\/profile/)

    await expect(page.locator('text=Daniil Kapustin')).toBeVisible();
    await expect(page.locator('text=dan_kapustin@mail.ru')).toBeVisible();
})