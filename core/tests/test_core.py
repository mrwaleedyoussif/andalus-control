"""Checks of the core on the small invented main file in sample/main-sample.json. No school data is needed.
Run from the core folder:  python -m unittest discover -s tests -v
"""
import io
import json
import os
import sys
import tempfile
import unittest
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from masar import AppError, System, sheet          # noqa: E402
from masar.api import make_app                      # noqa: E402
from masar.__main__ import main as cli              # noqa: E402

SAMPLE = os.path.join(os.path.dirname(HERE), 'sample', 'main-sample.json')
EPN, EPI, MBI = 'ابتدائي بنين أهلي', 'ابتدائي بنين عالمي', 'متوسط بنين عالمي'
T1 = '2026-08-23'                                    # a Sunday: week 1 of term 1 in these checks


def build(path=':memory:'):
    """A system with the sample file loaded and one person of every level."""
    s = System(path)
    owner = s.save_user(None, 'owner@school.test', 'Owner', 'teacher')
    s.save_settings(owner, {'term1_start': T1, 'term2_start': '2027-01-10'})
    s.import_source(owner, 'main', sheet.parse(sheet.read_export(SAMPLE)))
    add = lambda email, name, level, stages, aliases=(): s.save_user(owner, email, name, level, list(stages), list(aliases))
    people = {
        'owner': owner, 'vp': add('vp@school.test', 'VP', 'vp', [EPI, MBI]), 'sup': add('sup@school.test', 'Supervisor', 'supervisor', [EPI]),
        'ind': add('ind@school.test', 'Indicator Owner', 'indicator', [EPI, EPN], ['Sample Stage Owner']),
        'teacher': add('teacher@school.test', 'Teacher', 'teacher', [EPI], ['Sample Teacher']),
        'other': add('other@school.test', 'Other Teacher', 'teacher', [EPN]),
        'follower': add('follower@school.test', 'Follower', 'follower', [EPI])}
    return s, people


class Refused(unittest.TestCase):
    def refused(self, code, fn, *a, **k):
        with self.assertRaises(AppError) as c:
            fn(*a, **k)
        self.assertEqual(c.exception.code, code, c.exception.message)


class Adapter(Refused):
    def test_reads_the_sample_file(self):
        out = sheet.parse(sheet.read_export(SAMPLE))
        self.assertEqual(len(out['programmes']), 18)
        self.assertEqual({p['stage'] for p in out['programmes']}, {EPN, EPI, MBI})
        self.assertEqual({p['code'] for p in out['programmes']}, {'C.Br 1.9', 'C.Br 1.1'})
        self.assertEqual(len({p['key'] for p in out['programmes']}), 18, 'every programme has its own key')
        first = out['programmes'][0]
        self.assertEqual((first['term'], first['week'], first['executor_text'], first['done']), (1, 4, 'Sample Teacher', False))
        owners = {(i['code'], i['stage']): i['owner_text'] for i in out['indicators']}
        self.assertEqual(owners[('C.Br 1.9', EPI)], 'Sample Stage Owner')
        self.assertEqual(owners[('C.Br 1.1', EPI)], 'Other Stage Owner')

    def test_keys_are_stable_and_stages_can_be_limited(self):
        a, b = sheet.parse(sheet.read_export(SAMPLE)), sheet.parse(sheet.read_export(SAMPLE), stages=[EPI])
        self.assertEqual(len(b['programmes']), 6)
        self.assertTrue({p['key'] for p in b['programmes']} <= {p['key'] for p in a['programmes']})

    def test_tolerates_the_real_file_quirks(self):
        head = ['', 'وقت التنفيذ', '', 'اسنم البرنامج', 'تاريخ التنفيذ', 'تاريخ الإنتهاء', 'المكلف', 'إعتماد التخطيط وفق المحددات', 'حالة إتمام البرنامج']
        rows = [[''] * 9 for _ in range(3)] + [['', '', '', '', 'C.Br 4.2', 'القيم والهوية الوطنية']] + [
            ['', 'C.Br 1.3', '🛡️ القيم والهوية الوطنية'], ['', EPI, '', '', '', 'مسؤول المؤشر'], ['', 'القيم والهوية الوطنية', '', '', '', 'Someone'], head,
            ['', 'فصل 1', 'الأسبوع 3', 'برنامج أ', '10/25/2026', '2026/11/5', 'X', 'FALSE', 'TRUE'],
            ['', 'فصل 2', 'الأسبوع 1', 'برنامج ب', '202611/8', '', 'Y', False, False],
            ['', '', '', 'الاجمالي', '', '', '', False, False]]
        out = sheet.parse({'tab C4': rows})
        self.assertEqual([p['name'] for p in out['programmes']], ['برنامج أ', 'برنامج ب'], 'the misspelled heading is read and the totals row is left out')
        self.assertEqual(out['programmes'][0]['code'], 'C.Br 4.2', 'a wrong block label is corrected from the list at the top of the tab')
        self.assertEqual((out['programmes'][0]['start'], out['programmes'][0]['end'], out['programmes'][0]['done']), ('2026-10-25', '2026-11-05', True))
        self.assertEqual(out['programmes'][1]['start'], '2026-11-08')
        self.assertTrue(any('read as C.Br 4.2' in n for n in out['notes']))
        for raw, want in [('2026-09-13', '2026-09-13'), ('3/21/2027', '2027-03-21'), ('الأسبوع 11', ''), ('13/40/2026', '')]:
            self.assertEqual(sheet.iso_date(raw), want)


