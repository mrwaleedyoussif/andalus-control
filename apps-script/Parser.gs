/**
 * Parser.gs
 * Pure functions that turn the values of a main-file sheet (a 2D array) into programme records.
 * No Google service is used here, so the same code runs in the preview and in the tests.
 */
var AP = (function () {
  var STAGES = [
    'ابتدائي بنين أهلي', 'متوسط بنين أهلي', 'ثانوي بنين أهلي', 'رياض الأطفال أهلي',
    'ابتدائي بنات أهلي', 'متوسط بنات أهلي', 'ثانوي بنات أهلي',
    'ابتدائي بنين عالمي', 'متوسط بنين عالمي', 'ثانوي بنين عالمي', 'رياض الأطفال عالمي',
    'ابتدائي بنات عالمي', 'متوسط بنات عالمي', 'ثانوي بنات عالمي'
  ];

  /** Normalises Arabic text so that spelling variants compare equal. */
  /* RULES-START: what state a programme or an indicator is in. build.js copies this block into the page, so the server and the page always agree. */
  var RULES = (function () {
    function addDays(d, n) { var b = d.split('-'); return new Date(Date.UTC(+b[0], +b[1] - 1, +b[2]) + n * 864e5).toISOString().slice(0, 10); }
    function daysBetween(a, b) { return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 864e5); }
    /** done, undated, overdue (end date passed), active (started), soon (starts within 7 days) or upcoming. */
    function statusOf(p, today) {
      if (p.done) return 'done';
      if (!p.from) return 'undated';
      if ((p.to || p.from) < today) return 'overdue';
      if (p.from <= today) return 'active';
      return p.from <= addDays(today, 7) ? 'soon' : 'upcoming';
    }
    /** How far through its dates a running programme is, 1 to 100. */
    function progressOf(p, today) {
      var span = daysBetween(p.from, p.to || p.from) + 1, gone = daysBetween(p.from, today) + 1;
      return Math.max(1, Math.min(100, Math.round(gone * 100 / span)));
    }
    /** Five shades of blue: 1 for just started, 5 for nearly complete. */
    function grade(pct) { return Math.max(1, Math.min(5, Math.ceil(pct / 20))); }
    function counts(list, today) {
      var n = { done: 0, active: 0, soon: 0, overdue: 0, upcoming: 0, undated: 0 };
      list.forEach(function (p) { n[statusOf(p, today)]++; });
      return n;
    }
    /** One state for a whole indicator, and the share of its programmes that are done. */
    function indicatorState(list, today) {
      var c = counts(list, today), n = list.length, st;
      if (n && c.done === n) st = 'done';
      else if (c.overdue) st = 'overdue';
      else if (c.done || c.active) st = 'active';
      else if (c.soon) st = 'soon';
      else st = c.upcoming ? 'upcoming' : 'undated';
      return { state: st, pct: n ? Math.round(c.done * 100 / n) : 0, c: c, n: n };
    }
    function schoolOf(stage) { return /عالمي$/.test(stage) ? 'intl' : 'private'; }
    return { addDays: addDays, daysBetween: daysBetween, statusOf: statusOf, progressOf: progressOf, grade: grade, counts: counts, indicatorState: indicatorState, schoolOf: schoolOf };
  })();
  /* RULES-END */

  function norm(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/[أإآ]/g, 'ا').replace(/ـ/g, '').replace(/[ً-ْ]/g, '')
      .replace(/\s+/g, ' ').trim();
  }

  var STAGE_BY_NORM = {};
  STAGES.forEach(function (s) { STAGE_BY_NORM[norm(s)] = s; });

  var CODE_RE = /^[A-D]\.Br\s*\d\.\d/;

  // Some tabs head an indicator with the wrong code. The indicator's name decides.
  var KPI_FIX = [
    ['جودة التواصل', 'B.Br 1.2'], ['القيم والهوية', 'C.Br 4.2'], ['تجربة الطالب التعليمية', 'C.Br 2.2'],
    ['امن وسلامة', 'D.Br 4.1'], ['اجادة تعلم', 'C.Br 1.4'], ['المراكز التنافسية', 'C.Br 1.3']
  ];

  // Column heading keywords, most specific first. The first match wins.
  var FIELDS = [
    ['evidence', ['تقرير/شاهد', 'شاهد التنفيذ']], ['done', ['حالة اتمام']], ['approved', ['اعتماد التخطيط']],
    ['techNotes', ['ملاحظات الجهة الفنية']], ['comment', ['تعليق مدير']], ['actual', ['العدد الفعلي', 'الايراد الفعلي']],
    ['budgetLine', ['بند الميزانية', 'المصدر']], ['budget', ['الميزانية']],
    ['revenue', ['الايراد الاجمالي المستهدف']], ['cost', ['التكلفة المتوقعة']], ['net', ['صافي الايرادات المتوقع']],
    ['start', ['تاريخ التنفيذ']], ['end', ['تاريخ الانتهاء']],
    ['count', ['اعداد الطلاب', 'العدد المستهدف', 'عدد الطلبة المستهدف', 'عدد المنسوبين المستهدف']],
    ['assignee', ['المكلف']], ['place', ['مكان الفعالية']], ['group', ['الفئة']],
    ['link', ['رابط']], ['details', ['التفاصيل', 'وصف البرامج']],
    ['item', ['بند التخطيط', 'البند', 'موضوع المشاركة', 'بند المشاركة']], ['method', ['وسائل التنفيذ', 'الية المشاركة']],
    ['name', ['اسم', 'اسنم البرنامج']]
  ];
  var HEADER_KEYS = ['بند التخطيط', 'وقت التنفيذ', 'اسم', 'اسنم البرنامج'];
  var KPI_COLS = [
    ['owner', 'مسؤول المؤشر'], ['last', 'نتيجة عام'], ['target', 'مستهدف عام'], ['t1Target', 'مستهدف الفصل الاول'],
    ['t1Result', 'نتيجة الفصل الاول'], ['t2Target', 'مستهدف الفصل الثاني'], ['t2Result', 'نتيجة الفصل الثاني']
  ];

  function fieldOf(label) {
    for (var i = 0; i < FIELDS.length; i++) {
      var keys = FIELDS[i][1];
      for (var k = 0; k < keys.length; k++) if (label.indexOf(keys[k]) !== -1) return FIELDS[i][0];
    }
    return null;
  }

  function isBlank(v) { return v === null || v === undefined || v === ''; }
  function isStr(v) { return typeof v === 'string' && v.trim() !== ''; }
  function isNum(v) { return typeof v === 'number' && isFinite(v); }
  function isDate(v) { return Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime()); }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(y, m, d) { return y + '-' + pad(m) + '-' + pad(d); }

  /** Returns {iso, text}. iso is yyyy-mm-dd or null; text is true when a date was typed as text and cannot be read. */
  function readDate(v) {
    if (isBlank(v)) return { iso: null, text: false };
    if (isDate(v)) return { iso: iso(v.getFullYear(), v.getMonth() + 1, v.getDate()), text: false };
    if (isNum(v)) {
      if (v > 40000 && v < 60000) {
        var d = new Date(Date.UTC(1899, 11, 30) + Math.round(v) * 86400000);
        return { iso: iso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()), text: false };
      }
      return { iso: null, text: false };
    }
    var s = String(v).replace(/\s+/g, '');
    var m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
    if (m && +m[2] >= 1 && +m[2] <= 12 && +m[1] >= 1 && +m[1] <= 31) return { iso: iso(+m[3], +m[2], +m[1]), text: true };
    m = s.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/);
    if (m && +m[2] >= 1 && +m[2] <= 12 && +m[3] >= 1 && +m[3] <= 31) return { iso: iso(+m[1], +m[2], +m[3]), text: true };
    return { iso: null, text: /\d{2,}/.test(s) };
  }

  /** Small stable hash (two FNV-1a passes) used as the programme key. */
  function hash(str) {
    var h1 = 0x811c9dc5, h2 = 0x01000193;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      h1 ^= c; h1 = (h1 * 0x01000193) >>> 0;
      h2 ^= c + i; h2 = (h2 * 0x811c9dc5 + 0x9e3779b9) >>> 0;
    }
    return ('00000000' + h1.toString(16)).slice(-8) + ('00000000' + h2.toString(16)).slice(-8);
  }

  function isHeaderRow(row) {
    var strs = [], hasBool = false;
    for (var c = 0; c < row.length; c++) {
      if (typeof row[c] === 'boolean') hasBool = true;
      else if (isStr(row[c])) strs.push(norm(row[c]));
    }
    if (hasBool || strs.length < 5) return false;
    var txt = strs.join(' | ');
    var key = HEADER_KEYS.some(function (k) { return txt.indexOf(k) !== -1; });
    return key && (txt.indexOf('اعتماد') !== -1 || txt.indexOf('المكلف') !== -1);
  }

  function cleanText(v, max) {
    if (isBlank(v) || typeof v === 'boolean') return '';
    var s = isDate(v) ? readDate(v).iso : String(v);
    s = s.replace(/\s+/g, ' ').trim();
    return max && s.length > max ? s.slice(0, max) : s;
  }

  /**
   * Parses one indicator tab.
   * @param {string} sheetName
   * @param {Array<Array>} values the tab's values, as getDataRange().getValues() returns them
   * @return {{programs: Array<Object>, indicators: Array<Object>}}
   */
  function parseSheet(sheetName, values) {
    var marks = [], r, c;
    for (r = 0; r < values.length; r++) {
      var row = values[r];
      for (c = 0; c < Math.min(row.length, 3); c++) {
        if (!isStr(row[c])) continue;
        var n = norm(row[c]);
        if (CODE_RE.test(n)) {
          marks.push({ row: r, type: 'kpi', code: n.match(CODE_RE)[0].replace(/\s+/g, ' '), name: norm(row[c + 1]) });
          break;
        }
        if (c === 1 && STAGE_BY_NORM[n]) { marks.push({ row: r, type: 'stage', stage: STAGE_BY_NORM[n] }); break; }
      }
    }
    var programs = [], indicators = [], tables = [], tbl = null, kpi = { code: '', name: '' }, blockNo = {}, seen = {};
    for (var i = 0; i < marks.length; i++) {
      var mk = marks[i];
      if (mk.type === 'kpi') {
        kpi = { code: mk.code, name: mk.name.replace(/^[^؀-ۿA-Za-z]+/, '') };
        KPI_FIX.forEach(function (f) { if (kpi.name.indexOf(f[0]) !== -1) kpi.code = f[1]; });
        continue;
      }
      var end = i + 1 < marks.length ? marks[i + 1].row - 1 : values.length - 1;
      var bkey = kpi.code + '|' + mk.stage;
      blockNo[bkey] = (blockNo[bkey] || 0) + 1;
      var head = values[mk.row], kpiCols = {};
      for (c = 2; c < head.length; c++) {
        if (!isStr(head[c])) continue;
        var hl = norm(head[c]);
        for (var q = 0; q < KPI_COLS.length; q++) if (hl.indexOf(KPI_COLS[q][1]) === 0 && !(KPI_COLS[q][0] in kpiCols)) kpiCols[KPI_COLS[q][0]] = c;
      }
      var info = { sheet: sheetName, kpi: kpi.code, kpiName: kpi.name, stage: mk.stage, block: blockNo[bkey], label: '', row: mk.row + 1 };
      var hdr = null, sub = '', first = true;
      tbl = null;
      for (r = mk.row + 1; r <= end; r++) {
        row = values[r];
        var strs = [];
        for (c = 0; c < row.length; c++) if (isStr(row[c])) strs.push(norm(row[c]));
        if (!strs.length && !row.some(function (v) { return isNum(v) || isDate(v); })) continue;
        if (first) {
          first = false;
          info.label = cleanText(row[1], 80).replace(/^[^؀-ۿA-Za-z]+/, '');
          Object.keys(kpiCols).forEach(function (k) {
            var v = row[kpiCols[k]];
            if (!isBlank(v) && typeof v !== 'boolean') info[k] = isNum(v) ? v : cleanText(v, 60);
          });
        }
        if (isHeaderRow(row)) {
          hdr = {};
          var used = {};
          for (c = 0; c < row.length; c++) {
            if (!isStr(row[c])) continue;
            var f = fieldOf(norm(row[c]));
            if (f && !used[f]) { used[f] = true; hdr[c] = f; }
          }
          hdr._cols = used;
          // the table as it sits in the sheet: every heading cell, in order, for writing a new programme into a free row
          tbl = { sheet: sheetName, kpi: kpi.code, stage: mk.stage, block: blockNo[bkey], sub: sub, headerRow: r + 1, end: end + 1, cols: [], rows: [] };
          var usedT = {};
          for (c = 0; c < row.length; c++) {
            if (!isStr(row[c])) continue;
            var lab = norm(row[c]), ff = fieldOf(lab) || (lab.indexOf('وقت التنفيذ') !== -1 ? 'when' : lab.indexOf('الفصل الدراسي') !== -1 ? 'term' : '');
            if (ff && usedT[ff]) ff = '';
            if (ff) usedT[ff] = true;
            tbl.cols.push({ col: c + 1, field: ff, label: cleanText(row[c], 60) });
          }
          tables.push(tbl);
          continue;
        }
        if (strs.some(function (s) { return s === 'الرجوع الى' || s === 'بداية الصفحة' || s.indexOf('خطة العمل') === 0; })) { hdr = null; tbl = null; continue; }
        if (!hdr) {
          if (strs.length && strs.length <= 3 && !row.some(isNum)) sub = strs.filter(function (s) { return /[؀-ۿ]{3}/.test(s); }).join(' ').slice(0, 60) || sub;
          continue;
        }
        var p = { sheet: sheetName, kpi: kpi.code, kpiName: kpi.name, stage: mk.stage, block: blockNo[bkey], sub: sub, row: r + 1, c: {} };
        var colByField = {};
        Object.keys(hdr).forEach(function (ci) { if (ci !== '_cols') colByField[hdr[ci]] = +ci; });
        ['name', 'done', 'actual', 'evidence', 'comment'].forEach(function (k) { if (k in colByField) p.c[k] = colByField[k] + 1; });
        p.hasOwnerCol = 'assignee' in colByField;
        var val = function (k) { return k in colByField ? row[colByField[k]] : null; };
        p.name = cleanText(val('name'), 160);
        p.details = cleanText(val('details'), 600);
        if (!p.name && !p.details) continue;
        if (!p.name) p.name = p.details.slice(0, 60);
        p.item = cleanText(val('item'), 120);
        p.method = cleanText(val('method'), 80);
        p.assignee = cleanText(val('assignee'), 120);
        p.place = cleanText(val('place'), 80);
        p.group = cleanText(val('group'), 80);
        p.budgetLine = cleanText(val('budgetLine'), 80);
        ['count', 'budget', 'revenue', 'cost', 'net', 'actual'].forEach(function (k) { var v = val(k); p[k] = isNum(v) ? v : null; });
        p.approved = val('approved') === true;
        p.done = val('done') === true;
        p.techNotes = cleanText(val('techNotes'), 300);
        p.comment = cleanText(val('comment'), 300);
        p.evidence = cleanText(val('evidence'), 500);
        var joined = strs.join(' ');
        var tm = joined.match(/فصل\s*(\d)/), wm = joined.match(/الاسبوع\s*(\d+)/);
        p.term = tm ? +tm[1] : null;
        p.week = wm ? +wm[1] : null;
        var sd = readDate(val('start')), ed = readDate(val('end'));
        p.start = sd.iso; p.end = ed.iso; p.textDate = sd.text || ed.text;
        var fp = [sheetName, kpi.code, mk.stage, p.block, norm(p.name), p.term || '', p.week || '', p.start || ''].join('|');
        seen[fp] = (seen[fp] || 0) + 1;
        p.key = hash(fp + '#' + seen[fp]);
        programs.push(p);
        if (tbl) tbl.rows.push(r + 1);
      }
      indicators.push(info);
    }
    return { programs: programs, indicators: indicators, tables: tables };
  }

  var PLAN_AFTER = { approved: 1, techNotes: 1, done: 1, actual: 1, evidence: 1, comment: 1 };   // the first of these ends the plan columns
  /** Where the plan part of a table lies: its first and last column, the approval column and the name column. Null when it is not a plan table. */
  function planBounds(tbl) {
    var by = {}, after = 0;
    tbl.cols.forEach(function (c) { if (c.field) by[c.field] = c.col; if (PLAN_AFTER[c.field] && (!after || c.col < after)) after = c.col; });
    if (!by.name || !after) return null;
    return { first: tbl.cols[0].col, last: after - 1, approvedCol: by.approved || 0, nameCol: by.name };
  }
  /** The rows the main branch left free under a table: after its last programme, with empty plan cells and an unticked approval box. */
  function freeRows(tbl, values) {
    var b = planBounds(tbl), out = [];
    if (!b) return out;
    for (var r = (tbl.rows.length ? Math.max.apply(null, tbl.rows) : tbl.headerRow) + 1; r <= Math.min(tbl.end, values.length); r++) {
      var row = values[r - 1], empty = true;
      for (var c = b.first; c <= b.last; c++) if (!isBlank(row[c - 1])) { empty = false; break; }
      if (!empty || (b.approvedCol && row[b.approvedCol - 1] !== false)) break;
      out.push(r);
    }
    return out;
  }

  /** Adds from/to dates (yyyy-mm-dd) using the explicit dates, or the term and week with the configured term starts. */
  function withDates(p, cfg) {
    var from = p.start, to = p.end;
    if (!from && p.term && p.week && cfg && cfg.termStarts && cfg.termStarts[p.term]) {
      var b = cfg.termStarts[p.term].split('-');
      var d = new Date(Date.UTC(+b[0], +b[1] - 1, +b[2]) + (p.week - 1) * 7 * 86400000);
      from = iso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
      var e = new Date(d.getTime() + 4 * 86400000);
      to = iso(e.getUTCFullYear(), e.getUTCMonth() + 1, e.getUTCDate());
    }
    p.from = from || null;
    p.to = to || from || null;
    return p;
  }

  /** Reads owner and targets per stage from the KPIS Targets tab. */
  function parseTargets(values) {
    var hr = -1, r, c, stageCols = {};
    for (r = 0; r < Math.min(values.length, 30); r++) {
      var found = {};
      for (c = 0; c < values[r].length; c++) { var s = STAGE_BY_NORM[norm(values[r][c])]; if (s) found[s] = c; }
      if (Object.keys(found).length >= 3) { hr = r; stageCols = found; break; }
    }
    if (hr < 0) return [];
    var codeCol = -1, nameCol = -1, unitCol = -1;
    for (c = 0; c < values[hr].length; c++) {
      var l = norm(values[hr][c]);
      if (l.indexOf('رمز المؤشر') !== -1) codeCol = c;
      else if (l.indexOf('المؤشرات النشطة') !== -1) nameCol = c;
      else if (l.indexOf('وحدة القياس') !== -1) unitCol = c;
    }
    if (codeCol < 0) return [];
    var out = [];
    for (r = hr + 1; r < values.length; r++) {
      var code = norm(values[r][codeCol]);
      if (!CODE_RE.test(code)) continue;
      var item = { code: code.replace(/\s+/g, ' '), name: norm(values[r][nameCol]), unit: cleanText(values[r][unitCol], 3), stages: {} };
      KPI_FIX.forEach(function (f) { if (item.name.indexOf(f[0]) !== -1) item.code = f[1]; });
      Object.keys(stageCols).forEach(function (st) {
        var b = stageCols[st], row = values[r];
        if (isBlank(row[b]) && isBlank(row[b + 1])) return;
        item.stages[st] = { owner: cleanText(row[b], 60), target: isNum(row[b + 1]) ? row[b + 1] : null, t1: isNum(row[b + 2]) ? row[b + 2] : null, t2: isNum(row[b + 3]) ? row[b + 3] : null };
      });
      out.push(item);
    }
    return out;
  }

  /* ---------- notifications (pure: who is told what on a given day) ---------- */

  function shiftDay(isoDate, n) {
    var b = isoDate.split('-'), d = new Date(Date.UTC(+b[0], +b[1] - 1, +b[2]) + n * 86400000);
    return iso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  }

  /** Users whose name, as written in the main file, appears in the given text. */
  function namedIn(text, users) {
    var t = norm(text).toLowerCase();
    if (!t) return [];
    return users.filter(function (u) {
      return (u.aliases || []).concat([u.name]).some(function (n) { n = norm(n).toLowerCase(); return n.length > 3 && t.indexOf(n) !== -1; });
    });
  }

  // 3 days before start, 24 hours before start, start day, 24 hours before end, the day after the end, a week after the end
  var KINDS = ['d3', 'd1', 'd0', 'e1', 'o1', 'o7'];
  var ADMIN_KINDS = { d1: true, d0: true, e1: true, o7: true };

  /**
   * Works out today's notifications from the programme dates.
   * The person carrying out a programme and the indicator's owner are told 3 days before the start, 24 hours before it,
   * on the start day, and 24 hours before the end. Admins are told at the last three of those moments.
   * Where an admin has chosen a responsible person in the platform (assign: programme key -> email), that person is the one
   * carrying it out, whatever name the main file holds.
   * A programme that passes its end date without being marked done is followed up the next day (the person and the indicator's
   * owner) and a week later (they and the admins), unless a report on it has already been sent (reported: programme key -> true).
   * @return {Array<{email, name, phone, channel, items: Array<{kind, role, key, name, kpi, kpiName, stage, from, to}>}>}
   */
  function buildNotifications(snapshot, users, today, adminRoles, assign, reported) {
    var active = users.filter(function (u) { return u.active && u.channel !== 'off'; });
    var canSee = function (u, stage) { return u.stages.indexOf('*') !== -1 || u.stages.indexOf(stage) !== -1; };
    var ownerName = {};
    (snapshot.targets || []).forEach(function (t) { Object.keys(t.stages || {}).forEach(function (s) { if (t.stages[s].owner) ownerName[t.code + '|' + s] = t.stages[s].owner; }); });
    (snapshot.indicators || []).forEach(function (b) { if (b.owner) ownerName[b.kpi + '|' + b.stage] = b.owner; });
    var byEmail = {}, order = [];
    (snapshot.programs || []).forEach(function (p) {
      if (p.done || !p.from) return;
      var to = p.to || p.from, kinds = [];
      if (p.from === shiftDay(today, 3)) kinds.push('d3');
      if (p.from === shiftDay(today, 1)) kinds.push('d1');
      if (p.from === today) kinds.push('d0');
      if (to !== p.from && to === shiftDay(today, 1)) kinds.push('e1');
      if (!(reported && reported[p.key])) {
        if (to === shiftDay(today, -1)) kinds.push('o1');
        if (to === shiftDay(today, -7)) kinds.push('o7');
      }
      if (!kinds.length) return;
      var roleOf = {};
      active.forEach(function (u) { if (adminRoles.indexOf(u.role) !== -1 && canSee(u, p.stage)) roleOf[u.email] = 'admin'; });
      namedIn(ownerName[p.kpi + '|' + p.stage] || '', active).forEach(function (u) { if (canSee(u, p.stage)) roleOf[u.email] = 'owner'; });
      var chosen = assign && assign[p.key];
      (chosen ? active.filter(function (u) { return u.email === chosen; }) : namedIn(p.assignee || '', active)).forEach(function (u) { if (canSee(u, p.stage)) roleOf[u.email] = 'exec'; });
      active.forEach(function (u) {
        var role = roleOf[u.email];
        if (!role) return;
        kinds.forEach(function (k) {
          if (role === 'admin' && !ADMIN_KINDS[k]) return;
          if (!byEmail[u.email]) { byEmail[u.email] = { email: u.email, name: u.name, phone: u.phone || '', channel: u.channel || 'email', items: [] }; order.push(u.email); }
          byEmail[u.email].items.push({ kind: k, role: role, key: p.key, name: p.name, kpi: p.kpi, kpiName: p.kpiName || '', stage: p.stage, from: p.from, to: to });
        });
      });
    });
    return order.map(function (e) {
      byEmail[e].items.sort(function (a, b) { return KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind); });
      return byEmail[e];
    });
  }

  /**
   * The picture of one group of programmes (a school or a stage) for the weekly report: numbers by state, each indicator,
   * the longest-overdue programmes, what starts in the next seven days, and a line per person.
   * opts: today, users (the staff list), assign (programme key -> email), submissions (reports, to count those waiting for review).
   */
  function weeklySummary(programs, opts) {
    var today = opts.today, users = (opts.users || []).filter(function (u) { return u.active; }), assign = opts.assign || {}, byEmail = {};
    users.forEach(function (u) { byEmail[u.email] = u; });
    var c = RULES.counts(programs, today), grades = [0, 0, 0, 0, 0], kp = {}, order = [], people = {}, stages = {}, free = 0, late = [], ahead = [], weekEnd = RULES.addDays(today, 6);
    programs.forEach(function (p) {
      var st = RULES.statusOf(p, today);
      stages[p.stage] = true;
      if (st === 'active') grades[RULES.grade(RULES.progressOf(p, today)) - 1]++;
      if (!kp[p.kpi]) { kp[p.kpi] = { code: p.kpi, name: p.kpiName || '', list: [] }; order.push(p.kpi); }
      kp[p.kpi].list.push(p);
      var chosen = assign[p.key] && byEmail[assign[p.key]], owners = chosen ? [chosen] : namedIn(p.assignee || '', users), who = chosen ? chosen.name : (p.assignee || '');
      if (!owners.length) free++;
      owners.forEach(function (u) {
        var r = people[u.email] = people[u.email] || { name: u.name, n: 0, done: 0, active: 0, soon: 0, overdue: 0 };
        r.n++;
        if (r[st] !== undefined) r[st]++;
      });
      if (st === 'overdue') late.push({ name: p.name, kpi: p.kpi, stage: p.stage, to: p.to || p.from, days: RULES.daysBetween(p.to || p.from, today), who: who });
      if (st !== 'done' && p.from && p.from >= today && p.from <= weekEnd) ahead.push({ name: p.name, kpi: p.kpi, stage: p.stage, from: p.from, who: who });
    });
    late.sort(function (a, b) { return a.to < b.to ? -1 : a.to > b.to ? 1 : 0; });
    ahead.sort(function (a, b) { return a.from < b.from ? -1 : a.from > b.from ? 1 : 0; });
    var rows = Object.keys(people).map(function (e) { return people[e]; }).sort(function (a, b) { return b.overdue - a.overdue || b.n - a.n; });
    return {
      total: programs.length, counts: c, grades: grades, pct: programs.length ? Math.round(c.done * 100 / programs.length) : 0,
      indicators: order.map(function (code) {
        var s = RULES.indicatorState(kp[code].list, today);
        return { code: code, name: kp[code].name, n: s.n, done: s.c.done, active: s.c.active, overdue: s.c.overdue, state: s.state, pct: s.pct };
      }),
      late: late.slice(0, 12), lateTotal: late.length, ahead: ahead.slice(0, 12), aheadTotal: ahead.length,
      people: rows.slice(0, 30), peopleTotal: rows.length, free: free,
      pending: (opts.submissions || []).filter(function (x) { return x.status === 'pending' && stages[x.stage]; }).length
    };
  }

  var KIND_AR = { d3: 'يبدأ بعد 3 أيام', d1: 'يبدأ غداً', d0: 'يبدأ اليوم', e1: 'ينتهي غداً', o1: 'انتهى أمس ولم يُعلَّم مكتملاً', o7: 'متأخر منذ أسبوع' };
  var ROLE_AR = { exec: 'منفّذ', owner: 'مسؤول المؤشر', admin: 'إدارة' };

  /** One-line summary, safe as a WhatsApp template parameter (no line breaks). */
  function digestLine(rec) {
    var n = {};
    rec.items.forEach(function (it) { n[it.kind] = (n[it.kind] || 0) + 1; });
    var parts = KINDS.filter(function (k) { return n[k]; }).map(function (k) { return n[k] + ' ' + KIND_AR[k]; });
    if (rec.tasks && rec.tasks.length) parts.push(rec.tasks.length + ' من مهامك اليوم');
    return parts.join('، ');
  }

  /**
   * A person's own tasks that fall on a date. A one-off task falls on its date. A daily task repeats on school days
   * (Sunday to Thursday). A weekly task repeats on the weekday of its first date. Tasks ticked done for that date are left out.
   */
  function tasksOn(tasks, day) {
    var wd = new Date(day + 'T00:00:00Z').getUTCDay();
    return tasks.filter(function (t) {
      if (!t.date || day < t.date || (t.until && day > t.until)) return false;
      if ((t.done || []).indexOf(day) !== -1) return false;
      if (t.repeat === 'daily') return wd !== 5 && wd !== 6;
      if (t.repeat === 'weekly') return new Date(t.date + 'T00:00:00Z').getUTCDay() === wd;
      return t.date === day;
    }).sort(function (a, b) { return (a.time || '99') < (b.time || '99') ? -1 : 1; });
  }

  /** The platform's name, as it appears in messages. */
  var APP_NAME = 'مسار الإنجاز', APP_ORG = 'مدارس الأندلس بالطائف';

  /** The day's message as plain text, for WhatsApp and for the text part of the email. */
  function digestText(rec, today, siteUrl) {
    var lines = [APP_NAME + ' - ' + APP_ORG, 'تنبيهات ' + today + ' إلى ' + rec.name, ''];
    KINDS.forEach(function (k) {
      var items = rec.items.filter(function (it) { return it.kind === k; });
      if (!items.length) return;
      lines.push('▪ ' + KIND_AR[k] + ' (' + items.length + ')');
      items.slice(0, 12).forEach(function (it) { lines.push('  - ' + it.name + ' | ' + it.kpi + ' | ' + it.stage + ' | ' + ROLE_AR[it.role]); });
      if (items.length > 12) lines.push('  … و' + (items.length - 12) + ' أخرى');
    });
    if (rec.tasks && rec.tasks.length) {
      lines.push('▪ مهامك اليوم (' + rec.tasks.length + ')');
      rec.tasks.slice(0, 15).forEach(function (t) { lines.push('  - ' + (t.time ? t.time + ' ' : '') + t.title); });
    }
    if (siteUrl) lines.push('', siteUrl);
    return lines.join('\n');
  }

  /* ---------- classroom visits: the forms the school starts with ---------- */
  var VISIT_SCALE = ['متميز', 'جيد', 'مقبول', 'يحتاج تطويراً'];
  // Starting forms, so the section works at once. The school replaces them with its own from the page.
  var VISIT_FORMS = {
    principal: { kind: 'principal', title: 'استمارة زيارة المدير (نموذج مبدئي)', scale: VISIT_SCALE, sections: [
      { title: 'التخطيط والإعداد', items: ['خطة الدرس مكتوبة وأهدافها واضحة', 'الوسائل ومصادر التعلم مجهزة قبل الحصة'] },
      { title: 'البيئة الصفية', items: ['الصف منظم ونظيف ومهيأ للتعلم', 'العلاقة بين المعلم والطلاب يسودها الاحترام', 'قواعد الصف واضحة ويلتزم بها الطلاب'] },
      { title: 'سير الدرس', items: ['بدأ الدرس وانتهى في وقته', 'الطلاب منخرطون في التعلم معظم الحصة', 'يتابع المعلم تعلم الطلاب ويقدّم تغذية راجعة'] },
      { title: 'القيم والهوية', items: ['يعزز المعلم القيم والسلوك الإيجابي', 'المعلم قدوة في المظهر واللغة والتعامل'] }] },
    academic: { kind: 'academic', title: 'استمارة زيارة المشرف الأكاديمي (نموذج مبدئي)', scale: VISIT_SCALE, sections: [
      { title: 'أهداف الدرس', items: ['الأهداف محددة وقابلة للقياس ومعلنة للطلاب', 'الأهداف مرتبطة بالمنهج ونواتج التعلم'] },
      { title: 'استراتيجيات التدريس', items: ['ينوّع المعلم في استراتيجيات التدريس', 'يوظف التعلم النشط والعمل التعاوني', 'يراعي الفروق الفردية بين الطلاب', 'يربط الدرس بخبرات الطلاب وحياتهم', 'يطرح أسئلة تنمّي مهارات التفكير العليا'] },
      { title: 'المحتوى العلمي', items: ['المادة العلمية صحيحة ودقيقة', 'تسلسل عرض الدرس منطقي ومترابط'] },
      { title: 'التقويم', items: ['يستخدم تقويماً تكوينياً أثناء الحصة', 'يقدّم تغذية راجعة فورية وبنّاءة', 'يختم الدرس بتقويم يقيس تحقق الأهداف'] },
      { title: 'التقنية ومصادر التعلم', items: ['يوظف التقنية والمنصات التعليمية بفاعلية', 'يستخدم مصادر تعلم مناسبة ومتنوعة'] }] },
    vp: { kind: 'vp', title: 'استمارة زيارة الوكيل (نموذج مبدئي)', scale: VISIT_SCALE, sections: [
      { title: 'الانضباط والوقت', items: ['حضر المعلم إلى الحصة في وقتها', 'يدير وقت الحصة بكفاءة', 'يضبط المعلم الصف ويعالج السلوك بأسلوب تربوي'] },
      { title: 'السجلات والمتابعة', items: ['سجل الحضور والغياب محدّث', 'يتابع الواجبات وأعمال الطلاب بانتظام', 'سجلات الدرجات والمتابعة مكتملة'] },
      { title: 'بيئة الصف وسلامته', items: ['جلوس الطلاب منظم ويناسب أنشطة الدرس', 'الصف آمن ونظيف والممتلكات محافظ عليها', 'يلتزم الطلاب بالزي واللوائح المدرسية'] }] }
  };

  return { VISIT_FORMS: VISIT_FORMS, STAGES: STAGES, norm: norm, parseSheet: parseSheet, parseTargets: parseTargets, withDates: withDates, readDate: readDate, hash: hash,
    APP_NAME: APP_NAME, APP_ORG: APP_ORG, rules: RULES, weeklySummary: weeklySummary, planBounds: planBounds, freeRows: freeRows, shiftDay: shiftDay, namedIn: namedIn, tasksOn: tasksOn, buildNotifications: buildNotifications, digestLine: digestLine, digestText: digestText, KINDS: KINDS, KIND_AR: KIND_AR, ROLE_AR: ROLE_AR };
})();

if (typeof module !== 'undefined') module.exports = AP;
