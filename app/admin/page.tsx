import { permanentRedirect } from 'next/navigation';

// Eski /admin bağlantılarını tek yönetim adresinde tutar.
export default function AdminAliasPage() {
  permanentRedirect('/yonetim');
}