class Levels(Refused):
    def setUp(self):
        self.s, self.p = build()
        self.addCleanup(self.s.close)

    def keys(self, who, **f):
        return [x['key'] for x in self.s.programmes(self.p[who], today=date(2026, 9, 1), **f)]

    def test_first_person_is_the_owner_and_dates_come_from_the_term_start(self):
        self.assertEqual(self.p['owner']['level'], 'owner')
        p = self.s.programmes(self.p['owner'], stage=EPI, code='C.Br 1.9')[0]
        self.assertEqual((p['start'], p['end']), ('2026-09-13', '2026-09-17'), 'week 4 of term 1')

    def test_everyone_sees_their_own_stages_only(self):
        self.assertEqual(len(self.keys('owner')), 18)
        self.assertEqual(len(self.keys('vp')), 12)
        self.assertEqual(len(self.keys('teacher')), 6)
        self.assertEqual(len(self.keys('follower')), 6)
        self.assertEqual(len(self.keys('ind')), 12)

    def test_only_admins_manage_people_and_settings(self):
        for who in ('sup', 'ind', 'teacher', 'follower'):
            self.refused('FORBIDDEN', self.s.users, self.p[who])
            self.refused('FORBIDDEN', self.s.save_settings, self.p[who], {'need_evidence': True})
            self.refused('FORBIDDEN', self.s.save_user, self.p[who], 'x@school.test', 'X', 'teacher', [EPI])
            self.refused('FORBIDDEN', self.s.backup, self.p[who])
        self.refused('FORBIDDEN', self.s.save_user, self.p['vp'], 'boss@school.test', 'Boss', 'owner')
        self.refused('FORBIDDEN', self.s.save_user, self.p['vp'], 'owner@school.test', 'Owner', 'teacher', [EPI])
        self.refused('FORBIDDEN', self.s.save_user, self.p['vp'], 'vp@school.test', 'VP', 'principal', [EPI])
        self.refused('FORBIDDEN', self.s.backup, self.p['vp'])
        self.refused('INPUT', self.s.save_user, self.p['owner'], 'bad address', 'X', 'teacher')
        self.refused('INPUT', self.s.save_user, self.p['owner'], 'x@school.test', 'X', 'boss')
        self.refused('INPUT', self.s.save_settings, self.p['owner'], {'term1_start': 'next week'})

    def test_assignment(self):
        k = self.keys('teacher', code='C.Br 1.1')[1]
        self.refused('FORBIDDEN', self.s.assign, self.p['sup'], k, 'teacher@school.test')
        self.refused('INPUT', self.s.assign, self.p['vp'], k, 'follower@school.test')
        self.refused('INPUT', self.s.assign, self.p['vp'], k, 'other@school.test')
        self.refused('FORBIDDEN', self.s.assign, self.p['vp'], self.keys('other')[0], 'other@school.test')
        self.s.assign(self.p['vp'], k, 'teacher@school.test')
        mine = [x for x in self.s.programmes(self.p['teacher']) if x['mine']]
        self.assertEqual(len(mine), 3, 'two named in the file as Sample Teacher, one chosen by an admin')

    def test_indicator_owner_leads_what_the_file_names_them_for(self):
        self.assertEqual(self.s.owned_indicators(self.p['ind']), {('C.Br 1.9', EPI), ('C.Br 1.9', EPN)})
        self.assertEqual(self.s.owned_indicators(self.p['teacher']), set())
        mine, others = self.keys('teacher', code='C.Br 1.9')[0], self.keys('teacher', code='C.Br 1.1')[0]
        a = self.s.submit_report(self.p['teacher'], mine, note='held')
        b = self.s.submit_report(self.p['teacher'], others, note='held')
        seen = {r['id']: r['can_review'] for r in self.s.reports(self.p['ind'])}
        self.assertEqual(seen, {a['id']: True}, 'sees and may review the report of their own indicator only')
        self.refused('FORBIDDEN', self.s.review, self.p['ind'], b['id'], 'approved')
        self.assertEqual(self.s.review(self.p['ind'], a['id'], 'approved')['status'], 'approved')
        self.assertTrue(self.s.programme(mine)['done'])
        self.assertEqual(self.s.review(self.p['sup'], b['id'], 'returned', 'add the date')['status'], 'returned')
        self.assertFalse(self.s.programme(others)['done'])


