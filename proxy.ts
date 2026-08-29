import { NextRequest, NextResponse } from 'next/server';
import { ALTERNATE_SITE_HOSTS, PRIMARY_SITE_DOMAIN } from './app/lib/siteIdentity';

const redirectsEnabled = process.env.PRIMARY_DOMAIN_REDIRECTS_ENABLED === 'true';

export function proxy(request: NextRequest) {
  const host = (request.headers.get('host') || '').split(':')[0].toLowerCase();
  const isAlternateHost = ALTERNATE_SITE_HOSTS.includes(host);
  const isPreviewDeployment = process.env.VERCEL_ENV === 'preview';

  if (isAlternateHost && redirectsEnabled) {
    const destination = request.nextUrl.clone();
    destination.protocol = 'https:';
    destination.host = PRIMARY_SITE_DOMAIN;
    return NextResponse.redirect(destination, 308);
  }

  const response = NextResponse.next();
  if (isPreviewDeployment) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
