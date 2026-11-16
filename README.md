# مسار الإنجاز · Pathway to Achievement

The control platform of Andalus Schools, Taif.

A website that sits on top of the live main file (المنصة الشاملة). Leaders monitor and check the plan and edit
execution data; staff report their work for review. The website installs on phones like an app. Its server runs
on Google Apps Script under the school account, so sign-in is the school Google account and there are no passwords.

## What is in this folder

| Path | What it is |
|---|---|
| `site/` | The website: upload this folder to a web host |
| `apps-script/Parser.gs` | Reads a tab of the main file and turns it into programme records |
| `apps-script/Server.gs` | Sign-in, sessions, permissions, sync, reports, review, write-back, undo, notifications, responsible people, evidence files, pictures, private calendars, activity log |
| `apps-script/Index.html` | The same interface as one file, served by Apps Script itself (fallback, see the end) |
| `apps-script/appsscript.json` | Project manifest: time zone, permissions, web app access |
| `src/` | Interface source and the school logos (`src/img/`). `src/solver.js` is the schedule builder's engine, `src/builder.js` its page, `src/visits.js` the classroom visits, and `src/upload.js` the reading of Excel, CSV and Google Sheets tables. After a change run `node build.js` to rebuild `site/` and `Index.html` |
| `test/` | Automated tests |

## Setup

Do part A signed in with the school account that can open the main file.

### A. The server (about 10 minutes)

1. Create a new Google Sheet named `مسار الإنجاز - بيانات`. This is the control file. Do not share it with anyone.
2. In it open Extensions > Apps Script. Create three files and paste their contents: `Parser` (script), `Server` (script), `Index` (HTML). Delete the default `Code.gs`.
3. Project Settings > tick "Show appsscript.json manifest file in editor", then replace its contents with `apps-script/appsscript.json`.
4. Choose the function `setup` and press Run. Approve the permissions. It creates the tabs, makes you the owner, starts the hourly sync,
   and makes a folder named `مسار الإنجاز - شواهد` in your Drive for evidence files. The Drive permission it asks for covers only
   files this script creates; it cannot read the rest of your Drive. After pasting the manifest, the editor's Services list should show **Drive**.
5. Deploy > New deployment > Web app. Execute as: **Me**. Who has access: **Anyone**. Copy the link that ends with `/exec`.

"Anyone" is needed because the website calls this address from its own address. Every request must still carry a
session, and a session is only given to a school account that is on the staff list.

### B. Google sign-in for the website (about 10 minutes, once)

6. Open https://console.cloud.google.com, create a project, then APIs & Services > OAuth consent screen. Choose Internal if it is offered.
7. Credentials > Create credentials > OAuth client ID > Web application. Under "Authorized JavaScript origins" add the website's address without any path, for example `https://your-name.github.io`. Copy the client ID.
8. Reload the control file. In the menu مسار الإنجاز choose ضبط معرّف تسجيل الدخول للموقع and paste the client ID.

### C. The website (about 10 minutes)

9. Open `site/config.js` and fill in the two values: the `/exec` link from step 5 and the client ID from step 7. Neither is a secret.
10. Upload everything inside `site/` to a web host. With GitHub Pages: create a repository, upload the files, then Settings > Pages > Deploy from a branch. The address is `https://your-name.github.io/repository-name/`.
11. Open the address and sign in with the school Google account.
12. Go to الإدارة > الإعدادات, paste the link of the main file, check the term start dates and the stages covered, and save. Press the sync button and compare the totals with the main file.
13. Add the staff under الإدارة > المستخدمون: school email, name, role, stages, the name as it is written in the main file, mobile number and notification channel.
14. In الإدارة > الإعدادات set the notification time and paste the website's address, so messages link back to it.
15. When the totals are right, switch on "السماح بالكتابة في المنصة الشاملة". Until then nothing is written to the main file.
16. If teachers should be able to ask for programmes to be added or removed, also switch on
    "السماح للمعلمين بطلب إضافة البرامج وحذفها". It is off at first.

On a phone: open the address, then choose "Add to Home screen" from the browser menu.

To update later: paste the new `Parser.gs`, `Server.gs`, `Index.html` and `appsscript.json`, run `setup` once from the editor if the
update adds a permission (it will ask you to approve it), then in the control file choose
مسار الإنجاز > الإعداد الأولي once (it adds any new tabs and keeps all data), then Deploy > Manage deployments > Edit >
New version. Re-upload `site/` if the interface changed (keep your own `config.js`).

