'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  createPendingComment,
  getOrCreateVisitorId,
  registerEngagement,
  subscribeToApprovedComments,
  subscribeToEngagementCounts,
  type PublicComment,
} from '../../lib/comments';
import { getFirebaseClient } from '../../lib/firebase';

type Props = {
  targetId: string;
  title: string;
  kind?: 'article' | 'topic';
};

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

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (nextUser?.displayName) setAuthor(nextUser.displayName);
    });
  }, [auth]);

  useEffect(() => {
    if (!db) return;
    const visitorId = getOrCreateVisitorId();
    setLiked(localStorage.getItem(`sky-liked:${service}`) === '1');
    registerEngagement(db, visitorId, 'view', service).catch(() => undefined);
    const stopComments = subscribeToApprovedComments(db, (items) => {
      setComments(items.filter((item) => item.service === service));
    }, () => undefined);
    const stopCounts = subscribeToEngagementCounts(db, (counts) => {
      setLikes(counts.likes[service] ?? 0);
      setViews(counts.views[service] ?? 0);
    }, () => undefined);
    return () => { stopComments(); stopCounts(); };
  }, [db, service]);

  async function likeAndBump() {
    if (!db || liked) return;
    setBusy(true);
    try {
      await registerEngagement(db, getOrCreateVisitorId(), 'like', service);
      localStorage.setItem(`sky-liked:${service}`, '1');
      setLiked(true);
      setNotice('Beğeniniz kaydedildi; konu topluluk sıralamasında öne çıktı.');
    } finally { setBusy(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || author.trim().length < 2 || message.trim().length < 3) return;
    setBusy(true);
    try {
      await createPendingComment(db, {
        author: author.trim(),
        service,
        message: message.trim(),
        status: user ? 'approved' : 'pending',
      });
      setMessage('');
      setNotice(user
        ? 'Yorumunuz yayınlandı.'
        : 'Yorumunuz alındı. Güvenlik kontrolünden sonra yayınlanacak.');
    } catch {
      setNotice('İşlem tamamlanamadı. Lütfen tekrar deneyin.');
    } finally { setBusy(false); }
  }

  return (
    <section className="my-10 overflow-hidden rounded-3xl border border-white/10 bg-[#10131b]" aria-labelledby={`community-${targetId}`}>
      <div className="flex flex-col gap-5 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div><p className="text-xs font-black uppercase tracking-[.18em] text-rose-400">Topluluk</p><h2 id={`community-${targetId}`} className="mt-2 text-2xl font-black">{title} hakkında konuşun</h2><p className="mt-2 text-sm text-slate-400">Görüşünüzü paylaşın, faydalı konuları beğenerek üste çıkarın.</p></div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-slate-300">{views} görüntülenme</span>
          <button type="button" onClick={likeAndBump} disabled={busy || liked} aria-pressed={liked} className="focus-ring rounded-full bg-rose-600 px-4 py-2 text-xs font-black text-white disabled:bg-rose-950 disabled:text-rose-300">{liked ? 'Beğenildi' : '♥ Beğen ve üste çıkar'} · {likes}</button>
        </div>
      </div>
      <div className="grid gap-0 lg:grid-cols-[1fr_.82fr]">
        <div className="space-y-3 p-6 sm:p-8">
          <h3 className="text-sm font-black text-white">Yorumlar ({comments.length})</h3>
          {comments.length ? comments.map((comment) => <article key={comment.id} className="rounded-2xl border border-white/8 bg-white/[.025] p-4"><div className="flex items-center justify-between gap-3"><strong className="text-sm text-white">{comment.author}</strong><time className="text-[11px] text-slate-600">{comment.createdAt?.toLocaleDateString('tr-TR') ?? 'Yeni'}</time></div><p className="mt-2 text-sm leading-7 text-slate-300">{comment.message}</p></article>) : <p className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-slate-500">İlk yorumu siz yazın.</p>}
        </div>
        <form onSubmit={submit} className="border-t border-white/10 bg-black/10 p-6 lg:border-l lg:border-t-0 sm:p-8">
          <h3 className="text-lg font-black">Yorum ekle</h3>
          <p className="mt-2 text-xs leading-5 text-slate-500">{user ? 'Üye yorumunuz doğrudan yayınlanır.' : 'Misafir yorumları admin onayından sonra yayınlanır.'}</p>
          <label className="mt-5 block text-xs font-bold text-slate-300">Adınız<input required minLength={2} maxLength={40} value={author} onChange={(event) => setAuthor(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#090b10] px-4 text-sm text-white outline-none focus:border-rose-400" /></label>
          <label className="mt-4 block text-xs font-bold text-slate-300">Yorumunuz<textarea required minLength={3} maxLength={600} rows={5} value={message} onChange={(event) => setMessage(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#090b10] p-4 text-sm text-white outline-none focus:border-rose-400" /></label>
          <button disabled={busy} className="focus-ring mt-4 min-h-11 w-full rounded-xl bg-rose-600 px-5 text-sm font-black text-white disabled:opacity-60">{busy ? 'Kaydediliyor…' : 'Yorumu gönder'}</button>
          {notice ? <p aria-live="polite" className="mt-3 text-xs leading-5 text-rose-200">{notice}</p> : null}
        </form>
      </div>
    </section>
  );
}
