import {getContent} from '@/content/repository';
export const useMenu=()=>({...getContent().menu,isLoading:false,error:null});
export const usePublicSettings=()=>getContent().settings;
export const usePromotions=()=>getContent().promotions.filter(p=>p.active);
