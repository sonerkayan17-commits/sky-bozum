export const CONSENT_STORAGE_KEY = 'skybozum-consent-v1';
export const PROFILE_STORAGE_KEY = 'skybozum-visitor-profile-v1';
export const RATE_CHOICE_STORAGE_KEY = 'skybozum-rate-choice-v1';
export const PROFILE_LIFETIME_MS = 90 * 24 * 60 * 60 * 1000;

export type InterestKey =
  | 'razer'
  | 'apple'
  | 'steam'
  | 'paycell'
  | 'pokus'
  | 'vodafone'
  | 'turkcell'
  | 'turk-telekom'
  | 'mobil-odeme'
  | 'kartlar';

export type VisitorProfile = {
  version: 1;
  visitorId: string;
  interests: Partial<Record<InterestKey, number>>;
  recentPaths: string[];
  pageViews: number;
  createdAt: number;
  lastSeenAt: number;
  expiresAt: number;
};

export const interestLabels: Record<InterestKey, string> = {
  razer: 'Razer Gold',
  apple: 'Apple / iTunes',
  steam: 'Steam',
  paycell: 'Paycell',
  pokus: 'Pokus',
  vodafone: 'Vodafone',
  turkcell: 'Turkcell',
  'turk-telekom': 'Türk Telekom',
  'mobil-odeme': 'Mobil Ödeme',
  kartlar: 'Kart İşlemleri',
};

const pathnameSignals: Array<[RegExp, InterestKey[]]> = [
  [/razer-gold/, ['razer']],
  [/(itunes|apple)/, ['apple']],
  [/steam/, ['steam']],
  [/paycell/, ['paycell', 'mobil-odeme']],
  [/pokus/, ['pokus', 'mobil-odeme']],
  [/vodafone/, ['vodafone', 'mobil-odeme']],
  [/turkcell/, ['turkcell', 'mobil-odeme']],
  [/(turk-telekom|türk-telekom)/, ['turk-telekom', 'mobil-odeme']],
  [/(sms-mobil-odeme|mobil-odeme-bozum)/, ['mobil-odeme']],
  [/(kredi-karti|sanal-kart)/, ['kartlar']],
];

function generateVisitorId() {
  return globalThis.crypto.randomUUID();
}

export function createVisitorProfile(now = Date.now()): VisitorProfile {
  return {
    version: 1,
    visitorId: generateVisitorId(),
    interests: {},
    recentPaths: [],
    pageViews: 0,
    createdAt: now,
    lastSeenAt: now,
    expiresAt: now + PROFILE_LIFETIME_MS,
  };
}

export function parseVisitorProfile(value: string | null, now = Date.now()) {
  if (!value) return null;
  try {
    const profile = JSON.parse(value) as VisitorProfile;
    if (profile.version !== 1 || !profile.visitorId || profile.expiresAt <= now) return null;
    return { ...profile, recentPaths: Array.isArray(profile.recentPaths) ? profile.recentPaths.slice(0, 6) : [] };
  } catch {
    return null;
  }
}

export function addPathSignal(profile: VisitorProfile, pathname: string, now = Date.now()): VisitorProfile {
  const interests = { ...profile.interests };
  let recentPaths = profile.recentPaths ?? [];
  for (const [pattern, keys] of pathnameSignals) {
    if (!pattern.test(pathname)) continue;
    for (const key of keys) interests[key] = Math.min(25, (interests[key] ?? 0) + 1);
  }
  if (/^\/(hizmetler|bilgi-merkezi)\/[^/]+$/.test(pathname)) {
    recentPaths = [pathname, ...recentPaths.filter((path) => path !== pathname)].slice(0, 6);
  }
  return {
    ...profile,
    interests,
    recentPaths,
    pageViews: profile.pageViews + 1,
    lastSeenAt: now,
    expiresAt: now + PROFILE_LIFETIME_MS,
  };
}

export function clearRecentPaths(profile: VisitorProfile, now = Date.now()): VisitorProfile {
  return {
    ...profile,
    recentPaths: [],
    lastSeenAt: now,
    expiresAt: now + PROFILE_LIFETIME_MS,
  };
}

export function getTopInterest(profile: VisitorProfile | null): InterestKey | null {
  if (!profile) return null;
  const ranked = Object.entries(profile.interests) as Array<[InterestKey, number]>;
  ranked.sort((a, b) => b[1] - a[1]);
  return ranked[0]?.[1] > 0 ? ranked[0][0] : null;
}
