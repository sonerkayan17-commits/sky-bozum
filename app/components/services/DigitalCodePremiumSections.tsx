import Link from 'next/link';

type Mode = 'razer-tl' | 'razer-usd' | 'apple' | 'steam';

const data = {
  'razer-tl': {
    label: 'Razer Gold TL', tone: 'green', eyebrow: 'Razer Gold TL işlem rotası', title: 'Kod doğrulama, tutar ve ödeme adımlarını tek yerde yönetin',
    description: 'Razer Gold TL kodunun uygunluğunu, kullanılmamış durumunu, tutarını ve tahmini karşılığını Sky Bozum içinde kontrol edin.',
    routes: [
      ['Başlangıç', 'Razer Gold nedir?', 'Kod türü, kullanım mantığı ve işlem öncesi temel kontrolleri öğrenin.', '/bilgi-merkezi/razer-gold-nedir'],
      ['Kod güvenliği', 'Geçersiz kod sorununu çözün', 'Kodun bölge, para birimi, kullanım ve karakter kontrollerini uygulayın.', '/bilgi-merkezi/sorun-cozme/razer-gold-kodu-gecersiz'],
      ['Hızlı hesaplama', 'Tahmini TL karşılığını görün', 'Kod tutarını girerek güncel taban oran aralığına göre yaklaşık sonucu hesaplayın.', '/oran-hesapla?service=razer-gold-tl'],
    ],
    controls: [['Kod para birimi', 'Kodun TL cinsinden ve doğru ürün türünde olduğunu doğrulayın.'], ['Kod durumu', 'Kod kullanılmamış, okunabilir ve eksiksiz olmalıdır.'], ['Tutar ve adet', 'Her kodun tutarını ve toplam kod adedini işlem öncesinde netleştirin.'], ['Paylaşım güvenliği', 'Kodu yalnızca yazılı uygunluk onayından sonra resmî Sky Bozum görüşmesinde paylaşın.']],
    issues: [['Kod geçersiz görünüyor', 'Karakter, bölge, para birimi ve kullanım durumunu kontrol edin.', '/bilgi-merkezi/sorun-cozme/razer-gold-kodu-gecersiz'], ['Kod teslim edilmedi', 'Sipariş ve dijital teslimat durumunu kontrol listesiyle inceleyin.', '/bilgi-merkezi/sorun-cozme/dijital-kod-teslim-edilmedi'], ['Tutar yanlış seçildi', 'Kodun nominal değerini ve para birimini işlemden önce yeniden doğrulayın.', '/bilgi-merkezi?search=razer%20gold']],
  },
  'razer-usd': {
    label: 'Razer Gold USD', tone: 'emerald', eyebrow: 'Razer Gold USD işlem rotası', title: 'USD kodlarında bölge ve para birimi kontrolünü güçlendirin',
    description: 'Razer Gold USD kodlarının bölge, tutar, kullanılmamışlık ve tahmini ödeme kontrollerini tek akışta tamamlayın.',
    routes: [
      ['Başlangıç', 'TL ve USD kod farkını öğrenin', 'Para birimi, bölge ve kullanım farklarını işlem öncesinde netleştirin.', '/bilgi-merkezi/razer-gold-tl-ve-usd-farki'],
      ['Kod güvenliği', 'Geçersiz kod sorununu çözün', 'Kodun bölge, para birimi, kullanım ve karakter kontrollerini uygulayın.', '/bilgi-merkezi/sorun-cozme/razer-gold-kodu-gecersiz'],
      ['Hızlı hesaplama', 'Tahmini karşılığı görün', 'USD kod tutarını girerek güncel taban oranına göre yaklaşık sonucu hesaplayın.', '/oran-hesapla?service=razer-gold-usd'],
    ],
    controls: [['USD doğrulaması', 'Kodun gerçekten USD cinsinden olduğunu sipariş detayından kontrol edin.'], ['Bölge uyumu', 'Kodun hesap veya mağaza bölgesiyle uyumlu olduğundan emin olun.'], ['Kod durumu', 'Kod kullanılmamış, okunabilir ve eksiksiz olmalıdır.'], ['Paylaşım güvenliği', 'Kodu yalnızca yazılı uygunluk onayından sonra paylaşın.']],
    issues: [['USD kodu kabul edilmiyor', 'Bölge, para birimi ve kullanım durumunu sırayla inceleyin.', '/bilgi-merkezi/sorun-cozme/razer-gold-kodu-gecersiz'], ['Kod teslim edilmedi', 'Sipariş ve dijital teslimat durumunu kontrol edin.', '/bilgi-merkezi/sorun-cozme/dijital-kod-teslim-edilmedi'], ['TL / USD karışıklığı', 'Kodun para birimini sipariş belgesi ve ürün başlığından doğrulayın.', '/bilgi-merkezi/razer-gold-tl-ve-usd-farki']],
  },
  apple: {
    label: 'Apple Gift Card', tone: 'slate', eyebrow: 'Apple Gift Card işlem rotası', title: 'Bölge, para birimi ve kod güvenliğini tek akışta kontrol edin',
    description: 'Apple Gift Card kodunun ülke/bölge uyumunu, kullanılmamışlık durumunu ve tahmini karşılığını Sky Bozum içinde değerlendirin.',
    routes: [
      ['Başlangıç', 'Apple Gift Card nedir?', 'Kodun kullanım alanı, bölge mantığı ve temel işlem kontrollerini öğrenin.', '/bilgi-merkezi/apple-gift-card-nedir'],
      ['Sorun çözme', 'Etkinleştirme hatasını inceleyin', 'Bölge, hesap, kod karakteri ve kullanım durumunu adım adım kontrol edin.', '/bilgi-merkezi/sorun-cozme/apple-gift-card-etkinlestirilemiyor'],
      ['Hızlı hesaplama', 'Tahmini karşılığı görün', 'Kod tutarını girerek güncel taban oran aralığına göre yaklaşık sonucu hesaplayın.', '/oran-hesapla?service=itunes-apple'],
    ],
    controls: [['Ülke ve bölge', 'Kodun ait olduğu mağaza ülkesi ve hesabın bölgesi birbiriyle uyumlu olmalıdır.'], ['Para birimi', 'Kodun TL, USD veya farklı para biriminde olup olmadığını netleştirin.'], ['Kod durumu', 'Kod kullanılmamış, okunabilir ve eksiksiz olmalıdır.'], ['Paylaşım güvenliği', 'Kod ve satın alma belgesini işlem onayı öncesinde üçüncü kişilerle paylaşmayın.']],
    issues: [['Kod etkinleştirilemiyor', 'Bölge, hesap ve kullanım durumunu kontrol edin.', '/bilgi-merkezi/sorun-cozme/apple-gift-card-etkinlestirilemiyor'], ['Kod teslim edilmedi', 'Sipariş ve dijital teslimat durumunu inceleyin.', '/bilgi-merkezi/sorun-cozme/dijital-kod-teslim-edilmedi'], ['Bölge uyuşmuyor', 'Kodun mağaza ülkesini ve hesap bölgesini yeniden doğrulayın.', '/bilgi-merkezi/apple-gift-card-nedir']],
  },
  steam: {
    label: 'Steam', tone: 'blue', eyebrow: 'Steam işlem rotası', title: 'Cüzdan kodu, bölge ve para birimi kontrollerini tamamlayın',
    description: 'Steam Cüzdan kodunun bölge, para birimi, kullanılmamışlık ve tahmini karşılık kontrollerini tek akışta yönetin.',
    routes: [
      ['Başlangıç', 'Steam Cüzdan Kodu nedir?', 'Kodun kullanım alanı, bölge mantığı ve temel işlem kontrollerini öğrenin.', '/bilgi-merkezi/steam-cuzdan-kodu-nedir'],
      ['Sorun çözme', 'Kod kullanım hatasını inceleyin', 'Bölge, para birimi, karakter ve kullanım durumunu adım adım kontrol edin.', '/bilgi-merkezi/sorun-cozme/steam-cuzdan-kodu-kullanilmiyor'],
      ['Hızlı hesaplama', 'Tahmini karşılığı görün', 'Kod tutarını girerek güncel taban oran aralığına göre yaklaşık sonucu hesaplayın.', '/oran-hesapla?service=steam'],
    ],
    controls: [['Bölge ve para birimi', 'Kodun hesap bölgesi ve cüzdan para birimiyle uyumlu olduğunu doğrulayın.'], ['Kod durumu', 'Kod kullanılmamış, okunabilir ve eksiksiz olmalıdır.'], ['Nominal değer', 'Kodun tutarını sipariş detayı ve ürün başlığından kontrol edin.'], ['Paylaşım güvenliği', 'Kodu yalnızca yazılı uygunluk onayından sonra paylaşın.']],
    issues: [['Kod kullanılmıyor', 'Bölge, para birimi ve kullanım durumunu kontrol edin.', '/bilgi-merkezi/sorun-cozme/steam-cuzdan-kodu-kullanilmiyor'], ['Kod teslim edilmedi', 'Sipariş ve dijital teslimat durumunu inceleyin.', '/bilgi-merkezi/sorun-cozme/dijital-kod-teslim-edilmedi'], ['Para birimi uyuşmuyor', 'Kod ve hesap para birimini işlem öncesinde yeniden doğrulayın.', '/bilgi-merkezi/steam-cuzdan-kodu-nedir']],
  },
} as const;

