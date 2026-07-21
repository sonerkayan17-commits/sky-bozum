import Link from 'next/link';

type Mode = 'sms' | 'card';

const data = {
  sms: {
    label: 'SMS Mobil Ödeme',
    accent: 'text-rose-300',
    border: 'hover:border-rose-300/30',
    panel: 'border-rose-300/15 bg-[linear-gradient(145deg,rgba(244,63,94,.11),rgba(255,255,255,.02)_50%,rgba(255,255,255,.015))]',
    title: 'Operatör, limit ve SMS onayını tek akışta kontrol edin',
    description: 'Vodafone, Turkcell ve Türk Telekom mobil ödeme işlemlerinde uygunluk, kullanılabilir limit ve doğrulama adımlarını işlem öncesinde netleştirin.',
    routes: [
      ['Operatör seçimi', 'Hattınıza uygun rehberi açın', 'Operatörünüze özel mobil ödeme ve limit adımlarına ulaşın.', '/operatorler'],
      ['Sorun çözme', 'SMS gelmiyorsa kontrol edin', 'Telefon, hat, servis ve mesaj ayarlarını adım adım inceleyin.', '/bilgi-merkezi/sorun-cozme/mobil-odeme-sms-gelmiyor'],
      ['Hızlı hesaplama', 'Tahmini karşılığı görün', 'Kullanılabilir tutarı girerek güncel taban oranına göre yaklaşık sonucu hesaplayın.', '/oran-hesapla?service=sms-mobil-odeme'],
    ],
    controls: [
      ['Hat sahibi ve uygunluk', 'İşlem kullanılan hattın sahibine ait olmalı; mobil ödeme hizmeti açık ve kullanıma uygun görünmelidir.'],
      ['Kullanılabilir limit', 'Toplam limit yerine o anda harcanabilir mobil ödeme limitini kontrol edin.'],
      ['SMS doğrulaması', 'Onay mesajındaki tutarı ve hizmet adını okumadan işlem onayı vermeyin.'],
      ['Yazılı oran teyidi', 'İşleme başlamadan önce operatör, tutar ve güncel oran bilgisini yazılı olarak doğrulayın.'],
    ],
    issues: [
      ['SMS gelmiyor', 'Telefon, hat, mesaj engeli ve servis durumunu sırayla kontrol edin.', '/bilgi-merkezi/sorun-cozme/mobil-odeme-sms-gelmiyor'],
      ['Limit sıfır görünüyor', 'Fatura, kullanım geçmişi ve operatör limit koşullarını inceleyin.', '/bilgi-merkezi/sorun-cozme/mobil-odeme-limit-sifir-gorunuyor'],
      ['İşlem beklemede kaldı', 'Provizyon ve işlem durumunu tekrar onay vermeden kontrol edin.', '/bilgi-merkezi/sorun-cozme/odeme-beklemede-kaldi'],
    ],
  },
  card: {
    label: 'Kredi / Sanal Kart',
    accent: 'text-sky-300',
    border: 'hover:border-sky-300/30',
    panel: 'border-sky-300/15 bg-[linear-gradient(145deg,rgba(14,165,233,.11),rgba(37,99,235,.05)_50%,rgba(255,255,255,.015))]',
    title: 'Kart türü, limit ve dijital ürün uygunluğunu doğrulayın',
    description: 'Kredi kartı veya sanal kartla yapılan işlemlerde internet alışverişi ayarı, kullanılabilir limit, satıcı ve ürün koşullarını satın alma öncesinde kontrol edin.',
    routes: [
      ['Başlangıç', 'Sanal kart güvenliğini öğrenin', 'Limit yönetimi, kart bilgisi güvenliği ve işlem sonrası kontrolleri inceleyin.', '/bilgi-merkezi/sanal-kart-guvenli-mi'],
      ['Ürün seçimi', 'Dijital kod rehberlerini açın', 'Razer Gold, Apple Gift Card ve Steam ürünlerinin bölge ve para birimi farklarını öğrenin.', '/bilgi-merkezi?category=Dijital%20Kod'],
      ['Hızlı hesaplama', 'Tahmini karşılığı görün', 'İşlem tutarını girerek güncel taban oranına göre yaklaşık sonucu hesaplayın.', '/oran-hesapla?service=kredi-karti-sanal-kart'],
    ],
    controls: [
      ['Kart sahipliği', 'Yalnızca size ait ve kullanım yetkiniz bulunan kartla işlem yapın.'],
      ['İnternet alışverişi', 'Kartın internet alışverişine açık ve kullanılabilir limitinin yeterli olduğunu kontrol edin.'],
      ['Satıcı ve ürün', 'Ürün bölgesi, para birimi, teslimat türü ve satıcı bilgilerini ödeme öncesinde doğrulayın.'],
      ['Kart bilgisi güvenliği', 'Kart numarası, CVV ve doğrulama kodunu mesajla veya ekran görüntüsüyle paylaşmayın.'],
    ],
    issues: [
      ['Ödeme reddediliyor', 'Kart ayarları, limit, 3D Secure ve satıcı uyumunu kontrol edin.', '/bilgi-merkezi/sanal-kart-guvenli-mi'],
      ['Ödeme beklemede', 'Provizyon kaydını inceleyin ve aynı işlemi hemen tekrarlamayın.', '/bilgi-merkezi/sorun-cozme/odeme-beklemede-kaldi'],
      ['Kod teslim edilmedi', 'Sipariş ve dijital teslimat durumunu satıcı panelinden kontrol edin.', '/bilgi-merkezi/sorun-cozme/dijital-kod-teslim-edilmedi'],
    ],
  },
} as const;