## Who can do what

The Principal, the Academic Vice Principal and the Vice Principal are the system admins.

| Role | Sees | Can do |
|---|---|---|
| معلم Teacher | Programmes of their stages, their own reports and requests | Report execution of a programme, add work on an indicator. When the admins allow it: propose a new programme, and ask to remove a programme they are responsible for. |
| وكيل المدرسة Vice Principal (admin) | Everything in their stages | Approve or return reports and plan requests, add and remove programmes, edit execution data, assign responsible people, sync, data checks, users, settings, notifications, activity log |
| وكيل الشؤون التعليمية Academic Vice Principal (admin) | Everything in their stages | Same as Vice Principal |
| مدير المدرسة Principal (admin) | Everything in their stages | Same, plus the stage principal's comment |
| مالك النظام Technical owner | Everything | Same as an admin. Only an owner can change an owner's account. |

## Changing the plan: adding and removing programmes

Three parties control this, in order:

1. **The main branch**, in the main file itself. Every table there has a plan part, a "المراجعة والإعتماد" part and an
   execution part. The platform treats the plan as closed, and writes nothing, when either of these is true:
   - the main branch has ticked "إعتماد التخطيط" for that programme (it can then no longer be removed), or
   - the main branch has protected the range, so the installing account cannot edit it. The platform asks Google
     whether it may edit before every write, and shows "التخطيط مغلق من الفرع الرئيسي" when it may not.
   The platform reads these permissions at every sync and shows them before anyone tries: each programme is marked
   "معتمد من الفرع الرئيسي", "التخطيط مغلق" or "التنفيذ مغلق", and choosing an indicator on the programmes page shows
   per stage whether its plan is open (with the number of free rows), closed, or has no free rows. Protections that
   only warn, and ones the installing account is allowed to edit, close nothing. The same rule covers execution data:
   if the main branch locks a programme's execution cells, the edit form is replaced by a notice, and approving a
   report is recorded but not written. When the main branch opens something again, the next sync opens it here.
2. **The system admins.** They add and remove programmes themselves, at once. They decide every teacher request.
   They can switch teachers' requests off altogether under الإدارة > الإعدادات.
3. **Teachers**, when the admins allow it. A teacher proposes a new programme for an indicator in their stage, or asks
   to remove a programme they are responsible for. Nothing changes until an admin approves. On approval of a proposal
   the teacher becomes the programme's responsible person.

What the platform writes, and what it never does:

- **Adding** fills the first free row the main branch prepared under the table (empty plan cells, unticked approval
   box). The form is built from that table's own headings, and where a cell offers a list, the form offers the same
   list. If the table has no free row, nothing can be added: the platform never inserts rows.
- **Removing** empties the plan cells of the programme's row, so the row is free again. It is refused for a programme
   with execution data (completion tick, actual number or evidence).
- It never writes to a calculated cell, to the approval or technical-notes columns, or to another row.
- It does not change the plan fields of an existing programme (name, dates, target). To change one, remove it and
   add it again while it is still unapproved, or change it in the main file.
- Undo reverses an addition or a removal, as long as the row is still as the platform left it and the main branch has
   not closed it in the meantime.
- Every request and decision is recorded in the `Submissions` and `Audit` tabs.

## What people see

- **Start page.** The cover with both school logos, the school slogan, a welcome line and the sign-in button. Nothing
  else is shown, and nothing about the schools is loaded, until the person signs in with their school account.
  Admins edit the slogan and the welcome line under الإدارة > الإعدادات.
  When the site opens, the page moves into place: the schools' eight-pointed star blooms around a white disc that
  holds both logos, the title and text rise in, and the sign-in button pulses gently. It plays once per visit and
  again after signing out. People whose device is set to reduce motion see the finished page with nothing moving.
  The logo files in `src/img/` have transparent backgrounds; they still need a light surface behind them, because
  their lettering is navy.
- **School choice.** After sign-in, anyone who works across both schools chooses مدارس الأندلس الأهلية or
  مدارس الأندلس العالمية. The school can be switched from the top of any page. People with one school go straight in.
