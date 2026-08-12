'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { createPendingComment, getOrCreateVisitorId, registerEngagement, subscribeToApprovedComments, subscribeToEngagementCounts, type PublicComment } from '../../lib/comments';
import { getFirebaseClient } from '../../lib/firebase';
import { recordMemberActivity } from '../../lib/memberProgress';
import { followContent, likeComment, notify } from '../../lib/social';

type Props = { targetId: string; title: string; kind?: 'article' | 'topic' };

export default function ContentEngagement({ targetId, title, kind = 'article' }: Props) {
  const { auth, db } = useMemo(() => getFirebaseClient(), []);
  const service = `${kind}:${targetId}`.slice(0, 100);
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [liked, setLiked] = useState(false);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [replyTarget, setReplyTarget] = useState<PublicComment | null>(null);

  useEffect(() => auth ? onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); if (nextUser?.displayName) setAuthor(nextUser.displayName); }) : undefined, [auth]);

  useEffect(() => {
    if (!db) return;
    const visitorId = getOrCreateVisitorId();
    setLiked(localStorage.getItem(`sky-liked:${service}`) === '1');
    registerEngagement(db, visitorId, 'view', service).catch(() => undefined);
    const stopComments = subscribeToApprovedComments(db, (items) => setComments(items.filter((item) => item.service === service)), () => undefined);
    const stopCounts = subscribeToEngagementCounts(db, (counts) => { setLikes(counts.likes[service] ?? 0); setViews(counts.views[service] ?? 0); }, () => undefined);
    return () => { stopComments(); stopCounts(); };
  }, [db, service]);

  async function likeAndBump() {
    if (!db || liked) return;
    setBusy(true);
    try {
      await registerEngagement(db, getOrCreateVisitorId(), 'like', service);
      if (user) await recordMemberActivity(db, user.uid, 'like', service).catch(() => undefined);
      localStorage.setItem(`sky-liked:${service}`, '1');
      setLiked(true);
      setNotice('Beğeniniz kaydedildi; konu topluluk sıralamasında öne çıktı.');
    } finally { setBusy(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !db || author.trim().length < 2 || message.trim().length < 3) return;
    setBusy(true);
    try {
      await createPendingComment(db, { parentId: replyTarget?.id ?? null, author: author.trim(), uid: user.uid, service, message: message.trim(), status: 'approved' });
      await recordMemberActivity(db, user.uid, 'comment', service).catch(() => undefined);
      if (replyTarget?.uid) await notify(db, user.uid, replyTarget.uid, 'reply', `${author.trim()} yorumunuza yanıt verdi.`, window.location.pathname).catch(() => undefined);
      setMessage('');
      setShowComposer(false);
      setReplyTarget(null);
      setNotice('Yorumunuz yayınlandı.');
    } catch { setNotice('İşlem tamamlanamadı. Lütfen tekrar deneyin.'); }
    finally { setBusy(false); }
  }

  async function shareContent() {
    try {
      if (navigator.share) await navigator.share({ title, text: `${title} başlığına göz atın`, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setNotice('Bağlantı panoya kopyalandı.'); }
      if (user && db) await recordMemberActivity(db, user.uid, 'share', service).catch(() => undefined);
    } catch {}
  }

  function quote(comment: PublicComment) {
    setMessage(`“${comment.message.slice(0, 180)}”\n\n`);
    setShowComposer(true);
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
      <button type="button" onClick={shareContent} className={actionClass}>↗ Paylaş</button>
      {user ? <button type="button" onClick={() => setShowComposer(true)} className={actionClass}>✎ Yorum yap</button> : <Link href="/giris" className={actionClass}>✎ Yorum yap</Link>}
      {user ? <button type="button" onClick={() => followContent(db!, user.uid, service, title, window.location.pathname).then(() => setNotice('Konu aboneliklerinize eklendi.')).catch(() => setNotice('Konu zaten takip listenizde.'))} className={actionClass}>⌁ Takip et</button> : null}
      <span className="ml-auto hidden text-[11px] font-bold text-slate-600 sm:inline">Beğeniler konuyu üste çıkarır</span>
    </nav>

    <div className="space-y-3 p-5 sm:p-6">
      <h3 className="text-sm font-black text-white">Yorumlar ({comments.length})</h3>
      {comments.length ? comments.map((comment, index) => <article key={comment.id} className="overflow-hidden rounded-xl border border-white/8 bg-white/[.025]">
        <header className="flex items-center gap-3 border-b border-white/8 bg-white/[.025] px-4 py-2">{comment.uid ? <Link href={`/uyeler/${comment.uid}`} className="text-xs font-bold text-white hover:text-rose-300">{comment.author}</Link> : <strong className="text-xs text-white">{comment.author}</strong>}<time className="text-[10px] text-slate-600">{comment.createdAt?.toLocaleDateString('tr-TR') ?? 'Yeni'}</time><span className="ml-auto text-[10px] font-black text-slate-600">#{index + 1}</span></header>
        <p className="px-4 py-4 text-sm leading-7 text-slate-300">{comment.message}</p>
        <footer className="flex justify-end gap-2 border-t border-white/8 px-3 py-2">{user && comment.uid && comment.uid !== user.uid ? <button type="button" onClick={() => likeComment(db!, user.uid, comment.id, comment.uid!, user.displayName || 'Bir üye').then(()=>setNotice('Yorum beğenildi.')).catch(()=>setNotice('Bu yorumu daha önce beğendiniz.'))} className="focus-ring rounded-md border border-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-rose-300">♡ Beğen</button> : null}{user ? <button type="button" onClick={() => quote(comment)} className="focus-ring rounded-md border border-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-rose-300">❝ Alıntıla</button> : <Link href="/giris" className="focus-ring rounded-md border border-white/10 px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-rose-300">❝ Alıntıla</Link>}</footer>
      </article>) : <p className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-slate-500">İlk yorumu siz yazın.</p>}
    </div>

    {!user ? <div className="border-t border-white/10 bg-black/10 p-5 text-center"><p className="text-sm font-bold text-slate-300">Yorum yapmak veya alıntılamak için üye hesabınızı kullanın.</p><div className="mt-4 flex justify-center gap-2"><Link href="/giris" className="focus-ring rounded-lg bg-rose-600 px-4 py-2 text-xs font-black text-white">Giriş yap</Link><Link href="/kayit" className="focus-ring rounded-lg border border-white/15 px-4 py-2 text-xs font-black text-slate-200">Üye ol</Link></div></div> : null}

    {user && showComposer ? <form onSubmit={submit} className="border-t border-white/10 bg-black/10 p-6 sm:p-8">
      <h3 className="text-lg font-black">Yorum ekle</h3><p className="mt-2 text-xs text-slate-500">Üye yorumunuz doğrudan yayınlanır.</p>
      <label className="mt-5 block text-xs font-bold text-slate-300">Adınız<input required minLength={2} maxLength={40} value={author} onChange={(event) => setAuthor(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#090b10] px-4 text-sm text-white outline-none focus:border-rose-400" /></label>
      <label className="mt-4 block text-xs font-bold text-slate-300">Yorumunuz<textarea id={`comment-${targetId}`} required minLength={3} maxLength={600} rows={5} value={message} onChange={(event) => setMessage(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#090b10] p-4 text-sm text-white outline-none focus:border-rose-400" /></label>
      <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setShowComposer(false)} className="focus-ring min-h-10 rounded-lg border border-white/10 px-4 text-xs font-bold text-slate-400">Vazgeç</button><button disabled={busy} className="focus-ring min-h-10 rounded-lg bg-rose-600 px-5 text-xs font-black text-white disabled:opacity-60">{busy ? 'Kaydediliyor…' : 'Yorumu gönder'}</button></div>
    </form> : null}
    {notice ? <p aria-live="polite" className="border-t border-white/10 px-5 py-3 text-xs text-rose-200">{notice}</p> : null}
  </section>;
}
