import type {MetadataRoute} from 'next';

export default function robots():MetadataRoute.Robots{
  const base='https://apex-drive-bulgaria.vercel.app';
  // Preview URLs must never compete with the actual restaurant site in search.
  if(process.env.VERCEL_ENV==='preview')
    return {rules:[{userAgent:'*',disallow:'/'}]};
  return {
    rules:[{userAgent:'*',allow:'/',disallow:['/admin/','/api/','/cart','/order/','/phase-one']}],
    sitemap:base+'/sitemap.xml',
    host:base,
  };
}
