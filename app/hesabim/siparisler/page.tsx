import dynamic from 'next/dynamic';
import '../utility.css';
import './orders.css';

const MemberOrders = dynamic(() => import('../../components/member/MemberOrders'));

export const metadata = { title: 'Siparişlerim', robots: { index: false, follow: false } };

export default function Page() {
  return <MemberOrders />;
}
