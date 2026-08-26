import { NextResponse } from 'next/server';
import { ALLOW_INDEXING, SITE_URL } from '../../lib/seo';
import { isFirebaseAppCheckConfigured, isFirebaseConfigured } from '../../lib/firebase';

export const dynamic = 'force-dynamic';

export function GET() {
  const checks = {
    canonicalOrigin: SITE_URL,
    indexingEnabled: ALLOW_INDEXING,
    firebaseConfigured: isFirebaseConfigured,
    appCheckConfigured: isFirebaseAppCheckConfigured,
  };
  const healthy = checks.firebaseConfigured && checks.appCheckConfigured;
  return NextResponse.json({
    status: healthy ? 'ok' : 'degraded',
    checks,
    release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || 'local',
    checkedAt: new Date().toISOString(),
  }, {
    status: healthy ? 200 : 503,
    headers: { 'cache-control': 'no-store, max-age=0' },
  });
}
