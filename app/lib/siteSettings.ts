import { doc, onSnapshot, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';
import { defaultSiteSettings, type SiteSettings } from './siteSettingsDefaults';

export { defaultSiteSettings, type SiteSettings } from './siteSettingsDefaults';

export const siteSettingsRef = (db: Firestore) => doc(db, 'siteSettings', 'global');

export function subscribeToSiteSettings(db: Firestore, callback: (settings: SiteSettings) => void) {
  return onSnapshot(siteSettingsRef(db), (snapshot) => {
    callback({ ...defaultSiteSettings, ...(snapshot.data() as Partial<SiteSettings> | undefined) });
  }, () => callback(defaultSiteSettings));
}

export async function saveSiteSettings(db: Firestore, settings: SiteSettings, actorId: string) {
  const editable = Object.fromEntries(Object.entries(settings).filter(([key]) => key !== 'updatedAt' && key !== 'updatedBy'));
  await setDoc(siteSettingsRef(db), {
    ...editable,
    updatedBy: actorId,
    updatedAt: serverTimestamp(),
  });
}
