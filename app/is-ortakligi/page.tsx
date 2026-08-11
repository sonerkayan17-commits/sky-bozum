import type { Metadata } from 'next';
import PartnershipPageClient from '../components/partnership/PartnershipPageClient';

export const metadata: Metadata = {
  title: 'İş Ortaklığı ve Kurumsal Başvuru Merkezi',
  description: 'Sky Bozum toplu kod, kurumsal iş birliği, reklam, yayıncı, kariyer, bayilik, şikâyet ve öneri başvurularını doğru ekibe iletin.',
  alternates: { canonical: '/is-ortakligi' },
  openGraph: {
    title: 'Sky Bozum İş Ortaklığı ve Kurumsal Başvuru Merkezi',
    description: 'Markalar, satıcılar, yayıncılar ve profesyoneller için kontrollü kurumsal başvuru merkezi.',
    url: '/is-ortakligi',
    type: 'website',
  },
};

export default function Page() {
  return <PartnershipPageClient />;
}
