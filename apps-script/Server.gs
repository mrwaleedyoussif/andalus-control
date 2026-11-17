/**
 * Server.gs
 * Sign-in, permissions, sync with the main file, staff reports, review, and write-back of execution fields.
 * Every function a page can call starts with api_ and checks the caller first. Nothing trusts the page.
 * The website reaches these through doPost with a session; a page served by doGet reaches them through google.script.run.
 */
var SH = { USERS: 'Users', SUBS: 'Submissions', AUDIT: 'Audit', SNAP: 'Snapshot', NOTES: 'Notifications', PHOTOS: 'Photos', TASKS: 'Tasks', SESSIONS: 'Sessions', ASSIGN: 'Assignments', HISTORY: 'History', TIMETABLE: 'Timetable', PLANNER: 'Planner', VISITS: 'Visits' };
// A follower can see their stages but cannot report, propose, upload or be given a programme.
var ROLES = ['owner', 'principal', 'avp', 'vp', 'teacher', 'follower'];
// The Principal, the Academic Vice Principal and the Vice Principal are the system admins. The owner is the technical owner.
var LEADERS = ['owner', 'principal', 'avp', 'vp'];
// System admins are named apart from stage leaders, so a level that leads a stage without running the system can be added to LEADERS alone.
var ADMINS = ['owner', 'principal', 'avp', 'vp'];
var USER_COLS = ['email', 'name', 'role', 'stages', 'active', 'aliases', 'phone', 'channel', 'major', 'position'];
var CHANNELS = ['email', 'whatsapp', 'both', 'off'];
var NOTE_COLS = ['date', 'time', 'email', 'name', 'channel', 'items', 'status'];
var PHOTO_COLS = ['email', 'photo'];
var TASK_COLS = ['id', 'owner', 'title', 'note', 'date', 'repeat', 'time', 'until', 'notify', 'done'];
var SESSION_COLS = ['id', 'owner', 'weekday', 'start', 'end', 'subject', 'klass', 'room'];
var ASSIGN_COLS = ['key', 'email', 'stage', 'kpi', 'title', 'by', 'at'];
var LESSON_COLS = ['id', 'stage', 'klass', 'weekday', 'period', 'subject', 'teacher', 'teacherName', 'room', 'by', 'at'];
// The school week runs Sunday to Thursday, with eight sessions a day. The admins set the time of each session.
var SCHOOL_DAYS = 5, PERIODS_PER_DAY = 8;
var DEFAULT_PERIODS = [['07:30', '08:15'], ['08:20', '09:05'], ['09:10', '09:55'], ['10:15', '11:00'], ['11:05', '11:50'], ['11:55', '12:40'], ['13:00', '13:45'], ['13:50', '14:35']];
var HISTORY_COLS = ['date', 'stage', 'total', 'done', 'active', 'soon', 'overdue', 'upcoming', 'undated'];
var STATES = ['done', 'active', 'soon', 'overdue', 'upcoming', 'undated'];
var DEFAULT_SLOGAN = 'منظومة تعليمية رائدة، تبني جيلاً يمتلك قدرات تعلم عالمية';
/** The platform's name comes from Parser.gs, so it is written in one place. Read when needed, so the order of the script files does not matter. */
function appFull_() { return AP.APP_NAME + ' - ' + AP.APP_ORG; }
var SUB_COLS = ['id', 'createdAt', 'by', 'byName', 'type', 'programKey', 'sheet', 'stage', 'kpi', 'title', 'outcome', 'execDate',
  'actual', 'evidence', 'note', 'status', 'reviewedBy', 'reviewedAt', 'reviewNote', 'writeback', 'undo', 'data'];
var AUDIT_COLS = ['time', 'email', 'role', 'action', 'target', 'details'];
var CHUNK = 45000;
var DEFAULT_STAGES = ['ابتدائي بنين أهلي', 'ابتدائي بنين عالمي', 'متوسط بنين عالمي'];

/* ---------- entry points ---------- */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(AP.APP_NAME + ' | ' + AP.APP_ORG)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

/**
 * The website talks to this endpoint. Every request carries either a Google sign-in token (to start a session)
 * or a session token. Nothing is returned without one, and errors never expose internals.
 */
function doPost(e) {
  var out;
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    out = { ok: true, data: route_(body) };
  } catch (err) {
    var m = String((err && err.message) || err), i = m.indexOf('|');
    out = i > -1 && /^[A-Z]+$/.test(m.slice(0, i)) ? { ok: false, code: m.slice(0, i), message: m.slice(i + 1) } : { ok: false, code: 'ERROR', message: 'حدث خطأ غير متوقع. أعد المحاولة.' };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

/** Set per request once a website session has been verified. Each request runs in its own execution. */
var REQ = { email: '' };

function route_(body) {
  var fn = String(body.fn || '');
  if (fn === 'public') return api_public();
  if (fn === 'login') return login_(String(body.idToken || ''));
  if (fn === 'logout') { endSession_(String(body.session || '')); return ''; }
  var routes = {
    api_bootstrap: api_bootstrap, api_submit: api_submit, api_review: api_review, api_updateExecution: api_updateExecution, api_sync: api_sync,
    api_undoExecution: api_undoExecution, api_users: api_users, api_saveUser: api_saveUser, api_saveSettings: api_saveSettings, api_audit: api_audit,
    api_notifications: api_notifications, api_sendMyNotification: api_sendMyNotification, api_savePhoto: api_savePhoto, api_withdraw: api_withdraw, api_reopen: api_reopen,
    api_assign: api_assign, api_undoAssign: api_undoAssign, api_uploadEvidence: api_uploadEvidence, api_weekly: api_weekly, api_sendMyWeekly: api_sendMyWeekly, api_planOptions: api_planOptions, api_planRequest: api_planRequest,
    api_timetable: api_timetable, api_saveLesson: api_saveLesson, api_deleteLesson: api_deleteLesson, api_importLessons: api_importLessons, api_undoImport: api_undoImport, api_clearClass: api_clearClass, api_savePeriods: api_savePeriods,
    api_planner: api_planner, api_savePlanner: api_savePlanner, api_applySchedule: api_applySchedule, api_undoApply: api_undoApply,
    api_importUsers: api_importUsers, api_undoImportUsers: api_undoImportUsers, api_readSheet: api_readSheet,
    api_visits: api_visits, api_visit: api_visit, api_saveVisit: api_saveVisit, api_deleteVisit: api_deleteVisit, api_undoVisit: api_undoVisit, api_seenVisit: api_seenVisit, api_saveVisitForm: api_saveVisitForm,
    api_myCalendar: api_myCalendar, api_saveTask: api_saveTask, api_deleteTask: api_deleteTask, api_saveSession: api_saveSession, api_deleteSession: api_deleteSession
  };
  if (!routes.hasOwnProperty(fn)) throw fail_('INPUT', 'طلب غير معروف');
  REQ.email = sessionEmail_(String(body.session || ''));
  var args = Array.isArray(body.args) ? body.args.slice(0, 3) : [];
  return routes[fn].apply(null, args);
}

function sha_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s).map(function (b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join('');
}

/** Checks a Google sign-in token with Google, then opens a session for a member of staff. */
function login_(idToken) {
  var bad = function () { return fail_('AUTH', 'تعذر التحقق من الحساب. سجّل الدخول بحساب المدرسة.'); };
  var clientId = prop_('CLIENT_ID');
  if (!clientId) throw fail_('SETUP', 'لم يُضبط معرّف تسجيل الدخول بعد. يضبطه مالك النظام من قائمة «' + AP.APP_NAME + '» في ملف التحكم.');
  var parts = idToken.split('.');
  if (idToken.length > 4096 || parts.length !== 3 || !/^[\w-]+$/.test(parts[1])) throw bad();
  var claims;
  try { claims = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[1] + '==='.slice((parts[1].length + 3) % 4))).getDataAsString()); } catch (e) { throw bad(); }
  if (claims.aud !== clientId || !(+claims.exp * 1000 > Date.now())) throw bad();
  var cache = CacheService.getScriptCache(), n = +(cache.get('verify:n') || 0) + 1;
  if (n > 300) throw fail_('RATE', 'محاولات دخول كثيرة. انتظر قليلاً.');
  cache.put('verify:n', String(n), 300);
  var res = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken), { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) throw bad();
  var info = JSON.parse(res.getContentText());
  if (info.aud !== clientId || ['accounts.google.com', 'https://accounts.google.com'].indexOf(info.iss) === -1 ||
      String(info.email_verified) !== 'true' || !(+info.exp * 1000 > Date.now()) || !info.email) throw bad();
  REQ.email = String(info.email).toLowerCase();
  var u = me_();
  var token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  cache.put('sess:' + sha_(token), u.email, 21600);
  audit_(u, 'sign-in', '', '');
  return JSON.stringify({ session: token, boot: api_bootstrap() });
}

function sessionEmail_(token) {
  var email = /^[0-9a-f]{64}$/.test(token) ? CacheService.getScriptCache().get('sess:' + sha_(token)) : null;
  if (!email) throw fail_('AUTH', 'انتهت الجلسة. سجّل الدخول من جديد.');
  return email;
}

function endSession_(token) {
  if (/^[0-9a-f]{64}$/.test(token)) CacheService.getScriptCache().remove('sess:' + sha_(token));
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu(AP.APP_NAME)
    .addItem('الإعداد الأولي', 'setup')
    .addItem('ضبط معرّف تسجيل الدخول للموقع', 'setClientIdFromMenu')
    .addItem('ربط واتساب (WhatsApp Cloud API)', 'setWhatsAppFromMenu')
    .addItem('إرسال تنبيهات اليوم الآن', 'notifyFromMenu')
    .addItem('مزامنة الآن', 'syncFromMenu')
    .addToUi();
}

/** Stores the Google sign-in client ID the website uses. It is not a secret; it only names the website to Google. */
function setClientIdFromMenu() {
  var ui = SpreadsheetApp.getUi(), r = ui.prompt('معرّف تسجيل الدخول (OAuth Client ID)', 'الصق المعرّف الذي ينتهي بـ apps.googleusercontent.com', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  var id = r.getResponseText().trim();
  if (!/^[\w-]+\.apps\.googleusercontent\.com$/.test(id)) { ui.alert('المعرّف غير صحيح.'); return; }
  PropertiesService.getScriptProperties().setProperty('CLIENT_ID', id);
  ui.alert('تم الحفظ.');
}

/** Run once from the editor. Safe to run again. */
function setup() {
  var ss = SpreadsheetApp.getActive();
  var owner = String(Session.getEffectiveUser().getEmail() || '').toLowerCase();
  ensureSheet_(ss, SH.USERS, USER_COLS);
  ensureSheet_(ss, SH.SUBS, SUB_COLS);
  ensureSheet_(ss, SH.AUDIT, AUDIT_COLS);
  (ss.getSheetByName(SH.SNAP) || ss.insertSheet(SH.SNAP)).hideSheet();
  ensureSheet_(ss, SH.NOTES, NOTE_COLS);
  ensureSheet_(ss, SH.PHOTOS, PHOTO_COLS);
  ensureSheet_(ss, SH.TASKS, TASK_COLS);
  ensureSheet_(ss, SH.SESSIONS, SESSION_COLS);
  ensureSheet_(ss, SH.ASSIGN, ASSIGN_COLS);
  ensureSheet_(ss, SH.HISTORY, HISTORY_COLS);
  ensureSheet_(ss, SH.TIMETABLE, LESSON_COLS);
  ensureSheet_(ss, SH.PLANNER, PLANNER_COLS);
  ensureSheet_(ss, SH.VISITS, VISIT_COLS);
  var evidence = 'ready';
  try { evidenceRoot_(); } catch (e) { evidence = 'not ready'; }   // also makes Google ask for permission to keep evidence files
  var p = PropertiesService.getScriptProperties();
  var defaults = {
    DOMAIN: owner.split('@')[1] || '', T1_START: '2026-08-30', T2_START: '2027-01-17',
    STAGES: JSON.stringify(DEFAULT_STAGES), WRITEBACK: 'off', PLAN_EDIT: 'off', SYNC_HOURS: '1', NOTIFY: 'on', WEEKLY: 'on', WEEKLY_DAY: '0'
  };
  Object.keys(defaults).forEach(function (k) { if (!p.getProperty(k)) p.setProperty(k, defaults[k]); });
  var users = readTable_(SH.USERS, USER_COLS);
  if (!users.some(function (u) { return u.role === 'owner' && isTrue_(u.active); })) {
    ss.getSheetByName(SH.USERS).appendRow([owner, owner.split('@')[0], 'owner', '*', true, '', '', 'email']);
  }
  CacheService.getScriptCache().remove('users');
  installTrigger_(+p.getProperty('SYNC_HOURS') || 1);
  installNotifyTrigger_();
  audit_({ email: owner, role: 'owner' }, 'setup', '', '');
  return 'تم الإعداد. المالك: ' + owner + (evidence === 'ready' ? '' : ' · مجلد الشواهد غير جاهز: فعّل خدمة Drive API ثم أعد التشغيل');
}

function syncFromMenu() {
  var r = syncNow_({ email: Session.getEffectiveUser().getEmail(), role: 'owner' });
  SpreadsheetApp.getUi().alert('تمت المزامنة: ' + r.programs + ' برنامجاً');
}

/** Called by the time trigger. */
function syncTrigger() {
  try { syncNow_({ email: 'trigger', role: 'system' }); }
  catch (e) { PropertiesService.getScriptProperties().setProperty('LAST_SYNC_ERROR', new Date().toISOString() + ' ' + e.message); }
}

/* ---------- small helpers ---------- */

function fail_(code, msg) { return new Error(code + '|' + msg); }
function prop_(k) { return PropertiesService.getScriptProperties().getProperty(k) || ''; }
function isTrue_(v) { return v === true || String(v).toLowerCase() === 'true'; }
function nowIso_() { return new Date().toISOString(); }
function today_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'); }

function ensureSheet_(ss, name, cols) {
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  // Writes the heading row. Run again after an update, it adds any new column headings without touching the data.
  // Plain-text cells: dates and times stay exactly as written and are never reinterpreted by the sheet.
  sh.getRange(1, 1, sh.getMaxRows(), cols.length).setNumberFormat('@');
  sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold');
  sh.setFrozenRows(1);
  return sh;
}

/** A cell value as text. A date cell becomes yyyy-MM-dd in the school's time zone, a time cell HH:mm, a full timestamp ISO. */
function cellOut_(v) {
  if (!(v instanceof Date)) return v;
  var tz = Session.getScriptTimeZone();
  if (v.getFullYear() < 1901) return Utilities.formatDate(v, tz, 'HH:mm');
  return Utilities.formatDate(v, tz, 'HHmmss') === '000000' ? Utilities.formatDate(v, tz, 'yyyy-MM-dd') : v.toISOString();
}

function readTable_(name, cols) {
  var sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return [];
  var vals = sh.getRange(2, 1, sh.getLastRow() - 1, cols.length).getValues();
  return vals.map(function (row, i) {
    var o = { _row: i + 2 };
    cols.forEach(function (c, j) { o[c] = cellOut_(row[j]); });
    return o;
  });
}

/** Text that is safe to put in a cell: trimmed, bounded, and never read as a formula. */
function text_(v, max) {
  var s = String(v === null || v === undefined ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
  if (s.length > max) s = s.slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function url_(v) {
  var s = String(v || '').trim();
  if (!s) return '';
  if (s.length > 500 || !/^https:\/\/[^\s<>"']+$/i.test(s)) throw fail_('INPUT', 'رابط الشاهد يجب أن يبدأ بـ https://');
  return s;
}

function number_(v) {
  if (v === '' || v === null || v === undefined) return '';
  var n = Number(v);
  if (!isFinite(n) || n < 0 || n > 1000000) throw fail_('INPUT', 'العدد غير صحيح');
  return n;
}

function date_(v) {
  var s = String(v || '').trim();
  if (!s) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw fail_('INPUT', 'التاريخ غير صحيح');
  return s;
}

function audit_(u, action, target, details) {
  try {
    SpreadsheetApp.getActive().getSheetByName(SH.AUDIT)
      .appendRow([nowIso_(), u.email || '', u.role || '', action, text_(target, 200), text_(typeof details === 'string' ? details : JSON.stringify(details || ''), 2000)]);
  } catch (e) { /* the log must never block the action */ }
}

/** Refuses more than `max` calls of one kind per user in `seconds`. */
function rate_(u, bucket, max, seconds) {
  var cache = CacheService.getScriptCache(), k = 'rate:' + bucket + ':' + u.email;
  var n = +(cache.get(k) || 0) + 1;
  if (n > max) throw fail_('RATE', 'طلبات كثيرة. انتظر قليلاً ثم أعد المحاولة.');
  cache.put(k, String(n), seconds);
}

/* ---------- who is calling ---------- */

function users_() {
  var cache = CacheService.getScriptCache(), hit = cache.get('users');
  if (hit) return JSON.parse(hit);
  var map = {};
  readTable_(SH.USERS, USER_COLS).forEach(function (u) {
    var email = String(u.email || '').toLowerCase().trim();
    if (!email) return;
    var stages = String(u.stages || '').split(/[,،\n]/).map(function (s) { return s.trim(); }).filter(String);
    map[email] = {
      email: email, name: String(u.name || email), role: ROLES.indexOf(u.role) !== -1 ? u.role : 'teacher',
      stages: stages.indexOf('*') !== -1 ? ['*'] : stages, active: isTrue_(u.active),
      aliases: String(u.aliases || '').split(/[,،\n]/).map(function (s) { return s.trim(); }).filter(String),
      phone: String(u.phone || '').replace(/\D/g, ''), channel: CHANNELS.indexOf(u.channel) !== -1 ? u.channel : 'email', major: String(u.major || ''), position: String(u.position || ''), _row: u._row
    };
  });
  cache.put('users', JSON.stringify(map), 300);
  return map;
}

/** The signed-in Google account, checked against the school domain and the staff list. */
function me_() {
  var email = String(REQ.email || Session.getActiveUser().getEmail() || '').toLowerCase().trim();
  if (!email) throw fail_('AUTH', 'تعذر التحقق من حسابك. افتح الرابط بحساب المدرسة.');
  var domain = prop_('DOMAIN'), u = users_()[email];
  if ((domain && email.split('@')[1] !== domain) || !u || !u.active) {
    var cache = CacheService.getScriptCache();
    if (!cache.get('denied:' + email)) { cache.put('denied:' + email, '1', 3600); audit_({ email: email, role: '' }, 'denied', '', ''); }
    throw fail_('NOACCESS', 'حسابك غير مضاف إلى المنصة. تواصل مع مالك النظام.');
  }
  return u;
}

function isLeader_(u) { return LEADERS.indexOf(u.role) !== -1; }
function needLeader_(u) { if (!isLeader_(u)) throw fail_('FORBIDDEN', 'هذا الإجراء لقيادة المرحلة فقط.'); }
/** System admins: the Principal, the Academic Vice Principal, the Vice Principal, and the technical owner. */
function isAdmin_(u) { return ADMINS.indexOf(u.role) !== -1; }
function needAdmin_(u) { if (!isAdmin_(u)) throw fail_('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.'); }
/** Refuses every change from a view-only account. */
function needWrite_(u) { if (u.role === 'follower') throw fail_('FORBIDDEN', 'حسابك للمتابعة فقط، ولا يملك صلاحية الإضافة أو التعديل.'); }

function scope_() {
  try { var s = JSON.parse(prop_('STAGES') || '[]'); return s.length ? s : DEFAULT_STAGES; } catch (e) { return DEFAULT_STAGES; }
}

/** Stages this user may see: their own list, limited to the stages the platform covers. */
function stagesOf_(u) {
  var scope = scope_();
  if (u.stages.indexOf('*') !== -1) return scope;
  return scope.filter(function (s) { return u.stages.indexOf(s) !== -1; });
}

function needStage_(u, stage) {
  if (stagesOf_(u).indexOf(stage) === -1) throw fail_('FORBIDDEN', 'هذه المرحلة خارج صلاحيتك.');
}

/* ---------- snapshot of the main file ---------- */

function compact_(o) {
  var out = {};
  Object.keys(o).forEach(function (k) { var v = o[k]; if (v !== '' && v !== null && v !== false && v !== undefined) out[k] = v; });
  return out;
}

function writeSnapshot_(snap) {
  var json = JSON.stringify(snap), rows = [];
  for (var i = 0; i < json.length; i += CHUNK) rows.push([json.slice(i, i + CHUNK)]);
  var sh = SpreadsheetApp.getActive().getSheetByName(SH.SNAP);
  sh.clearContents();
  sh.getRange(1, 1, rows.length, 1).setValues(rows);
}

function readSnapshot_() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SH.SNAP);
  if (!sh || sh.getLastRow() === 0) return { syncedAt: '', programs: [], indicators: [], targets: [] };
  var json = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().map(function (r) { return r[0]; }).join('');
  try { return JSON.parse(json); } catch (e) { return { syncedAt: '', programs: [], indicators: [], targets: [] }; }
}

function mainFile_() {
  var id = prop_('MAIN_FILE_ID');
  if (!id) throw fail_('SETUP', 'لم يُحدَّد ملف المنصة الشاملة بعد. أضف رابطه من الإعدادات.');
  try { return SpreadsheetApp.openById(id); }
  catch (e) { throw fail_('SETUP', 'تعذر فتح المنصة الشاملة. تأكد أن حساب مالك النظام يملك صلاحية عليها.'); }
}

/**
 * The parts of a sheet that the installing account may not edit: what the main branch has closed with Google Sheets protection.
 * Protections that only warn, and ones this account is allowed to edit, close nothing.
 */
function lockedAreas_(sh) {
  var out = { areas: [], whole: false, open: [] };
  var box = function (g) { return { r1: g.getRow(), r2: g.getRow() + g.getNumRows() - 1, c1: g.getColumn(), c2: g.getColumn() + g.getNumColumns() - 1 }; };
  try {
    sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (pr) { if (!pr.isWarningOnly() && !pr.canEdit()) out.areas.push(box(pr.getRange())); });
    sh.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(function (pr) {
      if (pr.isWarningOnly() || pr.canEdit()) return;
      out.whole = true;
      pr.getUnprotectedRanges().forEach(function (g) { out.open.push(box(g)); });
    });
  } catch (e) { /* if the protections cannot be read, each write still asks Google before it writes */ }
  return out;
}
/** True when any cell of the row between the two columns is closed. */
function closedAt_(lk, row, c1, c2) {
  var inside = function (a, c) { return row >= a.r1 && row <= a.r2 && c >= a.c1 && c <= a.c2; };
  for (var c = c1; c <= c2; c++) {
    if (lk.areas.some(function (a) { return inside(a, c); })) return true;
    if (lk.whole && !lk.open.some(function (a) { return inside(a, c); })) return true;
  }
  return false;
}

/** Reads the visible tabs of the main file and stores the programmes of the covered stages. */
function syncNow_(actor) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) throw fail_('BUSY', 'المزامنة تعمل الآن. أعد المحاولة بعد لحظات.');
  try { return syncCore_(actor); } finally { lock.releaseLock(); }
}

