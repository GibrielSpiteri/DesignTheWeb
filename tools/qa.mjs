#!/usr/bin/env node
// Static-site QA: serves a folder, crawls internal pages, and checks each page
// at desktop + mobile widths with Playwright.
//
// Usage:
//   node tools/qa.mjs <site-dir> [--out <dir>] [--max-pages 30] [--no-shots]
//
// Example:
//   node tools/qa.mjs site --out .qa/site
//
// Writes <out>/report.json and full-page screenshots, and prints a summary.
// Exit code is 1 when any "error" level issue is found.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
if (!args[0] || args[0].startsWith('--')) {
  console.error('usage: node tools/qa.mjs <site-dir> [--out dir] [--max-pages N] [--no-shots]');
  process.exit(2);
}
const root = path.resolve(args[0]);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i === -1 ? def : args[i + 1];
};
const outDir = path.resolve(opt('--out', path.join('.qa', path.basename(root))));
const maxPages = Number(opt('--max-pages', 30));
const shots = !args.includes('--no-shots');
fs.mkdirSync(outDir, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain',
  '.xml': 'application/xml', '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
];

const browser = await chromium.launch();
const report = { site: root, base, pages: [], issues: [] };
const issue = (level, page, viewport, msg) => report.issues.push({ level, page, viewport, msg });

const queue = ['/'];
const seen = new Set(queue);
const externalLinks = new Set();

