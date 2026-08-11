export { SkyFaqModule } from "./components/SkyFaqModule";
export { FaqModule } from "./components/faq/FaqModule";
export { skyFaqItems } from "./data/faqs";
export { createFaqPageSchema, serializeJsonLd } from "./lib/schema";
export { createFaqSearchIndex, rankFaqsWithIndex, normalizeText } from "./lib/search";
export { MAX_FAQ_SEARCH_QUERY_LENGTH, normalizeFaqSearchQuery, sanitizeFaqSearchQuery } from "./lib/search-query";
export type { FaqItem, FaqCategory, FaqSupportLinks, SkyFaqModuleProps } from "./types/faq";
