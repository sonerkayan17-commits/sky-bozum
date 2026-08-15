'use client';

import Link from 'next/link';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { getFirebaseClient } from '../../lib/firebase';
import { forumSections, publicForumKeys, slugifyForumCategory } from '../../lib/forumTaxonomy';
import { hasReportedContent, reportContent } from '../../lib/reports';
import RichArticleEditor, { sanitizeArticleHtml } from '../../yonetim/RichArticleEditor';
import '../../yonetim/content.css';
import './community-editor.css';
import './topic-category.css';

type Post = {
  id: string;
  uid: string;
  author: string;
  title: string;
  body: string;
  category: string;
  subCategory: string;
  sectionSlug: string;
  categorySlug: string;
  status: string;
  visibility: string;
  locked: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type Props = {
  compose?: boolean;
  sectionSlug?: string;
  categorySlug?: string;
};

export default function CommunityTopics({ compose = false, sectionSlug: scopedSectionSlug, categorySlug: scopedCategorySlug }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sectionSlug, setSectionSlug] = useState(forumSections[0].slug);
  const [subCategory, setSubCategory] = useState(forumSections[0].categories[0]);
  const [editingId, setEditingId] = useState('');
  const [notice, setNotice] = useState('');
  const [reportedIds, setReportedIds] = useState<string[]>([]);

  const selectedSection = useMemo(
    () => forumSections.find((item) => item.slug === sectionSlug) || forumSections[0],
    [sectionSlug],
  );
  const visiblePosts = useMemo(
    () => posts.filter((post) => (
      (!scopedSectionSlug || post.sectionSlug === scopedSectionSlug)
      && (!scopedCategorySlug || post.categorySlug === scopedCategorySlug)
    )),
    [posts, scopedCategorySlug, scopedSectionSlug],
  );

  useEffect(() => {
    if (!selectedSection.categories.includes(subCategory)) setSubCategory(selectedSection.categories[0]);
  }, [selectedSection, subCategory]);

  useEffect(() => {
    const { auth, db } = getFirebaseClient();
    if (!auth || !db) return;

    let publicPosts: Post[] = [];
    let ownPosts: Post[] = [];
    let adminPosts: Post[] = [];
    const syncPosts = () => {
      const merged = new Map<string, Post>();
      [...publicPosts, ...ownPosts, ...adminPosts].forEach((post) => merged.set(post.id, post));
      setPosts([...merged.values()].sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)));
    };
    const mapPost = (item: { id: string; data: () => Record<string, unknown> }) => {
      const data = item.data();
      return {
        id: item.id,
        uid: String(data.uid || ''),
        author: String(data.author || 'Sky Bozum üyesi'),
        title: String(data.title || 'Başlıksız konu'),
        body: String(data.body || ''),
        category: String(data.category || 'Genel'),
        subCategory: String(data.subCategory || data.category || 'Genel'),
        sectionSlug: String(data.sectionSlug || ''),
        categorySlug: String(data.categorySlug || ''),
        status: String(data.status || 'unknown'),
        visibility: String(data.visibility || 'unknown'),
        locked: data.locked === true,
        createdAt: (data.createdAt as { toDate?: () => Date } | undefined)?.toDate?.() ?? null,
        updatedAt: (data.updatedAt as { toDate?: () => Date } | undefined)?.toDate?.() ?? null,
      };
    };
    const stopPosts = onSnapshot(
      query(
        collection(db, 'memberPosts'),
        where('status', '==', 'published'),
        where('visibility', '==', 'public'),
        where('forumKey', 'in', publicForumKeys),
      ),
      (snapshot) => { publicPosts = snapshot.docs.map(mapPost); syncPosts(); },
    );

    let stopOwn = () => {};
    let stopAdmin = () => {};
    const stopAuth = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      stopOwn();
      stopAdmin();
      ownPosts = [];
      adminPosts = [];
      if (nextUser) {
        stopOwn = onSnapshot(query(collection(db, 'memberPosts'), where('uid', '==', nextUser.uid)), (snapshot) => { ownPosts = snapshot.docs.map(mapPost); syncPosts(); });
        const token = await nextUser.getIdTokenResult();
        const nextIsAdmin = token.claims.admin === true || nextUser.email === 'sonerkayan17@gmail.com';
        setIsAdmin(nextIsAdmin);
        if (nextIsAdmin) stopAdmin = onSnapshot(collection(db, 'memberPosts'), (snapshot) => { adminPosts = snapshot.docs.map(mapPost); syncPosts(); });
      } else {
        setIsAdmin(false);
      }
      syncPosts();
    });

    return () => { stopAuth(); stopPosts(); stopOwn(); stopAdmin(); };
  }, []);

  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db || !user || !posts.length) return;
    let active = true;
    Promise.all(posts.map(async (post) => (
      post.uid === user.uid || !(await hasReportedContent(db, user.uid, 'forum_post', post.id)) ? null : post.id
    ))).then((ids) => {
      if (active) setReportedIds(ids.filter((id): id is string => Boolean(id)));
    }).catch(() => undefined);
    return () => { active = false; };
  }, [posts, user]);

  function reset() {
    setTitle('');
    setBody('');
    setSectionSlug(forumSections[0].slug);
    setSubCategory(forumSections[0].categories[0]);
    setEditingId('');
  }

  function edit(post: Post) {
    const section = forumSections.find((item) => item.slug === post.sectionSlug)
      || forumSections.find((item) => item.title === post.category)
      || forumSections[0];
    setTitle(post.title);
    setBody(post.body);
    setSectionSlug(section.slug);
    setSubCategory(section.categories.includes(post.subCategory) ? post.subCategory : section.categories[0]);
    setEditingId(post.id);
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const { db } = getFirebaseClient();
    if (!user || !db) {
      location.assign('/giris');
      return;
    }

    const clean = sanitizeArticleHtml(body);
    const plain = clean.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (plain.length < 10) {
      setNotice('Konu metni en az 10 karakter olmalıdır.');
      return;
    }

    const categorySlug = slugifyForumCategory(subCategory);
    const currentPost = editingId ? posts.find((post) => post.id === editingId) : null;
    const payload = {
      title: title.trim(),
      body: clean,
      category: selectedSection.title,
      subCategory,
      sectionSlug: selectedSection.slug,
      categorySlug,
      forumKey: `${selectedSection.slug}/${categorySlug}`,
      visibility: 'public' as const,
      status: isAdmin ? (currentPost?.status === 'archived' ? 'archived' as const : 'published' as const) : 'pending' as const,
      locked: currentPost?.locked === true,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'memberPosts', editingId), payload);
        setNotice(isAdmin ? 'Konu yönetici yetkisiyle güncellendi.' : currentPost?.status === 'published' ? 'Değişikliğiniz yeniden moderasyon kuyruğuna alındı.' : 'Konunuz güncellendi.');
      } else {
        await addDoc(collection(db, 'memberPosts'), {
          ...payload,
          uid: user.uid,
          author: user.displayName || 'Sky Bozum üyesi',
          createdAt: serverTimestamp(),
        });
        setNotice(isAdmin ? 'Konu yönetici yetkisiyle yayınlandı.' : 'Konunuz moderasyon kuyruğuna alındı. Onay sonrası yayınlanacak.');
      }
      reset();
    } catch {
      setNotice('Konu kaydedilemedi. Lütfen bağlantınızı ve yetkinizi kontrol ederek tekrar deneyin.');
    }
  }

  async function reportPost(post: Post) {
    if (!user) {
      location.assign('/giris');
      return;
    }
    const { db } = getFirebaseClient();
    if (!db || reportedIds.includes(post.id)) return;
    try {
      const created = await reportContent(db, user.uid, 'forum_post', post.id, 'Topluluk kurallarına aykırı içerik bildirimi');
      setReportedIds((ids) => ids.includes(post.id) ? ids : [...ids, post.id]);
      if (!created) setNotice('Bu konuyu zaten bildirdiniz.');
    } catch {
      // Rapor formu görünür akışı bozmaz; yetki hatası güvenlik kuralında tutulur.
    }
  }

  async function moderatePost(post: Post, action: 'publish' | 'archive' | 'lock' | 'unlock') {
    const { db } = getFirebaseClient();
    if (!db || !isAdmin || !user) return;
    const locked = action === 'lock' ? true : action === 'unlock' ? false : post.locked;
    const status = action === 'publish' ? 'published' : action === 'archive' ? 'archived' : post.status;
    await updateDoc(doc(db, 'memberPosts', post.id), {
      status,
      visibility: status === 'published' ? 'public' : status === 'archived' ? 'archived' : post.visibility,
      locked,
      moderatedBy: user.uid,
      moderatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await addDoc(collection(db, 'contentAudit'), { action: `forum:inline-${action}`, articleSlug: post.id, actorId: user.uid, createdAt: serverTimestamp() });
    setNotice('Konu işlemi kaydedildi.');
  }

  if (compose) return <main className="utility-page"><section>
    <p>TOPLULUK</p>
    <h1>{editingId ? 'Konuyu düzenle' : 'Yeni konu aç'}</h1>
    <span>Ana bölümü ve ilgili alt kategoriyi seçerek paylaşımınızı doğru alana yerleştirin.</span>
    <form onSubmit={submit}>
      <div className="topic-category-grid">
        <label>Ana kategori<select value={sectionSlug} onChange={(event) => setSectionSlug(event.target.value)}>{forumSections.map((section) => <option key={section.slug} value={section.slug}>{section.title}</option>)}</select></label>
        <label>Alt kategori<select value={subCategory} onChange={(event) => setSubCategory(event.target.value)}>{selectedSection.categories.map((category) => <option key={category}>{category}</option>)}</select></label>
      </div>
      <small className="topic-path-preview">Forum › {selectedSection.title} › {subCategory}</small>
      <label>Konu başlığı<input value={title} onChange={(event) => setTitle(event.target.value)} minLength={5} maxLength={100} required /></label>
      <label>Mesajınız<RichArticleEditor value={body} onChange={setBody} /></label>
      <div className="topic-form-actions"><button>{editingId ? 'Değişiklikleri kaydet' : 'Konuyu yayınla'}</button>{editingId && <button type="button" className="topic-cancel" onClick={reset}>Vazgeç</button>}</div>
    </form>
    {notice && <b>{notice}</b>}
    {user && <div className="my-topics"><h2>{isAdmin ? 'Konu yönetimi' : 'Konularım'}</h2>{(isAdmin ? posts : posts.filter((post) => post.uid === user.uid)).map((post) => <article key={post.id}><div><span>{post.category} › {post.subCategory}</span><strong>{post.title}</strong><small>{post.locked ? 'Kilitli' : post.status === 'archived' ? 'Arşivlendi' : post.status === 'published' ? 'Yayında' : 'Moderasyon bekliyor'} · {post.updatedAt?.toLocaleDateString('tr-TR') || post.createdAt?.toLocaleDateString('tr-TR') || 'Yeni'}</small></div><div><button type="button" disabled={post.locked && !isAdmin} onClick={() => edit(post)}>{post.locked && !isAdmin ? 'Kilitli' : 'Düzenle'}</button>{isAdmin && <><button type="button" onClick={() => void moderatePost(post, post.locked ? 'unlock' : 'lock')}>{post.locked ? 'Kilidi aç' : 'Kilitle'}</button><button type="button" onClick={() => void moderatePost(post, post.status === 'published' ? 'archive' : 'publish')}>{post.status === 'published' ? 'Arşivle' : 'Yayınla'}</button></>}</div></article>)}</div>}
  </section></main>;

  if (!visiblePosts.length) return null;
  return <section className="community-page community-page--scoped" aria-label="Üye konuları">
    <header><p>TOPLULUK PAYLAŞIMLARI</p><h2>Yeni konular</h2><Link href={user ? '/hesabim/yeni-konu' : '/giris'}>{user ? '+ Yeni konu aç' : 'Üye girişi yap'}</Link></header>
    <div>{visiblePosts.map((post) => <article key={post.id}><span>{post.category} › {post.subCategory}</span><h3>{post.title}</h3><div className="community-post-body" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(post.body) }} /><footer><Link href={`/uyeler/${post.uid}`}>{post.author}</Link><time>{post.updatedAt ? 'Güncellendi: ' : ''}{(post.updatedAt || post.createdAt)?.toLocaleDateString('tr-TR') || 'Yeni'}</time>{isAdmin ? <><button type="button" onClick={() => edit(post)}>Düzenle</button><button type="button" onClick={() => void moderatePost(post, post.status === 'published' ? 'archive' : 'publish')}>{post.status === 'published' ? 'Arşivle' : 'Yayınla'}</button></> : user && user.uid !== post.uid && <button type="button" onClick={() => void reportPost(post)} disabled={reportedIds.includes(post.id)}>{reportedIds.includes(post.id) ? 'Bildirildi' : 'Bildir'}</button>}</footer></article>)}</div>
  </section>;
}