/** The sync itself. The caller holds the lock. */
function syncCore_(actor) {
  {
    var ss = mainFile_(), scope = scope_();
    var cfg = { termStarts: { 1: prop_('T1_START'), 2: prop_('T2_START') } };
    var programs = [], indicators = [], targets = [], plan = {};
    ss.getSheets().forEach(function (sh) {
      if (sh.isSheetHidden() || sh.getLastRow() < 15) return;
      var values = sh.getDataRange().getValues(), name = sh.getName();
      if (name.trim() === 'KPIS Targets') {
        targets = AP.parseTargets(values).map(function (t) {
          var keep = {};
          scope.forEach(function (s) { if (t.stages[s]) keep[s] = t.stages[s]; });
          t.stages = keep;
          return t;
        });
        return;
      }
      var parsed = AP.parseSheet(name, values), lk = lockedAreas_(sh);
      parsed.programs.forEach(function (p) {
        if (scope.indexOf(p.stage) === -1) return;
        // what the main branch has closed for this programme, as its permissions stand now
        var tbl = parsed.tables.filter(function (t) { return t.rows.indexOf(p.row) !== -1; })[0], b = tbl ? AP.planBounds(tbl) : null;
        if (b && closedAt_(lk, p.row, b.first, b.last)) p.planClosed = true;
        if (['done', 'actual', 'evidence', 'comment'].some(function (k) { return p.c[k] && closedAt_(lk, p.row, p.c[k], p.c[k]); })) p.execClosed = true;
        programs.push(compact_(AP.withDates(p, cfg)));
      });
      parsed.indicators.forEach(function (b) { if (scope.indexOf(b.stage) !== -1) indicators.push(compact_(b)); });
      parsed.tables.forEach(function (tbl) {
        var b = AP.planBounds(tbl);
        if (scope.indexOf(tbl.stage) === -1 || !b) return;
        var free = AP.freeRows(tbl, values), usable = free.filter(function (r) { return !closedAt_(lk, r, b.first, b.last); });
        var st = plan[tbl.kpi + '|' + tbl.stage] = plan[tbl.kpi + '|' + tbl.stage] || { free: 0, locked: 0 };
        st.free += usable.length; st.locked += free.length - usable.length;
      });
    });
    Object.keys(plan).forEach(function (k) { plan[k] = { free: plan[k].free, state: plan[k].free ? 'open' : plan[k].locked ? 'closed' : 'full' }; });
    var snap = { syncedAt: nowIso_(), fileName: ss.getName(), programs: programs, indicators: indicators, targets: targets, plan: plan };
    writeSnapshot_(snap);
    var moved = relinkAssignments_(programs);
    var p = PropertiesService.getScriptProperties();
    p.setProperty('LAST_SYNC', snap.syncedAt);
    p.deleteProperty('LAST_SYNC_ERROR');
    audit_(actor, 'sync', ss.getName(), { programs: programs.length, assignmentsFollowed: moved });
    return { programs: programs.length, syncedAt: snap.syncedAt };
  }
}

function installTrigger_(hours) {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'syncTrigger') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('syncTrigger').timeBased().everyHours(hours).create();
}

/* ---------- notifications by email and WhatsApp ---------- */

var NOTIFY_ADMINS = ['principal', 'avp', 'vp'];

/** The daily sending time chosen by the admins, 07:30 unless changed. */
function notifyTime_() {
  var m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(prop_('NOTIFY_TIME') || '07:30');
  return m ? { h: +m[1], m: +m[2], text: m[0] } : { h: 7, m: 30, text: '07:30' };
}

/** Google runs daily triggers within about 15 minutes of the requested minute. */
function installNotifyTrigger_() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'notifyTrigger') ScriptApp.deleteTrigger(t); });
  var t = notifyTime_();
  ScriptApp.newTrigger('notifyTrigger').timeBased().atHour(t.h).nearMinute(t.m).everyDays(1).inTimezone(Session.getScriptTimeZone()).create();
}

/** Called once a day at the chosen time: refresh from the main file, send the day's notifications, and on its day the weekly report. */
function notifyTrigger() {
  var system = { email: 'trigger', role: 'system' }, p = PropertiesService.getScriptProperties();
  var daily = prop_('NOTIFY') !== 'off', weekly = weeklyDue_();
  if (!daily && !weekly) return;
  try { syncNow_(system); } catch (e) { /* send from the last snapshot */ }
  if (daily) {
    try { sendNotifications_(system, false); }
    catch (e) { p.setProperty('LAST_SYNC_ERROR', new Date().toISOString() + ' notify: ' + e.message); }
  }
  if (weekly) {
    try { weeklyRun_(system); }
    catch (e2) { p.setProperty('LAST_SYNC_ERROR', new Date().toISOString() + ' weekly: ' + e2.message); }
  }
}

function notifyFromMenu() {
  var r = sendNotifications_({ email: Session.getEffectiveUser().getEmail(), role: 'owner' }, true);
  SpreadsheetApp.getUi().alert('المستلمون: ' + r.recipients + ' · الرسائل المرسلة: ' + r.sent);
}

function waReady_() { return !!(prop_('WA_TOKEN') && prop_('WA_PHONE_ID') && prop_('WA_TEMPLATE')); }

/** Stores the WhatsApp Cloud API details. The access token is a secret: it is entered here, in the control file, never on the website. */
function setWhatsAppFromMenu() {
  var ui = SpreadsheetApp.getUi(), p = PropertiesService.getScriptProperties();
  var ask = function (title, hint) { var r = ui.prompt(title, hint, ui.ButtonSet.OK_CANCEL); return r.getSelectedButton() === ui.Button.OK ? r.getResponseText().trim() : null; };
  var phoneId = ask('WhatsApp Cloud API · Phone number ID', 'الرقم التعريفي لرقم الواتساب من لوحة Meta');
  if (!phoneId) return;
  var template = ask('اسم القالب المعتمد', 'قالب نصه يحتوي متغيرين: {{1}} اسم المستلم و{{2}} ملخص التنبيهات');
  if (!template) return;
  var token = ask('Access token', 'رمز الوصول الدائم. يُحفظ في خصائص المشروع ولا يظهر في الموقع.');
  if (!token) return;
  if (!/^\d{6,20}$/.test(phoneId) || !/^[a-z0-9_]{1,100}$/.test(template) || token.length < 20) { ui.alert('إحدى القيم غير صحيحة. لم يُحفظ شيء.'); return; }
  p.setProperty('WA_PHONE_ID', phoneId); p.setProperty('WA_TEMPLATE', template); p.setProperty('WA_TOKEN', token);
  ui.alert('تم ربط واتساب.');
}

function waSend_(phone, name, summary) {
  var res = UrlFetchApp.fetch('https://graph.facebook.com/v20.0/' + encodeURIComponent(prop_('WA_PHONE_ID')) + '/messages', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true, headers: { Authorization: 'Bearer ' + prop_('WA_TOKEN') },
    payload: JSON.stringify({
      messaging_product: 'whatsapp', to: phone, type: 'template',
      template: { name: prop_('WA_TEMPLATE'), language: { code: prop_('WA_LANG') || 'ar' },
        components: [{ type: 'body', parameters: [{ type: 'text', text: String(name).slice(0, 60) }, { type: 'text', text: String(summary).replace(/\s+/g, ' ').slice(0, 900) }] }] }
    })
  });
  if (res.getResponseCode() >= 300) throw new Error('whatsapp ' + res.getResponseCode());
}

function esc_(s) { return String(s === null || s === undefined ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function digestHtml_(rec, today, site) {
  var td = 'padding:6px 10px;border-bottom:1px solid #D0DBD6;text-align:right;vertical-align:top';
  var out = ['<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.8;color:#0D1E19;max-width:680px">',
    '<h2 style="color:#2E2F75;margin:0 0 2px">' + esc_(appFull_()) + '</h2>',
    '<p style="margin:0 0 12px;color:#3B4E47">تنبيهات ' + esc_(today) + ' · ' + esc_(rec.name) + '</p>'];
  AP.KINDS.forEach(function (k) {
    var items = rec.items.filter(function (it) { return it.kind === k; });
    if (!items.length) return;
    out.push('<h3 style="margin:16px 0 6px;font-size:16px">' + esc_(AP.KIND_AR[k]) + ' (' + items.length + ')</h3><table style="border-collapse:collapse;width:100%;font-size:14px">');
    items.forEach(function (it) {
      out.push('<tr><td style="' + td + ';font-weight:bold">' + esc_(it.name) + '</td><td style="' + td + '" dir="ltr">' + esc_(it.kpi) + '</td><td style="' + td + '">' + esc_(it.stage) +
        '</td><td style="' + td + '">' + esc_(it.from) + (it.to !== it.from ? ' ← ' + esc_(it.to) : '') + '</td><td style="' + td + '">' + esc_(AP.ROLE_AR[it.role]) + '</td></tr>');
    });
    out.push('</table>');
  });
  if (rec.tasks && rec.tasks.length) {
    out.push('<h3 style="margin:16px 0 6px;font-size:16px">مهامك اليوم (' + rec.tasks.length + ')</h3><ul style="margin:0;padding-right:20px">');
    rec.tasks.forEach(function (t) { out.push('<li>' + (t.time ? '<span dir="ltr">' + esc_(t.time) + '</span> · ' : '') + esc_(t.title) + '</li>'); });
    out.push('</ul>');
  }
  if (site) out.push('<p style="margin-top:18px"><a href="' + esc_(site) + '" style="background:#2E2F75;color:#ffffff;padding:9px 22px;border-radius:999px;text-decoration:none;font-weight:bold">فتح المنصة</a></p>');
  out.push('</div>');
  return out.join('');
}

function todaysNotifications_() {
  var map = users_();
  return AP.buildNotifications(readSnapshot_(), Object.keys(map).map(function (k) { return map[k]; }), today_(), NOTIFY_ADMINS, assignments_(), reportedKeys_());
}

/** Programmes that already have a report waiting or approved: nobody is chased about those. */
function reportedKeys_() {
  var map = {};
  readTable_(SH.SUBS, SUB_COLS).forEach(function (r) { if (r.type === 'report' && r.programKey && (r.status === 'pending' || r.status === 'approved')) map[String(r.programKey)] = true; });
  return map;
}

/** Adds each admin's own tasks for today to their message. An admin with tasks but no programme items still gets one. */
function withTasks_(recs) {
  var map = users_(), today = today_(), byOwner = {};
  readTable_(SH.TASKS, TASK_COLS).map(function (r) { var t = taskOut_(r); t.owner = String(r.owner).toLowerCase(); return t; })
    .forEach(function (t) { if (t.notify) (byOwner[t.owner] = byOwner[t.owner] || []).push(t); });
  Object.keys(byOwner).forEach(function (email) {
    var u = map[email];
    if (!u || !u.active || u.channel === 'off' || !isLeader_(u)) return;
    var due = AP.tasksOn(byOwner[email], today);
    if (!due.length) return;
    var rec = recs.filter(function (r) { return r.email === email; })[0];
    if (!rec) { rec = { email: u.email, name: u.name, phone: u.phone || '', channel: u.channel || 'email', items: [] }; recs.push(rec); }
    rec.tasks = due.map(function (t) { return { title: t.title, time: t.time }; });
  });
  return recs;
}

function mailDigest_(rec, today, site) {
  if (MailApp.getRemainingDailyQuota() < 1) throw new Error('quota');
  MailApp.sendEmail({ to: rec.email, name: appFull_(), subject: 'تنبيهات برامج المؤشرات · ' + today + ' (' + (rec.items.length + (rec.tasks ? rec.tasks.length : 0)) + ')',
    body: AP.digestText(rec, today, site), htmlBody: digestHtml_(rec, today, site) });
}

/**
 * Sends each person one message for the day, listing everything that concerns them.
 * Email always works. WhatsApp is sent automatically only when the WhatsApp Cloud API is connected;
 * otherwise the person gets the email and their WhatsApp message waits in the notifications page for one-tap sending.
 */
function sendNotifications_(actor, force) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw fail_('BUSY', 'الإرسال يعمل الآن. أعد المحاولة بعد لحظات.');
  try {
    var p = PropertiesService.getScriptProperties(), today = today_();
    if (!force && p.getProperty('NOTIFY_LAST') === today) return { sent: 0, recipients: 0, skipped: true };
    var recs = withTasks_(todaysNotifications_()), site = prop_('SITE_URL'), wa = waReady_(), sent = 0, rows = [];
    recs.forEach(function (rec) {
      var status = [], wantsWa = (rec.channel === 'whatsapp' || rec.channel === 'both') && rec.phone;
      if (rec.channel !== 'whatsapp' || !wantsWa || !wa) {
        try { mailDigest_(rec, today, site); status.push('email sent'); sent++; } catch (e) { status.push('email failed'); }
      }
      if (wantsWa) {
        if (!wa) status.push('whatsapp waiting');
        else { try { waSend_(rec.phone, rec.name, AP.digestLine(rec)); status.push('whatsapp sent'); sent++; } catch (e) { status.push('whatsapp failed'); } }
      }
      rows.push([today, nowIso_(), rec.email, rec.name, rec.channel, rec.items.length + (rec.tasks ? rec.tasks.length : 0), status.join(', ')]);
    });
    if (rows.length) { var sh = SpreadsheetApp.getActive().getSheetByName(SH.NOTES); sh.getRange(sh.getLastRow() + 1, 1, rows.length, NOTE_COLS.length).setValues(rows); }
    p.setProperty('NOTIFY_LAST', today);
    audit_(actor, 'notifications', today, { recipients: recs.length, sent: sent });
    return { sent: sent, recipients: recs.length };
  } finally { lock.releaseLock(); }
}

/** Today's notifications for the admins' page: who is told what, how, and whether it went. */
function api_notifications() {
  var u = me_();
  needAdmin_(u);
  var stages = stagesOf_(u), today = today_(), status = {};
  readTable_(SH.NOTES, NOTE_COLS).forEach(function (r) { if (String(r.date).slice(0, 10) === today || r.date === today) status[String(r.email).toLowerCase()] = r.status; });
  var site = prop_('SITE_URL');
  var list = todaysNotifications_().map(function (rec) {
    rec.items = rec.items.filter(function (it) { return stages.indexOf(it.stage) !== -1; });
    return rec;
  }).filter(function (rec) { return rec.items.length; }).map(function (rec) {
    return { email: rec.email, name: rec.name, phone: rec.phone, channel: rec.channel, items: rec.items, text: AP.digestText(rec, today, site), status: status[rec.email] || '' };
  });
  return JSON.stringify({ today: today, time: notifyTime_().text, on: prop_('NOTIFY') !== 'off', whatsappAuto: waReady_(), lastRun: prop_('NOTIFY_LAST'), list: list });
}

/** Sends the caller their own message for today, so an admin can see exactly what staff receive. */
function api_sendMyNotification() {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'testmail', 3, 600);
  var today = today_(), rec = withTasks_(todaysNotifications_()).filter(function (r) { return r.email === u.email; })[0] || { email: u.email, name: u.name, items: [] };
  if (!rec.items.length && !(rec.tasks && rec.tasks.length)) {
    MailApp.sendEmail({ to: u.email, name: appFull_(), subject: 'رسالة تجربة من ' + AP.APP_NAME, body: 'لا توجد تنبيهات لك اليوم (' + today + '). وصول هذه الرسالة يعني أن البريد يعمل.' });
  } else mailDigest_(rec, today, prop_('SITE_URL'));
  audit_(u, 'notification-test', u.email, { items: rec.items.length });
  return JSON.stringify({ items: rec.items.length });
}

/* ---------- write-back to the main file (execution fields only) ---------- */

/**
 * Writes done / actual / evidence / comment into the programme's own row in the main file.
 * It first checks that the row still holds the same programme. If rows moved, it finds the programme again.
 * It never touches any other cell.
 */
var FIELD_AR = { done: 'حالة الإتمام', actual: 'العدد الفعلي', evidence: 'الشاهد', comment: 'تعليق مدير المرحلة' };
function writeBack_(key, fields, actor, restore) {
  if (prop_('WRITEBACK') !== 'on') return { ok: false, message: 'الكتابة في المنصة الشاملة متوقفة من الإعدادات' };
  var snap = readSnapshot_(), idx = -1;
  for (var i = 0; i < snap.programs.length; i++) if (snap.programs[i].key === key) { idx = i; break; }
  if (idx < 0) throw fail_('GONE', 'البرنامج غير موجود في آخر مزامنة. حدّث المزامنة.');
  var p = snap.programs[idx];
  var sh = mainFile_().getSheetByName(p.sheet);
  if (!sh) throw fail_('GONE', 'الورقة غير موجودة في المنصة الشاملة.');
  var same = p.c && p.c.name && AP.norm(sh.getRange(p.row, p.c.name).getValue()) === AP.norm(p.name);
  if (!same) {
    var again = AP.parseSheet(p.sheet, sh.getDataRange().getValues()).programs.filter(function (x) { return x.key === key; })[0];
    if (!again) throw fail_('MOVED', 'تغيّر موضع البرنامج في المنصة الشاملة. حدّث المزامنة ثم أعد المحاولة.');
    p.row = again.row; p.c = again.c;
  }
  // the main branch's permissions come first: if it has closed any of these cells, nothing is written
  ['done', 'actual', 'evidence', 'comment'].forEach(function (k) {
    if (k in fields && p.c[k] && !sh.getRange(p.row, p.c[k]).canEdit()) throw fail_('LOCKED', EXEC_CLOSED);
  });
  var before = {}, wrote = [], missing = [];
  [['done', function (v) { return v === true; }], ['actual', number_], ['evidence', url_], ['comment', function (v) { return text_(v, 300); }]]
    .forEach(function (f) {
      var k = f[0];
      if (!(k in fields)) return;
      if (!p.c[k]) { missing.push(k); return; }
      // When undoing, the old value goes back exactly as it was, even if it would not pass today's checks.
      var cell = sh.getRange(p.row, p.c[k]), value = restore && k !== 'done' ? fields[k] : f[1](fields[k]);
      before[k] = cell.getValue();
      cell.setValue(value);
      if (value === '' || value === false) delete p[k]; else p[k] = value;
      wrote.push(k);
    });
  SpreadsheetApp.flush();
  snap.programs[idx] = p;
  writeSnapshot_(snap);
  audit_(actor, 'writeback', p.sheet + ' R' + p.row + ' ' + p.name, { wrote: wrote, noColumn: missing, before: before, after: fields });
  return { ok: wrote.length > 0, wrote: wrote, missing: missing, before: before, program: p,
    message: !wrote.length ? 'لا يوجد عمود مطابق في جدول هذا البرنامج' :
      'كُتب في المنصة الشاملة' + (missing.length ? ' · جدول هذا المؤشر لا يحتوي عمود: ' + missing.map(function (k) { return FIELD_AR[k]; }).join('، ') : '') };
}

