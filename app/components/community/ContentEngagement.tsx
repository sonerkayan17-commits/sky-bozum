'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { createPendingComment, getOrCreateVisitorId, registerEngagement, subscribeToApprovedCommentsForService, subscribeToEngagementCountsForTarget, type PublicComment } from '../../lib/comments';
import { getFirebaseClient } from '../../lib/firebase';
import { isBookmarked, removeBookmark, saveBookmark } from '../../lib/bookmarks';
import { recordMemberActivity } from '../../lib/memberProgress';
import { followContent, likeComment, notify } from '../../lib/social';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';

type Props = { targetId: string; title: string; kind?: 'article' | 'topic' };

export default function ContentEngagement({ targetId, title, kind = 'article' }: Props) {
  const [client, setClient] = useState<ReturnType<typeof getFirebaseClient>>({ auth: null, db: null });
  const { auth, db } = client;
  const service = `${kind}:${targetId}`.slice(0, 100);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [replyTarget, setReplyTarget] = useState<PublicComment | null>(null);
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [reportedCommentIds, setReportedCommentIds] = useState<string[]>([]);
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>([]);
  const [likingCommentIds, setLikingCommentIds] = useState<string[]>([]);
  const [editingComment, setEditingComment] = useState<PublicComment | null>(null);
  const [editCommentText, setEditCommentText] = useState('');

  useEffect(() => setClient(getFirebaseClient()), []);

  useEffect(() => auth ? onAuthStateChanged(auth, async (nextUser) => { setUser(nextUser); if (nextUser?.displayName) setAuthor(nextUser.displayName); if (nextUser) { const token = await nextUser.getIdTokenResult(); setIsAdmin(token.claims.admin === true || nextUser.email === 'sonerkayan17@gmail.com'); } else setIsAdmin(false); }) : undefined, [auth]);

  useEffect(() => {
    if (!db) return;
    const visitorId = getOrCreateVisitorId();
    const likeIdentity = user?.uid || 'guest';
    setLiked(localStorage.getItem(`sky-liked:${service}:${likeIdentity}`) === '1');
    if (user) isBookmarked(db, user.uid, service).then(setBookmarked).catch(() => setBookmarked(false));
    registerEngagement(db, visitorId, 'view', service).catch(() => undefined);
    const stopComments = subscribeToApprovedCommentsForService(db, service, setComments, () => undefined);
    const stopCounts = subscribeToEngagementCountsForTarget(db, service, (counts) => { setLikes(counts.likes); setViews(counts.views); }, () => undefined);
    return () => { stopComments(); stopCounts(); };
  }, [db, service, user]);

  useEffect(() => db ? onSnapshot(collection(db, 'publicProfiles'), (snapshot) => { const next: Record<string,string> = {}; snapshot.docs.forEach((item) => { const avatar = String(item.data().avatar || ''); if (avatar) next[item.id] = avatar; }); setAvatars(next); }) : undefined, [db]);

  async function likeAndBump() {
    if (!db || liked) return;
    setBusy(true);
    try {
      await registerEngagement(db, getOrCreateVisitorId(), 'like', service);
      if (user) await recordMemberActivity(db, user.uid, 'like', service, title, window.location.pathname).catch(() => undefined);
      localStorage.setItem(`sky-liked:${service}:${user?.uid || 'guest'}`, '1');
      setLiked(true);
      setNotice('Beğeniniz kaydedildi; konu topluluk sıralamasında öne çıktı.');
    } catch { setNotice('Beğeni kaydedilemedi. Lütfen tekrar deneyin.'); }
    finally { setBusy(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || author.trim().length < 2 || message.trim().length < 3) return;
    setBusy(true);
    try {
      await createPendingComment(db, { parentId: replyTarget?.id ?? null, author: author.trim(), uid: user?.uid ?? null, service, message: message.trim(), status: user ? 'approved' : 'pending' });
      if (user) await recordMemberActivity(db, user.uid, 'comment', service, title, window.location.pathname).catch(() => undefined);
      if (user && replyTarget?.uid) await notify(db, user.uid, replyTarget.uid, 'reply', `${author.trim()} yorumunuza yanıt verdi.`, window.location.pathname).catch(() => undefined);
      setMessage('');
      setReplyTarget(null);
      setNotice(user ? 'Yorumunuz yayınlandı.' : 'Yorumunuz yönetici onayına gönderildi.');
    } catch { setNotice('İşlem tamamlanamadı. Lütfen tekrar deneyin.'); }
    finally { setBusy(false); }
  }

  async function shareContent() {
    try {
      if (navigator.share) await navigator.share({ title, text: `${title} başlığına göz atın`, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setNotice('Bağlantı panoya kopyalandı.'); }
      if (user && db) await recordMemberActivity(db, user.uid, 'share', service, title, window.location.pathname).catch(() => undefined);
    } catch {}
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice('Konu bağlantısı panoya kopyalandı.');
    } catch { setNotice('Bağlantı kopyalanamadı.'); }
  }

  async function toggleBookmark() {
    if (!user || !db) { window.location.assign('/giris'); return; }
    try {
      if (bookmarked) await removeBookmark(db, user.uid, service);
      else await saveBookmark(db, user.uid, service, title, window.location.pathname);
      setBookmarked(!bookmarked);
      setNotice(bookmarked ? 'İçerik kaydedilenlerden çıkarıldı.' : 'İçerik kişisel arşivinize kaydedildi.');
    } catch { setNotice('Kaydetme işlemi tamamlanamadı.'); }
  }

  async function reportComment(comment: PublicComment) {
    if (!user || !db || reportedCommentIds.includes(comment.id)) return;
    try {
      await addDoc(collection(db, 'contentReports'), {
        targetType: 'comment',
        targetId: comment.id,
        reporterId: user.uid,
        reason: 'Topluluk kurallarına aykırı yorum bildirimi',
        status: 'open',
        createdAt: serverTimestamp(),
      });
      setReportedCommentIds((ids) => [...ids, comment.id]);
    } catch { setNotice('Yorum bildirilemedi.'); }
  }

  async function likeMemberComment(comment: PublicComment) {
    if (!user || !db || !comment.uid || comment.uid === user.uid || likedCommentIds.includes(comment.id) || likingCommentIds.includes(comment.id)) return;
    setLikingCommentIds((ids) => [...ids, comment.id]);
    try {
      const created = await likeComment(db, user.uid, comment.id, comment.uid, user.displayName || 'Bir üye');
      setLikedCommentIds((ids) => ids.includes(comment.id) ? ids : [...ids, comment.id]);
      setNotice(created ? 'Yorum beğenildi.' : 'Bu yorumu zaten beğendiniz.');
    } catch {
      setNotice('Yorum beğenilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLikingCommentIds((ids) => ids.filter((id) => id !== comment.id));
    }
  }

  function startCommentEdit(comment: PublicComment) {
    setEditingComment(comment);
    setEditCommentText(comment.message);
  }

  async function saveCommentEdit() {
    if (!db || !isAdmin || !editingComment) return;
    const messageText = editCommentText.trim();
    if (messageText.length < 3 || messageText.length > 600) { setNotice('Yorum 3-600 karakter arasında olmalı.'); return; }
    await updateDoc(doc(db, 'comments', editingComment.id), { message: messageText, editedBy: user?.uid, editedAt: serverTimestamp() });
    await addDoc(collection(db, 'contentAudit'), { action: 'comment:inline-edited', articleSlug: editingComment.id, actorId: user?.uid, createdAt: serverTimestamp() }).catch(() => undefined);
    setEditingComment(null);
    setNotice('Yorum güncellendi.');
  }

  async function removeComment(comment: PublicComment) {
    if (!db || !isAdmin) return;
    await deleteDoc(doc(db, 'comments', comment.id));
    await addDoc(collection(db, 'contentAudit'), { action: 'comment:inline-removed', articleSlug: comment.id, actorId: user?.uid, createdAt: serverTimestamp() }).catch(() => undefined);
    setNotice('Yorum kaldırıldı.');
  }

  function quote(comment: PublicComment) {
    setMessage(`“${comment.message.slice(0, 180)}”\n\n`);
    setReplyTarget(comment);
    window.setTimeout(() => document.getElementById(`comment-${targetId}`)?.focus(), 0);
  }

  const actionClass = 'focus-ring inline-flex min-h-9 items-center rounded-lg border border-white/10 px-3 text-xs font-bold text-slate-300 transition hover:border-rose-400/40 hover:text-rose-300';

  return <section className="my-10 overflow-hidden rounded-2xl border border-white/10 bg-[#10131b]" aria-labelledby={`community-${targetId}`}>
    <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div><p className="text-[11px] font-black uppercase tracking-[.18em] text-rose-400">Topluluk</p><h2 id={`community-${targetId}`} className="mt-2 text-xl font-black">{title} hakkında konuşun</h2></div>
      <span className="self-start rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-400">◉ {views} görüntülenme</span>
    </div>

    <nav className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-black/15 px-4 py-2" aria-label="Konu işlemleri">
      <button type="button" onClick={likeAndBump} disabled={busy || liked} aria-pressed={liked} className={`${actionClass} disabled:text-rose-400`}>{liked ? '♥ Beğenildi' : '♡ Beğen'} <span className="ml-1 text-slate-500">{likes}</span></button>
      <button type="button" onClick={copyLink} className={actionClass}>Kopyala</button>
      <button type="button" onClick={() => void toggleBookmark()} className={actionClass}>{bookmarked ? '★ Kaydedildi' : '☆ Kaydet'}</button>
      <button type="button" onClick={shareContent} className={actionClass}>↗ Paylaş</button>
      <button type="button" onClick={() => document.getElementById(`comment-${targetId}`)?.focus()} className={actionClass}>✎ Yorum yap</button>
      {user ? <button type="button" onClick={() => followContent(db!, user.uid, service, title, window.location.pathname).then((created) => setNotice(created ? 'Konu aboneliklerinize eklendi.' : 'Bu konuyu zaten takip ediyorsunuz.')).catch(() => setNotice('Takip kaydı oluşturulamadı.'))} className={actionClass}>⌁ Takip et</button> : <Link href="/giris" className={actionClass}>⌁ Takip et</Link>}
      <span className="ml-auto hidden text-[11px] font-bold text-slate-600 sm:inline">Beğeniler konuyu üste çıkarır</span>
    </nav>

    <div className="space-y-3 p-5 sm:p-6">
      <h3 className="text-sm font-black text-white">Yorumlar ({comments.length})</h3>
      {comments.length ? comments.map((comment, index) => <article key={comment.id} className="overflow-hidden rounded-xl border border-white/8 bg-white/[.025]">
        <header className="flex items-center gap-3 border-b border-white/8 bg-white/[.025] px-4 py-2">{comment.uid&&avatars[comment.uid]?<span className="h-8 w-8 rounded-full bg-cover bg-center" style={{backgroundImage:`url(${avatars[comment.uid]})`}}/>:<span className="grid h-8 w-8 place-items-center rounded-full bg-rose-500/15 text-[10px] font-black text-rose-300">{comment.author.charAt(0).toUpperCase()}</span>}{comment.uid ? <Link href={`/uyeler/${comment.uid}`} className="text-xs font-bold text-white hover:text-rose-300">{comment.author}</Link> : <strong className="text-xs text-white">{comment.author}</strong>}<time className="text-[10px] text-slate-600">{comment.createdAt?.toLocaleDateString('tr-TR') ?? 'Yeni'}</time><span className="ml-auto text-[10px] font-black text-slate-600">#{index + 1}</span></header>
        <p className="px-4 py-4 text-sm leading-7 text-slate-300">{comment.message}</p>{isAdmin && <div className="flex justify-end gap-2 border-t border-white/8 px-3 py-2"><button type="button" onClick={() => startCommentEdit(comment)} className="focus-ring rounded-md border border-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-rose-300">Düzenle</button><button type="button" onClick={() => void removeComment(comment)} className="focus-ring rounded-md border border-rose-400/30 px-3 py-1.5 text-[11px] font-bold text-rose-300 hover:bg-rose-500/10">Kaldır</button></div>}
        <footer className="flex justify-end gap-2 border-t border-white/8 px-3 py-2">{user && comment.uid && comment.uid !== user.uid ? <button type="button" onClick={() => void likeMemberComment(comment)} disabled={likedCommentIds.includes(comment.id) || likingCommentIds.includes(comment.id)} className="focus-ring rounded-md border border-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-rose-300 disabled:text-rose-300">{likedCommentIds.includes(comment.id) ? '♥ Beğenildi' : likingCommentIds.includes(comment.id) ? 'Beğeniliyor…' : '♡ Beğen'}</button> : null}{user ? <button type="button" onClick={() => quote(comment)} className="focus-ring rounded-md border border-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-rose-300">❝ Alıntıla</button> : <Link href="/giris" className="focus-ring rounded-md border border-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-rose-300">❝ Alıntıla</Link>}{user && comment.uid !== user.uid ? <button type="button" onClick={() => void reportComment(comment)} disabled={reportedCommentIds.includes(comment.id)} className="focus-ring rounded-md border border-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:text-rose-300">{reportedCommentIds.includes(comment.id) ? 'Bildirildi' : 'Bildir'}</button> : null}</footer>
      </article>) : <p className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-slate-500">İlk yorumu siz yazın.</p>}
    </div>

    {!user ? <div className="border-t border-white/10 bg-black/10 p-5 text-center"><p className="text-sm font-bold text-slate-300">Misafir yorumları yönetici onayından sonra görünür. Üyeler ise doğrudan paylaşabilir.</p><div className="mt-4 flex justify-center gap-2"><Link href="/giris" className="focus-ring rounded-lg bg-rose-600 px-4 py-2 text-xs font-black text-white">Giriş yap</Link><Link href="/kayit" className="focus-ring rounded-lg border border-white/15 px-4 py-2 text-xs font-black text-slate-200">Üye ol</Link></div></div> : null}

    <form onSubmit={submit} className="border-t border-white/10 bg-black/10 p-6 sm:p-8">
      <h3 className="text-lg font-black">Yorum ekle</h3><p className="mt-2 text-xs text-slate-500">{user ? 'Üye yorumunuz doğrudan yayınlanır.' : 'Misafir yorumunuz yönetici onayına gönderilir.'}</p>
      <label className="mt-5 block text-xs font-bold text-slate-300">Adınız<input required minLength={2} maxLength={40} value={author} onChange={(event) => setAuthor(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#090b10] px-4 text-sm text-white outline-none focus:border-rose-400" /></label>
      <label className="mt-4 block text-xs font-bold text-slate-300">Yorumunuz<textarea id={`comment-${targetId}`} required minLength={3} maxLength={600} rows={5} value={message} onChange={(event) => setMessage(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#090b10] p-4 text-sm text-white outline-none focus:border-rose-400" /></label>
      <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => { setMessage(''); setReplyTarget(null); }} className="focus-ring min-h-10 rounded-lg border border-white/10 px-4 text-xs font-bold text-slate-400">Temizle</button><button disabled={busy} className="focus-ring min-h-10 rounded-lg bg-rose-600 px-5 text-xs font-black text-white disabled:opacity-60">{busy ? 'Kaydediliyor…' : 'Yorumu gönder'}</button></div>
    </form>
    {notice ? <p aria-live="polite" className="border-t border-white/10 px-5 py-3 text-xs text-rose-200">{notice}</p> : null}
    {editingComment ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"><section className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#11131b] p-6" role="dialog" aria-modal="true" aria-label="Yorum düzenle"><h3 className="text-lg font-black text-white">Yorumu düzenle</h3><textarea value={editCommentText} onChange={(event) => setEditCommentText(event.target.value)} maxLength={600} rows={6} className="mt-4 w-full rounded-xl border border-white/10 bg-[#090b10] p-4 text-sm text-white outline-none focus:border-rose-400" /><div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setEditingComment(null)} className="rounded-lg border border-white/10 px-4 py-2 text-xs font-bold text-slate-300">Vazgeç</button><button type="button" onClick={() => void saveCommentEdit()} className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-black text-white">Kaydet</button></div></section></div> : null}
  </section>;
}
