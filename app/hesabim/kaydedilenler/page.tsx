import dynamic from 'next/dynamic';
import '../utility.css';

const MemberBookmarks = dynamic(() => import('../../components/member/MemberBookmarks'));

export const metadata = { title: 'Kaydettiklerim', robots: { index: false, follow: false } };

export default function Page() { return <MemberBookmarks />; }
