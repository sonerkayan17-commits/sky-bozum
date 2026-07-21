'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  createPendingComment,
  getOrCreateVisitorId,
  registerEngagement,
  subscribeToApprovedComments,
  subscribeToEngagementCounts,
  type EngagementCounts,
  type PublicComment,
} from '../../../lib/comments';
import { db, isFirebaseConfigured } from '../../../lib/firebase';
import type { SkyReference } from '../data/skyReferences.types';
import styles from './SkyReferencesSection.module.css';

type Props = { references: SkyReference[] };
type ReplyTarget = { id: string; service: string; label: string } | null;

const serviceOptions = [
  'Mobil Ödeme',
  'Vodafone Mobil Ödeme',
  'Turkcell Mobil Ödeme',
  'Türk Telekom Mobil Ödeme',
  'Razer Gold',
  'Apple / iTunes',
  'Paycell',
  'Pokus',
  'Vodafone Pay',
  'Steam',
  'Diğer',
];

const referenceServiceLabels: Record<SkyReference['service'], string> = {
  'razer-gold': 'Razer Gold',
  'apple-itunes': 'Apple / iTunes',
  'vodafone-pay': 'Vodafone Pay',
  paycell: 'Paycell',
  pokus: 'Pokus',
  steam: 'Steam',
  'sms-bozum': 'Mobil Ödeme',
  'kredi-sanal-kart': 'Diğer',
  'mobil-odeme': 'Mobil Ödeme',
  genel: 'Diğer',
  diger: 'Diğer',
};

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

function initials(value: string) {
  return value.trim().slice(0, 2).toLowerCase();
}

function InteractionBar({
  targetId,
  likeCount,
  replyCount,
  liked,
  onLike,
  onReply,
}: {
  targetId: string;
  likeCount: number;
  replyCount: number;
  liked: boolean;
  onLike: (targetId: string) => void;
  onReply: () => void;
}) {
  return (
    <div className={styles.interactionBar}>
      <button type="button" className={liked ? styles.interactionActive : ''} onClick={() => onLike(targetId)} disabled={liked} aria-pressed={liked} aria-label={liked ? 'Bu yorumu faydalı buldunuz' : 'Bu yorumu faydalı olarak işaretle'}>
        <span aria-hidden="true">{liked ? '♥' : '♡'}</span> {likeCount > 0 ? `${likeCount} faydalı` : 'Faydalı'}
      </button>
      <button type="button" onClick={onReply} aria-label="Bu yoruma yanıt ver">
        <span aria-hidden="true">↩</span> {replyCount > 0 ? `${replyCount} yanıt` : 'Yanıtla'}
      </button>
    </div>
  );
}

function ApprovedReplies({ replies }: { replies: PublicComment[] }) {
  if (replies.length === 0) return null;
  return (
    <div className={styles.replies} aria-label="Onaylanmış yanıtlar">
      {replies.slice(0, 2).map((reply) => (
        <div className={styles.reply} key={reply.id}>
          <span className={styles.replyBadge} aria-hidden="true">{initials(reply.author)}</span>
          <p><strong>{reply.author}</strong><span>{reply.message}</span></p>
        </div>
      ))}
    </div>
  );
}

function ReferenceCard({
  reference,
  index,
  likes,
  liked,
  replies,
  onLike,
  onReply,
}: {
  reference: SkyReference;
  index: number;
  likes: number;
  liked: boolean;
  replies: PublicComment[];
  onLike: (targetId: string) => void;
  onReply: (target: ReplyTarget) => void;
}) {
  const targetId = `wm:${reference.id}`;
  return (
    <article className={styles.card} id={`reference-${reference.id}`}>
      <div className={styles.cardTopline}>
        <span className={styles.quoteMark} aria-hidden="true">“</span>
        <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <blockquote>{reference.excerpt}</blockquote>
      <footer className={styles.cardFooter}>
        <div className={styles.authorGroup}>
          <span className={styles.avatar}>{initials(reference.authorLabel)}</span>
          <span>
            <strong>{reference.authorLabel}</strong>
            <small>WM Aracı · {formatDate(reference.publishedAt)}</small>
          </span>
        </div>
        <a href={reference.sourceUrl} target="_blank" rel="noreferrer">
          Kaynağı görüntüle <span aria-hidden="true">↗</span>
        </a>
      </footer>
      <InteractionBar
        targetId={targetId}
        likeCount={likes}
        replyCount={replies.length}
        liked={liked}
        onLike={onLike}
        onReply={() => onReply({ id: targetId, service: referenceServiceLabels[reference.service], label: reference.authorLabel })}
      />
      <ApprovedReplies replies={replies} />
    </article>
  );
}

