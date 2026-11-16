  /* ---------- classroom visits: an admin fills in the visit form of their role; the visit is kept under the teacher ---------- */
  var TXV = {
    ar: {
      visits: 'الزيارات الصفية', vsLead: 'سجّل الزيارة الصفية على استمارة دورك، فتُحفظ في ملف المعلم وتدخل في تقييمه.', vsLeadMine: 'زياراتك الصفية التي شاركها معك من زارك، بنتائجها وملاحظاتها.',
      vs_log: 'الزيارات', vs_eval: 'تقييم المعلمين', vs_forms: 'الاستمارات', vsNew: 'زيارة جديدة', vsEdit: 'تعديل الزيارة', vsNone: 'لا توجد زيارات مسجلة هنا بعد.', vsNoneMine: 'لم تُشارَك معك زيارات بعد.',
      vk_principal: 'المدير', vk_academic: 'المشرف الأكاديمي', vk_vp: 'الوكيل', vsForm: 'الاستمارة', vsVisitor: 'الزائر', vsResult: 'النتيجة', vsDate: 'تاريخ الزيارة', vsTeacher: 'المعلم', vsPickTeacher: 'اختر المعلم', vsOthers: 'منسوبون آخرون',
      vsAllTeachers: 'كل المعلمين', vsAllForms: 'كل الاستمارات', vsAllTerms: 'كل العام', vsSessionsOf: 'حصص المعلم في هذا اليوم، من الجدول المدرسي:', vsScale: 'مقياس التقدير', vsNA: 'لا ينطبق', vsStrengths: 'نقاط القوة', vsImprove: 'فرص التحسين',
      vsRecommend: 'التوصيات', vsNote: 'ملاحظة خاصة (لا يراها المعلم)', vsShared: 'تظهر الزيارة للمعلم في صفحته', vsSave: 'حفظ الزيارة', vsSaved: 'حُفظت الزيارة في ملف المعلم.', vsLeft: 'بنود بلا تقييم:', vsRated: 'بنداً مقيَّماً',
      vsNeedTeacher: 'اختر المعلم أولاً.', vsDraftBack: 'استُعيدت مسودة زيارة لم تُحفظ.', vsDiscard: 'إلغاء', vsReport: 'تقرير زيارة صفية', vsPrint: 'طباعة', vsDelete: 'حذف الزيارة', vsDeleteSure: 'تأكيد الحذف', vsDeleted: 'حُذفت الزيارة.',
      vsSeen: 'تم الاطلاع', vsNotSeen: 'لم يطّلع بعد', vsHidden: 'غير مشاركة مع المعلم', vsISaw: 'اطّلعت على الزيارة', vsSawOk: 'سُجّل اطلاعك.', vsNewTag: 'جديدة', vsDomains: 'النتيجة حسب المجال', vsNotes: 'الملاحظات',
      vsCount: 'الزيارات', vsLast: 'آخر زيارة', vsAvg: 'المتوسط', vsNotVisited: 'لم يُزر', vsCoverage: 'زير {a} من {b} معلماً', vsAvgAll: 'متوسط النتائج', vsEvalLead: 'نتائج زيارات كل معلم. المتوسط هو متوسط نتائج زياراته، ولكل استمارة متوسطها. اضغط اسم المعلم لتفاصيله.',
      vsFormsLead: 'لكل دور استمارته. يعدّلها مدير المدرسة أو مالك النظام، والزيارات السابقة تبقى على الاستمارة التي سُجّلت بها.', vsFormsWho: 'استمارة المشرف الأكاديمي يستخدمها حساب وكيل الشؤون التعليمية. مالك النظام يختار الاستمارة عند كل زيارة.',
      vsEditForm: 'تعديل الاستمارة', vsFormTitle: 'عنوان الاستمارة', vsScaleL: 'مستويات التقدير، من الأعلى إلى الأدنى', vsScaleHint: 'افصل بينها بفاصلة. من مستويين إلى خمسة. مثال: متميز، جيد، مقبول، يحتاج تطويراً',
      vsItemsL: 'المجالات والبنود', vsItemsHint: 'كل بند في سطر. السطر الذي يبدأ بعلامة # عنوان مجال. يمكنك لصق الاستمارة من Word.', vsItems: 'بنود الاستمارة', vsFormSaved: 'حُفظت الاستمارة. تُستخدم في الزيارات الجديدة.',
      vsDomainsW: 'مجالات', vsItemsW: 'بنداً', vsSession: 'الحصة', vsMineAvg: 'متوسط نتائجي', vsBack: 'رجوع', vsNoTeachers: 'لا يوجد منسوبون في هذه المرحلة. أضفهم من الإدارة ثم المستخدمون.', vsVisitsOf: 'زيارات المعلم', vsItem: 'البند', vsRating: 'التقدير'
    },
    en: {
      visits: 'Classroom visits', vsLead: "Record a classroom visit on your role's form. It is kept in the teacher's file and counts in their evaluation.", vsLeadMine: 'Your classroom visits that the visitor shared with you, with their results and notes.',
      vs_log: 'Visits', vs_eval: "Teachers' evaluation", vs_forms: 'Forms', vsNew: 'New visit', vsEdit: 'Edit visit', vsNone: 'No visits recorded here yet.', vsNoneMine: 'No visits have been shared with you yet.',
      vk_principal: 'Principal', vk_academic: 'Academic supervisor', vk_vp: 'Vice Principal', vsForm: 'Form', vsVisitor: 'Visitor', vsResult: 'Result', vsDate: 'Date of visit', vsTeacher: 'Teacher', vsPickTeacher: 'Choose the teacher', vsOthers: 'Other staff',
      vsAllTeachers: 'All teachers', vsAllForms: 'All forms', vsAllTerms: 'Whole year', vsSessionsOf: "The teacher's sessions that day, from the school timetable:", vsScale: 'Rating scale', vsNA: 'Does not apply', vsStrengths: 'Strengths', vsImprove: 'Areas to improve',
      vsRecommend: 'Recommendations', vsNote: 'Private note (the teacher does not see it)', vsShared: 'The teacher sees this visit on their page', vsSave: 'Save visit', vsSaved: "Visit saved in the teacher's file.", vsLeft: 'Items not rated:', vsRated: 'items rated',
      vsNeedTeacher: 'Choose the teacher first.', vsDraftBack: 'An unsaved visit draft was restored.', vsDiscard: 'Cancel', vsReport: 'Classroom visit report', vsPrint: 'Print', vsDelete: 'Delete visit', vsDeleteSure: 'Confirm deletion', vsDeleted: 'Visit deleted.',
      vsSeen: 'Read', vsNotSeen: 'Not read yet', vsHidden: 'Not shared with the teacher', vsISaw: 'I have read this visit', vsSawOk: 'Recorded as read.', vsNewTag: 'New', vsDomains: 'Result by domain', vsNotes: 'Notes',
      vsCount: 'Visits', vsLast: 'Last visit', vsAvg: 'Average', vsNotVisited: 'Not visited', vsCoverage: '{a} of {b} teachers visited', vsAvgAll: 'Average result', vsEvalLead: "Each teacher's visit results. The average is the mean of their visits; each form has its own average. Select a teacher for details.",
      vsFormsLead: 'Each role has its own form. The Principal or the system owner changes them; earlier visits keep the form they were recorded with.', vsFormsWho: "The academic supervisor's form is used by the Academic Vice Principal's account. The system owner chooses the form at each visit.",
      vsEditForm: 'Edit form', vsFormTitle: 'Form title', vsScaleL: 'Rating levels, highest first', vsScaleHint: 'Separate with commas. Two to five levels. Example: Excellent, Good, Acceptable, Needs development',
      vsItemsL: 'Domains and items', vsItemsHint: 'One item per line. A line that starts with # is a domain title. You can paste the form from Word.', vsItems: 'Form items', vsFormSaved: 'Form saved. New visits use it.',
      vsDomainsW: 'domains', vsItemsW: 'items', vsSession: 'Session', vsMineAvg: 'My average', vsBack: 'Back', vsNoTeachers: 'This stage has no staff yet. Add them under Admin, then Users.', vsVisitsOf: "The teacher's visits", vsItem: 'Item', vsRating: 'Rating'
    }
  };
  Object.keys(TXV).forEach(function (l) { Object.keys(TXV[l]).forEach(function (k) { TX[l][k] = TXV[l][k]; }); });
  ICON.visits = 'M9 4h6v3H9zM7 5H5v15h14V5h-2M8.5 13l2.5 2.5 4.5-5';
  var VKINDS = ['principal', 'academic', 'vp'], vsLoading = false;
  function vsReset() { S.vs = null; S.vsUi = { tab: 'log', term: '', who: '', kind: '', form: null, open: null }; }
  vsReset();
  function vsReady(v) {
    if (S.vs && (!isLead() || S.users)) return true;
    v.appendChild(h('div', { class: 'spin' }));
    if (vsLoading) return false;
    vsLoading = true;
    Promise.all([S.vs ? null : call('api_visits').then(function (r) { S.vs = JSON.parse(r); }), isLead() && !S.users ? call('api_users').then(function (r) { S.users = JSON.parse(r); }) : null])
      .then(function () { vsLoading = false; if (S.view === 'visits') paintMain(); }, function (e) { vsLoading = false; toast(errText(e), true); });
    return false;
  }
  function band(p) { return p >= 85 ? 'done' : p >= 70 ? 'active' : p >= 50 ? 'soon' : 'overdue'; }
  function pctPill(p) { return p == null ? h('span', { class: 'muted', text: '—' }) : h('span', { class: 'pill p-' + band(p), text: p + '%' }); }
  function mean(list) { if (!list.length) return null; var s = 0; list.forEach(function (x) { s += x; }); return Math.round(s / list.length); }
  function inTerm(date) { var t2 = (S.settings.termStarts || {})[2] || ''; return !S.vsUi.term || (S.vsUi.term === '1' ? !t2 || date < t2 : !!t2 && date >= t2); }
  function vsShown() { return S.vs.visits.filter(function (x) { return stageOk(x.stage) && inTerm(x.date); }); }
  function putVisit(x) { var at = -1, s = {}; for (var k in x) if (['form', 'answers', 'strengths', 'improve', 'recommend', 'note'].indexOf(k) === -1) s[k] = x[k]; S.vs.visits.forEach(function (y, i) { if (y.id === x.id) at = i; }); if (at > -1) S.vs.visits[at] = s; else S.vs.visits.push(s); }
  function dropVisit(id) { S.vs.visits = S.vs.visits.filter(function (y) { return y.id !== id; }); if (S.vsUi.open && S.vsUi.open.id === id) S.vsUi.open = null; }
  function blankAnswers(form) { return form.sections.map(function (sec) { return sec.items.map(function () { return null; }); }); }
  /** The result so far: share of full marks over the rated items, and how many items are still to rate. */
  function liveScore(form, answers, only) {
    var n = form.scale.length, sum = 0, cnt = 0, left = 0;
    form.sections.forEach(function (sec, i) { if (only != null && only !== i) return; sec.items.forEach(function (_, j) { var v = answers[i][j]; if (v == null) left++; else if (v) { sum += v; cnt++; } }); });
    return { pct: cnt ? Math.round(sum * 100 / (cnt * n)) : null, left: left, rated: cnt };
  }
  function openVisit(id) { call('api_visit', id).then(function (r) { S.vsUi.open = JSON.parse(r).visit; S.vsUi.form = null; closeSheet(); render(); window.scrollTo(0, 0); }, function (e) { toast(errText(e), true); }); }
  function payloadOf(d) { return { id: d.id, stage: d.stage, teacher: d.teacher, date: d.date, kind: d.kind, klass: d.klass, subject: d.subject, period: d.period, answers: d.answers, strengths: d.strengths, improve: d.improve, recommend: d.recommend, note: d.note, shared: d.shared }; }
  function keepDraft(d) { store('ap.visit', d ? JSON.stringify({ by: S.me.email, d: d }) : null); }
  function startVisit(teacher) {
    var kind = S.vs.kind || 'principal', stage = S.f.stage || stagesShown()[0], d = null, person = teacher ? S.users.filter(function (u) { return u.email === teacher; })[0] : null;
    if (person) stage = stagesShown().filter(function (st) { return canHold(person, st) && (!S.f.stage || st === S.f.stage); })[0] || stage;
    // a visit that was being filled in when the page closed is offered again, if its form has not changed since
    try {
      var kept = JSON.parse(store('ap.visit') || 'null'), f = kept && kept.d && S.vs.forms[kept.d.kind];
      if (f && kept.by === S.me.email && !kept.d.id && kept.d.answers.length === f.sections.length && f.sections.every(function (sec, i) { return kept.d.answers[i].length === sec.items.length; })) d = kept.d;
    } catch (e) { d = null; }
    if (d && !teacher) toast(t('vsDraftBack'));
    else d = { id: '', stage: stage, teacher: teacher || '', date: S.today, kind: kind, klass: '', subject: '', period: '', answers: blankAnswers(S.vs.forms[kind]), strengths: '', improve: '', recommend: '', note: '', shared: true };
    S.vsUi.form = d; S.vsUi.open = null; closeSheet(); render(); window.scrollTo(0, 0);
  }
  function editVisit(x) {
    S.vsUi.form = { id: x.id, stage: x.stage, teacher: x.teacher, teacherName: x.teacherName, date: x.date, kind: x.kind, klass: x.klass, subject: x.subject, period: x.period, answers: JSON.parse(JSON.stringify(x.answers)), strengths: x.strengths, improve: x.improve,
      recommend: x.recommend, note: x.note || '', shared: x.shared, form: x.form, before: x };
    S.vsUi.open = null; render(); window.scrollTo(0, 0);
  }

  /* ---- filling in a visit ---- */
  function visitForm(v) {
    var ui = S.vsUi, d = ui.form, isNew = !d.id, form = d.form || S.vs.forms[d.kind], n = form.scale.length, save = h('button', { class: 'btn', type: 'submit', id: 'vfSave' }, t('vsSave'));
    var changed = function () { if (isNew) keepDraft(d); };
    var leave = function () { ui.form = null; if (isNew) keepDraft(null); if (d.before) ui.open = d.before; render(); };
    v.appendChild(h('div', { class: 'headrow' }, h('h2', { text: isNew ? t('vsNew') : t('vsEdit') }), h('button', { class: 'btn ghost sm', type: 'button', id: 'vfBack', onclick: leave }, t('vsDiscard'))));
    var stg = pickOf('vfStage', stagesShown().map(function (x) { return [x, stageName(x)]; }), d.stage), who = h('select', { id: 'vfTeacher', required: true }), chips = h('div', { class: 'chips wrap', id: 'vfSessions' });
    var date = h('input', { type: 'date', id: 'vfDate', required: true, max: S.today, value: d.date }), kl = h('input', { type: 'text', id: 'vfClass', maxlength: '30', value: d.klass }), su = h('input', { type: 'text', id: 'vfSubject', maxlength: '80', value: d.subject });
    var per = pickOf('vfPeriod', [['', '—']].concat(numbers(1, 8)), d.period), kind = pickOf('vfKind', VKINDS.map(function (k) { return [k, t('vk_' + k)]; }), d.kind);
    var fillWho = function () {
      clear(who).appendChild(h('option', { value: '', text: t('vsPickTeacher') }));
      var staff = S.users.filter(function (u) { return canHold(u, d.stage) && u.email !== S.me.email; }).sort(byName), opt = function (u) { var o = h('option', { value: u.email, text: u.name }); if (u.email === d.teacher) o.selected = true; return o; };
      var teachers = staff.filter(function (u) { return u.role === 'teacher'; }), rest = staff.filter(function (u) { return u.role !== 'teacher'; });
      add(who, teachers.map(opt));
      if (rest.length) who.appendChild(h('optgroup', { label: t('vsOthers') }, rest.map(opt)));
      if (!staff.length) toast(t('vsNoTeachers'), true);
    };
    /** The teacher's sessions on the day of the visit, from the school timetable: one press fills class, subject and session. */
    var fillChips = function () {
      clear(chips);
      if (!d.teacher || !d.date) return;
      if (!S.tt) { if (!fillChips.asked) { fillChips.asked = true; call('api_timetable').then(function (r) { S.tt = JSON.parse(r); if (ui.form === d) fillChips(); }, function () {}); } return; }
      var wd = new Date(d.date + 'T00:00:00Z').getUTCDay(), mine = S.tt.lessons.filter(function (l) { return l.teacher === d.teacher && l.weekday === wd && l.stage === d.stage; }).sort(function (a, b) { return a.period - b.period; });
      if (!mine.length) return;
      chips.appendChild(h('small', { class: 'lead', text: t('vsSessionsOf') }));
      mine.forEach(function (l) {
        chips.appendChild(h('button', { class: 'chip', type: 'button', 'data-session': l.period, onclick: function () { d.klass = kl.value = l.klass; d.subject = su.value = l.subject; d.period = l.period; per.value = String(l.period); changed(); } }, t('vsSession') + ' ' + l.period + ' · ' + l.klass + ' · ' + l.subject));
      });
    };
    stg.addEventListener('change', function () { d.stage = stg.value; d.teacher = ''; fillWho(); fillChips(); changed(); });
    who.addEventListener('change', function () { d.teacher = who.value; fillChips(); changed(); });
    date.addEventListener('change', function () { d.date = date.value; fillChips(); changed(); });
    kl.addEventListener('input', function () { d.klass = kl.value; changed(); });
    su.addEventListener('input', function () { d.subject = su.value; changed(); });
    per.addEventListener('change', function () { d.period = per.value ? +per.value : ''; changed(); });
    kind.addEventListener('change', function () { d.kind = kind.value; d.answers = blankAnswers(S.vs.forms[d.kind]); changed(); paintMain(); });
    if (isNew) fillWho();
    fillChips();
    var total = h('b', { id: 'vfScore' }), leftNote = h('span', { id: 'vfLeft' }), secPct = [], rows = [];
    var tally = function () {
      var all = liveScore(form, d.answers);
      total.textContent = all.pct == null ? '—' : all.pct + '%'; total.className = all.pct == null ? '' : 'sc-' + band(all.pct);
      leftNote.textContent = all.left ? t('vsLeft') + ' ' + all.left : all.rated + ' ' + t('vsRated');
      form.sections.forEach(function (_, i) { var p = liveScore(form, d.answers, i).pct; clear(secPct[i]).appendChild(pctPill(p)); });
    };
    var panels = form.sections.map(function (sec, i) {
      secPct[i] = h('span', { class: 'secpct' });
      var body = h('div', { class: 'vitems' });
      sec.items.forEach(function (text, j) {
        var group = h('div', { class: 'vrate', role: 'radiogroup', 'aria-label': text }), row = h('div', { class: 'vitem', 'data-item': i + '-' + j }, h('p', { text: text }), group);
        var opt = function (val, big, small) {
          var inp = h('input', { type: 'radio', name: 'v-' + i + '-' + j, value: val, checked: d.answers[i][j] === val });
          inp.addEventListener('change', function () { d.answers[i][j] = val; row.classList.remove('miss'); tally(); changed(); });
          return h('label', { title: small }, inp, h('span', null, h('b', { text: big }), h('small', { text: small })));
        };
        for (var k = n; k >= 1; k--) group.appendChild(opt(k, String(k), form.scale[n - k]));
        group.appendChild(opt(0, '—', t('vsNA')));
        rows.push([row, i, j]); body.appendChild(row);
      });
      return h('section', { class: 'panel' }, h('div', { class: 'headrow' }, h('h3', { text: sec.title }), secPct[i]), body);
    });
    var area = function (id, key) { var a = h('textarea', { id: id, maxlength: '1500', dir: 'auto', rows: '3', value: d[key] }); a.addEventListener('input', function () { d[key] = a.value; changed(); }); return field(t(key === 'improve' ? 'vsImprove' : key === 'recommend' ? 'vsRecommend' : key === 'note' ? 'vsNote' : 'vsStrengths'), a); };
    var shared = h('input', { type: 'checkbox', id: 'vfShared', checked: d.shared });
    shared.addEventListener('change', function () { d.shared = shared.checked; changed(); });
    v.appendChild(h('form', { class: 'form', id: 'visitForm', onsubmit: function (e) {
      e.preventDefault();
      if (!d.teacher) { toast(t('vsNeedTeacher'), true); who.focus(); return; }
      var missing = rows.filter(function (r) { return d.answers[r[1]][r[2]] == null; });
      if (missing.length) { missing.forEach(function (r) { r[0].classList.add('miss'); }); missing[0][0].scrollIntoView({ block: 'center' }); toast(t('vsLeft') + ' ' + missing.length, true); return; }
      var next = payloadOf(d), prev = d.before ? payloadOf(Object.assign({}, d.before, { note: d.before.note || '' })) : null;
      busy(save, true);
      call('api_saveVisit', JSON.stringify(next)).then(function (res) {
        var x = JSON.parse(res).visit, ref = { id: x.id, undoId: '' };
        putVisit(x); keepDraft(null);
        var again = function (p) { return call('api_saveVisit', JSON.stringify(p)).then(function (r2) { var y = JSON.parse(r2).visit; putVisit(y); if (S.vsUi.open && S.vsUi.open.id === y.id) S.vsUi.open = y; }); };
        if (prev) record(t('vsEdit') + ' · ' + x.teacherName, function () { return again(prev); }, function () { return again(next); });
        else record(t('vsNew') + ' · ' + x.teacherName, function () { return call('api_deleteVisit', ref.id).then(function (r2) { ref.undoId = JSON.parse(r2).undoId; dropVisit(ref.id); }); },
          function () { return call('api_undoVisit', ref.undoId).then(function (r2) { putVisit(JSON.parse(r2).visit); }); });
        ui.form = null; ui.open = x; toast(t('vsSaved')); render(); window.scrollTo(0, 0);
      }, function (er) { busy(save, false); toast(errText(er), true); });
    } },
      h('section', { class: 'panel' }, h('div', { class: 'headrow' }, h('h3', { text: form.title }), pill('pending', t('vk_' + d.kind))),
        isNew ? h('div', { class: 'row2' }, stagesShown().length > 1 ? field(t('stage'), stg) : null, field(t('vsTeacher'), who), field(t('vsDate'), date), S.vs.kind ? null : field(t('vsForm'), kind))
          : h('div', { class: 'row2' }, h('div', { class: 'fld' }, h('span', { text: t('vsTeacher') }), h('b', { id: 'vfTeacherName', text: d.teacherName })), field(t('vsDate'), date)),
        chips, h('div', { class: 'row2' }, field(t('klass'), kl), field(t('subject'), su), field(t('vsSession'), per)),
        h('p', { class: 'note', id: 'vfScale', text: t('vsScale') + ': ' + form.scale.map(function (x, k) { return (n - k) + ' ' + x; }).join(' · ') + ' · — ' + t('vsNA') })),
      panels,
      h('section', { class: 'panel' }, h('h3', { text: t('vsNotes') }), area('vfStrengths', 'strengths'), area('vfImprove', 'improve'), area('vfRecommend', 'recommend'), area('vfNote', 'note'), h('label', { class: 'check' }, shared, t('vsShared'))),
      h('div', { class: 'vfoot' }, h('div', { class: 'vfoot-n' }, total, leftNote), save)));
    tally();
  }

  /* ---- one visit, as a report that can be printed ---- */
  function visitDetail(v) {
    var ui = S.vsUi, x = ui.open, lead = isLead(), form = x.form, n = form.scale.length, back = function () { ui.open = null; render(); };
    var del = lead && (x.mine || S.me.role === 'owner') ? sureBtn('vdDelete', t('vsDelete'), t('vsDeleteSure'), function () {
      call('api_deleteVisit', x.id).then(function (r) {
        var ref = { undoId: JSON.parse(r).undoId };
        dropVisit(x.id);
        record(t('vsDelete') + ' · ' + x.teacherName, function () { return call('api_undoVisit', ref.undoId).then(function (r2) { putVisit(JSON.parse(r2).visit); }); }, function () { return call('api_deleteVisit', x.id).then(function (r2) { ref.undoId = JSON.parse(r2).undoId; dropVisit(x.id); }); });
        toast(t('vsDeleted')); render();
      }, function (e) { toast(errText(e), true); });
    }) : null;
    if (del) del.className = 'btn bad sm';
    var seenBtn = !lead && !x.seen ? h('button', { class: 'btn sm', type: 'button', id: 'vdSeen', onclick: function () {
      call('api_seenVisit', x.id).then(function () { x.seen = true; S.vs.visits.forEach(function (y) { if (y.id === x.id) y.seen = true; }); S.visitsNew = Math.max(0, (S.visitsNew || 0) - 1); toast(t('vsSawOk')); render(); }, function (e) { toast(errText(e), true); });
    } }, ic('done'), t('vsISaw')) : null;
    v.appendChild(h('div', { class: 'headrow noprint' }, h('button', { class: 'btn ghost sm', type: 'button', id: 'vdBack', onclick: back }, t('vsBack')), h('div', { class: 'actions' }, seenBtn,
      lead && x.mine ? h('button', { class: 'btn sm', type: 'button', id: 'vdEdit', onclick: function () { editVisit(x); } }, t('vsEdit')) : null,
      h('button', { class: 'btn ghost sm', type: 'button', id: 'vdPrint', onclick: function () { window.print(); } }, t('vsPrint')), del)));
    var state = !lead ? null : !x.shared ? pill('undated', t('vsHidden')) : x.seen ? pill('done', t('vsSeen')) : pill('soon', t('vsNotSeen'));
    var doms = h('div', { class: 'vdoms' });
    x.parts.forEach(function (p) { var bar = h('i'); bar.style.width = (p[1] || 0) + '%'; doms.appendChild(h('div', { class: 'vdom' }, h('span', { text: p[0] }), h('div', { class: 'vbar b-' + (p[1] == null ? 'none' : band(p[1])) }, bar), pctPill(p[1]))); });
    v.appendChild(h('section', { class: 'panel', id: 'visitReport' }, h('div', { class: 'headrow' }, h('div', null, h('h2', { text: t('vsReport') }), h('p', { class: 'lead', text: form.title })), h('div', { class: 'vscore sc-' + band(x.score), id: 'vdScore' }, h('b', { text: x.score + '%' }), h('span', { text: t('vsResult') }))),
      kv([[t('vsTeacher'), x.teacherName], [t('stage'), stageName(x.stage)], [t('vsDate'), fmtDate(x.date)], [t('klass'), x.klass], [t('subject'), x.subject], [t('vsSession'), x.period || ''], [t('vsVisitor'), x.byName + ' · ' + t('vk_' + x.kind)]]), state ? h('div', { id: 'vdState' }, state) : null,
      h('h3', { text: t('vsDomains') }), doms));
    form.sections.forEach(function (sec, i) {
      var tb = h('tbody');
      sec.items.forEach(function (text, j) { var val = x.answers[i][j]; tb.appendChild(h('tr', null, h('td', { text: text }), h('td', { class: 'num' }, val ? h('span', { class: 'pill p-' + band(Math.round(val * 100 / n)), text: val + ' · ' + form.scale[n - val] }) : h('span', { class: 'muted', text: t('vsNA') })))); });
      v.appendChild(h('section', { class: 'panel' }, h('div', { class: 'headrow' }, h('h3', { text: sec.title }), pctPill(x.parts[i] ? x.parts[i][1] : null)), h('div', { class: 'tw flat' }, h('table', { class: 'vtable' }, h('thead', null, h('tr', null, h('th', { text: t('vsItem') }), h('th', { text: t('vsRating') }))), tb))));
    });
    var notes = [[t('vsStrengths'), x.strengths], [t('vsImprove'), x.improve], [t('vsRecommend'), x.recommend]].filter(function (p) { return p[1]; });
    if (notes.length) v.appendChild(h('section', { class: 'panel', id: 'vdNotes' }, h('h3', { text: t('vsNotes') }), notes.map(function (p) { return h('div', { class: 'vnote' }, h('b', { text: p[0] }), h('p', { text: p[1] })); })));
    if (lead && x.note) v.appendChild(h('section', { class: 'panel noprint', id: 'vdPrivate' }, h('h3', { text: t('vsNote') }), h('p', { class: 'vnote-p', text: x.note })));
  }

  /* ---- the three forms ---- */
  function formText(form) { return form.sections.map(function (sec) { return '# ' + sec.title + '\n' + sec.items.join('\n'); }).join('\n\n'); }
  function formEditor(kind) {
    var cur = S.vs.forms[kind], title = h('input', { type: 'text', id: 'feTitle', maxlength: '80', required: true, value: cur.title }), scale = h('input', { type: 'text', id: 'feScale', required: true, value: cur.scale.join('، ') });
    var items = h('textarea', { id: 'feItems', rows: '14', dir: 'auto', required: true, value: formText(cur) }), save = h('button', { class: 'btn', type: 'submit', id: 'feSave' }, t('saveL'));
    showSheet(t('vsEditForm') + ' · ' + t('vk_' + kind), h('section', { class: 'box' }, h('form', { class: 'form', id: 'formEditor', onsubmit: function (e) {
      e.preventDefault();
      var sections = [], now = null;
      items.value.split(/\r?\n/).forEach(function (line) {
        line = tidy(line, 240);
        if (!line) return;
        if (line.charAt(0) === '#') { now = { title: tidy(line.replace(/^#+/, ''), 80), items: [] }; sections.push(now); return; }
        if (!now) { now = { title: t('vsItems'), items: [] }; sections.push(now); }
        now.items.push(line.replace(/^(?:\d{1,2}\s*[.)\-–]\s*|[-•*▪●]\s*)/, ''));      // numbering and bullets pasted from Word
      });
      var next = { title: tidy(title.value, 80), scale: splitNames(scale.value, 30), sections: sections }, before = { title: cur.title, scale: cur.scale, sections: cur.sections };
      var send = function (f) { return call('api_saveVisitForm', JSON.stringify({ kind: kind, form: f })).then(function (r) { S.vs.forms = JSON.parse(r).forms; }); };
      busy(save, true);
      send(next).then(function () { record(t('vsEditForm') + ' · ' + t('vk_' + kind), function () { return send(before); }, function () { return send(next); }); toast(t('vsFormSaved')); closeSheet(); render(); }, function (er) { busy(save, false); toast(errText(er), true); });
    } }, field(t('vsFormTitle'), title), field(t('vsScaleL'), scale, t('vsScaleHint')), field(t('vsItemsL'), items, t('vsItemsHint')), h('div', { class: 'actions' }, save))));
  }
  function vsForms(v) {
    v.appendChild(h('p', { class: 'lead', text: t('vsFormsLead') }));
    VKINDS.forEach(function (k) {
      var f = S.vs.forms[k], count = 0, body = h('div', { class: 'vform' });
      f.sections.forEach(function (sec) { count += sec.items.length; body.appendChild(h('div', null, h('b', { text: sec.title }), h('ol', { class: 'mini' }, sec.items.map(function (x) { return h('li', { text: x }); })))); });
      v.appendChild(h('section', { class: 'box', 'data-form': k }, h('div', { class: 'headrow' }, h('div', null, h('h2', { text: f.title }), h('p', { class: 'lead', text: f.sections.length + ' ' + t('vsDomainsW') + ' · ' + count + ' ' + t('vsItemsW') + ' · ' + t('vsScale') + ': ' + f.scale.join('، ') })),
        h('div', { class: 'actions' }, pill('pending', t('vk_' + k)), S.vs.canEditForms ? h('button', { class: 'btn sm', type: 'button', 'data-edit': k, onclick: function () { formEditor(k); } }, t('vsEditForm')) : null)), body));
    });
    v.appendChild(h('p', { class: 'note', text: t('vsFormsWho') }));
  }

  /* ---- the log of visits, and each teacher's evaluation ---- */
  function visitRows(list, withTeacher) {
    var tb = h('tbody');
    list.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }).forEach(function (x) {
      var open = function () { openVisit(x.id); }, lead = isLead();
      tb.appendChild(h('tr', { class: 'click', tabindex: '0', 'data-visit': x.id, onclick: open, onkeydown: function (e) { if (e.key === 'Enter') open(); } }, h('td', { class: 'num', text: fmtDate(x.date) }), withTeacher ? h('td', null, h('span', { class: 'nm', text: x.teacherName })) : null,
        h('td', { text: [x.klass, x.subject].filter(Boolean).join(' · ') || '—' }), h('td', { text: t('vk_' + x.kind) }), h('td', { text: x.byName }), h('td', null, pctPill(x.score)),
        h('td', null, lead ? (!x.shared ? pill('undated', t('vsHidden')) : x.seen ? pill('done', t('vsSeen')) : pill('soon', t('vsNotSeen'))) : (x.seen ? pill('done', t('vsSeen')) : pill('soon', t('vsNewTag'))))));
    });
    return h('div', { class: 'tw' }, h('table', { class: 'vlog' }, h('thead', null, h('tr', null, h('th', { text: t('vsDate') }), withTeacher ? h('th', { text: t('vsTeacher') }) : null, h('th', { text: t('klass') }), h('th', { text: t('vsForm') }), h('th', { text: t('vsVisitor') }), h('th', { text: t('vsResult') }), h('th', { text: t('status') }))), tb));
  }
  function termChips() {
    var row = h('div', { class: 'chips', id: 'vsTerm' });
    [['', t('vsAllTerms')], ['1', t('term1')], ['2', t('term2')]].forEach(function (x) { row.appendChild(h('button', { class: 'chip', type: 'button', 'aria-pressed': String(S.vsUi.term === x[0]), 'data-term': x[0], onclick: function () { S.vsUi.term = x[0]; paintMain(); } }, x[1])); });
    return row;
  }
  function vsLog(v) {
    var ui = S.vsUi, all = vsShown(), names = {}, list = all.filter(function (x) { return (!ui.who || x.teacher === ui.who) && (!ui.kind || x.kind === ui.kind); });
    all.forEach(function (x) { names[x.teacher] = x.teacherName; });
    var who = sel(t('vsTeacher'), ui.who, [['', t('vsAllTeachers')]].concat(Object.keys(names).sort(function (a, b) { return names[a] < names[b] ? -1 : 1; }).map(function (k) { return [k, names[k]]; })), function (val) { ui.who = val; paintMain(); });
    var kind = sel(t('vsForm'), ui.kind, [['', t('vsAllForms')]].concat(VKINDS.map(function (k) { return [k, t('vk_' + k)]; })), function (val) { ui.kind = val; paintMain(); });
    who.querySelector('select').id = 'vsWho'; kind.querySelector('select').id = 'vsKind';
    v.appendChild(termChips());
    v.appendChild(h('div', { class: 'filters' }, who, kind));
    if (!list.length) { v.appendChild(h('div', { class: 'empty', id: 'vsNone', text: t('vsNone') })); return; }
    v.appendChild(h('p', { class: 'lead', id: 'vsLogCount', text: list.length + ' ' + t('vsCount') + ' · ' + t('vsAvgAll') + ' ' + mean(list.map(function (x) { return x.score; })) + '%' }));
    v.appendChild(visitRows(list, true));
  }
  /** Everything recorded for one teacher: the averages by form and by domain, and the visits themselves. */
  function evalSheet(email, name) {
    var list = vsShown().filter(function (x) { return x.teacher === email; }), body = h('section', { class: 'box' });
    body.appendChild(h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('b', { text: list.length }), h('span', { text: t('vsCount') })), h('div', { class: 'stat' }, h('b', { text: list.length ? mean(list.map(function (x) { return x.score; })) + '%' : '—' }), h('span', { text: t('vsAvg') }))));
    VKINDS.forEach(function (k) {
      var mine = list.filter(function (x) { return x.kind === k; }), doms = {}, order = [];
      if (!mine.length) return;
      mine.forEach(function (x) { x.parts.forEach(function (p) { if (p[1] == null) return; if (!doms[p[0]]) { doms[p[0]] = []; order.push(p[0]); } doms[p[0]].push(p[1]); }); });
      var box = h('div', { class: 'vdoms' });
      order.forEach(function (d) { var p = mean(doms[d]), bar = h('i'); bar.style.width = p + '%'; box.appendChild(h('div', { class: 'vdom' }, h('span', { text: d }), h('div', { class: 'vbar b-' + band(p) }, bar), pctPill(p))); });
      body.appendChild(h('div', { class: 'headrow' }, h('h3', { text: t('vk_' + k) + ' · ' + mine.length }), pctPill(mean(mine.map(function (x) { return x.score; })))));
      body.appendChild(box);
    });
    showSheet(name, body, list.length ? h('section', { class: 'stack' }, h('h3', { text: t('vsVisitsOf') }), visitRows(list, false)) : h('div', { class: 'empty', text: t('vsNone') }),
      h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'button', id: 'tsNew', onclick: function () { startVisit(email); } }, ic('plus'), t('vsNew'))));
  }
  function vsEval(v) {
    var list = vsShown(), by = {}, people = [], seen = {};
    list.forEach(function (x) { (by[x.teacher] = by[x.teacher] || []).push(x); });
    S.users.forEach(function (u) { if (u.role === 'teacher' && u.active && stagesShown().some(function (st) { return canHold(u, st) && (!S.f.stage || st === S.f.stage); })) { people.push({ email: u.email, name: u.name }); seen[u.email] = 1; } });
    Object.keys(by).forEach(function (e) { if (!seen[e]) people.push({ email: e, name: by[e][0].teacherName }); });
    people.sort(byName);
    var visited = people.filter(function (p) { return by[p.email]; }).length, tb = h('tbody');
    v.appendChild(termChips());
    v.appendChild(h('p', { class: 'lead', text: t('vsEvalLead') }));
    v.appendChild(h('div', { class: 'stats', id: 'vsEvalStats' }, h('div', { class: 'stat' }, h('b', { text: visited + ' / ' + people.length }), h('span', { text: fillT('vsCoverage', { a: visited, b: people.length }) })),
      h('div', { class: 'stat' }, h('b', { text: list.length }), h('span', { text: t('vsCount') })), h('div', { class: 'stat' }, h('b', { text: list.length ? mean(list.map(function (x) { return x.score; })) + '%' : '—' }), h('span', { text: t('vsAvgAll') }))));
    people.forEach(function (p) {
      var mine = by[p.email] || [], last = mine.map(function (x) { return x.date; }).sort().pop(), open = function () { evalSheet(p.email, p.name); };
      tb.appendChild(h('tr', { class: 'click', tabindex: '0', 'data-teacher': p.email, onclick: open, onkeydown: function (e) { if (e.key === 'Enter') open(); } }, h('td', null, h('span', { class: 'nm', text: p.name })), h('td', { class: 'num', text: mine.length }),
        h('td', { class: 'num' }, last ? fmtDate(last) : pill('overdue', t('vsNotVisited'))), h('td', null, pctPill(mean(mine.map(function (x) { return x.score; })))),
        VKINDS.map(function (k) { return h('td', null, pctPill(mean(mine.filter(function (x) { return x.kind === k; }).map(function (x) { return x.score; })))); })));
    });
    v.appendChild(h('div', { class: 'tw' }, h('table', { id: 'vsEval' }, h('thead', null, h('tr', null, h('th', { text: t('vsTeacher') }), h('th', { text: t('vsCount') }), h('th', { text: t('vsLast') }), h('th', { text: t('vsAvg') }), VKINDS.map(function (k) { return h('th', { text: t('vk_' + k) }); }))), tb)));
  }
  function vVisits() {
    var v = h('div', { class: 'view visits' }), ui = S.vsUi, lead = isLead();
    if (!vsReady(v)) return v;
    if (ui.open) { visitDetail(v); return v; }
    if (lead && ui.form) { visitForm(v); return v; }
    v.appendChild(h('p', { class: 'lead', text: t(lead ? 'vsLead' : 'vsLeadMine') }));
    if (!lead) {
      var mine = S.vs.visits;
      if (!mine.length) { v.appendChild(h('div', { class: 'empty', id: 'vsNone', text: t('vsNoneMine') })); return v; }
      v.appendChild(h('div', { class: 'stats', id: 'vsMineStats' }, h('div', { class: 'stat' }, h('b', { text: mine.length }), h('span', { text: t('vsCount') })), h('div', { class: 'stat' }, h('b', { text: mean(mine.map(function (x) { return x.score; })) + '%' }), h('span', { text: t('vsMineAvg') }))));
      v.appendChild(visitRows(mine, false));
      return v;
    }
    var tabs = tabsRow([['log', t('vs_log')], ['eval', t('vs_eval')], ['forms', t('vs_forms')]], ui.tab, function (k) { ui.tab = k; paintMain(); });
    tabs.id = 'vsTabs';
    v.appendChild(h('div', { class: 'headrow' }, tabs, h('button', { class: 'btn', type: 'button', id: 'vsNew', onclick: function () { startVisit(''); } }, ic('plus'), t('vsNew'))));
    ({ log: vsLog, eval: vsEval, forms: vsForms }[ui.tab] || vsLog)(v);
    return v;
  }