- **مؤشر التقدم (progress monitor).** At the top of the home page: four rings, one inside the other, with a tile of
  the same colour beside each. Completed is green, in progress is blue, starting within 7 days is dark orange,
  overdue is dark red. An arc's length is that state's share of the total, and the centre shows the share completed.
  The monitor counts programmes or whole indicators (switch at its top). Pointing at a ring or tile reads it out in
  the centre; selecting it opens the programmes, or lists the indicators, in that state.
  - A programme is *in progress* from its start date until its end date, unless it is marked done. Its percentage is
    the share of its dates that has passed. The blue is graded in five steps by that percentage.
  - An indicator is *completed* when all its programmes are done, *overdue* when at least one is overdue, *in progress*
    when work has started and nothing is late (percentage = programmes done out of all), *starting soon* when its first
    programme starts within 7 days.
  - The same colours mark every programme row, calendar entry, list bar and status label in the platform.
- **Back, forward, undo, redo.** Four buttons at the top of every page. Back and forward move through the pages and
  filters visited. Undo and redo cover the actions of the current visit: an edit of execution data, a sent report,
  an approval or return, a picture, a task, a session. Undoing an approval also puts the main file's cells back.
- **التقويم (calendar).** A month view of the programmes by start date, with end dates marked, for one indicator or all.
  Programmes are coloured by state, a thin bar under each day shows the mix, Sundays carry the term and week number,
  and weekends and today stand out.
  Choosing a day lists what starts, ends and is running that day.
- **حسب المعلم (by teacher), admins only.** One row per member of staff: programmes assigned, done, late, due this week,
  and reports sent. A row opens that person's programmes. Names in the main file that match no user are listed below,
  so they can be linked by adding the name to the user's "name as written in the main file".
- **المسؤول في المنصة (responsible person).** Many programmes in the main file name no one, or name a group. An admin
  can make one member of staff responsible for a programme from the programme's own sheet, or for a whole filtered
  list in one step with إسناد القائمة. The choice is kept in the `Assignments` tab of the control file; nothing is
  written to the main file. The person then sees those programmes under their tasks, is counted in حسب المعلم, and
  gets their reminders. Where both exist, the admin's choice takes over from the name written in the main file.
  حسب المعلم and فحص البيانات show how many programmes still have no one responsible in the platform.
  If the main file later moves a programme to another week or date, its responsible person follows it at the next
  sync, as long as its stage, indicator and name are unchanged. If a programme is renamed, it shows as having no one
  again. When a person is suspended, their programmes show as having no one until they are active again.
- **التقرير الأسبوعي (weekly report), admins only.** One report for the school chosen at the top of the page, or for
  one stage: the progress rings and the numbers by state with the change since the week before, the longest-overdue
  programmes, what starts in the next seven days, a line for every indicator, and a line for every person.
  طباعة أو حفظ PDF prints it on about two A4 pages, dark ink on white whatever theme the screen uses.
  أرسله إلى بريدي emails it to you at once. The report's numbers are worked out on the server by the same rules the
  home page uses.
- **Evidence from the phone.** In the report form and in the admins' edit form, رفع صورة أو PDF takes a photo with the
  camera or picks a picture or PDF. A photo is shrunk on the device (longest side 1600 px) before it is sent; a PDF can
  be up to 5 MB. The file is saved in the Drive of the account that installed the server, under
  `مسار الإنجاز - شواهد / stage / indicator`, and its link fills the evidence box. Pasting a link still works.
  School accounts that have a file's link can open it. The folders stay private to the installing account; to let
  someone outside the school (head office, for example) open evidence, share the top folder with them in Drive.
  A programme whose table in the main file has no evidence column gets no upload button in the edit form.