function ArchiveRow({
  reference,
  likes,
  liked,
  replies,
  onLike,
  onReply,
}: {
  reference: SkyReference;
  likes: number;
  liked: boolean;
  replies: PublicComment[];
  onLike: (targetId: string) => void;
  onReply: (target: ReplyTarget) => void;
}) {
  const targetId = `wm:${reference.id}`;
  return (
    <article className={styles.archiveRow} id={`reference-${reference.id}`}>
      <div className={styles.archiveAuthor}>
        <span className={styles.avatar}>{initials(reference.authorLabel)}</span>
        <span>
          <strong>{reference.authorLabel}</strong>
          <small>WM Aracı · {formatDate(reference.publishedAt)}</small>
        </span>
      </div>
      <p>{reference.excerpt}</p>
      <div className={styles.archiveActions}>
        <InteractionBar
          targetId={targetId}
          likeCount={likes}
          replyCount={replies.length}
          liked={liked}
          onLike={onLike}
          onReply={() => onReply({ id: targetId, service: referenceServiceLabels[reference.service], label: reference.authorLabel })}
        />
        <a href={reference.sourceUrl} target="_blank" rel="noreferrer" aria-label={`${reference.authorLabel} yorumunun kaynağını görüntüle`}>
          Kaynak <span aria-hidden="true">↗</span>
        </a>
      </div>
      <ApprovedReplies replies={replies} />
    </article>
  );
}

function ApprovedCommentCard({
  comment,
  likes,
  liked,
  replies,
  onLike,
  onReply,
}: {
  comment: PublicComment;
  likes: number;
  liked: boolean;
  replies: PublicComment[];
  onLike: (targetId: string) => void;
  onReply: (target: ReplyTarget) => void;
}) {
  const targetId = `comment:${comment.id}`;
  return (
    <article className={styles.communityCard}>
      <div className={styles.communityMeta}>
        <span className={styles.avatar}>{initials(comment.author)}</span>
        <div><strong>{comment.author}</strong><small>{comment.service}</small></div>
        {comment.rating ? <span className={styles.rating}>{'★'.repeat(comment.rating)}</span> : null}
      </div>
      <p>{comment.message}</p>
      <InteractionBar
        targetId={targetId}
        likeCount={likes}
        replyCount={replies.length}
        liked={liked}
        onLike={onLike}
        onReply={() => onReply({ id: comment.id, service: comment.service, label: comment.author })}
      />
      <ApprovedReplies replies={replies} />
    </article>
  );
}