class Reports(Refused):
    def setUp(self):
        self.s, self.p = build()
        self.addCleanup(self.s.close)
        self.k = [x['key'] for x in self.s.programmes(self.p['teacher'])]

    def test_who_may_report_and_review(self):
        self.refused('FORBIDDEN', self.s.submit_report, self.p['follower'], self.k[0])
        self.refused('FORBIDDEN', self.s.submit_report, self.p['other'], self.k[0])
        self.refused('GONE', self.s.submit_report, self.p['teacher'], 'missing')
        self.refused('INPUT', self.s.submit_report, self.p['teacher'], self.k[0], outcome='finished')
        self.refused('INPUT', self.s.submit_report, self.p['teacher'], self.k[0], evidence='not a link')
        r = self.s.submit_report(self.p['teacher'], self.k[0])
        self.refused('STATE', self.s.submit_report, self.p['teacher'], self.k[0])
        for who in ('teacher', 'follower', 'other'):
            self.refused('FORBIDDEN', self.s.review, self.p[who], r['id'], 'approved')
        self.refused('INPUT', self.s.review, self.p['sup'], r['id'], 'maybe')
        self.assertEqual(self.s.review(self.p['sup'], r['id'], 'approved')['status'], 'approved')
        self.refused('STATE', self.s.review, self.p['sup'], r['id'], 'approved')
        self.refused('GONE', self.s.review, self.p['sup'], 9999, 'approved')
        self.assertEqual(self.s.programmes(self.p['teacher'])[0]['status'], 'done')

    def test_a_postponed_report_does_not_complete_the_programme(self):
        r = self.s.submit_report(self.p['teacher'], self.k[0], outcome='postponed', note='moved to next week')
        self.s.review(self.p['vp'], r['id'], 'approved')
        self.assertFalse(self.s.programme(self.k[0])['done'])

    def test_the_two_control_rules_are_off_until_switched_on(self):
        self.assertEqual((self.s.setting('need_evidence'), self.s.setting('no_self_review')), (False, False))
        own = self.s.submit_report(self.p['vp'], self.k[0])
        self.assertEqual(self.s.review(self.p['vp'], own['id'], 'approved')['status'], 'approved')
        self.s.save_settings(self.p['owner'], {'need_evidence': True, 'no_self_review': True})
        self.refused('INPUT', self.s.submit_report, self.p['teacher'], self.k[1])
        self.assertEqual(self.s.submit_report(self.p['teacher'], self.k[1], note='28 pupils took part')['status'], 'pending')
        self.assertEqual(self.s.submit_report(self.p['teacher'], self.k[2], outcome='postponed')['status'], 'pending')
        mine = self.s.submit_report(self.p['vp'], self.k[3], evidence='https://drive.google.com/file/d/abc')
        self.refused('FORBIDDEN', self.s.review, self.p['vp'], mine['id'], 'approved')
        self.assertFalse([r for r in self.s.reports(self.p['vp']) if r['id'] == mine['id']][0]['can_review'])
        self.assertEqual(self.s.review(self.p['sup'], mine['id'], 'approved')['status'], 'approved')
        self.assertEqual(self.s.programme(self.k[3])['evidence'], 'https://drive.google.com/file/d/abc')