- **الجدول المدرسي (school timetable).** The school's sessions schedule: **Sunday to Thursday, eight sessions a day**.
  It is a grid of five day columns with eight numbered slots each; every slot shows its number and its time. Admins
  enter it for their stages; everyone in a stage can read it, by class or by teacher, and a teacher opens it on their
  own sessions. Today's column is marked, and the session running now is tagged "الآن".
  - **Session times are set by the admins:** أوقات الحصص opens the start and end of each of the eight sessions for a
    stage. Saving changes the time shown on every slot at once; the sessions themselves stay where they are. The same
    times can be applied to all of an admin's stages in one step. A session must end after it starts and may not
    start before the previous one ends. Until someone sets them, the times are 07:30 to 14:35 in 45-minute sessions.
    A change can be undone. Teachers see the times but cannot change them.
  - **One session at a time:** حصة جديدة, or the + in an empty slot, with class, day, session number, subject, teacher
    (a member of staff of that stage, or a typed name) and room.
  - **A whole schedule at once:** لصق جدول. Copy the rows from Excel or Google Sheets and paste them. Columns in order:
    class, day, session number, subject, teacher, room. Days may be Arabic or English names, or 1 to 5 with 1 for
    Sunday. The session number may use Arabic digits or be written "الحصة 3". A heading line is skipped. If any row is
    wrong (a Friday, a session 9, a slot already taken), nothing is added and the wrong lines are listed. At most 600
    rows per paste.
  - **One session per class per slot:** a second session for the same class in a slot already filled is refused;
    change or delete the first one. **A teacher in two classes in the same slot is saved, with a warning.**
  - A typed teacher name that matches exactly one member of staff is linked to them, so it shows under their sessions.
  - مسح جدول الصف removes one class's sessions. Adding, changing, deleting, pasting and clearing can all be undone.
  - It is kept in the `Timetable` tab of the control file and has nothing to do with the main file.
- **Buttons to other platforms.** A button opens another platform in a new tab; the person signs in there with their
  own account for that platform. It starts with one button, for admins only: **منصة التطور المهني**
  (`https://andalus-idp.online/`), in the menu, on the home page, and under المزيد on a phone. Admins manage the list
  under الإدارة ← الإعدادات ← منصات أخرى: name, link (https only), and who sees it (admins only, or everyone); up to
  twelve. A teacher is never sent a button meant for admins. Nothing is read from those platforms: that platform does
  not allow other sites to embed it or read its data, so showing its progress inside this site would need its owner to
  provide an export or an access key.
- **الزيارات الصفية (classroom visits).** An admin records a classroom visit on the form of their role; it is kept
  under the teacher and counts in their evaluation. Teachers see their own visits. See its section below.
- **منشئ الجدول (schedule builder).** For admins. It designs the school timetable from what the admins enter, and one
  click then puts the design into الجدول المدرسي. See the next section.
- **تقويمي (my calendar).** Private to each person; nobody else, including the technical owner, can open it in the platform.
  Admins get a tasks calendar (one-off, every school day, or weekly) and a weekly sessions timetable. Teachers get the
  sessions timetable. An admin's tasks due today are added to their own daily message.
- **Pictures.** Anyone can add their own picture from the menu card with their name. The page shrinks it to a small
  square on the device before sending it.

## Uploading data from Excel or Google Sheets

Every import on the site takes a table from the same three sources:

- **A file:** Excel (`.xlsx`) or CSV. It is read in the page itself; the file is not sent anywhere, only its rows are.
  The first visible sheet is read. CSV may be UTF-8 or the older Arabic Windows encoding.
- **A Google Sheets link:** paste the link and press قراءة. The file must be shared (view is enough) with the account
  that runs the platform **and** with the admin's own account by name; a technical owner needs only the first. The first
  visible tab is read, or the tab the link points to.
- **Pasted cells:** copy the cells in Excel or Google Sheets and paste them into the box.

Where it is used:

| Import | Where | Columns |
|---|---|---|
| Employees | الإدارة ← المستخدمون ← استيراد الموظفين | name, major, position, WhatsApp number, school email, and optionally stage |
| School timetable | الجدول المدرسي ← لصق جدول | class, day, session number, subject, teacher, room |
| Builder's plan | منشئ الجدول ← الخطة ← لصق من Excel | first line the subjects; then a class and its weekly sessions on each line |
| Builder's teachers | منشئ الجدول ← المعلمون ← لصق من Excel | name, subjects, quota |

**Importing employees.** The columns may be in any order and under Arabic or English headings; the page recognises
them and shows which column it took for what, and each can be changed. A file with no heading line is understood from
what the cells hold. تنزيل قالب gives an empty file with the headings. Before anything is saved, every row is checked
and listed as new, update, unchanged or error, with its line in the file and the reason; the import button then saves
the rows that pass and skips the rest.

- A **new** employee is added as a teacher of the chosen stage, active, with major and position. With a WhatsApp
  number, their notifications go by email and WhatsApp; without one, by email.
