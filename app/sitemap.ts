import type {MetadataRoute} from 'next';
import {publishedContent} from '../server/public-content';

export const dynamic='force-dynamic';

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  if(process.env.VERCEL_ENV==='preview')return [];
  const base='https://apex-drive-bulgaria.vercel.app';
  const data=await publishedContent();
  const fixed:MetadataRoute.Sitemap=[
    {url:base+'/',changeFrequency:'weekly',priority:1},
    {url:base+'/menu',changeFrequency:'daily',priority:0.9},
  ];
  const seen=new Set<string>();
  for(const p of data?.menu?.products||[]){
    if(typeof p?.slug!=='string'|| !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) ||
        seen.has(p.slug)||p.available===false)continue;
    seen.add(p.slug);
    fixed.push({url:base+'/product/'+encodeURIComponent(p.slug),changeFrequency:'weekly',priority:0.65});
  }
  return fixed;
}
