import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { articles } from '../lib/site';
import { rateItems } from '../lib/rates';
import { skyReferences } from '../referanslar/references/data/skyReferences.data';
import './yonetim.css';

const AdminConsole = dynamic(() => import('./AdminConsole'));

export const metadata: Metadata = {
  title: 'Yönetim Merkezi',
  robots: { index: false, follow: false },
};

export default function ManagementPage() {
  const verifiedReferences = skyReferences.filter((reference) => reference.verified && reference.sourceUrl);
  const latestReferenceAt = verifiedReferences.reduce((latest, reference) => {
    const publishedAt = reference.publishedAt || '';
    return publishedAt > latest ? publishedAt : latest;
  }, '');
  return <AdminConsole articleCount={articles.length} rateCount={rateItems.length} referenceCount={verifiedReferences.length} latestReferenceAt={latestReferenceAt} />;
}
