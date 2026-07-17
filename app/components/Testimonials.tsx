'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  createPendingComment,
  subscribeToApprovedComments,
  type PublicComment,
} from '../lib/comments';
import { db, isFirebaseConfigured } from '../lib/firebase';

type Reply = {
  id: string;
  author: string;
  message: string;
  createdAt: string;
};

type Review = {
  id: string;
  author: string;
  service: string;
  message: string;
  rating: number | null;
  createdAt: string;
  replies: Reply[];
  isExample?: boolean;
};

const exampleReviews: Review[] = [
  {
    id: 'example-razer',
    author: 'A.K.',
    service: 'Razer Gold',
    message:
      'İşlem öncesinde oran bilgisinin açık şekilde paylaşılması süreci kolaylaştırdı.',
    rating: 5,
    createdAt: 'Örnek geri bildirim',
    replies: [],
    isExample: true,
  },
  {
    id: 'example-paycell',
    author: 'S.Y.',
    service: 'Paycell',
    message:
      'Sorularıma hızlı yanıt aldım ve hangi adımları izlemem gerektiğini net biçimde öğrendim.',
    rating: 5,
    createdAt: 'Örnek geri bildirim',
    replies: [],
    isExample: true,
  },
  {
    id: 'example-mobile',
    author: 'M.T.',
    service: 'Mobil Ödeme',
    message: 'İletişim süreci düzenliydi; işlem koşulları baştan açıklandı.',
    rating: 4,
    createdAt: 'Örnek geri bildirim',
    replies: [],
    isExample: true,
  },
];

const services = [
  'Vodafone Mobil Ödeme',
  'Turkcell Mobil Ödeme',
  'Türk Telekom Mobil Ödeme',
  'Paycell',
  'Pokus',
  'Razer Gold',
  'Apple Hediye Kartı',
  'Steam',
  'Diğer',
];

function formatDate(value: Date | null) {
  if (!value) return 'Yeni gönderi';

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(value);
}

function buildReviews(comments: PublicComment[]): Review[] {
  const repliesByParent = new Map<string, Reply[]>();

  comments
    .filter((comment) => comment.parentId)
    .forEach((comment) => {
      const parentId = comment.parentId as string;
      const replies = repliesByParent.get(parentId) ?? [];

      replies.push({
        id: comment.id,
        author: comment.author,
        message: comment.message,
        createdAt: formatDate(comment.createdAt),
      });

      repliesByParent.set(parentId, replies);
    });

  return comments
    .filter((comment) => !comment.parentId)
    .map((comment) => ({
      id: comment.id,
      author: comment.author,
      service: comment.service,
      message: comment.message,
      rating: comment.rating,
      createdAt: formatDate(comment.createdAt),
      replies: repliesByParent.get(comment.id) ?? [],
    }));
}

