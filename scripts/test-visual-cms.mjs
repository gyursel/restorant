import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import ts from 'typescript';
const temp=new URL('./.cms-test/',import.meta.url);mkdirSync(temp,{recursive:true});
try{
 for(const [source,name] of [['src/cms/design.ts','design'],['server/validation.ts','validation']]){
 const code=ts.transpileModule(readFileSync(source,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace("'../src/cms/design'","'./design.mjs'");writeFileSync(new URL(name+'.mjs',temp),code);
 }
 const {buttonSchema,defaultButton,appearanceSchema,buttonStyle}=await import(new URL('design.mjs',temp));
 const {validateContent}=await import(new URL('validation.mjs',temp));
 let passed=0;const test=(name,fn)=>{fn();passed++;console.log('PASS',name)};
 const seed=JSON.parse(readFileSync('server/seed.json','utf8'));
 test('Existing content remains valid and receives backward-compatible defaults',()=>{const d=validateContent(seed);assert.deepEqual(d.buttons,{});assert.equal(d.appearance.accent,'#d18a4b');assert.deepEqual(d.menu,seed.menu)});
 test('PNG requires a primary image',()=>assert.equal(buttonSchema.safeParse({mode:'png'}).success,false));
 test('Uploaded PNG references and all interaction states survive a save',()=>{const c={...defaultButton,mode:'png',image:'/api/media/12345678-1234-1234-1234-123456789abc',hoverImage:'/images/hover.png',activeImage:'/images/active.png',disabledImage:'/images/disabled.png'};const d=validateContent({...seed,buttons:{'hero-primary':c}});assert.deepEqual(d.buttons['hero-primary'],c)});
 test('Script and remote image URLs are rejected for PNG buttons',()=>{for(const image of ['javascript:alert(1)','data:image/png;base64,AAA','https://attacker.test/a.png','//attacker.test/a.png','/api/media/../secret'])assert.equal(buttonSchema.safeParse({...defaultButton,mode:'png',image}).success,false)});
 test('Button configuration cannot inject handlers or change checkout routing',()=>assert.equal(buttonSchema.safeParse({...defaultButton,onClick:'alert(1)'}).success,false));
 test('Unknown button slots are rejected',()=>assert.throws(()=>validateContent({...seed,buttons:{'arbitrary-action':defaultButton}})));
 test('Unsafe dimensions and effects are rejected',()=>{for(const extra of [{desktop:{width:9000,height:null}},{hoverScale:4},{opacity:-1},{duration:90000},{glow:100},{objectFit:'url(javascript:evil)'}])assert.equal(buttonSchema.safeParse({...defaultButton,...extra}).success,false)});
 test('Responsive dimensions preserve aspect ratio',()=>{const s=buttonStyle({...defaultButton,desktop:{width:240,height:90},mobile:{width:160,height:60}});assert.equal(s['--png-w-mobile'],'160px');assert.equal(s['--png-h-desktop'],'auto')});
 test('Fixed height is applied only when aspect ratio is unlocked',()=>assert.equal(buttonStyle({...defaultButton,preserveRatio:false,desktop:{width:240,height:90}})['--png-h-desktop'],'90px'));
 test('Standard reset clears all state images',()=>{assert.equal(defaultButton.mode,'standard');assert.equal(defaultButton.image+defaultButton.hoverImage+defaultButton.activeImage+defaultButton.disabledImage,'')});
 test('Appearance blocks CSS injection and unknown font values',()=>{assert.equal(appearanceSchema.safeParse({accent:'red; background:url(https://evil)'}).success,false);assert.equal(appearanceSchema.safeParse({bodyFont:'evil'}).success,false)});
 test('Media metadata and section settings survive validation',()=>{const d=structuredClone(seed);d.mediaMetadata={'/images/example.png':{alt:'Пример',category:'buttons',archived:false}};Object.assign(d.pages.home.sections[0],{title:'Нов вкус',description:'Описание',background:'#111111',alignment:'center'});const result=validateContent(d);assert.deepEqual(result.mediaMetadata,d.mediaMetadata);assert.equal(result.pages.home.sections[0].title,'Нов вкус')});
 test('Duplicate sections and unsupported categories still fail',()=>{const d=structuredClone(seed);d.pages.home.sections.push(d.pages.home.sections[0]);assert.throws(()=>validateContent(d));const other=structuredClone(seed);other.menu.products[0].category='missing';assert.throws(()=>validateContent(other))});
 // Render the actual public button component to verify semantic regressions.
 const jsx=ts.transpileModule(readFileSync('src/components/site/ConfigurableButton.jsx','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,allowJs:true}}).outputText.replace("'@/content/repository'","'./repository.mjs'").replace("'@/cms/design'","'./design.mjs'");
 writeFileSync(new URL('button.mjs',temp),jsx);
 writeFileSync(new URL('repository.mjs',temp),'let content={};export const getContent=()=>content;export const setContent=v=>content=v;');
 const {setContent}=await import(new URL('repository.mjs',temp));
 const {ConfigurableButton}=await import(new URL('button.mjs',temp));
 const {createElement:h}=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');const {MemoryRouter}=await import('react-router-dom');
 const png={...defaultButton,mode:'png',image:'/images/example.png'};
 setContent({buttons:{'hero-primary':png,'checkout-submit':png,'product-add':png}});
 test('PNG navigation preserves its anchor destination and accessible text',()=>{const html=renderToStaticMarkup(h(MemoryRouter,null,h(ConfigurableButton,{slot:'hero-primary',to:'/menu'},'Виж менюто')));assert.match(html,/href="\/menu"/);assert.match(html,/png-accessible-label/);assert.match(html,/Виж менюто/);assert.match(html,/alt=""/)});
 test('PNG checkout remains a disabled native submit button when unavailable',()=>{const html=renderToStaticMarkup(h(ConfigurableButton,{slot:'checkout-submit',type:'submit',disabled:true},'Плати'));assert.match(html,/<button/);assert.match(html,/type="submit"/);assert.match(html,/disabled=""/)});
 test('PNG product actions retain their product-specific accessible name',()=>{const html=renderToStaticMarkup(h(ConfigurableButton,{slot:'product-add','aria-label':'Добави Quantum Classic'},'Добави'));assert.match(html,/aria-label="Добави Quantum Classic"/);assert.match(html,/type="button"/)});
 test('Standard reset renders the caller styling and label without PNG assets',()=>{setContent({buttons:{'hero-primary':defaultButton}});const html=renderToStaticMarkup(h(MemoryRouter,null,h(ConfigurableButton,{slot:'hero-primary',to:'/menu',className:'btn-primary'},'Меню')));assert.match(html,/class="btn-primary/);assert.doesNotMatch(html,/<img/)});
 console.log(`\n${passed} visual CMS checks passed.`);
}finally{rmSync(temp,{recursive:true,force:true})}
