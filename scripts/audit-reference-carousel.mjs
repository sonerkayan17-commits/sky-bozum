import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const hero = readFileSync(join(root, 'app/components/Hero.tsx'), 'utf8');
const css = readFileSync(join(root, 'app/styles/homepage-legacy.css'), 'utf8');
const findings = [];
const referenceFiles = Array.from({ length: 15 }, (_, index) => {
  const id = String(index + 1).padStart(2, '0');
  return `reference-verified-${id}-r3.webp`;
});

for (const [index, fileName] of referenceFiles.entries()) {
  const file = join(root, 'public/references', fileName);
  if (!existsSync(file)) findings.push(`Missing redacted reference image ${index + 1}.`);
  else if (statSync(file).size > 250 * 1024) findings.push(`Reference image ${index + 1} exceeds 250 KB.`);
}

const checks = [
  ['Carousel starts at first slide', hero.includes('useState(0)')],
  ['Carousel uses all 15 redacted WebP references', hero.includes('referenceAssetNames') && hero.includes('Array.from({ length: 15 }') && hero.includes('src: `/references/${assetName}`')],
  ['Autoplay advances every 1500ms', hero.includes('setTimeout') && hero.includes('1500')],
  ['Carousel starts with the dashboard screen', hero.includes('DashboardSlide') && hero.includes('activeIndex === 0')],
  ['Autoplay loops chat references back to the first chat', hero.includes('current >= referenceSlides.length ? 1 : current + 1')],
  ['Manual arrow controls exist', hero.includes("event.key === 'ArrowLeft'") && hero.includes("event.key === 'ArrowRight'")],
  ['Swipe controls exist', hero.includes('onTouchStart') && hero.includes('onTouchEnd') && hero.includes('startX')],
  ['Hover/focus pause autoplay', hero.includes('onMouseEnter={() => setPaused(true)}') && hero.includes('onFocus={() => setPaused(true)}')],
  ['Reduced motion disables autoplay', hero.includes("matchMedia('(prefers-reduced-motion: reduce)'") && /if\s*\([^)]*reducedMotion[^)]*\)\s*return;/.test(hero)],
  ['First image is priority and rest lazy load', hero.includes('priority={index === 0}') && hero.includes("loading={index === 0 ? 'eager' : 'lazy'}")],
  ['Reference heading states redaction clearly', hero.includes('Gerçek işlem referansları') && hero.includes('Kişisel bilgiler gizlenmiştir')],
  ['Visible next/previous buttons and position exist', hero.includes('hero-reference-controls') && hero.includes('hero-reference-position')],
  ['Phone screen clips carousel overflow', css.includes('.hero-pro-screen{display:flex') && css.includes('.hero-reference-frame{position:relative') && css.includes('overflow:hidden')],
  ['Reference images preserve full screenshot fit', css.includes('.hero-reference-slide img{object-fit:contain')],
  ['Reduced motion removes carousel transitions', css.includes('@media(prefers-reduced-motion:reduce)') && css.includes('.hero-reference-slide')],
];

for (const [label, ok] of checks) {
  if (!ok) findings.push(label);
}

if (findings.length) {
  for (const finding of findings) console.error(`FAIL ${finding}`);
  process.exitCode = 1;
} else {
  console.log('Reference carousel audit passed.');
}
