// Permission levels: what each level may do, checked against the server with simulated Google services.
// Needs no school data: it reads the small invented main file in test/fixtures/mini-main.json.
// Usage: node test/roles.test.js
//
// The simulated services live at the top of server.test.js. This file reuses them as they are, by compiling
// that top part (everything before its first sync) together with the checks below.
const fs0 = require('fs'), path0 = require('path');
if (!global.__rolesChecks) {
  global.__rolesChecks = true;
  process.env.AP_FIXTURE = path0.join(__dirname, 'fixtures', 'mini-main.json');
  const mark = '// ==== checks ====';
  const mine = fs0.readFileSync(__filename, 'utf8');
  const services = fs0.readFileSync(path0.join(__dirname, 'server.test.js'), 'utf8').split('\nlet boot = ')[0];
  module._compile(services + '\n' + mine.slice(mine.lastIndexOf(mark)), __filename);
  return;
}
// ==== checks ====
const boot = JSON.parse(G('api_sync')());
const inEPI = boot.programs.filter(p => p.stage === EPI), inEPN = boot.programs.filter(p => p.stage === EPN);
ok(boot.programs.length === 18 && inEPI.length === 6 && inEPN.length === 6, 'the sample file gives 6 programmes per stage, in two indicators, got ' + boot.programs.length);

const save = u => G('api_saveUser')(JSON.stringify(u));
save({ email: 'follower@school.test', name: 'Follower', role: 'follower', stages: [EPI] });
save({ email: 'teacher@school.test', name: 'Teacher', role: 'teacher', stages: [EPI], aliases: ['Sample Teacher'] });
save({ email: 'vp@school.test', name: 'VP', role: 'vp', stages: [EPI, MBI] });
throws(() => save({ email: 'x@school.test', name: 'X', role: 'boss', stages: [EPI] }), 'INPUT', 'an unknown level is refused');

const F = fn => as('follower@school.test', fn), T = fn => as('teacher@school.test', fn), V = fn => as('vp@school.test', fn);
const viewOnly = e => /للمتابعة فقط/.test(String(e && e.message));
const refusedAsViewOnly = (fn, m) => { try { fn(); ok(false, m + ' (no error)'); } catch (e) { ok(String(e.message).startsWith('FORBIDDEN|') && viewOnly(e), m + ' (got ' + e.message + ')'); } };

// What a follower sees
const fb = F(() => JSON.parse(G('api_bootstrap')()));
ok(fb.me.role === 'follower', 'a follower signs in as a follower');
ok(fb.programs.length === 6 && fb.programs.every(p => p.stage === EPI), 'a follower sees the programmes of their own stages only');
ok(fb.indicators.every(i => i.stage === EPI), 'a follower sees the indicators of their own stages only');

// What a follower cannot change
props.set('PLAN_EDIT', 'on');
refusedAsViewOnly(() => F(() => G('api_submit')(JSON.stringify({ type: 'report', programKey: inEPI[0].key }))), 'a follower cannot send a report');
refusedAsViewOnly(() => F(() => G('api_submit')(JSON.stringify({ type: 'contribution', programKey: inEPI[0].key }))), 'a follower cannot add a contribution');
refusedAsViewOnly(() => F(() => G('api_withdraw')('any-id')), 'a follower cannot withdraw a report');
refusedAsViewOnly(() => F(() => G('api_planRequest')(JSON.stringify({ kind: 'add', stage: EPI }))), 'a follower cannot propose a programme, even while plan editing is open');
refusedAsViewOnly(() => F(() => G('api_uploadEvidence')(JSON.stringify({ programKey: inEPI[0].key, mime: 'image/png', data: 'AAAA' }))), 'a follower cannot upload evidence');
props.delete('PLAN_EDIT');

// A follower is not a leader and not an admin
['api_users', 'api_audit', 'api_weekly', 'api_notifications', 'api_sync'].forEach(fn =>
  throws(() => F(() => G(fn)()), 'FORBIDDEN', 'a follower cannot call ' + fn));
throws(() => F(() => G('api_review')('any-id', 'approved', '')), 'FORBIDDEN', 'a follower cannot review');
throws(() => F(() => G('api_updateExecution')(inEPI[0].key, JSON.stringify({ done: true }))), 'FORBIDDEN', 'a follower cannot edit execution data');
throws(() => F(() => G('api_saveUser')(JSON.stringify({ email: 'follower@school.test', name: 'F', role: 'principal', stages: ['*'] }))), 'FORBIDDEN', 'a follower cannot raise their own level');

