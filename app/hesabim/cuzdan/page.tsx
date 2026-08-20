import dynamic from 'next/dynamic';
import '../utility.css';
import './wallet.css';

const MemberWallet = dynamic(() => import('../../components/member/MemberWallet'));

export const metadata = { title: 'Cüzdanım ve Ödemelerim', robots: { index: false, follow: false } };

export default function Page() {
  return <MemberWallet />;
}
