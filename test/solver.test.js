// Checks the schedule builder on its own: no clashes, full class days, instructions followed, and honest reports when something cannot fit.
// Usage: node test/solver.test.js
const S = require('../src/solver.js');
let passed = 0, failed = 0;
const check = (ok, what) => { if (ok) passed++; else { failed++; console.log('FAIL ' + what); } };
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

/** A school of the given size: every class has the same study plan; teachers are given classes within a weekly quota. */
function school(nClasses, plan, quota, opts) {
  opts = opts || {};
  const classes = [], teachers = [], loads = [], subjects = Object.keys(plan);
  for (let i = 0; i < nClasses; i++) classes.push((4 + Math.floor(i / 3)) + 'ABC'[i % 3]);
  const setup = { dayLen: opts.dayLen || [8, 8, 8, 8, 8], classes, subjects, teachers, loads, rules: opts.rules || [] };
  subjects.forEach((s, si) => {
    const need = plan[s] * nClasses, n = Math.max(1, Math.ceil(need / (quota - 2)));
    for (let k = 0; k < n; k++) teachers.push({ id: 't' + si + '_' + k, name: s + ' teacher ' + (k + 1), subjects: [s], quota, maxDay: 0 });
  });
  classes.forEach(k => subjects.forEach(s => loads.push({ klass: k, subject: s, count: plan[s], teacher: '' })));
  const res = S.assign(setup);
  return { setup, res };
}
const FULL = { Maths: 6, English: 6, Arabic: 6, Science: 5, Quran: 4, Islamic: 3, Social: 3, PE: 2, Art: 2, ICT: 2, Skills: 1 };   // 40 a week
const SHORT = { Maths: 6, English: 6, Arabic: 5, Science: 4, Quran: 4, Islamic: 3, Social: 2, PE: 2, Art: 2, ICT: 1 };             // 35 a week
const sum = o => Object.values(o).reduce((a, b) => a + b, 0);
check(sum(FULL) === 40 && sum(SHORT) === 35, 'the sample study plans add up');

/** Reads a result the slow, obvious way, sharing nothing with the builder. */
function audit(setup, r) {
  const cs = {}, ts = {}, perLoad = {}, perDay = {};
  let classClash = 0, teacherClash = 0, outside = 0;
  r.lessons.forEach(l => {
    const ck = l.klass + '|' + l.day + '|' + l.period, tk = l.teacher + '|' + l.day + '|' + l.period;
    if (cs[ck]) classClash++; cs[ck] = 1;
    if (l.teacher) { if (ts[tk]) teacherClash++; ts[tk] = 1; }
    if (l.period < 1 || l.period > setup.dayLen[l.day] || l.day < 0 || l.day > 4) outside++;
    perLoad[l.klass + '|' + l.subject] = (perLoad[l.klass + '|' + l.subject] || 0) + 1;
    perDay[l.klass + '|' + l.subject + '|' + l.day] = (perDay[l.klass + '|' + l.subject + '|' + l.day] || 0) + 1;
  });
  const short = setup.loads.filter(x => (perLoad[x.klass + '|' + x.subject] || 0) !== x.count).length;
  return { classClash, teacherClash, outside, short, maxSubjectDay: Math.max(0, ...Object.values(perDay)) };
}

// ---- a small school ----
{
  const { setup, res } = school(2, { Maths: 5, English: 5, Science: 4 }, 24);
  check(res.missing.length === 0 && setup.loads.every(l => l.teacher), 'teachers are given to every class and subject when the quotas allow');
  const r = S.solve(setup, 1), a = audit(setup, r);
  check(r.ok && r.unplaced.length === 0 && r.lessons.length === 28, 'a small school is built in full');
  check(a.classClash === 0 && a.teacherClash === 0 && a.outside === 0 && a.short === 0, 'no class or teacher is in two places, and every subject has its sessions');
  check(r.report.classClash === 0 && r.report.teacherClash === 0 && r.report.classGaps === 0, 'the report agrees: no clashes and no free session inside a class day');
  check(a.maxSubjectDay === 1, 'a subject with five sessions a week comes once a day');
  const days = r.report.classes[0].days;
  check(days.join() === '3,3,3,3,2' && r.lessons.filter(l => l.klass === setup.classes[0]).every(l => l.period <= days[l.day]), 'a class with fewer sessions than the week holds gets short days that start at the first session');
}

