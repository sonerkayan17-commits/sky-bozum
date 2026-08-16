'use client';

import Link from './DeferredLink';
import { useState } from 'react';

const faqs = [
  { question: 'Mobil ödeme nedir?', answer: 'Mobil ödeme; dijital hizmet veya ürün bedelinin operatör hattı, dijital cüzdan ya da uygun ödeme altyapısı üzerinden karşılanmasını sağlayan yöntemdir. Kullanılabilir yöntem ve limit operatöre göre değişebilir.' },
  { question: 'Mobil ödeme bozum işlemi nasıl yapılır?', answer: 'Önce hizmet türü ve tutar paylaşılır. Güncel oran ile tahmini ödeme yazılı olarak iletilir. Kullanıcı onayından sonra gerekli kontrol adımlarına geçilir ve işlem tamamlandığında ödeme yapılır.' },
  { question: 'Bozum işlemi güvenli mi?', answer: 'Güvenli bir süreç için oran, yöntem ve ödeme tutarı işlemden önce yazılı teyit edilmelidir. Şifre, kart şifresi ve SMS doğrulama kodu paylaşılmamalıdır. Sky Bozum bu bilgileri talep etmez.' },
  { question: 'Ödeme ne zaman gelir?', answer: 'Ödeme süresi hizmet türüne, doğrulama adımlarına ve işlem yoğunluğuna göre değişebilir. Kontrol tamamlandığında ödeme aşamasına geçilir ve güncel durum kullanıcıya yazılı olarak bildirilir.' },
  { question: 'Hangi hizmetler destekleniyor?', answer: 'Vodafone, Turkcell, Türk Telekom mobil ödeme; Paycell, Pokus; Razer Gold, Apple/iTunes ve Steam gibi dijital bakiye ve kod hizmetleri desteklenmektedir. Güncel kapsam hizmetler sayfasında yer alır.' },
] as const;

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState(0);
  return <div className="home-faq-card premium-card flex h-full flex-col p-6 sm:p-8" aria-labelledby="home-faq-title"><div className="flex items-start justify-between gap-4"><div><p className="home-faq-kicker">Bozum hakkında</p><h2 id="home-faq-title">Sık Sorulan Sorular</h2><p className="home-faq-intro">Mobil ödeme ve güvenli bozum hakkında temel sorular.</p></div><span className="home-faq-count">5 konu</span></div><div className="home-faq-list">{faqs.map((item,index)=>{const isOpen=openIndex===index;return <div key={item.question} className={`home-faq-item ${isOpen?'is-open':''}`}><button type="button" className="home-faq-question focus-ring" onClick={()=>setOpenIndex(isOpen?-1:index)} aria-expanded={isOpen}><span>{item.question}</span><span className="home-faq-toggle" aria-hidden="true">+</span></button><div className="home-faq-answer" aria-hidden={!isOpen}><p>{item.answer}</p></div></div>})}</div><div className="home-faq-links"><Link href="/sss" className="home-faq-primary-link">Tüm soruları inceleyin <span aria-hidden="true">→</span></Link><Link href="/gizlilik-politikasi">Gizlilik Politikası</Link><Link href="/kullanim-sartlari">Kullanım Şartları</Link></div></div>;
}
