import Link from 'next/link';

const safeItems = [
  { number: '01', title: 'İşlem türü', text: 'Mobil ödeme, Paycell, Pokus, Razer Gold veya destek almak istediğiniz hizmet.' },
  { number: '02', title: 'Yaklaşık tutar', text: 'Değerlendirmek istediğiniz miktar ve varsa ilgili para birimi.' },
];
const neverShare = ['Hesap veya uygulama şifresi', 'SMS doğrulama kodu', 'Kart PIN’i, CVV veya erişim bilgisi'];

export default function ContactConfidence() {
  return (
    <section id="iletisim-guvenlik" className="contact-confidence contact-confidence--258 contact-confidence--260 scroll-mt-32" aria-label="Güvenli iletişim ve veri paylaşımı standardı">
      <article className="contact-confidence-main contact-confidence-main--258 contact-confidence-main--260">
        <div className="contact-confidence-docline contact-confidence-docline--258" aria-hidden="true"><span>SKY BOZUM · VERİ PAYLAŞIM STANDARDI</span><b>İLK TEMAS / SEVİYE 01</b></div>
        <div className="contact-confidence-seal contact-confidence-seal--258" aria-hidden="true"><span>SB</span><small>SINIRLI VERİ</small></div>
        <div>
          <p className="contact-eyebrow">Ön değerlendirme</p>
          <h2>Güvenli iletişim, az veriyle başlar.</h2>
          <p className="contact-confidence-lead">Ön değerlendirme için işlem türü ve yaklaşık tutar çoğu durumda yeterlidir. Hesaba, karta veya uygulamaya erişim sağlayan bilgiler iletişim kapsamı dışındadır.</p>
        </div>
        <div className="contact-info-list contact-info-list--258">
          {safeItems.map((item) => (
            <div key={item.number} className="contact-info-item contact-info-item--258">
              <span className="contact-info-mark">{item.number}</span>
              <div><strong>{item.title}</strong><span>{item.text}</span></div>
            </div>
          ))}
        </div>
        <div className="contact-data-clearance contact-data-clearance--258" aria-label="İlk temas veri seviyesi">
          <span>PAYLAŞIM KAPSAMI</span><b>YALNIZCA ÖN DEĞERLENDİRME BİLGİSİ</b>
        </div>
        <Link href="/bilgi-merkezi/sky-bozum-iletisim-rehberi" className="focus-ring mt-5 inline-flex items-center gap-2 text-xs font-black text-rose-300 transition hover:text-white">Güvenli iletişim rehberini aç <span aria-hidden="true">→</span></Link>
      </article>

      <aside className="contact-confidence-redline contact-confidence-redline--258 contact-confidence-redline--260">
        <div className="contact-redline-head contact-redline-head--258"><span>ERİŞİM VERİSİ SINIRI</span><b>HASSAS VERİ / KAPSAM DIŞI</b></div>
        <p className="contact-eyebrow">Asla paylaşmayın</p>
        <h3>Erişim sağlayan hassas bilgiler hiçbir iletişim adımının parçası değildir.</h3>
        <p className="contact-redline-copy--258">Aşağıdaki bilgiler talep edilirse görüşmeyi ilerletmeyin ve yalnızca bu sayfadaki resmî kanallardan yeniden teyit alın.</p>
        <div className="contact-danger-list contact-danger-list--258">
          {neverShare.map((item, index) => <div key={item} className="contact-danger-item"><i aria-hidden="true">{String(index + 1).padStart(2, '0')}</i><span>{item}</span><b aria-hidden="true">×</b></div>)}
        </div>
        <div className="contact-redline-rule contact-redline-rule--258"><span>ŞÜPHELİ TALEPTE</span><p>Görüşmeyi sonlandırın. Bu sayfayı yeniden açın ve resmî iletişim noktasından teyit alın.</p></div>
        <Link href="/guven-merkezi#sorun-cozucu" className="focus-ring mt-5 inline-flex items-center gap-2 text-xs font-black text-rose-200 transition hover:text-white">Şüpheli durumu kontrol et <span aria-hidden="true">→</span></Link>
      </aside>
    </section>
  );
}
