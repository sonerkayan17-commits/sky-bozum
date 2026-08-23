import Link from 'next/link';

const steps = [
  { number: '01', title: 'Amacınızı belirtin', text: 'Talep türünü seçin; ilk temas için yalnızca gerekli başlangıç bilgisini hazırlayın.', href: '#iletisim-yonlendirici', action: 'Talep türünü seç' },
  { number: '02', title: 'Koşulları netleştirin', text: 'Oran, uygunluk ve izlenecek adım ilerlemeden önce açık biçimde teyit edilir.', href: '/araclar', action: 'Yaklaşık sonucu gör' },
  { number: '03', title: 'Onayınızla ilerleyin', text: 'Yalnızca açıkça teyit ettiğiniz akışta devam edin; kanal değişirse yeniden doğrulama alın.', href: '/iletisim#guvenlik', action: 'Güvenlik kontrolünü aç' },
];

export default function ContactProcess() {
  return (
    <section className="contact-protocol contact-protocol--255 contact-protocol--257 contact-protocol--259" aria-labelledby="contact-process-title">
      <div className="contact-protocol-header contact-protocol-header--255 contact-protocol-header--257 contact-protocol-header--259">
        <div>
          <p className="contact-eyebrow">İşlem akışı</p>
          <h2 id="contact-process-title">Kısa akış. Açık teyit.</h2>
        </div>
        <p>Her adımın amacı belli: önce talep, sonra koşullar, ardından yalnızca açık onayınızla ilerleme.</p>
      </div>

      <ol className="contact-protocol-grid contact-protocol-grid--255 contact-protocol-grid--257 contact-protocol-grid--259">
        {steps.map((step) => (
          <li key={step.number} className="contact-protocol-step contact-protocol-step--255 contact-protocol-step--257 contact-protocol-step--259">
            <span className="contact-protocol-number">{step.number}</span>
            <div><h3>{step.title}</h3><p>{step.text}</p><Link href={step.href} className="focus-ring mt-5 inline-flex items-center gap-2 text-xs font-black text-rose-300 transition hover:text-white">{step.action} <span aria-hidden="true">→</span></Link></div>
          </li>
        ))}
      </ol>

      <div className="contact-protocol-security contact-protocol-security--255 contact-protocol-security--257 contact-protocol-security--259">
        <span aria-hidden="true">GÜVENLİK NOTU</span>
        <p><strong>Şifre, PIN, CVV veya SMS doğrulama kodu</strong> iletişim sürecinin hiçbir aşamasında talep edilmez.</p>
      </div>
    </section>
  );
}
