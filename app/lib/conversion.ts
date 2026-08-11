export type ConversionEvent =
  | 'calculator_completed'
  | 'whatsapp_clicked'
  | 'trust_center_opened'
  | 'checklist_completed'
  | 'service_to_guide_clicked';

export function trackConversion(event: ConversionEvent, detail: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('sky:conversion', { detail: { event, ...detail, at: new Date().toISOString() } }));
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/905392080166?text=${encodeURIComponent(message)}`;
}