class Development(Refused):
    def setUp(self):
        self.s, self.p = build()
        self.addCleanup(self.s.close)

    def test_admins_follow_their_stages_and_everyone_sees_their_own(self):
        item = self.s.save_dev(self.p['vp'], 'teacher@school.test', 'course', 'Classroom management', due='2026-12-15')
        self.assertEqual((item['status'], item['source'], item['name']), ('todo', 'manual', 'Teacher'))
        self.refused('INPUT', self.s.save_dev, self.p['vp'], 'other@school.test', 'course', 'X')
        self.refused('INPUT', self.s.save_dev, self.p['vp'], 'teacher@school.test', 'course', '  ')
        self.refused('INPUT', self.s.save_dev, self.p['vp'], 'teacher@school.test', 'course', 'X', due='soon')
        for who in ('sup', 'ind', 'teacher', 'follower'):
            self.refused('FORBIDDEN', self.s.save_dev, self.p[who], 'teacher@school.test', 'course', 'X')
        far = self.s.save_dev(self.p['owner'], 'other@school.test', 'licence', 'Licence renewal')
        fol = self.s.save_dev(self.p['owner'], 'follower@school.test', 'other', 'Orientation')
        self.assertEqual([d['id'] for d in self.s.dev_items(self.p['teacher'])], [item['id']])
        self.assertEqual({d['id'] for d in self.s.dev_items(self.p['vp'])}, {item['id'], fol['id']})
        self.assertEqual(len(self.s.dev_items(self.p['owner'])), 3)
        self.assertEqual(self.s.set_dev_status(self.p['teacher'], item['id'], 'done')['status'], 'done')
        self.refused('FORBIDDEN', self.s.set_dev_status, self.p['teacher'], far['id'], 'done')
        self.refused('FORBIDDEN', self.s.set_dev_status, self.p['follower'], fol['id'], 'done')
        self.refused('FORBIDDEN', self.s.set_dev_status, self.p['vp'], far['id'], 'done')
        self.refused('INPUT', self.s.set_dev_status, self.p['teacher'], item['id'], 'finished')
        changed = self.s.save_dev(self.p['vp'], 'teacher@school.test', 'course', 'Classroom management 2', item_id=item['id'])
        self.assertEqual((changed['id'], len(self.s.dev_items(self.p['owner']))), (item['id'], 3))
        self.refused('FORBIDDEN', self.s.save_dev, self.p['vp'], 'teacher@school.test', 'course', 'X', item_id=far['id'])
        self.refused('FORBIDDEN', self.s.delete_dev, self.p['vp'], far['id'])
        self.refused('FORBIDDEN', self.s.delete_dev, self.p['teacher'], item['id'])
        self.s.delete_dev(self.p['owner'], far['id'])
        self.refused('GONE', self.s.delete_dev, self.p['owner'], far['id'])

    def test_import_reports_each_skipped_row(self):
        self.s.save_dev(self.p['vp'], 'teacher@school.test', 'course', 'Classroom management')
        out = self.s.import_dev(self.p['vp'], [
            {'email': 'teacher@school.test', 'kind': 'evaluation', 'title': '360 evaluation', 'due': '2026-12-01'},
            {'email': 'teacher@school.test', 'kind': 'course', 'title': 'Classroom management'},
            {'email': 'other@school.test', 'kind': 'plan', 'title': 'Plan'}, {'email': 'teacher@school.test', 'title': ''}, None])
        self.assertEqual((out['added'], [x['row'] for x in out['skipped']]), (1, [2, 3, 4, 5]))
        self.assertTrue(any(d['source'] == 'import' for d in self.s.dev_items(self.p['teacher'])))
        self.refused('INPUT', self.s.import_dev, self.p['vp'], [])
        self.refused('FORBIDDEN', self.s.import_dev, self.p['teacher'], [{'email': 'teacher@school.test', 'title': 'A'}])


