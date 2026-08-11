import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'app/components/SiteSearch.tsx');
const source = fs.readFileSync(file, 'utf8');
const checks = [
  ['Global arama Next router kullanmıyor', "import { useRouter } from 'next/navigation';"],
  ['Enter yönlendirmesi SPA router ile yapılmıyor', 'router.push(target.href)'],
  ['Aktif sonuç görünür alana taşınmıyor', "scrollIntoView({ block: 'nearest' })"],
  ['Home klavye kontrolü yok', "event.key === 'Home'"],
  ['End klavye kontrolü yok', "event.key === 'End'"],
  ['Sonuç sayısı canlı bölgeyle duyurulmuyor', 'aria-live="polite"'],
  ['Ctrl+K kısayolu erişilebilirlik ipucu vermiyor', "aria-keyshortcuts={mode === 'desktop' ? 'Control+K Meta+K' : undefined}"],
  ['Kısayol engellenmiş olayları yok saymıyor', 'event.defaultPrevented || event.isComposing'],
];
let failed = false;
for (const [message, needle] of checks) {
  if (!source.includes(needle)) {
    console.error(`✗ ${message}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('✓ Global arama klavye, canlı sonuç ve SPA yönlendirme sözleşmeleri doğrulandı.');
