import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Hakkımızda', description: 'Sky Bozum’un hizmet yaklaşımı, işlem ilkeleri ve destek anlayışı.', alternates: { canonical: '/hakkimizda' } };

const principles = [
  ['Açık oran bilgisi', 'Oran ve tahmini ödeme tutarı işlem başlamadan önce paylaşılır.'],
  ['Kontrollü doğrulama', 'Kod veya bakiye yalnızca uygunluk onayından sonra incelenir.'],
  ['Düzenli iletişim', 'İşlemin hangi aşamada olduğu anlaşılır biçimde bildirilir.'],
];

export default function Page() {
  return <main className="min-h-screen bg-[#090b10] text-white"><section className="relative overflow-hidden border-b border-white/8 py-16 sm:py-20"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_0%,rgba(244,63,94,.14),transparent_45%)]"/><div className="content-shell relative"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-400">Sky Bozum</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Dijital bakiye işlemlerini anlaşılır hale getiriyoruz.</h1><p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">3+ yıldır aktif hizmet veren Sky Bozum; mobil ödeme, dijital kod ve cüzdan işlemlerinde açık bilgi ve kontrollü destek sunar.</p></div></section><section className="content-shell py-12 sm:py-16"><div className="grid gap-5 md:grid-cols-3">{principles.map(([title,text],index)=><article key={title} className="premium-card p-6"><span className="text-xs font-black text-rose-400">0{index+1}</span><h2 className="mt-3 text-xl font-black">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-400">{text}</p></article>)}</div><div className="premium-card mt-6 grid gap-8 p-6 sm:p-9 lg:grid-cols-2"><div><h2 className="text-2xl font-black">Ne yapıyoruz?</h2><p className="mt-4 text-sm leading-8 text-slate-300">Razer Gold, Apple/iTunes, Steam, Paycell, Pokus ve operatör mobil ödeme bakiyeleri için yöntem, oran ve işlem desteği sağlıyoruz. Kullanıcıların yanlış ürün satın almadan önce doğru bilgiye ulaşmasını hedefliyoruz.</p></div><div><h2 className="text-2xl font-black">Ne vaat etmiyoruz?</h2><p className="mt-4 text-sm leading-8 text-slate-300">Sabit oran, koşulsuz kabul veya kontrol yapılmadan ödeme vaadinde bulunmuyoruz. Oranlar ve uygunluk işlem anındaki stok, ürün ve doğrulama koşullarına göre netleşir.</p></div></div><div className="mt-8 text-center"><Link href="/hizmetler" className="focus-ring inline-flex rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 px-6 py-3 text-sm font-extrabold">Hizmetleri incele</Link></div></section></main>;
}
