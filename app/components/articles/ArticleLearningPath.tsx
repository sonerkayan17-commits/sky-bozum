import Link from 'next/link';
import type { ArticleItem } from '../../lib/site';
import { getArticle } from '../../lib/site';
import { getLearningPathPosition } from '../../lib/learningPaths';

export default function ArticleLearningPath({ article }: { article: ArticleItem }) {
  const position = getLearningPathPosition(article);
  if (!position) return null;
  const previous = position.previousSlug ? getArticle(position.previousSlug) : undefined;
  const next = position.nextSlug ? getArticle(position.nextSlug) : undefined;

  return (
    <nav className="article-learning-path" aria-label="Öğrenme yolu">
      <div className="article-learning-path__summary">
        <span>{position.path.eyebrow}</span>
        <strong>{position.path.title}</strong>
        <b>{position.position}/{position.total}</b>
      </div>
      <div className="article-learning-path__links">
        {previous ? <Link href={`/bilgi-merkezi/${previous.slug}`} className="focus-ring rounded-md"><span aria-hidden="true">←</span> Önceki</Link> : <span>Serinin başlangıcı</span>}
        {next ? <Link href={`/bilgi-merkezi/${next.slug}`} className="focus-ring rounded-md">Sıradaki <span aria-hidden="true">→</span></Link> : <span>Seri tamamlandı</span>}
      </div>
    </nav>
  );
}
