"""Source adapter: reads an export of the main file (المنصة الشاملة) and returns its indicators and programmes.

The export is a JSON object {tab name: [[cell, ...], ...]} of the visible tabs. The adapter never writes anything.
It recognises the layout by meaning, because the main file is a layout and not a database:
  - an indicator block starts where the second column holds a code such as "C.Br 1.9";
  - a stage block starts where one of the first columns holds a stage name; the row under it names the stage's owner;
  - a plan table starts at the row that has the heading "إعتماد التخطيط ..."; that heading is in every plan table;
  - the programme name column is found by any of the headings in use, misspelled ones included.
A block whose code label is wrong is corrected from the list of indicators at the top of its tab.
"""
import hashlib
import json
import re
from datetime import date

STAGE = re.compile(r'^(ابتدائي|متوسط|ثانوي|رياض الأطفال)( بنين| بنات)? (أهلي|عالمي)$')
CODE = re.compile(r'^[A-D]\.Br \d+\.\d+$')
NAME_HEAD = re.compile(r'^(اسم|اسنم) ')
TOTAL = re.compile(r'^(الاجمالي|اجمالي|الإجمالي|إجمالي)')


def cell(v):
    if v is None:
        return ''
    if isinstance(v, bool):
        return 'TRUE' if v else 'FALSE'
    return re.sub(r'\s+', ' ', str(v)).strip()


def norm(text):
    """Arabic text reduced to what matters for matching: no marks, emoji or punctuation, one spelling of alef, yaa and taa marbuta."""
    s = re.sub(r'[ً-ْـ]', '', cell(text))
    s = re.sub(r'[أإآ]', 'ا', s).replace('ى', 'ي').replace('ة', 'ه')
    s = re.sub(r'[^؀-ۿA-Za-z0-9 ]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip().lower()


def number(v):
    try:
        return float(str(v).replace(',', '').replace('%', '').strip() or 0)
    except ValueError:
        return 0.0


def flag(v):
    return v is True or cell(v).upper() == 'TRUE'


def iso_date(v):
    """A date written in any of the forms found in the main file, as YYYY-MM-DD. Anything else is ''."""
    s = cell(v)
    m = re.match(r'^(\d{4})[-/](\d{1,2})[-/](\d{1,2})', s) or re.match(r'^(\d{4})(\d{2})/(\d{1,2})$', s)
    if m:
        y, mo, d = (int(x) for x in m.groups())
    else:
        m = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', s)       # month/day/year, as the sheet shows dates
        if not m:
            return ''
        mo, d, y = (int(x) for x in m.groups())
    try:
        return date(y, mo, d).isoformat()
    except ValueError:
        return ''


def first_int(v):
    m = re.search(r'\d+', cell(v))
    return int(m.group()) if m else None


def read_export(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def parse(tabs, source='main', stages=None):
    """Returns {'indicators': [...], 'programmes': [...], 'notes': [...]} for the stages asked for (all when None)."""
    indicators, programmes, notes, keys = [], [], [], {}
    for tab, rows in tabs.items():
        rows = [[cell(c) for c in r] for r in rows]
        right_code = {}                                    # indicator name -> its code, from the list at the top of the tab
        for r in rows[:12]:
            for j, v in enumerate(r[:-1]):
                if j >= 3 and CODE.match(v) and r[j + 1]:
                    right_code[norm(r[j + 1])] = v
        code = ind = stage = sub = ''
        cols = None
        for i, r in enumerate(rows):
            if not any(r):
                continue
            c1 = r[1] if len(r) > 1 else ''
            if CODE.match(c1):
                ind = r[2] if len(r) > 2 else ''
                code = right_code.get(norm(ind), c1)
                if code != c1:
                    notes.append('%s row %d: block labelled %s read as %s (%s)' % (tab, i + 1, c1, code, ind))
                stage, cols = '', None
                continue
            st = next((v for v in r[:4] if STAGE.match(v)), '')
            if st:
                stage, cols = st, None
                nxt = rows[i + 1] if i + 1 < len(rows) else []
                oi = next((j for j, v in enumerate(r) if v == 'مسؤول المؤشر'), -1)
                sub = nxt[1] if len(nxt) > 1 else ''
                if code and (stages is None or stage in stages):
                    owner = nxt[oi] if 0 <= oi < len(nxt) else ''
                    if not any(x['code'] == code and x['stage'] == stage for x in indicators):
                        indicators.append({'source': source, 'code': code, 'name': re.sub(r'^[^؀-ۿA-Za-z]+', '', ind), 'stage': stage, 'owner_text': owner})
                continue
            if any(v.startswith('إعتماد التخطيط') for v in r):
                find = lambda rx: next((j for j, v in enumerate(r) if re.match(rx, v)), -1)
                cols = {'name': find(NAME_HEAD), 'time': find(r'^وقت التنفيذ'), 'start': find(r'^تاريخ التنفيذ'), 'end': find(r'^تاريخ الإنتهاء'),
                        'details': find(r'^(التفاصيل|وصف)'), 'exec': find(r'^المكلف'), 'budget': find(r'^الميزانية'), 'approved': find(r'^إعتماد التخطيط'),
                        'done': find(r'^حالة إتمام'), 'evidence': find(r'^تقرير/شاهد'), 'comment': find(r'^تعليق')}
                if cols['name'] < 0:
                    notes.append('%s row %d: plan table without a programme-name heading, skipped' % (tab, i + 1))
                    cols = None
                continue
            if not cols or not code or not stage or (stages is not None and stage not in stages):
                continue
            get = lambda k: r[cols[k]] if 0 <= cols[k] < len(r) else ''
            name = get('name')
            if not name or TOTAL.match(name):
                continue
            term = first_int(get('time')) if cols['time'] >= 0 else None
            week = first_int(r[cols['time'] + 1]) if cols['time'] >= 0 and cols['time'] + 1 < len(r) else None
            start, end = iso_date(get('start')), iso_date(get('end'))
            if cols['start'] >= 0 and get('start') and not start:
                notes.append('%s row %d: date not understood: %s' % (tab, i + 1, get('start')))
            base = '|'.join([source, stage, code, norm(sub), norm(name)])
            keys[base] = keys.get(base, 0) + 1
            key = hashlib.sha1((base + ('#%d' % keys[base] if keys[base] > 1 else '')).encode('utf-8')).hexdigest()[:16]
            programmes.append({
                'key': key, 'source': source, 'stage': stage, 'code': code, 'name': name, 'details': get('details'),
                'term': term if term in (1, 2) else None, 'week': week, 'start': start, 'end': end or start,
                'executor_text': get('exec'), 'budget': number(get('budget')), 'approved': flag(get('approved')), 'done': flag(get('done')),
                'evidence': get('evidence'), 'comment': get('comment'), 'position': '%s!R%d' % (tab, i + 1)})
    return {'indicators': indicators, 'programmes': programmes, 'notes': notes}
