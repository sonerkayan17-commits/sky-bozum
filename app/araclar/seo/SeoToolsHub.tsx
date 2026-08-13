'use client';
/* eslint-disable react/no-unescaped-entities */

import { useMemo, useState } from 'react';

type ToolId = 'text' | 'meta' | 'keywords' | 'content' | 'url' | 'faq' | 'utm' | 'reading';
const tools: Array<[ToolId, string, string]> = [
  ['text', 'Metin düzeltici', 'Yazım, boşluk ve noktalama'],
  ['meta', 'Meta önizleyici', 'Başlık ve açıklama'],
  ['keywords', 'Kelime analizi', 'Kullanım ve yoğunluk'],
  ['content', 'İçerik kontrolü', 'Temel SEO kontrolü'],
  ['url', 'URL oluşturucu', 'Temiz bağlantı üret'],
  ['faq', 'FAQ Schema', 'JSON-LD oluştur'],
  ['utm', 'UTM bağlantısı', 'Kampanya linki üret'],
  ['reading', 'Okuma analizi', 'Kelime ve süre'],
];

function cleanText(value: string) {
  let next = value.replace(/[ \t]+/g, ' ').replace(/\s+([,.!?;:])/g, '$1').replace(/([,.!?;:])(?=\S)/g, '$1 ');
  next = next.replace(/([.!?])\s*([a-zçğıöşü])/g, (_, mark, letter) => `${mark} ${letter.toLocaleUpperCase('tr-TR')}`);
  next = next.replace(/(^|\n)\s*([a-zçğıöşü])/g, (_, prefix, letter) => `${prefix}${letter.toLocaleUpperCase('tr-TR')}`);
  return next.trim();
}

