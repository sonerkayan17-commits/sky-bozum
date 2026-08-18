export type ConversionEvent =
  | 'calculator_completed'
  | 'whatsapp_clicked'
  | 'account_login_attempted'
  | 'account_register_attempted'
  | 'password_reset_requested'
  | 'operation_request_started'
  | 'trust_center_opened'
  | 'checklist_completed'
  | 'service_to_guide_clicked';

const allowedEvents = new Set<ConversionEvent>([
  'calculator_completed',
  'whatsapp_clicked',
  'account_login_attempted',
  'account_register_attempted',
  'password_reset_requested',
  'operation_request_started',
  'trust_center_opened',
  'checklist_completed',
  'service_to_guide_clicked',
]);

function hasAnalyticsConsent() {
  try {
    return window.localStorage.getItem('skybozum-consent-v1') === 'accepted';
  } catch {
    return false;
  }
}

function safeDetail(detail: Record<string, string | number | boolean>) {
  return Object.fromEntries(Object.entries(detail)
    .filter(([key]) => !/(email|phone|name|iban|password|contact|customer|message|body)/i.test(key))
    .map(([key, value]) => [key.slice(0, 48), typeof value === 'string' ? value.slice(0, 120) : value]));
}

export function trackConversion(event: ConversionEvent, detail: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  if (!allowedEvents.has(event)) return;
  const payload = { event, ...safeDetail(detail), at: new Date().toISOString() };
  window.dispatchEvent(new CustomEvent('sky:conversion', { detail: payload }));
  if (!hasAnalyticsConsent()) return;
  const endpoint = process.env.NEXT_PUBLIC_SKY_TELEMETRY_ENDPOINT;
  if (!endpoint || !/^https:\/\//i.test(endpoint)) return;
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
    return;
  }
  fetch(endpoint, { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => undefined);
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/905392080166?text=${encodeURIComponent(message)}`;
}
