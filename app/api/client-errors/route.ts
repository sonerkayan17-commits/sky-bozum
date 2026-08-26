import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const attempts = new Map<string, { count: number; resetAt: number }>();
const allowedKinds = new Set(['window-error', 'unhandled-rejection', 'page-boundary', 'global-boundary']);

function rateLimited(request: Request) {
  const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 8;
}

export async function POST(request: Request) {
  if (rateLimited(request)) return NextResponse.json({ ok: false }, { status: 429 });
  if (Number(request.headers.get('content-length') || 0) > 4096) return NextResponse.json({ ok: false }, { status: 413 });
  const origin = request.headers.get('origin');
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (origin && forwardedHost && new URL(origin).host !== forwardedHost) return NextResponse.json({ ok: false }, { status: 403 });

  try {
    const payload = await request.json() as Record<string, unknown>;
    const kind = String(payload.kind || '');
    if (!allowedKinds.has(kind)) return NextResponse.json({ ok: false }, { status: 400 });
    const event = {
      kind,
      digest: typeof payload.digest === 'string' ? payload.digest.slice(0, 120) : undefined,
      route: typeof payload.route === 'string' && payload.route.startsWith('/') ? payload.route.slice(0, 240) : '/',
      occurredAt: typeof payload.occurredAt === 'string' ? payload.occurredAt.slice(0, 40) : new Date().toISOString(),
      release: typeof payload.release === 'string' ? payload.release.slice(0, 12) : undefined,
    };
    console.error('[client-runtime-error]', JSON.stringify(event));
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
