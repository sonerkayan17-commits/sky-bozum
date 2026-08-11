import type { FaqItem } from "../types/faq";
import { sanitizeFaqSearchQuery } from "./search-query";

const TURKISH_MAP: Record<string, string> = { ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u" };
export const SEARCH_SYNONYMS: Record<string, string[]> = {
  vodafon: ["vodafone"], vodafone: ["vodafon"], paycel: ["paycell"], paycell: ["paycel"],
  telekom: ["turk telekom", "turk telekom mobil odeme"], turkcell: ["paycell"],
  nakit: ["bozum", "nakit donusum", "bakiye bozdurma"], bozdurma: ["bozum", "nakit donusum"],
  bozdur: ["bozum", "nakit donusum"], komsyon: ["komisyon"], komisyon: ["oran", "net odeme"],
  oran: ["komisyon", "net odeme"], sure: ["odeme suresi", "gecikme", "ne zaman"],
  zaman: ["sure", "odeme suresi"], gelir: ["odeme", "odeme suresi"], kod: ["pin", "dijital kod"],
  guvenli: ["guvenlik", "dolandiricilik"], sifre: ["parola", "guvenlik"], limit: ["bakiye", "kullanilabilir tutar"],
  ucret: ["komisyon", "oran"], para: ["odeme", "nakit"], iptal: ["vazgecme", "geri alma"],
};

export type SearchScoreBreakdown = {
  total: number;
  reasons: string[];
  matchedTokens: string[];
};

export type FaqSearchIndexEntry = {
  item: FaqItem;
  question: string;
  category: string;
  service: string;
  haystack: string;
  words: string[];
};

export type FaqSearchIndex = ReadonlyMap<string, FaqSearchIndexEntry>;

export function normalizeText(value: string): string {
  return sanitizeFaqSearchQuery(value).toLocaleLowerCase("tr-TR").replace(/[çğıiöşü]/g, (c) => TURKISH_MAP[c] ?? c)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function levenshteinDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const old = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1)); previous = old;
    }
  }
  return row[b.length];
}

export function queryTokens(query: string): string[] {
  const normalized = normalizeText(query);
  const expanded = new Set(normalized.split(" ").filter(Boolean));
  [...expanded].forEach((token) => (SEARCH_SYNONYMS[token] ?? []).forEach((value) => normalizeText(value).split(" ").forEach((part) => expanded.add(part))));
  return [...expanded];
}

export function createFaqSearchIndex(items: readonly FaqItem[]): FaqSearchIndex {
  const entries = items.map((item): [string, FaqSearchIndexEntry] => {
    const question = normalizeText(item.question);
    const category = normalizeText(item.category);
    const service = normalizeText((item.searchTerms ?? []).join(" "));
    const fields = [item.question, item.shortAnswer, item.answer, item.category, ...(item.searchTerms ?? [])];
    const haystack = normalizeText(fields.join(" "));
    return [item.id, { item, question, category, service, haystack, words: haystack.split(" ").filter(Boolean) }];
  });
  return new Map(entries);
}

export function explainIndexedSearchScore(entry: FaqSearchIndexEntry, query: string): SearchScoreBreakdown {
  if (!query.trim()) return { total: 1, reasons: ["Boş sorgu"], matchedTokens: [] };
  const { item, question, category, service, haystack, words } = entry;
  const normalizedQuery = normalizeText(query);
  const tokens = queryTokens(query);
  const reasons: string[] = [];
  const matchedTokens: string[] = [];
  let score = 0;

  if (question === normalizedQuery) { score += 40; reasons.push("Tam soru eşleşmesi"); }
  if (question.includes(normalizedQuery)) { score += 20; reasons.push("Soru içinde tam ifade"); }
  if (category.includes(normalizedQuery) || service.includes(normalizedQuery)) { score += 14; reasons.push("Kategori veya hizmet eşleşmesi"); }
  if (haystack.includes(normalizedQuery)) { score += 10; reasons.push("İçerikte tam ifade"); }

  for (const token of tokens) {
    let matched = false;
    if (question.includes(token)) { score += 8; matched = true; }
    if (category.includes(token) || service.includes(token)) { score += 6; matched = true; }
    if (haystack.includes(token)) { score += 3; matched = true; }
    else if (token.length >= 4 && words.some((word) => Math.abs(word.length - token.length) <= 2 && levenshteinDistance(word, token) <= 2)) { score += 2; matched = true; }
    if (matched) matchedTokens.push(token);
  }
  if (tokens.length > 1 && tokens.every((token) => haystack.includes(token) || words.some((word) => token.length >= 4 && levenshteinDistance(word, token) <= 2))) { score += 12; reasons.push("Çok kelimeli niyet eşleşmesi"); }
  return { total: score, reasons, matchedTokens: [...new Set(matchedTokens)] };
}

export function explainSearchScore(item: FaqItem, query: string): SearchScoreBreakdown {
  const entry = createFaqSearchIndex([item]).get(item.id);
  return entry ? explainIndexedSearchScore(entry, query) : { total: 0, reasons: [], matchedTokens: [] };
}

export function searchIndexedScore(entry: FaqSearchIndexEntry, query: string): number { return explainIndexedSearchScore(entry, query).total; }
export function searchScore(item: FaqItem, query: string): number { return explainSearchScore(item, query).total; }

export function rankFaqsWithIndex(index: FaqSearchIndex, query: string): FaqItem[] {
  return [...index.values()].map((entry) => ({ item: entry.item, score: searchIndexedScore(entry, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || (a.item.order ?? Number.MAX_SAFE_INTEGER) - (b.item.order ?? Number.MAX_SAFE_INTEGER))
    .map(({ item }) => item);
}

export function rankFaqs(items: readonly FaqItem[], query: string): FaqItem[] {
  return rankFaqsWithIndex(createFaqSearchIndex(items), query);
}

