const FALLBACK_PRODUCTION_ORIGIN = 'https://sky-bozum.vercel.app';
const customDomainCanonicalEnabled = process.env.PRIMARY_DOMAIN_CANONICAL_ENABLED === 'true';

function normalizeHttpsOrigin(value: string | undefined, fallback: string) {
  try {
    const parsed = new URL(value || fallback);
    if (parsed.protocol !== 'https:') return fallback;
    return parsed.origin.replace(/\/$/, '');
  } catch {
    return fallback;
  }
}

export const EXPECTED_PRODUCTION_ORIGIN = customDomainCanonicalEnabled
  ? normalizeHttpsOrigin(process.env.NEXT_PUBLIC_SITE_URL, FALLBACK_PRODUCTION_ORIGIN)
  : FALLBACK_PRODUCTION_ORIGIN;

export const PRIMARY_SITE_ORIGIN = EXPECTED_PRODUCTION_ORIGIN;
export const PRIMARY_SITE_DOMAIN = new URL(PRIMARY_SITE_ORIGIN).hostname.replace(/^www\./, '');

export const ALTERNATE_SITE_HOSTS = [
  'sky-bozum.vercel.app',
  'www.sky-bozum.vercel.app',
  'bozumcu.net.tr',
  'www.bozumcu.net.tr',
  'bozumcu.net',
  'www.bozumcu.net',
].filter((host) => host !== PRIMARY_SITE_DOMAIN && host !== `www.${PRIMARY_SITE_DOMAIN}`);

export function primaryAbsoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  return `${PRIMARY_SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
