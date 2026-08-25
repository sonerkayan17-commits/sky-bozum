import { SITE_URL } from './seo';

export function authActionSettings(path: '/giris' | '/hesabim' = '/giris') {
  return {
    url: `${SITE_URL}${path}`,
    handleCodeInApp: false,
  } as const;
}