const tones = {
  green: { text: 'text-lime-300', border: 'hover:border-lime-300/30', softBorder: 'border-lime-300/20', softBg: 'bg-lime-300/10', panel: 'border-lime-300/15 bg-[linear-gradient(145deg,rgba(68,214,44,.11),rgba(255,255,255,.02)_48%,rgba(255,255,255,.015))]', glow: 'bg-[radial-gradient(circle_at_85%_15%,rgba(68,214,44,.14),transparent_42%)]', hoverText: 'hover:text-lime-300' },
  emerald: { text: 'text-emerald-300', border: 'hover:border-emerald-300/30', softBorder: 'border-emerald-300/20', softBg: 'bg-emerald-300/10', panel: 'border-emerald-300/15 bg-[linear-gradient(145deg,rgba(16,185,129,.11),rgba(34,197,94,.05)_48%,rgba(255,255,255,.015))]', glow: 'bg-[radial-gradient(circle_at_85%_15%,rgba(16,185,129,.14),transparent_42%)]', hoverText: 'hover:text-emerald-300' },
  slate: { text: 'text-slate-200', border: 'hover:border-white/25', softBorder: 'border-white/15', softBg: 'bg-white/[0.06]', panel: 'border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,.09),rgba(148,163,184,.04)_48%,rgba(255,255,255,.015))]', glow: 'bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,.13),transparent_42%)]', hoverText: 'hover:text-white' },
  blue: { text: 'text-sky-300', border: 'hover:border-sky-300/30', softBorder: 'border-sky-300/20', softBg: 'bg-sky-300/10', panel: 'border-sky-300/15 bg-[linear-gradient(145deg,rgba(14,165,233,.11),rgba(30,58,138,.08)_48%,rgba(255,255,255,.015))]', glow: 'bg-[radial-gradient(circle_at_85%_15%,rgba(14,165,233,.15),transparent_42%)]', hoverText: 'hover:text-sky-300' },
} as const;