// ---- a full-size stage: 18 classes with every session of the week taken ----
{
  const { setup, res } = school(18, FULL, 24);
  check(res.missing.length === 0, 'a full-size stage: teachers assigned within their quotas');
  const quotaOk = setup.teachers.every(t => setup.loads.filter(l => l.teacher === t.id).reduce((n, l) => n + l.count, 0) <= t.quota);
  check(quotaOk, 'no teacher is given more than their quota');
  const t0 = Date.now(), r = S.solve(setup, 7), ms = Date.now() - t0, a = audit(setup, r);
  console.log('   18 classes, ' + r.total + ' sessions, ' + setup.teachers.length + ' teachers: ' + ms + ' ms, teacher gaps ' + r.report.teacherGaps + ', longest teacher day ' + r.report.maxTeacherDay);
  check(r.unplaced.length === 0 && r.lessons.length === 720, 'all 720 sessions of a full-size stage are placed');
  check(a.classClash === 0 && a.teacherClash === 0 && a.short === 0 && r.report.classGaps === 0, 'with no clash and no gap');
  check(a.maxSubjectDay === 2, 'a subject with six sessions doubles on one day only as much as it must');
  check(ms < 20000, 'in reasonable time');
  const again = S.solve(setup, 7), other = S.solve(setup, 8), sig = x => x.lessons.map(l => l.klass + l.subject + l.day + l.period).join();
  check(sig(again) === sig(r), 'the same seed gives the same schedule');
  check(sig(other) !== sig(r) && other.unplaced.length === 0, 'another seed gives another complete schedule');
  const perTeacher = r.report.teachers.filter(t => t.total > 0);
  check(perTeacher.every(t => Math.max(...t.days) - Math.min(...t.days) <= 3), "teachers' sessions are spread over the week");
}

// ---- short weeks: 35 of 40 ----
{
  const { setup } = school(12, SHORT, 24);
  const r = S.solve(setup, 3), a = audit(setup, r);
  check(r.unplaced.length === 0 && a.classClash === 0 && a.teacherClash === 0, 'a 35-session week is built in full');
  check(r.report.classes.every(c => c.days.join() === '7,7,7,7,7' && c.gaps === 0), 'every class gets five even days of seven sessions, with no gap');
  check(r.lessons.every(l => l.period <= 7), 'and the eighth session stays free');
}

// ---- different lengths of day ----
{
  const { setup } = school(6, SHORT, 24, { dayLen: [7, 7, 7, 7, 7] });
  const r = S.solve(setup, 2), a = audit(setup, r);
  check(r.unplaced.length === 0 && a.outside === 0 && a.classClash + a.teacherClash === 0, 'seven sessions a day: built in full inside the day');
  const { setup: s2 } = school(6, SHORT, 24, { dayLen: [8, 8, 8, 8, 3] });
  const r2 = S.solve(s2, 2);
  check(r2.unplaced.length === 0 && r2.lessons.filter(l => l.day === 4).every(l => l.period <= 3) && r2.report.classGaps === 0, 'a short Thursday is respected');
}

