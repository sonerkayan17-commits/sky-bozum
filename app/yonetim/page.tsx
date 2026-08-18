import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { articles } from '../lib/site';
import { rateItems } from '../lib/rates';
import './yonetim.css';

const AdminConsole = dynamic(() => import('./AdminConsole'));

export const metadata: Metadata = {
  title: 'Yönetim Merkezi',
  robots: { index: false, follow: false },
};

export default function ManagementPage() {
  return <AdminConsole articleCount={articles.length} rateCount={rateItems.length} />;
}
