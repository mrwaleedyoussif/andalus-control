"""The system itself: every rule and every operation, with no screen and no web server.

A website, a phone app, a command line or a scheduled job all do the same thing: they find out who is asking
(System.authenticate) and call one of the methods below with that person as `actor`. Every permission is checked
here, so no interface can grant more than these rules allow.
"""
import csv
import hashlib
import io
import json
import secrets
from datetime import date, datetime, timedelta, timezone

from . import db
from .sheet import norm

LEVELS = ('owner', 'principal', 'avp', 'vp', 'supervisor', 'indicator', 'teacher', 'follower')
ADMINS = ('owner', 'principal', 'avp', 'vp')              # run the system: staff, settings, assignment, imports
LEADERS = ADMINS + ('supervisor',)                        # lead their stages: review, see every report there
ALERT_ADMINS = ('principal', 'avp', 'vp')                 # receive the leadership alerts
OUTCOMES = ('done', 'partial', 'postponed', 'not_done')
DEV_KINDS = ('evaluation', 'plan', 'course', 'licence', 'other')
DEV_STATES = ('todo', 'doing', 'done')
DEFAULT_STAGES = ['ابتدائي بنين أهلي', 'ابتدائي بنين عالمي', 'متوسط بنين عالمي']
PERSON_RULES = ('d3', 'd1', 'd0', 'e1', 'o1', 'o7')       # the responsible person and the indicator owner
ADMIN_RULES = ('d1', 'd0', 'e1', 'o7')                    # the principal and the vice principals
RULE_TEXT = {'d3': 'starts in 3 days', 'd1': 'starts tomorrow', 'd0': 'starts today', 'e1': 'ends tomorrow',
             'o1': 'ended yesterday and is not complete', 'o7': 'is a week late'}
SETTINGS = {'need_evidence': False, 'no_self_review': False, 'term1_start': '', 'term2_start': '', 'stages': DEFAULT_STAGES}


class AppError(Exception):
    """A refusal the caller can show: code is AUTH, FORBIDDEN, INPUT, GONE or STATE."""

    def __init__(self, code, message):
        super().__init__(code + '|' + message)
        self.code, self.message = code, message


def now_iso():
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def as_date(s):
    try:
        return date.fromisoformat(str(s)[:10])
    except ValueError:
        return None


def clean(text, limit):
    return ' '.join(str(text or '').split())[:limit]


