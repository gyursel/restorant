import {createContext,useContext} from 'react';
export const SectionConfig=createContext({});
export const useSectionConfig=()=>useContext(SectionConfig);
