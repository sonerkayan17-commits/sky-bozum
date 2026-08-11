import { FAQ_CATEGORIES, type FaqCategory, type FaqItem } from "../types/faq";

const CATEGORY_SET = new Set<string>(FAQ_CATEGORIES);
const SAFE_ID = /^[a-z0-9][a-z0-9_-]{0,119}$/i;

export type FaqDataIssueCode = "invalid-record" | "invalid-id" | "duplicate-id" | "invalid-category" | "missing-content";
export type FaqDataIssue = { index: number; code: FaqDataIssueCode; id?: string };
export type PreparedFaqData = { items: FaqItem[]; issues: FaqDataIssue[] };

function cleanText(value: unknown, maxLength = 20_000): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, maxLength) : "";
}

function cleanStringArray(value: unknown, maxItems = 12, maxLength = 120): string[] {
  if (!Array.isArray(value)) return [];
  const result: string[] = [];
  const seen = new Set<string>();
  for (const entry of value) {
    const cleaned = cleanText(entry, maxLength);
    const key = cleaned.toLocaleLowerCase("tr-TR");
    if (!cleaned || seen.has(key)) continue;
    seen.add(key);
    result.push(cleaned);
    if (result.length >= maxItems) break;
  }
  return result;
}

export function prepareFaqItems(input: readonly unknown[]): PreparedFaqData {
  const items: FaqItem[] = [];
  const issues: FaqDataIssue[] = [];
  const ids = new Set<string>();

  input.forEach((raw, index) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      issues.push({ index, code: "invalid-record" }); return;
    }
    const value = raw as Record<string, unknown>;
    const id = cleanText(value.id, 120);
    if (!SAFE_ID.test(id)) { issues.push({ index, code: "invalid-id", id: id || undefined }); return; }
    if (ids.has(id)) { issues.push({ index, code: "duplicate-id", id }); return; }
    const category = cleanText(value.category, 100);
    if (!CATEGORY_SET.has(category)) { issues.push({ index, code: "invalid-category", id }); return; }
    const question = cleanText(value.question, 500);
    const shortAnswer = cleanText(value.shortAnswer, 1_000);
    const answer = cleanText(value.answer, 20_000);
    if (!question || !shortAnswer || !answer) { issues.push({ index, code: "missing-content", id }); return; }

    ids.add(id);
    const searchTerms = cleanStringArray(value.searchTerms);
    const order = typeof value.order === "number" && Number.isFinite(value.order) ? value.order : undefined;
    items.push({ id, category: category as FaqCategory, question, shortAnswer, answer, ...(searchTerms.length ? { searchTerms } : {}), ...(order !== undefined ? { order } : {}) });
  });

  return { items, issues };
}