while (queue.length && report.pages.length < maxPages) {
  const route = queue.shift();
  const pageInfo = { route, viewports: {} };
  report.pages.push(pageInfo);

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const consoleErrors = [];
    const failed = [];
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
    page.on('requestfailed', r => {
      if (r.url().startsWith(base)) failed.push(`${r.url().replace(base, '')} (${r.failure()?.errorText})`);
    });
    page.on('response', r => {
      if (r.url().startsWith(base) && r.status() >= 400) failed.push(`${r.url().replace(base, '')} -> ${r.status()}`);
    });

    let status = 0;
    try {
      const resp = await page.goto(base + route, { waitUntil: 'load', timeout: 30000 });
      status = resp ? resp.status() : 0;
    } catch (e) {
      issue('error', route, vp.name, 'navigation failed: ' + e.message);
      await ctx.close();
      continue;
    }
    if (status >= 400) issue('error', route, vp.name, `HTTP ${status}`);

    // Scroll through the page so scroll-triggered reveals fire, then return to top.
    await page.evaluate(async () => {
      const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
      const h = () => document.documentElement.scrollHeight;
      for (let y = 0; y < h(); y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
      window.scrollTo(0, h()); await new Promise(r => setTimeout(r, 600));
    });

    const facts = await page.evaluate(() => {
      const vis = el => { const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden'; };
      const hiddenText = [];
      // Text that is still invisible after scrolling through the page usually means a broken reveal animation.
      for (const el of document.querySelectorAll('h1,h2,h3,p,li,a,button')) {
        if (!vis(el) || !el.textContent.trim()) continue;
        if (el.closest('[aria-hidden="true"],[hidden],dialog:not([open]),.sr-only,.visually-hidden')) continue;
        let op = 1, n = el;
        while (n && n.nodeType === 1) { op *= parseFloat(getComputedStyle(n).opacity || '1'); n = n.parentElement; }
        const r = el.getBoundingClientRect();
        if (op < 0.05 && r.width > 0 && r.height > 0) hiddenText.push(el.tagName + ': ' + el.textContent.trim().slice(0, 60));
      }
      const doc = document.documentElement;
      const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'));
      return {
        title: document.title,
        metaDescription: document.querySelector('meta[name="description"]')?.content || '',
        viewportMeta: !!document.querySelector('meta[name="viewport"]'),
        lang: doc.getAttribute('lang') || '',
        h1Count: document.querySelectorAll('h1').length,
        imgsMissingAlt: [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).map(i => i.getAttribute('src')),
        brokenImages: [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.getAttribute('src')),
        overflowX: doc.scrollWidth > window.innerWidth + 1 ? doc.scrollWidth - window.innerWidth : 0,
        overflowCulprits: doc.scrollWidth > window.innerWidth + 1
          ? [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > window.innerWidth + 1 && r.width > 0; })
              .slice(0, 5).map(e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : ''))
          : [],
        hiddenText: hiddenText.slice(0, 10),
        hiddenTextCount: hiddenText.length,
        emptyHashLinks: links.filter(h => h === '#').length,
        telLinks: links.filter(h => h && h.startsWith('tel:')).length,
        forms: document.querySelectorAll('form').length,
        unlabeledInputs: [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea')]
          .filter(i => !(i.id && document.querySelector(`label[for="${i.id}"]`)) && !i.closest('label') && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby'))
          .map(i => i.name || i.id || i.type),
        links,
        height: doc.scrollHeight,
      };
    });

    for (const l of facts.links) {
      if (!l || l.startsWith('#') || l.startsWith('mailto:') || l.startsWith('tel:') || l.startsWith('sms:') || l.startsWith('javascript:')) continue;
      let u;
      try { u = new URL(l, base + route); } catch { issue('warn', route, vp.name, 'unparseable link ' + l); continue; }
      if (u.origin !== base) { externalLinks.add(u.href); continue; }
      let p = u.pathname;
      const fsPath = path.join(root, decodeURIComponent(p));
      const exists = fs.existsSync(fsPath) && (fs.statSync(fsPath).isFile() || fs.existsSync(path.join(fsPath, 'index.html')));
      if (!exists) { issue('error', route, vp.name, 'broken internal link: ' + l); continue; }
      const isPage = p.endsWith('/') || p.endsWith('.html') || (fs.statSync(fsPath).isDirectory());
      if (isPage && !seen.has(p) && vp.name === 'desktop') { seen.add(p); queue.push(p); }
    }

    if (consoleErrors.length) issue('error', route, vp.name, 'console errors: ' + consoleErrors.slice(0, 5).join(' | '));
    if (failed.length) issue('error', route, vp.name, 'failed requests: ' + [...new Set(failed)].slice(0, 8).join(', '));
    if (facts.brokenImages.length) issue('error', route, vp.name, 'broken images: ' + facts.brokenImages.join(', '));
    if (facts.overflowX) issue('error', route, vp.name, `horizontal overflow ${facts.overflowX}px (culprits: ${facts.overflowCulprits.join(', ')})`);
    if (facts.hiddenTextCount) issue('warn', route, vp.name, `${facts.hiddenTextCount} text elements still invisible after full scroll (reveal animation bug?): ${facts.hiddenText.slice(0, 4).join(' / ')}`);
    if (vp.name === 'desktop') {
      if (!facts.title) issue('error', route, vp.name, 'missing <title>');
      if (!facts.metaDescription) issue('warn', route, vp.name, 'missing meta description');
      if (!facts.viewportMeta) issue('error', route, vp.name, 'missing viewport meta');
      if (!facts.lang) issue('warn', route, vp.name, 'missing <html lang>');
      if (facts.h1Count !== 1) issue('warn', route, vp.name, `h1 count is ${facts.h1Count}`);
      if (facts.imgsMissingAlt.length) issue('warn', route, vp.name, 'img without alt: ' + facts.imgsMissingAlt.slice(0, 5).join(', '));
      if (facts.emptyHashLinks) issue('warn', route, vp.name, `${facts.emptyHashLinks} links with href="#"`);
      if (facts.unlabeledInputs.length) issue('warn', route, vp.name, 'form fields without labels: ' + facts.unlabeledInputs.join(', '));
    }

    let shot = null;
    if (shots) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      const slug = (route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/[\/]/g, '__').replace(/\.html$/, '')) || 'home';
      shot = path.join(outDir, `${slug}.${vp.name}.png`);
      await page.screenshot({ path: shot, fullPage: true }).catch(e => issue('warn', route, vp.name, 'screenshot failed: ' + e.message));
      const fold = path.join(outDir, `${slug}.${vp.name}.fold.png`);
      await page.screenshot({ path: fold }).catch(() => {});
    }
    const { links, ...rest } = facts;
    pageInfo.viewports[vp.name] = { status, consoleErrors, failed, screenshot: shot, ...rest };
    await ctx.close();
  }
}

// Reduced-motion pass on the home page: content must be visible without animations.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const hidden = await page.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll('h1,h2,p')) {
      let op = 1, x = el;
      while (x && x.nodeType === 1) { op *= parseFloat(getComputedStyle(x).opacity || '1'); x = x.parentElement; }
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0 && op < 0.05 && el.textContent.trim()) n++;
    }
    return n;
  });
  if (hidden) issue('warn', '/', 'reduced-motion', `${hidden} above-the-fold text elements invisible with prefers-reduced-motion`);
  await ctx.close();
}

await browser.close();
server.close();

report.externalLinks = [...externalLinks];
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

const errs = report.issues.filter(i => i.level === 'error');
const warns = report.issues.filter(i => i.level === 'warn');
console.log(`QA ${path.relative(process.cwd(), root) || root}: ${report.pages.length} page(s), ${errs.length} error(s), ${warns.length} warning(s)`);
for (const i of report.issues) console.log(`  [${i.level}] ${i.page} (${i.viewport}) ${i.msg}`);
console.log(`Report: ${path.join(outDir, 'report.json')}`);
process.exit(errs.length ? 1 : 0);
