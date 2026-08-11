import Link from 'next/link';

const routes = [
  {
    eyebrow: 'Başlangıç',
    title: 'Vodafone mobil ödeme nedir?',
    description: 'Sistemin nasıl çalıştığını, kimlerin kullanabildiğini ve işlem öncesi temel kontrolleri öğrenin.',
    href: '/bilgi-merkezi/vodafone-mobil-odeme-nedir',
  },
  {
    eyebrow: 'Limit kontrolü',
    title: 'Kullanılabilir tutarı netleştirin',
    description: 'Hattınızdaki ödeme durumunu, kullanılabilir limiti ve olası kısıtları adım adım kontrol edin.',
    href: '/bilgi-merkezi/sorun-cozme/vodafone-mobil-odeme-acilmiyor',
  },
  {
    eyebrow: 'Hızlı hesaplama',
    title: 'Tahmini ödeme aralığını görün',
    description: 'İşlem tutarını girerek güncel taban oran aralığına göre yaklaşık sonucu hesaplayın.',
    href: '/oran-hesapla?service=vodafone-mobil-odeme',
  },
];

const controlItems = [
  ['Hat uygunluğu', 'Mobil ödeme özelliğinin açık ve hattın işlem için uygun durumda olması gerekir.'],
  ['Kullanılabilir limit', 'Toplam limit ile kullanılabilir tutar aynı olmayabilir; işlemden hemen önce tekrar kontrol edilmelidir.'],
  ['Ürün ve bölge', 'Dijital ürünün doğru ülke, para birimi ve bölge için seçildiğinden emin olunmalıdır.'],
  ['Kod güvenliği', 'Kod kullanılmamalı, ekran görüntüsü veya kod bilgisi işlem onayı öncesinde üçüncü kişilerle paylaşılmamalıdır.'],
];

const issueLinks = [
  { title: 'Mobil ödeme açılmıyor', text: 'Hat ayarı, limit, yaş, borç ve güvenlik kısıtlarını kontrol edin.', href: '/bilgi-merkezi/sorun-cozme/vodafone-mobil-odeme-acilmiyor' },
  { title: 'SMS gelmiyor', text: 'Kısa mesaj engeli, çekim gücü ve doğrulama adımlarını inceleyin.', href: '/bilgi-merkezi/sorun-cozme/mobil-odeme-sms-gelmiyor' },
  { title: 'Limit sıfır görünüyor', text: 'Kullanılabilir limitin neden görünmediğini kontrol listesiyle bulun.', href: '/bilgi-merkezi/sorun-cozme/mobil-odeme-limiti-sifir' },
];

export default function VodafonePremiumSections() {
  return (
    <>
      <section className="content-shell pb-16">
        <div className="mb-7 max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-red-400">Vodafone işlem rotası</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Aradığınız adıma doğrudan ilerleyin</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">Kullanıcıyı farklı sitelere göndermeden; bilgi, kontrol, hesaplama ve destek akışının tamamını Sky Bozum içinde birleştirdik.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {routes.map((route, index) => (
            <Link key={route.title} href={route.href} className="premium-card group focus-ring relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-red-400/30">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(230,0,0,.13),transparent_42%)] opacity-70" />
              <span className="relative text-[10px] font-black uppercase tracking-[0.16em] text-red-400">0{index + 1} · {route.eyebrow}</span>
              <h3 className="relative mt-4 text-xl font-black tracking-tight">{route.title}</h3>
              <p className="relative mt-3 text-sm leading-7 text-slate-400">{route.description}</p>
              <span className="relative mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-red-300">Devam edin <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-shell pb-16">
        <div className="overflow-hidden rounded-[28px] border border-red-500/15 bg-[linear-gradient(145deg,rgba(230,0,0,.11),rgba(255,255,255,.025)_48%,rgba(255,255,255,.015))]">
          <div className="grid gap-0 lg:grid-cols-[.82fr_1.18fr]">
            <div className="border-b border-white/8 p-7 sm:p-9 lg:border-b-0 lg:border-r">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-red-400">İşlem öncesi kontrol</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">Dört kritik noktayı netleştirin</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">Bu kontroller tamamlanmadan ürün satın almak veya kod paylaşmak gereksiz risk oluşturabilir.</p>
              <Link href="/guven-merkezi" className="focus-ring mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-extrabold text-slate-200 hover:border-red-400/30 hover:text-red-300">Güven merkezini açın</Link>
            </div>
            <div className="grid sm:grid-cols-2">
              {controlItems.map(([title, text], index) => (
                <article key={title} className={`p-6 sm:p-7 ${index % 2 === 0 ? 'sm:border-r sm:border-white/8' : ''} ${index < 2 ? 'border-b border-white/8' : ''}`}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 text-xs font-black text-red-300">{index + 1}</span>
                  <h3 className="mt-4 text-base font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-shell pb-16">
        <div className="mb-7 max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-red-400">Hızlı sorun çözme</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">En sık yaşanan Vodafone sorunları</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {issueLinks.map((item) => (
            <Link key={item.title} href={item.href} className="premium-card group focus-ring p-6 hover:border-red-400/25">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{item.text}</p>
                </div>
                <span aria-hidden="true" className="mt-1 text-red-300 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
