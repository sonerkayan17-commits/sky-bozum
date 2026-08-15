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

const searchActions: Array<{
  label: string;
  hint: string;
  enabled: keyof SiteSettings;
  title: keyof SiteSettings;
  description: keyof SiteSettings;
  href: keyof SiteSettings;
}> = [
  { label: 'Oran hesapla', hint: 'Hesaplama aracına veya istediğiniz başka bir sayfaya yönlendirin.', enabled: 'searchQuickActionRateEnabled', title: 'searchQuickActionRateTitle', description: 'searchQuickActionRateDescription', href: 'searchQuickActionRateHref' },
  { label: 'Tüm hizmetler', hint: 'Hizmet kataloğu ya da seçtiğiniz özel bir sayfa için.', enabled: 'searchQuickActionServicesEnabled', title: 'searchQuickActionServicesTitle', description: 'searchQuickActionServicesDescription', href: 'searchQuickActionServicesHref' },
  { label: 'Güvenlik kontrolü', hint: 'Güven Merkezi veya farklı bir bilgilendirme sayfası için.', enabled: 'searchQuickActionTrustEnabled', title: 'searchQuickActionTrustTitle', description: 'searchQuickActionTrustDescription', href: 'searchQuickActionTrustHref' },
  { label: 'Destek ve iletişim', hint: 'İletişim sayfası, WhatsApp veya destek akışı için.', enabled: 'searchQuickActionSupportEnabled', title: 'searchQuickActionSupportTitle', description: 'searchQuickActionSupportDescription', href: 'searchQuickActionSupportHref' },
];

export default function SiteSettingsPanel({ db, actorId }: { db: Firestore | null; actorId: string }) {
  const [form, setForm] = useState<SiteSettings>(defaultSiteSettings);
  const [savedForm, setSavedForm] = useState<SiteSettings | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const hasUnsavedChanges = savedForm !== null && JSON.stringify(form) !== JSON.stringify(savedForm);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    getDoc(siteSettingsRef(db)).then((snapshot) => {
      const next = { ...defaultSiteSettings, ...(snapshot.data() as Partial<SiteSettings> | undefined) };
      setForm(next);
      setSavedForm(next);
    }).finally(() => setLoading(false));
  }, [db]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const warnBeforeAdminNavigation = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('.admin-nav button')) return;
      if (window.confirm('Kaydedilmemiş site ayarları var. Kaydetmeden bu bölümden ayrılmak istiyor musunuz?')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    document.addEventListener('click', warnBeforeAdminNavigation, true);
    return () => {
      window.removeEventListener('beforeunload', warnBeforeUnload);
      document.removeEventListener('click', warnBeforeAdminNavigation, true);
    };
  }, [hasUnsavedChanges]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!db) return;
    setSaving(true);
    setStatus('Kaydediliyor...');
    try {
      await saveSiteSettings(db, form, actorId);
      setSavedForm(form);
      setStatus('Site ayarları kaydedildi. Ortak alanlar yenilendiğinde güncel değerleri kullanır.');
    } catch {
      setStatus('Ayarlar kaydedilemedi. Yetki ve bağlantı durumunu kontrol edin.');
    } finally {
      setSaving(false);
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
      <fieldset className="admin-settings-group">
        <legend>Site genelinde arama ve hızlı erişim</legend>
        <p>Üstteki arama alanında görünen metinleri, yönlendirmeleri ve hangi kısayolların yayınlanacağını buradan yönetebilirsiniz.</p>
        <div className="admin-settings-group-grid">
          <label>
            <span>Arama kutusu yer tutucusu</span>
            <input value={form.searchPlaceholder} onChange={(event) => setForm((current) => ({ ...current, searchPlaceholder: event.target.value }))} maxLength={120} required />
            <small>Ziyaretçi yazmadan önce arama kutusunda görünür.</small>
          </label>
          <label>
            <span>Hızlı erişim başlığı</span>
            <input value={form.searchQuickAccessTitle} onChange={(event) => setForm((current) => ({ ...current, searchQuickAccessTitle: event.target.value }))} maxLength={80} required />
            <small>Arama ilk açıldığında üst başlık olarak kullanılır.</small>
          </label>
          <label>
            <span>Kaldığınız yerden başlığı</span>
            <input value={form.searchContinueTitle} onChange={(event) => setForm((current) => ({ ...current, searchContinueTitle: event.target.value }))} maxLength={80} required />
            <small>Son bakılan içerikler bölümü için kullanılır.</small>
          </label>
          <label>
            <span>Öne çıkanlar başlığı</span>
            <input value={form.searchFeaturedTitle} onChange={(event) => setForm((current) => ({ ...current, searchFeaturedTitle: event.target.value }))} maxLength={80} required />
            <small>Sabit rehber önerilerinin başlığıdır.</small>
          </label>
        </div>
        <label className="admin-settings-toggle"><input type="checkbox" checked={form.searchRecentEnabled} onChange={(event) => setForm((current) => ({ ...current, searchRecentEnabled: event.target.checked }))} /><span>Son bakılanlar bölümünü yayınla</span><small>Yalnız kişiselleştirme tercihini kabul eden ziyaretçilerde, bu cihazdaki gerçek geçmiş gösterilir.</small></label>
        <div className="admin-search-action-list">
          {searchActions.map((action) => <article key={String(action.enabled)}>
            <label className="admin-settings-toggle"><input type="checkbox" checked={Boolean(form[action.enabled])} onChange={(event) => setForm((current) => ({ ...current, [action.enabled]: event.target.checked }))} /><span>{action.label} kısayolunu yayınla</span><small>{action.hint}</small></label>
            <div>
              <label><span>Başlık</span><input value={String(form[action.title])} onChange={(event) => setForm((current) => ({ ...current, [action.title]: event.target.value }))} maxLength={80} required /></label>
              <label><span>Açıklama</span><input value={String(form[action.description])} onChange={(event) => setForm((current) => ({ ...current, [action.description]: event.target.value }))} maxLength={180} required /></label>
              <label><span>Bağlantı</span><input value={String(form[action.href])} onChange={(event) => setForm((current) => ({ ...current, [action.href]: event.target.value }))} maxLength={220} required /></label>
            </div>
          </article>)}
        </div>
      </fieldset>
      <fieldset className="admin-settings-group">
        <legend>Üye alanları</legend>
        <p>Üye menüsündeki kayıtlı içerikler bağlantısının metnini güncelleyebilirsiniz.</p>
        <label><span>Kayıtlı içerikler bağlantısı</span><input value={form.savedItemsLabel} onChange={(event) => setForm((current) => ({ ...current, savedItemsLabel: event.target.value }))} maxLength={80} required /><small>Hem masaüstü hem mobil üye menüsünde görünür.</small></label>
      </fieldset>
      {hasUnsavedChanges && <p className="admin-error admin-notice" role="status">Kaydedilmemiş değişiklikler var. Bölüm değiştirir veya sayfayı kapatırsanız önce onay istenir.</p>}
      <button className="admin-primary" type="submit" disabled={loading || saving || !db}>{saving ? 'Kaydediliyor…' : <>Site ayarlarını kaydet <span>→</span></>}</button>
      {status && <p className="admin-success">{status}</p>}
    </form>
  </section>;
}
