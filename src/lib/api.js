import { copy } from "@/content/repository";
import { getContent } from '@/content/repository';
export const eur = v => new Intl.NumberFormat('bg-BG', {
  style: 'currency',
  currency: 'EUR'
}).format(v || 0);
export const DAYS = [copy["api_js_1"], copy["api_js_2"], copy["api_js_3"], copy["api_js_4"], copy["api_js_5"], copy["api_js_6"], copy["api_js_7"]];
