import { getProduct, type ProductItem } from './products';

export type StoreCatalogEntry = {
  key: string;
  productSlug: string;
  productName: string;
  packId: string;
  packLabel: string;
  priceMinor: number | null;
  stockCount: number;
  active: boolean;
};

export type StoreOrder = {
  id: string;
  productSlug: string;
  productName: string;
  packId: string;
  packLabel: string;
  priceMinor: number;
  code: string;
  createdAt: string | null;
};

export function storePackKey(productSlug: string, packId: string) {
  return `${productSlug}__${packId}`.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 180);
}

export function resolveStorePack(productSlug: string, packId: string): { product: ProductItem; pack: ProductItem['packs'][number]; key: string } | null {
  const product = getProduct(productSlug);
  const pack = product?.packs.find((item) => item.id === packId);
  return product && pack ? { product, pack, key: storePackKey(productSlug, packId) } : null;
}

export function formatStoreMoney(priceMinor: number | null | undefined) {
  if (!Number.isInteger(priceMinor) || Number(priceMinor) < 0) return '—';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(priceMinor) / 100);
}

export function parsePriceMinor(value: unknown) {
  const raw = String(value ?? '').trim().replace(/\s|₺|TL/gi, '');
  const normalized = raw.includes(',')
    ? raw.replace(/\./g, '').replace(',', '.')
    : /^\d{1,3}(?:\.\d{3})+$/.test(raw)
      ? raw.replace(/\./g, '')
      : raw;
  const numeric = typeof value === 'number' ? value : Number(normalized);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  const minor = Math.round(numeric * 100);
  return Number.isSafeInteger(minor) && minor > 0 ? minor : null;
}
