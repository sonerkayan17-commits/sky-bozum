import { firebaseRestError, verifyFirebaseIdentity } from '../../../lib/firebase-rest-auth';
import { resolveRazerCodeValue } from '../../../lib/codeSales';
import { encryptStockCode, normalizeStockCode, stockCodeHash } from '../../../lib/store-crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const identity = await verifyFirebaseIdentity(request);
    if (!identity.emailVerified) throw Object.assign(new Error('Kod gönderimi için e-posta doğrulaması gerekiyor.'), { status: 403 });
    const body = await request.json() as { currency?: string; codeValue?: number; codes?: string };
    const selection = resolveRazerCodeValue(body.currency, body.codeValue);
    if (!selection) throw Object.assign(new Error('Geçerli bir Razer Gold para birimi ve kod değeri seçin.'), { status: 400 });
    if (String(body.codes || '').length > 5000) throw Object.assign(new Error('Kod listesi izin verilen boyutu aşıyor.'), { status: 413 });
    const submittedCodes = String(body.codes || '').split(/\r?\n/).map(normalizeStockCode).filter(Boolean);
    const canonicalCodes = submittedCodes.map((code) => code.toLocaleUpperCase('en-US'));
    const codes = submittedCodes;
    if (!codes.length) throw Object.assign(new Error('En az bir kullanılmamış kod girin.'), { status: 400 });
    if (new Set(canonicalCodes).size !== codes.length) throw Object.assign(new Error('Aynı kodu bir talepte birden fazla kez gönderemezsiniz.'), { status: 409 });
    if (codes.length > 20) throw Object.assign(new Error('Tek talepte en fazla 20 kod gönderebilirsiniz.'), { status: 400 });
    if (codes.some((code) => code.length < 4 || code.length > 240)) throw Object.assign(new Error('Kod satırlarından biri geçerli uzunlukta değil.'), { status: 400 });
    return Response.json({
      currency: selection.currency,
      codeValue: selection.value,
      encrypted: codes.map((code, index) => ({
        id: stockCodeHash('razer-code-sale', 'all', canonicalCodes[index]),
        codeEncrypted: encryptStockCode(code),
      })),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return firebaseRestError(error);
  }
}
