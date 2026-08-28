'use client';

import { collection, onSnapshot, query, where, type Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getFirebaseClient } from '../lib/firebase';
import { forumRoutes } from '../lib/forumRoutes';

export type ForumLiveSection = {
  slug: string;
  title: string;
  icon: string;
  description: string;
  starterCount: number;
  categories: Array<{ title: string; slug: string; href: string }>;
  fallbackLatest: { title: string; href: string } | null;
};

type LivePost = {
  id: string;
  title: string;
  sectionSlug: string;
  categorySlug: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

function toDate(value: unknown) {
  return (value as Timestamp | undefined)?.toDate?.() ?? null;
}

export default function ForumLiveGroups({ sections, publicKeys }: { sections: ForumLiveSection[]; publicKeys: string[] }) {
  const [posts, setPosts] = useState<LivePost[]>([]);

  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db || publicKeys.length === 0) return;

    return onSnapshot(query(
      collection(db, 'memberPosts'),
      where('status', '==', 'published'),
      where('visibility', '==', 'public'),
      where('forumKey', 'in', publicKeys),
    ), (snapshot) => {
      setPosts(snapshot.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          title: String(data.title || 'Başlıksız konu'),
          sectionSlug: String(data.sectionSlug || ''),
          categorySlug: String(data.categorySlug || ''),
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
        };
      }));
    }, () => setPosts([]));
  }, [publicKeys]);

  const postsBySection = useMemo(() => {
    const map = new Map<string, LivePost[]>();
    posts.forEach((post) => {
      const current = map.get(post.sectionSlug) || [];
      current.push(post);
      map.set(post.sectionSlug, current);
    });
    map.forEach((items) => items.sort((a, b) => {
      const aTime = (a.updatedAt || a.createdAt)?.getTime() || 0;
      const bTime = (b.updatedAt || b.createdAt)?.getTime() || 0;
      return bTime - aTime;
    }));
    return map;
  }, [posts]);

  return <div className="forum-groups">
    {sections.map((section) => {
      const livePosts = postsBySection.get(section.slug) || [];
      const latest = livePosts[0];
      const latestHref = latest ? forumRoutes.memberTopic(latest.id) : section.fallbackLatest?.href;
      const latestTitle = latest?.title || section.fallbackLatest?.title;
      return <article key={section.slug} id={section.slug}>
        <Link className="forum-group-hitarea" href={forumRoutes.section(section.slug)} aria-label={`${section.title} forumuna git`} />
        <div className="forum-group-icon" aria-hidden="true">{section.icon}</div>
        <div className="forum-group-main">
          <Link href={forumRoutes.section(section.slug)}><h2>{section.title}</h2></Link>
          <p>{section.description}</p>
          <div>{section.categories.map((category) => <Link key={category.slug} href={category.href}>{category.title}</Link>)}</div>
        </div>
        <aside>
          <small>{section.starterCount + livePosts.length} YAYINLANMIŞ KONU · {section.categories.length} ALT KATEGORİ</small>
          {latestHref && latestTitle ? <Link href={latestHref}>{latestTitle}</Link> : null}
          <span>{latest ? 'Son üye konusu' : 'Başlangıç içeriği · Sky Bozum Yönetim'}</span>
        </aside>
      </article>;
    })}
  </div>;
}