/* ---------- other platforms, as buttons ---------- */
// The page shows each as a button that opens the platform in a new tab. Nothing is read from those platforms.
var DEFAULT_LINKS = [{ name: 'منصة التطور المهني', url: 'https://andalus-idp.online/', who: 'admins' }];
function links_() {
  var raw = PropertiesService.getScriptProperties().getProperty('LINKS');
  if (raw === null || raw === undefined) return DEFAULT_LINKS;       // never set: the starting list
  try { var list = JSON.parse(raw); return Array.isArray(list) ? list : []; } catch (e) { return []; }
}
/** The buttons this person gets. A teacher never receives a link meant for the admins. */
function linksFor_(u) {
  var lead = isLeader_(u);
  return links_().filter(function (l) { return lead || l.who === 'all'; }).map(function (l) { return lead ? { name: l.name, url: l.url, who: l.who === 'all' ? 'all' : 'admins' } : { name: l.name, url: l.url }; });
}

/* ---------- API for the page ---------- */

function publicSettings_() {
  return {
    termStarts: { 1: prop_('T1_START'), 2: prop_('T2_START') }, lastSync: prop_('LAST_SYNC'), lastSyncError: prop_('LAST_SYNC_ERROR'),
    writeBack: prop_('WRITEBACK') === 'on', planEdit: prop_('PLAN_EDIT') === 'on', mainFileSet: !!prop_('MAIN_FILE_ID'), scope: scope_(), syncHours: +prop_('SYNC_HOURS') || 1, domain: prop_('DOMAIN'),
    slogan: prop_('SLOGAN') || DEFAULT_SLOGAN, welcome: prop_('WELCOME'),
    weekly: prop_('WEEKLY') !== 'off', weeklyDay: weeklyDay_(), lastWeekly: prop_('WEEKLY_LAST'),
    notify: prop_('NOTIFY') !== 'off', notifyTime: notifyTime_().text, siteUrl: prop_('SITE_URL'), whatsappAuto: waReady_(), lastNotify: prop_('NOTIFY_LAST')
  };
}

function subsFor_(u) {
  var stages = stagesOf_(u), lead = isLeader_(u);
  return readTable_(SH.SUBS, SUB_COLS).filter(function (s) {
    return lead ? stages.indexOf(s.stage) !== -1 : String(s.by).toLowerCase() === u.email;
  }).map(subOut_);
}
/** A report as the page receives it: without the server's own undo record, and with the number as a number. */
function subOut_(s) {
  var o = {};
  SUB_COLS.forEach(function (c) { if (c !== 'undo') o[c] = s[c]; });
  if (o.actual !== '' && o.actual !== null && o.actual !== undefined) o.actual = Number(o.actual);
  return o;
}

/** Everything the page needs at start, already limited to what this user may see. */
function api_bootstrap() {
  var u = me_(), stages = stagesOf_(u), snap = readSnapshot_();
  var inStage = function (x) { return stages.indexOf(x.stage) !== -1; };
  return JSON.stringify({
    me: { email: u.email, name: u.name, role: u.role, stages: stages, aliases: u.aliases, photo: photos_()[u.email] || '' },
    settings: publicSettings_(), today: today_(), fileName: snap.fileName || '',
    programs: snap.programs.filter(inStage), indicators: snap.indicators.filter(inStage),
    targets: snap.targets.map(function (t) {
      var keep = {};
      stages.forEach(function (s) { if (t.stages[s]) keep[s] = t.stages[s]; });
      return { code: t.code, name: t.name, unit: t.unit, stages: keep };
    }),
    submissions: subsFor_(u), assign: assignOut_(u, snap.programs.filter(inStage)), links: linksFor_(u), visitsNew: visitsNew_(u),
    plan: (function () { var out = {}, all = snap.plan || {}; Object.keys(all).forEach(function (k) { if (stages.indexOf(k.split('|')[1]) !== -1) out[k] = all[k]; }); return out; })()
  });
}

/** A member of staff reports work on a programme, or adds work on an indicator. It waits for a leader's review. */
function api_submit(json) {
  var u = me_();
  needWrite_(u);
  rate_(u, 'submit', 30, 300);
  var d = JSON.parse(json), type = d.type === 'contribution' ? 'contribution' : 'report';
  var rec = { type: type, programKey: '', sheet: '', stage: '', kpi: '', title: '' };
  if (type === 'report') {
    var p = readSnapshot_().programs.filter(function (x) { return x.key === d.programKey; })[0];
    if (!p) throw fail_('GONE', 'البرنامج غير موجود في آخر مزامنة.');
    rec.programKey = p.key; rec.sheet = p.sheet; rec.stage = p.stage; rec.kpi = p.kpi; rec.title = p.name;
  } else {
    if (AP.STAGES.indexOf(d.stage) === -1 || !/^[A-D]\.Br \d\.\d$/.test(String(d.kpi))) throw fail_('INPUT', 'اختر المرحلة والمؤشر');
    rec.stage = d.stage; rec.kpi = d.kpi; rec.title = text_(d.title, 160);
    if (!rec.title) throw fail_('INPUT', 'اكتب عنوان العمل');
  }
  needStage_(u, rec.stage);
  rec.outcome = ['done', 'partial', 'postponed'].indexOf(d.outcome) !== -1 ? d.outcome : 'done';
  rec.execDate = date_(d.execDate); rec.actual = number_(d.actual); rec.evidence = url_(d.evidence); rec.note = text_(d.note, 1000);
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sh = SpreadsheetApp.getActive().getSheetByName(SH.SUBS), now = nowIso_();
    var pending = type === 'report' ? readTable_(SH.SUBS, SUB_COLS).filter(function (s) {
      return s.status === 'pending' && s.programKey === rec.programKey && String(s.by).toLowerCase() === u.email;
    })[0] : null;
    var full = {
      id: pending ? pending.id : Utilities.getUuid(), createdAt: now, by: u.email, byName: u.name, type: type, programKey: rec.programKey,
      sheet: rec.sheet, stage: rec.stage, kpi: rec.kpi, title: text_(rec.title, 160), outcome: rec.outcome, execDate: rec.execDate, actual: rec.actual,
      evidence: rec.evidence, note: rec.note, status: 'pending', reviewedBy: '', reviewedAt: '', reviewNote: '', writeback: '', undo: ''
    };
    var row = SUB_COLS.map(function (c) { return full[c]; });
    if (pending) sh.getRange(pending._row, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
    audit_(u, pending ? 'report-updated' : 'report-submitted', rec.title, { id: full.id, stage: rec.stage, kpi: rec.kpi });
    return JSON.stringify(subOut_(full));
  } finally { lock.releaseLock(); }
}

/** A leader approves or returns a report. Approval of a completed programme writes its execution fields to the main file. */
function api_review(id, decision, note) {
  var u = me_();
  needLeader_(u);
  rate_(u, 'review', 120, 300);
  if (['approved', 'returned'].indexOf(decision) === -1) throw fail_('INPUT', 'قرار غير معروف');
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var s = readTable_(SH.SUBS, SUB_COLS).filter(function (x) { return x.id === id; })[0];
    if (!s) throw fail_('GONE', 'التقرير غير موجود');
    needStage_(u, s.stage);
    if (s.status !== 'pending') throw fail_('STATE', 'سبق البت في هذا التقرير');
    return decide_(s, decision, note, u);
  } finally { lock.releaseLock(); }
}

/** A leader edits execution fields directly. The stage principal's comment is for the principal and the owner. */
function api_updateExecution(key, json) {
  var u = me_();
  needLeader_(u);
  rate_(u, 'write', 120, 300);
  var d = JSON.parse(json), fields = {};
  ['done', 'actual', 'evidence'].forEach(function (k) { if (k in d) fields[k] = d[k]; });
  if ('comment' in d) {
    if (['owner', 'principal'].indexOf(u.role) === -1) throw fail_('FORBIDDEN', 'تعليق مدير المرحلة للمدير فقط.');
    fields.comment = d.comment;
  }
  var p = readSnapshot_().programs.filter(function (x) { return x.key === key; })[0];
  if (!p) throw fail_('GONE', 'البرنامج غير موجود في آخر مزامنة.');
  needStage_(u, p.stage);
  if (prop_('WRITEBACK') !== 'on') throw fail_('SETUP', 'الكتابة في المنصة الشاملة متوقفة. يفعّلها مالك النظام من الإعدادات.');
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var r = writeBack_(key, fields, u);
    // What the cells held before is kept on the server, so an undo never takes its values from the page.
    if (r.ok) { r.undoId = Utilities.getUuid(); CacheService.getScriptCache().put('undo:' + r.undoId, JSON.stringify({ key: key, before: r.before, by: u.email }), 21600); }
    return JSON.stringify(r);
  } finally { lock.releaseLock(); }
}

/** Undo for a leader's own edit: puts back what the cells held before it. Works for six hours and only once. */
function api_undoExecution(undoId) {
  var u = me_();
  needLeader_(u);
  rate_(u, 'write', 120, 300);
  var cache = CacheService.getScriptCache(), k = 'undo:' + String(undoId || '').replace(/[^\w-]/g, '').slice(0, 60), raw = cache.get(k), rec = null;
  try { rec = raw ? JSON.parse(raw) : null; } catch (e) { rec = null; }
  if (!rec || rec.by !== u.email) throw fail_('GONE', 'انتهت مهلة التراجع عن هذا التعديل.');
  var p = readSnapshot_().programs.filter(function (x) { return x.key === rec.key; })[0];
  if (!p) throw fail_('GONE', 'البرنامج غير موجود في آخر مزامنة.');
  needStage_(u, p.stage);
  if (prop_('WRITEBACK') !== 'on') throw fail_('SETUP', 'الكتابة في المنصة الشاملة متوقفة. يفعّلها مالك النظام من الإعدادات.');
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var r = writeBack_(rec.key, rec.before, u, true);
    cache.remove(k);
    return JSON.stringify(r);
  } finally { lock.releaseLock(); }
}

function api_sync() {
  var u = me_();
  needLeader_(u);
  rate_(u, 'sync', 6, 600);
  syncNow_(u);
  return api_bootstrap();
}

/* ---------- owner only ---------- */

function api_users() {
  var u = me_();
  needAdmin_(u);
  var map = users_(), photos = photos_();
  return JSON.stringify(Object.keys(map).map(function (k) {
    var x = map[k];
    return { email: x.email, name: x.name, role: x.role, stages: x.stages, active: x.active, aliases: x.aliases, phone: x.phone, channel: x.channel, major: x.major, position: x.position, photo: photos[x.email] || '' };
  }));
}

function api_saveUser(json) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'admin', 60, 300);
  var d = JSON.parse(json), email = String(d.email || '').toLowerCase().trim(), domain = prop_('DOMAIN');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || (domain && email.split('@')[1] !== domain)) throw fail_('INPUT', 'البريد يجب أن يكون على نطاق المدرسة ' + domain);
  if (ROLES.indexOf(d.role) === -1) throw fail_('INPUT', 'الدور غير صحيح');
  var stages = (d.stages || []).filter(function (s) { return s === '*' || AP.STAGES.indexOf(s) !== -1; });
  if (!stages.length) throw fail_('INPUT', 'اختر مرحلة واحدة على الأقل');
  var phone = String(d.phone || '').replace(/[\s+()-]/g, '');
  if (phone && !/^\d{8,15}$/.test(phone)) throw fail_('INPUT', 'رقم الجوال يُكتب بالصيغة الدولية بالأرقام فقط، مثل 9665xxxxxxxx');
  var channel = CHANNELS.indexOf(d.channel) !== -1 ? d.channel : 'email';
  if ((channel === 'whatsapp' || channel === 'both') && !phone) throw fail_('INPUT', 'أضف رقم الجوال لاستخدام واتساب');
  var active = d.active !== false, map = users_(), existing = map[email];
  // The technical owner's account, and the owner role itself, can only be changed by an owner.
  if (u.role !== 'owner' && (d.role === 'owner' || (existing && existing.role === 'owner'))) throw fail_('FORBIDDEN', 'حساب مالك النظام يعدّله مالك النظام فقط.');
  var owners = Object.keys(map).filter(function (k) { return map[k].role === 'owner' && map[k].active && k !== email; });
  if (!owners.length && existing && existing.role === 'owner' && (d.role !== 'owner' || !active)) throw fail_('STATE', 'يجب أن يبقى للنظام مالك واحد على الأقل.');
  var row = [email, text_(d.name, 80) || email, d.role, stages.join(', '), active, (d.aliases || []).map(function (a) { return text_(a, 60); }).filter(String).join(', '), phone, channel,
    'major' in d ? text_(d.major, 80) : (existing ? existing.major : ''), 'position' in d ? text_(d.position, 80) : (existing ? existing.position : '')];
  var sh = SpreadsheetApp.getActive().getSheetByName(SH.USERS);
  if (existing) sh.getRange(existing._row, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
  CacheService.getScriptCache().remove('users');
  audit_(u, existing ? 'user-updated' : 'user-added', email, { role: d.role, stages: stages, active: active });
  return api_users();
}

function api_saveSettings(json) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'admin', 60, 300);
  var d = JSON.parse(json), p = PropertiesService.getScriptProperties(), fileName = '';
  if (d.mainFile) {
    var m = String(d.mainFile).match(/[-\w]{25,}/);
    if (!m) throw fail_('INPUT', 'رابط الملف غير صحيح');
    try { fileName = SpreadsheetApp.openById(m[0]).getName(); }
    catch (e) { throw fail_('SETUP', 'لا يملك حسابك صلاحية على هذا الملف، أو الرابط غير صحيح.'); }
    p.setProperty('MAIN_FILE_ID', m[0]);
  }
  if (d.t1) p.setProperty('T1_START', date_(d.t1));
  if (d.t2) p.setProperty('T2_START', date_(d.t2));
  if (d.scope) {
    var scope = d.scope.filter(function (s) { return AP.STAGES.indexOf(s) !== -1; });
    if (!scope.length) throw fail_('INPUT', 'اختر مرحلة واحدة على الأقل');
    p.setProperty('STAGES', JSON.stringify(scope));
  }
  if ('writeBack' in d) p.setProperty('WRITEBACK', d.writeBack ? 'on' : 'off');
  if ('planEdit' in d) p.setProperty('PLAN_EDIT', d.planEdit ? 'on' : 'off');
  if ('slogan' in d) p.setProperty('SLOGAN', text_(d.slogan, 160));
  if ('welcome' in d) p.setProperty('WELCOME', text_(d.welcome, 300));
  if ('notify' in d) p.setProperty('NOTIFY', d.notify ? 'on' : 'off');
  if ('weekly' in d) p.setProperty('WEEKLY', d.weekly ? 'on' : 'off');
  if ('weeklyDay' in d) {
    if ([0, 1, 2, 3, 4, 5, 6].indexOf(+d.weeklyDay) === -1) throw fail_('INPUT', 'يوم التقرير الأسبوعي غير صحيح');
    p.setProperty('WEEKLY_DAY', String(+d.weeklyDay));
  }
  if (d.notifyTime) {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(String(d.notifyTime))) throw fail_('INPUT', 'وقت التنبيهات غير صحيح');
    if (String(d.notifyTime) !== notifyTime_().text) { p.setProperty('NOTIFY_TIME', String(d.notifyTime)); installNotifyTrigger_(); }
  }
  if ('siteUrl' in d) {
    var site = String(d.siteUrl || '').trim();
    if (site && (site.length > 200 || !/^https:\/\/[^\s<>"']+$/i.test(site))) throw fail_('INPUT', 'عنوان الموقع يجب أن يبدأ بـ https://');
    p.setProperty('SITE_URL', site);
  }
  if ('links' in d) {
    var links = (Array.isArray(d.links) ? d.links : []).map(function (l) {
      l = l || {};
      var name = text_(l.name, 60), url = String(l.url || '').trim();
      if (!name) throw fail_('INPUT', 'اكتب اسم المنصة');
      if (url.length > 300 || !/^https:\/\/[^\s<>"']+$/i.test(url)) throw fail_('INPUT', 'رابط المنصة يجب أن يبدأ بـ https://');
      return { name: name, url: url, who: l.who === 'all' ? 'all' : 'admins' };
    });
    if (links.length > 12) throw fail_('INPUT', 'الحد الأقصى 12 منصة.');
    p.setProperty('LINKS', JSON.stringify(links));
  }
  if (d.syncHours && [1, 2, 4, 6, 12].indexOf(+d.syncHours) !== -1) { p.setProperty('SYNC_HOURS', String(+d.syncHours)); installTrigger_(+d.syncHours); }
  audit_(u, 'settings', fileName, { t1: d.t1, t2: d.t2, scope: d.scope, writeBack: d.writeBack, notify: d.notify, notifyTime: d.notifyTime, syncHours: d.syncHours, mainFileChanged: !!d.mainFile, links: 'links' in d ? (d.links || []).length : undefined });
  return JSON.stringify({ settings: publicSettings_(), fileName: fileName, links: linksFor_(u) });
}

function api_audit(limit) {
  var u = me_();
  needAdmin_(u);
  var sh = SpreadsheetApp.getActive().getSheetByName(SH.AUDIT), n = Math.min(Math.max(+limit || 100, 1), 500), last = sh.getLastRow();
  if (last < 2) return '[]';
  var from = Math.max(2, last - n + 1);
  var rows = sh.getRange(from, 1, last - from + 1, AUDIT_COLS.length).getValues().reverse();
  return JSON.stringify(rows.map(function (r) { return { time: r[0] instanceof Date ? r[0].toISOString() : r[0], email: r[1], role: r[2], action: r[3], target: r[4], details: r[5] }; }));
}

/* ---------- start page, pictures, undo, private calendars ---------- */

/**
 * The slogan and welcome line of the start page. Public on purpose: it is shown before anyone signs in.
 * An empty welcome means the admins have not written one, and the page shows its own, in the reader's language.
 */
function api_public() { return JSON.stringify({ slogan: prop_('SLOGAN') || DEFAULT_SLOGAN, welcome: prop_('WELCOME') }); }

function photos_() {
  var map = {};
  readTable_(SH.PHOTOS, PHOTO_COLS).forEach(function (r) { if (r.email && r.photo) map[String(r.email).toLowerCase()] = String(r.photo); });
  return map;
}

/** A person's own picture: a small JPEG, PNG or WebP that the page has already shrunk. An empty value removes it. */
function api_savePhoto(dataUri) {
  var u = me_();
  rate_(u, 'photo', 10, 600);
  var s = String(dataUri || '');
  if (s && (s.length > 48000 || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/]+=*$/.test(s))) throw fail_('INPUT', 'الصورة غير صالحة أو أكبر من المسموح.');
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sh = SpreadsheetApp.getActive().getSheetByName(SH.PHOTOS), row = readTable_(SH.PHOTOS, PHOTO_COLS).filter(function (r) { return String(r.email).toLowerCase() === u.email; })[0];
    if (row) sh.getRange(row._row, 1, 1, 2).setValues([[u.email, s]]); else sh.appendRow([u.email, s]);
    audit_(u, s ? 'photo-saved' : 'photo-removed', u.email, '');
    return JSON.stringify({ photo: s });
  } finally { lock.releaseLock(); }
}

/** Records a decision on a waiting report or plan request, writing to the main file where the decision calls for it. Caller holds the lock. */
function decide_(s, decision, note, u) {
  var wb = '', program = null, plan = s.type === 'add' || s.type === 'remove';
  if (decision === 'approved' && plan) {
    // if the main branch has closed this part of the plan, this throws and the request stays waiting
    var res = planApply_(s, u);
    wb = res.message; s.undo = JSON.stringify(res.undo);
    if (res.key) s.programKey = res.key;
  } else if (decision === 'approved' && s.type === 'report' && s.outcome === 'done') {
    var fields = { done: true };
    if (s.actual !== '') fields.actual = s.actual;
    if (s.evidence) fields.evidence = s.evidence;
    try { var r = writeBack_(s.programKey, fields, u); wb = r.message; program = r.program || null; if (r.ok) s.undo = JSON.stringify(r.before); }
    catch (e) { wb = 'لم يُكتب: ' + String(e.message).split('|').pop(); }
  } else if (decision === 'approved') {
    wb = s.type === 'contribution' ? 'محفوظ في ملف التحكم فقط' : 'لا كتابة: البرنامج لم يكتمل';
  }
  s.status = decision; s.reviewedBy = u.email; s.reviewedAt = nowIso_(); s.reviewNote = text_(note, 500); s.writeback = wb;
  var rowNo = s._row;
  delete s._row;
  SpreadsheetApp.getActive().getSheetByName(SH.SUBS).getRange(rowNo, 1, 1, SUB_COLS.length).setValues([SUB_COLS.map(function (c) { return s[c] === undefined ? '' : s[c]; })]);
  audit_(u, 'review-' + decision, s.title, { id: s.id, by: s.by, type: s.type, writeback: wb });
  var out = { submission: subOut_(s), program: program };
  if (plan && decision === 'approved') out.boot = api_bootstrap();
  return JSON.stringify(out);
}

/** Undo for a report its sender has just sent: only while it is still waiting for review. */
function api_withdraw(id) {
  var u = me_();
  needWrite_(u);
  rate_(u, 'submit', 30, 300);
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var s = readTable_(SH.SUBS, SUB_COLS).filter(function (x) { return x.id === id; })[0];
    if (!s || String(s.by).toLowerCase() !== u.email) throw fail_('GONE', 'التقرير غير موجود');
    if (s.status !== 'pending') throw fail_('STATE', 'رُوجع التقرير ولا يمكن سحبه.');
    SpreadsheetApp.getActive().getSheetByName(SH.SUBS).deleteRow(s._row);
    audit_(u, 'report-withdrawn', s.title, { id: id });
    return '';
  } finally { lock.releaseLock(); }
}

/** Undo for a review decision: the report waits again, and anything the approval wrote to the main file is put back. */
function api_reopen(id) {
  var u = me_();
  needLeader_(u);
  rate_(u, 'review', 120, 300);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var s = readTable_(SH.SUBS, SUB_COLS).filter(function (x) { return x.id === id; })[0];
    if (!s) throw fail_('GONE', 'التقرير غير موجود');
    needStage_(u, s.stage);
    if (s.status === 'pending') throw fail_('STATE', 'التقرير بانتظار المراجعة أصلاً.');
    var program = null, plan = s.type === 'add' || s.type === 'remove', reverted = false;
    if (s.undo && plan) { planRevert_(s, u); reverted = true; }
    else if (s.undo) { try { program = writeBack_(s.programKey, JSON.parse(s.undo), u, true).program || null; } catch (e) { throw fail_('STATE', 'تعذر التراجع عن الكتابة في المنصة الشاملة: ' + String(e.message).split('|').pop()); } }
    s.status = 'pending'; s.reviewedBy = ''; s.reviewedAt = ''; s.reviewNote = ''; s.writeback = ''; s.undo = '';
    var rowNo = s._row;
    delete s._row;
    SpreadsheetApp.getActive().getSheetByName(SH.SUBS).getRange(rowNo, 1, 1, SUB_COLS.length).setValues([SUB_COLS.map(function (c) { return s[c]; })]);
    audit_(u, 'review-undone', s.title, { id: id });
    var out = { submission: subOut_(s), program: program };
    if (reverted) out.boot = api_bootstrap();
    return JSON.stringify(out);
  } finally { lock.releaseLock(); }
}

