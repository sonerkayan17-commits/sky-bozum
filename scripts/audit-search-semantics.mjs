import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'app/components/articles/ArticleExplorer.tsx');
const source = fs.readFileSync(file, 'utf8');
const checks = [
  ['Arama alanı / kısayolunu bildirmiyor', 'aria-keyshortcuts="/"'],
  ['Aramayı temizle düğmesi sonuç arşivini kontrol etmiyor', 'onClick={clearSearch} aria-controls="article-archive"'],
  ['Aramayı temizle düğmesi dinamik durumu tekrarlı açıklama olarak kullanıyor', !source.includes('onClick={clearSearch} aria-controls="article-archive" aria-describedby="article-result-status"')],
  ['Arama kısayolu önceden engellenmiş klavye olaylarını yok saymıyor', '!event.defaultPrevented'],
  ['Arama kısayolu IME kompozisyonunu yok saymıyor', '!event.isComposing'],
  ['Arama kısayolu Ctrl birleşimini yok saymıyor', '!event.ctrlKey'],
  ['Arama kısayolu Alt birleşimini yok saymıyor', '!event.altKey'],
  ['Arama kısayolu Meta birleşimini yok saymıyor', '!event.metaKey'],
  ['Arama kısayolu Shift birleşimini yok saymıyor', '!event.shiftKey'],
  ['Escape temizleme davranışı güvenli olay koşulu tanımlamıyor', "const isSafeEscape = event.key === 'Escape'"],
  ['Escape temizleme davranışı Shift birleşimini yok saymıyor', "&& !event.metaKey\n        && !event.shiftKey;"],
  ['Escape temizleme davranışı engellenmiş olayları yok saymıyor', "isSafeEscape && document.activeElement === searchInputRef.current"],
];
let failed = false;
for (const [message, needle] of checks) {
  if (typeof needle === 'boolean' ? !needle : !source.includes(needle)) {
    console.error(`✗ ${message}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('✓ Arama ve Escape klavye davranışlarının çakışma korumaları doğrulandı.');
