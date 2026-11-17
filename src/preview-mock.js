/* Preview only. An in-memory stand-in for the Apps Script server, so the design can be tried without the live file. Not shipped in Index.html. */
(function () {
  var D = window.__PREVIEW__, LEAD = ['owner', 'principal', 'avp', 'vp'];
  var INTL = ['ابتدائي بنين عالمي', 'متوسط بنين عالمي'];
  var users = [
    { email: 'principal@preview.example', name: 'مدير المدرسة (معاينة)', role: 'principal', stages: ['*'], active: true, aliases: [], phone: '966500000001', channel: 'both' },
    { email: 'avp@preview.example', name: 'وكيل الشؤون التعليمية (معاينة)', role: 'avp', stages: ['*'], active: true, aliases: [], phone: '', channel: 'email' },
    { email: 'vp@preview.example', name: 'وكيل المدرسة (معاينة)', role: 'vp', stages: INTL, active: true, aliases: [], phone: '966500000003', channel: 'whatsapp' },
    { email: 'teacher@preview.example', name: 'معلم (معاينة)', role: 'teacher', stages: INTL, active: true, aliases: ['وليد يوسف'], phone: '966500000004', channel: 'both' },
    { email: 'owner@preview.example', name: 'مالك النظام (معاينة)', role: 'owner', stages: ['*'], active: true, aliases: [], phone: '', channel: 'email' }
  ];
  var devItems = [];
  var cur = 0, audit = [], subs = [], photos = {}, tasks = [], sessions = [], undos = {}, assign = {}, lessons = [];
  var links = [{ name: 'منصة التطور المهني', url: 'https://andalus-idp.online/', who: 'admins' }];
  function linksFor(u) { var lead = LEAD.indexOf(u.role) !== -1; return links.filter(function (l) { return lead || l.who === 'all'; }).map(function (l) { return lead ? l : { name: l.name, url: l.url }; }); }
  var SLOGAN = 'منظومة تعليمية رائدة، تبني جيلاً يمتلك قدرات تعلم عالمية';
  var settings = { termStarts: { 1: '2026-08-30', 2: '2027-01-17' }, lastSync: '2026-11-15T14:56:00Z', lastSyncError: '', writeBack: true, mainFileSet: true, scope: D.scope, syncHours: 1, domain: 'preview.example', notify: true, notifyTime: '07:30', siteUrl: '', whatsappAuto: false, lastNotify: '', weekly: true, weeklyDay: 0, planEdit: true, slogan: SLOGAN, welcome: '' };
  function me() { return users[cur]; }
  function stages(u) { return u.stages.indexOf('*') !== -1 ? settings.scope : settings.scope.filter(function (s) { return u.stages.indexOf(s) !== -1; }); }
  function fail(code, msg) { return new Error(code + '|' + msg); }
  function log(action, target, details) { audit.unshift({ time: new Date().toISOString(), email: me().email, role: me().role, action: action, target: target || '', details: JSON.stringify(details || '') }); }
  function prog(key) { return D.programs.filter(function (p) { return p.key === key; })[0]; }
  function uid() { return 'p' + Math.random().toString(36).slice(2, 10); }
  // Example reports, marked as examples, so the review queue is not empty.
  (function seed() {
    var t = users[3], picks = D.programs.filter(function (p) { return INTL.indexOf(p.stage) !== -1 && !p.done && p.to && p.to < D.today; }).slice(0, 3);
    picks.forEach(function (p, i) {
      subs.push({ id: uid(), createdAt: '2026-11-1' + (2 + i) + 'T08:30:00Z', by: t.email, byName: t.name, type: 'report', programKey: p.key, sheet: p.sheet, stage: p.stage, kpi: p.kpi, title: p.name,
        outcome: i === 2 ? 'partial' : 'done', execDate: p.to, actual: p.count || 20, evidence: 'https://drive.google.com/preview-example-' + (i + 1), note: 'مثال للمعاينة فقط · Example for the preview', status: 'pending', reviewedBy: '', reviewedAt: '', reviewNote: '', writeback: '' });
    });
  })();
  // Example private calendars, so the pages are not empty.
  (function seedCal() {
    var d = D.today, admin = users[0].email, t = users[3].email;
    tasks.push({ id: uid(), owner: admin, title: 'جولة صفية · الصف الرابع', note: '', date: d, repeat: 'weekly', time: '08:15', until: '', notify: true, done: [] },
      { id: uid(), owner: admin, title: 'مراجعة تقارير المعلمين', note: 'مثال للمعاينة', date: d, repeat: 'daily', time: '13:00', until: '', notify: true, done: [] },
      { id: uid(), owner: admin, title: 'اجتماع قادة المراحل', note: '', date: window.AP.shiftDay(d, 3), repeat: 'none', time: '10:30', until: '', notify: true, done: [] });
    [[0, '07:30', '08:15', 'English · Reading', '5A', 'R12'], [0, '09:10', '09:55', 'English · Grammar', '6B', 'R14'], [1, '08:20', '09:05', 'English · Writing', '5A', 'R12'],
      [2, '07:30', '08:15', 'MAP practice', '6B', 'Lab 2'], [3, '10:15', '11:00', 'English · Reading', '4C', 'R09'], [4, '08:20', '09:05', 'Reading club', '5A', 'Library']].forEach(function (x) {
      [admin, t].forEach(function (owner) { sessions.push({ id: uid(), owner: owner, weekday: x[0], start: x[1], end: x[2], subject: x[3], klass: x[4], room: x[5] }); });
    });
  })();
  function own(list) { var e = me().email; return list.filter(function (x) { return x.owner === e; }); }
  function bare(x) { var c = JSON.parse(JSON.stringify(x)); delete c.owner; return c; }
  function saveOwn(list, rec) {
    var e = me().email, old = rec.id ? list.filter(function (x) { return x.id === rec.id && x.owner === e; })[0] : null;
    if (rec.id && !old) throw fail('GONE', 'العنصر غير موجود');
    rec.id = old ? old.id : uid(); rec.owner = e;
    if (old) list[list.indexOf(old)] = rec; else list.push(rec);
    return JSON.stringify(bare(rec));
  }
  function dropOwn(list, id) {
    var e = me().email, old = list.filter(function (x) { return x.id === id && x.owner === e; })[0];
    if (!old) throw fail('GONE', 'العنصر غير موجود');
    list.splice(list.indexOf(old), 1); return '';
  }
  function isTime(v) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(v || '')); }
  // An example school schedule for two classes, so the page is not empty: Sunday to Thursday, eight sessions a day.
  var PER_DAY = 8, SCHOOL_DAYS = 5, periods = {};
  var DEFAULT_TIMES = [['07:30', '08:15'], ['08:20', '09:05'], ['09:10', '09:55'], ['10:15', '11:00'], ['11:05', '11:50'], ['11:55', '12:40'], ['13:00', '13:45'], ['13:50', '14:35']];
  (function seedLessons() {
    var plan = { '5A': [['English', 'teacher@preview.example', 'R12'], ['Maths', 'خالد العتيبي', 'R12'], ['Science', 'سامي الحربي', 'Lab 1'], ['لغتي', 'فهد القحطاني', 'R12']],
      '6B': [['Maths', 'خالد العتيبي', 'R14'], ['English', 'teacher@preview.example', 'R14'], ['لغتي', 'فهد القحطاني', 'R14'], ['Science', 'سامي الحربي', 'Lab 1']] };
    Object.keys(plan).forEach(function (klass) {
      for (var d = 0; d < SCHOOL_DAYS; d++) for (var i = 0; i < 4; i++) {
        var x = plan[klass][(i + d) % 4], who = users.filter(function (u) { return u.email === x[1]; })[0];
        lessons.push({ id: uid(), stage: INTL[0], klass: klass, weekday: d, period: i + 1, subject: x[0], teacher: who ? who.email : '', teacherName: who ? who.name : x[1], room: x[2] });
      }
    });
  })();
  // An example setup for the schedule builder, so a schedule can be built straight away: six classes, forty sessions a week.
  var planner = {}, backups = {};
  (function seedPlanner() {
    var classes = ['4A', '4B', '5A', '5B', '6A', '6B'], plan = [['English', 8], ['Maths', 7], ['لغتي', 6], ['Science', 5], ['الدراسات الإسلامية', 4], ['Social', 2], ['ICT', 2], ['PE', 2], ['Art', 2], ['Skills', 1]];
    var teachers = [
      { id: 't1', name: users[3].name, email: users[3].email, quota: 24, maxDay: 0, subjects: ['English'] }, { id: 't2', name: 'Adam Clarke', email: '', quota: 24, maxDay: 0, subjects: ['English'] },
      { id: 't3', name: 'خالد العتيبي', email: '', quota: 24, maxDay: 0, subjects: ['Maths'] }, { id: 't4', name: 'ماجد الزهراني', email: '', quota: 24, maxDay: 0, subjects: ['Maths'] },
      { id: 't5', name: 'فهد القحطاني', email: '', quota: 24, maxDay: 0, subjects: ['لغتي'] }, { id: 't6', name: 'عبدالله الشهري', email: '', quota: 24, maxDay: 0, subjects: ['لغتي'] },
      { id: 't7', name: 'سامي الحربي', email: '', quota: 24, maxDay: 0, subjects: ['Science'] }, { id: 't8', name: 'ياسر المالكي', email: '', quota: 24, maxDay: 0, subjects: ['Science', 'ICT'] },
      { id: 't9', name: 'أحمد الغامدي', email: '', quota: 24, maxDay: 0, subjects: ['الدراسات الإسلامية'] }, { id: 't10', name: 'سلطان العمري', email: '', quota: 24, maxDay: 0, subjects: ['Social', 'Skills'] },
      { id: 't11', name: 'نايف السبيعي', email: '', quota: 16, maxDay: 0, subjects: ['PE'] }, { id: 't12', name: 'طلال الحارثي', email: '', quota: 16, maxDay: 0, subjects: ['Art'] }
    ];
    var left = {}, loads = [];
    teachers.forEach(function (t) { left[t.id] = t.quota; });
    // subjects with the fewest teachers are given out first, as the builder itself does
    plan.slice().sort(function (a, b) { var n = function (x) { return teachers.filter(function (t) { return t.subjects.indexOf(x[0]) !== -1; }).length; }; return n(a) - n(b); }).forEach(function (x) {
      classes.forEach(function (k) {
        var able = teachers.filter(function (t) { return t.subjects.indexOf(x[0]) !== -1 && left[t.id] >= x[1]; }).sort(function (a, b) { return left[b.id] - left[a.id]; })[0];
        if (able) left[able.id] -= x[1];
        loads.push({ klass: k, subject: x[0], count: x[1], teacher: able ? able.id : '' });
      });
    });
    planner[INTL[0]] = { at: '2026-11-10T08:00:00.000Z', by: users[0].email, setup: { dayLen: [8, 8, 8, 8, 8], classes: classes, subjects: plan.map(function (x) { return x[0]; }), teachers: teachers, loads: loads, rules: [
      { id: 'r1', type: 'fixed', must: true, klass: '', day: 2, period: 8, label: 'نشاط' },
      { id: 'r2', type: 'off', must: true, teacher: 't1', from: 1, to: 2, days: [0] },
      { id: 'r3', type: 'window', must: true, subject: 'PE', klass: '', from: 2, to: 7 },
      { id: 'r4', type: 'window', must: false, subject: 'Maths', klass: '', from: 1, to: 5 },
      { id: 'r5', type: 'together', must: true, subject: 'PE', n: 1 },
      { id: 'r6', type: 'maxDay', must: true, teacher: '', n: 6 }] } };
  })();
  function needLead() { if (LEAD.indexOf(me().role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.'); }
  function needStage(stage) { if (stages(me()).indexOf(stage) === -1) throw fail('FORBIDDEN', 'هذه المرحلة خارج صلاحيتك.'); }
  // Classroom visits: the three starting forms, and example visits so the pages are not empty.
  var VROLE = { principal: 'principal', avp: 'academic', vp: 'vp' }, VKINDS = ['principal', 'academic', 'vp'], vforms = JSON.parse(JSON.stringify(window.AP.VISIT_FORMS)), visits = [];
  function vscore(form, answers) {
    var n = form.scale.length, sum = 0, cnt = 0, parts = [], clean = [];
    if (!Array.isArray(answers) || answers.length !== form.sections.length) throw fail('INPUT', 'تغيّرت الاستمارة منذ فتحت الصفحة. حدّث الصفحة ثم أعد التقييم.');
    form.sections.forEach(function (sec, i) {
      var row = answers[i] || [], ps = 0, pc = 0, out = [];
      if (row.length !== sec.items.length) throw fail('INPUT', 'تغيّرت الاستمارة منذ فتحت الصفحة. حدّث الصفحة ثم أعد التقييم.');
      sec.items.forEach(function (_, j) {
        var v = Math.floor(Number(row[j]));
        if (row[j] === null || row[j] === undefined || row[j] === '' || !(v >= 0 && v <= n)) throw fail('INPUT', 'قيّم كل البنود، أو اختر «لا ينطبق» لما لا ينطبق.');
        out.push(v); if (v) { ps += v; pc++; }
      });
      clean.push(out); sum += ps; cnt += pc; parts.push([sec.title, pc ? Math.round(ps * 100 / (pc * n)) : null]);
    });
    if (!cnt) throw fail('INPUT', 'قيّم بنداً واحداً على الأقل.');
    return { answers: clean, score: Math.round(sum * 100 / (cnt * n)), parts: parts };
  }
  function visitOut(r, full) {
    var u = me(), lead = LEAD.indexOf(u.role) !== -1, o = { id: r.id, stage: r.stage, teacherName: r.teacherName, date: r.date, klass: r.klass, subject: r.subject, period: r.period, kind: r.kind, score: r.score, parts: r.parts, shared: r.shared, seen: !!r.seenAt, byName: r.byName, mine: r.by === u.email };
    if (lead) o.teacher = r.teacher;
    if (full) { o.form = r.form; o.answers = r.answers; o.strengths = r.strengths; o.improve = r.improve; o.recommend = r.recommend; if (lead) o.note = r.note; }
    return JSON.parse(JSON.stringify(o));
  }
  (function seedVisits() {
    var t = users[3], shape = function (form, low) { var k = 0; return form.sections.map(function (sec) { return sec.items.map(function () { k++; return low.indexOf(k) !== -1 ? 2 : k % 3 === 0 ? 3 : 4; }); }); };
    [[users[0], 'principal', '2026-10-06', [4, 8], '5A', 'English', 2, true], [users[1], 'academic', '2026-10-20', [3, 5, 11], '6B', 'English', 3, true], [users[2], 'vp', '2026-11-11', [2], '5A', 'English', 1, false]].forEach(function (x) {
      var form = JSON.parse(JSON.stringify(vforms[x[1]])), sc = vscore(form, shape(form, x[3]));
      visits.push({ id: uid(), stage: INTL[0], teacher: t.email, teacherName: t.name, date: x[2], klass: x[4], subject: x[5], period: x[6], kind: x[1], score: sc.score, parts: sc.parts, shared: true, seenAt: x[7] ? x[2] + 'T12:00:00Z' : '', by: x[0].email, byName: x[0].name,
        form: form, answers: sc.answers, strengths: 'تفاعل الطلاب واضح، والأهداف معلنة منذ بداية الحصة.', improve: 'تنويع أساليب التقويم داخل الحصة.', recommend: 'تبادل زيارة مع زميل في التخصص. (مثال للمعاينة)', note: '' });
    });
  })();
  var DAYS = [['الاحد', 'sun', 'sunday'], ['الاثنين', 'mon', 'monday'], ['الثلاثاء', 'tue', 'tuesday'], ['الاربعاء', 'wed', 'wednesday'], ['الخميس', 'thu', 'thursday'], ['الجمعة', 'fri', 'friday'], ['السبت', 'sat', 'saturday']];
  function latin(v) { return String(v === null || v === undefined ? '' : v).replace(/[٠-٩]/g, function (d) { return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); }); }
  function clockOf(v) { var m = /^\s*(\d{1,2})\s*[:.]\s*(\d{2})\s*$/.exec(latin(v)); return m && +m[1] <= 23 && +m[2] <= 59 ? ('0' + +m[1]).slice(-2) + ':' + m[2] : ''; }
  function dayOf(v) { var t = window.AP.norm(latin(v)).toLowerCase().replace(/^يوم\s+/, ''); if (/^[1-7]$/.test(t)) return +t - 1; for (var i = 0; i < 7; i++) if (DAYS[i].indexOf(t) !== -1) return i; return -1; }
  function periodOf(v) { var m = /\d+/.exec(latin(v)), n = m ? +m[0] : 0; return n >= 1 && n <= PER_DAY ? n : 0; }
  function timesFor(stage) { return periods[stage] || DEFAULT_TIMES; }
  function lessonOut(l) { var u = me(), o = JSON.parse(JSON.stringify(l)); o.mine = !!l.teacher && l.teacher === u.email; if (LEAD.indexOf(u.role) === -1) delete o.teacher; return o; }
  function lessonIn(d, pasted) {
    var u = me();
    if (LEAD.indexOf(u.role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.');
    if (stages(u).indexOf(d.stage) === -1) throw fail('FORBIDDEN', 'هذه المرحلة خارج صلاحيتك.');
    var rec = { id: String(d.id || ''), stage: d.stage, klass: String(d.klass || '').trim().slice(0, 30), weekday: pasted ? dayOf(d.weekday) : Math.floor(Number(d.weekday)), period: periodOf(d.period),
      subject: String(d.subject || '').trim().slice(0, 80), teacher: String(d.teacher || '').toLowerCase(), teacherName: String(d.teacherName || '').trim().slice(0, 80), room: String(d.room || '').trim().slice(0, 40) };
    if (!rec.klass) throw fail('INPUT', 'اكتب اسم الصف');
    if (!(rec.weekday >= 0 && rec.weekday < SCHOOL_DAYS)) throw fail('INPUT', 'اليوم غير صحيح. أيام الجدول من الأحد إلى الخميس.');
    if (!rec.period) throw fail('INPUT', 'رقم الحصة من 1 إلى ' + PER_DAY + '.');
    if (!rec.subject) throw fail('INPUT', 'اكتب المادة');
    var staff = users.filter(function (x) { return x.active && stages(x).indexOf(rec.stage) !== -1; });
    if (rec.teacher) { var w = staff.filter(function (x) { return x.email === rec.teacher; })[0]; if (!w) throw fail('INPUT', 'المعلم ليس من منسوبي هذه المرحلة'); rec.teacherName = w.name; }
    else if (rec.teacherName) { var m = window.AP.namedIn(rec.teacherName, staff); if (m.length === 1) rec.teacher = m[0].email; }
    return rec;
  }
  function sameSlot(r, rec) { return r.id !== rec.id && r.weekday === rec.weekday && r.period === rec.period; }
  function takenBy(list, rec) { return list.filter(function (r) { return sameSlot(r, rec) && r.stage === rec.stage && r.klass === rec.klass; })[0] || null; }
  function clashes(list, rec) {
    if (!rec.teacher) return [];
    return list.filter(function (r) { return sameSlot(r, rec) && r.teacher === rec.teacher; }).map(function (r) { return 'للمعلم ' + rec.teacherName + ' حصة أخرى في هذا الوقت: ' + r.klass + ' · ' + r.subject; }).slice(0, 3);
  }
  function userBy(email) { return users.filter(function (x) { return x.email === email && x.active; })[0]; }
  function assignOut(list) {
    var u = me(), lead = LEAD.indexOf(u.role) !== -1, out = {};
    list.forEach(function (p) { var w = assign[p.key] && userBy(assign[p.key]); if (w) out[p.key] = lead ? { name: w.name, email: w.email, me: w.email === u.email } : { name: w.name, me: w.email === u.email }; });
    return out;
  }
  function setAssign(pairs) {
    var u = me(), before = [];
    if (LEAD.indexOf(u.role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.');
    pairs.forEach(function (x) {
      var p = prog(x.key); if (!p) throw fail('GONE', 'برنامج غير موجود في آخر مزامنة.');
      if (stages(u).indexOf(p.stage) === -1) throw fail('FORBIDDEN', 'هذه المرحلة خارج صلاحيتك.');
      if (!x.email) return;
      var w = userBy(x.email); if (!w) throw fail('INPUT', 'المستخدم غير موجود أو موقوف.');
      if (stages(w).indexOf(p.stage) === -1) throw fail('INPUT', 'هذا المستخدم ليس من منسوبي مرحلة البرنامج: ' + p.stage);
    });
    pairs.forEach(function (x) { before.push({ key: x.key, email: assign[x.key] || '' }); if (x.email) assign[x.key] = x.email; else delete assign[x.key]; });
    return before;
  }
  function assignReply(keys, undoId) {
    var out = assignOut(keys.map(prog)), mine = {};
    keys.forEach(function (k) { mine[k] = out[k] || null; });
    return JSON.stringify({ assign: mine, undoId: undoId || '' });
  }
  /* The plan in the preview: one simple table per indicator. Indicator A.Br 1.2 is shown as closed by the main branch, as an example. */
  var CLOSED = 'التخطيط مغلق من الفرع الرئيسي في المنصة الشاملة.', LOCKED_KPI = 'A.Br 1.2', freeRows = {};
  var PLAN_FIELDS = (function () {
    var weeks = []; for (var w = 1; w <= 20; w++) weeks.push('الأسبوع ' + w);
    return [{ id: 'name', field: 'name', label: 'اسم البرنامج', type: 'text', required: true }, { id: 'term', field: 'term', label: 'وقت التنفيذ · الفصل', type: 'list', required: true, options: ['فصل 1', 'فصل 2'] },
      { id: 'week', field: 'week', label: 'وقت التنفيذ · الأسبوع', type: 'list', required: true, options: weeks }, { id: 'details', field: 'details', label: 'التفاصيل', type: 'long' },
      { id: 'count', field: 'count', label: 'العدد المستهدف', type: 'number' }, { id: 'assignee', field: 'assignee', label: 'المكلف', type: 'text' }];
  })();
  function freeOf(stage, kpi) { var k = stage + '|' + kpi; if (freeRows[k] === undefined) freeRows[k] = 12; return freeRows[k]; }
  function checkPlanValues(v) {
    PLAN_FIELDS.forEach(function (f) {
      var x = v[f.id];
      if (x === undefined || x === '') { if (f.required) throw fail('INPUT', 'أكمل الحقل: ' + f.label); return; }
      if (f.type === 'list' && f.options.indexOf(String(x)) === -1) throw fail('INPUT', 'قيمة غير موجودة في قائمة: ' + f.label);
      if (f.type === 'number' && !(Number(x) >= 0)) throw fail('INPUT', 'العدد غير صحيح');
    });
  }
  function decidePlan(s, note) {
    var u = me(), d = JSON.parse(s.data || '{}');
    if (!settings.writeBack) throw fail('SETUP', 'الكتابة في المنصة الشاملة متوقفة. يفعّلها مدير النظام من الإعدادات.');
    if (s.kpi === LOCKED_KPI) throw fail('LOCKED', CLOSED);
    if (s.type === 'add') {
      if (freeOf(s.stage, s.kpi) < 1) throw fail('FULL', 'لا يوجد صف فارغ في جدول هذا المؤشر.');
      var like = D.programs.filter(function (p) { return p.kpi === s.kpi && p.stage === s.stage; })[0] || D.programs[0], v = d.values;
      var np = { sheet: like.sheet, kpi: s.kpi, kpiName: like.kpiName, stage: s.stage, block: 1, sub: '', row: 9000 + D.programs.length, c: { name: 5, done: 16, actual: 17, evidence: 18, comment: 19 }, hasOwnerCol: true,
        name: String(v.name).slice(0, 160), details: String(v.details || ''), assignee: String(v.assignee || ''), count: v.count === undefined || v.count === '' ? null : Number(v.count), actual: null, approved: false, done: false,
        term: +String(v.term).replace(/\D/g, ''), week: +String(v.week).replace(/\D/g, ''), start: null, end: null, key: 'new' + uid() };
      np = window.AP.withDates(np, { termStarts: settings.termStarts });
      D.programs.push(np); freeRows[s.stage + '|' + s.kpi]--;
      var by = users.filter(function (x) { return x.email === s.by; })[0];
      if (by && LEAD.indexOf(by.role) === -1) assign[np.key] = by.email;
      s.programKey = np.key; s.undo = { plan: 'add', key: np.key }; s.writeback = 'معاينة: أُضيف البرنامج هنا فقط، لا في الملف الحقيقي';
    } else {
      var p = prog(s.programKey);
      if (!p) throw fail('GONE', 'البرنامج غير موجود في آخر مزامنة.');
      if (p.approved) throw fail('LOCKED', 'اعتمد الفرع الرئيسي هذا البرنامج في المنصة الشاملة، فلا يُحذف من هنا.');
      D.programs.splice(D.programs.indexOf(p), 1); freeRows[s.stage + '|' + s.kpi] = freeOf(s.stage, s.kpi) + 1;
      s.undo = { plan: 'remove', program: p }; s.writeback = 'معاينة: حُذف البرنامج هنا فقط، لا من الملف الحقيقي';
    }
    s.status = 'approved'; s.reviewedBy = u.email; s.reviewedAt = new Date().toISOString(); s.reviewNote = String(note || '').slice(0, 500);
    log('review-approved', s.title, { id: s.id, type: s.type });
    return JSON.stringify({ submission: s, program: null, boot: api.api_bootstrap() });
  }
  function revertPlan(s) {
    if (s.undo.plan === 'add') { var p = prog(s.undo.key); if (p) D.programs.splice(D.programs.indexOf(p), 1); delete assign[s.undo.key]; freeRows[s.stage + '|' + s.kpi]++; s.programKey = ''; }
    else { D.programs.push(s.undo.program); freeRows[s.stage + '|' + s.kpi]--; }
  }
  function writeBack(key, fields) {
    if (!settings.writeBack) return { ok: false, message: 'الكتابة في المنصة الشاملة متوقفة من الإعدادات' };
    var p = prog(key), wrote = [], before = {}, missing = [], AR = { done: 'حالة الإتمام', actual: 'العدد الفعلي', evidence: 'الشاهد', comment: 'تعليق مدير المرحلة' };
    ['done', 'actual', 'evidence', 'comment'].forEach(function (k) {
      if (!(k in fields)) return;
      if (!p.c || !p.c[k]) { missing.push(AR[k]); return; }
      before[k] = k === 'done' ? !!p[k] : (p[k] == null ? '' : p[k]);
      if (fields[k] === '' || fields[k] === false) delete p[k]; else p[k] = fields[k];
      wrote.push(k);
    });
    log('writeback', p.sheet + ' R' + p.row + ' ' + p.name, { wrote: wrote });
    return { ok: wrote.length > 0, wrote: wrote, before: before, program: p, message: wrote.length ? 'معاينة: لم يُكتب شيء في الملف الحقيقي' + (missing.length ? ' · جدول هذا المؤشر لا يحتوي عمود: ' + missing.join('، ') : '') : 'لا يوجد عمود مطابق في جدول هذا البرنامج' };
  }
  var api = {
    api_bootstrap: function () {
      var u = me(), st = stages(u), lead = LEAD.indexOf(u.role) !== -1, inSt = function (x) { return st.indexOf(x.stage) !== -1; };
      return JSON.stringify({ me: { email: u.email, name: u.name, role: u.role, stages: st, aliases: u.aliases, photo: photos[u.email] || '' }, settings: settings, today: D.today, fileName: D.fileName,
        programs: D.programs.filter(inSt).map(function (p) { if (p.kpi !== LOCKED_KPI) return p; var c = JSON.parse(JSON.stringify(p)); c.planClosed = true; return c; }), indicators: D.indicators.filter(inSt), targets: D.targets,
        submissions: subs.filter(function (s) { return lead ? st.indexOf(s.stage) !== -1 : s.by === u.email; }), assign: assignOut(D.programs.filter(inSt)), links: linksFor(u), visitsNew: visits.filter(function (r) { return r.teacher === u.email && r.shared && !r.seenAt; }).length,
        plan: (function () { var out = {}; D.programs.filter(inSt).forEach(function (p) { var k = p.kpi + '|' + p.stage; if (!out[k]) out[k] = p.kpi === LOCKED_KPI ? { free: 0, state: 'closed' } : { free: freeOf(p.stage, p.kpi), state: freeOf(p.stage, p.kpi) ? 'open' : 'full' }; }); return out; })() });
    },
    api_submit: function (json) {
      var u = me(), d = JSON.parse(json), rec;
      if (d.evidence && !/^https:\/\/[^\s<>"']+$/i.test(d.evidence)) throw fail('INPUT', 'رابط الشاهد يجب أن يبدأ بـ https://');
      if (d.type === 'contribution') { if (!String(d.title || '').trim()) throw fail('INPUT', 'اكتب عنوان العمل'); rec = { programKey: '', sheet: '', stage: d.stage, kpi: d.kpi, title: String(d.title).slice(0, 160) }; }
      else { var p = prog(d.programKey); if (!p) throw fail('GONE', 'البرنامج غير موجود'); rec = { programKey: p.key, sheet: p.sheet, stage: p.stage, kpi: p.kpi, title: p.name }; }
      if (stages(u).indexOf(rec.stage) === -1) throw fail('FORBIDDEN', 'هذه المرحلة خارج صلاحيتك.');
      var old = subs.filter(function (s) { return rec.programKey && s.status === 'pending' && s.programKey === rec.programKey && s.by === u.email; })[0];
      var full = { id: old ? old.id : uid(), createdAt: new Date().toISOString(), by: u.email, byName: u.name, type: d.type === 'contribution' ? 'contribution' : 'report', programKey: rec.programKey, sheet: rec.sheet,
        stage: rec.stage, kpi: rec.kpi, title: rec.title, outcome: d.outcome || 'done', execDate: d.execDate || '', actual: d.actual === '' ? '' : Number(d.actual), evidence: d.evidence || '', note: String(d.note || '').slice(0, 1000),
        status: 'pending', reviewedBy: '', reviewedAt: '', reviewNote: '', writeback: '' };
      subs = subs.filter(function (s) { return s.id !== full.id; }).concat([full]);
      log('report-submitted', rec.title, { id: full.id });
      return JSON.stringify(full);
    },
    api_review: function (id, decision, note) {
      var u = me(); if (LEAD.indexOf(u.role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لقيادة المرحلة فقط.');
      var s = subs.filter(function (x) { return x.id === id; })[0];
      if (!s || s.status !== 'pending') throw fail('STATE', 'سبق البت في هذا التقرير');
      var program = null;
      if (decision === 'approved' && (s.type === 'add' || s.type === 'remove')) return decidePlan(s, note);
      if (decision === 'approved' && s.type === 'report' && s.outcome === 'done') {
        var f = { done: true }; if (s.actual !== '') f.actual = s.actual; if (s.evidence) f.evidence = s.evidence;
        var r = writeBack(s.programKey, f); s.writeback = r.message; program = r.program || null; s.undo = r.ok ? r.before : null;
      } else if (decision === 'approved') s.writeback = s.type === 'contribution' ? 'محفوظ في ملف التحكم فقط' : 'لا كتابة: البرنامج لم يكتمل';
      s.status = decision; s.reviewedBy = u.email; s.reviewedAt = new Date().toISOString(); s.reviewNote = String(note || '').slice(0, 500);
      log('review-' + decision, s.title, { id: id });
      return JSON.stringify({ submission: s, program: program });
    },
    api_updateExecution: function (key, json) {
      var u = me(), d = JSON.parse(json);
      if (LEAD.indexOf(u.role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لقيادة المرحلة فقط.');
      if ('comment' in d && ['owner', 'principal'].indexOf(u.role) === -1) throw fail('FORBIDDEN', 'تعليق مدير المرحلة للمدير فقط.');
      if (d.evidence && !/^https:\/\/[^\s<>"']+$/i.test(d.evidence)) throw fail('INPUT', 'رابط الشاهد يجب أن يبدأ بـ https://');
      if (!settings.writeBack) throw fail('SETUP', 'الكتابة في المنصة الشاملة متوقفة. يفعّلها مالك النظام من الإعدادات.');
      var r = writeBack(key, d);
      if (r.ok) { r.undoId = uid(); undos[r.undoId] = { key: key, before: r.before, by: u.email }; }
      return JSON.stringify(r);
    },
    api_undoExecution: function (id) {
      var rec = undos[id];
      if (!rec || rec.by !== me().email) throw fail('GONE', 'انتهت مهلة التراجع عن هذا التعديل.');
      delete undos[id];
      return JSON.stringify(writeBack(rec.key, rec.before));
    },
    api_sync: function () { settings.lastSync = new Date().toISOString(); log('sync', D.fileName, { programs: D.programs.length }); return api.api_bootstrap(); },
    api_users: function () { if (LEAD.indexOf(me().role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.'); return JSON.stringify(users.map(function (x) { var c = JSON.parse(JSON.stringify(x)); c.photo = photos[x.email] || ''; return c; })); },
    api_saveUser: function (json) {
      var d = JSON.parse(json), email = String(d.email || '').toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw fail('INPUT', 'البريد غير صحيح');
      if (!(d.stages || []).length) throw fail('INPUT', 'اختر مرحلة واحدة على الأقل');
      var phone = String(d.phone || '').replace(/[\s+()-]/g, '');
      if (phone && !/^\d{8,15}$/.test(phone)) throw fail('INPUT', 'رقم الجوال يُكتب بالصيغة الدولية بالأرقام فقط');
      var u = { email: email, name: d.name || email, role: d.role, stages: d.stages, active: d.active !== false, aliases: d.aliases || [], phone: phone, channel: d.channel || 'email' }, i = -1;
      users.forEach(function (x, n) { if (x.email === email) i = n; });
      u.major = 'major' in d ? String(d.major || '') : (i > -1 ? users[i].major || '' : ''); u.position = 'position' in d ? String(d.position || '') : (i > -1 ? users[i].position || '' : '');
      if (i > -1) users[i] = u; else users.push(u);
      log('user-saved', email, { role: d.role }); buildBar();
      return api.api_users();
    },
    api_saveSettings: function (json) {
      var d = JSON.parse(json);
      if (d.t1) settings.termStarts[1] = d.t1; if (d.t2) settings.termStarts[2] = d.t2;
      if ('writeBack' in d) settings.writeBack = !!d.writeBack; if ('planEdit' in d) settings.planEdit = !!d.planEdit; if (d.syncHours) settings.syncHours = d.syncHours;
      if ('weekly' in d) settings.weekly = !!d.weekly; if ('weeklyDay' in d) settings.weeklyDay = +d.weeklyDay;
      if ('notify' in d) settings.notify = !!d.notify; if (d.notifyTime) settings.notifyTime = d.notifyTime; if ('siteUrl' in d) settings.siteUrl = d.siteUrl;
      if ('slogan' in d) settings.slogan = String(d.slogan || '').slice(0, 160) || SLOGAN; if ('welcome' in d) settings.welcome = String(d.welcome || '').slice(0, 300);
      if ('links' in d) {
        links = (d.links || []).map(function (l) {
          if (!String(l.name || '').trim()) throw fail('INPUT', 'اكتب اسم المنصة');
          if (!/^https:\/\/[^\s<>"']+$/i.test(String(l.url || ''))) throw fail('INPUT', 'رابط المنصة يجب أن يبدأ بـ https://');
          return { name: String(l.name).trim().slice(0, 60), url: String(l.url), who: l.who === 'all' ? 'all' : 'admins' };
        });
      }
      log('settings', '', { writeBack: d.writeBack });
      return JSON.stringify({ settings: settings, fileName: D.fileName, links: linksFor(me()) });
    },
    api_audit: function () { return JSON.stringify(audit.slice(0, 200)); },
    api_notifications: function () {
      var u = me(), st = stages(u);
      if (LEAD.indexOf(u.role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.');
      var list = window.AP.buildNotifications({ programs: D.programs, indicators: D.indicators, targets: D.targets }, users, D.today, ['principal', 'avp', 'vp'], assign, (function () { var m = {}; subs.forEach(function (x) { if (x.type === 'report' && x.programKey && x.status !== 'returned') m[x.programKey] = true; }); return m; })()).map(function (rec) {
        rec.items = rec.items.filter(function (it) { return st.indexOf(it.stage) !== -1; });
        return { email: rec.email, name: rec.name, phone: rec.phone, channel: rec.channel, items: rec.items, text: window.AP.digestText(rec, D.today, settings.siteUrl), status: '' };
      }).filter(function (rec) { return rec.items.length; });
      return JSON.stringify({ today: D.today, time: settings.notifyTime, on: settings.notify, whatsappAuto: false, lastRun: '', list: list });
    },
    api_sendMyNotification: function () { log('notification-test', me().email, {}); return JSON.stringify({ items: 0 }); },
    api_assign: function (json) {
      var d = JSON.parse(json), email = String(d.email || '').toLowerCase(), keys = (d.keys || []).map(String);
      if (!keys.length || keys.length > 500) throw fail('INPUT', 'اختر برنامجاً واحداً على الأقل، و500 على الأكثر.');
      var id = uid(); undos[id] = { pairs: setAssign(keys.map(function (k) { return { key: k, email: email }; })), by: me().email };
      log(email ? 'assigned' : 'assignment-removed', email, { programmes: keys.length });
      return assignReply(keys, id);
    },
    api_undoAssign: function (id) {
      var rec = undos[id];
      if (!rec || rec.by !== me().email || !rec.pairs) throw fail('GONE', 'انتهت مهلة التراجع عن هذا الإسناد.');
      delete undos[id]; setAssign(rec.pairs);
      return assignReply(rec.pairs.map(function (x) { return x.key; }), '');
    },
    api_timetable: function () {
      var st = stages(me()), times = {};
      st.forEach(function (x) { times[x] = timesFor(x); });
      return JSON.stringify({ days: SCHOOL_DAYS, perDay: PER_DAY, periods: times, lessons: lessons.filter(function (l) { return st.indexOf(l.stage) !== -1; }).map(lessonOut) });
    },
    api_savePeriods: function (json) {
      var u = me(), d = JSON.parse(json), list = d.stages || [d.stage], clean = [], before = {}, now = {};
      if (LEAD.indexOf(u.role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.');
      list.forEach(function (x) { if (stages(u).indexOf(x) === -1) throw fail('FORBIDDEN', 'هذه المرحلة خارج صلاحيتك.'); });
      if ((d.periods || []).length !== PER_DAY) throw fail('INPUT', 'عدد الحصص في اليوم ' + PER_DAY + '.');
      d.periods.forEach(function (x, i) {
        var a = clockOf(x[0]), b = clockOf(x[1]);
        if (!a || !b || b <= a) throw fail('INPUT', 'وقت الحصة ' + (i + 1) + ' غير صحيح: النهاية بعد البداية.');
        if (i && a < clean[i - 1][1]) throw fail('INPUT', 'الحصة ' + (i + 1) + ' تبدأ قبل نهاية الحصة ' + i + '.');
        clean.push([a, b]);
      });
      list.forEach(function (x) { before[x] = timesFor(x); periods[x] = clean; now[x] = clean; });
      log('session-times', list.join('، '), {});
      return JSON.stringify({ periods: now, before: before });
    },
    api_saveLesson: function (json) {
      var rec = lessonIn(JSON.parse(json), false), old = rec.id ? lessons.filter(function (l) { return l.id === rec.id; })[0] : null;
      if (rec.id && !old) throw fail('GONE', 'الحصة غير موجودة');
      var there = takenBy(lessons, rec);
      if (there) throw fail('STATE', 'للصف ' + rec.klass + ' حصة في هذا الموعد: ' + there.subject + '. عدّلها أو احذفها أولاً.');
      var warn = clashes(lessons, rec);
      if (old) lessons[lessons.indexOf(old)] = rec; else { rec.id = uid(); lessons.push(rec); }
      return JSON.stringify({ lesson: lessonOut(rec), warnings: warn });
    },
    api_deleteLesson: function (id) {
      if (LEAD.indexOf(me().role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.');
      var old = lessons.filter(function (l) { return l.id === id; })[0];
      if (!old) throw fail('GONE', 'الحصة غير موجودة');
      lessons.splice(lessons.indexOf(old), 1); return '';
    },
    api_importLessons: function (json) {
      var d = JSON.parse(json), good = [], errors = [], clashing = 0;
      if (LEAD.indexOf(me().role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.');
      if ((d.rows || []).length > 600) throw fail('INPUT', 'الصق 600 صف على الأكثر في المرة الواحدة.');
      (d.rows || []).forEach(function (cells, i) {
        cells = (cells || []).map(function (x) { return String(x === null || x === undefined ? '' : x).trim(); });
        if (!cells.some(String)) return;
        if (!good.length && !errors.length && dayOf(cells[1]) === -1 && !periodOf(cells[2])) return;
        try {
          var rec = lessonIn({ stage: d.stage, klass: cells[0], weekday: cells[1], period: cells[2], subject: cells[3], teacherName: cells[4], room: cells[5] }, true);
          rec.id = uid();
          var there = takenBy(lessons.concat(good), rec);
          if (there) throw fail('STATE', 'للصف ' + rec.klass + ' حصة في هذا الموعد: ' + there.subject);
          good.push(rec);
        } catch (e) { errors.push({ line: i + 1, message: String(e.message).split('|').pop() }); }
      });
      if (errors.length) return JSON.stringify({ ok: false, errors: errors.slice(0, 20), wrong: errors.length });
      if (!good.length) throw fail('INPUT', 'لا توجد صفوف في الجدول الملصق.');
      good.forEach(function (rec, i) { if (clashes(lessons.concat(good.slice(0, i)), rec).length) clashing++; });
      good.forEach(function (rec) { lessons.push(rec); });
      var id = uid(); undos[id] = { ids: good.map(function (r) { return r.id; }), by: me().email };
      log('timetable-import', d.stage, { sessions: good.length });
      return JSON.stringify({ ok: true, added: good.length, clashing: clashing, undoId: id, lessons: good.map(lessonOut) });
    },
    api_undoImport: function (id) {
      var rec = undos[id];
      if (!rec || rec.by !== me().email || !rec.ids) throw fail('GONE', 'انتهت مهلة التراجع عن هذا الاستيراد.');
      delete undos[id]; lessons = lessons.filter(function (l) { return rec.ids.indexOf(l.id) === -1; });
      return JSON.stringify({ ids: rec.ids });
    },
    api_clearClass: function (stage, klass) {
      if (LEAD.indexOf(me().role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.');
      var out = lessons.filter(function (l) { return l.stage === stage && l.klass === klass; });
      if (!out.length) throw fail('GONE', 'لا توجد حصص لهذا الصف.');
      lessons = lessons.filter(function (l) { return out.indexOf(l) === -1; });
      return JSON.stringify({ removed: out.map(lessonOut) });
    },
    api_planner: function () {
      needLead();
      var out = {};
      stages(me()).forEach(function (st) { if (planner[st]) out[st] = JSON.parse(JSON.stringify(planner[st])); });
      return JSON.stringify({ setups: out });
    },
    api_savePlanner: function (json) {
      needLead();
      var d = JSON.parse(json), now = planner[d.stage], su = d.setup || {};
      needStage(d.stage);
      if (now && String(d.base || '') !== now.at) throw fail('STATE', 'غيّر مدير آخر إعداد الجدول قبل قليل. حدّث الصفحة لترى آخر نسخة ثم أعد تعديلك.');
      if ((su.classes || []).length > 60) throw fail('INPUT', 'الحد الأقصى 60 صفاً في المرحلة.');
      var at = new Date().toISOString();
      if (now && at <= now.at) at = new Date(new Date(now.at).getTime() + 1).toISOString();
      planner[d.stage] = { at: at, by: me().email, setup: JSON.parse(JSON.stringify(su)) };
      return JSON.stringify({ setup: planner[d.stage].setup, at: at });
    },
    api_applySchedule: function (json) {
      needLead();
      var d = JSON.parse(json), classes = {}, taken = {}, good = [], staff = users.filter(function (x) { return x.active && stages(x).indexOf(d.stage) !== -1; });
      needStage(d.stage);
      if (!(d.lessons || []).length) throw fail('INPUT', 'لا توجد حصص في الجدول المبني.');
      (d.classes || []).forEach(function (k) { classes[k] = true; });
      d.lessons.forEach(function (x, i) {
        var rec = { id: uid(), stage: d.stage, klass: String(x.klass || '').trim(), weekday: Math.floor(Number(x.weekday)), period: periodOf(x.period), subject: String(x.subject || '').trim(), teacher: String(x.teacher || '').toLowerCase(), teacherName: String(x.teacherName || '').trim(), room: '' };
        if (!rec.klass || !rec.subject || !rec.period || !(rec.weekday >= 0 && rec.weekday < SCHOOL_DAYS)) throw fail('INPUT', 'في الجدول المبني حصة غير صحيحة (رقم ' + (i + 1) + '). لم يُعتمد شيء.');
        if (rec.teacher) { var w = staff.filter(function (s) { return s.email === rec.teacher; })[0]; if (!w) throw fail('INPUT', 'في الجدول المبني معلم ليس من منسوبي هذه المرحلة. لم يُعتمد شيء.'); rec.teacherName = w.name; }
        var slot = rec.klass + '|' + rec.weekday + '|' + rec.period;
        if (taken[slot]) throw fail('INPUT', 'في الجدول المبني حصتان للصف ' + rec.klass + ' في موعد واحد. لم يُعتمد شيء.');
        taken[slot] = true; classes[rec.klass] = true; good.push(rec);
      });
      var gone = lessons.filter(function (l) { return l.stage === d.stage && classes[l.klass]; }), keep = lessons.filter(function (l) { return gone.indexOf(l) === -1; }), busy = {}, clashing = 0;
      keep.forEach(function (l) { if (l.teacher) busy[l.teacher + '|' + l.weekday + '|' + l.period] = true; });
      good.forEach(function (l) { if (!l.teacher) return; var k = l.teacher + '|' + l.weekday + '|' + l.period; if (busy[k]) clashing++; busy[k] = true; });
      lessons = keep.concat(good);
      var id = uid();
      backups[d.stage] = { id: id, by: me().email, added: good.map(function (l) { return l.id; }), removed: gone };
      log('schedule-applied', d.stage, { sessions: good.length, replaced: gone.length });
      return JSON.stringify({ ok: true, added: good.length, removed: gone.length, classes: Object.keys(classes).length, clashing: clashing, undoId: id });
    },
    api_undoApply: function (stage, undoId) {
      needLead(); needStage(stage);
      var rec = backups[stage];
      if (!rec || rec.id !== undoId || rec.by !== me().email) throw fail('GONE', 'لا يمكن التراجع عن هذا الاعتماد: اعتُمد بعده جدول آخر.');
      lessons = lessons.filter(function (l) { return rec.added.indexOf(l.id) === -1; }).concat(rec.removed);
      delete backups[stage];
      log('schedule-undone', stage, { restored: rec.removed.length });
      return JSON.stringify({ restored: rec.removed.length });
    },
    api_visits: function () {
      var u = me(), st = stages(u);
      if (LEAD.indexOf(u.role) === -1) return JSON.stringify({ lead: false, visits: visits.filter(function (r) { return r.teacher === u.email && r.shared; }).map(function (r) { return visitOut(r, false); }) });
      return JSON.stringify({ lead: true, kind: VROLE[u.role] || '', canEditForms: u.role === 'owner' || u.role === 'principal', forms: vforms, visits: visits.filter(function (r) { return st.indexOf(r.stage) !== -1; }).map(function (r) { return visitOut(r, false); }) });
    },
    api_visit: function (id) {
      var u = me(), r = visits.filter(function (x) { return x.id === id; })[0];
      if (!r) throw fail('GONE', 'الزيارة غير موجودة');
      if (LEAD.indexOf(u.role) !== -1) needStage(r.stage); else if (r.teacher !== u.email || !r.shared) throw fail('FORBIDDEN', 'هذه الزيارة ليست لك.');
      return JSON.stringify({ visit: visitOut(r, true) });
    },
    api_saveVisit: function (json) {
      needLead();
      var u = me(), d = JSON.parse(json), old = d.id ? visits.filter(function (x) { return x.id === d.id; })[0] : null, rec;
      if (d.id && !old) throw fail('GONE', 'الزيارة غير موجودة');
      if (old && old.by !== u.email) throw fail('FORBIDDEN', 'يعدّل الزيارة من سجّلها فقط.');
      needStage(old ? old.stage : d.stage);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d.date || ''))) throw fail('INPUT', 'اختر تاريخ الزيارة.');
      if (d.date > D.today) throw fail('INPUT', 'تاريخ الزيارة لا يكون في المستقبل.');
      if (old) rec = old;
      else {
        var who = users.filter(function (x) { return x.active && x.email === d.teacher && stages(x).indexOf(d.stage) !== -1; })[0], kind = VROLE[u.role] || (VKINDS.indexOf(d.kind) !== -1 ? d.kind : '');
        if (!who || who.email === u.email) throw fail('INPUT', 'اختر المعلم من منسوبي المرحلة.');
        if (!kind) throw fail('INPUT', 'اختر استمارة الزيارة.');
        rec = { id: uid(), stage: d.stage, teacher: who.email, teacherName: who.name, kind: kind, seenAt: '', by: u.email, byName: u.name, form: JSON.parse(JSON.stringify(vforms[kind])) };
      }
      var sc = vscore(rec.form, d.answers);
      rec.date = d.date; rec.klass = String(d.klass || '').trim().slice(0, 30); rec.subject = String(d.subject || '').trim().slice(0, 80); rec.period = d.period ? periodOf(d.period) : ''; rec.score = sc.score; rec.parts = sc.parts; rec.answers = sc.answers;
      rec.shared = d.shared !== false; rec.strengths = String(d.strengths || '').slice(0, 1500); rec.improve = String(d.improve || '').slice(0, 1500); rec.recommend = String(d.recommend || '').slice(0, 1500); rec.note = String(d.note || '').slice(0, 1500);
      if (!old) visits.push(rec);
      log(old ? 'visit-changed' : 'visit-recorded', rec.teacherName, { form: rec.kind, date: rec.date });
      return JSON.stringify({ visit: visitOut(rec, true) });
    },
    api_deleteVisit: function (id) {
      needLead();
      var u = me(), r = visits.filter(function (x) { return x.id === id; })[0];
      if (!r) throw fail('GONE', 'الزيارة غير موجودة');
      if (r.by !== u.email && u.role !== 'owner') throw fail('FORBIDDEN', 'يحذف الزيارة من سجّلها فقط.');
      visits.splice(visits.indexOf(r), 1);
      var undoId = uid(); undos[undoId] = { visit: r, by: u.email };
      return JSON.stringify({ undoId: undoId });
    },
    api_undoVisit: function (undoId) {
      var rec = undos[undoId];
      if (!rec || !rec.visit || rec.by !== me().email) throw fail('GONE', 'انتهت مهلة التراجع عن حذف هذه الزيارة.');
      delete undos[undoId]; visits.push(rec.visit);
      return JSON.stringify({ visit: visitOut(rec.visit, false) });
    },
    api_seenVisit: function (id) {
      var u = me(), r = visits.filter(function (x) { return x.id === id; })[0];
      if (!r || r.teacher !== u.email || !r.shared) throw fail('FORBIDDEN', 'هذه الزيارة ليست لك.');
      if (!r.seenAt) r.seenAt = new Date().toISOString();
      return JSON.stringify({ seen: true });
    },
    api_saveVisitForm: function (json) {
      var u = me(), d = JSON.parse(json), f = d.form || {};
      if (u.role !== 'owner' && u.role !== 'principal') throw fail('FORBIDDEN', 'يعدّل استمارات الزيارة مدير المدرسة أو مالك النظام.');
      if (VKINDS.indexOf(d.kind) === -1) throw fail('INPUT', 'استمارة غير معروفة');
      var scale = (f.scale || []).map(function (x) { return String(x).trim(); }).filter(String), sections = (f.sections || []).map(function (x) { return { title: String(x.title || '').trim() || 'بنود الاستمارة', items: (x.items || []).map(function (y) { return String(y).trim(); }).filter(String) }; }).filter(function (x) { return x.items.length; });
      if (!String(f.title || '').trim()) throw fail('INPUT', 'اكتب عنوان الاستمارة');
      if (scale.length < 2 || scale.length > 5) throw fail('INPUT', 'مقياس التقدير من مستويين إلى خمسة مستويات.');
      if (!sections.length) throw fail('INPUT', 'أضف بنداً واحداً على الأقل.');
      vforms[d.kind] = { kind: d.kind, title: String(f.title).trim().slice(0, 80), scale: scale, sections: sections };
      log('visit-form', d.kind, {});
      return JSON.stringify({ forms: vforms });
    },
    api_importUsers: function (json) {
      needLead();
      var u = me(), d = JSON.parse(json), list = d.rows || [], may = stages(u), seen = {}, out = [], adds = [], updates = [], counts = { added: 0, updated: 0, same: 0, error: 0 };
      if (!list.length) throw fail('INPUT', 'لا توجد صفوف في الملف.');
      if (list.length > 500) throw fail('INPUT', 'استورد 500 موظف على الأكثر في المرة الواحدة.');
      var phoneOf = function (v) { var x = latin(v).replace(/\.0+$/, '').replace(/\D/g, ''); if (/^00/.test(x)) x = x.slice(2); if (/^05\d{8}$/.test(x)) x = '966' + x.slice(1); else if (/^5\d{8}$/.test(x)) x = '966' + x; return x; };
      var stagesOf = function (v) { return (Array.isArray(v) ? v : String(v || '').split(/[,،;\n]/)).map(function (x) { return String(x || '').trim(); }).filter(String); };
      list.forEach(function (r, i) {
        var email = String(r.email || '').toLowerCase().trim(), name = String(r.name || '').trim().slice(0, 80), res = { line: r.line || i + 1, email: email, name: name, status: 'error', message: '' };
        out.push(res);
        try {
          if (!email) throw fail('INPUT', 'لا يوجد بريد مدرسي في هذا الصف.');
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.split('@')[1] !== settings.domain) throw fail('INPUT', 'البريد يجب أن يكون على نطاق المدرسة ' + settings.domain);
          if (seen[email]) throw fail('INPUT', 'البريد مكرر في الملف (السطر ' + seen[email] + ').');
          seen[email] = res.line;
          var phone = phoneOf(r.phone), old = users.filter(function (x) { return x.email === email; })[0], st = stagesOf(r.stages);
          if (phone && !/^\d{8,15}$/.test(phone)) throw fail('INPUT', 'رقم الواتساب غير صحيح: ' + String(r.phone).slice(0, 20));
          if (!st.length) st = d.stages || [];
          st.forEach(function (x) { if (may.indexOf(x) === -1) throw fail('INPUT', 'المرحلة خارج صلاحيتك: ' + x); });
          if (!old) {
            if (!name) throw fail('INPUT', 'لا يوجد اسم في هذا الصف.');
            if (!st.length) throw fail('INPUT', 'اختر المرحلة لهذا الموظف.');
            adds.push({ email: email, name: name, role: 'teacher', stages: st, active: true, aliases: [], phone: phone, channel: phone ? 'both' : 'email', major: String(r.major || '').trim(), position: String(r.position || '').trim() });
            res.status = 'new';
          } else {
            if (old.role === 'owner' && u.role !== 'owner') throw fail('FORBIDDEN', 'حساب مالك النظام يعدّله مالك النظام فقط.');
            var next = JSON.parse(JSON.stringify(old));
            next.name = name || old.name; next.phone = phone || old.phone; next.major = String(r.major || '').trim() || old.major || ''; next.position = String(r.position || '').trim() || old.position || '';
            if (old.stages.indexOf('*') === -1) st.forEach(function (x) { if (next.stages.indexOf(x) === -1) next.stages.push(x); });
            var was = JSON.parse(JSON.stringify(old)); was.major = old.major || ''; was.position = old.position || '';
            if (JSON.stringify(next) === JSON.stringify(was)) res.status = 'same'; else { updates.push({ old: old, next: next }); res.status = 'update'; }
            res.name = next.name;
          }
        } catch (e) { res.message = String(e.message).split('|').pop(); }
      });
      out.forEach(function (x) { counts[x.status === 'new' ? 'added' : x.status === 'update' ? 'updated' : x.status]++; });
      if (d.dryRun) return JSON.stringify({ rows: out, counts: counts });
      if (!adds.length && !updates.length) throw fail('INPUT', counts.error ? 'لا يوجد صف صالح للاستيراد. راجع الملاحظات على الصفوف.' : 'كل الموظفين في الملف موجودون ببياناتهم نفسها.');
      var id = uid();
      undos[id] = { by: u.email, added: adds.map(function (x) { return x.email; }), before: updates.map(function (x) { return JSON.parse(JSON.stringify(x.old)); }) };
      updates.forEach(function (x) { users[users.indexOf(x.old)] = x.next; });
      adds.forEach(function (x) { users.push(x); });
      log('users-imported', '', { added: adds.length, updated: updates.length }); buildBar();
      return JSON.stringify({ rows: out, counts: counts, undoId: id, users: JSON.parse(api.api_users()) });
    },
    api_undoImportUsers: function (undoId) {
      needLead();
      var rec = undos[undoId];
      if (!rec || !rec.added || rec.by !== me().email) throw fail('GONE', 'لا يمكن التراجع عن هذا الاستيراد: تم بعده استيراد آخر.');
      delete undos[undoId];
      users = users.filter(function (x) { return rec.added.indexOf(x.email) === -1; });
      rec.before.forEach(function (b) { users.forEach(function (x, i) { if (x.email === b.email) users[i] = b; }); });
      buildBar();
      return JSON.stringify({ removed: rec.added.length, restored: rec.before.length, users: JSON.parse(api.api_users()) });
    },
    api_readSheet: function (url) {
      needLead();
      if (!/\/d\/[-\w]{25,}/.test(String(url || ''))) throw fail('INPUT', 'الصق رابط ملف Google Sheets كاملاً.');
      return JSON.stringify({ name: 'كشف الموظفين (مثال للمعاينة)', tab: 'الموظفون', rows: [['الاسم', 'التخصص', 'المسمى الوظيفي', 'رقم الواتساب', 'البريد المدرسي'],
        ['خالد العتيبي', 'رياضيات', 'معلم', '0501112233', 'khalid@preview.example'], ['سامي الحربي', 'علوم', 'معلم أول', '0501112244', 'sami@preview.example'], ['فهد القحطاني', 'لغة عربية', 'معلم', '0501112255', 'fahad@preview.example']] });
    },
    api_planOptions: function (stage, kpi) {
      var u = me(), lead = LEAD.indexOf(u.role) !== -1;
      if (stages(u).indexOf(stage) === -1) throw fail('FORBIDDEN', 'هذه المرحلة خارج صلاحيتك.');
      if (!lead && !settings.planEdit) throw fail('FORBIDDEN', 'إضافة البرامج وحذفها غير متاحة للمعلمين حالياً. يفعّلها مديرو النظام من الإعدادات.');
      var n = D.programs.filter(function (p) { return p.kpi === kpi && p.stage === stage; }).length, open = kpi !== LOCKED_KPI && freeOf(stage, kpi) > 0;
      return JSON.stringify({ stage: stage, kpi: kpi, direct: lead, writeBack: settings.writeBack,
        tables: [{ index: 0, sub: '', programmes: n, free: freeOf(stage, kpi), open: open, reason: open ? '' : kpi === LOCKED_KPI ? CLOSED : 'لا يوجد صف فارغ في هذا الجدول.', fields: PLAN_FIELDS }] });
    },
    api_planRequest: function (json) {
      var u = me(), lead = LEAD.indexOf(u.role) !== -1, d = JSON.parse(json), rec;
      if (!lead && !settings.planEdit) throw fail('FORBIDDEN', 'إضافة البرامج وحذفها غير متاحة للمعلمين حالياً. يفعّلها مديرو النظام من الإعدادات.');
      if (d.type === 'add') {
        if (stages(u).indexOf(d.stage) === -1) throw fail('FORBIDDEN', 'هذه المرحلة خارج صلاحيتك.');
        if (d.kpi === LOCKED_KPI) throw fail('LOCKED', CLOSED);
        checkPlanValues(d.values || {});
        var show = PLAN_FIELDS.filter(function (f) { return d.values[f.id] !== undefined && d.values[f.id] !== ''; }).map(function (f) { return [f.label, String(d.values[f.id])]; });
        rec = { programKey: '', sheet: '', stage: d.stage, kpi: d.kpi, title: String(d.values.name).slice(0, 160), data: JSON.stringify({ table: 0, values: d.values, show: show }) };
      } else {
        var p = prog(d.programKey);
        if (!p) throw fail('GONE', 'البرنامج غير موجود في آخر مزامنة.');
        if (stages(u).indexOf(p.stage) === -1) throw fail('FORBIDDEN', 'هذه المرحلة خارج صلاحيتك.');
        if (!lead && assign[p.key] !== u.email && !(p.assignee && u.aliases.concat([u.name]).some(function (n) { return n.length > 3 && p.assignee.indexOf(n) !== -1; }))) throw fail('FORBIDDEN', 'يمكنك طلب حذف البرامج المسندة إليك فقط.');
        if (p.approved) throw fail('LOCKED', 'اعتمد الفرع الرئيسي هذا البرنامج في المنصة الشاملة، فلا يُحذف من هنا.');
        if (p.done || p.actual != null || p.evidence) throw fail('STATE', 'للبرنامج بيانات تنفيذ مسجلة، فلا يُحذف.');
        if (subs.some(function (x) { return x.type === 'remove' && x.status === 'pending' && x.programKey === p.key; })) throw fail('STATE', 'يوجد طلب حذف لهذا البرنامج بانتظار المراجعة.');
        rec = { programKey: p.key, sheet: p.sheet, stage: p.stage, kpi: p.kpi, title: p.name, data: '' };
      }
      var full = { id: uid(), createdAt: new Date().toISOString(), by: u.email, byName: u.name, type: d.type === 'add' ? 'add' : 'remove', programKey: rec.programKey, sheet: rec.sheet, stage: rec.stage, kpi: rec.kpi, title: rec.title,
        outcome: '', execDate: '', actual: '', evidence: '', note: String(d.note || '').slice(0, 500), status: 'pending', reviewedBy: '', reviewedAt: '', reviewNote: '', writeback: '', data: rec.data };
      subs.push(full); log('plan-request', rec.title, { type: full.type });
      if (!lead) return JSON.stringify({ submission: full });
      try { return decidePlan(full, ''); } catch (e) { subs.splice(subs.indexOf(full), 1); throw e; }
    },
    api_weekly: function () {
      var u = me(), st = stages(u), R = window.AP.rules, lastWeek = window.AP.shiftDay(D.today, -7);
      if (LEAD.indexOf(u.role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.');
      var opts = { today: D.today, users: users, assign: assign, submissions: subs };
      var make = function (list) {
        var ps = D.programs.filter(function (p) { return list.indexOf(p.stage) !== -1; }), sum = window.AP.weeklySummary(ps, opts), was = R.counts(ps, lastWeek);
        // the preview keeps no history, so "last week" is worked out from the same dates as they stood seven days ago
        sum.stages = list; sum.prev = was; sum.prev.date = lastWeek; sum.prev.total = ps.length;
        return sum;
      };
      var out = { today: D.today, to: window.AP.shiftDay(D.today, 6), schools: {}, stages: {} };
      st.forEach(function (x) { out.stages[x] = make([x]); });
      ['private', 'intl'].forEach(function (k) { var list = st.filter(function (x) { return R.schoolOf(x) === k; }); if (list.length) out.schools[k] = make(list); });
      return JSON.stringify(out);
    },
    api_sendMyWeekly: function () { if (LEAD.indexOf(me().role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.'); log('weekly-report-test', me().email, {}); return ''; },
    api_uploadEvidence: function (json) {
      var d = JSON.parse(json), u = me(), p = d.programKey ? prog(d.programKey) : null, stage = p ? p.stage : d.stage;
      if (d.programKey && !p) throw fail('GONE', 'البرنامج غير موجود في آخر مزامنة.');
      if (stages(u).indexOf(stage) === -1) throw fail('FORBIDDEN', 'هذه المرحلة خارج صلاحيتك.');
      if (['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].indexOf(d.mime) === -1) throw fail('INPUT', 'يُقبل ملف صورة أو PDF فقط.');
      if (!d.data || d.data.length > 8200000) throw fail('INPUT', 'الملف أكبر من المسموح (6 ميجابايت) أو غير صالح.');
      var name = D.today + ' ' + (p ? p.name : 'عمل على المؤشر') + ' - ' + u.name + (d.mime === 'application/pdf' ? '.pdf' : '.jpg');
      log('evidence-uploaded', p ? p.name : stage, { bytes: Math.round(d.data.length * 3 / 4) });
      return JSON.stringify({ url: 'https://drive.google.com/file/d/preview-' + uid() + '/view', name: name, shared: true, message: 'معاينة: لم يُحفظ الملف فعلياً' });
    },
    api_public: function () { return JSON.stringify({ slogan: settings.slogan, welcome: settings.welcome }); },
    api_savePhoto: function (data) {
      var s = String(data || '');
      if (s && (s.length > 48000 || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/]+=*$/.test(s))) throw fail('INPUT', 'الصورة غير صالحة أو أكبر من المسموح.');
      photos[me().email] = s; log(s ? 'photo-saved' : 'photo-removed', me().email, '');
      return JSON.stringify({ photo: s });
    },
    api_withdraw: function (id) {
      var s = subs.filter(function (x) { return x.id === id; })[0];
      if (!s || s.by !== me().email) throw fail('GONE', 'التقرير غير موجود');
      if (s.status !== 'pending') throw fail('STATE', 'رُوجع التقرير ولا يمكن سحبه.');
      subs = subs.filter(function (x) { return x.id !== id; }); log('report-withdrawn', s.title, { id: id });
      return '';
    },
    api_reopen: function (id) {
      if (LEAD.indexOf(me().role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لقيادة المرحلة فقط.');
      var s = subs.filter(function (x) { return x.id === id; })[0], program = null;
      if (!s) throw fail('GONE', 'التقرير غير موجود');
      if (s.status === 'pending') throw fail('STATE', 'التقرير بانتظار المراجعة أصلاً.');
      if (s.undo && s.undo.plan) { revertPlan(s); s.status = 'pending'; s.reviewedBy = ''; s.reviewedAt = ''; s.reviewNote = ''; s.writeback = ''; s.undo = null; return JSON.stringify({ submission: s, program: null, boot: api.api_bootstrap() }); }
      if (s.undo) program = writeBack(s.programKey, s.undo).program || null;
      s.status = 'pending'; s.reviewedBy = ''; s.reviewedAt = ''; s.reviewNote = ''; s.writeback = ''; s.undo = null;
      log('review-undone', s.title, { id: id });
      return JSON.stringify({ submission: s, program: program });
    },
    // Professional development, kept in memory for the preview. The rules mirror the server's: admins follow the staff of their stages.
    api_devList: function () {
      var u = me(), adm = LEAD.indexOf(u.role) !== -1, st = stages(u), inScope = function (x) { return stages(x).some(function (s) { return st.indexOf(s) !== -1; }); };
      if (!adm) return JSON.stringify({ admin: false, items: devItems.filter(function (r) { return r.email === u.email; }) });
      var ok = users.filter(inScope);
      return JSON.stringify({ admin: true, items: devItems.filter(function (r) { return ok.some(function (x) { return x.email === r.email; }); }), people: ok.map(function (x) { return { email: x.email, name: x.name }; }) });
    },
    api_saveDev: function (json) {
      needLead();
      var d = JSON.parse(json), who = users.filter(function (x) { return x.email === d.email; })[0];
      if (!who) throw fail('INPUT', 'اختر موظفاً من مراحلك.');
      if (!String(d.title || '').trim()) throw fail('INPUT', 'اكتب عنوان البند.');
      var rec = { id: 'dev' + (devItems.length + 1) + '-' + Date.now(), email: who.email, name: who.name, kind: d.kind || 'other', title: String(d.title).trim(), status: d.status || 'todo', due: d.due || '', note: d.note || '', source: 'manual' };
      devItems.push(rec);
      return JSON.stringify(rec);
    },
    api_setDevStatus: function (id, status) {
      var r = devItems.filter(function (x) { return x.id === id; })[0];
      if (!r) throw fail('GONE', 'البند غير موجود.');
      r.status = status;
      return JSON.stringify(r);
    },
    api_deleteDev: function (id) { needLead(); devItems = devItems.filter(function (x) { return x.id !== id; }); return ''; },
    api_myCalendar: function () { return JSON.stringify({ tasks: LEAD.indexOf(me().role) !== -1 ? own(tasks).map(bare) : [], sessions: own(sessions).map(bare) }); },
    api_saveTask: function (json) {
      if (LEAD.indexOf(me().role) === -1) throw fail('FORBIDDEN', 'هذا الإجراء لمديري النظام فقط.');
      var d = JSON.parse(json), isDay = function (v) { return /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')); };
      var rec = { id: String(d.id || ''), title: String(d.title || '').trim().slice(0, 140), note: String(d.note || '').slice(0, 500), date: isDay(d.date) ? d.date : '', repeat: ['none', 'daily', 'weekly'].indexOf(d.repeat) !== -1 ? d.repeat : 'none',
        time: isTime(d.time) ? d.time : '', until: isDay(d.until) ? d.until : '', notify: d.notify !== false, done: (Array.isArray(d.done) ? d.done : []).filter(isDay) };
      if (!rec.title || !rec.date) throw fail('INPUT', 'اكتب عنوان المهمة وتاريخها');
      if (rec.until && rec.until < rec.date) throw fail('INPUT', 'تاريخ الانتهاء قبل تاريخ البداية');
      return saveOwn(tasks, rec);
    },
    api_deleteTask: function (id) { return dropOwn(tasks, String(id)); },
    api_saveSession: function (json) {
      var d = JSON.parse(json), wd = Math.floor(Number(d.weekday));
      var rec = { id: String(d.id || ''), weekday: wd, start: isTime(d.start) ? d.start : '', end: isTime(d.end) ? d.end : '', subject: String(d.subject || '').trim().slice(0, 80), klass: String(d.klass || '').slice(0, 40), room: String(d.room || '').slice(0, 40) };
      if (!(wd >= 0 && wd <= 6) || !rec.start || !rec.end || rec.end <= rec.start) throw fail('INPUT', 'اختر اليوم ووقت بداية ونهاية صحيحين');
      if (!rec.subject) throw fail('INPUT', 'اكتب المادة');
      return saveOwn(sessions, rec);
    },
    api_deleteSession: function (id) { return dropOwn(sessions, String(id)); }
  };
  window.__MOCK__ = function (fn, args) {
    return new Promise(function (res, rej) { setTimeout(function () { try { res(api[fn].apply(null, args)); } catch (e) { rej(e); } }, 180); });
  };
  function buildBar() {
    var bar = document.getElementById('previewBar'), box = document.getElementById('previewIn');
    while (box.firstChild) box.removeChild(box.firstChild);
    var b = document.createElement('b'); b.textContent = 'نسخة معاينة · Preview';
    var s = document.createElement('span'); s.textContent = 'البيانات من نسخة 15 نوفمبر 2026 وغير مربوطة بالملف الحي. ما تغيّره هنا لا يُحفظ.';
    var l = document.createElement('label');
    l.appendChild(document.createTextNode('اعرض بصفة · View as'));
    var sel = document.createElement('select'); sel.id = 'viewAs';
    users.forEach(function (u, i) { if (!u.active) return; var o = document.createElement('option'); o.value = i; o.textContent = u.name; if (i === cur) o.selected = true; sel.appendChild(o); });
    sel.addEventListener('change', function () { cur = +sel.value; window.__AP_RELOAD__(); });
    l.appendChild(sel); box.appendChild(b); box.appendChild(s); box.appendChild(l); bar.hidden = false;
  }
  buildBar();
})();
