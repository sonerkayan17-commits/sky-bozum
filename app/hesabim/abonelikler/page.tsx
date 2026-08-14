import Link from 'next/link';
import MemberSubscriptions from '../../components/member/MemberSubscriptions';
import '../utility.css';

export const metadata = { title: 'Konu ve Mesaj Abonelikleri', robots: { index: false, follow: false } };

export default function Page() {
  return <><MemberSubscriptions /><nav className="mx-auto flex max-w-3xl gap-3 px-6 pb-12 text-sm font-bold"><Link href="/hesabim/abonelikler" className="rounded-lg border border-rose-400/40 px-4 py-2 text-rose-300">Takip ettiklerim</Link><Link href="/hesabim/kaydedilenler" className="rounded-lg border border-white/10 px-4 py-2 text-slate-300">Kaydettiklerim</Link></nav></>;
}
