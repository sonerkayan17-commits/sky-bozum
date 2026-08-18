import dynamic from 'next/dynamic';
import '../utility.css';

const MemberMessages = dynamic(() => import('../../components/member/MemberMessages'));

export const metadata = { title: 'Üye Mesajları', robots: { index: false, follow: false } };

export default function Page() {
  return <MemberMessages />;
}
