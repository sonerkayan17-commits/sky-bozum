'use client';

import { buildWhatsAppUrl, trackConversion } from '../../lib/conversion';
import { primaryAbsoluteUrl } from '../../lib/siteIdentity';

type ArticleSupportLinkProps = {
  articleTitle: string;
  articleSlug: string;
  serviceName?: string;
  variant?: 'row' | 'sidebar';
};

export default function ArticleSupportLink({
  articleTitle,
  articleSlug,
  serviceName,
  variant = 'row',
}: ArticleSupportLinkProps) {
  const contextLine = serviceName
    ? `${serviceName} hizmetiyle ilgili "${articleTitle}" rehberini inceliyorum.`
    : `"${articleTitle}" rehberini inceliyorum.`;
  const message = `${contextLine}\nGüncel uygunluk ve net ödeme tutarı hakkında bilgi almak istiyorum.\nRehber: ${primaryAbsoluteUrl(`/bilgi-merkezi/${articleSlug}`)}`;
  const href = buildWhatsAppUrl(message);

  function handleClick() {
    trackConversion('whatsapp_clicked', {
      source: variant === 'sidebar' ? 'article_sidebar' : 'article_close',
      article: articleSlug,
      service: serviceName ?? 'unknown',
    });
  }

  if (variant === 'sidebar') {
    return (
      <a
        href={href}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp üzerinden destek alın; yeni sekmede açılır"
        className="focus-ring rounded-md"
      >
        Bu rehber için bilgi alın <b aria-hidden="true">→</b>
      </a>
    );
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp üzerinden destek alın; yeni sekmede açılır"
      className="focus-ring rounded-md"
    >
      <span>WhatsApp desteği</span>
      <strong>{serviceName ? `${serviceName} için güncel uygunluğu doğrulayın` : 'Bu rehber için güncel uygunluğu doğrulayın'}</strong>
      <b aria-hidden="true">→</b>
    </a>
  );
}
