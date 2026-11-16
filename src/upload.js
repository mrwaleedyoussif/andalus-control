  /* ---------- tables from outside: an Excel or CSV file, a Google Sheets link, or pasted cells; and all the employees at once ---------- */
  var TXU = {
    ar: {
      upFile: 'ملف Excel أو CSV', upLink: 'رابط Google Sheets', upRead: 'قراءة', upDone: 'قُرئت صفوف:', upBadFile: 'تعذرت قراءة الملف. استخدم ملف Excel بصيغة xlsx أو ملف CSV.',
      upOldXls: 'صيغة xls القديمة غير مدعومة. احفظ الملف من Excel بصيغة xlsx ثم ارفعه.', upOldBrowser: 'هذا المتصفح لا يقرأ ملفات xlsx. احفظ الملف بصيغة CSV، أو انسخ الجدول والصقه.', upTooBig: 'الملف أكبر من 5 ميجابايت.',
      upLinkHint: 'للقراءة من Google Sheets: شارك الملف (عرض) مع حساب المنصة ومع حسابك بالاسم. أو انسخ الخانات والصقها في المربع.',
      importUsers: 'استيراد الموظفين', uiLead: 'أضف كل الموظفين دفعة واحدة من ملف Excel أو Google Sheets: الاسم، التخصص، المسمى الوظيفي، رقم الواتساب، البريد المدرسي.',
      uiRules: 'الموظف الجديد يُضاف بدور «معلم»، ويغيَّر دوره بعدها من صفحته إن لزم. الموجود من قبل تُحدَّث بياناته ويبقى دوره. الصف الخاطئ يُتجاوز ويُذكر سببه.',
      uiStages: 'مرحلة الموظفين (لمن ليس له مرحلة في الملف)', uiColumn: 'العمود', uf_name: 'عمود الاسم', uf_email: 'عمود البريد المدرسي', uf_phone: 'عمود رقم الواتساب', uf_major: 'عمود التخصص', uf_position: 'عمود المسمى الوظيفي', uf_stages: 'عمود المرحلة (اختياري)',
      uiNeedEmail: 'حدّد عمود البريد المدرسي.', uiGo: 'استيراد', uiDone: 'تم الاستيراد. أُضيف:', uiUpdated: 'حُدّث:', uiSkipped: 'تُجوهل:', us_new: 'جديد', us_update: 'تحديث', us_same: 'بلا تغيير', us_error: 'خطأ', uiLine: 'السطر',
      uiTemplate: 'تنزيل قالب', uiPasteL: 'جدول الموظفين', uiExample: 'الاسم\tالتخصص\tالمسمى الوظيفي\tرقم الواتساب\tالبريد المدرسي', major: 'التخصص', position: 'المسمى الوظيفي', jobCol: 'الوظيفة والتخصص', uiNotes: 'ملاحظة'
    },
    en: {
      upFile: 'Excel or CSV file', upLink: 'Google Sheets link', upRead: 'Read', upDone: 'Rows read:', upBadFile: 'The file could not be read. Use an Excel file (.xlsx) or a CSV file.',
      upOldXls: 'The old .xls format is not supported. Save the file from Excel as .xlsx, then upload it.', upOldBrowser: 'This browser cannot read .xlsx files. Save the file as CSV, or copy the table and paste it.', upTooBig: 'The file is larger than 5 MB.',
      upLinkHint: "To read from Google Sheets: share the file (view) with the platform's account and with your own account by name. Or copy the cells and paste them in the box.",
      importUsers: 'Import employees', uiLead: 'Add all employees at once from an Excel file or Google Sheets: name, major, position, WhatsApp number, school email.',
      uiRules: 'A new employee is added as a teacher; change the role afterwards on their page if needed. An existing account is updated and keeps its role. A wrong row is skipped, with the reason.',
      uiStages: 'Stage of the employees (for those with no stage in the file)', uiColumn: 'Column', uf_name: 'Name column', uf_email: 'School email column', uf_phone: 'WhatsApp number column', uf_major: 'Major column', uf_position: 'Position column', uf_stages: 'Stage column (optional)',
      uiNeedEmail: 'Choose the school email column.', uiGo: 'Import', uiDone: 'Imported. Added:', uiUpdated: 'Updated:', uiSkipped: 'Skipped:', us_new: 'New', us_update: 'Update', us_same: 'Unchanged', us_error: 'Error', uiLine: 'Line',
      uiTemplate: 'Download template', uiPasteL: 'Employees table', uiExample: 'Name\tMajor\tPosition\tWhatsApp number\tSchool email', major: 'Major', position: 'Position', jobCol: 'Position and major', uiNotes: 'Note'
    }
  };
  Object.keys(TXU).forEach(function (l) { Object.keys(TXU[l]).forEach(function (k) { TX[l][k] = TXU[l][k]; }); });

  /** The text of a file: UTF-8, or the Arabic Windows encoding when it is not UTF-8 (an older "CSV" saved from Excel). */
  function bytesText(buf) {
    var s = new TextDecoder('utf-8').decode(buf);
    if (s.indexOf(String.fromCharCode(0xFFFD)) !== -1) { try { s = new TextDecoder('windows-1256').decode(buf); } catch (e) { /* keep the UTF-8 reading */ } }
    return s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s;      // the byte-order mark some programs put first
  }
  /** Rows of a CSV or tab-separated text. A quoted cell may hold commas, tabs and line breaks. */
  function readCsv(text) {
    var first = text.split(/\r?\n/)[0] || '', sep = first.indexOf('\t') !== -1 ? '\t' : (first.split(';').length > first.split(',').length ? ';' : ','), rows = [], row = [], cell = '', quoted = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (quoted) { if (c !== '"') cell += c; else if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false; }
      else if (c === '"' && cell === '') quoted = true;
      else if (c === sep) { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
      else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }
  /** Rows of the first visible sheet of an .xlsx file. It uses the browser's own unzip, so no extra code is loaded from anywhere. */
  function readXlsx(buf) {
    var dv = new DataView(buf), n = buf.byteLength, end = -1, files = {}, dec = new TextDecoder('utf-8'), i;
    for (i = n - 22; i >= 0 && i >= n - 65557; i--) if (dv.getUint32(i, true) === 0x06054b50) { end = i; break; }
    if (end < 0 || typeof DecompressionStream === 'undefined') return Promise.reject(new Error('|' + t(end < 0 ? 'upBadFile' : 'upOldBrowser')));
    var count = dv.getUint16(end + 10, true), off = dv.getUint32(end + 16, true);
    for (i = 0; i < count && off + 46 <= n && dv.getUint32(off, true) === 0x02014b50; i++) {
      var nameLen = dv.getUint16(off + 28, true);
      files[dec.decode(new Uint8Array(buf, off + 46, nameLen))] = { method: dv.getUint16(off + 10, true), size: dv.getUint32(off + 20, true), at: dv.getUint32(off + 42, true) };
      off += 46 + nameLen + dv.getUint16(off + 30, true) + dv.getUint16(off + 32, true);
    }
    var entry = function (name) {
      var f = files[name];
      if (!f || f.at + 30 > n) return Promise.resolve('');
      var data = new Uint8Array(buf, f.at + 30 + dv.getUint16(f.at + 26, true) + dv.getUint16(f.at + 28, true), f.size);
      return f.method === 0 ? Promise.resolve(dec.decode(data)) : new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
    };
    var xml = function (text) { return new DOMParser().parseFromString(text, 'application/xml'); }, all = function (node, tag) { return Array.prototype.slice.call(node.getElementsByTagName(tag)); }, bad = new Error('|' + t('upBadFile'));
    return Promise.all([entry('xl/workbook.xml'), entry('xl/_rels/workbook.xml.rels'), entry('xl/sharedStrings.xml')]).then(function (parts) {
      if (!parts[0]) throw bad;
      var sheet = all(xml(parts[0]), 'sheet').filter(function (x) { return (x.getAttribute('state') || 'visible') === 'visible'; })[0], target = 'worksheets/sheet1.xml';
      if (sheet && parts[1]) all(xml(parts[1]), 'Relationship').forEach(function (r) { if (r.getAttribute('Id') === sheet.getAttribute('r:id')) target = r.getAttribute('Target'); });
      var strings = parts[2] ? all(xml(parts[2]), 'si').map(function (si) { return all(si, 't').filter(function (x) { return x.parentNode.nodeName !== 'rPh'; }).map(function (x) { return x.textContent; }).join(''); }) : [];
      return entry('xl/' + target.replace(/^\/?(xl\/)?/, '')).then(function (text) {
        if (!text) throw bad;
        var rows = [];
        all(xml(text), 'row').slice(0, 5000).forEach(function (r) {
          var row = [], at = +r.getAttribute('r');
          while (at && rows.length < at - 1 && rows.length < 5000) rows.push([]);          // empty rows keep their place, so line numbers match the file
          all(r, 'c').forEach(function (c, k) {
            var ref = (c.getAttribute('r') || '').replace(/\d+/g, ''), col = k, type = c.getAttribute('t'), v = all(c, 'v')[0], val = v ? v.textContent : '';
            if (ref) { col = 0; for (var j = 0; j < ref.length; j++) col = col * 26 + ref.charCodeAt(j) - 64; col--; }
            if (type === 's') val = strings[+val] || '';
            else if (type === 'inlineStr') val = all(c, 't').map(function (x) { return x.textContent; }).join('');
            else if (type === 'b') val = val === '1' ? 'TRUE' : 'FALSE';
            else if (val && /e/i.test(val) && !isNaN(+val)) val = String(+val);                // a long number Excel wrote as 9.66E11
            if (col >= 0 && col < 60) { while (row.length < col) row.push(''); row[col] = val; }
          });
          rows.push(row);
        });
        return rows;
      });
    });
  }
  function fileRows(file) {
    if (file.size > 5 * 1024 * 1024) return Promise.reject(new Error('|' + t('upTooBig')));
    if (/\.xls$/i.test(String(file.name || ''))) return Promise.reject(new Error('|' + t('upOldXls')));
    return file.arrayBuffer().then(function (buf) { var head = new Uint8Array(buf.slice(0, 2)); return head[0] === 0x50 && head[1] === 0x4B ? readXlsx(buf) : readCsv(bytesText(buf)); });
  }
  /**
   * Lets a table come into a paste box from an Excel or CSV file, or from a Google Sheets link. Whatever the source, the rest of
   * the dialog reads the box, so every import on the site takes the same three sources: file, link, or pasted cells.
   */
  function sheetPicker(box) {
    var file = h('input', { type: 'file', class: 'vh', accept: '.xlsx,.csv,.tsv,.txt', 'aria-label': t('upFile') }), link = h('input', { type: 'url', dir: 'ltr', placeholder: 'https://docs.google.com/spreadsheets/d/…', 'aria-label': t('upLink') });
    var go = h('button', { class: 'btn ghost sm', type: 'button' }, t('upRead'));
    var put = function (rows, from) {
      var lines = rows.map(function (r) { return r.map(function (c) { return String(c == null ? '' : c).replace(/[\t\r\n]+/g, ' ').trim(); }).join('\t').replace(/\t+$/, ''); });
      while (lines.length && !lines[lines.length - 1]) lines.pop();
      box.value = lines.join('\n');
      box.dispatchEvent(new Event('input', { bubbles: true }));
      toast(t('upDone') + ' ' + lines.filter(String).length + ' · ' + from);
    };
    file.addEventListener('change', function () { var f = file.files[0]; file.value = ''; if (f) fileRows(f).then(function (rows) { put(rows, f.name); }, function (e) { toast(errText(e), true); }); });
    go.addEventListener('click', function () {
      if (!link.value.trim()) { link.focus(); return; }
      busy(go, true);
      call('api_readSheet', link.value.trim()).then(function (r) { busy(go, false); var d = JSON.parse(r); put(d.rows, d.name + ' · ' + d.tab); }, function (e) { busy(go, false); toast(errText(e), true); });
    });
    return h('div', { class: 'picker' }, h('label', { class: 'btn ghost sm filebtn' }, ic('upload'), t('upFile'), file), h('div', { class: 'picker-link' }, link, go), h('small', { text: t('upLinkHint') }));
  }

  /* ---- all the employees at once ---- */
  var UFIELDS = ['name', 'email', 'phone', 'major', 'position', 'stages'];
  var UKEYS = { email: ['بريد', 'ايميل', 'email', 'e-mail', 'mail'], phone: ['واتس', 'جوال', 'هاتف', 'موبايل', 'whats', 'mobile', 'phone'], major: ['تخصص', 'major', 'special', 'subject'], position: ['مسمى', 'وظيف', 'منصب', 'position', 'job', 'title'],
    stages: ['مرحلة', 'stage'], name: ['اسم', 'name', 'employee', 'موظف'] };
  /** Which column holds what: from the heading line when there is one, otherwise from what the cells look like. */
  function guessColumns(rows) {
    var head = rows[0] || [], hasHead = !head.some(function (c) { return /@/.test(c); }), body = hasHead ? rows.slice(1) : rows, map = {}, used = {}, width = 0, c;
    rows.forEach(function (r) { width = Math.max(width, r.length); });
    if (hasHead) ['email', 'phone', 'major', 'position', 'stages', 'name'].forEach(function (f) {
      for (var k = 0; k < head.length; k++) { var hd = norm(head[k]); if (!used[k] && hd && UKEYS[f].some(function (w) { return hd.indexOf(norm(w)) !== -1; })) { map[f] = k; used[k] = 1; return; } }
    });
    var share = function (k, re) { var hit = 0, filled = 0; body.forEach(function (r) { if (r[k]) { filled++; if (re.test(latin(r[k]))) hit++; } }); return filled ? hit / filled : 0; };
    if (map.email == null) for (c = 0; c < width; c++) if (!used[c] && share(c, /@/) > 0.6) { map.email = c; used[c] = 1; break; }
    if (map.phone == null) for (c = 0; c < width; c++) if (!used[c] && share(c, /^[+\d][\d\s()-]{7,}$/) > 0.6) { map.phone = c; used[c] = 1; break; }
    if (map.name == null) for (c = 0; c < width; c++) if (!used[c] && share(c, /\S/) > 0) { map.name = c; used[c] = 1; break; }
    return { map: map, hasHead: hasHead, width: width };
  }
  function usersImport() {
    var box = h('textarea', { id: 'uiPaste', rows: '5', dir: 'auto', placeholder: t('uiExample') }), mapBox = h('div', { class: 'row2', id: 'uiMap' }), out = h('div', { id: 'uiPreview' });
    var go = h('button', { class: 'btn', type: 'button', id: 'uiGo', disabled: true }, t('uiGo')), st = { lines: [], hasHead: true, sel: {}, payload: null, seq: 0, timer: 0 };
    var stageBox = h('div', { class: 'checks', id: 'uiStages' }), stageIn = S.me.stages.map(function (x) { var b = h('input', { type: 'checkbox', value: x, checked: S.f.stage ? x === S.f.stage : S.me.stages.length === 1 }); stageBox.appendChild(h('label', { class: 'check' }, b, stageName(x))); return b; });
    var build = function () {
      var body = st.hasHead ? st.lines.slice(1) : st.lines, cell = function (f, c) { var k = st.sel[f].value; return k === '' ? '' : (c[+k] || ''); };
      return { rows: body.map(function (x) { return { line: x.n, name: cell('name', x.c), email: cell('email', x.c), phone: cell('phone', x.c), major: cell('major', x.c), position: cell('position', x.c), stages: cell('stages', x.c) }; }),
        stages: stageIn.filter(function (b) { return b.checked; }).map(function (b) { return b.value; }) };
    };
    var show = function (r) {
      var c = r.counts, tb = h('tbody'), order = { error: 0, 'new': 1, update: 2, same: 3 }, kind = { 'new': 'done', update: 'active', same: 'upcoming', error: 'overdue' };
      r.rows.slice().sort(function (a, b) { return order[a.status] - order[b.status] || a.line - b.line; }).slice(0, 300).forEach(function (x) {
        tb.appendChild(h('tr', { 'data-status': x.status }, h('td', { class: 'num', text: x.line }), h('td', null, h('span', { class: 'nm', text: x.name || '—' }), h('small', { class: 'ltr', text: x.email })), h('td', null, pill(kind[x.status], t('us_' + x.status))), h('td', { text: x.message })));
      });
      clear(out);
      out.appendChild(h('div', { class: 'chips wrap', id: 'uiCounts' }, [['new', c.added], ['update', c.updated], ['same', c.same], ['error', c.error]].map(function (p) { return h('span', { class: 'chip', 'data-count': p[0] }, t('us_' + p[0]), h('b', { text: p[1] })); })));
      out.appendChild(h('div', { class: 'tw flat' }, h('table', { id: 'uiRows' }, h('thead', null, h('tr', null, h('th', { text: t('uiLine') }), h('th', { text: t('name') }), h('th', { text: t('status') }), h('th', { text: t('uiNotes') }))), tb)));
    };
    var check = function () {
      var p = build(), seq = ++st.seq;
      st.payload = null; go.disabled = true; clear(go); add(go, t('uiGo'));
      if (!p.rows.length) { clear(out); return; }
      if (st.sel.email.value === '') { clear(out).appendChild(h('p', { class: 'note warn', text: t('uiNeedEmail') })); return; }
      call('api_importUsers', JSON.stringify({ dryRun: true, rows: p.rows, stages: p.stages })).then(function (res) {
        if (seq !== st.seq) return;
        var r = JSON.parse(res), n = r.counts.added + r.counts.updated;
        st.payload = p; show(r);
        go.disabled = !n; clear(go); add(go, t('uiGo') + (n ? ' · ' + n : ''));
      }, function (e) { if (seq === st.seq) clear(out).appendChild(h('p', { class: 'note warn', text: errText(e) })); });
    };
    var remap = function () {
      st.lines = [];
      box.value.split(/\r?\n/).forEach(function (line, i) { var c = (line.indexOf('\t') !== -1 ? line.split('\t') : line.split(/\s*[;,،]\s*/)).map(function (x) { return x.trim(); }); if (c.join('') !== '') st.lines.push({ n: i + 1, c: c }); });
      clear(mapBox); st.sel = {};
      if (!st.lines.length) { clear(out); go.disabled = true; return; }
      var g = guessColumns(st.lines.map(function (x) { return x.c; })), cols = [['', '—']];
      st.hasHead = g.hasHead;
      for (var c = 0; c < g.width; c++) cols.push([c, g.hasHead && st.lines[0].c[c] ? st.lines[0].c[c] : t('uiColumn') + ' ' + (c + 1)]);
      UFIELDS.forEach(function (f) { var s = pickOf('uiCol-' + f, cols, g.map[f] == null ? '' : g.map[f]); s.addEventListener('change', check); st.sel[f] = s; mapBox.appendChild(field(t('uf_' + f), s)); });
      check();
    };
    box.addEventListener('input', function () { clearTimeout(st.timer); st.timer = setTimeout(remap, 300); });
    stageIn.forEach(function (b) { b.addEventListener('change', function () { if (st.lines.length) check(); }); });
    go.addEventListener('click', function () {
      var p = st.payload;
      if (!p) return;
      busy(go, true);
      var send = function () { return call('api_importUsers', JSON.stringify({ rows: p.rows, stages: p.stages })).then(function (res) { var r = JSON.parse(res); S.users = r.users; return r; }); };
      send().then(function (r) {
        var ref = { id: r.undoId };
        record(t('importUsers') + ' · ' + (r.counts.added + r.counts.updated), function () { return call('api_undoImportUsers', ref.id).then(function (r2) { S.users = JSON.parse(r2).users; }); }, function () { return send().then(function (r3) { ref.id = r3.undoId; }); });
        toast(t('uiDone') + ' ' + r.counts.added + ' · ' + t('uiUpdated') + ' ' + r.counts.updated + (r.counts.error ? ' · ' + t('uiSkipped') + ' ' + r.counts.error : ''), r.counts.error > 0);
        closeSheet(); render();
      }, function (e) { busy(go, false); toast(errText(e), true); });
    });
    var template = h('button', { class: 'btn ghost sm', type: 'button', id: 'uiTemplate', onclick: function () {
      var a = h('a', { download: 'employees-template.csv' }), url = URL.createObjectURL(new Blob([String.fromCharCode(0xFEFF) + ['الاسم', 'التخصص', 'المسمى الوظيفي', 'رقم الواتساب', 'البريد المدرسي', 'المرحلة'].join(',') + '\r\n'], { type: 'text/csv;charset=utf-8' }));
      a.href = url; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    } }, t('uiTemplate'));
    showSheet(t('importUsers'), h('p', { class: 'lead', text: t('uiLead') }), h('section', { class: 'box' }, h('div', { class: 'form', id: 'usersImport' },
      h('div', { class: 'headrow' }, sheetPicker(box), template), h('label', { class: 'fld' }, h('span', { text: t('uiPasteL') }), box),
      S.me.stages.length > 1 ? h('div', { class: 'fld' }, h('span', { text: t('uiStages') }), stageBox) : null, mapBox, h('p', { class: 'note', text: t('uiRules') }), out, h('div', { class: 'actions' }, go))));
  }