export default function CardSmsPremiumSections({ mode }: { mode: Mode }) {
  const item = data[mode];
  return (
    <>
      <section className="content-shell pb-16">
        <div className="mb-7 max-w-3xl">
          <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${item.accent}`}>{item.label} işlem rotası</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{item.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {item.routes.map(([eyebrow, title, description, href], index) => (
            <Link key={title} href={href} className={`premium-card group focus-ring p-6 transition duration-300 hover:-translate-y-1 ${item.border}`}>
              <span className={`text-[10px] font-black uppercase tracking-[0.16em] ${item.accent}`}>0{index + 1} · {eyebrow}</span>
              <h3 className="mt-4 text-xl font-black tracking-tight">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
              <span className={`mt-6 inline-flex items-center gap-2 text-xs font-extrabold ${item.accent}`}>Devam edin <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-shell pb-16">
        <div className={`overflow-hidden rounded-[28px] border ${item.panel}`}>
          <div className="grid lg:grid-cols-[.82fr_1.18fr]">
            <div className="border-b border-white/8 p-7 sm:p-9 lg:border-b-0 lg:border-r">
              <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${item.accent}`}>İşlem öncesi kontrol</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">Dört kritik noktayı netleştirin</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">İşlemi başlatmadan önce sahiplik, limit, ürün ve güvenlik kontrollerini tamamlayın.</p>
              <Link href="/guven-merkezi" className={`focus-ring mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-extrabold text-slate-200 ${item.border}`}>Güven merkezini açın</Link>
            </div>
            <div className="grid sm:grid-cols-2">
              {item.controls.map(([title, text], index) => (
                <article key={title} className={`p-6 sm:p-7 ${index % 2 === 0 ? 'sm:border-r sm:border-white/8' : ''} ${index < 2 ? 'border-b border-white/8' : ''}`}>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-black ${item.accent}`}>{index + 1}</span>
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
          <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${item.accent}`}>Hızlı sorun çözme</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">En sık yaşanan {item.label} sorunları</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {item.issues.map(([title, text, href]) => (
            <Link key={title} href={href} className={`premium-card group focus-ring p-6 ${item.border}`}>
              <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{text}</p></div><span aria-hidden="true" className={`mt-1 transition-transform group-hover:translate-x-1 ${item.accent}`}>→</span></div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
