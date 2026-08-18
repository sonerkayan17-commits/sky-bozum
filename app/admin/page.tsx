import { permanentRedirect } from 'next/navigation';

export const metadata = { title: 'Yonetim', robots: { index: false, follow: false } };

// Eski /admin bağlantılarını tek yönetim adresinde tutar.
export default function AdminAliasPage() {
  permanentRedirect('/yonetim');
}
