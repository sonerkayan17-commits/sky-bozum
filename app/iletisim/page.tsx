import type { Metadata } from 'next';
import Link from 'next/link';
import ContactChannels from '../components/ContactChannels';
import ContactFaq from '../components/ContactFaq';
import { siteConfig } from '../lib/site';

export const metadata: Metadata = {
  title: 'Sky Bozum İletişim ve Destek Merkezi',
  description: 'Sky Bozum iletişim merkezi: güncel mobil ödeme bozum oranı, güvenli bozum talebi, işlem desteği ve resmi WhatsApp bağlantısı.',
  alternates: { canonical: '/iletisim' },
  openGraph: {
    title: 'Sky Bozum İletişim ve Destek Merkezi',
    description: 'Bozum talebi, güncel oran ve işlem desteği için Sky Bozum resmi iletişim kanalları.',
    url: '/iletisim',
    type: 'website',
  },
};

const guideCards = [
  { icon: '01', title: 'Bozum Talebi', description: 'İşlem başlatmadan önce bilmeniz gerekenler.', href: '/bilgi-merkezi/bozum-talebi-nasil-olusturulur' },
  { icon: '02', title: 'Güncel Oran Bilgisi', description: 'Oran öğrenme ve işlem hesaplama rehberi.', href: '/bilgi-merkezi/guncel-bozum-orani-nasil-ogrenilir' },
  { icon: '03', title: 'İşlem Desteği', description: 'Devam eden işlemler ve yardım merkezi.', href: '/bilgi-merkezi/islem-destegi-nasil-alinir' },
  { icon: '04', title: 'Genel Sorular', description: 'Merak edilen tüm iletişim konuları.', href: '/bilgi-merkezi/sky-bozum-iletisim-rehberi' },
];

const trustItems = [
  ['7/24', 'Destek talebi', 'Mesajınızı günün her saatinde resmi kanaldan iletebilirsiniz.'],
  ['Hızlı', 'Dönüş', 'İşlem türü ve tutar hazır olduğunda değerlendirme daha hızlı ilerler.'],
  ['Güvenli', 'İletişim', 'Şifre, kart PIN’i ve doğrulama kodu talep edilmez.'],
  ['Şeffaf', 'İşlem', 'Güncel oran ve uygunluk işlem başlamadan önce paylaşılır.'],
];

