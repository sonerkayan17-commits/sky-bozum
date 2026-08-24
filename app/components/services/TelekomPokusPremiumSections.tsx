import Link from 'next/link';

type BrandMode = 'telekom' | 'pokus';

const content = {
  telekom: {
    eyebrow: 'Türk Telekom işlem rotası',
    title: 'Hat, limit ve doğrulama adımlarını tek akışta yönetin',
    description: 'Türk Telekom mobil ödeme ile dijital ürün satın alırken bilgi, limit, mağaza ve güvenlik kontrollerini tek akışta tamamlayın.',
    tone: 'cyan',
    routes: [
      { eyebrow: 'Başlangıç', title: 'Türk Telekom mobil ödeme nasıl çalışır?', description: 'Hat uygunluğu, mobil ödeme servisi ve temel işlem kontrollerini öğrenin.', href: '/bilgi-merkezi/turk-telekom-mobil-odeme-rehberi' },
      { eyebrow: 'Sorun çözme', title: 'Hata, SMS ve limit sorunlarını inceleyin', description: 'Ödeme reddi, doğrulama mesajı ve kullanılabilir limit sorunlarını adım adım kontrol edin.', href: '/bilgi-merkezi/sorun-cozme/turk-telekom-mobil-odeme-calismiyor' },
      { eyebrow: 'Satın alma rehberi', title: 'Türk Telekom ile dijital ürün alın', description: 'Mağaza, ürün bölgesi, teslimat ve SMS onayı kontrollerini satın alma öncesinde uygulayın.', href: '/bilgi-merkezi/turk-telekom-mobil-odeme-rehberi' },
    ],
    controls: [
      ['Hat ve servis durumu', 'Mobil ödeme servisinin hat üzerinde açık ve işlem için uygun durumda olması gerekir.'],
      ['Kullanılabilir limit', 'Toplam limit, kullanılabilir tutar ve bekleyen işlemler birlikte değerlendirilmelidir.'],
      ['SMS doğrulama', 'Kısa mesaj engeli, şebeke durumu ve doğrulama izinleri kontrol edilmelidir.'],
      ['Ürün güvenliği', 'Onaylanan ürün dışında satın alma yapmayın; kodu kullanmadan ve paylaşmadan saklayın.'],
    ],
    issues: [
      { title: 'Mobil ödeme çalışmıyor', text: 'Servis durumu, limit, SMS ve hat kısıtlarını sırasıyla kontrol edin.', href: '/bilgi-merkezi/sorun-cozme/turk-telekom-mobil-odeme-calismiyor' },
      { title: 'SMS doğrulaması gelmiyor', text: 'Şebeke, mesaj engeli ve kısa kod izinlerini kontrol listesiyle inceleyin.', href: '/bilgi-merkezi/sorun-cozme/mobil-odeme-sms-gelmiyor' },
      { title: 'Limit görünmüyor', text: 'Kullanılabilir limitin neden görünmediğini temel kontrollerle belirleyin.', href: '/bilgi-merkezi/sorun-cozme/mobil-odeme-limit-sifir-gorunuyor' },
    ],
  },
  pokus: {
    eyebrow: 'Pokus işlem rotası',
    title: 'Kart ayarından dijital kod teslimine kadar bütün adımlar',
    description: 'Pokus kart, kullanılabilir bakiye, internet alışverişi ve dijital ürün satın alma sürecini tek akışta yönetin.',
    tone: 'violet',
    routes: [
      { eyebrow: 'Başlangıç', title: 'Pokus nedir, nasıl kullanılır?', description: 'Kart bilgileri, bakiye, internet alışverişi ayarı ve kullanım mantığını öğrenin.', href: '/bilgi-merkezi/pokus-nedir-razer-gold-nasil-alinir' },
      { eyebrow: 'Sorun çözme', title: 'Kart ve ödeme hatalarını inceleyin', description: 'Kart durumu, bakiye, limit ve mağaza uyumluluğunu adım adım kontrol edin.', href: '/bilgi-merkezi/sorun-cozme/pokus-kart-hata-veriyor' },
      { eyebrow: 'Güvenli alışveriş', title: 'Satıcı ve ürün kontrollerini uygulayın', description: 'Satıcı güveni, ürün bölgesi, teslimat biçimi ve ödeme ekranını birlikte doğrulayın.', href: '/bilgi-merkezi/pokus-nedir-razer-gold-nasil-alinir' },
    ],
    controls: [
      ['Kart durumu', 'Pokus kartın aktif ve internet alışverişine açık olduğunu uygulama içinden kontrol edin.'],
      ['Kullanılabilir bakiye', 'Görünen bakiye ile provizyonlar sonrası kullanılabilir tutar farklı olabilir.'],
      ['Satıcı ve ürün uyumu', 'Dijital teslimat, satıcı güveni, ürün bölgesi ve para birimi birlikte doğrulanmalıdır.'],
      ['Kart ve kod güvenliği', 'Kart bilgilerini, SMS kodunu veya dijital ürün kodunu üçüncü kişilerle paylaşmayın.'],
    ],
    issues: [
      { title: 'Pokus kart hata veriyor', text: 'Kart ayarı, bakiye, limit ve mağaza uyumluluğunu sırayla kontrol edin.', href: '/bilgi-merkezi/sorun-cozme/pokus-kart-hata-veriyor' },
      { title: 'Ödeme reddediliyor', text: 'Provizyon, internet alışverişi izni ve ürün uyumluluğunu inceleyin.', href: '/bilgi-merkezi/sorun-cozme/pokus-kart-hata-veriyor' },
      { title: 'Kod teslimi bekleniyor', text: 'Dijital ürün teslimatı tamamlanmadıysa sipariş ve satıcı kontrollerini uygulayın.', href: '/bilgi-merkezi/sorun-cozme/dijital-kod-teslim-edilmedi' },
    ],
  },
} as const;