function ownRows_(name, cols, email) { return readTable_(name, cols).filter(function (r) { return String(r.owner).toLowerCase() === email; }); }

/** Adds or changes a row that belongs to the caller. Nobody can touch another person's rows. */
function saveOwn_(name, cols, rec, u) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var mine = ownRows_(name, cols, u.email), existing = rec.id ? mine.filter(function (r) { return r.id === rec.id; })[0] : null;
    if (rec.id && !existing) throw fail_('GONE', 'العنصر غير موجود');
    if (!existing && mine.length >= 400) throw fail_('STATE', 'بلغت الحد الأقصى من العناصر.');
    rec.id = existing ? existing.id : Utilities.getUuid(); rec.owner = u.email;
    var row = cols.map(function (c) { return rec[c]; }), sh = SpreadsheetApp.getActive().getSheetByName(name);
    if (existing) sh.getRange(existing._row, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
    return rec;
  } finally { lock.releaseLock(); }
}

function deleteOwn_(name, cols, id, u) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var r = ownRows_(name, cols, u.email).filter(function (x) { return x.id === id; })[0];
    if (!r) throw fail_('GONE', 'العنصر غير موجود');
    SpreadsheetApp.getActive().getSheetByName(name).deleteRow(r._row);
  } finally { lock.releaseLock(); }
}

function time_(v) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(v || '')) ? String(v) : ''; }
function taskOut_(r) {
  var done = [];
  try { done = JSON.parse(r.done || '[]'); } catch (e) { done = []; }
  return { id: r.id, title: String(r.title), note: String(r.note || ''), date: String(r.date).slice(0, 10), repeat: String(r.repeat || 'none'), time: String(r.time || ''), until: String(r.until || '').slice(0, 10), notify: isTrue_(r.notify), done: done };
}
function sessionOut_(r) { return { id: r.id, weekday: +r.weekday, start: String(r.start), end: String(r.end), subject: String(r.subject), klass: String(r.klass || ''), room: String(r.room || '') }; }

/** The caller's private calendars: tasks (admins only) and the weekly sessions timetable (everyone). Never anyone else's. */
function api_myCalendar() {
  var u = me_();
  return JSON.stringify({
    tasks: isLeader_(u) ? ownRows_(SH.TASKS, TASK_COLS, u.email).map(taskOut_) : [],
    sessions: ownRows_(SH.SESSIONS, SESSION_COLS, u.email).map(sessionOut_)
  });
}

function api_saveTask(json) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'cal', 150, 300);
  var d = JSON.parse(json);
  var rec = { id: String(d.id || ''), title: text_(d.title, 140), note: text_(d.note, 500), date: date_(d.date), repeat: ['none', 'daily', 'weekly'].indexOf(d.repeat) !== -1 ? d.repeat : 'none',
    time: time_(d.time), until: date_(d.until), notify: d.notify !== false,
    done: JSON.stringify((Array.isArray(d.done) ? d.done : []).filter(function (x) { return /^\d{4}-\d{2}-\d{2}$/.test(String(x)); }).slice(-200)) };
  if (!rec.title || !rec.date) throw fail_('INPUT', 'اكتب عنوان المهمة وتاريخها');
  if (rec.until && rec.until < rec.date) throw fail_('INPUT', 'تاريخ الانتهاء قبل تاريخ البداية');
  return JSON.stringify(taskOut_(saveOwn_(SH.TASKS, TASK_COLS, rec, u)));
}

function api_deleteTask(id) { var u = me_(); needAdmin_(u); rate_(u, 'cal', 150, 300); deleteOwn_(SH.TASKS, TASK_COLS, String(id), u); return ''; }

function api_saveSession(json) {
  var u = me_();
  rate_(u, 'cal', 150, 300);
  var d = JSON.parse(json), wd = Math.floor(Number(d.weekday));
  var rec = { id: String(d.id || ''), weekday: wd, start: time_(d.start), end: time_(d.end), subject: text_(d.subject, 80), klass: text_(d.klass, 40), room: text_(d.room, 40) };
  if (!(wd >= 0 && wd <= 6) || !rec.start || !rec.end || rec.end <= rec.start) throw fail_('INPUT', 'اختر اليوم ووقت بداية ونهاية صحيحين');
  if (!rec.subject) throw fail_('INPUT', 'اكتب المادة');
  return JSON.stringify(sessionOut_(saveOwn_(SH.SESSIONS, SESSION_COLS, rec, u)));
}

function api_deleteSession(id) { var u = me_(); rate_(u, 'cal', 150, 300); deleteOwn_(SH.SESSIONS, SESSION_COLS, String(id), u); return ''; }

/* ---------- the plan itself: adding and removing programmes while the main branch allows it ---------- */

var PLAN_NUMBERS = { count: 1, budget: 1, revenue: 1, cost: 1, net: 1 };
var CLOSED = 'التخطيط مغلق من الفرع الرئيسي في المنصة الشاملة.';
var EXEC_CLOSED = 'بيانات التنفيذ مغلقة من الفرع الرئيسي في المنصة الشاملة.';

function blank_(v) { return v === '' || v === null || v === undefined; }

/**
 * Reads the plan tables of one indicator and stage from the live main file: their columns, programmes and free rows.
 * A free row is one the main branch prepared after the last programme: empty plan cells and an unticked approval box.
 */
function planTables_(kpi, stage) {
  var snap = readSnapshot_(), at = snap.programs.filter(function (p) { return p.kpi === kpi && p.stage === stage; })[0] ||
    snap.indicators.filter(function (b) { return b.kpi === kpi && b.stage === stage; })[0];
  if (!at) throw fail_('GONE', 'لا يوجد جدول لهذا المؤشر في هذه المرحلة.');
  var sh = mainFile_().getSheetByName(at.sheet);
  if (!sh) throw fail_('GONE', 'الورقة غير موجودة في المنصة الشاملة.');
  var values = sh.getDataRange().getValues(), out = [];
  AP.parseSheet(at.sheet, values).tables.forEach(function (tbl) {
    if (tbl.kpi !== kpi || tbl.stage !== stage) return;
    var b = AP.planBounds(tbl);
    if (!b) return;                                            // not a plan table
    out.push({ sh: sh, sheet: at.sheet, values: values, tbl: tbl, sub: tbl.sub || '', plan: tbl.cols.filter(function (c) { return c.col <= b.last; }),
      first: b.first, last: b.last, approvedCol: b.approvedCol, nameCol: b.nameCol, free: AP.freeRows(tbl, values) });
  });
  if (!out.length) throw fail_('GONE', 'لا يوجد جدول خطة لهذا المؤشر في هذه المرحلة.');
  return out;
}

/** The choices a cell offers, when the main file limits it to a list; 'checkbox' for a tick box; null for free typing. */
function listOf_(rule) {
  if (!rule) return null;
  var kind = rule.getCriteriaType(), K = SpreadsheetApp.DataValidationCriteria, vals = rule.getCriteriaValues(), out = [], seen = {};
  var take = function (v) { v = String(v === null || v === undefined ? '' : v).trim(); if (v && !seen[v] && out.length < 200) { seen[v] = true; out.push(v); } };
  if (kind === K.CHECKBOX) return 'checkbox';
  if (kind === K.VALUE_IN_LIST) { (vals[0] || []).forEach(take); return out; }
  if (kind === K.VALUE_IN_RANGE) { vals[0].getValues().forEach(function (r) { r.forEach(take); }); return out; }
  return null;
}

/** What can be typed into a free row: one field per heading of the plan, as the main file itself defines it. */
function planFields_(t, row) {
  var rng = t.sh.getRange(row, t.first, 1, t.last - t.first + 1), formulas = rng.getFormulas()[0], rules = rng.getDataValidations()[0], out = [], weeks = [];
  for (var w = 1; w <= 20; w++) weeks.push('الأسبوع ' + w);
  var free = function (col) { return col >= t.first && col <= t.last && !formulas[col - t.first]; };
  var heads = {};
  t.plan.forEach(function (c) { heads[c.col] = true; });
  t.plan.forEach(function (c) {
    if (!free(c.col)) return;                                  // a calculated cell: the main file fills it itself
    var list = listOf_(rules[c.col - t.first]);
    if (list === 'checkbox') return;
    var f = { id: 'c' + c.col, col: c.col, field: c.field, label: c.label, required: c.field === 'name' };
    if (c.field === 'when' || c.field === 'term') {
      out.push({ id: f.id, col: c.col, field: 'term', label: c.field === 'when' ? c.label + ' · الفصل' : c.label, type: 'list', required: true, options: list && list.length ? list : ['فصل 1', 'فصل 2'] });
      if (c.field === 'when' && !heads[c.col + 1] && free(c.col + 1)) {
        var wl = listOf_(rules[c.col + 1 - t.first]);
        out.push({ id: 'c' + (c.col + 1), col: c.col + 1, field: 'week', label: c.label + ' · الأسبوع', type: 'list', required: true, options: wl && wl !== 'checkbox' && wl.length ? wl : weeks });
      }
      return;
    }
    if (list && list.length) { f.type = 'list'; f.options = list; }
    else f.type = PLAN_NUMBERS[c.field] ? 'number' : (c.field === 'start' || c.field === 'end') ? 'date' : c.field === 'details' ? 'long' : 'text';
    out.push(f);
  });
  return out;
}

/** Checks what was typed against the fields, and turns it into the values to write. */
function planValues_(fields, input) {
  var cells = [];
  fields.forEach(function (f) {
    var raw = input[f.id], v;
    if (blank_(raw) || String(raw).trim() === '') { if (f.required) throw fail_('INPUT', 'أكمل الحقل: ' + f.label); return; }
    if (f.type === 'list') { v = String(raw); if (f.options.indexOf(v) === -1) throw fail_('INPUT', 'قيمة غير موجودة في قائمة: ' + f.label); }
    else if (f.type === 'number') v = number_(raw);
    else if (f.type === 'date') { var iso = date_(raw).split('-'); v = new Date(+iso[0], +iso[1] - 1, +iso[2]); }
    else v = text_(raw, f.type === 'long' ? 600 : 200);
    cells.push({ col: f.col, field: f.field, label: f.label, value: v, shown: f.type === 'date' ? String(raw) : String(v) });
  });
  return cells;
}

function planTable_(kpi, stage, index) {
  var all = planTables_(kpi, stage), t = all[Math.max(0, Math.min(all.length - 1, +index || 0))];
  return t;
}

/** Writes a new programme into the first free row of the plan table. */
function planAdd_(kpi, stage, index, input) {
  var t = planTable_(kpi, stage, index);
  if (!t.free.length) throw fail_('FULL', 'لا يوجد صف فارغ في جدول هذا المؤشر. تُطلب زيادة الصفوف من الفرع الرئيسي.');
  var row = t.free[0], cells = planValues_(planFields_(t, row), input);
  if (!t.sh.getRange(row, t.first, 1, t.last - t.first + 1).canEdit()) throw fail_('LOCKED', CLOSED);
  try {
    cells.forEach(function (x) { t.sh.getRange(row, x.col).setValue(x.value); });
    SpreadsheetApp.flush();
  } catch (e) {
    cells.forEach(function (x) { try { t.sh.getRange(row, x.col).clearContent(); } catch (e2) { /* nothing more can be done */ } });
    throw fail_('LOCKED', 'لم تقبل المنصة الشاملة الكتابة: التخطيط مغلق من الفرع الرئيسي، أو قيمة لا تقبلها إحدى القوائم.');
  }
  var name = cells.filter(function (x) { return x.col === t.nameCol; })[0];
  return { sheet: t.sheet, row: row, cols: cells.map(function (x) { return x.col; }), name: name ? name.value : '' };
}

/** Finds a programme in the live sheet again, wherever its row is now. */
function liveProgramme_(p) {
  var sh = mainFile_().getSheetByName(p.sheet);
  if (!sh) throw fail_('GONE', 'الورقة غير موجودة في المنصة الشاملة.');
  var live = AP.parseSheet(p.sheet, sh.getDataRange().getValues()).programs.filter(function (x) { return x.key === p.key; })[0];
  if (!live) throw fail_('MOVED', 'تغيّر البرنامج في المنصة الشاملة. حدّث المزامنة ثم أعد المحاولة.');
  return live;
}

