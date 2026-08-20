import { bearerToken, firebaseRestError, readFirestoreDocumentWithToken, requireStoreAdmin, restStringArray, restValue, verifyFirebaseIdentity } from '../../../../lib/firebase-rest-auth';
import { decryptStockCode } from '../../../../lib/store-crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const identity = await verifyFirebaseIdentity(request);
    requireStoreAdmin(identity);
    const body = await request.json() as { operationId?: string };
    const operationId = String(body.operationId || '');
    if (!/^[A-Za-z0-9_-]{10,40}$/.test(operationId)) throw Object.assign(new Error('Geçerli bir işlem seçin.'), { status: 400 });
    const document = await readFirestoreDocumentWithToken(bearerToken(request), 'operations', operationId);
    if (!document?.fields || restValue(document.fields, 'operationType') !== 'code_sale') throw Object.assign(new Error('Kod satış işlemi bulunamadı.'), { status: 404 });
    const status = restValue(document.fields, 'status');
    if (status === 'completed' || status === 'cancelled') throw Object.assign(new Error('Tamamlanmış veya iptal edilmiş işlemin kod kasası yeniden açılamaz.'), { status: 409 });
    const encrypted = restStringArray(document.fields, 'codesEncrypted');
    if (!encrypted.length || encrypted.length > 20 || encrypted.length !== Number(restValue(document.fields, 'codeCount'))) throw Object.assign(new Error('İşlemde doğrulanabilir kod bulunamadı.'), { status: 422 });
    return Response.json({ codes: encrypted.map(decryptStockCode) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return firebaseRestError(error);
  }
}
