import dynamic from 'next/dynamic';
import '../utility.css';

const MemberSubscriptions = dynamic(() => import('../../components/member/MemberSubscriptions'));

export const metadata = { title: 'Konu ve Mesaj Abonelikleri', robots: { index: false, follow: false } };

export default function Page() { return <MemberSubscriptions />; }
