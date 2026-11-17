// Drives the professional development page and the list export in a browser, on the preview page.
// Usage: node test/growth.ui.test.js <preview.html>
//   The preview is built with: AP_FIXTURE=test/fixtures/mini-main.json AP_PREVIEW_OUT=<preview.html> node build.js
// Note: $eval / $$eval / evaluate below are Playwright's page-inspection methods, run inside the test browser only.
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const b = await chromium.launch();
  const html = fs.readFileSync(process.argv[2], 'utf8');
  const doc = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
    '<style>body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + html + '</body></html>';
  const errs = [];
  let failed = 0;
  const check = (ok, what) => { console.log((ok ? 'ok   ' : 'FAIL ') + what); if (!ok) failed++; };
  const p = await b.newPage({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  // A web font that cannot be fetched (no network where the test runs) is not an error of the page.
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
  p.on('pageerror', e => errs.push('PAGEERROR ' + e));
  const settle = () => p.waitForTimeout(500);
  try {
    await p.setContent(doc, { waitUntil: 'load' });
    await p.waitForSelector('#loginBtn', { timeout: 8000 });
    await p.waitForTimeout(500);
    await p.click('#loginBtn');
    await p.waitForSelector('.cv-card[data-school="intl"]', { timeout: 8000 });
    await p.click('.cv-card[data-school="intl"]');
    await settle();

    // Professional development: the page opens from the menu, an admin adds an item, moves it along and removes it
    check(await p.$('.navlist button[data-view="growth"]') !== null, 'the menu offers the professional development page');
    await p.click('.navlist button[data-view="growth"]');
    await p.waitForSelector('#devForm', { timeout: 5000 });
    check(await p.$('#devTable') === null, 'an empty section shows no table');
    const people = await p.$$eval('#devWho option', els => els.map(e => e.value).filter(Boolean));
    check(people.length > 0, 'the form offers the staff of the admin\'s stages (' + people.length + ')');
    await p.click('#devAdd');
    await settle();
    check(await p.$('#devTable') === null, 'an item without a person is refused');
    await p.selectOption('#devWho', people[0]);
    await p.fill('#devTitleIn', 'Classroom management course');
    await p.fill('#devDueIn', '2026-12-15');
    await p.click('#devAdd');
    await p.waitForSelector('#devTable tbody tr', { timeout: 5000 });
    const row = await p.$eval('#devTable tbody tr', e => e.textContent);
    check(/Classroom management course/.test(row) && /2026-12-15/.test(row), 'the new item appears in the table with its date');
    const before = await p.textContent('#devCounts');
    await p.selectOption('#devTable tbody tr select', 'done');
    await settle();
    const after = await p.textContent('#devCounts');
    check(before !== after && await p.$eval('#devTable tbody tr select', e => e.value) === 'done', 'changing the state updates the row and the counts');
    await p.click('#devTable tbody tr button');
    await settle();
    check(await p.$('#devTable') === null, 'deleting the last item empties the table');

    // The programme list downloads as a file Excel reads
    await p.click('.navlist button[data-view="programs"]');
    await p.waitForSelector('#exportList', { timeout: 5000 });
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }), p.click('#exportList')]);
    const file = await dl.path(), bytes = fs.readFileSync(file), text = bytes.toString('utf8');
    check(/^programmes-.*\.csv$/.test(dl.suggestedFilename()), 'the export is a dated CSV file (' + dl.suggestedFilename() + ')');
    check(bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF, 'it starts with the mark Excel needs to read Arabic');
    const lines = text.split('\r\n');
    check(lines.length > 2 && lines[1].split(',').length >= 12, 'it holds a heading row and one row per programme (' + (lines.length - 1) + ' rows)');

    check(errs.length === 0, 'no console errors ' + JSON.stringify(errs.slice(0, 3)));
  } catch (e) { check(false, 'the run stopped: ' + String(e && e.message).split('\n')[0]); }
  await b.close();
  console.log(failed ? failed + ' failed' : 'all passed');
  process.exit(failed ? 1 : 0);
})();