/** Empties the plan cells of a programme's row, so the row is free again. Refused once the main branch has approved it, or once it has execution data. */
function planRemove_(key) {
  var p = readSnapshot_().programs.filter(function (x) { return x.key === key; })[0];
  if (!p) throw fail_('GONE', 'البرنامج غير موجود في آخر مزامنة.');
  var live = liveProgramme_(p);
  if (live.approved) throw fail_('LOCKED', 'اعتمد الفرع الرئيسي هذا البرنامج في المنصة الشاملة، فلا يُحذف من هنا.');
  if (live.done || live.actual !== null || live.evidence) throw fail_('STATE', 'للبرنامج بيانات تنفيذ مسجلة، فلا يُحذف.');
  var t = planTables_(p.kpi, p.stage).filter(function (x) { return x.tbl.rows.indexOf(live.row) !== -1; })[0];
  if (!t) throw fail_('MOVED', 'تغيّر موضع البرنامج في المنصة الشاملة. حدّث المزامنة ثم أعد المحاولة.');
  var rng = t.sh.getRange(live.row, t.first, 1, t.last - t.first + 1);
  if (!rng.canEdit()) throw fail_('LOCKED', CLOSED);
  var vals = rng.getValues()[0], formulas = rng.getFormulas()[0], cells = [];
  vals.forEach(function (v, i) {
    if (formulas[i] || blank_(v) || typeof v === 'boolean') return;
    cells.push(v instanceof Date ? { col: t.first + i, d: Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd') } : { col: t.first + i, v: v });
  });
  try {
    cells.forEach(function (x) { t.sh.getRange(live.row, x.col).clearContent(); });
    SpreadsheetApp.flush();
  } catch (e) { throw fail_('LOCKED', CLOSED); }
  return { sheet: p.sheet, row: live.row, cells: cells, name: p.name };
}

function responsibleFor_(u, p) {
  var chosen = assignments_()[p.key];
  return chosen ? chosen === u.email : AP.namedIn(p.assignee || '', [u]).length > 0;
}

/** Carries out an approved plan request in the main file, then reads the file again so the platform shows the result. */
function planApply_(s, u) {
  if (prop_('WRITEBACK') !== 'on') throw fail_('SETUP', 'الكتابة في المنصة الشاملة متوقفة. يفعّلها مدير النظام من الإعدادات.');
  var d = {};
  try { d = JSON.parse(s.data || '{}'); } catch (e) { d = {}; }
  if (s.type === 'add') {
    var a = planAdd_(s.kpi, s.stage, d.table, d.values || {});
    syncCore_(u);
    var made = readSnapshot_().programs.filter(function (p) { return p.sheet === a.sheet && p.row === a.row; })[0], who = users_()[String(s.by).toLowerCase()];
    // a teacher who proposed a programme becomes the person responsible for it
    if (made && who && who.active && !isLeader_(who)) { try { setAssignments_(u, [{ key: made.key, email: who.email }]); } catch (e2) { /* the programme is added either way */ } }
    return { message: 'أُضيف إلى خطة المنصة الشاملة · ' + a.sheet + ' · صف ' + a.row, key: made ? made.key : '', undo: { kind: 'add', sheet: a.sheet, row: a.row, cols: a.cols, name: a.name } };
  }
  var r = planRemove_(s.programKey);
  syncCore_(u);
  return { message: 'حُذف من خطة المنصة الشاملة · ' + r.sheet + ' · صف ' + r.row, undo: { kind: 'remove', sheet: r.sheet, row: r.row, cells: r.cells } };
}

/** Undo of a plan change: an added programme is emptied again; a removed one is written back. Only while the row is still as we left it. */
function planRevert_(s, u) {
  var un = JSON.parse(s.undo), sh = mainFile_().getSheetByName(un.sheet);
  if (!sh) throw fail_('GONE', 'الورقة غير موجودة في المنصة الشاملة.');
  var cols = un.kind === 'add' ? un.cols : un.cells.map(function (x) { return x.col; }), lo = Math.min.apply(null, cols), hi = Math.max.apply(null, cols);
  var rng = sh.getRange(un.row, lo, 1, hi - lo + 1), now = rng.getValues()[0];
  if (!rng.canEdit()) throw fail_('LOCKED', CLOSED);
  if (un.kind === 'add') {
    var p = readSnapshot_().programs.filter(function (x) { return x.key === s.programKey; })[0];
    if (!p || liveProgramme_(p).row !== un.row) throw fail_('MOVED', 'تغيّر البرنامج في المنصة الشاملة، فلا يمكن التراجع من هنا.');
    if (liveProgramme_(p).approved) throw fail_('LOCKED', 'اعتمد الفرع الرئيسي هذا البرنامج في المنصة الشاملة، فلا يُحذف من هنا.');
    un.cols.forEach(function (c) { sh.getRange(un.row, c).clearContent(); });
    var rows = readTable_(SH.ASSIGN, ASSIGN_COLS).filter(function (r) { return r.key !== s.programKey; });
    writeAssignments_(rows);
    s.programKey = '';
  } else {
    if (now.some(function (v) { return !blank_(v) && typeof v !== 'boolean'; })) throw fail_('MOVED', 'الصف لم يعد فارغاً في المنصة الشاملة، فلا يمكن إعادة البرنامج إليه.');
    un.cells.forEach(function (x) { var d = x.d ? x.d.split('-') : null; sh.getRange(un.row, x.col).setValue(d ? new Date(+d[0], +d[1] - 1, +d[2]) : x.v); });
  }
  SpreadsheetApp.flush();
  syncCore_(u);
}

/** The add form for one indicator and stage, built from the main file itself, and whether the main branch has it open. */
function api_planOptions(stage, kpi) {
  var u = me_();
  stage = String(stage || ''); kpi = String(kpi || '');
  needStage_(u, stage);
  if (!isLeader_(u) && prop_('PLAN_EDIT') !== 'on') throw fail_('FORBIDDEN', 'إضافة البرامج وحذفها غير متاحة للمعلمين حالياً. يفعّلها مديرو النظام من الإعدادات.');
  rate_(u, 'plan', 40, 300);
  var tables = planTables_(kpi, stage).map(function (t, i) {
    var open = t.free.length > 0 && t.sh.getRange(t.free[0], t.first, 1, t.last - t.first + 1).canEdit();
    return { index: i, sub: t.sub, programmes: t.tbl.rows.length, free: t.free.length, open: open,
      reason: open ? '' : t.free.length ? CLOSED : 'لا يوجد صف فارغ في هذا الجدول. تُطلب زيادة الصفوف من الفرع الرئيسي.',
      fields: t.free.length ? planFields_(t, t.free[0]).map(function (f) { return { id: f.id, label: f.label, type: f.type, required: !!f.required, options: f.options || null, field: f.field }; }) : [] };
  });
  return JSON.stringify({ stage: stage, kpi: kpi, tables: tables, direct: isLeader_(u), writeBack: prop_('WRITEBACK') === 'on' });
}

/**
 * A request to add a programme to the plan, or to remove one. A teacher's request waits for an admin;
 * an admin's own request is carried out at once. Either way the main file is only written while the main branch allows it.
 */
function api_planRequest(json) {
  var u = me_(), lead = isLeader_(u);
  needWrite_(u);
  if (!lead && prop_('PLAN_EDIT') !== 'on') throw fail_('FORBIDDEN', 'إضافة البرامج وحذفها غير متاحة للمعلمين حالياً. يفعّلها مديرو النظام من الإعدادات.');
  rate_(u, 'plan', 40, 300);
  var d = JSON.parse(json), rec;
  if (d.type === 'add') {
    var stage = String(d.stage || ''), kpi = String(d.kpi || '');
    needStage_(u, stage);
    var t = planTable_(kpi, stage, d.table);
    if (!t.free.length) throw fail_('FULL', 'لا يوجد صف فارغ في جدول هذا المؤشر. تُطلب زيادة الصفوف من الفرع الرئيسي.');
    var fields = planFields_(t, t.free[0]), cells = planValues_(fields, d.values || {}), keep = {};
    if (!t.sh.getRange(t.free[0], t.first, 1, t.last - t.first + 1).canEdit()) throw fail_('LOCKED', CLOSED);
    fields.forEach(function (f) { if (!blank_((d.values || {})[f.id])) keep[f.id] = String(d.values[f.id]).slice(0, 600); });
    var nm = cells.filter(function (x) { return x.col === t.nameCol; })[0];
    rec = { type: 'add', programKey: '', sheet: t.sheet, stage: stage, kpi: kpi, title: text_(nm ? nm.value : '', 160),
      data: JSON.stringify({ table: +d.table || 0, values: keep, show: cells.map(function (x) { return [x.label, x.shown]; }) }) };
  } else if (d.type === 'remove') {
    var p = readSnapshot_().programs.filter(function (x) { return x.key === d.programKey; })[0];
    if (!p) throw fail_('GONE', 'البرنامج غير موجود في آخر مزامنة.');
    needStage_(u, p.stage);
    if (!lead && !responsibleFor_(u, p)) throw fail_('FORBIDDEN', 'يمكنك طلب حذف البرامج المسندة إليك فقط.');
    if (p.approved) throw fail_('LOCKED', 'اعتمد الفرع الرئيسي هذا البرنامج في المنصة الشاملة، فلا يُحذف من هنا.');
    if (p.done || (p.actual !== null && p.actual !== undefined) || p.evidence) throw fail_('STATE', 'للبرنامج بيانات تنفيذ مسجلة، فلا يُحذف.');
    rec = { type: 'remove', programKey: p.key, sheet: p.sheet, stage: p.stage, kpi: p.kpi, title: text_(p.name, 160), data: '' };
  } else throw fail_('INPUT', 'طلب غير معروف');
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var sh = SpreadsheetApp.getActive().getSheetByName(SH.SUBS), all = readTable_(SH.SUBS, SUB_COLS);
    if (rec.type === 'remove' && all.some(function (x) { return x.type === 'remove' && x.status === 'pending' && x.programKey === rec.programKey; })) throw fail_('STATE', 'يوجد طلب حذف لهذا البرنامج بانتظار المراجعة.');
    var full = { id: Utilities.getUuid(), createdAt: nowIso_(), by: u.email, byName: u.name, type: rec.type, programKey: rec.programKey, sheet: rec.sheet, stage: rec.stage, kpi: rec.kpi,
      title: rec.title, outcome: '', execDate: '', actual: '', evidence: '', note: text_(d.note, 500), status: 'pending', reviewedBy: '', reviewedAt: '', reviewNote: '', writeback: '', undo: '', data: rec.data };
    sh.appendRow(SUB_COLS.map(function (c) { return full[c]; }));
    audit_(u, 'plan-request', rec.title, { id: full.id, type: rec.type, stage: rec.stage, kpi: rec.kpi });
    if (!lead) return JSON.stringify({ submission: subOut_(full) });
    // an admin's own change is carried out now; if the main branch has it closed, nothing is kept
    full._row = sh.getLastRow();
    try { return decide_(full, 'approved', '', u); }
    catch (e) { sh.deleteRow(sh.getLastRow()); throw e; }
  } finally { lock.releaseLock(); }
}

/* ---------- the school's sessions schedule ---------- */

function digits_(v) { return String(v === null || v === undefined ? '' : v).replace(/[٠-٩]/g, function (d) { return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); }); }
/** A time of day as HH:mm, from 7:30, 07.30, Arabic digits or a spreadsheet time; '' when it is not a time. */
function clock_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'HH:mm');
  var m = /^\s*(\d{1,2})\s*[:.]\s*(\d{2})\s*$/.exec(digits_(v));
  return m && +m[1] <= 23 && +m[2] <= 59 ? ('0' + +m[1]).slice(-2) + ':' + m[2] : '';
}
var DAY_NAMES = [['الاحد', 'sun', 'sunday'], ['الاثنين', 'mon', 'monday'], ['الثلاثاء', 'tue', 'tuesday'], ['الاربعاء', 'wed', 'wednesday'], ['الخميس', 'thu', 'thursday'], ['الجمعة', 'fri', 'friday'], ['السبت', 'sat', 'saturday']];
/** A weekday typed in a pasted table: its Arabic or English name, or 1 to 7 with 1 for Sunday. Returns 0 to 6, or -1. */
function weekday_(v) {
  var t = AP.norm(digits_(v)).toLowerCase().replace(/^يوم\s+/, '');
  if (/^[1-7]$/.test(t)) return +t - 1;
  for (var i = 0; i < 7; i++) if (DAY_NAMES[i].indexOf(t) !== -1) return i;
  return -1;
}
/** The session number, 1 to 8, from a number or text such as "الحصة 3"; 0 when it is not one. */
function period_(v) {
  var m = /\d+/.exec(digits_(v)), n = m ? +m[0] : 0;
  return n >= 1 && n <= PERIODS_PER_DAY ? n : 0;
}
function periodsMap_() { try { return JSON.parse(prop_('PERIODS') || '{}'); } catch (e) { return {}; } }
/** The start and end time of each of the eight sessions for a stage: what the admins set, or the starting example. */
function periods_(stage) {
  var saved = periodsMap_()[stage];
  return Array.isArray(saved) && saved.length === PERIODS_PER_DAY ? saved : DEFAULT_PERIODS;
}
function lessonOut_(r, u, lead) {
  var o = { id: r.id, stage: String(r.stage), klass: String(r.klass), weekday: +r.weekday, period: +r.period, subject: String(r.subject),
    teacherName: String(r.teacherName || ''), room: String(r.room || ''), mine: !!r.teacher && String(r.teacher).toLowerCase() === u.email };
  if (lead) o.teacher = String(r.teacher || '').toLowerCase();
  return o;
}
/** Checks one session and returns the row to store. pasted: the weekday is text from a pasted table. */
function lessonIn_(d, u, pasted) {
  var stage = String(d.stage || '');
  needStage_(u, stage);
  var rec = { id: String(d.id || ''), stage: stage, klass: text_(d.klass, 30), weekday: pasted ? weekday_(d.weekday) : Math.floor(Number(d.weekday)), period: period_(d.period),
    subject: text_(d.subject, 80), teacher: String(d.teacher || '').toLowerCase().trim(), teacherName: text_(d.teacherName, 80), room: text_(d.room, 40) };
  if (!rec.klass) throw fail_('INPUT', 'اكتب اسم الصف');
  if (!(rec.weekday >= 0 && rec.weekday < SCHOOL_DAYS)) throw fail_('INPUT', 'اليوم غير صحيح. أيام الجدول من الأحد إلى الخميس.');
  if (!rec.period) throw fail_('INPUT', 'رقم الحصة من 1 إلى ' + PERIODS_PER_DAY + '.');
  if (!rec.subject) throw fail_('INPUT', 'اكتب المادة');
  var users = users_(), inStage = function (x) { return x.active && stagesOf_(x).indexOf(stage) !== -1; };
  if (rec.teacher) {
    var who = users[rec.teacher];
    if (!who || !inStage(who)) throw fail_('INPUT', 'المعلم ليس من منسوبي هذه المرحلة');
    rec.teacherName = who.name;
  } else if (rec.teacherName) {
    // a typed name is linked to a member of staff when it matches exactly one
    var match = AP.namedIn(rec.teacherName, Object.keys(users).map(function (k) { return users[k]; }).filter(inStage));
    if (match.length === 1) rec.teacher = match[0].email;
  }
  rec.by = u.email; rec.at = nowIso_();
  return rec;
}
function sameSlot_(r, rec) { return r.id !== rec.id && +r.weekday === rec.weekday && +r.period === rec.period; }
/** A class has one session in each slot. Returns the session already there, if any. */
function taken_(rows, rec) { return rows.filter(function (r) { return sameSlot_(r, rec) && String(r.stage) === rec.stage && String(r.klass) === rec.klass; })[0] || null; }
/** The same teacher in two classes in one slot: a warning, not a refusal. */
function clashes_(rows, rec) {
  if (!rec.teacher) return [];
  return rows.filter(function (r) { return sameSlot_(r, rec) && String(r.teacher).toLowerCase() === rec.teacher; })
    .map(function (r) { return 'للمعلم ' + rec.teacherName + ' حصة أخرى في هذا الوقت: ' + r.klass + ' · ' + r.subject; }).slice(0, 3);
}
function writeLessons_(rows) {
  var sh = SpreadsheetApp.getActive().getSheetByName(SH.TIMETABLE), last = sh.getLastRow();
  if (last > 1) sh.getRange(2, 1, last - 1, LESSON_COLS.length).clearContent();
  if (rows.length) sh.getRange(2, 1, rows.length, LESSON_COLS.length).setValues(rows.map(function (r) { return LESSON_COLS.map(function (c) { return r[c]; }); }));
}

/** The school's sessions schedule for the caller's stages, with the session times. Staff get teachers' names, not their addresses. */
function api_timetable() {
  var u = me_(), stages = stagesOf_(u), lead = isLeader_(u), times = {};
  stages.forEach(function (st) { times[st] = periods_(st); });
  return JSON.stringify({ days: SCHOOL_DAYS, perDay: PERIODS_PER_DAY, periods: times,
    lessons: readTable_(SH.TIMETABLE, LESSON_COLS).filter(function (r) { return stages.indexOf(String(r.stage)) !== -1; }).map(function (r) { return lessonOut_(r, u, lead); }) });
}

/**
 * Sets the start and end time of the eight sessions, for one stage or several. Admins only, for their own stages.
 * Sessions are stored by number, so the whole schedule follows the new times at once.
 */
function api_savePeriods(json) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'lesson', 200, 300);
  var d = JSON.parse(json), stages = (Array.isArray(d.stages) ? d.stages : [d.stage]).map(String), list = Array.isArray(d.periods) ? d.periods : [], clean = [];
  if (!stages.length || !stages[0]) throw fail_('INPUT', 'اختر المرحلة');
  stages.forEach(function (st) { needStage_(u, st); });
  if (list.length !== PERIODS_PER_DAY) throw fail_('INPUT', 'عدد الحصص في اليوم ' + PERIODS_PER_DAY + '.');
  list.forEach(function (x, i) {
    var a = clock_((x || [])[0]), b = clock_((x || [])[1]);
    if (!a || !b || b <= a) throw fail_('INPUT', 'وقت الحصة ' + (i + 1) + ' غير صحيح: النهاية بعد البداية.');
    if (i && a < clean[i - 1][1]) throw fail_('INPUT', 'الحصة ' + (i + 1) + ' تبدأ قبل نهاية الحصة ' + i + '.');
    clean.push([a, b]);
  });
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var map = periodsMap_(), before = {};
    stages.forEach(function (st) { before[st] = periods_(st); map[st] = clean; });
    PropertiesService.getScriptProperties().setProperty('PERIODS', JSON.stringify(map));
    audit_(u, 'session-times', stages.join('، '), { first: clean[0][0], last: clean[PERIODS_PER_DAY - 1][1] });
    var now = {};
    stages.forEach(function (st) { now[st] = clean; });
    return JSON.stringify({ periods: now, before: before });
  } finally { lock.releaseLock(); }
}

function api_saveLesson(json) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'lesson', 200, 300);
  var rec = lessonIn_(JSON.parse(json), u, false);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var rows = readTable_(SH.TIMETABLE, LESSON_COLS), sh = SpreadsheetApp.getActive().getSheetByName(SH.TIMETABLE), old = rec.id ? rows.filter(function (r) { return r.id === rec.id; })[0] : null;
    if (rec.id && !old) throw fail_('GONE', 'الحصة غير موجودة');
    if (old) needStage_(u, String(old.stage));
    var there = taken_(rows, rec);
    if (there) throw fail_('STATE', 'للصف ' + rec.klass + ' حصة في هذا الموعد: ' + there.subject + '. عدّلها أو احذفها أولاً.');
    if (!old && rows.length >= 4000) throw fail_('STATE', 'بلغ الجدول الحد الأقصى من الحصص.');
    if (!old) rec.id = Utilities.getUuid();
    var line = LESSON_COLS.map(function (c) { return rec[c]; });
    if (old) sh.getRange(old._row, 1, 1, line.length).setValues([line]); else sh.appendRow(line);
    return JSON.stringify({ lesson: lessonOut_(rec, u, true), warnings: clashes_(rows, rec) });
  } finally { lock.releaseLock(); }
}

function api_deleteLesson(id) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'lesson', 200, 300);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var r = readTable_(SH.TIMETABLE, LESSON_COLS).filter(function (x) { return x.id === String(id); })[0];
    if (!r) throw fail_('GONE', 'الحصة غير موجودة');
    needStage_(u, String(r.stage));
    SpreadsheetApp.getActive().getSheetByName(SH.TIMETABLE).deleteRow(r._row);
    return '';
  } finally { lock.releaseLock(); }
}

/**
 * Adds many sessions at once from a pasted table. Each row: class, day, session number, subject, teacher, room.
 * It is all or nothing: if any row is wrong, or lands on a slot the class already has, nothing is added and those rows are listed by line.
 */
function api_importLessons(json) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'import', 20, 300);
  var d = JSON.parse(json), stage = String(d.stage || ''), lines = Array.isArray(d.rows) ? d.rows : [], good = [], errors = [];
  needStage_(u, stage);
  if (lines.length > 600) throw fail_('INPUT', 'الصق 600 صف على الأكثر في المرة الواحدة.');
  var rows = readTable_(SH.TIMETABLE, LESSON_COLS);
  lines.forEach(function (cells, i) {
    cells = Array.isArray(cells) ? cells.map(function (x) { return String(x === null || x === undefined ? '' : x).trim(); }) : [];
    if (!cells.some(String)) return;                                               // an empty line
    if (!good.length && !errors.length && weekday_(cells[1]) === -1 && !period_(cells[2])) return;   // a heading line
    try {
      var rec = lessonIn_({ stage: stage, klass: cells[0], weekday: cells[1], period: cells[2], subject: cells[3], teacherName: cells[4], room: cells[5] }, u, true);
      rec.id = Utilities.getUuid();
      var there = taken_(rows.concat(good), rec);
      if (there) throw fail_('STATE', 'للصف ' + rec.klass + ' حصة في هذا الموعد: ' + there.subject);
      good.push(rec);
    } catch (e) { errors.push({ line: i + 1, message: String(e.message).split('|').pop() }); }
  });
  if (errors.length) return JSON.stringify({ ok: false, errors: errors.slice(0, 20), wrong: errors.length });
  if (!good.length) throw fail_('INPUT', 'لا توجد صفوف في الجدول الملصق.');
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var sh = SpreadsheetApp.getActive().getSheetByName(SH.TIMETABLE), clashing = 0;
    if (rows.length + good.length > 4000) throw fail_('STATE', 'بلغ الجدول الحد الأقصى من الحصص.');
    good.forEach(function (rec, i) { if (clashes_(rows.concat(good.slice(0, i)), rec).length) clashing++; });
    sh.getRange(sh.getLastRow() + 1, 1, good.length, LESSON_COLS.length).setValues(good.map(function (r) { return LESSON_COLS.map(function (c) { return r[c]; }); }));
    var undoId = Utilities.getUuid();
    CacheService.getScriptCache().put('undoT:' + undoId, JSON.stringify({ ids: good.map(function (r) { return r.id; }), by: u.email }), 21600);
    audit_(u, 'timetable-import', stage, { sessions: good.length, clashing: clashing });
    return JSON.stringify({ ok: true, added: good.length, clashing: clashing, undoId: undoId, lessons: good.map(function (r) { return lessonOut_(r, u, true); }) });
  } finally { lock.releaseLock(); }
}

/** Undo for the caller's own paste: removes exactly the sessions it added. Works for six hours and only once. */
function api_undoImport(undoId) {
  var u = me_();
  needAdmin_(u);
  var cache = CacheService.getScriptCache(), k = 'undoT:' + String(undoId || '').replace(/[^\w-]/g, '').slice(0, 60), raw = cache.get(k), rec = null;
  try { rec = raw ? JSON.parse(raw) : null; } catch (e) { rec = null; }
  if (!rec || rec.by !== u.email) throw fail_('GONE', 'انتهت مهلة التراجع عن هذا الاستيراد.');
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var gone = {};
    rec.ids.forEach(function (id) { gone[id] = true; });
    writeLessons_(readTable_(SH.TIMETABLE, LESSON_COLS).filter(function (r) { return !gone[r.id]; }));
    cache.remove(k);
    return JSON.stringify({ ids: rec.ids });
  } finally { lock.releaseLock(); }
}

/** Removes every session of one class, and returns them so the step can be undone. */
function api_clearClass(stage, klass) {
  var u = me_();
  needAdmin_(u);
  stage = String(stage || ''); klass = String(klass || '');
  needStage_(u, stage);
  rate_(u, 'import', 20, 300);
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var rows = readTable_(SH.TIMETABLE, LESSON_COLS), out = rows.filter(function (r) { return String(r.stage) === stage && String(r.klass) === klass; });
    if (!out.length) throw fail_('GONE', 'لا توجد حصص لهذا الصف.');
    writeLessons_(rows.filter(function (r) { return out.indexOf(r) === -1; }));
    audit_(u, 'timetable-cleared', stage + ' · ' + klass, { sessions: out.length });
    return JSON.stringify({ removed: out.map(function (r) { return lessonOut_(r, u, true); }) });
  } finally { lock.releaseLock(); }
}

/* ---------- the schedule builder ---------- */
/*
 * The builder itself runs in the admin's page. The server keeps each stage's setup (classes, weekly sessions, teachers, instructions),
 * and puts a built schedule into the school's schedule after checking every session of it again.
 */
