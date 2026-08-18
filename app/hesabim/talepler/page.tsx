import dynamic from 'next/dynamic';
import '../profile.css';

const MemberOperations = dynamic(() => import('../../components/member/MemberOperations'));

export const metadata = { title: 'Taleplerim', robots: { index: false, follow: false } };

export default function RequestsPage() {
  return <MemberOperations />;
}
