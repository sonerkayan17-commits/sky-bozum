'use client';

import { useState } from 'react';
import Link from './DeferredLink';
import { homeFaqs } from '../lib/homeFaqs';

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div className="home-faq-card premium-card flex h-full flex-col p-6 sm:p-8" aria-labelledby="home-faq-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="home-faq-kicker">Mobil ödeme rehberi</p>
          <h2 id="home-faq-title">Sık Sorulan Sorular</h2>
          <p className="home-faq-intro">Mobil ödeme, operatör limitleri, dijital kod alımı ve güvenlik hakkında açık yanıtlar.</p>
        </div>
        <span className="home-faq-count">{homeFaqs.length} soru</span>
      </div>

      <div className="home-faq-list">
        {homeFaqs.map((item, index) => {
          const isOpen = openIndex === index;
          const answerId = `home-faq-answer-${index}`;
          return (
            <div key={item.question} className={`home-faq-item ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="home-faq-question focus-ring"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                aria-controls={answerId}
              >
                <span>{item.question}</span>
                <span className="home-faq-toggle" aria-hidden="true">+</span>
              </button>
              <div id={answerId} className="home-faq-answer" aria-hidden={!isOpen}>
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="home-faq-links">
        <Link href="/sss" className="home-faq-primary-link">Tüm soruları inceleyin <span aria-hidden="true">→</span></Link>
        <Link href="/bilgi-merkezi/guvenilir-mobil-bozum-sitesi-nasil-secilir">Güvenlik rehberi</Link>
        <Link href="/kullanim-sartlari">Kullanım şartları</Link>
      </div>
    </div>
  );
}
