import Link from '../components/DeferredLink';
import { forumSections, forumStarterTopics, getForumStarterTopic, slugifyForumCategory } from '../lib/forumTaxonomy';
import { forumRoutes } from '../lib/forumRoutes';
import './forum-directory.css';
import './forum-directory-v2.css';
import './forum-quality-pass.css';
import './forum-solutions.css';
import './forum-category-links.css';

export default function ForumDirectory() {
  const categoryCount = forumSections.reduce((sum, section) => sum + section.categories.length, 0);
  const featuredTopics = [
    forumStarterTopics.find((topic) => topic.slug === 'sky-bozum-topluluk-alani-kullanim-rehberi'),
    forumStarterTopics.find((topic) => topic.slug === 'sahte-bozum-sitelerini-anlamanin-temel-yollari'),
    forumStarterTopics.find((topic) => topic.slug === '1000-tl-bakiyeden-elime-ne-kadar-gecer'),
  ].filter((topic): topic is (typeof forumStarterTopics)[number] => Boolean(topic));

  return <section className="forum-directory">
    <header>
      <div>
        <span>SKY BOZUM TOPLULUĞU</span>
        <h1>Bozum süreçleri için sade, güvenli ve anlaşılır bilgi alanı.</h1>
        <p>{forumSections.length} ana bölüm · {categoryCount} aktif alt kategori</p>
      </div>
      <Link href="/hesabim/yeni-konu">+ Yeni konu aç</Link>
    </header>
    <nav className="forum-jump" aria-label="Topluluk bölümlerine hızlı geçiş">
      {forumSections.map((section) => <a key={section.slug} href={`#${section.slug}`}>{section.icon} {section.title}</a>)}
    </nav>
    <section className="forum-start-desk" aria-label="Topluluk başlangıç rehberleri">
      <div className="forum-start-desk__summary">
        <span>RESMÎ BAŞLANGIÇ MASASI</span>
        <strong>{forumStarterTopics.length} doğrulanmış yönetim içeriği</strong>
        <p>Bozum, oran ve güvenlik sorularında önce yönetim tarafından hazırlanan rehberlere bakın; cevap bulamazsanız kendi konunuzu açın.</p>
        <div><b>{forumSections.length} bölüm</b><b>{categoryCount} aktif alan</b><b>Gerçek sayaçlar</b></div>
      </div>
      <div className="forum-start-desk__topics">
        {featuredTopics.map((topic, index) => <Link key={topic.slug} href={forumRoutes.topic(topic.sectionSlug, topic.categorySlug, topic.slug)}>
          <span>0{index + 1}</span><div><small>{topic.category}</small><strong>{topic.title}</strong></div><b aria-hidden="true">→</b>
        </Link>)}
      </div>
    </section>
    <section className="forum-solution-lane" aria-labelledby="forum-solution-title">
      <div>
        <span>SORUNU ÇÖZ, SONUCU PAYLAŞ</span>
        <h2 id="forum-solution-title">Hata türünden doğru kontrol adımına geçin.</h2>
        <p>Önce güvenli kontrol rehberini uygulayın. Sorun devam ederse doğru forum kategorisinde konu açın; sonuçlandığında konuyu “Çözüldü” olarak işaretleyin.</p>
        <Link href="/bilgi-merkezi/sorun-cozme">Tüm çözüm rehberleri →</Link>
      </div>
      <nav aria-label="Sık kullanılan çözüm rehberleri">
        <Link href="/bilgi-merkezi/sorun-cozme/vodafone-mobil-odeme-acilmiyor"><b>Mobil ödeme</b><span>Vodafone işlemi açılmıyor</span></Link>
        <Link href="/bilgi-merkezi/sorun-cozme/paycell-kart-calismiyor"><b>Dijital cüzdan</b><span>Paycell kart çalışmıyor</span></Link>
        <Link href="/bilgi-merkezi/sorun-cozme/razer-gold-kodu-gecersiz"><b>Dijital kod</b><span>Razer Gold kodu geçersiz</span></Link>
        <Link href="/hesabim/yeni-konu"><b>Çözülmedi mi?</b><span>Doğru kategoride konu aç</span></Link>
      </nav>
    </section>
    <div className="forum-groups">
      {forumSections.map((section) => {
        const latestTopic = getForumStarterTopic(section.slug, slugifyForumCategory(section.categories[0]));
        return <article key={section.slug} id={section.slug}>
          <Link className="forum-group-hitarea" href={forumRoutes.section(section.slug)} aria-label={`${section.title} forumuna git`} />
          <div className="forum-group-icon" aria-hidden="true">{section.icon}</div>
          <div className="forum-group-main">
            <Link href={forumRoutes.section(section.slug)}><h2>{section.title}</h2></Link>
            <p>{section.description}</p>
            <div>{section.categories.map((category) => <Link key={category} href={forumRoutes.category(section.slug, slugifyForumCategory(category))}>{category}</Link>)}</div>
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
