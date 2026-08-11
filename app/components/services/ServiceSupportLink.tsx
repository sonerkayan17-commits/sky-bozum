'use client';

import { buildWhatsAppUrl, trackConversion } from '../../lib/conversion';

type ServiceSupportLinkProps = {
  serviceName: string;
  serviceSlug: string;
  source: 'hero' | 'sidebar' | 'closing';
  label: string;
  className?: string;
};

const sourceLabels: Record<ServiceSupportLinkProps['source'], string> = {
  hero: 'hizmet sayfasının üst bölümü',
  sidebar: 'işlem öncesi güvenlik alanı',
  closing: 'hizmet sayfasının işlem başlatma alanı',
};

export default function ServiceSupportLink({
  serviceName,
  serviceSlug,
  source,
  label,
  className = 'btn-primary focus-ring',
}: ServiceSupportLinkProps) {
  const message = `Merhaba, ${serviceName} hizmet sayfasını inceliyorum.\nGüncel uygunluk, oran ve hesabıma geçecek net ödeme tutarı hakkında bilgi almak istiyorum.\nHizmet: https://bozumcu.net/hizmetler/${serviceSlug}`;
  const href = buildWhatsAppUrl(message);

  function handleClick() {
    trackConversion('whatsapp_clicked', {
      source: `service_${source}`,
      service: serviceSlug,
      placement: sourceLabels[source],
    });
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${serviceName} için WhatsApp üzerinden güncel uygunluk ve net ödeme tutarını öğrenin; yeni sekmede açılır`}
      className={className}
    >
      {label}
    </a>
  );
}
