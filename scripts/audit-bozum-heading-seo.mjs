import fs from 'node:fs';

const page = fs.readFileSync('app/bilgi-merkezi/[slug]/page.tsx', 'utf8');
const featured = fs.readFileSync('app/lib/featuredArticles.ts', 'utf8');
const errors = [];

if ((page.match(/<h1\b/g) || []).length !== 1) errors.push('Makale şablonunda tam bir H1 bulunmalı.');
if (!page.includes('<h2 id={sectionHeadingId')) errors.push('Makale bölümleri H2 olarak render edilmiyor.');
if (!page.includes('<h3>{subsection.title}</h3>')) errors.push('Alt bölümler H3 olarak render edilmiyor.');
if (!page.includes('{article.title} hakkında sık sorulan sorular')) errors.push('FAQ H2 makale niyetini taşımıyor.');

const required = [
  'mobil ödeme nasıl açılır',
  'mobil ödeme bozum',
  'mobil ödeme bozdurma nasıl yapılır',
  'Razer Gold kodu nasıl alınır ve bozdurulur',
  'iTunes bozum ve Apple Gift Card bozdurma nasıl değerlendirilir',
  'Steam cüzdan kodu nedir ve bozdurulur mu',
];
for (const term of required) if (!featured.toLocaleLowerCase('tr-TR').includes(term.toLocaleLowerCase('tr-TR'))) errors.push(`Eksik hedef sorgu: ${term}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Bozum H1/H2/H3 ve arama niyeti denetimi başarılı.');
