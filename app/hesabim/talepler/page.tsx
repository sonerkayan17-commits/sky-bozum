import MemberOperations from '../../components/member/MemberOperations';
import '../profile.css';

export const metadata = { title: 'Taleplerim', robots: { index: false, follow: false } };

export default function RequestsPage() {
  return <MemberOperations />;
}
