import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetail from '../../components/services/ServiceDetail';
import { getService, services } from '../../lib/site';
import { breadcrumbSchema, createMetadata, jsonLd, serviceSchema } from '../../lib/seo';
import { independentPurchaseGuideKeywords, isIndependentPurchaseGuide } from '../../lib/independentPurchaseGuides';

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const isPurchaseGuide = isIndependentPurchaseGuide(service.slug);

  return createMetadata({
    title: isPurchaseGuide ? service.name : `${service.name} | Güncel Oran ve İşlem Rehberi`,
    description: service.summary,
    keywords: isPurchaseGuide
      ? [service.name, service.shortName, ...independentPurchaseGuideKeywords(service.slug), `${service.shortName} dijital urun satin alma`, `${service.shortName} mobil odeme limiti`, `${service.shortName} guvenli alisveris`, service.category, 'dijital kod satin alma', 'mobil odeme rehberi']
      : [service.name, service.shortName, `${service.shortName} bozum`, `${service.shortName} bozdurma`, `${service.shortName} oran`, `${service.shortName} islem suresi`, service.category, 'bozum orani', 'net odeme hesaplama', 'islem rehberi'],
    path: `/hizmetler/${service.slug}`,
    image: service.logo,
    imageAlt: `${service.shortName} hizmeti`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const isPurchaseGuide = isIndependentPurchaseGuide(service.slug);

  const schema = [
    ...(!isPurchaseGuide ? [serviceSchema(service)] : []),
    breadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Hizmetler', path: '/hizmetler' },
      { name: service.shortName, path: `/hizmetler/${service.slug}` },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <ServiceDetail service={service} />
    </>
  );
}
