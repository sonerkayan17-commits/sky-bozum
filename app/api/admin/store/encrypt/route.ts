import { verifyFirebaseIdentity, requireStoreAdmin, firebaseRestError } from '../../../../lib/firebase-rest-auth';
import { encryptStockCode, normalizeStockCode, stockCodeHash } from '../../../../lib/store-crypto';
import { resolveStorePack } from '../../../../lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const identity = await verifyFirebaseIdentity(request);
    requireStoreAdmin(identity);
    const body = await request.json() as { productSlug?: string; packId?: string; codes?: string };
    const productSlug = String(body.productSlug || '');
    const packId = String(body.packId || '');
    if (!resolveStorePack(productSlug, packId)) throw Object.assign(new Error('Geçerli bir ürün ve paket seçin.'), { status: 400 });
    const codes = [...new Set(String(body.codes || '').split(/\n|,/).map(normalizeStockCode).filter((code) => code.length >= 4))];
    if (codes.length > 100) throw Object.assign(new Error('Tek işlemde en fazla 100 kod ekleyebilirsiniz.'), { status: 400 });
    return Response.json({ encrypted: codes.map((code) => ({ id: stockCodeHash(productSlug, packId, code), codeEncrypted: encryptStockCode(code) })) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return firebaseRestError(error); }
}