class Alerts(Refused):
    def setUp(self):
        self.s, self.p = build()
        self.addCleanup(self.s.close)

    def test_the_schedule(self):
        p = {'start': '2026-09-13', 'end': '2026-09-17', 'done': 0}
        want = {'2026-09-10': 'd3', '2026-09-12': 'd1', '2026-09-13': 'd0', '2026-09-16': 'e1', '2026-09-18': 'o1', '2026-09-24': 'o7', '2026-09-11': None, '2026-09-15': None}
        for day, rule in want.items():
            self.assertEqual(System.rule_for(p, date.fromisoformat(day)), rule, day)
        self.assertIsNone(System.rule_for(dict(p, done=1), date(2026, 9, 18)), 'a completed programme calls for nothing')
        self.assertIsNone(System.rule_for({'start': '', 'end': '', 'done': 0}, date(2026, 9, 18)))

    def test_who_is_told_and_only_once(self):
        self.refused('FORBIDDEN', self.s.run_alerts, self.p['teacher'], date(2026, 9, 10))
        three_days = {d['email']: d['items'] for d in self.s.run_alerts(self.p['owner'], date(2026, 9, 10))}
        self.assertEqual(set(three_days), {'teacher@school.test', 'ind@school.test'}, '3 days before: the responsible person and the indicator owner, not the leadership')
        self.assertEqual(len(three_days['teacher@school.test']), 2, 'the two programmes the file names the teacher for')
        self.assertEqual(self.s.run_alerts(self.p['owner'], date(2026, 9, 10)), [], 'a second run on the same day sends nothing')
        day_before = {d['email'] for d in self.s.run_alerts(self.p['owner'], date(2026, 9, 12))}
        self.assertIn('vp@school.test', day_before, 'the day before: the leadership too')
        self.assertNotIn('owner@school.test', day_before)
        self.assertNotIn('follower@school.test', day_before)
        box = self.s.outbox(self.p['owner'])
        self.assertEqual(len(box), 2 + len(day_before))
        self.s.mark_delivered(self.p['owner'], box[0]['id'])
        self.assertEqual(len(self.s.outbox(self.p['owner'])), len(box) - 1)
        self.refused('FORBIDDEN', self.s.outbox, self.p['sup'])


