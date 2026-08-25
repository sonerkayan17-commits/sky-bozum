'use client';

import { collection, onSnapshot, query, where, type Firestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { restoreManagedArticleRevision, type ContentArticleDraft, type ContentRevision } from '../lib/contentAdmin';
import './article-revision-history.css';

type RevisionDocument = Omit<ContentRevision, 'id' | 'createdAt'> & {
  createdAt?: { toDate?: () => Date };
};

function formatDate(date: Date | null) {
  return date ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date) : 'Tarih kaydı yok';
}

export default function ArticleRevisionHistory({
  db,
  articleSlug,
  actorId,
  onRestore,
}: {
  db: Firestore | null;
  articleSlug: string;
  actorId: string;
  onRestore: (article: ContentArticleDraft) => void;
}) {
  const [revisions, setRevisions] = useState<ContentRevision[]>([]);
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    if (!db || !articleSlug) return;
    return onSnapshot(query(collection(db, 'contentRevisions'), where('articleSlug', '==', articleSlug)), (snapshot) => {
      setRevisions(snapshot.docs.map((entry) => {
        const data = entry.data() as RevisionDocument;
        return {
          id: entry.id,
          articleSlug: String(data.articleSlug || articleSlug),
          slug: String(data.slug || articleSlug),
          title: String(data.title || ''),
          excerpt: String(data.excerpt || ''),
          category: String(data.category || 'Genel'),
          seoTitle: String(data.seoTitle || ''),
          metaDescription: String(data.metaDescription || ''),
          cover: String(data.cover || ''),
          body: String(data.body || ''),
          keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
          serviceSlug: String(data.serviceSlug || ''),
          reviewDueAt: String(data.reviewDueAt || ''),
          status: (data.status === 'draft' || data.status === 'archived' ? data.status : 'published') as ContentRevision['status'],
          createdBy: String(data.createdBy || ''),
          createdAt: data.createdAt?.toDate?.() ?? null,
        };
      }).sort((left, right) => (right.createdAt?.getTime() || 0) - (left.createdAt?.getTime() || 0)));
    });
  }, [articleSlug, db]);

  async function restore(revision: ContentRevision) {
    if (!db || busyId || !window.confirm(`“${revision.title}” başlıklı bu sürüm geri yüklensin mi? Mevcut sürüm de önceki sürümler arasına alınır.`)) return;
    setBusyId(revision.id);
    setNotice('');
    try {
      await restoreManagedArticleRevision(db, revision, actorId);
      onRestore({
        slug: revision.articleSlug,
        title: revision.title,
        excerpt: revision.excerpt,
        category: revision.category,
        seoTitle: revision.seoTitle,
        metaDescription: revision.metaDescription,
        cover: revision.cover,
        body: revision.body,
        keywords: revision.keywords,
        serviceSlug: revision.serviceSlug,
        reviewDueAt: revision.reviewDueAt,
        status: revision.status,
      });
      setNotice('Seçilen sürüm geri yüklendi. İsterseniz önce önizleyip sonra tekrar kaydedebilirsiniz.');
    } catch {
      setNotice('Sürüm geri yüklenemedi. Yetki ve bağlantıyı kontrol edin.');
    } finally {
      setBusyId('');
    }
  }

  if (!articleSlug) return null;

  return <details className="admin-revision-history">
    <summary>Önceki sürümler {revisions.length ? `(${revisions.length})` : ''}</summary>
    <p>Her kayıttan önce önceki metin saklanır. Geri yükleme işlemi mevcut hâli de korur.</p>
    {notice && <p className="admin-success admin-notice">{notice}</p>}
    {revisions.length ? <div>
      {revisions.map((revision) => <article key={revision.id}>
        <span>{revision.status === 'published' ? 'Yayındaydı' : revision.status === 'draft' ? 'Taslak' : 'Arşivdeydi'}</span>
        <strong>{revision.title || 'Başlıksız sürüm'}</strong>
        <small>{formatDate(revision.createdAt)}</small>
        <button type="button" className="admin-secondary compact" disabled={busyId === revision.id} onClick={() => void restore(revision)}>{busyId === revision.id ? 'Yükleniyor…' : 'Bu sürümü geri yükle'}</button>
      </article>)}
    </div> : <small>Henüz geri yüklenecek eski sürüm yok. İlk düzenlemeden sonra burada görünür.</small>}
  </details>;
}
