import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const motion = read('app/lib/motion.ts');
const bridge = read('app/components/MotionPreviewBridge.tsx');
const hero = read('app/components/Hero.tsx');
const references = read('app/referanslar/references/components/SkyReferencesSection.tsx');
const referencesCss = read('app/referanslar/references/components/SkyReferencesSection.module.css');
const findings = [];

const checks = [
  ['Local preview hosts are explicit', motion.includes("'127.0.0.1'") && motion.includes("'localhost'")],
  ['Production reduced-motion preference remains respected', motion.includes("matchMedia('(prefers-reduced-motion: reduce)')")],
  ['Preview bridge marks only the local document', bridge.includes('isLocalMotionPreview(window.location.hostname)') && bridge.includes("dataset.motionPreview = 'true'")],
  ['Hero autoplay uses the shared preference', hero.includes('prefersReducedMotion()')],
  ['References archive autoplay uses the shared preference', references.includes('prefersReducedMotion()')],
  ['Moving references restore their animation only in preview', referencesCss.includes(":global(html[data-motion-preview='true']) .movingReviewsTrack")],
  ['Moving references keep the duplicated layer bounded', references.includes('exampleSiteReviews.slice(0, 6)')],
  ['Moving references isolate paint work', referencesCss.includes('contain: paint;') && referencesCss.includes('backface-visibility: hidden;')],
];

for (const [label, ok] of checks) if (!ok) findings.push(label);

if (findings.length) {
  for (const finding of findings) console.error(`FAIL ${finding}`);
  process.exitCode = 1;
} else {
  console.log('Motion preview audit passed.');
}