export default function DigitalCodePremiumSections({ mode }: { mode: Mode }) {
  const item = data[mode];
  const tone = tones[item.tone];
  return (
    <>
      <section className="content-shell pb-16"><div className="mb-7 max-w-3xl"><p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${tone.text}`}>{item.eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{item.title}</h2><p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p></div><div className="grid gap-4 lg:grid-cols-3">{item.routes.map(([eyebrow, title, description, href], index) => <Link key={title} href={href} className={`premium-card group focus-ring relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1 ${tone.border}`}><div className={`pointer-events-none absolute inset-0 ${tone.glow} opacity-70`} /><span className={`relative text-[10px] font-black uppercase tracking-[0.16em] ${tone.text}`}>0{index + 1} · {eyebrow}</span><h3 className="relative mt-4 text-xl font-black tracking-tight">{title}</h3><p className="relative mt-3 text-sm leading-7 text-slate-400">{description}</p><span className={`relative mt-6 inline-flex items-center gap-2 text-xs font-extrabold ${tone.text}`}>Devam edin <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span></Link>)}</div></section>
      <section className="content-shell pb-16"><div className={`overflow-hidden rounded-[28px] border ${tone.panel}`}><div className="grid gap-0 lg:grid-cols-[.82fr_1.18fr]"><div className="border-b border-white/8 p-7 sm:p-9 lg:border-b-0 lg:border-r"><p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${tone.text}`}>İşlem öncesi kontrol</p><h2 className="mt-3 text-3xl font-black tracking-tight">Dört kritik noktayı netleştirin</h2><p className="mt-4 text-sm leading-7 text-slate-400">Dijital kod satın almadan veya paylaşmadan önce ürün, bölge, tutar ve kod güvenliğini doğrulayın.</p><Link href="/iletisim#guvenlik" className={`focus-ring mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-extrabold text-slate-200 ${tone.border} ${tone.hoverText}`}>Güvenlik kontrolünü açın</Link></div><div className="grid sm:grid-cols-2">{item.controls.map(([title, text], index) => <article key={title} className={`p-6 sm:p-7 ${index % 2 === 0 ? 'sm:border-r sm:border-white/8' : ''} ${index < 2 ? 'border-b border-white/8' : ''}`}><span className={`flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-black ${tone.softBorder} ${tone.softBg} ${tone.text}`}>{index + 1}</span><h3 className="mt-4 text-base font-black">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{text}</p></article>)}</div></div></div></section>
      <section className="content-shell pb-16"><div className="mb-7 max-w-2xl"><p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${tone.text}`}>Hızlı sorun çözme</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">En sık yaşanan {item.label} sorunları</h2></div><div className="grid gap-4 md:grid-cols-3">{item.issues.map(([title, text, href]) => <Link key={title} href={href} className={`premium-card group focus-ring p-6 ${tone.border}`}><div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{text}</p></div><span aria-hidden="true" className={`mt-1 transition-transform group-hover:translate-x-1 ${tone.text}`}>→</span></div></Link>)}</div></section>
    </>
  );
}
