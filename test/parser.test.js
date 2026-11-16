// Checks the parser against a saved copy of the main file (the copy is not part of this project).
// Usage: AP_FIXTURE=/path/to/main.json node test/parser.test.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const fixture = process.env.AP_FIXTURE;
if (!fixture || !fs.existsSync(fixture)) { console.log('SKIP: set AP_FIXTURE to a JSON export of the main file'); process.exit(0); }
const ctx = { module: { exports: {} } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../apps-script/Parser.gs'), 'utf8'), ctx);
const AP = ctx.module.exports, data = JSON.parse(fs.readFileSync(fixture, 'utf8'));
const want = { 'ابتدائي بنين أهلي': 277, 'ابتدائي بنين عالمي': 206, 'متوسط بنين عالمي': 194 };
let all = [];
for (const [name, values] of Object.entries(data)) if (name !== 'KPIS Targets') all = all.concat(AP.parseSheet(name, values).programs);
const got = {}; all.forEach(p => { got[p.stage] = (got[p.stage] || 0) + 1; });
const keys = new Set(all.map(p => p.key));
const targets = AP.parseTargets(data['KPIS Targets']);
const checks = [
  [Object.keys(want).every(s => got[s] === want[s]), 'programme counts per stage ' + JSON.stringify(Object.keys(want).map(s => got[s]))],
  [keys.size === all.length, 'every programme has a unique key'],
  [all.every(p => p.c && p.c.name), 'every programme knows its name column'],
  [targets.length === 23, 'targets tab gives 23 indicators'],
  [AP.readDate('17 / 1 / 2027').iso === '2027-01-17' && AP.readDate('202611/8').iso === null && AP.readDate(46310).iso === '2026-10-15', 'dates: text, unreadable text and serial numbers']
];
let bad = 0;
checks.forEach(c => { if (!c[0]) { bad++; console.log('FAIL:', c[1]); } });
console.log(`${checks.length - bad} passed, ${bad} failed`);
process.exit(bad ? 1 : 0);
