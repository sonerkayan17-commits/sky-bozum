import { collection, deleteDoc, doc, serverTimestamp, setDoc, updateDoc, type Firestore } from 'firebase/firestore';
import type { ArticleItem } from './site';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type ContentArticleDraft = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  seoTitle: string;
  metaDescription: string;
  cover: string;
  status: ContentStatus;
};

export async function seedArticleForEditing(db: Firestore, article: ArticleItem, actorId: string) {
  await setDoc(doc(db, 'contentArticles', article.slug), {
    slug: article.slug, title: article.title, excerpt: article.excerpt, category: article.category,
    seoTitle: article.seoTitle || article.title, metaDescription: article.metaDescription || article.excerpt,
    cover: article.cover || '', status: 'published', source: 'site', updatedBy: actorId,
    updatedAt: serverTimestamp(), createdAt: serverTimestamp(),
  }, { merge: true });
  await setDoc(doc(collection(db, 'contentAudit')), { action: 'edit-ready', articleSlug: article.slug, actorId, createdAt: serverTimestamp() });
}

export async function setArticleStatus(db: Firestore, slug: string, status: ContentStatus, actorId: string) {
  await updateDoc(doc(db, 'contentArticles', slug), { status, updatedBy: actorId, updatedAt: serverTimestamp() });
  await setDoc(doc(collection(db, 'contentAudit')), { action: status, articleSlug: slug, actorId, createdAt: serverTimestamp() });
}

export async function saveManagedArticle(db: Firestore, article: ContentArticleDraft, actorId: string) {
  const clean = {
    ...article,
    slug: article.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
    title: article.title.trim().slice(0, 180),
    excerpt: article.excerpt.trim().slice(0, 420),
    category: article.category.trim().slice(0, 80),
    seoTitle: article.seoTitle.trim().slice(0, 180),
    metaDescription: article.metaDescription.trim().slice(0, 320),
    cover: article.cover.trim().slice(0, 500),
  };
  if (!clean.slug || !clean.title || !clean.excerpt || !clean.category) throw new Error('Başlık, özet, kategori ve bağlantı adı zorunludur.');
  await setDoc(doc(db, 'contentArticles', clean.slug), {
    ...clean, source: 'admin', updatedBy: actorId, updatedAt: serverTimestamp(), createdAt: serverTimestamp(),
  }, { merge: true });
  await setDoc(doc(collection(db, 'contentAudit')), { action: 'saved', articleSlug: clean.slug, actorId, createdAt: serverTimestamp() });
}

export async function removeManagedArticle(db: Firestore, slug: string, actorId: string) {
  await setDoc(doc(collection(db, 'contentAudit')), { action: 'deleted', articleSlug: slug, actorId, createdAt: serverTimestamp() });
  await deleteDoc(doc(db, 'contentArticles', slug));
}
