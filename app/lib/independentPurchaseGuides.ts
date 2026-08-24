export const independentPurchaseGuideSlugs = [
  'vodafone-mobil-odeme',
  'turkcell-mobil-odeme',
  'turk-telekom-mobil-odeme',
  'paycell',
  'pokus',
] as const;

const independentPurchaseGuideSet = new Set<string>(independentPurchaseGuideSlugs);

export function isIndependentPurchaseGuide(slug: string) {
  return independentPurchaseGuideSet.has(slug);
}

export const independentPurchaseGuideLabels: Record<(typeof independentPurchaseGuideSlugs)[number], string> = {
  'vodafone-mobil-odeme': 'Vodafone ile dijital ürün satın al',
  'turkcell-mobil-odeme': 'Turkcell ile dijital kod satın al',
  'turk-telekom-mobil-odeme': 'Türk Telekom dijital ürün alım rehberi',
  paycell: 'Paycell ile dijital ürün satın al',
  pokus: 'Pokus ile dijital ürün satın al',
};

export function independentPurchaseGuideLabel(slug: string) {
  return independentPurchaseGuideLabels[slug as keyof typeof independentPurchaseGuideLabels] ?? 'Dijital ürün alım rehberi';
}

export function excludeIndependentPurchaseGuides<T extends { serviceSlug: string }>(items: T[]) {
  return items.filter((item) => !isIndependentPurchaseGuide(item.serviceSlug));
}