const tones = {
  cyan: {
    text: 'text-cyan-300', border: 'hover:border-cyan-300/30', softBorder: 'border-cyan-300/20', softBg: 'bg-cyan-300/10',
    panel: 'border-cyan-300/15 bg-[linear-gradient(145deg,rgba(34,211,238,.10),rgba(59,130,246,.07)_48%,rgba(255,255,255,.015))]',
    glow: 'bg-[radial-gradient(circle_at_85%_15%,rgba(34,211,238,.14),transparent_42%)]', hoverText: 'hover:text-cyan-300',
  },
  violet: {
    text: 'text-violet-300', border: 'hover:border-violet-300/30', softBorder: 'border-violet-300/20', softBg: 'bg-violet-300/10',
    panel: 'border-violet-300/15 bg-[linear-gradient(145deg,rgba(139,92,246,.12),rgba(59,130,246,.05)_48%,rgba(255,255,255,.015))]',
    glow: 'bg-[radial-gradient(circle_at_85%_15%,rgba(139,92,246,.15),transparent_42%)]', hoverText: 'hover:text-violet-300',
  },
} as const;

export default function TelekomPokusPremiumSections({ mode }: { mode: BrandMode }) {
  const item = content[mode];
  const tone = tones[item.tone];
  const label = mode === 'telekom' ? 'Türk Telekom' : 'Pokus';

  return (
    <>
      <section className="content-shell pb-16">
        <div className="mb-7 max-w-3xl"><p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${tone.text}`}>{item.eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{item.title}</h2><p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p></div>
        <div className="grid gap-4 lg:grid-cols-3">{item.routes.map((route, index) => <Link key={route.title} href={route.href} className={`premium-card group focus-ring relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1 ${tone.border}`}><div className={`pointer-events-none absolute inset-0 ${tone.glow} opacity-70`} /><span className={`relative text-[10px] font-black uppercase tracking-[0.16em] ${tone.text}`}>0{index + 1} · {route.eyebrow}</span><h3 className="relative mt-4 text-xl font-black tracking-tight">{route.title}</h3><p className="relative mt-3 text-sm leading-7 text-slate-400">{route.description}</p><span className={`relative mt-6 inline-flex items-center gap-2 text-xs font-extrabold ${tone.text}`}>Devam edin <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span></Link>)}</div>
      </section>

      <section className="content-shell pb-16"><div className={`overflow-hidden rounded-[28px] border ${tone.panel}`}><div className="grid gap-0 lg:grid-cols-[.82fr_1.18fr]"><div className="border-b border-white/8 p-7 sm:p-9 lg:border-b-0 lg:border-r"><p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${tone.text}`}>İşlem öncesi kontrol</p><h2 className="mt-3 text-3xl font-black tracking-tight">Dört kritik noktayı netleştirin</h2><p className="mt-4 text-sm leading-7 text-slate-400">Bu kontroller tamamlanmadan ürün satın almak, kart bilgisini girmek veya kod paylaşmak gereksiz risk oluşturabilir.</p><Link href="/iletisim#guvenlik" className={`focus-ring mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-extrabold text-slate-200 ${tone.border} ${tone.hoverText}`}>Güvenlik kontrolünü açın</Link></div><div className="grid sm:grid-cols-2">{item.controls.map(([title, text], index) => <article key={title} className={`p-6 sm:p-7 ${index % 2 === 0 ? 'sm:border-r sm:border-white/8' : ''} ${index < 2 ? 'border-b border-white/8' : ''}`}><span className={`flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-black ${tone.softBorder} ${tone.softBg} ${tone.text}`}>{index + 1}</span><h3 className="mt-4 text-base font-black">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{text}</p></article>)}</div></div></div></section>

      <section className="content-shell pb-16"><div className="mb-7 max-w-2xl"><p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${tone.text}`}>Hızlı sorun çözme</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">En sık yaşanan {label} sorunları</h2></div><div className="grid gap-4 md:grid-cols-3">{item.issues.map((issue) => <Link key={issue.title} href={issue.href} className={`premium-card group focus-ring p-6 ${tone.border}`}><div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-black">{issue.title}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{issue.text}</p></div><span aria-hidden="true" className={`mt-1 transition-transform group-hover:translate-x-1 ${tone.text}`}>→</span></div></Link>)}</div></section>
    </>
  );
}
