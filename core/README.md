# مسار الإنجاز core

The system on its own: the data, the rules and the operations, with no screen. It is not a website and not an
app. A website, a phone app, a scheduled job or another program is put on top of it and can only do what its
rules allow.

It needs Python 3.9 or later and nothing else: no packages to install, one database file.

## What it holds

| Part | File | What it does |
| --- | --- | --- |
| Storage | `masar/db.py` | One SQLite file with ten tables, created on first use |
| Source adapter | `masar/sheet.py` | Reads an export of the main file (المنصة الشاملة) into indicators and programmes; never writes |
| The system | `masar/system.py` | Every rule and operation: people and levels, programmes, assignment, reports and review, professional development, alerts, overview, export, backup, activity log |
| Interface for programs | `masar/api.py` | The same operations as JSON over HTTP (standard WSGI) |
| Command line | `masar/__main__.py` | The same operations from a terminal or a scheduled job |

Every permission is checked inside `masar/system.py`. The interface and the command line only pass on who is
asking, so nothing built on top can give a person more than their level allows.

## The rules it enforces

- **Levels.** owner, principal, academic vice principal (`avp`), vice principal (`vp`), stage supervisor, indicator owner,
  teacher, follower. Each person works in chosen stages and sees only those.
- **Admins** (owner, principal, avp, vp) manage people, settings, assignment, imports and alerts. Only the owner takes a backup or names another owner.
- **A supervisor** reviews reports in their stages and is not an admin.
- **An indicator owner** reviews only the indicators the main file names them for (مسؤول المؤشر), matched by name.
- **A follower** reads and changes nothing.
- **Reports.** One waiting report per programme. Approving a "done" report completes the programme.
- **Two control rules**, off until an admin switches them on: a "done" report needs evidence or a note; nobody decides their own report.
- **Dates.** A programme given as term and week gets its dates from the two term-start settings.
- **Alerts.** For the responsible person and the indicator owner: 3 days before, the day before, the start day, the day
  before the end, the day after the end, a week after. For the principal and vice principals: the day before, the start
  day, the day before the end, a week after. One message per person per run; a second run on the same day sends nothing.
  Messages go to an outbox. Sending them by e-mail, WhatsApp or push is the job of whatever is put on top.
- **Professional development.** Admins keep items for the staff who share a stage with them; everyone sees and moves their own.

## Start

```bash
cd core
python -m masar init owner@example.com "Owner name"        # prints the owner's token once
python -m masar settings term1_start=2026-08-23 term2_start=2027-01-10
python -m masar import sample/main-sample.json             # or your own export of the main file
python -m masar user teacher@example.com "Teacher name" --stage "ابتدائي بنين عالمي" --alias "الاسم كما في المنصة" --token
python -m masar dashboard
python -m masar alerts --today 2026-09-12
python -m masar export programmes.csv
python -m masar backup backup.json
python -m masar serve --port 8000                          # the interface for programs
```

The main-file export is a JSON object `{tab name: [[cell, ...], ...]}` of the visible tabs. `sample/main-sample.json`
is a small invented one.

## The interface for programs

Every request carries `Authorization: Bearer <token>`. Answers are `{"ok": true, "data": ...}` or
`{"ok": false, "code": ..., "message": ...}` with codes AUTH (401), FORBIDDEN (403), INPUT (400), GONE (404), STATE (409).

| Address | What it does |
| --- | --- |
| `GET /api/health` | Is it running (no token needed) |
| `GET /api/me` | The person, their stages, the indicators they lead, the settings |
| `GET /api/programmes?stage=&status=&code=` | Programmes the person may see, each with status and responsible people |
| `GET /api/dashboard` | Counts by status, stage and indicator; what has no responsible person; what waits for review |
| `POST /api/assign` | Choose the responsible person for a programme (admins) |
| `GET /api/reports`, `POST /api/reports` | Reports the person may see; send a report |
| `POST /api/reports/<id>/review` | Approve or return a report |
| `GET /api/development`, `POST /api/development`, `POST /api/development/import` | Development items; add or change one; add many |
| `POST /api/development/<id>/status`, `DELETE /api/development/<id>` | Move an item along; delete one |
| `GET /api/users`, `POST /api/users`, `POST /api/users/token` | People (admins) |
| `GET /api/settings`, `POST /api/settings` | Settings |
| `POST /api/sources/<name>` | Load a fresh reading of a source (admins) |
| `POST /api/alerts/run`, `GET /api/outbox`, `POST /api/outbox/<id>/delivered` | Work out today's alerts; read and tick off messages |
| `GET /api/export.csv`, `GET /api/backup`, `GET /api/audit` | Programme list for Excel; full backup (owner); activity log |

## Turning it into a site or an app

- **A website:** host `masar.api.make_app("masar.db")` on any Python web host and write pages that call the addresses above.
  Replace the token step with the site's own sign-in (for example Google), then look the person up with `System.user(email)`.
- **A phone app:** the app calls the same addresses. Nothing in the core changes.
- **Sending alerts:** a small job reads `/api/outbox`, sends each message by the channel you choose, and marks it delivered.
- **A new source** (another sheet, another platform): write one function that returns `{"indicators": [...], "programmes": [...]}`
  in the shape `masar/sheet.py` returns, and pass it to `System.import_source`.
- **A larger database later:** all SQL is in `masar/system.py` and `masar/db.py`.

## Tests

```bash
cd core
python -m unittest discover -s tests
```

19 tests cover the adapter, every level, reports and the two control rules, professional development, the alert
schedule, the overview, export and backup, the interface end to end, and the command line. They use the invented
sample file and need no school data.

## Not in this version

- It reads the main file from an export; it does not fetch it from Google or write back to it.
- It queues alerts but does not send them.
- Timetable building and classroom visits, which the مسار الإنجاز site has, are not here.
- The adapter has been checked on the invented sample and on layouts copied from the real file, not on a full real export.
