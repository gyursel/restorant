/** One idempotent upgrade shared by the storefront, metadata and authenticated editor.
 * Reads never write to storage. A normal save persists the upgraded document.
 * Once marked, owner edits are used verbatim, including former default values.
 */
export function lilyContent<T extends Record<string, any>>(source:T):T {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return source;
  if (source.designVersion === 'lily-v1') return source;
  const next:any = structuredClone(source);
  const brand = (value:any) => typeof value === 'string' && !/^(?:https?:|\/|mailto:|tel:)/i.test(value) ? value.replace(/APEX/gi, 'LILY') : value;
  next.copy = Object.fromEntries(Object.entries(next.copy || {}).map(([key,value]) => [key,brand(value)]));
  next.copy.Lily_wordmark ??= 'LILY';
  next.copy.Lily_submark ??= 'DRIVE';
  if(next.meta) next.meta.title = brand(next.meta.title);
  if(next.settings) next.settings.restaurant_name = brand(next.settings.restaurant_name);
  next.appearance = {...next.appearance};
  for(const [key,oldValue,value] of [['accent','#d18a4b','#c92b25'],['background','#0d0d0d','#080a0b'],['surface','#191918','#121415'],['text','#f5f0e8','#f3efe8']]) {
    if(!next.appearance[key] || next.appearance[key] === oldValue) next.appearance[key] = value;
  }
  const media = next.settings?.media;
  if(media) {
    if(!media.hero_image || media.hero_image === '/images/fd_burger_classic.webp') media.hero_image = '/images/lily-hero.webp';
    if(!media.hero_video || media.hero_video === '/videos/food-burger.mp4') media.hero_video = '/videos/lily-atmosphere.mp4';
  }
  next.designVersion = 'lily-v1';
  return next;
}
