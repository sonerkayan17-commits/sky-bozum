import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sky Bozum',
    short_name: 'Sky Bozum',
    description: 'Mobil ödeme, dijital bakiye, hediye kartı ve güvenli işlem rehberleri.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090b10',
    theme_color: '#090b10',
    lang: 'tr-TR',
    icons: [
      { src: '/brand-logo.webp', sizes: '512x512', type: 'image/webp', purpose: 'maskable' },
    ],
  };
}
