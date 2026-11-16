// Builds the three forms of the interface from src/:
//   site/                    the standalone website (separate files, strict content security policy, installable)
//   apps-script/Index.html   the same interface as one file, served by Apps Script itself (fallback)
//   preview page             optional, with sample data: AP_FIXTURE=<main.json> AP_PREVIEW_OUT=<file> node build.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = __dirname, read = f => fs.readFileSync(path.join(root, f), 'utf8');
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), s); console.log('wrote', f); };
const css = read('src/app.css'), shell = read('src/shell.html');
// The status rules are written once, in Parser.gs, and copied into the page here.
const rules = (read('apps-script/Parser.gs').match(/\/\* RULES-START[\s\S]*?RULES-END \*\//) || [])[0], rawJs = read('src/app.js');
if (!rules || rawJs.split('/*#RULES#*/').length !== 2) throw new Error('status rules block or its placeholder is missing');
// The schedule builder: its engine (also tested on its own) and its page are separate files, placed inside the page script here.
const solver = (read('src/solver.js').match(/\/\* SOLVER-START[\s\S]*?\/\* SOLVER-END \*\//) || [])[0], builder = read('src/builder.js'), visitsJs = read('src/visits.js'), uploadJs = read('src/upload.js');
if (!solver || rawJs.split('/*#SOLVER#*/').length !== 2 || rawJs.split('/*#BUILDER#*/').length !== 2 || rawJs.split('/*#VISITS#*/').length !== 2 || rawJs.split('/*#UPLOAD#*/').length !== 2) throw new Error('the schedule builder or its placeholder is missing');
// The three page files share one scope, so a function name used twice would silently replace the first one.
const fnNames = [rawJs, builder, visitsJs, uploadJs].join('\n').match(/^  function [A-Za-z_$][\w$]*/gm) || [], twice = fnNames.filter((n, i) => fnNames.indexOf(n) !== i);
if (twice.length) throw new Error('defined twice in the page files: ' + twice.join(', '));
const js = rawJs.replace('/*#RULES#*/', () => rules).replace('/*#SOLVER#*/', () => solver).replace('/*#BUILDER#*/', () => builder).replace('/*#VISITS#*/', () => visitsJs).replace('/*#UPLOAD#*/', () => uploadJs);
const FONTS = 'https://fonts.googleapis.com/css2?family=El+Messiri:wght@600;700&family=Readex+Pro:wght@400;500;600;700&display=swap';
const TITLE = 'مسار الإنجاز | مدارس الأندلس بالطائف';
// The schools' logos: files for the website, inline data for the single-file builds.
const IMGS = { intl: 'logo-intl.webp', mark: 'mark-intl.webp', priv: 'logo-priv.webp' };
const inlineAssets = 'window.AP_ASSETS=' + JSON.stringify(Object.fromEntries(Object.entries(IMGS).map(([k, f]) =>
  [k, 'data:image/webp;base64,' + fs.readFileSync(path.join(root, 'src/img', f)).toString('base64')]))) + ';';

// ---- website ----
const CSP = [
  "default-src 'none'", "script-src 'self' https://accounts.google.com/gsi/client", "style-src 'self' https://fonts.googleapis.com https://accounts.google.com/gsi/style",
  'font-src https://fonts.gstatic.com', "img-src 'self' data: https://*.googleusercontent.com",
  "connect-src 'self' https://script.google.com https://script.googleusercontent.com https://accounts.google.com/gsi/",
  'frame-src https://accounts.google.com/gsi/', "manifest-src 'self'", "worker-src 'self'", "base-uri 'none'", "form-action 'none'"
].join('; ');
write('site/index.html', `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="referrer" content="no-referrer">
<meta name="theme-color" content="#23245F">
<title>${TITLE}</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="icon-192.png">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="app.css">
</head>
<body>
${shell}<script src="guard.js"></script>
<script src="config.js"></script>
<script src="https://accounts.google.com/gsi/client" async></script>
<script src="app.js"></script>
</body>
</html>
`);
write('site/app.css', css + '\nbody::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:30;background:var(--bg)}\n');
write('site/app.js', js);
// Google's sign-in script is served unversioned and changes without notice, so it cannot carry an integrity hash.
// The content security policy above limits scripts to this site and that one address.
write('site/guard.js', '// Refuses to run inside another site\'s frame.\nif (window.top !== window.self) { document.documentElement.hidden = true; throw new Error("framed"); }\n');
if (!fs.existsSync(path.join(root, 'site/config.js'))) write('site/config.js', `// Fill in these two values once, then upload the whole folder to your web host.
window.AP_CONFIG = {
  api: '',        // the Apps Script web app link, ending with /exec
  clientId: ''    // the Google sign-in client ID, ending with .apps.googleusercontent.com
};
`);
write('site/manifest.webmanifest', JSON.stringify({
  name: 'مسار الإنجاز - مدارس الأندلس بالطائف', short_name: 'مسار الإنجاز', start_url: './', scope: './', display: 'standalone', dir: 'rtl', lang: 'ar',
  background_color: '#23245F', theme_color: '#23245F',
  icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }]
}, null, 2) + '\n');
fs.mkdirSync(path.join(root, 'site/img'), { recursive: true });
Object.values(IMGS).forEach(f => fs.copyFileSync(path.join(root, 'src/img', f), path.join(root, 'site/img', f)));
console.log('copied logos to site/img');
const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 12);
write('site/sw.js', `// Keeps the app's own files available offline. Requests to the server are never cached.
const CACHE = 'ap-${stamp}';
const FILES = ['./', 'index.html', 'app.css', 'app.js', 'config.js', 'guard.js', 'icon-192.png', 'manifest.webmanifest', 'img/logo-intl.webp', 'img/mark-intl.webp', 'img/logo-priv.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
`);

// ---- single file for Apps Script ----
write('apps-script/Index.html', `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<base target="_top">
<meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
${css}</style>
</head>
<body>
${shell}<script>${inlineAssets}</script>
<script>
${js}</script>
</body>
</html>
`);

// ---- preview with sample data ----
const fixture = process.env.AP_FIXTURE, out = process.env.AP_PREVIEW_OUT;
if (fixture && out) {
  const ctx = { module: { exports: {} } };
  vm.runInNewContext(read('apps-script/Parser.gs'), ctx);
  const AP = ctx.module.exports, data = JSON.parse(fs.readFileSync(fixture, 'utf8'));
  const scope = ['ابتدائي بنين أهلي', 'ابتدائي بنين عالمي', 'متوسط بنين عالمي'], cfg = { termStarts: { 1: '2026-08-30', 2: '2027-01-17' } };
  const compact = o => { const r = {}; for (const k in o) { const v = o[k]; if (v !== '' && v !== null && v !== false && v !== undefined) r[k] = v; } return r; };
  let programs = [], indicators = [], targets = [];
  for (const [name, values] of Object.entries(data)) {
    if (name === 'KPIS Targets') { targets = AP.parseTargets(values).map(t => { const keep = {}; scope.forEach(s => { if (t.stages[s]) keep[s] = t.stages[s]; }); return { code: t.code, name: t.name, unit: t.unit, stages: keep }; }); continue; }
    const r = AP.parseSheet(name, values);
    r.programs.forEach(p => { if (scope.includes(p.stage)) programs.push(compact(AP.withDates(p, cfg))); });
    r.indicators.forEach(b => { if (scope.includes(b.stage)) indicators.push(compact(b)); });
  }
  const preview = { today: '2026-11-15', fileName: 'المنصة الشاملة 2026/2027 - أندلس الطائف', scope, programs, indicators, targets };
  const safe = s => s.replace(/<\/script/gi, '<\\/script');
  fs.writeFileSync(out, `<title>Andalus Control Platform</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="${FONTS}">
<style>
${css}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:30;background:var(--bg)}
</style>
${shell}<script>window.__PREVIEW__=${JSON.stringify(preview).replace(/</g, '\\u003c')};</script>
<script>
${safe(read('apps-script/Parser.gs'))}</script>
<script>
${safe(read('src/preview-mock.js'))}</script>
<script>${inlineAssets}</script>
<script>
${safe(js)}</script>
`);
  console.log('wrote preview', out, programs.length, 'programmes,', Math.round(fs.statSync(out).size / 1024), 'KB');
}