class System:
    def __init__(self, path=':memory:'):
        self.con = db.connect(path)

    def close(self):
        self.con.close()

    # ---------- small helpers ----------
    def _one(self, sql, args=()):
        return self.con.execute(sql, args).fetchone()

    def _all(self, sql, args=()):
        return self.con.execute(sql, args).fetchall()

    def _audit(self, actor, action, target='', detail=None):
        self.con.execute('INSERT INTO audit (at, user_email, action, target, detail) VALUES (?,?,?,?,?)',
                         (now_iso(), actor['email'] if actor else 'system', action, str(target), json.dumps(detail or {}, ensure_ascii=False)))

    @staticmethod
    def _user(row):
        if row is None:
            return None
        u = dict(row)
        u['stages'], u['aliases'], u['active'] = json.loads(u['stages']), json.loads(u['aliases']), bool(u['active'])
        u.pop('token_hash', None)
        return u

    def _need(self, ok, message, code='FORBIDDEN'):
        if not ok:
            raise AppError(code, message)

    def _need_admin(self, actor):
        self._need(actor['level'] in ADMINS, 'This is for the system admins only.')

    def _need_write(self, actor):
        self._need(actor['level'] != 'follower', 'A view-only account cannot add or change anything.')

    # ---------- settings ----------
    def setting(self, key):
        row = self._one('SELECT value FROM settings WHERE key = ?', (key,))
        return json.loads(row['value']) if row else SETTINGS[key]

    def settings(self):
        return {k: self.setting(k) for k in SETTINGS}

    def save_settings(self, actor, changes):
        self._need_admin(actor)
        for k, v in changes.items():
            self._need(k in SETTINGS, 'Unknown setting: %s' % k, 'INPUT')
            if k in ('need_evidence', 'no_self_review'):
                v = bool(v)
            elif k == 'stages':
                self._need(isinstance(v, list) and v and all(isinstance(x, str) and x for x in v), 'Give the list of stages.', 'INPUT')
            else:
                self._need(v == '' or as_date(v) is not None, 'Write the date as YYYY-MM-DD.', 'INPUT')
            self.con.execute('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
                             (k, json.dumps(v, ensure_ascii=False)))
        if 'term1_start' in changes or 'term2_start' in changes:
            self._redate()
        self._audit(actor, 'settings', '', changes)
        self.con.commit()
        return self.settings()

    # ---------- people ----------
    def user(self, email):
        return self._user(self._one('SELECT * FROM users WHERE email = ?', (str(email).strip().lower(),)))

    def users(self, actor):
        self._need_admin(actor)
        return [self._user(r) for r in self._all('SELECT * FROM users ORDER BY name')]

    def stages_of(self, user):
        scope = self.setting('stages')
        return list(scope) if '*' in user['stages'] else [s for s in scope if s in user['stages']]

    def save_user(self, actor, email, name, level, stages=None, aliases=None, phone='', active=True):
        """Adds a person or changes one. The very first person is added with actor=None and becomes the owner."""
        email, first = str(email or '').strip().lower(), self._one('SELECT COUNT(*) n FROM users')['n'] == 0
        if first:
            level, stages = 'owner', ['*']
        else:
            self._need(actor is not None, 'Sign in first.', 'AUTH')
            self._need_admin(actor)
        self._need('@' in email and ' ' not in email, 'Write a valid e-mail address.', 'INPUT')
        self._need(level in LEVELS, 'Unknown level: %s' % level, 'INPUT')
        name = clean(name, 80)
        self._need(bool(name), 'Write the name.', 'INPUT')
        old = self.user(email)
        if not first:
            self._need(level != 'owner' or actor['level'] == 'owner', 'Only the owner names another owner.')
            self._need(not old or old['level'] != 'owner' or actor['level'] == 'owner', 'Only the owner changes an owner account.')
            self._need(not (old and old['email'] == actor['email'] and (not active or level != actor['level'])), 'You cannot suspend yourself or change your own level.')
        stages = ['*'] if level == 'owner' else [s for s in (stages or []) if isinstance(s, str) and s]
        aliases = [clean(a, 80) for a in (aliases or []) if clean(a, 80)]
        if old:
            self.con.execute('UPDATE users SET name=?, level=?, stages=?, aliases=?, phone=?, active=? WHERE email=?',
                             (name, level, json.dumps(stages, ensure_ascii=False), json.dumps(aliases, ensure_ascii=False), clean(phone, 20), int(bool(active)), email))
        else:
            self.con.execute('INSERT INTO users (email, name, level, stages, aliases, phone, active) VALUES (?,?,?,?,?,?,?)',
                             (email, name, level, json.dumps(stages, ensure_ascii=False), json.dumps(aliases, ensure_ascii=False), clean(phone, 20), int(bool(active))))
        self._audit(actor, 'user-saved', email, {'level': level})
        self.con.commit()
        return self.user(email)

    def new_token(self, actor, email):
        """A fresh sign-in token for a person, shown once. An interface may replace this with its own sign-in and call user()."""
        target = self.user(email)
        self._need(target is not None, 'No such person.', 'GONE')
        if actor is not None:
            self._need(actor['email'] == target['email'] or actor['level'] in ADMINS, 'Only an admin issues a token for someone else.')
            self._need(target['level'] != 'owner' or actor['level'] == 'owner', 'Only the owner issues an owner token.')
        token = secrets.token_urlsafe(32)
        self.con.execute('UPDATE users SET token_hash = ? WHERE email = ?', (hashlib.sha256(token.encode()).hexdigest(), target['email']))
        self._audit(actor, 'token-issued', target['email'])
        self.con.commit()
        return token

    def authenticate(self, token):
        row = self._one('SELECT * FROM users WHERE token_hash = ? AND token_hash != \'\'', (hashlib.sha256(str(token or '').encode()).hexdigest(),))
        u = self._user(row)
        self._need(u is not None and u['active'], 'Sign in again.', 'AUTH')
        return u

    def _names(self, user):
        return [n for n in (norm(x) for x in [user['name']] + user['aliases']) if len(n) >= 4]

    def _named_in(self, user, text):
        t = norm(text)
        return bool(t) and any(n in t for n in self._names(user))

    # ---------- programmes ----------
    def _redate(self):
        """Programmes that came with a term and week instead of dates get their dates from the two term-start settings."""
        starts = {1: as_date(self.setting('term1_start')), 2: as_date(self.setting('term2_start'))}
        for p in self._all('SELECT id, term, week FROM programmes WHERE dated = 0'):
            first = starts.get(p['term'])
            if first and p['week']:
                s = first + timedelta(days=7 * (p['week'] - 1))
                self.con.execute('UPDATE programmes SET start = ?, "end" = ? WHERE id = ?', (s.isoformat(), (s + timedelta(days=4)).isoformat(), p['id']))
            else:
                self.con.execute('UPDATE programmes SET start = \'\', "end" = \'\' WHERE id = ?', (p['id'],))

    def import_source(self, actor, source, parsed):
        """Replaces what is known of one source with a fresh reading of it. Reports and assignments stay attached by programme key."""
        self._need_admin(actor)
        scope = self.setting('stages')
        inds = [x for x in parsed['indicators'] if x['stage'] in scope]
        progs = [x for x in parsed['programmes'] if x['stage'] in scope]
        self.con.execute('DELETE FROM indicators WHERE source = ?', (source,))
        for x in inds:
            self.con.execute('INSERT OR REPLACE INTO indicators (source, code, name, stage, owner_text) VALUES (?,?,?,?,?)',
                             (source, x['code'], x['name'], x['stage'], x.get('owner_text', '')))
        seen = set()
        for p in progs:
            seen.add(p['key'])
            vals = (source, p['stage'], p['code'], p['name'], p.get('details', ''), p.get('term'), p.get('week'), p.get('start', ''), p.get('end', ''),
                    int(bool(p.get('start'))), p.get('executor_text', ''), p.get('budget', 0), int(bool(p.get('approved'))), int(bool(p.get('done'))),
                    p.get('evidence', ''), p.get('comment', ''), p.get('position', ''), p['key'])
            if self._one('SELECT 1 FROM programmes WHERE key = ?', (p['key'],)):
                self.con.execute('UPDATE programmes SET source=?, stage=?, code=?, name=?, details=?, term=?, week=?, start=?, "end"=?, dated=?, executor_text=?, budget=?, '
                                 'approved=?, done=MAX(done, ?), evidence=CASE WHEN ? != \'\' THEN ? ELSE evidence END, comment=?, position=? WHERE key=?',
                                 vals[:13] + (vals[13], vals[14], vals[14]) + vals[15:])
            else:
                self.con.execute('INSERT INTO programmes (source, stage, code, name, details, term, week, start, "end", dated, executor_text, budget, approved, done, evidence, comment, position, key) '
                                 'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', vals)
        gone = [r['key'] for r in self._all('SELECT key FROM programmes WHERE source = ?', (source,)) if r['key'] not in seen]
        for k in gone:
            self.con.execute('DELETE FROM programmes WHERE key = ?', (k,))
        self._redate()
        self._audit(actor, 'source-imported', source, {'programmes': len(progs), 'indicators': len(inds), 'removed': len(gone)})
        self.con.commit()
        return {'programmes': len(progs), 'indicators': len(inds), 'removed': len(gone), 'notes': parsed.get('notes', [])}

    @staticmethod
    def status_of(p, today, waiting=False):
        if p['done']:
            return 'done'
        if waiting:
            return 'awaiting'
        s, e = as_date(p['start']), as_date(p['end'] or p['start'])
        if not s:
            return 'nodate'
        if e < today:
            return 'overdue'
        if s <= today:
            return 'due'
        return 'soon' if (s - today).days <= 7 else 'upcoming'

    def owned_indicators(self, user):
        """The (code, stage) pairs a person answers for: an indicator owner the source names for them, in their own stages."""
        if user['level'] != 'indicator':
            return set()
        mine = self.stages_of(user)
        return {(r['code'], r['stage']) for r in self._all('SELECT code, stage, owner_text FROM indicators') if r['stage'] in mine and self._named_in(user, r['owner_text'])}

    def leads(self, user, programme):
        if programme['stage'] not in self.stages_of(user):
            return False
        return user['level'] in LEADERS or (programme['code'], programme['stage']) in self.owned_indicators(user)

    def _people(self):
        """Active people, each with their stages and the indicators they own worked out once."""
        people = [self._user(r) for r in self._all('SELECT * FROM users WHERE active = 1')]
        for u in people:
            u['_stages'], u['_owned'] = self.stages_of(u), self.owned_indicators(u)
        return people

    def _responsible(self, p, people, chosen):
        """The person answerable for a programme: the one an admin chose, otherwise whoever the source's own text names."""
        if p['key'] in chosen:
            return [u for u in people if u['id'] == chosen[p['key']]]
        return [u for u in people if u['level'] != 'follower' and p['stage'] in u['_stages'] and self._named_in(u, p['executor_text'])]

    def _chosen(self):
        return {r['programme_key']: r['user_id'] for r in self._all('SELECT programme_key, user_id FROM assignments')}

    def programme(self, key):
        row = self._one('SELECT * FROM programmes WHERE key = ?', (str(key),))
        self._need(row is not None, 'No such programme.', 'GONE')
        return dict(row)

    def programmes(self, actor, stage=None, status=None, code=None, today=None):
        today = today or date.today()
        mine = self.stages_of(actor)
        people, chosen = self._people(), self._chosen()
        waiting = {r['programme_key'] for r in self._all('SELECT programme_key FROM reports WHERE status = \'pending\'')}
        out = []
        for row in self._all('SELECT * FROM programmes ORDER BY stage, code, start, id'):
            p = dict(row)
            if p['stage'] not in mine or (stage and p['stage'] != stage) or (code and p['code'] != code):
                continue
            p['done'], p['approved'] = bool(p['done']), bool(p['approved'])
            p['status'] = self.status_of(p, today, p['key'] in waiting)
            if status and p['status'] != status:
                continue
            who = self._responsible(p, people, chosen)
            p['responsible'] = [{'email': u['email'], 'name': u['name']} for u in who]
            p['mine'] = any(u['id'] == actor['id'] for u in who)
            out.append(p)
        return out

    def assign(self, actor, key, email):
        self._need_admin(actor)
        p, who = self.programme(key), self.user(email)
        self._need(p['stage'] in self.stages_of(actor), 'This stage is outside your scope.')
        self._need(who is not None and who['active'], 'No such active person.', 'INPUT')
        self._need(who['level'] != 'follower', 'A view-only account cannot be given a programme.', 'INPUT')
        self._need(p['stage'] in self.stages_of(who), 'That person does not work in this stage.', 'INPUT')
        self.con.execute('INSERT OR REPLACE INTO assignments (programme_key, user_id, by_user, at) VALUES (?,?,?,?)', (p['key'], who['id'], actor['id'], now_iso()))
        self._audit(actor, 'assigned', p['key'], {'to': who['email']})
        self.con.commit()
        return {'programme': p['key'], 'email': who['email'], 'name': who['name']}

    # ---------- reports and review ----------
    def _report(self, row):
        r = dict(row)
        r['by'] = self._one('SELECT email FROM users WHERE id = ?', (r.pop('by_user'),))['email']
        return r

    def submit_report(self, actor, key, outcome='done', note='', evidence=''):
        self._need_write(actor)
        p = self.programme(key)
        self._need(p['stage'] in self.stages_of(actor), 'This stage is outside your scope.')
        self._need(outcome in OUTCOMES, 'Unknown outcome: %s' % outcome, 'INPUT')
        note, evidence = clean(note, 1000), clean(evidence, 500)
        self._need(not evidence or evidence.startswith(('https://', 'http://')), 'Evidence must be a link.', 'INPUT')
        if self.setting('need_evidence') and outcome == 'done':
            self._need(bool(note or evidence), 'A completed report needs evidence or a note.', 'INPUT')
        self._need(self._one('SELECT 1 FROM reports WHERE programme_key = ? AND status = \'pending\'', (p['key'],)) is None, 'A report on this programme is already waiting for review.', 'STATE')
        cur = self.con.execute('INSERT INTO reports (programme_key, by_user, outcome, note, evidence, at) VALUES (?,?,?,?,?,?)', (p['key'], actor['id'], outcome, note, evidence, now_iso()))
        self._audit(actor, 'report-sent', p['key'], {'outcome': outcome})
        self.con.commit()
        return self._report(self._one('SELECT * FROM reports WHERE id = ?', (cur.lastrowid,)))

    def reports(self, actor, status=None):
        mine, owned, out = self.stages_of(actor), self.owned_indicators(actor), []
        for row in self._all('SELECT r.*, p.stage, p.code, p.name AS programme FROM reports r JOIN programmes p ON p.key = r.programme_key ORDER BY r.id DESC'):
            if status and row['status'] != status:
                continue
            own = row['by_user'] == actor['id']
            lead = row['stage'] in mine and (actor['level'] in LEADERS or (row['code'], row['stage']) in owned)
            if own or lead:
                r = self._report(row)
                r['can_review'] = lead and r['status'] == 'pending' and not (self.setting('no_self_review') and own)
                out.append(r)
        return out

    def review(self, actor, report_id, decision, note=''):
        row = self._one('SELECT * FROM reports WHERE id = ?', (report_id,))
        self._need(row is not None, 'No such report.', 'GONE')
        p = self.programme(row['programme_key'])
        self._need(self.leads(actor, p), 'You do not lead this programme.')
        self._need(not (self.setting('no_self_review') and row['by_user'] == actor['id']), 'Nobody decides their own report. Another leader reviews it.')
        self._need(decision in ('approved', 'returned'), 'Decide approved or returned.', 'INPUT')
        self._need(row['status'] == 'pending', 'This report was already decided.', 'STATE')
        self.con.execute('UPDATE reports SET status = ?, decided_by = ?, decided_at = ?, decision_note = ? WHERE id = ?', (decision, actor['id'], now_iso(), clean(note, 500), report_id))
        if decision == 'approved' and row['outcome'] == 'done':
            self.con.execute('UPDATE programmes SET done = 1, evidence = CASE WHEN ? != \'\' THEN ? ELSE evidence END WHERE key = ?', (row['evidence'], row['evidence'], p['key']))
        self._audit(actor, 'report-' + decision, p['key'], {'report': report_id})
        self.con.commit()
        return self._report(self._one('SELECT * FROM reports WHERE id = ?', (report_id,)))

    # ---------- professional development ----------
    def _dev_scope(self, actor):
        mine = set(self.stages_of(actor))
        return {u['id']: u for u in (self._user(r) for r in self._all('SELECT * FROM users')) if mine & set(self.stages_of(u))}

    def _dev(self, row):
        d = dict(row)
        u = self._one('SELECT email, name FROM users WHERE id = ?', (d.pop('user_id'),))
        d['email'], d['name'] = u['email'], u['name']
        d.pop('by_user', None)
        return d

    def dev_items(self, actor):
        """An admin gets the items of the staff who share a stage with them; everyone else gets their own."""
        if actor['level'] not in ADMINS:
            return [self._dev(r) for r in self._all('SELECT * FROM dev_items WHERE user_id = ? ORDER BY due, id', (actor['id'],))]
        scope = self._dev_scope(actor)
        return [self._dev(r) for r in self._all('SELECT * FROM dev_items ORDER BY due, id') if r['user_id'] in scope]

    def save_dev(self, actor, email, kind, title, status='todo', due='', note='', item_id=None, source='manual'):
        self._need_admin(actor)
        who, scope = self.user(email), self._dev_scope(actor)
        self._need(who is not None and who['id'] in scope, 'Choose a member of staff from your stages.', 'INPUT')
        title = clean(title, 160)
        self._need(bool(title), 'Write the title of the item.', 'INPUT')
        self._need(due in ('', None) or as_date(due) is not None, 'Write the date as YYYY-MM-DD.', 'INPUT')
        kind = kind if kind in DEV_KINDS else 'other'
        status = status if status in DEV_STATES else 'todo'
        if item_id is not None:
            old = self._one('SELECT * FROM dev_items WHERE id = ?', (item_id,))
            self._need(old is not None, 'No such item.', 'GONE')
            self._need(old['user_id'] in scope, 'This item is outside your stages.')
            self.con.execute('UPDATE dev_items SET user_id=?, kind=?, title=?, status=?, due=?, note=?, by_user=?, at=? WHERE id=?',
                             (who['id'], kind, title, status, due or '', clean(note, 500), actor['id'], now_iso(), item_id))
        else:
            item_id = self.con.execute('INSERT INTO dev_items (user_id, kind, title, status, due, note, source, by_user, at) VALUES (?,?,?,?,?,?,?,?,?)',
                                       (who['id'], kind, title, status, due or '', clean(note, 500), source, actor['id'], now_iso())).lastrowid
        self._audit(actor, 'dev-saved', item_id, {'email': who['email']})
        self.con.commit()
        return self._dev(self._one('SELECT * FROM dev_items WHERE id = ?', (item_id,)))

    def set_dev_status(self, actor, item_id, status):
        self._need_write(actor)
        self._need(status in DEV_STATES, 'Unknown state: %s' % status, 'INPUT')
        row = self._one('SELECT * FROM dev_items WHERE id = ?', (item_id,))
        self._need(row is not None, 'No such item.', 'GONE')
        self._need(row['user_id'] == actor['id'] or (actor['level'] in ADMINS and row['user_id'] in self._dev_scope(actor)), 'This item is not yours.')
        self.con.execute('UPDATE dev_items SET status = ?, by_user = ?, at = ? WHERE id = ?', (status, actor['id'], now_iso(), item_id))
        self._audit(actor, 'dev-status', item_id, {'status': status})
        self.con.commit()
        return self._dev(self._one('SELECT * FROM dev_items WHERE id = ?', (item_id,)))

    def delete_dev(self, actor, item_id):
        self._need_admin(actor)
        row = self._one('SELECT * FROM dev_items WHERE id = ?', (item_id,))
        self._need(row is not None, 'No such item.', 'GONE')
        self._need(row['user_id'] in self._dev_scope(actor), 'This item is outside your stages.')
        self.con.execute('DELETE FROM dev_items WHERE id = ?', (item_id,))
        self._audit(actor, 'dev-deleted', item_id)
        self.con.commit()

    def import_dev(self, actor, rows):
        """Adds many items from a table, for instance an export of the company platform. Returns what was added and why each other row was skipped."""
        self._need_admin(actor)
        self._need(isinstance(rows, list) and 0 < len(rows) <= 500, 'Give from 1 to 500 rows.', 'INPUT')
        have = {(d['email'], d['kind'], d['title']) for d in self.dev_items(actor)}
        added, skipped = 0, []
        for i, x in enumerate(rows, 1):
            try:
                x = x or {}
                key = (str(x.get('email', '')).strip().lower(), x.get('kind') if x.get('kind') in DEV_KINDS else 'other', clean(x.get('title'), 160))
                self._need(key not in have, 'Already there.', 'INPUT')
                self.save_dev(actor, x.get('email'), x.get('kind'), x.get('title'), x.get('status', 'todo'), x.get('due', ''), x.get('note', ''), source='import')
                have.add(key)
                added += 1
            except AppError as e:
                skipped.append({'row': i, 'why': e.message})
        return {'added': added, 'skipped': skipped}

    # ---------- alerts ----------
    @staticmethod
    def rule_for(p, today):
        """Which alert a programme calls for on a given day, if any."""
        s, e = as_date(p['start']), as_date(p['end'] or p['start'])
        if not s or p['done']:
            return None
        to_start, to_end = (s - today).days, (e - today).days
        if to_start in (0, 1, 3):
            return 'd%d' % to_start
        if to_end == 1 and to_start < 0:
            return 'e1'
        return {-1: 'o1', -7: 'o7'}.get(to_end)

    def run_alerts(self, actor, today=None):
        """Works out who must be told what today and puts one message per person in the outbox. Running it twice on one day sends nothing twice.
        Delivery (e-mail, WhatsApp, push) belongs to whatever interface is put on top: it reads the outbox and marks messages delivered."""
        self._need_admin(actor)
        today = today or date.today()
        people, chosen = self._people(), self._chosen()
        lines = {}
        for row in self._all('SELECT * FROM programmes'):
            p = dict(row)
            rule = self.rule_for(p, today)
            if not rule:
                continue
            to = []
            if rule in PERSON_RULES:
                to += self._responsible(p, people, chosen) + [u for u in people if (p['code'], p['stage']) in u['_owned']]
            if rule in ADMIN_RULES:
                to += [u for u in people if u['level'] in ALERT_ADMINS and p['stage'] in u['_stages']]
            for u in {x['id']: x for x in to}.values():
                done = self.con.execute('INSERT OR IGNORE INTO alerts_sent (day, user_id, rule, programme_key) VALUES (?,?,?,?)', (today.isoformat(), u['id'], rule, p['key'])).rowcount
                if done:
                    lines.setdefault(u['id'], []).append('%s (%s, %s) %s' % (p['name'], p['code'], p['stage'], RULE_TEXT[rule]))
        out = []
        for uid, items in lines.items():
            u = next(x for x in people if x['id'] == uid)
            self.con.execute('INSERT INTO outbox (at, user_id, subject, body) VALUES (?,?,?,?)', (now_iso(), uid, 'Programmes to follow today: %d' % len(items), '\n'.join(items)))
            out.append({'email': u['email'], 'name': u['name'], 'items': items})
        self._audit(actor, 'alerts-run', today.isoformat(), {'people': len(out)})
        self.con.commit()
        return out

    def outbox(self, actor, pending_only=True):
        self._need_admin(actor)
        rows = self._all('SELECT o.*, u.email, u.name, u.phone FROM outbox o JOIN users u ON u.id = o.user_id ' + ('WHERE o.delivered = 0 ' if pending_only else '') + 'ORDER BY o.id')
        return [dict(r) for r in rows]

    def mark_delivered(self, actor, message_id):
        self._need_admin(actor)
        self.con.execute('UPDATE outbox SET delivered = 1 WHERE id = ?', (message_id,))
        self.con.commit()

    # ---------- overview, export, backup ----------
    def dashboard(self, actor, today=None):
        ps = self.programmes(actor, today=today)
        count = lambda rows: {s: sum(1 for p in rows if p['status'] == s) for s in ('done', 'awaiting', 'overdue', 'due', 'soon', 'upcoming', 'nodate')}
        by = lambda field: {k: dict(count([p for p in ps if p[field] == k]), total=sum(1 for p in ps if p[field] == k)) for k in sorted({p[field] for p in ps})}
        return {
            'total': len(ps), 'status': count(ps), 'by_stage': by('stage'), 'by_indicator': by('code'),
            'no_responsible': sum(1 for p in ps if not p['responsible'] and not p['done']),
            'done_without_evidence': sum(1 for p in ps if p['done'] and not p['evidence']),
            'to_review': sum(1 for r in self.reports(actor, 'pending') if r['can_review']),
            'mine': sum(1 for p in ps if p['mine'] and not p['done'])}

    def export_csv(self, actor, **filters):
        """The programme list as CSV text a spreadsheet opens directly. Text a spreadsheet would run as a formula is made plain text."""
        def safe(v):
            s = '' if v is None else str(v)
            return "'" + s if not isinstance(v, (int, float)) and s[:1] in ('=', '+', '-', '@', '\t') else s
        buf = io.StringIO()
        w = csv.writer(buf, lineterminator='\r\n')
        w.writerow(['stage', 'indicator', 'programme', 'term', 'week', 'start', 'end', 'executor', 'responsible', 'status', 'evidence'])
        for p in self.programmes(actor, **filters):
            w.writerow([safe(x) for x in (p['stage'], p['code'], p['name'], p['term'], p['week'], p['start'], p['end'], p['executor_text'],
                                          ', '.join(u['name'] for u in p['responsible']), p['status'], p['evidence'])])
        return '﻿' + buf.getvalue()

    def backup(self, actor):
        """Everything the system keeps, as one JSON-ready object. Sign-in tokens are left out. Owner only: it holds every person's data."""
        self._need(actor['level'] == 'owner', 'The backup is for the owner only.')
        out = {'made_at': now_iso(), 'by': actor['email'], 'tables': {}}
        for t in db.TABLES:
            rows = [dict(r) for r in self._all('SELECT * FROM "%s"' % t)]
            for r in rows:
                r.pop('token_hash', None)
            out['tables'][t] = rows
        self._audit(actor, 'backup')
        self.con.commit()
        return out

    def audit_log(self, actor, limit=200):
        self._need_admin(actor)
        return [dict(r) for r in self._all('SELECT * FROM audit ORDER BY id DESC LIMIT ?', (int(limit),))]
