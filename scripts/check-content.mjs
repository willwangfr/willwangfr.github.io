// Guards the invariants every redesign has to keep.
// Run: node scripts/check-content.mjs            (schema, voice, url schemes, private blocklist if present)
//      node scripts/check-content.mjs --links    (also fetches every https link)
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, 'content.js'), 'utf8'), sandbox);
const S = sandbox.window.SITE;

const errors = [];
const fail = (msg) => errors.push(msg);

const BANNED = [
  [/—/, 'em dash (voice rule)'],
  [/passionate|pioneering|cutting-edge|seminal|bridging|at the intersection|leverag|delve|showcas|testament|crucial|vibrant/i, 'hype word (voice rule)'],
];
let ALLOW = [];

// The owner's private blocklist lives outside this public repo.
const PRIVATE_RULES = join(root, '..', 'personal-website-notes', 'site-private-rules.json');
if (existsSync(PRIVATE_RULES)) {
  const rules = JSON.parse(readFileSync(PRIVATE_RULES, 'utf8'));
  for (const [source, flags, why] of rules.banned || []) BANNED.push([new RegExp(source, flags), why]);
  ALLOW = rules.allow || [];
} else {
  console.warn('warn: private rules file not found, running public checks only');
}

function checkText(s, path) {
  const scrubbed = ALLOW.reduce((t, a) => t.split(a).join(''), s);
  for (const [re, why] of BANNED) if (re.test(scrubbed)) fail(`${path}: ${why}: "${s.slice(0, 90)}"`);
}

const urls = [];
function walk(v, path) {
  if (typeof v === 'string') {
    checkText(v, path);
    if (/^(url|inviteUrl|rsvp|embed)$/.test(path.split('.').pop())) urls.push([path, v]);
    for (const m of v.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) urls.push([path, m[1]]);
  } else if (Array.isArray(v)) {
    v.forEach((x, i) => walk(x, `${path}[${i}]`));
  } else if (v && typeof v === 'object') {
    Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`));
  }
}
walk(S, 'SITE');

const KINDS = ['build', 'company', 'idea', 'research', 'event'];
const ids = new Set();
for (const it of S.items) {
  if (!it.id || !it.kind || !it.title || !it.oneLiner) fail(`item missing id/kind/title/oneLiner: ${JSON.stringify(it).slice(0, 80)}`);
  if (!KINDS.includes(it.kind)) fail(`${it.id}: unknown kind "${it.kind}"`);
  if (ids.has(it.id)) fail(`${it.id}: duplicate id`);
  ids.add(it.id);
  if (it.group && !((S.groups && S.groups[it.kind]) || []).some((g) => g.id === it.group)) {
    fail(`${it.id}: group "${it.group}" is not defined in groups.${it.kind}`);
  }
  if (it.date && !/^\d{4}-\d{2}-\d{2}$/.test(it.date)) fail(`${it.id}: date must be YYYY-MM-DD`);
}

for (const [path, u] of urls) {
  if (!u || /^(https:\/\/|mailto:)/.test(u) || /^#[\w-]+$/.test(u)) continue;
  if (/^[\w-]+(\/[\w.-]+)*\.html$/.test(u)) {
    if (!existsSync(join(root, u))) fail(`${path}: ${u} does not exist`);
    continue;
  }
  fail(`${path}: disallowed url "${u}" (use https://, mailto:, #anchor, or a local .html path)`);
}

const checkLinks = process.argv.includes('--links');
if (checkLinks) {
  const unique = [...new Set(urls.map(([, u]) => u).filter((u) => u.startsWith('https://')))];
  await Promise.all(
    unique.map(async (u) => {
      try {
        const r = await fetch(u, {
          redirect: 'follow',
          headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126 Safari/537.36' },
          signal: AbortSignal.timeout(20000),
        });
        if ([403, 429, 999].includes(r.status)) console.warn(`warn ${r.status} (likely a bot block, check by hand): ${u}`);
        else if (r.status >= 400) fail(`link returned ${r.status}: ${u}`);
      } catch (e) {
        fail(`link unreachable: ${u} (${e.name})`);
      }
    })
  );
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✓ content ok: ${S.items.length} items, ${urls.length} urls${checkLinks ? ' (reachability checked)' : ''}`);
