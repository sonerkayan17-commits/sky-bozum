'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { contactFaqItems } from '../contactData';

export default function ContactFaqPreview() {
  const [openIndex, setOpenIndex] = useState(0);
  const faqId = useId();

  return (
    <section id="iletisim-sss" className="contact-faq-wrap contact-faq-wrap--256 contact-faq-wrap--259 contact-faq-wrap--260 scroll-mt-32" aria-labelledby="contact-faq-title">
      <aside className="contact-faq-side contact-faq-side--256 contact-faq-side--259 contact-faq-side--260">
        <div className="contact-faq-briefmark contact-faq-briefmark--259 contact-faq-briefmark--260" aria-hidden="true"><span>SB</span><b>KISA BRİFİNG</b></div>
        <p className="contact-eyebrow">İşlem öncesi bilgi</p>
        <h2 id="contact-faq-title" className="contact-section-title">İşlem öncesi temel çerçeve.</h2>
        <p className="contact-section-copy">Sık sorulan konuların kısa yanıtlarını önceden görün; müşteri masasında yalnızca talebinize özel detaylara odaklanın.</p>
        <div className="contact-faq-briefnote"><span>01</span><p>Güncel oran ve uygunluk işlem öncesinde teyit edilir.</p></div>
        <div className="contact-faq-briefnote"><span>02</span><p>Erişim sağlayan hesap veya kart bilgileri talep edilmez.</p></div>
        <Link href="/sss" className="contact-faq-link contact-faq-link--256 contact-faq-link--259 focus-ring">Tüm sık sorulan sorular <span aria-hidden="true">→</span></Link>
      </aside>

      <div className="contact-faq-list contact-faq-list--256 contact-faq-list--259 contact-faq-list--260">
        <div className="contact-faq-list-head contact-faq-list-head--259 contact-faq-list-head--260" aria-hidden="true"><span>HIZLI YANITLAR</span><b>SB / FAQ</b></div>
        {contactFaqItems.map((item, index) => {
          const isOpen = openIndex === index;
          const triggerId = `${faqId}-trigger-${index}`;
          const panelId = `${faqId}-panel-${index}`;
          return (
            <div key={item.question} className="contact-faq-item contact-faq-item--256 contact-faq-item--259 contact-faq-item--260">
              <button type="button" onClick={() => setOpenIndex(isOpen ? -1 : index)} id={triggerId} className="contact-faq-trigger contact-faq-trigger--256 contact-faq-trigger--259 contact-faq-trigger--260 focus-ring" aria-expanded={isOpen} aria-controls={panelId}>
                <span className="contact-faq-question-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="contact-faq-question-text">{item.question}</span>
                <span className="contact-faq-symbol" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              <div id={panelId} role="region" aria-labelledby={triggerId} hidden={!isOpen} className="contact-faq-panel--256 contact-faq-panel--259 contact-faq-panel--260"><p className="contact-faq-answer">{item.answer}</p></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
