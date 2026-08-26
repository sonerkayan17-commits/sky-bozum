import ForumDirectory from './ForumDirectory';
import Link from '../components/DeferredLink';
import { createMetadata } from '../lib/seo';
import './community.css';

export const metadata = createMetadata({ title: 'Sky Bozum Topluluğu', description: 'Mobil ödeme, dijital kod, hediye kartı, oran ve işlem güvenliği hakkında 6 bölümdeki doğrulanabilir rehberleri ve topluluk konularını inceleyin.', path: '/topluluk' });

export default function Page() {
  return <main>
    <ForumDirectory />
    <nav className="border-t border-white/10 bg-[#090b10] px-5 py-8 text-center text-sm font-bold text-slate-400" aria-label="Topluluk sonrası yönlendirmeler">
      <span className="mr-4 text-xs uppercase tracking-[0.16em] text-slate-600">Topluluktan devam edin</span>
      <Link href="/bilgi-merkezi" className="mx-2 transition hover:text-rose-300">Rehberler</Link>
      <Link href="/sss" className="mx-2 transition hover:text-rose-300">SSS</Link>
      <Link href="/hizmetler" className="mx-2 transition hover:text-rose-300">Hizmetler</Link>
      <Link href="/iletisim" className="mx-2 transition hover:text-rose-300">İletişim</Link>
    </nav>
  </main>;
}
