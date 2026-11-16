// Serves site/ locally and checks the website wiring: content security policy, sign-in screen, session, sign-out.
// Google's sign-in script and the Apps Script server are replaced by stand-ins, so no real account is used.
// Usage: node test/site.test.js   ($eval / evaluate are Playwright page-inspection methods, not eval of data)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '../site');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const API = 'https://script.google.com/macros/s/TEST/exec';

(async () => {
  const server = http.createServer((req, res) => {
    const name = req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0];
    if (name === '/config.js') { res.writeHead(200, { 'Content-Type': 'text/javascript' }); return res.end(`window.AP_CONFIG={api:'${API}',clientId:'test.apps.googleusercontent.com'};`); }
    const file = path.join(dir, path.normalize(name));
    if (!file.startsWith(dir) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(fs.readFileSync(file));
  }).listen(0);
  const base = 'http://localhost:' + server.address().port + '/';
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  const errs = [], calls = [];
  let failed = 0;
  const check = (ok, what) => { console.log((ok ? 'ok   ' : 'FAIL ') + what); if (!ok) failed++; };
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e));
  await page.route('https://fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css', body: '' }));
  // Stand-in for Google's sign-in script: a button that returns a fixed token.
  await page.route('https://accounts.google.com/gsi/client', r => r.fulfill({ contentType: 'text/javascript', body:
    'window.google={accounts:{id:{initialize:function(o){window.__gis=o},disableAutoSelect:function(){window.__autoOff=true},renderButton:function(el){var b=document.createElement("button");b.id="fakeGoogle";b.textContent="Sign in with Google";b.addEventListener("click",function(){window.__gis.callback({credential:"aaa.bbb.ccc"})});el.appendChild(b)}}}};' }));
  const boot = JSON.stringify({ me: { email: 'p@school.test', name: 'مدير', role: 'principal', stages: ['ابتدائي بنين عالمي'], aliases: [] },
    settings: { termStarts: { 1: '2026-08-30', 2: '2027-01-17' }, lastSync: '2026-11-15T10:00:00Z', writeBack: false, mainFileSet: true, scope: ['ابتدائي بنين عالمي'], syncHours: 1, domain: 'school.test' },
    today: '2026-11-15', fileName: 'test', indicators: [], targets: [], submissions: [],
    programs: [{ key: 'k1', sheet: 's', kpi: 'C.Br 1.3', kpiName: 'المراكز التنافسية النوعية', stage: 'ابتدائي بنين عالمي', row: 5, c: { name: 2, done: 9, evidence: 11 }, name: 'برنامج تجريبي', from: '2026-11-01', to: '2026-11-05' }] });
  let sessionValid = true;
  const uploads = [], saves = [], saved = [], VFORM = { kind: 'principal', title: 'استمارة تجربة', scale: ['متميز', 'جيد'], sections: [{ title: 'المجال', items: ['البند الأول', 'البند الثاني'] }] };
  let applied = [], lastImport = null;
  await page.route(API, async r => {
    const body = JSON.parse(r.request().postData() || '{}');
    calls.push({ fn: body.fn, type: r.request().headers()['content-type'], hasSession: !!body.session });
    let out;
    if (body.fn === 'public') out = { ok: true, data: JSON.stringify({ slogan: 'شعار من الخادم', welcome: 'ترحيب من الخادم' }) };
    else if (body.fn === 'login') out = { ok: true, data: JSON.stringify({ session: 'a'.repeat(64), boot }) };
    else if (body.fn === 'logout') out = { ok: true, data: '' };
    else if (!sessionValid || body.session !== 'a'.repeat(64)) out = { ok: false, code: 'AUTH', message: 'انتهت الجلسة' };
    else if (body.fn === 'api_users') out = { ok: true, data: JSON.stringify([{ email: 'p@school.test', name: 'مدير', role: 'principal', stages: ['*'], active: true, aliases: [], phone: '', channel: 'email', photo: '' }, { email: 't@school.test', name: 'معلم التجربة', role: 'teacher', stages: ['ابتدائي بنين عالمي'], active: true, aliases: [], phone: '', channel: 'email', photo: '' }]) };
    else if (body.fn === 'api_uploadEvidence') { uploads.push(JSON.parse(body.args[0])); out = { ok: true, data: JSON.stringify({ url: 'https://drive.google.com/file/d/TEST/view', name: 'evidence.jpg', shared: true, message: '' }) }; }
    else if (body.fn === 'api_savePhoto') out = { ok: true, data: JSON.stringify({ photo: body.args[0] }) };
    else if (body.fn === 'api_myCalendar') out = { ok: true, data: JSON.stringify({ tasks: [], sessions: [] }) };
    else if (body.fn === 'api_importUsers') { lastImport = JSON.parse(body.args[0]); out = { ok: true, data: JSON.stringify({ rows: lastImport.rows.map(r => ({ line: r.line, email: r.email, name: r.name, status: r.email ? 'new' : 'error', message: '' })), counts: { added: 5, updated: 0, same: 0, error: 1 } }) }; }
    else if (body.fn === 'api_visits') out = { ok: true, data: JSON.stringify({ lead: true, kind: 'principal', canEditForms: true, visits: saved, forms: { principal: VFORM, academic: VFORM, vp: VFORM } }) };
    else if (body.fn === 'api_saveVisit') { const d = JSON.parse(body.args[0]); saved.push({ id: 'V1', stage: d.stage, teacher: d.teacher, teacherName: 'معلم التجربة', date: d.date, klass: d.klass, subject: d.subject, period: d.period, kind: 'principal', score: 75, parts: [['المجال', 75]], shared: true, seen: false, byName: 'مدير', mine: true });
      out = { ok: true, data: JSON.stringify({ visit: Object.assign({ form: VFORM, answers: d.answers, strengths: d.strengths, improve: '', recommend: '', note: '' }, saved[0]) }) }; }
    else if (body.fn === 'api_timetable') out = { ok: true, data: JSON.stringify({ days: 5, perDay: 8, periods: { 'ابتدائي بنين عالمي': [['07:30', '08:15'], ['08:20', '09:05'], ['09:10', '09:55'], ['10:15', '11:00'], ['11:05', '11:50'], ['11:55', '12:40'], ['13:00', '13:45'], ['13:50', '14:35']] }, lessons: applied }) };
    else if (body.fn === 'api_planner') out = { ok: true, data: JSON.stringify({ setups: { 'ابتدائي بنين عالمي': { at: 'v1', by: 'p@school.test', setup: { dayLen: [6, 6, 6, 6, 6], classes: ['1A', '1B'], subjects: ['Maths', 'English', 'Science'],
      teachers: [{ id: 'a', name: 'أحمد', email: '', quota: 24, maxDay: 0, subjects: ['Maths'] }, { id: 'b', name: 'باسم', email: '', quota: 24, maxDay: 0, subjects: ['English'] }, { id: 'c', name: 'جمال', email: '', quota: 24, maxDay: 0, subjects: ['Science'] }],
      loads: ['1A', '1B'].flatMap(k => [{ klass: k, subject: 'Maths', count: 10, teacher: 'a' }, { klass: k, subject: 'English', count: 10, teacher: 'b' }, { klass: k, subject: 'Science', count: 10, teacher: 'c' }]), rules: [] } } } }) };
    else if (body.fn === 'api_savePlanner') { saves.push(JSON.parse(body.args[0])); out = { ok: true, data: JSON.stringify({ setup: saves[saves.length - 1].setup, at: 'v' + (saves.length + 1) }) }; }
    else if (body.fn === 'api_applySchedule') { const d = JSON.parse(body.args[0]); applied = d.lessons.map((l, i) => Object.assign({ id: 'L' + i, stage: d.stage, room: '', mine: false }, l)); out = { ok: true, data: JSON.stringify({ ok: true, added: applied.length, removed: 0, classes: d.classes.length, clashing: 0, undoId: 'u1' }) }; }
    else out = { ok: true, data: boot };
    await r.fulfill({ contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(out) });
  });
  await page.addInitScript(() => document.addEventListener('securitypolicyviolation', e => console.error('CSP ' + e.violatedDirective + ' ' + e.blockedURI)));

  await page.goto(base);
  await page.waitForSelector('#fakeGoogle');
  await page.waitForFunction(() => document.getElementById('slogan').textContent === 'شعار من الخادم');
  check((await page.isVisible('.cv-hero')) && (await page.$$eval('.cv-logos img', els => els.length === 2 && els.every(i => i.complete && i.naturalWidth > 100))), 'opens on the cover with both logos');
  check((await page.textContent('#welcome')) === 'ترحيب من الخادم' && (await page.$$eval('.cv-card, .tile, .prow, .navlist button', els => els.length)) === 0, 'the start page shows the slogan and welcome, and no data or menus');
  check(calls.length === 1 && calls[0].fn === 'public' && !calls[0].hasSession, 'before sign-in only the start page text is requested');
  await page.click('#fakeGoogle');
  await page.waitForSelector('.tile');
  check(calls[1].fn === 'login' && calls[1].type.startsWith('text/plain'), 'sign-in sends the Google token to the server');
  check((await page.textContent('.navlist')).includes('الرئيسية'), 'home loads after sign-in');
  check((await page.evaluate(() => localStorage.getItem('ap.session'))) === 'a'.repeat(64), 'session is kept for the next visit');
  await page.reload();
  await page.waitForSelector('.tile');
  check(calls[calls.length - 1].fn === 'api_bootstrap' && calls[calls.length - 1].hasSession, 'a return visit uses the session, no second sign-in');
  await page.click('.prow');
  await page.waitForSelector('.sheet');
  await page.waitForSelector('#whoPick');
  check((await page.isVisible('#editForm')) && (await page.$$eval('#whoPick option', els => els.length)) === 3, 'programme sheet opens, with the responsible-person box');
  await page.setInputFiles('#editForm [data-evfile]', { name: 'IMG.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64') });
  await page.waitForFunction(() => document.querySelector('#editForm input[type=url]').value === 'https://drive.google.com/file/d/TEST/view');
  check(uploads.length === 1 && uploads[0].mime === 'image/jpeg' && uploads[0].programKey === 'k1' && /^\/9j\//.test(uploads[0].data), 'evidence is sent to the server as a JPEG for the right programme, within the content security policy');
  await page.keyboard.press('Escape');
  await page.click('#meCard');
  await page.waitForSelector('#photoPick');
  await page.setInputFiles('#photoFile', { name: 'me.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64') });
  await page.waitForSelector('#meCard .avatar img');
  const sent = calls.filter(c => c.fn === 'api_savePhoto').length;
  check(sent === 1 && (await page.$eval('#meCard .avatar img', i => i.complete && i.naturalWidth === 160)), 'a picture is shrunk to 160 pixels, sent once and shown, within the content security policy');
  await page.click('.navlist button[data-view="mycal"]');
  await page.waitForSelector('#addTask');
  await page.click('.navlist button[data-view="calendar"]');
  await page.waitForSelector('.cal-d.today');
  check((await page.$$eval('.cal-d', els => els.length)) === 30, 'calendars open on the website');
  // the schedule builder on the website: its engine runs in the page, inside the content security policy
  await page.click('.navlist button[data-view="builder"]');
  await page.waitForSelector('#blPlan');
  check((await page.$$eval('#blPlan tbody tr', els => els.length)) === 2 && (await page.textContent('#blPlan [data-total="1A"]')) === '30 / 30', "the builder opens on the website with the stage's saved setup");
  await page.fill('#blPlan [data-cell="1A|Science"]', '9'); await page.press('#blPlan [data-cell="1A|Science"]', 'Tab');
  await page.waitForFunction(() => document.querySelector('#blPlan [data-total="1A"]').textContent === '29 / 30');
  await page.waitForTimeout(300);
  check(saves.length === 1 && saves[0].base === 'v1' && saves[0].setup.loads.find(l => l.klass === '1A' && l.subject === 'Science').count === 9, 'a change to the setup is saved to the server, from the version it started with');
  await page.click('#blTabs [data-tab="build"]');
  await page.click('#blGo');
  await page.waitForSelector('#blResult', { timeout: 60000 });
  check((await page.textContent('#blStatPlaced b')) === '59 / 59' && (await page.textContent('#blStatClash b')) === '0' && (await page.textContent('#blStatGaps b')) === '0', 'the engine builds the schedule in the page: every session placed, no clash, no gap');
  await page.click('#blApply'); await page.click('#blApply');
  await page.waitForSelector('#ttWeek');
  check(applied.length === 59 && applied.every(l => l.weekday >= 0 && l.weekday <= 4 && l.period >= 1 && l.period <= 6 && l.teacherName) && (await page.$$eval('#ttWeek .sess', els => els.length)) === 29, 'applying sends the built sessions to the server, and the school schedule shows them');
  // files are read in the page, inside the content security policy
  await page.click('.navlist button[data-view="admin"]'); await page.waitForSelector('#importUsers');
  await page.click('#importUsers'); await page.waitForSelector('#usersImport');
  await page.setInputFiles('.picker input[type=file]', path.join(__dirname, 'fixtures/employees.xlsx'));
  await page.waitForSelector('#uiRows');
  check(lastImport.dryRun === true && lastImport.rows.length === 6 && lastImport.rows[0].email === 'khalid@preview.example' && lastImport.rows[0].phone === '0501112233' && lastImport.rows[1].phone === '501112244' && lastImport.rows[2].phone === '966501112255'
    && lastImport.rows[3].line === 6 && lastImport.rows[3].position === 'منسق اللغة الإنجليزية' && lastImport.stages.join() === 'ابتدائي بنين عالمي', 'on the website an Excel file is read in the page and its rows are sent to the server for checking');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#uiTemplate')]);
  const tpl = fs.readFileSync(await dl.path(), 'utf8');
  check(dl.suggestedFilename() === 'employees-template.csv' && tpl.charCodeAt(0) === 0xFEFF && tpl.includes('الاسم,التخصص,المسمى الوظيفي,رقم الواتساب,البريد المدرسي'), 'the template downloads as a CSV that Excel opens in Arabic');
  await page.keyboard.press('Escape');
  // a visit being filled in is kept on the device: closing the page by mistake does not lose it
  await page.click('.navlist button[data-view="visits"]');
  await page.waitForSelector('#vsNew'); await page.click('#vsNew'); await page.waitForSelector('#visitForm');
  await page.selectOption('#vfTeacher', 't@school.test');
  await page.check('.vitem[data-item="0-0"] input[value="2"]'); await page.fill('#vfStrengths', 'ملاحظة قبل الإغلاق');
  await page.reload();
  await page.waitForSelector('.tile');
  await page.click('.navlist button[data-view="visits"]');
  await page.waitForSelector('#vsNew'); await page.click('#vsNew'); await page.waitForSelector('#visitForm');
  check((await page.$eval('#vfTeacher', e => e.value)) === 't@school.test' && (await page.isChecked('.vitem[data-item="0-0"] input[value="2"]')) && (await page.$eval('#vfStrengths', e => e.value)) === 'ملاحظة قبل الإغلاق', 'a visit being filled in is still there after the page is closed and opened again');
  await page.check('.vitem[data-item="0-1"] input[value="1"]');
  await page.click('#vfSave'); await page.waitForSelector('#visitReport');
  check((await page.evaluate(() => localStorage.getItem('ap.visit'))) === null && (await page.textContent('#vdScore b')) === '75%', 'once the visit is saved, the kept draft is cleared');
  sessionValid = false;
  await page.reload();
  await page.waitForSelector('#fakeGoogle');
  check((await page.evaluate(() => localStorage.getItem('ap.session'))) === null, 'an expired session returns to sign-in and is forgotten');
  sessionValid = true;
  await page.click('#fakeGoogle');
  await page.waitForSelector('.tile');
  await page.click('.rail-tools button:has-text("خروج")');
  await page.waitForSelector('#fakeGoogle');
  check(calls.some(c => c.fn === 'logout') && (await page.evaluate(() => window.__autoOff === true)), 'sign-out ends the session on the server and stops automatic sign-in');
  check((await page.$$eval('.tile, .prow', els => els.length)) === 0 && (await page.isVisible('#slogan')), 'after sign-out only the start page remains');
  const mf = await page.evaluate(() => fetch('manifest.webmanifest').then(r => r.json()));
  check(mf.display === 'standalone' && mf.icons.length === 3, 'install manifest is served');
  check(errs.length === 0, 'no console errors and no content-security-policy violations ' + JSON.stringify(errs.slice(0, 3)));
  await browser.close(); server.close();
  console.log(failed ? failed + ' FAILED' : 'all passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('TEST FAILED', String(e.message).slice(0, 600)); process.exit(1); });
