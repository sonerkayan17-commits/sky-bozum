import type { Metadata } from 'next';
import FaqSearch from '../components/FaqSearch';
import { services, siteConfig } from '../lib/site';

export const metadata: Metadata = { title: 'Sık Sorulan Sorular', description: 'Sky Bozum işlem, oran, ödeme ve güvenlik soruları.', alternates: { canonical: '/sss' } };

const general = [
  { q: 'Sky Bozum hangi işlemleri yapıyor?', a: 'Razer Gold, Apple, Steam, Paycell, Pokus, operatör mobil ödeme ve uygun kart işlemleri için bilgi ve destek sunulur.', category: 'Genel' },
  { q: 'Kesin oranı nereden öğrenebilirim?', a: 'Hizmet türünü ve tutarı WhatsApp üzerinden ileterek işleme başlamadan önce güncel oranı teyit edebilirsiniz.', category: 'Oran' },
  { q: 'Kodumu önceden göndermeli miyim?', a: 'Hayır. Önce uygunluk ve oran onayı alın; kodu yalnızca destek ekibinin yönlendirmesinden sonra iletin.', category: 'Güvenlik' },
  { q: 'Ödeme nasıl yapılır?', a: 'Uygun işlem doğrulandıktan ve alıcı bilgileri teyit edildikten sonra kararlaştırılan yöntemle ödeme tamamlanır.', category: 'Ödeme' },
];

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; kategori?: string }> }) {
  const { q = '', kategori = 'Tümü' } = await searchParams;
  const items = [...general, ...services.map((service) => ({ q: `${service.shortName}: ${service.faq[0].question}`, a: service.faq[0].answer, category: service.category }))];
  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <section className="relative overflow-hidden border-b border-white/8 py-16 sm:py-20"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,.14),transparent_45%)]"/><div className="content-shell relative text-center"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-400">S.S.S.</p><h1 className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Aklınızdaki soruya doğrudan ulaşın.</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400">İşlem süreci, oranlar, ödeme ve kod güvenliği hakkındaki cevapları arayın veya konuya göre filtreleyin.</p></div></section>
      <section className="content-shell grid gap-8 py-12 sm:py-16 lg:grid-cols-[320px_1fr]">
        <aside className="premium-card h-fit p-6 lg:sticky lg:top-28"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-400">Canlı destek</p><h2 className="mt-3 text-2xl font-black">Cevabı bulamadınız mı?</h2><p className="mt-3 text-sm leading-7 text-slate-400">Hizmet ve tutar bilgisini yazın; kod göndermeden önce güncel uygunluğu öğrenin.</p><a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 text-sm font-extrabold">WhatsApp ile sorun</a></aside>
        <FaqSearch items={items} initialQuery={q.slice(0, 100)} initialCategory={kategori.slice(0, 50)} />
      </section>
    </main>
  );
}
