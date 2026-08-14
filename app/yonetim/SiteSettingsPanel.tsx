"use client";

import { useEffect, useState } from 'react';
import { getDoc } from 'firebase/firestore';
import { defaultSiteSettings, saveSiteSettings, siteSettingsRef, type SiteSettings } from '../lib/siteSettings';
import type { Firestore } from 'firebase/firestore';

const editableFields: { key: keyof SiteSettings; label: string; hint: string; multiline?: boolean }[] = [
  { key: 'brandName', label: 'Marka adı', hint: 'Başlık ve ortak marka alanlarında görünür.' },
  { key: 'brandTagline', label: 'Marka açıklaması', hint: 'Kısa, tek cümlelik marka vaadi.' },
  { key: 'footerDescription', label: 'Altbilgi açıklaması', hint: 'Sayfanın altındaki kurumsal açıklama.', multiline: true },
  { key: 'phone', label: 'Telefon', hint: 'Telefon ve iletişim kartlarında kullanılır.' },
  { key: 'email', label: 'E-posta', hint: 'E-posta bağlantılarında kullanılır.' },
  { key: 'whatsapp', label: 'WhatsApp bağlantısı', hint: 'https://wa.me/... biçiminde tam bağlantı.' },
  { key: 'liveSupportLabel', label: 'Destek düğmesi metni', hint: 'Ortak destek düğmesinin metni.' },
  { key: 'supportHours', label: 'Destek saatleri', hint: 'Örn. Her gün 09:00 - 00:00' },
  { key: 'defaultSeoTitle', label: 'Varsayılan SEO başlığı', hint: 'Özel başlığı olmayan sayfalar için.' },
  { key: 'defaultSeoDescription', label: 'Varsayılan SEO açıklaması', hint: 'Özel açıklaması olmayan sayfalar için.', multiline: true },
  { key: 'heroEyebrow', label: 'Ana sayfa üst bilgi', hint: 'İlk ekranda başlığın üzerinde görünür.' },
  { key: 'heroTitle', label: 'Ana sayfa başlığı', hint: 'İlk ekranın ana mesajı.', multiline: true },
  { key: 'heroLead', label: 'Ana sayfa açıklaması', hint: 'Başlığın altında görünen açıklama.', multiline: true },
  { key: 'heroPrimaryCta', label: 'Ana sayfa ana düğmesi', hint: 'WhatsApp yönlendirme düğmesinin metni.' },
  { key: 'proofExperience', label: 'Deneyim göstergesi', hint: 'Örn. 10 yıl' },
  { key: 'proofTransactions', label: 'İşlem göstergesi', hint: 'Örn. 10.000+' },
  { key: 'announcementText', label: 'Duyuru metni', hint: 'Tüm sitede gösterilecek kısa duyuru.' },
  { key: 'announcementHref', label: 'Duyuru bağlantısı', hint: 'Örn. /bilgi-merkezi veya tam bir HTTPS bağlantısı.' },
];

export default function SiteSettingsPanel({ db, actorId }: { db: Firestore | null; actorId: string }) {
  const [form, setForm] = useState<SiteSettings>(defaultSiteSettings);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    getDoc(siteSettingsRef(db)).then((snapshot) => {
      setForm({ ...defaultSiteSettings, ...(snapshot.data() as Partial<SiteSettings> | undefined) });
    }).finally(() => setLoading(false));
  }, [db]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!db) return;
    setStatus('Kaydediliyor...');
    try {
      await saveSiteSettings(db, form, actorId);
      setStatus('Site ayarları kaydedildi. Ortak alanlar yenilendiğinde güncel değerleri kullanır.');
    } catch {
      setStatus('Ayarlar kaydedilemedi. Yetki ve bağlantı durumunu kontrol edin.');
    }
  }

  return <section className="admin-section">
    <div className="admin-section-head">
      <div><span>SİTE AYARLARI</span><h2>Ortak alanları yönet</h2></div>
      <p>Marka, iletişim, destek ve varsayılan SEO bilgileri tek merkezden güncellenir. Değişiklikler statik yedek değerleri bozmaz.</p>
    </div>
    <form className="admin-settings-form" onSubmit={submit}>
      <label className="admin-settings-toggle"><input type="checkbox" checked={form.announcementEnabled} onChange={(event) => setForm((current) => ({ ...current, announcementEnabled: event.target.checked }))} /><span>Duyuru bandını yayınla</span><small>Metin boşsa veya kapalıysa ziyaretçiye gösterilmez.</small></label>
      {editableFields.map(({ key, label, hint, multiline }) => <label key={key}>
        <span>{label}</span>
        {multiline ? <textarea value={String(form[key] ?? '')} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} maxLength={300} rows={3} required /> : <input value={String(form[key] ?? '')} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} maxLength={180} required />}
        <small>{hint}</small>
      </label>)}
      <button className="admin-primary" type="submit" disabled={loading || !db}>Site ayarlarını kaydet <span>→</span></button>
      {status && <p className="admin-success">{status}</p>}
    </form>
  </section>;
}