class Overview(Refused):
    def test_dashboard_export_and_backup(self):
        s, p = build()
        self.addCleanup(s.close)
        k = [x['key'] for x in s.programmes(p['teacher'])]
        s.review(p['sup'], s.submit_report(p['teacher'], k[0], note='x')['id'], 'approved')
        s.submit_report(p['teacher'], k[1], note='x')
        d = s.dashboard(p['vp'], today=date(2026, 9, 20))
        self.assertEqual((d['total'], d['status']['done'], d['status']['awaiting'], d['to_review'], d['done_without_evidence']), (12, 1, 1, 1, 1))
        self.assertEqual(d['by_stage'][EPI]['total'], 6)
        self.assertEqual(d['status']['overdue'], 3, 'week 4 programmes ended on 17 September and are not complete')
        self.assertEqual(s.dashboard(p['teacher'], today=date(2026, 9, 20))['to_review'], 0)
        text = s.export_csv(p['vp'])
        self.assertTrue(text.startswith('﻿') and len(text.strip().split('\r\n')) == 13)
        s.import_source(p['owner'], 'tricky', {'indicators': [], 'programmes': [{'key': 'k1', 'stage': EPI, 'code': 'X', 'name': '=HYPERLINK("http://x")'}]})
        self.assertIn("'=HYPERLINK", s.export_csv(p['vp'], code='X'))
        b = s.backup(p['owner'])
        self.assertEqual(len(b['tables']['users']), 7)
        self.assertNotIn('token_hash', b['tables']['users'][0])
        self.assertTrue(any(a['action'] == 'backup' for a in s.audit_log(p['owner'])))

    def test_reimport_keeps_reports_and_drops_what_left_the_source(self):
        s, p = build()
        self.addCleanup(s.close)
        k = [x['key'] for x in s.programmes(p['teacher'])]
        s.review(p['sup'], s.submit_report(p['teacher'], k[0], note='x')['id'], 'approved')
        out = s.import_source(p['owner'], 'main', sheet.parse(sheet.read_export(SAMPLE), stages=[EPI]))
        self.assertEqual((out['programmes'], out['removed']), (6, 12))
        self.assertTrue(s.programme(k[0])['done'], 'a programme completed here stays complete after a fresh reading')
        self.refused('FORBIDDEN', s.import_source, p['vp'] if False else p['teacher'], 'main', {'indicators': [], 'programmes': []})


