import {z} from 'zod';
export const buttonSlots = {
  'hero-primary':'Начало · основен бутон', 'hero-secondary':'Начало · втори бутон',
  'header-assist':'Навигация · LILY Assist', 'header-cart':'Навигация · количка',
  'product-add':'Продуктова карта · добавяне', 'detail-add':'Детайли · добавяне',
  'assistant-cta':'Секция · асистент', 'checkout-submit':'Количка · плащане',
} as const;
const asset=z.string().max(250).regex(/^$|^\/api\/media\/[a-f0-9-]{36}$|^\/images\/[a-zA-Z0-9_-]+\.png$/);
const size=z.object({width:z.number().min(24).max(800),height:z.number().min(24).max(500).nullable()});
export const buttonSchema=z.object({
  mode:z.enum(['standard','png']).default('standard'),image:asset.default(''),hoverImage:asset.default(''),activeImage:asset.default(''),disabledImage:asset.default(''),
  desktop:size.default({width:240,height:null}),tablet:size.default({width:220,height:null}),mobile:size.default({width:200,height:null}),
  preserveRatio:z.boolean().default(true),align:z.enum(['start','center','end']).default('center'),verticalAlign:z.enum(['start','center','end']).default('center'),
  objectFit:z.enum(['contain','cover','fill']).default('contain'),opacity:z.number().min(.2).max(1).default(1),
  hoverScale:z.number().min(1).max(1.15).default(1.04),hoverBrightness:z.number().min(.5).max(1.5).default(1.08),
  glow:z.number().min(0).max(30).default(0),shadow:z.number().min(0).max(30).default(0),duration:z.number().min(0).max(800).default(250),
  clickAnimation:z.enum(['none','press']).default('press'),
}).strict().superRefine((v,c)=>{if(v.mode==='png'&&!v.image)c.addIssue({code:'custom',path:['image'],message:'Качете PNG или изберете стандартен бутон.'})});
export type ButtonConfig=z.infer<typeof buttonSchema>;
export const defaultButton=buttonSchema.parse({});
const color=z.string().regex(/^#[0-9a-fA-F]{6}$/);
export const fontOptions=[["onest","Onest Variable"],["manrope","Manrope"],["playfair","Playfair Display"],["montserrat","Montserrat Variable"],["inter","Inter"],["roboto","Roboto"],["oswald","Oswald"],["raleway","Raleway"],["poppins","Poppins"],["lato","Lato"],["nunito","Nunito"],["ubuntu","Ubuntu"],["rubik","Rubik"],["outfit","Outfit"],["barlow","Barlow"],["archivo","Archivo"],["exo2","Exo 2"],["spacegrotesk","Space Grotesk"],["rajdhani","Rajdhani"],["teko","Teko"],["orbitron","Orbitron"],["bebas","Bebas Neue"]] as const;
const fontIds=["onest","manrope","playfair","montserrat","inter","roboto","oswald","raleway","poppins","lato","nunito","ubuntu","rubik","outfit","barlow","archivo","exo2","spacegrotesk","rajdhani","teko","orbitron","bebas"] as [string,...string[]];
export const appearanceSchema=z.object({
  background:color.default('#0d0d0d'),surface:color.default('#191918'),text:color.default('#f5f0e8'),muted:color.default('#b3aba2'),accent:color.default('#d18a4b'),
  bodyFont:z.enum(fontIds).default('onest'),headingFont:z.enum(fontIds).default('playfair'),
  backgroundImage:z.string().max(250).regex(/^$|^\/api\/media\/[a-f0-9-]{36}$|^\/images\/[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp)$/).default(''),backgroundMode:z.enum(['color','gradient','image']).default('color'),gradientEnabled:z.boolean().default(false),gradientStart:color.default('#0d0d0d'),gradientEnd:color.default('#34201a'),gradientAngle:z.number().int().min(0).max(360).default(135),
  radius:z.number().min(0).max(32).default(4),spacing:z.number().min(48).max(160).default(96),
  shadow:z.number().min(0).max(40).default(12),motion:z.enum(['full','reduced']).default('full'),
  cardStyle:z.enum(['bordered','minimal']).default('bordered'),buttonStyle:z.enum(['solid','outline']).default('solid'),
}).strict();
export const defaultAppearance=appearanceSchema.parse({});
export function buttonStyle(config:ButtonConfig):Record<string,string>{
  const s:Record<string,string>={};
  for(const v of ['desktop','tablet','mobile'] as const){s[`--png-w-${v}`]=`${config[v].width}px`;s[`--png-h-${v}`]=config.preserveRatio||config[v].height===null?'auto':`${config[v].height}px`;}
  return {...s,'--png-opacity':String(config.opacity),'--png-scale':String(config.hoverScale),'--png-brightness':String(config.hoverBrightness),'--png-glow':`${config.glow}px`,'--png-shadow':`${config.shadow}px`,'--png-duration':`${config.duration}ms`,'--png-fit':config.objectFit,'--png-align':config.align,'--png-vertical':config.verticalAlign,'--png-press':config.clickAnimation==='press'?'.96':'1'};
}
export function appearanceStyle(raw:unknown):Record<string,string>{
  const a=appearanceSchema.safeParse(raw||{});const v=a.success?a.data:defaultAppearance;
  const font=(id:string)=>{const found=fontOptions.find(x=>x[0]===id);return found?'"'+found[1]+'", sans-serif':'sans-serif'};
  return {'--apx-desktop-image':v.backgroundMode==='image' && v.backgroundImage ? `url("${v.backgroundImage}")`:'none','--apx-page-background':v.gradientEnabled?`linear-gradient(${v.gradientAngle}deg, ${v.gradientStart}, ${v.gradientEnd})`:v.background,'--apx-bg':v.background,'--apx-card':v.surface,'--apx-warm':v.text,'--apx-muted':v.muted,'--apx-red':v.accent,'--apx-accent':v.accent,'--apx-radius':`${v.radius}px`,'--apx-spacing':`${v.spacing}px`,'--apx-shadow':`${v.shadow}px`,'--apx-body':font(v.bodyFont),'--apx-heading':font(v.headingFont)};
}
