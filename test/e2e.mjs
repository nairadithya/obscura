import { chromium } from '@playwright/test';
import { Builder, By, until } from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox.js';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = `<!doctype html><a id="nav" href="/reels/">Reels</a><main id="main"><div class="x1lliihq" id="initial"><a href="/reels/initial/">initial</a></div><div class="x1lliihq" id="existing-card"></div><div id="watch-again" style="background-image:url(https://example.com/img.jpg)"><a href="/reel/example/"><div><div><div><div><span>Watch again on Instagram</span></div></div></div></div></a></div><div id="no-span" style="background-image:url(https://example.com/img.jpg)"><a href="/reel/example/"><div><div><div><div>Reel</div></div></div></div></a></div></main><script>const add=(id)=>{const d=document.createElement('div');d.className='x1lliihq';d.id=id;d.innerHTML='<a href="/reels/'+id+'/">'+id+'</a>';document.querySelector('#main').append(d)};window.addDynamic=()=>add('dynamic');window.addAnchorToExisting=()=>{const a=document.createElement('a');a.href='/reels/inserted/';document.querySelector('#existing-card').append(a)}</script>`;
const server = http.createServer((_req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(html); });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const url = 'http://www.instagram.com/';
const assert = (condition, message) => { if (!condition) throw new Error(message); };

let context;
try {
try {
  const extension = path.join(root, '.output/chrome-mv3');
  context = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true, args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`] });
  const isWelcomePage = page => page.url().endsWith('/get-started.html');
  const welcomePage = context.pages().find(isWelcomePage) ?? await context.waitForEvent('page', {
    predicate: isWelcomePage,
    timeout: 10000,
  });
  await welcomePage.waitForLoadState();
  assert(await welcomePage.title() === 'Welcome to Obscura', 'Chromium fresh install page should have the welcome title');
  const page = await context.newPage();
  await page.route('http://www.instagram.com/**', route => route.fulfill({ status: 200, contentType: 'text/html', body: html }));
  await page.goto(url);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#nav')).display === 'none', null, { timeout: 5000 });
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#initial')).display === 'none');
  assert(await page.locator('#initial').evaluate(el => getComputedStyle(el).display === 'none'), 'Chromium initial reel card should be hidden');
  assert(await page.locator('#watch-again').evaluate(el => getComputedStyle(el).display === 'none'), 'Chromium Watch again card should be hidden');
  assert(await page.locator('#no-span').evaluate(el => getComputedStyle(el).display !== 'none'), 'Chromium card without span should remain visible');
  await page.evaluate(() => window.addDynamic());
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#dynamic')).display === 'none');
  await page.evaluate(() => window.addAnchorToExisting());
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#existing-card')).display === 'none');
  console.log('Chromium extension behavior passed');
} finally { await context?.close(); }

const options = new firefox.Options();
options.setPreference('network.proxy.type', 1);
options.setPreference('network.proxy.http', '127.0.0.1');
options.setPreference('network.proxy.http_port', port);
options.setPreference('network.proxy.no_proxies_on', '');
// Keep Firefox from upgrading the fixture origin via its HSTS preload list.
options.setPreference('network.stricttransportsecurity.preloadlist', false);
let driver;
try {
  driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
  await driver.installAddon(path.join(root, '.output/firefox-mv2'), true);
  let welcomeHandle;
  await driver.wait(async () => {
    for (const handle of await driver.getAllWindowHandles()) {
      await driver.switchTo().window(handle);
      if (await driver.getCurrentUrl().then(url => url.endsWith('/get-started.html'))) welcomeHandle = handle;
    }
    return Boolean(welcomeHandle);
  }, 10000);
  await driver.switchTo().window(welcomeHandle);
  assert(await driver.getCurrentUrl().then(url => url.endsWith('/get-started.html')), 'Firefox fresh install should open the welcome page');
  const firefoxWelcomeHtml = fs.readFileSync(path.join(root, '.output/firefox-mv2/get-started.html'), 'utf8');
  assert(firefoxWelcomeHtml.includes('<title>Welcome to Obscura</title>'), 'Firefox welcome page should have the welcome title');
  await driver.get('http://www.instagram.com/');
  await driver.wait(until.elementLocated(By.id('nav')), 10000).catch(async error => { console.error('Firefox fixture diagnostic:', await driver.getCurrentUrl(), await driver.getTitle(), (await driver.getPageSource()).slice(0, 1000)); throw error; });
  await driver.wait(async () => await driver.executeScript("return getComputedStyle(document.querySelector('#nav')).display === 'none'"), 10000);
  assert(await driver.executeScript("return getComputedStyle(document.querySelector('#initial')).display === 'none'"), 'Firefox initial reel card should be hidden');
  assert(await driver.executeScript("return getComputedStyle(document.querySelector('#watch-again')).display === 'none'"), 'Firefox Watch again card should be hidden');
  assert(await driver.executeScript("return getComputedStyle(document.querySelector('#no-span')).display !== 'none'"), 'Firefox card without span should remain visible');
  await driver.executeScript('window.addDynamic()');
  await driver.wait(async () => await driver.executeScript("return getComputedStyle(document.querySelector('#dynamic')).display === 'none'"), 10000);
  await driver.executeScript('window.addAnchorToExisting()');
  await driver.wait(async () => await driver.executeScript("return getComputedStyle(document.querySelector('#existing-card')).display === 'none'"), 10000);
  console.log('Firefox extension behavior passed');
} finally { await driver?.quit(); }
} finally {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
