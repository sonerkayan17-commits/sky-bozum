export const FAQ_CATEGORIES = [
  "En Çok Sorulanlar", "İşleme Başlamadan Önce", "Mobil Ödeme Bozum", "Bozum Oranları",
  "Komisyon ve Net Ödeme", "Ödeme Süreleri", "Güvenlik", "Dolandırıcılıktan Korunma",
  "Resmî İletişim Kanalları", "İşlem İptali", "Vodafone Mobil Ödeme", "Vodafone Pay",
  "Turkcell Mobil Ödeme", "Paycell", "Türk Telekom Mobil Ödeme", "Pokus", "Razer Gold TL",
  "Razer Gold USD", "Apple Gift Card", "Steam", "SMS Bozum", "Hat ve Fatura Limitleri",
  "Kod Kontrolü", "IBAN ve Hesap Sahibi", "Gece ve Hafta Sonu İşlemleri",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export type FaqItem = {
  id: string;
  category: FaqCategory;
  question: string;
  shortAnswer: string;
  answer: string;
  searchTerms?: readonly string[];
  order?: number;
};

export type FaqSupportLinks = {
  whatsapp?: string;
  liveSupport?: string;
  contact?: string;
};

export type SkyFaqModuleProps = {
  items?: readonly FaqItem[];
  title?: string;
  description?: string;
  initialCategory?: FaqCategory | "Tümü";
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  enableStructuredData?: boolean;
  structuredDataMaxItems?: number;
  stickyOffset?: string | number;
  supportLinks?: FaqSupportLinks;
  trustItems?: readonly string[];
  onQuestionOpen?: (item: FaqItem) => void;
  onSearch?: (query: string, resultCount: number) => void;
};