// A follower cannot be given a programme
throws(() => G('api_assign')(JSON.stringify({ email: 'follower@school.test', keys: [inEPI[0].key] })), 'INPUT', 'a programme cannot be assigned to a follower');
const assigned = JSON.parse(G('api_assign')(JSON.stringify({ email: 'teacher@school.test', keys: [inEPI[0].key] })));
ok(!!assigned, 'the same programme can still be assigned to a teacher');

// The other levels are unchanged
let teacherBlocked = false;
try { T(() => G('api_submit')(JSON.stringify({ type: 'report', programKey: inEPI[0].key, done: true, note: 'done' }))); } catch (e) { teacherBlocked = viewOnly(e); }
ok(!teacherBlocked, 'a teacher is not treated as view-only');
throws(() => T(() => G('api_users')()), 'FORBIDDEN', 'a teacher is still not an admin');
ok(Array.isArray(JSON.parse(V(() => G('api_users')()))), 'a vice principal is still an admin');
throws(() => V(() => G('api_updateExecution')(inEPN[0].key, JSON.stringify({ done: true }))), 'FORBIDDEN', 'a leader is still limited to their own stages');
ok(Array.isArray(JSON.parse(G('api_users')())), 'the owner is still an admin');

// ---- Supervisor: leads their stages, is not a system admin ----
save({ email: 'supervisor@school.test', name: 'Supervisor', role: 'supervisor', stages: [EPI] });
const U = fn => as('supervisor@school.test', fn);
const sb = U(() => JSON.parse(G('api_bootstrap')()));
ok(sb.me.role === 'supervisor' && sb.programs.length === 6 && sb.programs.every(p => p.stage === EPI), 'a supervisor sees the programmes of their own stages only');
ok(sb.submissions.some(x => x.by === 'teacher@school.test'), "a supervisor sees the reports waiting in their stages");
const waitingId = sb.submissions.filter(x => x.status === 'pending')[0].id;
ok(JSON.parse(U(() => G('api_review')(waitingId, 'approved', ''))).submission.status === 'approved', 'a supervisor approves a report in their stage');
ok(!!JSON.parse(U(() => G('api_sync')())).me, 'a supervisor can refresh from the main file');
ok(JSON.parse(U(() => G('api_planOptions')(EPI, 'C.Br 1.9'))).direct === true, 'a supervisor adds to the plan directly, like a leader');
throws(() => U(() => G('api_planOptions')(EPN, 'C.Br 1.9')), 'FORBIDDEN', 'a supervisor cannot plan in another stage');
throws(() => U(() => G('api_updateExecution')(inEPN[0].key, JSON.stringify({ done: true }))), 'FORBIDDEN', 'a supervisor cannot edit execution data in another stage');
let execErr = '';
try { U(() => G('api_updateExecution')(inEPI[0].key, JSON.stringify({ done: true }))); } catch (e) { execErr = String(e.message); }
ok(!execErr.startsWith('FORBIDDEN|'), 'a supervisor is allowed to edit execution data in their stage (got ' + execErr + ')');

// What stays with the system admins
[['api_users'], ['api_audit'], ['api_weekly'], ['api_notifications'], ['api_planner'],
 ['api_saveSettings', JSON.stringify({ notifyTime: '07:00' })],
 ['api_saveUser', JSON.stringify({ email: 'supervisor@school.test', name: 'S', role: 'principal', stages: ['*'] })],
 ['api_assign', JSON.stringify({ email: 'teacher@school.test', keys: [inEPI[1].key] })],
 ['api_saveTask', JSON.stringify({ title: 'x', date: '2026-11-20' })],
 ['api_importUsers', JSON.stringify({ rows: [] })],
 ['api_saveVisit', JSON.stringify({ stage: EPI })]
].forEach(([fn, arg]) => throws(() => U(() => G(fn)(arg)), 'FORBIDDEN', 'a supervisor cannot call ' + fn));
const sv = JSON.parse(U(() => G('api_visits')()));
ok(sv.lead === false && sv.visits.length === 0, "a supervisor does not see teachers' classroom visits");
ok(JSON.parse(U(() => G('api_myCalendar')())).tasks.length === 0, 'admin tasks are not part of a supervisor\'s calendar');
ok(sb.links.every(l => l.who === undefined), 'a supervisor gets no link meant for the admins');
ok(JSON.parse(V(() => G('api_visits')())).lead === true, 'a vice principal still sees the visits of their stages');

