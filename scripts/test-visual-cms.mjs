import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import ts from 'typescript';
const temp=new URL('./.cms-test/',import.meta.url);mkdirSync(temp,{recursive:true});
try{
 for(const [source,name] of [['src/cms/design.ts','design'],['server/validation.ts','validation'],['app/admin/edit-history.ts','edit-history']]){
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
 const {startHistory,recordEdit,moveHistory,changedAreas}=await import(new URL('edit-history.mjs',temp));
 test('Typing groups into one undo step and preserves the original document',()=>{const original={name:'A'};let h=startHistory(original);h=recordEdit(h,{name:'AB'},'name',1000);h=recordEdit(h,{name:'ABC'},'name',1200);assert.equal(h.past.length,1);assert.deepEqual(moveHistory(h,'undo').present,original);assert.equal(original.name,'A')});
 test('Undo and redo restore edits across different fields',()=>{let h=startHistory({name:'A',price:1});h=recordEdit(h,{name:'B',price:1},'name',1000);h=recordEdit(h,{name:'B',price:2},'price',1100);const undone=moveHistory(h,'undo');assert.equal(undone.present.price,1);assert.deepEqual(moveHistory(undone,'redo').present,h.present)});
 test('New edits after undo discard the abandoned redo branch',()=>{let h=recordEdit(startHistory(0),1,'price',1000);h=moveHistory(h,'undo');h=recordEdit(h,2,'price',1100);assert.equal(h.future.length,0);assert.equal(moveHistory(h,'redo').present,2)});
 test('History is bounded and no-op edits add no entry',()=>{let h=startHistory(0);for(let i=1;i<=100;i++)h=recordEdit(h,i,String(i),i);assert.equal(h.past.length,60);assert.equal(recordEdit(h,100,'same'),h)});
 test('Publish review compares with published content, including saved drafts',()=>{const published={copy:{title:'A'},menu:{price:1}};const draft={copy:{title:'B'},menu:{price:2}};assert.deepEqual(changedAreas(published,draft).map(x=>x.id),['copy','menu']);assert.deepEqual(changedAreas(draft,structuredClone(draft)),[])});
 console.log(`\n${passed} visual CMS checks passed.`);
}finally{rmSync(temp,{recursive:true,force:true})}
