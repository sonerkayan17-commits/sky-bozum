import { readFileSync } from 'node:fs';

const source = readFileSync('app/lib/rates.ts', 'utf8');
const publishedRatesSource = readFileSync('app/components/personalization/usePublishedRates.ts', 'utf8');
const dateMatch = source.match(/export const RATE_UPDATED_AT = '(\d{4}-\d{2}-\d{2})'/);
const maxAgeMatch = source.match(/export const RATE_MAX_AGE_DAYS = (\d+)/);

if (!dateMatch || !maxAgeMatch) {
  console.error('FAIL Rate freshness constants are missing.');
  process.exit(1);
}

const updatedAt = new Date(`${dateMatch[1]}T12:00:00+03:00`);
const maxAgeDays = Number(maxAgeMatch[1]);
const ageDays = Math.floor((Date.now() - updatedAt.getTime()) / 86_400_000);

console.log(`Rate freshness audit: updated ${dateMatch[1]}, age ${ageDays} days, max ${maxAgeDays} days.`);

if (!Number.isFinite(ageDays)) {
  console.error('FAIL Rate data age cannot be calculated.');
  process.exit(1);
}

if (ageDays > maxAgeDays) {
  const hasVisibleStaleNotice = source.includes('rateFreshnessNotice')
    && source.includes('güncel oran teyidi alın');
  const hasPublishedOverrideStream = publishedRatesSource.includes("collection(db, 'rateOverrides')")
    && publishedRatesSource.includes("where('status', '==', 'published')")
    && publishedRatesSource.includes('onSnapshot');

  if (!hasVisibleStaleNotice || !hasPublishedOverrideStream) {
    console.error('FAIL Static rates are stale and the safe published-override/user-warning path is incomplete.');
    process.exit(1);
  }

  console.warn('WARN Static fallback is stale; published Firestore overrides and the visible rate confirmation notice remain active.');
  console.log('Rate freshness audit passed with the guarded stale-fallback policy.');
  process.exit(0);
}

console.log('Rate freshness audit passed.');
