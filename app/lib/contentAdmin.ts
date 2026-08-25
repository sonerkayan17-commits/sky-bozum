import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';
import { articles, type ArticleItem } from './site';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type ContentArticleDraft = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  seoTitle: string;
  metaDescription: string;
  cover: string;
  body?: string;
  keywords?: string[];
  serviceSlug?: string;
  reviewDueAt?: string;
  status: ContentStatus;
};

export type ContentRevision = ContentArticleDraft & {
  id: string;
  articleSlug: string;
  createdAt: Date | null;
  createdBy: string;
};

type StoredArticle = Omit<ContentArticleDraft, 'status'> & {
  status?: ContentStatus;
  source?: 'site' | 'admin';
};

function articleFromSite(article: ArticleItem): ContentArticleDraft {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    seoTitle: article.seoTitle || article.title,
    metaDescription: article.metaDescription || article.excerpt,
    cover: article.cover || '',
    body: article.sections.flatMap((section) => section.paragraphs).join('\n\n'),
    keywords: article.keywords ? [...article.keywords] : [],
    serviceSlug: article.serviceSlug || '',
    reviewDueAt: '',
    status: 'published',
  };
}

function cleanArticle(article: ContentArticleDraft): ContentArticleDraft {
  const rawCover = article.cover.trim();
  const cover = rawCover.startsWith('/') || /^https:\/\/\S+$/i.test(rawCover) || /^data:image\/(webp|jpeg|png);base64,[a-z0-9+/=]+$/i.test(rawCover) ? rawCover.slice(0, 26000) : '';
  return {
    ...article,
    slug: article.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
    title: article.title.trim().slice(0, 180),
    excerpt: article.excerpt.trim().slice(0, 420),
    category: article.category.trim().slice(0, 80),
    seoTitle: article.seoTitle.trim().slice(0, 180),
    metaDescription: article.metaDescription.trim().slice(0, 320),
    cover,
    body: article.body?.trim().slice(0, 24000) || '',
    keywords: (article.keywords || []).map((keyword) => keyword.trim().slice(0, 80)).filter(Boolean).slice(0, 20),
    serviceSlug: article.serviceSlug?.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 80) || '',
    reviewDueAt: /^\d{4}-\d{2}-\d{2}$/.test(article.reviewDueAt || '') ? article.reviewDueAt : '',
  };
}

function articleFromStored(value: StoredArticle, fallbackSlug: string): ContentArticleDraft {
  return cleanArticle({
    slug: String(value.slug || fallbackSlug),
    title: String(value.title || ''),
    excerpt: String(value.excerpt || ''),
    category: String(value.category || 'Genel'),
    seoTitle: String(value.seoTitle || value.title || ''),
    metaDescription: String(value.metaDescription || value.excerpt || ''),
    cover: String(value.cover || ''),
    body: String(value.body || ''),
    keywords: Array.isArray(value.keywords) ? value.keywords.map(String) : [],
    serviceSlug: String(value.serviceSlug || ''),
    reviewDueAt: String(value.reviewDueAt || ''),
    status: value.status === 'draft' || value.status === 'archived' ? value.status : 'published',
  });
}

async function saveRevision(db: Firestore, article: ContentArticleDraft, actorId: string, source: 'site' | 'admin') {
  await addDoc(collection(db, 'contentRevisions'), {
    articleSlug: article.slug,
    ...article,
    source,
    createdBy: actorId,
    createdAt: serverTimestamp(),
  });
}

async function preserveCurrentRevision(db: Firestore, slug: string, actorId: string) {
  const existing = await getDoc(doc(db, 'contentArticles', slug));
  if (existing.exists()) {
    const data = existing.data() as StoredArticle;
    await saveRevision(db, articleFromStored(data, slug), actorId, data.source === 'site' ? 'site' : 'admin');
    return true;
  }

  const siteArticle = articles.find((article) => article.slug === slug);
  if (siteArticle) await saveRevision(db, articleFromSite(siteArticle), actorId, 'site');
  return false;
}

export async function seedArticleForEditing(db: Firestore, article: ArticleItem, actorId: string) {
  const draft = articleFromSite(article);
  await setDoc(doc(db, 'contentArticles', article.slug), {
    ...draft,
    source: 'site',
    updatedBy: actorId,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true });
  await setDoc(doc(collection(db, 'contentAudit')), { action: 'edit-ready', articleSlug: article.slug, actorId, createdAt: serverTimestamp() });
}

export async function setArticleStatus(db: Firestore, slug: string, status: ContentStatus, actorId: string) {
  const source = articles.find((article) => article.slug === slug);
  const hasExistingRecord = await preserveCurrentRevision(db, slug, actorId);
  await setDoc(doc(db, 'contentArticles', slug), {
    slug,
    status,
    ...(!hasExistingRecord && source ? {
      title: source.title,
      excerpt: source.excerpt,
      category: source.category,
      seoTitle: source.seoTitle || source.title,
      metaDescription: source.metaDescription || source.excerpt,
      cover: source.cover || '',
      keywords: source.keywords ? [...source.keywords] : [],
      serviceSlug: source.serviceSlug || '',
      reviewDueAt: '',
    } : {}),
    updatedBy: actorId,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  await setDoc(doc(collection(db, 'contentAudit')), { action: status, articleSlug: slug, actorId, createdAt: serverTimestamp() });
}

export async function saveManagedArticle(db: Firestore, article: ContentArticleDraft, actorId: string) {
  const clean = cleanArticle(article);
  if (!clean.slug || !clean.title || !clean.excerpt || !clean.category) throw new Error('Başlık, özet, kategori ve bağlantı adı zorunludur.');
  await preserveCurrentRevision(db, clean.slug, actorId);
  await setDoc(doc(db, 'contentArticles', clean.slug), {
    ...clean,
    source: 'admin',
    updatedBy: actorId,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true });
  await setDoc(doc(collection(db, 'contentAudit')), { action: 'saved', articleSlug: clean.slug, actorId, createdAt: serverTimestamp() });
}

export async function removeManagedArticle(db: Firestore, slug: string, actorId: string) {
  await setArticleStatus(db, slug, 'archived', actorId);
}

export async function restoreManagedArticleRevision(db: Firestore, revision: ContentRevision, actorId: string) {
  const restored = cleanArticle({ ...revision, slug: revision.articleSlug });
  if (!restored.slug || !restored.title || !restored.excerpt || !restored.category) throw new Error('Geri yüklenecek sürüm eksik veya geçersiz.');
  await preserveCurrentRevision(db, revision.articleSlug, actorId);
  await setDoc(doc(db, 'contentArticles', revision.articleSlug), {
    ...restored,
    source: 'admin',
    updatedBy: actorId,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true });
  await setDoc(doc(collection(db, 'contentAudit')), { action: 'restored', articleSlug: revision.articleSlug, actorId, createdAt: serverTimestamp() });
}
