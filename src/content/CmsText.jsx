import {copy} from "./repository";
export function CmsText({field}){return <span data-cms-key={field} style={{display:"contents"}}>{copy[field]}</span>}
