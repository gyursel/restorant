import {copy as cmsCopy} from '@/content/repository';
export {getContent} from '@/content/repository';
export const brandText = value => typeof value === 'string' && !/^(?:https?:|\/|mailto:|tel:)/i.test(value) ? value.replace(/APEX/gi, 'LILY') : value;
export const copy = new Proxy({}, {get: (_, key) => brandText(cmsCopy[key])});
