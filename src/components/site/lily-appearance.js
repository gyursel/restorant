import {appearanceStyle} from '@/cms/design';
// Translate only the previous theme defaults; retain deliberate CMS choices.
export function lilyAppearance(appearance={}) {
  const next={...appearance};
  for(const [key,oldValue,newValue] of [['accent','#d18a4b','#c92b25'],['background','#0d0d0d','#080a0b'],['surface','#191918','#121415']]) {
    if(!next[key] || next[key]===oldValue) next[key]=newValue;
  }
  return appearanceStyle(next);
}
