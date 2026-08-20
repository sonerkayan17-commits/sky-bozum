import { readFileSync } from 'node:fs';

const community = readFileSync('app/components/member/CommunityTopics.tsx', 'utf8');
const directory = readFileSync('app/topluluk/ForumDirectory.tsx', 'utf8');
const rules = readFileSync('firestore.rules', 'utf8');

const checks = [
  ['Açık konular çözülenlerden önce listeleniyor', community.includes("a.resolutionStatus === 'open' ? -1 : 1")],
  ['Konu sahibi çözüm durumunu işaretleyebiliyor', community.includes('markResolved(post') && community.includes("resolutionStatus: 'resolved'")],
  ['Çözüm güncellemesi yalnız sahip veya yöneticiye açık', rules.includes('(isAdmin() || resource.data.uid == request.auth.uid)') && rules.includes('"resolutionStatus", "resolvedBy", "resolvedAt", "updatedAt"')],
  ['Forum çözüm rehberlerine bağlı', directory.includes('forum-solution-lane') && directory.includes('/bilgi-merkezi/sorun-cozme')],
  ['Çözüm durumu sahte sayaç üretmiyor', !community.includes('fake') && !community.includes('Math.random')],
];

let failed = 0;
for (const [label, passed] of checks) {
  console.log(`${passed ? 'OK' : 'FAIL'} ${label}`);
  if (!passed) failed += 1;
}
if (failed) process.exit(1);
console.log('Forum çözüm akışı denetimi geçti.');