- An **existing** account (same school email) gets the new name, number, major and position. Its role, its other
  settings and its earlier stages stay; a stage in the import is added to them. An empty cell never erases a value.
- **The file never gives admin rights.** Change a person's role afterwards on their own page.
- An admin can import into their own stages only; the technical owner into any. The technical owner's account is
  changed only by an owner.
- A Saudi number written locally (`05xxxxxxxx`, or `5xxxxxxxx` after Excel dropped the zero) is stored as `9665xxxxxxxx`.
- Emails outside the school's domain, a repeated email, a wrong number, or an unknown stage make that row an error.
- Up to 500 employees per import. The last import can be undone by the admin who made it: accounts it added are
  removed (unless their role was raised meanwhile) and accounts it changed are put back.

Major and position are also on each person's page and in the users list. They are two new columns in the `Users` tab.

Limits:

- The old `.xls` format is not read; save it as `.xlsx`. Files up to 5 MB.
- Cells are taken as text and numbers. Dates in Excel are not interpreted; none of the imports need one.
- Reading by link refuses hidden tabs, the main file and the control file, so it cannot be used to look into them.

## Classroom visits

الزيارات الصفية has three parts for admins, and one page for teachers.

**The forms (الاستمارات).** There are three, one for each kind of visitor:

| Form | Used by |
|---|---|
| المدير Principal | The Principal's account |
| المشرف الأكاديمي Academic supervisor | The Academic Vice Principal's account (وكيل الشؤون التعليمية) |
| الوكيل Vice Principal | The Vice Principal's account |

The technical owner chooses one of the three at each visit. The platform comes with a starting form for each, marked
نموذج مبدئي; **replace them with the school's own forms**. The Principal or the technical owner opens تعديل الاستمارة and
types or pastes the form as plain text:

- the title of the form;
- the rating levels, highest first, separated by commas (two to five levels);
- the items, one per line; a line that starts with `#` is the title of a domain. Numbering and bullets pasted from
  Word are dropped.

A visit keeps a copy of the form as it was on the day, so changing a form never changes a visit recorded earlier.

**Recording a visit (زيارة جديدة).** The admin chooses the stage, the teacher and the date. The teacher's sessions on
that day are offered from the school timetable; one press fills the class, subject and session. Each item is rated on
the form's scale, or marked لا ينطبق (does not apply). The result is shown as the ratings are chosen: the marks given
as a share of full marks over the rated items, for the whole visit and for each domain. Three notes go with it
(strengths, areas to improve, recommendations) and a private note that the teacher never receives. A visit cannot be
saved while an item is left unrated. A visit being filled in is kept on the device until it is saved, so closing the
page by mistake does not lose it.

**Who can do what with a visit**

- An admin records visits in their own stages, on the form of their own role, and cannot visit themselves.
- Only the admin who recorded a visit can change it; they or the technical owner can delete it. Both can be undone.
- Every admin of the stage can read every visit of that stage.
- The teacher sees a visit when تظهر الزيارة للمعلم is ticked (it is by default): the report with its ratings and the
  three notes, without the private note and without the visitor's address. They confirm with اطّلعت على الزيارة, and
  the admins see whether it was read. The menu shows the teacher how many visits they have not read.
- A visit opens as a report that can be printed.

**The teachers' evaluation (تقييم المعلمين).** One row for each teacher of the stage: number of visits, the last one,
the average result, and the average for each of the three forms. A teacher with no visit is flagged لم يُزر. Selecting
a teacher shows their averages for each domain of each form, and their visits. The whole year or one term can be
shown. The evaluation here is the visits' results only; it does not read منصة التطور المهني or any other system.

Visits are kept in the `Visits` tab of the control file, and the three forms in its `Planner` tab.

## The schedule builder

منشئ الجدول is an admin page with five steps. It works on one stage at a time, and each stage keeps its own setup.

1. **الخطة (plan).** Sessions on each day of the week (1 to 8; the session times come from أوقات الحصص), then a table
   of classes against subjects: how many sessions a week each class has of each subject. Classes and subjects can be
   added, renamed, removed, or pasted from Excel as one table. Each class shows its total against what its week holds.
