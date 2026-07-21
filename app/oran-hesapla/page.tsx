import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Oran Hesaplama | Sky Bozum',
  description: 'Oran hesaplama aracı, Araçlar ve Hesaplama Merkezi içerisine taşındı.',
  alternates: { canonical: '/araclar' },
  robots: { index: false, follow: true },
};

export default function OranHesaplaPage() {
  permanentRedirect('/araclar#oran-hesapla');
}
