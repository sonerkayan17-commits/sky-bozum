'use client';

import { collection, doc, onSnapshot, serverTimestamp, updateDoc, type Firestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type ForumPost = { id: string; title: string; author: string; body: string; status: string; visibility: string; createdAt: Date | null };

export default function ForumModerationPanel({ db, actorId }: { db: Firestore | null; actorId: string }) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'archived'>('all');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'memberPosts'), (snapshot) => {
      setPosts(snapshot.docs.map((entry) => {
        const data = entry.data();
        return { id: entry.id, title: String(data.title || 'Başlıksız konu'), author: String(data.author || 'Bilinmeyen'), body: String(data.body || ''), status: String(data.status || 'unknown'), visibility: String(data.visibility || 'unknown'), createdAt: data.createdAt?.toDate?.() ?? null };
      }).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)));
    }, () => setNotice('Forum kayıtları okunamadı.'));
  }, [db]);

  const visible = posts.filter((post) => filter === 'all' || post.status === filter);
  async function changeStatus(post: ForumPost, status: 'published' | 'archived') {
    if (!db) return;
    await updateDoc(doc(db, 'memberPosts', post.id), { status, visibility: status === 'published' ? 'public' : 'archived', moderatedBy: actorId, moderatedAt: serverTimestamp() });
    await updateDoc(doc(db, 'memberPosts', post.id), { updatedAt: serverTimestamp() });
    setNotice(`“${post.title}” ${status === 'published' ? 'yayına alındı' : 'arşivlendi'}.`);
  }

  return <section className="admin-section">
    <div className="admin-section-head"><div><span>FORUM MODERASYONU</span><h2>Aktif konu yönetimi</h2></div><p>Yayınlanan veya arşivlenen topluluk konularını inceleyin. Arşivlenen kayıtlar silinmez.</p></div>
    {notice && <p className="admin-success admin-notice">{notice}</p>}
    <div className="admin-filterbar"><select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">Tüm konular</option><option value="published">Yayında</option><option value="archived">Arşiv</option></select><span>{visible.length} konu</span></div>
    <div className="admin-comments">{visible.length ? visible.map((post) => <article key={post.id}><div><span className={`admin-status ${post.status === 'published' ? 'status-approved' : 'status-rejected'}`}>{post.status}</span><strong>{post.title} · {post.author}</strong><p>{post.body.slice(0, 240)}{post.body.length > 240 ? '…' : ''}</p><small>{post.createdAt?.toLocaleDateString('tr-TR') || 'Tarih kaydı yok'}</small></div><div>{post.status !== 'published' && <button className="admin-primary compact" onClick={() => void changeStatus(post, 'published')}>Yayınla</button>}{post.status !== 'archived' && <button className="admin-danger" onClick={() => void changeStatus(post, 'archived')}>Arşivle</button>}</div></article>) : <p className="admin-empty">Bu filtrede konu bulunmuyor.</p>}</div>
  </section>;
}
