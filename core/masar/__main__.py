"""Command line: python -m masar <command>. Everything here goes through the same System the interface uses.

  init        make the database and the owner account; prints the owner's token once
  user        add or change a person; --token prints a fresh sign-in token for them
  import      read an export of the main file (JSON) into the system
  settings    show the settings, or change them with key=value pairs
  dashboard   print the overview as JSON
  alerts      work out today's alerts and put them in the outbox
  export      write the programme list as a CSV file
  backup      write everything the system keeps as a JSON file
  serve       run the JSON interface on this computer
"""
import argparse
import json
import sys
from datetime import date

from . import sheet
from .system import AppError, System


def main(argv=None):
    ap = argparse.ArgumentParser(prog='masar', description='مسار الإنجاز core')
    ap.add_argument('--db', default='masar.db', help='the database file (default: masar.db)')
    ap.add_argument('--as', dest='actor', help='e-mail of the person the command runs as (default: the owner)')
    sub = ap.add_subparsers(dest='cmd', required=True)
    p = sub.add_parser('init'); p.add_argument('email'); p.add_argument('name')
    p = sub.add_parser('user'); p.add_argument('email'); p.add_argument('name', nargs='?'); p.add_argument('--level', default='teacher')
    p.add_argument('--stage', action='append', default=[]); p.add_argument('--alias', action='append', default=[]); p.add_argument('--phone', default='')
    p.add_argument('--suspend', action='store_true'); p.add_argument('--token', action='store_true')
    p = sub.add_parser('import'); p.add_argument('file'); p.add_argument('--source', default='main')
    p = sub.add_parser('settings'); p.add_argument('pairs', nargs='*', help='key=value, e.g. term1_start=2026-08-23 need_evidence=true')
    sub.add_parser('dashboard')
    p = sub.add_parser('alerts'); p.add_argument('--today')
    p = sub.add_parser('export'); p.add_argument('file')
    p = sub.add_parser('backup'); p.add_argument('file')
    p = sub.add_parser('serve'); p.add_argument('--port', type=int, default=8000); p.add_argument('--host', default='127.0.0.1')
    a = ap.parse_args(argv)
    show = lambda x: print(json.dumps(x, ensure_ascii=False, indent=2, default=str))
    s = System(a.db)
    try:
        if a.cmd == 'init':
            u = s.save_user(None, a.email, a.name, 'owner')
            if u['level'] != 'owner':
                raise AppError('STATE', 'This database already has people. Use the user command.')
            print('Owner: %s\nToken (shown once): %s' % (u['email'], s.new_token(None, u['email'])))
            return 0
        if a.cmd == 'serve':
            from wsgiref.simple_server import make_server
            from .api import make_app
            print('Listening on http://%s:%d/api/health  (Ctrl+C to stop)' % (a.host, a.port))
            make_server(a.host, a.port, make_app(a.db)).serve_forever()
            return 0
        me = s.user(a.actor) if a.actor else next((u for u in (s._user(r) for r in s._all('SELECT * FROM users ORDER BY id')) if u['level'] == 'owner'), None)
        if me is None:
            raise AppError('AUTH', 'No such person. Run init first, or check --as.')
        if a.cmd == 'user':
            old = s.user(a.email)
            if a.name or not old:
                u = s.save_user(me, a.email, a.name or '', a.level, a.stage, a.alias, a.phone, not a.suspend)
            else:
                u = s.save_user(me, a.email, old['name'], old['level'], old['stages'], old['aliases'], old['phone'], not a.suspend) if a.suspend else old
            show(u)
            if a.token:
                print('Token (shown once): %s' % s.new_token(me, a.email))
        elif a.cmd == 'import':
            show(s.import_source(me, a.source, sheet.parse(sheet.read_export(a.file), a.source)))
        elif a.cmd == 'settings':
            changes = {}
            for pair in a.pairs:
                k, _, v = pair.partition('=')
                changes[k] = v.lower() == 'true' if v.lower() in ('true', 'false') else (v.split(',') if k == 'stages' else v)
            show(s.save_settings(me, changes) if changes else s.settings())
        elif a.cmd == 'dashboard':
            show(s.dashboard(me))
        elif a.cmd == 'alerts':
            show(s.run_alerts(me, date.fromisoformat(a.today) if a.today else None))
        elif a.cmd == 'export':
            with open(a.file, 'w', encoding='utf-8', newline='') as f:
                f.write(s.export_csv(me))
            print('Wrote %s' % a.file)
        elif a.cmd == 'backup':
            with open(a.file, 'w', encoding='utf-8') as f:
                json.dump(s.backup(me), f, ensure_ascii=False, indent=1)
            print('Wrote %s' % a.file)
        return 0
    except AppError as e:
        print('%s: %s' % (e.code, e.message), file=sys.stderr)
        return 1
    finally:
        s.con.close()


if __name__ == '__main__':
    sys.exit(main())
