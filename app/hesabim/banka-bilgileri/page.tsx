import dynamic from 'next/dynamic';
import '../utility.css';

const MemberBankInfo = dynamic(() => import('../../components/member/MemberBankInfo'));

export const metadata = { title: 'Banka Bilgilerim', robots: { index: false, follow: false } };

export default function Page() {
  return <MemberBankInfo />;
}
