'use client';

import { useEffect, useMemo, useState } from 'react';

type SectionItem = { id: string; title: string };
type Props = { sections: SectionItem[]; variant: 'mobile' | 'desktop' };

export default function ArticleSectionNavigation({ sections, variant }: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);

  useEffect(() => {
    if (!sectionIds.length) return;
    const update = () => {
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= 150) current = id;
      }
      setActiveId(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [sectionIds]);

  const links = sections.map((section) => (
    <li key={section.id}>
      <a href={`#${section.id}`} aria-current={section.id === activeId ? 'location' : undefined} data-active={section.id === activeId ? 'true' : undefined} className="focus-ring">
        <i aria-hidden="true" />
        <span>{section.title}</span>
      </a>
    </li>
  ));

  if (variant === 'mobile') return (
    <nav aria-label="Bu yazının bölümleri" className="article-mobile-toc">
      <details>
        <summary>Bu rehberdeki bölümler <span aria-hidden="true">+</span></summary>
        <ul>{links}</ul>
      </details>
    </nav>
  );

  return (
    <nav aria-label="Bu yazıda" className="article-desktop-toc">
      <p>BU YAZIDA</p>
      <ul>{links}</ul>
    </nav>
  );
}
