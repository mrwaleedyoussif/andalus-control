(function () {
  'use strict';
  /* ---------- text ---------- */
  var TX = {
    ar: {
      title: 'مسار الإنجاز', sub: 'مدارس الأندلس بالطائف', loading: 'جارٍ التحميل…', hello: 'مرحباً',
      home: 'الرئيسية', programs: 'البرامج', review: 'المراجعة', mine: 'عملي', checks: 'فحص البيانات', admin: 'الإدارة', more: 'المزيد',
      allStages: 'كل المراحل', total: 'برامج الخطة', done: 'مكتمل', overdue: 'متأخر', soon: 'يبدأ قريباً', active: 'جارٍ', activeSub: 'بدأ ولم ينتهِ موعده', monitor: 'مؤشر التقدم', monLead: 'كل حلقة حالة، وطول القوس نصيبها من الإجمالي. مرّر على حلقة أو اضغطها.', monIndicators: 'المؤشرات', indTotal: 'مؤشرات الخطة', programsWord: 'برنامجاً', ofIndicators: 'من المؤشرات', indActiveSub: 'بدأ العمل فيه ولا تأخر', indSoonSub: 'أول برامجه خلال 7 أيام', indLateSub: 'فيه برنامج متأخر على الأقل', rampProg: 'درجة الأزرق تدل على ما مضى من مدة البرنامج', rampInd: 'درجة الأزرق تدل على ما اكتمل من برامج المؤشر', outside: 'خارج الحلقات', ofN: 'من', onlyState: 'المعروض:', progressCol: 'التقدم', upcoming: 'قادم', undated: 'بلا تاريخ',
      pendingReview: 'بانتظار المراجعة', ofPlan: 'من الخطة', needAction: 'تجاوز موعده ولم يُعلَّم مكتملاً', startsSoon: 'يبدأ خلال 7 أيام', reportsWaiting: 'تقارير رفعها المنسوبون',
      myTasks: 'مهامي', myTasksLead: 'برامج مسندة إليك تحتاج تقريراً', myCount: 'برامجي', myLate: 'متأخر عندي', myWaiting: 'تقاريري بانتظار المراجعة', allMine: 'كل برامجي', reportNow: 'تقرير',
      byIndicator: 'التقدم حسب المؤشر', byIndicatorLead: 'اضغط على مؤشر لعرض برامجه', owner: 'المسؤول', attention: 'يحتاج تدخلاً الآن', attentionLead: 'أقدم البرامج المتأخرة', showAll: 'عرض الكل', timetable: 'الجدول المدرسي', ttLinkLead: 'هذا جدولك الخاص. حصصك التي أدخلتها الإدارة تجدها في الجدول المدرسي.', ttLead: 'جدول حصص المدرسة من الأحد إلى الخميس، ثماني حصص في اليوم. يدخله مديرو النظام ويضبطون أوقات الحصص، ويراه الجميع حسب الصف أو حسب المعلم.', ttPeriod: 'الحصة', ttTimes: 'أوقات الحصص', ttTimesLead: 'حدّد بداية كل حصة ونهايتها. الحصص محفوظة برقمها، فيتغيّر الجدول كله عند تغيير الوقت.', ttTimesAll: 'طبّق الأوقات نفسها على كل المراحل المعروضة', ttTimesSaved: 'حُفظت أوقات الحصص.', ttByClass: 'حسب الصف', ttByTeacher: 'حسب المعلم', ttMine: 'حصصي', ttAdd: 'حصة جديدة', ttImport: 'لصق جدول', ttImportGo: 'استيراد', ttClear: 'مسح جدول الصف', ttClearSure: 'تأكيد المسح', ttCleared: 'حُذفت حصص الصف:', ttTeacherL: 'المعلم', ttOther: '— اسم آخر أو بلا معلم —', ttOtherName: 'اسم المعلم (اختياري)', ttNow: 'الآن', ttSessionsWord: 'حصة', ttEmpty: 'لم يُدخل جدول الحصص بعد.', ttEmptyLead: 'لم يُدخل جدول الحصص بعد. أضف حصة، أو الصق الجدول كاملاً من Excel.', ttPasteL: 'الجدول الملصق', ttPasteHelp: 'انسخ الصفوف من Excel أو Google Sheets والصقها هنا. الأعمدة بالترتيب: الصف، اليوم، رقم الحصة، المادة، المعلم، القاعة. الأيام من الأحد إلى الخميس، والحصص من 1 إلى 8. المعلم والقاعة اختياريان.', ttPasteExample: '5A\tالأحد\t1\tEnglish\tاسم المعلم\tR12', ttImportBad: 'لم يُستورد شيء. صفوف تحتاج تصحيحاً:', ttLine: 'السطر', ttImported: 'استُوردت الحصص:', ttClashing: 'حصص متعارضة:', execClosedMsg: 'أغلق الفرع الرئيسي بيانات التنفيذ لهذا البرنامج في المنصة الشاملة، فلا تُعدَّل من هنا.', planLockedMain: 'أغلق الفرع الرئيسي تخطيط هذا البرنامج في المنصة الشاملة، فلا يُحذف من هنا.', tagApproved: 'معتمد من الفرع الرئيسي', tagPlanClosed: 'التخطيط مغلق', tagExecClosed: 'التنفيذ مغلق', planStripLead: 'حسب صلاحيات الفرع الرئيسي عند آخر مزامنة:', plan_open: 'التخطيط مفتوح', plan_closed: 'التخطيط مغلق من الفرع الرئيسي', plan_full: 'لا صفوف فارغة', freeRowsWord: 'صفوف فارغة', planAdd: 'إضافة برنامج', planPropose: 'اقتراح برنامج', planLead: 'يُضاف البرنامج إلى خطة المؤشر في المنصة الشاملة، في صف فارغ أعدّه الفرع الرئيسي، وما دام الفرع الرئيسي لم يغلق التخطيط.', planTable: 'الجدول', planTableN: 'جدول', planOpen: 'التخطيط مفتوح. الصفوف الفارغة:', planDirect: 'يُكتب في المنصة الشاملة فوراً.', planViaAdmin: 'يُرسل طلبك لمديري النظام للموافقة.', planAddNow: 'إضافة إلى الخطة', planAddAsk: 'إرسال الطلب', planSent: 'أُرسل الطلب للمراجعة.', planAddTag: 'طلب إضافة', planRemoveTag: 'طلب حذف', planRemoveTitle: 'حذف البرنامج من الخطة', planRemoveLead: 'تُفرَّغ خانات التخطيط في صف البرنامج بالمنصة الشاملة، ويعود الصف فارغاً.', planRemoveLeadT: 'يُرسل طلب الحذف لمديري النظام، ولا يُحذف شيء قبل موافقتهم.', planRemoveNow: 'حذف من الخطة', planRemoveAsk: 'طلب الحذف', planSure: 'تأكيد الحذف', planWhy: 'السبب (اختياري)', planApproved: 'اعتمد الفرع الرئيسي هذا البرنامج في المنصة الشاملة، فلا يُحذف من هنا.', planHasData: 'للبرنامج بيانات تنفيذ مسجلة، فلا يُحذف.', planWaiting: 'يوجد طلب حذف لهذا البرنامج بانتظار المراجعة.', planEditL: 'السماح للمعلمين بطلب إضافة البرامج وحذفها', planEditHint: 'طلبات المعلمين تنتظر موافقة مديري النظام، ولا يُكتب شيء إلا ما دام الفرع الرئيسي لم يعتمد البرنامج أو يغلق التخطيط في المنصة الشاملة.', weekly: 'التقرير الأسبوعي', print: 'طباعة أو حفظ PDF', weeklyMail: 'أرسله إلى بريدي', weeklySent: 'أُرسل التقرير إلى بريدك.', weeklyState: 'الحالة العامة', sinceLast: 'التغيّر منذ', noPrev: 'لا يوجد أسبوع سابق للمقارنة بعد.', change: 'التغيّر', programsCol: 'البرامج', weeklyLate: 'أقدم البرامج المتأخرة', weeklyAhead: 'يبدأ هذا الأسبوع', endDate: 'تاريخ الانتهاء', startDate: 'تاريخ البداية', daysLate: 'أيام التأخر', responsibleShort: 'المسؤول', showing: 'المعروض', weeklyOn: 'إرسال التقرير الأسبوعي إلى مديري النظام بالبريد', weeklyDayL: 'يوم الإرسال', weeklyDayHint: 'يُرسل في وقت التنبيهات اليومية.', responsible: 'المسؤول في المنصة', inFile: 'المكلف في المنصة الشاملة', chosenBy: 'اختارته الإدارة في المنصة', fromFile: 'حسب الاسم المكتوب في المنصة الشاملة', nobodyHere: 'لا أحد يتابع هذا البرنامج في المنصة، فلا يصل تنبيهه لأحد.', pickPerson: '— اختر شخصاً —', assignTo: 'أسنده إلى', assignSave: 'إسناد', assignRemove: 'إلغاء الإسناد', assigned1: 'أُسند البرنامج.', unassigned1: 'أُلغي الإسناد.', assignList: 'إسناد القائمة', assignTitle: 'إسناد البرامج إلى مسؤول', assignLead: 'يُحفظ الإسناد في هذه المنصة فقط، ولا يُكتب شيء في المنصة الشاملة. تصل المسؤولَ تنبيهاتُ برامجه وتظهر في مهامه.', assignOnlyFree: 'فقط البرامج التي لا مسؤول لها في المنصة', assignedN: 'تم إسناد البرامج:', assignStageHint: 'القائمة تضم أكثر من مرحلة، فيظهر فقط من له صلاحية عليها كلها. اختر مرحلة من أعلى الصفحة لترى منسوبيها.', freeLead: 'برنامجاً لا يتابعها أحد في المنصة، فلا تصل تنبيهاتها لأحد.', freeOpen: 'اعرضها وأسندها', col_done: 'حالة الإتمام', col_actual: 'العدد الفعلي', col_evidence: 'الشاهد', lacksCols: 'جدول هذا المؤشر في المنصة الشاملة لا يحتوي عمود:', noCols: 'جدول هذا المؤشر في المنصة الشاملة لا يحتوي أعمدة تنفيذ يمكن تعديلها من هنا.',
      nothingLate: 'لا توجد برامج متأخرة.', byStage: 'حسب المرحلة', stage: 'المرحلة', indicator: 'المؤشر', status: 'الحالة', term: 'الفصل', search: 'بحث', searchPh: 'ابحث عن برنامج أو مسؤول',
      all: 'الكل', term1: 'الفصل الأول', term2: 'الفصل الثاني', mineOnly: 'برامجي فقط', hasPending: 'له تقرير ينتظر', program: 'البرنامج', when: 'الموعد', assignee: 'المكلف',
      actual: 'الفعلي', target: 'المستهدف', results: 'نتيجة', more2: 'عرض المزيد', none: 'لا توجد نتائج مطابقة.', copy: 'نسخ القائمة', copied: 'نُسخت القائمة. الصقها في Excel.',
      week: 'الأسبوع', noDate: 'بلا تاريخ', plan: 'الخطة', execution: 'بيانات التنفيذ', details: 'التفاصيل', item: 'البند', method: 'الوسيلة', place: 'المكان', budget: 'الميزانية', count: 'العدد المستهدف',
      source: 'الموضع في المنصة الشاملة', rowWord: 'صف', approvedPlan: 'اعتماد الخطة', yes: 'نعم', no: 'لا', techNotes: 'ملاحظات الجهة الفنية', evidence: 'الشاهد', open: 'فتح الرابط', comment: 'تعليق مدير المرحلة',
      doneQ: 'حالة الإتمام', notDone: 'لم يُعلَّم مكتملاً', report: 'رفع تقرير', reportLead: 'يصل تقريرك إلى قيادة المرحلة للمراجعة قبل تسجيله في المنصة الشاملة.',
      outcome: 'ما الذي تم؟', oDone: 'نُفّذ كاملاً', oPartial: 'نُفّذ جزئياً', oPostponed: 'تأجّل', execDate: 'تاريخ التنفيذ', actualN: 'العدد الفعلي', evidenceUrl: 'رابط الشاهد', evidenceHint: 'ارفع صورة أو PDF، أو الصق رابطاً يبدأ بـ https://', uploadBtn: 'رفع صورة أو PDF', uploading: 'جارٍ رفع الشاهد…', uploaded: 'تم رفع الشاهد:', uploadBad: 'اختر صورة، أو ملف PDF أصغر من 5 ميجابايت.',
      note: 'ملاحظات', send: 'إرسال للمراجعة', sent: 'أُرسل التقرير للمراجعة.', edit: 'تعديل التنفيذ', editLead: 'يُكتب التعديل مباشرة في صف البرنامج بالمنصة الشاملة ويُسجَّل باسمك.',
      markDone: 'البرنامج مكتمل', save: 'حفظ في المنصة الشاملة', saved: 'حُفظ في المنصة الشاملة.', wbOff: 'الكتابة في المنصة الشاملة متوقفة. يفعّلها مالك النظام من الإعدادات.',
      history: 'التقارير المرفوعة', by: 'بواسطة', pending: 'بانتظار المراجعة', approved: 'معتمد', returned: 'مُعاد', approve: 'اعتماد', ret: 'إعادة', reviewNote: 'ملاحظة للمرسل', decided: 'تم البت',
      queueEmpty: 'لا توجد تقارير هنا.', approvedOk: 'اعتُمد التقرير.', returnedOk: 'أُعيد التقرير إلى مرسله.', writeback: 'المنصة الشاملة', reviewLead: 'اعتماد تقرير «نُفّذ كاملاً» يكتب حالة الإتمام والعدد الفعلي والشاهد في صف البرنامج.',
      myReports: 'تقاريري', myPrograms: 'البرامج المسندة إليّ', addWork: 'إضافة عمل على مؤشر', addWorkLead: 'لعمل غير مدرج في الخطة، مثل مركز تنافسي أو مبادرة. يُحفظ في ملف التحكم بعد اعتماده.',
      workTitle: 'عنوان العمل', noReports: 'لم ترفع أي تقرير بعد.', noMine: 'لا توجد برامج مسندة إليك بالاسم. يمكنك رفع تقرير على أي برنامج من صفحة البرامج.',
      checksLead: 'ملاحظات على بيانات الخطة كما هي في المنصة الشاملة. اضغط على أي بند لعرض برامجه.',
      c_undated: 'بلا تاريخ ولا أسبوع', c_textdate: 'تاريخ مكتوب كنص', c_noowner: 'بلا مسؤول في المنصة', c_group: 'المسؤول مجموعة وليس شخصاً', c_early: 'معلَّم مكتملاً قبل موعده', c_noactual: 'مكتمل بلا عدد فعلي',
      c_noevidence: 'مكتمل بلا شاهد', c_late30: 'متأخر أكثر من 30 يوماً', c_unapproved: 'خطة لم تعتمدها الجهة الفنية',
      users: 'المستخدمون', settings: 'الإعدادات', log: 'سجل النشاط', email: 'البريد', name: 'الاسم', role: 'الدور', stages: 'المراحل', userActive: 'فعّال', aliases: 'الاسم كما يرد في المنصة الشاملة',
      aliasesHint: 'افصل بين الأسماء بفاصلة. تُستخدم لإظهار «البرامج المسندة إليّ».', addUser: 'إضافة مستخدم', saveUser: 'حفظ المستخدم', userSaved: 'حُفظ المستخدم.', stopped: 'موقوف',
      mainFile: 'رابط ملف المنصة الشاملة', mainFileHint: 'الصق رابط Google Sheets للملف الرئيسي. يُحفظ المعرّف فقط.', connected: 'الملف مربوط', notConnected: 'لم يُربط ملف بعد',
      t1: 'بداية الفصل الأول', t2: 'بداية الفصل الثاني', scope: 'المراحل التي تغطيها المنصة', wb: 'السماح بالكتابة في المنصة الشاملة (بيانات التنفيذ فقط)', syncEvery: 'المزامنة كل', hours: 'ساعات',
      saveSettings: 'حفظ الإعدادات', settingsSaved: 'حُفظت الإعدادات.', time: 'الوقت', action: 'الإجراء', targetCol: 'الهدف', lastSync: 'آخر مزامنة', never: 'لم تتم', syncNow: 'مزامنة', syncing: 'جارٍ المزامنة…', synced: 'تمت المزامنة.',
      r_owner: 'مالك النظام', r_principal: 'مدير المدرسة', r_avp: 'وكيل الشؤون التعليمية', r_vp: 'وكيل المدرسة', r_teacher: 'معلم',
      setupNeeded: 'لم يُربط ملف المنصة الشاملة بعد. يضيف مالك النظام الرابط من الإدارة ثم الإعدادات.', denied: 'لا يمكن فتح المنصة', close: 'إغلاق', cancel: 'إلغاء', lang: 'English', theme: 'المظهر',
      signIn: 'تسجيل الدخول', signInLead: 'ادخل بحساب Google الخاص بالمدرسة. لا توجد كلمات مرور.', signOut: 'خروج', signedOut: 'انتهت الجلسة. سجّل الدخول من جديد.', sar: 'ر.س', days: 'يوم',
      alerts: 'التنبيهات', school: 'المدرسة', allSchools: 'كل المدارس', sPrivate: 'مدارس الأندلس الأهلية', sIntl: 'مدارس الأندلس العالمية', sPrivateSub: 'Alandalus Private Schools', sIntlSub: 'Andalus International Schools',
      coverLead: 'متابعة برامج المؤشرات في المنصة الشاملة: الخطة والتنفيذ والمراجعة والتنبيهات في مكان واحد.', schoolsTitle: 'مدارس الأندلس',
      chooseSchool: 'اختر المدرسة', chooseLead: 'اختر المدرسة التي تريد متابعتها. يمكنك التبديل في أي وقت من أعلى الصفحة.', enter: 'دخول', changeSchool: 'تغيير المدرسة', stagesN: 'مراحل',
      alertsLead: 'رسالة واحدة لكل شخص في اليوم تجمع كل ما يخصه.', alertsRules: 'المنفّذ ومسؤول المؤشر: قبل البداية بـ3 أيام، وقبلها بـ24 ساعة، ويوم البداية، وقبل النهاية بـ24 ساعة. مديرو النظام: الثلاثة الأخيرة.',
      sendAt: 'وقت الإرسال اليومي', waAuto: 'واتساب: الإرسال التلقائي مفعّل.', waManual: 'واتساب: الإرسال التلقائي غير مربوط. استخدم زر واتساب لإرسال الرسالة الجاهزة بضغطة.', notifyOff: 'التنبيهات متوقفة من الإعدادات.',
      testMe: 'أرسل لي رسالة تجربة', testSent: 'أُرسلت الرسالة إلى بريدك.', noAlerts: 'لا توجد تنبيهات اليوم.', sendWa: 'واتساب', recipients: 'مستلماً اليوم',
      k_d3: 'يبدأ بعد 3 أيام', k_d1: 'يبدأ غداً', k_d0: 'يبدأ اليوم', k_e1: 'ينتهي غداً', k_o1: 'انتهى أمس ولم يكتمل', k_o7: 'متأخر منذ أسبوع', role_exec: 'منفّذ', role_owner: 'مسؤول المؤشر', role_admin: 'إدارة',
      ch_email: 'بريد', ch_whatsapp: 'واتساب', ch_both: 'بريد وواتساب', ch_off: 'بدون تنبيهات', phone: 'رقم الجوال (واتساب)', phoneHint: 'بالصيغة الدولية بالأرقام فقط، مثل 9665xxxxxxxx', channel: 'قناة التنبيه',
      notifyOn: 'تفعيل التنبيهات اليومية', notifyTime: 'وقت إرسال التنبيهات', notifyTimeHint: 'يُرسل Google خلال ربع ساعة من هذا الوقت.', siteUrl: 'عنوان الموقع (يُضاف إلى الرسائل)', st_sent: 'أُرسل', st_wait: 'لم يُرسل بعد',
      login: 'تسجيل الدخول', loginHint: 'بحسابك المدرسي', sloganDefault: 'منظومة تعليمية رائدة، تبني جيلاً يمتلك قدرات تعلم عالمية', welcomeDefault: 'أهلاً بك، كل إنجاز خطوة نحو القمة.',
      calendar: 'التقويم', people: 'حسب المعلم', mycal: 'تقويمي', back: 'رجوع', forward: 'تقدّم', undo: 'تراجع', redo: 'إعادة', undone: 'تم التراجع', redone: 'تمت الإعادة',
      profile: 'ملفي', photo: 'الصورة الشخصية', choosePhoto: 'اختيار صورة', removePhoto: 'حذف الصورة', photoSaved: 'حُفظت الصورة.', photoRemoved: 'حُذفت الصورة.', photoBad: 'اختر ملف صورة بحجم أقل من 8 ميجابايت.',
      peopleLead: 'برامج كل شخص: ما أسندته الإدارة إليه في المنصة، أو ما يرد باسمه في المنصة الشاملة. اضغط على اسم لعرض برامجه.', assigned: 'مسند إليه', reportsCol: 'تقاريره', person: 'الشخص',
      unlinked: 'أسماء غير مربوطة بحساب', unlinkedLead: 'مكلفون وردت أسماؤهم في المنصة الشاملة ولا يطابقون أي مستخدم. أضف الاسم في خانة «الاسم كما يرد» للمستخدم المناسب.',
      calLead: 'برامج المؤشرات حسب تاريخ بدايتها. اضغط على يوم لعرض برامجه.', todayBtn: 'اليوم', startsOn: 'يبدأ', endsOn: 'ينتهي', running: 'جارٍ', noneDay: 'لا شيء في هذا اليوم.',
      tasks: 'مهامي', sessions: 'جدول حصصي', addTask: 'مهمة جديدة', addSession: 'حصة جديدة', taskTitle: 'المهمة', repeat: 'التكرار', rNone: 'مرة واحدة', rDaily: 'يومياً (أيام الدراسة)', rWeekly: 'أسبوعياً',
      timeL: 'الوقت', until: 'حتى تاريخ (اختياري)', notifyMe: 'نبّهني بها في رسالة اليوم', del: 'حذف', saveL: 'حفظ', savedL: 'تم الحفظ.', deleted: 'تم الحذف.',
      tasksLead: 'مهامك الخاصة. لا يراها غيرك، وتصلك ضمن رسالة التنبيهات اليومية.', sessionsLead: 'جدولك الأسبوعي الخاص. لا يراه غيرك.', dayL: 'اليوم', fromT: 'من', toT: 'إلى', subject: 'المادة', klass: 'الصف / الشعبة', room: 'القاعة',
      noTasks: 'لا مهام في هذا اليوم.', noSessions: 'لم تُضف حصصاً بعد.', startPage: 'صفحة البداية', sloganL: 'شعار المدرسة', welcomeL: 'رسالة الترحيب', taskDone: 'أُنجزت'
    },
    en: {
      title: 'Pathway to Achievement', sub: 'Andalus Schools · Taif', loading: 'Loading…', hello: 'Welcome',
      home: 'Home', programs: 'Programmes', review: 'Review', mine: 'My work', checks: 'Data checks', admin: 'Admin', more: 'More',
      allStages: 'All stages', total: 'Planned programmes', done: 'Done', overdue: 'Overdue', soon: 'Starting soon', active: 'In progress', activeSub: 'Started, end date not passed', monitor: 'Progress monitor', monLead: 'Each ring is one state; the arc is its share of the total. Point at a ring or select it.', monIndicators: 'Indicators', indTotal: 'Indicators in the plan', programsWord: 'programmes', ofIndicators: 'of the indicators', indActiveSub: 'Under way, nothing late', indSoonSub: 'First programme within 7 days', indLateSub: 'Has at least one late programme', rampProg: "the shade of blue shows how much of the programme's dates have passed", rampInd: "the shade of blue shows how many of the indicator's programmes are done", outside: 'Not in the rings', ofN: 'of', onlyState: 'Showing:', progressCol: 'Progress', upcoming: 'Upcoming', undated: 'No date',
      pendingReview: 'Awaiting review', ofPlan: 'of the plan', needAction: 'Past their date and not marked done', startsSoon: 'Starts within 7 days', reportsWaiting: 'Reports sent by staff',
      myTasks: 'My tasks', myTasksLead: 'Programmes assigned to you that need a report', myCount: 'My programmes', myLate: 'My overdue', myWaiting: 'My reports awaiting review', allMine: 'All my programmes', reportNow: 'Report',
      byIndicator: 'Progress by indicator', byIndicatorLead: 'Select an indicator to see its programmes', owner: 'Owner', attention: 'Needs attention now', attentionLead: 'Longest overdue programmes', showAll: 'Show all', timetable: 'School timetable', ttLinkLead: 'This is your private timetable. The sessions the admins entered for you are in the school timetable.', ttLead: "The school's sessions schedule, Sunday to Thursday, eight sessions a day. The system admins enter it and set the session times; everyone sees it by class or by teacher.", ttPeriod: 'Session', ttTimes: 'Session times', ttTimesLead: 'Set when each session starts and ends. Sessions are kept by number, so the whole schedule follows a change of time.', ttTimesAll: 'Apply the same times to every stage shown', ttTimesSaved: 'Session times saved.', ttByClass: 'By class', ttByTeacher: 'By teacher', ttMine: 'My sessions', ttAdd: 'New session', ttImport: 'Paste a schedule', ttImportGo: 'Import', ttClear: "Clear this class's schedule", ttClearSure: 'Confirm clearing', ttCleared: 'Sessions removed:', ttTeacherL: 'Teacher', ttOther: '— Another name, or no teacher —', ttOtherName: "Teacher's name (optional)", ttNow: 'Now', ttSessionsWord: 'sessions', ttEmpty: 'The sessions schedule has not been entered yet.', ttEmptyLead: 'The sessions schedule has not been entered yet. Add a session, or paste the whole schedule from Excel.', ttPasteL: 'Pasted schedule', ttPasteHelp: 'Copy the rows from Excel or Google Sheets and paste them here. Columns in order: class, day, session number, subject, teacher, room. Days run Sunday to Thursday and sessions 1 to 8. Teacher and room are optional.', ttPasteExample: '5A\tSunday\t1\tEnglish\tTeacher name\tR12', ttImportBad: 'Nothing was imported. Rows that need fixing:', ttLine: 'Line', ttImported: 'Sessions imported:', ttClashing: 'clashing sessions:', execClosedMsg: "The main branch has closed this programme's execution data in the main file, so it cannot be edited from here.", planLockedMain: "The main branch has closed this programme's plan in the main file, so it cannot be removed from here.", tagApproved: 'Approved by the main branch', tagPlanClosed: 'Plan closed', tagExecClosed: 'Execution closed', planStripLead: "By the main branch's permissions at the last sync:", plan_open: 'Planning open', plan_closed: 'Planning closed by the main branch', plan_full: 'No free rows', freeRowsWord: 'free rows', planAdd: 'Add a programme', planPropose: 'Propose a programme', planLead: "The programme is added to the indicator's plan in the main file, in a free row the main branch prepared, for as long as the main branch has not closed planning.", planTable: 'Table', planTableN: 'Table', planOpen: 'Planning is open. Free rows:', planDirect: 'It is written to the main file at once.', planViaAdmin: 'Your request goes to the system admins for approval.', planAddNow: 'Add to the plan', planAddAsk: 'Send the request', planSent: 'The request was sent for review.', planAddTag: 'Request to add', planRemoveTag: 'Request to remove', planRemoveTitle: 'Remove the programme from the plan', planRemoveLead: "The plan cells of the programme's row in the main file are emptied, and the row becomes free again.", planRemoveLeadT: 'The request goes to the system admins. Nothing is removed before they approve.', planRemoveNow: 'Remove from the plan', planRemoveAsk: 'Ask to remove', planSure: 'Confirm removal', planWhy: 'Reason (optional)', planApproved: 'The main branch has approved this programme in the main file, so it cannot be removed from here.', planHasData: 'The programme has execution data recorded, so it cannot be removed.', planWaiting: 'A request to remove this programme is waiting for review.', planEditL: 'Let teachers request adding and removing programmes', planEditHint: "Teachers' requests wait for a system admin's approval, and nothing is written unless the main branch has neither approved the programme nor closed planning in the main file.", weekly: 'Weekly report', print: 'Print or save as PDF', weeklyMail: 'Email it to me', weeklySent: 'The report was sent to your email.', weeklyState: 'Overall state', sinceLast: 'Change since', noPrev: 'No earlier week to compare with yet.', change: 'Change', programsCol: 'Programmes', weeklyLate: 'Longest overdue programmes', weeklyAhead: 'Starting this week', endDate: 'End date', startDate: 'Start date', daysLate: 'Days late', responsibleShort: 'Responsible', showing: 'Showing', weeklyOn: 'Email the weekly report to the system admins', weeklyDayL: 'Day', weeklyDayHint: 'Sent at the daily notification time.', responsible: 'Responsible in the platform', inFile: 'Assigned in the main file', chosenBy: 'chosen by an admin in the platform', fromFile: 'from the name written in the main file', nobodyHere: 'Nobody follows this programme in the platform, so its reminders reach no one.', pickPerson: '— Choose a person —', assignTo: 'Assign to', assignSave: 'Assign', assignRemove: 'Remove', assigned1: 'Programme assigned.', unassigned1: 'Assignment removed.', assignList: 'Assign this list', assignTitle: 'Assign programmes to a person', assignLead: 'The choice is kept in this platform only; nothing is written to the main file. The person gets the reminders for these programmes and sees them under their tasks.', assignOnlyFree: 'Only programmes with no one responsible in the platform', assignedN: 'Programmes assigned:', assignStageHint: 'The list covers more than one stage, so only people with access to all of them are shown. Pick a stage at the top of the page to see its staff.', freeLead: 'programmes have no one responsible in the platform, so their reminders reach no one.', freeOpen: 'Show and assign', col_done: 'completion', col_actual: 'actual number', col_evidence: 'evidence', lacksCols: "This indicator's table in the main file has no column for:", noCols: "This indicator's table in the main file has no execution columns that can be edited from here.",
      nothingLate: 'No overdue programmes.', byStage: 'By stage', stage: 'Stage', indicator: 'Indicator', status: 'Status', term: 'Term', search: 'Search', searchPh: 'Search a programme or person',
      all: 'All', term1: 'Term 1', term2: 'Term 2', mineOnly: 'My programmes only', hasPending: 'Report waiting', program: 'Programme', when: 'When', assignee: 'Assigned to',
      actual: 'Actual', target: 'Target', results: 'results', more2: 'Show more', none: 'Nothing matches.', copy: 'Copy list', copied: 'List copied. Paste it into Excel.',
      week: 'Week', noDate: 'No date', plan: 'Plan', execution: 'Execution data', details: 'Details', item: 'Item', method: 'Method', place: 'Place', budget: 'Budget', count: 'Target number',
      source: 'Location in the main file', rowWord: 'row', approvedPlan: 'Plan approved', yes: 'Yes', no: 'No', techNotes: 'Technical reviewer notes', evidence: 'Evidence', open: 'Open link', comment: "Stage principal's comment",
      doneQ: 'Completion', notDone: 'Not marked done', report: 'Report', reportLead: 'Your report goes to the stage leaders for review before it is recorded in the main file.',
      outcome: 'What happened?', oDone: 'Done in full', oPartial: 'Partly done', oPostponed: 'Postponed', execDate: 'Date carried out', actualN: 'Actual number', evidenceUrl: 'Evidence link', evidenceHint: 'Upload a photo or PDF, or paste a link that starts with https://', uploadBtn: 'Upload a photo or PDF', uploading: 'Uploading the evidence…', uploaded: 'Evidence uploaded:', uploadBad: 'Choose a photo, or a PDF smaller than 5 MB.',
      note: 'Notes', send: 'Send for review', sent: 'Report sent for review.', edit: 'Edit execution', editLead: "The change is written straight into the programme's row in the main file and logged under your name.",
      markDone: 'Programme is done', save: 'Save to the main file', saved: 'Saved to the main file.', wbOff: 'Writing to the main file is switched off. The system owner turns it on in Settings.',
      history: 'Reports received', by: 'By', pending: 'Awaiting review', approved: 'Approved', returned: 'Returned', approve: 'Approve', ret: 'Return', reviewNote: 'Note to the sender', decided: 'Decided',
      queueEmpty: 'No reports here.', approvedOk: 'Report approved.', returnedOk: 'Report returned to its sender.', writeback: 'Main file', reviewLead: 'Approving a "done in full" report writes completion, the actual number and the evidence link into the programme row.',
      myReports: 'My reports', myPrograms: 'Programmes assigned to me', addWork: 'Add work on an indicator', addWorkLead: 'For work that is not in the plan, such as a competition placement or an initiative. Kept in the control file once approved.',
      workTitle: 'Title of the work', noReports: 'You have not sent any report yet.', noMine: 'No programme names you. You can report on any programme from the Programmes page.',
      checksLead: 'Observations on the plan data as it stands in the main file. Select one to see its programmes.',
      c_undated: 'No date and no week', c_textdate: 'Date typed as text', c_noowner: 'No one responsible in the platform', c_group: 'Assigned to a group, not a person', c_early: 'Marked done before its date', c_noactual: 'Done with no actual number',
      c_noevidence: 'Done with no evidence', c_late30: 'More than 30 days overdue', c_unapproved: 'Plan not approved by the technical reviewer',
      users: 'Users', settings: 'Settings', log: 'Activity log', email: 'Email', name: 'Name', role: 'Role', stages: 'Stages', userActive: 'Active', aliases: 'Name as written in the main file',
      aliasesHint: 'Separate names with a comma. Used for "Programmes assigned to me".', addUser: 'Add user', saveUser: 'Save user', userSaved: 'User saved.', stopped: 'Suspended',
      mainFile: 'Link to the main file', mainFileHint: 'Paste the Google Sheets link of the main file. Only its ID is stored.', connected: 'File connected', notConnected: 'No file connected yet',
      t1: 'Term 1 starts', t2: 'Term 2 starts', scope: 'Stages the platform covers', wb: 'Allow writing to the main file (execution data only)', syncEvery: 'Sync every', hours: 'hours',
      saveSettings: 'Save settings', settingsSaved: 'Settings saved.', time: 'Time', action: 'Action', targetCol: 'Target', lastSync: 'Last sync', never: 'never', syncNow: 'Sync', syncing: 'Syncing…', synced: 'Sync complete.',
      r_owner: 'System owner', r_principal: 'Principal', r_avp: 'Academic Vice Principal', r_vp: 'Vice Principal', r_teacher: 'Teacher',
      setupNeeded: 'The main file is not connected yet. The system owner adds its link under Admin, then Settings.', denied: 'The platform cannot be opened', close: 'Close', cancel: 'Cancel', lang: 'العربية', theme: 'Theme',
      signIn: 'Sign in', signInLead: 'Use your school Google account. There are no passwords.', signOut: 'Sign out', signedOut: 'Your session ended. Sign in again.', sar: 'SAR', days: 'd',
      alerts: 'Notifications', school: 'School', allSchools: 'All schools', sPrivate: 'Alandalus Private Schools', sIntl: 'Andalus International Schools',
      coverLead: 'Follow the indicator programmes of the comprehensive platform: plan, execution, review and notifications in one place.', schoolsTitle: 'Andalus Schools', sPrivateSub: 'مدارس الأندلس الأهلية', sIntlSub: 'مدارس الأندلس العالمية',
      chooseSchool: 'Choose a school', chooseLead: 'Choose the school you want to follow. You can switch at any time from the top of the page.', enter: 'Open', changeSchool: 'Change school', stagesN: 'stages',
      alertsLead: 'Each person gets one message a day that lists everything that concerns them.', alertsRules: 'Programme owner and indicator owner: 3 days before the start, 24 hours before it, on the start day, and 24 hours before the end. System admins: the last three.',
      sendAt: 'Daily sending time', waAuto: 'WhatsApp: automatic sending is on.', waManual: 'WhatsApp: automatic sending is not connected. Use the WhatsApp button to send the ready message with one tap.', notifyOff: 'Notifications are switched off in Settings.',
      testMe: 'Send me a test message', testSent: 'The message was sent to your email.', noAlerts: 'No notifications today.', sendWa: 'WhatsApp', recipients: 'recipients today',
      k_d3: 'Starts in 3 days', k_d1: 'Starts tomorrow', k_d0: 'Starts today', k_e1: 'Ends tomorrow', k_o1: 'Ended yesterday, not done', k_o7: 'A week overdue', role_exec: 'Carrying it out', role_owner: 'Indicator owner', role_admin: 'Admin',
      ch_email: 'Email', ch_whatsapp: 'WhatsApp', ch_both: 'Email and WhatsApp', ch_off: 'No notifications', phone: 'Mobile number (WhatsApp)', phoneHint: 'International format, digits only, like 9665xxxxxxxx', channel: 'Notification channel',
      notifyOn: 'Send daily notifications', notifyTime: 'Notification time', notifyTimeHint: 'Google sends within a quarter of an hour of this time.', siteUrl: 'Website address (added to messages)', st_sent: 'Sent', st_wait: 'Not sent yet',
      login: 'Sign in', loginHint: 'with your school account', sloganDefault: 'منظومة تعليمية رائدة، تبني جيلاً يمتلك قدرات تعلم عالمية', welcomeDefault: 'Welcome. Every achievement is a step towards the top.',
      calendar: 'Calendar', people: 'By teacher', mycal: 'My calendar', back: 'Back', forward: 'Forward', undo: 'Undo', redo: 'Redo', undone: 'Undone', redone: 'Redone',
      profile: 'My profile', photo: 'Profile picture', choosePhoto: 'Choose a picture', removePhoto: 'Remove picture', photoSaved: 'Picture saved.', photoRemoved: 'Picture removed.', photoBad: 'Choose an image file under 8 MB.',
      peopleLead: "Each person's programmes: those an admin assigned to them in the platform, or those the main file gives under their name. Select a name to see them.", assigned: 'Assigned', reportsCol: 'Reports', person: 'Person',
      unlinked: 'Names not linked to an account', unlinkedLead: 'People named in the main file who match no user. Add the name to the right user under "Name as written in the main file".',
      calLead: 'Indicator programmes by start date. Select a day to see its programmes.', todayBtn: 'Today', startsOn: 'Starts', endsOn: 'Ends', running: 'Running', noneDay: 'Nothing on this day.',
      tasks: 'My tasks', sessions: 'My sessions', addTask: 'New task', addSession: 'New session', taskTitle: 'Task', repeat: 'Repeat', rNone: 'Once', rDaily: 'Daily (school days)', rWeekly: 'Weekly',
      timeL: 'Time', until: 'Until (optional)', notifyMe: "Include it in the day's message", del: 'Delete', saveL: 'Save', savedL: 'Saved.', deleted: 'Deleted.',
      tasksLead: "Your own tasks. Nobody else sees them, and they arrive in your daily notification message.", sessionsLead: 'Your own weekly timetable. Nobody else sees it.', dayL: 'Day', fromT: 'From', toT: 'To', subject: 'Subject', klass: 'Class / section', room: 'Room',
      noTasks: 'No tasks on this day.', noSessions: 'No sessions added yet.', startPage: 'Start page', sloganL: 'School slogan', welcomeL: 'Welcome message', taskDone: 'Done'
    }
  };
  var STAGE_EN = { 'ابتدائي بنين أهلي': 'National primary boys', 'متوسط بنين أهلي': 'National intermediate boys', 'ثانوي بنين أهلي': 'National secondary boys', 'رياض الأطفال أهلي': 'National kindergarten',
    'ابتدائي بنات أهلي': 'National primary girls', 'متوسط بنات أهلي': 'National intermediate girls', 'ثانوي بنات أهلي': 'National secondary girls', 'ابتدائي بنين عالمي': 'International primary boys',
    'متوسط بنين عالمي': 'International intermediate boys', 'ثانوي بنين عالمي': 'International secondary boys', 'رياض الأطفال عالمي': 'International kindergarten', 'ابتدائي بنات عالمي': 'International primary girls',
    'متوسط بنات عالمي': 'International intermediate girls', 'ثانوي بنات عالمي': 'International secondary girls' };
  var ALL_STAGES = Object.keys(STAGE_EN);
  var KPI_EN = { 'A.Br 1.1': 'Student enrolment', 'A.Br 1.2': 'Net other revenue', 'B.Br 1.1': 'Customer satisfaction', 'B.Br 1.2': 'Communication quality', 'C.Br 1.9': 'National tests average',
    'C.Br 1.1': 'Standardized tests', 'C.Br 1.4': 'Quran mastery', 'C.Br 1.3': 'Competitive placements', 'C.Br 2.1': 'Teaching processes', 'C.Br 2.2': 'Student learning experience',
    'C.Br 4.1': 'Quran and Sunnah programmes', 'C.Br 4.2': 'Values and national identity', 'C.Br 3.2': 'Student quality of life', 'C.Br 3.3': 'Skills programmes', 'C.Br 3.4': 'Gifted care pathway',
    'D.Br 1.1': 'Professional growth', 'D.Br 1.2': 'Work environment', 'D.Br 1.3': 'Staff culture programmes', 'D.Br 1.4': 'Leadership qualification', 'D.Br 2.1': 'Technology use',
    'D.Br 3.1': 'School evaluation', 'D.Br 4.1': 'Safety and security' };
  var ST = ['done', 'active', 'soon', 'overdue', 'upcoming', 'undated'];
  var RINGS = ['done', 'active', 'soon', 'overdue'];   // the monitor's rings, outer to inner
  var LEAD = ['owner', 'principal', 'avp', 'vp'];
  var ICON = {
    home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10', programs: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', review: 'M4 13l2-8h12l2 8M4 13v6h16v-6M4 13h5l1 3h4l1-3h5',
    checks: 'M5 21V4M5 4h11l-2 4 2 4H5', mine: 'M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8', admin: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4',
    search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3', sync: 'M20 11a8 8 0 00-14.9-3M4 5v4h4M4 13a8 8 0 0014.9 3M20 19v-4h-4', lang: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',
    theme: 'M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z', out: 'M9 21H5V3h4M16 17l5-5-5-5M21 12H9', chev: 'M9 6l6 6-6 6', x: 'M6 6l12 12M18 6L6 18', more: 'M5 12h.01M12 12h.01M19 12h.01',
    alerts: 'M6 9a6 6 0 1112 0c0 6 3 7 3 7H3s3-1 3-7M10 20h4', weekly: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6', timetable: 'M4 5h16v14H4zM4 10h16M4 14.5h16M9.5 5v14M15 5v14', calendar: 'M4 5h16v15H4zM4 10h16M8 3v4M16 3v4', mycal: 'M4 5h16v15H4zM4 10h16M8 3v4M16 3v4M9 15l2 2 4-4',
    people: 'M16 20a6 6 0 00-12 0M10 10a4 4 0 100-8 4 4 0 000 8M22 20a5 5 0 00-6-4.9M15 3a4 4 0 010 7', back: 'M15 6l-6 6 6 6', fwd: 'M9 6l6 6-6 6',
    undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3', redo: 'M15 14l5-5-5-5M20 9H10a6 6 0 000 12h3', plus: 'M12 5v14M5 12h14', upload: 'M12 16V4M7 9l5-5 5 5M5 20h14', active: 'M12 21a9 9 0 100-18 9 9 0 000 18zM10 8.5l5.5 3.5-5.5 3.5z', done: 'M5 12l5 5 9-10', soon: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2', overdue: 'M12 3l10 18H2L12 3zM12 10v5M12 18h.01', total: 'M4 5h16v14H4zM4 10h16M9 5v14'
  };

  // other platforms, shown as buttons that open in a new tab
  var TXL = {
    ar: { linksTitle: 'منصات أخرى', linksHint: 'أزرار تفتح منصات أخرى في نافذة جديدة. حدّد لكل زر من يراه. لا تُقرأ من تلك المنصات أي بيانات.', linkName: 'اسم المنصة', linkUrl: 'الرابط', linkAdmins: 'مديرو النظام فقط', linkAll: 'الجميع',
      addLink: 'إضافة منصة', opensNew: 'تفتح في نافذة جديدة', linkWho: 'من يراه' },
    en: { linksTitle: 'Other platforms', linksHint: 'Buttons that open other platforms in a new tab. Choose who sees each one. No data is read from those platforms.', linkName: 'Platform name', linkUrl: 'Link', linkAdmins: 'System admins only', linkAll: 'Everyone',
      addLink: 'Add platform', opensNew: 'Opens in a new tab', linkWho: 'Who sees it' }
  };
  ['ar', 'en'].forEach(function (l) { for (var k in TXL[l]) TX[l][k] = TXL[l][k]; });
  ICON.ext = 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5';

  /* ---------- state ---------- */
  var CFG = window.AP_CONFIG || {};
  // The schools' own logos. The website loads them as files; the single-file builds carry them inline.
  var IMG = window.AP_ASSETS || { intl: 'img/logo-intl.webp', mark: 'img/mark-intl.webp', priv: 'img/logo-priv.webp' };
  var S = { lang: 'ar', view: 'home', me: null, settings: {}, today: '', programs: [], indicators: [], targets: [], submissions: [],
    f: { stage: '', kpi: '', status: '', term: '', q: '', mine: false, person: '' }, limit: 80, cal: { month: '', day: '' }, calTab: '', mycal: null, mon: 'programs', ipick: '', assign: {}, plan: {}, weekly: null, tt: null, ttMode: '', ttPick: '', adminTab: 'users', reviewTab: 'pending', users: null, audit: null, alerts: null, school: '', fileName: '', session: '' };
  function store(k, v) { try { if (v === null) localStorage.removeItem(k); else if (v !== undefined) localStorage.setItem(k, v); return localStorage.getItem(k); } catch (e) { return null; } }
  if (store('ap.lang') === 'en') S.lang = 'en';
  S.session = store('ap.session') || '';
  var isPreview = !!window.__MOCK__;
  if (!isPreview && store('ap.theme')) document.documentElement.setAttribute('data-theme', store('ap.theme'));
  function t(k) { return (TX[S.lang] && TX[S.lang][k]) || TX.ar[k] || k; }
  function $(id) { return document.getElementById(id); }
  function norm(s) { return String(s == null ? '' : s).replace(/[أإآ]/g, 'ا').replace(/ـ/g, '').replace(/[ً-ْ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); }

  /* ---------- DOM helpers: text only, never HTML built from data ---------- */
  function add(el, c) { if (c == null || c === false) return; if (Array.isArray(c)) c.forEach(function (x) { add(el, x); }); else el.appendChild(c.nodeType ? c : document.createTextNode(String(c))); }
  function h(tag, attrs) {
    var el = document.createElement(tag), k;
    if (attrs) for (k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v; else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'value') el.value = v; else if (k === 'checked') el.checked = !!v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  var NS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs) { var el = document.createElementNS(NS, tag); for (var k in attrs) el.setAttribute(k, attrs[k]); for (var i = 2; i < arguments.length; i++) el.appendChild(arguments[i]); return el; }
  function ic(name, cls) { return svg('svg', { class: 'ic' + (cls ? ' ' + cls : ''), viewBox: '0 0 24 24', 'aria-hidden': 'true' }, svg('path', { d: ICON[name] || ICON.more })); }
  /** The international school's shield on a white plate, so it reads on any background. */
  function plate() { return h('span', { class: 'plate' }, h('img', { src: IMG.mark, alt: '' })); }
  /** The tile star from the school shield, drawn large for the cover. */
  function tiles() {
    var g = svg('svg', { class: 'cv-tiles', viewBox: '0 0 200 200', 'aria-hidden': 'true' });
    [[50, 50, '#FFFFFF', '0.22'], [116, 50, '#F0B432', '1'], [50, 116, '#F0B432', '1'], [116, 116, '#FFFFFF', '0.22']].forEach(function (q) {
      g.appendChild(svg('rect', { x: q[0], y: q[1], width: 34, height: 34, fill: q[2], 'fill-opacity': q[3] }));
    });
    [[100, 38, '#E0637A'], [38, 100, '#2790C3'], [162, 100, '#2790C3'], [100, 162, '#E0637A']].forEach(function (d) {
      g.appendChild(svg('rect', { x: d[0] - 17, y: d[1] - 17, width: 34, height: 34, fill: d[2], transform: 'rotate(45 ' + d[0] + ' ' + d[1] + ')' }));
    });
    return g;
  }
  /** The open-book line from the schools' stationery. */
  function bookLine() {
    return svg('svg', { class: 'cv-line', viewBox: '0 0 400 44', 'aria-hidden': 'true' },
      svg('path', { d: 'M4 14H250C270 14 278 24 288 36C298 24 306 14 326 14H396', pathLength: '1', fill: 'none', stroke: '#F0B432', 'stroke-width': '7', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
  function toast(msg, bad) {
    var el = h('div', { class: 'toast' + (bad ? ' err' : ''), text: msg });
    $('toasts').appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, bad ? 6500 : 3500);
  }

  /* ---------- backend: Apps Script page, the website's API, or the preview stand-in ---------- */
  var gas = typeof google !== 'undefined' && google.script && google.script.run;
  function post(body) {
    return fetch(CFG.api, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (o) { if (o.ok) return o.data; throw new Error(o.code + '|' + o.message); });
  }
  function call(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (gas) return new Promise(function (res, rej) { var r = google.script.run.withSuccessHandler(res).withFailureHandler(rej); r[fn].apply(r, args); });
    if (window.__MOCK__) return window.__MOCK__(fn, args);
    if (CFG.api) return post({ fn: fn, args: args, session: S.session }).catch(function (e) { if (errCode(e) === 'AUTH') { signedOut(t('signedOut')); } throw e; });
    return Promise.reject(new Error('SETUP|لم تُضبط إعدادات الموقع بعد (config.js). The site is not configured yet.'));
  }
  function errText(e) { var m = String((e && e.message) || e); var i = m.indexOf('|'); return i > -1 ? m.slice(i + 1) : m; }
  function errCode(e) { var m = String((e && e.message) || e); var i = m.indexOf('|'); return i > -1 ? (m.slice(0, i).match(/[A-Z]+$/) || [''])[0] : ''; }

  /* ---------- derived ---------- */
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
  function addDays(d, n) { return RULES.addDays(d, n); }
  function daysBetween(a, b) { return RULES.daysBetween(a, b); }
  function statusOf(p) { return RULES.statusOf(p, S.today); }
  function progressOf(p) { return RULES.progressOf(p, S.today); }
  function grade(pct) { return RULES.grade(pct); }
  function indicatorState(list) { return RULES.indicatorState(list, S.today); }
  function isLead() { return S.me && LEAD.indexOf(S.me.role) !== -1; }
  /** A button to another platform. It opens in a new tab and tells that site nothing about this one. */
  function linkNode(l, cls) {
    if (!/^https:\/\//i.test(String(l.url))) return null;
    return h('a', { class: cls, href: l.url, target: '_blank', rel: 'noopener noreferrer', 'data-link': l.url, title: t('opensNew') }, ic('ext'), h('span', { text: l.name }));
  }
  function linkNodes(cls) { return (S.links || []).map(function (l) { return linkNode(l, cls); }).filter(Boolean); }
  /* who is responsible */
  /** The person an admin chose for this programme in the platform, if any: {name, me}, and for admins the email. */
  function chosen(p) { return S.assign[p.key] || null; }
  function whoText(p) { var a = chosen(p); return a ? a.name : (p.assignee || ''); }
  var UIX = { src: null, list: [] };
  function userIndex() {
    if (UIX.src !== S.users) {
      UIX.src = S.users;
      UIX.list = (S.users || []).filter(function (u) { return u.active; }).map(function (u) {
        return { u: u, names: (u.aliases || []).concat([u.name]).map(norm).filter(function (n) { return n.length > 3; }) };
      });
    }
    return UIX.list;
  }
  /** The users who answer for a programme: the admin's choice if there is one, otherwise whoever the main file names. Needs the staff list. */
  function owners(p) {
    var a = chosen(p);
    if (a) return (S.users || []).filter(function (u) { return u.email === a.email; });
    if (!p.assignee) return [];
    var na = norm(p.assignee);
    return userIndex().filter(function (x) { return x.names.some(function (n) { return na.indexOf(n) !== -1; }); }).map(function (x) { return x.u; });
  }
  function isMine(p) {
    if (!S.me) return false;
    var c = chosen(p);
    if (c) return !!c.me;
    if (!p.assignee) return false;
    var a = norm(p.assignee);
    return (S.me.aliases || []).concat([S.me.name]).some(function (n) { n = norm(n); return n.length > 3 && a.indexOf(n) !== -1; });
  }
  function assignedTo(u, p) { return owners(p).indexOf(u) !== -1; }
  function pendingFor(key) { return S.submissions.filter(function (s) { return s.programKey === key && s.status === 'pending'; }); }
  var GROUP_RE = /(معلمو|معلمي|المعلمون|المعلمين|الفريق|لجنة|المشرفون|المشرفين|الموجهون|الموجهين|الوكلاء|ادارة|رواد)/;
  var CHECKS = [
    ['undated', function (p) { return !p.from; }], ['textdate', function (p) { return !!p.textDate; }], ['noowner', function (p) { return S.users ? !owners(p).length : (!chosen(p) && !p.assignee); }],
    ['group', function (p) { return !chosen(p) && !!p.assignee && GROUP_RE.test(norm(p.assignee)); }], ['early', function (p) { return p.done && p.from && p.from > S.today; }],
    ['noactual', function (p) { return p.done && p.c && p.c.actual && p.actual == null; }], ['noevidence', function (p) { return p.done && !p.evidence; }],
    ['late30', function (p) { return statusOf(p) === 'overdue' && daysBetween(p.to || p.from, S.today) > 30; }], ['unapproved', function (p) { return !p.approved; }]
  ];
  function stageName(s) { return S.lang === 'en' ? (STAGE_EN[s] || s) : s; }
  function kpiName(code, fallback) { return S.lang === 'en' ? (KPI_EN[code] || fallback || code) : (fallback || KPI_EN[code] || code); }
  function kpiList() {
    var seen = {}, out = [];
    S.programs.forEach(function (p) { if (!seen[p.kpi]) { seen[p.kpi] = true; out.push({ code: p.kpi, name: p.kpiName }); } });
    return out;
  }
  function fmt(opts, value) {
    try { return new Intl.DateTimeFormat(S.lang === 'en' ? 'en-GB' : 'ar-SA-u-ca-gregory-nu-latn', opts).format(value); } catch (e) { return String(value); }
  }
  function fmtDate(d) { return d ? fmt({ day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }, new Date(d + 'T00:00:00Z')) : ''; }
  function fmtTime(x) { return x ? fmt({ day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }, new Date(x)) : t('never'); }
  function whenText(p) {
    var parts = [];
    if (p.term && p.week) parts.push((p.term === 1 ? t('term1') : t('term2')) + ' · ' + t('week') + ' ' + p.week);
    if (p.from) parts.push(fmtDate(p.from) + (p.to && p.to !== p.from ? ' – ' + fmtDate(p.to) : ''));
    return parts.length ? parts.join(' · ') : t('noDate');
  }
  function schoolOf(stage) { return RULES.schoolOf(stage); }
  function schools() { var out = []; S.me.stages.forEach(function (s) { var k = schoolOf(s); if (out.indexOf(k) === -1) out.push(k); }); return out.sort().reverse(); }
  function schoolName(k) { return t(k === 'intl' ? 'sIntl' : 'sPrivate'); }
  function stageOk(stage) { return (!S.school || schoolOf(stage) === S.school) && (!S.f.stage || stage === S.f.stage); }
  function stagesShown() { return S.me.stages.filter(function (s) { return !S.school || schoolOf(s) === S.school; }); }
  function setSchool(k) { S.school = k; if (S.f.stage && k && schoolOf(S.f.stage) !== k) S.f.stage = ''; S.limit = 80; }
  function inScope(p) { return stageOk(p.stage); }
  function matches(p, skipStatus) {
    var f = S.f;
    if (!inScope(p)) return false;
    if (f.kpi && p.kpi !== f.kpi) return false;
    if (f.term && String(p.term || '') !== f.term) return false;
    if (f.mine && !isMine(p)) return false;
    if (f.person) { var pu = (S.users || []).filter(function (x) { return x.email === f.person; })[0]; if (!pu || !assignedTo(pu, p)) return false; }
    if (f.q && norm(p.name + ' ' + (p.assignee || '') + ' ' + whoText(p) + ' ' + (p.item || '') + ' ' + (p.details || '')).indexOf(norm(f.q)) === -1) return false;
    if (skipStatus || !f.status) return true;
    if (f.status === 'pending') return pendingFor(p.key).length > 0;
    if (f.status.indexOf('check:') === 0) { var c = CHECKS.filter(function (x) { return x[0] === f.status.slice(6); })[0]; return !!c && !!c[1](p); }
    return statusOf(p) === f.status;
  }
  function pill(kind, label) { return h('span', { class: 'pill p-' + kind, text: label || t(kind) }); }
  /** A state pill. An item in progress also carries its percentage, and its dot takes the matching shade of blue. */
  function statePill(state, pct) {
    if (state !== 'active') return pill(state);
    return h('span', { class: 'pill p-active g' + grade(pct) }, t('active') + ' ', h('bdi', { text: pct + '%' }));
  }
  function fillOf(p) { var st = statusOf(p); return 'f-' + st + (st === 'active' ? ' g' + grade(progressOf(p)) : ''); }
  function field(label, input, hint) { return h('label', { class: 'fld' }, h('span', { text: label }), input, hint ? h('small', { text: hint }) : null); }
  function busy(btn, on) { btn.disabled = on; }

  /* ---------- shell ---------- */
  var GROUPS = [['home', 'calendar', 'programs', 'people', 'weekly'], ['review', 'alerts', 'checks'], ['timetable', 'builder', 'visits', 'mycal', 'mine'], ['admin']];
  function navItems() {
    if (!S.me) return [];
    var lead = isLead();
    return ['home', 'calendar', 'programs'].concat(lead ? ['people', 'weekly', 'review', 'alerts', 'checks'] : []).concat(['timetable']).concat(lead ? ['builder'] : []).concat(['visits', 'mycal', 'mine']).concat(lead ? ['admin'] : []);
  }
  function waiting() { return S.submissions.filter(function (s) { return s.status === 'pending' && (isLead() || String(s.by).toLowerCase() === S.me.email); }).length; }
  function navBtn(v) {
    var n = v === 'review' ? waiting() : v === 'visits' ? (S.visitsNew || 0) : 0;
    return h('button', { type: 'button', 'data-view': v, 'aria-current': S.view === v ? 'page' : null, onclick: function () { go(v); } }, ic(v), h('span', { text: t(v) }), n ? h('span', { class: 'badge', text: n }) : null);
  }
  function avatar(u, cls) {
    var el = h('span', { class: 'avatar' + (cls ? ' ' + cls : '') });
    if (u && u.photo) el.appendChild(h('img', { src: u.photo, alt: '' })); else el.textContent = ((u && u.name) || '?').trim().charAt(0);
    return el;
  }

  /* back and forward through the places visited */
  var H = { list: [], i: -1 };
  function navState() { return JSON.stringify({ view: S.view, school: S.school, f: S.f, adminTab: S.adminTab, reviewTab: S.reviewTab, cal: S.cal, calTab: S.calTab }); }
  function commit() {
    if (!S.me) return;
    var now = navState();
    if (H.i >= 0 && H.list[H.i] === now) return;
    H.list = H.list.slice(0, H.i + 1); H.list.push(now);
    if (H.list.length > 60) H.list.shift();
    H.i = H.list.length - 1;
  }
  function travel(step) {
    var j = H.i + step;
    if (j < 0 || j >= H.list.length) return;
    H.i = j;
    var o = JSON.parse(H.list[j]);
    S.view = o.view; S.school = o.school; S.f = o.f; S.adminTab = o.adminTab; S.reviewTab = o.reviewTab; S.cal = o.cal; S.calTab = o.calTab; S.limit = 80;
    closeSheet(); render(); window.scrollTo(0, 0);
  }

  /* undo and redo of the actions taken in this visit */
  var U = { done: [], undone: [], busy: false };
  function record(label, undoFn, redoFn) { U.done.push({ label: label, undo: undoFn, redo: redoFn }); if (U.done.length > 30) U.done.shift(); U.undone = []; }
  function replay(from, to, key, msg) {
    if (U.busy || !from.length) return;
    var a = from.pop();
    U.busy = true;
    a[key]().then(function () { to.push(a); U.busy = false; toast(t(msg) + ': ' + a.label); render(); }, function (e) { U.busy = false; toast(errText(e), true); render(); });
  }
  function undo() { replay(U.done, U.undone, 'undo', 'undone'); }
  function redo() { replay(U.undone, U.done, 'redo', 'redone'); }

  function go(view, patch) {
    S.view = view; S.limit = 80;
    if (view === 'weekly') S.weekly = null;   // the report is read fresh each time it is opened
    if (patch) { S.f = { stage: S.f.stage, kpi: '', status: '', term: '', q: '', mine: false, person: '' }; for (var k in patch) S.f[k] = patch[k]; }
    closeSheet(); render();
    window.scrollTo(0, 0);
  }
  function toggleLang() {
    S.lang = S.lang === 'ar' ? 'en' : 'ar'; store('ap.lang', S.lang); closeSheet();
    if (!S.me && coverNote && !coverNote.spin) startPage(startMsg); else render();
  }
  function toggleTheme() {
    var cur = document.documentElement.getAttribute('data-theme') || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next); store('ap.theme', next);
  }
  function toolButtons(cls) {
    var out = [h('button', { type: 'button', class: cls, 'data-tool': 'lang', onclick: toggleLang }, ic('lang'), t('lang'))];
    if (!isPreview) out.push(h('button', { type: 'button', class: cls, 'data-tool': 'theme', onclick: toggleTheme }, ic('theme'), t('theme')));
    if (S.me) out.push(h('button', { type: 'button', class: cls, 'data-tool': 'out', onclick: signOut }, ic('out'), t('signOut')));
    return out;
  }
  function paintNav() {
    var rail = clear($('rail')), bar = clear($('tabbar'));
    rail.appendChild(h('div', { class: 'brand' }, plate(), h('div', null, h('b', { text: t('title') }), h('small', { text: t('sub') }))));
    if (!S.me) return;
    var items = navItems(), list = h('nav', { class: 'navlist' });
    GROUPS.forEach(function (g, gi) {
      var mine = g.filter(function (v) { return items.indexOf(v) !== -1; });
      if (!mine.length) return;
      if (gi && list.childNodes.length) list.appendChild(h('span', { class: 'navsep', 'aria-hidden': 'true' }));
      mine.forEach(function (v) { list.appendChild(navBtn(v)); });
    });
    var outLinks = linkNodes('navlink');
    if (outLinks.length) { list.appendChild(h('span', { class: 'navsep', 'aria-hidden': 'true' })); add(list, outLinks); }
    rail.appendChild(list);
    rail.appendChild(h('div', { class: 'rail-foot' },
      h('button', { class: 'me', type: 'button', id: 'meCard', title: t('profile'), onclick: profileSheet }, avatar(S.me), h('span', null, h('b', { text: S.me.name }), h('span', { text: t('r_' + S.me.role) }))),
      h('div', { class: 'rail-tools' }, toolButtons())));
    var shown = items.slice(0, 4);
    shown.forEach(function (v) { bar.appendChild(navBtn(v)); });
    bar.appendChild(h('button', { type: 'button', 'data-view': 'more', 'aria-current': shown.indexOf(S.view) === -1 ? 'page' : null, onclick: moreSheet }, ic('more'), h('span', { text: t('more') })));
  }
  var searchTimer;
  function nb(icon, label, enabled, fn, flip) {
    return h('button', { class: 'nb', type: 'button', id: 'nb-' + icon, title: label, 'aria-label': label, disabled: !enabled, onclick: fn }, ic(icon, flip ? 'flip' : ''));
  }
  function paintTop() {
    var top = clear($('top'));
    top.appendChild(plate());
    if (!S.me) { top.appendChild(h('h1', { id: 'pageTitle', text: t('title') })); return; }
    top.appendChild(h('div', { class: 'navbtns' }, nb('back', t('back'), H.i > 0, function () { travel(-1); }, true), nb('fwd', t('forward'), H.i < H.list.length - 1, function () { travel(1); }, true)));
    top.appendChild(h('h1', { id: 'pageTitle', text: t(S.view) }));
    var lastDone = U.done[U.done.length - 1], lastUndone = U.undone[U.undone.length - 1];
    top.appendChild(h('div', { class: 'navbtns' }, nb('undo', t('undo') + (lastDone ? ': ' + lastDone.label : ''), !!lastDone, undo), nb('redo', t('redo') + (lastUndone ? ': ' + lastUndone.label : ''), !!lastUndone, redo)));
    var q = h('input', { type: 'search', id: 'topSearch', value: S.f.q, placeholder: t('searchPh'), 'aria-label': t('search') });
    q.addEventListener('input', function () {
      clearTimeout(searchTimer);
      // The header search looks through every programme of the chosen stage, so other filters are cleared.
      searchTimer = setTimeout(function () { S.f = { stage: S.f.stage, kpi: '', status: '', term: '', q: q.value, mine: false, person: '' }; S.view = 'programs'; S.limit = 80; paintNav(); $('pageTitle').textContent = t('programs'); paintMain(); }, 250);
    });
    top.appendChild(h('div', { class: 'searchbox' }, ic('search'), q));
    if (schools().length > 1) {
      var sc = h('select', { class: 'stagepick', id: 'schoolPick', 'aria-label': t('school'), onchange: function () { setSchool(sc.value); render(); } });
      schools().forEach(function (k) { var o = h('option', { value: k, text: schoolName(k) }); if (k === S.school) o.selected = true; sc.appendChild(o); });
      top.appendChild(sc);
    }
    if (stagesShown().length > 1) {
      var sp = h('select', { class: 'stagepick', id: 'stagePick', 'aria-label': t('stage'), onchange: function () { S.f.stage = sp.value; S.limit = 80; render(); } });
      [''].concat(stagesShown()).forEach(function (x) { var o = h('option', { value: x, text: x ? stageName(x) : t('allStages') }); if (x === S.f.stage) o.selected = true; sp.appendChild(o); });
      top.appendChild(sp);
    }
    if (isLead()) top.appendChild(h('button', { class: 'iconbtn', type: 'button', id: 'syncBtn', title: t('lastSync') + ': ' + fmtTime(S.settings.lastSync), onclick: doSync }, ic('sync'), h('span', { text: fmtTime(S.settings.lastSync) })));
  }
  function paintMain() {
    var m = clear($('main'));
    if (coverOn()) { m.appendChild(vCover()); return; }
    if (!S.settings.mainFileSet && S.view !== 'admin') m.appendChild(h('div', { class: 'note warn', text: t('setupNeeded') }));
    var fn = { home: vHome, calendar: vCalendar, programs: vPrograms, people: vPeople, review: vReview, weekly: vWeekly, alerts: vAlerts, mine: vMine, mycal: vMyCal, timetable: vTimetable, builder: vBuilder, visits: vVisits, checks: vChecks, admin: vAdmin }[S.view] || vHome;
    m.appendChild(fn());
  }
  function render() {
    var app = $('app');
    app.dir = S.lang === 'en' ? 'ltr' : 'rtl'; app.lang = S.lang;
    document.documentElement.lang = S.lang; document.documentElement.dir = app.dir;
    if (S.me && navItems().indexOf(S.view) === -1) S.view = 'home';
    commit();
    app.classList.toggle('cover', coverOn());
    paintNav(); paintTop(); paintMain();
  }
  function moreSheet() {
    var box = h('div', { class: 'form' });
    box.appendChild(h('button', { class: 'btn ghost', type: 'button', onclick: profileSheet }, avatar(S.me, 'sm'), t('profile')));
    navItems().slice(4).forEach(function (v) { box.appendChild(h('button', { class: 'btn ghost', type: 'button', 'data-view': v, onclick: function () { go(v); } }, ic(v), t(v))); });
    add(box, linkNodes('btn ghost'));
    toolButtons('btn ghost').forEach(function (b) { b.addEventListener('click', closeSheet); box.appendChild(b); });
    showSheet(S.me.name, h('p', { class: 'lead', text: t('r_' + S.me.role) }), h('section', { class: 'box' }, box));
  }

  /* ---------- pieces ---------- */
  function prow(p, withReport) {
    var st = statusOf(p), pend = pendingFor(p.key).length;
    var meta = [p.kpi, S.me.stages.length > 1 && !S.f.stage ? stageName(p.stage) : null, whenText(p), whoText(p)].filter(Boolean).join(' · ');
    return h('button', { class: 'prow', type: 'button', 'data-key': p.key, onclick: function () { openSheet(p.key, withReport ? 'report' : ''); } },
      h('i', { class: 'stripe ' + fillOf(p) }),
      h('div', null, h('b', { text: p.name }), h('small', { text: meta })),
      h('div', { class: 'side' }, statePill(st, st === 'active' ? progressOf(p) : 0), pend ? pill('pending', t('hasPending')) : null, p.count != null || p.actual != null ? h('small', { text: (p.actual != null ? p.actual : '—') + ' / ' + (p.count != null ? p.count : '—') }) : null),
      ic('chev', 'flip'));
  }
  function tile(cls, icon, num, label, sub, onclick) {
    return h('button', { class: 'tile ' + cls, type: 'button', onclick: onclick }, ic(icon), h('span', { class: 'n', text: num }), h('span', { class: 'l', text: label }), h('span', { class: 's', text: sub }));
  }
  function counts(list) { return RULES.counts(list, S.today); }

  /* ---------- home ---------- */
  /* ---------- cover: the start page, then the school chooser ---------- */
  var coverNote = null;   // what the start page shows under the welcome: sign-in control, a spinner, or a message
  var PUB = { slogan: '', welcome: '' };
  try { var cached = JSON.parse(store('ap.pub') || 'null'); if (cached && typeof cached.slogan === 'string') PUB = cached; } catch (e) {}
  function coverOn() { return !S.me || (S.view === 'home' && schools().length > 1 && !S.school); }
  function yearLabel() { var d = S.settings && S.settings.termStarts && S.settings.termStarts[1]; if (!d) return ''; var y = +d.slice(0, 4); return y + '/' + (y + 1); }
  /** The schools' eight-pointed star: eight tiles in the logos' colours, pointing outward around the disc that holds the two logos. */
  function petals() {
    var root = svg('svg', { class: 'petals', viewBox: '-230 -230 460 460', 'aria-hidden': 'true' });
    ['#E0637A', '#F0B432', '#2790C3', '#FFFFFF', '#E0637A', '#F0B432', '#2790C3', '#FFFFFF'].forEach(function (c, i) {
      var tile = svg('rect', { x: -35, y: -215, width: 70, height: 70, rx: 6, fill: c, 'fill-opacity': c === '#FFFFFF' ? '0.3' : '1', transform: 'rotate(45 0 -180)' });
      root.appendChild(svg('g', { transform: 'rotate(' + i * 45 + ')' }, svg('g', { class: 'petal' }, tile)));
    });
    return root;
  }
  function stage() {
    return h('div', { class: 'cv-stage' }, petals(), h('div', { class: 'cv-disc cv-logos' },
      h('img', { class: 'cv-logo l-priv', src: IMG.priv, alt: schoolName('private') }), h('span', { class: 'cv-rule', 'aria-hidden': 'true' }), h('img', { class: 'cv-logo l-intl', src: IMG.intl, alt: schoolName('intl') })));
  }
  var introPlayed = false;   // the opening motion plays once when the site opens, and again after signing out
  /** Start page: the cover, the school slogan, a welcome, and sign-in. Nothing else. */
  function vStart() {
    var note = coverNote || {}, foot = h('div', { class: 'cv-foot' }), first = !introPlayed;
    introPlayed = true;
    if (note.spin) foot.appendChild(h('div', { class: 'spin', role: 'status', 'aria-label': t('loading') }));
    add(foot, note.extra);
    if (note.text) foot.appendChild(h('span', { class: 'cv-msg', dir: 'auto', text: note.text }));
    return h('div', { class: 'cv start' + (first ? ' intro' : '') }, h('section', { class: 'cv-hero' },
      h('div', { class: 'cv-top' }, h('span', { class: 'cv-tools' }, toolButtons('cv-tool'))),
      h('div', { class: 'cv-text' },
        h('div', { class: 'cv-title' }, h('h1', { id: 'coverTitle', text: t('title') }),
          h('p', { class: 'cv-slogan', id: 'slogan', dir: 'auto', text: PUB.slogan || t('sloganDefault') }), bookLine(),
          h('p', { class: 'cv-welcome', id: 'welcome', dir: 'auto', text: PUB.welcome || t('welcomeDefault') })),
        foot),
      stage()));
  }
  /** After sign-in: which school to follow. */
  function vChooser() {
    var hero = h('section', { class: 'cv-hero' }, tiles(),
      h('div', { class: 'cv-top' }, plate(), h('span', { class: 'cv-tools' }, toolButtons('cv-tool'))),
      h('div', { class: 'cv-title' }, h('span', { class: 'cv-tag', text: [t('sub'), yearLabel()].filter(Boolean).join(' · ') }), h('h1', { id: 'coverTitle', text: t('title') }), h('p', { class: 'cv-welcome', text: t('coverLead') })),
      bookLine(),
      h('div', { class: 'cv-foot row' }, avatar(S.me, 'lg'), h('span', null, h('b', { text: t('hello') + '، ' + S.me.name }), h('span', { text: t('r_' + S.me.role) }))));
    var cards = h('div', { class: 'cv-cards' });
    schools().forEach(function (k) {
      var logo = h('span', { class: 'logo' }, h('img', { src: k === 'intl' ? IMG.intl : IMG.priv, alt: schoolName(k) }));
      var st = S.me.stages.filter(function (x) { return schoolOf(x) === k; }), ps = S.programs.filter(function (p) { return schoolOf(p.stage) === k; }), c = counts(ps);
      var pend = S.submissions.filter(function (x) { return x.status === 'pending' && schoolOf(x.stage) === k; }).length;
      var bar = h('span', { class: 'bar2', role: 'img', 'aria-label': ST.map(function (x) { return t(x) + ' ' + c[x]; }).join(', ') });
      ST.forEach(function (x) { if (!c[x]) return; var seg = h('i', { class: 'f-' + x, title: t(x) + ': ' + c[x] }); seg.style.flex = String(c[x]); bar.appendChild(seg); });
      var fact = function (num, label) { return h('span', null, h('b', { text: num }), h('span', { text: label })); };
      cards.appendChild(h('button', { class: 'cv-card s-' + k, type: 'button', 'data-school': k, onclick: function () { setSchool(k); render(); window.scrollTo(0, 0); } },
        logo, h('span', { class: 'body' }, h('b', { text: schoolName(k) }), h('span', { class: 'lead', text: st.map(stageName).join(' · ') }),
          h('span', { class: 'facts' }, fact(ps.length, t('total')), fact(c.done, t('done')), fact(c.overdue, t('overdue')), isLead() ? fact(pend, t('pendingReview')) : null),
          bar, h('span', { class: 'go' }, t('enter'), ic('chev', 'flip')))));
    });
    return h('div', { class: 'cv' }, hero, h('section', { class: 'cv-pick' }, h('h2', { text: t('chooseSchool') }), h('p', { class: 'lead', text: t('chooseLead') }), cards));
  }
  function vCover() { return S.me ? vChooser() : vStart(); }
  /* ---------- progress monitor: rings inside rings ---------- */
  /** What the monitor counts: programmes, or whole indicators. Each has a state and, when in progress, a percentage. */
  function monitorItems(ps, level) {
    if (level !== 'indicators') return ps.map(function (p) { var st = statusOf(p); return { state: st, pct: st === 'active' ? progressOf(p) : 0 }; });
    var out = [];
    kpiList().forEach(function (k) { var kp = ps.filter(function (p) { return p.kpi === k.code; }); if (kp.length) out.push(indicatorState(kp)); });
    return out;
  }
  function tally(items) {
    var n = { total: items.length, done: 0, active: 0, soon: 0, overdue: 0, upcoming: 0, undated: 0, grades: [0, 0, 0, 0, 0] };
    items.forEach(function (it) { n[it.state]++; if (it.state === 'active') n.grades[grade(it.pct) - 1]++; });
    return n;
  }
  function share(n, total) { return total ? Math.round(n * 100 / total) : 0; }
  /**
   * The rings: one ring per state, outermost first. Each arc starts at the top and its length is that state's share of the whole.
   * The in-progress ring is drawn in up to five shades of blue, light for items that have just started, deep for those nearly complete.
   */
  function ringsSvg(n, big) {
    var size = 260, mid = size / 2, w = big ? 16 : 20, gap = big ? 6 : 7, root = svg('svg', { viewBox: '0 0 ' + size + ' ' + size, class: 'rings', 'aria-hidden': 'true' });
    function circle(r, cls, frac) {
      var len = 2 * Math.PI * r, el = svg('circle', { cx: mid, cy: mid, r: r, class: cls, 'stroke-width': w, fill: 'none', transform: 'rotate(-90 ' + mid + ' ' + mid + ')' });
      if (frac != null) { el.setAttribute('stroke-dasharray', Math.max(0.01, frac * len).toFixed(2) + ' ' + len.toFixed(2)); el.setAttribute('stroke-linecap', 'round'); }
      return el;
    }
    RINGS.forEach(function (st, i) {
      var r = mid - w / 2 - 2 - i * (w + gap), g = svg('g', { class: 'ring', 'data-ring': st });
      g.appendChild(circle(r, 'ring-track r-' + st));
      var frac = n.total ? n[st] / n.total : 0;
      if (frac > 0 && st !== 'active') g.appendChild(circle(r, 'ring-arc r-' + st, Math.min(frac, 0.999)));
      if (frac > 0 && st === 'active') {
        // deepest shade first and longest; each lighter shade is laid over its start, with a thin surface line between shades
        var upTo = [], run = 0, len = 2 * Math.PI * r;
        n.grades.forEach(function (k) { run += k; upTo.push(run); });
        for (var gi = 4; gi >= 0; gi--) {
          if (!n.grades[gi]) continue;
          var f = Math.min(upTo[gi] / n.total, 0.999);
          if (upTo[gi] < n.active) g.appendChild(circle(r, 'ring-gap', Math.min(0.999, f + 2.5 / len)));
          g.appendChild(circle(r, 'ring-arc ga' + (gi + 1), f));
        }
      }
      // a wide invisible band, so the ring is easy to point at
      g.appendChild(svg('circle', { cx: mid, cy: mid, r: r, class: 'ring-hit', 'stroke-width': w + gap, fill: 'none' }));
      root.appendChild(g);
    });
    return root;
  }
  function monitor(ps) {
    var level = S.mon === 'indicators' ? 'indicators' : 'programs', n = tally(monitorItems(ps, level)), ind = level === 'indicators';
    var box = h('section', { class: 'panel monitor', id: 'monitor' });
    box.appendChild(h('div', { class: 'headrow' }, h('div', null, h('h2', { text: t('monitor') }), h('p', { class: 'lead', text: t('monLead') })),
      tabsRow([['programs', t('programs')], ['indicators', t('monIndicators')]], level, function (k) { S.mon = k; S.ipick = ''; render(); })));
    var num = h('b', { id: 'monNum' }), lab = h('span', { id: 'monLabel' }), sub = h('small', { id: 'monSub' });
    var dial = h('div', { class: 'dial', role: 'img', 'aria-label': t('monitor') + ': ' + RINGS.map(function (st) { return t(st) + ' ' + n[st] + ' (' + share(n[st], n.total) + '%)'; }).join(', ') },
      ringsSvg(n, true), h('div', { class: 'dial-c' }, num, lab, sub));
    function readout(st) {
      var k = st || 'done';
      num.textContent = share(n[k], n.total) + '%'; lab.textContent = t(k); sub.textContent = n[k] + ' ' + t('ofN') + ' ' + n.total;
      box.classList.toggle('has-hot', !!st);
      Array.prototype.forEach.call(box.querySelectorAll('[data-ring], [data-state]'), function (el) { el.classList.toggle('hot', !!st && (el.getAttribute('data-ring') || el.getAttribute('data-state')) === st); });
    }
    function pick(st) {
      if (!ind) { go('programs', st ? { status: st } : {}); return; }
      S.ipick = S.ipick === st ? '' : st; render();
      var list = $('indRows'); if (list && list.scrollIntoView) list.scrollIntoView({ block: 'nearest' });
    }
    var subs = ind ? { done: share(n.done, n.total) + '% ' + t('ofIndicators'), active: t('indActiveSub'), soon: t('indSoonSub'), overdue: t('indLateSub') }
      : { done: share(n.done, n.total) + '% ' + t('ofPlan'), active: t('activeSub'), soon: t('startsSoon'), overdue: t('needAction') };
    var tiles = h('div', { class: 'tiles', id: 'tiles' }, tile('total', 'total', n.total, ind ? t('indTotal') : t('total'), ind ? ps.length + ' ' + t('programsWord') : kpiList().length + ' ' + t('indicator'), function () { pick(''); }));
    RINGS.forEach(function (st) {
      var el = tile(st, st, n[st], t(st), subs[st], function () { pick(st); });
      el.setAttribute('data-state', st);
      if (ind && S.ipick === st) el.setAttribute('aria-pressed', 'true');
      ['mouseenter', 'focus'].forEach(function (ev) { el.addEventListener(ev, function () { readout(st); }); });
      ['mouseleave', 'blur'].forEach(function (ev) { el.addEventListener(ev, function () { readout(''); }); });
      tiles.appendChild(el);
    });
    if (isLead()) {
      var pend = S.submissions.filter(function (s) { return s.status === 'pending' && stageOk(s.stage); }).length;
      tiles.appendChild(tile('rev', 'review', pend, t('pendingReview'), t('reportsWaiting'), function () { go('review'); }));
    }
    Array.prototype.forEach.call(dial.querySelectorAll('.ring'), function (g) {
      var st = g.getAttribute('data-ring');
      g.addEventListener('mouseenter', function () { readout(st); });
      g.addEventListener('mouseleave', function () { readout(''); });
      g.addEventListener('click', function () { pick(st); });
    });
    readout('');
    box.appendChild(h('div', { class: 'mon-body' }, dial, tiles));
    var key = h('span', { class: 'ramp', role: 'img', 'aria-label': '0% – 100%' });
    [1, 2, 3, 4, 5].forEach(function (g) { key.appendChild(h('i', { class: 'f-active g' + g })); });
    box.appendChild(h('div', { class: 'mon-foot' },
      h('span', { class: 'rampkey' }, h('b', { text: t('active') + ':' }), h('bdi', { text: '0%' }), key, h('bdi', { text: '100%' }), h('span', { text: ind ? t('rampInd') : t('rampProg') })),
      h('span', { class: 'lead', id: 'monRest', text: t('outside') + ': ' + t('upcoming') + ' ' + n.upcoming + ' · ' + t('undated') + ' ' + n.undated })));
    return box;
  }

  function vHome() {
    var v = h('div', { class: 'view' }), ps = S.programs.filter(inScope), n = counts(ps);
    v.appendChild(h('div', { class: 'headrow' }, h('div', { class: 'hello-logo' },
      S.school ? h('span', { class: 'plate' }, h('img', { src: S.school === 'intl' ? IMG.mark : IMG.priv, alt: '' })) : null,
      h('div', { class: 'hello' }, h('b', { text: S.school && schools().length > 1 ? schoolName(S.school) : t('hello') + '، ' + S.me.name }),
        h('p', { class: 'lead' }, h('bdi', { text: fmtDate(S.today) }), S.fileName ? [' · ', h('bdi', { text: S.fileName })] : null))),
      h('div', { class: 'actions', id: 'homeLinks' }, linkNodes('btn ghost sm'), schools().length > 1 ? h('button', { class: 'btn ghost sm', type: 'button', id: 'changeSchool', onclick: function () { setSchool(''); render(); } }, t('changeSchool')) : null)));
    var mine = ps.filter(isMine), open = mine.filter(function (p) { var s = statusOf(p); return s === 'overdue' || s === 'active' || s === 'soon'; })
      .sort(function (a, b) { return (a.to || a.from) < (b.to || b.from) ? -1 : 1; });
    if (!isLead() || mine.length) {
      var myPend = S.submissions.filter(function (s) { return s.status === 'pending' && String(s.by).toLowerCase() === S.me.email; }).length;
      var sec = h('section', { class: 'stack' }, h('div', { class: 'headrow' }, h('div', null, h('h2', { text: t('myTasks') }), h('p', { class: 'lead', text: t('myTasksLead') })),
        h('button', { class: 'btn ghost sm', type: 'button', onclick: function () { go('programs', { mine: true }); } }, t('allMine') + ' (' + mine.length + ')')));
      if (!isLead()) sec.appendChild(h('div', { class: 'tiles' },
        tile('total', 'total', mine.length, t('myCount'), stageName(S.f.stage) || t('allStages'), function () { go('programs', { mine: true }); }),
        tile('overdue', 'overdue', mine.filter(function (p) { return statusOf(p) === 'overdue'; }).length, t('myLate'), t('needAction'), function () { go('programs', { mine: true, status: 'overdue' }); }),
        tile('rev', 'review', myPend, t('myWaiting'), t('pendingReview'), function () { go('mine'); })));
      if (open.length) { var l = h('div', { class: 'plist' }); open.slice(0, 6).forEach(function (p) { l.appendChild(prow(p, true)); }); sec.appendChild(l); }
      else sec.appendChild(h('div', { class: 'empty', text: mine.length ? t('nothingLate') : t('noMine') }));
      v.appendChild(sec);
    }
    v.appendChild(monitor(ps));
    var left = h('section', { class: 'panel' }, h('div', null, h('h2', { text: t('byIndicator') }), h('p', { class: 'lead', text: t('byIndicatorLead') })));
    var lg = h('div', { class: 'legend' });
    ST.forEach(function (s) { lg.appendChild(h('span', null, h('i', { class: 'sw f-' + s }), t(s))); });
    left.appendChild(lg);
    if (S.ipick) left.appendChild(h('div', { class: 'chips' }, h('button', { class: 'chip', type: 'button', id: 'ipickChip', 'aria-pressed': 'true', title: t('close'), onclick: function () { S.ipick = ''; render(); } }, h('i', { class: 'f-' + S.ipick }), t('onlyState') + ' ' + t(S.ipick), ic('x'))));
    var rows = h('div', { class: 'rows', id: 'indRows' });
    kpiList().forEach(function (k) {
      var kp = ps.filter(function (p) { return p.kpi === k.code; });
      if (!kp.length) return;
      var is = indicatorState(kp);
      if (S.ipick && is.state !== S.ipick) return;
      var c = is.c, bar = h('div', { class: 'bar2', role: 'img', 'aria-label': ST.map(function (s) { return t(s) + ' ' + c[s]; }).join(', ') });
      ST.forEach(function (s) { if (!c[s]) return; var seg = h('i', { class: 'f-' + s, title: t(s) + ': ' + c[s] }); seg.style.flex = String(c[s]); bar.appendChild(seg); });
      var owner = '';
      if (S.f.stage) { var tg = S.targets.filter(function (x) { return x.code === k.code; })[0]; if (tg && tg.stages[S.f.stage]) owner = tg.stages[S.f.stage].owner || ''; }
      rows.appendChild(h('button', { class: 'irow', type: 'button', onclick: function () { go('programs', { kpi: k.code }); } },
        h('div', null, h('span', { class: 'code', text: k.code }), ' ', h('span', { class: 'nm', text: kpiName(k.code, k.name) }), owner ? h('div', { class: 'ow', text: t('owner') + ': ' + owner }) : null),
        bar, h('span', { class: 'pcw', 'data-state': is.state }, statePill(is.state, is.pct), h('span', { class: 'pc', text: c.done + ' / ' + kp.length }))));
    });
    left.appendChild(rows);
    var right = h('div', { class: 'stack' });
    if (isLead()) {
      var late = ps.filter(function (p) { return statusOf(p) === 'overdue'; }).sort(function (a, b) { return (a.to || a.from) < (b.to || b.from) ? -1 : 1; });
      var at = h('section', { class: 'stack' }, h('div', { class: 'headrow' }, h('div', null, h('h2', { text: t('attention') }), h('p', { class: 'lead', text: t('attentionLead') })),
        late.length ? h('button', { class: 'btn ghost sm', type: 'button', onclick: function () { go('programs', { status: 'overdue' }); } }, t('showAll')) : null));
      var al = h('div', { class: 'plist' });
      late.slice(0, 5).forEach(function (p) { al.appendChild(prow(p)); });
      at.appendChild(late.length ? al : h('div', { class: 'empty', text: t('nothingLate') }));
      right.appendChild(at);
      if (!S.f.stage && stagesShown().length > 1) {
        var tb = h('tbody');
        stagesShown().forEach(function (s) {
          var sp = S.programs.filter(function (p) { return p.stage === s; }), c2 = counts(sp), tot = sp.length;
          tb.appendChild(h('tr', { class: 'click', onclick: function () { S.f.stage = s; render(); } }, h('td', null, h('span', { class: 'nm', text: stageName(s) })), h('td', { class: 'num', text: tot }), h('td', { class: 'num', text: c2.done }), h('td', { class: 'num', text: c2.overdue })));
        });
        right.appendChild(h('section', { class: 'stack' }, h('h2', { text: t('byStage') }), h('div', { class: 'tw' }, h('table', null,
          h('thead', null, h('tr', null, h('th', { text: t('stage') }), h('th', { text: t('total') }), h('th', { text: t('done') }), h('th', { text: t('overdue') }))), tb))));
      }
    }
    v.appendChild(isLead() ? h('div', { class: 'cols' }, left, right) : left);
    return v;
  }

  /* ---------- programmes ---------- */
  function sel(label, value, options, onchange) {
    var s = h('select', { onchange: function () { onchange(s.value); } });
    options.forEach(function (o) { var op = h('option', { value: o[0], text: o[1] }); if (o[0] === value) op.selected = true; s.appendChild(op); });
    return h('label', { class: 'fld' }, h('span', { text: label }), s);
  }
  function vPrograms() {
    var v = h('div', { class: 'view' }), f = S.f;
    if ((f.person || f.status === 'check:noowner') && !loadUsers(v)) return v;
    var base = S.programs.filter(function (p) { return matches(p, true); }), list = base.filter(function (p) { return matches(p); });
    var set = function (k) { return function (val) { S.f[k] = val; S.limit = 80; render(); }; };
    var c = counts(base), chips = h('div', { class: 'chips', role: 'group', 'aria-label': t('status') });
    var chip = function (val, label, num, sw) {
      chips.appendChild(h('button', { class: 'chip', type: 'button', 'data-status': val, 'aria-pressed': String(f.status === val), onclick: function () { set('status')(f.status === val ? '' : val); } }, sw ? h('i', { class: 'f-' + sw }) : null, label, h('b', { text: num })));
    };
    chip('', t('all'), base.length);
    ['overdue', 'active', 'soon', 'done', 'upcoming', 'undated'].forEach(function (s) { chip(s, t(s), c[s], s); });
    chip('pending', t('hasPending'), base.filter(function (p) { return pendingFor(p.key).length; }).length);
    if (f.status.indexOf('check:') === 0) chip(f.status, '⚑ ' + t('c_' + f.status.slice(6)), list.length);
    if (f.person) {
      var who = (S.users || []).filter(function (x) { return x.email === f.person; })[0];
      chips.appendChild(h('button', { class: 'chip', type: 'button', id: 'personChip', 'aria-pressed': 'true', title: t('close'), onclick: function () { S.f.person = ''; render(); } }, avatar(who, 'sm'), who ? who.name : f.person, ic('x')));
    }
    v.appendChild(chips);
    var mine = h('input', { type: 'checkbox', checked: f.mine, onchange: function () { set('mine')(mine.checked); } });
    v.appendChild(h('div', { class: 'filters' },
      sel(t('indicator'), f.kpi, [['', t('all')]].concat(kpiList().map(function (k) { return [k.code, k.code + ' · ' + kpiName(k.code, k.name)]; })), set('kpi')),
      sel(t('term'), f.term, [['', t('all')], ['1', t('term1')], ['2', t('term2')]], set('term')),
      h('label', { class: 'check' }, mine, t('mineOnly'))));
    if (f.kpi) {
      var strip = h('div', { class: 'planstrip', id: 'planStrip' }, h('span', { class: 'lead', text: t('planStripLead') }));
      (f.stage ? [f.stage] : stagesShown()).forEach(function (st) {
        var ps = S.plan[f.kpi + '|' + st];
        if (!ps) return;
        strip.appendChild(h('span', { class: 'pill ' + (ps.state === 'open' ? 'p-done' : ps.state === 'closed' ? 'p-overdue' : 'p-undated'), 'data-plan': ps.state },
          stageName(st) + ' · ' + t('plan_' + ps.state) + (ps.state === 'open' ? ' · ' + ps.free + ' ' + t('freeRowsWord') : '')));
      });
      if (strip.childNodes.length > 1) v.appendChild(strip);
    }
    v.appendChild(h('div', { class: 'headrow' }, h('p', { class: 'lead', id: 'resultCount', text: list.length + ' ' + t('results') + (f.q ? ' · «' + f.q + '»' : '') }),
      canPlan() || isLead() ? h('div', { class: 'actions' }, canPlan() ? h('button', { class: 'btn sm', type: 'button', id: 'planAdd', onclick: planAddSheet }, ic('plus'), isLead() ? t('planAdd') : t('planPropose')) : null,
        isLead() && list.length ? h('button', { class: 'btn sm', type: 'button', id: 'bulkAssign', onclick: function () { assignSheet(list); } }, ic('people'), t('assignList')) : null,
        isLead() ? h('button', { class: 'btn ghost sm', type: 'button', onclick: function () { copyList(list); } }, t('copy')) : null) : null));
    if (!list.length) { v.appendChild(h('div', { class: 'empty', text: t('none') })); return v; }
    list.sort(function (a, b) { return (a.from || '9') < (b.from || '9') ? -1 : (a.from || '9') > (b.from || '9') ? 1 : 0; });
    var pl = h('div', { class: 'plist' });
    list.slice(0, S.limit).forEach(function (p) { pl.appendChild(prow(p)); });
    v.appendChild(pl);
    if (list.length > S.limit) v.appendChild(h('button', { class: 'btn ghost more', type: 'button', onclick: function () { S.limit += 150; paintMain(); } }, t('more2') + ' (' + (list.length - S.limit) + ')'));
    return v;
  }
  function copyList(list) {
    var clean = function (x) { return String(x == null ? '' : x).replace(/[\t\r\n]+/g, ' '); };
    var rows = list.map(function (p) { return [p.stage, p.kpi, p.name, p.term, p.week, p.from, p.to, p.assignee, p.count, p.actual, t(statusOf(p)), chosen(p) ? chosen(p).name : ''].map(clean).join('\t'); });
    var txt = [t('stage'), t('indicator'), t('program'), t('term'), t('week'), 'from', 'to', t('assignee'), t('target'), t('actual'), t('status'), t('responsible')].join('\t') + '\n' + rows.join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { toast(t('copied')); }, function () { toast('Copy failed', true); });
  }

  /* ---------- side sheet ---------- */
  function closeSheet() { clear($('sheetHost')); document.removeEventListener('keydown', escClose); }
  function escClose(e) { if (e.key === 'Escape') closeSheet(); }
  function showSheet(title) {
    var x = h('button', { class: 'x', type: 'button', 'aria-label': t('close'), onclick: closeSheet }, ic('x'));
    var sheet = h('aside', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': title }, h('header', null, h('h2', { text: title }), x));
    for (var i = 1; i < arguments.length; i++) add(sheet, arguments[i]);
    clear($('sheetHost')).appendChild(h('div', { class: 'sheet-wrap' }, h('div', { class: 'scrim', onclick: closeSheet }), sheet));
    document.addEventListener('keydown', escClose);
    x.focus();
    return sheet;
  }
  function evidenceNode(v) {
    if (!v) return '—';
    return /^https:\/\//i.test(v) ? h('a', { href: v, target: '_blank', rel: 'noopener noreferrer', text: t('open') }) : v;
  }
  function kv(pairs) { var dl = h('dl', { class: 'kv' }); pairs.forEach(function (r) { if (r[1] == null || r[1] === '') return; dl.appendChild(h('dt', { text: r[0] })); dl.appendChild(h('dd', null, r[1])); }); return dl; }
  function tabsRow(items, current, onpick) {
    var tb = h('div', { class: 'tabs', role: 'tablist' });
    items.forEach(function (it) { tb.appendChild(h('button', { type: 'button', role: 'tab', 'data-tab': it[0], 'aria-selected': String(current === it[0]), onclick: function () { onpick(it[0]); } }, it[1])); });
    return tb;
  }
  function replaceProgram(np) { for (var i = 0; i < S.programs.length; i++) if (S.programs[i].key === np.key) { S.programs[i] = np; return; } }
  function openSheet(key, tab) {
    var p = S.programs.filter(function (x) { return x.key === key; })[0];
    if (!p) return;
    tab = tab || (isLead() ? 'edit' : 'report');
    var act = h('section', { class: 'box', id: 'actBox' });
    function paintAct() {
      clear(act);
      if (isLead()) act.appendChild(tabsRow([['edit', t('edit')], ['report', t('report')]], tab, function (k) { tab = k; paintAct(); }));
      if (tab === 'edit' && isLead()) { act.appendChild(h('p', { class: 'note' + (S.settings.writeBack ? '' : ' warn'), text: S.settings.writeBack ? t('editLead') : t('wbOff') })); act.appendChild(editForm(p)); }
      else { act.appendChild(h('h3', { text: t('report') })); act.appendChild(h('p', { class: 'note', text: t('reportLead') })); act.appendChild(reportForm({ type: 'report', programKey: p.key })); }
    }
    paintAct();
    var subs = S.submissions.filter(function (s) { return s.programKey === p.key; }), hist = null;
    if (subs.length) { hist = h('section', { class: 'stack' }, h('h3', { text: t('history') })); subs.slice().reverse().forEach(function (s) { hist.appendChild(subCard(s, false)); }); }
    showSheet(p.name,
      h('div', { class: 'meta' }, statePill(statusOf(p), statusOf(p) === 'active' ? progressOf(p) : 0), h('span', { class: 'code', text: p.kpi }), h('span', { class: 'tag', text: stageName(p.stage) }),
        p.approved ? h('span', { class: 'tag lock', 'data-lock': 'approved', text: t('tagApproved') }) : p.planClosed ? h('span', { class: 'tag lock', 'data-lock': 'plan', text: t('tagPlanClosed') }) : null,
        p.execClosed ? h('span', { class: 'tag lock', 'data-lock': 'exec', text: t('tagExecClosed') }) : null),
      h('section', { class: 'box' }, h('h3', { text: t('plan') }), kv([
        [t('indicator'), kpiName(p.kpi, p.kpiName)], [t('when'), whenText(p)], [t('inFile'), p.assignee || '—'], [t('count'), p.count], [t('budget'), p.budget ? p.budget + ' ' + t('sar') + (p.budgetLine ? ' · ' + p.budgetLine : '') : null],
        [t('item'), p.item], [t('method'), p.method], [t('place'), p.place], [t('details'), p.details], [t('approvedPlan'), p.approved ? t('yes') : t('no')], [t('techNotes'), p.techNotes],
        [t('source'), h('span', null, p.sheet + ' · ' + t('rowWord') + ' ', h('span', { class: 'ltr', text: p.row }))]])),
      h('section', { class: 'box' }, h('h3', { text: t('execution') }), kv([
        [t('doneQ'), p.done ? t('done') : t('notDone')], [t('actualN'), p.actual != null ? p.actual : '—'], [t('evidence'), evidenceNode(p.evidence)], [t('comment'), p.comment || '—']])),
      whoBox(p), act, planBox(p), hist);
  }

  /* ---------- the plan: adding and removing programmes, while the main branch allows it ---------- */
  function canPlan() { return isLead() ? !!S.settings.writeBack : !!S.settings.planEdit; }
  /** After a plan request: a teacher's waits for review; an admin's has already been carried out and brings the plan back fresh. */
  function planDone(res, label, payload) {
    var r = JSON.parse(res), ref = { id: r.submission.id };
    var drop = function () { S.submissions = S.submissions.filter(function (x) { return x.id !== ref.id; }); };
    var take = function (res2) { var r2 = JSON.parse(res2); ref.id = r2.submission.id; if (r2.boot) apply(r2.boot); else S.submissions = S.submissions.concat([r2.submission]); return r2; };
    take(res);
    // undo: a waiting request is withdrawn; a change already made is first reversed in the main file, then its request withdrawn
    record(label, function () { return (r.boot ? call('api_reopen', ref.id).then(applyReview) : Promise.resolve()).then(function () { return call('api_withdraw', ref.id); }).then(drop); },
      function () { return call('api_planRequest', payload).then(take); });
    return r;
  }
  /** In a programme's sheet: remove it from the plan (admins), or ask for that (the teacher responsible). */
  function planBox(p) {
    if (!canPlan() || (!isLead() && !isMine(p))) return null;
    var box = h('section', { class: 'box', id: 'planBox' }, h('h3', { text: t('planRemoveTitle') }));
    if (p.approved) { box.appendChild(h('p', { class: 'note', id: 'planClosed', text: t('planApproved') })); return box; }
    if (p.planClosed) { box.appendChild(h('p', { class: 'note', id: 'planClosed', text: t('planLockedMain') })); return box; }
    if (p.done || p.actual != null || p.evidence) { box.appendChild(h('p', { class: 'note', id: 'planClosed', text: t('planHasData') })); return box; }
    if (S.submissions.some(function (x) { return x.type === 'remove' && x.status === 'pending' && x.programKey === p.key; })) { box.appendChild(h('p', { class: 'note', id: 'planClosed', text: t('planWaiting') })); return box; }
    var why = h('input', { type: 'text', maxlength: '300', id: 'planWhy', placeholder: t('planWhy'), 'aria-label': t('planWhy') });
    var btn = h('button', { class: 'btn bad', type: 'button', id: 'planRemove' }, isLead() ? t('planRemoveNow') : t('planRemoveAsk'));
    btn.addEventListener('click', function () {
      if (btn.getAttribute('data-sure') !== '1') { btn.setAttribute('data-sure', '1'); clear(btn); add(btn, t('planSure')); return; }
      busy(btn, true);
      var payload = JSON.stringify({ type: 'remove', programKey: p.key, note: why.value });
      call('api_planRequest', payload).then(function (res) {
        var r = planDone(res, t('planRemoveTag') + ' · ' + p.name, payload);
        toast(r.boot ? r.submission.writeback : t('planSent')); closeSheet(); render();
      }, function (e) { busy(btn, false); btn.removeAttribute('data-sure'); clear(btn); add(btn, isLead() ? t('planRemoveNow') : t('planRemoveAsk')); toast(errText(e), true); });
    });
    box.appendChild(h('p', { class: 'note', text: isLead() ? t('planRemoveLead') : t('planRemoveLeadT') }));
    box.appendChild(h('label', { class: 'fld' }, why));
    box.appendChild(h('div', { class: 'actions' }, btn));
    return box;
  }
  /** The form for a new programme. Its fields come from the main file's own table for that indicator and stage. */
  function planAddSheet() {
    var stages = stagesShown(), stg = h('select', { id: 'planStage' }), kp = h('select', { id: 'planKpi' }), body = h('div', { class: 'form', id: 'planBody' });
    stages.forEach(function (x) { var o = h('option', { value: x, text: stageName(x) }); if (x === S.f.stage) o.selected = true; stg.appendChild(o); });
    kpiList().forEach(function (k) { var o = h('option', { value: k.code, text: k.code + ' · ' + kpiName(k.code, k.name) }); if (k.code === S.f.kpi) o.selected = true; kp.appendChild(o); });
    var seq = 0;
    function load() {
      var mine = ++seq;
      clear(body).appendChild(h('div', { class: 'spin' }));
      call('api_planOptions', stg.value, kp.value).then(function (res) { if (mine === seq) paint(JSON.parse(res), 0); }, function (e) { if (mine === seq) { clear(body).appendChild(h('p', { class: 'note warn', id: 'planState', text: errText(e) })); } });
    }
    function paint(o, at) {
      clear(body);
      var tb = o.tables[at];
      if (o.tables.length > 1) {
        var pick = h('select', { id: 'planTable', onchange: function () { paint(o, +pick.value); } });
        o.tables.forEach(function (x, i) { var op = h('option', { value: i, text: (x.sub || t('planTableN') + ' ' + (i + 1)) + ' · ' + x.programmes + ' ' + t('programsWord') }); if (i === at) op.selected = true; pick.appendChild(op); });
        body.appendChild(field(t('planTable'), pick));
      }
      if (!tb.open) { body.appendChild(h('p', { class: 'note warn', id: 'planState', text: tb.reason })); return; }
      if (o.direct && !o.writeBack) { body.appendChild(h('p', { class: 'note warn', id: 'planState', text: t('wbOff') })); return; }
      body.appendChild(h('p', { class: 'note', id: 'planState', text: t('planOpen') + ' ' + tb.free + ' · ' + (o.direct ? t('planDirect') : t('planViaAdmin')) }));
      var inputs = {};
      tb.fields.forEach(function (f) {
        var el;
        if (f.type === 'list') { el = h('select'); el.appendChild(h('option', { value: '', text: '—' })); f.options.forEach(function (x) { el.appendChild(h('option', { value: x, text: x })); }); }
        else if (f.type === 'long') el = h('textarea', { maxlength: '600' });
        else el = h('input', { type: f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text', maxlength: '200', min: f.type === 'number' ? '0' : null });
        el.setAttribute('data-field', f.field || f.id);
        if (f.required) el.required = true;
        if (f.field === 'assignee' && !isLead()) el.value = S.me.name;
        inputs[f.id] = el;
        body.appendChild(field(f.label + (f.required ? ' *' : ''), el));
      });
      var note = h('input', { type: 'text', maxlength: '300' }), send = h('button', { class: 'btn', type: 'submit', id: 'planSend' }, o.direct ? t('planAddNow') : t('planAddAsk'));
      if (!o.direct) body.appendChild(field(t('note'), note));
      body.appendChild(h('div', { class: 'actions' }, send));
      form.onsubmit = function (e) {
        e.preventDefault();
        var values = {};
        Object.keys(inputs).forEach(function (id) { if (inputs[id].value !== '') values[id] = inputs[id].type === 'number' ? Number(inputs[id].value) : inputs[id].value; });
        busy(send, true);
        var payload = JSON.stringify({ type: 'add', stage: o.stage, kpi: o.kpi, table: tb.index, values: values, note: note.value });
        call('api_planRequest', payload).then(function (res) {
          var r = planDone(res, t('planAddTag') + ' · ' + r0(values, tb), payload);
          toast(r.boot ? r.submission.writeback : t('planSent')); closeSheet(); render();
        }, function (er) { busy(send, false); toast(errText(er), true); });
      };
    }
    function r0(values, tb) { var f = tb.fields.filter(function (x) { return x.field === 'name'; })[0]; return f ? String(values[f.id] || '') : ''; }
    stg.addEventListener('change', load); kp.addEventListener('change', load);
    var form = h('form', { class: 'form', id: 'planForm' }, h('div', { class: 'row2' }, field(t('stage'), stg), field(t('indicator'), kp)), body);
    showSheet(isLead() ? t('planAdd') : t('planPropose'), h('p', { class: 'lead', text: t('planLead') }), h('section', { class: 'box' }, form));
    load();
  }

  /* ---------- responsible person, chosen in the platform ---------- */
  function applyAssign(res) {
    var r = JSON.parse(res);
    Object.keys(r.assign).forEach(function (k) { if (r.assign[k]) S.assign[k] = r.assign[k]; else delete S.assign[k]; });
    S.alerts = null;
    return r;
  }
  /** Assigns (or, with an empty email, frees) the programmes, and makes the step undoable. */
  function doAssign(keys, email, label) {
    var payload = JSON.stringify({ keys: keys, email: email }), ref = {};
    return call('api_assign', payload).then(function (res) {
      ref.id = applyAssign(res).undoId;
      record(label, function () { return call('api_undoAssign', ref.id).then(applyAssign); }, function () { return call('api_assign', payload).then(function (again) { ref.id = applyAssign(again).undoId; }); });
    });
  }
  function canHold(u, stage) { return u.active && (u.stages.indexOf('*') !== -1 || u.stages.indexOf(stage) !== -1); }
  function personSelect(id, people, current) {
    var s = h('select', { id: id });
    s.appendChild(h('option', { value: '', text: t('pickPerson') }));
    people.slice().sort(function (a, b) { return a.name < b.name ? -1 : 1; }).forEach(function (u) {
      var o = h('option', { value: u.email, text: u.name + ' · ' + t('r_' + u.role) });
      if (u.email === current) o.selected = true;
      s.appendChild(o);
    });
    return s;
  }
  /** In a programme's sheet: who answers for it in the platform. Admins choose; staff only read. */
  function whoBox(p) {
    if (!isLead() && !chosen(p)) return null;
    var box = h('section', { class: 'box', id: 'whoBox' });
    function paint() {
      clear(box).appendChild(h('h3', { text: t('responsible') }));
      var a = chosen(p);
      if (!isLead()) { box.appendChild(h('p', null, h('b', { text: a.name }), ' · ' + t('chosenBy'))); return; }
      if (!S.users) {
        box.appendChild(h('div', { class: 'spin' }));
        call('api_users').then(function (r) { S.users = JSON.parse(r); paint(); }, function (e) { toast(errText(e), true); });
        return;
      }
      var os = owners(p);
      box.appendChild(a ? h('p', { id: 'whoNow' }, h('span', { class: 'who' }, avatar(os[0] || a, 'sm'), h('b', { text: a.name })), ' · ' + t('chosenBy'))
        : os.length ? h('p', { id: 'whoNow' }, h('b', { text: os.map(function (u) { return u.name; }).join('، ') }), ' · ' + t('fromFile'))
          : h('p', { class: 'note warn', id: 'whoNow', text: t('nobodyHere') }));
      var people = S.users.filter(function (u) { return canHold(u, p.stage); }), pick = personSelect('whoPick', people, a ? a.email : '');
      var save = h('button', { class: 'btn', type: 'submit', id: 'whoSave' }, t('assignSave'));
      var act = function (email, label, msg) {
        busy(save, true);
        doAssign([p.key], email, label + ' · ' + p.name).then(function () { toast(t(msg)); paint(); render(); }, function (e) { busy(save, false); toast(errText(e), true); });
      };
      box.appendChild(h('form', { class: 'form', onsubmit: function (e) { e.preventDefault(); if (pick.value) act(pick.value, t('assignSave'), 'assigned1'); } },
        field(t('assignTo'), pick, t('assignLead')),
        h('div', { class: 'actions' }, save, a ? h('button', { class: 'btn ghost', type: 'button', id: 'whoRemove', onclick: function () { act('', t('assignRemove'), 'unassigned1'); } }, t('assignRemove')) : null)));
    }
    paint();
    return box;
  }
  /** Assign every programme of a filtered list in one step. */
  function assignSheet(list) {
    var body = h('section', { class: 'box', id: 'assignBox' });
    showSheet(t('assignTitle'), h('p', { class: 'lead', text: t('assignLead') }), body);
    (function paint() {
      clear(body);
      if (!S.users) {
        body.appendChild(h('div', { class: 'spin' }));
        call('api_users').then(function (r) { S.users = JSON.parse(r); paint(); }, function (e) { toast(errText(e), true); });
        return;
      }
      var stages = [];
      list.forEach(function (p) { if (stages.indexOf(p.stage) === -1) stages.push(p.stage); });
      var people = S.users.filter(function (u) { return stages.every(function (s) { return canHold(u, s); }); });
      var only = h('input', { type: 'checkbox', checked: true, id: 'assignOnlyFree' }), pick = personSelect('assignWho', people, '');
      var go2 = h('button', { class: 'btn', type: 'submit', id: 'assignDo' });
      var targets = function () { return list.filter(function (p) { return !only.checked || !owners(p).length; }).slice(0, 500); };
      var refresh = function () { var n = targets().length; clear(go2); add(go2, t('assignSave') + ' (' + n + ')'); go2.disabled = !pick.value || !n; };
      only.addEventListener('change', refresh); pick.addEventListener('change', refresh);
      body.appendChild(h('form', { class: 'form', id: 'assignForm', onsubmit: function (e) {
        e.preventDefault();
        var keys = targets().map(function (p) { return p.key; }), name = pick.options[pick.selectedIndex].text.split(' · ')[0];
        if (!keys.length || !pick.value) return;
        busy(go2, true);
        doAssign(keys, pick.value, t('assignSave') + ' ' + keys.length + ' · ' + name).then(function () { toast(t('assignedN') + ' ' + keys.length); closeSheet(); render(); },
          function (er) { busy(go2, false); toast(errText(er), true); });
      } }, h('p', { class: 'note' }, h('b', { text: list.length }), ' ' + t('results') + ' · ' + stages.map(stageName).join('، ')),
        stages.length > 1 ? h('p', { class: 'note warn', text: t('assignStageHint') }) : null,
        field(t('assignTo'), pick), h('label', { class: 'check' }, only, t('assignOnlyFree')), h('div', { class: 'actions' }, go2)));
      refresh();
    })();
  }
  function applyWrite(res) { var r = JSON.parse(res); if (r.program) replaceProgram(r.program); }
  function applyReview(res) {
    var r = JSON.parse(res);
    if (r.boot) apply(r.boot);          // a plan change: the whole plan was read again from the main file
    else S.submissions = S.submissions.map(function (x) { return x.id === r.submission.id ? r.submission : x; });
    if (r.program) replaceProgram(r.program);
    return r;
  }
  function editForm(p) {
    var eDone = h('input', { type: 'checkbox', checked: !!p.done }), eAct = h('input', { type: 'number', min: '0', inputmode: 'numeric', value: p.actual != null ? p.actual : '' });
    var eEv = h('input', { type: 'url', dir: 'ltr', placeholder: 'https://', value: /^https:\/\//i.test(p.evidence || '') ? p.evidence : '' }), eCom = h('textarea', { value: p.comment || '' });
    // Only the fields this programme's table really has in the main file are offered.
    var c = p.c || {}, canComment = (S.me.role === 'owner' || S.me.role === 'principal') && !!c.comment;
    var lacks = ['done', 'actual', 'evidence'].filter(function (k) { return !c[k]; }).map(function (k) { return t('col_' + k); });
    if (p.execClosed) return h('div', { class: 'note warn', id: 'execClosed', text: t('execClosedMsg') });
    if (!c.done && !c.actual && !c.evidence && !canComment) return h('div', { class: 'note warn', id: 'editNone', text: t('noCols') });
    var saveBtn = h('button', { class: 'btn', type: 'submit', disabled: !S.settings.writeBack }, t('save'));
    return h('form', { class: 'form', id: 'editForm', onsubmit: function (e) {
      e.preventDefault();
      var d = {};
      if (c.done) d.done = eDone.checked;
      if (c.evidence) d.evidence = eEv.value.trim();
      if (c.actual) d.actual = eAct.value === '' ? '' : Number(eAct.value);
      if (canComment) d.comment = eCom.value;
      busy(saveBtn, true);
      call('api_updateExecution', p.key, JSON.stringify(d)).then(function (res) {
        var r = JSON.parse(res);
        if (r.program) replaceProgram(r.program);
        if (r.ok && r.undoId) {
          var ref = { id: r.undoId }, key = p.key;
          record(t('edit') + ' · ' + p.name, function () { return call('api_undoExecution', ref.id).then(applyWrite); },
            function () { return call('api_updateExecution', key, JSON.stringify(d)).then(function (again) { applyWrite(again); ref.id = JSON.parse(again).undoId; }); });
        }
        toast(r.message || t('saved'), !r.ok); closeSheet(); render();
      }, function (er) { busy(saveBtn, false); toast(errText(er), true); });
    } },
      c.done ? h('label', { class: 'check' }, eDone, t('markDone')) : null,
      c.actual || c.evidence ? h('div', { class: 'row2' }, c.actual ? field(t('actualN'), eAct) : null, c.evidence ? field(t('evidenceUrl'), eEv, t('evidenceHint')) : null) : null,
      c.evidence ? evidenceUpload(eEv, function () { return { programKey: p.key }; }) : null,
      canComment ? field(t('comment'), eCom) : null,
      lacks.length ? h('div', { class: 'note', id: 'editLacks', text: t('lacksCols') + ' ' + lacks.join(S.lang === 'en' ? ', ' : '، ') }) : null,
      h('div', { class: 'actions' }, saveBtn));
  }
  /* ---------- evidence: a photo or PDF from the device ---------- */
  /** Reads the chosen file. A photo is first shrunk so its longer side is at most 1600 px and saved as JPEG; a PDF is sent as it is. */
  function fileForUpload(file) {
    var bad = function () { return new Error('INPUT|' + t('uploadBad')); };
    return new Promise(function (res, rej) {
      var reader = new FileReader();
      reader.onerror = function () { rej(bad()); };
      reader.onload = function () {
        var url = String(reader.result || ''), cut = url.indexOf(',') + 1;
        if (file.type === 'application/pdf') { res({ name: file.name, mime: 'application/pdf', data: url.slice(cut) }); return; }
        var img = new Image();
        img.onerror = function () { rej(bad()); };
        img.onload = function () {
          try {
            var k = Math.min(1, 1600 / Math.max(img.width, img.height)), c = document.createElement('canvas'), ctx = c.getContext('2d');
            c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
            ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, c.width, c.height);
            ctx.drawImage(img, 0, 0, c.width, c.height);
            var out = c.toDataURL('image/jpeg', 0.82);
            res({ name: file.name, mime: 'image/jpeg', data: out.slice(out.indexOf(',') + 1) });
          } catch (e) { rej(bad()); }
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    });
  }
  /** A button that uploads a photo or PDF and puts its link in the evidence box. target() says which programme or indicator it is for. */
  function evidenceUpload(ev, target) {
    var file = h('input', { type: 'file', accept: 'image/*,application/pdf', class: 'vh', 'data-evfile': '1', 'aria-label': t('uploadBtn') });
    var status = h('small', { class: 'upstat', role: 'status' }), btn = h('button', { class: 'btn ghost sm', type: 'button', 'data-evbtn': '1', onclick: function () { file.click(); } }, ic('upload'), t('uploadBtn'));
    file.addEventListener('change', function () {
      var f = file.files && file.files[0];
      if (!f) return;
      var isPdf = f.type === 'application/pdf';
      if ((!isPdf && !/^image\//.test(f.type)) || f.size > (isPdf ? 5e6 : 3e7)) { toast(t('uploadBad'), true); file.value = ''; return; }
      busy(btn, true); status.textContent = t('uploading');
      fileForUpload(f).then(function (o) {
        var tg = target();
        o.programKey = tg.programKey || ''; o.stage = tg.stage || ''; o.kpi = tg.kpi || '';
        return call('api_uploadEvidence', JSON.stringify(o));
      }).then(function (res) {
        var r = JSON.parse(res);
        ev.value = r.url; status.textContent = t('uploaded') + ' ' + r.name; busy(btn, false); file.value = '';
        toast(r.message || t('uploaded'), r.shared === false);
      }, function (e) { busy(btn, false); status.textContent = ''; file.value = ''; toast(errText(e), true); });
    });
    return h('div', { class: 'upl' }, btn, file, status);
  }

  function reportForm(base) {
    var name = 'o' + Math.random().toString(36).slice(2, 7), radios = h('div', { class: 'radios', role: 'radiogroup', 'aria-label': t('outcome') });
    [['done', t('oDone')], ['partial', t('oPartial')], ['postponed', t('oPostponed')]].forEach(function (o, i) { radios.appendChild(h('label', null, h('input', { type: 'radio', name: name, value: o[0], checked: i === 0 }), o[1])); });
    var title = h('input', { type: 'text', maxlength: '160', required: true }), stg = h('select'), kp = h('select');
    S.me.stages.forEach(function (s) { var o = h('option', { value: s, text: stageName(s) }); if (s === S.f.stage) o.selected = true; stg.appendChild(o); });
    Object.keys(KPI_EN).forEach(function (c) { var k = kpiList().filter(function (x) { return x.code === c; })[0]; kp.appendChild(h('option', { value: c, text: c + ' · ' + kpiName(c, k && k.name) })); });
    var date = h('input', { type: 'date', value: S.today, max: S.today }), num = h('input', { type: 'number', min: '0', inputmode: 'numeric' });
    var ev = h('input', { type: 'url', dir: 'ltr', placeholder: 'https://' }), note = h('textarea', { maxlength: '1000' });
    var btn = h('button', { class: 'btn', type: 'submit' }, t('send'));
    return h('form', { class: 'form', 'data-form': base.type, onsubmit: function (e) {
      e.preventDefault();
      var d = { type: base.type, programKey: base.programKey || '', outcome: (radios.querySelector('input:checked') || {}).value || 'done', execDate: date.value, actual: num.value === '' ? '' : Number(num.value), evidence: ev.value.trim(), note: note.value };
      if (base.type === 'contribution') { d.stage = stg.value; d.kpi = kp.value; d.title = title.value; }
      busy(btn, true);
      call('api_submit', JSON.stringify(d)).then(function (res) {
        var s = JSON.parse(res), ref = { id: s.id };
        S.submissions = S.submissions.filter(function (x) { return x.id !== s.id; }).concat([s]);
        record(t('report') + ' · ' + s.title, function () {
          return call('api_withdraw', ref.id).then(function () { S.submissions = S.submissions.filter(function (x) { return x.id !== ref.id; }); });
        }, function () {
          return call('api_submit', JSON.stringify(d)).then(function (r2) { var n = JSON.parse(r2); ref.id = n.id; S.submissions = S.submissions.filter(function (x) { return x.id !== n.id; }).concat([n]); });
        });
        toast(t('sent')); closeSheet(); render();
      }, function (er) { busy(btn, false); toast(errText(er), true); });
    } },
      base.type === 'contribution' ? [h('div', { class: 'row2' }, field(t('stage'), stg), field(t('indicator'), kp)), field(t('workTitle'), title)] : h('div', { class: 'fld' }, h('span', { text: t('outcome') }), radios),
      h('div', { class: 'row2' }, field(t('execDate'), date), field(t('actualN'), num)),
      field(t('evidenceUrl'), ev, t('evidenceHint')),
      evidenceUpload(ev, function () { return base.type === 'contribution' ? { stage: stg.value, kpi: kp.value } : { programKey: base.programKey }; }),
      field(t('note'), note), h('div', { class: 'actions' }, btn));
  }

  /* ---------- reports ---------- */
  function subCard(s, withActions) {
    var c = h('div', { class: 'card', 'data-sub': s.id });
    c.appendChild(h('div', { class: 'meta' }, pill(s.status, t(s.status)), h('span', { class: 'code', text: s.kpi }), h('span', { class: 'tag', text: stageName(s.stage) })));
    var plan = s.type === 'add' || s.type === 'remove';
    if (plan) c.firstChild.appendChild(h('span', { class: 'pill ' + (s.type === 'add' ? 'p-active' : 'p-overdue'), 'data-kind': s.type, text: t(s.type === 'add' ? 'planAddTag' : 'planRemoveTag') }));
    c.appendChild(h('h3', { text: s.title }));
    if (plan) {
      var shown = [];
      try { shown = (JSON.parse(s.data || '{}').show || []).map(function (x) { return [String(x[0]), String(x[1])]; }); } catch (e) { shown = []; }
      c.appendChild(kv([[t('by'), s.byName + ' · ' + fmtTime(s.createdAt)]].concat(shown, [[t('note'), s.note], [t('reviewNote'), s.reviewNote], [t('writeback'), s.writeback]])));
    } else
    c.appendChild(kv([[t('by'), s.byName + ' · ' + fmtTime(s.createdAt)], [t('outcome'), t({ done: 'oDone', partial: 'oPartial', postponed: 'oPostponed' }[s.outcome] || 'oDone')], [t('execDate'), fmtDate(s.execDate)],
      [t('actualN'), s.actual === '' ? '' : s.actual], [t('evidence'), s.evidence ? evidenceNode(s.evidence) : ''], [t('note'), s.note], [t('reviewNote'), s.reviewNote], [t('writeback'), s.writeback]]));
    if (withActions && s.status === 'pending') {
      var note = h('input', { type: 'text', maxlength: '500', 'aria-label': t('reviewNote'), placeholder: t('reviewNote') });
      var ok = h('button', { class: 'btn sm', type: 'button', 'data-act': 'approve' }, ic('done'), t('approve')), no = h('button', { class: 'btn bad sm', type: 'button', 'data-act': 'return' }, t('ret'));
      var decide = function (d) { return function () {
        busy(ok, true); busy(no, true);
        var said = note.value;
        call('api_review', s.id, d, said).then(function (res) {
          var r = applyReview(res);
          record(t(d === 'approved' ? 'approve' : 'ret') + ' · ' + s.title, function () { return call('api_reopen', s.id).then(applyReview); }, function () { return call('api_review', s.id, d, said).then(applyReview); });
          toast(d === 'approved' ? t('approvedOk') + (r.submission.writeback ? ' ' + r.submission.writeback : '') : t('returnedOk')); render();
        }, function (er) { busy(ok, false); busy(no, false); toast(errText(er), true); });
      }; };
      ok.addEventListener('click', decide('approved')); no.addEventListener('click', decide('returned'));
      c.appendChild(h('label', { class: 'fld' }, note));
      c.appendChild(h('div', { class: 'actions' }, ok, no, s.programKey ? h('button', { class: 'btn ghost sm', type: 'button', onclick: function () { openSheet(s.programKey); } }, t('program')) : null));
    }
    return c;
  }
  function vReview() {
    var v = h('div', { class: 'view' }), subs = S.submissions.filter(function (s) { return stageOk(s.stage); });
    var pend = subs.filter(function (s) { return s.status === 'pending'; }), dec = subs.filter(function (s) { return s.status !== 'pending'; }).reverse().slice(0, 60);
    v.appendChild(h('p', { class: 'lead', text: t('reviewLead') }));
    v.appendChild(tabsRow([['pending', t('pending') + ' (' + pend.length + ')'], ['decided', t('decided') + ' (' + dec.length + ')']], S.reviewTab, function (k) { S.reviewTab = k; paintMain(); }));
    var list = S.reviewTab === 'pending' ? pend : dec;
    if (!list.length) v.appendChild(h('div', { class: 'empty', text: t('queueEmpty') }));
    else { var g = h('div', { class: 'cards' }); list.forEach(function (s) { g.appendChild(subCard(s, true)); }); v.appendChild(g); }
    return v;
  }
  function vMine() {
    var v = h('div', { class: 'view' });
    var mineSubs = S.submissions.filter(function (s) { return String(s.by).toLowerCase() === S.me.email; }).reverse();
    var sec1 = h('section', { class: 'stack' }, h('h2', { text: t('myReports') }));
    if (!mineSubs.length) sec1.appendChild(h('div', { class: 'empty', text: t('noReports') }));
    else { var g = h('div', { class: 'cards' }); mineSubs.forEach(function (s) { g.appendChild(subCard(s, false)); }); sec1.appendChild(g); }
    v.appendChild(sec1);
    var mp = S.programs.filter(function (p) { return inScope(p) && isMine(p); }).sort(function (a, b) { return (a.from || '9') < (b.from || '9') ? -1 : 1; });
    var sec2 = h('section', { class: 'stack' }, h('h2', { text: t('myPrograms') + ' (' + mp.length + ')' }));
    if (!mp.length) sec2.appendChild(h('div', { class: 'empty', text: t('noMine') }));
    else { var l = h('div', { class: 'plist' }); mp.forEach(function (p) { l.appendChild(prow(p, true)); }); sec2.appendChild(l); }
    v.appendChild(sec2);
    v.appendChild(h('section', { class: 'panel' }, h('h2', { text: t('addWork') }), h('p', { class: 'note', text: t('addWorkLead') }), reportForm({ type: 'contribution' })));
    return v;
  }

  /* ---------- data checks ---------- */
  function vChecks() {
    var v = h('div', { class: 'view' }), ps = S.programs.filter(inScope);
    if (!loadUsers(v)) return v;
    v.appendChild(h('p', { class: 'lead', text: t('checksLead') }));
    var g = h('div', { class: 'cards' });
    CHECKS.forEach(function (c) {
      var n = ps.filter(c[1]).length;
      g.appendChild(h('button', { class: 'checkc ' + (n ? 'some' : 'zero'), type: 'button', 'data-check': c[0], onclick: function () { go('programs', { status: 'check:' + c[0] }); } }, h('span', { text: t('c_' + c[0]) }), h('b', { text: n })));
    });
    v.appendChild(g);
    return v;
  }

  /* ---------- weekly report: one printable page per school or stage ---------- */
  function vWeekly() {
    var v = h('div', { class: 'view report', id: 'weeklyReport' });
    if (!S.weekly) {
      v.appendChild(h('div', { class: 'spin' }));
      call('api_weekly').then(function (r) { S.weekly = JSON.parse(r); if (S.view === 'weekly') paintMain(); }, function (e) { toast(errText(e), true); });
      return v;
    }
    var d = S.weekly, keys = Object.keys(d.schools), sum = S.f.stage ? d.stages[S.f.stage] : d.schools[S.school] || d.schools[keys[0]];
    if (!sum) { v.appendChild(h('div', { class: 'empty', text: t('none') })); return v; }
    var c = sum.counts, sendBtn = h('button', { class: 'btn ghost sm', type: 'button', id: 'weeklyMail' }, ic('alerts'), t('weeklyMail'));
    sendBtn.addEventListener('click', function () {
      busy(sendBtn, true);
      call('api_sendMyWeekly').then(function () { busy(sendBtn, false); toast(t('weeklySent')); }, function (e) { busy(sendBtn, false); toast(errText(e), true); });
    });
    v.appendChild(h('div', { class: 'headrow' },
      h('div', { class: 'hello-logo' }, h('span', { class: 'plate' }, h('img', { src: IMG.mark, alt: '' })),
        h('div', { class: 'hello' }, h('b', { id: 'weeklyWho', text: S.f.stage ? stageName(S.f.stage) : schoolName(S.school || keys[0]) }),
          h('p', { class: 'lead' }, t('title') + ' · ' + t('weekly') + ' · ', h('bdi', { text: fmtDate(d.today) }), ' – ', h('bdi', { text: fmtDate(d.to) }), S.f.stage ? null : ' · ' + sum.stages.map(stageName).join('، ')))),
      h('div', { class: 'actions noprint' }, h('button', { class: 'btn sm', type: 'button', id: 'weeklyPrint', onclick: function () { window.print(); } }, ic('weekly'), t('print')), sendBtn)));

    // the rings, and the numbers beside them with the change since the last record
    var n = { total: sum.total, grades: sum.grades };
    ST.forEach(function (k) { n[k] = c[k]; });
    var tb = h('tbody');
    ST.forEach(function (k) {
      var diff = sum.prev ? c[k] - sum.prev[k] : null;
      tb.appendChild(h('tr', { 'data-state': k }, h('td', null, h('span', { class: 'who' }, h('i', { class: 'sw f-' + k }), t(k))), h('td', { class: 'num', text: c[k] }),
        h('td', { class: 'num', text: share(c[k], sum.total) + '%' }), sum.prev ? h('td', { class: 'num' }, h('bdi', { class: 'ltr', text: diff ? (diff > 0 ? '+' : '−') + Math.abs(diff) : '—' })) : null));
    });
    v.appendChild(h('section', { class: 'panel' }, h('div', { class: 'headrow' }, h('h2', { text: t('weeklyState') }),
        h('span', { class: 'lead', id: 'weeklyDelta', text: sum.prev ? t('sinceLast') + ' ' + fmtDate(sum.prev.date) : t('noPrev') })),
      h('div', { class: 'mon-body' },
        h('div', { class: 'dial', role: 'img', 'aria-label': t('done') + ' ' + sum.pct + '%' }, ringsSvg(n, true), h('div', { class: 'dial-c' }, h('b', { id: 'weeklyPct', text: sum.pct + '%' }), h('span', { text: t('done') }), h('small', { text: c.done + ' ' + t('ofN') + ' ' + sum.total }))),
        h('div', { class: 'tw flat' }, h('table', { id: 'weeklyStates' }, h('thead', null, h('tr', null, h('th', { text: t('status') }), h('th', { text: t('programsCol') }), h('th', { text: '%' }), sum.prev ? h('th', { text: t('change') }) : null)), tb))),
      h('p', { class: 'lead', id: 'weeklyNotes' }, t('pendingReview') + ': ', h('b', { text: sum.pending }), ' · ' + t('c_noowner') + ': ', h('b', { text: sum.free }))));

    var table = function (id, title, lead, heads, rows, cells) {
      var body = h('tbody');
      rows.forEach(function (r) { var tr = h('tr'); cells(r).forEach(function (x, i) { tr.appendChild(h('td', { class: typeof x === 'number' ? 'num' : null }, i === 0 ? h('span', { class: 'nm' }, x) : x)); }); body.appendChild(tr); });
      return h('section', { class: 'panel', id: id }, h('div', null, h('h2', { text: title }), lead ? h('p', { class: 'lead', text: lead }) : null),
        rows.length ? h('div', { class: 'tw flat' }, h('table', null, h('thead', null, h('tr', null, heads.map(function (x) { return h('th', { text: x }); }))), body)) : h('div', { class: 'empty', text: t('none') }));
    };
    var more = function (shown, total) { return total > shown ? t('showing') + ' ' + shown + ' ' + t('ofN') + ' ' + total : ''; };
    var many = sum.stages.length > 1, withStage = function (heads) { return many ? heads.slice(0, 2).concat([t('stage')], heads.slice(2)) : heads; };
    var row = function (r, rest) { return [r.name, h('span', { class: 'code', text: r.kpi })].concat(many ? [stageName(r.stage)] : [], rest); };
    var day = function (x) { return h('bdi', { class: 'nowrap', text: fmtDate(x) }); };
    v.appendChild(table('weeklyLate', t('weeklyLate') + ' (' + sum.lateTotal + ')', more(sum.late.length, sum.lateTotal), withStage([t('program'), t('indicator'), t('endDate'), t('daysLate'), t('responsibleShort')]), sum.late,
      function (r) { return row(r, [day(r.to), r.days, r.who || '—']); }));
    v.appendChild(table('weeklyAhead', t('weeklyAhead') + ' (' + sum.aheadTotal + ')', more(sum.ahead.length, sum.aheadTotal), withStage([t('program'), t('indicator'), t('startDate'), t('responsibleShort')]), sum.ahead,
      function (r) { return row(r, [day(r.from), r.who || '—']); }));
    v.appendChild(table('weeklyInd', t('byIndicator'), '', [t('indicator'), t('done'), t('overdue'), t('status')], sum.indicators,
      function (r) { return [h('span', null, h('span', { class: 'code', text: r.code }), ' ' + kpiName(r.code, r.name)), h('bdi', { text: r.done + ' / ' + r.n }), r.overdue, statePill(r.state, r.pct)]; }));
    v.appendChild(table('weeklyPeople', t('people'), more(sum.people.length, sum.peopleTotal), [t('person'), t('assigned'), t('done'), t('active'), t('overdue')], sum.people,
      function (r) { return [r.name, r.n, r.done, r.active, r.overdue]; }));
    return v;
  }

  /* ---------- notifications ---------- */
  function vAlerts() {
    var v = h('div', { class: 'view' });
    if (!S.alerts) { v.appendChild(h('div', { class: 'spin' })); call('api_notifications').then(function (r) { S.alerts = JSON.parse(r); paintMain(); }, function (e) { toast(errText(e), true); }); return v; }
    var a = S.alerts, testBtn = h('button', { class: 'btn ghost sm', type: 'button', id: 'testMe' }, ic('alerts'), t('testMe'));
    testBtn.addEventListener('click', function () { busy(testBtn, true); call('api_sendMyNotification').then(function () { toast(t('testSent')); busy(testBtn, false); }, function (e) { toast(errText(e), true); busy(testBtn, false); }); });
    var list = a.list.map(function (r) { return { rec: r, items: r.items.filter(function (it) { return stageOk(it.stage); }) }; }).filter(function (x) { return x.items.length; });
    v.appendChild(h('section', { class: 'panel' },
      h('div', { class: 'headrow' }, h('div', null, h('h2', { text: t('sendAt') + ' ' }, h('bdi', { class: 'ltr', text: a.time })), h('p', { class: 'lead', text: t('alertsLead') })), testBtn),
      h('p', { class: 'note', text: t('alertsRules') }),
      a.on ? null : h('p', { class: 'note warn', text: t('notifyOff') }), h('p', { class: 'note' + (a.whatsappAuto ? '' : ' warn'), text: a.whatsappAuto ? t('waAuto') : t('waManual') })));
    v.appendChild(h('h2', { text: list.length + ' ' + t('recipients') }));
    if (!list.length) { v.appendChild(h('div', { class: 'empty', text: t('noAlerts') })); return v; }
    var g = h('div', { class: 'cards' });
    list.forEach(function (x) {
      var r = x.rec, c = h('div', { class: 'card', 'data-alert': r.email }), kinds = h('div', { class: 'meta' });
      ['d3', 'd1', 'd0', 'e1', 'o1', 'o7'].forEach(function (k) { var n = x.items.filter(function (it) { return it.kind === k; }).length; if (n) kinds.appendChild(h('span', { class: 'tag', text: n + ' ' + t('k_' + k) })); });
      c.appendChild(h('div', { class: 'meta' }, pill(/sent/.test(r.status) ? 'done' : 'soon', /sent/.test(r.status) ? t('st_sent') : t('st_wait')), h('span', { class: 'tag', text: t('ch_' + r.channel) }), h('span', { class: 'tag', text: t('role_' + x.items[0].role) })));
      c.appendChild(h('h3', { text: r.name }));
      c.appendChild(kinds);
      var ul = h('ul', { class: 'mini' });
      x.items.slice(0, 4).forEach(function (it) { ul.appendChild(h('li', null, h('b', { text: it.name }), ' · ' + t('k_' + it.kind))); });
      if (x.items.length > 4) ul.appendChild(h('li', { text: '+ ' + (x.items.length - 4) }));
      c.appendChild(ul);
      if (/^\d{8,15}$/.test(r.phone || '')) c.appendChild(h('div', { class: 'actions' }, h('a', { class: 'btn sm wa', href: 'https://wa.me/' + r.phone + '?text=' + encodeURIComponent(r.text), target: '_blank', rel: 'noopener noreferrer' }, t('sendWa'))));
      g.appendChild(c);
    });
    v.appendChild(g);
    return v;
  }

  /* ---------- people: monitor by teacher ---------- */
  function loadUsers(v) {
    if (S.users) return true;
    v.appendChild(h('div', { class: 'spin' }));
    call('api_users').then(function (r) { S.users = JSON.parse(r); paintMain(); }, function (e) { toast(errText(e), true); });
    return false;
  }
  /** A thin bar split by state, for rows of a list. The numbers sit beside it in the row. */
  function stateBar(c) {
    var bar = h('span', { class: 'bar2', role: 'img', 'aria-label': ST.map(function (x) { return t(x) + ' ' + c[x]; }).join(', ') });
    ST.forEach(function (x) { if (!c[x]) return; var seg = h('i', { class: 'f-' + x, title: t(x) + ': ' + c[x] }); seg.style.flex = String(c[x]); bar.appendChild(seg); });
    return bar;
  }
  function vPeople() {
    var v = h('div', { class: 'view' });
    v.appendChild(h('p', { class: 'lead', text: t('peopleLead') }));
    if (!loadUsers(v)) return v;
    var ps = S.programs.filter(inScope), shown = stagesShown(), mineOf = {}, free = [];
    ps.forEach(function (p) {
      var os = owners(p);
      if (!os.length) free.push(p);
      os.forEach(function (u) { (mineOf[u.email] = mineOf[u.email] || []).push(p); });
    });
    if (free.length) v.appendChild(h('div', { class: 'note warn headrow', id: 'freeNote' }, h('span', null, h('b', { id: 'freeCount', text: free.length }), ' ' + t('freeLead')),
      h('button', { class: 'btn sm', type: 'button', id: 'freeOpen', onclick: function () { go('programs', { status: 'check:noowner' }); } }, t('freeOpen'))));
    var rows = S.users.filter(function (u) { return u.active && (u.stages.indexOf('*') !== -1 || u.stages.some(function (x) { return shown.indexOf(x) !== -1; })); }).map(function (u) {
      var mine = mineOf[u.email] || [];
      var subs = S.submissions.filter(function (x) { return String(x.by).toLowerCase() === u.email && stageOk(x.stage); });
      return { u: u, n: mine.length, c: counts(mine), pend: subs.filter(function (x) { return x.status === 'pending'; }).length, ok: subs.filter(function (x) { return x.status === 'approved'; }).length };
    }).sort(function (a, b) { return b.c.overdue - a.c.overdue || b.n - a.n; });
    var tb = h('tbody');
    rows.forEach(function (r) {
      var open = function () { go('programs', { person: r.u.email }); };
      tb.appendChild(h('tr', { class: 'click', tabindex: '0', 'data-person': r.u.email, onclick: open, onkeydown: function (e) { if (e.key === 'Enter') open(); } },
        h('td', null, h('span', { class: 'who' }, avatar(r.u), h('span', null, h('span', { class: 'nm', text: r.u.name }), h('small', { text: t('r_' + r.u.role) })))),
        h('td', { class: 'num', text: r.n }), h('td', null, r.n ? stateBar(r.c) : '—'), h('td', { class: 'num', text: r.c.done }), h('td', { class: 'num', text: r.c.active }), h('td', { class: 'num', text: r.c.soon }),
        h('td', { class: 'num' }, r.c.overdue ? pill('overdue', String(r.c.overdue)) : '0'),
        h('td', { class: 'num' }, r.pend ? pill('pending', r.pend + ' ' + t('pending')) : null, r.ok ? ' ' + r.ok + ' ' + t('approved') : (r.pend ? '' : '—'))));
    });
    v.appendChild(h('div', { class: 'tw' }, h('table', { id: 'peopleTable' }, h('thead', null, h('tr', null, h('th', { text: t('person') }), h('th', { text: t('assigned') }), h('th', { text: t('progressCol') }), h('th', { text: t('done') }), h('th', { text: t('active') }), h('th', { text: t('soon') }), h('th', { text: t('overdue') }), h('th', { text: t('reportsCol') }))), tb)));
    var groups = {};
    free.forEach(function (p) { if (!p.assignee) return; var k = p.assignee.trim(), g = groups[k] = groups[k] || { n: 0, late: 0 }; g.n++; if (statusOf(p) === 'overdue') g.late++; });
    var names = Object.keys(groups).sort(function (a, b) { return groups[b].n - groups[a].n; }).slice(0, 18);
    if (names.length) {
      var box = h('div', { class: 'chips wrap' });
      names.forEach(function (k) { box.appendChild(h('button', { class: 'chip', type: 'button', onclick: function () { go('programs', { q: k }); } }, k, h('b', { text: groups[k].n }), groups[k].late ? pill('overdue', String(groups[k].late)) : null)); });
      v.appendChild(h('section', { class: 'panel' }, h('h2', { text: t('unlinked') }), h('p', { class: 'lead', text: t('unlinkedLead') }), box));
    }
    return v;
  }

  /* ---------- calendars ---------- */
  function shiftMonth(m, n) { var b = m.split('-'); return new Date(Date.UTC(+b[0], +b[1] - 1 + n, 1)).toISOString().slice(0, 7); }
  function calHead(onChange) {
    var m = S.cal.month, label = fmt({ month: 'long', year: 'numeric', timeZone: 'UTC' }, new Date(m + '-01T00:00:00Z'));
    var move = function (n) { return function () { S.cal = { month: shiftMonth(S.cal.month, n), day: S.cal.day }; onChange(); }; };
    return h('div', { class: 'calhead' }, h('button', { class: 'nb', type: 'button', id: 'calPrev', 'aria-label': t('back'), onclick: move(-1) }, ic('back', 'flip')), h('b', { id: 'calMonth', text: label }),
      h('button', { class: 'nb', type: 'button', id: 'calNext', 'aria-label': t('forward'), onclick: move(1) }, ic('fwd', 'flip')),
      h('button', { class: 'btn ghost sm', type: 'button', onclick: function () { S.cal = { month: S.today.slice(0, 7), day: S.today }; onChange(); } }, t('todayBtn')));
  }
  /** A month as a grid of days, Sunday first. cellFn(day) returns what to show inside a day. */
  function monthGrid(cellFn, onPick) {
    var month = S.cal.month, first = new Date(month + '-01T00:00:00Z'), lead = first.getUTCDay(), days = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    var grid = h('div', { class: 'cal' }), i, d;
    for (i = 0; i < 7; i++) grid.appendChild(h('span', { class: 'cal-h' + (i > 4 ? ' we' : ''), text: fmt({ weekday: 'short', timeZone: 'UTC' }, new Date(Date.UTC(2026, 10, 15 + i))) }));
    for (i = 0; i < lead; i++) grid.appendChild(h('span', { class: 'cal-x' }));
    for (d = 1; d <= days; d++) (function (d) {
      var day = month + '-' + (d < 10 ? '0' : '') + d, wd = (lead + d - 1) % 7;
      var wk = wd === 0 ? weekTag(day) : '';
      var cell = h('button', { class: 'cal-d' + (day === S.today ? ' today' : '') + (day === S.cal.day ? ' sel' : '') + (wd > 4 ? ' off' : '') + (day < S.today ? ' past' : ''), type: 'button', 'data-day': day, 'aria-pressed': String(day === S.cal.day), onclick: function () { onPick(day); } },
        h('span', { class: 'cal-top' }, h('b', { text: d }), wk ? h('span', { class: 'cal-w', text: wk }) : null));
      add(cell, cellFn(day));
      grid.appendChild(cell);
    })(d);
    return grid;
  }
  /** On Sundays: which week of which term starts here, from the term dates in the settings. */
  function weekTag(day) {
    var ts = S.settings.termStarts || {}, term = ts[2] && day >= ts[2] ? 2 : ts[1] && day >= ts[1] ? 1 : 0;
    if (!term) return '';
    var w = Math.floor(daysBetween(ts[term], day) / 7) + 1;
    return w > 20 ? '' : (S.lang === 'en' ? 'T' + term + ' · W' + w : 'ف' + term + ' · أ' + w);
  }
  function pickDay(day) { S.cal = { month: S.cal.month, day: day }; paintMain(); }
  function vCalendar() {
    var v = h('div', { class: 'view' }), ps = S.programs.filter(function (p) { return inScope(p) && p.from && (!S.f.kpi || p.kpi === S.f.kpi); });
    var byStart = {}, byEnd = {};
    ps.forEach(function (p) { (byStart[p.from] = byStart[p.from] || []).push(p); var to = p.to || p.from; if (to !== p.from) (byEnd[to] = byEnd[to] || []).push(p); });
    v.appendChild(h('p', { class: 'lead', text: t('calLead') }));
    v.appendChild(h('div', { class: 'headrow' }, calHead(render),
      sel(t('indicator'), S.f.kpi, [['', t('all')]].concat(kpiList().map(function (k) { return [k.code, k.code + ' · ' + kpiName(k.code, k.name)]; })), function (val) { S.f.kpi = val; render(); })));
    var lg = h('div', { class: 'legend' });
    ST.slice(0, 5).forEach(function (x) { lg.appendChild(h('span', null, h('i', { class: 'sw f-' + x }), t(x))); });
    v.appendChild(lg);
    v.appendChild(monthGrid(function (day) {
      var st = byStart[day] || [], en = byEnd[day] || [], out = [];
      var seen = {}, names = [];
      st.forEach(function (p) { if (!seen[p.name]) { seen[p.name] = { p: p, n: 0 }; names.push(p.name); } seen[p.name].n++; });
      names.slice(0, 2).forEach(function (n) { var x = statusOf(seen[n].p); out.push(h('span', { class: 'cal-p s-' + x + (x === 'active' ? ' g' + grade(progressOf(seen[n].p)) : '') }, h('span', { text: n }))); });
      if (names.length > 2) out.push(h('span', { class: 'cal-more', text: '+' + (names.length - 2) }));
      if (st.length) out.push(h('span', { class: 'cal-n', text: st.length }));
      if (en.length) out.push(h('span', { class: 'cal-e', text: t('endsOn') + ' ' + en.length }));
      if (st.length) {
        // a thin bar in the state colours: what starts on this day, at a glance
        var cs = counts(st), bar = h('span', { class: 'cal-bar', role: 'img', 'aria-label': ST.filter(function (k) { return cs[k]; }).map(function (k) { return t(k) + ' ' + cs[k]; }).join(', ') });
        ST.forEach(function (k) { if (!cs[k]) return; var seg = h('i', { class: 'f-' + k }); seg.style.flex = String(cs[k]); bar.appendChild(seg); });
        out.push(bar);
      }
      return out;
    }, pickDay));
    var day = S.cal.day, panel = h('section', { class: 'stack', id: 'dayPanel' }, h('h2', { text: fmtDate(day) }));
    var running = ps.filter(function (p) { return p.from < day && (p.to || p.from) > day; });
    [[t('startsOn'), byStart[day] || []], [t('endsOn'), byEnd[day] || []], [t('running'), running]].forEach(function (g) {
      if (!g[1].length) return;
      var l = h('div', { class: 'plist' });
      g[1].slice(0, 12).forEach(function (p) { l.appendChild(prow(p)); });
      panel.appendChild(h('h3', { text: g[0] + ' (' + g[1].length + ')' }));
      panel.appendChild(l);
      if (g[1].length > 12) {
        var rest = h('button', { class: 'btn ghost sm more', type: 'button', onclick: function () { g[1].slice(12).forEach(function (p) { l.appendChild(prow(p)); }); rest.remove(); } }, t('showAll') + ' (' + g[1].length + ')');
        panel.appendChild(rest);
      }
    });
    if (panel.childNodes.length === 1) panel.appendChild(h('div', { class: 'empty', text: t('noneDay') }));
    v.appendChild(panel);
    return v;
  }

  /* private calendars: tasks for admins, the weekly sessions timetable for everyone */
  function loadMyCal(v) {
    if (S.mycal) return true;
    v.appendChild(h('div', { class: 'spin' }));
    call('api_myCalendar').then(function (r) { S.mycal = JSON.parse(r); paintMain(); }, function (e) { toast(errText(e), true); });
    return false;
  }
  function occurs(task, day) {
    if (!task.date || day < task.date || (task.until && day > task.until)) return false;
    var wd = new Date(day + 'T00:00:00Z').getUTCDay();
    if (task.repeat === 'daily') return wd < 5;
    if (task.repeat === 'weekly') return new Date(task.date + 'T00:00:00Z').getUTCDay() === wd;
    return task.date === day;
  }
  function crud(kind) {
    var key = kind === 'Task' ? 'tasks' : 'sessions';
    function put(rec) {
      return call('api_save' + kind, JSON.stringify(rec)).then(function (r) {
        var o = JSON.parse(r), list = S.mycal[key], at = -1;
        list.forEach(function (x, n) { if (x.id === o.id) at = n; });
        if (at > -1) list[at] = o; else list.push(o);
        return o;
      });
    }
    function del(id) { return call('api_delete' + kind, id).then(function () { S.mycal[key] = S.mycal[key].filter(function (x) { return x.id !== id; }); }); }
    function bare(rec) { var c = JSON.parse(JSON.stringify(rec)); delete c.id; return c; }
    return {
      create: function (rec, label) { var ref = {}; return put(rec).then(function (o) { ref.id = o.id; record(label, function () { return del(ref.id); }, function () { return put(bare(rec)).then(function (n) { ref.id = n.id; }); }); }); },
      update: function (prev, next, label) { return put(next).then(function () { record(label, function () { return put(prev); }, function () { return put(next); }); }); },
      remove: function (rec, label) { var ref = { id: rec.id }; return del(rec.id).then(function () { record(label, function () { return put(bare(rec)).then(function (n) { ref.id = n.id; }); }, function () { return del(ref.id); }); }); }
    };
  }
  function done(promise, msg) { return promise.then(function () { toast(t(msg)); closeSheet(); render(); }, function (e) { toast(errText(e), true); }); }
  function taskForm(task) {
    var isNew = !task, cur = task || { title: '', date: S.cal.day || S.today, repeat: 'none', time: '', until: '', notify: true, note: '', done: [] };
    var ti = h('input', { type: 'text', id: 'taskTitle', maxlength: '140', required: true, value: cur.title }), da = h('input', { type: 'date', required: true, value: cur.date }), rp = h('select', { id: 'taskRepeat' });
    [['none', t('rNone')], ['daily', t('rDaily')], ['weekly', t('rWeekly')]].forEach(function (o) { var op = h('option', { value: o[0], text: o[1] }); if (o[0] === cur.repeat) op.selected = true; rp.appendChild(op); });
    var tm = h('input', { type: 'time', value: cur.time }), un = h('input', { type: 'date', value: cur.until }), nf = h('input', { type: 'checkbox', checked: cur.notify }), no = h('textarea', { maxlength: '500', value: cur.note });
    var form = h('form', { class: 'form', id: 'taskForm', onsubmit: function (e) {
      e.preventDefault();
      var next = { id: cur.id, title: ti.value.trim(), date: da.value, repeat: rp.value, time: tm.value, until: un.value, notify: nf.checked, note: no.value, done: cur.done || [] };
      done(isNew ? crud('Task').create(next, t('addTask') + ' · ' + next.title) : crud('Task').update(cur, next, t('tasks') + ' · ' + next.title), 'savedL');
    } }, field(t('taskTitle'), ti), h('div', { class: 'row2' }, field(t('when'), da), field(t('timeL'), tm)), h('div', { class: 'row2' }, field(t('repeat'), rp), field(t('until'), un)),
      h('label', { class: 'check' }, nf, t('notifyMe')), field(t('note'), no),
      h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit' }, t('saveL')),
        isNew ? null : h('button', { class: 'btn bad', type: 'button', id: 'taskDelete', onclick: function () { done(crud('Task').remove(cur, t('del') + ' · ' + cur.title), 'deleted'); } }, t('del'))));
    showSheet(isNew ? t('addTask') : cur.title, h('section', { class: 'box' }, form));
    ti.focus();
  }
  function sessionForm(sess, weekday) {
    var isNew = !sess, cur = sess || { weekday: weekday == null ? 0 : weekday, start: '07:30', end: '08:15', subject: '', klass: '', room: '' };
    var wd = h('select', { id: 'sessDay' }), dayName = function (n) { return fmt({ weekday: 'long', timeZone: 'UTC' }, new Date(Date.UTC(2026, 10, 15 + n))); };
    [0, 1, 2, 3, 4, 5, 6].forEach(function (n) { var op = h('option', { value: n, text: dayName(n) }); if (n === +cur.weekday) op.selected = true; wd.appendChild(op); });
    var st = h('input', { type: 'time', required: true, value: cur.start }), en = h('input', { type: 'time', required: true, value: cur.end });
    var su = h('input', { type: 'text', id: 'sessSubject', maxlength: '80', required: true, value: cur.subject }), kl = h('input', { type: 'text', maxlength: '40', value: cur.klass }), ro = h('input', { type: 'text', maxlength: '40', value: cur.room });
    var form = h('form', { class: 'form', id: 'sessionForm', onsubmit: function (e) {
      e.preventDefault();
      var next = { id: cur.id, weekday: +wd.value, start: st.value, end: en.value, subject: su.value.trim(), klass: kl.value.trim(), room: ro.value.trim() };
      done(isNew ? crud('Session').create(next, t('addSession') + ' · ' + next.subject) : crud('Session').update(cur, next, t('sessions') + ' · ' + next.subject), 'savedL');
    } }, field(t('dayL'), wd), h('div', { class: 'row2' }, field(t('fromT'), st), field(t('toT'), en)), field(t('subject'), su), h('div', { class: 'row2' }, field(t('klass'), kl), field(t('room'), ro)),
      h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit' }, t('saveL')),
        isNew ? null : h('button', { class: 'btn bad', type: 'button', id: 'sessDelete', onclick: function () { done(crud('Session').remove(cur, t('del') + ' · ' + cur.subject), 'deleted'); } }, t('del'))));
    showSheet(isNew ? t('addSession') : cur.subject, h('section', { class: 'box' }, form));
    su.focus();
  }
  function vMyCal() {
    var v = h('div', { class: 'view' }), lead = isLead(), tab = lead ? (S.calTab || 'tasks') : 'sessions';
    if (lead) v.appendChild(tabsRow([['tasks', t('tasks')], ['sessions', t('sessions')]], tab, function (k) { S.calTab = k; render(); }));
    if (!loadMyCal(v)) return v;
    if (tab === 'tasks') {
      var tasks = S.mycal.tasks;
      v.appendChild(h('p', { class: 'lead', text: t('tasksLead') }));
      v.appendChild(h('div', { class: 'headrow' }, calHead(render), h('button', { class: 'btn', type: 'button', id: 'addTask', onclick: function () { taskForm(null); } }, ic('plus'), t('addTask'))));
      v.appendChild(monthGrid(function (day) {
        var due = tasks.filter(function (x) { return occurs(x, day); });
        if (!due.length) return null;
        var left = due.filter(function (x) { return (x.done || []).indexOf(day) === -1; }).length;
        return [h('span', { class: 'cal-t' }, h('i', { class: 'sw ' + (left ? 'f-soon' : 'f-done') }), h('span', { text: due.length })), h('span', { class: 'cal-p ' + (left ? 's-soon' : 's-done') }, h('span', { text: due[0].title }))];
      }, pickDay));
      var day = S.cal.day, today = tasks.filter(function (x) { return occurs(x, day); }).sort(function (a, b) { return (a.time || '99') < (b.time || '99') ? -1 : 1; });
      var panel = h('section', { class: 'stack', id: 'dayPanel' }, h('h2', { text: fmtDate(day) }));
      today.forEach(function (task) {
        var isDone = (task.done || []).indexOf(day) !== -1, box = h('input', { type: 'checkbox', checked: isDone, 'aria-label': t('taskDone') });
        box.addEventListener('change', function () {
          var next = JSON.parse(JSON.stringify(task));
          next.done = (task.done || []).filter(function (x) { return x !== day; }).concat(box.checked ? [day] : []);
          crud('Task').update(task, next, t('taskDone') + ' · ' + task.title).then(render, function (e) { toast(errText(e), true); render(); });
        });
        panel.appendChild(h('div', { class: 'task' + (isDone ? ' is-done' : ''), 'data-task': task.id }, h('label', { class: 'check' }, box),
          h('button', { type: 'button', onclick: function () { taskForm(task); } }, h('b', { text: task.title }), h('small', { class: 'lead' }, task.time ? h('span', { class: 'ltr', text: task.time }) : null, task.time ? ' · ' : null, t({ none: 'rNone', daily: 'rDaily', weekly: 'rWeekly' }[task.repeat] || 'rNone')))));
      });
      if (!today.length) panel.appendChild(h('div', { class: 'empty', text: t('noTasks') }));
      v.appendChild(panel);
    } else {
      var sessions = S.mycal.sessions, days = [0, 1, 2, 3, 4].concat([5, 6].filter(function (n) { return sessions.some(function (x) { return +x.weekday === n; }); }));
      var nowWd = new Date(S.today + 'T00:00:00Z').getUTCDay(), week = h('div', { class: 'week', id: 'week' });
      v.appendChild(h('div', { class: 'headrow' }, h('p', { class: 'lead', text: t('sessionsLead') }), h('button', { class: 'btn', type: 'button', id: 'addSession', onclick: function () { sessionForm(null, nowWd < 5 ? nowWd : 0); } }, ic('plus'), t('addSession'))));
      days.forEach(function (n) {
        var col = h('div', { class: 'wk' + (n === nowWd ? ' now' : ''), 'data-wd': n }, h('b', { text: fmt({ weekday: 'long', timeZone: 'UTC' }, new Date(Date.UTC(2026, 10, 15 + n))) }));
        sessions.filter(function (x) { return +x.weekday === n; }).sort(function (a, b) { return a.start < b.start ? -1 : 1; }).forEach(function (x) {
          col.appendChild(h('button', { class: 'sess', type: 'button', 'data-session': x.id, onclick: function () { sessionForm(x); } }, h('span', { class: 'ltr', text: x.start + ' – ' + x.end }), h('b', { text: x.subject }), x.klass || x.room ? h('small', { text: [x.klass, x.room].filter(Boolean).join(' · ') }) : null));
        });
        col.appendChild(h('button', { class: 'btn ghost sm', type: 'button', 'aria-label': t('addSession'), onclick: function () { sessionForm(null, n); } }, ic('plus')));
        week.appendChild(col);
      });
      v.appendChild(week);
      if (!sessions.length) v.appendChild(h('div', { class: 'empty', text: t('noSessions') }));
      v.appendChild(h('div', { class: 'note headrow', id: 'ttLink' }, h('span', { text: t('ttLinkLead') }), h('button', { class: 'btn ghost sm', type: 'button', onclick: function () { S.ttMode = ''; go('timetable'); } }, ic('timetable'), t('timetable'))));
    }
    return v;
  }

  /* ---------- the school's sessions schedule: Sunday to Thursday, eight sessions a day ---------- */
  function loadTimetable(v) {
    if (S.tt) return true;
    v.appendChild(h('div', { class: 'spin' }));
    call('api_timetable').then(function (r) { S.tt = JSON.parse(r); paintMain(); }, function (e) { toast(errText(e), true); });
    return false;
  }
  function dayLabel(n) { return fmt({ weekday: 'long', timeZone: 'UTC' }, new Date(Date.UTC(2026, 10, 15 + n))); }
  /** The time in Riyadh now, as HH:mm, to mark the session that is running. */
  function clockNow() { try { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()); } catch (e) { return ''; } }
  function timesOf(stage) { return (S.tt.periods || {})[stage] || []; }
  function slotTime(stage, period) { var x = timesOf(stage)[period - 1]; return x ? x[0] + ' – ' + x[1] : ''; }
  function putLesson(l) { var at = -1; S.tt.lessons.forEach(function (x, i) { if (x.id === l.id) at = i; }); if (at > -1) S.tt.lessons[at] = l; else S.tt.lessons.push(l); }
  function dropLessons(ids) { S.tt.lessons = S.tt.lessons.filter(function (x) { return ids.indexOf(x.id) === -1; }); }
  function saveLesson(rec) { return call('api_saveLesson', JSON.stringify(rec)).then(function (res) { var r = JSON.parse(res); putLesson(r.lesson); return r; }); }
  function asRow(l) { return [l.klass, String(l.weekday + 1), String(l.period), l.subject, l.teacherName, l.room]; }
  function lessonForm(lesson, preset) {
    var isNew = !lesson, cur = lesson || { stage: preset.stage, klass: preset.klass || '', weekday: preset.weekday || 0, period: preset.period || 1, subject: '', teacher: '', teacherName: '', room: '' };
    var body = h('section', { class: 'box' });
    showSheet(isNew ? t('ttAdd') : cur.subject + ' · ' + cur.klass, body);
    (function paint() {
      clear(body);
      if (!S.users) { body.appendChild(h('div', { class: 'spin' })); call('api_users').then(function (r) { S.users = JSON.parse(r); paint(); }, function (e) { toast(errText(e), true); }); return; }
      var stg = h('select', { id: 'ttStage' }), kl = h('input', { type: 'text', id: 'ttClass', maxlength: '30', required: true, value: cur.klass, list: 'ttClasses' }), wd = h('select', { id: 'ttDay' }), pr = h('select', { id: 'ttPeriod' });
      stagesShown().forEach(function (x) { var o = h('option', { value: x, text: stageName(x) }); if (x === cur.stage) o.selected = true; stg.appendChild(o); });
      for (var n = 0; n < S.tt.days; n++) { var od = h('option', { value: n, text: dayLabel(n) }); if (n === +cur.weekday) od.selected = true; wd.appendChild(od); }
      var known = h('datalist', { id: 'ttClasses' }), seen = {};
      S.tt.lessons.forEach(function (x) { if (!seen[x.klass]) { seen[x.klass] = 1; known.appendChild(h('option', { value: x.klass })); } });
      var su = h('input', { type: 'text', id: 'ttSubject', maxlength: '80', required: true, value: cur.subject }), ro = h('input', { type: 'text', maxlength: '40', value: cur.room });
      var who = h('select', { id: 'ttTeacher' }), other = h('input', { type: 'text', id: 'ttTeacherName', maxlength: '80', placeholder: t('ttOtherName'), value: cur.teacher ? '' : cur.teacherName });
      var fill = function () {
        var keep = +pr.value || +cur.period;
        clear(pr);
        for (var k = 1; k <= S.tt.perDay; k++) { var op = h('option', { value: k, text: t('ttPeriod') + ' ' + k + ' · ' + slotTime(stg.value, k) }); if (k === keep) op.selected = true; pr.appendChild(op); }
        clear(who).appendChild(h('option', { value: '', text: t('ttOther') }));
        S.users.filter(function (u) { return canHold(u, stg.value); }).sort(function (a, b) { return a.name < b.name ? -1 : 1; }).forEach(function (u) { var o = h('option', { value: u.email, text: u.name }); if (u.email === cur.teacher) o.selected = true; who.appendChild(o); });
        other.hidden = !!who.value;
      };
      stg.addEventListener('change', fill); who.addEventListener('change', function () { other.hidden = !!who.value; });
      fill();
      var send = h('button', { class: 'btn', type: 'submit', id: 'ttSave' }, t('saveL'));
      body.appendChild(h('form', { class: 'form', id: 'lessonForm', onsubmit: function (e) {
        e.preventDefault();
        var next = { id: cur.id || '', stage: stg.value, klass: kl.value.trim(), weekday: +wd.value, period: +pr.value, subject: su.value.trim(), teacher: who.value, teacherName: who.value ? '' : other.value.trim(), room: ro.value.trim() };
        busy(send, true);
        saveLesson(next).then(function (r) {
          var ref = { id: r.lesson.id }, prev = lesson;
          record((isNew ? t('ttAdd') : t('timetable')) + ' · ' + next.subject, function () { return isNew ? call('api_deleteLesson', ref.id).then(function () { dropLessons([ref.id]); }) : saveLesson(prev); },
            function () { return isNew ? saveLesson(Object.assign({}, next, { id: '' })).then(function (x) { ref.id = x.lesson.id; }) : saveLesson(Object.assign({}, next, { id: ref.id })); });
          S.ttMode = S.ttMode === 'teacher' ? 'teacher' : 'class';
          if (S.ttMode === 'class') S.ttPick = r.lesson.stage + '|' + r.lesson.klass;
          toast(r.warnings.length ? r.warnings[0] : t('savedL'), r.warnings.length > 0); closeSheet(); render();
        }, function (er) { busy(send, false); toast(errText(er), true); });
      } }, known, h('div', { class: 'row2' }, field(t('stage'), stg), field(t('klass'), kl)), h('div', { class: 'row2' }, field(t('dayL'), wd), field(t('ttPeriod'), pr)),
        field(t('subject'), su), field(t('ttTeacherL'), who), other, field(t('room'), ro),
        h('div', { class: 'actions' }, send, isNew ? null : h('button', { class: 'btn bad', type: 'button', id: 'ttDelete', onclick: function () {
          call('api_deleteLesson', cur.id).then(function () {
            var ref = { id: cur.id };
            dropLessons([cur.id]);
            record(t('del') + ' · ' + cur.subject, function () { return saveLesson(Object.assign({}, cur, { id: '' })).then(function (x) { ref.id = x.lesson.id; }); }, function () { return call('api_deleteLesson', ref.id).then(function () { dropLessons([ref.id]); }); });
            toast(t('deleted')); closeSheet(); render();
          }, function (er) { toast(errText(er), true); });
        } }, t('del')))));
      (isNew ? kl : su).focus();
    })();
  }
  /** The admins set when each of the eight sessions starts and ends. Sessions are kept by number, so the whole schedule follows. */
  function periodsSheet(first) {
    var stg = h('select', { id: 'ptStage' }), all = h('input', { type: 'checkbox', id: 'ptAll' }), rows = h('div', { class: 'ptrows' }), inputs = [];
    stagesShown().forEach(function (x) { var o = h('option', { value: x, text: stageName(x) }); if (x === first) o.selected = true; stg.appendChild(o); });
    var fill = function () {
      clear(rows); inputs = [];
      for (var k = 1; k <= S.tt.perDay; k++) {
        var x = timesOf(stg.value)[k - 1] || ['', ''], a = h('input', { type: 'time', required: true, value: x[0], 'aria-label': t('fromT') + ' ' + k, 'data-pt': k + 'a' }), b = h('input', { type: 'time', required: true, value: x[1], 'aria-label': t('toT') + ' ' + k, 'data-pt': k + 'b' });
        inputs.push([a, b]);
        rows.appendChild(h('div', { class: 'ptrow' }, h('b', { text: t('ttPeriod') + ' ' + k }), a, h('span', { 'aria-hidden': 'true', text: '–' }), b));
      }
    };
    stg.addEventListener('change', fill);
    fill();
    var send = h('button', { class: 'btn', type: 'submit', id: 'ptSave' }, t('saveL'));
    var push = function (body) { return call('api_savePeriods', JSON.stringify(body)).then(function (res) { var r = JSON.parse(res); Object.keys(r.periods).forEach(function (st) { S.tt.periods[st] = r.periods[st]; }); return r; }); };
    showSheet(t('ttTimes'), h('p', { class: 'lead', text: t('ttTimesLead') }), h('section', { class: 'box' }, h('form', { class: 'form', id: 'periodsForm', onsubmit: function (e) {
      e.preventDefault();
      var body = { stages: all.checked ? stagesShown() : [stg.value], periods: inputs.map(function (x) { return [x[0].value, x[1].value]; }) };
      busy(send, true);
      push(body).then(function (r) {
        var before = r.before;
        record(t('ttTimes'), function () { return Promise.all(Object.keys(before).map(function (st) { return push({ stages: [st], periods: before[st] }); })); }, function () { return push(body); });
        toast(t('ttTimesSaved')); closeSheet(); render();
      }, function (er) { busy(send, false); toast(errText(er), true); });
    } }, field(t('stage'), stg), stagesShown().length > 1 ? h('label', { class: 'check' }, all, t('ttTimesAll')) : null, rows, h('div', { class: 'actions' }, send))));
  }
  /** Paste a whole schedule copied from Excel or Google Sheets. */
  function lessonImport(first) {
    var stg = h('select', { id: 'ttImportStage' }), box = h('textarea', { id: 'ttPaste', rows: '9', dir: 'auto', placeholder: t('ttPasteExample') }), out = h('div', { id: 'ttImportErrors' });
    stagesShown().forEach(function (x) { var o = h('option', { value: x, text: stageName(x) }); if (x === first) o.selected = true; stg.appendChild(o); });
    var go2 = h('button', { class: 'btn', type: 'submit', id: 'ttImportGo' }, t('ttImportGo'));
    var read = function () { return box.value.split(/\r?\n/).map(function (line) { return line.indexOf('\t') !== -1 ? line.split('\t') : line.split(/\s*[;,،]\s*/); }).filter(function (c) { return c.join('').trim() !== ''; }); };
    var form = h('form', { class: 'form', id: 'ttImportForm', onsubmit: function (e) {
      e.preventDefault();
      var rows = read(), payload = JSON.stringify({ stage: stg.value, rows: rows });
      if (!rows.length) return;
      busy(go2, true); clear(out);
      call('api_importLessons', payload).then(function (res) {
        var r = JSON.parse(res);
        busy(go2, false);
        if (!r.ok) {
          out.appendChild(h('p', { class: 'note warn', text: t('ttImportBad') + ' ' + r.wrong }));
          var ul = h('ul', { class: 'mini' });
          r.errors.forEach(function (x) { ul.appendChild(h('li', null, h('b', { text: t('ttLine') + ' ' + x.line }), ' · ' + x.message)); });
          out.appendChild(ul);
          return;
        }
        var ref = { id: r.undoId, ids: r.lessons.map(function (x) { return x.id; }) };
        r.lessons.forEach(putLesson);
        record(t('ttImport') + ' · ' + r.added, function () { return call('api_undoImport', ref.id).then(function () { dropLessons(ref.ids); }); },
          function () { return call('api_importLessons', payload).then(function (again) { var a = JSON.parse(again); a.lessons.forEach(putLesson); ref.id = a.undoId; ref.ids = a.lessons.map(function (x) { return x.id; }); }); });
        S.ttMode = 'class'; S.ttPick = r.lessons[0].stage + '|' + r.lessons[0].klass;
        toast(t('ttImported') + ' ' + r.added + (r.clashing ? ' · ' + t('ttClashing') + ' ' + r.clashing : ''), r.clashing > 0); closeSheet(); render();
      }, function (er) { busy(go2, false); toast(errText(er), true); });
    } }, field(t('stage'), stg), h('p', { class: 'note', text: t('ttPasteHelp') }), sheetPicker(box), h('label', { class: 'fld' }, h('span', { text: t('ttPasteL') }), box), out, h('div', { class: 'actions' }, go2));
    showSheet(t('ttImport'), h('section', { class: 'box' }, form));
    box.focus();
  }
  function vTimetable() {
    var v = h('div', { class: 'view' });
    v.appendChild(h('p', { class: 'lead', text: t('ttLead') }));
    if (!loadTimetable(v)) return v;
    var all = S.tt.lessons.filter(function (l) { return stageOk(l.stage); }), lead = isLead(), mineN = all.filter(function (l) { return l.mine; }).length;
    var mode = S.ttMode || (mineN ? 'mine' : 'class');
    if (mode === 'mine' && !mineN) mode = 'class';
    var manyStages = stagesShown().length > 1 && !S.f.stage, tabs = [['class', t('ttByClass')], ['teacher', t('ttByTeacher')]].concat(mineN ? [['mine', t('ttMine')]] : []);
    var keyOf = function (l) { return mode === 'teacher' ? (l.teacherName || '—') : l.stage + '|' + l.klass; };
    var labelOf = function (k) { if (mode === 'teacher') return k; var b = k.split('|'); return b[1] + (manyStages ? ' · ' + stageName(b[0]) : ''); };
    var keys = [], seen = {};
    all.forEach(function (l) { var k = keyOf(l); if (!seen[k]) { seen[k] = true; keys.push(k); } });
    keys.sort(function (a, b) { return labelOf(a) < labelOf(b) ? -1 : 1; });
    var pick = mode === 'mine' ? '' : (keys.indexOf(S.ttPick) !== -1 ? S.ttPick : keys[0] || '');
    var shown = mode === 'mine' ? all.filter(function (l) { return l.mine; }) : all.filter(function (l) { return keyOf(l) === pick; });
    var chooser = mode === 'mine' || !keys.length ? null : sel(mode === 'teacher' ? t('ttTeacherL') : t('klass'), pick, keys.map(function (k) { return [k, labelOf(k)]; }), function (val) { S.ttPick = val; render(); });
    if (chooser) chooser.querySelector('select').id = 'ttPick';
    var pk = pick.split('|'), nowWd = new Date(S.today + 'T00:00:00Z').getUTCDay(), clock = clockNow();
    // whose clock the grid shows: the chosen class's stage, or the stage on screen
    var clockStage = mode === 'class' && pk[0] ? pk[0] : (S.f.stage || (shown[0] && shown[0].stage) || stagesShown()[0]);
    var clearBtn = lead && mode === 'class' && shown.length ? h('button', { class: 'btn bad sm', type: 'button', id: 'ttClear' }, t('ttClear')) : null;
    if (clearBtn) clearBtn.addEventListener('click', function () {
      if (clearBtn.getAttribute('data-sure') !== '1') { clearBtn.setAttribute('data-sure', '1'); clear(clearBtn); add(clearBtn, t('ttClearSure')); return; }
      busy(clearBtn, true);
      call('api_clearClass', pk[0], pk[1]).then(function (res) {
        var gone = JSON.parse(res).removed, back = JSON.stringify({ stage: pk[0], rows: gone.map(asRow) }), ref = { ids: gone.map(function (x) { return x.id; }) };
        dropLessons(ref.ids);
        record(t('ttClear') + ' · ' + pk[1], function () { return call('api_importLessons', back).then(function (r2) { var a = JSON.parse(r2); a.lessons.forEach(putLesson); ref.ids = a.lessons.map(function (x) { return x.id; }); }); },
          function () { return call('api_clearClass', pk[0], pk[1]).then(function (r3) { dropLessons(JSON.parse(r3).removed.map(function (x) { return x.id; })); }); });
        toast(t('ttCleared') + ' ' + gone.length); render();
      }, function (er) { busy(clearBtn, false); toast(errText(er), true); });
    });
    var preset = function (n, k) { return { stage: mode === 'class' && pk[0] ? pk[0] : clockStage, klass: mode === 'class' ? pk[1] || '' : '', weekday: n, period: k }; };
    v.appendChild(h('div', { class: 'headrow' }, tabsRow(tabs, mode, function (k) { S.ttMode = k; S.ttPick = ''; render(); }),
      lead ? h('div', { class: 'actions' }, h('button', { class: 'btn sm', type: 'button', id: 'ttAdd', onclick: function () { lessonForm(null, preset(nowWd < S.tt.days ? nowWd : 0, 1)); } }, ic('plus'), t('ttAdd')),
        h('button', { class: 'btn ghost sm', type: 'button', id: 'ttImport', onclick: function () { lessonImport(clockStage); } }, ic('upload'), t('ttImport')),
        h('button', { class: 'btn ghost sm', type: 'button', id: 'ttTimes', onclick: function () { periodsSheet(clockStage); } }, ic('soon'), t('ttTimes')),
        h('button', { class: 'btn ghost sm', type: 'button', id: 'ttBuild', onclick: function () { go('builder'); } }, ic('builder'), t('blOpen')), clearBtn) : null));
    if (chooser) v.appendChild(h('div', { class: 'filters' }, chooser));
    if (!all.length && !lead) { v.appendChild(h('div', { class: 'empty', id: 'ttEmpty', text: t('ttEmpty') })); return v; }
    if (!all.length) v.appendChild(h('div', { class: 'note', id: 'ttEmpty', text: t('ttEmptyLead') }));
    var week = h('div', { class: 'week tt', id: 'ttWeek' });
    for (var n = 0; n < S.tt.days; n++) (function (n) {
      var col = h('div', { class: 'wk' + (n === nowWd ? ' now' : ''), 'data-wd': n }, h('b', { text: dayLabel(n) }));
      for (var k = 1; k <= S.tt.perDay; k++) (function (k) {
        var here = shown.filter(function (x) { return x.weekday === n && x.period === k; }), tm = timesOf(here[0] ? here[0].stage : clockStage)[k - 1] || ['', ''];
        var live = n === nowWd && !!clock && tm[0] <= clock && clock < tm[1];
        var slot = h('div', { class: 'slot' + (live ? ' live' : '') + (here.length ? '' : ' free'), 'data-slot': n + '-' + k },
          h('span', { class: 'slot-t' }, h('b', { text: k }), h('span', { class: 'ltr', text: tm[0] ? tm[0] + ' – ' + tm[1] : '' }), live ? h('span', { class: 'pill p-done', text: t('ttNow') }) : null));
        here.forEach(function (x) {
          var sub = (mode === 'class' ? [x.teacherName, x.room] : [x.klass + (manyStages ? ' · ' + stageName(x.stage) : ''), x.room]).filter(Boolean).join(' · ');
          var kids = [h('b', { text: x.subject }), sub ? h('small', { text: sub }) : null];
          slot.appendChild(lead ? h('button', { class: 'sess' + (x.mine ? ' mine' : ''), type: 'button', 'data-lesson': x.id, onclick: function () { lessonForm(x); } }, kids) : h('div', { class: 'sess' + (x.mine ? ' mine' : ''), 'data-lesson': x.id }, kids));
        });
        if (!here.length && lead && mode === 'class') slot.appendChild(h('button', { class: 'slot-add', type: 'button', 'aria-label': t('ttAdd') + ' · ' + dayLabel(n) + ' · ' + k, onclick: function () { lessonForm(null, preset(n, k)); } }, ic('plus')));
        col.appendChild(slot);
      })(k);
      week.appendChild(col);
    })(n);
    v.appendChild(week);
    v.appendChild(h('p', { class: 'lead', id: 'ttCount', text: shown.length + ' ' + t('ttSessionsWord') + (mode === 'mine' || !pick ? '' : ' · ' + labelOf(pick)) }));
    return v;
  }

  /* ---------- profile and picture ---------- */
  /** Shrinks the chosen picture to a small square before it leaves the device. */
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
  /* ---------- the schedule builder: classes, weekly sessions, teachers and instructions in; a designed schedule out ---------- */
  var TXB = {
    ar: {
      builder: 'منشئ الجدول', blLead: 'يصمّم جدول الحصص من خطة الصفوف والمعلمين وأنصبتهم والتعليمات، ثم تعتمده في الجدول المدرسي بضغطة واحدة.',
      bl_plan: '1 · الخطة', bl_teachers: '2 · المعلمون', bl_assign: '3 · الإسناد', bl_rules: '4 · التعليمات', bl_build: '5 · البناء',
      blDay: 'اليوم الدراسي', blDayLead: 'عدد الحصص في كل يوم. أوقات الحصص تُضبط من زر «أوقات الحصص».', blWeekCap: 'حصص الأسبوع', blTimesNow: 'الدوام',
      blMatrix: 'الصفوف والمواد', blMatrixLead: 'اكتب عدد حصص كل مادة في الأسبوع لكل صف. اضغط اسم الصف أو المادة لتعديله أو حذفه.', blAddClass: 'إضافة صفوف', blAddSubject: 'إضافة مادة', blPaste: 'لصق من Excel',
      blClassNames: 'أسماء الصفوف', blClassNamesHint: 'كل صف في سطر، أو افصل بينها بفاصلة. مثال: 4A، 4B، 5A', blCopyFrom: 'انسخ خطة صف', blCopyNone: 'بدون نسخ',
      blSubjectName: 'اسم المادة', blWeekly: 'حصصها في الأسبوع لكل صف', blTotal: 'المجموع', blNoPlan: 'ابدأ بإضافة الصفوف ثم المواد.', blRename: 'الاسم', blRemove: 'حذف', blRemoveSure: 'تأكيد الحذف',
      blExists: 'الاسم موجود من قبل، أو لم يُكتب اسم.', blPastePlanHelp: 'الصق جدولاً من Excel: السطر الأول أسماء المواد، وكل سطر بعده يبدأ باسم الصف ثم عدد حصص كل مادة.', blPastePlanEx: 'الصف\tMaths\tEnglish\n4A\t6\t5\n4B\t6\t5',
      blPasteBad: 'تعذرت قراءة الجدول الملصق. تأكد من سطر العناوين ومن أن الخانات أرقام.', blAdd: 'إضافة', blPasteL: 'الجدول الملصق',
      blTeachersLead: 'معلمو المرحلة، وما يدرّسه كل منهم، ونصابه الأسبوعي من الحصص.', blAddTeacher: 'إضافة معلم', blAddStaff: 'أضف معلمي المرحلة', blStaffAdded: 'أُضيف من منسوبي المرحلة:', blNoStaff: 'كل معلمي المرحلة مضافون.',
      blTeacher: 'المعلم', blTypedName: 'اسم آخر (ليس له حساب)', blSubjects: 'المواد', blQuota: 'النصاب', blQuotaL: 'النصاب الأسبوعي (حصص)', blAssigned: 'المسند', blMaxDay: 'أقصى حصص في اليوم', blNoLimit: 'بلا حد',
      blNoTeachers: 'لم يُضف معلمون بعد.', blNeedName: 'اختر المعلم أو اكتب اسمه.', blPasteTeachersHelp: 'الصق من Excel: اسم المعلم، ثم مواده (بينها +)، ثم نصابه. المادة غير الموجودة تُضاف إلى الخطة.', blPasteTeachersEx: 'خالد العتيبي\tMaths\t24\nسامي الحربي\tScience + ICT\t22',
      blAssignLead: 'من يدرّس كل مادة لكل صف. «توزيع تلقائي» يملأ الخانات الفارغة في حدود الأنصبة، ولك تغيير أي خانة.', blAuto: 'توزيع تلقائي', blAutoAll: 'إعادة التوزيع من جديد', blAutoSure: 'تأكيد: يمسح الإسناد الحالي',
      blAutoDone: 'خانات أُسندت:', blAutoLeft: 'بقيت بلا معلم:', blUnassigned: 'خانات بلا معلم', blAllAssigned: 'كل المواد لها معلم.', blShort: 'لا يكفي نصاب معلمي المادة', blNoTeacherFor: 'لا يوجد معلم لهذه المادة', blOthers: 'معلمون آخرون',
      blLoads: 'أنصبة المعلمين', blNeedPlan: 'أكمل «الخطة» و«المعلمون» أولاً.', blOver: 'فوق النصاب', blWithin: 'ضمن النصاب',
      blRulesLead: 'تعليمات يتبعها المنشئ. الإلزامية لا تُخالَف أبداً، والمفضّلة تُتّبع قدر الإمكان ويذكر التقرير ما خولف منها.', blAddRule: 'إضافة تعليمة',
      blNoRules: 'لا توجد تعليمات. يبني المنشئ بقواعده الأساسية: لا تعارض، ولا فراغ داخل يوم الصف، وتوزيع متوازن.',
      blRuleType: 'نوع التعليمة', rt_off: 'معلم غير متاح في وقت معين', rt_window: 'مادة في حصص معينة فقط', rt_maxDay: 'أقصى حصص للمعلم في اليوم', rt_streak: 'أقصى حصص متتالية للمعلم', rt_subjectDay: 'عدد حصص المادة في اليوم',
      rt_together: 'مادة تتشارك مكاناً واحداً (ملعب، معمل)', rt_fixed: 'حصة ثابتة أو مغلقة (نشاط، طابور)',
      blMust: 'إلزامية', blPrefer: 'مفضّلة', blStrength: 'القوة', blEveryDay: 'كل الأيام', blDaysL: 'الأيام (اتركها فارغة لكل الأيام)', blFrom: 'من الحصة', blTo: 'إلى الحصة', blAllTeachers: 'كل المعلمين', blAllClasses: 'كل الصفوف', blHowMany: 'العدد',
      blLabel: 'اسم الحصة (اتركه فارغاً لإغلاق الموعد)', blClosed: 'مغلقة', blAllDay: 'اليوم كله', rl_off: 'بلا حصص', rl_window: 'في الحصص', rl_only: 'فقط', rl_maxDay: 'لا يزيد عن {n} حصص في اليوم', rl_streak: 'لا يزيد عن {n} حصص متتالية',
      rl_subjectDay: 'حتى {n} في اليوم للصف', rl_together: 'لا تجتمع لأكثر من {n} صف في الوقت نفسه', blRuleNeeds: 'أكمل خانات التعليمة. أضف المعلمين والمواد أولاً إن لم تكن موجودة.',
      blCheck: 'فحص الإعداد', blReady: 'الإعداد جاهز للبناء.', blGo: 'ابنِ الجدول', blAgain: 'تصميم آخر', blWorking: 'جارٍ بناء الجدول…', blClassesW: 'صف', blTeachersW: 'معلم', blRulesW: 'تعليمة',
      e_empty: 'لا توجد حصص في الخطة. أضف الصفوف والمواد وأعدادها.', e_classOver: 'الصف {klass}: {n} حصة في الخطة والمتاح {m}.', e_teacherOver: '{teacher}: {n} حصة مسندة ووقته المتاح {m}.', e_subjectCap: '{subject} للصف {klass}: {n} حصص لا تكفيها {m} في اليوم.',
      w_quota: '{teacher}: {n} حصة مسندة ونصابه {m}.', w_noTeacher: '{n} خانة بلا معلم: توضع حصصها دون مراعاة معلم.', w_classFree: 'الصف {klass}: {n} حصص فراغ، تُجعل في آخر الأيام.', w_classEmpty: 'الصف {klass} بلا حصص.',
      blPlaced: 'حصص وُضعت', blClassGaps: 'فراغات داخل يوم الصف', blTeacherGaps: 'حصص انتظار للمعلمين', blRulesKept: 'تعليمات اتُّبعت', blClashes: 'تعارضات', blLongest: 'أطول يوم لمعلم',
      blUnplaced: 'حصص لم يجد لها المنشئ موعداً', blUnplacedHint: 'خفّف تعليمة إلزامية، أو غيّر إسناد المعلم، أو زد حصص اليوم، ثم ابنِ من جديد.', blRuleReport: 'التعليمات في هذا التصميم', blKept: 'اتُّبعت', blBroken: 'خولفت', blTimesW: 'مرة',
      blDraft: 'الجدول المبني', blByClass: 'حسب الصف', blByTeacher: 'حسب المعلم', blTeacherDays: 'حصص المعلمين في الأسبوع', blGaps: 'انتظار', blApply: 'اعتماد في الجدول المدرسي', blApplySure: 'تأكيد: يستبدل جدول {c} صف ({n} حصة حالية)',
      blApplied: 'اعتُمد الجدول. حصص:', blAppliedClash: 'تعارض مع صفوف خارج البناء:', blApplyUndo: 'اعتماد الجدول المبني', blNotBuilt: 'اضغط «ابنِ الجدول» ليصمّم المنشئ الجدول من الإعداد الحالي.', blBusy: 'يُبقي المنشئ {n} موعداً خالياً لمعلمين لهم فيها حصص في صفوف خارج هذا البناء.', blSeed: 'تصميم رقم', blOpen: 'منشئ الجدول'
    },
    en: {
      builder: 'Schedule builder', blLead: "Designs the sessions schedule from the classes' plan, the teachers and their quotas, and your instructions. One click then puts it into the school timetable.",
      bl_plan: '1 · Plan', bl_teachers: '2 · Teachers', bl_assign: '3 · Assignment', bl_rules: '4 · Instructions', bl_build: '5 · Build',
      blDay: 'The school day', blDayLead: 'Sessions on each day. Session times are set with the "Session times" button.', blWeekCap: 'Sessions a week', blTimesNow: 'Hours',
      blMatrix: 'Classes and subjects', blMatrixLead: 'Type how many sessions a week each class has of each subject. Select a class or subject name to rename or remove it.', blAddClass: 'Add classes', blAddSubject: 'Add subject', blPaste: 'Paste from Excel',
      blClassNames: 'Class names', blClassNamesHint: 'One per line, or separated by commas. Example: 4A, 4B, 5A', blCopyFrom: "Copy a class's plan", blCopyNone: 'Do not copy',
      blSubjectName: 'Subject name', blWeekly: 'Sessions a week for every class', blTotal: 'Total', blNoPlan: 'Start by adding classes, then subjects.', blRename: 'Name', blRemove: 'Remove', blRemoveSure: 'Confirm removal',
      blExists: 'That name is already there, or no name was typed.', blPastePlanHelp: 'Paste a table from Excel: the first line holds the subject names; each line after it starts with the class, then its sessions for each subject.', blPastePlanEx: 'Class\tMaths\tEnglish\n4A\t6\t5\n4B\t6\t5',
      blPasteBad: 'The pasted table could not be read. Check the heading line and that the cells are numbers.', blAdd: 'Add', blPasteL: 'Pasted table',
      blTeachersLead: "The stage's teachers, what each one teaches, and their weekly quota of sessions.", blAddTeacher: 'Add teacher', blAddStaff: "Add the stage's teachers", blStaffAdded: 'Added from the staff list:', blNoStaff: "All the stage's teachers are already added.",
      blTeacher: 'Teacher', blTypedName: 'Another name (no account)', blSubjects: 'Subjects', blQuota: 'Quota', blQuotaL: 'Weekly quota (sessions)', blAssigned: 'Assigned', blMaxDay: 'Most sessions in a day', blNoLimit: 'No limit',
      blNoTeachers: 'No teachers added yet.', blNeedName: 'Choose the teacher or type a name.', blPasteTeachersHelp: 'Paste from Excel: teacher name, then subjects (separated by +), then quota. A subject that is not in the plan is added to it.', blPasteTeachersEx: 'Khalid Otaibi\tMaths\t24\nSami Harbi\tScience + ICT\t22',
      blAssignLead: 'Who teaches each subject to each class. "Distribute" fills the empty cells within the quotas; you can change any cell.', blAuto: 'Distribute', blAutoAll: 'Distribute again from nothing', blAutoSure: 'Confirm: clears the current assignment',
      blAutoDone: 'Cells assigned:', blAutoLeft: 'Left without a teacher:', blUnassigned: 'Cells without a teacher', blAllAssigned: 'Every subject has a teacher.', blShort: "the subject's teachers have no quota left", blNoTeacherFor: 'no teacher has this subject', blOthers: 'Other teachers',
      blLoads: "Teachers' loads", blNeedPlan: 'Complete "Plan" and "Teachers" first.', blOver: 'Over quota', blWithin: 'Within quota',
      blRulesLead: 'Instructions the builder follows. A "must" is never broken; a "prefer" is followed as far as possible, and the report says where it was not.', blAddRule: 'Add instruction',
      blNoRules: "No instructions. The builder uses its basic rules: no clashes, no free session inside a class's day, and a balanced spread.",
      blRuleType: 'Kind of instruction', rt_off: 'A teacher is not available at certain times', rt_window: 'A subject only in certain sessions', rt_maxDay: "A teacher's most sessions in a day", rt_streak: "A teacher's most sessions in a row", rt_subjectDay: "A subject's sessions in one day",
      rt_together: 'A subject that shares one place (playground, lab)', rt_fixed: 'A fixed or closed session (activity, assembly)',
      blMust: 'Must', blPrefer: 'Prefer', blStrength: 'Strength', blEveryDay: 'every day', blDaysL: 'Days (leave empty for every day)', blFrom: 'From session', blTo: 'To session', blAllTeachers: 'All teachers', blAllClasses: 'all classes', blHowMany: 'Number',
      blLabel: 'Name of the session (leave empty to close the slot)', blClosed: 'closed', blAllDay: 'all day', rl_off: 'no sessions', rl_window: 'in sessions', rl_only: 'only', rl_maxDay: 'at most {n} sessions a day', rl_streak: 'at most {n} sessions in a row',
      rl_subjectDay: 'up to {n} a day for a class', rl_together: 'at most {n} class(es) at the same time', blRuleNeeds: 'Complete the instruction. Add teachers and subjects first if there are none.',
      blCheck: 'Setup check', blReady: 'The setup is ready to build.', blGo: 'Build the schedule', blAgain: 'Another design', blWorking: 'Building the schedule…', blClassesW: 'classes', blTeachersW: 'teachers', blRulesW: 'instructions',
      e_empty: 'The plan has no sessions. Add classes, subjects and their numbers.', e_classOver: 'Class {klass}: {n} sessions planned, {m} available.', e_teacherOver: '{teacher}: {n} sessions assigned, {m} free.', e_subjectCap: '{subject} for {klass}: {n} sessions do not fit at {m} a day.',
      w_quota: '{teacher}: {n} sessions assigned, quota {m}.', w_noTeacher: '{n} cells have no teacher: their sessions are placed without one.', w_classFree: 'Class {klass}: {n} free sessions, kept at the ends of days.', w_classEmpty: 'Class {klass} has no sessions.',
      blPlaced: 'Sessions placed', blClassGaps: "Gaps inside a class's day", blTeacherGaps: "Teachers' waiting sessions", blRulesKept: 'Instructions followed', blClashes: 'Clashes', blLongest: "Longest teacher's day",
      blUnplaced: 'Sessions the builder found no time for', blUnplacedHint: "Relax a \"must\" instruction, change the teacher's assignment, or add sessions to the day, then build again.", blRuleReport: 'Instructions in this design', blKept: 'Followed', blBroken: 'Not followed', blTimesW: 'time(s)',
      blDraft: 'The built schedule', blByClass: 'By class', blByTeacher: 'By teacher', blTeacherDays: "Teachers' sessions over the week", blGaps: 'Waiting', blApply: 'Put into the school timetable', blApplySure: 'Confirm: replaces the schedule of {c} class(es) ({n} sessions now)',
      blApplied: 'Schedule applied. Sessions:', blAppliedClash: 'clashes with classes outside the build:', blApplyUndo: 'Apply the built schedule', blNotBuilt: 'Select "Build the schedule" and the builder designs it from the current setup.', blBusy: 'The builder keeps {n} slot(s) free for teachers who already have sessions there in classes outside this build.', blSeed: 'Design', blOpen: 'Schedule builder'
    }
  };
  Object.keys(TXB).forEach(function (l) { Object.keys(TXB[l]).forEach(function (k) { TX[l][k] = TXB[l][k]; }); });
  ICON.builder = 'M4 5h16v14H4zM4 10h16M9.5 10v9M15.5 12.2l.9 1.9 1.9.9-1.9.9-.9 1.9-.9-1.9-1.9-.9 1.9-.9z';

  function plReset() { S.pl = null; S.plUi = { tab: 'plan', stage: '', run: null, mode: 'class', pick: '', note: null, seed: 1 }; }
  plReset();
  var plLoading = false, plQueue = Promise.resolve();
  function plBlank() { return { dayLen: [8, 8, 8, 8, 8], classes: [], subjects: [], teachers: [], loads: [], rules: [] }; }
  function plEntry(stage) { return S.pl.setups[stage] || (S.pl.setups[stage] = { setup: plBlank(), at: '' }); }
  function plStage() { var all = stagesShown(); return S.f.stage || (all.indexOf(S.plUi.stage) !== -1 ? S.plUi.stage : all[0]) || ''; }
  /** The builder needs its saved setups, the school schedule (for the session times) and the staff list. */
  function plReady(v) {
    if (S.pl && S.tt && S.users) return true;
    v.appendChild(h('div', { class: 'spin' }));
    if (plLoading) return false;
    plLoading = true;
    Promise.all([S.pl ? null : call('api_planner').then(function (r) { S.pl = { setups: JSON.parse(r).setups }; }), S.tt ? null : call('api_timetable').then(function (r) { S.tt = JSON.parse(r); }),
      S.users ? null : call('api_users').then(function (r) { S.users = JSON.parse(r); })])
      .then(function () { plLoading = false; if (S.view === 'builder') paintMain(); }, function (e) { plLoading = false; toast(errText(e), true); });
    return false;
  }
  /** Sends a whole setup. Saves are kept in order, so each one starts from the version before it. */
  function plPush(stage, json) {
    var e = plEntry(stage);
    var mine = plQueue.then(function () { return call('api_savePlanner', JSON.stringify({ stage: stage, setup: JSON.parse(json), base: e.at })); }).then(function (res) { e.at = JSON.parse(res).at; });
    plQueue = mine.catch(function () {});
    return mine;
  }
  /** One change to the setup: saved at once, and recorded so it can be undone. quiet: the page keeps its place (typing in the table). */
  function plCommit(label, change, quiet) {
    var stage = plStage(), e = plEntry(stage), before = JSON.stringify(e.setup);
    change(e.setup);
    var after = JSON.stringify(e.setup);
    if (after === before) return false;
    S.plUi.run = null;                                   // a built design belongs to the setup it was built from
    var lost = function (er) { toast(errText(er), true); S.pl = null; if (S.view === 'builder') paintMain(); throw er; };
    var put = function (json) {
      if (!S.pl) return Promise.reject(new Error('|' + t('loading')));
      S.plUi.run = null; plEntry(stage).setup = JSON.parse(json);
      return plPush(stage, json).catch(lost);
    };
    plPush(stage, after).catch(lost).catch(function () {});
    record(t('builder') + ' · ' + label, function () { return put(before); }, function () { return put(after); });
    if (quiet) paintTop(); else render();
    return true;
  }
  function newId(p) { return p + Math.random().toString(36).slice(2, 9); }
  function latin(v) { return String(v == null ? '' : v).replace(/[٠-٩]/g, function (d) { return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); }); }
  function tidy(v, max) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max); }
  function splitNames(text, max) { var out = []; String(text).split(/[\n\t,،;]+/).forEach(function (x) { x = tidy(x, max); if (x && out.indexOf(x) === -1) out.push(x); }); return out; }
  function pasted(text) { return String(text).split(/\r?\n/).map(function (line) { return (line.indexOf('\t') !== -1 ? line.split('\t') : line.split(/\s*[;,،]\s*/)).map(function (x) { return x.trim(); }); }).filter(function (c) { return c.join('') !== ''; }); }
  function fillT(key, o) { return t(key).replace(/\{(\w+)\}/g, function (_, k) { return o[k] == null ? '' : o[k]; }); }
  function byName(a, b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; }
  function loadOf(su, k, s) { for (var i = 0; i < su.loads.length; i++) if (su.loads[i].klass === k && su.loads[i].subject === s) return su.loads[i]; return null; }
  function countOf(su, k, s) { var l = loadOf(su, k, s); return l ? l.count : 0; }
  function setCount(su, k, s, n) { var l = loadOf(su, k, s); if (n > 0) { if (l) l.count = n; else su.loads.push({ klass: k, subject: s, count: n, teacher: '' }); } else if (l) su.loads.splice(su.loads.indexOf(l), 1); }
  function teacherOf(su, id) { return su.teachers.filter(function (w) { return w.id === id; })[0] || null; }
  function assignedOf(su, id) { var n = 0; su.loads.forEach(function (l) { if (l.teacher === id) n += l.count; }); return n; }
  /** Sessions a class can hold in a week: the days' lengths, less the fixed and closed sessions. */
  function capacityOf(su, k) {
    var n = 0, hit = {};
    su.dayLen.forEach(function (x) { n += x; });
    su.rules.forEach(function (r) { if (r.type === 'fixed' && (!r.klass || r.klass === k) && r.period <= su.dayLen[r.day]) hit[r.day + '-' + r.period] = 1; });
    return n - Object.keys(hit).length;
  }
  function pickOf(id, items, value) {
    var s = h('select', { id: id });
    items.forEach(function (o) { var op = h('option', { value: o[0], text: o[1] }); if (String(o[0]) === String(value == null ? '' : value)) op.selected = true; s.appendChild(op); });
    return s;
  }
  function numbers(a, b) { var out = []; for (var k = a; k <= b; k++) out.push([k, String(k)]); return out; }
  /** A button that asks once more before a removal. */
  function sureBtn(id, label, sureLabel, fn) {
    var b = h('button', { class: 'btn bad', type: 'button', id: id }, label), armed = false;
    b.addEventListener('click', function () { if (!armed) { armed = true; clear(b); add(b, sureLabel); return; } fn(); });
    return b;
  }

  /* ---- step 1: the plan ---- */
  function classSheet() {
    var su = plEntry(plStage()).setup, box = h('textarea', { id: 'bcNames', rows: '4', dir: 'auto', required: true }), from = pickOf('bcCopy', [['', t('blCopyNone')]].concat(su.classes.map(function (k) { return [k, k]; })), '');
    showSheet(t('blAddClass'), h('section', { class: 'box' }, h('form', { class: 'form', id: 'bcForm', onsubmit: function (e) {
      e.preventDefault();
      var names = splitNames(box.value, 30), src = from.value, added = 0;
      plCommit(t('blAddClass'), function (x) {
        names.forEach(function (k) {
          if (x.classes.indexOf(k) !== -1 || x.classes.length >= 60) return;
          x.classes.push(k); added++;
          if (src) x.loads.filter(function (l) { return l.klass === src; }).forEach(function (l) { x.loads.push({ klass: k, subject: l.subject, count: l.count, teacher: '' }); });
        });
      });
      if (!added) { toast(t('blExists'), true); return; }
      closeSheet();
    } }, field(t('blClassNames'), box, t('blClassNamesHint')), su.classes.length ? field(t('blCopyFrom'), from) : null, h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'bcSave' }, t('blAdd'))))));
    box.focus();
  }
  function subjectSheet() {
    var name = h('input', { type: 'text', id: 'bsName', maxlength: '80', required: true }), n = h('input', { type: 'number', id: 'bsCount', min: '0', max: '20', inputmode: 'numeric', value: '' });
    showSheet(t('blAddSubject'), h('section', { class: 'box' }, h('form', { class: 'form', id: 'bsForm', onsubmit: function (e) {
      e.preventDefault();
      var s = tidy(name.value, 80), count = Math.max(0, Math.min(20, Math.floor(+latin(n.value)) || 0)), added = false;
      plCommit(t('blAddSubject') + ' · ' + s, function (x) {
        if (!s || x.subjects.indexOf(s) !== -1 || x.subjects.length >= 40) return;
        x.subjects.push(s); added = true;
        if (count) x.classes.forEach(function (k) { setCount(x, k, s, count); });
      });
      if (!added) { toast(t('blExists'), true); return; }
      closeSheet();
    } }, field(t('blSubjectName'), name), field(t('blWeekly'), n), h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'bsSave' }, t('blAdd'))))));
    name.focus();
  }
  /** Rename or remove a class or a subject, everywhere it is used. */
  function nameSheet(kind, name) {
    var isClass = kind === 'class', inp = h('input', { type: 'text', id: 'bnName', maxlength: isClass ? '30' : '80', required: true, value: name });
    var touch = function (x, next) {
      var list = isClass ? x.classes : x.subjects, at = list.indexOf(name);
      if (at === -1) return false;
      if (next === null) list.splice(at, 1); else list[at] = next;
      x.loads = x.loads.filter(function (l) { var hit = isClass ? l.klass === name : l.subject === name; if (hit && next !== null) { if (isClass) l.klass = next; else l.subject = next; } return !hit || next !== null; });
      x.rules = x.rules.filter(function (r) { var hit = isClass ? r.klass === name : r.subject === name; if (hit && next !== null) { if (isClass) r.klass = next; else r.subject = next; } return !hit || next !== null; });
      if (!isClass) x.teachers.forEach(function (w) { var i = w.subjects.indexOf(name); if (i !== -1) { if (next === null) w.subjects.splice(i, 1); else w.subjects[i] = next; } });
      return true;
    };
    showSheet(name, h('section', { class: 'box' }, h('form', { class: 'form', id: 'bnForm', onsubmit: function (e) {
      e.preventDefault();
      var next = tidy(inp.value, isClass ? 30 : 80), su = plEntry(plStage()).setup;
      if (next === name) { closeSheet(); return; }
      if (!next || (isClass ? su.classes : su.subjects).indexOf(next) !== -1) { toast(t('blExists'), true); return; }
      plCommit(name + ' ← ' + next, function (x) { touch(x, next); });
      closeSheet();
    } }, field(t('blRename'), inp), h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'bnSave' }, t('saveL')),
      sureBtn('bnDelete', t('blRemove'), t('blRemoveSure'), function () { plCommit(t('blRemove') + ' · ' + name, function (x) { touch(x, null); }); closeSheet(); })))));
  }
  function planPaste() {
    var box = h('textarea', { id: 'bpPaste', rows: '8', dir: 'auto', placeholder: t('blPastePlanEx') });
    showSheet(t('blPaste'), h('section', { class: 'box' }, h('form', { class: 'form', id: 'bpForm', onsubmit: function (e) {
      e.preventDefault();
      var rows = pasted(box.value), subs = rows.length ? rows[0].slice(1).map(function (x) { return tidy(x, 80); }) : [], ok = rows.length > 1 && subs.length > 0 && subs.every(String), table = [];
      rows.slice(1).forEach(function (c) {
        var k = tidy(c[0], 30), nums = subs.map(function (_, i) { var raw = latin(c[i + 1] || ''); return raw === '' ? 0 : (/^\d{1,2}$/.test(raw) && +raw <= 20 ? +raw : -1); });
        if (!k || nums.indexOf(-1) !== -1) ok = false; else table.push([k, nums]);
      });
      if (!ok) { toast(t('blPasteBad'), true); return; }
      plCommit(t('blPaste'), function (x) {
        subs.forEach(function (s) { if (x.subjects.indexOf(s) === -1 && x.subjects.length < 40) x.subjects.push(s); });
        table.forEach(function (r) {
          if (x.classes.indexOf(r[0]) === -1) { if (x.classes.length >= 60) return; x.classes.push(r[0]); }
          subs.forEach(function (s, i) { if (x.subjects.indexOf(s) !== -1) setCount(x, r[0], s, r[1][i]); });
        });
      });
      closeSheet();
    } }, h('p', { class: 'note', text: t('blPastePlanHelp') }), sheetPicker(box), h('label', { class: 'fld' }, h('span', { text: t('blPasteL') }), box), h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'bpGo' }, t('blAdd'))))));
    box.focus();
  }
  function blPlan(v, stage, su) {
    var cap = 0, times = timesOf(stage), longest = Math.max.apply(null, su.dayLen), dayBox = h('div', { class: 'bl-days' });
    su.dayLen.forEach(function (n, d) {
      cap += n;
      var s = pickOf('blDay' + d, numbers(1, S.tt.perDay), n);
      s.addEventListener('change', function () { var val = +s.value; plCommit(t('blDay') + ' · ' + dayLabel(d), function (x) { x.dayLen[d] = val; }); });
      dayBox.appendChild(h('label', { class: 'fld' }, h('span', { text: dayLabel(d) }), s));
    });
    v.appendChild(h('section', { class: 'box' }, h('div', { class: 'headrow' }, h('h2', { text: t('blDay') }), h('button', { class: 'btn ghost sm', type: 'button', id: 'blTimes', onclick: function () { periodsSheet(stage); } }, ic('soon'), t('ttTimes'))),
      h('p', { class: 'lead', text: t('blDayLead') }), dayBox,
      h('p', { class: 'lead', id: 'blCap', text: t('blWeekCap') + ': ' + cap + (times.length >= longest ? ' · ' + t('blTimesNow') + ': ' + times[0][0] + ' – ' + times[longest - 1][1] : '') })));
    var box = h('section', { class: 'box' }, h('div', { class: 'headrow' }, h('h2', { text: t('blMatrix') }), h('div', { class: 'actions' },
      h('button', { class: 'btn sm', type: 'button', id: 'blAddClass', onclick: classSheet }, ic('plus'), t('blAddClass')),
      h('button', { class: 'btn sm', type: 'button', id: 'blAddSubject', onclick: subjectSheet }, ic('plus'), t('blAddSubject')),
      h('button', { class: 'btn ghost sm', type: 'button', id: 'blPastePlan', onclick: planPaste }, ic('upload'), t('blPaste')))), h('p', { class: 'lead', text: t('blMatrixLead') }));
    v.appendChild(box);
    if (!su.classes.length && !su.subjects.length) { box.appendChild(h('div', { class: 'empty', id: 'blNoPlan', text: t('blNoPlan') })); return; }
    var caps = {}, rowTot = {}, colTot = {}, tb = h('tbody'), head = h('tr', null, h('th', { text: t('klass') })), foot = h('tr', null, h('th', { text: t('blTotal') }));
    su.classes.forEach(function (k) { caps[k] = capacityOf(su, k); });
    var totals = function () {
      su.classes.forEach(function (k) { var n = 0; su.subjects.forEach(function (s) { n += countOf(su, k, s); }); rowTot[k].textContent = n + ' / ' + caps[k]; rowTot[k].className = 'tot ' + (n > caps[k] ? 'over' : n === caps[k] ? 'ok' : 'under'); });
      su.subjects.forEach(function (s) { var n = 0; su.classes.forEach(function (k) { n += countOf(su, k, s); }); colTot[s].textContent = n; });
    };
    su.subjects.forEach(function (s) {
      head.appendChild(h('th', null, h('button', { class: 'hbtn', type: 'button', 'data-subject': s, onclick: function () { nameSheet('subject', s); } }, s)));
      colTot[s] = h('span', { class: 'tot' }); foot.appendChild(h('td', null, colTot[s]));
    });
    head.appendChild(h('th', { text: t('blTotal') })); foot.appendChild(h('td'));
    su.classes.forEach(function (k) {
      var tr = h('tr', null, h('th', null, h('button', { class: 'hbtn', type: 'button', 'data-class': k, onclick: function () { nameSheet('class', k); } }, k)));
      su.subjects.forEach(function (s) {
        var inp = h('input', { type: 'number', min: '0', max: '20', inputmode: 'numeric', value: countOf(su, k, s) || '', 'aria-label': k + ' · ' + s, 'data-cell': k + '|' + s });
        inp.addEventListener('change', function () {
          var n = Math.max(0, Math.min(20, Math.floor(+latin(inp.value)) || 0));
          inp.value = n || '';
          plCommit(k + ' · ' + s, function (x) { setCount(x, k, s, n); }, true);
          totals();
        });
        tr.appendChild(h('td', null, inp));
      });
      rowTot[k] = h('span', { class: 'tot', 'data-total': k });
      tr.appendChild(h('td', null, rowTot[k])); tb.appendChild(tr);
    });
    box.appendChild(h('div', { class: 'tw flat' }, h('table', { class: 'mx', id: 'blPlan' }, h('thead', null, head), tb, h('tfoot', null, foot))));
    totals();
  }

  /* ---- step 2: the teachers ---- */
  function teacherSheet(id) {
    var stage = plStage(), su = plEntry(stage).setup, cur = id ? teacherOf(su, id) : null, isNew = !cur;
    if (isNew) cur = { id: '', name: '', email: '', quota: 24, maxDay: 0, subjects: [] };
    var used = {};
    su.teachers.forEach(function (w) { if (w.email && w.id !== cur.id) used[w.email] = 1; });
    var staff = S.users.filter(function (u) { return canHold(u, stage) && !used[u.email]; }).sort(byName);
    var who = pickOf('btWho', [['', t('blTypedName')]].concat(staff.map(function (u) { return [u.email, u.name]; })), cur.email);
    var name = h('input', { type: 'text', id: 'btName', maxlength: '80', value: cur.email ? '' : cur.name, placeholder: t('name') });
    name.hidden = !!who.value;
    who.addEventListener('change', function () { name.hidden = !!who.value; });
    var boxes = su.subjects.map(function (s) { return h('input', { type: 'checkbox', 'data-sub': s, checked: cur.subjects.indexOf(s) !== -1 }); });
    var quota = h('input', { type: 'number', id: 'btQuota', min: '0', max: '40', inputmode: 'numeric', value: cur.quota }), maxDay = pickOf('btMaxDay', [[0, t('blNoLimit')]].concat(numbers(1, S.tt.perDay)), cur.maxDay || 0);
    showSheet(isNew ? t('blAddTeacher') : cur.name, h('section', { class: 'box' }, h('form', { class: 'form', id: 'btForm', onsubmit: function (e) {
      e.preventDefault();
      var email = who.value, person = staff.filter(function (u) { return u.email === email; })[0], nm = person ? person.name : tidy(name.value, 80);
      if (!nm) { toast(t('blNeedName'), true); return; }
      var subs = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.getAttribute('data-sub'); }), q = Math.max(0, Math.min(40, Math.floor(+latin(quota.value)) || 0)), md = +maxDay.value;
      plCommit((isNew ? t('blAddTeacher') : t('blTeacher')) + ' · ' + nm, function (x) {
        var w = isNew ? null : teacherOf(x, cur.id);
        if (!w) { if (x.teachers.length >= 150) return; w = { id: newId('t'), name: '', email: '', quota: 24, maxDay: 0, subjects: [] }; x.teachers.push(w); }
        w.name = nm; w.email = person ? email : ''; w.quota = q; w.maxDay = md; w.subjects = subs;
      });
      closeSheet();
    } }, field(t('blTeacher'), who), name,
      h('div', { class: 'fld' }, h('span', { text: t('blSubjects') }), h('div', { class: 'checks', id: 'btSubjects' }, su.subjects.map(function (s, i) { return h('label', { class: 'check' }, boxes[i], s); }))),
      h('div', { class: 'row2' }, field(t('blQuotaL'), quota), field(t('blMaxDay'), maxDay)),
      h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'btSave' }, t('saveL')), isNew ? null : sureBtn('btDelete', t('blRemove'), t('blRemoveSure'), function () {
        plCommit(t('blRemove') + ' · ' + cur.name, function (x) {
          x.teachers = x.teachers.filter(function (w) { return w.id !== cur.id; });
          x.loads.forEach(function (l) { if (l.teacher === cur.id) l.teacher = ''; });
          x.rules = x.rules.filter(function (r) { return r.teacher !== cur.id; });
        });
        closeSheet();
      })))));
  }
  function teacherPaste() {
    var stage = plStage(), box = h('textarea', { id: 'bqPaste', rows: '8', dir: 'auto', placeholder: t('blPasteTeachersEx') });
    showSheet(t('blPaste'), h('section', { class: 'box' }, h('form', { class: 'form', id: 'bqForm', onsubmit: function (e) {
      e.preventDefault();
      var rows = pasted(box.value).map(function (c) { return { name: tidy(c[0], 80), subjects: splitNames(String(c[1] || '').replace(/[+\/&]/g, ','), 80), quota: /^\d{1,2}$/.test(latin(c[2] || '')) ? Math.min(40, +latin(c[2])) : 24 }; }).filter(function (r) { return r.name; });
      if (!rows.length) { toast(t('blPasteBad'), true); return; }
      plCommit(t('blPaste') + ' · ' + t('blTeachersW'), function (x) {
        rows.forEach(function (r) {
          if (x.teachers.some(function (w) { return w.name === r.name; }) || x.teachers.length >= 150) return;
          r.subjects.forEach(function (s) { if (x.subjects.indexOf(s) === -1 && x.subjects.length < 40) x.subjects.push(s); });
          var same = S.users.filter(function (u) { return canHold(u, stage) && norm(u.name) === norm(r.name); });
          var person = same.length === 1 && !x.teachers.some(function (w) { return w.email === same[0].email; }) ? same[0] : null;
          x.teachers.push({ id: newId('t'), name: person ? person.name : r.name, email: person ? person.email : '', quota: r.quota, maxDay: 0, subjects: r.subjects.filter(function (s) { return x.subjects.indexOf(s) !== -1; }) });
        });
      });
      closeSheet();
    } }, h('p', { class: 'note', text: t('blPasteTeachersHelp') }), sheetPicker(box), h('label', { class: 'fld' }, h('span', { text: t('blPasteL') }), box), h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'bqGo' }, t('blAdd'))))));
    box.focus();
  }
  function blTeachers(v, stage, su) {
    var addStaff = function () {
      var have = {};
      su.teachers.forEach(function (w) { if (w.email) have[w.email] = 1; });
      var fresh = S.users.filter(function (u) { return u.role === 'teacher' && canHold(u, stage) && !have[u.email]; });
      if (!fresh.length) { toast(t('blNoStaff')); return; }
      plCommit(t('blAddStaff'), function (x) { fresh.forEach(function (u) { if (x.teachers.length < 150) x.teachers.push({ id: newId('t'), name: u.name, email: u.email, quota: 24, maxDay: 0, subjects: [] }); }); });
      toast(t('blStaffAdded') + ' ' + fresh.length);
    };
    v.appendChild(h('div', { class: 'headrow' }, h('p', { class: 'lead', text: t('blTeachersLead') }), h('div', { class: 'actions' },
      h('button', { class: 'btn sm', type: 'button', id: 'blAddTeacher', onclick: function () { teacherSheet(''); } }, ic('plus'), t('blAddTeacher')),
      h('button', { class: 'btn ghost sm', type: 'button', id: 'blAddStaff', onclick: addStaff }, ic('people'), t('blAddStaff')),
      h('button', { class: 'btn ghost sm', type: 'button', id: 'blPasteTeachers', onclick: teacherPaste }, ic('upload'), t('blPaste')))));
    if (!su.teachers.length) { v.appendChild(h('div', { class: 'empty', id: 'blNoTeachers', text: t('blNoTeachers') })); return; }
    var tb = h('tbody');
    su.teachers.slice().sort(byName).forEach(function (w) {
      var n = assignedOf(su, w.id);
      tb.appendChild(h('tr', { 'data-teacher': w.id }, h('th', null, h('button', { class: 'hbtn', type: 'button', onclick: function () { teacherSheet(w.id); } }, w.name)),
        h('td', { text: w.subjects.join('، ') || '—' }), h('td', { text: w.quota }), h('td', null, h('span', { class: 'tot ' + (n > w.quota ? 'over' : n ? 'ok' : ''), text: n })), h('td', { text: w.maxDay || '—' })));
    });
    v.appendChild(h('div', { class: 'tw' }, h('table', { class: 'mx start', id: 'blTeachers' }, h('thead', null, h('tr', null, h('th', { text: t('blTeacher') }), h('th', { text: t('blSubjects') }), h('th', { text: t('blQuota') }), h('th', { text: t('blAssigned') }), h('th', { text: t('blMaxDay') }))), tb)));
  }

  /* ---- step 3: who teaches what ---- */
  function blAssign(v, stage, su) {
    var ui = S.plUi;
    if (!su.loads.length || !su.teachers.length) { v.appendChild(h('div', { class: 'empty', id: 'blNeedPlan', text: t('blNeedPlan') })); return; }
    var auto = function (redo) {
      var out = null;
      plCommit(redo ? t('blAutoAll') : t('blAuto'), function (x) { out = APSolver.assign(x, redo); });
      ui.note = out;
      toast(t('blAutoDone') + ' ' + out.changed + (out.missing.length ? ' · ' + t('blAutoLeft') + ' ' + out.missing.length : ''), out.missing.length > 0);
      paintMain();
    };
    var again = sureBtn('blAutoAll', t('blAutoAll'), t('blAutoSure'), function () { auto(true); });
    again.className = 'btn ghost sm';
    v.appendChild(h('div', { class: 'headrow' }, h('p', { class: 'lead', text: t('blAssignLead') }), h('div', { class: 'actions' }, h('button', { class: 'btn sm', type: 'button', id: 'blAuto', onclick: function () { auto(false); } }, ic('people'), t('blAuto')), again)));
    var freeNote = h('p', { id: 'blUnassigned' }), loadsBody = h('tbody');
    var refresh = function () {
      var free = su.loads.filter(function (l) { return !l.teacher; }).length;
      freeNote.className = 'note' + (free ? ' warn' : ''); freeNote.textContent = free ? t('blUnassigned') + ': ' + free : t('blAllAssigned');
      clear(loadsBody);
      su.teachers.slice().sort(byName).forEach(function (w) {
        var n = assignedOf(su, w.id);
        loadsBody.appendChild(h('tr', { 'data-teacher': w.id }, h('th', { text: w.name }), h('td', { text: w.subjects.join('، ') || '—' }), h('td', null, h('span', { class: 'tot ' + (n > w.quota ? 'over' : n ? 'ok' : ''), text: n + ' / ' + w.quota })),
          h('td', null, n > w.quota ? pill('overdue', t('blOver')) : n ? pill('done', t('blWithin')) : null)));
      });
    };
    v.appendChild(freeNote);
    if (ui.note && ui.note.missing.length) {
      var ul = h('ul', { class: 'mini', id: 'blMissing' });
      ui.note.missing.slice(0, 12).forEach(function (m) { ul.appendChild(h('li', null, h('b', { text: m.klass + ' · ' + m.subject + ' (' + m.count + ')' }), ' · ' + t(m.able ? 'blShort' : 'blNoTeacherFor'))); });
      v.appendChild(ul);
    }
    var tb = h('tbody'), head = h('tr', null, h('th', { text: t('klass') })), everyone = su.teachers.slice().sort(byName);
    su.subjects.forEach(function (s) { head.appendChild(h('th', { text: s })); });
    su.classes.forEach(function (k) {
      var tr = h('tr', null, h('th', { text: k }));
      su.subjects.forEach(function (s) {
        var l = loadOf(su, k, s);
        if (!l) { tr.appendChild(h('td', { class: 'none', text: '·' })); return; }
        var able = everyone.filter(function (w) { return w.subjects.indexOf(s) !== -1; }), rest = everyone.filter(function (w) { return w.subjects.indexOf(s) === -1; });
        var pick = h('select', { 'data-cell': k + '|' + s, 'aria-label': k + ' · ' + s }), opt = function (w) { var o = h('option', { value: w.id, text: w.name }); if (w.id === l.teacher) o.selected = true; return o; };
        pick.appendChild(h('option', { value: '', text: '—' }));
        if (able.length) pick.appendChild(h('optgroup', { label: s }, able.map(opt)));
        if (rest.length) pick.appendChild(h('optgroup', { label: t('blOthers') }, rest.map(opt)));
        pick.addEventListener('change', function () { var val = pick.value; ui.note = null; plCommit(k + ' · ' + s, function (x) { var y = loadOf(x, k, s); if (y) y.teacher = val; }, true); refresh(); });
        tr.appendChild(h('td', null, pick, h('small', { class: 'cnt', text: l.count })));
      });
      tb.appendChild(tr);
    });
    v.appendChild(h('div', { class: 'tw' }, h('table', { class: 'mx', id: 'blAssign' }, h('thead', null, head), tb)));
    v.appendChild(h('h2', { text: t('blLoads') }));
    v.appendChild(h('div', { class: 'tw' }, h('table', { class: 'mx start', id: 'blLoads' }, h('thead', null, h('tr', null, h('th', { text: t('blTeacher') }), h('th', { text: t('blSubjects') }), h('th', { text: t('blAssigned') + ' / ' + t('blQuota') }), h('th', { text: t('status') }))), loadsBody)));
    refresh();
  }

  /* ---- step 4: the admins' instructions ---- */
  function spanText(r) { return r.from === 1 && r.to === S.tt.perDay ? t('blAllDay') : t('ttPeriod') + ' ' + r.from + (r.to !== r.from ? '–' + r.to : ''); }
  function ruleText(r, su) {
    var w = r.teacher ? teacherOf(su, r.teacher) : null, who = r.teacher ? (w ? w.name : '—') : t('blAllTeachers'), where = r.klass || t('blAllClasses');
    if (r.type === 'off') return who + ' · ' + t('rl_off') + ' · ' + (r.days && r.days.length ? r.days.map(dayLabel).join('، ') : t('blEveryDay')) + ' · ' + spanText(r);
    if (r.type === 'window') return r.subject + ' (' + where + ') · ' + t('rl_window') + ' ' + r.from + '–' + r.to + ' ' + t('rl_only');
    if (r.type === 'maxDay') return who + ' · ' + fillT('rl_maxDay', r);
    if (r.type === 'streak') return who + ' · ' + fillT('rl_streak', r);
    if (r.type === 'subjectDay') return r.subject + ' · ' + fillT('rl_subjectDay', r);
    if (r.type === 'together') return r.subject + ' · ' + fillT('rl_together', r);
    return where + ' · ' + dayLabel(r.day) + ' · ' + t('ttPeriod') + ' ' + r.period + ' · ' + (r.label || t('blClosed'));
  }
  function ruleSheet(id) {
    var su = plEntry(plStage()).setup, cur = id ? su.rules.filter(function (x) { return x.id === id; })[0] : null, isNew = !cur, P = S.tt.perDay;
    var r = cur ? JSON.parse(JSON.stringify(cur)) : { id: newId('r'), type: 'off', must: true };
    var type = pickOf('brType', APSolver.RULE_TYPES.map(function (x) { return [x, t('rt_' + x)]; }), r.type), body = h('div', { class: 'form' }), F = {};
    type.disabled = !isNew;
    var paint = function () {
      clear(body); F = {};
      var ty = type.value, teachers = su.teachers.slice().sort(byName).map(function (w) { return [w.id, w.name]; }), subs = su.subjects.map(function (s) { return [s, s]; }), classes = su.classes.map(function (k) { return [k, k]; });
      if (ty === 'off' || ty === 'maxDay' || ty === 'streak') body.appendChild(field(t('blTeacher'), F.teacher = pickOf('brTeacher', (ty === 'off' ? [] : [['', t('blAllTeachers')]]).concat(teachers), r.teacher)));
      if (ty === 'window' || ty === 'subjectDay' || ty === 'together') body.appendChild(field(t('subject'), F.subject = pickOf('brSubject', subs, r.subject)));
      if (ty === 'window' || ty === 'fixed') body.appendChild(field(t('klass'), F.klass = pickOf('brClass', [['', t('blAllClasses')]].concat(classes), r.klass)));
      if (ty === 'off') {
        F.days = []; var row = h('div', { class: 'checks', id: 'brDays' });
        for (var d = 0; d < S.tt.days; d++) { var b = h('input', { type: 'checkbox', 'data-day': d, checked: (r.days || []).indexOf(d) !== -1 }); F.days.push(b); row.appendChild(h('label', { class: 'check' }, b, dayLabel(d))); }
        body.appendChild(h('div', { class: 'fld' }, h('span', { text: t('blDaysL') }), row));
      }
      if (ty === 'off' || ty === 'window') body.appendChild(h('div', { class: 'row2' }, field(t('blFrom'), F.from = pickOf('brFrom', numbers(1, P), r.from || 1)), field(t('blTo'), F.to = pickOf('brTo', numbers(1, P), r.to || P))));
      if (ty === 'fixed') {
        var dayItems = []; for (var n = 0; n < S.tt.days; n++) dayItems.push([n, dayLabel(n)]);
        body.appendChild(h('div', { class: 'row2' }, field(t('dayL'), F.day = pickOf('brDay', dayItems, r.day || 0)), field(t('ttPeriod'), F.period = pickOf('brPeriod', numbers(1, P), r.period || P))));
        body.appendChild(field(t('blLabel'), F.label = h('input', { type: 'text', id: 'brLabel', maxlength: '40', value: r.label || '' })));
      }
      if (ty === 'maxDay' || ty === 'streak' || ty === 'subjectDay' || ty === 'together') body.appendChild(field(t('blHowMany'), F.n = pickOf('brN', numbers(1, ty === 'together' ? 10 : P), r.n || { maxDay: 6, streak: 4, subjectDay: 2, together: 1 }[ty])));
      if (ty === 'off' || ty === 'window' || ty === 'streak') body.appendChild(field(t('blStrength'), F.must = pickOf('brMust', [['1', t('blMust')], ['0', t('blPrefer')]], r.must === false ? '0' : '1')));
    };
    type.addEventListener('change', paint);
    paint();
    showSheet(isNew ? t('blAddRule') : t('rt_' + r.type), h('section', { class: 'box' }, h('form', { class: 'form', id: 'brForm', onsubmit: function (e) {
      e.preventDefault();
      var o = { id: r.id, type: type.value, must: F.must ? F.must.value === '1' : true };
      if (F.teacher) o.teacher = F.teacher.value;
      if (F.subject) o.subject = F.subject.value;
      if (F.klass) o.klass = F.klass.value;
      if (F.days) o.days = F.days.filter(function (b) { return b.checked; }).map(function (b) { return +b.getAttribute('data-day'); });
      if (F.from) { o.from = Math.min(+F.from.value, +F.to.value); o.to = Math.max(+F.from.value, +F.to.value); }
      if (F.day) { o.day = +F.day.value; o.period = +F.period.value; o.label = tidy(F.label.value, 40); }
      if (F.n) o.n = +F.n.value;
      if ((o.type === 'off' && !o.teacher) || (F.subject && !o.subject)) { toast(t('blRuleNeeds'), true); return; }
      plCommit(t(isNew ? 'blAddRule' : 'rt_' + o.type), function (x) { var at = -1; x.rules.forEach(function (y, i) { if (y.id === o.id) at = i; }); if (at === -1) { if (x.rules.length < 100) x.rules.push(o); } else x.rules[at] = o; });
      closeSheet();
    } }, field(t('blRuleType'), type), body, h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit', id: 'brSave' }, t('saveL'))))));
  }
  function blRules(v, stage, su) {
    v.appendChild(h('div', { class: 'headrow' }, h('p', { class: 'lead', text: t('blRulesLead') }), h('button', { class: 'btn sm', type: 'button', id: 'blAddRule', onclick: function () { ruleSheet(''); } }, ic('plus'), t('blAddRule'))));
    if (!su.rules.length) { v.appendChild(h('div', { class: 'empty', id: 'blNoRules', text: t('blNoRules') })); return; }
    var ul = h('ul', { class: 'rules', id: 'blRules' });
    su.rules.forEach(function (r) {
      ul.appendChild(h('li', { 'data-rule': r.id, 'data-type': r.type }, h('button', { class: 'tx', type: 'button', onclick: function () { ruleSheet(r.id); } }, ruleText(r, su)), pill(r.must === false ? 'soon' : 'pending', t(r.must === false ? 'blPrefer' : 'blMust')),
        h('button', { class: 'x', type: 'button', 'aria-label': t('blRemove'), title: t('blRemove'), onclick: function () { plCommit(t('blRemove') + ' · ' + t('rt_' + r.type), function (x) { x.rules = x.rules.filter(function (y) { return y.id !== r.id; }); }); } }, ic('x'))));
    });
    v.appendChild(ul);
  }

  /* ---- step 5: build, read the report, apply ---- */
  /** Sessions a teacher already has outside this build (another stage, or a class that is not in the plan): the builder keeps those times free. */
  function busyElsewhere(stage, su) {
    var byMail = {}, extra = [];
    su.teachers.forEach(function (w) { if (w.email) byMail[w.email] = w.id; });
    S.tt.lessons.forEach(function (l) {
      var id = l.teacher && byMail[l.teacher];
      if (id && !(l.stage === stage && su.classes.indexOf(l.klass) !== -1)) extra.push({ id: 'busy' + extra.length, type: 'off', must: true, teacher: id, days: [l.weekday], from: l.period, to: l.period });
    });
    if (!extra.length) return { setup: su, busy: 0 };
    var copy = JSON.parse(JSON.stringify(su));
    copy.rules = copy.rules.concat(extra);
    return { setup: copy, busy: extra.length };
  }
  function blRun(stage, su, seed) {
    var c = APSolver.compile(busyElsewhere(stage, su).setup), ui = S.plUi;
    if (!c.ok) return;
    var run = APSolver.start(c.problem, seed), state = ui.run = { stage: stage, seed: seed, busy: true, result: null, report: null };
    ui.seed = seed;
    paintMain();
    (function tick() {
      if (ui.run !== state) return;                    // the setup changed, or another build started
      var until = Date.now() + 40;
      while (!run.done && Date.now() < until) run.step(4000);
      if (!run.done) { var bar = $('blBar'); if (bar) { bar.style.width = Math.round(run.progress * 100) + '%'; bar.parentNode.setAttribute('aria-valuenow', Math.round(run.progress * 100)); } setTimeout(tick, 0); return; }
      state.busy = false; state.result = run.result; state.report = APSolver.evaluate(su, run.result.lessons, run.result.fixed);
      if (S.view === 'builder') paintMain();
    })();
  }
  /** The built design as the same grid the school timetable uses: five days, numbered sessions. */
  function draftGrid(stage, su, res, mode, pick) {
    var week = h('div', { class: 'week tt', id: 'blDraft' }), names = {}, times = timesOf(stage);
    su.teachers.forEach(function (w) { names[w.id] = w.name; });
    for (var n = 0; n < S.tt.days; n++) {
      var col = h('div', { class: 'wk', 'data-wd': n }, h('b', { text: dayLabel(n) }));
      for (var k = 1; k <= S.tt.perDay; k++) {
        var here = res.lessons.filter(function (x) { return x.day === n && x.period === k && (mode === 'class' ? x.klass === pick : x.teacher === pick); });
        var held = mode === 'class' ? res.fixed.filter(function (f) { return f.klass === pick && f.day === n && f.period === k; }) : [];
        var tm = times[k - 1] || ['', ''], off = k > su.dayLen[n];
        var slot = h('div', { class: 'slot' + (here.length || held.length ? '' : ' free') + (off ? ' off' : ''), 'data-slot': n + '-' + k }, h('span', { class: 'slot-t' }, h('b', { text: k }), h('span', { class: 'ltr', text: tm[0] ? tm[0] + ' – ' + tm[1] : '' })));
        here.forEach(function (x) { slot.appendChild(h('div', { class: 'sess' }, h('b', { text: x.subject }), h('small', { text: mode === 'class' ? (names[x.teacher] || '') : x.klass }))); });
        held.forEach(function (f) { slot.appendChild(h('div', { class: 'sess held' }, h('b', { text: f.label }))); });
        col.appendChild(slot);
      }
      week.appendChild(col);
    }
    return week;
  }
  function blBuild(v, stage, su) {
    var ui = S.plUi, eff = busyElsewhere(stage, su), c = APSolver.compile(eff.setup), run = ui.run && ui.run.stage === stage ? ui.run : null, issues = h('ul', { class: 'mini', id: 'blIssues' });
    c.errors.forEach(function (x) { issues.appendChild(h('li', { class: 'bad', text: fillT('e_' + x.code, x) })); });
    c.warnings.forEach(function (x) { issues.appendChild(h('li', { text: fillT('w_' + x.code, x) })); });
    var goBtn = h('button', { class: 'btn', type: 'button', id: 'blGo', disabled: !c.ok || !!(run && run.busy), onclick: function () { blRun(stage, su, 1); } }, ic('builder'), t('blGo'));
    v.appendChild(h('section', { class: 'box' }, h('div', { class: 'headrow' }, h('h2', { text: t('blCheck') }), goBtn),
      h('p', { class: 'lead', id: 'blSize', text: su.classes.length + ' ' + t('blClassesW') + ' · ' + c.problem.lessons.length + ' ' + t('ttSessionsWord') + ' · ' + su.teachers.length + ' ' + t('blTeachersW') + ' · ' + su.rules.length + ' ' + t('blRulesW') }),
      c.errors.length || c.warnings.length ? issues : null, eff.busy ? h('p', { class: 'lead', id: 'blBusy', text: fillT('blBusy', { n: eff.busy }) }) : null, c.ok ? h('p', { class: 'note', id: 'blReady', text: t('blReady') }) : null));
    if (run && run.busy) {
      v.appendChild(h('section', { class: 'box', id: 'blWorking' }, h('b', { text: t('blWorking') }), h('div', { class: 'prog', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-label': t('blWorking') }, h('i', { id: 'blBar' }))));
      return;
    }
    if (!run || !run.result) { if (c.ok) v.appendChild(h('div', { class: 'empty', id: 'blNotBuilt', text: t('blNotBuilt') })); return; }
    var res = run.result, rep = run.report, placed = res.lessons.length, kept = rep.rules.filter(function (x) { return !x.broken; }).length, clashes = rep.classClash + rep.teacherClash;
    var stat = function (id, n, label, cls) { return h('div', { class: 'stat ' + (cls || ''), id: id }, h('b', { text: n }), h('span', { text: label })); };
    var names = {};
    su.teachers.forEach(function (w) { names[w.id] = w; });
    var payload = JSON.stringify({ stage: stage, classes: su.classes, lessons: res.lessons.map(function (l) { var w = names[l.teacher]; return { klass: l.klass, weekday: l.day, period: l.period, subject: l.subject, teacher: (w && w.email) || '', teacherName: w && !w.email ? w.name : '' }; })
      .concat(res.fixed.map(function (f) { return { klass: f.klass, weekday: f.day, period: f.period, subject: f.label }; })) });
    var now = S.tt.lessons.filter(function (l) { return l.stage === stage && su.classes.indexOf(l.klass) !== -1; }).length;
    var applyBtn = sureBtn('blApply', t('blApply'), fillT('blApplySure', { c: su.classes.length, n: now }), function () {
      busy(applyBtn, true);
      call('api_applySchedule', payload).then(function (out) {
        var r = JSON.parse(out), ref = { id: r.undoId };
        record(t('blApplyUndo'), function () { return call('api_undoApply', stage, ref.id).then(function () { S.tt = null; }); }, function () { return call('api_applySchedule', payload).then(function (x) { ref.id = JSON.parse(x).undoId; S.tt = null; }); });
        S.tt = null; S.ttMode = 'class'; S.ttPick = stage + '|' + su.classes[0];
        toast(t('blApplied') + ' ' + r.added + (r.clashing ? ' · ' + t('blAppliedClash') + ' ' + r.clashing : ''), r.clashing > 0);
        go('timetable');
      }, function (er) { busy(applyBtn, false); toast(errText(er), true); });
    });
    applyBtn.className = 'btn';
    v.appendChild(h('section', { class: 'box', id: 'blResult' }, h('div', { class: 'headrow' }, h('h2', { text: t('blDraft') + ' · ' + t('blSeed') + ' ' + run.seed }), h('div', { class: 'actions' },
      h('button', { class: 'btn ghost sm', type: 'button', id: 'blAgain', onclick: function () { blRun(stage, su, run.seed + 1); } }, ic('sync'), t('blAgain')), placed ? applyBtn : null)),
      h('div', { class: 'stats', id: 'blSummary' }, stat('blStatPlaced', placed + ' / ' + res.total, t('blPlaced'), placed === res.total ? 'good' : 'bad'), stat('blStatClash', clashes, t('blClashes'), clashes ? 'bad' : 'good'),
        stat('blStatGaps', rep.classGaps, t('blClassGaps'), rep.classGaps ? 'bad' : 'good'), rep.rules.length ? stat('blStatRules', kept + ' / ' + rep.rules.length, t('blRulesKept'), kept === rep.rules.length ? 'good' : '') : null,
        stat('blStatWait', rep.teacherGaps, t('blTeacherGaps')), stat('blStatLong', rep.maxTeacherDay, t('blLongest')))));
    if (res.unplaced.length) {
      var miss = h('ul', { class: 'mini', id: 'blUnplaced' });
      res.unplaced.forEach(function (u) { miss.appendChild(h('li', null, h('b', { text: u.klass + ' · ' + u.subject + (names[u.teacher] ? ' · ' + names[u.teacher].name : '') }), ' · ' + u.n)); });
      v.appendChild(h('section', { class: 'box' }, h('h2', { text: t('blUnplaced') }), h('p', { class: 'note warn', text: t('blUnplacedHint') }), miss));
    }
    if (rep.rules.length) {
      var rl = h('ul', { class: 'rules', id: 'blRuleReport' });
      rep.rules.forEach(function (x) {
        var r = su.rules.filter(function (y) { return y.id === x.id; })[0];
        if (r) rl.appendChild(h('li', { 'data-rule': x.id, 'data-broken': x.broken }, h('span', { class: 'tx', text: ruleText(r, su) }), pill(r.must === false ? 'soon' : 'pending', t(r.must === false ? 'blPrefer' : 'blMust')),
          x.broken ? pill('overdue', t('blBroken') + ' ' + x.broken + ' ' + t('blTimesW')) : pill('done', t('blKept'))));
      });
      v.appendChild(h('section', { class: 'box' }, h('h2', { text: t('blRuleReport') }), rl));
    }
    var mode = ui.mode === 'teacher' ? 'teacher' : 'class', keys = mode === 'class' ? su.classes.map(function (k) { return [k, k]; }) : su.teachers.slice().sort(byName).filter(function (w) { return res.lessons.some(function (l) { return l.teacher === w.id; }); }).map(function (w) { return [w.id, w.name]; });
    var pick = keys.some(function (x) { return x[0] === ui.pick; }) ? ui.pick : (keys[0] || [''])[0];
    var chooser = sel(mode === 'class' ? t('klass') : t('blTeacher'), pick, keys, function (val) { ui.pick = val; paintMain(); });
    chooser.querySelector('select').id = 'blDraftPick';
    var tabs = tabsRow([['class', t('blByClass')], ['teacher', t('blByTeacher')]], mode, function (k) { ui.mode = k; ui.pick = ''; paintMain(); });
    tabs.id = 'blDraftTabs';
    v.appendChild(h('div', { class: 'headrow' }, tabs, h('div', { class: 'filters one' }, chooser)));
    v.appendChild(draftGrid(stage, su, res, mode, pick));
    var tb = h('tbody'), th = h('tr', null, h('th', { text: t('blTeacher') }), h('th', { text: t('blTotal') }));
    for (var d = 0; d < S.tt.days; d++) th.appendChild(h('th', { text: dayLabel(d) }));
    th.appendChild(h('th', { text: t('blGaps') }));
    rep.teachers.filter(function (x) { return x.total; }).sort(byName).forEach(function (x) {
      var tr = h('tr', { 'data-teacher': x.id }, h('th', { text: x.name }), h('td', null, h('b', { text: x.total })));
      x.days.forEach(function (n) { tr.appendChild(h('td', { text: n || '·' })); });
      tr.appendChild(h('td', { text: x.gaps })); tb.appendChild(tr);
    });
    v.appendChild(h('h2', { text: t('blTeacherDays') }));
    v.appendChild(h('div', { class: 'tw' }, h('table', { class: 'mx start', id: 'blTeacherDays' }, h('thead', null, th), tb)));
  }
  function vBuilder() {
    var v = h('div', { class: 'view builder' }), ui = S.plUi;
    v.appendChild(h('p', { class: 'lead', text: t('blLead') }));
    if (!plReady(v)) return v;
    var all = stagesShown(), stage = plStage();
    if (!stage) { v.appendChild(h('div', { class: 'empty', text: t('none') })); return v; }
    if (ui.stage !== stage) { ui.stage = stage; ui.run = null; ui.note = null; ui.pick = ''; }
    var su = plEntry(stage).setup, pickStage = all.length > 1 && !S.f.stage ? sel(t('stage'), stage, all.map(function (x) { return [x, stageName(x)]; }), function (val) { ui.stage = val; ui.run = null; ui.note = null; ui.pick = ''; paintMain(); }) : null;
    if (pickStage) pickStage.querySelector('select').id = 'blStage';
    var tabs = tabsRow(['plan', 'teachers', 'assign', 'rules', 'build'].map(function (k) { return [k, t('bl_' + k)]; }), ui.tab, function (k) { ui.tab = k; paintMain(); });
    tabs.id = 'blTabs';
    v.appendChild(h('div', { class: 'headrow' }, tabs, pickStage ? h('div', { class: 'filters one' }, pickStage) : null));
    ({ plan: blPlan, teachers: blTeachers, assign: blAssign, rules: blRules, build: blBuild }[ui.tab] || blPlan)(v, stage, su);
    return v;
  }

  /* ---------- classroom visits: an admin fills in the visit form of their role; the visit is kept under the teacher ---------- */
  var TXV = {
    ar: {
      visits: 'الزيارات الصفية', vsLead: 'سجّل الزيارة الصفية على استمارة دورك، فتُحفظ في ملف المعلم وتدخل في تقييمه.', vsLeadMine: 'زياراتك الصفية التي شاركها معك من زارك، بنتائجها وملاحظاتها.',
      vs_log: 'الزيارات', vs_eval: 'تقييم المعلمين', vs_forms: 'الاستمارات', vsNew: 'زيارة جديدة', vsEdit: 'تعديل الزيارة', vsNone: 'لا توجد زيارات مسجلة هنا بعد.', vsNoneMine: 'لم تُشارَك معك زيارات بعد.',
      vk_principal: 'المدير', vk_academic: 'المشرف الأكاديمي', vk_vp: 'الوكيل', vsForm: 'الاستمارة', vsVisitor: 'الزائر', vsResult: 'النتيجة', vsDate: 'تاريخ الزيارة', vsTeacher: 'المعلم', vsPickTeacher: 'اختر المعلم', vsOthers: 'منسوبون آخرون',
      vsAllTeachers: 'كل المعلمين', vsAllForms: 'كل الاستمارات', vsAllTerms: 'كل العام', vsSessionsOf: 'حصص المعلم في هذا اليوم، من الجدول المدرسي:', vsScale: 'مقياس التقدير', vsNA: 'لا ينطبق', vsStrengths: 'نقاط القوة', vsImprove: 'فرص التحسين',
      vsRecommend: 'التوصيات', vsNote: 'ملاحظة خاصة (لا يراها المعلم)', vsShared: 'تظهر الزيارة للمعلم في صفحته', vsSave: 'حفظ الزيارة', vsSaved: 'حُفظت الزيارة في ملف المعلم.', vsLeft: 'بنود بلا تقييم:', vsRated: 'بنداً مقيَّماً',
      vsNeedTeacher: 'اختر المعلم أولاً.', vsDraftBack: 'استُعيدت مسودة زيارة لم تُحفظ.', vsDiscard: 'إلغاء', vsReport: 'تقرير زيارة صفية', vsPrint: 'طباعة', vsDelete: 'حذف الزيارة', vsDeleteSure: 'تأكيد الحذف', vsDeleted: 'حُذفت الزيارة.',
      vsSeen: 'تم الاطلاع', vsNotSeen: 'لم يطّلع بعد', vsHidden: 'غير مشاركة مع المعلم', vsISaw: 'اطّلعت على الزيارة', vsSawOk: 'سُجّل اطلاعك.', vsNewTag: 'جديدة', vsDomains: 'النتيجة حسب المجال', vsNotes: 'الملاحظات',
      vsCount: 'الزيارات', vsLast: 'آخر زيارة', vsAvg: 'المتوسط', vsNotVisited: 'لم يُزر', vsCoverage: 'زير {a} من {b} معلماً', vsAvgAll: 'متوسط النتائج', vsEvalLead: 'نتائج زيارات كل معلم. المتوسط هو متوسط نتائج زياراته، ولكل استمارة متوسطها. اضغط اسم المعلم لتفاصيله.',
      vsFormsLead: 'لكل دور استمارته. يعدّلها مدير المدرسة أو مالك النظام، والزيارات السابقة تبقى على الاستمارة التي سُجّلت بها.', vsFormsWho: 'استمارة المشرف الأكاديمي يستخدمها حساب وكيل الشؤون التعليمية. مالك النظام يختار الاستمارة عند كل زيارة.',
      vsEditForm: 'تعديل الاستمارة', vsFormTitle: 'عنوان الاستمارة', vsScaleL: 'مستويات التقدير، من الأعلى إلى الأدنى', vsScaleHint: 'افصل بينها بفاصلة. من مستويين إلى خمسة. مثال: متميز، جيد، مقبول، يحتاج تطويراً',
      vsItemsL: 'المجالات والبنود', vsItemsHint: 'كل بند في سطر. السطر الذي يبدأ بعلامة # عنوان مجال. يمكنك لصق الاستمارة من Word.', vsItems: 'بنود الاستمارة', vsFormSaved: 'حُفظت الاستمارة. تُستخدم في الزيارات الجديدة.',
      vsDomainsW: 'مجالات', vsItemsW: 'بنداً', vsSession: 'الحصة', vsMineAvg: 'متوسط نتائجي', vsBack: 'رجوع', vsNoTeachers: 'لا يوجد منسوبون في هذه المرحلة. أضفهم من الإدارة ثم المستخدمون.', vsVisitsOf: 'زيارات المعلم', vsItem: 'البند', vsRating: 'التقدير'
    },
    en: {
      visits: 'Classroom visits', vsLead: "Record a classroom visit on your role's form. It is kept in the teacher's file and counts in their evaluation.", vsLeadMine: 'Your classroom visits that the visitor shared with you, with their results and notes.',
      vs_log: 'Visits', vs_eval: "Teachers' evaluation", vs_forms: 'Forms', vsNew: 'New visit', vsEdit: 'Edit visit', vsNone: 'No visits recorded here yet.', vsNoneMine: 'No visits have been shared with you yet.',
      vk_principal: 'Principal', vk_academic: 'Academic supervisor', vk_vp: 'Vice Principal', vsForm: 'Form', vsVisitor: 'Visitor', vsResult: 'Result', vsDate: 'Date of visit', vsTeacher: 'Teacher', vsPickTeacher: 'Choose the teacher', vsOthers: 'Other staff',
      vsAllTeachers: 'All teachers', vsAllForms: 'All forms', vsAllTerms: 'Whole year', vsSessionsOf: "The teacher's sessions that day, from the school timetable:", vsScale: 'Rating scale', vsNA: 'Does not apply', vsStrengths: 'Strengths', vsImprove: 'Areas to improve',
      vsRecommend: 'Recommendations', vsNote: 'Private note (the teacher does not see it)', vsShared: 'The teacher sees this visit on their page', vsSave: 'Save visit', vsSaved: "Visit saved in the teacher's file.", vsLeft: 'Items not rated:', vsRated: 'items rated',
      vsNeedTeacher: 'Choose the teacher first.', vsDraftBack: 'An unsaved visit draft was restored.', vsDiscard: 'Cancel', vsReport: 'Classroom visit report', vsPrint: 'Print', vsDelete: 'Delete visit', vsDeleteSure: 'Confirm deletion', vsDeleted: 'Visit deleted.',
      vsSeen: 'Read', vsNotSeen: 'Not read yet', vsHidden: 'Not shared with the teacher', vsISaw: 'I have read this visit', vsSawOk: 'Recorded as read.', vsNewTag: 'New', vsDomains: 'Result by domain', vsNotes: 'Notes',
      vsCount: 'Visits', vsLast: 'Last visit', vsAvg: 'Average', vsNotVisited: 'Not visited', vsCoverage: '{a} of {b} teachers visited', vsAvgAll: 'Average result', vsEvalLead: "Each teacher's visit results. The average is the mean of their visits; each form has its own average. Select a teacher for details.",
      vsFormsLead: 'Each role has its own form. The Principal or the system owner changes them; earlier visits keep the form they were recorded with.', vsFormsWho: "The academic supervisor's form is used by the Academic Vice Principal's account. The system owner chooses the form at each visit.",
      vsEditForm: 'Edit form', vsFormTitle: 'Form title', vsScaleL: 'Rating levels, highest first', vsScaleHint: 'Separate with commas. Two to five levels. Example: Excellent, Good, Acceptable, Needs development',
      vsItemsL: 'Domains and items', vsItemsHint: 'One item per line. A line that starts with # is a domain title. You can paste the form from Word.', vsItems: 'Form items', vsFormSaved: 'Form saved. New visits use it.',
      vsDomainsW: 'domains', vsItemsW: 'items', vsSession: 'Session', vsMineAvg: 'My average', vsBack: 'Back', vsNoTeachers: 'This stage has no staff yet. Add them under Admin, then Users.', vsVisitsOf: "The teacher's visits", vsItem: 'Item', vsRating: 'Rating'
    }
  };
  Object.keys(TXV).forEach(function (l) { Object.keys(TXV[l]).forEach(function (k) { TX[l][k] = TXV[l][k]; }); });
  ICON.visits = 'M9 4h6v3H9zM7 5H5v15h14V5h-2M8.5 13l2.5 2.5 4.5-5';
  var VKINDS = ['principal', 'academic', 'vp'], vsLoading = false;
  function vsReset() { S.vs = null; S.vsUi = { tab: 'log', term: '', who: '', kind: '', form: null, open: null }; }
  vsReset();
  function vsReady(v) {
    if (S.vs && (!isLead() || S.users)) return true;
    v.appendChild(h('div', { class: 'spin' }));
    if (vsLoading) return false;
    vsLoading = true;
    Promise.all([S.vs ? null : call('api_visits').then(function (r) { S.vs = JSON.parse(r); }), isLead() && !S.users ? call('api_users').then(function (r) { S.users = JSON.parse(r); }) : null])
      .then(function () { vsLoading = false; if (S.view === 'visits') paintMain(); }, function (e) { vsLoading = false; toast(errText(e), true); });
    return false;
  }
  function band(p) { return p >= 85 ? 'done' : p >= 70 ? 'active' : p >= 50 ? 'soon' : 'overdue'; }
  function pctPill(p) { return p == null ? h('span', { class: 'muted', text: '—' }) : h('span', { class: 'pill p-' + band(p), text: p + '%' }); }
  function mean(list) { if (!list.length) return null; var s = 0; list.forEach(function (x) { s += x; }); return Math.round(s / list.length); }
  function inTerm(date) { var t2 = (S.settings.termStarts || {})[2] || ''; return !S.vsUi.term || (S.vsUi.term === '1' ? !t2 || date < t2 : !!t2 && date >= t2); }
  function vsShown() { return S.vs.visits.filter(function (x) { return stageOk(x.stage) && inTerm(x.date); }); }
  function putVisit(x) { var at = -1, s = {}; for (var k in x) if (['form', 'answers', 'strengths', 'improve', 'recommend', 'note'].indexOf(k) === -1) s[k] = x[k]; S.vs.visits.forEach(function (y, i) { if (y.id === x.id) at = i; }); if (at > -1) S.vs.visits[at] = s; else S.vs.visits.push(s); }
  function dropVisit(id) { S.vs.visits = S.vs.visits.filter(function (y) { return y.id !== id; }); if (S.vsUi.open && S.vsUi.open.id === id) S.vsUi.open = null; }
  function blankAnswers(form) { return form.sections.map(function (sec) { return sec.items.map(function () { return null; }); }); }
  /** The result so far: share of full marks over the rated items, and how many items are still to rate. */
  function liveScore(form, answers, only) {
    var n = form.scale.length, sum = 0, cnt = 0, left = 0;
    form.sections.forEach(function (sec, i) { if (only != null && only !== i) return; sec.items.forEach(function (_, j) { var v = answers[i][j]; if (v == null) left++; else if (v) { sum += v; cnt++; } }); });
    return { pct: cnt ? Math.round(sum * 100 / (cnt * n)) : null, left: left, rated: cnt };
  }
  function openVisit(id) { call('api_visit', id).then(function (r) { S.vsUi.open = JSON.parse(r).visit; S.vsUi.form = null; closeSheet(); render(); window.scrollTo(0, 0); }, function (e) { toast(errText(e), true); }); }
  function payloadOf(d) { return { id: d.id, stage: d.stage, teacher: d.teacher, date: d.date, kind: d.kind, klass: d.klass, subject: d.subject, period: d.period, answers: d.answers, strengths: d.strengths, improve: d.improve, recommend: d.recommend, note: d.note, shared: d.shared }; }
  function keepDraft(d) { store('ap.visit', d ? JSON.stringify({ by: S.me.email, d: d }) : null); }
  function startVisit(teacher) {
    var kind = S.vs.kind || 'principal', stage = S.f.stage || stagesShown()[0], d = null, person = teacher ? S.users.filter(function (u) { return u.email === teacher; })[0] : null;
    if (person) stage = stagesShown().filter(function (st) { return canHold(person, st) && (!S.f.stage || st === S.f.stage); })[0] || stage;
    // a visit that was being filled in when the page closed is offered again, if its form has not changed since
    try {
      var kept = JSON.parse(store('ap.visit') || 'null'), f = kept && kept.d && S.vs.forms[kept.d.kind];
      if (f && kept.by === S.me.email && !kept.d.id && kept.d.answers.length === f.sections.length && f.sections.every(function (sec, i) { return kept.d.answers[i].length === sec.items.length; })) d = kept.d;
    } catch (e) { d = null; }
    if (d && !teacher) toast(t('vsDraftBack'));
    else d = { id: '', stage: stage, teacher: teacher || '', date: S.today, kind: kind, klass: '', subject: '', period: '', answers: blankAnswers(S.vs.forms[kind]), strengths: '', improve: '', recommend: '', note: '', shared: true };
    S.vsUi.form = d; S.vsUi.open = null; closeSheet(); render(); window.scrollTo(0, 0);
  }
  function editVisit(x) {
    S.vsUi.form = { id: x.id, stage: x.stage, teacher: x.teacher, teacherName: x.teacherName, date: x.date, kind: x.kind, klass: x.klass, subject: x.subject, period: x.period, answers: JSON.parse(JSON.stringify(x.answers)), strengths: x.strengths, improve: x.improve,
      recommend: x.recommend, note: x.note || '', shared: x.shared, form: x.form, before: x };
    S.vsUi.open = null; render(); window.scrollTo(0, 0);
  }

  /* ---- filling in a visit ---- */
  function visitForm(v) {
    var ui = S.vsUi, d = ui.form, isNew = !d.id, form = d.form || S.vs.forms[d.kind], n = form.scale.length, save = h('button', { class: 'btn', type: 'submit', id: 'vfSave' }, t('vsSave'));
    var changed = function () { if (isNew) keepDraft(d); };
    var leave = function () { ui.form = null; if (isNew) keepDraft(null); if (d.before) ui.open = d.before; render(); };
    v.appendChild(h('div', { class: 'headrow' }, h('h2', { text: isNew ? t('vsNew') : t('vsEdit') }), h('button', { class: 'btn ghost sm', type: 'button', id: 'vfBack', onclick: leave }, t('vsDiscard'))));
    var stg = pickOf('vfStage', stagesShown().map(function (x) { return [x, stageName(x)]; }), d.stage), who = h('select', { id: 'vfTeacher', required: true }), chips = h('div', { class: 'chips wrap', id: 'vfSessions' });
    var date = h('input', { type: 'date', id: 'vfDate', required: true, max: S.today, value: d.date }), kl = h('input', { type: 'text', id: 'vfClass', maxlength: '30', value: d.klass }), su = h('input', { type: 'text', id: 'vfSubject', maxlength: '80', value: d.subject });
    var per = pickOf('vfPeriod', [['', '—']].concat(numbers(1, 8)), d.period), kind = pickOf('vfKind', VKINDS.map(function (k) { return [k, t('vk_' + k)]; }), d.kind);
    var fillWho = function () {
      clear(who).appendChild(h('option', { value: '', text: t('vsPickTeacher') }));
      var staff = S.users.filter(function (u) { return canHold(u, d.stage) && u.email !== S.me.email; }).sort(byName), opt = function (u) { var o = h('option', { value: u.email, text: u.name }); if (u.email === d.teacher) o.selected = true; return o; };
      var teachers = staff.filter(function (u) { return u.role === 'teacher'; }), rest = staff.filter(function (u) { return u.role !== 'teacher'; });
      add(who, teachers.map(opt));
      if (rest.length) who.appendChild(h('optgroup', { label: t('vsOthers') }, rest.map(opt)));
      if (!staff.length) toast(t('vsNoTeachers'), true);
    };
    /** The teacher's sessions on the day of the visit, from the school timetable: one press fills class, subject and session. */
    var fillChips = function () {
      clear(chips);
      if (!d.teacher || !d.date) return;
      if (!S.tt) { if (!fillChips.asked) { fillChips.asked = true; call('api_timetable').then(function (r) { S.tt = JSON.parse(r); if (ui.form === d) fillChips(); }, function () {}); } return; }
      var wd = new Date(d.date + 'T00:00:00Z').getUTCDay(), mine = S.tt.lessons.filter(function (l) { return l.teacher === d.teacher && l.weekday === wd && l.stage === d.stage; }).sort(function (a, b) { return a.period - b.period; });
      if (!mine.length) return;
      chips.appendChild(h('small', { class: 'lead', text: t('vsSessionsOf') }));
      mine.forEach(function (l) {
        chips.appendChild(h('button', { class: 'chip', type: 'button', 'data-session': l.period, onclick: function () { d.klass = kl.value = l.klass; d.subject = su.value = l.subject; d.period = l.period; per.value = String(l.period); changed(); } }, t('vsSession') + ' ' + l.period + ' · ' + l.klass + ' · ' + l.subject));
      });
    };
    stg.addEventListener('change', function () { d.stage = stg.value; d.teacher = ''; fillWho(); fillChips(); changed(); });
    who.addEventListener('change', function () { d.teacher = who.value; fillChips(); changed(); });
    date.addEventListener('change', function () { d.date = date.value; fillChips(); changed(); });
    kl.addEventListener('input', function () { d.klass = kl.value; changed(); });
    su.addEventListener('input', function () { d.subject = su.value; changed(); });
    per.addEventListener('change', function () { d.period = per.value ? +per.value : ''; changed(); });
    kind.addEventListener('change', function () { d.kind = kind.value; d.answers = blankAnswers(S.vs.forms[d.kind]); changed(); paintMain(); });
    if (isNew) fillWho();
    fillChips();
    var total = h('b', { id: 'vfScore' }), leftNote = h('span', { id: 'vfLeft' }), secPct = [], rows = [];
    var tally = function () {
      var all = liveScore(form, d.answers);
      total.textContent = all.pct == null ? '—' : all.pct + '%'; total.className = all.pct == null ? '' : 'sc-' + band(all.pct);
      leftNote.textContent = all.left ? t('vsLeft') + ' ' + all.left : all.rated + ' ' + t('vsRated');
      form.sections.forEach(function (_, i) { var p = liveScore(form, d.answers, i).pct; clear(secPct[i]).appendChild(pctPill(p)); });
    };
    var panels = form.sections.map(function (sec, i) {
      secPct[i] = h('span', { class: 'secpct' });
      var body = h('div', { class: 'vitems' });
      sec.items.forEach(function (text, j) {
        var group = h('div', { class: 'vrate', role: 'radiogroup', 'aria-label': text }), row = h('div', { class: 'vitem', 'data-item': i + '-' + j }, h('p', { text: text }), group);
        var opt = function (val, big, small) {
          var inp = h('input', { type: 'radio', name: 'v-' + i + '-' + j, value: val, checked: d.answers[i][j] === val });
          inp.addEventListener('change', function () { d.answers[i][j] = val; row.classList.remove('miss'); tally(); changed(); });
          return h('label', { title: small }, inp, h('span', null, h('b', { text: big }), h('small', { text: small })));
        };
        for (var k = n; k >= 1; k--) group.appendChild(opt(k, String(k), form.scale[n - k]));
        group.appendChild(opt(0, '—', t('vsNA')));
        rows.push([row, i, j]); body.appendChild(row);
      });
      return h('section', { class: 'panel' }, h('div', { class: 'headrow' }, h('h3', { text: sec.title }), secPct[i]), body);
    });
    var area = function (id, key) { var a = h('textarea', { id: id, maxlength: '1500', dir: 'auto', rows: '3', value: d[key] }); a.addEventListener('input', function () { d[key] = a.value; changed(); }); return field(t(key === 'improve' ? 'vsImprove' : key === 'recommend' ? 'vsRecommend' : key === 'note' ? 'vsNote' : 'vsStrengths'), a); };
    var shared = h('input', { type: 'checkbox', id: 'vfShared', checked: d.shared });
    shared.addEventListener('change', function () { d.shared = shared.checked; changed(); });
    v.appendChild(h('form', { class: 'form', id: 'visitForm', onsubmit: function (e) {
      e.preventDefault();
      if (!d.teacher) { toast(t('vsNeedTeacher'), true); who.focus(); return; }
      var missing = rows.filter(function (r) { return d.answers[r[1]][r[2]] == null; });
      if (missing.length) { missing.forEach(function (r) { r[0].classList.add('miss'); }); missing[0][0].scrollIntoView({ block: 'center' }); toast(t('vsLeft') + ' ' + missing.length, true); return; }
      var next = payloadOf(d), prev = d.before ? payloadOf(Object.assign({}, d.before, { note: d.before.note || '' })) : null;
      busy(save, true);
      call('api_saveVisit', JSON.stringify(next)).then(function (res) {
        var x = JSON.parse(res).visit, ref = { id: x.id, undoId: '' };
        putVisit(x); keepDraft(null);
        var again = function (p) { return call('api_saveVisit', JSON.stringify(p)).then(function (r2) { var y = JSON.parse(r2).visit; putVisit(y); if (S.vsUi.open && S.vsUi.open.id === y.id) S.vsUi.open = y; }); };
        if (prev) record(t('vsEdit') + ' · ' + x.teacherName, function () { return again(prev); }, function () { return again(next); });
        else record(t('vsNew') + ' · ' + x.teacherName, function () { return call('api_deleteVisit', ref.id).then(function (r2) { ref.undoId = JSON.parse(r2).undoId; dropVisit(ref.id); }); },
          function () { return call('api_undoVisit', ref.undoId).then(function (r2) { putVisit(JSON.parse(r2).visit); }); });
        ui.form = null; ui.open = x; toast(t('vsSaved')); render(); window.scrollTo(0, 0);
      }, function (er) { busy(save, false); toast(errText(er), true); });
    } },
      h('section', { class: 'panel' }, h('div', { class: 'headrow' }, h('h3', { text: form.title }), pill('pending', t('vk_' + d.kind))),
        isNew ? h('div', { class: 'row2' }, stagesShown().length > 1 ? field(t('stage'), stg) : null, field(t('vsTeacher'), who), field(t('vsDate'), date), S.vs.kind ? null : field(t('vsForm'), kind))
          : h('div', { class: 'row2' }, h('div', { class: 'fld' }, h('span', { text: t('vsTeacher') }), h('b', { id: 'vfTeacherName', text: d.teacherName })), field(t('vsDate'), date)),
        chips, h('div', { class: 'row2' }, field(t('klass'), kl), field(t('subject'), su), field(t('vsSession'), per)),
        h('p', { class: 'note', id: 'vfScale', text: t('vsScale') + ': ' + form.scale.map(function (x, k) { return (n - k) + ' ' + x; }).join(' · ') + ' · — ' + t('vsNA') })),
      panels,
      h('section', { class: 'panel' }, h('h3', { text: t('vsNotes') }), area('vfStrengths', 'strengths'), area('vfImprove', 'improve'), area('vfRecommend', 'recommend'), area('vfNote', 'note'), h('label', { class: 'check' }, shared, t('vsShared'))),
      h('div', { class: 'vfoot' }, h('div', { class: 'vfoot-n' }, total, leftNote), save)));
    tally();
  }

  /* ---- one visit, as a report that can be printed ---- */
  function visitDetail(v) {
    var ui = S.vsUi, x = ui.open, lead = isLead(), form = x.form, n = form.scale.length, back = function () { ui.open = null; render(); };
    var del = lead && (x.mine || S.me.role === 'owner') ? sureBtn('vdDelete', t('vsDelete'), t('vsDeleteSure'), function () {
      call('api_deleteVisit', x.id).then(function (r) {
        var ref = { undoId: JSON.parse(r).undoId };
        dropVisit(x.id);
        record(t('vsDelete') + ' · ' + x.teacherName, function () { return call('api_undoVisit', ref.undoId).then(function (r2) { putVisit(JSON.parse(r2).visit); }); }, function () { return call('api_deleteVisit', x.id).then(function (r2) { ref.undoId = JSON.parse(r2).undoId; dropVisit(x.id); }); });
        toast(t('vsDeleted')); render();
      }, function (e) { toast(errText(e), true); });
    }) : null;
    if (del) del.className = 'btn bad sm';
    var seenBtn = !lead && !x.seen ? h('button', { class: 'btn sm', type: 'button', id: 'vdSeen', onclick: function () {
      call('api_seenVisit', x.id).then(function () { x.seen = true; S.vs.visits.forEach(function (y) { if (y.id === x.id) y.seen = true; }); S.visitsNew = Math.max(0, (S.visitsNew || 0) - 1); toast(t('vsSawOk')); render(); }, function (e) { toast(errText(e), true); });
    } }, ic('done'), t('vsISaw')) : null;
    v.appendChild(h('div', { class: 'headrow noprint' }, h('button', { class: 'btn ghost sm', type: 'button', id: 'vdBack', onclick: back }, t('vsBack')), h('div', { class: 'actions' }, seenBtn,
      lead && x.mine ? h('button', { class: 'btn sm', type: 'button', id: 'vdEdit', onclick: function () { editVisit(x); } }, t('vsEdit')) : null,
      h('button', { class: 'btn ghost sm', type: 'button', id: 'vdPrint', onclick: function () { window.print(); } }, t('vsPrint')), del)));
    var state = !lead ? null : !x.shared ? pill('undated', t('vsHidden')) : x.seen ? pill('done', t('vsSeen')) : pill('soon', t('vsNotSeen'));
    var doms = h('div', { class: 'vdoms' });
    x.parts.forEach(function (p) { var bar = h('i'); bar.style.width = (p[1] || 0) + '%'; doms.appendChild(h('div', { class: 'vdom' }, h('span', { text: p[0] }), h('div', { class: 'vbar b-' + (p[1] == null ? 'none' : band(p[1])) }, bar), pctPill(p[1]))); });
    v.appendChild(h('section', { class: 'panel', id: 'visitReport' }, h('div', { class: 'headrow' }, h('div', null, h('h2', { text: t('vsReport') }), h('p', { class: 'lead', text: form.title })), h('div', { class: 'vscore sc-' + band(x.score), id: 'vdScore' }, h('b', { text: x.score + '%' }), h('span', { text: t('vsResult') }))),
      kv([[t('vsTeacher'), x.teacherName], [t('stage'), stageName(x.stage)], [t('vsDate'), fmtDate(x.date)], [t('klass'), x.klass], [t('subject'), x.subject], [t('vsSession'), x.period || ''], [t('vsVisitor'), x.byName + ' · ' + t('vk_' + x.kind)]]), state ? h('div', { id: 'vdState' }, state) : null,
      h('h3', { text: t('vsDomains') }), doms));
    form.sections.forEach(function (sec, i) {
      var tb = h('tbody');
      sec.items.forEach(function (text, j) { var val = x.answers[i][j]; tb.appendChild(h('tr', null, h('td', { text: text }), h('td', { class: 'num' }, val ? h('span', { class: 'pill p-' + band(Math.round(val * 100 / n)), text: val + ' · ' + form.scale[n - val] }) : h('span', { class: 'muted', text: t('vsNA') })))); });
      v.appendChild(h('section', { class: 'panel' }, h('div', { class: 'headrow' }, h('h3', { text: sec.title }), pctPill(x.parts[i] ? x.parts[i][1] : null)), h('div', { class: 'tw flat' }, h('table', { class: 'vtable' }, h('thead', null, h('tr', null, h('th', { text: t('vsItem') }), h('th', { text: t('vsRating') }))), tb))));
    });
    var notes = [[t('vsStrengths'), x.strengths], [t('vsImprove'), x.improve], [t('vsRecommend'), x.recommend]].filter(function (p) { return p[1]; });
    if (notes.length) v.appendChild(h('section', { class: 'panel', id: 'vdNotes' }, h('h3', { text: t('vsNotes') }), notes.map(function (p) { return h('div', { class: 'vnote' }, h('b', { text: p[0] }), h('p', { text: p[1] })); })));
    if (lead && x.note) v.appendChild(h('section', { class: 'panel noprint', id: 'vdPrivate' }, h('h3', { text: t('vsNote') }), h('p', { class: 'vnote-p', text: x.note })));
  }

  /* ---- the three forms ---- */
  function formText(form) { return form.sections.map(function (sec) { return '# ' + sec.title + '\n' + sec.items.join('\n'); }).join('\n\n'); }
  function formEditor(kind) {
    var cur = S.vs.forms[kind], title = h('input', { type: 'text', id: 'feTitle', maxlength: '80', required: true, value: cur.title }), scale = h('input', { type: 'text', id: 'feScale', required: true, value: cur.scale.join('، ') });
    var items = h('textarea', { id: 'feItems', rows: '14', dir: 'auto', required: true, value: formText(cur) }), save = h('button', { class: 'btn', type: 'submit', id: 'feSave' }, t('saveL'));
    showSheet(t('vsEditForm') + ' · ' + t('vk_' + kind), h('section', { class: 'box' }, h('form', { class: 'form', id: 'formEditor', onsubmit: function (e) {
      e.preventDefault();
      var sections = [], now = null;
      items.value.split(/\r?\n/).forEach(function (line) {
        line = tidy(line, 240);
        if (!line) return;
        if (line.charAt(0) === '#') { now = { title: tidy(line.replace(/^#+/, ''), 80), items: [] }; sections.push(now); return; }
        if (!now) { now = { title: t('vsItems'), items: [] }; sections.push(now); }
        now.items.push(line.replace(/^(?:\d{1,2}\s*[.)\-–]\s*|[-•*▪●]\s*)/, ''));      // numbering and bullets pasted from Word
      });
      var next = { title: tidy(title.value, 80), scale: splitNames(scale.value, 30), sections: sections }, before = { title: cur.title, scale: cur.scale, sections: cur.sections };
      var send = function (f) { return call('api_saveVisitForm', JSON.stringify({ kind: kind, form: f })).then(function (r) { S.vs.forms = JSON.parse(r).forms; }); };
      busy(save, true);
      send(next).then(function () { record(t('vsEditForm') + ' · ' + t('vk_' + kind), function () { return send(before); }, function () { return send(next); }); toast(t('vsFormSaved')); closeSheet(); render(); }, function (er) { busy(save, false); toast(errText(er), true); });
    } }, field(t('vsFormTitle'), title), field(t('vsScaleL'), scale, t('vsScaleHint')), field(t('vsItemsL'), items, t('vsItemsHint')), h('div', { class: 'actions' }, save))));
  }
  function vsForms(v) {
    v.appendChild(h('p', { class: 'lead', text: t('vsFormsLead') }));
    VKINDS.forEach(function (k) {
      var f = S.vs.forms[k], count = 0, body = h('div', { class: 'vform' });
      f.sections.forEach(function (sec) { count += sec.items.length; body.appendChild(h('div', null, h('b', { text: sec.title }), h('ol', { class: 'mini' }, sec.items.map(function (x) { return h('li', { text: x }); })))); });
      v.appendChild(h('section', { class: 'box', 'data-form': k }, h('div', { class: 'headrow' }, h('div', null, h('h2', { text: f.title }), h('p', { class: 'lead', text: f.sections.length + ' ' + t('vsDomainsW') + ' · ' + count + ' ' + t('vsItemsW') + ' · ' + t('vsScale') + ': ' + f.scale.join('، ') })),
        h('div', { class: 'actions' }, pill('pending', t('vk_' + k)), S.vs.canEditForms ? h('button', { class: 'btn sm', type: 'button', 'data-edit': k, onclick: function () { formEditor(k); } }, t('vsEditForm')) : null)), body));
    });
    v.appendChild(h('p', { class: 'note', text: t('vsFormsWho') }));
  }

  /* ---- the log of visits, and each teacher's evaluation ---- */
  function visitRows(list, withTeacher) {
    var tb = h('tbody');
    list.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }).forEach(function (x) {
      var open = function () { openVisit(x.id); }, lead = isLead();
      tb.appendChild(h('tr', { class: 'click', tabindex: '0', 'data-visit': x.id, onclick: open, onkeydown: function (e) { if (e.key === 'Enter') open(); } }, h('td', { class: 'num', text: fmtDate(x.date) }), withTeacher ? h('td', null, h('span', { class: 'nm', text: x.teacherName })) : null,
        h('td', { text: [x.klass, x.subject].filter(Boolean).join(' · ') || '—' }), h('td', { text: t('vk_' + x.kind) }), h('td', { text: x.byName }), h('td', null, pctPill(x.score)),
        h('td', null, lead ? (!x.shared ? pill('undated', t('vsHidden')) : x.seen ? pill('done', t('vsSeen')) : pill('soon', t('vsNotSeen'))) : (x.seen ? pill('done', t('vsSeen')) : pill('soon', t('vsNewTag'))))));
    });
    return h('div', { class: 'tw' }, h('table', { class: 'vlog' }, h('thead', null, h('tr', null, h('th', { text: t('vsDate') }), withTeacher ? h('th', { text: t('vsTeacher') }) : null, h('th', { text: t('klass') }), h('th', { text: t('vsForm') }), h('th', { text: t('vsVisitor') }), h('th', { text: t('vsResult') }), h('th', { text: t('status') }))), tb));
  }
  function termChips() {
    var row = h('div', { class: 'chips', id: 'vsTerm' });
    [['', t('vsAllTerms')], ['1', t('term1')], ['2', t('term2')]].forEach(function (x) { row.appendChild(h('button', { class: 'chip', type: 'button', 'aria-pressed': String(S.vsUi.term === x[0]), 'data-term': x[0], onclick: function () { S.vsUi.term = x[0]; paintMain(); } }, x[1])); });
    return row;
  }
  function vsLog(v) {
    var ui = S.vsUi, all = vsShown(), names = {}, list = all.filter(function (x) { return (!ui.who || x.teacher === ui.who) && (!ui.kind || x.kind === ui.kind); });
    all.forEach(function (x) { names[x.teacher] = x.teacherName; });
    var who = sel(t('vsTeacher'), ui.who, [['', t('vsAllTeachers')]].concat(Object.keys(names).sort(function (a, b) { return names[a] < names[b] ? -1 : 1; }).map(function (k) { return [k, names[k]]; })), function (val) { ui.who = val; paintMain(); });
    var kind = sel(t('vsForm'), ui.kind, [['', t('vsAllForms')]].concat(VKINDS.map(function (k) { return [k, t('vk_' + k)]; })), function (val) { ui.kind = val; paintMain(); });
    who.querySelector('select').id = 'vsWho'; kind.querySelector('select').id = 'vsKind';
    v.appendChild(termChips());
    v.appendChild(h('div', { class: 'filters' }, who, kind));
    if (!list.length) { v.appendChild(h('div', { class: 'empty', id: 'vsNone', text: t('vsNone') })); return; }
    v.appendChild(h('p', { class: 'lead', id: 'vsLogCount', text: list.length + ' ' + t('vsCount') + ' · ' + t('vsAvgAll') + ' ' + mean(list.map(function (x) { return x.score; })) + '%' }));
    v.appendChild(visitRows(list, true));
  }
  /** Everything recorded for one teacher: the averages by form and by domain, and the visits themselves. */
  function evalSheet(email, name) {
    var list = vsShown().filter(function (x) { return x.teacher === email; }), body = h('section', { class: 'box' });
    body.appendChild(h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('b', { text: list.length }), h('span', { text: t('vsCount') })), h('div', { class: 'stat' }, h('b', { text: list.length ? mean(list.map(function (x) { return x.score; })) + '%' : '—' }), h('span', { text: t('vsAvg') }))));
    VKINDS.forEach(function (k) {
      var mine = list.filter(function (x) { return x.kind === k; }), doms = {}, order = [];
      if (!mine.length) return;
      mine.forEach(function (x) { x.parts.forEach(function (p) { if (p[1] == null) return; if (!doms[p[0]]) { doms[p[0]] = []; order.push(p[0]); } doms[p[0]].push(p[1]); }); });
      var box = h('div', { class: 'vdoms' });
      order.forEach(function (d) { var p = mean(doms[d]), bar = h('i'); bar.style.width = p + '%'; box.appendChild(h('div', { class: 'vdom' }, h('span', { text: d }), h('div', { class: 'vbar b-' + band(p) }, bar), pctPill(p))); });
      body.appendChild(h('div', { class: 'headrow' }, h('h3', { text: t('vk_' + k) + ' · ' + mine.length }), pctPill(mean(mine.map(function (x) { return x.score; })))));
      body.appendChild(box);
    });
    showSheet(name, body, list.length ? h('section', { class: 'stack' }, h('h3', { text: t('vsVisitsOf') }), visitRows(list, false)) : h('div', { class: 'empty', text: t('vsNone') }),
      h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'button', id: 'tsNew', onclick: function () { startVisit(email); } }, ic('plus'), t('vsNew'))));
  }
  function vsEval(v) {
    var list = vsShown(), by = {}, people = [], seen = {};
    list.forEach(function (x) { (by[x.teacher] = by[x.teacher] || []).push(x); });
    S.users.forEach(function (u) { if (u.role === 'teacher' && u.active && stagesShown().some(function (st) { return canHold(u, st) && (!S.f.stage || st === S.f.stage); })) { people.push({ email: u.email, name: u.name }); seen[u.email] = 1; } });
    Object.keys(by).forEach(function (e) { if (!seen[e]) people.push({ email: e, name: by[e][0].teacherName }); });
    people.sort(byName);
    var visited = people.filter(function (p) { return by[p.email]; }).length, tb = h('tbody');
    v.appendChild(termChips());
    v.appendChild(h('p', { class: 'lead', text: t('vsEvalLead') }));
    v.appendChild(h('div', { class: 'stats', id: 'vsEvalStats' }, h('div', { class: 'stat' }, h('b', { text: visited + ' / ' + people.length }), h('span', { text: fillT('vsCoverage', { a: visited, b: people.length }) })),
      h('div', { class: 'stat' }, h('b', { text: list.length }), h('span', { text: t('vsCount') })), h('div', { class: 'stat' }, h('b', { text: list.length ? mean(list.map(function (x) { return x.score; })) + '%' : '—' }), h('span', { text: t('vsAvgAll') }))));
    people.forEach(function (p) {
      var mine = by[p.email] || [], last = mine.map(function (x) { return x.date; }).sort().pop(), open = function () { evalSheet(p.email, p.name); };
      tb.appendChild(h('tr', { class: 'click', tabindex: '0', 'data-teacher': p.email, onclick: open, onkeydown: function (e) { if (e.key === 'Enter') open(); } }, h('td', null, h('span', { class: 'nm', text: p.name })), h('td', { class: 'num', text: mine.length }),
        h('td', { class: 'num' }, last ? fmtDate(last) : pill('overdue', t('vsNotVisited'))), h('td', null, pctPill(mean(mine.map(function (x) { return x.score; })))),
        VKINDS.map(function (k) { return h('td', null, pctPill(mean(mine.filter(function (x) { return x.kind === k; }).map(function (x) { return x.score; })))); })));
    });
    v.appendChild(h('div', { class: 'tw' }, h('table', { id: 'vsEval' }, h('thead', null, h('tr', null, h('th', { text: t('vsTeacher') }), h('th', { text: t('vsCount') }), h('th', { text: t('vsLast') }), h('th', { text: t('vsAvg') }), VKINDS.map(function (k) { return h('th', { text: t('vk_' + k) }); }))), tb)));
  }
  function vVisits() {
    var v = h('div', { class: 'view visits' }), ui = S.vsUi, lead = isLead();
    if (!vsReady(v)) return v;
    if (ui.open) { visitDetail(v); return v; }
    if (lead && ui.form) { visitForm(v); return v; }
    v.appendChild(h('p', { class: 'lead', text: t(lead ? 'vsLead' : 'vsLeadMine') }));
    if (!lead) {
      var mine = S.vs.visits;
      if (!mine.length) { v.appendChild(h('div', { class: 'empty', id: 'vsNone', text: t('vsNoneMine') })); return v; }
      v.appendChild(h('div', { class: 'stats', id: 'vsMineStats' }, h('div', { class: 'stat' }, h('b', { text: mine.length }), h('span', { text: t('vsCount') })), h('div', { class: 'stat' }, h('b', { text: mean(mine.map(function (x) { return x.score; })) + '%' }), h('span', { text: t('vsMineAvg') }))));
      v.appendChild(visitRows(mine, false));
      return v;
    }
    var tabs = tabsRow([['log', t('vs_log')], ['eval', t('vs_eval')], ['forms', t('vs_forms')]], ui.tab, function (k) { ui.tab = k; paintMain(); });
    tabs.id = 'vsTabs';
    v.appendChild(h('div', { class: 'headrow' }, tabs, h('button', { class: 'btn', type: 'button', id: 'vsNew', onclick: function () { startVisit(''); } }, ic('plus'), t('vsNew'))));
    ({ log: vsLog, eval: vsEval, forms: vsForms }[ui.tab] || vsLog)(v);
    return v;
  }

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

  function shrink(file) {
    return new Promise(function (res, rej) {
      var reader = new FileReader();
      reader.onerror = rej;
      reader.onload = function () {
        var img = new Image();
        img.onerror = rej;
        img.onload = function () {
          try {
            var size = 160, c = document.createElement('canvas'), side = Math.min(img.width, img.height), ctx = c.getContext('2d');
            c.width = c.height = size;
            ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
            var out = c.toDataURL('image/jpeg', 0.82);
            res(out.length > 46000 ? c.toDataURL('image/jpeg', 0.55) : out);
          } catch (e) { rej(e); }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  function setPhoto(res) { S.me.photo = JSON.parse(res).photo; if (S.users) S.users.forEach(function (u) { if (u.email === S.me.email) u.photo = S.me.photo; }); }
  function savePhoto(data) {
    var prev = S.me.photo || '';
    return call('api_savePhoto', data).then(function (r) {
      setPhoto(r);
      record(t('photo'), function () { return call('api_savePhoto', prev).then(setPhoto); }, function () { return call('api_savePhoto', data).then(setPhoto); });
      toast(t(data ? 'photoSaved' : 'photoRemoved')); closeSheet(); render();
    }, function (e) { toast(errText(e), true); });
  }
  function profileSheet() {
    var file = h('input', { type: 'file', accept: 'image/*', id: 'photoFile', class: 'vh', 'aria-label': t('choosePhoto') });
    file.addEventListener('change', function () {
      var f = file.files && file.files[0];
      if (!f) return;
      if (!/^image\//.test(f.type) || f.size > 8e6) { toast(t('photoBad'), true); return; }
      shrink(f).then(savePhoto, function () { toast(t('photoBad'), true); });
    });
    showSheet(t('profile'), h('section', { class: 'box center' }, avatar(S.me, 'xl'), h('b', { text: S.me.name }), h('span', { class: 'lead ltr', text: S.me.email }), h('span', { class: 'tag', text: t('r_' + S.me.role) }),
      h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'button', id: 'photoPick', onclick: function () { file.click(); } }, t('choosePhoto')),
        S.me.photo ? h('button', { class: 'btn ghost', type: 'button', id: 'photoRemove', onclick: function () { savePhoto(''); } }, t('removePhoto')) : null, file)));
  }

  /* ---------- admin ---------- */
  function vAdmin() {
    var v = h('div', { class: 'view' });
    v.appendChild(tabsRow([['users', t('users')], ['settings', t('settings')], ['log', t('log')]], S.adminTab, function (k) { S.adminTab = k; paintMain(); }));
    if (S.adminTab === 'users') {
      if (!S.users) { v.appendChild(h('div', { class: 'spin' })); call('api_users').then(function (r) { S.users = JSON.parse(r); paintMain(); }, function (e) { toast(errText(e), true); }); return v; }
      var tb = h('tbody');
      S.users.forEach(function (u) {
        tb.appendChild(h('tr', { class: 'click', tabindex: '0', onclick: function () { userForm(u); }, onkeydown: function (e) { if (e.key === 'Enter') userForm(u); } }, h('td', null, h('span', { class: 'who' }, avatar(u, 'sm'), h('span', null, h('span', { class: 'nm', text: u.name }), h('small', { class: 'ltr', text: u.email })))), h('td', { text: [u.position, u.major].filter(Boolean).join(' · ') || '—' }), h('td', { text: t('r_' + u.role) }),
          h('td', { text: u.stages.indexOf('*') !== -1 ? t('allStages') : u.stages.map(stageName).join('، ') }), h('td', null, u.active ? pill('approved', t('userActive')) : pill('returned', t('stopped')))));
      });
      v.appendChild(h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'button', id: 'addUser', onclick: function () { userForm(null); } }, '+ ' + t('addUser')),
        h('button', { class: 'btn ghost', type: 'button', id: 'importUsers', onclick: usersImport }, ic('upload'), t('importUsers'))));
      v.appendChild(h('div', { class: 'tw' }, h('table', null, h('thead', null, h('tr', null, h('th', { text: t('name') }), h('th', { text: t('jobCol') }), h('th', { text: t('role') }), h('th', { text: t('stages') }), h('th', { text: t('status') }))), tb)));
    } else if (S.adminTab === 'settings') {
      var st = S.settings, mf = h('input', { type: 'url', dir: 'ltr', placeholder: 'https://docs.google.com/spreadsheets/d/…' });
      var t1 = h('input', { type: 'date', value: st.termStarts[1] || '' }), t2 = h('input', { type: 'date', value: st.termStarts[2] || '' });
      var wb = h('input', { type: 'checkbox', checked: st.writeBack }), pe = h('input', { type: 'checkbox', id: 'planEdit', checked: st.planEdit }), hrs = h('select');
      var wOn = h('input', { type: 'checkbox', id: 'weeklyOn', checked: st.weekly !== false }), wDay = h('select', { id: 'weeklyDay' });
      [0, 1, 2, 3, 4, 5, 6].forEach(function (n) { var o = h('option', { value: n, text: fmt({ weekday: 'long', timeZone: 'UTC' }, new Date(Date.UTC(2026, 10, 15 + n))) }); if (n === (st.weeklyDay || 0)) o.selected = true; wDay.appendChild(o); });
      var nOn = h('input', { type: 'checkbox', checked: st.notify !== false }), nTime = h('input', { type: 'time', id: 'notifyTime', value: st.notifyTime || '07:30', required: true });
      var site = h('input', { type: 'url', dir: 'ltr', placeholder: 'https://', value: st.siteUrl || '' });
      var slo = h('input', { type: 'text', id: 'sloganInput', maxlength: '160', value: st.slogan || '' }), wel = h('textarea', { maxlength: '300', dir: 'auto', placeholder: t('welcomeDefault'), value: st.welcome || '' });
      [1, 2, 4, 6, 12].forEach(function (n) { var o = h('option', { value: n, text: n + ' ' + t('hours') }); if (n === st.syncHours) o.selected = true; hrs.appendChild(o); });
      var boxes = h('div', { class: 'row2' });
      ALL_STAGES.forEach(function (s) { boxes.appendChild(h('label', { class: 'check' }, h('input', { type: 'checkbox', value: s, checked: st.scope.indexOf(s) !== -1 }), stageName(s))); });
      var linkRows = h('div', { class: 'linkrows', id: 'linkRows' });
      var addLinkRow = function (l) {
        var nm = h('input', { type: 'text', maxlength: '60', placeholder: t('linkName'), 'aria-label': t('linkName'), value: l.name }), ur = h('input', { type: 'url', dir: 'ltr', maxlength: '300', placeholder: 'https://', 'aria-label': t('linkUrl'), value: l.url });
        var who = pickOf(null, [['admins', t('linkAdmins')], ['all', t('linkAll')]], l.who || 'admins'), row = h('div', { class: 'linkrow' }, nm, ur, who);
        who.setAttribute('aria-label', t('linkWho'));
        row.appendChild(h('button', { class: 'x', type: 'button', 'aria-label': t('del'), title: t('del'), onclick: function () { linkRows.removeChild(row); } }, ic('x')));
        row.read = function () { return { name: nm.value.trim(), url: ur.value.trim(), who: who.value }; };
        linkRows.appendChild(row);
      };
      (S.links || []).forEach(addLinkRow);
      var sb = h('button', { class: 'btn', type: 'submit' }, t('saveSettings'));
      v.appendChild(h('form', { class: 'panel form', id: 'settingsForm', onsubmit: function (e) {
        e.preventDefault();
        var d = { t1: t1.value, t2: t2.value, scope: Array.prototype.map.call(boxes.querySelectorAll('input:checked'), function (i) { return i.value; }), writeBack: wb.checked, planEdit: pe.checked, syncHours: +hrs.value,
          notify: nOn.checked, notifyTime: nTime.value, weekly: wOn.checked, weeklyDay: +wDay.value, siteUrl: site.value.trim(), slogan: slo.value.trim(), welcome: wel.value.trim() };
        if (mf.value.trim()) d.mainFile = mf.value.trim();
        d.links = Array.prototype.map.call(linkRows.children, function (r) { return r.read(); }).filter(function (l) { return l.name || l.url; });
        busy(sb, true);
        call('api_saveSettings', JSON.stringify(d)).then(function (r) { var o = JSON.parse(r); S.settings = o.settings; S.alerts = null; if (o.links) S.links = o.links; if (o.fileName) S.fileName = o.fileName;
          PUB = { slogan: o.settings.slogan || '', welcome: o.settings.welcome || '' }; store('ap.pub', JSON.stringify(PUB)); toast(t('settingsSaved')); render(); }, function (er) { busy(sb, false); toast(errText(er), true); });
      } },
        h('p', { class: 'note' + (st.mainFileSet ? '' : ' warn'), text: st.mainFileSet ? t('connected') + (S.fileName ? ': ' + S.fileName : '') : t('notConnected') }),
        field(t('mainFile'), mf, t('mainFileHint')), h('div', { class: 'row2' }, field(t('t1'), t1), field(t('t2'), t2), field(t('syncEvery'), hrs)),
        h('div', { class: 'fld' }, h('span', { text: t('scope') }), boxes), h('label', { class: 'check' }, wb, t('wb')), h('label', { class: 'check' }, pe, t('planEditL')), h('p', { class: 'note', text: t('planEditHint') }),
        h('h3', { text: t('startPage') }), field(t('sloganL'), slo), field(t('welcomeL'), wel),
        h('h3', { text: t('alerts') }), h('label', { class: 'check' }, nOn, t('notifyOn')),
        h('div', { class: 'row2' }, field(t('notifyTime'), nTime, t('notifyTimeHint')), field(t('siteUrl'), site)),
        h('p', { class: 'note', text: st.whatsappAuto ? t('waAuto') : t('waManual') }),
        h('h3', { text: t('weekly') }), h('label', { class: 'check' }, wOn, t('weeklyOn')), field(t('weeklyDayL'), wDay, t('weeklyDayHint')),
        h('h3', { text: t('linksTitle') }), h('p', { class: 'note', text: t('linksHint') }), linkRows,
        h('div', { class: 'actions' }, h('button', { class: 'btn ghost sm', type: 'button', id: 'addLink', onclick: function () { if (linkRows.children.length < 12) addLinkRow({ name: '', url: '', who: 'admins' }); } }, ic('plus'), t('addLink'))),
        h('div', { class: 'actions' }, sb)));
    } else {
      if (!S.audit) { v.appendChild(h('div', { class: 'spin' })); call('api_audit', 200).then(function (r) { S.audit = JSON.parse(r); paintMain(); }, function (e) { toast(errText(e), true); }); return v; }
      var ab = h('tbody');
      S.audit.forEach(function (a) { ab.appendChild(h('tr', null, h('td', { class: 'num', text: fmtTime(a.time) }), h('td', null, h('span', { class: 'ltr', text: a.email })), h('td', { text: a.action }), h('td', { text: a.target }), h('td', null, h('small', { text: String(a.details).slice(0, 160) })))); });
      v.appendChild(S.audit.length ? h('div', { class: 'tw' }, h('table', null, h('thead', null, h('tr', null, h('th', { text: t('time') }), h('th', { text: t('email') }), h('th', { text: t('action') }), h('th', { text: t('targetCol') }), h('th', { text: t('details') }))), ab)) : h('div', { class: 'empty', text: t('none') }));
    }
    return v;
  }
  function userForm(u) {
    var isNew = !u;
    u = u || { email: '', name: '', role: 'teacher', stages: [], active: true, aliases: [] };
    var em = h('input', { type: 'email', dir: 'ltr', value: u.email, required: true, readonly: !isNew }), nm = h('input', { type: 'text', value: u.name, maxlength: '80', required: true });
    var rl = h('select'), al = h('input', { type: 'text', value: (u.aliases || []).join('، ') }), ac = h('input', { type: 'checkbox', checked: u.active });
    var po = h('input', { type: 'text', id: 'ufPosition', maxlength: '80', value: u.position || '' }), mj = h('input', { type: 'text', id: 'ufMajor', maxlength: '80', value: u.major || '' });
    var ph = h('input', { type: 'tel', dir: 'ltr', inputmode: 'numeric', value: u.phone || '', placeholder: '9665xxxxxxxx' }), ch = h('select');
    ['email', 'whatsapp', 'both', 'off'].forEach(function (c) { var o = h('option', { value: c, text: t('ch_' + c) }); if (c === (u.channel || 'email')) o.selected = true; ch.appendChild(o); });
    ['teacher', 'vp', 'avp', 'principal'].concat(S.me.role === 'owner' || u.role === 'owner' ? ['owner'] : []).forEach(function (r) { var o = h('option', { value: r, text: t('r_' + r) }); if (r === u.role) o.selected = true; rl.appendChild(o); });
    var boxes = h('div', { class: 'form' });
    boxes.appendChild(h('label', { class: 'check' }, h('input', { type: 'checkbox', value: '*', checked: u.stages.indexOf('*') !== -1 }), t('allStages')));
    S.settings.scope.forEach(function (s) { boxes.appendChild(h('label', { class: 'check' }, h('input', { type: 'checkbox', value: s, checked: u.stages.indexOf(s) !== -1 }), stageName(s))); });
    var sb = h('button', { class: 'btn', type: 'submit' }, t('saveUser'));
    var form = h('form', { class: 'form', onsubmit: function (e) {
      e.preventDefault();
      var d = { email: em.value, name: nm.value, role: rl.value, active: ac.checked, stages: Array.prototype.map.call(boxes.querySelectorAll('input:checked'), function (i) { return i.value; }), aliases: al.value.split(/[,،]/).map(function (x) { return x.trim(); }).filter(Boolean), phone: ph.value.trim(), channel: ch.value, position: po.value.trim(), major: mj.value.trim() };
      busy(sb, true);
      call('api_saveUser', JSON.stringify(d)).then(function (r) { S.users = JSON.parse(r); S.alerts = null; toast(t('userSaved')); closeSheet(); paintMain(); }, function (er) { busy(sb, false); toast(errText(er), true); });
    } }, field(t('email'), em, S.settings.domain ? '@' + S.settings.domain : ''), field(t('name'), nm), h('div', { class: 'row2' }, field(t('position'), po), field(t('major'), mj)), field(t('role'), rl), h('div', { class: 'fld' }, h('span', { text: t('stages') }), boxes), field(t('aliases'), al, t('aliasesHint')), h('div', { class: 'row2' }, field(t('phone'), ph, t('phoneHint')), field(t('channel'), ch)), h('label', { class: 'check' }, ac, t('userActive')), h('div', { class: 'actions' }, sb, h('button', { class: 'btn ghost', type: 'button', onclick: closeSheet }, t('cancel'))));
    showSheet(isNew ? t('addUser') : u.name, h('section', { class: 'box' }, form));
    (isNew ? em : nm).focus();
  }

  /* ---------- load, sign-in ---------- */
  function apply(json) {
    var d = JSON.parse(json);
    S.me = d.me; S.settings = d.settings; S.today = d.today; S.programs = d.programs; S.indicators = d.indicators; S.targets = d.targets; S.submissions = d.submissions; S.assign = d.assign || {}; S.plan = d.plan || {}; S.links = d.links || []; S.visitsNew = d.visitsNew || 0; S.fileName = d.fileName || '';
    if (S.f.stage && S.me.stages.indexOf(S.f.stage) === -1) S.f.stage = '';
    if (S.me.stages.length === 1) S.f.stage = S.me.stages[0];
    S.users = null; S.audit = null; S.alerts = null; S.mycal = null; S.weekly = null; S.tt = null; coverNote = null;
    if (!S.cal.month) S.cal = { month: S.today.slice(0, 7), day: S.today };
    if (S.school && schools().indexOf(S.school) === -1) S.school = '';
    if (schools().length === 1) S.school = schools()[0];
  }
  function doSync() {
    var b = $('syncBtn'); if (b) { b.disabled = true; b.lastChild.textContent = t('syncing'); }
    call('api_sync').then(function (r) { apply(r); toast(t('synced')); render(); }, function (e) { toast(errText(e), true); render(); });
  }
  function freshVisit() { plReset(); vsReset(); S.view = 'home'; S.school = ''; S.mon = 'programs'; S.ipick = ''; S.ttMode = ''; S.ttPick = ''; S.calTab = ''; S.f = { stage: '', kpi: '', status: '', term: '', q: '', mine: false, person: '' }; S.cal = { month: '', day: '' }; H = { list: [], i: -1 }; U = { done: [], undone: [], busy: false }; closeSheet(); }
  /** Opens the platform for the person the backend recognises. */
  function enter() {
    S.me = null; coverNote = { spin: true }; render();
    call('api_bootstrap').then(function (r) { freshVisit(); apply(r); render(); }, function (e) { if (CFG.api && errCode(e) === 'AUTH') return; startPage(errText(e)); });
  }
  function isSite() { return !!CFG.api && !gas && !window.__MOCK__; }
  /** The start page with its sign-in control: Google's button on the website, a plain button where the account is already known. */
  var startMsg = '', gisOn = false;
  function startPage(msg) {
    S.me = null; startMsg = msg || '';
    if (isSite()) { googleButton(msg); return; }
    coverNote = { text: msg || t('loginHint'), extra: h('button', { class: 'cv-login', type: 'button', id: 'loginBtn', onclick: enter }, ic('out', 'flip'), t('login')) };
    render();
  }
  function googleButton(msg) {
    var slot = h('div', { id: 'gbtn' });
    coverNote = { text: msg || t('loginHint'), extra: slot };
    render();
    var tries = 0;
    (function wait() {
      var g = window.google && google.accounts && google.accounts.id;
      if (!g) { if (tries++ < 80) setTimeout(wait, 150); return; }
      // Google's sign-in is set up once; the button itself is drawn again whenever the start page is.
      if (!gisOn) g.initialize({ client_id: CFG.clientId, auto_select: true, callback: function (resp) {
        var at = $('gbtn'); if (at) clear(at).appendChild(h('div', { class: 'spin' }));
        post({ fn: 'login', idToken: resp.credential }).then(function (res) {
          var o = JSON.parse(res); S.session = o.session; store('ap.session', o.session); freshVisit(); apply(o.boot); render();
        }, function (e) { startPage(errText(e)); });
      } });
      gisOn = true;
      g.renderButton(slot, { type: 'standard', theme: 'filled_blue', size: 'large', shape: 'pill', text: 'signin_with', locale: S.lang });
    })();
  }
  function signedOut(msg) { S.session = ''; store('ap.session', null); closeSheet(); startPage(msg); }
  function signOut() {
    if (isSite() && S.session) post({ fn: 'logout', session: S.session }).catch(function () {});
    try { if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect(); } catch (e) {}
    introPlayed = false;
    signedOut('');
  }
  function loadPublic() {
    var req = isSite() ? post({ fn: 'public' }) : (gas || window.__MOCK__) ? call('api_public') : null;
    if (req) req.then(function (r) { var o = JSON.parse(r); if (o && typeof o.slogan === 'string') {
        PUB = o; store('ap.pub', r);
        var a = $('slogan'), b = $('welcome');
        if (!S.me && a) a.textContent = PUB.slogan || t('sloganDefault');
        if (!S.me && b) b.textContent = PUB.welcome || t('welcomeDefault');
      } }, function () {});
  }
  function boot() {
    loadPublic();
    if (isSite() && S.session) { enter(); return; }   // a return visit to the website: the session is still valid
    startPage('');
  }
  window.__AP_RELOAD__ = enter;
  if (CFG.api && 'serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(function () {});
  boot();
})();
