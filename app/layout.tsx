import type {Metadata} from 'next';
import '../src/fonts.css';import '../src/index.css';import '../src/App.css';import '../src/responsive.css';
export const metadata:Metadata={title:'APEX DRIVE BULGARIA',description:'Премиум Drive-Thru ресторант. Не просто храна. Изживяване.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="bg"><body>{children}</body></html>}
