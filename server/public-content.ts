import {lilyContent} from '../src/cms/lily-content';
import {cache} from 'react';
import {state} from './cms';

// A single published CMS snapshot powers server metadata and the browser UI.
// Request-scoped deduplication avoids reading the database twice for the page.
// Preview must remain read-only and display the official site's published data.
export const publishedContent=cache(async ():Promise<any|null>=>{
  try{
    if(process.env.VERCEL_ENV==='preview'&&process.env.CMS_ISOLATED_PREVIEW!=='true'){
      const response=await fetch('https://apex-drive-bulgaria.vercel.app/api/content',{
        cache:'no-store',
        headers:{Accept:'application/json'},
        signal:AbortSignal.timeout(8000),
      });
      if(!response.ok)return null;
      return lilyContent(await response.json());
    }
    return JSON.parse((await state()).published);
  }catch(error){
    // Never embed raw database errors in HTML, metadata or logs.
    console.error('Public content prefetch failed:',
      error instanceof Error?error.name:'unknown');
    return null;
  }
});
