import 'server-only';

export type VerifiedFirebaseIdentity = { uid: string; email: string; emailVerified: boolean };

export function bearerToken(request: Request) {
  const authorization = request.headers.get('authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
}

export async function verifyFirebaseIdentity(request: Request): Promise<VerifiedFirebaseIdentity> {
  const token = bearerToken(request);
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '';
  if (!token) throw Object.assign(new Error('Giriş yapmanız gerekiyor.'), { status: 401 });
  if (!apiKey) throw new Error('firebase-public-config-missing');
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: token }), cache: 'no-store',
  });
  if (!response.ok) throw Object.assign(new Error('Oturum doğrulanamadı. Lütfen yeniden giriş yapın.'), { status: 401 });
  const payload = await response.json() as { users?: Array<{ localId?: string; email?: string; emailVerified?: boolean }> };
  const identity = payload.users?.[0];
  if (!identity?.localId) throw Object.assign(new Error('Oturum doğrulanamadı.'), { status: 401 });
  return { uid: identity.localId, email: String(identity.email || '').toLowerCase(), emailVerified: identity.emailVerified === true };
}

export function requireStoreAdmin(identity: VerifiedFirebaseIdentity) {
  if (identity.email === 'sonerkayan17@gmail.com') return;
  throw Object.assign(new Error('Bu işlem için yönetici yetkisi gerekiyor.'), { status: 403 });
}

export function firebaseRestError(error: unknown) {
  const message = error instanceof Error ? error.message : 'İşlem tamamlanamadı.';
  const status = typeof error === 'object' && error && 'status' in error ? Number(error.status) || 500 : 500;
  const publicMessage = status < 500 ? message : message.includes('config-missing') ? 'Güvenli mağaza ayarı henüz tamamlanmadı.' : 'İşlem güvenli biçimde tamamlanamadı.';
  return Response.json({ error: publicMessage }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function readFirestoreDocumentWithToken(token: string, collectionName: string, documentId: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
  if (!projectId) throw new Error('firebase-public-config-missing');
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${encodeURIComponent(collectionName)}/${encodeURIComponent(documentId)}`, {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
  });
  if (response.status === 404) return null;
  if (!response.ok) throw Object.assign(new Error('Sipariş kaydı okunamadı.'), { status: response.status === 403 ? 403 : 502 });
  return response.json() as Promise<{ name?: string; fields?: Record<string, FirestoreRestValue> }>;
}

export const readOwnFirestoreDocument = readFirestoreDocumentWithToken;

export type FirestoreRestValue = { stringValue?: string; integerValue?: string; doubleValue?: number; timestampValue?: string; booleanValue?: boolean; arrayValue?: { values?: FirestoreRestValue[] } };
export function restValue(fields: Record<string, FirestoreRestValue> | undefined, key: string) {
  const value = fields?.[key];
  if (!value) return null;
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  return null;
}

export function restStringArray(fields: Record<string, FirestoreRestValue> | undefined, key: string) {
  return (fields?.[key]?.arrayValue?.values || []).flatMap((value) => typeof value.stringValue === 'string' ? [value.stringValue] : []);
}
