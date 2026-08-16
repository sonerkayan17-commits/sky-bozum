import dynamic from 'next/dynamic';
import '../utility.css';

const CommunityTopics = dynamic(() => import('../../components/member/CommunityTopics'));

export const metadata = { title: 'Yeni Konu Aç', robots: { index: false, follow: false } };

export default function Page() {
  return <CommunityTopics compose />;
}
