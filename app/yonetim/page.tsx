import type { Metadata } from 'next';
import { articles } from '../lib/site';
import { rateItems } from '../lib/rates';
import AdminConsole from './AdminConsole';
import './yonetim.css';

export const metadata: Metadata = {
  title: 'Yönetim Merkezi',
  robots: { index: false, follow: false },
};

export default function ManagementPage() {
  return <AdminConsole articleCount={articles.length} rateCount={rateItems.length} />;
}
