import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Oran Hesaplama | Sky Bozum',
  description: 'Sky Bozum oran hesaplama aracı Araçlar Merkezi’ne taşındı; mobil ödeme, dijital kod ve hediye kartı için yaklaşık sonucu yeni sayfada hesaplayın.',
  alternates: { canonical: '/araclar' },
  robots: { index: false, follow: true },
};

export default function OranHesaplaPage() {
  permanentRedirect('/araclar#oran-hesapla');
}