2. **المعلمون (teachers).** Each teacher with the subjects they teach, their weekly quota of sessions (النصاب), and
   optionally the most sessions they may have in one day. A teacher is a member of staff of the stage or a typed name.
3. **الإسناد (assignment).** Who teaches each subject to each class. توزيع تلقائي fills the empty cells with a teacher
   of that subject who still has room in their quota, and lists what the quotas cannot cover. Any cell can be changed
   by hand; a teacher over their quota is flagged, not refused.
4. **التعليمات (instructions).** Rules the builder follows. Each is chosen from seven kinds and filled in:

   | Instruction | Example |
   |---|---|
   | A teacher is not available at certain times | Not on Sunday, sessions 1 to 2 |
   | A subject only in certain sessions | PE in sessions 2 to 7 only |
   | A teacher's most sessions in a day | No one above 6 |
   | A teacher's most sessions in a row | No more than 4 |
   | A subject's sessions in one day | Maths up to 2 a day |
   | A subject that shares one place | One playground: PE for one class at a time |
   | A fixed or closed session | Activity for all classes, Tuesday session 8 |

   Three kinds can be marked **إلزامية (must)** or **مفضّلة (prefer)**; the others are always a must. A must is never
   broken: if it cannot be met, the sessions it blocks are listed as not placed. A preference is followed as far as
   possible, and the report counts where it was not. Instructions are picked and filled in, not typed as free text:
   the builder runs fixed rules and does not interpret sentences.
5. **البناء (build).** A check of the setup first: a class with more sessions than its week, a teacher with more
   sessions than free time, or a subject that cannot fit stops the build and says why; a teacher over quota or a
   cell without a teacher is a warning. Then ابنِ الجدول designs the schedule and shows:
   - how many sessions were placed, clashes (always none), free sessions inside a class's day, teachers' waiting
     sessions, and the longest day any teacher has;
   - every instruction, marked followed or not, with a count;
   - the design as each class's week and each teacher's week, and each teacher's sessions per day;
   - تصميم آخر for a different design from the same setup;
   - اعتماد في الجدول المدرسي, which replaces the timetable of the classes in the plan and leaves other classes
     alone. It asks first, saying how many current sessions it replaces, and it can be undone.

What the builder always does, without being told:

- No class and no teacher is ever in two places.
- A class's day starts at the first session and has no free session in the middle. A class with fewer sessions than
  the week holds gets even days, with the free sessions at the ends of days. If the instructions ever force a free
  session inside a day, the report counts it.
- A subject is spread over the week. It comes twice in a day only when it has more sessions than days, and the two
  sessions are then placed next to each other wherever possible.
- Teachers' sessions are balanced over the days, with as few waiting sessions between them as it can manage.
- A teacher's sessions in classes outside the build (another stage the admin covers, or a class that is not in the
  plan) are kept free, when that teacher has an account.

Things to know:

- The engine runs in the admin's browser, not on the server. A full stage (18 classes, 720 sessions) takes about a
  second on a laptop; a phone is slower. The same setup and design number always give the same schedule.
- The server stores the setup (the `Planner` tab of the control file) and checks every session again when a design is
  applied. If two admins edit the same stage's setup at once, the second save is refused and that admin's page loads
  the saved setup again.
- After applying, each session can still be changed by hand in الجدول المدرسي.
- Rooms are not planned, apart from a shared place given as an instruction. A class and subject has one teacher.

## Notifications

Once a day, at the time the admins set (07:30 at first), each person gets one message listing what concerns them.
Google runs the schedule within about a quarter of an hour of the chosen time.

| Who | When |
|---|---|
| The person carrying out a programme, and the indicator's owner | 3 days before the start, 24 hours before the start, on the start day, 24 hours before the end, the day after the end if it is not marked done, and again a week after the end |
| System admins | 24 hours before the start, on the start day, 24 hours before the end, and a week after the end if it is still not marked done |

- The person carrying out a programme is the one an admin chose for it in the platform. Where no one was chosen,
  people are matched by the name written in the main file, so fill in "the name as written in the main file" for each user.
  A programme assigned to a group such as معلمو المواد reaches the indicator's owner and the admins only.
- Completed programmes and programmes with no date send nothing.
- The two follow-ups after the end date stop as soon as a report on the programme is waiting for review or approved.
  If the report is returned, they apply again. After the week-later message there are no further reminders.