export default function Testimonials() {
  const [approvedComments, setApprovedComments] = useState<PublicComment[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [author, setAuthor] = useState('');
  const [service, setService] = useState(services[0]);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [notice, setNotice] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!db) return;

    return subscribeToApprovedComments(
      db,
      (comments) => {
        setApprovedComments(comments);
        setLoading(false);
      },
      () => {
        setNotice('Yorumlar şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      },
    );
  }, []);

  const liveReviews = useMemo(
    () => buildReviews(approvedComments),
    [approvedComments],
  );

  const reviews = liveReviews.length > 0 ? liveReviews : exampleReviews;

  async function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanAuthor = author.trim();
    const cleanMessage = message.trim();

    if (cleanAuthor.length < 2 || cleanMessage.length < 10) {
      setNotice('Lütfen adınızı ve en az 10 karakterlik yorumunuzu yazın.');
      return;
    }

    if (!db) {
      setNotice('Yorum sistemi henüz Firebase bağlantısı bekliyor.');
      return;
    }

    setSubmitting(true);

    try {
      await createPendingComment(db, {
        author: cleanAuthor,
        service,
        message: cleanMessage,
        rating,
      });
      setAuthor('');
      setMessage('');
      setRating(5);
      setNotice('Yorumunuz alındı. Yönetici onayından sonra yayınlanacak.');
    } catch {
      setNotice('Yorum gönderilemedi. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReplySubmit(
    event: FormEvent<HTMLFormElement>,
    review: Review,
  ) {
    event.preventDefault();

    const cleanAuthor = replyAuthor.trim();
    const cleanMessage = replyMessage.trim();

    if (cleanAuthor.length < 2 || cleanMessage.length < 3) {
      setNotice('Yanıt için adınızı ve mesajınızı eksiksiz yazın.');
      return;
    }

    if (!db || review.isExample) {
      setNotice(
        review.isExample
          ? 'Örnek geri bildirimlere yanıt verilemez.'
          : 'Yorum sistemi henüz Firebase bağlantısı bekliyor.',
      );
      return;
    }

    setSubmitting(true);

    try {
      await createPendingComment(db, {
        parentId: review.id,
        author: cleanAuthor,
        service: review.service,
        message: cleanMessage,
      });
      setReplyingTo(null);
      setReplyAuthor('');
      setReplyMessage('');
      setNotice('Yanıtınız alındı. Yönetici onayından sonra yayınlanacak.');
    } catch {
      setNotice('Yanıt gönderilemedi. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-white px-5 py-20 dark:bg-slate-950 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[.2em] text-blue-700 dark:text-blue-300">
              Müşteri deneyimleri
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.045em] text-slate-950 dark:text-white sm:text-5xl">
              Deneyiminizi paylaşın, sorulara yanıt verin
            </h2>
            <p className="mt-5 max-w-2xl leading-8 text-slate-600 dark:text-slate-300">
              Hizmet alan ziyaretçiler yorum bırakabilir; diğer kullanıcılar da
              mevcut yorumlara yanıt verebilir. İçerikler güvenlik amacıyla
              yönetici kontrolünden sonra yayınlanır.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Yönetici onaylı yayın
            </span>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              {loading ? 'Yorumlar yükleniyor' : `${liveReviews.length} onaylı yorum`}
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <article
                key={review.id}
                className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none dark:border-slate-800 dark:bg-slate-900 sm:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-black text-white ${
                        index % 3 === 0
                          ? 'bg-blue-600'
                          : index % 3 === 1
                            ? 'bg-violet-600'
                            : 'bg-emerald-600'
                      }`}
                    >
                      {review.author.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-950 dark:text-white">
                        {review.author}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {review.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {review.isExample ? (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        Örnek geri bildirim
                      </span>
                    ) : null}
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {review.service}
                    </span>
                  </div>
                </div>

                {review.rating ? (
                  <div
                    className="mt-5 flex items-center gap-1"
                    aria-label={`${review.rating} üzerinden 5 yıldız`}
                  >
                    {Array.from({ length: 5 }, (_, starIndex) => (
                      <span
                        key={starIndex}
                        aria-hidden="true"
                        className={
                          starIndex < review.rating!
                            ? 'text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                ) : null}

                <p className="mt-6 leading-8 text-slate-700 dark:text-slate-300">
                  “{review.message}”
                </p>

                {review.replies.length > 0 ? (
                  <div className="mt-6 space-y-3 border-l-2 border-emerald-200 pl-4 dark:border-emerald-900">
                    {review.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="rounded-2xl bg-white p-4 dark:bg-slate-950"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-black text-slate-950 dark:text-white">
                            {reply.author}
                          </p>
                          <span className="text-xs font-semibold text-slate-400">
                            {reply.createdAt}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {reply.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={review.isExample}
                    onClick={() =>
                      setReplyingTo((current) =>
                        current === review.id ? null : review.id,
                      )
                    }
                    className="text-sm font-black text-blue-700 transition hover:text-blue-900 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-blue-300 dark:hover:text-blue-200"
                    aria-expanded={replyingTo === review.id}
                    aria-controls={`reply-${review.id}`}
                  >
                    {review.isExample
                      ? 'Örnek yoruma yanıt kapalı'
                      : replyingTo === review.id
                        ? 'Yanıt alanını kapat'
                        : 'Bu yoruma yanıt ver'}
                  </button>

                  {replyingTo === review.id ? (
                    <form
                      id={`reply-${review.id}`}
                      onSubmit={(event) => handleReplySubmit(event, review)}
                      className="mt-5 grid gap-4"
                    >
                      <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                        Adınız
                        <input
                          value={replyAuthor}
                          onChange={(event) => setReplyAuthor(event.target.value)}
                          maxLength={40}
                          required
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950"
                        />
                      </label>

                      <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                        Yanıtınız
                        <textarea
                          value={replyMessage}
                          onChange={(event) => setReplyMessage(event.target.value)}
                          maxLength={500}
                          rows={3}
                          required
                          className="resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950"
                        />
                      </label>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-fit rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-200"
                      >
                        {submitting ? 'Gönderiliyor...' : 'Yanıtı gönder'}
                      </button>
                    </form>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <aside className="rounded-[30px] border border-emerald-200 bg-emerald-50 p-6 shadow-[0_25px_70px_-45px_rgba(5,150,105,.55)] dark:border-emerald-900 dark:bg-emerald-950/40 sm:p-7 lg:sticky lg:top-28">
            <p className="text-sm font-black uppercase tracking-[.18em] text-emerald-700 dark:text-emerald-300">
              Yorum bırakın
            </p>
            <h3 className="mt-3 text-2xl font-black tracking-[-.035em] text-slate-950 dark:text-white">
              Deneyiminiz başkalarına yardımcı olsun
            </h3>

            <form onSubmit={handleReviewSubmit} className="mt-7 grid gap-5">
              <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                Adınız veya rumuzunuz
                <input
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  maxLength={40}
                  placeholder="Örn. Soner K."
                  required
                  className="rounded-xl border border-emerald-200 bg-white px-4 py-3 font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-emerald-900 dark:bg-slate-950"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                Hizmet
                <select
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  className="rounded-xl border border-emerald-200 bg-white px-4 py-3 font-medium outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-emerald-900 dark:bg-slate-950"
                >
                  {services.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Puanınız
                </legend>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, starIndex) => {
                    const value = starIndex + 1;
                    const selected = value <= rating;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className="rounded-lg p-1 text-2xl transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500 motion-reduce:transform-none"
                        aria-label={`${value} yıldız ver`}
                        aria-pressed={rating === value}
                      >
                        <span
                          aria-hidden="true"
                          className={
                            selected
                              ? 'text-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }
                        >
                          ★
                        </span>
                      </button>
                    );
                  })}
                  <span className="ml-2 text-sm font-black text-slate-600 dark:text-slate-300">
                    {rating}/5
                  </span>
                </div>
              </fieldset>

              <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                Yorumunuz
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={800}
                  minLength={10}
                  rows={5}
                  placeholder="İşlem sürecinizle ilgili deneyiminizi yazın..."
                  required
                  className="resize-y rounded-xl border border-emerald-200 bg-white px-4 py-3 font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-emerald-900 dark:bg-slate-950"
                />
              </label>

              <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
                Kişisel bilgi, telefon numarası veya ödeme detayı paylaşmayın.
                Gönderimler yayınlanmadan önce kontrol edilir.
              </p>

              <button
                type="submit"
                disabled={submitting || !isFirebaseConfigured}
                className="rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transform-none"
              >
                {submitting ? 'Gönderiliyor...' : 'Yorumu gönder'}
              </button>

              {!isFirebaseConfigured ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                  Yorum sistemi Firebase bağlantısı tamamlandıktan sonra aktif olacak.
                </p>
              ) : null}

              {notice ? (
                <p
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-emerald-800 dark:border-emerald-900 dark:bg-slate-950 dark:text-emerald-200"
                >
                  {notice}
                </p>
              ) : null}
            </form>
          </aside>
        </div>
      </div>
    </section>
  );
}
