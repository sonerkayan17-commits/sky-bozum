export type ReferenceService =
  | 'razer-gold'
  | 'apple-itunes'
  | 'vodafone-pay'
  | 'paycell'
  | 'pokus'
  | 'steam'
  | 'sms-bozum'
  | 'kredi-sanal-kart'
  | 'mobil-odeme'
  | 'genel'
  | 'diger';

export interface SkyReference {
  id: string;
  source: 'wmaraci';
  service: ReferenceService;
  authorLabel: string;
  title?: string;
  excerpt: string;
  publishedAt?: string;
  sourceUrl: string;
  sourcePostLabel?: string;
  verified: boolean;
  featured?: boolean;
  tags?: string[];
  tradeScore?: string;
  verificationNote?: string;
  privacyReview?: {
    status: 'approved' | 'needs-review' | 'rejected';
    maskedFields: string[];
    reviewedAt?: string;
  };
}
