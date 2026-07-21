/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

type GroupId = 'all' | 'trade' | 'media' | 'corporate' | 'feedback';
type IconName = 'building' | 'coins' | 'briefcase' | 'globe' | 'megaphone' | 'handshake' | 'store' | 'office' | 'video' | 'document' | 'bulb';

type Category = {
  id: string;
  group: Exclude<GroupId, 'all'>;
  title: string;
  eyebrow: string;
  description: string;
  icon: IconName;
  accent: AccentName;
  fields: Array<{ label: string; name: string; placeholder: string; type?: string }>;
  note: string;
};

type AccentName = 'rose' | 'amber' | 'emerald' | 'sky' | 'violet';

type FormErrors = Record<string, string>;

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

type DraftEnvelope = {
  version: 1;
  savedAt: number;
  data: Record<string, string | boolean>;
};

const DRAFT_TTL_MS = 2 * 60 * 60 * 1000;


function normalizeTurkishMobile(value: string) {
  const digits = value.replace(/\D/g, '');
  if (/^5\d{9}$/.test(digits)) return `90${digits}`;
  if (/^05\d{9}$/.test(digits)) return `9${digits}`;
  if (/^905\d{9}$/.test(digits)) return digits;
  return null;
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname.includes('.') || url.hostname === 'localhost');
  } catch {
    return false;
  }
}

function getSafeNoticeUrl(value?: string) {
  if (!value) return undefined;
  const normalized = value.trim();
  if (/^\/(?!\/)/.test(normalized)) return normalized;
  return isValidHttpUrl(normalized) ? normalized : undefined;
}