export default function Page() {
  const channels = [
    { title: 'WhatsApp Destek', value: siteConfig.phone, href: siteConfig.whatsapp, note: 'Oran, bozum talebi ve işlem desteği', external: true },
    { title: 'Telefon', value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, '')}`, note: 'Resmi Sky Bozum iletişim hattı' },
    { title: 'E-posta', value: siteConfig.email, href: `mailto:${siteConfig.email}`, note: 'Kurumsal ve ayrıntılı talepler' },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#080a0f] text-white">
      <section className="relative border-b border-white/8 pb-16 pt-14 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(244,63,94,.2),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(245,158,11,.16),transparent_30%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
        <div className="content-shell relative grid items-center gap-12 lg:grid-cols-[1.06fr_.94fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.8)]" /> Resmi destek merkezi
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.03] tracking-[-.045em] sm:text-6xl lg:text-7xl">Doğru bilgiye, güvenli iletişime ve hızlı desteğe tek noktadan ulaşın.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">Mobil ödeme bozum, dijital kod işlemleri, güncel oran ve işlem sonrası destek için yalnız resmi Sky Bozum iletişim kanallarını kullanın.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary min-h-14 px-7">WhatsApp’tan Destek Al</a>
              <Link href="/bilgi-merkezi/sky-bozum-iletisim-rehberi" className="btn-secondary min-h-14 px-7">İletişim Rehberini Aç</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold text-slate-300">
              {['7/24 talep', 'Resmi kanal', 'Şeffaf oran', 'Hassas veri yok'].map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2">✓ {item}</span>)}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[610px]">
            <div className="absolute -inset-10 rounded-full bg-gradient-to-br from-rose-500/20 via-transparent to-amber-400/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#10131a]/95 p-5 shadow-[0_40px_120px_rgba(0,0,0,.55)] sm:p-7">
              <div className="flex items-center justify-between border-b border-white/8 pb-5">
                <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 font-black">SB</div><div><p className="font-black">Sky Bozum Destek</p><p className="mt-1 text-xs text-emerald-300">● İletişim kanalı açık</p></div></div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black tracking-widest text-slate-400">GÜVENLİ</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-white/8 bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">Merhaba, işlem türünüzü ve tutarı yazın. Güncel oranı kontrol edelim.</div>
                <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-md bg-gradient-to-r from-rose-600 to-orange-500 p-4 text-sm font-bold">Razer Gold TL için 5.000 TL bozum oranı öğrenmek istiyorum.</div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-4"><span className="text-xs text-slate-500">Korunan bilgi</span><strong className="mt-2 block text-sm">Şifre talep edilmez</strong></div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-4"><span className="text-xs text-slate-500">İşlem akışı</span><strong className="mt-2 block text-sm">Önce oran onayı</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-shell py-12 sm:py-16">
        <div className="mb-7 max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-rose-400">İletişim kanalları</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Size uygun resmi kanalı seçin</h2></div>
        <ContactChannels channels={channels} />

        <section className="mt-14" aria-labelledby="guide-title">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Doğru başlangıç</p><h2 id="guide-title" className="mt-3 text-3xl font-black sm:text-4xl">İhtiyacınıza göre ilerleyin</h2></div><Link href="/bilgi-merkezi" className="text-sm font-extrabold text-amber-300">Tüm rehberler →</Link></div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guideCards.map((card) => <Link href={card.href} key={card.title} className="group rounded-[24px] border border-white/10 bg-gradient-to-b from-white/[0.055] to-white/[0.018] p-6 transition duration-300 hover:-translate-y-2 hover:border-amber-300/30 hover:shadow-[0_28px_70px_rgba(0,0,0,.35)]"><span className="grid h-11 w-11 place-items-center rounded-2xl border border-amber-300/20 bg-amber-300/[0.08] text-xs font-black text-amber-300">{card.icon}</span><h3 className="mt-6 text-xl font-black">{card.title}</h3><p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{card.description}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-amber-300">Rehberi incele <span className="transition group-hover:translate-x-1">→</span></span></Link>)}
          </div>
        </section>

        <section className="mt-14 overflow-hidden rounded-[32px] border border-white/10 bg-[#0e1118]" aria-labelledby="trust-title">
          <div className="grid lg:grid-cols-[.8fr_1.2fr]">
            <div className="relative flex min-h-[330px] flex-col justify-end overflow-hidden border-b border-white/8 p-7 lg:border-b-0 lg:border-r sm:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(244,63,94,.25),transparent_30%),radial-gradient(circle_at_80%_65%,rgba(245,158,11,.2),transparent_28%)]" />
              <div className="absolute left-10 top-10 grid h-28 w-28 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-4xl shadow-2xl">◎</div>
              <div className="relative"><p className="text-xs font-black uppercase tracking-[0.2em] text-rose-400">Dijital güven</p><h2 id="trust-title" className="mt-3 text-3xl font-black">İletişimin her adımı açık ve kontrollü.</h2><p className="mt-4 leading-7 text-slate-400">Kullanıcı endişelerini azaltan net kurallar ve doğrulanabilir resmi kanallar.</p></div>
            </div>
            <div className="grid sm:grid-cols-2">
              {trustItems.map(([metric, title, text], index) => <div key={title} className={`p-7 sm:p-9 ${index % 2 === 0 ? 'sm:border-r sm:border-white/8' : ''} ${index < 2 ? 'border-b border-white/8' : ''}`}><strong className="text-3xl font-black text-amber-300">{metric}</strong><h3 className="mt-3 text-lg font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p></div>)}
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_.85fr]" aria-labelledby="prepare-title">
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.055] to-transparent p-7 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Bize yazmadan önce hazırlayın</p>
            <h2 id="prepare-title" className="mt-3 text-3xl font-black">Üç bilgi, daha hızlı değerlendirme</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[['01', 'İşlem türü', 'Razer Gold, mobil ödeme, Paycell, Pokus veya diğer hizmet.'], ['02', 'Tutar', 'Bozdurmak istediğiniz toplam miktar ve para birimi.'], ['03', 'IBAN bilgisi', 'Ödeme yapılacak hesap ve hesap sahibinin adı.']].map(([number, title, text]) => <div key={number} className="rounded-2xl border border-white/8 bg-black/15 p-5"><span className="text-xs font-black text-emerald-300">{number}</span><h3 className="mt-3 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>)}
            </div>
          </div>
          <aside className="rounded-[28px] border border-rose-400/20 bg-rose-500/[0.055] p-7 sm:p-9">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-500/15 text-2xl">!</div>
            <h2 className="mt-5 text-2xl font-black">Hassas bilgi uyarısı</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">Sky Bozum iletişim sürecinde hesabınıza erişim sağlayan gizli bilgiler talep edilmez.</p>
            <ul className="mt-6 space-y-3 text-sm font-bold">{['Şifre istenmez.', 'Doğrulama kodu istenmez.', 'Kart şifresi istenmez.'].map((item) => <li key={item} className="flex items-center gap-3 rounded-xl border border-white/8 bg-black/15 px-4 py-3"><span className="text-rose-300">×</span>{item}</li>)}</ul>
          </aside>
        </section>

        <ContactFaq />

        <section className="relative mt-10 overflow-hidden rounded-[30px] border border-amber-300/20 bg-gradient-to-r from-[#171109] via-[#111217] to-[#171009] p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,.18),transparent_45%)]" />
          <div className="relative"><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Resmi iletişim</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">İşleminizi güvenli kanaldan başlatın.</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">Ürün türünü ve tutarı paylaşın; güncel uygunluk ve oran bilgisini işlem öncesinde alın.</p><a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary mt-7 min-h-14 px-9">WhatsApp’tan Yaz</a></div>
        </section>
      </section>
    </main>
  );
}
