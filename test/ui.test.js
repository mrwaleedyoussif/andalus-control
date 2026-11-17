// Drives the preview page in a browser: start page, sign-in, school choice, every screen, undo and redo, phone width.
// Usage: node test/ui.test.js <preview.html> <screenshot-dir>
// Note: $eval / $$eval / evaluate below are Playwright's page-inspection methods, run inside the test browser only. No eval() of data.
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const b = await chromium.launch();
  const html = fs.readFileSync(process.argv[2], 'utf8');
  const out = process.argv[3];
  const doc = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
    '<style>body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + html + '</body></html>';
  const errs = [];
  let failed = 0;
  const check = (ok, what) => { console.log((ok ? 'ok   ' : 'FAIL ') + what); if (!ok) failed++; };
  const open = async (w, hgt, scheme, motion) => {
    const p = await b.newPage({ viewport: { width: w, height: hgt }, colorScheme: scheme, deviceScaleFactor: 1, reducedMotion: motion ? 'no-preference' : 'reduce' });
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('pageerror', e => errs.push('PAGEERROR ' + e));
    await p.setContent(doc, { waitUntil: 'load' });
    await p.waitForSelector('#loginBtn', { timeout: 8000 });
    await p.waitForTimeout(500);
    return p;
  };
  const noSideScroll = async (p, tag) => {
    const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    check(o.sw <= o.cw, tag + ': no sideways scroll');
  };
  const count = (p, sel) => p.$$eval(sel, els => els.length);
  const texts = (p, sel) => p.$$eval(sel, els => els.map(e => e.textContent));
  const title = p => p.textContent('#pageTitle');
  const nav = async (p, v) => { await p.click('.navlist button[data-view="' + v + '"]'); await p.waitForTimeout(350); };
  const settle = p => p.waitForTimeout(450);     // the sample backend answers after 180 ms
  const isOff = (p, id) => p.$eval(id, e => e.disabled);
  const shot = (p, name) => p.screenshot({ path: out + '/' + name + '.png' });

  // ---- opening motion on the start page ----
  const m = await open(1280, 900, 'light', true);
  const names = () => m.evaluate(() => Array.from(new Set(document.getAnimations().map(a => a.animationName))).sort().join());
  check(await m.$eval('.cv.start', e => e.classList.contains('intro')), 'the start page opens with its motion');
  const playing = await names();
  check(['cv-bloom', 'cv-pop', 'cv-rise', 'cv-draw', 'cv-spin', 'cv-glow'].every(n => playing.includes(n)), 'the star blooms, the logos and text rise in, the line draws itself (' + playing + ')');
  check((await m.$$eval('.petals .petal', els => els.length)) === 8 && (await m.$$eval('.cv-disc img', els => els.length)) === 2, 'both logos sit on one disc inside the eight-pointed star');
  const corner = await m.$$eval('.cv-disc img', els => els.map(img => { const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(2, 2, 1, 1).data[3]; }));
  check(corner.every(a => a === 0), 'the logos have no white box: their backgrounds are transparent');
  const slow = await m.evaluate(() => { const a = document.getAnimations().filter(x => x.animationName !== 'cv-spin' && x.animationName !== 'cv-glow').map(x => { const t = x.effect.getComputedTiming(); return t.delay + t.duration; }); return Math.max.apply(null, a); });
  check(slow >= 3500 && slow <= 5000, 'the opening is unhurried: it takes about four seconds (' + Math.round(slow) + ' ms)');
  await m.waitForTimeout(4700);
  check((await m.$eval('#coverTitle', e => getComputedStyle(e).opacity)) === '1' && (await m.$eval('#loginBtn', e => getComputedStyle(e).opacity)) === '1' && (await m.$eval('.petal', e => getComputedStyle(e).opacity)) === '1', 'when the motion ends everything is fully shown');
  const sizes = await m.evaluate(() => { const w = s => Math.round(document.querySelector(s).getBoundingClientRect().width); return { disc: w('.cv-disc'), intl: w('.l-intl'), priv: w('.l-priv'), natural: document.querySelector('.l-intl').naturalWidth }; });
  check(sizes.disc >= 480 && sizes.intl >= 330 && sizes.priv >= 210 && sizes.natural >= 2 * sizes.intl, 'the logos are large and sharp: ' + JSON.stringify(sizes));
  const words = (await m.$eval('.cv-text', e => e.innerText)).trim().split(/\s+/).length;
  check(words <= 24 && (await m.$$eval('.cv.start .cv-tag', els => els.length)) === 0, 'the welcome page carries little text (' + words + ' words)');
  await noSideScroll(m, 'start page while the star turns');
  await shot(m, '0-start-motion');
  await m.click('.cv-tool[data-tool="lang"]');
  await m.waitForTimeout(200);
  check(!(await m.$eval('.cv.start', e => e.classList.contains('intro'))), 'switching language does not replay the opening');
  await m.click('.cv-tool[data-tool="lang"]');
  await m.click('#loginBtn');
  await m.waitForSelector('.cv-card');
  await m.click('.cv-tool[data-tool="out"]');
  await m.waitForSelector('#loginBtn');
  check(await m.$eval('.cv.start', e => e.classList.contains('intro')), 'signing out returns to the welcome, with its motion again');
  await m.close();

  // ---- start page: the cover, the slogan, a welcome and sign-in, nothing else ----
  const p = await open(1280, 900, 'light');
  check((await p.evaluate(() => document.getAnimations().length)) === 0 && (await p.$eval('#coverTitle', e => getComputedStyle(e).opacity)) === '1', 'nothing moves for people who ask their device to reduce motion');
  check(await p.$eval('#app', e => e.classList.contains('cover')), 'the start page is the cover');
  check((await p.textContent('#slogan')).length > 10 && (await p.textContent('#welcome')).length > 10 && (await p.textContent('#coverTitle')) === 'مسار الإنجاز', 'it shows the title, the school slogan and a welcome');
  check(await p.$$eval('.cv-logos img', els => els.length === 2 && els.every(i => i.complete && i.naturalWidth > 100)), 'both school logos load');
  check((await count(p, '.cv-card')) === 0 && (await count(p, '.tile')) === 0 && (await count(p, '.prow')) === 0, 'no school data is shown before sign-in');
  check((await p.$eval('.rail', e => getComputedStyle(e).display)) === 'none' && (await p.$eval('#top', e => getComputedStyle(e).display)) === 'none', 'no menus before sign-in');
  await p.click('.cv-tool[data-tool="lang"]');
  await p.waitForTimeout(250);
  check((await p.textContent('#coverTitle')) === 'Pathway to Achievement' && (await p.textContent('#loginBtn')).trim() === 'Sign in' && (await p.textContent('#welcome')).startsWith('Welcome. Every achievement'), 'in English the start page shows the English title, welcome and sign-in button');
  await p.click('.cv-tool[data-tool="lang"]');
  await p.waitForTimeout(250);
  check((await p.textContent('#loginBtn')).trim() === 'تسجيل الدخول' && (await p.textContent('#welcome')).startsWith('أهلاً بك، كل إنجاز'), 'and switches back to Arabic');
  await noSideScroll(p, 'start page');
  await shot(p, '0-start');

  // ---- after sign-in: choose the school ----
  await p.click('#loginBtn');
  await p.waitForSelector('.cv-card');
  check((await count(p, 'button.cv-card')) === 2, 'after sign-in the two schools are offered');
  check(await p.$$eval('.cv-card .logo img', els => els.every(i => i.complete && i.naturalWidth > 100)), 'school cards carry the logos');
  await noSideScroll(p, 'school chooser');
  await shot(p, '1-chooser');
  await p.click('.cv-card[data-school="intl"]');
  await p.waitForSelector('#tiles .tile');
  const tiles = await p.$$eval('#tiles .tile', els => els.map(e => e.querySelector('.n').textContent + ' ' + e.querySelector('.l').textContent));
  console.log('tiles:', tiles);
  check(tiles[0].startsWith('400 '), 'choosing the international school limits everything to its two stages');
  check((await p.$eval('#schoolPick', e => e.value)) === 'intl' && (await count(p, '#stagePick option')) === 3, 'school and stage pickers follow the choice');
  check((await count(p, '.navlist button')) === 15, 'an admin sees fifteen menu items');
  const idp = await p.$eval('.navlist a.navlink', a => [a.getAttribute('href'), a.target, a.rel, a.textContent].join('|'));
  check((await count(p, '.navlist a.navlink')) === 1 && idp === 'https://andalus-idp.online/|_blank|noopener noreferrer|منصة التطور المهني' && (await count(p, '#homeLinks a[data-link]')) === 1,
    'admins get a button to the professional development platform, in the menu and on the home page; it opens in a new tab');
  await noSideScroll(p, 'home');
  await shot(p, '2-home');

  // ---- progress monitor: rings inside rings ----
  const nums = () => p.$$eval('#tiles .tile', els => els.map(e => +e.querySelector('.n').textContent));
  check((await p.$$eval('#monitor .ring', els => els.map(e => e.dataset.ring).join())) === 'done,active,soon,overdue', 'the monitor has four rings, one inside the other: done, in progress, starting soon, overdue');
  check((await p.$$eval('#tiles .tile', els => els.map(e => e.dataset.state || '').join())) === ',done,active,soon,overdue,', 'each ring has a tile of the same state as its label');
  const n0 = await nums(), rest = (await p.textContent('#monRest')).match(/\d+/g).map(Number);
  check(n0[1] + n0[2] + n0[3] + n0[4] + rest[0] + rest[1] === n0[0], 'the six states add up to the total (' + n0.slice(1, 5).concat(rest).join(' + ') + ' = ' + n0[0] + ')');
  const arcLen = st => p.$eval('#monitor .ring[data-ring="' + st + '"] .ring-arc', e => { const d = e.getAttribute('stroke-dasharray').split(' ').map(Number); return d[0] / d[1]; });
  check(Math.abs((await arcLen('overdue')) - n0[4] / n0[0]) < 0.01 && Math.abs((await arcLen('done')) - n0[1] / n0[0]) < 0.01, "each arc's length is that state's share of the total");
  const shades = await p.$$eval('#monitor .ring[data-ring="active"] .ring-arc', els => els.map(e => e.getAttribute('class').match(/ga(\d)/)[1]));
  check(shades.length >= 2 && new Set(shades).size === shades.length, 'the in-progress ring is drawn in graded shades of blue (' + shades.join(',') + ')');
  const colours = await p.evaluate(() => { const g = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim(); return [g('--done-fill'), g('--act-1'), g('--act-5'), g('--soon-fill'), g('--late-fill')].join(); });
  check(colours === '#28AD5E,#72ADFB,#0047A6,#BE5A0A,#941328', 'green for done, light to deep blue for progress, dark orange for starting soon, dark red for overdue');
  check((await p.textContent('#monNum')) === Math.round(n0[1] * 100 / n0[0]) + '%' && (await p.textContent('#monLabel')) === 'مكتمل', 'the centre shows the share completed');
  await p.hover('#tiles .tile[data-state="overdue"]');
  check((await p.textContent('#monNum')) === Math.round(n0[4] * 100 / n0[0]) + '%' && (await p.textContent('#monLabel')) === 'متأخر' && (await p.$eval('#monitor .ring[data-ring="overdue"]', e => e.classList.contains('hot'))), 'pointing at a tile reads that state out in the centre and highlights its ring');
  await p.hover('#monitor .ring[data-ring="active"] .ring-hit', { position: { x: 3, y: 130 }, force: true }).catch(() => {});
  await p.mouse.move(5, 5);
  await p.waitForTimeout(100);
  check((await p.textContent('#monLabel')) === 'مكتمل', 'and it returns to the share completed');
  await shot(p, '2b-monitor');
  await p.click('#monitor .tabs [data-tab="indicators"]');
  await p.waitForTimeout(200);
  const ni = await nums();
  check(ni[0] === 18 && ni[1] + ni[2] + ni[3] + ni[4] <= 18, 'the monitor can count whole indicators instead (' + ni.slice(0, 5).join(', ') + ')');
  await p.click('#tiles .tile[data-state="overdue"]');
  await p.waitForSelector('#ipickChip');
  check((await count(p, '#indRows .irow')) === ni[4] && (await p.$$eval('#indRows .pcw', els => els.every(e => e.dataset.state === 'overdue'))), 'choosing a state lists exactly the indicators in that state');
  await p.click('#ipickChip');
  await p.waitForTimeout(150);
  check((await count(p, '#indRows .irow')) === 18, 'and the list can be shown in full again');
  const blues = await p.$$eval('#indRows .pill.p-active', els => els.map(e => [e.textContent.replace(/\s+/g, ' ').trim(), (e.getAttribute('class').match(/g(\d)/) || [])[1]]));
  check(blues.length === ni[2] && blues.every(b => /\d+%/.test(b[0]) && +b[1] === Math.max(1, Math.min(5, Math.ceil(parseInt(b[0].match(/\d+/)[0], 10) / 20)))), 'an indicator in progress shows its percentage, and its shade of blue follows it ' + JSON.stringify(blues));
  await p.click('#monitor .tabs [data-tab="programs"]');
  await p.waitForTimeout(150);
  await p.click('#tiles .tile[data-state="active"]');
  await p.waitForSelector('.prow');
  check((await title(p)) === 'البرامج' && (await p.textContent('#resultCount')).startsWith(n0[2] + ' ') && (await p.$eval('.chip[data-status="active"]', e => e.getAttribute('aria-pressed'))) === 'true', 'a tile or ring opens the programmes in that state');
  check(await p.$$eval('.prow', els => els.length > 0 && els.every(e => /f-active g[1-5]/.test(e.querySelector('.stripe').className) && /\d+%/.test(e.querySelector('.pill.p-active').textContent))), 'every programme in progress carries its percentage and a graded blue marker');
  await p.click('#nb-back');
  await p.waitForSelector('#monitor');
  await p.click('#changeSchool');
  await p.waitForSelector('.cv-card');
  await p.click('.cv-card[data-school="private"]');
  await p.waitForSelector('#tiles .tile');
  check((await p.$eval('#tiles .tile .n', e => e.textContent)) === '277', 'the private school shows its own totals');
  await p.selectOption('#schoolPick', 'intl');
  await p.waitForTimeout(200);

  // ---- back and forward ----
  await p.click('.irow');
  await p.waitForSelector('.prow');
  check((await title(p)) === 'البرامج', 'an indicator opens the programmes page');
  check(!(await isOff(p, '#nb-back')) && (await isOff(p, '#nb-fwd')), 'back is available, forward is not yet');
  await p.click('#nb-back');
  await p.waitForSelector('#tiles');
  check((await title(p)) === 'الرئيسية' && !(await isOff(p, '#nb-fwd')), 'back returns to the home page');
  await p.click('#nb-fwd');
  await p.waitForSelector('.prow');
  check((await title(p)) === 'البرامج' && (await isOff(p, '#nb-fwd')), 'forward goes to the programmes page again, with its filter');

  // ---- a table without a completion column offers only what it has ----
  await p.click('.prow');
  await p.waitForSelector('.sheet #editForm');
  check((await count(p, '#editForm input[type=checkbox]')) === 0 && (await count(p, '#editForm input[type=url]')) === 0 && (await count(p, '#editForm input[type=number]')) === 1 && !!(await p.$('#editLacks')),
    'a programme whose table has no completion or evidence column offers only the actual number, and says so');
  check((await count(p, '.sheet [data-evbtn]')) === 0, 'and offers no evidence upload, since there is nowhere to write the link');
  check((await count(p, '#planStrip [data-plan="closed"]')) === 2 && (await p.textContent('#planStrip')).includes('حسب صلاحيات الفرع الرئيسي'), "the page shows, per stage, that the main branch has closed this indicator's plan");
  check((await count(p, '.sheet [data-lock="plan"]')) === 1 && (await p.textContent('#planBox #planClosed')).includes('أغلق الفرع الرئيسي') && !(await p.$('#planRemove')), 'a programme whose plan the main branch has closed is marked, and cannot be removed');
  await p.keyboard.press('Escape');
  await p.click('#nb-back');
  await p.waitForSelector('#tiles');
  await p.locator('.irow').nth(1).click();
  await p.waitForSelector('.prow');
  check((await count(p, '#planStrip [data-plan="open"]')) === 2 && /\d+ صفوف فارغة/.test(await p.textContent('#planStrip')), 'an indicator the main branch has left open shows as open, with its free rows');

  // ---- edit, then undo and redo ----
  const lateN = () => p.$eval('.chip[data-status="overdue"] b', e => +e.textContent);
  await p.click('.chip[data-status="overdue"]');
  await p.waitForTimeout(150);
  check((await p.$eval('.chip[data-status="overdue"]', e => e.getAttribute('aria-pressed'))) === 'true', 'one tap filters by status');
  await noSideScroll(p, 'programmes');
  check((await isOff(p, '#nb-undo')) && (await isOff(p, '#nb-redo')), 'undo and redo wait until something is done');
  const late0 = await lateN();
  await p.click('.prow');
  await p.waitForSelector('.sheet #editForm');
  // ---- evidence: a photo or PDF from the device ----
  await p.setInputFiles('#editForm [data-evfile]', { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('not evidence') });
  await p.waitForSelector('.toast.err');
  check((await p.$eval('#editForm input[type=url]', e => e.value)) === '', 'a file that is neither a photo nor a PDF is refused on the device');
  await p.setInputFiles('#editForm [data-evfile]', { name: 'IMG_0001.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64') });
  await p.waitForFunction(() => document.querySelector('#editForm input[type=url]').value.startsWith('https://drive.google.com/file/d/'));
  check((await p.textContent('#editForm .upstat')).includes('تم رفع الشاهد'), 'a photo is uploaded from the form and its link fills the evidence box');
  await p.setInputFiles('#editForm [data-evfile]', { name: 'report.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 sample') });
  await p.waitForFunction(() => /\.pdf/.test(document.querySelector('#editForm .upstat').textContent));
  check((await p.$eval('#editForm input[type=url]', e => e.value)).startsWith('https://drive.google.com/file/d/'), 'a PDF is accepted too');
  await p.check('#editForm input[type=checkbox]');
  await p.click('#editForm .btn[type=submit]');
  await p.waitForSelector('.sheet', { state: 'detached' });
  check(!(await p.$('.sheet')), 'saving execution data closes the sheet');
  check((await lateN()) === late0 - 1 && !(await isOff(p, '#nb-undo')), 'the programme is marked done; undo becomes available');
  await p.click('#nb-undo'); await settle(p);
  check((await lateN()) === late0 && !(await isOff(p, '#nb-redo')), 'undo takes the edit back');
  await p.click('#nb-redo'); await settle(p);
  check((await lateN()) === late0 - 1, 'redo applies it again');
  await p.click('#nb-undo'); await settle(p);

  await p.fill('#topSearch', 'موهبة');
  await p.waitForTimeout(500);
  check((await p.textContent('#resultCount')).includes('موهبة') && (await count(p, '.prow')) > 0, 'header search finds programmes');
  check((await p.evaluate(() => document.activeElement && document.activeElement.id)) === 'topSearch', 'search keeps the cursor while typing');

  // ---- review, with undo ----
  await nav(p, 'review');
  await p.waitForSelector('.card [data-act="approve"]');
  const queue = await count(p, '.card');
  await p.click('.card [data-act="approve"]'); await settle(p);
  check((await count(p, '.card')) === queue - 1, 'approving a report removes it from the queue');
  await p.click('#nb-undo'); await settle(p);
  check((await count(p, '.card')) === queue, 'undo puts the report back in the queue');
  await p.click('#nb-redo'); await settle(p);
  check((await count(p, '.card')) === queue - 1, 'redo approves it again');

  // ---- the programmes calendar ----
  await nav(p, 'calendar');
  await p.waitForSelector('.cal');
  check((await count(p, '.cal-d')) === 30 && (await count(p, '.cal-d.today[data-day="2026-11-15"]')) === 1, 'the calendar opens on this month with today marked');
  check((await count(p, '#dayPanel .prow')) > 0, "today's programmes are listed under the calendar");
  check(await p.$$eval('.cal-d', els => { const f = els.find(e => e.dataset.day === '2026-11-13'), s = els.find(e => e.dataset.day === '2026-11-15'); return f.classList.contains('off') && !s.classList.contains('off'); }), 'Friday and Saturday are shown as the weekend');
  await noSideScroll(p, 'calendar');
  await shot(p, '3-calendar');
  const head0 = await p.textContent('#dayPanel h2');
  await p.click('.cal-d[data-day="2026-11-22"]');
  await p.waitForTimeout(150);
  check((await p.textContent('#dayPanel h2')) !== head0 && (await p.$eval('.cal-d[data-day="2026-11-22"]', e => e.classList.contains('sel'))), 'choosing a day shows that day');
  const month0 = await p.textContent('#calMonth');
  await p.click('#calNext');
  await p.waitForTimeout(150);
  check((await p.textContent('#calMonth')) !== month0 && (await count(p, '.cal-d')) === 31, 'the next month has its own grid');
  await p.click('#nb-back');
  await p.waitForTimeout(200);
  check((await p.textContent('#calMonth')) === month0, 'back also returns to the previous month');
  const withAll = await count(p, '.cal-d .cal-p');
  await p.selectOption('.headrow select', { index: 1 });
  await p.waitForTimeout(200);
  check((await count(p, '.cal-d .cal-p')) < withAll, 'the calendar can be limited to one indicator');
  await p.selectOption('.headrow select', { index: 0 });

  // ---- monitoring by teacher ----
  await nav(p, 'people');
  await p.waitForSelector('#peopleTable tbody tr');
  check((await count(p, '#peopleTable tbody tr')) === 5, 'every member of staff has a row');
  const teacherRow = '#peopleTable tr[data-person="teacher@preview.example"]';
  const assigned = +(await p.$eval(teacherRow + ' td:nth-child(2)', e => e.textContent));
  check(assigned > 0 && (await p.$eval('#peopleTable tbody tr', e => e.dataset.person)) === 'teacher@preview.example', 'people with late programmes come first (' + assigned + ' assigned)');
  await noSideScroll(p, 'by teacher');
  await shot(p, '4-people');
  await p.click(teacherRow);
  await p.waitForSelector('#personChip');
  check((await title(p)) === 'البرامج' && (await p.textContent('#resultCount')).startsWith(assigned + ' '), "a person's row opens exactly their programmes");
  await p.click('#personChip');
  await p.waitForTimeout(200);
  check(!(await p.$('#personChip')) && !(await p.textContent('#resultCount')).startsWith(assigned + ' '), 'the person filter can be removed');

  // ---- responsible people, chosen in the platform ----
  await nav(p, 'people');
  await p.waitForSelector('#freeCount');
  const freeN = +(await p.textContent('#freeCount'));
  check(freeN > 0 && freeN < 400, 'the page says how many programmes nobody follows in the platform (' + freeN + ')');
  await p.click('#freeOpen');
  await p.waitForSelector('.prow');
  const left = async () => parseInt(await p.textContent('#resultCount'), 10);
  check((await title(p)) === 'البرامج' && (await left()) === freeN && (await p.$eval('.chip[data-status="check:noowner"]', e => e.getAttribute('aria-pressed'))) === 'true', 'and opens exactly those programmes');
  const pickedName = await p.textContent('.prow b');
  await p.click('.prow');
  await p.waitForSelector('#whoBox #whoPick');
  check((await p.$eval('#whoNow', e => e.classList.contains('warn'))) && !(await p.$('#whoRemove')), 'a programme nobody follows says so');
  await p.selectOption('#whoPick', 'teacher@preview.example');
  await p.click('#whoSave');
  await p.waitForSelector('#whoRemove');
  check((await p.textContent('#whoNow')).includes('معلم (معاينة)') && (await p.$eval('#whoPick', e => e.value)) === 'teacher@preview.example', 'an admin chooses the responsible person in the programme itself');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(150);
  check((await left()) === freeN - 1, 'the programme leaves the list of unfollowed programmes');
  await p.click('#nb-undo'); await settle(p);
  check((await left()) === freeN, 'undo takes the assignment back');
  await p.click('#nb-redo'); await settle(p);
  check((await left()) === freeN - 1, 'redo assigns it again');
  await p.click('#bulkAssign');
  await p.waitForSelector('#assignWho');
  check(await isOff(p, '#assignDo'), 'a whole list can be assigned, once a person is chosen');
  await p.selectOption('#assignWho', 'teacher@preview.example');
  check((await p.textContent('#assignDo')).includes('(' + (freeN - 1) + ')') && !(await isOff(p, '#assignDo')), 'the button says how many programmes it will assign');
  await p.click('#assignDo'); await settle(p);
  check(!(await p.$('.sheet')) && (await left()) === 0, 'after assigning the list, no programme in it is left without a person');
  await nav(p, 'people');
  await p.waitForSelector('#peopleTable');
  check(!(await p.$('#freeNote')) && +(await p.$eval(teacherRow + ' td:nth-child(2)', e => e.textContent)) === assigned + freeN, "the person's row now counts them (" + (assigned + freeN) + ')');
  await p.click('#nb-undo'); await settle(p);
  check(+(await p.textContent('#freeCount')) === freeN - 1 && +(await p.$eval(teacherRow + ' td:nth-child(2)', e => e.textContent)) === assigned + 1, 'undoing the list keeps the earlier single assignment');

  // ---- profile picture ----
  await p.click('#meCard');
  await p.waitForSelector('#photoPick');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  await p.setInputFiles('#photoFile', { name: 'me.png', mimeType: 'image/png', buffer: png });
  await p.waitForSelector('#meCard .avatar img');
  const src = await p.$eval('#meCard .avatar img', e => e.src);
  check(src.startsWith('data:image/jpeg;base64,') && src.length < 48000, 'a chosen picture is shrunk on the device and shown in the menu');
  await nav(p, 'people');
  await p.waitForSelector('#peopleTable');
  check((await count(p, '#peopleTable tr[data-person="principal@preview.example"] .avatar img')) === 1, 'the picture appears next to the name in the staff list');
  await p.click('#meCard');
  await p.waitForSelector('#photoRemove');
  await p.setInputFiles('#photoFile', { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('not a picture') });
  await p.waitForTimeout(300);
  check((await count(p, '#meCard .avatar img')) === 1 && (await count(p, '.toast.err')) > 0, 'a file that is not a picture is refused');
  await p.click('#photoRemove'); await settle(p);
  check((await count(p, '#meCard .avatar img')) === 0, 'the picture can be removed');
  await p.click('#nb-undo'); await settle(p);
  check((await count(p, '#meCard .avatar img')) === 1, 'and undo brings it back');

  // ---- private calendar: tasks (admins) ----
  await nav(p, 'mycal');
  await p.waitForSelector('#addTask');
  check((await count(p, '.tabs [data-tab]')) === 2 && (await count(p, '#dayPanel .task')) === 2, 'an admin has a tasks calendar next to the timetable');
  await shot(p, '5-tasks');
  await p.click('#addTask');
  await p.waitForSelector('#taskForm');
  await p.fill('#taskTitle', 'متابعة الطابور الصباحي');
  await p.selectOption('#taskRepeat', 'weekly');
  await p.fill('#taskForm input[type=time]', '06:50');
  await p.click('#taskForm .btn[type=submit]'); await settle(p);
  check((await count(p, '#dayPanel .task')) === 3 && (await texts(p, '#dayPanel .task b'))[0] === 'متابعة الطابور الصباحي', 'a new task appears on its day, earliest first');
  check((await count(p, '.cal-d[data-day="2026-11-22"] .cal-t')) === 1 && (await p.textContent('.cal-d[data-day="2026-11-22"] .cal-t')) === '3', 'a weekly task repeats on the same weekday');
  check((await p.textContent('.cal-d[data-day="2026-11-16"] .cal-t')) === '1' && (await count(p, '.cal-d[data-day="2026-11-20"] .cal-t')) === 0, 'a daily task runs on school days only');
  await p.check('#dayPanel .task input[type=checkbox]'); await settle(p);
  check((await count(p, '#dayPanel .task.is-done')) === 1, 'a task can be ticked off for the day');
  await p.click('.cal-d[data-day="2026-11-22"]');
  await p.waitForTimeout(150);
  check((await count(p, '#dayPanel .task.is-done')) === 0 && (await count(p, '#dayPanel .task')) === 3, 'ticking it off does not tick off next week');
  await p.click('.cal-d[data-day="2026-11-15"]');
  await p.click('#nb-undo'); await settle(p);
  check((await count(p, '#dayPanel .task.is-done')) === 0, 'undo unticks it');
  await p.click('#dayPanel .task > button');
  await p.waitForSelector('#taskDelete');
  await p.click('#taskDelete'); await settle(p);
  check((await count(p, '#dayPanel .task')) === 2, 'a task can be deleted');
  await p.click('#nb-undo'); await settle(p);
  check((await count(p, '#dayPanel .task')) === 3, 'and undo restores it');
  await noSideScroll(p, 'tasks calendar');

  // ---- private calendar: weekly sessions ----
  await p.click('.tabs [data-tab="sessions"]');
  await p.waitForSelector('#week');
  check((await count(p, '#week .wk')) === 5 && (await count(p, '#week .sess')) === 6, 'the timetable shows the school week');
  check((await p.$eval('#week .wk.now', e => e.dataset.wd)) === '0', 'today is marked in the timetable');
  await p.click('#addSession');
  await p.waitForSelector('#sessionForm');
  await p.selectOption('#sessDay', '2');
  await p.fill('#sessSubject', 'SAT Maths');
  await p.click('#sessionForm .btn[type=submit]'); await settle(p);
  check((await count(p, '#week .sess')) === 7 && (await texts(p, '#week .wk[data-wd="2"] .sess b')).includes('SAT Maths'), 'a new session lands in its day');
  await p.click('#nb-undo'); await settle(p);
  check((await count(p, '#week .sess')) === 6, 'undo removes it');
  await p.click('#nb-redo'); await settle(p);
  check((await count(p, '#week .sess')) === 7, 'redo adds it again');
  await p.locator('#week .wk[data-wd="2"] .sess').last().click();
  await p.waitForSelector('#sessionForm');
  await p.fill('#sessionForm input[type=time]', '12:00');
  await p.click('#sessionForm .btn[type=submit]');
  await p.waitForSelector('.toast.err');
  check(!!(await p.$('#sessionForm')), 'a session that would end before it starts is refused');
  await p.keyboard.press('Escape');
  await noSideScroll(p, 'timetable');
  await shot(p, '6-sessions');

  // ---- the plan: an admin adds and removes programmes, while the main branch allows it ----
  await nav(p, 'home');
  await p.waitForSelector('#tiles .tile');
  const total0 = (await nums())[0];
  await nav(p, 'programs');
  await p.waitForSelector('#planAdd');
  await p.click('#planAdd');
  await p.waitForSelector('#planForm #planState');
  await p.selectOption('#planKpi', 'A.Br 1.2');
  await p.waitForFunction(() => /مغلق من الفرع الرئيسي/.test((document.querySelector('#planState') || {}).textContent || ''));
  check(!(await p.$('#planSend')) && (await count(p, '#planBody [data-field]')) === 0, 'where the main branch has closed planning, the form says so and offers nothing to fill in');
  await p.selectOption('#planKpi', 'C.Br 3.3');
  await p.selectOption('#planStage', 'ابتدائي بنين عالمي');
  await p.waitForSelector('#planSend');
  check((await p.textContent('#planState')).includes('التخطيط مفتوح') && (await p.$eval('#planBody [data-field="name"]', e => e.required)) && (await p.$$eval('#planBody [data-field="week"] option', els => els.length)) === 21, 'where it is open, the form offers the plan fields of that table');
  await p.fill('#planBody [data-field="name"]', 'ملتقى القراءة الحرة');
  await p.selectOption('#planBody [data-field="term"]', 'فصل 1');
  await p.selectOption('#planBody [data-field="week"]', 'الأسبوع 14');
  await p.fill('#planBody [data-field="count"]', '40');
  await p.click('#planSend');
  await p.waitForSelector('.sheet', { state: 'detached' });
  await p.fill('#topSearch', 'ملتقى القراءة الحرة');
  await p.waitForTimeout(500);
  check((await count(p, '.prow')) === 1 && (await p.textContent('.prow')).includes('C.Br 3.3'), "an admin's new programme is added at once and appears in the plan");
  await nav(p, 'home');
  await p.waitForSelector('#tiles .tile');
  check((await nums())[0] === total0 + 1, 'the totals count it (' + (total0 + 1) + ')');
  await p.click('#nb-undo'); await settle(p); await settle(p);
  check((await nums())[0] === total0, 'undo takes the new programme out again');
  await p.click('#nb-redo'); await settle(p);
  check((await nums())[0] === total0 + 1, 'redo adds it again');
  await p.fill('#topSearch', 'ملتقى القراءة الحرة');
  await p.waitForTimeout(500);
  await p.click('.prow');
  await p.waitForSelector('#planBox #planRemove');
  await p.click('#planRemove');
  check((await p.textContent('#planRemove')) === 'تأكيد الحذف' && (await count(p, '.prow')) === 1, 'removing a programme asks for confirmation first');
  await p.click('#planRemove');
  await p.waitForSelector('.sheet', { state: 'detached' });
  await p.waitForTimeout(200);
  check((await count(p, '.prow')) === 0, 'an admin removes a programme from the plan');
  const approvedName = await p.evaluate(() => { const x = window.__PREVIEW__.programs.find(q => q.approved && /عالمي$/.test(q.stage)); return x ? x.name : ''; });
  if (approvedName) {
    await p.fill('#topSearch', approvedName);
    await p.waitForTimeout(500);
    await p.locator('.prow', { hasText: approvedName }).first().click();
    await p.waitForSelector('#planBox');
    check(!!(await p.$('#planClosed')) && !(await p.$('#planRemove')) && (await p.textContent('#planClosed')).includes('اعتمد الفرع الرئيسي'), 'a programme the main branch has approved cannot be removed');
    await p.keyboard.press('Escape');
  }

  // ---- the school's sessions schedule: Sunday to Thursday, eight sessions a day ----
  await nav(p, 'timetable');
  await p.waitForSelector('#ttWeek');
  const sess = sel => count(p, '#ttWeek ' + (sel || '.sess'));
  const slotText = id => p.textContent('#ttWeek .slot[data-slot="' + id + '"]');
  check((await p.$eval('#ttPick', e => e.options.length)) === 2 && (await count(p, '#ttWeek .wk')) === 5 && (await count(p, '#ttWeek .slot')) === 40 && (await count(p, '#ttWeek .wk[data-wd="0"] .slot')) === 8 && (await sess()) === 20 && (await p.textContent('#ttCount')).includes('5A'),
    'the school schedule is a grid of five days, Sunday to Thursday, with eight sessions each');
  check((await p.$$eval('#ttWeek .wk', els => els.map(e => e.dataset.wd).join())) === '0,1,2,3,4' && (await slotText('0-1')).includes('07:30 – 08:15') && (await slotText('0-8')).includes('13:50 – 14:35') && (await p.$eval('#ttWeek .wk.now', e => e.dataset.wd)) === '0',
    'each session shows its number and time, and today is marked');
  await p.click('#ttWeek .slot[data-slot="2-6"] .slot-add');
  await p.waitForSelector('#lessonForm #ttSave');
  check((await p.$eval('#ttClass', e => e.value)) === '5A' && (await p.$eval('#ttDay', e => e.value)) === '2' && (await p.$eval('#ttDay', e => e.options.length)) === 5 && (await p.$eval('#ttPeriod', e => e.value)) === '6' && (await p.$eval('#ttPeriod', e => e.options.length)) === 8 && (await p.$eval('#ttTeacher', e => e.options.length)) > 2,
    'an empty slot opens a new session for that class, day and session number; only school days and eight sessions are offered');
  await p.fill('#ttSubject', 'Art');
  await p.selectOption('#ttTeacher', 'teacher@preview.example');
  await p.click('#ttSave');
  await p.waitForSelector('.sheet', { state: 'detached' });
  check((await sess()) === 21 && (await slotText('2-6')).includes('Art'), 'an admin adds a session and it appears in its slot');
  await p.click('#nb-undo'); await settle(p);
  check((await sess()) === 20, 'undo removes it');
  await p.click('#nb-redo'); await settle(p);
  check((await sess()) === 21, 'redo adds it again');
  await p.click('#ttAdd');
  await p.waitForSelector('#lessonForm #ttSave');
  await p.selectOption('#ttDay', '0'); await p.selectOption('#ttPeriod', '1'); await p.fill('#ttSubject', 'Assembly');
  await p.click('#ttSave');
  await p.waitForFunction(() => Array.from(document.querySelectorAll('.toast.err')).some(e => e.textContent.includes('حصة في هذا الموعد')));
  check(!!(await p.$('#lessonForm')) && (await sess()) === 21, 'a class has one session in each slot: a second one is refused');
  await p.fill('#ttClass', '4C'); await p.selectOption('#ttTeacher', 'teacher@preview.example');
  await p.click('#ttSave');
  await p.waitForSelector('.sheet', { state: 'detached' });
  await p.waitForFunction(() => Array.from(document.querySelectorAll('.toast.err')).some(e => e.textContent.includes('للمعلم')));
  check((await p.$eval('#ttPick', e => e.value)).endsWith('|4C') && (await sess()) === 1, 'a teacher placed in two classes in the same slot is saved, with a warning');
  await p.click('#nb-undo'); await settle(p);
  check((await p.$eval('#ttPick', e => e.value)).endsWith('|5A') && (await sess()) === 21, 'undoing it returns to the first class');

  // ---- the admins set the session times ----
  await p.click('#ttTimes');
  await p.waitForSelector('#periodsForm');
  const stageOf5A = (await p.$eval('#ttPick', e => e.value)).split('|')[0];
  check((await count(p, '#periodsForm input[type=time]')) === 16 && (await p.$eval('#periodsForm [data-pt="1a"]', e => e.value)) === '07:30' && (await p.$eval('#ptStage', e => e.value)) === stageOf5A,
    'the admins see the start and end of each of the eight sessions, for the stage on screen');
  await p.fill('#periodsForm [data-pt="2a"]', '08:00');
  await p.click('#ptSave');
  await p.waitForFunction(() => Array.from(document.querySelectorAll('.toast.err')).some(e => e.textContent.includes('تبدأ قبل نهاية')));
  check(!!(await p.$('#periodsForm')), 'a session that would start before the previous one ends is refused');
  await p.fill('#periodsForm [data-pt="2a"]', '08:20');
  await p.fill('#periodsForm [data-pt="1a"]', '07:00'); await p.fill('#periodsForm [data-pt="1b"]', '07:45');
  await p.click('#ptSave');
  await p.waitForSelector('.sheet', { state: 'detached' });
  check((await slotText('0-1')).includes('07:00 – 07:45') && (await slotText('3-1')).includes('07:00 – 07:45') && (await slotText('0-2')).includes('08:20 – 09:05') && (await sess()) === 21,
    'an admin changes a session time and the whole schedule follows; sessions stay in their slots');
  await shot(p, '6c-timetable-times');
  await p.click('#nb-undo'); await settle(p);
  check((await slotText('0-1')).includes('07:30 – 08:15'), 'undo puts the earlier time back');

  await p.click('.tabs [data-tab="teacher"]');
  await p.waitForTimeout(200);
  await p.selectOption('#ttPick', 'معلم (معاينة)');
  await p.waitForTimeout(200);
  check((await sess()) === 11 && (await p.textContent('#ttWeek .sess small')).includes('5A') && (await count(p, '#ttWeek .slot')) === 40 && (await count(p, '#ttWeek .slot-add')) === 0, "by teacher, the grid shows one teacher's week across classes");
  await p.click('#ttImport');
  await p.waitForSelector('#ttPaste');
  await p.fill('#ttPaste', 'الصف\tاليوم\tالحصة\tالمادة\tالمعلم\tالقاعة\n4C\tالأحد\t١\tEnglish\tمعلم (معاينة)\tR09\n4C\tالجمعة\t2\tMaths');
  await p.click('#ttImportGo');
  await p.waitForSelector('#ttImportErrors li');
  check((await p.textContent('#ttImportErrors')).includes('السطر 3') && (await p.textContent('#ttImportErrors')).includes('من الأحد إلى الخميس') && (await count(p, '#ttImportErrors li')) === 1, 'a pasted schedule with a weekend day adds nothing and names the line');
  await p.fill('#ttPaste', 'الصف\tاليوم\tالحصة\tالمادة\tالمعلم\tالقاعة\n4C\tالأحد\t٩\tEnglish');
  await p.click('#ttImportGo');
  await p.waitForFunction(() => (document.querySelector('#ttImportErrors') || {}).textContent.includes('من 1 إلى 8'));
  check((await count(p, '#ttImportErrors li')) === 1, 'a ninth session is refused the same way');
  await p.fill('#ttPaste', 'الصف\tاليوم\tالحصة\tالمادة\tالمعلم\tالقاعة\n4C\tالأحد\t٥\tEnglish\tمعلم (معاينة)\tR09\n4C\tالاثنين\t2\tMaths\tسعد\n4C\tTuesday\tالحصة 8\tScience');
  await p.click('#ttImportGo');
  await p.waitForSelector('.sheet', { state: 'detached' });
  check((await p.$eval('#ttPick', e => e.value)).endsWith('|4C') && (await sess()) === 3 && (await p.$eval('#ttPick', e => e.options.length)) === 3 && (await slotText('0-5')).includes('English') && (await slotText('2-8')).includes('Science'),
    'a pasted schedule is imported by session number: Arabic and English days, Arabic digits, a heading line');
  await p.click('#ttClear');
  check((await p.textContent('#ttClear')) === 'تأكيد المسح' && (await sess()) === 3, "clearing a class's schedule asks for confirmation first");
  await p.click('#ttClear'); await settle(p);
  check((await p.$eval('#ttPick', e => e.options.length)) === 2, 'the class is cleared');
  await p.click('#nb-undo'); await settle(p);
  check((await p.$eval('#ttPick', e => e.options.length)) === 3, 'and undo brings its sessions back');
  await noSideScroll(p, 'school timetable');
  await shot(p, '6a-timetable');

  // ---- the schedule builder: plan, teachers, assignment, instructions, build, apply ----
  const errToast = text => p.waitForFunction(x => Array.from(document.querySelectorAll('.toast.err')).some(e => e.textContent.includes(x)), text);
  const closed = () => p.waitForSelector('.sheet', { state: 'detached' });
  const val = sel => p.$eval(sel, e => e.value);
  const step = async k => { await p.click('#blTabs [data-tab="' + k + '"]'); await p.waitForTimeout(200); };
  check(!!(await p.$('#ttBuild')), 'the school schedule offers the builder to admins');
  await nav(p, 'builder');
  await p.waitForSelector('#blTabs');
  check((await title(p)) === 'منشئ الجدول' && (await count(p, '#blTabs button')) === 5 && (await val('#blStage')) === 'ابتدائي بنين عالمي', 'an admin opens the schedule builder: five steps, one stage at a time');
  check((await count(p, '#blPlan tbody tr')) === 6 && (await count(p, '#blPlan thead th')) === 12 && (await p.textContent('#blPlan [data-total="4A"]')) === '39 / 39' && (await p.textContent('#blCap')).includes('40') && (await p.textContent('#blCap')).includes('07:30 – 14:35'),
    'the plan lists each class with its weekly sessions for each subject, against what the week holds; the day shows its sessions and hours');
  await p.fill('#blPlan [data-cell="4A|English"]', '9'); await p.press('#blPlan [data-cell="4A|English"]', 'Tab');
  check((await p.textContent('#blPlan [data-total="4A"]')) === '40 / 39' && (await p.$eval('#blPlan [data-total="4A"]', e => e.classList.contains('over'))) && (await p.evaluate(() => document.activeElement.getAttribute('data-cell'))) === '4A|Maths',
    'typing a number updates the class total at once, flags a class over its week, and keeps the place in the table');
  await step('build');
  check((await p.textContent('#blIssues')).includes('4A') && (await p.textContent('#blIssues')).includes('40') && (await isOff(p, '#blGo')), 'a class with more sessions than the week holds stops the build, with the reason');
  await p.click('#nb-undo'); await p.waitForSelector('#blReady');
  check(!(await isOff(p, '#blGo')) && !!(await p.$('#blReady')) && !(await p.$('#blIssues')), 'undo puts the number back and the setup is ready again');
  await step('plan');
  await p.selectOption('#blDay4', '6'); await settle(p);
  check((await p.textContent('#blCap')).includes('38') && (await p.textContent('#blPlan [data-total="4A"]')) === '39 / 37', 'a shorter Thursday lowers what each class can hold');
  await p.click('#nb-undo'); await p.waitForFunction(() => document.querySelector('#blCap').textContent.includes(': 40'));
  await p.click('#blAddClass'); await p.waitForSelector('#bcForm');
  await p.fill('#bcNames', '7A، 7B\n4A'); await p.selectOption('#bcCopy', '6B'); await p.click('#bcSave'); await closed();
  check((await count(p, '#blPlan tbody tr')) === 8 && (await p.textContent('#blPlan [data-total="7B"]')) === '39 / 39', "new classes are added once each, with another class's plan copied");
  await p.click('#blPlan [data-class="7B"]'); await p.waitForSelector('#bnForm');
  await p.fill('#bnName', '4A'); await p.click('#bnSave'); await errToast('الاسم موجود');
  await p.fill('#bnName', '7C'); await p.click('#bnSave'); await closed();
  check(!!(await p.$('#blPlan [data-class="7C"]')) && !(await p.$('#blPlan [data-class="7B"]')) && (await val('#blPlan [data-cell="7C|Maths"]')) === '7', 'a class is renamed with its plan, and a name already in use is refused');
  await p.click('#blPlan [data-class="7C"]'); await p.waitForSelector('#bnDelete');
  await p.click('#bnDelete');
  check((await p.textContent('#bnDelete')) === 'تأكيد الحذف' && (await count(p, '#blPlan tbody tr')) === 8, 'removing a class asks once more');
  await p.click('#bnDelete'); await closed();
  check((await count(p, '#blPlan tbody tr')) === 7, 'then removes it');
  await p.click('#blAddSubject'); await p.waitForSelector('#bsForm');
  await p.fill('#bsName', 'Robotics'); await p.fill('#bsCount', '1'); await p.click('#bsSave'); await closed();
  check((await val('#blPlan [data-cell="7A|Robotics"]')) === '1' && (await p.textContent('#blPlan [data-total="7A"]')) === '40 / 39', 'a new subject is added to every class with its weekly sessions');
  await p.click('#blPlan [data-subject="Robotics"]'); await p.waitForSelector('#bnDelete'); await p.click('#bnDelete'); await p.click('#bnDelete'); await closed();
  check((await count(p, '#blPlan thead th')) === 12 && (await p.textContent('#blPlan [data-total="7A"]')) === '39 / 39', 'a subject is removed from every class');
  await p.click('#blPastePlan'); await p.waitForSelector('#bpPaste');
  await p.fill('#bpPaste', 'الصف\tEnglish\tMaths\n7A\t٧\tx'); await p.click('#bpGo'); await errToast('تعذرت قراءة');
  check(!!(await p.$('#bpForm')), 'a pasted plan with a cell that is not a number is refused');
  await p.fill('#bpPaste', 'الصف\tEnglish\tDrama\n7A\t٧\t1\n8A\t5\t'); await p.click('#bpGo'); await closed();
  check((await val('#blPlan [data-cell="7A|English"]')) === '7' && (await val('#blPlan [data-cell="8A|English"]')) === '5' && (await val('#blPlan [data-cell="8A|Drama"]')) === '' && !!(await p.$('#blPlan [data-subject="Drama"]')),
    'a pasted plan sets the numbers and adds the classes and subjects it names');
  await p.click('#nb-undo'); await p.waitForFunction(() => !document.querySelector('#blPlan [data-class="8A"]'));
  check(!(await p.$('#blPlan [data-class="8A"]')) && !(await p.$('#blPlan [data-subject="Drama"]')) && (await val('#blPlan [data-cell="7A|English"]')) === '8', 'and one undo takes the whole paste back');

  await step('teachers');
  check((await count(p, '#blTeachers tbody tr')) === 12 && (await p.textContent('#blTeachers tr[data-teacher="t8"]')).includes('Science') && (await p.textContent('#blTeachers tr[data-teacher="t8"]')).includes('ICT'), 'the teachers are listed with their subjects, quota and assigned sessions');
  await p.click('#blAddStaff'); await p.waitForFunction(() => Array.from(document.querySelectorAll('.toast')).some(e => e.textContent.includes('كل معلمي المرحلة مضافون')));
  await p.click('#blAddTeacher'); await p.waitForSelector('#btForm');
  check((await p.$$eval('#btWho option', els => els.map(e => e.value))).indexOf('teacher@preview.example') === -1 && (await count(p, '#btSubjects input')) === 10, 'a new teacher is a member of staff not yet in the list, or a typed name; the subjects are those of the plan');
  await p.click('#btSave'); await errToast('اختر المعلم');
  await p.fill('#btName', 'هاني الثقفي'); await p.check('#btSubjects [data-sub="English"]'); await p.fill('#btQuota', '10'); await p.selectOption('#btMaxDay', '4'); await p.click('#btSave'); await closed();
  const hani = await p.$$eval('#blTeachers tbody tr', els => els.map(e => e.textContent).filter(x => x.includes('هاني الثقفي'))[0] || '');
  check((await count(p, '#blTeachers tbody tr')) === 13 && hani.includes('English') && hani.includes('10') && hani.includes('4'), 'a teacher is added with subjects, a weekly quota and a daily maximum');

  await step('assign');
  check((await p.textContent('#blUnassigned')).includes('10') && (await p.$eval('#blUnassigned', e => e.classList.contains('warn'))) && (await val('#blAssign [data-cell="7A|English"]')) === '', 'the new class has no teachers yet, and the page says how many cells are empty');
  await p.click('#blAuto'); await settle(p);
  const engT = await p.$eval('#blAssign [data-cell="7A|English"]', e => e.selectedOptions[0].textContent);
  check(engT === 'هاني الثقفي' && (await count(p, '#blMissing li')) >= 1 && (await p.textContent('#blMissing')).includes('Maths') && !(await p.textContent('#blUnassigned')).includes(': 10'),
    'automatic distribution gives each cell a teacher of the subject with room in their quota, and lists what the quotas cannot cover');
  check((await val('#blAssign [data-cell="4A|English"]')) !== '' && (await val('#blAssign [data-cell="7A|Maths"]')) === '', "it fills only the empty cells and leaves the admins' choices");
  await p.selectOption('#blAssign [data-cell="7A|Maths"]', 't3');
  check((await p.textContent('#blLoads tr[data-teacher="t3"]')).includes('28 / 24') && (await p.textContent('#blLoads tr[data-teacher="t3"]')).includes('فوق النصاب'), 'an admin can give a class to any teacher; a teacher over their quota is flagged');
  await step('build');
  check((await p.textContent('#blIssues')).includes('خالد العتيبي') && (await p.textContent('#blIssues')).includes('نصابه 24') && !(await isOff(p, '#blGo')), 'a teacher over quota is a warning in the check, not a stop');
  await step('plan');
  await p.click('#blPlan [data-class="7A"]'); await p.waitForSelector('#bnDelete'); await p.click('#bnDelete'); await p.click('#bnDelete'); await closed();
  await step('assign');
  await p.click('#blAutoAll');
  check((await p.textContent('#blAutoAll')).includes('يمسح الإسناد'), 'distributing again from nothing asks first');
  await p.click('#blAutoAll'); await settle(p);
  check((await p.textContent('#blUnassigned')) === 'كل المواد لها معلم.' && !(await p.$('#blMissing')) && !(await p.textContent('#blLoads')).includes('فوق النصاب'), 'then every class and subject has a teacher within the quotas');

  await step('rules');
  check((await count(p, '#blRules li')) === 6 && (await p.textContent('#blRules li[data-type="fixed"]')).includes('نشاط') && (await p.textContent('#blRules li[data-type="off"]')).includes('الأحد') && (await p.textContent('#blRules')).includes('مفضّلة'),
    'the instructions are listed as sentences, each marked must or prefer');
  await p.click('#blAddRule'); await p.waitForSelector('#brForm');
  check((await p.$eval('#brType', e => e.options.length)) === 7, 'seven kinds of instruction are offered');
  await p.selectOption('#brTeacher', { label: 'هاني الثقفي' }); await p.check('#brDays [data-day="3"]'); await p.click('#brSave'); await closed();
  const offs = await p.$$eval('#blRules li[data-type="off"]', els => els.map(e => e.textContent));
  check(offs.length === 2 && offs.some(x => x.includes('هاني الثقفي') && x.includes('الأربعاء') && x.includes('اليوم كله')), 'an instruction is added: a teacher away for a whole day');
  await p.click('#blAddRule'); await p.waitForSelector('#brForm');
  await p.selectOption('#brType', 'streak'); await p.selectOption('#brN', '3'); await p.selectOption('#brMust', '0'); await p.click('#brSave'); await closed();
  check((await count(p, '#blRules li')) === 8 && (await p.textContent('#blRules li[data-type="streak"]')).includes('3 حصص متتالية') && (await p.textContent('#blRules li[data-type="streak"]')).includes('مفضّلة'), 'and a preference: no more than three sessions in a row');
  await p.click('#blRules li[data-type="streak"] .tx'); await p.waitForSelector('#brForm');
  check(await isOff(p, '#brType'), 'an instruction is edited in place; its kind stays');
  await p.selectOption('#brN', '4'); await p.click('#brSave'); await closed();
  check((await count(p, '#blRules li')) === 8 && (await p.textContent('#blRules li[data-type="streak"]')).includes('4 حصص متتالية'), 'the change is kept');
  await p.click('#blRules li[data-type="streak"] .x'); await settle(p);
  check((await count(p, '#blRules li')) === 7, 'an instruction is removed with one click');
  await p.click('#nb-undo'); await p.waitForFunction(() => document.querySelectorAll('#blRules li').length === 8);
  check((await count(p, '#blRules li')) === 8, 'and undo brings it back');

  await step('build');
  check((await p.textContent('#blBusy')).includes(' 1 '), 'the builder keeps free the time a teacher already has a session in a class outside the build');
  check(!!(await p.$('#blNotBuilt')) && (await p.textContent('#blSize')).startsWith('6 ') && (await p.textContent('#blSize')).includes('234') && (await p.textContent('#blSize')).includes('8 تعليمة'), 'the build step sums up the setup: classes, sessions, teachers, instructions');
  await p.click('#blGo');
  await p.waitForSelector('#blResult', { timeout: 60000 });
  check((await p.textContent('#blStatPlaced b')) === '234 / 234' && (await p.textContent('#blStatClash b')) === '0' && (await p.textContent('#blStatGaps b')) === '0', 'the builder places every session, with no clash and no free session inside a class day');
  const report = await p.$$eval('#blRuleReport li', els => els.map(e => ({ broken: +e.dataset.broken, must: e.textContent.includes('إلزامية') })));
  check(report.length === 8 && report.filter(x => x.must).length === 6 && report.filter(x => x.must).every(x => x.broken === 0) && (await p.textContent('#blStatRules b')).endsWith('/ 8'), 'the report goes through every instruction; no must instruction is broken');
  check((await count(p, '#blDraft .wk')) === 5 && (await count(p, '#blDraft .slot')) === 40 && (await count(p, '#blDraft .sess')) === 40 && (await p.textContent('#blDraft .slot[data-slot="2-8"]')).includes('نشاط') && (await val('#blDraftPick')) === '4A',
    "the design is shown as each class's week: full from the first session to the last, with the activity in its place");
  const peSlots = await p.$$eval('#blDraft .slot', els => els.filter(e => e.querySelector('.sess b') && e.querySelector('.sess b').textContent === 'PE').map(e => +e.dataset.slot.split('-')[1]));
  check(peSlots.length === 2 && peSlots.every(k => k >= 2 && k <= 7), 'a subject tied to certain sessions sits inside them');
  await p.click('#blDraftTabs [data-tab="teacher"]'); await p.waitForTimeout(200);
  await p.selectOption('#blDraftPick', { label: 'معلم (معاينة)' }); await p.waitForTimeout(200);
  check(!(await p.$('#blDraft .slot[data-slot="0-1"] .sess')) && !(await p.$('#blDraft .slot[data-slot="0-2"] .sess')) && !(await p.$('#blDraft .slot[data-slot="0-5"] .sess')) && (await count(p, '#blDraft .sess')) >= 8 && (await p.textContent('#blDraft .sess small')).length === 2,
    "by teacher, the design shows one teacher's week, clear of the times they are not available");
  check((await count(p, '#blTeacherDays tbody tr')) === 13 && (await count(p, '#blTeacherDays thead th')) === 8, "each teacher's sessions on each day, and their waiting sessions, are listed");
  const sig = () => p.$$eval('#blDraft .slot', els => els.map(e => e.textContent).join('|'));
  const first = await sig();
  await p.click('#blAgain');
  await p.waitForFunction(() => { const h2 = document.querySelector('#blResult h2'); return h2 && /2$/.test(h2.textContent); }, null, { timeout: 60000 });
  check((await sig()) !== first && (await p.textContent('#blStatPlaced b')) === '234 / 234', 'another design gives a different complete schedule');
  await noSideScroll(p, 'schedule builder');
  await shot(p, '6d-builder-result');
  await p.click('#blApply');
  check((await p.textContent('#blApply')).includes('6') && (await p.textContent('#blApply')).includes('41'), 'applying says first how many classes and current sessions it replaces');
  await p.click('#blApply');
  await p.waitForFunction(() => Array.from(document.querySelectorAll('.toast')).some(e => e.textContent.includes('اعتُمد الجدول')));
  check(!(await p.$$eval('.toast', els => els.map(e => e.textContent).join())).includes('تعارض مع صفوف خارج البناء'), 'applying reports no clash with the class that was not built');
  await p.waitForSelector('#ttWeek');
  await settle(p);
  check((await title(p)) === 'الجدول المدرسي' && (await val('#ttPick')).endsWith('|4A') && (await sess()) === 40 && (await p.$eval('#ttPick', e => e.options.length)) === 7 && (await slotText('2-8')).includes('نشاط'),
    'the built schedule becomes the school schedule; the class that was not built is kept');
  await p.click('#ttWeek .slot[data-slot="0-1"] .sess');
  await p.waitForSelector('#lessonForm #ttSave');
  check((await val('#ttClass')) === '4A' && (await val('#ttPeriod')) === '1', 'and each session of it can still be changed by hand');
  await p.keyboard.press('Escape'); await closed();
  await p.click('#nb-undo'); await p.waitForFunction(() => { const s = document.querySelector('#ttPick'); return s && s.options.length === 3; });
  check((await p.$eval('#ttPick', e => e.options.length)) === 3 && (await p.$$eval('#ttPick option', els => els.map(e => e.textContent).join())).includes('5A'), 'undo puts the earlier school schedule back');
  await nav(p, 'builder'); await p.waitForSelector('#blTabs');
  await p.selectOption('#blStage', 'متوسط بنين عالمي'); await p.waitForTimeout(200); await step('plan');
  check(!!(await p.$('#blNoPlan')) && (await count(p, '#blPlan')) === 0, 'each stage has its own setup: another stage starts empty');
  await p.selectOption('#blStage', 'ابتدائي بنين عالمي'); await p.waitForTimeout(200);
  check((await count(p, '#blPlan tbody tr')) === 6, 'and the first stage keeps its own');
  await nav(p, 'timetable'); await p.waitForSelector('#ttWeek');

  // ---- classroom visits: three forms, a visit recorded on a teacher, the teachers' evaluation ----
  const vrows = () => count(p, '.view.visits .vlog tbody tr');
  const rate = (item, v) => p.check('.vitem[data-item="' + item + '"] input[value="' + v + '"]');
  await nav(p, 'visits');
  await p.waitForSelector('#vsTabs');
  check((await title(p)) === 'الزيارات الصفية' && (await vrows()) === 3 && (await p.textContent('#vsLogCount')).startsWith('3 ') && (await p.textContent('.vlog')).includes('المشرف الأكاديمي'), 'the visits section lists the visits of the stage, with visitor, form and result');
  await p.click('#vsTabs [data-tab="forms"]'); await p.waitForTimeout(200);
  check((await count(p, '[data-form]')) === 3 && (await count(p, '[data-edit]')) === 3 && (await p.textContent('[data-form="academic"]')).includes('المشرف الأكاديمي') && (await p.textContent('[data-form="vp"]')).includes('الوكيل'),
    'there are three forms: the Principal, the academic supervisor and the Vice Principal; the Principal may change them');
  await p.click('[data-edit="principal"]'); await p.waitForSelector('#formEditor');
  check((await val('#feItems')).startsWith('# التخطيط والإعداد') && (await val('#feScale')).split('،').length === 4, 'a form opens as plain text: a line for each item, and a # line for each domain');
  await p.fill('#feScale', 'واحد'); await p.click('#feSave'); await errToast('مستويين');
  await p.fill('#feTitle', 'استمارة زيارة المدير'); await p.fill('#feScale', 'متميز، متحقق، غير متحقق');
  await p.fill('#feItems', '# التخطيط\n1. خطة الدرس مكتوبة\n- الأهداف واضحة\n\n# التنفيذ\nيدير الوقت بكفاءة\n• يتابع تعلم الطلاب\n3 أنشطة على الأقل');
  await p.click('#feSave'); await closed();
  const pf = await p.textContent('[data-form="principal"]');
  check(pf.includes('استمارة زيارة المدير') && pf.includes('2 ') && pf.includes('5 ') && pf.includes('متميز، متحقق، غير متحقق') && (await p.$$eval('[data-form="principal"] li', els => els.map(e => e.textContent).join('|'))) === 'خطة الدرس مكتوبة|الأهداف واضحة|يدير الوقت بكفاءة|يتابع تعلم الطلاب|3 أنشطة على الأقل',
    'the Principal replaces a form by pasting it: numbering and bullets are dropped, domains and scale are kept');
  await p.click('#vsNew'); await p.waitForSelector('#visitForm');
  check((await count(p, '.vitem')) === 5 && (await p.textContent('#vfScale')).includes('3 متميز') && !(await p.$('#vfKind')) && (await p.$$eval('#vfTeacher option', els => els.map(e => e.value))).indexOf('principal@preview.example') === -1 && (await count(p, '.vitem[data-item="0-0"] input')) === 4,
    "a new visit opens on the visitor's own form: each item has the scale's levels and \"does not apply\"");
  await p.selectOption('#vfTeacher', 'teacher@preview.example');
  await p.waitForSelector('#vfSessions .chip');
  check((await count(p, '#vfSessions .chip')) >= 2 && (await p.textContent('#vfSessions')).includes('6B'), "choosing the teacher shows their sessions that day from the school timetable");
  await p.click('#vfSessions .chip[data-session="2"]');
  check((await val('#vfClass')) === '6B' && (await val('#vfSubject')) === 'English' && (await val('#vfPeriod')) === '2', 'one press fills the class, subject and session');
  await rate('0-0', 3); await rate('0-1', 3); await rate('1-0', 2); await rate('1-1', 1);
  check((await p.textContent('#vfScore')) === '75%' && (await p.textContent('#vfLeft')).includes('1') && (await p.textContent('.secpct >> nth=0')) === '100%', 'the result is worked out as the ratings are chosen, for the visit and for each domain');
  await p.click('#vfSave'); await errToast('بنود بلا تقييم');
  check((await count(p, '.vitem.miss')) === 1 && !!(await p.$('#visitForm')), 'a visit with an item left unrated is not saved, and the item is marked');
  await rate('1-2', 0);
  check((await p.textContent('#vfScore')) === '75%' && (await count(p, '.vitem.miss')) === 0, '"does not apply" completes the item without changing the result');
  await p.fill('#vfStrengths', 'تفاعل الطلاب مرتفع'); await p.fill('#vfRecommend', 'حضور ورشة التقويم'); await p.fill('#vfNote', 'ملاحظة للإدارة فقط');
  await p.click('#vfSave');
  await p.waitForSelector('#visitReport');
  const rep = await p.textContent('.view.visits');
  check((await p.textContent('#vdScore b')) === '75%' && rep.includes('معلم (معاينة)') && rep.includes('6B') && rep.includes('مدير المدرسة (معاينة) · المدير') && (await p.textContent('#vdState')).includes('لم يطّلع'), "the visit is saved in the teacher's file and opens as a report: who, when, which class, by whom");
  check((await p.$$eval('#visitReport .vdom', els => els.map(e => e.textContent).join('|'))) === 'التخطيط100%|التنفيذ50%' && rep.includes('3 · متميز') && rep.includes('1 · غير متحقق') && rep.includes('لا ينطبق') && rep.includes('حضور ورشة التقويم') && (await p.textContent('#vdPrivate')).includes('ملاحظة للإدارة فقط'),
    'the report shows the result of each domain, the rating of each item, the notes, and the private note for admins');
  check(!!(await p.$('#vdEdit')) && !!(await p.$('#vdDelete')) && !!(await p.$('#vdPrint')), 'the visitor can change, print or delete their visit');
  await p.click('#vdEdit'); await p.waitForSelector('#visitForm');
  check((await p.textContent('#vfTeacherName')) === 'معلم (معاينة)' && (await p.isChecked('.vitem[data-item="1-1"] input[value="1"]')) && (await val('#vfStrengths')) === 'تفاعل الطلاب مرتفع', 'changing a visit opens it as it was recorded; the teacher stays');
  await rate('1-1', 3);
  await p.click('#vfSave'); await p.waitForSelector('#visitReport');
  check((await p.textContent('#vdScore b')) === '92%', 'the change is saved and the result follows');
  await p.click('#nb-undo'); await p.waitForFunction(() => { const b = document.querySelector('#vdScore b'); return b && b.textContent === '75%'; });
  check((await p.textContent('#vdScore b')) === '75%', 'undo puts the earlier ratings back');
  await p.click('#vdBack'); await p.waitForSelector('#vsTabs');
  await p.click('#vsTabs [data-tab="log"]'); await p.waitForTimeout(200);
  check((await vrows()) === 4 && (await p.textContent('.vlog tbody tr')).includes('75%'), 'the new visit heads the list');
  await p.selectOption('#vsKind', 'vp'); await p.waitForTimeout(200);
  check((await vrows()) === 1, 'the list can be narrowed to one form');
  await p.click('.vlog tbody tr'); await p.waitForSelector('#visitReport');
  check(!(await p.$('#vdEdit')) && !(await p.$('#vdDelete')) && (await p.textContent('#visitReport')).includes('وكيل المدرسة'), "another admin's visit can be read, not changed or deleted");
  await p.click('#vdBack'); await p.waitForSelector('#vsTabs');
  await p.selectOption('#vsKind', ''); await p.waitForTimeout(200);
  await p.click('.vlog tbody tr'); await p.waitForSelector('#vdDelete');
  await p.click('#vdDelete');
  check((await p.textContent('#vdDelete')) === 'تأكيد الحذف', 'deleting a visit asks once more');
  await p.click('#vdDelete'); await p.waitForSelector('#vsTabs');
  check((await vrows()) === 3, 'then removes it');
  await p.click('#nb-undo'); await p.waitForFunction(() => document.querySelectorAll('.view.visits .vlog tbody tr').length === 4);
  check((await vrows()) === 4, 'and undo brings the visit back');
  await p.click('#vsTabs [data-tab="eval"]'); await p.waitForSelector('#vsEval');
  const evalRow = await p.textContent('#vsEval tbody tr');
  check((await count(p, '#vsEval tbody tr')) === 1 && evalRow.includes('معلم (معاينة)') && evalRow.includes('82%') && (await p.textContent('#vsEvalStats')).includes('1 / 1') && (await count(p, '#vsEval thead th')) === 7,
    "the teachers' evaluation gathers each teacher's visits: how many, the last one, the average, and the average of each form");
  await p.click('#vsEval tbody tr'); await p.waitForSelector('.sheet #tsNew');
  check((await count(p, '.sheet .vlog tbody tr')) === 4 && (await count(p, '.sheet .vdom')) >= 6 && (await p.textContent('.sheet .stats')).includes('82%'), "a teacher's sheet shows their averages by form and by domain, and their visits");
  await p.click('.sheet #tsNew'); await p.waitForSelector('#visitForm');
  check((await val('#vfTeacher')) === 'teacher@preview.example', 'a new visit can be started from the teacher, already chosen');
  await p.click('#vfBack'); await p.waitForSelector('#vsTabs');
  await p.click('#vsTerm [data-term="2"]'); await p.waitForTimeout(200);
  check((await p.textContent('#vsEval tbody tr')).includes('لم يُزر') && (await p.textContent('#vsEvalStats')).includes('0 / 1'), 'by term, a teacher with no visit yet is flagged as not visited');
  await p.click('#vsTerm [data-term=""]'); await p.waitForTimeout(200);
  await noSideScroll(p, 'classroom visits');
  await shot(p, '6e-visits-evaluation');

  // ---- weekly report ----
  await nav(p, 'home');
  await p.waitForSelector('#tiles .tile');
  const homeNow = await nums();
  await nav(p, 'weekly');
  await p.waitForSelector('#weeklyLate');
  const cells = sel => p.$$eval(sel, rows => rows.map(r => Array.from(r.children).map(td => td.textContent.trim())));
  const states = await cells('#weeklyStates tbody tr');
  check((await p.textContent('#weeklyWho')) === 'مدارس الأندلس العالمية' && states.length === 6 && states.slice(0, 4).map(r => +r[1]).join() === homeNow.slice(1, 5).join() && states.reduce((a, r) => a + +r[1], 0) === homeNow[0],
    'the weekly report shows the same numbers as the home page (' + states.map(r => r[1]).join(', ') + ')');
  check((await p.textContent('#weeklyPct')) === Math.round(homeNow[1] * 100 / homeNow[0]) + '%' && (await count(p, '#weeklyReport .ring')) === 4, 'with the progress rings and the share completed');
  check(states[0].length === 4 && (await p.textContent('#weeklyDelta')).includes('8 نوفمبر') && states.some(r => /^[+−]\d+$/.test(r[3])), 'and what changed since the week before');
  const lateRows = await cells('#weeklyLate tbody tr'), lateHead = await p.$$eval('#weeklyLate thead th', els => els.map(e => e.textContent));
  check(lateRows.length === 12 && lateHead.includes('المرحلة') && lateRows.every((r, i) => i === 0 || +lateRows[i - 1][4] >= +r[4]), 'the late list starts with the longest overdue, and names the stage when the report covers two');
  check((await count(p, '#weeklyInd tbody tr')) === 18 && (await count(p, '#weeklyInd .pill')) === 18, 'every indicator has a line with its state');
  const perRow = (await cells('#weeklyPeople tbody tr')).find(r => r[0] === 'معلم (معاينة)');
  check(!!perRow && +perRow[1] === assigned + 1, 'each person has a line (' + JSON.stringify(perRow) + ')');
  await noSideScroll(p, 'weekly report');
  await p.selectOption('#stagePick', 'متوسط بنين عالمي');
  await p.waitForTimeout(200);
  check((await p.textContent('#weeklyWho')) === 'متوسط بنين عالمي' && !(await p.$$eval('#weeklyLate thead th', els => els.map(e => e.textContent))).includes('المرحلة') && +(await cells('#weeklyStates tbody tr')).reduce((a, r) => a + +r[1], 0) < homeNow[0], 'choosing a stage gives that stage alone');
  await p.selectOption('#stagePick', '');
  await p.click('#weeklyMail');
  await p.waitForFunction(() => Array.from(document.querySelectorAll('.toast')).some(e => e.textContent.includes('أُرسل التقرير')));
  check(true, 'an admin can have the report emailed to themselves');
  await p.emulateMedia({ media: 'print' });
  const onPaper = await p.evaluate(() => { const d = s => getComputedStyle(document.querySelector(s)).display; return { rail: d('.rail'), top: d('#top'), buttons: d('#weeklyReport .noprint'), bg: getComputedStyle(document.body).backgroundColor, rows: document.querySelectorAll('#weeklyLate tbody tr').length }; });
  check(onPaper.rail === 'none' && onPaper.top === 'none' && onPaper.buttons === 'none' && onPaper.bg === 'rgb(255, 255, 255)' && onPaper.rows === 12, 'on paper only the report is printed, on white ' + JSON.stringify(onPaper));
  await p.emulateMedia({ media: 'screen' });
  await shot(p, '6b-weekly');

  // ---- the pages that were already there ----
  await nav(p, 'alerts');
  await p.waitForSelector('.card[data-alert]');
  check((await count(p, '.card[data-alert]')) > 0 && !!(await p.$('#testMe')), "notifications page lists today's recipients");
  check((await count(p, 'a.wa[href^="https://wa.me/9665"]')) > 0, 'a ready WhatsApp message is offered for people with a number');
  check(!(await p.textContent('#main')).includes('متابعة الطابور الصباحي'), "private tasks never appear on the shared notifications page");
  await nav(p, 'checks');
  await p.waitForSelector('.checkc');
  check((await count(p, '.checkc')) === 9, 'nine data checks');
  await nav(p, 'admin');
  await p.waitForSelector('table tbody tr');
  check((await count(p, 'table tbody tr')) === 5, 'the principal, as an admin, sees the users');
  await p.click('table tbody tr');
  await p.waitForSelector('.sheet input[type=tel]');
  check((await count(p, '.sheet select')) === 2, 'user form has role and notification channel');
  await p.keyboard.press('Escape');
  // ---- employees from an Excel file, a Google Sheets link, or pasted cells ----
  const FX = require('path').join(__dirname, 'fixtures'), fx = name => require('path').join(FX, name);
  const usersN = () => count(p, '.view table tbody tr'), countOf = k => p.textContent('#uiCounts [data-count="' + k + '"] b');
  const waitCount = (k, n) => p.waitForFunction(x => { const b = document.querySelector('#uiCounts [data-count="' + x[0] + '"] b'); return b && b.textContent === String(x[1]); }, [k, n]);
  const picked = id => p.$eval(id, e => e.selectedOptions[0].textContent);
  const usersWere = await usersN();
  check((await p.textContent('.view table thead')).includes('الوظيفة والتخصص') && !!(await p.$('#importUsers')), 'the users page has a column for position and major, and an import button');
  await p.click('#importUsers'); await p.waitForSelector('#usersImport');
  check((await isOff(p, '#uiGo')) && (await count(p, '#uiStages input')) === 3 && !!(await p.$('.picker input[type=file]')) && !!(await p.$('#uiTemplate')), 'the import takes an Excel or CSV file, a Google Sheets link, or pasted cells, and offers a template');
  await p.fill('.picker-link input', 'https://docs.google.com/spreadsheets/d/' + 'A'.repeat(30) + '/edit#gid=0'); await p.click('.picker-link button');
  await waitCount('error', 3);
  check((await p.textContent('#uiRows')).includes('اختر المرحلة') && (await isOff(p, '#uiGo')) && (await val('#uiPaste')).split('\n').length === 4, 'a table read from a Google Sheets link is checked at once; a new employee needs a stage');
  await p.check('#uiStages input[value="ابتدائي بنين عالمي"]');
  await waitCount('new', 3);
  check((await p.textContent('#uiGo')).trim() === 'استيراد · 3' && !(await isOff(p, '#uiGo')), 'choosing the stage makes the rows ready to import');
  await p.setInputFiles('.picker input[type=file]', fx('old.xls')); await errToast('xlsx');
  await p.setInputFiles('.picker input[type=file]', fx('employees.xlsx'));
  await waitCount('update', 1);
  check(!(await val('#uiPaste')).includes('secret-sheet') && (await picked('#uiCol-email')) === 'البريد المدرسي' && (await picked('#uiCol-phone')) === 'رقم الواتساب' && (await picked('#uiCol-position')) === 'المسمى الوظيفي' && (await picked('#uiCol-major')) === 'التخصص' && (await picked('#uiCol-name')) === 'الاسم',
    'an Excel file is read in the page: its first visible sheet, with the columns recognised from their headings');
  const rowsText = await p.$$eval('#uiRows tbody tr', els => els.map(e => e.dataset.status + ':' + e.cells[0].textContent + ':' + e.cells[3].textContent));
  check((await countOf('new')) === '3' && (await countOf('error')) === '2' && (await countOf('same')) === '0' && rowsText[0].startsWith('error:7:') && rowsText[0].includes('لا يوجد بريد') && rowsText[1].startsWith('error:8:') && rowsText[1].includes('نطاق المدرسة') && rowsText.length === 6,
    'every row is checked before anything is saved; wrong rows come first, with their line in the file and the reason');
  await p.selectOption('#uiCol-email', ''); await p.waitForSelector('#uiPreview .note.warn');
  check(await isOff(p, '#uiGo'), 'without a school email column nothing can be imported');
  await p.selectOption('#uiCol-email', '4'); await waitCount('update', 1);
  await p.click('#uiGo'); await closed();
  const tableText = await p.textContent('.view table');
  check((await usersN()) === usersWere + 3 && tableText.includes('خالد العتيبي') && tableText.includes('معلم · رياضيات') && tableText.includes('منسق اللغة الإنجليزية · English') && !tableText.includes('من خارج المدرسة'),
    'importing adds the new employees and updates the existing one; the wrong rows are left out');
  await p.click('.view table tbody tr:has-text("sami@preview.example")'); await p.waitForSelector('.sheet #ufPosition');
  check((await val('.sheet input[type=tel]')) === '966501112244' && (await val('#ufPosition')) === 'معلم أول' && (await val('#ufMajor')) === 'علوم' && (await p.$eval('.sheet form select', e => e.value)) === 'teacher' && (await val('.sheet input[type=email]')) === 'sami@preview.example',
    'an imported employee is a teacher, with major, position, and the WhatsApp number in international form');
  await p.fill('#ufMajor', 'كيمياء'); await p.click('.sheet form .btn[type=submit]'); await closed();
  check((await p.textContent('.view table')).includes('معلم أول · كيمياء'), 'major and position can be changed on the user form');
  await p.click('#nb-undo'); await p.waitForFunction(n => document.querySelectorAll('.view table tbody tr').length === n, usersWere);
  check(!(await p.textContent('.view table')).includes('خالد العتيبي') && !(await p.textContent('.view table')).includes('منسق اللغة الإنجليزية'), 'undo removes the employees the import added and restores the one it changed');
  await p.click('#importUsers'); await p.waitForSelector('#usersImport');
  await p.check('#uiStages input[value="متوسط بنين عالمي"]');
  await p.setInputFiles('.picker input[type=file]', fx('staff-openpyxl.xlsx'));
  await waitCount('new', 2);
  check((await picked('#uiCol-name')) === 'Name' && (await picked('#uiCol-email')) === 'School E-mail' && (await picked('#uiCol-phone')) === 'WhatsApp' && (await picked('#uiCol-major')) === 'Major', 'a file from another program, with English headings in another order, is read the same way');
  await p.fill('#uiPaste', 'huda@preview.example\tهدى عمر\t0501113322');
  await waitCount('new', 1);
  check((await picked('#uiCol-email')).includes('1') && (await picked('#uiCol-name')).includes('2') && (await picked('#uiCol-phone')).includes('3'), 'pasted cells with no heading line are understood from what they hold');
  await p.keyboard.press('Escape'); await closed();
  // the same three sources feed the other imports
  await nav(p, 'timetable'); await p.waitForSelector('#ttWeek');
  await p.click('#ttImport'); await p.waitForSelector('#ttPaste');
  await p.setInputFiles('.picker input[type=file]', fx('timetable-cp1256.csv'));
  await p.waitForFunction(() => document.querySelector('#ttPaste').value.includes('9Z'));
  check((await val('#ttPaste')).includes('الأحد') && (await val('#ttPaste')).includes('فهد، القحطاني\tR1'), 'a CSV file in the older Arabic encoding is read correctly, and a quoted cell keeps its comma');
  await p.click('#ttImportGo'); await closed();
  check((await val('#ttPick')).endsWith('|9Z') && (await sess()) === 2, 'the school timetable is imported from the file');
  await p.click('#nb-undo'); await p.waitForFunction(() => !Array.from(document.querySelectorAll('#ttPick option')).some(o => o.value.endsWith('|9Z')));
  await nav(p, 'builder'); await p.waitForSelector('#blTabs'); await step('plan');
  await p.click('#blPastePlan'); await p.waitForSelector('#bpPaste');
  await p.setInputFiles('.picker input[type=file]', fx('plan.xlsx'));
  await p.waitForFunction(() => document.querySelector('#bpPaste').value.includes('8A'));
  await p.click('#bpGo'); await closed();
  check((await val('#blPlan [data-cell="8A|English"]')) === '6' && (await val('#blPlan [data-cell="8A|Drama"]')) === '1' && (await val('#blPlan [data-cell="8B|Drama"]')) === '', "the schedule builder's plan is filled from an Excel file");
  await p.click('#nb-undo'); await p.waitForFunction(() => !document.querySelector('#blPlan [data-class="8A"]'));
  await nav(p, 'admin'); await p.waitForSelector('#addUser');
  await p.click('.tabs [data-tab="settings"]');
  await p.waitForSelector('#notifyTime');
  check((await p.$eval('#notifyTime', e => e.value)) === '07:30', 'notification time starts at 7:30');
  await p.fill('#notifyTime', '06:45');
  await p.fill('#sloganInput', 'نتعلم اليوم لنقود الغد');
  await p.click('#settingsForm .btn[type=submit]');
  await p.waitForTimeout(700);          // let the save finish before reading the form again
  await p.waitForSelector('#notifyTime');
  check((await p.$eval('#notifyTime', e => e.value)) === '06:45', 'an admin changes the notification time');
  check((await p.$eval('#weeklyOn', e => e.checked)) && (await p.$eval('#weeklyDay', e => e.value)) === '0', 'the weekly report is on, for Sundays, to begin with');
  await p.selectOption('#weeklyDay', '4');
  await p.click('#settingsForm .btn[type=submit]');
  await p.waitForTimeout(700);
  await p.waitForSelector('#weeklyDay');
  check((await p.$eval('#weeklyDay', e => e.value)) === '4', 'an admin chooses the day of the weekly report');
  check((await p.$eval('#planEdit', e => e.type)) === 'checkbox', "the admins have a switch for teachers' plan requests");
  // buttons to other platforms: the list, and who sees each
  check((await count(p, '#linkRows .linkrow')) === 1 && (await p.$eval('#linkRows .linkrow input[type=url]', e => e.value)) === 'https://andalus-idp.online/' && (await p.$eval('#linkRows .linkrow select', e => e.value)) === 'admins',
    'settings list the buttons to other platforms, each with who sees it');
  await p.click('#addLink');
  await p.fill('#linkRows .linkrow:last-child input[type=text]', 'EduPage');
  await p.fill('#linkRows .linkrow:last-child input[type=url]', 'http://school.edupage.org/');
  await p.selectOption('#linkRows .linkrow:last-child select', 'all');
  await p.evaluate(() => { document.querySelector('#settingsForm').noValidate = true; });
  await p.click('#settingsForm .btn[type=submit]');
  await p.waitForFunction(() => Array.from(document.querySelectorAll('.toast.err')).some(e => e.textContent.includes('https://')));
  check((await count(p, '.navlist a.navlink')) === 1, 'a link that is not https is refused');
  await p.fill('#linkRows .linkrow:last-child input[type=url]', 'https://school.edupage.org/');
  await p.click('#settingsForm .btn[type=submit]');
  await p.waitForFunction(() => document.querySelectorAll('.navlist a.navlink').length === 2);
  check((await p.$$eval('.navlist a.navlink', els => els.map(a => a.textContent).join())) === 'منصة التطور المهني,EduPage' && (await count(p, '#linkRows .linkrow')) === 2, 'an admin adds a button for another platform, for everyone');
  await noSideScroll(p, 'settings');
  await nav(p, 'alerts');
  await p.waitForSelector('.panel h2');
  const sendAt = await p.textContent('.panel h2');
  check(sendAt.includes('06:45'), 'the notifications page shows the new time (' + sendAt + ')');

  // ---- sign out returns to the start page, with the slogan the admin wrote ----
  await p.click('.rail-tools [data-tool="out"]');
  await p.waitForSelector('#loginBtn');
  check((await p.textContent('#slogan')) === 'نتعلم اليوم لنقود الغد' && (await count(p, '.prow, .tile, .cv-card')) === 0, 'sign-out returns to the start page; it shows the new slogan and no data');

  // ---- teacher: one school, so no chooser ----
  await p.selectOption('#viewAs', { label: 'معلم (معاينة)' });
  await p.waitForSelector('.tile');
  await p.waitForTimeout(400);
  check((await count(p, '.navlist button')) === 8, 'a teacher sees eight menu items');
  check((await p.$$eval('a[data-link]', els => els.map(a => a.getAttribute('href')))).every(u => u === 'https://school.edupage.org/') && (await count(p, '.navlist a.navlink')) === 1 && (await count(p, '#homeLinks a[data-link]')) === 1 && !(await p.$eval('#app', e => e.textContent)).includes('التطور المهني'),
    "a teacher sees the button meant for everyone, and nothing of the admins' one");
  check((await count(p, '.navlist [data-view="people"], .navlist [data-view="weekly"], .navlist [data-view="review"], .navlist [data-view="admin"]')) === 0, 'no monitoring, weekly report, review or admin pages for a teacher');
  check((await texts(p, '.view h2'))[0] === 'مهامي', 'teacher home starts with their tasks');
  check((await isOff(p, '#nb-undo')) && (await isOff(p, '#nb-back')), 'a new visit starts with empty history');
  // the teacher's own visits
  check((await p.textContent('.navlist button[data-view="visits"] .badge')) === '2', 'a teacher is told how many shared visits they have not read');
  await nav(p, 'visits');
  await p.waitForSelector('#vsMineStats');
  check(!(await p.$('#vsTabs')) && !(await p.$('#vsNew')) && (await count(p, '.view.visits .vlog tbody tr')) === 4 && (await p.textContent('#vsMineStats')).includes('82%') && (await p.textContent('.vlog')).includes('جديدة'), 'a teacher sees their own visits and their average, and cannot record visits');
  await p.click('.vlog tbody tr'); await p.waitForSelector('#visitReport');
  const mineRep = await p.textContent('.view.visits');
  check(mineRep.includes('حضور ورشة التقويم') && mineRep.includes('75%') && !mineRep.includes('ملاحظة للإدارة فقط') && !(await p.$('#vdEdit')) && !(await p.$('#vdDelete')) && !(await p.$('#vdState')), "the teacher opens the visit report with its notes, without the admins' private note and without changing it");
  await p.click('#vdSeen'); await p.waitForFunction(() => !document.querySelector('#vdSeen'));
  check((await p.textContent('.navlist button[data-view="visits"] .badge')) === '1', 'confirming that they read it lowers the count');
  await p.click('#vdBack'); await p.waitForSelector('#vsMineStats');
  await nav(p, 'home'); await p.waitForSelector('.tile');
  await p.fill('#topSearch', pickedName);
  await p.waitForTimeout(500);
  await p.locator('.prow', { hasText: pickedName }).first().click();
  await p.waitForSelector('.sheet');
  check((await p.textContent('#whoBox')).includes('معلم (معاينة)') && !(await p.$('#whoPick')) && !(await p.$('#bulkAssign')), 'the teacher sees that the programme is theirs, and cannot assign');
  await p.keyboard.press('Escape');
  await nav(p, 'home');
  await p.waitForSelector('.tile');
  await p.click('.prow');
  await p.waitForSelector('.sheet form[data-form="report"]');
  check(!(await p.$('#editForm')), 'teacher has no edit form');
  await p.fill('.sheet form input[type=number]', '25');
  await p.setInputFiles('.sheet form [data-evfile]', { name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64') });
  await p.waitForFunction(() => document.querySelector('.sheet form input[type=url]').value.startsWith('https://drive.google.com/file/d/'));
  check(true, 'a teacher uploads a photo as evidence in the report form');
  await p.click('.sheet form .btn[type=submit]');
  await p.waitForTimeout(600);
  await nav(p, 'mine');
  await p.waitForSelector('.card');
  const mineN = await count(p, '.card');
  check(mineN >= 4 && (await count(p, '.card a[href^="https://drive.google.com/file/d/preview-"]')) >= 1, 'the new report appears under my reports, with its uploaded evidence');
  await p.click('#nb-undo'); await settle(p);
  check((await count(p, '.card')) === mineN - 1, 'a teacher can undo a report that was just sent');
  await p.click('#nb-redo'); await settle(p);
  check((await count(p, '.card')) === mineN, 'and send it again with redo');
  await nav(p, 'mycal');
  await p.waitForSelector('#week');
  check((await count(p, '.tabs [data-tab]')) === 0 && !(await p.$('#addTask')) && (await count(p, '#week .sess')) === 6, 'a teacher has the sessions timetable and no tasks calendar');
  await nav(p, 'calendar');
  await p.waitForSelector('.cal');
  check((await count(p, '#dayPanel .prow')) > 0, 'a teacher sees the programmes calendar of their stages');

  // ---- the school schedule, as a teacher sees it ----
  await nav(p, 'timetable');
  await p.waitForSelector('#ttWeek');
  check((await p.$eval('.tabs [aria-selected="true"]', e => e.dataset.tab)) === 'mine' && (await count(p, '#ttWeek .sess.mine')) === (await count(p, '#ttWeek .sess')) && (await count(p, '#ttWeek .sess')) >= 10, 'a teacher opens the school schedule on their own sessions');
  check(!(await p.$('#ttAdd')) && !(await p.$('#ttImport')) && !(await p.$('#ttTimes')) && (await count(p, '#ttWeek button.sess')) === 0 && (await count(p, '#ttWeek .slot-add')) === 0 && (await count(p, '#ttWeek .slot')) === 40, 'and can read it, with the session times, but not change it');
  await p.click('.tabs [data-tab="class"]');
  await p.waitForSelector('#ttPick');
  check((await p.$eval('#ttPick', e => e.options.length)) >= 2, 'a teacher can also look up any class of their stage');

  // ---- the plan: a teacher proposes, an admin decides ----
  await nav(p, 'programs');
  await p.waitForSelector('#planAdd');
  check((await p.textContent('#planAdd')).trim() === 'اقتراح برنامج', 'a teacher can propose a programme');
  await p.click('#planAdd');
  await p.waitForSelector('#planForm #planState');
  await p.selectOption('#planKpi', 'C.Br 1.3');
  await p.waitForSelector('#planSend');
  check((await p.textContent('#planState')).includes('يُرسل طلبك لمديري النظام') && (await p.$eval('#planBody [data-field="assignee"]', e => e.value)) === 'معلم (معاينة)', "the form says the request goes to the admins, and suggests the teacher's own name");
  await p.fill('#planBody [data-field="name"]', 'أولمبياد اللغة الإنجليزية');
  await p.selectOption('#planBody [data-field="term"]', 'فصل 2');
  await p.selectOption('#planBody [data-field="week"]', 'الأسبوع 4');
  await p.click('#planSend');
  await p.waitForSelector('.sheet', { state: 'detached' });
  await p.fill('#topSearch', 'أولمبياد اللغة الإنجليزية');
  await p.waitForTimeout(500);
  check((await count(p, '.prow')) === 0, "a teacher's proposal changes nothing until an admin decides");
  await nav(p, 'mine');
  await p.waitForSelector('.card [data-kind="add"]');
  check((await p.textContent('.card:has([data-kind="add"])')).includes('أولمبياد اللغة الإنجليزية') && (await p.textContent('.card:has([data-kind="add"])')).includes('الأسبوع 4'), 'the proposal waits under the teacher\'s own requests, with what was typed');
  await p.selectOption('#viewAs', { label: 'مدير المدرسة (معاينة)' });
  await p.waitForSelector('.cv-card');
  await p.click('.cv-card[data-school="intl"]');
  await p.waitForSelector('#tiles .tile');
  await nav(p, 'review');
  await p.waitForSelector('.card:has([data-kind="add"]) [data-act="approve"]');
  await p.click('.card:has([data-kind="add"]) [data-act="approve"]');
  await p.waitForFunction(() => !document.querySelector('.card [data-kind="add"]'));
  await p.fill('#topSearch', 'أولمبياد اللغة الإنجليزية');
  await p.waitForTimeout(500);
  check((await count(p, '.prow')) === 1 && (await p.textContent('.prow')).includes('معلم (معاينة)'), 'when an admin approves, the programme joins the plan with the teacher as its responsible person');

  // ---- phone, dark, English ----
  const q = await open(400, 800, 'dark');
  await noSideScroll(q, 'phone start page');
  await shot(q, '7-phone-start');
  await q.click('#loginBtn');
  await q.waitForSelector('.cv-card');
  await noSideScroll(q, 'phone chooser');
  await q.click('.cv-card[data-school="intl"]');
  await q.waitForSelector('#tiles .tile');
  await noSideScroll(q, 'phone home');
  await shot(q, '8-phone-home');
  check((await q.$eval('.rail', e => getComputedStyle(e).display)) === 'none' && (await q.$eval('.tabbar', e => getComputedStyle(e).display)) !== 'none', 'phone uses the bottom tab bar');
  check((await count(q, '#nb-back')) === 1 && (await count(q, '#nb-undo')) === 1, 'back, forward, undo and redo are on the phone too');
  await q.click('.tabbar button[data-view="more"]');
  await q.waitForSelector('.sheet');
  check((await q.$$eval('.sheet a[data-link]', els => els.map(a => a.getAttribute('href') + a.target).join())) === 'https://andalus-idp.online/_blank' && (await count(q, '#homeLinks a[data-link]')) === 1, 'on the phone the button is under More and on the home page');
  await q.click('.sheet button:has-text("English")');
  await q.waitForTimeout(300);
  check((await q.$eval('#app', e => e.dir)) === 'ltr' && (await q.textContent('.hello b')) === 'Andalus International Schools', 'language switches to English and left-to-right');
  await q.click('.tabbar button[data-view="calendar"]');
  await q.waitForSelector('.cal');
  await noSideScroll(q, 'phone calendar');
  await shot(q, '9-phone-calendar');
  await q.click('.tabbar button[data-view="people"]');
  await q.waitForSelector('#peopleTable');
  await noSideScroll(q, 'phone by teacher');
  await q.click('.tabbar button[data-view="more"]');
  await q.click('.sheet button[data-view="mycal"]');
  await q.waitForSelector('#addTask');
  await noSideScroll(q, 'phone tasks');
  await q.click('.tabs [data-tab="sessions"]');
  await q.waitForSelector('#week');
  await noSideScroll(q, 'phone timetable');
  await shot(q, '10-phone-sessions');
  await q.click('.tabbar button[data-view="more"]');
  await q.click('.sheet button[data-view="timetable"]');
  await q.waitForSelector('#ttWeek');
  await noSideScroll(q, 'phone school timetable');
  check((await count(q, '#ttWeek .slot')) === 40, 'the phone shows the same eight sessions for each of the five days');
  await shot(q, '10b-phone-timetable');
  await q.click('#ttTimes');
  await q.waitForSelector('#periodsForm');
  await noSideScroll(q, 'phone session times');
  check(await q.$$eval('#periodsForm input[type=time]', els => els.length === 16 && els.every(e => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.width >= 130; })), 'the session-times editor fits the phone, with every time box on screen and wide enough to read');
  await shot(q, '10c-phone-session-times');
  await q.keyboard.press('Escape');
  await q.waitForSelector('.sheet', { state: 'detached' });
  // the builder on a phone, in English
  await q.click('.tabbar button[data-view="more"]');
  await q.click('.sheet button[data-view="builder"]');
  await q.waitForSelector('#blPlan');
  check((await title(q)) === 'Schedule builder' && (await q.textContent('#blTabs')).includes('Instructions') && (await q.textContent('#blPlan thead')).includes('Total'), 'the schedule builder opens on the phone, in English');
  await noSideScroll(q, 'phone builder plan');
  await shot(q, '10d-phone-builder-plan');
  for (const k of ['teachers', 'assign', 'rules']) { await q.click('#blTabs [data-tab="' + k + '"]'); await q.waitForTimeout(200); await noSideScroll(q, 'phone builder ' + k); }
  check((await q.textContent('#blRules li[data-type="together"]')).includes('at most 1 class(es) at the same time') && (await q.textContent('#blRules')).includes('Prefer'), 'instructions read as English sentences');
  await q.click('#blAddRule'); await q.waitForSelector('#brForm');
  await noSideScroll(q, 'phone builder instruction form');
  await q.keyboard.press('Escape'); await q.waitForSelector('.sheet', { state: 'detached' });
  await q.click('#blTabs [data-tab="build"]'); await q.waitForTimeout(200);
  await q.click('#blGo');
  await q.waitForSelector('#blResult', { timeout: 60000 });
  check((await q.textContent('#blStatPlaced')).includes('234 / 234') && (await q.textContent('#blStatPlaced')).includes('Sessions placed') && (await count(q, '#blDraft .slot')) === 40, 'the phone builds the same schedule and shows it day by day');
  await noSideScroll(q, 'phone builder result');
  await shot(q, '10e-phone-builder-result');
  // classroom visits on a phone, in English
  await q.click('.tabbar button[data-view="more"]');
  await q.click('.sheet button[data-view="visits"]');
  await q.waitForSelector('#vsTabs');
  check((await title(q)) === 'Classroom visits' && (await q.textContent('#vsTabs')).includes("Teachers' evaluation"), 'classroom visits open on the phone, in English');
  await noSideScroll(q, 'phone visits');
  await q.click('#vsNew'); await q.waitForSelector('#visitForm');
  check(await q.$$eval('.vrate label', els => els.length === 50 && els.every(e => { const r = e.getBoundingClientRect(); return r.width >= 44 && r.height >= 44 && r.left >= 0 && r.right <= innerWidth; })), 'on a phone every rating is a button large enough to press, inside the screen');
  await noSideScroll(q, 'phone visit form');
  await shot(q, '10f-phone-visit-form');
  await q.click('#vfBack'); await q.waitForSelector('#vsTabs');
  await q.click('.tabbar button[data-view="more"]');
  await q.click('.sheet button[data-view="weekly"]');
  await q.waitForSelector('#weeklyLate');
  await noSideScroll(q, 'phone weekly report');
  await shot(q, '11-phone-weekly');
  await q.click('.tabbar button[data-view="more"]');
  await q.click('.sheet button[data-view="alerts"]');
  await q.waitForSelector('.card[data-alert]');
  await noSideScroll(q, 'phone notifications');
  await q.click('.tabbar button[data-view="programs"]');
  await q.waitForSelector('.prow');
  await noSideScroll(q, 'phone programmes');

  check(errs.length === 0, 'no console errors ' + JSON.stringify(errs.slice(0, 3)));
  await b.close();
  console.log(failed ? failed + ' FAILED' : 'all passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('TEST FAILED', String(e.message).slice(0, 600)); process.exit(1); });