var PLANNER_COLS = ['stage', 'kind', 'part', 'data', 'by', 'at'];
var BUILD_RULES = ['off', 'window', 'maxDay', 'subjectDay', 'fixed', 'together', 'streak'];
function plain_(v, max) { return String(v === null || v === undefined ? '' : v).replace(/[\u0000-\u001F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max); }
function int_(v, lo, hi, def) { var n = Math.floor(Number(v)); return isNaN(n) ? def : Math.max(lo, Math.min(hi, n)); }
/** Active staff of one stage, by address. */
function staffOf_(stage) {
  var users = users_(), out = {};
  Object.keys(users).forEach(function (k) { if (users[k].active && stagesOf_(users[k]).indexOf(stage) !== -1) out[k] = users[k]; });
  return out;
}
/** One kind of stored record for a stage: its parts joined and read. null when there is none. */
function plannerRead_(rows, stage, kind) {
  var parts = rows.filter(function (r) { return String(r.stage) === stage && r.kind === kind; }).sort(function (a, b) { return +a.part - +b.part; });
  if (!parts.length) return null;
  try { return { data: JSON.parse(parts.map(function (r) { return String(r.data).slice(1); }).join('')), by: String(parts[0].by), at: String(parts[0].at) }; } catch (e) { return null; }
}
/** Replaces one kind of stored record for a stage; null removes it. Long text is split over rows, and each part starts with # so a cell is never read as a formula. */
function plannerWrite_(stage, kind, data, u, at) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(SH.PLANNER) || ensureSheet_(ss, SH.PLANNER, PLANNER_COLS);
  var old = readTable_(SH.PLANNER, PLANNER_COLS).filter(function (r) { return String(r.stage) === stage && r.kind === kind; }).map(function (r) { return r._row; });
  var text = data === null ? '' : JSON.stringify(data), out = [];
  for (var i = 0, part = 0; i < text.length; i += 40000, part++) out.push([stage, kind, String(part), '#' + text.slice(i, i + 40000), u.email, at]);
  // a record that keeps its number of rows is written over itself, so a save touches nothing else in the tab
  if (out.length === old.length) { out.forEach(function (row, n) { sh.getRange(old[n], 1, 1, PLANNER_COLS.length).setValues([row]); }); return; }
  old.sort(function (a, b) { return b - a; }).forEach(function (n) { sh.deleteRow(n); });
  if (out.length) sh.getRange(sh.getLastRow() + 1, 1, out.length, PLANNER_COLS.length).setValues(out);
}
/** Checks a setup sent by the page and returns the clean copy that is stored. Anything that names a class, subject or teacher that is not in it is dropped. */
function plannerIn_(d, stage) {
  d = d || {};
  var staff = staffOf_(stage), seen = {}, out = { dayLen: [], classes: [], subjects: [], teachers: [], loads: [], rules: [] }, list = function (v) { return Array.isArray(v) ? v : []; }, i;
  for (i = 0; i < SCHOOL_DAYS; i++) out.dayLen.push(int_(list(d.dayLen)[i], 1, PERIODS_PER_DAY, PERIODS_PER_DAY));
  list(d.classes).forEach(function (k) { k = plain_(k, 30); if (k && !seen['c' + k]) { seen['c' + k] = 1; out.classes.push(k); } });
  list(d.subjects).forEach(function (k) { k = plain_(k, 80); if (k && !seen['s' + k]) { seen['s' + k] = 1; out.subjects.push(k); } });
  if (out.classes.length > 60) throw fail_('INPUT', 'الحد الأقصى 60 صفاً في المرحلة.');
  if (out.subjects.length > 40) throw fail_('INPUT', 'الحد الأقصى 40 مادة.');
  list(d.teachers).forEach(function (t) {
    t = t || {};
    var id = String(t.id || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 12), email = String(t.email || '').toLowerCase().trim(), name = plain_(t.name, 80);
    if (email && !staff[email]) email = '';
    if (email) name = staff[email].name;
    if (!id || !name || seen['t' + id]) return;
    seen['t' + id] = 1;
    out.teachers.push({ id: id, name: name, email: email, quota: int_(t.quota, 0, 40, 24), maxDay: int_(t.maxDay, 0, PERIODS_PER_DAY, 0),
      subjects: list(t.subjects).map(function (x) { return plain_(x, 80); }).filter(function (x, n, all) { return seen['s' + x] && all.indexOf(x) === n; }) });
  });
  if (out.teachers.length > 150) throw fail_('INPUT', 'الحد الأقصى 150 معلماً في المرحلة.');
  list(d.loads).forEach(function (l) {
    l = l || {};
    var k = plain_(l.klass, 30), s = plain_(l.subject, 80), n = int_(l.count, 0, 40, 0), t = String(l.teacher || '');
    if (!n || !seen['c' + k] || !seen['s' + s] || seen['l' + k + '\u0001' + s]) return;
    seen['l' + k + '\u0001' + s] = 1;
    out.loads.push({ klass: k, subject: s, count: n, teacher: seen['t' + t] ? t : '' });
  });
  list(d.rules).slice(0, 100).forEach(function (r) {
    r = r || {};
    var type = String(r.type || ''), id = String(r.id || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 12), t = String(r.teacher || ''), s = plain_(r.subject, 80), k = plain_(r.klass, 30);
    if (BUILD_RULES.indexOf(type) === -1 || !id || seen['r' + id] || (t && !seen['t' + t]) || (k && !seen['c' + k])) return;
    var o = { id: id, type: type, must: true }, from = int_(r.from, 1, PERIODS_PER_DAY, 1), to = int_(r.to, 1, PERIODS_PER_DAY, PERIODS_PER_DAY);
    if (type === 'off') {
      if (!t) return;
      o.teacher = t; o.must = r.must !== false; o.from = Math.min(from, to); o.to = Math.max(from, to);
      o.days = list(r.days).map(function (x) { return int_(x, -1, 9, -1); }).filter(function (x, n, all) { return x >= 0 && x < SCHOOL_DAYS && all.indexOf(x) === n; }).sort();
    } else if (type === 'window') {
      if (!seen['s' + s]) return;
      o.subject = s; o.klass = k; o.must = r.must !== false; o.from = Math.min(from, to); o.to = Math.max(from, to);
    } else if (type === 'maxDay') { o.teacher = t; o.n = int_(r.n, 1, PERIODS_PER_DAY, 6);
    } else if (type === 'streak') { o.teacher = t; o.n = int_(r.n, 1, PERIODS_PER_DAY, 4); o.must = r.must !== false;
    } else if (type === 'subjectDay') { if (!seen['s' + s]) return; o.subject = s; o.n = int_(r.n, 1, PERIODS_PER_DAY, 2);
    } else if (type === 'together') { if (!seen['s' + s]) return; o.subject = s; o.n = int_(r.n, 1, 60, 1);
    } else { o.klass = k; o.day = int_(r.day, 0, SCHOOL_DAYS - 1, 0); o.period = int_(r.period, 1, PERIODS_PER_DAY, 1); o.label = plain_(r.label, 40); }
    seen['r' + id] = 1;
    out.rules.push(o);
  });
  return out;
}

/** The builder's saved setup for each of the caller's stages. Admins only. */
function api_planner() {
  var u = me_();
  needAdmin_(u);
  var rows = readTable_(SH.PLANNER, PLANNER_COLS), out = {};
  stagesOf_(u).forEach(function (st) { var x = plannerRead_(rows, st, 'setup'); if (x) out[st] = { setup: x.data, at: x.at, by: x.by }; });
  return JSON.stringify({ setups: out });
}

/** Saves a stage's setup. `base` is the version the page started from, so a setup another admin changed meanwhile is not overwritten. */
function api_savePlanner(json) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'planner', 400, 300);
  if (String(json).length > 400000) throw fail_('INPUT', 'إعداد الجدول أكبر من المسموح.');
  var d = JSON.parse(json), stage = String(d.stage || '');
  needStage_(u, stage);
  var setup = plannerIn_(d.setup, stage), lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var now = plannerRead_(readTable_(SH.PLANNER, PLANNER_COLS), stage, 'setup');
    if (now && String(d.base || '') !== now.at) throw fail_('STATE', 'غيّر مدير آخر إعداد الجدول قبل قليل. حدّث الصفحة لترى آخر نسخة ثم أعد تعديلك.');
    var at = nowIso_();
    if (now && at <= now.at) at = new Date(new Date(now.at).getTime() + 1).toISOString();
    plannerWrite_(stage, 'setup', setup, u, at);
    return JSON.stringify({ setup: setup, at: at });
  } finally { lock.releaseLock(); }
}

function lessonCopy_(r) { var o = {}; LESSON_COLS.forEach(function (c) { o[c] = r[c]; }); return o; }
function slotKey_(r) { return String(r.stage) + '\u0001' + String(r.klass) + '\u0001' + (+r.weekday) + '\u0001' + (+r.period); }

/**
 * Puts a built schedule into the school's schedule. The sessions of the classes it names are replaced; other classes are untouched.
 * Every session is checked again here, and it is all or nothing. What was replaced is kept so the admin can undo the step.
 */
function api_applySchedule(json) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'import', 20, 300);
  if (String(json).length > 900000) throw fail_('INPUT', 'الجدول المبني أكبر من المسموح.');
  var d = JSON.parse(json), stage = String(d.stage || ''), list = Array.isArray(d.lessons) ? d.lessons : [], classes = {}, taken = {}, good = [], at = nowIso_();
  needStage_(u, stage);
  if (!list.length) throw fail_('INPUT', 'لا توجد حصص في الجدول المبني.');
  if (list.length > 2400) throw fail_('INPUT', 'الجدول المبني أكبر من المسموح.');
  var staff = staffOf_(stage);
  (Array.isArray(d.classes) ? d.classes : []).forEach(function (k) { k = text_(k, 30); if (k) classes[k] = true; });
  list.forEach(function (x, i) {
    x = x || {};
    var rec = { id: Utilities.getUuid(), stage: stage, klass: text_(x.klass, 30), weekday: Math.floor(Number(x.weekday)), period: period_(x.period), subject: text_(x.subject, 80),
      teacher: String(x.teacher || '').toLowerCase().trim(), teacherName: text_(x.teacherName, 80), room: text_(x.room, 40), by: u.email, at: at };
    if (!rec.klass || !rec.subject || !rec.period || !(rec.weekday >= 0 && rec.weekday < SCHOOL_DAYS)) throw fail_('INPUT', 'في الجدول المبني حصة غير صحيحة (رقم ' + (i + 1) + '). لم يُعتمد شيء.');
    if (rec.teacher) {
      if (!staff[rec.teacher]) throw fail_('INPUT', 'في الجدول المبني معلم ليس من منسوبي هذه المرحلة. لم يُعتمد شيء.');
      rec.teacherName = staff[rec.teacher].name;
    }
    if (taken[slotKey_(rec)]) throw fail_('INPUT', 'في الجدول المبني حصتان للصف ' + rec.klass + ' في موعد واحد. لم يُعتمد شيء.');
    taken[slotKey_(rec)] = true; classes[rec.klass] = true;
    good.push(rec);
  });
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var keep = [], gone = [], busy = {}, clashing = 0;
    readTable_(SH.TIMETABLE, LESSON_COLS).forEach(function (r) { if (String(r.stage) === stage && classes[String(r.klass)]) gone.push(r); else keep.push(r); });
    if (keep.length + good.length > 4000) throw fail_('STATE', 'بلغ الجدول الحد الأقصى من الحصص.');
    var who = function (r) { return String(r.teacher).toLowerCase() + '\u0001' + (+r.weekday) + '\u0001' + (+r.period); };
    keep.forEach(function (r) { if (r.teacher) busy[who(r)] = true; });
    good.forEach(function (r) { if (!r.teacher) return; if (busy[who(r)]) clashing++; busy[who(r)] = true; });
    writeLessons_(keep.concat(good));
    var undoId = Utilities.getUuid();
    plannerWrite_(stage, 'backup', { id: undoId, by: u.email, added: good.map(function (r) { return r.id; }), removed: gone.map(lessonCopy_) }, u, at);
    audit_(u, 'schedule-applied', stage, { classes: Object.keys(classes).length, sessions: good.length, replaced: gone.length, clashing: clashing });
    return JSON.stringify({ ok: true, added: good.length, removed: gone.length, classes: Object.keys(classes).length, clashing: clashing, undoId: undoId });
  } finally { lock.releaseLock(); }
}

/** Undo for the caller's own last apply on a stage: takes out what it added and puts back what it replaced, where the class is still free. */
function api_undoApply(stage, undoId) {
  var u = me_();
  needAdmin_(u);
  stage = String(stage || '');
  needStage_(u, stage);
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var rec = plannerRead_(readTable_(SH.PLANNER, PLANNER_COLS), stage, 'backup');
    if (!rec || rec.data.id !== String(undoId) || rec.data.by !== u.email) throw fail_('GONE', 'لا يمكن التراجع عن هذا الاعتماد: اعتُمد بعده جدول آخر.');
    var added = {}, taken = {};
    rec.data.added.forEach(function (id) { added[id] = true; });
    var rows = readTable_(SH.TIMETABLE, LESSON_COLS).filter(function (r) { return !added[r.id]; });
    rows.forEach(function (r) { taken[slotKey_(r)] = true; });
    var back = rec.data.removed.filter(function (r) { if (taken[slotKey_(r)]) return false; taken[slotKey_(r)] = true; return true; });
    writeLessons_(rows.concat(back));
    plannerWrite_(stage, 'backup', null, u, nowIso_());
    audit_(u, 'schedule-undone', stage, { restored: back.length });
    return JSON.stringify({ restored: back.length });
  } finally { lock.releaseLock(); }
}

/* ---------- employees from a file, and tables from Google Sheets ---------- */

/** A mobile number as digits in international form. Saudi numbers written locally (05xxxxxxxx, or 5xxxxxxxx after Excel dropped the zero) get 966. */
function phoneIn_(v) {
  var s = String(v === null || v === undefined ? '' : v).replace(/[٠-٩]/g, function (d) { return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); }).replace(/\.0+$/, '').replace(/\D/g, '');
  if (/^00/.test(s)) s = s.slice(2);
  if (/^05\d{8}$/.test(s)) s = '966' + s.slice(1); else if (/^5\d{8}$/.test(s)) s = '966' + s;
  return s;
}
function userRow_(x) { return [x.email, x.name, x.role, x.stages.join(', '), x.active, (x.aliases || []).join(', '), x.phone, x.channel, x.major || '', x.position || '']; }

/**
 * Adds or updates many employees at once from rows read out of a file: name, school email, WhatsApp number, major, position, and optionally stages.
 * dryRun: checks every row and says what would happen, changing nothing. Otherwise the rows that pass are saved and the others are reported.
 * A new employee starts as a teacher: the file never gives anyone admin rights. An existing account keeps its role, and its stages are only added to.
 */
function api_importUsers(json) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'import', 40, 300);
  if (String(json).length > 400000) throw fail_('INPUT', 'الملف أكبر من المسموح.');
  var d = JSON.parse(json), list = Array.isArray(d.rows) ? d.rows : [], domain = prop_('DOMAIN'), may = u.role === 'owner' ? AP.STAGES : stagesOf_(u), names = {};
  if (!list.length) throw fail_('INPUT', 'لا توجد صفوف في الملف.');
  if (list.length > 500) throw fail_('INPUT', 'استورد 500 موظف على الأكثر في المرة الواحدة.');
  AP.STAGES.forEach(function (st) { names[AP.norm(st)] = st; });
  var stagesIn = function (v) { return (Array.isArray(v) ? v : String(v || '').split(/[,،;\n]/)).map(function (x) { return names[AP.norm(x)] || String(x || '').trim(); }).filter(String); };
  var base = stagesIn(d.stages), lock = d.dryRun ? null : LockService.getScriptLock();
  if (lock) lock.waitLock(25000);
  try {
    var map = users_(), seen = {}, out = [], adds = [], updates = [], counts = { added: 0, updated: 0, same: 0, error: 0 };
    list.forEach(function (r, i) {
      r = r || {};
      var line = int_(r.line, 1, 100000, i + 1), email = String(r.email || '').toLowerCase().trim(), name = text_(r.name, 80), res = { line: line, email: email, name: name, status: 'error', message: '' };
      out.push(res);
      try {
        if (!email) throw fail_('INPUT', 'لا يوجد بريد مدرسي في هذا الصف.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || (domain && email.split('@')[1] !== domain)) throw fail_('INPUT', 'البريد يجب أن يكون على نطاق المدرسة ' + domain);
        if (seen[email]) throw fail_('INPUT', 'البريد مكرر في الملف (السطر ' + seen[email] + ').');
        seen[email] = line;
        var phone = phoneIn_(r.phone), old = map[email], stages = stagesIn(r.stages);
        if (phone && !/^\d{8,15}$/.test(phone)) throw fail_('INPUT', 'رقم الواتساب غير صحيح: ' + String(r.phone).slice(0, 20));
        if (!stages.length) stages = base;
        stages.forEach(function (st) { if (may.indexOf(st) === -1) throw fail_('INPUT', AP.STAGES.indexOf(st) === -1 ? 'مرحلة غير معروفة: ' + String(st).slice(0, 40) : 'المرحلة خارج صلاحيتك: ' + st); });
        if (!old) {
          if (!name) throw fail_('INPUT', 'لا يوجد اسم في هذا الصف.');
          if (!stages.length) throw fail_('INPUT', 'اختر المرحلة لهذا الموظف.');
          adds.push({ email: email, name: name, role: 'teacher', stages: stages, active: true, aliases: [], phone: phone, channel: phone ? 'both' : 'email', major: text_(r.major, 80), position: text_(r.position, 80) });
          res.status = 'new';
        } else {
          if (old.role === 'owner' && u.role !== 'owner') throw fail_('FORBIDDEN', 'حساب مالك النظام يعدّله مالك النظام فقط.');
          var next = { email: email, name: name || old.name, role: old.role, active: old.active, aliases: old.aliases, phone: phone || old.phone, channel: old.channel, major: text_(r.major, 80) || old.major, position: text_(r.position, 80) || old.position,
            stages: old.stages.indexOf('*') !== -1 ? old.stages : old.stages.concat(stages.filter(function (st) { return old.stages.indexOf(st) === -1; })) };
          if (JSON.stringify(userRow_(next)) === JSON.stringify(userRow_(old))) res.status = 'same';
          else { updates.push({ row: old._row, before: userRow_(old), next: next }); res.status = 'update'; }
        }
        res.name = name || (old ? old.name : '');
      } catch (e) { res.message = String(e.message).split('|').pop(); }
    });
    out.forEach(function (x) { counts[x.status === 'new' ? 'added' : x.status === 'update' ? 'updated' : x.status]++; });
    if (d.dryRun) return JSON.stringify({ rows: out, counts: counts });
    if (!adds.length && !updates.length) throw fail_('INPUT', counts.error ? 'لا يوجد صف صالح للاستيراد. راجع الملاحظات على الصفوف.' : 'كل الموظفين في الملف موجودون ببياناتهم نفسها.');
    if (Object.keys(map).length + adds.length > 3000) throw fail_('STATE', 'بلغ عدد المستخدمين الحد الأقصى.');
    var sh = SpreadsheetApp.getActive().getSheetByName(SH.USERS);
    updates.forEach(function (x) { sh.getRange(x.row, 1, 1, USER_COLS.length).setValues([userRow_(x.next)]); });
    if (adds.length) sh.getRange(sh.getLastRow() + 1, 1, adds.length, USER_COLS.length).setValues(adds.map(userRow_));
    CacheService.getScriptCache().remove('users');
    var undoId = Utilities.getUuid();
    plannerWrite_('*', 'usersUndo', { id: undoId, by: u.email, added: adds.map(function (x) { return x.email; }), before: updates.map(function (x) { return x.before; }) }, u, nowIso_());
    audit_(u, 'users-imported', '', { added: adds.length, updated: updates.length, skipped: counts.error });
    return JSON.stringify({ rows: out, counts: counts, undoId: undoId, users: JSON.parse(api_users()) });
  } finally { if (lock) lock.releaseLock(); }
}

/** Undo for the caller's own last import of employees: removes the accounts it added and puts back the ones it changed. */
function api_undoImportUsers(undoId) {
  var u = me_();
  needAdmin_(u);
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var rec = plannerRead_(readTable_(SH.PLANNER, PLANNER_COLS), '*', 'usersUndo');
    if (!rec || rec.data.id !== String(undoId) || rec.data.by !== u.email) throw fail_('GONE', 'لا يمكن التراجع عن هذا الاستيراد: تم بعده استيراد آخر.');
    var sh = SpreadsheetApp.getActive().getSheetByName(SH.USERS), map = users_(), gone = [];
    rec.data.before.forEach(function (row) { var now = map[String(row[0]).toLowerCase()]; if (now && !(now.role === 'owner' && row[2] !== 'owner')) sh.getRange(now._row, 1, 1, USER_COLS.length).setValues([row]); });
    rec.data.added.forEach(function (email) { var now = map[email]; if (now && now.role === 'teacher') gone.push(now._row); });   // an account promoted since is left alone
    gone.sort(function (a, b) { return b - a; }).forEach(function (n) { sh.deleteRow(n); });
    CacheService.getScriptCache().remove('users');
    plannerWrite_('*', 'usersUndo', null, u, nowIso_());
    audit_(u, 'users-import-undone', '', { removed: gone.length, restored: rec.data.before.length });
    return JSON.stringify({ removed: gone.length, restored: rec.data.before.length, users: JSON.parse(api_users()) });
  } finally { lock.releaseLock(); }
}

/**
 * Reads a table from a Google Sheets file by its link, so it can be imported like an uploaded file.
 * The file must be shared with the account that runs the platform, and with the admin who asks by name (an owner is exempt):
 * otherwise an admin could read any file that account can open. Hidden tabs, the main file and the control file are never read.
 */