// ---- Indicator owner: leads only the indicators the main file names them for, inside their stages ----
// The sample file names "Sample Stage Owner" for C.Br 1.9 in every stage and "Other Stage Owner" for C.Br 1.1.
save({ email: 'indicator@school.test', name: 'Indicator Owner', role: 'indicator', stages: [EPI, EPN], aliases: ['Sample Stage Owner'] });
save({ email: 'nobody@school.test', name: 'Unnamed Owner', role: 'indicator', stages: [EPI] });
const I = fn => as('indicator@school.test', fn), N = fn => as('nobody@school.test', fn);
const mine19 = inEPI.filter(p => p.kpi === 'C.Br 1.9'), other11 = inEPI.filter(p => p.kpi === 'C.Br 1.1'), far19 = boot.programs.filter(p => p.stage === MBI && p.kpi === 'C.Br 1.9');
G('api_assign')(JSON.stringify({ email: 'teacher@school.test', keys: [mine19[1].key, other11[1].key] }));
const subA = JSON.parse(T(() => G('api_submit')(JSON.stringify({ type: 'report', programKey: mine19[1].key, done: true, note: 'done' }))));
const subB = JSON.parse(T(() => G('api_submit')(JSON.stringify({ type: 'report', programKey: other11[1].key, done: true, note: 'done' }))));
const ib = I(() => JSON.parse(G('api_bootstrap')()));
ok(ib.me.role === 'indicator' && ib.me.leads.slice().sort().join(',') === ['C.Br 1.9|' + EPI, 'C.Br 1.9|' + EPN].sort().join(','), 'an indicator owner leads the indicators that name them, in their own stages only (got ' + ib.me.leads.join(',') + ')');
ok(ib.programs.length === 12, 'an indicator owner still sees every programme of their stages');
ok(ib.submissions.some(x => x.id === subA.id) && !ib.submissions.some(x => x.id === subB.id), "an indicator owner sees the reports of their own indicators, not of others");
throws(() => I(() => G('api_review')(subB.id, 'approved', '')), 'FORBIDDEN', "an indicator owner cannot review another indicator's report");
ok(JSON.parse(I(() => G('api_review')(subA.id, 'approved', ''))).submission.status === 'approved', 'an indicator owner approves a report of their own indicator');
throws(() => I(() => G('api_updateExecution')(other11[0].key, JSON.stringify({ done: true }))), 'FORBIDDEN', 'an indicator owner cannot edit execution data of another indicator');
throws(() => I(() => G('api_updateExecution')(far19[0].key, JSON.stringify({ done: true }))), 'FORBIDDEN', 'an indicator owner cannot edit their indicator in a stage they do not have');
let ownExec = '';
try { I(() => G('api_updateExecution')(mine19[0].key, JSON.stringify({ done: true }))); } catch (e) { ownExec = String(e.message); }
ok(!ownExec.startsWith('FORBIDDEN|'), 'an indicator owner is allowed to edit execution data of their own indicator (got ' + ownExec + ')');
throws(() => I(() => G('api_reopen')(subB.id)), 'FORBIDDEN', "an indicator owner cannot reopen another indicator's report");
let ownReopen = '';
try { I(() => G('api_reopen')(subA.id)); } catch (e) { ownReopen = String(e.message); }
ok(!ownReopen.startsWith('FORBIDDEN|'), 'an indicator owner may reopen a report of their own indicator (got ' + ownReopen + ')');
[['api_users'], ['api_sync'], ['api_audit'], ['api_weekly'], ['api_assign', JSON.stringify({ email: 'teacher@school.test', keys: [mine19[2].key] })]]
  .forEach(([fn, arg]) => throws(() => I(() => G(fn)(arg)), 'FORBIDDEN', 'an indicator owner cannot call ' + fn));
// The level alone gives nothing: the main file has to name the person
ok(JSON.parse(N(() => G('api_bootstrap')())).me.leads.length === 0, 'an indicator owner the main file does not name leads nothing');
throws(() => N(() => G('api_review')(subB.id, 'approved', '')), 'FORBIDDEN', 'an unnamed indicator owner cannot review');
throws(() => N(() => G('api_updateExecution')(mine19[0].key, JSON.stringify({ done: true }))), 'FORBIDDEN', 'an unnamed indicator owner cannot edit execution data');
// Being named is not enough either: a teacher with the same name in the file stays a teacher
save({ email: 'named-teacher@school.test', name: 'Named Teacher', role: 'teacher', stages: [EPI], aliases: ['Other Stage Owner'] });
throws(() => as('named-teacher@school.test', () => G('api_review')(subB.id, 'approved', '')), 'FORBIDDEN', 'a teacher named in the file as indicator owner still cannot review');
ok(JSON.parse(as('named-teacher@school.test', () => G('api_bootstrap')())).me.leads.length === 0, 'a teacher gets no indicators to lead');
ok(JSON.parse(U(() => G('api_review')(subB.id, 'approved', ''))).submission.status === 'approved', 'a supervisor still reviews any indicator in their stage');

