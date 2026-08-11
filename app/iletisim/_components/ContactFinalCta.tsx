type ContactFinalCtaProps = { whatsappHref: string };

export default function ContactFinalCta({ whatsappHref }: ContactFinalCtaProps) {
  return (
    <section id="iletisim-resmi-kanal" className="contact-final contact-final--258 contact-final--260 contact-final--268 scroll-mt-32" aria-labelledby="contact-final-cta-title">
      <div className="contact-final-metal contact-final-metal--258 contact-final-metal--260 contact-final-metal--268" aria-hidden="true"><span>SKY BOZUM · ÖZEL MÜŞTERİ İLİŞKİLERİ</span><b>RESMÎ TEMAS NOKTASI</b></div>
      <div className="contact-final-inner contact-final-inner--258 contact-final-inner--260 contact-final-inner--268">
        <div className="contact-final-copy contact-final-copy--258 contact-final-copy--260">
          <p className="contact-eyebrow">Son kontrol noktası</p>
          <h2 id="contact-final-cta-title">Talebiniz hazırsa,<br /><strong>doğru kanaldan başlayın.</strong></h2>
          <p>Yönlendiricide talep türünüzü seçin veya doğrudan resmî müşteri masasına geçin. Her iki akışta da minimum veri ve açık teyit standardı korunur.</p>
          <div className="contact-final-principles contact-final-principles--258 contact-final-principles--260" aria-label="Sky Bozum iletişim prensipleri">
            <span><i aria-hidden="true" /> Doğrulanmış erişim</span>
            <span><i aria-hidden="true" /> İşlem öncesi teyit</span>
            <span><i aria-hidden="true" /> Sınırlı veri paylaşımı</span>
          </div>
        </div>
        <div className="contact-final-side contact-final-side--258 contact-final-side--260 contact-final-side--268">
          <div className="contact-final-credential contact-final-credential--258 contact-final-credential--260"><span>İKİ GÜVENLİ BAŞLANGIÇ</span><b>YÖNLENDİRİCİ / RESMÎ WHATSAPP</b></div>
          <div className="contact-final-actions--268">
            <a href="#iletisim-yonlendirici" className="contact-final-action contact-final-action--secondary-268 focus-ring"><span>Talebimi yönlendir</span><b aria-hidden="true">↑</b></a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="contact-final-action contact-final-action--258 contact-final-action--260 focus-ring" aria-label="Resmi WhatsApp müşteri masasını yeni sekmede aç"><span>WhatsApp müşteri masası</span><b aria-hidden="true">↗</b></a>
          </div>
          <small>Şifre, PIN, CVV ve SMS doğrulama kodu hiçbir aşamada talep edilmez.</small>
        </div>
      </div>
      <div className="contact-final-signature contact-final-signature--258 contact-final-signature--260" aria-hidden="true"><span>SKY BOZUM İLETİŞİM STANDARDI</span><b>NETLİK · TEYİT · VERİ DİSİPLİNİ</b></div>
    </section>
  );
}
