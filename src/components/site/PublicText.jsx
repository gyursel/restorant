import {copy} from './public-copy';
export function CmsText({field}) { return <span data-cms-key={field} style={{display:'contents'}}>{copy[field]}</span>; }
