import {lilyContent} from '../../../src/cms/lily-content';
import { state, json, failure, HttpError } from '../../../server/cms';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// The premium preview is a visual design sandbox, not a second restaurant.
// Always display the actual *published* content from the production storefront.
// This read-only bridge does not expose admin credentials or grant write access.
const productionContentUrl = 'https://apex-drive-bulgaria.vercel.app/api/content';

export async function GET() {
  try {
    if (process.env.VERCEL_ENV === 'preview' && process.env.CMS_ISOLATED_PREVIEW !== 'true') {
      const response = await fetch(productionContentUrl, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        throw new HttpError(502, 'Основният сайт не върна публикуваното съдържание.');
      }
      const content = await response.json();
      return json(lilyContent(content));
    }
    return json(JSON.parse((await state()).published));
  } catch (error) {
    return failure(error);
  }
}
