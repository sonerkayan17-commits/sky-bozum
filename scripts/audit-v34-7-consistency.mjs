import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pageComponent = path.join(root, 'app/components/tools/ToolPage.tsx');
const registry = path.join(root, 'app/lib/tools.ts');
const slugs = [
  'faturaya-ek-cihaz-hesaplama','gift-card-hesaplama','hedef-odeme-hesaplama',
  'islem-sihirbazi','kod-adedi-hesaplama','mobil-odeme-hesaplama',
  'oran-karsilastirma','sms-hesaplama'
];
const failures = [];
if (!fs.existsSync(pageComponent)) failures.push('ToolPage ortak bileşeni bulunamadı.');
if (!fs.existsSync(registry)) failures.push('Merkezi araç tanım kaynağı bulunamadı.');
const registryText = fs.readFileSync(registry, 'utf8');
for (const slug of slugs) {
  const file = path.join(root, 'app/araclar', slug, 'page.tsx');
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes('import ToolPage')) failures.push(`${slug}: ToolPage kullanılmıyor.`);
  if (!text.includes('toolId=')) failures.push(`${slug}: merkezi araç kimliği kullanılmıyor.`);
  if (!text.includes('createToolMetadata')) failures.push(`${slug}: merkezi metadata üreticisi kullanılmıyor.`);
  if ((text.match(/<main/g) || []).length) failures.push(`${slug}: eski kopya sayfa iskeleti kaldı.`);
}
const editorialCount = (registryText.match(/editorial: \[/g) || []).length;
if (editorialCount !== slugs.length) failures.push(`Merkezi editoryal tanım sayısı ${slugs.length} olmalı, ${editorialCount} bulundu.`);
if (failures.length) {
  console.error(`V34.7 audit başarısız:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`V34.7 audit başarılı: ${slugs.length} araç sayfası ortak iskelet ve merkezi özgün içerik kaynağıyla doğrulandı.`);