function api_readSheet(url) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'import', 40, 300);
  var text = String(url || '').trim(), m = text.match(/\/d\/([-\w]{25,})/) || text.match(/^([-\w]{25,})$/), gid = (text.match(/[#&?]gid=(\d+)/) || [])[1];
  if (!m) throw fail_('INPUT', 'الصق رابط ملف Google Sheets كاملاً.');
  if (m[1] === prop_('MAIN_FILE_ID') || m[1] === SpreadsheetApp.getActive().getId()) throw fail_('FORBIDDEN', 'هذا الملف لا يُقرأ من هنا.');
  var ss, people = [];
  try { ss = SpreadsheetApp.openById(m[1]); }
  catch (e) { throw fail_('SETUP', 'لا يستطيع حساب المنصة فتح هذا الملف. شاركه (عرض) مع ' + Session.getEffectiveUser().getEmail() + ' ثم أعد المحاولة، أو ارفعه كملف Excel.'); }
  if (u.role !== 'owner') {
    try {
      people = ss.getEditors().concat(ss.getViewers()).map(function (x) { return String(x.getEmail()).toLowerCase(); });
      var owner = ss.getOwner();
      if (owner) people.push(String(owner.getEmail()).toLowerCase());
    } catch (e) { people = []; }
    if (people.indexOf(u.email) === -1) throw fail_('FORBIDDEN', 'هذا الملف غير مشارَك مع حسابك بالاسم. ارفعه كملف Excel، أو اطلب من صاحبه مشاركته معك.');
  }
  var tabs = ss.getSheets().filter(function (x) { return !x.isSheetHidden(); }), sh = tabs.filter(function (x) { return gid && String(x.getSheetId()) === gid; })[0] || tabs[0];
  if (!sh) throw fail_('GONE', 'لا يوجد تبويب ظاهر في هذا الملف.');
  var rows = sh.getDataRange().getDisplayValues().slice(0, 2000).map(function (r) { return r.slice(0, 40).map(function (c) { return String(c === null || c === undefined ? '' : c); }); });
  audit_(u, 'sheet-read', ss.getName(), { tab: sh.getName(), rows: rows.length });
  return JSON.stringify({ name: ss.getName(), tab: sh.getName(), rows: rows });
}

/* ---------- classroom visits ---------- */
/*
 * An admin visits a lesson, fills in the visit form of their own role, and the visit is kept under the teacher.
 * Three forms: the Principal's, the academic supervisor's (the Academic Vice Principal's account) and the Vice Principal's.
 * Each visit keeps a copy of the form as it was that day, so changing a form later never changes an old visit.
 */
var VISIT_COLS = ['id', 'stage', 'teacher', 'teacherName', 'date', 'klass', 'subject', 'period', 'kind', 'score', 'parts', 'shared', 'seenAt', 'by', 'byName', 'at', 'data'];
var VISIT_KINDS = ['principal', 'academic', 'vp'];
var VISIT_ROLE = { principal: 'principal', avp: 'academic', vp: 'vp' };
function canEditVisitForms_(u) { return u.role === 'owner' || u.role === 'principal'; }
function visitForms_() {
  var rows = readTable_(SH.PLANNER, PLANNER_COLS), out = {};
  VISIT_KINDS.forEach(function (k) { var x = plannerRead_(rows, '*', 'visitForm.' + k); out[k] = x ? x.data : AP.VISIT_FORMS[k]; });
  return out;
}
/** A form sent by the page, checked: a title, two to five levels (highest first), and domains with their items. */
function visitFormIn_(d, kind) {
  d = d || {};
  var title = plain_(d.title, 80), scale = (Array.isArray(d.scale) ? d.scale : []).map(function (x) { return plain_(x, 30); }).filter(String), sections = [], items = 0;
  if (!title) throw fail_('INPUT', 'اكتب عنوان الاستمارة');
  if (scale.length < 2 || scale.length > 5) throw fail_('INPUT', 'مقياس التقدير من مستويين إلى خمسة مستويات.');
  (Array.isArray(d.sections) ? d.sections : []).forEach(function (x) {
    x = x || {};
    var list = (Array.isArray(x.items) ? x.items : []).map(function (y) { return plain_(y, 240); }).filter(String);
    if (!list.length) return;
    sections.push({ title: plain_(x.title, 80) || 'بنود الاستمارة', items: list });
    items += list.length;
  });
  if (!items) throw fail_('INPUT', 'أضف بنداً واحداً على الأقل.');
  if (sections.length > 15 || items > 80) throw fail_('INPUT', 'الحد الأقصى 15 مجالاً و80 بنداً.');
  return { kind: kind, title: title, scale: scale, sections: sections };
}
/**
 * Checks the ratings against the form and works out the result. Each item is rated 1 (lowest) to the number of levels, or 0 for "does not apply".
 * The result is the share of the highest possible marks over the rated items, for the whole visit and for each domain.
 */
function visitScore_(form, answers) {
  var n = form.scale.length, sum = 0, cnt = 0, parts = [], clean = [], stale = fail_('INPUT', 'تغيّرت الاستمارة منذ فتحت الصفحة. حدّث الصفحة ثم أعد التقييم.');
  if (!Array.isArray(answers) || answers.length !== form.sections.length) throw stale;
  form.sections.forEach(function (sec, i) {
    var row = Array.isArray(answers[i]) ? answers[i] : [], ps = 0, pc = 0, out = [];
    if (row.length !== sec.items.length) throw stale;
    sec.items.forEach(function (_, j) {
      var raw = row[j], v = Math.floor(Number(raw));
      if (raw === null || raw === undefined || raw === '' || !(v >= 0 && v <= n)) throw fail_('INPUT', 'قيّم كل البنود، أو اختر «لا ينطبق» لما لا ينطبق.');
      out.push(v);
      if (v) { ps += v; pc++; }
    });
    clean.push(out); sum += ps; cnt += pc;
    parts.push([sec.title, pc ? Math.round(ps * 100 / (pc * n)) : null]);
  });
  if (!cnt) throw fail_('INPUT', 'قيّم بنداً واحداً على الأقل.');
  return { answers: clean, score: Math.round(sum * 100 / (cnt * n)), parts: parts };
}
function long_(v, max) { return String(v === null || v === undefined ? '' : v).replace(/[\u0000-\u0009\u000B-\u001F]/g, ' ').trim().slice(0, max); }
function visitData_(r) { try { return JSON.parse(String(r.data).slice(1)); } catch (e) { return { form: { title: '', scale: [], sections: [] }, answers: [] }; } }
/** A visit as the page receives it. The teacher never receives the visitor's address or private note. */
function visitOut_(r, u, lead, full) {
  var parts = [];
  try { parts = JSON.parse(String(r.parts || '[]')); } catch (e) { parts = []; }
  var o = { id: String(r.id), stage: String(r.stage), teacherName: String(r.teacherName), date: String(r.date), klass: String(r.klass), subject: String(r.subject), period: r.period === '' ? '' : +r.period,
    kind: String(r.kind), score: +r.score, parts: parts, shared: String(r.shared) === '1', seen: !!r.seenAt, byName: String(r.byName), mine: String(r.by).toLowerCase() === u.email };
  if (lead) o.teacher = String(r.teacher).toLowerCase();
  if (full) {
    var d = visitData_(r);
    o.form = d.form; o.answers = d.answers; o.strengths = d.strengths || ''; o.improve = d.improve || ''; o.recommend = d.recommend || '';
    if (lead) o.note = d.note || '';
  }
  return o;
}
/** Visits shared with this person that they have not yet confirmed reading. */
function visitsNew_(u) { return readTable_(SH.VISITS, VISIT_COLS).filter(function (r) { return String(r.teacher).toLowerCase() === u.email && String(r.shared) === '1' && !r.seenAt; }).length; }
function visitRow_(id) { return readTable_(SH.VISITS, VISIT_COLS).filter(function (r) { return String(r.id) === String(id); })[0] || null; }
function visitSheet_() { var ss = SpreadsheetApp.getActive(); return ss.getSheetByName(SH.VISITS) || ensureSheet_(ss, SH.VISITS, VISIT_COLS); }

/** Admins: the forms and every visit in their stages. A teacher: their own visits that were shared with them. */
function api_visits() {
  var u = me_(), lead = isLeader_(u), rows = readTable_(SH.VISITS, VISIT_COLS);
  if (!lead) return JSON.stringify({ lead: false, visits: rows.filter(function (r) { return String(r.teacher).toLowerCase() === u.email && String(r.shared) === '1'; }).map(function (r) { return visitOut_(r, u, false, false); }) });
  var stages = stagesOf_(u);
  return JSON.stringify({ lead: true, kind: VISIT_ROLE[u.role] || '', canEditForms: canEditVisitForms_(u), forms: visitForms_(),
    visits: rows.filter(function (r) { return stages.indexOf(String(r.stage)) !== -1; }).map(function (r) { return visitOut_(r, u, true, false); }) });
}

/** One visit in full: for an admin of its stage, or for its teacher once it is shared. */
function api_visit(id) {
  var u = me_(), lead = isLeader_(u), r = visitRow_(id);
  if (!r) throw fail_('GONE', 'الزيارة غير موجودة');
  if (lead) needStage_(u, String(r.stage));
  else if (String(r.teacher).toLowerCase() !== u.email || String(r.shared) !== '1') throw fail_('FORBIDDEN', 'هذه الزيارة ليست لك.');
  return JSON.stringify({ visit: visitOut_(r, u, lead, true) });
}

/**
 * Records a visit, or changes one the caller recorded. The form is the one kept on the server for the caller's role
 * (an owner chooses which); the page's own copy of a form is never trusted.
 */
function api_saveVisit(json) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'visit', 120, 300);
  if (String(json).length > 60000) throw fail_('INPUT', 'الزيارة أكبر من المسموح.');
  var d = JSON.parse(json), id = String(d.id || ''), lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var old = id ? visitRow_(id) : null, rec;
    if (id && !old) throw fail_('GONE', 'الزيارة غير موجودة');
    if (old && String(old.by).toLowerCase() !== u.email) throw fail_('FORBIDDEN', 'يعدّل الزيارة من سجّلها فقط.');
    var stage = old ? String(old.stage) : String(d.stage || '');
    needStage_(u, stage);
    var date = date_(d.date), period = d.period === '' || d.period === null || d.period === undefined ? '' : period_(d.period);
    if (!date) throw fail_('INPUT', 'اختر تاريخ الزيارة.');
    if (date > today_()) throw fail_('INPUT', 'تاريخ الزيارة لا يكون في المستقبل.');
    if (d.period && !period) throw fail_('INPUT', 'رقم الحصة من 1 إلى ' + PERIODS_PER_DAY + '.');
    if (old) rec = lessonCopyOf_(old, VISIT_COLS);
    else {
      var email = String(d.teacher || '').toLowerCase().trim(), who = staffOf_(stage)[email], kind = VISIT_ROLE[u.role] || (VISIT_KINDS.indexOf(d.kind) !== -1 ? d.kind : '');
      if (!who || email === u.email) throw fail_('INPUT', 'اختر المعلم من منسوبي المرحلة.');
      if (!kind) throw fail_('INPUT', 'اختر استمارة الزيارة.');
      rec = { id: Utilities.getUuid(), stage: stage, teacher: email, teacherName: who.name, kind: kind, seenAt: '', by: u.email, byName: u.name };
    }
    var form = old ? visitData_(old).form : visitForms_()[rec.kind], sc = visitScore_(form, d.answers);
    rec.date = date; rec.klass = text_(d.klass, 30); rec.subject = text_(d.subject, 80); rec.period = period; rec.score = sc.score; rec.parts = JSON.stringify(sc.parts);
    rec.shared = d.shared === false ? '' : '1'; rec.at = nowIso_();
    rec.data = '#' + JSON.stringify({ form: form, answers: sc.answers, strengths: long_(d.strengths, 1500), improve: long_(d.improve, 1500), recommend: long_(d.recommend, 1500), note: long_(d.note, 1500) });
    var sh = visitSheet_(), row = VISIT_COLS.map(function (c) { return rec[c]; });
    if (old) sh.getRange(old._row, 1, 1, VISIT_COLS.length).setValues([row]); else sh.appendRow(row);
    audit_(u, old ? 'visit-changed' : 'visit-recorded', rec.teacherName, { stage: stage, form: rec.kind, date: date });
    return JSON.stringify({ visit: visitOut_(rec, u, true, true) });
  } finally { lock.releaseLock(); }
}
function lessonCopyOf_(r, cols) { var o = {}; cols.forEach(function (c) { o[c] = r[c]; }); return o; }

/** Removes a visit: by the admin who recorded it, or the technical owner. Kept for six hours so the step can be undone. */
function api_deleteVisit(id) {
  var u = me_();
  needAdmin_(u);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var r = visitRow_(id);
    if (!r) throw fail_('GONE', 'الزيارة غير موجودة');
    needStage_(u, String(r.stage));
    if (String(r.by).toLowerCase() !== u.email && u.role !== 'owner') throw fail_('FORBIDDEN', 'يحذف الزيارة من سجّلها فقط.');
    var undoId = Utilities.getUuid();
    CacheService.getScriptCache().put('undoV:' + undoId, JSON.stringify({ by: u.email, row: lessonCopyOf_(r, VISIT_COLS) }), 21600);
    SpreadsheetApp.getActive().getSheetByName(SH.VISITS).deleteRow(r._row);
    audit_(u, 'visit-removed', String(r.teacherName), { stage: String(r.stage), form: String(r.kind), date: String(r.date) });
    return JSON.stringify({ undoId: undoId });
  } finally { lock.releaseLock(); }
}
/** Undo for the caller's own removal: puts the visit back exactly as it was. */
function api_undoVisit(undoId) {
  var u = me_();
  needAdmin_(u);
  var cache = CacheService.getScriptCache(), k = 'undoV:' + String(undoId || '').replace(/[^\w-]/g, '').slice(0, 60), raw = cache.get(k), rec = null;
  try { rec = raw ? JSON.parse(raw) : null; } catch (e) { rec = null; }
  if (!rec || rec.by !== u.email) throw fail_('GONE', 'انتهت مهلة التراجع عن حذف هذه الزيارة.');
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (!visitRow_(rec.row.id)) visitSheet_().appendRow(VISIT_COLS.map(function (c) { return rec.row[c]; }));
    cache.remove(k);
    return JSON.stringify({ visit: visitOut_(rec.row, u, true, false) });
  } finally { lock.releaseLock(); }
}
/** The teacher confirms they have read a visit that was shared with them. */
function api_seenVisit(id) {
  var u = me_(), lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var r = visitRow_(id);
    if (!r || String(r.teacher).toLowerCase() !== u.email || String(r.shared) !== '1') throw fail_('FORBIDDEN', 'هذه الزيارة ليست لك.');
    if (!r.seenAt) SpreadsheetApp.getActive().getSheetByName(SH.VISITS).getRange(r._row, VISIT_COLS.indexOf('seenAt') + 1).setValue(nowIso_());
    return JSON.stringify({ seen: true });
  } finally { lock.releaseLock(); }
}
/** Replaces one of the three visit forms. The Principal and the technical owner only. Earlier visits keep the form they were filled with. */
function api_saveVisitForm(json) {
  var u = me_();
  needAdmin_(u);
  if (!canEditVisitForms_(u)) throw fail_('FORBIDDEN', 'يعدّل استمارات الزيارة مدير المدرسة أو مالك النظام.');
  rate_(u, 'admin', 60, 300);
  if (String(json).length > 60000) throw fail_('INPUT', 'الاستمارة أكبر من المسموح.');
  var d = JSON.parse(json), kind = String(d.kind || '');
  if (VISIT_KINDS.indexOf(kind) === -1) throw fail_('INPUT', 'استمارة غير معروفة');
  var form = visitFormIn_(d.form, kind), lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    plannerWrite_('*', 'visitForm.' + kind, form, u, nowIso_());
    audit_(u, 'visit-form', kind, { domains: form.sections.length, levels: form.scale.length });
    return JSON.stringify({ forms: visitForms_() });
  } finally { lock.releaseLock(); }
}

/* ---------- weekly report for the admins ---------- */

function weeklyDay_() { var d = +prop_('WEEKLY_DAY'); return d >= 0 && d <= 6 ? d : 0; }
/** True on the chosen weekday, until this week's run has happened. The history is kept even when the email is switched off. */
function weeklyDue_() {
  var today = today_();
  return new Date(today + 'T00:00:00Z').getUTCDay() === weeklyDay_() && prop_('WEEKLY_LAST') !== today;
}

/** What the report needs beside the programmes: the staff, the chosen responsible people, and the reports waiting. */
function weeklyOpts_() {
  var map = users_();
  return { today: today_(), users: Object.keys(map).map(function (k) { return map[k]; }), assign: assignments_(),
    submissions: readTable_(SH.SUBS, SUB_COLS).map(function (r) { return { stage: r.stage, status: r.status }; }) };
}

/** One row per stage for today, so next week's report can say what changed. Written once per day. */
function recordHistory_(today) {
  var have = readTable_(SH.HISTORY, HISTORY_COLS).some(function (r) { return String(r.date).slice(0, 10) === today; });
  if (have) return;
  var programs = readSnapshot_().programs, rows = scope_().map(function (stage) {
    var c = AP.rules.counts(programs.filter(function (p) { return p.stage === stage; }), today);
    return [today, stage, c.done + c.active + c.soon + c.overdue + c.upcoming + c.undated].concat(STATES.map(function (k) { return c[k]; }));
  });
  if (rows.length) { var sh = SpreadsheetApp.getActive().getSheetByName(SH.HISTORY); sh.getRange(sh.getLastRow() + 1, 1, rows.length, HISTORY_COLS.length).setValues(rows); }
}

/** The totals of the given stages at the most recent record that is at least five days old; null when there is none. */
function previousCounts_(stages, today) {
  var limit = AP.shiftDay(today, -5), rows = readTable_(SH.HISTORY, HISTORY_COLS).filter(function (r) { return String(r.date).slice(0, 10) <= limit; }), last = '';
  rows.forEach(function (r) { var d = String(r.date).slice(0, 10); if (d > last) last = d; });
  if (!last) return null;
  var out = { date: last, total: 0 }, found = false;
  STATES.forEach(function (k) { out[k] = 0; });
  rows.forEach(function (r) {
    if (String(r.date).slice(0, 10) !== last || stages.indexOf(String(r.stage)) === -1) return;
    found = true; out.total += +r.total || 0;
    STATES.forEach(function (k) { out[k] += +r[k] || 0; });
  });
  return found ? out : null;
}

/** The weekly report for one admin: a summary of each school and each stage they cover. */
function weeklyData_(u) {
  var stages = stagesOf_(u), programs = readSnapshot_().programs, opts = weeklyOpts_(), today = opts.today;
  var out = { today: today, to: AP.shiftDay(today, 6), schools: {}, stages: {} };
  var make = function (list) {
    var sum = AP.weeklySummary(programs.filter(function (p) { return list.indexOf(p.stage) !== -1; }), opts);
    sum.stages = list; sum.prev = previousCounts_(list, today);
    return sum;
  };
  stages.forEach(function (st) { out.stages[st] = make([st]); });
  ['private', 'intl'].forEach(function (k) {
    var list = stages.filter(function (st) { return AP.rules.schoolOf(st) === k; });
    if (list.length) out.schools[k] = make(list);
  });
  return out;
}

function api_weekly() {
  var u = me_();
  needAdmin_(u);
  return JSON.stringify(weeklyData_(u));
}

var SCHOOL_AR = { private: 'مدارس الأندلس الأهلية', intl: 'مدارس الأندلس العالمية' };
var STATE_AR = { done: 'مكتمل', active: 'جارٍ', soon: 'يبدأ قريباً', overdue: 'متأخر', upcoming: 'قادم', undated: 'بلا تاريخ' };
var STATE_COLOUR = { done: '#28AD5E', active: '#1E78E1', soon: '#BE5A0A', overdue: '#941328', upcoming: '#9EA4C4', undated: '#CDD1E2' };

function deltaText_(sum) {
  if (!sum.prev) return '';
  var sign = function (n) { return (n > 0 ? '+' : '') + n; };
  return 'منذ ' + sum.prev.date + ': مكتمل ' + sign(sum.counts.done - sum.prev.done) + ' · متأخر ' + sign(sum.counts.overdue - sum.prev.overdue);
}

