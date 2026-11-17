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
ok(boot.programs.length === 9 && inEPI.length === 3 && inEPN.length === 3, 'the sample file gives 3 programmes per stage, got ' + boot.programs.length);

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
ok(fb.programs.length === 3 && fb.programs.every(p => p.stage === EPI), 'a follower sees the programmes of their own stages only');
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
ok(sb.me.role === 'supervisor' && sb.programs.length === 3 && sb.programs.every(p => p.stage === EPI), 'a supervisor sees the programmes of their own stages only');
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

console.log(`${pass} passed, ${failN} failed`); process.exit(failN ? 1 : 0);