function slugify(value: string) { return value.toLocaleLowerCase('tr-TR').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

export default function SeoToolsHub() {
  const [active, setActive] = useState<ToolId>('text');
  const [text, setText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [faq, setFaq] = useState<Array<[string, string]>>([['', '']]);

  const words = useMemo(() => text.trim() ? text.trim().split(/\s+/).length : 0, [text]);
  const keywordCount = useMemo(() => keyword.trim() && text.trim() ? (text.toLocaleLowerCase('tr-TR').match(new RegExp(keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length : 0, [keyword, text]);
  const metaTitleOk = title.length >= 30 && title.length <= 60;
  const metaDescriptionOk = description.length >= 120 && description.length <= 160;
  const corrected = cleanText(text);
  const generatedUrl = `https://site-adresi.com/${slugify(urlTitle)}`;
  const utm = `${source || 'https://site-adresi.com'}${source.includes('?') ? '&' : '?'}utm_source=${encodeURIComponent(medium || 'google')}&utm_medium=${encodeURIComponent(medium || 'organic')}&utm_campaign=${encodeURIComponent(campaign || 'kampanya')}`;
  const faqJson = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.filter(([q, a]) => q.trim() && a.trim()).map(([q, a]) => ({ '@type': 'Question', name: q.trim(), acceptedAnswer: { '@type': 'Answer', text: a.trim() } })) }, null, 2);

  return <section className="seo-tools-hub" aria-labelledby="seo-tools-title">
    <header><span>SEO ARAÇLARI</span><h1 id="seo-tools-title">Metninizi ve sayfanızı daha anlaşılır hale getirin.</h1><p>Tek ekranda çalışan, hızlı ve ücretsiz içerik araçları. Sonuçlar tarayıcınızda hesaplanır.</p></header>
    <nav className="seo-tool-tabs" aria-label="SEO araçları">{tools.map(([id, label, note]) => <button key={id} type="button" className={active === id ? 'is-active' : ''} onClick={() => setActive(id)}>{label}<small>{note}</small></button>)}</nav>
    <div className="seo-tool-panel">
      {active === 'text' && <div className="seo-tool-grid"><div><label>Metninizi yazın<textarea value={text} onChange={e => setText(e.target.value)} placeholder="Düzeltilecek metni buraya yazın..." rows={12}/></label><div className="seo-tool-actions"><button type="button" onClick={() => setText(corrected)}>Metni düzelt</button><button type="button" className="secondary" onClick={() => setText('')}>Temizle</button></div></div><div className="seo-result"><span>YAPILAN KONTROLLER</span><h2>Düzeltilmiş metin</h2><p>Boşluklar, noktalama işaretleri ve cümle başlangıçları düzenlenir.</p><div className="seo-check-list"><b>✓ Fazla boşluk temizleme</b><b>✓ Noktalama boşlukları</b><b>✓ Cümle başlangıcı</b><b>✓ Kelime ve karakter sayımı</b></div><strong>{words} kelime · {text.length} karakter · yaklaşık {Math.max(1, Math.ceil(words / 200))} dk</strong></div></div>}
      {active === 'meta' && <div className="seo-tool-grid"><div className="seo-form-stack"><label>SEO başlığı<input value={title} onChange={e => setTitle(e.target.value)} placeholder="Örn. Razer Gold bozum rehberi"/><small>{title.length}/60 karakter · {metaTitleOk ? 'Uygun' : '30-60 karakter önerilir'}</small></label><label>Meta açıklaması<textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Sayfanızı kısa ve açık biçimde anlatın..." rows={5}/><small>{description.length}/160 karakter · {metaDescriptionOk ? 'Uygun' : '120-160 karakter önerilir'}</small></label></div><div className="snippet-preview"><span>GOOGLE ÖNİZLEME</span><b>{title || 'Sayfa başlığı burada görünür'}</b><em>site-adresi.com › sayfa</em><p>{description || 'Meta açıklamanız arama sonuçlarında burada görünür.'}</p></div></div>}
      {active === 'keywords' && <div className="seo-tool-grid"><div className="seo-form-stack"><label>İçerik<textarea value={text} onChange={e => setText(e.target.value)} rows={10} placeholder="Metni buraya yapıştırın..."/></label><label>Hedef kelime veya cümle<input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Örn. mobil ödeme bozum"/></label></div><div className="seo-result"><span>ANALİZ SONUCU</span><h2>{keywordCount} kullanım</h2><p>{words} kelimede yaklaşık %{words ? ((keywordCount * keyword.trim().split(/\s+/).length / words) * 100).toFixed(2) : '0'} yoğunluk.</p><div className="seo-check-list"><b>{text.toLocaleLowerCase('tr-TR').includes(keyword.toLocaleLowerCase('tr-TR')) ? '✓ Kelime içerikte bulunuyor' : '○ Kelime içerikte bulunamadı'}</b><b>{text.slice(0, 220).toLocaleLowerCase('tr-TR').includes(keyword.toLocaleLowerCase('tr-TR')) ? '✓ İlk bölümde geçiyor' : '○ İlk bölümde geçmiyor'}</b></div></div></div>}
      {active === 'content' && <div className="seo-tool-grid"><label>İçeriği kontrol et<textarea value={text} onChange={e => setText(e.target.value)} rows={12} placeholder="SEO kontrolü yapılacak içeriği yapıştırın..."/></label><div className="seo-result"><span>İÇERİK KONTROLÜ</span><h2>{words >= 300 ? 'Temel uzunluk uygun' : 'İçerik kısa olabilir'}</h2><div className="seo-check-list"><b>{text.includes('\n') ? '✓ Paragraf yapısı var' : '○ Paragrafları ayırmayı düşünün'}</b><b>{text.includes('##') || text.split('\n').some(line => line.length > 0 && line.length < 80) ? '✓ Alt başlık işareti bulundu' : '○ Alt başlık ekleyin'}</b><b>{/[.!?]/.test(text) ? '✓ Cümle yapısı kontrol edilebilir' : '○ Cümle ekleyin'}</b></div></div></div>}
      {active === 'url' && <div className="seo-single-tool"><label>Sayfa başlığı<input value={urlTitle} onChange={e => setUrlTitle(e.target.value)} placeholder="Örn. Mobil ödeme bozum nasıl yapılır?"/></label><div className="copy-result"><code>{generatedUrl}</code><button type="button" onClick={() => navigator.clipboard.writeText(generatedUrl)}>Kopyala</button></div></div>}
      {active === 'faq' && <div className="seo-single-tool"><div className="faq-rows">{faq.map(([q, a], index) => <div className="faq-row" key={index}><input value={q} onChange={e => setFaq(items => items.map((item, i) => i === index ? [e.target.value, item[1]] : item))} placeholder="Soru"/><textarea value={a} onChange={e => setFaq(items => items.map((item, i) => i === index ? [item[0], e.target.value] : item))} placeholder="Cevap" rows={3}/></div>)}</div><div className="seo-tool-actions"><button type="button" onClick={() => setFaq(items => [...items, ['', '']])}>Soru ekle</button><button type="button" className="secondary" onClick={() => navigator.clipboard.writeText(faqJson)}>JSON-LD kopyala</button></div><pre>{faqJson}</pre></div>}
      {active === 'utm' && <div className="seo-single-tool"><label>Sayfa URL'si<input value={source} onChange={e => setSource(e.target.value)} placeholder="https://site-adresi.com/sayfa"/></label><div className="seo-form-inline"><label>Kaynak<input value={medium} onChange={e => setMedium(e.target.value)} placeholder="google"/></label><label>Kampanya<input value={campaign} onChange={e => setCampaign(e.target.value)} placeholder="yaz-kampanyasi"/></label></div><div className="copy-result"><code>{utm}</code><button type="button" onClick={() => navigator.clipboard.writeText(utm)}>Kopyala</button></div></div>}
      {active === 'reading' && <div className="seo-result seo-result-wide"><span>OKUMA ANALİZİ</span><h2>{words} kelime</h2><p>Yaklaşık okuma süresi: {Math.max(1, Math.ceil(words / 200))} dakika</p><div className="seo-check-list"><b>Karakter: {text.length}</b><b>Cümle: {text.split(/[.!?]+/).filter(Boolean).length}</b><b>Paragraf: {text.split(/\n+/).filter(Boolean).length}</b></div></div>}
    </div>
  </section>;
}
