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
  'vodafone-mobil-odeme': 'Vodafone mobil ödeme bozdur rehberi',
  'turkcell-mobil-odeme': 'Turkcell mobil ödeme bozdur rehberi',
  'turk-telekom-mobil-odeme': 'Türk Telekom mobil ödeme bozdur rehberi',
  paycell: 'Paycell bozdur ve dijital kod rehberi',
  pokus: 'Pokus bozdur ve dijital ürün rehberi',
};

export const independentPurchaseGuideSearchTerms: Record<(typeof independentPurchaseGuideSlugs)[number], string[]> = {
  'vodafone-mobil-odeme': ['vodafone mobil ödeme bozdur', 'vodafone mobil ödeme bozum', 'vodafone pay nakite çevirme'],
  'turkcell-mobil-odeme': ['turkcell mobil ödeme bozdur', 'turkcell mobil ödeme bozdurma', 'turkcell mobil bozum'],
  'turk-telekom-mobil-odeme': ['türk telekom mobil ödeme bozdur', 'türk telekom mobil ödeme bozdurma', 'türk telekom mobil bozum'],
  paycell: ['paycell bozdur', 'paycell nakite çevirme', 'paycell bakiye bozum'],
  pokus: ['pokus bozdur', 'pokus nakite çevirme', 'pokus mobil ödeme bozum'],
};

export function independentPurchaseGuideKeywords(slug: string) {
  return independentPurchaseGuideSearchTerms[slug as keyof typeof independentPurchaseGuideSearchTerms] ?? [];
}

export function independentPurchaseGuideLabel(slug: string) {
  return independentPurchaseGuideLabels[slug as keyof typeof independentPurchaseGuideLabels] ?? 'Dijital ürün alım rehberi';
}

export function excludeIndependentPurchaseGuides<T extends { serviceSlug: string }>(items: T[]) {
  return items.filter((item) => !isIndependentPurchaseGuide(item.serviceSlug));
}
