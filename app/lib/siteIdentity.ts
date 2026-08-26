export const EXPECTED_PRODUCTION_ORIGIN = 'https://bozumcu.net.tr';

function normalizeHttpsOrigin(value?: string) {
  try {
    const parsed = new URL(value || EXPECTED_PRODUCTION_ORIGIN);
    if (parsed.protocol !== 'https:') return EXPECTED_PRODUCTION_ORIGIN;
    return parsed.origin.replace(/\/$/, '');
  } catch {
    return EXPECTED_PRODUCTION_ORIGIN;
  }
}

export const PRIMARY_SITE_ORIGIN = normalizeHttpsOrigin(process.env.NEXT_PUBLIC_SITE_URL);
export const PRIMARY_SITE_DOMAIN = new URL(PRIMARY_SITE_ORIGIN).hostname.replace(/^www\./, '');

export const ALTERNATE_SITE_HOSTS = [
  'sky-bozum.vercel.app',
  'www.sky-bozum.vercel.app',
  'bozumcu.net',
  'www.bozumcu.net',
].filter((host) => host !== PRIMARY_SITE_DOMAIN && host !== `www.${PRIMARY_SITE_DOMAIN}`);

export function primaryAbsoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  return `${PRIMARY_SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