- An admin's own private tasks due that day are listed at the end of that admin's message only. Tasks marked
  "do not remind" and tasks already ticked off are left out. The reminder comes with the daily message, not at the
  task's own time.
- **Email** is sent automatically from the account that installed the server.
- **WhatsApp** has two modes. Without any subscription, the التنبيهات page shows each person's ready message with a
  WhatsApp button, and an admin sends it with one tap. People set to WhatsApp also get the email until automatic
  sending is connected. For automatic sending, the school needs a WhatsApp Business (Cloud API) account from Meta and
  an approved message template whose text has two variables, `{{1}}` the person's name and `{{2}}` the day's summary.
  Then, in the control file, choose مسار الإنجاز > ربط واتساب and enter the phone number ID, the template name and the access token.
- Every run is recorded in the `Notifications` tab of the control file.

### The weekly report by email

On the chosen day (Sunday at first), at the daily notification time, each admin (Principal, Academic Vice Principal,
Vice Principal) is emailed the weekly report for the stages they cover, one section per school. It is sent even when
the daily notifications are switched off, and it has its own switch and day under الإدارة > الإعدادات. An admin whose
notification channel is "off" does not get it. It always goes by email, never WhatsApp.

Each week's totals are kept in the `History` tab of the control file, one row per stage, so the next report can say
what changed. They are kept even while the weekly email is switched off. The first report has nothing to compare with.

## How it is protected

- Sign-in is Google's. The server checks each sign-in token with Google, then checks the school domain and the staff list.
- A session lasts at most six hours. The server keeps only a hash of it.
- Every request is checked on the server against the person's role and stages. Only a fixed list of actions can be called.
- The website loads scripts only from itself and from Google's sign-in address, and refuses to run inside another site's frame.
- Staff never touch the main file. Only an admin's decision or an admin's own edit writes to it: for execution data,
  four cells of the programme's own row (completion tick, actual number, evidence link, stage principal's comment);
  for the plan, the plan cells of one free row when adding, or of the programme's own row when removing, and only
  while the main branch allows it (see "Changing the plan").
- Before each write the server checks that the row still holds the same programme. If rows moved it finds the
  programme again; if it was renamed or removed it refuses.
- Undo never takes its values from the page: the server keeps what the cells held and puts exactly that back.
  An edit can be undone for six hours, by the person who made it.
- Pictures are accepted only as small JPEG, PNG or WebP images. SVG, links and other files are refused.
- Evidence files are accepted only as JPEG, PNG, WebP or PDF, up to 6 MB, and only if their contents match their type.
  The server names the file itself. Uploads are limited to twelve per person in ten minutes, and each is logged.
- The server's Drive permission is limited to files it created. It shares each evidence file with school accounts by
  link; it never shares a folder.
- Only admins assign responsible people, only within their own stages, and only to active staff of that stage.
  Staff see the responsible person's name, never a colleague's address.
- Private tasks and timetables are read and changed only by their owner. They sit in the `Tasks` and `Sessions` tabs
  of the control file, so whoever can open the control file itself (the technical owner) could read them there.
- Every write, review, sign-in, refused sign-in, settings change and notification run is recorded in the `Audit` tab.
- The WhatsApp access token is entered in the control file only and is never sent to the website.
- Hidden tabs of the main file (student register, HR, finance) are never read.

## If the Google Cloud step is not allowed on school accounts

Skip parts B and C. In step 5 choose "Anyone within" your school domain, and give staff the `/exec` link itself.
The same interface opens inside Google, signed in by the school account, without a separate website or install.

## Tests

`main.json` is a JSON export of the visible tabs of the main file. It holds school data, so it is not kept here.

```bash
AP_FIXTURE=/path/to/main.json node test/parser.test.js
```

```bash
AP_FIXTURE=/path/to/main.json node test/server.test.js
```

The browser and website tests read small Excel and CSV files kept in `test/fixtures/`.

The schedule builder's engine has its own test and needs no file:

```bash
node test/solver.test.js
```

```bash
node test/site.test.js
```

The browser test of every screen runs against a preview page built with sample data:

```bash
AP_FIXTURE=/path/to/main.json AP_PREVIEW_OUT=/path/to/preview.html node build.js
```

```bash
node test/ui.test.js /path/to/preview.html /path/to/screenshots
```
