'use client';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import PartnershipHub, { type PartnershipSubmission } from './PartnershipHub';

async function submitPartnershipApplication(submission: PartnershipSubmission) {
  if (!db || !isFirebaseConfigured) {
    throw new Error('Firebase yapılandırması aktif değil.');
  }

  const document = await addDoc(collection(db, 'partnershipApplications'), {
    ...submission,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

  return { referenceId: document.id };
}

export default function PartnershipPageClient() {
  return (
    <PartnershipHub
      privacyNoticeUrl="/gizlilik-politikasi"
      onSubmit={isFirebaseConfigured ? submitPartnershipApplication : undefined}
      unavailableMessage="Başvuru sistemi şu anda aktif değil. Kurumsal talepleriniz için İletişim sayfasındaki resmi kanalları kullanabilirsiniz."
    />
  );
}