// ---- the admins' instructions ----
{
  const rules = [
    { id: 'r1', type: 'off', must: true, teacher: 't0_0', days: [0], from: 1, to: 8 },          // a Maths teacher is away on Sunday
    { id: 'r2', type: 'off', must: true, teacher: 't1_0', days: [], from: 1, to: 2 },           // an English teacher starts from the third session
    { id: 'r3', type: 'window', must: true, subject: 'PE', klass: '', from: 3, to: 7 },         // PE neither first nor last
    { id: 'r4', type: 'window', must: false, subject: 'Maths', klass: '', from: 1, to: 5 },     // Maths early when possible
    { id: 'r5', type: 'maxDay', teacher: '', n: 6 },
    { id: 'r6', type: 'together', subject: 'PE', n: 1 },                                        // one playground
    { id: 'r7', type: 'fixed', klass: '', day: 2, period: 8, label: 'نشاط' },                   // activity for all on Tuesday
    { id: 'r8', type: 'streak', must: true, teacher: '', n: 4 },
    { id: 'r9', type: 'subjectDay', subject: 'Quran', n: 1 }
  ];
  const { setup } = school(9, SHORT, 22, { rules });
  const c = S.compile(setup);
  check(c.ok, 'a setup with nine instructions can be built');
  const r = S.solve(setup, 5), a = audit(setup, r), by = {};
  r.report.rules.forEach(x => { by[x.id] = x; });
  check(r.unplaced.length === 0 && a.classClash + a.teacherClash === 0 && a.short === 0, 'it is built in full with the instructions in force');
  check(r.lessons.every(l => !(l.teacher === 't0_0' && l.day === 0)) && by.r1.broken === 0, 'a teacher who is away for a day has no session that day');
  check(r.lessons.every(l => !(l.teacher === 't1_0' && l.period <= 2)) && by.r2.broken === 0, 'a teacher closed for the first two sessions starts from the third');
  check(r.lessons.filter(l => l.subject === 'PE').every(l => l.period >= 3 && l.period <= 7) && by.r3.broken === 0, 'a subject tied to certain sessions stays in them');
  const pe = {}; let together = 0;
  r.lessons.filter(l => l.subject === 'PE').forEach(l => { const k = l.day + '|' + l.period; if (pe[k]) together++; pe[k] = 1; });
  check(together === 0 && by.r6.broken === 0, 'a shared playground holds one class at a time');
  check(r.fixed.length === 9 && r.fixed.every(f => f.day === 2 && f.period === 8 && f.label === 'نشاط') && r.lessons.every(l => !(l.day === 2 && l.period === 8)) && by.r7.broken === 0, 'a fixed activity session is kept for every class and nothing else is put there');
  check(r.report.maxTeacherDay <= 6 && by.r5.broken === 0, "no teacher goes over the day's maximum");
  check(by.r8.broken === 0 && r.report.teachers.every(t => t.run <= 4), 'no teacher has more than four sessions in a row');
  check(by.r9.broken === 0, 'a subject limited to once a day comes once a day');
  const maths = r.lessons.filter(l => l.subject === 'Maths'), early = maths.filter(l => l.period <= 5).length;
  check(early / maths.length > 0.85, 'a preference is followed most of the time (' + early + ' of ' + maths.length + ' Maths sessions early) and its misses are counted: ' + by.r4.broken);
  check(by.r4.must === false && by.r4.broken === maths.length - early, 'the report counts exactly the sessions that miss a preference');
  check(r.report.classGaps === 0 && r.report.classes.every(x => x.days[2] === 7), 'with the activity at the end of Tuesday, classes are full up to it');
}

// ---- two sessions of a subject in a day sit together ----
{
  const { setup } = school(4, { Maths: 8, English: 6, Arabic: 6, Science: 5 }, 24, { dayLen: [5, 5, 5, 5, 5] });
  const r = S.solve(setup, 4);
  let apart = 0, doubles = 0;
  setup.classes.forEach(k => { for (let d = 0; d < 5; d++) ['Maths', 'English', 'Arabic'].forEach(s => { const ps = r.lessons.filter(l => l.klass === k && l.day === d && l.subject === s).map(l => l.period).sort(); if (ps.length === 2) { doubles++; if (ps[1] - ps[0] !== 1) apart++; } }); });
  check(r.unplaced.length === 0 && doubles >= 20 && apart <= 1, 'when a subject comes twice in a day, the two sessions are next to each other (' + apart + ' apart of ' + doubles + ')');
}

