import fs from 'node:fs';

const source = fs.readFileSync('app/bilgi-merkezi/[slug]/page.tsx', 'utf8');
const failures = [];

if (!source.includes('function sectionHeadingId(title: string, index: number)')) {
  failures.push('Bölüm kimliklerini sıra numarasıyla benzersiz yapan sectionHeadingId yardımcı fonksiyonu bulunamadı.');
}
if (!source.includes('id: sectionHeadingId(section.title, index)')) {
  failures.push('İçindekiler verisi benzersiz bölüm kimliklerini kullanmıyor.');
}
if (!source.includes('id={sectionHeadingId(section.title, index)}')) {
  failures.push('Makale bölüm başlıkları benzersiz bölüm kimliklerini kullanmıyor.');
}
if (!source.includes('href={`#${sectionHeadingId(section.title, index)}`}')) {
  failures.push('Bölüm kalıcı bağlantıları benzersiz kimliklerle eşleşmiyor.');
}

if (failures.length) {
  console.error(failures.map((item) => `HATA: ${item}`).join('\n'));
  process.exit(1);
}
console.log('OK: Makale bölüm kimlikleri sıra numarasıyla benzersiz; içindekiler ve kalıcı bağlantılar aynı hedefleri kullanıyor.');
