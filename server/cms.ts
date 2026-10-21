import {lilyContent} from '../src/cms/lily-content';
import {validateButtonAssets} from './png-assets';
import { neon } from '@neondatabase/serverless';
import seed from './seed.json';
import { validateContent } from './validation';
import { requireAdmin } from './auth';

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

// The database client is created lazily, allowing a Vercel build before storage is configured.
export function db() {
  if (!process.env.DATABASE_URL) throw new HttpError(503, 'DATABASE_URL не е настроен.');
  return neon(process.env.DATABASE_URL);
}
export async function authorize() { return requireAdmin(); }
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) throw new HttpError(403, 'Невалиден произход на заявката.');
}
type Row = {
  draft: string; published: string; version: number;
  published_version: number; updated_at: string; updated_by: string;
};
function upgradedRow(row:Row):Row {
  return {...row,draft:JSON.stringify(lilyContent(JSON.parse(row.draft))),published:JSON.stringify(lilyContent(JSON.parse(row.published)))};
}
export async function state(): Promise<Row> {
  const sql = db();
  let rows = await sql`SELECT draft,published,version,published_version,updated_at,updated_by
      FROM cms_state WHERE id = 'main'`;
  if (rows.length) return upgradedRow(rows[0] as Row);
  const content = JSON.stringify(seed);
  const now = new Date().toISOString();
  // Seeding is safe under concurrent serverless requests.
  await sql`INSERT INTO cms_state(id,draft,published,version,published_version,updated_at,updated_by)
      VALUES('main',${content},${content},0,0,${now},'initial')
      ON CONFLICT(id) DO NOTHING`;
  await sql`INSERT INTO cms_revisions(version,content,created_at,created_by)
    VALUES(0,${content},${now},'initial') ON CONFLICT(version) DO NOTHING`;
  rows = await sql`SELECT draft,published,version,published_version,updated_at,updated_by
      FROM cms_state WHERE id = 'main'`;
  if (!rows[0]) throw new HttpError(503, 'Няма данни за сайта.');
  return upgradedRow(rows[0] as Row);
}
export async function save(content: unknown, version: number, user: string) {
  const parsed = validateContent(lilyContent(validateContent(content)));
  await validateButtonAssets(parsed.buttons);
  const sql = db();
  await state();
  const rows = await sql`UPDATE cms_state
    SET draft=${JSON.stringify(parsed)}, version=version+1, updated_at=${new Date().toISOString()},updated_by=${user}
    WHERE id='main' AND version=${version} RETURNING version`;
  if (!rows.length) throw new HttpError(409, 'Има по-нова версия. Презаредете панела.');
  return {version: rows[0].version};
}
export async function publish(version: number, user: string) {
  const sql = db();
  const row = await state();
  if (row.version !== version) throw new HttpError(409, 'Черновата е променена. Презаредете панела.');
  const parsed = validateContent(JSON.parse(row.draft));
  await validateButtonAssets(parsed.buttons);
  const now = new Date().toISOString();
  // One statement guarantees version update and publication history are atomic.
  const result = await sql`WITH updated AS (
      UPDATE cms_state SET published=${JSON.stringify(parsed)},draft=${JSON.stringify(parsed)},published_version=version+1,version=version+1,
          updated_at=${now},updated_by=${user}
      WHERE id='main' AND version=${version} RETURNING version,published
    ) INSERT INTO cms_revisions(version,content,created_at,created_by)
      SELECT version,published,${now},${user} FROM updated RETURNING version`;
  if (!result.length) throw new HttpError(409, 'Конфликт при публикуване. Презаредете панела.');
  return {version: result[0].version};
}
export function json(data: unknown, status=200) {
  return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
export function failure(e: unknown) {
  if (e instanceof HttpError) return json({error:e.message},e.status);
  if (e && typeof e==='object' && 'issues' in e) return json({error:'Проверете полетата.',details:(e as any).issues.map((i:any)=>`${i.path.join('.')}: ${i.message}`).slice(0,8)},400);
  console.error('CMS failed:',e instanceof Error?e.message:'unknown');
  return json({error:'Операцията не беше успешна. Проверете конфигурацията или опитайте отново.'},500);
}
