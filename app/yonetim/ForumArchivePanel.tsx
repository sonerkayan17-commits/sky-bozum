'use client';

import { collection, onSnapshot, type Firestore } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { archivedForumSections, publicForumKeys } from '../lib/forumTaxonomy';
import { sanitizeArticleHtml } from './RichArticleEditor';

type ArchivedPost = {
  id: string;
  title: string;
  author: string;
  body: string;
  category: string;
  subCategory: string;
  createdAt: Date | null;
};

export default function ForumArchivePanel({ db }: { db: Firestore | null }) {
  const [posts, setPosts] = useState<ArchivedPost[]>([]);
  const [error, setError] = useState('');
  const categoryCount = useMemo(() => archivedForumSections.reduce((total, section) => total + section.categories.length, 0), []);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'memberPosts'), (snapshot) => {
      const archivedPosts = snapshot.docs.map((entry) => {
        const data = entry.data();
        const sectionSlug = String(data.sectionSlug || '');
        const categorySlug = String(data.categorySlug || '');
        const key = String(data.forumKey || `${sectionSlug}/${categorySlug}`);
        return {
          id: entry.id,
          title: String(data.title || 'Başlıksız konu'),
          author: String(data.author || 'Bilinmeyen yazar'),
          body: String(data.body || ''),
          category: String(data.category || 'Eski kategori'),
          subCategory: String(data.subCategory || data.category || 'Eski kategori'),
          createdAt: data.createdAt?.toDate?.() ?? null,
          isArchived: !publicForumKeys.includes(key),
        };
      }).filter((post) => post.isArchived).map((post) => ({
        id: post.id,
        title: post.title,
        author: post.author,
        body: post.body,
        category: post.category,
        subCategory: post.subCategory,
        createdAt: post.createdAt,
      })).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      setPosts(archivedPosts);
      setError('');
    }, (nextError) => setError(nextError.message));
  }, [db]);

  return <section className="admin-section forum-archive-panel">
    <div className="admin-section-head"><div><span>ADMIN-ONLY FORUM ARŞİVİ</span><h2>Arşivlenmiş Forumlar</h2></div><p>Eski taksonomi ve konular silinmedi. Public forum yalnızca aktif Sky Bozum bölümlerini kullanır.</p></div>
    <div className="forum-archive-metrics"><article><strong>{archivedForumSections.length}</strong><span>arşiv ana bölüm</span></article><article><strong>{categoryCount}</strong><span>arşiv alt kategori</span></article><article><strong>{posts.length}</strong><span>korunan eski konu</span></article></div>
    <p className="forum-archive-note">Bu alan yalnızca mevcut Firebase admin yetkisi ile okunur. Bir kategoriyi yeniden public yapmak için merkezi taksonomi ve güvenlik izinleri birlikte güncellenmelidir.</p>
    {error && <p className="admin-error">{error}</p>}
    <div className="forum-archive-taxonomy"><h3>Arşiv kategorileri</h3>{archivedForumSections.map((section) => <details key={section.slug}><summary><strong>{section.title}</strong><span>{section.categories.length} alt kategori</span></summary><div>{section.categories.map((category) => <span key={category}>{category}</span>)}</div></details>)}</div>
    <div className="forum-archive-posts"><h3>Korunan eski konular</h3>{posts.length ? posts.map((post) => <details key={post.id}><summary><div><strong>{post.title}</strong><span>{post.category} › {post.subCategory} · {post.author}</span></div><time>{post.createdAt?.toLocaleDateString('tr-TR') || 'Tarih kaydı yok'}</time></summary><div className="forum-archive-post-body" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(post.body) }} /></details>) : <p>Firestore’da eski kategoriye bağlı konu kaydı bulunmuyor.</p>}</div>
  </section>;
}
