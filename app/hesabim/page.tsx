import dynamic from 'next/dynamic';
import './profile.css';

const MemberHub = dynamic(() => import('../components/member/MemberHub'));

export const metadata = { title: 'Üye Profilim', robots: { index: false, follow: false } };

export default function Page() {
  return <MemberHub view="overview" />;
}
