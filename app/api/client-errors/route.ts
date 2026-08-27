import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const attempts = new Map<string, { count: number; resetAt: number }>();
const allowedKinds = new Set(['window-error', 'unhandled-rejection', 'page-boundary', 'global-boundary']);

function rateLimited(request: Request) {
  const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  if (attempts.size > 2_000) {
    for (const [attemptKey, attempt] of attempts) {
      if (attempt.resetAt <= now) attempts.delete(attemptKey);
    }
  }
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 8;
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  if (rateLimited(request)) return NextResponse.json({ ok: false, requestId }, { status: 429, headers: { 'retry-after': '60', 'cache-control': 'no-store' } });
  if (Number(request.headers.get('content-length') || 0) > 4096) return NextResponse.json({ ok: false, requestId }, { status: 413, headers: { 'cache-control': 'no-store' } });
  const origin = request.headers.get('origin');
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (origin && forwardedHost) {
    try {
      if (new URL(origin).host !== forwardedHost) return NextResponse.json({ ok: false, requestId }, { status: 403, headers: { 'cache-control': 'no-store' } });
    } catch {
      return NextResponse.json({ ok: false, requestId }, { status: 400, headers: { 'cache-control': 'no-store' } });
    }
  }

  try {
    const payload = await request.json() as Record<string, unknown>;
    const kind = String(payload.kind || '');
    if (!allowedKinds.has(kind)) return NextResponse.json({ ok: false, requestId }, { status: 400, headers: { 'cache-control': 'no-store' } });
    const event = {
      requestId,
      kind,
      digest: typeof payload.digest === 'string' ? payload.digest.slice(0, 120) : undefined,
      route: typeof payload.route === 'string' && payload.route.startsWith('/') ? payload.route.slice(0, 240) : '/',
      occurredAt: typeof payload.occurredAt === 'string' ? payload.occurredAt.slice(0, 40) : new Date().toISOString(),
      release: typeof payload.release === 'string' ? payload.release.slice(0, 12) : undefined,
    };
    console.error('[client-runtime-error]', JSON.stringify(event));
    return NextResponse.json({ ok: true, requestId }, { status: 202, headers: { 'cache-control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, requestId }, { status: 400, headers: { 'cache-control': 'no-store' } });
  }
}
