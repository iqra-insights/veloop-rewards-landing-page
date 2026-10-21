import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const out = process.env.QA_OUTPUT || '/tmp/veloop-qa';
await fs.mkdir(out, { recursive: true });
const server = await createServer({ server: { host: '127.0.0.1', port: 5188, strictPort: true } });
await server.listen();
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.BROWSER_EXECUTABLE || undefined,
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1080 },
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const base = 'http://127.0.0.1:5188';
async function go(route) {
  await page.goto(base + route);
  await page.locator('h1').waitFor();
  await page.evaluate(() => document.fonts.ready);
}
async function stored() {
  return JSON.parse(await page.evaluate(() => localStorage.getItem('veloop-demo-v1')));
}
async function available() {
  const s = await stored();
  return s.transactions.reduce(
    (a, t) => a + (['Credited', 'Under review'].includes(t.status) ? t.amount : 0),
    0,
  );
}
try {
  if (!process.env.AUDIT_ONLY) {
    await go('/');
    assert.match(await page.locator('h1').innerText(), /Make your everyday/);
    await page.screenshot({ path: path.join(out, 'landing-desktop.png'), fullPage: true });
    await page.getByRole('link', { name: 'Find your loop', exact: true }).first().click();
    await page.getByRole('heading', { level: 1, name: /Good things are/ }).waitFor();
    await page.screenshot({ path: path.join(out, 'dashboard-desktop.png'), fullPage: true });
    assert.equal(await available(), 1250);
    await page.getByRole('button', { name: 'Claim daily reward' }).click();
    assert.equal(await available(), 1300);
    assert.equal(await page.getByRole('button', { name: 'Checked in today' }).isDisabled(), true);
    await go('/app/earn');
    await page.getByRole('button', { name: 'Explore task' }).first().click();
    await page.getByRole('dialog').waitFor();
    await page.getByRole('button', { name: 'Complete demo task' }).click();
    assert.equal(await available(), 1450);
    assert.equal((await stored()).completed.length, 1);
    await page.reload();
    await page.locator('h1').waitFor();
    assert.equal((await stored()).completed.length, 1);
    await page.getByRole('textbox', { name: 'Search tasks' }).fill('xyz-nothing');
    assert.equal(await page.getByText('A fresh search might help').isVisible(), true);
    await go('/app/missions');
    await page.getByRole('button', { name: 'Claim milestone' }).click();
    assert.equal(await available(), 1500);
    await go('/app/referrals');
    await page.getByRole('button', { name: 'Simulate a friend’s activation' }).click();
    await page.getByRole('button', { name: 'Simulate activation', exact: true }).click();
    assert.equal(await available(), 1750);
    await go('/app/wallet');
    await page.getByRole('button', { name: 'Try a redemption' }).click();
    await page.getByRole('spinbutton', { name: 'Amount in VEs' }).fill('300');
    await page.getByRole('button', { name: 'Create demo request' }).click();
    assert.equal(await available(), 1450);
    await page.getByRole('button', { name: 'Details for Demo redemption' }).click();
    await page.getByRole('button', { name: 'Cancel demo request' }).click();
    assert.equal(await available(), 1750);
    const dl = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export CSV' }).click();
    assert.equal((await dl).suggestedFilename(), 'veloop-demo-transactions.csv');
    await go('/app/settings');
    await page.getByRole('textbox', { name: 'Display name' }).fill('Demo Explorer');
    await page.getByRole('button', { name: 'Save changes' }).click();
    assert.equal((await stored()).profile.name, 'Demo Explorer');
    await page.getByRole('switch', { name: 'Dark appearance' }).click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.screenshot({ path: path.join(out, 'settings-dark.png') });
    await page.getByRole('switch', { name: 'Dark appearance' }).click();
    await go('/app/spin');
    await page.getByRole('button', { name: 'Spin for a little surprise' }).click();
    await page.getByRole('button', { name: 'Come back tomorrow' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Come back tomorrow' }).isDisabled(), true);
    assert.ok((await stored()).spinResult >= 25);
    await page.clock.install();
    await go('/app/session');
    await page.getByRole('button', { name: 'Start a 60-second session' }).click();
    await page.clock.fastForward(61000);
    await page.getByRole('button', { name: 'Claim session reward' }).click();
    assert.equal((await stored()).session.claimed, true);
    await page.clock.resume();
    await go('/app/help');
    await page.getByRole('textbox', { name: 'Search help' }).fill('real money');
    await page.getByText('Can I withdraw real money?', { exact: true }).waitFor();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Sample wallet question');
    await page
      .getByRole('textbox', { name: 'Your question' })
      .fill('This is a local test of the support request form.');
    await page.getByRole('button', { name: 'Save demo request' }).click();
    assert.equal((await stored()).tickets.length, 1);
    await go('/dashboard');
    await page.getByRole('heading', { level: 1, name: /See the story/ }).waitFor();
    assert.equal(new URL(page.url()).pathname, '/app/analytics');
    await page.getByRole('button', { name: 'Bars', exact: true }).click();
    await go('/');
    await page.getByRole('textbox', { name: 'Your email · demo only' }).fill('demo@example.com');
    await page.getByRole('checkbox', { name: /I agree/ }).check();
    await page.getByRole('button', { name: 'Try signup' }).click();
    await page.getByText('Your example signup is saved locally.').waitFor();
    console.log(
      'PASS: complete demo journey, persistence, CSV, settings, spin, timed session, support and waitlist',
    );
  }
  const routes = [
    '/',
    '/features',
    '/rewards-wallet',
    '/about',
    '/help',
    '/privacy',
    '/terms',
    '/app',
    '/app/earn',
    '/app/wallet',
    '/app/missions',
    '/app/session',
    '/app/spin',
    '/app/referrals',
    '/app/leaderboard',
    '/app/analytics',
    '/app/help',
    '/app/settings',
  ];
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await go(route);
      const dims = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      assert.ok(
        dims.scroll <= dims.width + 1,
        `Horizontal overflow at ${width}px on ${route}: ${JSON.stringify(dims)}`,
      );
    }
    console.log(`PASS: ${routes.length} routes at ${width}px without horizontal page overflow`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await go('/app');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation', { name: 'Member navigation' })
    .getByRole('link', { name: 'My wallet' })
    .click();
  await page.getByRole('heading', { level: 1, name: /Your rewards/ }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Close navigation' }).isVisible(), false);
  await go('/');
  await page.screenshot({ path: path.join(out, 'landing-mobile.png'), fullPage: true });
  await go('/app');
  await page.screenshot({ path: path.join(out, 'dashboard-mobile.png'), fullPage: true });
  const audits = [];
  for (const route of ['/', '/app', '/app/wallet', '/app/settings']) {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await go(route);
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const result = await page.evaluate(async () => {
      const r = await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      });
      return r.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      }));
    });
    audits.push({ route, violations: result });
  }
  await fs.writeFile(path.join(out, 'accessibility.json'), JSON.stringify(audits, null, 2));
  await go('/not-a-page');
  await page.getByRole('heading', { name: 'This page is out of the loop.' }).waitFor();
  assert.deepEqual(errors, [], 'No unhandled browser errors');
  console.log('PASS: mobile navigation, route fallback and zero unhandled browser errors');
  console.log('Accessibility audit:', path.join(out, 'accessibility.json'));
} finally {
  await context.close();
  await browser.close();
  await server.close();
}