// ---- what cannot be built is said, not hidden ----
{
  const over = school(2, { Maths: 30, English: 12 }, 60).setup;
  check(S.compile(over).errors.some(e => e.code === 'classOver' && e.n === 42 && e.m === 40) && !S.solve(over, 1).ok, 'a class with more sessions than the week holds is refused before building');
  const busy = school(3, { Maths: 5 }, 24).setup;
  busy.loads.forEach(l => { l.teacher = busy.teachers[0].id; });
  busy.rules.push({ id: 'x', type: 'off', must: true, teacher: busy.teachers[0].id, days: [0, 1, 2], from: 1, to: 8 });
  check(S.compile(busy).errors.some(e => e.code === 'teacherOver' && e.n === 15 && e.m === 16) === false && S.compile(busy).ok, 'a teacher with just enough free time passes the check');
  busy.rules[0].days = [0, 1, 2, 3];
  check(S.compile(busy).errors.some(e => e.code === 'teacherOver' && e.n === 15 && e.m === 8), 'a teacher with more sessions than free time is refused before building');
  const cap = school(1, { Maths: 7 }, 24).setup;
  cap.rules.push({ id: 'c', type: 'subjectDay', subject: 'Maths', n: 1 });
  check(S.compile(cap).errors.some(e => e.code === 'subjectCap'), 'a subject limited to once a day with more sessions than days is refused');
  check(S.compile({ classes: ['1A'], teachers: [], loads: [], rules: [] }).errors[0].code === 'empty', 'an empty setup is refused');
  const quota = school(2, { Maths: 5 }, 24).setup;
  quota.teachers[0].quota = 4; quota.loads.forEach(l => { l.teacher = quota.teachers[0].id; });
  const cq = S.compile(quota);
  check(cq.ok && cq.warnings.some(w => w.code === 'quota' && w.n === 10 && w.m === 4), 'a teacher over their quota is a warning, not a refusal');
  // two teachers who can only meet one class in the same two sessions: one of them cannot be placed
  const tightSetup = { dayLen: [8, 8, 8, 8, 8], classes: ['1A'], teachers: [{ id: 'a', name: 'A', quota: 24 }, { id: 'b', name: 'B', quota: 24 }],
    loads: [{ klass: '1A', subject: 'X', count: 2, teacher: 'a' }, { klass: '1A', subject: 'Y', count: 2, teacher: 'b' }],
    rules: [{ id: '1', type: 'window', must: true, subject: 'X', from: 1, to: 1 }, { id: '2', type: 'window', must: true, subject: 'Y', from: 1, to: 1 },
      { id: '3', type: 'off', must: true, teacher: 'a', days: [2, 3, 4], from: 1, to: 8 }, { id: '4', type: 'off', must: true, teacher: 'b', days: [2, 3, 4], from: 1, to: 8 }] };
  const rt = S.solve(tightSetup, 1), at = audit(tightSetup, rt);
  check(rt.ok && rt.lessons.length === 2 && rt.unplaced.reduce((n, u) => n + u.n, 0) === 2 && at.classClash === 0, 'when the instructions leave no room, the sessions that do not fit are listed and nothing clashes');
  check(rt.report.rules.every(x => x.broken === 0), 'and no instruction is broken to make room');
}

// ---- giving classes to teachers ----
{
  const setup = { classes: ['1A', '1B', '1C'], subjects: ['Maths', 'Art'], rules: [],
    teachers: [{ id: 'm1', name: 'M1', subjects: ['Maths'], quota: 10 }, { id: 'm2', name: 'M2', subjects: ['Maths'], quota: 5 }, { id: 'x', name: 'X', subjects: ['Art'], quota: 4 }],
    loads: ['1A', '1B', '1C'].flatMap(k => [{ klass: k, subject: 'Maths', count: 5, teacher: '' }, { klass: k, subject: 'Art', count: 2, teacher: '' }]) };
  const res = S.assign(setup), of = id => setup.loads.filter(l => l.teacher === id).reduce((n, l) => n + l.count, 0);
  check(of('m1') === 10 && of('m2') === 5 && of('x') === 4, 'classes are shared out exactly within the quotas');
  check(res.missing.length === 1 && res.missing[0].subject === 'Art' && res.missing[0].able === 1, 'what the quotas cannot cover is reported');
  setup.loads[0].teacher = 'm2';
  S.assign(setup);
  check(setup.loads[0].teacher === 'm2', "filling the gaps keeps the admins' own choices");
  S.assign(setup, true);
  check(of('m1') === 10 && of('m2') === 5, 'starting again redistributes everything');
  setup.loads[0].teacher = 'gone';
  S.assign(setup);
  check(setup.loads[0].teacher !== 'gone', 'a teacher who was removed is replaced');
}

console.log(passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
