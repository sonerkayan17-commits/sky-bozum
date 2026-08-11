import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const mapText = fs.readFileSync(path.join(root, 'app/lib/premiumArticleCovers.ts'), 'utf8');
const mapEntries = [...mapText.matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)].map(([, slug, src]) => ({ slug, src }));
const quality = JSON.parse(fs.readFileSync(path.join(root, 'app/lib/premiumCoverQuality.json'), 'utf8'));
const items = quality.items ?? [];

const bySlug = new Map(items.map((item) => [item.slug, item]));
const missingClassification = mapEntries.filter(({ slug }) => !bySlug.has(slug));
const staleClassification = items.filter(({ slug }) => !mapEntries.some((entry) => entry.slug === slug));
const mismatchedSource = mapEntries.filter(({ slug, src }) => bySlug.get(slug)?.src !== src);
const invalidTiers = items.filter(({ tier }) => !['editorial-premium', 'brand-illustration', 'structured-svg'].includes(tier));
const repeatedDashboardTemplate = mapEntries.filter(({ src }) => src.endsWith('-premium-cover.svg'));

if (missingClassification.length || staleClassification.length || mismatchedSource.length || invalidTiers.length || repeatedDashboardTemplate.length > 1) {
  console.error({ missingClassification, staleClassification, mismatchedSource, invalidTiers, repeatedDashboardTemplate });
  process.exit(1);
}

console.log(`OK: ${items.length} kapak sanat yönetimi sınıflandırıldı; bekleyen veya inceleme kuyruğunda kapak yok.`);
