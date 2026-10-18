import {useState} from 'react';
import {Link} from 'react-router-dom';
import {getContent} from '@/content/repository';
import {buttonSchema,buttonStyle,defaultButton} from '@/cms/design';

/** Presentation only: callers retain their route, handler, form semantics and label. */
export function ButtonVisual({config,children}) {
  const [failed,setFailed]=useState({});
  const sources={base:config.image,hover:config.hoverImage,active:config.activeImage,disabled:config.disabledImage};
  return <>{Object.entries(sources).filter(([,url])=>url&&!failed[url]).map(([state,url])=><img key={state+url} src={url} alt="" draggable="false" className={`png-art png-art-${state}`} onError={()=>setFailed(v=>({...v,[url]:true}))}/>)}<span className={failed[config.image]?'png-fallback':'png-accessible-label'}>{children}</span></>;
}
export function ConfigurableButton({slot,children,className='',to,disabled,...props}) {
  const parsed=buttonSchema.safeParse(getContent()?.buttons?.[slot]||{});
  const config=parsed.success?parsed.data:defaultButton;
  const custom=config.mode==='png'&&config.image;
  const Element=to?Link:'button';
  return <Element {...props} {...(to?{to:disabled?'#':to,tabIndex:disabled?-1:props.tabIndex,'aria-disabled':disabled||undefined,onClick:disabled?e=>e.preventDefault():props.onClick}:{type:props.type||'button',disabled})}
    data-button-slot={slot} className={`${custom?'png-button':className} ${custom?'png-button-'+slot:''}`}
    style={custom?buttonStyle(config):props.style} data-hover-art={Boolean(config.hoverImage)} data-active-art={Boolean(config.activeImage)} data-disabled-art={Boolean(config.disabledImage)}>
    {custom?<ButtonVisual config={config}>{children}</ButtonVisual>:children}
  </Element>;
}
