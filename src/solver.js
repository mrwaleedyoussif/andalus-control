/* SOLVER-START: designs the school's sessions schedule from classes, weekly sessions, teachers and the admins' instructions.
   Pure functions: no page and no server. The page runs it; test/solver.test.js checks it. */
var APSolver = (function () {
  'use strict';
  var D = 5, P = 8, N = D * P;
  // What the design tries to avoid, and how strongly. Clashes and "must" instructions are never traded: they are not in this list.
  var W = { gap: 60, split: 25, extra: 6, bal: 3, tgap: 4, tbal: 2, streak: 3, streakRule: 15, pref: 25, must: 1e6 };
  var RULE_TYPES = ['off', 'window', 'maxDay', 'subjectDay', 'fixed', 'together', 'streak'];

  function rng(seed) {
    var a = (seed >>> 0) || 1;
    return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function clamp(v, lo, hi) { v = Math.floor(+v); return isNaN(v) ? lo : Math.max(lo, Math.min(hi, v)); }
  function span(r) { var a = clamp(r.from == null ? 1 : r.from, 1, P), b = clamp(r.to == null ? P : r.to, 1, P); return a <= b ? [a, b] : [b, a]; }
  function daysOf(r) { var out = (r.days || []).map(Number).filter(function (d) { return d >= 0 && d < D; }); return out.length ? out : [0, 1, 2, 3, 4]; }
  function dayLens(setup) { var out = []; for (var d = 0; d < D; d++) { var v = (setup.dayLen || [])[d]; out.push(v == null ? P : clamp(v, 0, P)); } return out; }
  /** General instructions first, then those naming one teacher, so the specific one has the last word. */
  function ordered(rules) { return (rules || []).filter(function (r) { return !r.teacher; }).concat((rules || []).filter(function (r) { return !!r.teacher; })); }

  /**
   * Turns the admins' setup into numbers, and checks it can be built at all.
   * setup: { dayLen[5], classes[], teachers[{id,name,quota,maxDay}], loads[{klass,subject,count,teacher}], rules[] }
   * Returns { ok, errors[], warnings[], problem }. Errors stop the build; warnings do not.
   */
  function compile(setup) {
    var cls = setup.classes || [], tch = setup.teachers || [], rules = ordered(setup.rules), C = cls.length, T = tch.length;
    var cIdx = Object.create(null), tIdx = Object.create(null), sIdx = Object.create(null), subjects = [], errors = [], warnings = [], i, d, p;
    cls.forEach(function (k, n) { cIdx[k] = n; });
    tch.forEach(function (x, n) { tIdx[x.id] = n; });
    var dayLen = dayLens(setup), open = new Uint8Array(C * N), fixedAt = new Uint8Array(C * N), fixed = [];
    for (i = 0; i < C; i++) for (d = 0; d < D; d++) for (p = 0; p < dayLen[d]; p++) open[i * N + d * P + p] = 1;
    var everyClass = cls.map(function (_, n) { return n; }), everyTeacher = tch.map(function (_, n) { return n; });
    rules.forEach(function (r) {
      if (r.type !== 'fixed') return;
      var s = clamp(r.day, 0, D - 1) * P + clamp(r.period, 1, P) - 1;
      (r.klass ? (r.klass in cIdx ? [cIdx[r.klass]] : []) : everyClass).forEach(function (c) {
        if (!open[c * N + s]) return;
        open[c * N + s] = 0;
        if (r.label) { fixedAt[c * N + s] = 1; fixed.push({ c: c, slot: s, label: String(r.label) }); }
      });
    });

    var lc = [], lt = [], ls = [], ln = [], seen = Object.create(null), noTeacher = 0;
    (setup.loads || []).forEach(function (x) {
      var n = clamp(x.count, 0, N), key = x.klass + '\u0001' + x.subject;
      if (!n || !(x.klass in cIdx) || !x.subject || seen[key]) return;
      seen[key] = 1;
      if (!(x.subject in sIdx)) { sIdx[x.subject] = subjects.length; subjects.push(x.subject); }
      var t = x.teacher && x.teacher in tIdx ? tIdx[x.teacher] : -1;
      lc.push(cIdx[x.klass]); ls.push(sIdx[x.subject]); ln.push(n); lt.push(t);
      if (t < 0) noTeacher++;
    });
    var LD = lc.length, tOff = new Uint8Array(T * N), tMax = new Uint8Array(T), tStreak = new Uint8Array(T), tStreakMust = new Uint8Array(T);
    var rcap = new Uint8Array(subjects.length), capRule = Object.create(null), lwin = [];
    for (i = 0; i < T; i++) tMax[i] = clamp(tch[i].maxDay || 0, 0, P);
    for (i = 0; i < LD; i++) lwin.push(null);
    function teachersOf(r) { return r.teacher ? (r.teacher in tIdx ? [tIdx[r.teacher]] : []) : everyTeacher; }
    rules.forEach(function (r) {
      var sp, n;
      if (r.type === 'off') {
        sp = span(r);
        teachersOf(r).forEach(function (t) { daysOf(r).forEach(function (day) { for (var q = sp[0] - 1; q < sp[1]; q++) { var k = t * N + day * P + q; if (r.must !== false) tOff[k] = 1; else if (!tOff[k]) tOff[k] = 2; } }); });
      } else if (r.type === 'maxDay') {
        n = clamp(r.n, 1, P);
        teachersOf(r).forEach(function (t) { if (r.teacher || !tMax[t] || n < tMax[t]) tMax[t] = n; });
      } else if (r.type === 'streak') {
        n = clamp(r.n, 1, P);
        teachersOf(r).forEach(function (t) { tStreak[t] = n; tStreakMust[t] = r.must !== false ? 1 : 0; });
      } else if (r.type === 'together') {
        if (r.subject in sIdx) rcap[sIdx[r.subject]] = clamp(r.n, 1, 60);
      } else if (r.type === 'subjectDay') {
        if (r.subject) capRule[r.subject] = clamp(r.n, 1, P);
      } else if (r.type === 'window' && r.subject in sIdx) {
        sp = span(r);
        for (var l = 0; l < LD; l++) {
          if (ls[l] !== sIdx[r.subject] || (r.klass && cIdx[r.klass] !== lc[l])) continue;
          var m = lwin[l] || (lwin[l] = new Uint8Array(N));
          for (var q = 0; q < N; q++) { var per = q % P + 1; if (per < sp[0] || per > sp[1]) { if (r.must !== false) m[q] = 1; else if (!m[q]) m[q] = 2; } }
        }
      }
    });

    var lcap = [], classTotal = new Int32Array(C), classOpen = new Int32Array(C), classDays = [], teacherTotal = new Int32Array(T);
    for (i = 0; i < C; i++) {
      var days = 0;
      for (d = 0; d < D; d++) { var o = 0; for (p = 0; p < P; p++) o += open[i * N + d * P + p]; classOpen[i] += o; if (o) days++; }
      classDays.push(days);
    }
    for (i = 0; i < LD; i++) {
      classTotal[lc[i]] += ln[i];
      if (lt[i] >= 0) teacherTotal[lt[i]] += ln[i];
      var need = Math.ceil(ln[i] / Math.max(1, classDays[lc[i]])), rule = capRule[subjects[ls[i]]];
      if (rule && rule < need) errors.push({ code: 'subjectCap', klass: cls[lc[i]], subject: subjects[ls[i]], n: ln[i], m: rule });
      lcap.push(rule ? Math.max(rule, need) : need);
    }
    if (!LD) errors.push({ code: 'empty' });
    for (i = 0; i < C; i++) {
      if (classTotal[i] > classOpen[i]) errors.push({ code: 'classOver', klass: cls[i], n: classTotal[i], m: classOpen[i] });
      else if (!classTotal[i]) warnings.push({ code: 'classEmpty', klass: cls[i] });
      else if (classTotal[i] < classOpen[i]) warnings.push({ code: 'classFree', klass: cls[i], n: classOpen[i] - classTotal[i] });
    }
    for (i = 0; i < T; i++) {
      var free = 0;
      for (d = 0; d < D; d++) { var fd = 0; for (p = 0; p < dayLen[d]; p++) if (tOff[i * N + d * P + p] !== 1) fd++; free += tMax[i] ? Math.min(fd, tMax[i]) : fd; }
      if (teacherTotal[i] > free) errors.push({ code: 'teacherOver', teacher: tch[i].name, n: teacherTotal[i], m: free });
      else if (+tch[i].quota && teacherTotal[i] > +tch[i].quota) warnings.push({ code: 'quota', teacher: tch[i].name, n: teacherTotal[i], m: +tch[i].quota });
    }
    if (noTeacher) warnings.push({ code: 'noTeacher', n: noTeacher });

    var lessons = [];
    for (i = 0; i < LD; i++) for (p = 0; p < ln[i]; p++) lessons.push(i);
    return { ok: !errors.length, errors: errors, warnings: warnings, problem: {
      C: C, T: T, classes: cls, teachers: tch, subjects: subjects, open: open, fixedAt: fixedAt, fixed: fixed, lc: lc, lt: lt, ls: ls, ln: ln, lcap: lcap, lwin: lwin,
      tOff: tOff, tMax: tMax, tStreak: tStreak, tStreakMust: tStreakMust, rcap: rcap, classTotal: classTotal, classOpen: classOpen, teacherTotal: teacherTotal, lessons: lessons } };
  }

  /**
   * Starts a build. Call run.step(n) until run.done; run.result then holds the schedule.
   * The same problem and seed always give the same schedule.
   */
  function start(prob, seed) {
    var rand = rng(seed || 1), C = prob.C, T = prob.T, L = prob.lessons.length, lload = prob.lessons, lc = prob.lc, lt = prob.lt, ls = prob.ls, lcap = prob.lcap, lwin = prob.lwin;
    var tOff = prob.tOff, tMax = prob.tMax, tStreak = prob.tStreak, tStreakMust = prob.tStreakMust, rcap = prob.rcap, LD = lc.length, SU = prob.subjects.length;
    var anyRcap = false, i;
    for (i = 0; i < SU; i++) if (rcap[i]) anyRcap = true;
    var avgC = [], avgT = [];
    for (i = 0; i < C; i++) avgC.push(prob.classTotal[i] / D);
    for (i = 0; i < T; i++) avgT.push(prob.teacherTotal[i] / D);

    /** Days cut to exactly the class's sessions, so its day is full from the first session and it has no free session in between. */
    function tightAllow() {
      var allow = new Uint8Array(C * N), any = false;
      for (var c = 0; c < C; c++) {
        var total = prob.classTotal[c], opens = [], n = [], left = total, d, p, k;
        if (total >= prob.classOpen[c]) { for (k = 0; k < N; k++) allow[c * N + k] = prob.open[c * N + k]; continue; }
        any = true;
        for (d = 0; d < D; d++) {
          var list = [], lastFixed = -1, must = 0;
          for (p = 0; p < P; p++) { if (prob.open[c * N + d * P + p]) list.push(p); if (prob.fixedAt[c * N + d * P + p]) lastFixed = p; }
          for (k = 0; k < list.length; k++) if (list[k] < lastFixed) must++;   // a fixed session later in the day: the day is filled up to it
          opens.push(list); n.push(must); left -= must;
        }
        if (left < 0) { left = total; for (d = 0; d < D; d++) n[d] = 0; }
        while (left > 0) {
          var pick = -1;
          for (d = 0; d < D; d++) if (n[d] < opens[d].length && (pick < 0 || n[d] < n[pick])) pick = d;
          if (pick < 0) break;
          n[pick]++; left--;
        }
        for (d = 0; d < D; d++) for (k = 0; k < n[d]; k++) allow[c * N + d * P + opens[d][k]] = 1;
      }
      return any ? allow : null;
    }
    var tight = tightAllow();
    var plan = tight ? [['tight', 0], ['tight', 1], ['loose', 2], ['loose', 3]] : [['loose', 0], ['loose', 1], ['loose', 2]];
    var maxPlace = Math.max(4000, L * 40), saTotal = Math.min(6000000, Math.max(60000, L * 4000));
    var st = null, best = null, sa = null;
    var run = { done: false, attempt: 0, attempts: plan.length, phase: 'place', progress: 0, unplaced: L, result: null };

    function put(x, s) {
      var ld = lload[x], t = lt[ld], d = (s / P) | 0;
      st.at[x] = s; st.classAt[lc[ld] * N + s] = x; st.loadDay[ld * D + d]++;
      if (t >= 0) { st.teacherAt[t * N + s] = x; st.teacherDay[t * D + d]++; }
      if (anyRcap && rcap[ls[ld]]) st.subjAt[ls[ld] * N + s]++;
    }
    function take(x) {
      var s = st.at[x], ld = lload[x], t = lt[ld], d = (s / P) | 0;
      st.at[x] = -1; st.classAt[lc[ld] * N + s] = -1; st.loadDay[ld * D + d]--;
      if (t >= 0) { st.teacherAt[t * N + s] = -1; st.teacherDay[t * D + d]--; }
      if (anyRcap && rcap[ls[ld]]) st.subjAt[ls[ld] * N + s]--;
    }
    function fresh(mode) {
      var allow = mode === 'tight' ? tight : prob.open, slots = [], c, k;
      for (c = 0; c < C; c++) { var list = []; for (k = 0; k < N; k++) if (allow[c * N + k]) list.push(k); slots.push(list); }
      st = { mode: mode, allow: allow, slots: slots, at: new Int32Array(L).fill(-1), classAt: new Int32Array(C * N).fill(-1), teacherAt: new Int32Array(T * N).fill(-1),
        loadDay: new Int16Array(LD * D), teacherDay: new Int16Array(T * D), subjAt: new Int16Array(anyRcap ? SU * N : 0), evict: new Int32Array(L), tabu: new Int32Array(L * N), queue: [], dead: [], iter: 0 };
    }
    function begin(n) {
      run.attempt = n; run.phase = 'place';
      fresh(plan[n][0]);
      rand = rng((seed || 1) * 7919 + plan[n][1] * 104729 + 1);
      // the hardest sessions are placed first: busy teachers, teachers with closed times, subjects tied to certain sessions
      var weight = [], order = [], x, k;
      for (x = 0; x < L; x++) {
        var ld = lload[x], t = lt[ld], w = prob.ln[ld] + rand();
        if (t >= 0) { w += prob.teacherTotal[t] * 3; for (k = 0; k < N; k++) if (tOff[t * N + k] === 1) w += 1; }
        if (lwin[ld]) for (k = 0; k < N; k++) if (lwin[ld][k] === 1) w += 1.5;
        if (anyRcap && rcap[ls[ld]]) w += 20;
        weight.push(w); order.push(x);
      }
      order.sort(function (a, b) { return weight[a] - weight[b]; });
      st.queue = order;
    }
    /** How many sessions in a row the teacher would have with one more at this slot. */
    function runIf(t, s) {
      var p = s % P, base = t * N + s - p, n = 1, q;
      for (q = p - 1; q >= 0 && st.teacherAt[base + q] >= 0; q--) n++;
      for (q = p + 1; q < P && st.teacherAt[base + q] >= 0; q++) n++;
      return n;
    }
    /** What must leave for session x to sit at slot s: [] when it is free, null when the slot is closed to it. */
    function conflicts(x, s) {
      var ld = lload[x], c = lc[ld], t = lt[ld], d = (s / P) | 0, out = [], a, b, k, y, n;
      if (!st.allow[c * N + s]) return null;
      if (lwin[ld] && lwin[ld][s] === 1) return null;
      if (t >= 0 && tOff[t * N + s] === 1) return null;
      a = st.classAt[c * N + s];
      if (a >= 0) out.push(a);
      b = t >= 0 ? st.teacherAt[t * N + s] : -1;
      if (b >= 0 && b !== a) out.push(b);
      if (t >= 0 && b < 0 && tStreakMust[t] && runIf(t, s) > tStreak[t]) return null;
      // the subject's sessions for this class on one day
      if (st.loadDay[ld * D + d] - (a >= 0 && lload[a] === ld ? 1 : 0) >= lcap[ld]) {
        var same = [];
        for (k = 0; k < P; k++) { y = st.classAt[c * N + d * P + k]; if (y >= 0 && y !== a && lload[y] === ld) same.push(y); }
        if (same.length) out.push(same[(rand() * same.length) | 0]);
      }
      // the teacher's sessions on one day
      if (t >= 0 && tMax[t]) {
        n = st.teacherDay[t * D + d];
        for (k = 0; k < out.length; k++) if (lt[lload[out[k]]] === t) n--;
        if (n >= tMax[t]) {
          var mine = [];
          for (k = 0; k < P; k++) { y = st.teacherAt[t * N + d * P + k]; if (y >= 0 && out.indexOf(y) === -1) mine.push(y); }
          if (mine.length) out.push(mine[(rand() * mine.length) | 0]);
        }
      }
      // a room or playground shared between classes
      if (anyRcap && rcap[ls[ld]]) {
        n = st.subjAt[ls[ld] * N + s];
        for (k = 0; k < out.length; k++) if (st.at[out[k]] === s && ls[lload[out[k]]] === ls[ld]) n--;
        if (n >= rcap[ls[ld]]) {
          for (k = 0; k < C; k++) { y = st.classAt[k * N + s]; if (y >= 0 && out.indexOf(y) === -1 && ls[lload[y]] === ls[ld]) { out.push(y); break; } }
        }
      }
      return out;
    }
    function estimate(x, s) {
      var ld = lload[x], t = lt[ld], d = (s / P) | 0, p = s % P, e = st.loadDay[ld * D + d] * 20;
      if (t >= 0) {
        e += st.teacherDay[t * D + d] * 2;
        if (tOff[t * N + s] === 2) e += W.pref;
        if (st.teacherDay[t * D + d] > 0 && !((p > 0 && st.teacherAt[t * N + s - 1] >= 0) || (p < P - 1 && st.teacherAt[t * N + s + 1] >= 0))) e += 3;
      }
      if (lwin[ld] && lwin[ld][s] === 2) e += W.pref;
      if (st.mode === 'loose') e += p * 1.5;
      return e;
    }
    function placeOne() {
      var q = st.queue, at = q.length - 1 - ((rand() * rand() * Math.min(q.length, 6)) | 0), x = q[at];
      q.splice(at, 1);
      var sl = st.slots[lc[lload[x]]], off = (rand() * sl.length) | 0, bestS = -1, bestScore = Infinity, bestConf = null, k, j;
      for (k = 0; k < sl.length; k++) {
        var s = sl[(k + off) % sl.length], conf = conflicts(x, s);
        if (!conf) continue;
        var score = conf.length * 1000 + (st.tabu[x * N + s] > st.iter ? 400 : 0) + estimate(x, s) + rand() * 2;
        for (j = 0; j < conf.length; j++) score += Math.min(st.evict[conf[j]], 20) * 30;
        if (score < bestScore) { bestScore = score; bestS = s; bestConf = conf; }
      }
      if (bestS < 0) { st.dead.push(x); return; }
      for (j = 0; j < bestConf.length; j++) {
        var y = bestConf[j];
        st.tabu[y * N + st.at[y]] = st.iter + 12 + ((rand() * 10) | 0);
        st.evict[y]++;
        take(y); q.push(y);
      }
      put(x, bestS);
    }

    /* ---- quality of one class day, one teacher day, one session ---- */
    function classDayCost(c, d) {
      var base = c * N + d * P, last = -1, n = 0, cost = 0, p, q, x;
      for (p = 0; p < P; p++) { if (st.classAt[base + p] >= 0) { last = p; n++; } else if (prob.fixedAt[base + p]) last = p; }
      for (p = 0; p < last; p++) if (prob.open[base + p] && st.classAt[base + p] < 0) cost += W.gap;
      for (p = 0; p < P; p++) {
        x = st.classAt[base + p];
        if (x < 0) continue;
        var ld = lload[x], k = 1, far = p, first = true;
        for (q = 0; q < p; q++) if (st.classAt[base + q] >= 0 && lload[st.classAt[base + q]] === ld) { first = false; break; }
        if (!first) continue;
        for (q = p + 1; q < P; q++) if (st.classAt[base + q] >= 0 && lload[st.classAt[base + q]] === ld) { k++; far = q; }
        if (k > 1) { cost += W.extra * (k - 1); if (far - p + 1 > k) cost += W.split; }
      }
      if (st.mode === 'loose') cost += W.bal * (n - avgC[c]) * (n - avgC[c]);
      return cost;
    }
    function teacherDayCost(t, d) {
      var base = t * N + d * P, first = -1, last = -1, n = 0, runLen = 0, over = 0, lim = tStreak[t] || 4, p;
      for (p = 0; p < P; p++) {
        if (st.teacherAt[base + p] >= 0) { if (first < 0) first = p; last = p; n++; runLen++; if (runLen > lim) over++; } else runLen = 0;
      }
      var cost = W.tbal * (n - avgT[t]) * (n - avgT[t]);
      if (n) cost += (last - first + 1 - n) * W.tgap;
      if (over) cost += over * (tStreak[t] ? (tStreakMust[t] ? W.must : W.streakRule) : W.streak);
      return cost;
    }
    function lessonCost(x) {
      var ld = lload[x], t = lt[ld], s = st.at[x], cost = 0;
      if (s < 0) return 0;
      if (t >= 0 && tOff[t * N + s] === 2) cost += W.pref;
      if (lwin[ld] && lwin[ld][s] === 2) cost += W.pref;
      return cost;
    }
    function totalCost() {
      var cost = 0, k, d;
      for (k = 0; k < C; k++) for (d = 0; d < D; d++) cost += classDayCost(k, d);
      for (k = 0; k < T; k++) for (d = 0; d < D; d++) cost += teacherDayCost(k, d);
      for (k = 0; k < L; k++) cost += lessonCost(k);
      return cost;
    }
    /** May session x go from slot `from` to slot `to`, when session `other` (or nothing, -1) leaves `to` at the same moment? */
    function canMove(x, from, to, other) {
      var ld = lload[x], t = lt[ld], d1 = (from / P) | 0, d2 = (to / P) | 0;
      if (lwin[ld] && lwin[ld][to] === 1) return false;
      if (t >= 0) {
        if (tOff[t * N + to] === 1) return false;
        var occ = st.teacherAt[t * N + to];
        if (occ >= 0 && occ !== other) return false;
      }
      if (d1 !== d2) {
        if (st.loadDay[ld * D + d2] - (other >= 0 && lload[other] === ld ? 1 : 0) >= lcap[ld]) return false;
        if (t >= 0 && tMax[t] && st.teacherDay[t * D + d2] - (other >= 0 && lt[lload[other]] === t ? 1 : 0) >= tMax[t]) return false;
      }
      if (anyRcap && rcap[ls[ld]] && st.subjAt[ls[ld] * N + to] - (other >= 0 && ls[lload[other]] === ls[ld] ? 1 : 0) >= rcap[ls[ld]]) return false;
      return true;
    }
    function around(c, a, b, s1, s2) {
      var d1 = (s1 / P) | 0, d2 = (s2 / P) | 0, ta = lt[lload[a]], tb = b >= 0 ? lt[lload[b]] : -1, cost = classDayCost(c, d1) + lessonCost(a);
      if (d2 !== d1) cost += classDayCost(c, d2);
      if (ta >= 0) { cost += teacherDayCost(ta, d1); if (d2 !== d1) cost += teacherDayCost(ta, d2); }
      if (b >= 0) cost += lessonCost(b);
      if (tb >= 0 && tb !== ta) { cost += teacherDayCost(tb, d1); if (d2 !== d1) cost += teacherDayCost(tb, d2); }
      return cost;
    }
    function improveOne() {
      sa.temp *= sa.cool;
      var c = (rand() * C) | 0, sl = st.slots[c];
      if (sl.length < 2) return;
      var s1 = sl[(rand() * sl.length) | 0], a = st.classAt[c * N + s1];
      if (a < 0) return;
      var s2 = sl[(rand() * sl.length) | 0], b = st.classAt[c * N + s2];
      if (s2 === s1 || (b >= 0 && lload[b] === lload[a])) return;
      if (!canMove(a, s1, s2, b) || (b >= 0 && !canMove(b, s2, s1, a))) return;
      var before = around(c, a, b, s1, s2);
      take(a); if (b >= 0) take(b);
      put(a, s2); if (b >= 0) put(b, s1);
      var delta = around(c, a, b, s2, s1) - before;
      if (delta <= 0 || rand() < Math.exp(-delta / sa.temp)) {
        sa.cost += delta;
        if (sa.cost < sa.best - 1e-9) { sa.best = sa.cost; sa.at.set(st.at); }
      } else {
        take(a); if (b >= 0) take(b);
        put(a, s1); if (b >= 0) put(b, s2);
      }
    }
    function restore(mode, at) { fresh(mode); for (var x = 0; x < L; x++) if (at[x] >= 0) put(x, at[x]); }
    function endPlace() {
      var missing = st.queue.length + st.dead.length;
      if (!best || missing < best.unplaced) best = { mode: st.mode, at: new Int32Array(st.at), unplaced: missing };
      run.unplaced = best.unplaced;
      if (missing && run.attempt + 1 < plan.length) { begin(run.attempt + 1); return; }
      if (missing) restore(best.mode, best.at);
      run.phase = 'improve';
      var cost = totalCost();
      sa = { left: saTotal, temp: 6, cool: Math.pow(0.05, 1 / saTotal), cost: cost, best: cost, at: new Int32Array(st.at) };
    }
    function finish() {
      restore(st.mode, sa.at);
      var lessons = [], missing = Object.create(null), unplaced = [], x, ld;
      for (x = 0; x < L; x++) {
        ld = lload[x];
        if (st.at[x] >= 0) lessons.push({ load: ld, klass: prob.classes[lc[ld]], subject: prob.subjects[ls[ld]], teacher: lt[ld] >= 0 ? prob.teachers[lt[ld]].id : '', day: (st.at[x] / P) | 0, period: st.at[x] % P + 1 });
        else missing[ld] = (missing[ld] || 0) + 1;
      }
      Object.keys(missing).forEach(function (k) { unplaced.push({ klass: prob.classes[lc[k]], subject: prob.subjects[ls[k]], teacher: lt[k] >= 0 ? prob.teachers[lt[k]].id : '', n: missing[k] }); });
      lessons.sort(function (a, b) { return a.klass < b.klass ? -1 : a.klass > b.klass ? 1 : a.day - b.day || a.period - b.period; });
      run.result = { lessons: lessons, unplaced: unplaced, total: L, mode: st.mode, cost: Math.round(sa.best),
        fixed: prob.fixed.map(function (f) { return { klass: prob.classes[f.c], day: (f.slot / P) | 0, period: f.slot % P + 1, label: f.label }; }) };
      run.done = true; run.progress = 1;
    }
    run.step = function (budget) {
      while (budget > 0 && !run.done) {
        if (run.phase === 'place') {
          if (st.queue.length && st.iter < maxPlace) { placeOne(); st.iter++; budget--; } else endPlace();
        } else if (sa.left > 0) { improveOne(); sa.left--; budget--; } else finish();
      }
      if (!run.done) run.progress = run.phase === 'place' ? Math.min(0.5, 0.5 * (run.attempt + Math.min(1, st.iter / Math.max(1, L * 2))) / plan.length + 0.02) : 0.5 + 0.5 * (1 - sa.left / saTotal);
      return run;
    };
    if (!L) { fresh('loose'); sa = { best: 0, at: new Int32Array(0) }; finish(); } else begin(0);
    return run;
  }

  /** Builds in one go. Returns the result, with its report. */
  function solve(setup, seed) {
    var c = compile(setup);
    if (!c.ok) return { ok: false, errors: c.errors, warnings: c.warnings };
    var run = start(c.problem, seed);
    while (!run.done) run.step(50000);
    run.result.ok = true; run.result.warnings = c.warnings;
    run.result.report = evaluate(setup, run.result.lessons, run.result.fixed);
    return run.result;
  }

  /**
   * Reads a finished schedule against the setup, on its own: clashes, free sessions inside a class's day, teachers' days, and each instruction.
   * It shares nothing with the builder above, so it also serves as a check on it.
   */
  function evaluate(setup, lessons, fixed) {
    var dayLen = dayLens(setup), cls = setup.classes || [], tch = setup.teachers || [], grid = Object.create(null), tgrid = Object.create(null), closed = Object.create(null), held = Object.create(null);
    var rep = { placed: lessons.length, classClash: 0, teacherClash: 0, classGaps: 0, teacherGaps: 0, maxTeacherDay: 0, rules: [], teachers: [], classes: [] };
    function cell(map, key) { return map[key] || (map[key] = []); }
    (setup.rules || []).forEach(function (r) {
      if (r.type !== 'fixed') return;
      (r.klass ? [r.klass] : cls).forEach(function (k) { closed[k + '\u0001' + (clamp(r.day, 0, D - 1) * P + clamp(r.period, 1, P) - 1)] = 1; });
    });
    (fixed || []).forEach(function (f) { held[f.klass + '\u0001' + (f.day * P + f.period - 1)] = 1; });
    lessons.forEach(function (l) {
      var s = l.day * P + l.period - 1;
      cell(grid, l.klass + '\u0001' + s).push(l);
      if (l.teacher) cell(tgrid, l.teacher + '\u0001' + s).push(l);
    });
    Object.keys(grid).forEach(function (k) { if (grid[k].length > 1) rep.classClash += grid[k].length - 1; });
    Object.keys(tgrid).forEach(function (k) { if (tgrid[k].length > 1) rep.teacherClash += tgrid[k].length - 1; });
    cls.forEach(function (k) {
      var row = { klass: k, total: 0, days: [], gaps: 0 };
      for (var d = 0; d < D; d++) {
        var n = 0, last = -1, p;
        for (p = 0; p < P; p++) { var has = grid[k + '\u0001' + (d * P + p)]; if (has) { n += has.length; last = p; } else if (held[k + '\u0001' + (d * P + p)]) last = p; }
        for (p = 0; p < last; p++) if (p < dayLen[d] && !closed[k + '\u0001' + (d * P + p)] && !grid[k + '\u0001' + (d * P + p)]) row.gaps++;
        row.days.push(n); row.total += n;
      }
      rep.classGaps += row.gaps; rep.classes.push(row);
    });
    function teacherDays(id) {
      var out = [];
      for (var d = 0; d < D; d++) {
        var n = 0, first = -1, last = -1, runLen = 0, maxRun = 0;
        for (var p = 0; p < P; p++) { if (tgrid[id + '\u0001' + (d * P + p)]) { n++; if (first < 0) first = p; last = p; runLen++; if (runLen > maxRun) maxRun = runLen; } else runLen = 0; }
        out.push({ n: n, gaps: n ? last - first + 1 - n : 0, run: maxRun });
      }
      return out;
    }
    var tdays = Object.create(null);
    tch.forEach(function (t) {
      var days = tdays[t.id] = teacherDays(t.id), row = { id: t.id, name: t.name, total: 0, days: [], gaps: 0, run: 0 };
      days.forEach(function (x) { row.days.push(x.n); row.total += x.n; row.gaps += x.gaps; if (x.run > row.run) row.run = x.run; if (x.n > rep.maxTeacherDay) rep.maxTeacherDay = x.n; });
      rep.teacherGaps += row.gaps; rep.teachers.push(row);
    });
    (setup.rules || []).forEach(function (r) {
      var broken = 0, sp = span(r), who = r.teacher ? [r.teacher] : tch.map(function (t) { return t.id; }), dd;
      if (r.type === 'off') { dd = daysOf(r); lessons.forEach(function (l) { if (l.teacher && who.indexOf(l.teacher) !== -1 && dd.indexOf(l.day) !== -1 && l.period >= sp[0] && l.period <= sp[1]) broken++; }); }
      else if (r.type === 'window') lessons.forEach(function (l) { if (l.subject === r.subject && (!r.klass || l.klass === r.klass) && (l.period < sp[0] || l.period > sp[1])) broken++; });
      else if (r.type === 'maxDay') who.forEach(function (id) { (tdays[id] || []).forEach(function (x) { if (x.n > clamp(r.n, 1, P)) broken++; }); });
      else if (r.type === 'streak') who.forEach(function (id) { (tdays[id] || []).forEach(function (x) { if (x.run > clamp(r.n, 1, P)) broken++; }); });
      else if (r.type === 'fixed') lessons.forEach(function (l) { if ((!r.klass || l.klass === r.klass) && l.day === clamp(r.day, 0, D - 1) && l.period === clamp(r.period, 1, P)) broken++; });
      else if (r.type === 'subjectDay' || r.type === 'together') {
        var tally = Object.create(null), lim = clamp(r.n, 1, 60);
        lessons.forEach(function (l) { if (l.subject !== r.subject) return; var k = r.type === 'together' ? String(l.day * P + l.period) : l.klass + '\u0001' + l.day; tally[k] = (tally[k] || 0) + 1; });
        Object.keys(tally).forEach(function (k) { if (tally[k] > lim) broken++; });
      }
      rep.rules.push({ id: r.id, type: r.type, must: r.must !== false, broken: broken });
    });
    return rep;
  }

  /**
   * Gives each class's subject a teacher who teaches that subject and still has room in their weekly quota.
   * Fills what is empty; with redo it starts again from nothing. Changes setup.loads in place and returns what it could not cover.
   */
  function assign(setup, redo) {
    var teachers = setup.teachers || [], left = Object.create(null), out = { changed: 0, missing: [] };
    teachers.forEach(function (t) { left[t.id] = +t.quota || 0; });
    (setup.loads || []).forEach(function (l) { if (redo || !(l.teacher in left)) l.teacher = ''; if (l.teacher) left[l.teacher] -= +l.count || 0; });
    var todo = (setup.loads || []).filter(function (l) { return !l.teacher && +l.count > 0; }).map(function (l) {
      return { load: l, able: teachers.filter(function (t) { return (t.subjects || []).indexOf(l.subject) !== -1; }) };
    });
    // the subjects with the fewest teachers first, then the largest
    todo.sort(function (a, b) { return a.able.length - b.able.length || b.load.count - a.load.count; });
    todo.forEach(function (x) {
      var pick = null;
      x.able.forEach(function (t) { if (left[t.id] >= x.load.count && (!pick || left[t.id] > left[pick.id])) pick = t; });
      if (pick) { x.load.teacher = pick.id; left[pick.id] -= x.load.count; out.changed++; }
      else out.missing.push({ klass: x.load.klass, subject: x.load.subject, count: +x.load.count, able: x.able.length });
    });
    return out;
  }

  return { DAYS: D, PER_DAY: P, RULE_TYPES: RULE_TYPES, compile: compile, start: start, solve: solve, evaluate: evaluate, assign: assign };
})();
/* SOLVER-END */
if (typeof module !== 'undefined' && module.exports) module.exports = APSolver;
