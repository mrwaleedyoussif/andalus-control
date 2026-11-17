"""The door for other programs: a JSON interface over HTTP, written as a plain WSGI application.

A website or a phone app talks to the system only through these addresses. Each request carries the person's
token in the header "Authorization: Bearer <token>"; the system finds the person and applies its own rules.
Because this is standard WSGI with no extra packages, any Python web host can run it as it is.
"""
import json
import re
from datetime import date
from urllib.parse import parse_qs

from .system import AppError, System

STATUS = {'AUTH': '401 Unauthorized', 'FORBIDDEN': '403 Forbidden', 'INPUT': '400 Bad Request', 'GONE': '404 Not Found', 'STATE': '409 Conflict'}


def make_app(path):
    """Returns the WSGI application for the database file at `path`."""

    def day(q):
        return date.fromisoformat(q['today']) if q.get('today') else None

    def routes(s, me, q, body):
        """(method, pattern) -> function(match) returning the answer. Listed here in one place so the whole interface can be read at a glance."""
        return [
            ('GET', r'/api/me', lambda m: dict(me, stages=s.stages_of(me), leads=sorted('%s|%s' % x for x in s.owned_indicators(me)), settings=s.settings())),
            ('GET', r'/api/programmes', lambda m: s.programmes(me, stage=q.get('stage'), status=q.get('status'), code=q.get('code'), today=day(q))),
            ('GET', r'/api/dashboard', lambda m: s.dashboard(me, today=day(q))),
            ('POST', r'/api/assign', lambda m: s.assign(me, body.get('programme'), body.get('email'))),
            ('GET', r'/api/reports', lambda m: s.reports(me, status=q.get('status'))),
            ('POST', r'/api/reports', lambda m: s.submit_report(me, body.get('programme'), body.get('outcome', 'done'), body.get('note', ''), body.get('evidence', ''))),
            ('POST', r'/api/reports/(\d+)/review', lambda m: s.review(me, int(m.group(1)), body.get('decision'), body.get('note', ''))),
            ('GET', r'/api/development', lambda m: s.dev_items(me)),
            ('POST', r'/api/development', lambda m: s.save_dev(me, body.get('email'), body.get('kind'), body.get('title'), body.get('status', 'todo'), body.get('due', ''), body.get('note', ''), item_id=body.get('id'))),
            ('POST', r'/api/development/import', lambda m: s.import_dev(me, body.get('rows'))),
            ('POST', r'/api/development/(\d+)/status', lambda m: s.set_dev_status(me, int(m.group(1)), body.get('status'))),
            ('DELETE', r'/api/development/(\d+)', lambda m: s.delete_dev(me, int(m.group(1)))),
            ('GET', r'/api/users', lambda m: s.users(me)),
            ('POST', r'/api/users', lambda m: s.save_user(me, body.get('email'), body.get('name'), body.get('level'), body.get('stages'), body.get('aliases'), body.get('phone', ''), body.get('active', True))),
            ('POST', r'/api/users/token', lambda m: {'token': s.new_token(me, body.get('email'))}),
            ('GET', r'/api/settings', lambda m: s.settings()),
            ('POST', r'/api/settings', lambda m: s.save_settings(me, body)),
            ('POST', r'/api/sources/([\w-]+)', lambda m: s.import_source(me, m.group(1), _parsed(body))),
            ('POST', r'/api/alerts/run', lambda m: s.run_alerts(me, today=day(dict(q, **body)))),
            ('GET', r'/api/outbox', lambda m: s.outbox(me)),
            ('POST', r'/api/outbox/(\d+)/delivered', lambda m: s.mark_delivered(me, int(m.group(1)))),
            ('GET', r'/api/export.csv', lambda m: Text(s.export_csv(me, stage=q.get('stage'), status=q.get('status'), code=q.get('code'), today=day(q)), 'text/csv; charset=utf-8')),
            ('GET', r'/api/backup', lambda m: s.backup(me)),
            ('GET', r'/api/audit', lambda m: s.audit_log(me, int(q.get('limit', 200)))),
        ]

    def _parsed(body):
        from . import sheet
        if 'tabs' in body:                                   # an export of the main file, read here
            return sheet.parse(body['tabs'], body.get('source', 'main'))
        return {'indicators': body.get('indicators', []), 'programmes': body.get('programmes', []), 'notes': []}

    def app(environ, start_response):
        def answer(status, payload, ctype='application/json; charset=utf-8'):
            data = payload.encode('utf-8') if isinstance(payload, str) else json.dumps(payload, ensure_ascii=False).encode('utf-8')
            start_response(status, [('Content-Type', ctype), ('Content-Length', str(len(data))), ('Cache-Control', 'no-store'), ('X-Content-Type-Options', 'nosniff')])
            return [data]

        method, path_info = environ['REQUEST_METHOD'], environ.get('PATH_INFO', '')
        if path_info == '/api/health':
            return answer('200 OK', {'ok': True})
        s = System(path)
        try:
            q = {k: v[0] for k, v in parse_qs(environ.get('QUERY_STRING', '')).items()}
            size = int(environ.get('CONTENT_LENGTH') or 0)
            if size > 20_000_000:
                raise AppError('INPUT', 'The request is too large.')
            raw = environ['wsgi.input'].read(size) if size else b''
            try:
                body = json.loads(raw.decode('utf-8')) if raw else {}
            except ValueError:
                raise AppError('INPUT', 'The request body is not valid JSON.')
            if not isinstance(body, dict):
                raise AppError('INPUT', 'The request body must be a JSON object.')
            auth = environ.get('HTTP_AUTHORIZATION', '')
            me = s.authenticate(auth[7:] if auth.startswith('Bearer ') else '')
            for verb, pattern, fn in routes(s, me, q, body):
                m = re.fullmatch(pattern, path_info)
                if m and verb == method:
                    out = fn(m)
                    if isinstance(out, Text):
                        return answer('200 OK', out.text, out.ctype)
                    return answer('200 OK', {'ok': True, 'data': out})
            return answer('404 Not Found', {'ok': False, 'code': 'GONE', 'message': 'No such address.'})
        except AppError as e:
            return answer(STATUS.get(e.code, '400 Bad Request'), {'ok': False, 'code': e.code, 'message': e.message})
        except (ValueError, TypeError, KeyError) as e:
            return answer('400 Bad Request', {'ok': False, 'code': 'INPUT', 'message': 'The request could not be understood: %s' % type(e).__name__})
        finally:
            s.con.close()

    return app


class Text:
    """An answer that is not JSON (the CSV export)."""

    def __init__(self, text, ctype):
        self.text, self.ctype = text, ctype
