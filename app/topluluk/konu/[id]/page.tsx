import type { Metadata } from 'next';
import MemberTopicDetail from './MemberTopicDetail';

export const metadata: Metadata = {
  title: 'Topluluk konusu',
  description: 'Sky Bozum topluluğunda üyeler tarafından paylaşılan soru, deneyim ve çözümler.',
  robots: { index: false, follow: true },
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MemberTopicDetail id={id} />;
}
