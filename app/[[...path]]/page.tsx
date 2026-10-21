import type {Metadata} from 'next';
import PublicSite from '../public-site';
import {publishedContent} from '../../server/public-content';

export const dynamic='force-dynamic';

const base='https://apex-drive-bulgaria.vercel.app';
type Props={params:Promise<{path?:string[]}>};
const description='Премиум Drive-Thru ресторант. Бургери, меню и вземане от място в LILY DRIVE.';

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const segments=(await params).path||[];
  const [section,slug]=segments;
  const data=await publishedContent();
  const siteName=String(data?.meta?.title||'LILY DRIVE');
  const metaDescription=String(data?.meta?.description||description).slice(0,300);
  const canonicalPath='/'+segments.map(encodeURIComponent).join('/');
  let title=siteName;
  let details=metaDescription;
  let image=data?.settings?.media?.hero_image||'/images/fd_burger_classic.webp';
  const isProduct=section==='product'&&segments.length===2;
  const product=isProduct?data?.menu?.products?.find((p:any)=>p.slug===slug):null;
  const known=!segments.length || (section==='menu'&&segments.length===1) || Boolean(product);
  if(section==='menu'&&segments.length===1){
    title='Меню и цени | '+siteName;
    details='Разгледай менюто на LILY DRIVE: бургери, картофки, напитки и оферти.';
  }
  if(product){
    title=String(product.name)+' | '+siteName;
    details=String(product.description||metaDescription).slice(0,300);
    image=product.image||image;
  }
  const relativeImage=typeof image==='string'&&(/^(https:\/\/|\/(?!\/))/.test(image))?image:'/images/fd_burger_classic.webp';
  return {
    title,description:details,
    alternates:{canonical:known?base+canonicalPath:undefined},
    robots:{index:known&&process.env.VERCEL_ENV!=='preview',follow:known&&process.env.VERCEL_ENV!=='preview'},
    openGraph:{
      type:'website',locale:'bg_BG',siteName,title,description:details,
      url:base+canonicalPath,images:[{url:relativeImage,alt:product?.name||siteName}],
    },
    twitter:{card:'summary_large_image',title,description:details,images:[relativeImage]},
  };
}

export default async function Page(){
  const initialContent=await publishedContent();
  return <PublicSite initialContent={initialContent}/>;
}
