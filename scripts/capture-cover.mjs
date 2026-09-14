import { readFile, mkdir, writeFile, rename, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const output = new URL('docs/screenshots/cover.png', root);
const temporary = new URL('docs/screenshots/cover.tmp.png', root);
const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help')) {
  console.log('Usage: node scripts/capture-cover.mjs\n\nRender the checked-in alias mappings and controller to docs/screenshots/cover.png.\nRequires Node 22+, npm ci, and npx playwright install chromium. No environment variables.\nExit status: 0 success, 1 capture failure, 2 usage error, 3 missing dependency.');
  process.exit(0);
}
if (args.length) {
  console.error('capture-cover: unexpected argument; see --help');
  process.exit(2);
}
const { chromium } = await import('playwright').catch((error) => {
  console.error(`capture-cover: run npm ci first: ${error.message}`);
  process.exit(3);
});
const escape = (text) => text.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
let browser;
try {
  const sources = await Promise.all(['aliases-example.json', 'cartridge/controllers/Static.js'].map(async (path) => ({
    path, text: await readFile(new URL(path, root), 'utf8'),
  })));
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.route('**/*', (route) => route.abort());
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>plugin_rootfile - cartridge source</title>
    <style>body{margin:0;background:#14171c;color:#d9dfe6;font:18px/1.6 Menlo,monospace}main{padding:36px 44px}header{font-size:23px;margin-bottom:28px;color:#f4f6f8}.path{color:#8fbcbb}section{border-top:1px solid #343b45;padding-top:18px;margin-top:26px}pre{margin:10px 0;white-space:pre-wrap;overflow-wrap:anywhere;font:15px/1.5 Menlo,monospace}h1{font-size:24px;margin:0 0 8px}p{color:#aab4bf;margin:0 0 18px;font-size:16px}.layout{display:grid;grid-template-columns:1fr 1.05fr;gap:42px}.prompt{color:#a3be8c}</style>
    </head><body><main><header><span class="path">plugin_rootfile</span> / repository example</header><h1>Serve cartridge files at root and custom paths</h1><p>The checked-in alias mappings and their SFRA controller</p><div class="layout">
    ${sources.map(({ path, text }) => `<section><div class="prompt">$ cat ${escape(path)}</div><pre>${escape(text)}</pre></section>`).join('')}
    </div></main></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const rendered = await page.locator('pre').allTextContents();
  if (sources.some(({ text }, index) => text !== rendered[index])) throw new Error('Rendered source differs from repository files');
  if (await page.evaluate(() => document.documentElement.scrollHeight > innerHeight || document.documentElement.scrollWidth > innerWidth)) {
    throw new Error('Source has outgrown the cover framing; adjust the layout before publishing');
  }
  await mkdir(new URL('docs/screenshots/', root), { recursive: true });
  await writeFile(temporary, await page.screenshot({ animations: 'disabled' }));
  await rename(temporary, output);
  console.log(`Captured repository source: ${fileURLToPath(output)}`);
} catch (error) {
  console.error(`capture-cover: ${error.stack ?? error}`);
  process.exitCode = /Executable doesn't exist/.test(error.message) ? 3 : 1;
} finally {
  await browser?.close();
  await rm(temporary, { force: true });
}
