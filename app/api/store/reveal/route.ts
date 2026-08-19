import { bearerToken, firebaseRestError, readOwnFirestoreDocument, restValue, verifyFirebaseIdentity } from '../../../lib/firebase-rest-auth';
import { decryptStockCode } from '../../../lib/store-crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const identity = await verifyFirebaseIdentity(request);
    if (!identity.emailVerified) throw Object.assign(new Error('E-posta doğrulaması gerekiyor.'), { status: 403 });
    const token = bearerToken(request);
    const body = await request.json() as { orderId?: string; orderIds?: string[] };
    const requested = body.orderIds || (body.orderId ? [body.orderId] : []);
    const orderIds = [...new Set(requested.map(String).filter((id) => /^[A-Za-z0-9_-]{10,40}$/.test(id)))].slice(0, 50);
    if (!orderIds.length) throw Object.assign(new Error('Geçerli bir sipariş seçin.'), { status: 400 });
    const documents = await Promise.all(orderIds.map((id) => readOwnFirestoreDocument(token, 'productOrders', id)));
    const orders = documents.flatMap((document, index) => {
      const fields = document?.fields;
      if (!fields || restValue(fields, 'userId') !== identity.uid || restValue(fields, 'status') !== 'delivered') return [];
      try { return [{
        id: orderIds[index], productSlug: String(restValue(fields, 'productSlug') || ''), productName: String(restValue(fields, 'productName') || 'Dijital ürün'),
        packId: String(restValue(fields, 'packId') || ''), packLabel: String(restValue(fields, 'packLabel') || ''), priceMinor: Number(restValue(fields, 'priceMinor')) || 0,
        code: decryptStockCode(String(restValue(fields, 'codeEncrypted') || '')), createdAt: String(restValue(fields, 'createdAt') || '') || null,
      }]; } catch { return []; }
    });
    return Response.json({ orders, order: orders[0] || null }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return firebaseRestError(error); }
}
