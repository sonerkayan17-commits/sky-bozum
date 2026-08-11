'use client';

import { useEffect, useRef, useState } from 'react';

const sections = [
  ['iletisim-yonlendirici', 'Talep yönlendirici'],
  ['iletisim-hizli-gecisler', 'Hızlı geçişler'],
  ['iletisim-guvenlik', 'Güvenli paylaşım'],
  ['iletisim-sss', 'Sık sorulanlar'],
  ['iletisim-resmi-kanal', 'Resmî kanal'],
] as const;

export default function ContactSectionNav() {
  const [active, setActive] = useState<(typeof sections)[number][0]>(sections[0][0]);
  const refs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const targets = sections.map(([id]) => document.getElementById(id)).filter((item): item is HTMLElement => Boolean(item));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id && sections.some(([id]) => id === visible.target.id)) setActive(visible.target.id as (typeof sections)[number][0]);
    }, { rootMargin: '-150px 0px -58% 0px', threshold: [0.05, 0.25] });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    refs.current[active]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [active]);

  return (
    <nav className="contact-section-nav content-shell" aria-label="İletişim sayfası bölümleri">
      <div>
        {sections.map(([id, label], index) => (
          <a key={id} ref={(node) => { refs.current[id] = node; }} href={`#${id}`} onClick={() => setActive(id)} aria-current={active === id ? 'location' : undefined} className={`focus-ring${active === id ? ' is-active' : ''}`}>
            <span>{String(index + 1).padStart(2, '0')}</span><b>{label}</b>
          </a>
        ))}
      </div>
    </nav>
  );
}
