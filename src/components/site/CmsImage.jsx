import {getContent} from '@/content/repository';
export function CmsImage({src,alt='',...props}){return <img {...props} src={src} alt={getContent()?.mediaMetadata?.[src]?.alt||alt}/>}
