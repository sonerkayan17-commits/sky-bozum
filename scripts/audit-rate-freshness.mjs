import { readFileSync } from 'node:fs';

const source = readFileSync('app/lib/rates.ts', 'utf8');
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

if (!Number.isFinite(ageDays) || ageDays > maxAgeDays) {
  console.error('FAIL Rate data is stale. Update rates from the real source or keep release blocked.');
  process.exit(1);
}

console.log('Rate freshness audit passed.');
