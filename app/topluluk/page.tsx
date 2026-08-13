import ForumDirectory from './ForumDirectory';
import Link from 'next/link';
import './community.css';

export const metadata = { title: 'Sky Bozum Topluluğu' };

export default function Page() {
  return <>
    <ForumDirectory />
    <nav className="border-t border-white/10 bg-[#090b10] px-5 py-8 text-center text-sm font-bold text-slate-400" aria-label="Topluluk sonrası yönlendirmeler">
      <span className="mr-4 text-xs uppercase tracking-[0.16em] text-slate-600">Topluluktan devam edin</span>
      <Link href="/bilgi-merkezi" className="mx-2 transition hover:text-rose-300">Rehberler</Link>
      <Link href="/sss" className="mx-2 transition hover:text-rose-300">SSS</Link>
      <Link href="/hizmetler" className="mx-2 transition hover:text-rose-300">Hizmetler</Link>
      <Link href="/iletisim" className="mx-2 transition hover:text-rose-300">İletişim</Link>
    </nav>
  </>;
}
