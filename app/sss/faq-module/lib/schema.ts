import type { FaqItem } from "../types/faq";

export type FaqSchemaOptions = {
  pageUrl?: string;
  pageName?: string;
  maxItems?: number;
};

function cleanSchemaText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function createFaqPageSchema(items: readonly FaqItem[], options: FaqSchemaOptions = {}) {
  const maxItems = Math.min(100, Math.max(1, options.maxItems ?? 25));
  const visibleItems = items
    .map((item) => ({ question: cleanSchemaText(item.question), answer: cleanSchemaText(item.answer) }))
    .filter((item) => item.question.length > 0 && item.answer.length > 0)
    .slice(0, maxItems);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(options.pageUrl ? { url: options.pageUrl } : {}),
    ...(options.pageName ? { name: cleanSchemaText(options.pageName) } : {}),
    mainEntity: visibleItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * JSON-LD verisini HTML script bağlamı için güvenli biçimde serileştirir.
 * Özellikle dışarıdan gelen içerikte </script> kapanışını ve Unicode ayırıcılarını etkisizleştirir.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
