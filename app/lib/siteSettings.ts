import { doc, onSnapshot, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';
import { siteConfig } from './site-config';

export type SiteSettings = {
  brandName: string;
  brandTagline: string;
  footerDescription: string;
  phone: string;
  email: string;
  whatsapp: string;
  liveSupportLabel: string;
  supportHours: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroPrimaryCta: string;
  proofExperience: string;
  proofTransactions: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementHref: string;
  updatedBy?: string;
  updatedAt?: unknown;
};

export const defaultSiteSettings: SiteSettings = {
  brandName: siteConfig.name,
  brandTagline: 'Dijital bakiyeniz için açık oran ve kontrollü işlem akışı.',
  footerDescription: 'Mobil ödeme ve dijital bakiyeler için açık oran bilgisi, kontrollü işlem akışı ve yazılı destek.',
  phone: siteConfig.phone,
  email: siteConfig.email,
  whatsapp: siteConfig.whatsapp,
  liveSupportLabel: siteConfig.liveSupportLabel,
  supportHours: 'Her gün 09:00 - 00:00',
  defaultSeoTitle: 'Sky Bozum - Mobil Ödeme ve Dijital Bakiye Bozum',
  defaultSeoDescription: 'Mobil ödeme, dijital kod ve bakiye işlemleri için güncel bilgi, hesaplama araçları ve yazılı destek.',
  heroEyebrow: '10 yıl kurucu deneyimi · 7/24 destek',
  heroTitle: 'Mobil ödeme ve dijital bakiyenizi güvenle bozdurun.',
  heroLead: 'Vodafone, Turkcell, Türk Telekom, Paycell, Pokus ve dijital bakiyeleriniz için işlem öncesinde net oran, güvenli süreç ve hızlı ödeme.',
  heroPrimaryCta: 'Güncel oranınızı öğrenin',
  proofExperience: '10 yıl',
  proofTransactions: '10.000+',
  announcementEnabled: false,
  announcementText: '',
  announcementHref: '/bilgi-merkezi',
};

export const siteSettingsRef = (db: Firestore) => doc(db, 'siteSettings', 'global');

export function subscribeToSiteSettings(db: Firestore, callback: (settings: SiteSettings) => void) {
  return onSnapshot(siteSettingsRef(db), (snapshot) => {
    callback({ ...defaultSiteSettings, ...(snapshot.data() as Partial<SiteSettings> | undefined) });
  }, () => callback(defaultSiteSettings));
}

export async function saveSiteSettings(db: Firestore, settings: SiteSettings, actorId: string) {
  const { updatedAt: _updatedAt, updatedBy: _updatedBy, ...editable } = settings;
  await setDoc(siteSettingsRef(db), {
    ...editable,
    updatedBy: actorId,
    updatedAt: serverTimestamp(),
  });
}