function createIdempotencyKey() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `sky-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export type PartnershipSubmission = {
  applicationType: string;
  applicationTitle: string;
  fullName: string;
  phone: string;
  email?: string;
  company?: string;
  contactPreference: 'phone' | 'whatsapp' | 'email';
  message: string;
  details: Record<string, string>;
  sourcePath: '/is-ortakligi';
  submittedAt: string;
  consentVersion: '2026-07';
  idempotencyKey: string;
};

export type PartnershipSubmissionResult = {
  referenceId?: string;
};

export type PartnershipHubProps = {
  onSubmit?: (submission: PartnershipSubmission) => Promise<PartnershipSubmissionResult | void> | PartnershipSubmissionResult | void;
  unavailableMessage?: string;
  privacyNoticeUrl?: string;
};

const groupLabels: Record<Exclude<GroupId, 'all'>, string> = {
  trade: 'Ticari',
  media: 'Medya',
  corporate: 'Kurumsal',
  feedback: 'Geri bildirim',
};

const groups: Array<{ id: GroupId; label: string; count?: number }> = [
  { id: 'all', label: 'Tümü' },
  { id: 'trade', label: 'Ticari' },
  { id: 'media', label: 'Medya' },
  { id: 'corporate', label: 'Kurumsal' },
  { id: 'feedback', label: 'Geri bildirim' },
];

const categories: Category[] = [
  { id: 'seller', group: 'trade', title: 'Toplu Kod Satıcısı Ol', eyebrow: 'Tedarik', description: 'Düzenli ve yüksek hacimli dijital kod tedariği için kurumsal değerlendirme.', icon: 'building', accent: 'rose', fields: [{ label: 'Aylık tahmini hacim', name: 'monthlyVolume', placeholder: 'Örn. 100.000 TL' }, { label: 'Sunduğunuz kod türleri', name: 'codeTypes', placeholder: 'Razer Gold, Apple, Steam...' }], note: 'Tedarik kapasitesi, ürün kaynağı ve işlem düzeni ön değerlendirmede dikkate alınır.' },
  { id: 'buyer', group: 'trade', title: 'Toplu Kod Alıcısı Ol', eyebrow: 'Kurumsal alım', description: 'Toplu dijital kod ihtiyacınız için sürdürülebilir satın alma modeli oluşturun.', icon: 'coins', accent: 'amber', fields: [{ label: 'Talep edilen kod türleri', name: 'requestedCodes', placeholder: 'İhtiyaç duyduğunuz ürünler' }, { label: 'Aylık tahmini alım', name: 'estimatedPurchase', placeholder: 'Örn. 50.000 TL' }], note: 'Talep sıklığı, ürün grubu ve hacim bilgisi değerlendirme sürecini hızlandırır.' },
  { id: 'career', group: 'corporate', title: 'Bizimle Çalış', eyebrow: 'Kariyer', description: 'Yetkinliğinizi, çalışma alanınızı ve Sky Bozum’a katabileceğiniz değeri paylaşın.', icon: 'briefcase', accent: 'emerald', fields: [{ label: 'Uzmanlık alanınız', name: 'expertise', placeholder: 'Örn. müşteri destek, içerik, yazılım' }, { label: 'Portföy veya profil bağlantısı', name: 'portfolio', placeholder: 'https://...', type: 'url' }], note: 'Başvurular güncel ihtiyaçlar ve pozisyon uygunluğu doğrultusunda değerlendirilir.' },
  { id: 'publisher', group: 'media', title: 'Forum / Site Sahibi Başvurusu', eyebrow: 'Yayın ortaklığı', description: 'Topluluğunuz veya yayın kanalınız için uzun vadeli iş birliği fırsatlarını konuşalım.', icon: 'globe', accent: 'sky', fields: [{ label: 'Site / forum adresi', name: 'website', placeholder: 'https://...', type: 'url' }, { label: 'Aylık ziyaretçi veya üye sayısı', name: 'audienceSize', placeholder: 'Örn. 50.000 ziyaretçi' }], note: 'Trafik kaynağı, kitle profili ve yayın kalitesi değerlendirmede dikkate alınır.' },
  { id: 'advertise', group: 'media', title: 'Reklam Ver', eyebrow: 'Medya planlama', description: 'Sky Bozum kanallarında görünürlük ve hedefli tanıtım seçeneklerini değerlendirin.', icon: 'megaphone', accent: 'violet', fields: [{ label: 'Marka / ürün adı', name: 'brandName', placeholder: 'Tanıtılacak marka veya ürün' }, { label: 'Kampanya hedefi ve bütçe aralığı', name: 'campaignBudget', placeholder: 'Hedefinizi ve bütçe aralığını yazın' }], note: 'Yasal ve marka güvenliği kriterlerine uymayan reklam talepleri kabul edilmez.' },
  { id: 'general', group: 'trade', title: 'Genel İş Ortaklığı', eyebrow: 'Yeni fırsatlar', description: 'Mevcut kategorilere girmeyen iş birliği fikrinizi doğrudan paylaşın.', icon: 'handshake', accent: 'rose', fields: [{ label: 'İş birliği modeli', name: 'partnershipModel', placeholder: 'Teklif ettiğiniz modeli kısaca yazın' }, { label: 'Beklenen karşılıklı katkı', name: 'mutualValue', placeholder: 'Tarafların sağlayacağı katkı' }], note: 'Teklifin kapsamı, uygulanabilirliği ve karşılıklı faydası değerlendirilir.' },
  { id: 'dealer', group: 'corporate', title: 'Bayilik Başvurusu', eyebrow: 'Büyüme ağı', description: 'Sky Bozum hizmet standartlarını temsil edebilecek iş ortaklığı modelini keşfedin.', icon: 'store', accent: 'amber', fields: [{ label: 'Faaliyet gösterilen şehir', name: 'city', placeholder: 'Şehir / bölge' }, { label: 'Mevcut ticari yapı / deneyim', name: 'businessExperience', placeholder: 'Faaliyet alanınız ve deneyiminiz' }], note: 'Bayilik modeli, bölge ve operasyon uygunluğuna göre ayrıca değerlendirilir.' },
  { id: 'corporate', group: 'corporate', title: 'Kurumsal Firma Başvurusu', eyebrow: 'B2B çözümler', description: 'Şirketinize özel hacim, süreç ve operasyon ihtiyaçlarını birlikte planlayalım.', icon: 'office', accent: 'sky', fields: [{ label: 'Firma unvanı', name: 'legalName', placeholder: 'Resmî firma unvanı' }, { label: 'İhtiyaç ve tahmini işlem hacmi', name: 'corporateNeed', placeholder: 'İhtiyacınızı ve hacmi belirtin' }], note: 'Kurumsal taleplerde firma bilgileri ve yetkili kişi doğrulaması istenebilir.' },
  { id: 'influencer', group: 'media', title: 'Influencer / Yayıncı Başvurusu', eyebrow: 'İçerik ortaklığı', description: 'Topluluğunuzla güvenilir ve şeffaf bir marka iş birliği oluşturun.', icon: 'video', accent: 'violet', fields: [{ label: 'Yayın kanalı / profil bağlantısı', name: 'channel', placeholder: 'https://...', type: 'url' }, { label: 'Takipçi ve ortalama erişim', name: 'reach', placeholder: 'Takipçi ve ortalama görüntülenme' }], note: 'Kitle uyumu, içerik kalitesi ve etkileşim gerçekliği değerlendirilir.' },
  { id: 'complaint', group: 'feedback', title: 'Şikâyet Bildirimi', eyebrow: 'Çözüm merkezi', description: 'Yaşadığınız sorunu ayrıntılarıyla iletin; doğru ekibin incelemesini sağlayın.', icon: 'document', accent: 'rose', fields: [{ label: 'İşlem tarihi veya referansı', name: 'transactionReference', placeholder: 'Varsa tarih veya işlem referansı' }, { label: 'Sorunun konusu', name: 'issueSubject', placeholder: 'Sorunu tek cümleyle özetleyin' }], note: 'Şifre, kart PIN’i veya tek kullanımlık doğrulama kodu paylaşmayın.' },
  { id: 'suggestion', group: 'feedback', title: 'Öneri ve Geliştirme', eyebrow: 'Birlikte iyileştirelim', description: 'Hizmet, deneyim veya içerik geliştirme önerinizi doğrudan ekibimize ulaştırın.', icon: 'bulb', accent: 'emerald', fields: [{ label: 'Önerinin ilgili olduğu alan', name: 'suggestionArea', placeholder: 'Hizmet, site, içerik veya süreç' }, { label: 'Beklenen fayda veya çözüm', name: 'expectedBenefit', placeholder: 'Önerinizin sağlayacağı fayda' }], note: 'Uygulanabilir öneriler ürün, hizmet ve içerik planlamasında değerlendirilir.' },
];


const categoryChecklists: Record<string, string[]> = {
  seller: ['Satışını yaptığınız kod türleri', 'Aylık yaklaşık tedarik hacmi', 'Ürün kaynağı ve çalışma düzeni'],
  buyer: ['Talep ettiğiniz kod türleri', 'Aylık yaklaşık alım hacmi', 'Alım sıklığı ve teslim beklentisi'],
  career: ['Uzmanlık alanınız', 'Kısa deneyim özeti', 'Varsa portföy veya profil bağlantısı'],
  publisher: ['Site veya forum bağlantısı', 'Aylık ziyaretçi / üye bilgisi', 'Kitle profili ve iş birliği fikri'],
  advertise: ['Tanıtılacak marka veya ürün', 'Kampanya hedefi', 'Bütçe aralığı ve planlanan dönem'],
  general: ['Önerdiğiniz iş birliği modeli', 'Tarafların sağlayacağı katkı', 'Beklenen sonuç ve zamanlama'],
  dealer: ['Faaliyet gösterdiğiniz bölge', 'Mevcut ticari deneyiminiz', 'Operasyon ve müşteri kapasiteniz'],
  corporate: ['Resmî firma unvanı', 'Yetkili kişi bilgileri', 'İhtiyaç ve tahmini işlem hacmi'],
  influencer: ['Aktif yayın kanalı bağlantısı', 'Takipçi ve ortalama erişim', 'İçerik formatı ve iş birliği fikri'],
  complaint: ['İşlem tarihi veya referansı', 'Sorunun kısa özeti', 'Beklediğiniz çözüm'],
  suggestion: ['Önerinin ilgili olduğu alan', 'Mevcut durum veya ihtiyaç', 'Beklenen fayda'],
};

const accentStyles: Record<AccentName, { icon: string; badge: string; glow: string; border: string; active: string }> = {
  rose: { icon: 'text-rose-300 bg-rose-400/10 border-rose-300/20', badge: 'text-rose-300', glow: 'from-rose-500/16', border: 'hover:border-rose-300/35', active: 'border-rose-300/45 ring-1 ring-rose-300/15' },
  amber: { icon: 'text-[#f2c98a] bg-amber-300/[0.08] border-amber-200/20', badge: 'text-[#f2c98a]', glow: 'from-amber-300/14', border: 'hover:border-amber-200/30', active: 'border-amber-200/40 ring-1 ring-amber-200/12' },
  emerald: { icon: 'text-rose-200 bg-rose-400/[0.08] border-rose-200/18', badge: 'text-rose-200', glow: 'from-rose-500/12', border: 'hover:border-rose-200/28', active: 'border-rose-200/38 ring-1 ring-rose-200/10' },
  sky: { icon: 'text-[#edcf98] bg-amber-300/[0.07] border-amber-200/18', badge: 'text-[#edcf98]', glow: 'from-amber-300/12', border: 'hover:border-amber-200/28', active: 'border-amber-200/38 ring-1 ring-amber-200/10' },
  violet: { icon: 'text-rose-200 bg-rose-400/[0.08] border-rose-200/18', badge: 'text-rose-200', glow: 'from-rose-500/12', border: 'hover:border-rose-200/28', active: 'border-rose-200/38 ring-1 ring-rose-200/10' },
};

export default function PartnershipHub({
  onSubmit,
  unavailableMessage = 'Başvuru gönderimi şu anda aktif değil. Lütfen daha sonra tekrar deneyin veya mevcut iletişim kanallarımızı kullanın.',
  privacyNoticeUrl,
}: PartnershipHubProps) {
  const [selectedId, setSelectedId] = useState(categories[0].id);
  const [isHydrated, setIsHydrated] = useState(false);
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<GroupId>('all');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [messageLength, setMessageLength] = useState(0);
  const [referenceId, setReferenceId] = useState<string>();
  const [completion, setCompletion] = useState(0);
  const [remainingRequired, setRemainingRequired] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [contactPreference, setContactPreference] = useState<PartnershipSubmission['contactPreference']>('whatsapp');
  const [draftState, setDraftState] = useState<'idle' | 'saved' | 'restored'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idempotencyKeyRef = useRef(createIdempotencyKey());
  const submittedAtRef = useRef<string | null>(null);
  const submissionLockRef = useRef(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const selected = categories.find((item) => item.id === selectedId) ?? categories[0];
  const safePrivacyNoticeUrl = useMemo(() => getSafeNoticeUrl(privacyNoticeUrl), [privacyNoticeUrl]);
  const filtered = useMemo(() => {
    const value = query.trim().toLocaleLowerCase('tr-TR');
    return categories.filter((item) => {
      const matchesGroup = activeGroup === 'all' || item.group === activeGroup;
      const matchesSearch = !value || `${item.title} ${item.eyebrow} ${item.description}`.toLocaleLowerCase('tr-TR').includes(value);
      return matchesGroup && matchesSearch;
    });
  }, [activeGroup, query]);


  const draftKey = `sky-bozum-partnership-draft:${selected.id}`;

  useEffect(() => {
    setIsOnline(window.navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const hashId = window.location.hash.replace('#', '');
    if (categories.some((item) => item.id === hashId)) setSelectedId(hashId);
    setIsHydrated(true);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const nextUrl = `${window.location.pathname}${window.location.search}#${selected.id}`;
    window.history.replaceState(null, '', nextUrl);
  }, [isHydrated, selected.id]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const raw = window.sessionStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as DraftEnvelope | Record<string, string | boolean>;
      const envelope: DraftEnvelope = 'data' in parsed && 'savedAt' in parsed
        ? parsed as DraftEnvelope
        : { version: 1, savedAt: Date.now(), data: parsed as Record<string, string | boolean> };
      if (Date.now() - envelope.savedAt > DRAFT_TTL_MS) {
        window.sessionStorage.removeItem(draftKey);
        setDraftState('idle');
        return;
      }
      const draft = envelope.data;
      Object.entries(draft).forEach(([name, value]) => {
        const control = form.elements.namedItem(name);
        if (control instanceof RadioNodeList) {
          control.value = String(value);
          return;
        }
        if (control instanceof HTMLInputElement) {
          if (control.type === 'checkbox') control.checked = Boolean(value);
          else control.value = String(value);
          return;
        }
        if (control instanceof HTMLTextAreaElement) control.value = String(value);
      });
      const restoredContact = String(draft.contactPreference ?? 'whatsapp') as PartnershipSubmission['contactPreference'];
      setContactPreference(restoredContact);
      setMessageLength(String(draft.message ?? '').length);
      window.requestAnimationFrame(() => {
        if (formRef.current) updateCompletion(formRef.current);
      });
      setDraftState('restored');
    } catch {
      window.sessionStorage.removeItem(draftKey);
    }
  }, [draftKey]);

  useEffect(() => {
    const flushDraft = () => {
      if (draftTimerRef.current) {
        clearTimeout(draftTimerRef.current);
        draftTimerRef.current = null;
      }
      if (formRef.current && submissionState !== 'success') saveDraft(formRef.current);
    };
    window.addEventListener('pagehide', flushDraft);
    return () => {
      window.removeEventListener('pagehide', flushDraft);
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [draftKey, submissionState]);

  function saveDraft(form: HTMLFormElement) {
    const data = new FormData(form);
    const draft: Record<string, string | boolean> = {};
    data.forEach((value, key) => {
      if (key === 'website_url') return;
      draft[key] = typeof value === 'string' ? value : value.name;
    });
    draft.consent = Boolean(data.get('consent'));
    draft.dataSafety = Boolean(data.get('dataSafety'));
    const envelope: DraftEnvelope = { version: 1, savedAt: Date.now(), data: draft };
    window.sessionStorage.setItem(draftKey, JSON.stringify(envelope));
    setDraftState('saved');
  }


  function scheduleDraftSave(form: HTMLFormElement) {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      saveDraft(form);
      draftTimerRef.current = null;
    }, 350);
  }

  function clearDraft() {
    if (draftTimerRef.current) {
      clearTimeout(draftTimerRef.current);
      draftTimerRef.current = null;
    }
    window.sessionStorage.removeItem(draftKey);
    const form = formRef.current;
    form?.reset();
    setErrors({});
    setSubmissionState('idle');
    setReferenceId(undefined);
    setMessageLength(0);
    setCompletion(0);
    setRemainingRequired(0);
    setContactPreference('whatsapp');
    setDraftState('idle');
    idempotencyKeyRef.current = createIdempotencyKey();
    submittedAtRef.current = null;
    submissionLockRef.current = false;
  }

  function selectCategory(id: string) {
    if (id === selected.id) {
      window.requestAnimationFrame(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.getElementById('basvuru-formu')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
      return;
    }
    if (draftTimerRef.current) { clearTimeout(draftTimerRef.current); draftTimerRef.current = null; }
    if (formRef.current) saveDraft(formRef.current);
    setSelectedId(id);
    setErrors({});
    setSubmissionState('idle');
    setMessageLength(0);
    setReferenceId(undefined);
    setCompletion(0);
    setRemainingRequired(0);
    setContactPreference('whatsapp');
    idempotencyKeyRef.current = createIdempotencyKey();
    submittedAtRef.current = null;
    submissionLockRef.current = false;
    window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById('basvuru-formu')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  function updateCompletion(form: HTMLFormElement) {
    const data = new FormData(form);
    const requiredNames = ['fullName', 'phone', ...(contactPreference === 'email' ? ['email'] : []), ...selected.fields.map((field) => field.name), 'message', 'consent', ...(selected.id === 'complaint' ? ['dataSafety'] : [])];
    const completed = requiredNames.filter((name) => {
      if (name === 'consent' || name === 'dataSafety') return Boolean(data.get(name));
      const value = String(data.get(name) ?? '').trim();
      if (name === 'message') return value.length >= 40;
      if (name === 'phone') return Boolean(normalizeTurkishMobile(value));
      return value.length > 0;
    }).length;
    setCompletion(Math.round((completed / requiredNames.length) * 100));
    setRemainingRequired(requiredNames.length - completed);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLockRef.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: FormErrors = {};
    const fullName = String(data.get('fullName') ?? '').trim();
    const phoneRaw = String(data.get('phone') ?? '').trim();
    const phone = normalizeTurkishMobile(phoneRaw);
    const email = String(data.get('email') ?? '').trim();
    const company = String(data.get('company') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const preferredContact = String(data.get('contactPreference') ?? 'whatsapp') as PartnershipSubmission['contactPreference'];
    const consent = data.get('consent');
    const dataSafety = data.get('dataSafety');
    const websiteTrap = String(data.get('website_url') ?? '').trim();

    if (websiteTrap) return;
    if (fullName.length < 3) nextErrors.fullName = 'Ad soyad en az 3 karakter olmalıdır.';
    if (!phone) nextErrors.phone = '05xx xxx xx xx biçiminde geçerli bir Türkiye mobil numarası yazın.';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Geçerli bir e-posta adresi yazın.';
    if (preferredContact === 'email' && !email) nextErrors.email = 'E-posta ile iletişim için adresinizi yazın.';
    if (message.length < 40) nextErrors.message = 'Daha sağlıklı değerlendirme için en az 40 karakter yazın.';
    if (message.length > 1200) nextErrors.message = 'Açıklama 1200 karakteri geçmemelidir.';
    if (!consent) nextErrors.consent = 'Devam etmek için onay vermelisiniz.';
    if (selected.id === 'complaint' && !dataSafety) nextErrors.dataSafety = 'Hassas ödeme veya doğrulama bilgisi paylaşmadığınızı onaylayın.';

    selected.fields.forEach((field) => {
      const value = String(data.get(field.name) ?? '').trim();
      if (!value) nextErrors[field.name] = 'Bu alan başvuru türü için gereklidir.';
      if (field.type === 'url' && value && !isValidHttpUrl(value)) nextErrors[field.name] = 'Geçerli bir http:// veya https:// bağlantısı yazın.';
    });

    setErrors(nextErrors);
    setSubmissionState('idle');
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    if (!isOnline) {
      setSubmissionState('error');
      return;
    }

    if (!onSubmit) {
      setSubmissionState('error');
      return;
    }

    const details = Object.fromEntries(selected.fields.map((field) => [field.name, String(data.get(field.name) ?? '').trim()]));
    const submittedAt = submittedAtRef.current ?? new Date().toISOString();
    submittedAtRef.current = submittedAt;
    submissionLockRef.current = true;
    try {
      setSubmissionState('submitting');
      const result = await onSubmit({ applicationType: selected.id, applicationTitle: selected.title, fullName, phone: phone!, email: email || undefined, company: company || undefined, contactPreference: preferredContact, message, details, sourcePath: '/is-ortakligi', submittedAt, consentVersion: '2026-07', idempotencyKey: idempotencyKeyRef.current });
      setReferenceId(result?.referenceId);
      setSubmissionState('success');
      form.reset();
      setMessageLength(0);
      setCompletion(0);
      setRemainingRequired(0);
      setContactPreference('whatsapp');
      window.sessionStorage.removeItem(draftKey);
      setDraftState('idle');
      idempotencyKeyRef.current = createIdempotencyKey();
      submittedAtRef.current = null;
    } catch {
      setSubmissionState('error');
    } finally {
      submissionLockRef.current = false;
    }
  }

  return (
    <main className="partnership-page min-h-screen overflow-hidden bg-[var(--background)] text-white">
      <section className="relative isolate border-b border-white/8 pb-18 pt-16 sm:pb-24 sm:pt-22">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_0%,rgba(244,63,94,.22),transparent_32%),radial-gradient(circle_at_85%_14%,rgba(245,158,11,.17),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[74%] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
        <div className="content-wide relative grid items-center gap-10 xl:grid-cols-[1.04fr_.96fr] xl:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.065] px-4 py-2 text-xs font-black uppercase tracking-[0.17em] text-amber-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.75)]" /> Kurumsal başvuru merkezi
            </span>
            <h1 className="display-title mt-7 max-w-4xl">Doğru iş birlikleriyle birlikte daha güçlü büyüyelim.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300/80 sm:text-lg">Tedarik, kurumsal iş birlikleri, medya ortaklıkları ve geri bildirimler için doğru başvuru yolunu birkaç dakikada bulun.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"><a href="#partnership-category-grid" className="btn-primary inline-flex min-h-13 items-center justify-center px-6 text-sm font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]">Başvuru türünü seç <span className="ml-2" aria-hidden="true">↓</span></a><a href="#basvuru-ilkeleri" className="btn-secondary min-h-13 px-6 text-sm">Süreç ve güvenlik</a></div>
            <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-slate-300">
              {['11 başvuru türü', 'Tek sayfada yönlendirme', 'Gizlilik odaklı', 'Kategoriye özel form'].map((item) => <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] backdrop-blur-sm"><span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-400/10 text-[10px] text-emerald-300">✓</span>{item}</span>)}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[590px]" aria-hidden="true">
            <div className="absolute -inset-10 rounded-full bg-gradient-to-br from-rose-500/18 via-transparent to-amber-400/18 blur-3xl" />
            <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)]/94 p-6 shadow-[var(--shadow-card),inset_0_1px_0_rgba(255,255,255,.055)] backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between border-b border-white/8 pb-5">
                <div><p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Başvuru merkezi</p><h2 className="mt-2 text-2xl font-black">İhtiyacınıza uygun yolu seçin</h2></div>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 text-sm font-black shadow-lg">SB</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[['01', 'Ticari iş birlikleri', '3 başvuru'], ['02', 'Medya ve yayıncılar', '3 başvuru'], ['03', 'Kariyer ve kurumsal', '3 başvuru'], ['04', 'Şikâyet ve öneriler', '2 başvuru']].map(([number, title, count]) => <div key={title} className="group rounded-2xl border border-white/8 bg-white/[0.028] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.025)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05] motion-reduce:transform-none"><div className="flex items-center justify-between"><span className="text-[10px] font-black tracking-[0.16em] text-slate-500">{number}</span><span className="text-[10px] font-bold text-slate-600">{count}</span></div><strong className="mt-2 block text-sm">{title}</strong></div>)}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center"><div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.055] p-4 text-sm leading-6 text-emerald-100"><strong className="font-black">Güvenlik notu:</strong> Başvurularda şifre, kart PIN’i veya doğrulama kodu talep edilmez.</div><div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-[11px] font-extrabold text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.7)]" /> Güvenli form akışı</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-wide py-16 sm:py-24">
        <div className="flex flex-col gap-6 border-b border-white/8 pb-9 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-rose-300">Başvuru türleri</p><h2 className="mt-3 text-3xl font-black tracking-[-.035em] sm:text-4xl">Size uygun başvuru alanını seçin</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Konunuzu en iyi anlatan kartı seçin. Form yalnızca o başvuru için gerekli alanları gösterecek.</p></div>
          <label className="relative block w-full lg:max-w-sm"><span className="sr-only">Başvuru türlerinde ara</span><Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') setQuery(''); }} type="search" enterKeyHint="search" placeholder="Başvuru türü ara..." className="min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/40 focus:bg-white/[0.055] focus-visible:ring-2 focus-visible:ring-amber-300/20" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Aramayı temizle" className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-500 transition hover:bg-white/[0.06] hover:text-white">×</button>}</label>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Başvuru kategorileri">
          {groups.map((group) => {
            const count = group.id === 'all' ? categories.length : categories.filter((item) => item.group === group.id).length;
            const active = activeGroup === group.id;
            return <button key={group.id} type="button" role="tab" aria-selected={active} aria-controls="partnership-category-grid" onClick={() => setActiveGroup(group.id)} className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-xs font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/55 ${active ? 'border-amber-300/40 bg-amber-300/[0.11] text-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]' : 'border-white/10 bg-white/[0.025] text-slate-400 hover:border-white/18 hover:bg-white/[0.045] hover:text-white'}`}>{group.label} <span className="ml-1 opacity-60">{count}</span></button>;
          })}
        </div>

        <div className="mt-4 flex min-h-8 items-center justify-between gap-4 text-xs text-slate-500" aria-live="polite"><span><strong className="text-slate-300">{filtered.length}</strong> başvuru alanı gösteriliyor</span>{(query || activeGroup !== 'all') && <button type="button" onClick={() => { setQuery(''); setActiveGroup('all'); }} className="rounded-md font-extrabold text-amber-300 transition hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Filtreleri temizle</button>}</div>
        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" aria-hidden="true" />

        <div id="partnership-category-grid" className="mt-8 grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => {
            const style = accentStyles[item.accent];
            const active = selectedId === item.id;
            return <button key={item.id} type="button" aria-pressed={active} aria-current={active ? 'true' : undefined} onClick={() => selectCategory(item.id)} className={`group relative h-full min-h-[320px] overflow-hidden rounded-3xl border bg-gradient-to-b from-white/[0.06] to-white/[0.014] p-6 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.035)] transition-[transform,border-color,box-shadow,background-color] duration-300 sm:p-8 motion-reduce:transform-none hover:-translate-y-1 hover:shadow-[0_20px_54px_rgba(0,0,0,.24),inset_0_1px_0_rgba(255,255,255,.045)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 ${active ? `${style.active} shadow-[0_22px_64px_rgba(0,0,0,.3),inset_0_1px_0_rgba(255,255,255,.07)]` : `border-white/10 ${style.border}`}`}>
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${style.glow} to-transparent opacity-0 transition group-hover:opacity-100 ${active ? 'opacity-100' : ''}`} />
              <div className={`pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'}`} />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4"><span className={`grid h-12 w-12 place-items-center rounded-xl border ${style.icon}`}><Icon name={item.icon} className="h-6 w-6" /></span><div className="flex flex-wrap items-center justify-end gap-2"><span className="rounded-full border border-white/8 bg-black/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-[.1em] text-slate-500">{groupLabels[item.group]}</span><span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[.1em] ${active ? 'border-white/15 bg-white/[0.08] text-white' : 'border-white/8 text-slate-500'}`}>{active ? 'Seçildi' : String(categories.findIndex((category) => category.id === item.id) + 1).padStart(2, '0')}</span></div></div>
                <p className={`mt-5 text-[10px] font-black uppercase tracking-[0.18em] ${style.badge}`}>{item.eyebrow}</p>
                <h3 className="mt-2 text-[1.28rem] font-black leading-tight tracking-[-.025em]">{item.title}</h3>
                <p className="mt-3 min-h-[78px] text-sm leading-6 text-slate-400 sm:leading-7">{item.description}</p>
                <div className="mt-auto border-t border-white/7 pt-4"><p className="text-[10px] font-black uppercase tracking-[.12em] text-slate-600">İstenen temel bilgiler</p><p className="mt-2 min-h-10 line-clamp-2 text-[11px] font-bold leading-5 text-slate-400">{item.fields.map((field) => field.label).join(' • ')}</p></div>
                <div className="mt-4 flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-sm font-black text-white">{active ? 'Seçildi · Forma git' : 'Bu başvuruyu seç'} <span className="transition group-hover:translate-x-1 motion-reduce:transform-none">→</span></span><span className="text-[10px] font-bold text-slate-600">2–3 dk</span></div>
              </div>
            </button>;
          })}
        </div>

        {filtered.length === 0 && <div className="mt-8 rounded-3xl border border-dashed border-white/12 bg-white/[0.025] p-8 text-center sm:p-10"><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.035] text-slate-400"><Icon name="search" className="h-5 w-5" /></span><p className="mt-4 text-lg font-black">Uygun başvuru alanı bulunamadı.</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{query ? `“${query}” araması mevcut başvuru türleriyle eşleşmedi.` : 'Seçtiğiniz filtrede henüz bir başvuru türü bulunmuyor.'} Farklı bir kelime deneyebilir veya tüm kategorileri gösterebilirsiniz.</p><button type="button" onClick={() => { setQuery(''); setActiveGroup('all'); }} className="mt-5 rounded-xl border border-amber-300/25 bg-amber-300/[0.07] px-4 py-2.5 text-sm font-extrabold text-amber-200 transition hover:bg-amber-300/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Tüm başvuru türlerini göster</button></div>}

        <section id="basvuru-formu" className="scroll-mt-28 mt-16 overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)]" aria-labelledby="form-title">
          <div className="grid xl:grid-cols-[.7fr_1.3fr]">
            <div className="relative overflow-hidden border-b border-white/8 p-7 lg:border-b-0 lg:border-r sm:p-9 xl:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(244,63,94,.2),transparent_31%),radial-gradient(circle_at_80%_72%,rgba(245,158,11,.14),transparent_28%)]" />
              <div className="relative xl:sticky xl:top-28"><span className={`grid h-14 w-14 place-items-center rounded-xl border ${accentStyles[selected.accent].icon}`}><Icon name={selected.icon} className="h-7 w-7" /></span><p className={`mt-7 text-xs font-black uppercase tracking-[0.2em] ${accentStyles[selected.accent].badge}`}>{selected.eyebrow}</p><h2 id="form-title" className="mt-3 text-3xl font-black tracking-[-.03em]">{selected.title}</h2><p className="mt-4 leading-7 text-slate-400">{selected.description}</p><div className="mt-7 rounded-2xl border border-white/8 bg-black/20 p-5"><p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Başvurudan önce hazırlayın</p><ul className="mt-4 space-y-3">{categoryChecklists[selected.id].map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/10 text-emerald-300"><Icon name="check" className="h-3.5 w-3.5" /></span><span>{item}</span></li>)}</ul></div><div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.025] p-4"><p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Değerlendirme notu</p><p className="mt-2 text-xs leading-5 text-slate-400">{selected.note}</p></div><div className="mt-4 flex items-center gap-3 text-xs text-slate-500"><Icon name="shield" className="h-4 w-4 text-emerald-300" /><span>Hassas ödeme bilgisi paylaşmayın.</span></div></div>
            </div>

            <form key={selected.id} ref={formRef} className="p-6 sm:p-8 xl:p-10 2xl:p-11" onSubmit={handleSubmit} onInput={(event) => { const name = (event.target as HTMLInputElement | HTMLTextAreaElement).name; if (name && errors[name]) setErrors((current) => { const next = { ...current }; delete next[name]; return next; }); if (submissionState !== 'idle') setSubmissionState('idle'); idempotencyKeyRef.current = createIdempotencyKey(); submittedAtRef.current = null; updateCompletion(event.currentTarget); scheduleDraftSave(event.currentTarget); }} noValidate aria-busy={submissionState === 'submitting'}>
              <input type="hidden" name="applicationType" value={selected.id} />
              <div className="mb-7 grid grid-cols-3 gap-2" aria-label="Başvuru adımları"><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-3"><p className="text-[9px] font-black uppercase tracking-[.14em] text-emerald-300">01</p><p className="mt-1 text-[11px] font-extrabold text-emerald-100">Tür seçildi</p></div><div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] px-3 py-3"><p className="text-[9px] font-black uppercase tracking-[.14em] text-amber-300">02</p><p className="mt-1 text-[11px] font-extrabold text-amber-100">Bilgileri tamamla</p></div><div className="rounded-2xl border border-white/8 bg-white/[0.025] px-3 py-3"><p className="text-[9px] font-black uppercase tracking-[.14em] text-slate-600">03</p><p className="mt-1 text-[11px] font-extrabold text-slate-500">Güvenle gönder</p></div></div>
              <label className="sr-only" aria-hidden="true">Web sitesi<input name="website_url" tabIndex={-1} autoComplete="off" /></label>
              <div className="mb-7 rounded-[var(--radius-card)] border border-[var(--line)] bg-white/[0.018] p-4 sm:p-5"><div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Başvuru bilgileri</p><span className="rounded-full border border-white/8 bg-white/[0.025] px-2.5 py-1 text-[9px] font-black uppercase tracking-[.1em] text-slate-500">{groups.find((group) => group.id === selected.group)?.label}</span></div><p className="mt-2 text-sm text-slate-400"><span className="text-rose-300">*</span> işaretli alanlar zorunludur.</p></div><div className="flex items-center gap-2"><span className="hidden rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] font-extrabold text-slate-400 sm:inline-flex">{selected.title}</span>{draftState !== 'idle' && <button type="button" onClick={clearDraft} className="rounded-full border border-white/8 px-3 py-1.5 text-[10px] font-extrabold text-slate-500 transition hover:border-white/15 hover:text-white">Taslağı temizle</button>}</div></div>{draftState !== 'idle' && <p role="status" className="mt-3 text-xs font-bold text-emerald-300/80">{draftState === 'restored' ? 'Bu sekmedeki taslağınız geri yüklendi.' : 'Taslağınız bu sekme açıkken otomatik korunuyor.'}</p>}{!isOnline && <div role="status" aria-live="polite" className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-xs leading-5 text-amber-100"><Icon name="cloud-off" className="mt-0.5 h-4 w-4 shrink-0" /><p><strong className="font-black">İnternet bağlantısı yok.</strong> Taslağınız bu sekmede korunur; bağlantı geri geldiğinde başvuruyu gönderebilirsiniz.</p></div>}<div className="mt-5" aria-label={`Form tamamlanma oranı yüzde ${completion}`}><div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-extrabold"><span className={completion === 100 ? 'text-emerald-300' : 'text-slate-500'}>{completion === 100 ? 'Form gönderime hazır' : `${remainingRequired} zorunlu alan kaldı`}</span><span className="text-slate-500">%{completion}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className={`h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none ${completion === 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-rose-400 to-amber-300'}`} style={{ width: `${completion}%` }} /></div></div></div>
              <div className="mb-6 grid gap-3 rounded-2xl border border-amber-200/15 bg-amber-300/[0.045] p-4 sm:grid-cols-[auto_1fr] sm:p-5"><span className="grid h-10 w-10 place-items-center rounded-2xl border border-amber-200/20 bg-amber-300/[0.08] text-[#f2c98a]"><Icon name="route" className="h-5 w-5" /></span><div><p className="text-sm font-black text-amber-50">Değerlendirme kapsamı</p><p className="mt-1 text-xs leading-5 text-amber-100/65">{selected.note} Başvurular uygunluk ve kapsam açısından incelenir; gönderim otomatik kabul anlamına gelmez.</p></div></div>
              {Object.keys(errors).length > 0 && <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="mb-6 rounded-2xl border border-rose-400/25 bg-rose-400/[0.06] p-4 outline-none focus-visible:ring-2 focus-visible:ring-rose-300/35 sm:p-5"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-rose-300/20 bg-rose-300/10 text-rose-300"><Icon name="alert" className="h-4.5 w-4.5" /></span><div><p className="text-sm font-black text-rose-100">Başvuruda düzeltilmesi gereken alanlar var.</p><p className="mt-1 text-xs leading-5 text-rose-200/70">Aşağıdaki alanlardan birine dokunarak doğrudan ilgili bölüme gidebilirsiniz.</p></div></div><div className="mt-4 flex flex-wrap gap-2">{Object.entries(errors).map(([name, message]) => <button key={name} type="button" onClick={() => formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus()} className="rounded-full border border-rose-300/20 bg-black/15 px-3 py-2 text-left text-[11px] font-extrabold text-rose-100 transition hover:border-rose-300/40 hover:bg-rose-300/10">{fieldLabel(name)} · {message}</button>)}</div></div>}
              <FormSection number="01" title="İletişim bilgileri" description="Size doğru kanaldan ulaşabilmemiz için temel iletişim bilgilerinizi ekleyin.">
              <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                <Field required label="Ad soyad / Yetkili kişi" name="fullName" placeholder="Adınızı ve soyadınızı yazın" autoComplete="name" error={errors.fullName} />
                <Field required label="Telefon numarası" name="phone" placeholder="05xx xxx xx xx" inputMode="tel" autoComplete="tel" maxLength={17} error={errors.phone} />
                <Field required={contactPreference === 'email'} label="E-posta adresi" name="email" placeholder="ornek@firma.com" type="email" inputMode="email" autoComplete="email" error={errors.email} />
                <Field label="Firma / Marka adı" name="company" placeholder="Varsa firma veya marka adı" autoComplete="organization" />
              </div>
              </FormSection>
              <FormSection number="02" title="Başvuru detayları" description="Seçtiğiniz başvuru türüne özel bilgileri mümkün olduğunca net paylaşın.">
              <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                {selected.fields.map((field) => <Field key={`${selected.id}-${field.name}`} required label={field.label} name={field.name} placeholder={field.placeholder} type={field.type} error={errors[field.name]} />)}
              </div>
              </FormSection>
              <FormSection number="03" title="Dönüş tercihi ve açıklama" description="Nasıl iletişim kurulmasını istediğinizi seçin ve talebinizi ayrıntılandırın.">
              <fieldset><legend className="mb-2.5 text-sm font-extrabold text-slate-200">Tercih edilen iletişim yöntemi</legend><div className="grid grid-cols-3 gap-2">{[['whatsapp', 'WhatsApp'], ['phone', 'Telefon'], ['email', 'E-posta']].map(([value, label]) => <label key={value} className="cursor-pointer"><input className="peer sr-only" type="radio" name="contactPreference" value={value} checked={contactPreference === value} onChange={() => { setContactPreference(value as PartnershipSubmission['contactPreference']); window.requestAnimationFrame(() => formRef.current && updateCompletion(formRef.current)); }} /><span className="flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] px-2 text-xs font-extrabold text-slate-400 transition peer-focus-visible:ring-2 peer-focus-visible:ring-amber-300/60 peer-checked:border-amber-300/40 peer-checked:bg-amber-300/[0.09] peer-checked:text-amber-200">{label}</span></label>)}</div>{contactPreference === 'email' && <p className="mt-2 text-xs leading-5 text-amber-200/75">E-posta ile dönüş seçildiği için e-posta adresi zorunludur.</p>}</fieldset>
              <label className="mt-5 block"><span className="mb-2.5 flex items-center justify-between gap-3 text-sm font-extrabold text-slate-200"><span>Başvuru açıklaması <span className="text-rose-300">*</span></span><span className={`text-[11px] ${messageLength > 1200 ? 'text-rose-300' : 'text-slate-600'}`}>{messageLength}/1200</span></span><textarea name="message" rows={5} maxLength={1200} onChange={(event) => setMessageLength(event.target.value.length)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} placeholder="Talebinizi, hedefinizi ve değerlendirme için önemli ayrıntıları paylaşın." className={`w-full resize-y rounded-xl border bg-black/20 px-4 py-4 text-sm leading-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.025)] outline-none transition placeholder:text-slate-600 focus:bg-white/[0.045] ${errors.message ? 'border-rose-400/60 focus:border-rose-400' : 'border-white/10 focus:border-amber-300/40'}`} />{errors.message && <span id="message-error" role="alert" className="mt-2 block text-xs font-bold text-rose-300">{errors.message}</span>}</label>
              </FormSection>
              {selected.id === 'complaint' && <label className={`mt-7 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${errors.dataSafety ? 'border-rose-400/45 bg-rose-400/[0.04]' : 'border-amber-300/15 bg-amber-300/[0.035]'}`}><input name="dataSafety" type="checkbox" className="mt-1 h-4 w-4 accent-amber-400" /><span className="text-xs leading-6 text-slate-400">Bu alana şifre, kart PIN’i, CVV, tek kullanımlık doğrulama kodu veya kullanılmamış dijital kod eklemediğimi onaylıyorum. <span className="text-rose-300">*</span>{errors.dataSafety && <span role="alert" className="mt-1 block font-bold text-rose-300">{errors.dataSafety}</span>}</span></label>}
              <label className={`mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${errors.consent ? 'border-rose-400/45 bg-rose-400/[0.04]' : 'border-white/8 bg-white/[0.025]'}`}><input name="consent" type="checkbox" className="mt-1 h-4 w-4 accent-amber-400" /><span className="text-xs leading-6 text-slate-400">Başvuru bilgilerimin talebimin değerlendirilmesi amacıyla işlenmesini ve gerektiğinde benimle iletişime geçilmesini kabul ediyorum. {safePrivacyNoticeUrl && <><a href={safePrivacyNoticeUrl} target="_blank" rel="noreferrer" className="font-bold text-amber-200 underline decoration-amber-300/30 underline-offset-4 hover:text-amber-100">Aydınlatma metnini inceleyin</a>. </>}<span className="text-rose-300">*</span>{errors.consent && <span role="alert" className="mt-1 block font-bold text-rose-300">{errors.consent}</span>}</span></label>
              {submissionState === 'success' && <div role="status" aria-live="polite" className="mt-6 overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.09] to-emerald-400/[0.025]"><div className="flex items-start gap-4 p-5 sm:p-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-emerald-300/25 bg-emerald-300/10 text-emerald-300 shadow-[0_0_28px_rgba(52,211,153,.12)]"><Icon name="check" className="h-6 w-6" /></span><div><p className="text-base font-black text-emerald-50">Başvurunuz başarıyla iletildi.</p><p className="mt-2 text-sm leading-6 text-emerald-100/75">Ek bilgi gerekirse seçtiğiniz iletişim kanalı üzerinden sizinle bağlantı kurulur. Aynı başvuruyu tekrar göndermenize gerek yoktur.</p>{referenceId && <p className="mt-3 inline-flex rounded-full border border-emerald-300/20 bg-black/15 px-3 py-1.5 text-[11px] font-extrabold text-emerald-100">Referans: {referenceId}</p>}<button type="button" onClick={clearDraft} className="mt-4 rounded-xl border border-emerald-300/20 bg-black/15 px-4 py-2.5 text-xs font-extrabold text-emerald-100 transition hover:border-emerald-300/35 hover:bg-emerald-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/45">Yeni başvuru oluştur</button></div></div><div className="grid gap-px border-t border-emerald-300/10 bg-emerald-300/10 sm:grid-cols-3">{['Başvuru kaydedildi', 'İlgili ekibe yönlendirilecek', 'Gerekirse sizinle iletişime geçilecek'].map((item, index) => <div key={item} className="bg-[#0d1714]/80 px-4 py-3 text-[11px] font-bold text-emerald-100/70"><span className="mr-2 text-emerald-300">0{index + 1}</span>{item}</div>)}</div></div>}
              {submissionState === 'error' && <div role="alert" className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm leading-6 text-amber-100">{!isOnline ? 'İnternet bağlantısı olmadığı için başvuru gönderilemedi. Taslağınız korunuyor.' : onSubmit ? 'Başvuru şu anda gönderilemedi. Bilgilerinizi kontrol edip yeniden deneyin.' : unavailableMessage}</div>}
              <div className="mt-6 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex max-w-md items-start gap-2 text-xs leading-5 text-slate-500"><Icon name="lock" className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /><p>Bilgiler yalnızca değerlendirme için kullanılır. Şifre, PIN ve doğrulama kodu paylaşmayın.</p></div><div className="flex w-full items-center gap-3 sm:w-auto"><button type="button" onClick={() => { const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; document.getElementById('partnership-category-grid')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }} className="min-h-13 flex-1 rounded-xl border border-white/10 bg-white/[0.025] px-4 text-xs font-extrabold text-slate-400 transition hover:border-white/20 hover:text-white lg:hidden">Türü değiştir</button><button type="submit" disabled={submissionState === 'submitting' || !isOnline} className="btn-primary min-h-13 w-full shrink-0 px-7 shadow-[0_16px_40px_rgba(245,158,11,.12)] sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:cursor-wait disabled:opacity-60">{submissionState === 'submitting' ? 'Gönderiliyor…' : !isOnline ? 'Bağlantı bekleniyor' : 'Başvuruyu gönder'}</button></div></div>
            </form>
          </div>
        </section>

        <section id="basvuru-ilkeleri" className="scroll-mt-28 mt-20 grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-4" aria-label="Başvuru ilkeleri">
          {[['shield', 'Gizlilik', 'Başvuru bilgileriniz yalnız değerlendirme amacıyla kullanılır.'], ['route', 'Doğru yönlendirme', 'Seçtiğiniz kategori talebin ilgili ekibe ulaşmasını kolaylaştırır.'], ['check', 'Şeffaf değerlendirme', 'Uygunluk, kapsam ve karşılıklı fayda temelinde inceleme yapılır.'], ['lock', 'Hassas veri yok', 'Şifre, PIN veya tek kullanımlık kod hiçbir başvuruda istenmez.']].map(([icon, title, text]) => <div key={title} className="group h-full rounded-[var(--radius-card)] border border-[var(--line)] bg-gradient-to-b from-white/[0.05] to-white/[0.018] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.03)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.04] hover:shadow-[0_18px_50px_rgba(0,0,0,.22)] motion-reduce:transform-none"><span className="grid h-11 w-11 place-items-center rounded-xl border border-amber-300/18 bg-amber-300/[0.07] text-amber-300 transition group-hover:scale-105 motion-reduce:transform-none"><Icon name={icon as IconName} className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p></div>)}
        </section>
      </section>
    </main>
  );
}

function fieldLabel(name: string) {
  const labels: Record<string, string> = { fullName: 'Ad soyad', phone: 'Telefon', email: 'E-posta', company: 'Firma', message: 'Başvuru açıklaması', consent: 'Başvuru onayı', dataSafety: 'Hassas veri güvenliği' };
  return labels[name] ?? categories.flatMap((category) => category.fields).find((field) => field.name === name)?.label ?? 'Alan';
}

function FormSection({ number, title, description, children }: { number: string; title: string; description: string; children: React.ReactNode }) {
  return <section className="mt-7 first:mt-0 rounded-2xl border border-white/8 bg-white/[0.018] p-4 sm:p-5" aria-labelledby={`form-section-${number}`}><div className="mb-5 flex items-start gap-3 border-b border-white/7 pb-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-amber-300/20 bg-amber-300/[0.07] text-[10px] font-black text-amber-300">{number}</span><div><h3 id={`form-section-${number}`} className="text-sm font-black text-white">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div></div>{children}</section>;
}

function Field({ label, name, placeholder, type = 'text', inputMode, autoComplete, maxLength, required = false, error }: { label: string; name: string; placeholder: string; type?: string; inputMode?: 'text' | 'tel' | 'email' | 'numeric' | 'decimal' | 'search' | 'url' | 'none'; autoComplete?: string; maxLength?: number; required?: boolean; error?: string }) {
  const errorId = `${name}-error`;
  return <label className="block"><span className="mb-2.5 block text-sm font-extrabold text-slate-200">{label} {required && <span className="text-rose-300">*</span>}</span><input name={name} type={type} inputMode={inputMode} autoComplete={autoComplete} maxLength={maxLength} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} placeholder={placeholder} className={`field min-h-13 text-sm placeholder:text-slate-600 ${error ? '!border-rose-400/60 focus:!border-rose-400' : ''}`} />{error && <span id={errorId} role="alert" className="mt-2 block text-xs font-bold text-rose-300">{error}</span>}</label>;
}

function Icon({ name, className = 'h-6 w-6' }: { name: IconName | 'search' | 'shield' | 'route' | 'check' | 'lock' | 'cloud-off' | 'alert'; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    building: <><path d="M4 21V8l8-4 8 4v13"/><path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01M3 21h18"/></>,
    coins: <><ellipse cx="9" cy="7" rx="5" ry="3"/><path d="M4 7v4c0 1.7 2.2 3 5 3s5-1.3 5-3V7M4 11v4c0 1.7 2.2 3 5 3 1.1 0 2.2-.2 3-.6"/><path d="M14 12.5c.9-.9 2.2-1.5 3.5-1.5 2.5 0 4.5 1.6 4.5 3.5S20 18 17.5 18 13 16.4 13 14.5"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.4 3 14.6 0 18M12 3c-3 3.4-3 14.6 0 18"/></>,
    megaphone: <><path d="M4 13V9l13-5v14L4 13Z"/><path d="M4 9H2v4h2M8 14l1 6h4l-1-7"/></>,
    handshake: <><path d="m8 12 3 3c1 1 2.5 1 3.5 0l4-4"/><path d="m3 10 4-4 4 1 2-2 8 7-3 3M3 10l5 5M5 8l-2-2M21 12l-2 2"/></>,
    store: <><path d="M4 10v10h16V10M3 10l2-6h14l2 6"/><path d="M3 10c0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0"/><path d="M9 20v-6h6v6"/></>,
    office: <><path d="M4 21V5h10v16M14 9h6v12M8 9h2M8 13h2M8 17h2M17 13h.01M17 17h.01M3 21h18"/></>,
    video: <><rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3zM8 9h3M8 13h3"/></>,
    document: <><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></>,
    bulb: <><path d="M9 18h6M10 22h4M8.5 15.5A7 7 0 1 1 15.5 15.5c-.8.7-1.5 1.4-1.5 2.5h-4c0-1.1-.7-1.8-1.5-2.5Z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    shield: <><path d="M12 3 5 6v5c0 4.8 2.9 8.1 7 10 4.1-1.9 7-5.2 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></>,
    route: <><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    'cloud-off': <><path d="m3 3 18 18"/><path d="M5.8 5.8A7 7 0 0 0 5 19h11.2"/><path d="M10.7 4.2A7 7 0 0 1 19 11.1 4 4 0 0 1 20 18"/></>,
    alert: <><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v4M12 17h.01"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