/** The report as an email: tables and solid colours only, so every mail app shows it the same way. */
function weeklyHtml_(u, data, site) {
  var td = 'padding:6px 8px;border-bottom:1px solid #e3e5f0;text-align:right;vertical-align:top;font-size:14px', out = [];
  out.push('<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;color:#14153A;max-width:680px">',
    '<h2 style="color:#2E2F75;margin:0 0 2px">' + esc_(appFull_()) + '</h2>',
    '<p style="margin:0 0 14px;color:#565B80">التقرير الأسبوعي · ' + esc_(data.today) + ' إلى ' + esc_(data.to) + ' · ' + esc_(u.name) + '</p>');
  Object.keys(data.schools).forEach(function (k) {
    var s = data.schools[k], c = s.counts;
    out.push('<h3 style="margin:22px 0 8px;font-size:18px;color:#2E2F75">' + esc_(SCHOOL_AR[k]) + '</h3>',
      '<p style="margin:0 0 8px;font-size:14px;color:#565B80">' + esc_(s.stages.join(' · ')) + '</p>',
      '<table role="presentation" style="border-collapse:separate;border-spacing:4px;width:100%"><tr>');
    [['total', 'البرامج', '#472D7B', s.total]].concat(['done', 'active', 'soon', 'overdue'].map(function (st) { return [st, STATE_AR[st], STATE_COLOUR[st], c[st]]; })).forEach(function (x) {
      out.push('<td style="background:' + x[2] + ';color:#ffffff;border-radius:8px;padding:10px 6px;text-align:center;width:20%"><div style="font-size:24px;font-weight:bold">' + x[3] + '</div><div style="font-size:13px">' + esc_(x[1]) + '</div></td>');
    });
    out.push('</tr></table>');
    if (s.total) {
      out.push('<table role="presentation" style="border-collapse:collapse;width:100%;height:12px;margin:6px 0"><tr>');
      STATES.forEach(function (st) { if (c[st]) out.push('<td style="background:' + STATE_COLOUR[st] + ';width:' + (c[st] * 100 / s.total).toFixed(1) + '%;height:12px;font-size:0;line-height:0">&nbsp;</td>'); });
      out.push('</tr></table>');
    }
    out.push('<p style="margin:4px 0 0;font-size:14px">نسبة الإنجاز <b>' + s.pct + '%</b>' + (s.prev ? ' · ' + esc_(deltaText_(s)) : '') + '</p>',
      '<p style="margin:4px 0 0;font-size:14px">تقارير بانتظار المراجعة: <b>' + s.pending + '</b> · برامج لا يتابعها أحد في المنصة: <b>' + s.free + '</b></p>');
    var list = function (title, rows, cells) {
      if (!rows.length) return;
      out.push('<h4 style="margin:16px 0 4px;font-size:15px">' + esc_(title) + '</h4><table style="border-collapse:collapse;width:100%">');
      rows.forEach(function (r) { out.push('<tr>' + cells(r).map(function (v, i) { return '<td style="' + td + (i ? '' : ';font-weight:bold') + '">' + esc_(v) + '</td>'; }).join('') + '</tr>'); });
      out.push('</table>');
    };
    list('أقدم البرامج المتأخرة (' + s.lateTotal + ')', s.late.slice(0, 8), function (r) { return [r.name, r.kpi, 'متأخر ' + r.days + ' يوماً', r.who || '—']; });
    list('يبدأ هذا الأسبوع (' + s.aheadTotal + ')', s.ahead.slice(0, 8), function (r) { return [r.name, r.kpi, r.from, r.who || '—']; });
    list('حسب المسؤول', s.people.slice(0, 10), function (r) { return [r.name, 'مسند ' + r.n, 'مكتمل ' + r.done, 'متأخر ' + r.overdue]; });
  });
  if (site) out.push('<p style="margin-top:20px"><a href="' + esc_(site) + '" style="background:#2E2F75;color:#ffffff;padding:9px 22px;border-radius:999px;text-decoration:none;font-weight:bold">فتح التقرير الكامل</a></p>');
  out.push('</div>');
  return out.join('');
}

function weeklyText_(u, data, site) {
  var lines = [appFull_(), 'التقرير الأسبوعي · ' + data.today + ' إلى ' + data.to, ''];
  Object.keys(data.schools).forEach(function (k) {
    var s = data.schools[k], c = s.counts;
    lines.push(SCHOOL_AR[k], 'البرامج ' + s.total + ' · مكتمل ' + c.done + ' (' + s.pct + '%) · جارٍ ' + c.active + ' · يبدأ قريباً ' + c.soon + ' · متأخر ' + c.overdue);
    if (s.prev) lines.push(deltaText_(s));
    lines.push('تقارير بانتظار المراجعة ' + s.pending + ' · لا يتابعها أحد ' + s.free, '');
  });
  if (site) lines.push(site);
  return lines.join('\n');
}

function mailWeekly_(u, site) {
  if (MailApp.getRemainingDailyQuota() < 1) throw new Error('quota');
  var data = weeklyData_(u);
  MailApp.sendEmail({ to: u.email, name: appFull_(), subject: 'التقرير الأسبوعي · ' + data.today, body: weeklyText_(u, data, site), htmlBody: weeklyHtml_(u, data, site) });
}

/** Once a week: keep this week's numbers, then email each admin the report for the stages they cover. */
function weeklyRun_(actor) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw fail_('BUSY', 'الإرسال يعمل الآن. أعد المحاولة بعد لحظات.');
  try {
    var p = PropertiesService.getScriptProperties(), today = today_();
    if (p.getProperty('WEEKLY_LAST') === today) return { sent: 0, skipped: true };
    recordHistory_(today);
    var sent = 0, failed = 0, map = users_(), site = prop_('SITE_URL');
    if (prop_('WEEKLY') !== 'off') {
      Object.keys(map).forEach(function (e) {
        var u = map[e];
        if (!u.active || u.channel === 'off' || NOTIFY_ADMINS.indexOf(u.role) === -1 || !stagesOf_(u).length) return;
        try { mailWeekly_(u, site); sent++; } catch (err) { failed++; }
      });
    }
    p.setProperty('WEEKLY_LAST', today);
    audit_(actor, 'weekly-report', today, { sent: sent, failed: failed, on: prop_('WEEKLY') !== 'off' });
    return { sent: sent, failed: failed };
  } finally { lock.releaseLock(); }
}

/** Sends the caller this week's report now, so an admin can see exactly what arrives. */
function api_sendMyWeekly() {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'testmail', 3, 600);
  mailWeekly_(u, prop_('SITE_URL'));
  audit_(u, 'weekly-report-test', u.email, '');
  return '';
}

/* ---------- evidence files: photos and PDFs kept in Google Drive ---------- */

var EVIDENCE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf' };
var EVIDENCE_MAX = 6 * 1024 * 1024;

/** One call to the Drive API with this script's own permission, which covers only files this script created. */
function drive_(method, url, payload, contentType) {
  var res = UrlFetchApp.fetch(url, { method: method, contentType: contentType || 'application/json', payload: payload,
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true });
  var code = res.getResponseCode();
  if (code === 404) throw fail_('GONE', 'مجلد الشواهد غير موجود.');
  if (code < 200 || code >= 300) throw fail_('SETUP', 'تعذر حفظ الملف في Google Drive. يعيد مالك النظام تشغيل «الإعداد الأولي» من ملف التحكم للموافقة على حفظ الشواهد.');
  return JSON.parse(res.getContentText() || '{}');
}
function driveFolder_(name, parent) {
  var meta = { name: name, mimeType: 'application/vnd.google-apps.folder' };
  if (parent) meta.parents = [parent];
  return drive_('post', 'https://www.googleapis.com/drive/v3/files?fields=id', JSON.stringify(meta)).id;
}
function evidenceMap_() { try { return JSON.parse(prop_('EVIDENCE_FOLDERS') || '{}'); } catch (e) { return {}; } }
/** The top folder for evidence, in the Drive of the account that installed the server. Created on first use. */
function evidenceRoot_() {
  var map = evidenceMap_();
  if (!map.root) { map = { root: driveFolder_(AP.APP_NAME + ' - شواهد') }; PropertiesService.getScriptProperties().setProperty('EVIDENCE_FOLDERS', JSON.stringify(map)); }
  return map.root;
}
/** The folder for one stage and indicator, created on first use: top folder / stage / indicator. */
function evidenceFolder_(stage, kpi) {
  var root = evidenceRoot_(), map = evidenceMap_(), p = PropertiesService.getScriptProperties();
  if (!map['s:' + stage]) { map['s:' + stage] = driveFolder_(stage, root); p.setProperty('EVIDENCE_FOLDERS', JSON.stringify(map)); }
  var id = 'k:' + stage + '|' + kpi;
  if (!map[id]) { map[id] = driveFolder_(kpi, map['s:' + stage]); p.setProperty('EVIDENCE_FOLDERS', JSON.stringify(map)); }
  return map[id];
}
function fileName_(s, max) { return String(s || '').replace(/[\\\/:*?"<>|\u0000-\u001F]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max); }
/** Checks that the bytes really are the kind of file they claim to be. */
function looksLike_(bytes, mime) {
  var at = function (i) { return (bytes[i] + 256) % 256; }, is = function (list, from) { return list.every(function (v, i) { return at((from || 0) + i) === v; }); };
  if (bytes.length < 12) return false;
  if (mime === 'image/jpeg') return is([0xFF, 0xD8, 0xFF]);
  if (mime === 'image/png') return is([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  if (mime === 'image/webp') return is([0x52, 0x49, 0x46, 0x46]) && is([0x57, 0x45, 0x42, 0x50], 8);
  if (mime === 'application/pdf') return is([0x25, 0x50, 0x44, 0x46, 0x2D]);
  return false;
}
function driveUpload_(name, mime, bytes, folder) {
  var boundary = 'ap' + Utilities.getUuid().replace(/-/g, '');
  var head = '--' + boundary + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify({ name: name, parents: [folder] }) + '\r\n--' + boundary + '\r\nContent-Type: ' + mime + '\r\n\r\n';
  var body = Utilities.newBlob(head).getBytes().concat(bytes).concat(Utilities.newBlob('\r\n--' + boundary + '--').getBytes());
  return drive_('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', body, 'multipart/related; boundary=' + boundary).id;
}

/**
 * Keeps a photo or PDF as evidence for a programme, or for a piece of work on an indicator, and returns its link.
 * The file goes to top folder / stage / indicator in the Drive of the account that installed the server.
 * School accounts that have the link can open the file; the folders themselves stay private.
 */
function api_uploadEvidence(json) {
  var u = me_();
  needWrite_(u);
  rate_(u, 'upload', 12, 600);
  var d = JSON.parse(json), mime = String(d.mime || ''), data = String(d.data || ''), stage, kpi, title;
  if (d.programKey) {
    var p = readSnapshot_().programs.filter(function (x) { return x.key === d.programKey; })[0];
    if (!p) throw fail_('GONE', 'البرنامج غير موجود في آخر مزامنة.');
    stage = p.stage; kpi = p.kpi; title = p.name;
  } else { stage = String(d.stage || ''); kpi = String(d.kpi || ''); title = 'عمل على المؤشر'; }
  needStage_(u, stage);
  if (!/^[A-Za-z]\.[A-Za-z]{1,4} \d{1,2}\.\d{1,2}$/.test(kpi)) throw fail_('INPUT', 'المؤشر غير صحيح');
  if (!EVIDENCE_TYPES[mime]) throw fail_('INPUT', 'يُقبل ملف صورة أو PDF فقط.');
  if (!data || data.length > Math.ceil(EVIDENCE_MAX * 4 / 3) + 4 || !/^[A-Za-z0-9+\/]+=*$/.test(data)) throw fail_('INPUT', 'الملف أكبر من المسموح (6 ميجابايت) أو غير صالح.');
  var bytes = Utilities.base64Decode(data);
  if (bytes.length > EVIDENCE_MAX || !looksLike_(bytes, mime)) throw fail_('INPUT', 'الملف ليس صورة أو PDF صالحاً.');
  var name = fileName_(today_() + ' ' + title + ' - ' + u.name, 110) + '.' + EVIDENCE_TYPES[mime], id;
  // The lock covers only the making of folders, so two people never create the same folder twice; the upload itself runs outside it.
  // If a folder was deleted in Drive, forget it and make it again: first the indicator's folder, then the stage's, then all of them.
  var forget = [
    function (m) { delete m['k:' + stage + '|' + kpi]; },
    function (m) { Object.keys(m).forEach(function (k) { if (k === 's:' + stage || k.indexOf('k:' + stage + '|') === 0) delete m[k]; }); },
    function (m) { Object.keys(m).forEach(function (k) { delete m[k]; }); }
  ];
  var folderFor = function (attempt) {
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      if (attempt) { var m = evidenceMap_(); forget[attempt - 1](m); PropertiesService.getScriptProperties().setProperty('EVIDENCE_FOLDERS', JSON.stringify(m)); }
      return evidenceFolder_(stage, kpi);
    } finally { lock.releaseLock(); }
  };
  for (var attempt = 0; !id; attempt++) {
    try { id = driveUpload_(name, mime, bytes, folderFor(attempt)); }
    catch (e) { if (String(e.message).indexOf('GONE|') !== 0 || attempt >= forget.length) throw e; }
  }
  var shared = true;
  try { drive_('post', 'https://www.googleapis.com/drive/v3/files/' + id + '/permissions', JSON.stringify({ type: 'domain', role: 'reader', domain: prop_('DOMAIN'), allowFileDiscovery: false })); }
  catch (e2) { shared = false; }
  audit_(u, 'evidence-uploaded', title, { file: id, stage: stage, kpi: kpi, bytes: bytes.length, sharedWithSchool: shared });
  return JSON.stringify({ url: 'https://drive.google.com/file/d/' + id + '/view', name: name, shared: shared,
    message: shared ? '' : 'حُفظ الملف، لكن تعذرت مشاركته مع حسابات المدرسة. يشاركه مالك النظام من Drive.' });
}

/* ---------- responsible people, chosen in the platform ---------- */

/**
 * Who is responsible for each programme, where an admin has chosen someone in the platform: programme key -> email.
 * Only people who are still active count; a choice of someone who has left is ignored until they are active again.
 */
function assignments_() {
  var users = users_(), map = {};
  readTable_(SH.ASSIGN, ASSIGN_COLS).forEach(function (r) {
    var e = String(r.email || '').toLowerCase(), who = users[e];
    if (r.key && who && who.active) map[String(r.key)] = e;
  });
  return map;
}

/** The choices as the page receives them. Staff see the name only; admins also get the address, which the staff list already gives them. */
function assignOut_(u, programs) {
  var map = assignments_(), users = users_(), lead = isLeader_(u), out = {};
  programs.forEach(function (p) {
    var e = map[p.key];
    if (!e) return;
    out[p.key] = lead ? { name: users[e].name, email: e, me: e === u.email } : { name: users[e].name, me: e === u.email };
  });
  return out;
}

/** Applies a list of {key, email}; an empty email removes the choice. Returns what each programme held before. Caller holds the lock. */
function setAssignments_(u, pairs) {
  var users = users_(), byKey = {};
  readSnapshot_().programs.forEach(function (p) { byKey[p.key] = p; });
  pairs.forEach(function (x) {
    var p = byKey[x.key];
    if (!p) throw fail_('GONE', 'برنامج غير موجود في آخر مزامنة. حدّث المزامنة ثم أعد المحاولة.');
    needStage_(u, p.stage);
    if (!x.email) return;
    var who = users[x.email];
    if (!who || !who.active) throw fail_('INPUT', 'المستخدم غير موجود أو موقوف.');
    if (who.role === 'follower') throw fail_('INPUT', 'حساب المتابعة للعرض فقط، ولا تُسند إليه البرامج.');
    if (stagesOf_(who).indexOf(p.stage) === -1) throw fail_('INPUT', 'هذا المستخدم ليس من منسوبي مرحلة البرنامج: ' + p.stage);
  });
  var cur = {}, order = [], before = [];
  readTable_(SH.ASSIGN, ASSIGN_COLS).forEach(function (r) { if (r.key && !cur[r.key]) { cur[r.key] = r; order.push(String(r.key)); } });
  pairs.forEach(function (x) {
    var p = byKey[x.key];
    before.push({ key: x.key, email: cur[x.key] ? String(cur[x.key].email).toLowerCase() : '' });
    if (!x.email) { delete cur[x.key]; return; }
    if (!cur[x.key]) order.push(x.key);
    cur[x.key] = { key: x.key, email: x.email, stage: p.stage, kpi: text_(p.kpi, 40), title: text_(p.name, 160), by: u.email, at: nowIso_() };
  });
  writeAssignments_(order.filter(function (k) { return cur[k]; }).map(function (k) { return cur[k]; }));
  return before;
}

function writeAssignments_(rows) {
  var sh = SpreadsheetApp.getActive().getSheetByName(SH.ASSIGN), last = sh.getLastRow();
  if (last > 1) sh.getRange(2, 1, last - 1, ASSIGN_COLS.length).clearContent();
  if (rows.length) sh.getRange(2, 1, rows.length, ASSIGN_COLS.length).setValues(rows.map(function (r) { return ASSIGN_COLS.map(function (c) { return r[c]; }); }));
}

function assignReply_(u, keys, undoId) {
  var mine = {}, wanted = {};
  keys.forEach(function (k) { wanted[k] = true; });
  var out = assignOut_(u, readSnapshot_().programs.filter(function (p) { return wanted[p.key]; }));
  keys.forEach(function (k) { mine[k] = out[k] || null; });
  return JSON.stringify({ assign: mine, undoId: undoId || '' });
}

/**
 * Makes one member of staff responsible for programmes, inside the platform only: nothing is written to the main file.
 * An empty email removes the choice. Admins only, within their own stages; the person must be active and belong to that stage.
 */
function api_assign(json) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'assign', 60, 300);
  var d = JSON.parse(json), email = String(d.email || '').toLowerCase().trim(), seen = {};
  var keys = (Array.isArray(d.keys) ? d.keys : []).map(String).filter(function (k) { if (seen[k]) return false; seen[k] = true; return true; });
  if (!keys.length || keys.length > 500) throw fail_('INPUT', 'اختر برنامجاً واحداً على الأقل، و500 على الأكثر.');
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var before = setAssignments_(u, keys.map(function (k) { return { key: k, email: email }; }));
    var undoId = Utilities.getUuid();
    CacheService.getScriptCache().put('undoA:' + undoId, JSON.stringify({ pairs: before, by: u.email }), 21600);
    audit_(u, email ? 'assigned' : 'assignment-removed', email || '', { programmes: keys.length });
    return assignReply_(u, keys, undoId);
  } finally { lock.releaseLock(); }
}

/** Undo for the caller's own assignment: every programme goes back to whoever it had before. Works for six hours and only once. */
function api_undoAssign(undoId) {
  var u = me_();
  needAdmin_(u);
  rate_(u, 'assign', 60, 300);
  var cache = CacheService.getScriptCache(), k = 'undoA:' + String(undoId || '').replace(/[^\w-]/g, '').slice(0, 60), raw = cache.get(k), rec = null;
  try { rec = raw ? JSON.parse(raw) : null; } catch (e) { rec = null; }
  if (!rec || rec.by !== u.email) throw fail_('GONE', 'انتهت مهلة التراجع عن هذا الإسناد.');
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    // someone who has left since cannot take programmes back: those return to having no chosen person
    var users = users_();
    rec.pairs.forEach(function (x) { if (x.email && !(users[x.email] && users[x.email].active)) x.email = ''; });
    setAssignments_(u, rec.pairs);
    cache.remove(k);
    audit_(u, 'assignment-undone', '', { programmes: rec.pairs.length });
    return assignReply_(u, rec.pairs.map(function (x) { return x.key; }), '');
  } finally { lock.releaseLock(); }
}

/**
 * After a sync, a programme whose date or week changed in the main file has a new key. Its responsible person follows it
 * when exactly one programme with the same stage, indicator and name is left without one. Returns how many followed.
 */
function relinkAssignments_(programs) {
  var rows = readTable_(SH.ASSIGN, ASSIGN_COLS);
  if (!rows.length) return 0;
  var live = {}, taken = {}, byName = {};
  programs.forEach(function (p) { live[p.key] = true; });
  rows.forEach(function (r) { if (live[r.key]) taken[r.key] = true; });
  programs.forEach(function (p) { if (!taken[p.key]) { var id = p.stage + '|' + p.kpi + '|' + AP.norm(p.name); (byName[id] = byName[id] || []).push(p); } });
  var moved = 0;
  rows.forEach(function (r) {
    if (live[r.key]) return;
    var list = byName[r.stage + '|' + r.kpi + '|' + AP.norm(String(r.title).replace(/^'/, ''))];
    if (!list || list.length !== 1 || taken[list[0].key]) return;
    r.key = list[0].key; taken[r.key] = true; moved++;
  });
  if (moved) writeAssignments_(rows);
  return moved;
}

if (typeof module !== 'undefined') module.exports = { SH: SH, SUB_COLS: SUB_COLS, USER_COLS: USER_COLS };
