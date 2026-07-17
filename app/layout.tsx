import type {Metadata} from 'next';
import './globals.css';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveSupport from './components/LiveSupport';
import WhatsAppButton from './components/WhatsAppButton';
export const metadata:Metadata={metadataBase:new URL('https://bozumcu.net'),title:{default:'Sky Bozum - Mobil Ödeme ve Dijital Kart Bozum Merkezi',template:'%s | Sky Bozum'},description:'Paycell, Pokus, Vodafone, Turkcell, Türk Telekom, Razer Gold ve dijital kart işlemleri için rehber, hesaplama ve destek platformu.',openGraph:{title:'Sky Bozum',description:'Mobil ödeme ve dijital kart bozum merkezi.',url:'https://bozumcu.net',siteName:'Sky Bozum',locale:'tr_TR',type:'website'},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr" suppressHydrationWarning><body className="min-h-screen bg-white text-slate-950 antialiased dark:bg-slate-950 dark:text-white"><AnnouncementBar/><Navbar/>{children}<Footer/><WhatsAppButton/><LiveSupport/></body></html>}
