import { test, expect } from '@playwright/test';

test('homepage renders and matches layout', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Demon King Idle/i);

  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });

  const mainCanvas = page.getByTestId('game-root');
  await expect(mainCanvas).toBeVisible();

  await mainCanvas.screenshot({ path: 'screenshots/game-root.png' });
});

