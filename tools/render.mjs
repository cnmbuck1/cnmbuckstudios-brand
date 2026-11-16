// Writes the reference PNGs in assets/ by drawing them with the brand kit in headless Chromium.
// Usage from the repo root: npm install, then npm run render (needs Playwright's Chromium).
import { createServer } from 'vite';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const server = await createServer({ root, configFile: false, logLevel: 'error', server: { port: 5198 } });
await server.listen();
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error(e));
  await page.goto('http://localhost:5198/tools/render.html');
  await page.waitForFunction(() => window.assets, null, { timeout: 60000 });
  const assets = await page.evaluate(() => window.assets);
  for (const [path, data] of Object.entries(assets)) {
    mkdirSync(dirname(resolve(root, path)), { recursive: true });
    writeFileSync(resolve(root, path), Buffer.from(data, 'base64'));
    console.log('wrote', path);
  }
} finally {
  await browser.close();
  await server.close();
}
