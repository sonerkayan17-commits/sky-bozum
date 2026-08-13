import Link from 'next/link';
import { forumSections, getForumStarterTopic, slugifyForumCategory } from '../lib/forumTaxonomy';
import { forumRoutes } from '../lib/forumRoutes';
import './forum-directory.css';
import './forum-directory-v2.css';

export default function ForumDirectory() {
  const categoryCount = forumSections.reduce((sum, section) => sum + section.categories.length, 0);

  return <section className="forum-directory">
    <header>
      <div>
        <span>SKY BOZUM TOPLULUĞU</span>
        <h1>Bozum süreçleri için sade, güvenli ve anlaşılır bilgi alanı.</h1>
        <p>{forumSections.length} ana bölüm · {categoryCount} aktif alt kategori</p>
      </div>
      <Link href="/hesabim/yeni-konu">+ Yeni konu aç</Link>
    </header>
    <div className="forum-groups">
      {forumSections.map((section) => {
        const latestTopic = getForumStarterTopic(section.slug, slugifyForumCategory(section.categories[0]));
        return <article key={section.slug}>
          <div className="forum-group-icon" aria-hidden="true">{section.icon}</div>
          <div className="forum-group-main">
            <Link href={forumRoutes.section(section.slug)}><h2>{section.title}</h2></Link>
            <p>{section.description}</p>
            <div>{section.categories.map((category) => <span key={category}>{category}</span>)}</div>
          </div>
          <aside>
            <small>{section.categories.length} AKTİF ALT KATEGORİ</small>
            {latestTopic && <Link href={forumRoutes.topic(section.slug, latestTopic.categorySlug, latestTopic.slug)}>{latestTopic.title}</Link>}
            <span>Başlangıç içeriği · Sky Bozum Yönetim</span>
          </aside>
        </article>;
      })}
    </div>
  </section>;
}