// ---- Control rules the admins may switch on: evidence for a completed report, and no deciding one's own report ----
const report = (who, key, extra) => JSON.parse(as(who, () => G('api_submit')(JSON.stringify(Object.assign({ type: 'report', programKey: key }, extra || {})))));
const settingsNow = () => JSON.parse(G('api_bootstrap')()).settings;
ok(settingsNow().needEvidence === false && settingsNow().noSelfReview === false, 'both rules are off until an admin switches them on');
const bare = report('teacher@school.test', other11[2].key);
ok(bare.status === 'pending', 'with the rule off, a completed report needs no evidence, as before');
const ownOff = report('vp@school.test', mine19[2].key, { note: 'done by me' });
ok(JSON.parse(V(() => G('api_review')(ownOff.id, 'approved', ''))).submission.status === 'approved', 'with the rule off, a leader may decide their own report, as before');
throws(() => T(() => G('api_saveSettings')(JSON.stringify({ needEvidence: true }))), 'FORBIDDEN', 'only an admin switches the rules');
G('api_saveSettings')(JSON.stringify({ needEvidence: true, noSelfReview: true }));
ok(settingsNow().needEvidence === true && settingsNow().noSelfReview === true, 'the page is told both rules are on');
throws(() => report('teacher@school.test', far19[0].key.replace(/./g, 'x')), 'GONE', 'an unknown programme is still refused first');
throws(() => report('teacher@school.test', other11[0].key), 'INPUT', 'with the rule on, a completed report without evidence or a note is refused');
ok(report('teacher@school.test', other11[0].key, { note: 'held on Sunday, 28 pupils' }).status === 'pending', 'a note is enough');
ok(report('vp@school.test', mine19[0].key, { evidence: 'https://drive.google.com/file/d/abc/view' }).status === 'pending', 'an evidence link is enough');
ok(report('teacher@school.test', inEPI[5].key, { outcome: 'postponed' }).status === 'pending', 'a postponed report needs neither');
const ownOn = JSON.parse(V(() => G('api_bootstrap')())).submissions.filter(x => x.by === 'vp@school.test' && x.status === 'pending')[0];
throws(() => V(() => G('api_review')(ownOn.id, 'approved', '')), 'FORBIDDEN', 'with the rule on, a leader cannot approve their own report');
throws(() => V(() => G('api_review')(ownOn.id, 'returned', 'x')), 'FORBIDDEN', 'nor return it');
ok(JSON.parse(U(() => G('api_review')(ownOn.id, 'approved', ''))).submission.status === 'approved', 'another leader of the stage approves it');
G('api_saveSettings')(JSON.stringify({ needEvidence: false, noSelfReview: false }));
ok(settingsNow().needEvidence === false && settingsNow().noSelfReview === false, 'an admin can switch both rules off again');

// ---- Backup: the owner downloads everything the platform keeps ----
[V, U, T, F].forEach((who, i) => throws(() => who(() => G('api_backup')()), 'FORBIDDEN', 'only the owner takes a backup (' + ['vice principal', 'supervisor', 'teacher', 'follower'][i] + ')'));
const bk = JSON.parse(G('api_backup')());
ok(bk.by === 'owner@school.test' && !!bk.madeAt, 'a backup says who made it and when');
ok(bk.sheets.Users.length >= 8 && bk.sheets.Users[0].indexOf('email') !== -1, 'a backup holds the staff list with its header row');
ok(bk.sheets.Submissions.length > 1 && bk.sheets.Assignments.length > 1 && bk.sheets.Audit.length > 1, 'a backup holds reports, assignments and the activity log');
ok(!('Snapshot' in bk.sheets) && !('Photos' in bk.sheets), 'a backup leaves out the copy of the main file and the pictures');
ok(JSON.parse(G('api_audit')(5)).some(a => a.action === 'backup'), 'taking a backup is written to the activity log');

console.log(`${pass} passed, ${failN} failed`); process.exit(failN ? 1 : 0);