export default function SkyReferencesSection({ references }: Props) {
  const wmReferences = useMemo(
    () => references.filter((item) => item.source === 'wmaraci' && item.sourceUrl && item.verified),
    [references],
  );

  const featuredReferences = useMemo(() => {
    const selected = wmReferences.filter((item) => item.featured);
    return [...selected, ...wmReferences.filter((item) => !item.featured)].slice(0, 3);
  }, [wmReferences]);

  const remainingReferences = useMemo(
    () => wmReferences.filter((item) => !featuredReferences.some((featured) => featured.id === item.id)),
    [featuredReferences, wmReferences],
  );

  const [showAll, setShowAll] = useState(true);
  const [approvedComments, setApprovedComments] = useState<PublicComment[]>([]);
  const [likes, setLikes] = useState<EngagementCounts>({});
  const [views, setViews] = useState<EngagementCounts>({});
  const [likedTargets, setLikedTargets] = useState<Set<string>>(new Set());
  const [replyTarget, setReplyTarget] = useState<ReplyTarget>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatus, setReplyStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [author, setAuthor] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const rootComments = useMemo(() => approvedComments.filter((comment) => !comment.parentId), [approvedComments]);
  const repliesByParent = useMemo(() => {
    return approvedComments.reduce<Record<string, PublicComment[]>>((groups, comment) => {
      if (!comment.parentId) return groups;
      groups[comment.parentId] = [...(groups[comment.parentId] ?? []), comment];
      return groups;
    }, {});
  }, [approvedComments]);

  useEffect(() => {
    if (!db) return;
    const unsubscribeComments = subscribeToApprovedComments(db, setApprovedComments, () => undefined);
    const unsubscribeEngagements = subscribeToEngagementCounts(
      db,
      (counts) => {
        setLikes(counts.likes);
        setViews(counts.views);
      },
      () => undefined,
    );

    const visitorId = getOrCreateVisitorId();
    const likedStorage = window.localStorage.getItem('sky-reference-likes');
    if (likedStorage) {
      try { setLikedTargets(new Set(JSON.parse(likedStorage) as string[])); } catch { /* ignore invalid cache */ }
    }
    registerEngagement(db, visitorId, 'view', 'references-page').catch(() => undefined);

    return () => {
      unsubscribeComments();
      unsubscribeEngagements();
    };
  }, []);

  async function handleLike(targetId: string) {
    if (!db || likedTargets.has(targetId)) return;
    const visitorId = getOrCreateVisitorId();
    try {
      await registerEngagement(db, visitorId, 'like', targetId);
      setLikedTargets((current) => {
        const next = new Set(current).add(targetId);
        window.localStorage.setItem('sky-reference-likes', JSON.stringify([...next]));
        return next;
      });
    } catch {
      // Interaction remains silent so it never distracts from the page.
    }
  }

  function openReply(target: ReplyTarget) {
    setReplyTarget(target);
    setReplyStatus('idle');
    window.setTimeout(() => document.getElementById('compact-reply-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
  }

  async function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !isFirebaseConfigured || !replyTarget || replyAuthor.trim().length < 2 || replyMessage.trim().length < 3) {
      setReplyStatus('error');
      return;
    }
    setReplyStatus('sending');
    try {
      await createPendingComment(db, {
        parentId: replyTarget.id,
        author: replyAuthor.trim(),
        service: serviceOptions.includes(replyTarget.service) ? replyTarget.service : 'Diğer',
        message: replyMessage.trim(),
        rating: null,
      });
      setReplyMessage('');
      setReplyTarget(null);
      setReplyStatus('success');
    } catch {
      setReplyStatus('error');
    }
  }

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanAuthor = author.trim();
    const cleanMessage = message.trim();

    if (!db || !isFirebaseConfigured || cleanAuthor.length < 2 || !service || cleanMessage.length < 12) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      await createPendingComment(db, { author: cleanAuthor, service, message: cleanMessage, rating });
      setAuthor('');
      setService('');
      setMessage('');
      setRating(null);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className={styles.section} aria-labelledby="references-title">
      <div className={styles.container}>
        <header className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>Arşivden kısa kesitler</span>
            <h2 id="references-title">İlk bakışta gerçek kullanıcı sesi.</h2>
            <p>Aşağıdaki yorumlar WM Aracı üzerindeki açık kaynak kullanıcı kayıtlarından seçilmiştir.</p>
          </div>
          <div className={styles.heroAside}>
            <p className={styles.archiveNote}>Her yorum kendi açık kaynak bağlantısından kontrol edilebilir.</p>
            {views['references-page'] ? <span className={styles.viewCount}>◉ {views['references-page']} görüntülenme</span> : null}
          </div>
        </header>

        <div className={styles.grid}>
          {featuredReferences.map((reference, index) => (
            <ReferenceCard
              key={reference.id}
              reference={reference}
              index={index}
              likes={likes[`wm:${reference.id}`] ?? 0}
              liked={likedTargets.has(`wm:${reference.id}`)}
              replies={repliesByParent[`wm:${reference.id}`] ?? []}
              onLike={handleLike}
              onReply={openReply}
            />
          ))}
        </div>

        {remainingReferences.length > 0 ? (
          <div className={styles.centerAction}>
            <button type="button" onClick={() => setShowAll((value) => !value)} aria-expanded={showAll} aria-controls="reference-archive">
              {showAll ? 'Yorumları gizle' : `Tüm yorumları görüntüle (${wmReferences.length})`}
              <span aria-hidden="true">{showAll ? '↑' : '→'}</span>
            </button>
          </div>
        ) : null}

        <div className={`${styles.bottomLayout} ${!showAll ? styles.bottomLayoutSingle : ''}`}>
          {showAll && remainingReferences.length > 0 ? (
            <section id="reference-archive" className={styles.archivePanel} aria-labelledby="all-comments-title">
              <div className={styles.panelHeading}>
                <h3 id="all-comments-title">Tüm Yorumlar</h3>
                <span>{wmReferences.length} açık kaynak kayıt</span>
              </div>
              <div className={styles.archiveList}>
                {remainingReferences.slice(0, 5).map((reference) => (
                  <ArchiveRow
                    key={reference.id}
                    reference={reference}
                    likes={likes[`wm:${reference.id}`] ?? 0}
                    liked={likedTargets.has(`wm:${reference.id}`)}
                    replies={repliesByParent[`wm:${reference.id}`] ?? []}
                    onLike={handleLike}
                    onReply={openReply}
                  />
                ))}
              </div>
              <div className={styles.pagination} aria-label="Yorum sayfaları">
                <button type="button" aria-label="Önceki sayfa">‹</button>
                <button type="button" className={styles.pageActive}>1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <span>…</span>
                <button type="button">8</button>
                <button type="button" aria-label="Sonraki sayfa">›</button>
              </div>
            </section>
          ) : null}

          <section className={styles.reviewPanel} aria-labelledby="review-form-title">
            <div className={styles.reviewIntro}>
              <h3 id="review-form-title">Deneyiminizi paylaşın</h3>
              <p>Hizmetlerimiz hakkındaki deneyiminizi paylaşarak diğer kullanıcılara yardımcı olabilirsiniz.</p>
            </div>

            <form className={styles.form} onSubmit={submitReview}>
              <div className={styles.formRow}>
                <label>
                  <span>Adınız / Kullanıcı Adınız</span>
                  <input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Örn. berkay_06" minLength={2} maxLength={40} required />
                </label>
                <label>
                  <span>Hizmet</span>
                  <select value={service} onChange={(event) => setService(event.target.value)} required>
                    <option value="">Bir hizmet seçin</option>
                    {serviceOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>

              <fieldset className={styles.ratingField}>
                <legend>Puanınız <small>(isteğe bağlı)</small></legend>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" className={rating && value <= rating ? styles.starActive : ''} onClick={() => setRating(value)} aria-label={`${value} yıldız`} aria-pressed={rating === value}>★</button>
                  ))}
                </div>
              </fieldset>

              <label className={styles.messageField}>
                <span>Yorumunuz</span>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Deneyiminiz hakkında birkaç cümle yazın..." minLength={12} maxLength={600} required />
              </label>

              <div className={styles.privacyLine}>Kişisel bilgi (telefon, e-posta vb.) paylaşmayınız.</div>
              <div className={styles.formFooter}>
                <small>Gönderdiğiniz yorumlar admin onayından sonra yayınlanır.</small>
                <button type="submit" disabled={status === 'sending' || !isFirebaseConfigured}>
                  {status === 'sending' ? 'Gönderiliyor...' : 'Yeni yorum yap'} <span aria-hidden="true">↗</span>
                </button>
              </div>

              <div aria-live="polite">
                {status === 'success' ? <p className={styles.success}>Yorumunuz alındı. Onaylandıktan sonra yayınlanacaktır.</p> : null}
                {status === 'error' ? <p className={styles.error}>Form gönderilemedi. Alanları kontrol edip tekrar deneyin.</p> : null}
                {!isFirebaseConfigured ? <p className={styles.error}>Yorum sistemi için Firebase ortam değişkenleri yapılandırılmalıdır.</p> : null}
              </div>
            </form>
          </section>
        </div>

        {replyTarget ? (
          <form id="compact-reply-form" className={styles.replyForm} onSubmit={submitReply}>
            <div>
              <strong>{replyTarget.label} yorumuna yanıt</strong>
              <small>Yanıtınız admin onayından sonra yayınlanır.</small>
            </div>
            <input value={replyAuthor} onChange={(event) => setReplyAuthor(event.target.value)} placeholder="Adınız" minLength={2} maxLength={40} required />
            <input value={replyMessage} onChange={(event) => setReplyMessage(event.target.value)} placeholder="Kısa yanıtınızı yazın..." minLength={3} maxLength={500} required />
            <button type="submit" disabled={replyStatus === 'sending'}>{replyStatus === 'sending' ? 'Gönderiliyor' : 'Yanıt gönder'}</button>
            <button type="button" className={styles.replyCancel} onClick={() => setReplyTarget(null)} aria-label="Yanıt formunu kapat">×</button>
          </form>
        ) : null}
        {replyStatus === 'success' ? <p className={styles.inlineSuccess}>Yanıtınız alındı. Onaylandıktan sonra yayınlanacaktır.</p> : null}
        {replyStatus === 'error' ? <p className={styles.inlineError}>Yanıt gönderilemedi. Alanları kontrol edin.</p> : null}

        {rootComments.length > 0 ? (
          <section className={styles.communitySection} aria-labelledby="community-comments-title">
            <div className={styles.communityHeading}>
              <span className={styles.eyebrow}>Site yorumları</span>
              <h3 id="community-comments-title">Onaylanmış yeni deneyimler</h3>
            </div>
            <div className={styles.communityGrid}>
              {rootComments.slice(0, 6).map((comment) => (
                <ApprovedCommentCard
                  key={comment.id}
                  comment={comment}
                  likes={likes[`comment:${comment.id}`] ?? 0}
                  liked={likedTargets.has(`comment:${comment.id}`)}
                  replies={repliesByParent[comment.id] ?? []}
                  onLike={handleLike}
                  onReply={openReply}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
