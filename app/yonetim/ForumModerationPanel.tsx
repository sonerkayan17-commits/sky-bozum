'use client';

import { addDoc, collection, doc, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where, type Firestore } from 'firebase/firestore';
import { useEffect, useState, type FormEvent } from 'react';
import RichArticleEditor, { sanitizeArticleHtml } from './RichArticleEditor';

type ForumPost = { id: string; title: string; author: string; body: string; status: string; visibility: string; locked: boolean; createdAt: Date | null };
type ContentReport = { id: string; targetType: string; targetId: string; reason: string; status: string; createdAt: Date | null };
type ForumRevision = { id: string; title: string; body: string; createdAt: Date | null };

export default function ForumModerationPanel({ db, actorId }: { db: Firestore | null; actorId: string }) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'archived'>('all');
  const [notice, setNotice] = useState('');
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [editing, setEditing] = useState<ForumPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [revisions, setRevisions] = useState<ForumRevision[]>([]);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'memberPosts'), (snapshot) => {
      setPosts(snapshot.docs.map((entry) => {
        const data = entry.data();
        return { id: entry.id, title: String(data.title || 'Başlıksız konu'), author: String(data.author || 'Bilinmeyen'), body: String(data.body || ''), status: String(data.status || 'unknown'), visibility: String(data.visibility || 'unknown'), locked: data.locked === true, createdAt: data.createdAt?.toDate?.() ?? null };
      }).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)));
    }, () => setNotice('Forum kayıtları okunamadı.'));
  }, [db]);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'contentReports'), (snapshot) => {
      setReports(snapshot.docs.map((entry) => { const data = entry.data(); return { id: entry.id, targetType: String(data.targetType || 'content'), targetId: String(data.targetId || ''), reason: String(data.reason || ''), status: String(data.status || 'open'), createdAt: data.createdAt?.toDate?.() ?? null }; }).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)));
    }, () => setNotice('Raporlar okunamadı.'));
  }, [db]);

  const visible = posts.filter((post) => filter === 'all' || post.status === filter);
  async function changeStatus(post: ForumPost, status: 'published' | 'archived') {
    if (!db) return;
    await updateDoc(doc(db, 'memberPosts', post.id), { status, visibility: status === 'published' ? 'public' : 'archived', moderatedBy: actorId, moderatedAt: serverTimestamp() });
    await updateDoc(doc(db, 'memberPosts', post.id), { updatedAt: serverTimestamp() });
    setNotice(`“${post.title}” ${status === 'published' ? 'yayına alındı' : 'arşivlendi'}.`);
  }

  async function startEditing(post: ForumPost) {
    setEditing(post);
    setEditTitle(post.title);
    setEditBody(post.body);
    setNotice('');
    if (db) {
      const snapshot = await getDocs(query(collection(db, 'forumPostRevisions'), where('postId', '==', post.id)));
      setRevisions(snapshot.docs.map((entry) => ({ id: entry.id, title: String(entry.data().title || ''), body: String(entry.data().body || ''), createdAt: entry.data().createdAt?.toDate?.() ?? null })).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)));
    }
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !editing) return;
    const title = editTitle.trim();
    const body = sanitizeArticleHtml(editBody);
    const plain = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (title.length < 5 || title.length > 100 || plain.length < 10) {
      setNotice('Başlık 5-100 karakter, konu metni en az 10 karakter olmalıdır.');
      return;
    }
    try {
      await addDoc(collection(db, 'forumPostRevisions'), { postId: editing.id, title: editing.title, body: editing.body, status: editing.status, visibility: editing.visibility, editedBy: actorId, createdAt: serverTimestamp() });
      await updateDoc(doc(db, 'memberPosts', editing.id), { title, body, updatedAt: serverTimestamp(), editedBy: actorId, editedAt: serverTimestamp() });
      await addDoc(collection(db, 'contentAudit'), { action: 'forum:edited', articleSlug: editing.id, actorId, createdAt: serverTimestamp() });
      setEditing(null);
      setNotice(`“${title}” konusu güncellendi.`);
    } catch {
      setNotice('Konu güncellenemedi. Yetki ve bağlantıyı kontrol edin.');
    }
  }

  async function resolveReport(report: ContentReport) {
    if (!db) return;
    await updateDoc(doc(db, 'contentReports', report.id), { status: 'resolved', resolvedBy: actorId, resolvedAt: serverTimestamp() });
    await addDoc(collection(db, 'contentAudit'), { action: 'forum:report-resolved', articleSlug: report.targetId, actorId, createdAt: serverTimestamp() });
    setNotice('İçerik raporu kapatıldı.');
  }

  async function toggleLock(post: ForumPost) {
    if (!db) return;
    const locked = !post.locked;
    await updateDoc(doc(db, 'memberPosts', post.id), { locked, lockedBy: actorId, lockedAt: serverTimestamp() });
    await addDoc(collection(db, 'contentAudit'), { action: `forum:${locked ? 'locked' : 'unlocked'}`, articleSlug: post.id, actorId, createdAt: serverTimestamp() });
    setNotice(`“${post.title}” ${locked ? 'kilitlendi' : 'kilidi açıldı'}.`);
  }

  async function restoreRevision(revision: ForumRevision) {
    if (!db || !editing) return;
    await updateDoc(doc(db, 'memberPosts', editing.id), { title: revision.title, body: revision.body, updatedAt: serverTimestamp(), editedBy: actorId, editedAt: serverTimestamp() });
    await addDoc(collection(db, 'contentAudit'), { action: 'forum:restored', articleSlug: editing.id, actorId, createdAt: serverTimestamp() });
    setEditTitle(revision.title);
    setEditBody(revision.body);
    setNotice('Seçilen eski sürüm geri yüklendi.');
  }

  return <section className="admin-section">
    <div className="admin-section-head"><div><span>FORUM MODERASYONU</span><h2>Aktif konu yönetimi</h2></div><p>Yayınlanan veya arşivlenen topluluk konularını inceleyin. Arşivlenen kayıtlar silinmez.</p></div>
    {notice && <p className="admin-success admin-notice">{notice}</p>}
    <div className="admin-filterbar"><select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">Tüm konular</option><option value="published">Yayında</option><option value="archived">Arşiv</option></select><span>{visible.length} konu</span></div>
    {reports.filter((report) => report.status === 'open').length > 0 && <section className="admin-comments"><h3>Açık içerik raporları ({reports.filter((report) => report.status === 'open').length})</h3>{reports.filter((report) => report.status === 'open').map((report) => <article key={report.id}><div><strong>{report.targetType === 'comment' ? 'Yorum' : 'Konu'}: {report.targetId}</strong><p>{report.reason}</p><small>{report.createdAt?.toLocaleDateString('tr-TR') || 'Yeni rapor'}</small></div><button className="admin-secondary compact" onClick={() => void resolveReport(report)}>Raporu kapat</button></article>)}</section>}
    <div className="admin-comments">{visible.length ? visible.map((post) => <article key={post.id}><div><span className={`admin-status ${post.status === 'published' ? 'status-approved' : 'status-rejected'}`}>{post.status}{post.locked ? ' · kilitli' : ''}</span><strong>{post.title} · {post.author}</strong><p>{post.body.slice(0, 240)}{post.body.length > 240 ? '…' : ''}</p><small>{post.createdAt?.toLocaleDateString('tr-TR') || 'Tarih kaydı yok'}</small></div><div><button className="admin-secondary compact" onClick={() => void toggleLock(post)}>{post.locked ? 'Kilidi aç' : 'Kilitle'}</button><button className="admin-secondary compact" onClick={() => void startEditing(post)} disabled={post.locked}>Düzenle</button>{post.status !== 'published' && <button className="admin-primary compact" onClick={() => void changeStatus(post, 'published')}>Yayınla</button>}{post.status !== 'archived' && <button className="admin-danger" onClick={() => void changeStatus(post, 'archived')}>Arşivle</button>}</div></article>) : <p className="admin-empty">Bu filtrede konu bulunmuyor.</p>}</div>
    {editing && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal admin-content-modal" role="dialog" aria-modal="true" aria-labelledby="forum-edit-title"><button className="admin-close" onClick={() => setEditing(null)} aria-label="Düzenlemeyi kapat">×</button><span>FORUM DÜZENLEME</span><h2 id="forum-edit-title">Konuyu düzenle</h2><form onSubmit={(event) => void saveEdit(event)}><label>Konu başlığı<input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} minLength={5} maxLength={100} required /></label><label>Mesaj içeriği<RichArticleEditor value={editBody} onChange={setEditBody} /></label>{revisions.length > 0 && <details><summary>{revisions.length} eski sürümü görüntüle</summary><div className="admin-comments">{revisions.map((revision) => <article key={revision.id}><div><strong>{revision.title}</strong><small>{revision.createdAt?.toLocaleDateString('tr-TR') || 'Tarih yok'}</small></div><button type="button" className="admin-secondary compact" onClick={() => void restoreRevision(revision)}>Bu sürümü yükle</button></article>)}</div></details>}<div className="admin-modal-actions"><button className="admin-primary" type="submit">Değişiklikleri kaydet</button><button type="button" onClick={() => setEditing(null)}>Vazgeç</button></div></form></section></div>}
  </section>;
}
