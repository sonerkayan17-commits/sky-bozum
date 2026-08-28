'use client';

import { doc, onSnapshot, type Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ContentEngagement from '../../../components/community/ContentEngagement';
import { getFirebaseClient } from '../../../lib/firebase';
import { forumRoutes } from '../../../lib/forumRoutes';
import { findForumCategory, findForumSection } from '../../../lib/forumTaxonomy';
import { sanitizeArticleHtml } from '../../../yonetim/RichArticleEditor';
import './member-topic.css';

type MemberTopic = {
  uid: string;
  author: string;
  title: string;
  body: string;
  sectionSlug: string;
  categorySlug: string;
  category: string;
  subCategory: string;
  resolutionStatus: 'open' | 'resolved';
  createdAt: Date | null;
  updatedAt: Date | null;
};

function toDate(value: unknown) {
  return (value as Timestamp | undefined)?.toDate?.() ?? null;
}

export default function MemberTopicDetail({ id }: { id: string }) {
  const [topic, setTopic] = useState<MemberTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db || !id) { setLoading(false); setMissing(true); return; }
    return onSnapshot(doc(db, 'memberPosts', id), (snapshot) => {
      if (!snapshot.exists()) { setTopic(null); setMissing(true); setLoading(false); return; }
      const data = snapshot.data();
      setTopic({
        uid: String(data.uid || ''),
        author: String(data.author || 'Sky Bozum üyesi'),
        title: String(data.title || 'Başlıksız konu'),
        body: String(data.body || ''),
        sectionSlug: String(data.sectionSlug || ''),
        categorySlug: String(data.categorySlug || ''),
        category: String(data.category || 'Topluluk'),
        subCategory: String(data.subCategory || data.category || 'Genel'),
        resolutionStatus: data.resolutionStatus === 'resolved' ? 'resolved' : 'open',
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      });
      setMissing(false);
      setLoading(false);
    }, () => { setLoading(false); setMissing(true); });
  }, [id]);

  const section = useMemo(() => topic ? findForumSection(topic.sectionSlug) : undefined, [topic]);
  const category = useMemo(() => topic ? findForumCategory(topic.sectionSlug, topic.categorySlug) : undefined, [topic]);

  if (loading) return <main className="member-topic-state"><p>Konu yükleniyor…</p></main>;
  if (missing || !topic) return <main className="member-topic-state"><h1>Konu bulunamadı</h1><p>Konu kaldırılmış, moderasyon bekliyor veya erişiminize kapalı olabilir.</p><Link href={forumRoutes.home}>Topluluğa dön →</Link></main>;

  const date = topic.updatedAt || topic.createdAt;
  return <main className="member-topic-page"><article>
    <nav className="member-topic-breadcrumb" aria-label="Konu yolu">
      <Link href={forumRoutes.home}>Topluluk</Link><span>/</span>
      {section ? <><Link href={forumRoutes.section(section.slug)}>{section.title}</Link><span>/</span></> : null}
      {category ? <Link href={forumRoutes.category(topic.sectionSlug, topic.categorySlug)}>{category.title}</Link> : <span>{topic.subCategory}</span>}
    </nav>
    <header>
      <div><span>ÜYE KONUSU</span><b className={topic.resolutionStatus === 'resolved' ? 'is-resolved' : 'is-open'}>{topic.resolutionStatus === 'resolved' ? '✓ Çözüldü' : 'Yanıt bekliyor'}</b></div>
      <h1>{topic.title}</h1>
      <p><Link href={`/uyeler/${topic.uid}`}>{topic.author}</Link>{date ? <time>{date.toLocaleDateString('tr-TR')}</time> : null}</p>
    </header>
    <div className="member-topic-body" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(topic.body) }} />
    <ContentEngagement targetId={`member-topic-${id}`} title={topic.title} kind="topic" />
    <footer><Link href={category ? forumRoutes.category(topic.sectionSlug, topic.categorySlug) : forumRoutes.home}>← {category?.title || 'Topluluk'} alanına dön</Link></footer>
  </article></main>;
}