class Interface(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.path = os.path.join(self.dir.name, 'masar.db')
        s, self.p = build(self.path)
        self.tokens = {k: s.new_token(self.p['owner'], u['email']) for k, u in self.p.items()}
        s.con.close()
        self.app = make_app(self.path)

    def tearDown(self):
        self.dir.cleanup()

    def call(self, method, path, who=None, body=None, query=''):
        raw = json.dumps(body).encode('utf-8') if body is not None else b''
        env = {'REQUEST_METHOD': method, 'PATH_INFO': path, 'QUERY_STRING': query, 'CONTENT_LENGTH': str(len(raw)), 'wsgi.input': io.BytesIO(raw)}
        if who:
            env['HTTP_AUTHORIZATION'] = 'Bearer ' + self.tokens[who]
        got = {}
        data = b''.join(self.app(env, lambda status, headers: got.update(status=status, headers=dict(headers))))
        return int(got['status'][:3]), (json.loads(data) if got['headers']['Content-Type'].startswith('application/json') else data.decode('utf-8'))

    def test_the_interface_end_to_end(self):
        self.assertEqual(self.call('GET', '/api/health'), (200, {'ok': True}))
        self.assertEqual(self.call('GET', '/api/me')[0], 401)
        self.assertEqual(self.call('GET', '/api/programmes', 'teacher', query='stage=' + EPN)[1]['data'], [])
        code, me = self.call('GET', '/api/me', 'ind')
        self.assertEqual((code, me['data']['level'], len(me['data']['leads'])), (200, 'indicator', 2))
        progs = self.call('GET', '/api/programmes', 'teacher')[1]['data']
        self.assertEqual(len(progs), 6)
        self.assertEqual(self.call('POST', '/api/reports', 'follower', {'programme': progs[0]['key']})[0], 403)
        code, rep = self.call('POST', '/api/reports', 'teacher', {'programme': progs[0]['key'], 'note': 'done'})
        self.assertEqual((code, rep['data']['status']), (200, 'pending'))
        self.assertEqual(self.call('POST', '/api/reports', 'teacher', {'programme': progs[0]['key']})[0], 409)
        self.assertEqual(self.call('POST', '/api/reports/%d/review' % rep['data']['id'], 'teacher', {'decision': 'approved'})[0], 403)
        self.assertEqual(self.call('POST', '/api/reports/%d/review' % rep['data']['id'], 'sup', {'decision': 'approved'})[1]['data']['status'], 'approved')
        self.assertEqual(self.call('GET', '/api/dashboard', 'vp')[1]['data']['status']['done'], 1)
        self.assertEqual(self.call('GET', '/api/users', 'teacher')[0], 403)
        self.assertEqual(len(self.call('GET', '/api/users', 'vp')[1]['data']), 7)
        self.assertEqual(self.call('POST', '/api/settings', 'owner', {'need_evidence': True})[1]['data']['need_evidence'], True)
        self.assertEqual(self.call('POST', '/api/reports', 'teacher', {'programme': progs[1]['key']})[0], 400)
        code, item = self.call('POST', '/api/development', 'vp', {'email': 'teacher@school.test', 'kind': 'course', 'title': 'Course'})
        self.assertEqual(self.call('POST', '/api/development/%d/status' % item['data']['id'], 'teacher', {'status': 'done'})[1]['data']['status'], 'done')
        self.assertEqual(self.call('DELETE', '/api/development/%d' % item['data']['id'], 'teacher')[0], 403)
        self.assertEqual(self.call('POST', '/api/alerts/run', 'owner', {'today': '2026-09-12'})[0], 200)
        self.assertTrue(len(self.call('GET', '/api/outbox', 'owner')[1]['data']) > 0)
        code, text = self.call('GET', '/api/export.csv', 'vp')
        self.assertTrue(code == 200 and text.startswith('﻿'))
        self.assertEqual(self.call('GET', '/api/backup', 'vp')[0], 403)
        self.assertEqual(self.call('GET', '/api/backup', 'owner')[0], 200)
        self.assertEqual(self.call('GET', '/api/nothing', 'owner')[0], 404)
        tabs = sheet.read_export(SAMPLE)
        self.assertEqual(self.call('POST', '/api/sources/main', 'owner', {'tabs': tabs})[1]['data']['programmes'], 18)
        self.assertEqual(self.call('POST', '/api/sources/main', 'teacher', {'tabs': tabs})[0], 403)

    def test_the_command_line(self):
        path = os.path.join(self.dir.name, 'cli.db')
        self.assertEqual(cli(['--db', path, 'init', 'owner@school.test', 'Owner']), 0)
        self.assertEqual(cli(['--db', path, 'init', 'second@school.test', 'Second']), 1, 'only the first person is made by init')
        self.assertEqual(cli(['--db', path, 'settings', 'term1_start=' + T1]), 0)
        self.assertEqual(cli(['--db', path, 'import', SAMPLE]), 0)
        self.assertEqual(cli(['--db', path, 'user', 'teacher@school.test', 'Teacher', '--stage', EPI, '--alias', 'Sample Teacher']), 0)
        self.assertEqual(cli(['--db', path, '--as', 'teacher@school.test', 'user', 'x@school.test', 'X']), 1, 'the command line obeys the same rules')
        out = os.path.join(self.dir.name, 'list.csv')
        self.assertEqual(cli(['--db', path, 'export', out]), 0)
        with open(out, encoding='utf-8') as f:
            self.assertEqual(len(f.read().strip().split('\n')), 19)
        self.assertEqual(cli(['--db', path, 'alerts', '--today', '2026-09-12']), 0)
        self.assertEqual(cli(['--db', path, 'backup', os.path.join(self.dir.name, 'b.json')]), 0)


if __name__ == '__main__':
    unittest.main()
