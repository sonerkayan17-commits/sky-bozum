import type { ArticleItem } from './site';

export type ManagedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  seoTitle?: string;
  metaDescription?: string;
  cover?: string;
  body?: string;
  status: 'draft' | 'published' | 'archived';
  updatedAt?: string;
};

type FirestoreValue = { stringValue?: string; timestampValue?: string };
type FirestoreDocument = { name?: string; fields?: Record<string, FirestoreValue> };

function text(fields: Record<string, FirestoreValue>, key: string) { return fields[key]?.stringValue?.trim() || ''; }

function parseDocument(document: FirestoreDocument): ManagedArticle | null {
  const fields = document.fields || {};
  const slug = text(fields, 'slug') || document.name?.split('/').pop() || '';
  const title = text(fields, 'title');
  const excerpt = text(fields, 'excerpt');
  const category = text(fields, 'category');
  const status = text(fields, 'status') as ManagedArticle['status'];
  if (!slug || !title || !excerpt || !category || !['draft', 'published', 'archived'].includes(status)) return null;
  return { slug, title, excerpt, category, status, seoTitle: text(fields, 'seoTitle') || undefined, metaDescription: text(fields, 'metaDescription') || undefined, cover: text(fields, 'cover') || undefined, body: text(fields, 'body') || undefined, updatedAt: fields.updatedAt?.timestampValue };
}

export async function getManagedContentArticles(): Promise<ManagedArticle[]> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return [];
  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/contentArticles?pageSize=500`, { cache: 'no-store' });
    if (!response.ok) return [];
    const payload = await response.json() as { documents?: FirestoreDocument[] };
    return (payload.documents || []).map(parseDocument).filter((item): item is ManagedArticle => Boolean(item));
  } catch { return []; }
}

export function mergeManagedArticles(staticArticles: ArticleItem[], managedArticles: ManagedArticle[]) {
  const overrides = new Map(managedArticles.map((article) => [article.slug, article]));
  const staticSlugs = new Set(staticArticles.map((article) => article.slug));
  const merged = staticArticles.flatMap((article) => {
    const managed = overrides.get(article.slug);
    if (!managed) return [article];
    if (managed.status !== 'published') return [];
    return [{ ...article, title: managed.title, excerpt: managed.excerpt, category: managed.category, seoTitle: managed.seoTitle || article.seoTitle, metaDescription: managed.metaDescription || article.metaDescription, cover: managed.cover || article.cover, updatedAt: managed.updatedAt || article.updatedAt }];
  });
  const newArticles: ArticleItem[] = managedArticles.filter((article) => article.status === 'published' && !staticSlugs.has(article.slug)).map((article) => ({ slug: article.slug, title: article.title, excerpt: article.excerpt, category: article.category, readTime: `${Math.max(2, Math.ceil((article.body || article.excerpt).split(/\s+/).length / 180))} dk`, publishedAt: article.updatedAt, updatedAt: article.updatedAt, seoTitle: article.seoTitle, metaDescription: article.metaDescription, cover: article.cover, coverAlt: article.title, keywords: [article.category, 'Sky Bozum'], sections: [{ title: article.title, paragraphs: (article.body || article.excerpt).split(/\n{2,}/).filter(Boolean) }] }));
  return [...newArticles, ...merged];
}

export async function getManagedContentArticle(slug: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId || !slug) return null;
  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/contentArticles/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    return response.ok ? parseDocument(await response.json() as FirestoreDocument) : null;
  } catch { return null; }
}
