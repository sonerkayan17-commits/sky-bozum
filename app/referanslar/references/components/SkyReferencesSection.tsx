'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
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
import { exampleSiteReviews } from '../data/referenceReviews.data';
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






const ARCHIVE_PAGE_SIZE = 5;
const ARCHIVE_AUTO_ADVANCE_MS = 9000;
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
  return value.trim().slice(0, 2).toLocaleUpperCase('tr-TR');
}

function maskedAuthor(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Kullanıcı';
  return parts.map((part) => `${part.charAt(0).toUpperCase()}***`).join(' ');
}

function reviewMeta() {
  return 'Site üzerinden gönderildi';
}

function avatarTone(value: string) {
  const total = Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return styles[`avatarTone${(total % 6) + 1}`];
}

function serviceMark(service: string) {
  const normalized = service.toLocaleLowerCase('tr-TR');
  if (normalized.includes('vodafone')) return { label: 'VF', className: styles.serviceVodafone };
  if (normalized.includes('turkcell')) return { label: 'TC', className: styles.serviceTurkcell };
  if (normalized.includes('türk telekom')) return { label: 'TT', className: styles.serviceTelekom };
  if (normalized.includes('razer')) return { label: 'RG', className: styles.serviceRazer };
  if (normalized.includes('apple') || normalized.includes('itunes')) return { label: '', className: styles.serviceApple };
  if (normalized.includes('paycell')) return { label: 'PC', className: styles.servicePaycell };
  if (normalized.includes('pokus')) return { label: 'PK', className: styles.servicePokus };
  if (normalized.includes('steam')) return { label: 'ST', className: styles.serviceSteam };
  return { label: 'MÖ', className: styles.serviceMobile };
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
  interactionsEnabled,
}: {
  reference: SkyReference;
  index: number;
  likes: number;
  liked: boolean;
  replies: PublicComment[];
  onLike: (targetId: string) => void;
  onReply: (target: ReplyTarget) => void;
  interactionsEnabled: boolean;
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
          <span className={`${styles.avatar} ${avatarTone(reference.authorLabel)}`}>{initials(reference.authorLabel)}</span>
          <span>
            <strong>{reference.authorLabel}</strong>
            <small>WM Aracı · {formatDate(reference.publishedAt)}</small>
          </span>
        </div>
        <a href={reference.sourceUrl} target="_blank" rel="noopener noreferrer">
          Kaynağı görüntüle <span aria-hidden="true">↗</span>
        </a>
      </footer>
      {interactionsEnabled ? (
        <>
          <InteractionBar
            targetId={targetId}
            likeCount={likes}
            replyCount={replies.length}
            liked={liked}
            onLike={onLike}
            onReply={() => onReply({ id: targetId, service: referenceServiceLabels[reference.service], label: reference.authorLabel })}
          />
          <ApprovedReplies replies={replies} />
        </>
      ) : null}
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
  interactionsEnabled,
}: {
  reference: SkyReference;
  likes: number;
  liked: boolean;
  replies: PublicComment[];
  onLike: (targetId: string) => void;
  onReply: (target: ReplyTarget) => void;
  interactionsEnabled: boolean;
}) {
  const targetId = `wm:${reference.id}`;
  return (
    <article className={styles.archiveRow} id={`reference-${reference.id}`}>
      <div className={styles.archiveAuthor}>
        <span className={`${styles.avatar} ${avatarTone(reference.authorLabel)}`}>{initials(reference.authorLabel)}</span>
        <span>
          <strong>{reference.authorLabel}</strong>
          <small>WM Aracı · {formatDate(reference.publishedAt)}</small>
        </span>
      </div>
      <span className={styles.archiveService}>
        <span className={`${styles.serviceMark} ${serviceMark(referenceServiceLabels[reference.service]).className}`} aria-hidden="true">{serviceMark(referenceServiceLabels[reference.service]).label}</span>
        {referenceServiceLabels[reference.service]}
      </span>
      <p>{reference.excerpt}</p>
      <div className={styles.archiveActions}>
        {interactionsEnabled ? (
          <InteractionBar
            targetId={targetId}
            likeCount={likes}
            replyCount={replies.length}
            liked={liked}
            onLike={onLike}
            onReply={() => onReply({ id: targetId, service: referenceServiceLabels[reference.service], label: reference.authorLabel })}
          />
        ) : null}
        <a href={reference.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${reference.authorLabel} yorumunun kaynağını görüntüle`}>
          Kaynak <span aria-hidden="true">↗</span>
        </a>
      </div>
      {interactionsEnabled ? <ApprovedReplies replies={replies} /> : null}
    </article>
  );
}

function MovingReviewCard({ comment, visualIndex, example = false }: { comment: PublicComment; visualIndex: number; example?: boolean }) {
  const ratingValue = comment.rating ?? 5;
  return (
    <article className={styles.movingReviewCard}>
      <div className={styles.movingReviewTopline}>
        <span className={`${styles.movingAvatar} ${styles[`movingAvatar${(visualIndex % 6) + 1}`]} ${avatarTone(comment.author)}`} aria-hidden="true">
          {initials(comment.author)}
        </span>
        <span className={styles.movingReviewIdentity}>
          <strong>{maskedAuthor(comment.author)}</strong>
          <small className={styles.serviceLine}><span className={`${styles.serviceMark} ${serviceMark(comment.service).className}`} aria-hidden="true">{serviceMark(comment.service).label}</span>{comment.service}</small>
        </span>
        {!example && <span className={styles.movingVerified}>✓ Site yorumu</span>}
      </div>
      <div className={styles.movingStars} aria-label={`${ratingValue} yıldız`}>
        {'★'.repeat(ratingValue)}{'☆'.repeat(5 - ratingValue)}
      </div>
      <p>“{comment.message}”</p>
      {!example ? <small className={styles.movingReviewMeta}>{reviewMeta()}</small> : null}
    </article>
  );
}

function MovingReferenceCard({ reference, visualIndex, decorative = false }: { reference: SkyReference; visualIndex: number; decorative?: boolean }) {
  return (
    <article className={styles.movingReviewCard}>
      <div className={styles.movingReviewTopline}>
        <span className={`${styles.movingAvatar} ${styles[`movingAvatar${(visualIndex % 6) + 1}`]} ${avatarTone(reference.authorLabel)}`} aria-hidden="true">
          {initials(reference.authorLabel)}
        </span>
        <span className={styles.movingReviewIdentity}>
          <strong>{reference.authorLabel}</strong>
          <small className={styles.serviceLine}><span className={`${styles.serviceMark} ${serviceMark(referenceServiceLabels[reference.service]).className}`} aria-hidden="true">{serviceMark(referenceServiceLabels[reference.service]).label}</span>{referenceServiceLabels[reference.service]}</small>
        </span>
        <span className={styles.movingSourceBadge}>Kaynak doğrulanabilir</span>
      </div>
      <div className={styles.movingSourceMeta} aria-label="Açık kaynak forum kaydı; yıldız puanı bulunmuyor">
        <span aria-hidden="true">↗</span> Açık kaynak kayıt · puan belirtilmemiş
      </div>
      <p>“{reference.excerpt}”</p>
      <a className={styles.movingReviewSource} href={reference.sourceUrl} target="_blank" rel="noopener noreferrer" tabIndex={decorative ? -1 : undefined}>
        WM Aracı · {formatDate(reference.publishedAt)} · Kaynağı aç <span aria-hidden="true">↗</span>
      </a>
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
  interactionsEnabled,
}: {
  comment: PublicComment;
  likes: number;
  liked: boolean;
  replies: PublicComment[];
  onLike: (targetId: string) => void;
  onReply: (target: ReplyTarget) => void;
  interactionsEnabled: boolean;
}) {
  const targetId = `comment:${comment.id}`;
  return (
    <article className={styles.communityCard}>
      <div className={styles.communityMeta}>
        <span className={`${styles.avatar} ${avatarTone(comment.author)}`}>{initials(comment.author)}</span>
        <div><strong>{maskedAuthor(comment.author)}</strong><small>{comment.service}</small></div>
        {comment.rating ? <span className={styles.rating}>{'★'.repeat(comment.rating)}</span> : null}
      </div>
      <p>{comment.message}</p>
      <small className={styles.communityVerification}>{reviewMeta()}</small>
      {interactionsEnabled ? (
        <>
          <InteractionBar
            targetId={targetId}
            likeCount={likes}
            replyCount={replies.length}
            liked={liked}
            onLike={onLike}
            onReply={() => onReply({ id: comment.id, service: comment.service, label: comment.author })}
          />
          <ApprovedReplies replies={replies} />
        </>
      ) : null}
    </article>
  );
}

export default function SkyReferencesSection({ references }: Props) {
  const interactionsEnabled = Boolean(db && isFirebaseConfigured);
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
  const [archivePage, setArchivePage] = useState(1);
  const [selectedArchiveService, setSelectedArchiveService] = useState('Tümü');
  const [archiveManualPaused, setArchiveManualPaused] = useState(false);
  const [archivePointerPaused, setArchivePointerPaused] = useState(false);
  const [movingReviewsPaused, setMovingReviewsPaused] = useState(false);
  const [showAllExampleReviews, setShowAllExampleReviews] = useState(false);
  const [selectedExampleService, setSelectedExampleService] = useState('Tümü');
  const archivePanelRef = useRef<HTMLElement | null>(null);
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
  const visibleCommunityComments = useMemo(() => rootComments.slice(0, 9), [rootComments]);
  const movingReferences = useMemo(
    () => remainingReferences.slice(0, 9),
    [remainingReferences],
  );
  const movingExampleReviews = useMemo(() => exampleSiteReviews, []);
  const movingUsesSiteComments = visibleCommunityComments.length > 0;
  const exampleServiceFilters = useMemo(() => {
    const preferredOrder = ['Vodafone Mobil Ödeme', 'Mobil Ödeme', 'Razer Gold', 'Paycell', 'Apple / iTunes', 'Turkcell Mobil Ödeme', 'Türk Telekom Mobil Ödeme', 'Pokus', 'Steam'];
    const counts = exampleSiteReviews.reduce<Record<string, number>>((groups, review) => {
      groups[review.service] = (groups[review.service] ?? 0) + 1;
      return groups;
    }, {});
    return [
      { label: 'Tümü', count: exampleSiteReviews.length },
      ...preferredOrder.filter((serviceName) => counts[serviceName]).map((serviceName) => ({ label: serviceName, count: counts[serviceName] })),
    ];
  }, []);
  const filteredExampleReviews = useMemo(() => (
    selectedExampleService === 'Tümü'
      ? exampleSiteReviews
      : exampleSiteReviews.filter((review) => review.service === selectedExampleService)
  ), [selectedExampleService]);
  const visibleExampleShowcaseReviews = showAllExampleReviews
    ? filteredExampleReviews.slice(0, 12)
    : filteredExampleReviews.slice(0, 6);
  const archiveServiceFilters = useMemo(() => {
    const counts = remainingReferences.reduce<Record<string, number>>((groups, reference) => {
      const label = referenceServiceLabels[reference.service];
      groups[label] = (groups[label] ?? 0) + 1;
      return groups;
    }, {});
    return [
      { label: 'Tümü', count: remainingReferences.length },
      ...Object.entries(counts).map(([label, count]) => ({ label, count })),
    ];
  }, [remainingReferences]);
  const filteredArchiveReferences = useMemo(
    () => selectedArchiveService === 'Tümü'
      ? remainingReferences
      : remainingReferences.filter((reference) => referenceServiceLabels[reference.service] === selectedArchiveService),
    [remainingReferences, selectedArchiveService],
  );
  const archivePageCount = Math.max(1, Math.ceil(filteredArchiveReferences.length / ARCHIVE_PAGE_SIZE));
  const archiveAutoPaused = archiveManualPaused || archivePointerPaused;
  const paginatedReferences = useMemo(
    () => filteredArchiveReferences.slice((archivePage - 1) * ARCHIVE_PAGE_SIZE, archivePage * ARCHIVE_PAGE_SIZE),
    [archivePage, filteredArchiveReferences],
  );
  const repliesByParent = useMemo(() => {
    return approvedComments.reduce<Record<string, PublicComment[]>>((groups, comment) => {
      if (!comment.parentId) return groups;
      groups[comment.parentId] = [...(groups[comment.parentId] ?? []), comment];
      return groups;
    }, {});
  }, [approvedComments]);

  useEffect(() => {
    setArchivePage((page) => Math.min(page, archivePageCount));
  }, [archivePageCount]);

  useEffect(() => {
    setArchivePage(1);
  }, [selectedArchiveService]);

  useEffect(() => {
    if (!showAll || archivePageCount <= 1 || archiveAutoPaused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setArchivePage((page) => (page >= archivePageCount ? 1 : page + 1));
    }, ARCHIVE_AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [archiveAutoPaused, archivePageCount, showAll]);

  function selectArchivePage(page: number) {
    setArchivePage(Math.min(Math.max(page, 1), archivePageCount));
  }

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
              interactionsEnabled={interactionsEnabled}
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

        <div className={styles.referenceSummary} aria-label="Referanslar özeti">
          <div><strong>{wmReferences.length}</strong><span>doğrulanabilir açık kaynak yorum</span></div>
          <div><strong>{exampleSiteReviews.length}</strong><span>site yorumu</span></div>
          <div><strong>{featuredReferences.length}</strong><span>öne çıkan kullanıcı kaydı</span></div>
          <div><strong>2</strong><span>ayrı ve açıkça etiketlenmiş içerik türü</span></div>
        </div>

        {(movingUsesSiteComments || movingReferences.length > 0) ? (
          <section className={styles.movingReviewsSection} aria-labelledby="moving-reviews-title">
            <div className={styles.movingReviewsHeading}>
              <div>
                <span className={styles.eyebrow}>Canlı yorum akışı</span>
                <h3 id="moving-reviews-title">Kullanıcı deneyimleri ekrandan akıyor.</h3>
              </div>
              <div className={styles.movingReviewsControls}>
                <p>{movingUsesSiteComments ? "Moderasyondan geçen site yorumları bu akışta yayınlanır." : "Doğrulanabilir forum kayıtları ve açıkça işaretlenmiş site yorumu örnekleri birlikte gösterilir."}</p>
                <button
                  type="button"
                  className={styles.movingReviewsToggle}
                  onClick={() => setMovingReviewsPaused((paused) => !paused)}
                  aria-pressed={movingReviewsPaused}
                  aria-controls="moving-reviews-track"
                >
                  <span aria-hidden="true">{movingReviewsPaused ? '▶' : 'Ⅱ'}</span>
                  {movingReviewsPaused ? 'Akışı başlat' : 'Akışı durdur'}
                </button>
              </div>
            </div>
            <div
              className={`${styles.movingReviewsViewport} ${movingReviewsPaused ? styles.movingReviewsPaused : ''}`}
              role="region"
              aria-label="Kaynağı doğrulanabilir kullanıcı yorumları"
              aria-live="off"
              tabIndex={0}
            >
              <div id="moving-reviews-track" className={styles.movingReviewsTrack}>
                <div className={styles.movingReviewsGroup}>
                  {movingUsesSiteComments ? (
                    visibleCommunityComments.map((comment, index) => (
                      <MovingReviewCard key={`moving-a-${comment.id}`} comment={comment} visualIndex={index} />
                    ))
                  ) : (
                    <>
                      {movingReferences.map((reference, index) => (
                        <MovingReferenceCard key={`moving-a-${reference.id}`} reference={reference} visualIndex={index} />
                      ))}
                      {movingExampleReviews.map((comment, index) => (
                        <MovingReviewCard key={`moving-example-a-${comment.id}`} comment={comment} visualIndex={movingReferences.length + index} example />
                      ))}
                    </>
                  )}
                </div>
                <div className={styles.movingReviewsGroup} aria-hidden="true">
                  {movingUsesSiteComments ? (
                    visibleCommunityComments.map((comment, index) => (
                      <MovingReviewCard key={`moving-b-${comment.id}`} comment={comment} visualIndex={index} />
                    ))
                  ) : (
                    <>
                      {movingReferences.map((reference, index) => (
                        <MovingReferenceCard key={`moving-b-${reference.id}`} reference={reference} visualIndex={index} decorative />
                      ))}
                      {movingExampleReviews.map((comment, index) => (
                        <MovingReviewCard key={`moving-example-b-${comment.id}`} comment={comment} visualIndex={movingReferences.length + index} example />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className={styles.movingReviewsNote} aria-live="polite">
              {movingReviewsPaused ? 'Yorum akışı duraklatıldı.' : movingUsesSiteComments ? 'Site üzerinden gönderilen yorumlar moderasyon sonrasında yayınlanır.' : 'Akışta doğrulanabilir WM Aracı kayıtları ile gerçek yorum olmayan, açıkça işaretlenmiş tasarım örnekleri birlikte gösterilir.'}
            </p>
          </section>
        ) : null}


        <section className={styles.exampleShowcase} aria-labelledby="example-showcase-title">
          <div className={styles.exampleShowcaseHeading}>
            <div>
              <span className={styles.eyebrow}>YAYIN GÖRÜNÜMÜ</span>
              <h3 id="example-showcase-title">Site yorumları geldiğinde bu alanda görünecek.</h3>
              <p>Bu kartlar gerçek müşteri yorumu değildir; admin paneli ve moderasyon altyapısı bağlanana kadar yorum alanının hazırlanmış görünümünü gösterir.</p>
            </div>
            <span className={styles.exampleShowcaseCount}>{filteredExampleReviews.length} örnek kayıt</span>
          </div>
          <div className={styles.exampleFilterBar} role="group" aria-label="Örnek yorumları hizmete göre filtrele">
            {exampleServiceFilters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                className={selectedExampleService === filter.label ? styles.exampleFilterActive : undefined}
                aria-pressed={selectedExampleService === filter.label}
                onClick={() => {
                  setSelectedExampleService(filter.label);
                  setShowAllExampleReviews(false);
                }}
              >
                <span>{filter.label}</span><small>{filter.count}</small>
              </button>
            ))}
          </div>
          <div className={styles.exampleShowcaseGrid}>
            {visibleExampleShowcaseReviews.map((comment, index) => (
              <MovingReviewCard key={`showcase-${comment.id}`} comment={comment} visualIndex={index} example />
            ))}
          </div>
          <div className={styles.exampleShowcaseFooter}>
            <p>Gerçek site yorumları yayınlanmaya başladığında örnek kayıtların yerini doğrulanmış gönderiler alacak.</p>
            {filteredExampleReviews.length > 6 ? (
              <button type="button" onClick={() => setShowAllExampleReviews((current) => !current)} aria-expanded={showAllExampleReviews}>
                {showAllExampleReviews ? 'Daha az göster' : `Daha fazla göster (${Math.min(filteredExampleReviews.length, 12)})`}
                <span aria-hidden="true">{showAllExampleReviews ? '↑' : '↓'}</span>
              </button>
            ) : null}
          </div>
        </section>


        <section className={styles.trustLayer} aria-labelledby="reference-trust-title">
          <div className={styles.trustLayerHeading}>
            <span className={styles.eyebrow}>ŞEFFAF YORUM SİSTEMİ</span>
            <h3 id="reference-trust-title">Bu yorumları nasıl ayırıyoruz?</h3>
            <p>Kaynağı bulunan kayıtlar, tasarım örnekleri ve ileride site üzerinden gönderilecek yorumlar aynı görünümde karıştırılmaz.</p>
          </div>
          <div className={styles.trustLayerGrid}>
            <article><span aria-hidden="true">↗</span><div><strong>Açık kaynak</strong><p>WM Aracı yorumlarında doğrudan kaynak bağlantısı gösterilir.</p></div></article>
            <article><span aria-hidden="true">✓</span><div><strong>Moderasyon hazır</strong><p>Site yorumları yayınlanmadan önce spam ve kişisel bilgi kontrolünden geçecek.</p></div></article>
            <article><span aria-hidden="true">◉</span><div><strong>Gizlilik</strong><p>İsimler maskelenir; telefon, e-posta ve ödeme bilgileri yayınlanmaz.</p></div></article>
            <article><span aria-hidden="true">≠</span><div><strong>İçerik türleri ayrı</strong><p>Açık kaynak kayıtlar ile site yorumları farklı veri türleri olarak yönetilir.</p></div></article>
          </div>
        </section>

        <div className={`${styles.bottomLayout} ${!showAll ? styles.bottomLayoutSingle : ''}`}>
          {showAll && remainingReferences.length > 0 ? (
            <section
              id="reference-archive"
              ref={archivePanelRef}
              className={styles.archivePanel}
              aria-labelledby="all-comments-title"
              onMouseEnter={() => setArchivePointerPaused(true)}
              onMouseLeave={() => setArchivePointerPaused(false)}
              onFocusCapture={() => setArchivePointerPaused(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setArchivePointerPaused(false);
              }}
            >
              <div className={styles.panelHeading}>
                <div>
                  <h3 id="all-comments-title">Tüm Yorumlar</h3>
                  <span>{filteredArchiveReferences.length} açık kaynak kayıt · {selectedArchiveService === 'Tümü' ? 'tüm hizmetler' : selectedArchiveService}</span>
                </div>
                <button
                  type="button"
                  className={styles.archiveAutoToggle}
                  onClick={() => setArchiveManualPaused((current) => !current)}
                  aria-pressed={archiveManualPaused}
                >
                  <span aria-hidden="true">{archiveManualPaused ? '▶' : 'Ⅱ'}</span>
                  {archiveManualPaused ? 'Otomatik geçişi başlat' : 'Otomatik geçişi durdur'}
                </button>
              </div>
              <div className={styles.archiveFilterBar} role="group" aria-label="Açık kaynak yorumları hizmete göre filtrele">
                {archiveServiceFilters.map((filter) => (
                  <button
                    key={filter.label}
                    type="button"
                    className={selectedArchiveService === filter.label ? styles.archiveFilterActive : undefined}
                    aria-pressed={selectedArchiveService === filter.label}
                    onClick={() => setSelectedArchiveService(filter.label)}
                  >
                    <span>{filter.label}</span><small>{filter.count}</small>
                  </button>
                ))}
              </div>
              <div className={styles.archiveList} key={`${selectedArchiveService}-${archivePage}`} aria-live="polite" aria-atomic="true">
                {paginatedReferences.length > 0 ? paginatedReferences.map((reference) => (
                  <ArchiveRow
                    key={reference.id}
                    reference={reference}
                    likes={likes[`wm:${reference.id}`] ?? 0}
                    liked={likedTargets.has(`wm:${reference.id}`)}
                    replies={repliesByParent[`wm:${reference.id}`] ?? []}
                    onLike={handleLike}
                    onReply={openReply}
                    interactionsEnabled={interactionsEnabled}
                  />
                )) : (
                  <p className={styles.archiveEmpty}>Bu hizmet için açık kaynak yorum kaydı bulunmuyor.</p>
                )}
              </div>
              <div className={styles.pagination} aria-label="Yorum sayfaları">
                <button
                  type="button"
                  aria-label="Önceki sayfa"
                  onClick={() => selectArchivePage(archivePage - 1)}
                  disabled={archivePage === 1}
                >‹</button>
                {Array.from({ length: archivePageCount }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={archivePage === page ? styles.pageActive : undefined}
                    aria-current={archivePage === page ? 'page' : undefined}
                    aria-label={`${page}. yorum sayfası`}
                    onClick={() => selectArchivePage(page)}
                  >{page}</button>
                ))}
                <button
                  type="button"
                  aria-label="Sonraki sayfa"
                  onClick={() => selectArchivePage(archivePage + 1)}
                  disabled={archivePage === archivePageCount}
                >›</button>
              </div>
              <div className={styles.paginationMeta}>
                <span className={styles.paginationStatus} aria-live="polite">
                  {archivePage}. sayfa / {archivePageCount}
                </span>
                <span>{archiveManualPaused ? 'Otomatik geçiş kullanıcı tarafından durduruldu' : archivePointerPaused ? 'Okuma sırasında geçici olarak duraklatıldı' : 'Sayfalar 9 saniyede bir ilerler'}</span>
              </div>
            </section>
          ) : null}

          <section className={styles.reviewPanel} aria-labelledby="review-form-title">
            <div className={styles.reviewIntro}>
              <h3 id="review-form-title">Deneyiminizi paylaşın</h3>
              <p>Hizmetlerimiz hakkındaki deneyiminizi paylaşarak diğer kullanıcılara yardımcı olabilirsiniz.</p>
            </div>

            <form className={styles.form} onSubmit={submitReview}>
              {!interactionsEnabled ? (
                <div className={styles.systemReadyNotice} role="status">
                  <strong>Yorum alanı yayına hazır</strong>
                  <span>Yorum gönderme ve moderasyon, yönetim altyapısı bağlandığında aynı tasarım üzerinden etkinleşecek.</span>
                </div>
              ) : null}
              <fieldset className={styles.formFieldset} disabled={!interactionsEnabled}>
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
                <small>{interactionsEnabled ? "Gönderdiğiniz yorumlar moderasyon sonrasında ‘Site üzerinden gönderildi’ bilgisiyle yayınlanır." : "Form yapısı hazırdır; yorumlar yalnızca moderasyon sistemi etkinleştirildikten sonra kabul edilecektir."}</small>
                <button type="submit" disabled={status === 'sending' || !interactionsEnabled}>
                  {status === 'sending' ? 'Gönderiliyor...' : interactionsEnabled ? 'Yeni yorum yap' : 'Yakında aktif'} <span aria-hidden="true">↗</span>
                </button>
              </div>

              <div aria-live="polite">
                {status === 'success' ? <p className={styles.success}>Yorumunuz alındı. Onaylandıktan sonra yayınlanacaktır.</p> : null}
                {status === 'error' ? <p className={styles.error}>Form gönderilemedi. Alanları kontrol edip tekrar deneyin.</p> : null}
              </div>
              </fieldset>
            </form>
          </section>
        </div>

        {interactionsEnabled && replyTarget ? (
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


        {visibleCommunityComments.length > 0 ? (
          <section className={styles.communitySection} aria-labelledby="community-comments-title">
            <div className={styles.communityHeading}>
              <span className={styles.eyebrow}>Site yorumları</span>
              <h3 id="community-comments-title">Site üzerinden yayınlanan yorumlar</h3>
              <p className={styles.communityNote}>Bu alanda yalnızca moderasyondan geçen ve site üzerinden gönderilen yorumlar gösterilir.</p>
            </div>
            <div className={styles.communityGrid}>
              {visibleCommunityComments.map((comment) => (
                <ApprovedCommentCard
                  key={comment.id}
                  comment={comment}
                  likes={likes[`comment:${comment.id}`] ?? 0}
                  liked={likedTargets.has(`comment:${comment.id}`)}
                  replies={repliesByParent[comment.id] ?? []}
                  onLike={handleLike}
                  onReply={openReply}
                  interactionsEnabled={interactionsEnabled}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
