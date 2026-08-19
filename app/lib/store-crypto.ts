import 'server-only';

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

function encryptionKey() {
  const raw = (process.env.STORE_CODE_ENCRYPTION_KEY || process.env.CODE_SALE_ENCRYPTION_KEY)?.trim();
  if (!raw) throw new Error('STORE_CODE_ENCRYPTION_KEY ayarı eksik.');
  const decoded = Buffer.from(raw, 'base64');
  // Eski CODE_SALE_ENCRYPTION_KEY kurulumu 32 baytsa birebir korunur. Farklı
  // biçimde üretilmiş güçlü sırlar sabit 32 bayta türetilerek geriye uyarlanır.
  return decoded.length === 32 ? decoded : createHash('sha256').update(raw).digest();
}

export function normalizeStockCode(value: string) {
  return value.trim().replace(/\r/g, '').slice(0, 240);
}

export function stockCodeHash(productSlug: string, packId: string, code: string) {
  return createHash('sha256').update(`${productSlug}\0${packId}\0${normalizeStockCode(code)}`).digest('hex');
}

export function encryptStockCode(code: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(normalizeStockCode(code), 'utf8'), cipher.final()]);
  return `${iv.toString('base64')}.${cipher.getAuthTag().toString('base64')}.${encrypted.toString('base64')}`;
}

export function decryptStockCode(payload: string) {
  const [ivPart, tagPart, dataPart] = payload.split('.');
  if (!ivPart || !tagPart || !dataPart) throw new Error('Şifreli stok kaydı geçersiz.');
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(ivPart, 'base64'));
  decipher.setAuthTag(Buffer.from(tagPart, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(dataPart, 'base64')), decipher.final()]).toString('utf8');
}
