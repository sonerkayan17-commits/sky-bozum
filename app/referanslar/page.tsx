import type { Metadata } from 'next';
import SkyReferencesSection from './references/components/SkyReferencesSection';
import { skyReferences } from './references/data/skyReferences.data';
import { absoluteUrl, breadcrumbSchema, createMetadata, jsonLd, SITE_NAME } from '../lib/seo';

const title = 'Referanslar ve Kullanıcı Yorumları';
const description =
  'Sky Bozum hakkında WM Aracı üzerinde paylaşılmış açık kaynak kullanıcı yorumlarını inceleyin ve deneyiminizi paylaşın.';

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: '/referanslar',
  keywords: [
    'Sky Bozum referanslar',
    'mobil ödeme bozum yorumları',
    'Razer Gold bozum yorumları',
    'güvenilir mobil ödeme bozum',
    'WM Aracı kullanıcı yorumları',
  ],
  imageAlt: 'Sky Bozum referanslar ve doğrulanmış müşteri deneyimleri',
});

const breadcrumb = breadcrumbSchema([
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Referanslar', path: '/referanslar' },
]);

const publicReferences = skyReferences.filter((reference) => reference.source === 'wmaraci' && reference.sourceUrl && reference.verified);

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${absoluteUrl('/referanslar')}#collection`,
  name: title,
  description,
  url: absoluteUrl('/referanslar'),
  isPartOf: { '@id': `${absoluteUrl('/')}#website` },
  about: { '@id': `${absoluteUrl('/')}#organization`, name: SITE_NAME },
  inLanguage: 'tr-TR',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: publicReferences.length,
    itemListElement: publicReferences.slice(0, 20).map((reference, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${absoluteUrl('/referanslar')}#reference-${reference.id}`,
      name: reference.title,
    })),
  },
};

export default function ReferencesPage() {
  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(collectionSchema) }} />
      <h1 className="sr-only">{title}</h1>
      <SkyReferencesSection references={skyReferences} />
    </main>
  );
}
