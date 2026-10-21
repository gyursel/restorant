import type {Metadata,Viewport} from 'next';
import '@fontsource-variable/onest/wght.css';
import '@fontsource-variable/montserrat/wght.css';
import '@fontsource-variable/montserrat/wght-italic.css';
import '../src/png-buttons.css';import '../src/fonts.css';import '../src/index.css';import '../src/App.css';import '../src/responsive.css';import '../src/checkout.css';import '../src/premium-redesign.css';import '../src/mobile-premium.css';
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover'};
export const metadata:Metadata={metadataBase:new URL('https://apex-drive-bulgaria.vercel.app'),applicationName:'LILY DRIVE BULGARIA',title:'LILY DRIVE BULGARIA',description:'Премиум Drive-Thru ресторант. Не просто храна. Изживяване.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="bg"><body>{children}</body></html>}
