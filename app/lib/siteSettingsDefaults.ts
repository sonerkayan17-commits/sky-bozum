import { siteConfig } from './site-config';

export type SiteSettings = {
  brandName: string; brandTagline: string; footerDescription: string; phone: string; email: string; whatsapp: string;
  liveSupportLabel: string; supportHours: string; defaultSeoTitle: string; defaultSeoDescription: string;
  heroEyebrow: string; heroTitle: string; heroLead: string; heroPrimaryCta: string; proofExperience: string; proofTransactions: string;
  announcementEnabled: boolean; announcementText: string; announcementHref: string; searchPlaceholder: string;
  searchQuickAccessTitle: string; searchContinueTitle: string; searchFeaturedTitle: string; searchRecentEnabled: boolean;
  searchQuickActionRateEnabled: boolean; searchQuickActionRateTitle: string; searchQuickActionRateDescription: string; searchQuickActionRateHref: string;
  searchQuickActionServicesEnabled: boolean; searchQuickActionServicesTitle: string; searchQuickActionServicesDescription: string; searchQuickActionServicesHref: string;
  searchQuickActionTrustEnabled: boolean; searchQuickActionTrustTitle: string; searchQuickActionTrustDescription: string; searchQuickActionTrustHref: string;
  searchQuickActionSupportEnabled: boolean; searchQuickActionSupportTitle: string; searchQuickActionSupportDescription: string; searchQuickActionSupportHref: string;
  savedItemsLabel: string; updatedBy?: string; updatedAt?: unknown;
};

export const defaultSiteSettings: SiteSettings = {
  brandName: siteConfig.name,
  brandTagline: 'Dijital bakiyeniz için açık oran ve kontrollü işlem akışı.',
  footerDescription: 'Mobil ödeme ve dijital bakiyeler için açık oran bilgisi, kontrollü işlem akışı ve yazılı destek.',
  phone: siteConfig.phone, email: siteConfig.email, whatsapp: siteConfig.whatsapp,
  liveSupportLabel: siteConfig.liveSupportLabel, supportHours: 'Her gün 09:00 - 00:00',
  defaultSeoTitle: 'Sky Bozum - Mobil Ödeme Bozdurma ve Mobil Bozum',
  defaultSeoDescription: 'Mobil ödeme bozdurma, mobil bozum ve dijital bakiye işlemleri için güncel bilgi, hesaplama araçları ve yazılı destek.',
  heroEyebrow: '10+ yılı aşkın tecrübe · 7/24 canlı destek', heroTitle: 'Mobil ödeme bozdurma ve dijital bakiye bozum işlemleri.',
  heroLead: 'Mobil bozum ve mobil ödeme bozdurma sürecini öğrenin; operatör ve cüzdanlarla dijital ürün satın alma rehberlerini, desteklenen kod oranlarını işlem öncesinde inceleyin.',
  heroPrimaryCta: 'Mobil ödeme bozdur', proofExperience: '10+ yıl', proofTransactions: '10.000+',
  announcementEnabled: false, announcementText: '', announcementHref: '/bilgi-merkezi',
  searchPlaceholder: 'Hizmet, operatör, rehber veya araç ara...', searchQuickAccessTitle: 'Hızlı erişim ve rehberler',
  searchContinueTitle: 'Kaldığınız yerden devam edin', searchFeaturedTitle: 'Öne çıkan rehberler', searchRecentEnabled: true,
  searchQuickActionRateEnabled: true, searchQuickActionRateTitle: 'Oran hesapla',
  searchQuickActionRateDescription: 'İşlem tutarını ve tahmini sonucu hızlıca hesaplayın.', searchQuickActionRateHref: '/araclar#oran-hesapla',
  searchQuickActionServicesEnabled: true, searchQuickActionServicesTitle: 'Tüm hizmetler',
  searchQuickActionServicesDescription: 'Mobil ödeme, dijital kod ve cüzdan seçeneklerini inceleyin.', searchQuickActionServicesHref: '/hizmetler',
  searchQuickActionTrustEnabled: true, searchQuickActionTrustTitle: 'Güvenlik kontrolü',
  searchQuickActionTrustDescription: 'İşlem öncesi resmî kanalları ve güvenlik notlarını kontrol edin.', searchQuickActionTrustHref: '/iletisim#guvenlik',
  searchQuickActionSupportEnabled: true, searchQuickActionSupportTitle: 'Destek ve iletişim',
  searchQuickActionSupportDescription: 'Resmi iletişim kanallarına ve destek seçeneklerine ulaşın.', searchQuickActionSupportHref: '/iletisim',
  savedItemsLabel: '★ Kaydettiklerim',
};
