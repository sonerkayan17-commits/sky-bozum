import type { Metadata } from 'next';
import Link from 'next/link';
import { createMetadata } from '../lib/seo';

export const metadata: Metadata = createMetadata({ title: 'Hakkımızda', description: 'Sky Bozum’un hizmet yaklaşımını, açık oran ve doğrulama ilkelerini, bağımsız rehber modelini ve kullanıcı güvenliği standartlarını tanıyın.', path: '/hakkimizda' });

const principles = [
  ['Açık oran bilgisi', 'Oran ve tahmini ödeme tutarı işlem başlamadan önce paylaşılır.'],
  ['Kontrollü doğrulama', 'Kod veya bakiye yalnızca uygunluk onayından sonra incelenir.'],
  ['Düzenli iletişim', 'İşlemin hangi aşamada olduğu anlaşılır biçimde bildirilir.'],
];

export default function Page() {
  return <main className="min-h-screen bg-[#090b10] text-white"><section className="relative overflow-hidden border-b border-white/8 py-16 sm:py-20"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_0%,rgba(244,63,94,.14),transparent_45%)]"/><div className="content-shell relative"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-400">Sky Bozum</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Dijital bakiye işlemlerini anlaşılır hale getiriyoruz.</h1><p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">Sky Bozum; dijital kod değerlendirme hizmetlerinde, mobil ödeme ve cüzdanla dijital ürün satın alma rehberlerinde açık bilgi ve kontrollü destek sunar.</p></div></section><section className="content-shell py-12 sm:py-16"><div className="grid gap-5 md:grid-cols-3">{principles.map(([title,text],index)=><article key={title} className="premium-card p-6"><span className="text-xs font-black text-rose-400">0{index+1}</span><h2 className="mt-3 text-xl font-black">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-400">{text}</p></article>)}</div><div className="premium-card mt-6 grid gap-8 p-6 sm:p-9 lg:grid-cols-2"><div><h2 className="text-2xl font-black">Ne yapıyoruz?</h2><p className="mt-4 text-sm leading-8 text-slate-300">Razer Gold, Apple/iTunes ve Steam gibi desteklenen dijital kodlar için uygunluk ve oran bilgisi; operatör ve dijital cüzdan kullanıcıları için ise bağımsız dijital ürün satın alma rehberleri sağlıyoruz. Kullanıcıların yanlış ürün satın almadan önce doğru bilgiye ulaşmasını hedefliyoruz.</p></div><div><h2 className="text-2xl font-black">Ne yapmıyoruz?</h2><p className="mt-4 text-sm leading-8 text-slate-300">Turkcell, Vodafone, Türk Telekom, Paycell, Pokus veya Vodafone Pay bakiyesini doğrudan satın almıyor ve bu markalar adına bozum hizmeti yürütmüyoruz. Adı geçen markalarla ortaklık, temsilcilik veya yetkili satıcılık ilişkimiz bulunmuyor.</p></div></div><div className="mt-8 text-center"><Link href="/hizmetler" className="focus-ring inline-flex rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 px-6 py-3 text-sm font-extrabold">Rehber ve hizmetleri incele</Link></div></section></main>;
}
