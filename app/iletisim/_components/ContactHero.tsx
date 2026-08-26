import Link from 'next/link';
import Image from 'next/image';

type ContactHeroProps = { whatsappHref: string; email: string };

export default function ContactHero({ whatsappHref, email }: ContactHeroProps) {
  return (
    <section className="contact-hero contact-hero--263 contact-hero--268" aria-labelledby="contact-hero-title">
      <div className="contact-hero-aura" aria-hidden="true" />
      <div className="contact-hero-line" aria-hidden="true" />

      <div className="content-shell contact-hero-grid contact-hero-grid--263 contact-hero-grid--268">
        <div className="contact-hero-copy contact-hero-copy--263 contact-hero-copy--268">
          <div className="contact-kicker contact-kicker--263"><span>Sky Bozum</span><i aria-hidden="true" /> Müşteri İlişkileri</div>
          <h1 id="contact-hero-title" className="contact-title contact-title--263 contact-title--268">
            Doğru temas.<br /><strong>Güven veren başlangıç.</strong>
          </h1>
          <p className="contact-lead contact-lead--263">
            Talebinizi seçin. En doğru kanal ve güvenli başlangıç tek ekranda netleşsin.
          </p>

          <div className="contact-actions contact-actions--263">
            <a href="#iletisim-yonlendirici" className="contact-action-primary focus-ring">
              <span>Talebimi yönlendir</span><b aria-hidden="true">↓</b>
            </a>
            <Link href="/bilgi-merkezi/sky-bozum-iletisim-rehberi" className="contact-action-secondary focus-ring">
              <span>İletişim rehberi</span><b aria-hidden="true">→</b>
            </Link>
          </div>

          <div className="contact-hero-signature" aria-label="İletişim standardı"><span>01</span><b>Talebi seç</b><i /><span>02</span><b>Doğru kanala geç</b></div>
        </div>

        <figure className="contact-hero-brandmark" aria-label="Sky Bozum resmî marka işareti">
          <span className="contact-official-logo-crop">
            <Image src="/brands/sky-bozum/sky-bozum-official-transparent-v1.webp" alt="Sky Bozum resmî logosu" width={1254} height={1254} priority />
          </span>
        </figure>

        <aside className="contact-command-card contact-command-card--263 contact-command-card--268" aria-label="Sky Bozum kurumsal iletişim standardı">
          <div className="contact-command-topline contact-command-topline--269" aria-hidden="true"><span>SB / MÜŞTERİ İLİŞKİLERİ</span><b>İLETİŞİM ÇERÇEVESİ</b></div>
          <div className="contact-command-brand">
            <div className="contact-command-monogram" aria-hidden="true">SB</div>
            <div><span>Kurumsal müşteri ilişkileri</span><strong>Tek doğrulanmış temas merkezi</strong></div>
          </div>
          <div className="contact-command-statement contact-command-statement--263 contact-command-statement--268">
            <span>Doğrulanmış erişim noktası</span>
            <h2>Tek merkez.<br/>Kontrollü temas.</h2>
            <p>Resmî kanal ve minimum veri standardı.</p>
          </div>
          <dl className="contact-command-facts contact-command-facts--263 contact-command-facts--268">
            <div><dt>Resmî kayıt</dt><dd>{email}</dd></div>
            <div><dt>Güvenlik sınırı</dt><dd>Şifre ve doğrulama kodu istenmez</dd></div>
          </dl>
          <div className="contact-command-seal contact-command-seal--263 contact-command-seal--268"><i aria-hidden="true">✓</i><span><b>Doğrulanmış erişim</b><small>Yalnızca bu sayfadaki iletişim noktalarını esas alın.</small></span></div>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="contact-command-quietlink focus-ring">Resmî WhatsApp hattı <span aria-hidden="true">↗</span></a>
        </aside>
      </div>
    </section>
  );
}
