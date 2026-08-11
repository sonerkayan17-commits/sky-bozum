export const MAX_FAQ_SEARCH_QUERY_LENGTH = 160;

export function sanitizeFaqSearchQuery(value: string): string {
  return value.slice(0, MAX_FAQ_SEARCH_QUERY_LENGTH);
}

export function normalizeFaqSearchQuery(value: string): string {
  return sanitizeFaqSearchQuery(value).trim();
}
