  /* ---------- the schedule builder: classes, weekly sessions, teachers and instructions in; a designed schedule out ---------- */
  var TXB = {
    ar: {
      builder: 'منشئ الجدول', blLead: 'يصمّم جدول الحصص من خطة الصفوف والمعلمين وأنصبتهم والتعليمات، ثم تعتمده في الجدول المدرسي بضغطة واحدة.',
      bl_plan: '1 · الخطة', bl_teachers: '2 · المعلمون', bl_assign: '3 · الإسناد', bl_rules: '4 · التعليمات', bl_build: '5 · البناء',
      blDay: 'اليوم الدراسي', blDayLead: 'عدد الحصص في كل يوم. أوقات الحصص تُضبط من زر «أوقات الحصص».', blWeekCap: 'حصص الأسبوع', blTimesNow: 'الدوام',
      blMatrix: 'الصفوف والمواد', blMatrixLead: 'اكتب عدد حصص كل مادة في الأسبوع لكل صف. اضغط اسم الصف أو المادة لتعديله أو حذفه.', blAddClass: 'إضافة صفوف', blAddSubject: 'إضافة مادة', blPaste: 'لصق من Excel',
      blClassNames: 'أسماء الصفوف', blClassNamesHint: 'كل صف في سطر، أو افصل بينها بفاصلة. مثال: 4A، 4B، 5A', blCopyFrom: 'انسخ خطة صف', blCopyNone: 'بدون نسخ',
      blSubjectName: 'اسم المادة', blWeekly: 'حصصها في الأسبوع لكل صف', blTotal: 'المجموع', blNoPlan: 'ابدأ بإضافة الصفوف ثم المواد.', blRename: 'الاسم', blRemove: 'حذف', blRemoveSure: 'تأكيد الحذف',
      blExists: 'الاسم موجود من قبل، أو لم يُكتب اسم.', blPastePlanHelp: 'الصق جدولاً من Excel: السطر الأول أسماء المواد، وكل سطر بعده يبدأ باسم الصف ثم عدد حصص كل مادة.', blPastePlanEx: 'الصف\tMaths\tEnglish\n4A\t6\t5\n4B\t6\t5',
      blPasteBad: 'تعذرت قراءة الجدول الملصق. تأكد من سطر العناوين ومن أن الخانات أرقام.', blAdd: 'إضافة', blPasteL: 'الجدول الملصق',
      blTeachersLead: 'معلمو المرحلة، وما يدرّسه كل منهم، ونصابه الأسبوعي من الحصص.', blAddTeacher: 'إضافة معلم', blAddStaff: 'أضف معلمي المرحلة', blStaffAdded: 'أُضيف من منسوبي المرحلة:', blNoStaff: 'كل معلمي المرحلة مضافون.',
      blTeacher: 'المعلم', blTypedName: 'اسم آخر (ليس له حساب)', blSubjects: 'المواد', blQuota: 'النصاب', blQuotaL: 'النصاب الأسبوعي (حصص)', blAssigned: 'المسند', blMaxDay: 'أقصى حصص في اليوم', blNoLimit: 'بلا حد',
      blNoTeachers: 'لم يُضف معلمون بعد.', blNeedName: 'اختر المعلم أو اكتب اسمه.', blPasteTeachersHelp: 'الصق من Excel: اسم المعلم، ثم مواده (بينها +)، ثم نصابه. المادة غير الموجودة تُضاف إلى الخطة.', blPasteTeachersEx: 'خالد العتيبي\tMaths\t24\nسامي الحربي\tScience + ICT\t22',
      blAssignLead: 'من يدرّس كل مادة لكل صف. «توزيع تلقائي» يملأ الخانات الفارغة في حدود الأنصبة، ولك تغيير أي خانة.', blAuto: 'توزيع تلقائي', blAutoAll: 'إعادة التوزيع من جديد', blAutoSure: 'تأكيد: يمسح الإسناد الحالي',
      blAutoDone: 'خانات أُسندت:', blAutoLeft: 'بقيت بلا معلم:', blUnassigned: 'خانات بلا معلم', blAllAssigned: 'كل المواد لها معلم.', blShort: 'لا يكفي نصاب معلمي المادة', blNoTeacherFor: 'لا يوجد معلم لهذه المادة', blOthers: 'معلمون آخرون',
      blLoads: 'أنصبة المعلمين', blNeedPlan: 'أكمل «الخطة» و«المعلمون» أولاً.', blOver: 'فوق النصاب', blWithin: 'ضمن النصاب',
      blRulesLead: 'تعليمات يتبعها المنشئ. الإلزامية لا تُخالَف أبداً، والمفضّلة تُتّبع قدر الإمكان ويذكر التقرير ما خولف منها.', blAddRule: 'إضافة تعليمة',
      blNoRules: 'لا توجد تعليمات. يبني المنشئ بقواعده الأساسية: لا تعارض، ولا فراغ داخل يوم الصف، وتوزيع متوازن.',
      blRuleType: 'نوع التعليمة', rt_off: 'معلم غير متاح في وقت معين', rt_window: 'مادة في حصص معينة فقط', rt_maxDay: 'أقصى حصص للمعلم في اليوم', rt_streak: 'أقصى حصص متتالية للمعلم', rt_subjectDay: 'عدد حصص المادة في اليوم',
      rt_together: 'مادة تتشارك مكاناً واحداً (ملعب، معمل)', rt_fixed: 'حصة ثابتة أو مغلقة (نشاط، طابور)',
      blMust: 'إلزامية', blPrefer: 'مفضّلة', blStrength: 'القوة', blEveryDay: 'كل الأيام', blDaysL: 'الأيام (اتركها فارغة لكل الأيام)', blFrom: 'من الحصة', blTo: 'إلى الحصة', blAllTeachers: 'كل المعلمين', blAllClasses: 'كل الصفوف', blHowMany: 'العدد',
      blLabel: 'اسم الحصة (اتركه فارغاً لإغلاق الموعد)', blClosed: 'مغلقة', blAllDay: 'اليوم كله', rl_off: 'بلا حصص', rl_window: 'في الحصص', rl_only: 'فقط', rl_maxDay: 'لا يزيد عن {n} حصص في اليوم', rl_streak: 'لا يزيد عن {n} حصص متتالية',
      rl_subjectDay: 'حتى {n} في اليوم للصف', rl_together: 'لا تجتمع لأكثر من {n} صف في الوقت نفسه', blRuleNeeds: 'أكمل خانات التعليمة. أضف المعلمين والمواد أولاً إن لم تكن موجودة.',
      blCheck: 'فحص الإعداد', blReady: 'الإعداد جاهز للبناء.', blGo: 'ابنِ الجدول', blAgain: 'تصميم آخر', blWorking: 'جارٍ بناء الجدول…', blClassesW: 'صف', blTeachersW: 'معلم', blRulesW: 'تعليمة',
      e_empty: 'لا توجد حصص في الخطة. أضف الصفوف والمواد وأعدادها.', e_classOver: 'الصف {klass}: {n} حصة في الخطة والمتاح {m}.', e_teacherOver: '{teacher}: {n} حصة مسندة ووقته المتاح {m}.', e_subjectCap: '{subject} للصف {klass}: {n} حصص لا تكفيها {m} في اليوم.',
      w_quota: '{teacher}: {n} حصة مسندة ونصابه {m}.', w_noTeacher: '{n} خانة بلا معلم: توضع حصصها دون مراعاة معلم.', w_classFree: 'الصف {klass}: {n} حصص فراغ، تُجعل في آخر الأيام.', w_classEmpty: 'الصف {klass} بلا حصص.',
      blPlaced: 'حصص وُضعت', blClassGaps: 'فراغات داخل يوم الصف', blTeacherGaps: 'حصص انتظار للمعلمين', blRulesKept: 'تعليمات اتُّبعت', blClashes: 'تعارضات', blLongest: 'أطول يوم لمعلم',
      blUnplaced: 'حصص لم يجد لها المنشئ موعداً', blUnplacedHint: 'خفّف تعليمة إلزامية، أو غيّر إسناد المعلم، أو زد حصص اليوم، ثم ابنِ من جديد.', blRuleReport: 'التعليمات في هذا التصميم', blKept: 'اتُّبعت', blBroken: 'خولفت', blTimesW: 'مرة',
      blDraft: 'الجدول المبني', blByClass: 'حسب الصف', blByTeacher: 'حسب المعلم', blTeacherDays: 'حصص المعلمين في الأسبوع', blGaps: 'انتظار', blApply: 'اعتماد في الجدول المدرسي', blApplySure: 'تأكيد: يستبدل جدول {c} صف ({n} حصة حالية)',
      blApplied: 'اعتُمد الجدول. حصص:', blAppliedClash: 'تعارض مع صفوف خارج البناء:', blApplyUndo: 'اعتماد الجدول المبني', blNotBuilt: 'اضغط «ابنِ الجدول» ليصمّم المنشئ الجدول من الإعداد الحالي.', blBusy: 'يُبقي المنشئ {n} موعداً خالياً لمعلمين لهم فيها حصص في صفوف خارج هذا البناء.', blSeed: 'تصميم رقم', blOpen: 'منشئ الجدول'
    },
    en: {
      builder: 'Schedule builder', blLead: "Designs the sessions schedule from the classes' plan, the teachers and their quotas, and your instructions. One click then puts it into the school timetable.",
      bl_plan: '1 · Plan', bl_teachers: '2 · Teachers', bl_assign: '3 · Assignment', bl_rules: '4 · Instructions', bl_build: '5 · Build',
      blDay: 'The school day', blDayLead: 'Sessions on each day. Session times are set with the "Session times" button.', blWeekCap: 'Sessions a week', blTimesNow: 'Hours',
      blMatrix: 'Classes and subjects', blMatrixLead: 'Type how many sessions a week each class has of each subject. Select a class or subject name to rename or remove it.', blAddClass: 'Add classes', blAddSubject: 'Add subject', blPaste: 'Paste from Excel',
      blClassNames: 'Class names', blClassNamesHint: 'One per line, or separated by commas. Example: 4A, 4B, 5A', blCopyFrom: "Copy a class's plan", blCopyNone: 'Do not copy',
      blSubjectName: 'Subject name', blWeekly: 'Sessions a week for every class', blTotal: 'Total', blNoPlan: 'Start by adding classes, then subjects.', blRename: 'Name', blRemove: 'Remove', blRemoveSure: 'Confirm removal',
      blExists: 'That name is already there, or no name was typed.', blPastePlanHelp: 'Paste a table from Excel: the first line holds the subject names; each line after it starts with the class, then its sessions for each subject.', blPastePlanEx: 'Class\tMaths\tEnglish\n4A\t6\t5\n4B\t6\t5',
      blPasteBad: 'The pasted table could not be read. Check the heading line and that the cells are numbers.', blAdd: 'Add', blPasteL: 'Pasted table',
      blTeachersLead: "The stage's teachers, what each one teaches, and their weekly quota of sessions.", blAddTeacher: 'Add teacher', blAddStaff: "Add the stage's teachers", blStaffAdded: 'Added from the staff list:', blNoStaff: "All the stage's teachers are already added.",
      blTeacher: 'Teacher', blTypedName: 'Another name (no account)', blSubjects: 'Subjects', blQuota: 'Quota', blQuotaL: 'Weekly quota (sessions)', blAssigned: 'Assigned', blMaxDay: 'Most sessions in a day', blNoLimit: 'No limit',
      blNoTeachers: 'No teachers added yet.', blNeedName: 'Choose the teacher or type a name.', blPasteTeachersHelp: 'Paste from Excel: teacher name, then subjects (separated by +), then quota. A subject that is not in the plan is added to it.', blPasteTeachersEx: 'Khalid Otaibi\tMaths\t24\nSami Harbi\tScience + ICT\t22',
      blAssignLead: 'Who teaches each subject to each class. "Distribute" fills the empty cells within the quotas; you can change any cell.', blAuto: 'Distribute', blAutoAll: 'Distribute again from nothing', blAutoSure: 'Confirm: clears the current assignment',
      blAutoDone: 'Cells assigned:', blAutoLeft: 'Left without a teacher:', blUnassigned: 'Cells without a teacher', blAllAssigned: 'Every subject has a teacher.', blShort: "the subject's teachers have no quota left", blNoTeacherFor: 'no teacher has this subject', blOthers: 'Other teachers',
      blLoads: "Teachers' loads", blNeedPlan: 'Complete "Plan" and "Teachers" first.', blOver: 'Over quota', blWithin: 'Within quota',
      blRulesLead: 'Instructions the builder follows. A "must" is never broken; a "prefer" is followed as far as possible, and the report says where it was not.', blAddRule: 'Add instruction',
      blNoRules: "No instructions. The builder uses its basic rules: no clashes, no free session inside a class's day, and a balanced spread.",
      blRuleType: 'Kind of instruction', rt_off: 'A teacher is not available at certain times', rt_window: 'A subject only in certain sessions', rt_maxDay: "A teacher's most sessions in a day", rt_streak: "A teacher's most sessions in a row", rt_subjectDay: "A subject's sessions in one day",
      rt_together: 'A subject that shares one place (playground, lab)', rt_fixed: 'A fixed or closed session (activity, assembly)',
      blMust: 'Must', blPrefer: 'Prefer', blStrength: 'Strength', blEveryDay: 'every day', blDaysL: 'Days (leave empty for every day)', blFrom: 'From session', blTo: 'To session', blAllTeachers: 'All teachers', blAllClasses: 'all classes', blHowMany: 'Number',
      blLabel: 'Name of the session (leave empty to close the slot)', blClosed: 'closed', blAllDay: 'all day', rl_off: 'no sessions', rl_window: 'in sessions', rl_only: 'only', rl_maxDay: 'at most {n} sessions a day', rl_streak: 'at most {n} sessions in a row',
      rl_subjectDay: 'up to {n} a day for a class', rl_together: 'at most {n} class(es) at the same time', blRuleNeeds: 'Complete the instruction. Add teachers and subjects first if there are none.',
      blCheck: 'Setup check', blReady: 'The setup is ready to build.', blGo: 'Build the schedule', blAgain: 'Another design', blWorking: 'Building the schedule…', blClassesW: 'classes', blTeachersW: 'teachers', blRulesW: 'instructions',
      e_empty: 'The plan has no sessions. Add classes, subjects and their numbers.', e_classOver: 'Class {klass}: {n} sessions planned, {m} available.', e_teacherOver: '{teacher}: {n} sessions assigned, {m} free.', e_subjectCap: '{subject} for {klass}: {n} sessions do not fit at {m} a day.',
      w_quota: '{teacher}: {n} sessions assigned, quota {m}.', w_noTeacher: '{n} cells have no teacher: their sessions are placed without one.', w_classFree: 'Class {klass}: {n} free sessions, kept at the ends of days.', w_classEmpty: 'Class {klass} has no sessions.',
      blPlaced: 'Sessions placed', blClassGaps: "Gaps inside a class's day", blTeacherGaps: "Teachers' waiting sessions", blRulesKept: 'Instructions followed', blClashes: 'Clashes', blLongest: "Longest teacher's day",
      blUnplaced: 'Sessions the builder found no time for', blUnplacedHint: "Relax a \"must\" instruction, change the teacher's assignment, or add sessions to the day, then build again.", blRuleReport: 'Instructions in this design', blKept: 'Followed', blBroken: 'Not followed', blTimesW: 'time(s)',
      blDraft: 'The built schedule', blByClass: 'By class', blByTeacher: 'By teacher', blTeacherDays: "Teachers' sessions over the week", blGaps: 'Waiting', blApply: 'Put into the school timetable', blApplySure: 'Confirm: replaces the schedule of {c} class(es) ({n} sessions now)',
      blApplied: 'Schedule applied. Sessions:', blAppliedClash: 'clashes with classes outside the build:', blApplyUndo: 'Apply the built schedule', blNotBuilt: 'Select "Build the schedule" and the builder designs it from the current setup.', blBusy: 'The builder keeps {n} slot(s) free for teachers who already have sessions there in classes outside this build.', blSeed: 'Design', blOpen: 'Schedule builder'
    }
  };
  Object.keys(TXB).forEach(function (l) { Object.keys(TXB[l]).forEach(function (k) { TX[l][k] = TXB[l][k]; }); });
  ICON.builder = 'M4 5h16v14H4zM4 10h16M9.5 10v9M15.5 12.2l.9 1.9 1.9.9-1.9.9-.9 1.9-.9-1.9-1.9-.9 1.9-.9z';

  function plReset() { S.pl = null; S.plUi = { tab: 'plan', stage: '', run: null, mode: 'class', pick: '', note: null, seed: 1 }; }
  plReset();
  var plLoading = false, plQueue = Promise.resolve();
  function plBlank() { return { dayLen: [8, 8, 8, 8, 8], classes: [], subjects: [], teachers: [], loads: [], rules: [] }; }
  function plEntry(stage) { return S.pl.setups[stage] || (S.pl.setups[stage] = { setup: plBlank(), at: '' }); }
  function plStage() { var all = stagesShown(); return S.f.stage || (all.indexOf(S.plUi.stage) !== -1 ? S.plUi.stage : all[0]) || ''; }
  /** The builder needs its saved setups, the school schedule (for the session times) and the staff list. */
  function plReady(v) {
    if (S.pl && S.tt && S.users) return true;
    v.appendChild(h('div', { class: 'spin' }));
    if (plLoading) return false;
    plLoading = true;
    Promise.all([S.pl ? null : call('api_planner').then(function (r) { S.pl = { setups: JSON.parse(r).setups }; }), S.tt ? null : call('api_timetable').then(function (r) { S.tt = JSON.parse(r); }),
      S.users ? null : call('api_users').then(function (r) { S.users = JSON.parse(r); })])
      .then(function () { plLoading = false; if (S.view === 'builder') paintMain(); }, function (e) { plLoading = false; toast(errText(e), true); });
    return false;
  }
  /** Sends a whole setup. Saves are kept in order, so each one starts from the version before it. */
  function plPush(stage, json) {
    var e = plEntry(stage);
    var mine = plQueue.then(function () { return call('api_savePlanner', JSON.stringify({ stage: stage, setup: JSON.parse(json), base: e.at })); }).then(function (res) { e.at = JSON.parse(res).at; });
    plQueue = mine.catch(function () {});
    return mine;
  }
  /** One change to the setup: saved at once, and recorded so it can be undone. quiet: the page keeps its place (typing in the table). */
  function plCommit(label, change, quiet) {
    var stage = plStage(), e = plEntry(stage), before = JSON.stringify(e.setup);
    change(e.setup);
    var after = JSON.stringify(e.setup);
    if (after === before) return false;
    S.plUi.run = null;                                   // a built design belongs to the setup it was built from
    var lost = function (er) { toast(errText(er), true); S.pl = null; if (S.view === 'builder') paintMain(); throw er; };
    var put = function (json) {
      if (!S.pl) return Promise.reject(new Error('|' + t('loading')));
      S.plUi.run = null; plEntry(stage).setup = JSON.parse(json);
      return plPush(stage, json).catch(lost);
    };
    plPush(stage, after).catch(lost).catch(function () {});
    record(t('builder') + ' · ' + label, function () { return put(before); }, function () { return put(after); });
    if (quiet) paintTop(); else render();
    return true;
  }
  function newId(p) { return p + Math.random().toString(36).slice(2, 9); }
  function latin(v) { return String(v == null ? '' : v).replace(/[٠-٩]/g, function (d) { return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); }); }
  function tidy(v, max) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max); }
  function splitNames(text, max) { var out = []; String(text).split(/[\n\t,،;]+/).forEach(function (x) { x = tidy(x, max); if (x && out.indexOf(x) === -1) out.push(x); }); return out; }
  function pasted(text) { return String(text).split(/\r?\n/).map(function (line) { return (line.indexOf('\t') !== -1 ? line.split('\t') : line.split(/\s*[;,،]\s*/)).map(function (x) { return x.trim(); }); }).filter(function (c) { return c.join('') !== ''; }); }
  function fillT(key, o) { return t(key).replace(/\{(\w+)\}/g, function (_, k) { return o[k] == null ? '' : o[k]; }); }
  function byName(a, b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; }
  function loadOf(su, k, s) { for (var i = 0; i < su.loads.length; i++) if (su.loads[i].klass === k && su.loads[i].subject === s) return su.loads[i]; return null; }
  function countOf(su, k, s) { var l = loadOf(su, k, s); return l ? l.count : 0; }
  function setCount(su, k, s, n) { var l = loadOf(su, k, s); if (n > 0) { if (l) l.count = n; else su.loads.push({ klass: k, subject: s, count: n, teacher: '' }); } else if (l) su.loads.splice(su.loads.indexOf(l), 1); }
  function teacherOf(su, id) { return su.teachers.filter(function (w) { return w.id === id; })[0] || null; }
  function assignedOf(su, id) { var n = 0; su.loads.forEach(function (l) { if (l.teacher === id) n += l.count; }); return n; }
  /** Sessions a class can hold in a week: the days' lengths, less the fixed and closed sessions. */
  function capacityOf(su, k) {
    var n = 0, hit = {};
    su.dayLen.forEach(function (x) { n += x; });
    su.rules.forEach(function (r) { if (r.type === 'fixed' && (!r.klass || r.klass === k) && r.period <= su.dayLen[r.day]) hit[r.day + '-' + r.period] = 1; });
    return n - Object.keys(hit).length;
  }
  function pickOf(id, items, value) {
    var s = h('select', { id: id });
    items.forEach(function (o) { var op = h('option', { value: o[0], text: o[1] }); if (String(o[0]) === String(value == null ? '' : value)) op.selected = true; s.appendChild(op); });
    return s;
  }
  function numbers(a, b) { var out = []; for (var k = a; k <= b; k++) out.push([k, String(k)]); return out; }
  /** A button that asks once more before a removal. */
  function sureBtn(id, label, sureLabel, fn) {
    var b = h('button', { class: 'btn bad', type: 'button', id: id }, label), armed = false;
    b.addEventListener('click', function () { if (!armed) { armed = true; clear(b); add(b, sureLabel); return; } fn(); });
    return b;
  }

  /* ---- step 1: the plan ---- */
  function classSheet() {
    var su = plEntry(plStage()).setup, box = h('textarea', { id: 'bcNames', rows: '4', dir: 'auto', required: true }), from = pickOf('bcCopy', [['', t('blCopyNone')]].concat(su.classes.map(function (k) { return [k, k]; })), '');
    showSheet(t('blAddClass'), h('section', { class: 'box' }, h('form', { class: 'form', id: 'bcForm', onsubmit: function (e) {
      e.preventDefault();
      var names = splitNames(box.value, 30), src = from.value, added = 0;
      plCommit(t('blAddClass'), function (x) {
        names.forEach(function (k) {
          if (x.classes.indexOf(k) !== -1 || x.classes.length >= 60) return;
          x.classes.push(k); added++;
          if (src) x.loads.filter(function (l) { return l.klass === src; }).forEach(function (l) { x.loads.push({ klass: k, subject: l.subject, count: l.count, teacher: '' }); });
        });
      });
      if (!added) { toast(t('blExists'), true); return; }
      closeSheet();
    } }, field(t('blClassNames'), box, t('blClassNamesHint')), su.classes.length ? field(t('blCopyFrom'), from) : null, h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'bcSave' }, t('blAdd'))))));
    box.focus();
  }
  function subjectSheet() {
    var name = h('input', { type: 'text', id: 'bsName', maxlength: '80', required: true }), n = h('input', { type: 'number', id: 'bsCount', min: '0', max: '20', inputmode: 'numeric', value: '' });
    showSheet(t('blAddSubject'), h('section', { class: 'box' }, h('form', { class: 'form', id: 'bsForm', onsubmit: function (e) {
      e.preventDefault();
      var s = tidy(name.value, 80), count = Math.max(0, Math.min(20, Math.floor(+latin(n.value)) || 0)), added = false;
      plCommit(t('blAddSubject') + ' · ' + s, function (x) {
        if (!s || x.subjects.indexOf(s) !== -1 || x.subjects.length >= 40) return;
        x.subjects.push(s); added = true;
        if (count) x.classes.forEach(function (k) { setCount(x, k, s, count); });
      });
      if (!added) { toast(t('blExists'), true); return; }
      closeSheet();
    } }, field(t('blSubjectName'), name), field(t('blWeekly'), n), h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'bsSave' }, t('blAdd'))))));
    name.focus();
  }
  /** Rename or remove a class or a subject, everywhere it is used. */
  function nameSheet(kind, name) {
    var isClass = kind === 'class', inp = h('input', { type: 'text', id: 'bnName', maxlength: isClass ? '30' : '80', required: true, value: name });
    var touch = function (x, next) {
      var list = isClass ? x.classes : x.subjects, at = list.indexOf(name);
      if (at === -1) return false;
      if (next === null) list.splice(at, 1); else list[at] = next;
      x.loads = x.loads.filter(function (l) { var hit = isClass ? l.klass === name : l.subject === name; if (hit && next !== null) { if (isClass) l.klass = next; else l.subject = next; } return !hit || next !== null; });
      x.rules = x.rules.filter(function (r) { var hit = isClass ? r.klass === name : r.subject === name; if (hit && next !== null) { if (isClass) r.klass = next; else r.subject = next; } return !hit || next !== null; });
      if (!isClass) x.teachers.forEach(function (w) { var i = w.subjects.indexOf(name); if (i !== -1) { if (next === null) w.subjects.splice(i, 1); else w.subjects[i] = next; } });
      return true;
    };
    showSheet(name, h('section', { class: 'box' }, h('form', { class: 'form', id: 'bnForm', onsubmit: function (e) {
      e.preventDefault();
      var next = tidy(inp.value, isClass ? 30 : 80), su = plEntry(plStage()).setup;
      if (next === name) { closeSheet(); return; }
      if (!next || (isClass ? su.classes : su.subjects).indexOf(next) !== -1) { toast(t('blExists'), true); return; }
      plCommit(name + ' ← ' + next, function (x) { touch(x, next); });
      closeSheet();
    } }, field(t('blRename'), inp), h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'bnSave' }, t('saveL')),
      sureBtn('bnDelete', t('blRemove'), t('blRemoveSure'), function () { plCommit(t('blRemove') + ' · ' + name, function (x) { touch(x, null); }); closeSheet(); })))));
  }
  function planPaste() {
    var box = h('textarea', { id: 'bpPaste', rows: '8', dir: 'auto', placeholder: t('blPastePlanEx') });
    showSheet(t('blPaste'), h('section', { class: 'box' }, h('form', { class: 'form', id: 'bpForm', onsubmit: function (e) {
      e.preventDefault();
      var rows = pasted(box.value), subs = rows.length ? rows[0].slice(1).map(function (x) { return tidy(x, 80); }) : [], ok = rows.length > 1 && subs.length > 0 && subs.every(String), table = [];
      rows.slice(1).forEach(function (c) {
        var k = tidy(c[0], 30), nums = subs.map(function (_, i) { var raw = latin(c[i + 1] || ''); return raw === '' ? 0 : (/^\d{1,2}$/.test(raw) && +raw <= 20 ? +raw : -1); });
        if (!k || nums.indexOf(-1) !== -1) ok = false; else table.push([k, nums]);
      });
      if (!ok) { toast(t('blPasteBad'), true); return; }
      plCommit(t('blPaste'), function (x) {
        subs.forEach(function (s) { if (x.subjects.indexOf(s) === -1 && x.subjects.length < 40) x.subjects.push(s); });
        table.forEach(function (r) {
          if (x.classes.indexOf(r[0]) === -1) { if (x.classes.length >= 60) return; x.classes.push(r[0]); }
          subs.forEach(function (s, i) { if (x.subjects.indexOf(s) !== -1) setCount(x, r[0], s, r[1][i]); });
        });
      });
      closeSheet();
    } }, h('p', { class: 'note', text: t('blPastePlanHelp') }), sheetPicker(box), h('label', { class: 'fld' }, h('span', { text: t('blPasteL') }), box), h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'bpGo' }, t('blAdd'))))));
    box.focus();
  }
  function blPlan(v, stage, su) {
    var cap = 0, times = timesOf(stage), longest = Math.max.apply(null, su.dayLen), dayBox = h('div', { class: 'bl-days' });
    su.dayLen.forEach(function (n, d) {
      cap += n;
      var s = pickOf('blDay' + d, numbers(1, S.tt.perDay), n);
      s.addEventListener('change', function () { var val = +s.value; plCommit(t('blDay') + ' · ' + dayLabel(d), function (x) { x.dayLen[d] = val; }); });
      dayBox.appendChild(h('label', { class: 'fld' }, h('span', { text: dayLabel(d) }), s));
    });
    v.appendChild(h('section', { class: 'box' }, h('div', { class: 'headrow' }, h('h2', { text: t('blDay') }), h('button', { class: 'btn ghost sm', type: 'button', id: 'blTimes', onclick: function () { periodsSheet(stage); } }, ic('soon'), t('ttTimes'))),
      h('p', { class: 'lead', text: t('blDayLead') }), dayBox,
      h('p', { class: 'lead', id: 'blCap', text: t('blWeekCap') + ': ' + cap + (times.length >= longest ? ' · ' + t('blTimesNow') + ': ' + times[0][0] + ' – ' + times[longest - 1][1] : '') })));
    var box = h('section', { class: 'box' }, h('div', { class: 'headrow' }, h('h2', { text: t('blMatrix') }), h('div', { class: 'actions' },
      h('button', { class: 'btn sm', type: 'button', id: 'blAddClass', onclick: classSheet }, ic('plus'), t('blAddClass')),
      h('button', { class: 'btn sm', type: 'button', id: 'blAddSubject', onclick: subjectSheet }, ic('plus'), t('blAddSubject')),
      h('button', { class: 'btn ghost sm', type: 'button', id: 'blPastePlan', onclick: planPaste }, ic('upload'), t('blPaste')))), h('p', { class: 'lead', text: t('blMatrixLead') }));
    v.appendChild(box);
    if (!su.classes.length && !su.subjects.length) { box.appendChild(h('div', { class: 'empty', id: 'blNoPlan', text: t('blNoPlan') })); return; }
    var caps = {}, rowTot = {}, colTot = {}, tb = h('tbody'), head = h('tr', null, h('th', { text: t('klass') })), foot = h('tr', null, h('th', { text: t('blTotal') }));
    su.classes.forEach(function (k) { caps[k] = capacityOf(su, k); });
    var totals = function () {
      su.classes.forEach(function (k) { var n = 0; su.subjects.forEach(function (s) { n += countOf(su, k, s); }); rowTot[k].textContent = n + ' / ' + caps[k]; rowTot[k].className = 'tot ' + (n > caps[k] ? 'over' : n === caps[k] ? 'ok' : 'under'); });
      su.subjects.forEach(function (s) { var n = 0; su.classes.forEach(function (k) { n += countOf(su, k, s); }); colTot[s].textContent = n; });
    };
    su.subjects.forEach(function (s) {
      head.appendChild(h('th', null, h('button', { class: 'hbtn', type: 'button', 'data-subject': s, onclick: function () { nameSheet('subject', s); } }, s)));
      colTot[s] = h('span', { class: 'tot' }); foot.appendChild(h('td', null, colTot[s]));
    });
    head.appendChild(h('th', { text: t('blTotal') })); foot.appendChild(h('td'));
    su.classes.forEach(function (k) {
      var tr = h('tr', null, h('th', null, h('button', { class: 'hbtn', type: 'button', 'data-class': k, onclick: function () { nameSheet('class', k); } }, k)));
      su.subjects.forEach(function (s) {
        var inp = h('input', { type: 'number', min: '0', max: '20', inputmode: 'numeric', value: countOf(su, k, s) || '', 'aria-label': k + ' · ' + s, 'data-cell': k + '|' + s });
        inp.addEventListener('change', function () {
          var n = Math.max(0, Math.min(20, Math.floor(+latin(inp.value)) || 0));
          inp.value = n || '';
          plCommit(k + ' · ' + s, function (x) { setCount(x, k, s, n); }, true);
          totals();
        });
        tr.appendChild(h('td', null, inp));
      });
      rowTot[k] = h('span', { class: 'tot', 'data-total': k });
      tr.appendChild(h('td', null, rowTot[k])); tb.appendChild(tr);
    });
    box.appendChild(h('div', { class: 'tw flat' }, h('table', { class: 'mx', id: 'blPlan' }, h('thead', null, head), tb, h('tfoot', null, foot))));
    totals();
  }

  /* ---- step 2: the teachers ---- */
  function teacherSheet(id) {
    var stage = plStage(), su = plEntry(stage).setup, cur = id ? teacherOf(su, id) : null, isNew = !cur;
    if (isNew) cur = { id: '', name: '', email: '', quota: 24, maxDay: 0, subjects: [] };
    var used = {};
    su.teachers.forEach(function (w) { if (w.email && w.id !== cur.id) used[w.email] = 1; });
    var staff = S.users.filter(function (u) { return canHold(u, stage) && !used[u.email]; }).sort(byName);
    var who = pickOf('btWho', [['', t('blTypedName')]].concat(staff.map(function (u) { return [u.email, u.name]; })), cur.email);
    var name = h('input', { type: 'text', id: 'btName', maxlength: '80', value: cur.email ? '' : cur.name, placeholder: t('name') });
    name.hidden = !!who.value;
    who.addEventListener('change', function () { name.hidden = !!who.value; });
    var boxes = su.subjects.map(function (s) { return h('input', { type: 'checkbox', 'data-sub': s, checked: cur.subjects.indexOf(s) !== -1 }); });
    var quota = h('input', { type: 'number', id: 'btQuota', min: '0', max: '40', inputmode: 'numeric', value: cur.quota }), maxDay = pickOf('btMaxDay', [[0, t('blNoLimit')]].concat(numbers(1, S.tt.perDay)), cur.maxDay || 0);
    showSheet(isNew ? t('blAddTeacher') : cur.name, h('section', { class: 'box' }, h('form', { class: 'form', id: 'btForm', onsubmit: function (e) {
      e.preventDefault();
      var email = who.value, person = staff.filter(function (u) { return u.email === email; })[0], nm = person ? person.name : tidy(name.value, 80);
      if (!nm) { toast(t('blNeedName'), true); return; }
      var subs = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.getAttribute('data-sub'); }), q = Math.max(0, Math.min(40, Math.floor(+latin(quota.value)) || 0)), md = +maxDay.value;
      plCommit((isNew ? t('blAddTeacher') : t('blTeacher')) + ' · ' + nm, function (x) {
        var w = isNew ? null : teacherOf(x, cur.id);
        if (!w) { if (x.teachers.length >= 150) return; w = { id: newId('t'), name: '', email: '', quota: 24, maxDay: 0, subjects: [] }; x.teachers.push(w); }
        w.name = nm; w.email = person ? email : ''; w.quota = q; w.maxDay = md; w.subjects = subs;
      });
      closeSheet();
    } }, field(t('blTeacher'), who), name,
      h('div', { class: 'fld' }, h('span', { text: t('blSubjects') }), h('div', { class: 'checks', id: 'btSubjects' }, su.subjects.map(function (s, i) { return h('label', { class: 'check' }, boxes[i], s); }))),
      h('div', { class: 'row2' }, field(t('blQuotaL'), quota), field(t('blMaxDay'), maxDay)),
      h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'btSave' }, t('saveL')), isNew ? null : sureBtn('btDelete', t('blRemove'), t('blRemoveSure'), function () {
        plCommit(t('blRemove') + ' · ' + cur.name, function (x) {
          x.teachers = x.teachers.filter(function (w) { return w.id !== cur.id; });
          x.loads.forEach(function (l) { if (l.teacher === cur.id) l.teacher = ''; });
          x.rules = x.rules.filter(function (r) { return r.teacher !== cur.id; });
        });
        closeSheet();
      })))));
  }
  function teacherPaste() {
    var stage = plStage(), box = h('textarea', { id: 'bqPaste', rows: '8', dir: 'auto', placeholder: t('blPasteTeachersEx') });
    showSheet(t('blPaste'), h('section', { class: 'box' }, h('form', { class: 'form', id: 'bqForm', onsubmit: function (e) {
      e.preventDefault();
      var rows = pasted(box.value).map(function (c) { return { name: tidy(c[0], 80), subjects: splitNames(String(c[1] || '').replace(/[+\/&]/g, ','), 80), quota: /^\d{1,2}$/.test(latin(c[2] || '')) ? Math.min(40, +latin(c[2])) : 24 }; }).filter(function (r) { return r.name; });
      if (!rows.length) { toast(t('blPasteBad'), true); return; }
      plCommit(t('blPaste') + ' · ' + t('blTeachersW'), function (x) {
        rows.forEach(function (r) {
          if (x.teachers.some(function (w) { return w.name === r.name; }) || x.teachers.length >= 150) return;
          r.subjects.forEach(function (s) { if (x.subjects.indexOf(s) === -1 && x.subjects.length < 40) x.subjects.push(s); });
          var same = S.users.filter(function (u) { return canHold(u, stage) && norm(u.name) === norm(r.name); });
          var person = same.length === 1 && !x.teachers.some(function (w) { return w.email === same[0].email; }) ? same[0] : null;
          x.teachers.push({ id: newId('t'), name: person ? person.name : r.name, email: person ? person.email : '', quota: r.quota, maxDay: 0, subjects: r.subjects.filter(function (s) { return x.subjects.indexOf(s) !== -1; }) });
        });
      });
      closeSheet();
    } }, h('p', { class: 'note', text: t('blPasteTeachersHelp') }), sheetPicker(box), h('label', { class: 'fld' }, h('span', { text: t('blPasteL') }), box), h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'bqGo' }, t('blAdd'))))));
    box.focus();
  }
  function blTeachers(v, stage, su) {
    var addStaff = function () {
      var have = {};
      su.teachers.forEach(function (w) { if (w.email) have[w.email] = 1; });
      var fresh = S.users.filter(function (u) { return u.role === 'teacher' && canHold(u, stage) && !have[u.email]; });
      if (!fresh.length) { toast(t('blNoStaff')); return; }
      plCommit(t('blAddStaff'), function (x) { fresh.forEach(function (u) { if (x.teachers.length < 150) x.teachers.push({ id: newId('t'), name: u.name, email: u.email, quota: 24, maxDay: 0, subjects: [] }); }); });
      toast(t('blStaffAdded') + ' ' + fresh.length);
    };
    v.appendChild(h('div', { class: 'headrow' }, h('p', { class: 'lead', text: t('blTeachersLead') }), h('div', { class: 'actions' },
      h('button', { class: 'btn sm', type: 'button', id: 'blAddTeacher', onclick: function () { teacherSheet(''); } }, ic('plus'), t('blAddTeacher')),
      h('button', { class: 'btn ghost sm', type: 'button', id: 'blAddStaff', onclick: addStaff }, ic('people'), t('blAddStaff')),
      h('button', { class: 'btn ghost sm', type: 'button', id: 'blPasteTeachers', onclick: teacherPaste }, ic('upload'), t('blPaste')))));
    if (!su.teachers.length) { v.appendChild(h('div', { class: 'empty', id: 'blNoTeachers', text: t('blNoTeachers') })); return; }
    var tb = h('tbody');
    su.teachers.slice().sort(byName).forEach(function (w) {
      var n = assignedOf(su, w.id);
      tb.appendChild(h('tr', { 'data-teacher': w.id }, h('th', null, h('button', { class: 'hbtn', type: 'button', onclick: function () { teacherSheet(w.id); } }, w.name)),
        h('td', { text: w.subjects.join('، ') || '—' }), h('td', { text: w.quota }), h('td', null, h('span', { class: 'tot ' + (n > w.quota ? 'over' : n ? 'ok' : ''), text: n })), h('td', { text: w.maxDay || '—' })));
    });
    v.appendChild(h('div', { class: 'tw' }, h('table', { class: 'mx start', id: 'blTeachers' }, h('thead', null, h('tr', null, h('th', { text: t('blTeacher') }), h('th', { text: t('blSubjects') }), h('th', { text: t('blQuota') }), h('th', { text: t('blAssigned') }), h('th', { text: t('blMaxDay') }))), tb)));
  }

  /* ---- step 3: who teaches what ---- */
  function blAssign(v, stage, su) {
    var ui = S.plUi;
    if (!su.loads.length || !su.teachers.length) { v.appendChild(h('div', { class: 'empty', id: 'blNeedPlan', text: t('blNeedPlan') })); return; }
    var auto = function (redo) {
      var out = null;
      plCommit(redo ? t('blAutoAll') : t('blAuto'), function (x) { out = APSolver.assign(x, redo); });
      ui.note = out;
      toast(t('blAutoDone') + ' ' + out.changed + (out.missing.length ? ' · ' + t('blAutoLeft') + ' ' + out.missing.length : ''), out.missing.length > 0);
      paintMain();
    };
    var again = sureBtn('blAutoAll', t('blAutoAll'), t('blAutoSure'), function () { auto(true); });
    again.className = 'btn ghost sm';
    v.appendChild(h('div', { class: 'headrow' }, h('p', { class: 'lead', text: t('blAssignLead') }), h('div', { class: 'actions' }, h('button', { class: 'btn sm', type: 'button', id: 'blAuto', onclick: function () { auto(false); } }, ic('people'), t('blAuto')), again)));
    var freeNote = h('p', { id: 'blUnassigned' }), loadsBody = h('tbody');
    var refresh = function () {
      var free = su.loads.filter(function (l) { return !l.teacher; }).length;
      freeNote.className = 'note' + (free ? ' warn' : ''); freeNote.textContent = free ? t('blUnassigned') + ': ' + free : t('blAllAssigned');
      clear(loadsBody);
      su.teachers.slice().sort(byName).forEach(function (w) {
        var n = assignedOf(su, w.id);
        loadsBody.appendChild(h('tr', { 'data-teacher': w.id }, h('th', { text: w.name }), h('td', { text: w.subjects.join('، ') || '—' }), h('td', null, h('span', { class: 'tot ' + (n > w.quota ? 'over' : n ? 'ok' : ''), text: n + ' / ' + w.quota })),
          h('td', null, n > w.quota ? pill('overdue', t('blOver')) : n ? pill('done', t('blWithin')) : null)));
      });
    };
    v.appendChild(freeNote);
    if (ui.note && ui.note.missing.length) {
      var ul = h('ul', { class: 'mini', id: 'blMissing' });
      ui.note.missing.slice(0, 12).forEach(function (m) { ul.appendChild(h('li', null, h('b', { text: m.klass + ' · ' + m.subject + ' (' + m.count + ')' }), ' · ' + t(m.able ? 'blShort' : 'blNoTeacherFor'))); });
      v.appendChild(ul);
    }
    var tb = h('tbody'), head = h('tr', null, h('th', { text: t('klass') })), everyone = su.teachers.slice().sort(byName);
    su.subjects.forEach(function (s) { head.appendChild(h('th', { text: s })); });
    su.classes.forEach(function (k) {
      var tr = h('tr', null, h('th', { text: k }));
      su.subjects.forEach(function (s) {
        var l = loadOf(su, k, s);
        if (!l) { tr.appendChild(h('td', { class: 'none', text: '·' })); return; }
        var able = everyone.filter(function (w) { return w.subjects.indexOf(s) !== -1; }), rest = everyone.filter(function (w) { return w.subjects.indexOf(s) === -1; });
        var pick = h('select', { 'data-cell': k + '|' + s, 'aria-label': k + ' · ' + s }), opt = function (w) { var o = h('option', { value: w.id, text: w.name }); if (w.id === l.teacher) o.selected = true; return o; };
        pick.appendChild(h('option', { value: '', text: '—' }));
        if (able.length) pick.appendChild(h('optgroup', { label: s }, able.map(opt)));
        if (rest.length) pick.appendChild(h('optgroup', { label: t('blOthers') }, rest.map(opt)));
        pick.addEventListener('change', function () { var val = pick.value; ui.note = null; plCommit(k + ' · ' + s, function (x) { var y = loadOf(x, k, s); if (y) y.teacher = val; }, true); refresh(); });
        tr.appendChild(h('td', null, pick, h('small', { class: 'cnt', text: l.count })));
      });
      tb.appendChild(tr);
    });
    v.appendChild(h('div', { class: 'tw' }, h('table', { class: 'mx', id: 'blAssign' }, h('thead', null, head), tb)));
    v.appendChild(h('h2', { text: t('blLoads') }));
    v.appendChild(h('div', { class: 'tw' }, h('table', { class: 'mx start', id: 'blLoads' }, h('thead', null, h('tr', null, h('th', { text: t('blTeacher') }), h('th', { text: t('blSubjects') }), h('th', { text: t('blAssigned') + ' / ' + t('blQuota') }), h('th', { text: t('status') }))), loadsBody)));
    refresh();
  }

  /* ---- step 4: the admins' instructions ---- */
  function spanText(r) { return r.from === 1 && r.to === S.tt.perDay ? t('blAllDay') : t('ttPeriod') + ' ' + r.from + (r.to !== r.from ? '–' + r.to : ''); }
  function ruleText(r, su) {
    var w = r.teacher ? teacherOf(su, r.teacher) : null, who = r.teacher ? (w ? w.name : '—') : t('blAllTeachers'), where = r.klass || t('blAllClasses');
    if (r.type === 'off') return who + ' · ' + t('rl_off') + ' · ' + (r.days && r.days.length ? r.days.map(dayLabel).join('، ') : t('blEveryDay')) + ' · ' + spanText(r);
    if (r.type === 'window') return r.subject + ' (' + where + ') · ' + t('rl_window') + ' ' + r.from + '–' + r.to + ' ' + t('rl_only');
    if (r.type === 'maxDay') return who + ' · ' + fillT('rl_maxDay', r);
    if (r.type === 'streak') return who + ' · ' + fillT('rl_streak', r);
    if (r.type === 'subjectDay') return r.subject + ' · ' + fillT('rl_subjectDay', r);
    if (r.type === 'together') return r.subject + ' · ' + fillT('rl_together', r);
    return where + ' · ' + dayLabel(r.day) + ' · ' + t('ttPeriod') + ' ' + r.period + ' · ' + (r.label || t('blClosed'));
  }
  function ruleSheet(id) {
    var su = plEntry(plStage()).setup, cur = id ? su.rules.filter(function (x) { return x.id === id; })[0] : null, isNew = !cur, P = S.tt.perDay;
    var r = cur ? JSON.parse(JSON.stringify(cur)) : { id: newId('r'), type: 'off', must: true };
    var type = pickOf('brType', APSolver.RULE_TYPES.map(function (x) { return [x, t('rt_' + x)]; }), r.type), body = h('div', { class: 'form' }), F = {};
    type.disabled = !isNew;
    var paint = function () {
      clear(body); F = {};
      var ty = type.value, teachers = su.teachers.slice().sort(byName).map(function (w) { return [w.id, w.name]; }), subs = su.subjects.map(function (s) { return [s, s]; }), classes = su.classes.map(function (k) { return [k, k]; });
      if (ty === 'off' || ty === 'maxDay' || ty === 'streak') body.appendChild(field(t('blTeacher'), F.teacher = pickOf('brTeacher', (ty === 'off' ? [] : [['', t('blAllTeachers')]]).concat(teachers), r.teacher)));
      if (ty === 'window' || ty === 'subjectDay' || ty === 'together') body.appendChild(field(t('subject'), F.subject = pickOf('brSubject', subs, r.subject)));
      if (ty === 'window' || ty === 'fixed') body.appendChild(field(t('klass'), F.klass = pickOf('brClass', [['', t('blAllClasses')]].concat(classes), r.klass)));
      if (ty === 'off') {
        F.days = []; var row = h('div', { class: 'checks', id: 'brDays' });
        for (var d = 0; d < S.tt.days; d++) { var b = h('input', { type: 'checkbox', 'data-day': d, checked: (r.days || []).indexOf(d) !== -1 }); F.days.push(b); row.appendChild(h('label', { class: 'check' }, b, dayLabel(d))); }
        body.appendChild(h('div', { class: 'fld' }, h('span', { text: t('blDaysL') }), row));
      }
      if (ty === 'off' || ty === 'window') body.appendChild(h('div', { class: 'row2' }, field(t('blFrom'), F.from = pickOf('brFrom', numbers(1, P), r.from || 1)), field(t('blTo'), F.to = pickOf('brTo', numbers(1, P), r.to || P))));
      if (ty === 'fixed') {
        var dayItems = []; for (var n = 0; n < S.tt.days; n++) dayItems.push([n, dayLabel(n)]);
        body.appendChild(h('div', { class: 'row2' }, field(t('dayL'), F.day = pickOf('brDay', dayItems, r.day || 0)), field(t('ttPeriod'), F.period = pickOf('brPeriod', numbers(1, P), r.period || P))));
        body.appendChild(field(t('blLabel'), F.label = h('input', { type: 'text', id: 'brLabel', maxlength: '40', value: r.label || '' })));
      }
      if (ty === 'maxDay' || ty === 'streak' || ty === 'subjectDay' || ty === 'together') body.appendChild(field(t('blHowMany'), F.n = pickOf('brN', numbers(1, ty === 'together' ? 10 : P), r.n || { maxDay: 6, streak: 4, subjectDay: 2, together: 1 }[ty])));
      if (ty === 'off' || ty === 'window' || ty === 'streak') body.appendChild(field(t('blStrength'), F.must = pickOf('brMust', [['1', t('blMust')], ['0', t('blPrefer')]], r.must === false ? '0' : '1')));
    };
    type.addEventListener('change', paint);
    paint();
    showSheet(isNew ? t('blAddRule') : t('rt_' + r.type), h('section', { class: 'box' }, h('form', { class: 'form', id: 'brForm', onsubmit: function (e) {
      e.preventDefault();
      var o = { id: r.id, type: type.value, must: F.must ? F.must.value === '1' : true };
      if (F.teacher) o.teacher = F.teacher.value;
      if (F.subject) o.subject = F.subject.value;
      if (F.klass) o.klass = F.klass.value;
      if (F.days) o.days = F.days.filter(function (b) { return b.checked; }).map(function (b) { return +b.getAttribute('data-day'); });
      if (F.from) { o.from = Math.min(+F.from.value, +F.to.value); o.to = Math.max(+F.from.value, +F.to.value); }
      if (F.day) { o.day = +F.day.value; o.period = +F.period.value; o.label = tidy(F.label.value, 40); }
      if (F.n) o.n = +F.n.value;
      if ((o.type === 'off' && !o.teacher) || (F.subject && !o.subject)) { toast(t('blRuleNeeds'), true); return; }
      plCommit(t(isNew ? 'blAddRule' : 'rt_' + o.type), function (x) { var at = -1; x.rules.forEach(function (y, i) { if (y.id === o.id) at = i; }); if (at === -1) { if (x.rules.length < 100) x.rules.push(o); } else x.rules[at] = o; });
      closeSheet();
    } }, field(t('blRuleType'), type), body, h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'brSave' }, t('saveL'))))));
  }
  function blRules(v, stage, su) {
    v.appendChild(h('div', { class: 'headrow' }, h('p', { class: 'lead', text: t('blRulesLead') }), h('button', { class: 'btn sm', type: 'button', id: 'blAddRule', onclick: function () { ruleSheet(''); } }, ic('plus'), t('blAddRule'))));
    if (!su.rules.length) { v.appendChild(h('div', { class: 'empty', id: 'blNoRules', text: t('blNoRules') })); return; }
    var ul = h('ul', { class: 'rules', id: 'blRules' });
    su.rules.forEach(function (r) {
      ul.appendChild(h('li', { 'data-rule': r.id, 'data-type': r.type }, h('button', { class: 'tx', type: 'button', onclick: function () { ruleSheet(r.id); } }, ruleText(r, su)), pill(r.must === false ? 'soon' : 'pending', t(r.must === false ? 'blPrefer' : 'blMust')),
        h('button', { class: 'x', type: 'button', 'aria-label': t('blRemove'), title: t('blRemove'), onclick: function () { plCommit(t('blRemove') + ' · ' + t('rt_' + r.type), function (x) { x.rules = x.rules.filter(function (y) { return y.id !== r.id; }); }); } }, ic('x'))));
    });
    v.appendChild(ul);
  }

  /* ---- step 5: build, read the report, apply ---- */
  /** Sessions a teacher already has outside this build (another stage, or a class that is not in the plan): the builder keeps those times free. */
  function busyElsewhere(stage, su) {
    var byMail = {}, extra = [];
    su.teachers.forEach(function (w) { if (w.email) byMail[w.email] = w.id; });
    S.tt.lessons.forEach(function (l) {
      var id = l.teacher && byMail[l.teacher];
      if (id && !(l.stage === stage && su.classes.indexOf(l.klass) !== -1)) extra.push({ id: 'busy' + extra.length, type: 'off', must: true, teacher: id, days: [l.weekday], from: l.period, to: l.period });
    });
    if (!extra.length) return { setup: su, busy: 0 };
    var copy = JSON.parse(JSON.stringify(su));
    copy.rules = copy.rules.concat(extra);
    return { setup: copy, busy: extra.length };
  }
  function blRun(stage, su, seed) {
    var c = APSolver.compile(busyElsewhere(stage, su).setup), ui = S.plUi;
    if (!c.ok) return;
    var run = APSolver.start(c.problem, seed), state = ui.run = { stage: stage, seed: seed, busy: true, result: null, report: null };
    ui.seed = seed;
    paintMain();
    (function tick() {
      if (ui.run !== state) return;                    // the setup changed, or another build started
      var until = Date.now() + 40;
      while (!run.done && Date.now() < until) run.step(4000);
      if (!run.done) { var bar = $('blBar'); if (bar) { bar.style.width = Math.round(run.progress * 100) + '%'; bar.parentNode.setAttribute('aria-valuenow', Math.round(run.progress * 100)); } setTimeout(tick, 0); return; }
      state.busy = false; state.result = run.result; state.report = APSolver.evaluate(su, run.result.lessons, run.result.fixed);
      if (S.view === 'builder') paintMain();
    })();
  }
  /** The built design as the same grid the school timetable uses: five days, numbered sessions. */
  function draftGrid(stage, su, res, mode, pick) {
    var week = h('div', { class: 'week tt', id: 'blDraft' }), names = {}, times = timesOf(stage);
    su.teachers.forEach(function (w) { names[w.id] = w.name; });
    for (var n = 0; n < S.tt.days; n++) {
      var col = h('div', { class: 'wk', 'data-wd': n }, h('b', { text: dayLabel(n) }));
      for (var k = 1; k <= S.tt.perDay; k++) {
        var here = res.lessons.filter(function (x) { return x.day === n && x.period === k && (mode === 'class' ? x.klass === pick : x.teacher === pick); });
        var held = mode === 'class' ? res.fixed.filter(function (f) { return f.klass === pick && f.day === n && f.period === k; }) : [];
        var tm = times[k - 1] || ['', ''], off = k > su.dayLen[n];
        var slot = h('div', { class: 'slot' + (here.length || held.length ? '' : ' free') + (off ? ' off' : ''), 'data-slot': n + '-' + k }, h('span', { class: 'slot-t' }, h('b', { text: k }), h('span', { class: 'ltr', text: tm[0] ? tm[0] + ' – ' + tm[1] : '' })));
        here.forEach(function (x) { slot.appendChild(h('div', { class: 'sess' }, h('b', { text: x.subject }), h('small', { text: mode === 'class' ? (names[x.teacher] || '') : x.klass }))); });
        held.forEach(function (f) { slot.appendChild(h('div', { class: 'sess held' }, h('b', { text: f.label }))); });
        col.appendChild(slot);
      }
      week.appendChild(col);
    }
    return week;
  }
  function blBuild(v, stage, su) {
    var ui = S.plUi, eff = busyElsewhere(stage, su), c = APSolver.compile(eff.setup), run = ui.run && ui.run.stage === stage ? ui.run : null, issues = h('ul', { class: 'mini', id: 'blIssues' });
    c.errors.forEach(function (x) { issues.appendChild(h('li', { class: 'bad', text: fillT('e_' + x.code, x) })); });
    c.warnings.forEach(function (x) { issues.appendChild(h('li', { text: fillT('w_' + x.code, x) })); });
    var goBtn = h('button', { class: 'btn', type: 'button', id: 'blGo', disabled: !c.ok || !!(run && run.busy), onclick: function () { blRun(stage, su, 1); } }, ic('builder'), t('blGo'));
    v.appendChild(h('section', { class: 'box' }, h('div', { class: 'headrow' }, h('h2', { text: t('blCheck') }), goBtn),
      h('p', { class: 'lead', id: 'blSize', text: su.classes.length + ' ' + t('blClassesW') + ' · ' + c.problem.lessons.length + ' ' + t('ttSessionsWord') + ' · ' + su.teachers.length + ' ' + t('blTeachersW') + ' · ' + su.rules.length + ' ' + t('blRulesW') }),
      c.errors.length || c.warnings.length ? issues : null, eff.busy ? h('p', { class: 'lead', id: 'blBusy', text: fillT('blBusy', { n: eff.busy }) }) : null, c.ok ? h('p', { class: 'note', id: 'blReady', text: t('blReady') }) : null));
    if (run && run.busy) {
      v.appendChild(h('section', { class: 'box', id: 'blWorking' }, h('b', { text: t('blWorking') }), h('div', { class: 'prog', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-label': t('blWorking') }, h('i', { id: 'blBar' }))));
      return;
    }
    if (!run || !run.result) { if (c.ok) v.appendChild(h('div', { class: 'empty', id: 'blNotBuilt', text: t('blNotBuilt') })); return; }
    var res = run.result, rep = run.report, placed = res.lessons.length, kept = rep.rules.filter(function (x) { return !x.broken; }).length, clashes = rep.classClash + rep.teacherClash;
    var stat = function (id, n, label, cls) { return h('div', { class: 'stat ' + (cls || ''), id: id }, h('b', { text: n }), h('span', { text: label })); };
    var names = {};
    su.teachers.forEach(function (w) { names[w.id] = w; });
    var payload = JSON.stringify({ stage: stage, classes: su.classes, lessons: res.lessons.map(function (l) { var w = names[l.teacher]; return { klass: l.klass, weekday: l.day, period: l.period, subject: l.subject, teacher: (w && w.email) || '', teacherName: w && !w.email ? w.name : '' }; })
      .concat(res.fixed.map(function (f) { return { klass: f.klass, weekday: f.day, period: f.period, subject: f.label }; })) });
    var now = S.tt.lessons.filter(function (l) { return l.stage === stage && su.classes.indexOf(l.klass) !== -1; }).length;
    var applyBtn = sureBtn('blApply', t('blApply'), fillT('blApplySure', { c: su.classes.length, n: now }), function () {
      busy(applyBtn, true);
      call('api_applySchedule', payload).then(function (out) {
        var r = JSON.parse(out), ref = { id: r.undoId };
        record(t('blApplyUndo'), function () { return call('api_undoApply', stage, ref.id).then(function () { S.tt = null; }); }, function () { return call('api_applySchedule', payload).then(function (x) { ref.id = JSON.parse(x).undoId; S.tt = null; }); });
        S.tt = null; S.ttMode = 'class'; S.ttPick = stage + '|' + su.classes[0];
        toast(t('blApplied') + ' ' + r.added + (r.clashing ? ' · ' + t('blAppliedClash') + ' ' + r.clashing : ''), r.clashing > 0);
        go('timetable');
      }, function (er) { busy(applyBtn, false); toast(errText(er), true); });
    });
    applyBtn.className = 'btn';
    v.appendChild(h('section', { class: 'box', id: 'blResult' }, h('div', { class: 'headrow' }, h('h2', { text: t('blDraft') + ' · ' + t('blSeed') + ' ' + run.seed }), h('div', { class: 'actions' },
      h('button', { class: 'btn ghost sm', type: 'button', id: 'blAgain', onclick: function () { blRun(stage, su, run.seed + 1); } }, ic('sync'), t('blAgain')), placed ? applyBtn : null)),
      h('div', { class: 'stats', id: 'blSummary' }, stat('blStatPlaced', placed + ' / ' + res.total, t('blPlaced'), placed === res.total ? 'good' : 'bad'), stat('blStatClash', clashes, t('blClashes'), clashes ? 'bad' : 'good'),
        stat('blStatGaps', rep.classGaps, t('blClassGaps'), rep.classGaps ? 'bad' : 'good'), rep.rules.length ? stat('blStatRules', kept + ' / ' + rep.rules.length, t('blRulesKept'), kept === rep.rules.length ? 'good' : '') : null,
        stat('blStatWait', rep.teacherGaps, t('blTeacherGaps')), stat('blStatLong', rep.maxTeacherDay, t('blLongest')))));
    if (res.unplaced.length) {
      var miss = h('ul', { class: 'mini', id: 'blUnplaced' });
      res.unplaced.forEach(function (u) { miss.appendChild(h('li', null, h('b', { text: u.klass + ' · ' + u.subject + (names[u.teacher] ? ' · ' + names[u.teacher].name : '') }), ' · ' + u.n)); });
      v.appendChild(h('section', { class: 'box' }, h('h2', { text: t('blUnplaced') }), h('p', { class: 'note warn', text: t('blUnplacedHint') }), miss));
    }
    if (rep.rules.length) {
      var rl = h('ul', { class: 'rules', id: 'blRuleReport' });
      rep.rules.forEach(function (x) {
        var r = su.rules.filter(function (y) { return y.id === x.id; })[0];
        if (r) rl.appendChild(h('li', { 'data-rule': x.id, 'data-broken': x.broken }, h('span', { class: 'tx', text: ruleText(r, su) }), pill(r.must === false ? 'soon' : 'pending', t(r.must === false ? 'blPrefer' : 'blMust')),
          x.broken ? pill('overdue', t('blBroken') + ' ' + x.broken + ' ' + t('blTimesW')) : pill('done', t('blKept'))));
      });
      v.appendChild(h('section', { class: 'box' }, h('h2', { text: t('blRuleReport') }), rl));
    }
    var mode = ui.mode === 'teacher' ? 'teacher' : 'class', keys = mode === 'class' ? su.classes.map(function (k) { return [k, k]; }) : su.teachers.slice().sort(byName).filter(function (w) { return res.lessons.some(function (l) { return l.teacher === w.id; }); }).map(function (w) { return [w.id, w.name]; });
    var pick = keys.some(function (x) { return x[0] === ui.pick; }) ? ui.pick : (keys[0] || [''])[0];
    var chooser = sel(mode === 'class' ? t('klass') : t('blTeacher'), pick, keys, function (val) { ui.pick = val; paintMain(); });
    chooser.querySelector('select').id = 'blDraftPick';
    var tabs = tabsRow([['class', t('blByClass')], ['teacher', t('blByTeacher')]], mode, function (k) { ui.mode = k; ui.pick = ''; paintMain(); });
    tabs.id = 'blDraftTabs';
    v.appendChild(h('div', { class: 'headrow' }, tabs, h('div', { class: 'filters one' }, chooser)));
    v.appendChild(draftGrid(stage, su, res, mode, pick));
    var tb = h('tbody'), th = h('tr', null, h('th', { text: t('blTeacher') }), h('th', { text: t('blTotal') }));
    for (var d = 0; d < S.tt.days; d++) th.appendChild(h('th', { text: dayLabel(d) }));
    th.appendChild(h('th', { text: t('blGaps') }));
    rep.teachers.filter(function (x) { return x.total; }).sort(byName).forEach(function (x) {
      var tr = h('tr', { 'data-teacher': x.id }, h('th', { text: x.name }), h('td', null, h('b', { text: x.total })));
      x.days.forEach(function (n) { tr.appendChild(h('td', { text: n || '·' })); });
      tr.appendChild(h('td', { text: x.gaps })); tb.appendChild(tr);
    });
    v.appendChild(h('h2', { text: t('blTeacherDays') }));
    v.appendChild(h('div', { class: 'tw' }, h('table', { class: 'mx start', id: 'blTeacherDays' }, h('thead', null, th), tb)));
  }
  function vBuilder() {
    var v = h('div', { class: 'view builder' }), ui = S.plUi;
    v.appendChild(h('p', { class: 'lead', text: t('blLead') }));
    if (!plReady(v)) return v;
    var all = stagesShown(), stage = plStage();
    if (!stage) { v.appendChild(h('div', { class: 'empty', text: t('none') })); return v; }
    if (ui.stage !== stage) { ui.stage = stage; ui.run = null; ui.note = null; ui.pick = ''; }
    var su = plEntry(stage).setup, pickStage = all.length > 1 && !S.f.stage ? sel(t('stage'), stage, all.map(function (x) { return [x, stageName(x)]; }), function (val) { ui.stage = val; ui.run = null; ui.note = null; ui.pick = ''; paintMain(); }) : null;
    if (pickStage) pickStage.querySelector('select').id = 'blStage';
    var tabs = tabsRow(['plan', 'teachers', 'assign', 'rules', 'build'].map(function (k) { return [k, t('bl_' + k)]; }), ui.tab, function (k) { ui.tab = k; paintMain(); });
    tabs.id = 'blTabs';
    v.appendChild(h('div', { class: 'headrow' }, tabs, pickStage ? h('div', { class: 'filters one' }, pickStage) : null));
    ({ plan: blPlan, teachers: blTeachers, assign: blAssign, rules: blRules, build: blBuild }[ui.tab] || blPlan)(v, stage, su);
    return v;
  }
