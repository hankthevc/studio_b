import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.resolve(__dirname, '..', 'miniapps-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

test.describe('Mini app visual baselines', () => {
  for (const app of manifest.apps ?? []) {
    const slug = app.slug;
    const category = (app.category || '').toLowerCase();

    test(`${slug} renders on mobile and desktop`, async ({ page }) => {
      await page.goto(`/${category}/${slug}/index.html`, { waitUntil: 'networkidle' });
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(page).toHaveScreenshot(`${slug}-mobile.png`, { fullPage: true, timeout: 20_000 });
      await page.setViewportSize({ width: 1280, height: 800 });
      await expect(page).toHaveScreenshot(`${slug}-desktop.png`, { fullPage: true, timeout: 20_000 });
    });
  }
});
