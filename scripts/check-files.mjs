import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const pkg=JSON.parse(readFileSync('package.json','utf8'));
assert.equal(pkg.scripts.build,'next build');
for(const f of ['app/admin/login/page.tsx','database/schema.sql','server/auth.ts','server/cms.ts','app/api/auth/login/route.ts','app/api/admin/[action]/route.ts'])assert.ok(existsSync(f),f);
for(const f of ['server/cms.ts','app/admin/page.tsx','app/api/admin/[action]/route.ts'])assert.ok(!readFileSync(f,'utf8').includes('cloudflare:workers'),f);
console.log('Vercel files verified');
