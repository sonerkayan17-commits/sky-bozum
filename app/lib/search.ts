import {articles,services} from './site';
import {toolPages} from './tools';
import {getArticleCategories} from './articleCategories';
import {getTopicHubs} from './topicHubs';
import {troubleshootingGuides} from './troubleshooting';
import {products} from './products';
export type SearchItem={title:string;description:string;href:string;type:'Hizmet'|'Makale'|'Araç'|'Sayfa';keywords:string[]};
const pages:SearchItem[]=[
  {title:'Ana Sayfa',description:'Sky Bozum hizmet vitrini, operatörler ve güncel işlem bilgileri.',href:'/',type:'Sayfa',keywords:['ana sayfa','sky bozum','bozumcu']},
  {title:'Tüm Hizmetler',description:'Mobil ödeme, dijital kod, cüzdan ve kart hizmetleri.',href:'/hizmetler',type:'Sayfa',keywords:['hizmetler','bozum','dijital bakiye']},
  {title:'Ürünler',description:'PUBG Mobile UC, Valorant VP, League of Legends RP, Metin2 Ejder Parası ve Razer Gold ürünleri.',href:'/urunler',type:'Sayfa',keywords:['ürünler','oyun bakiyesi','uc','vp','rp','ejder parası','razer gold']},
  {title:'Ücretsiz Hesaplama Araçları',description:'Hedef ödeme, oran karşılaştırma ve kod adedi araçları.',href:'/araclar',type:'Sayfa',keywords:['araçlar','hesap makineleri','ücretsiz hesaplama']},
  ...toolPages.map(tool=>({title:tool.title,description:tool.description,href:tool.href,type:'Araç' as const,keywords:[...tool.keywords]})),
  {title:'Operatörler',description:'Vodafone, Turkcell ve Türk Telekom mobil ödeme rehberleri.',href:'/operatorler',type:'Sayfa',keywords:['hat','operatör','mobil ödeme']},
  {title:'Bilgi Merkezi',description:'Tüm makale ve işlem rehberlerini arayın.',href:'/bilgi-merkezi',type:'Sayfa',keywords:['makale','rehber','bilgi']},
  {title:'Sorun Çözme Merkezi',description:'Mobil ödeme, dijital cüzdan ve kod sorunları için kontrol rehberleri.',href:'/bilgi-merkezi/sorun-cozme',type:'Sayfa',keywords:['sorun çözme','hata','çalışmıyor','geçersiz kod']},
  {title:'Arama Niyeti ve Rehber Haritası',description:'Hizmetlere göre tanım, limit, bakiye, sorun ve hesaplama rehberlerini keşfedin.',href:'/bilgi-merkezi/arama-niyeti',type:'Sayfa',keywords:['arama niyeti','seo rehber haritası','limit','bakiye','sorun çözme']},
  {title:'Referanslar',description:'Onaylı ziyaretçi geri bildirimlerini inceleyin.',href:'/referanslar',type:'Sayfa',keywords:['yorum','referans','deneyim']},
  {title:'İş Ortaklığı',description:'Toplu kod, kurumsal iş birliği, reklam, yayıncı, kariyer, bayilik ve geri bildirim başvuruları.',href:'/is-ortakligi',type:'Sayfa',keywords:['iş ortaklığı','kurumsal başvuru','bayilik','reklam','yayıncı','toplu kod']},
  {title:'Sık Sorulan Sorular',description:'İşlem, güvenlik ve ödeme hakkında cevaplar.',href:'/sss',type:'Sayfa',keywords:['soru','yardım','destek']},
  {title:'İletişim ve Güvenlik',description:'Resmî WhatsApp, telefon ve e-posta kanallarıyla güvenli işlem kontrolleri.',href:'/iletisim',type:'Sayfa',keywords:['whatsapp','telefon','iletişim','güven','dolandırıcılık','resmi whatsapp','işlem güvenliği']},
  {title:'Hakkımızda',description:'Sky Bozum hizmet yaklaşımı ve işlem ilkeleri.',href:'/hakkimizda',type:'Sayfa',keywords:['kurumsal','hakkımızda','3 yıl']},
];
export const searchItems:SearchItem[]=[
  ...products.map(product=>({title:product.name,description:product.description,href:`/urunler/${product.slug}`,type:'Sayfa' as const,keywords:[product.shortName,product.category,product.eyebrow,...product.packs.map(pack=>pack.label)]})),
  ...services.map(service=>({title:service.name,description:service.description,href:`/hizmetler/${service.slug}`,type:'Hizmet' as const,keywords:[service.shortName,service.category,...service.highlights]})),
  ...articles.map(article=>({title:article.title,description:article.excerpt,href:`/bilgi-merkezi/${article.slug}`,type:'Makale' as const,keywords:[article.category,article.serviceSlug??'',...(article.keywords??[]),...article.sections.map(section=>section.title),...(article.sections.flatMap(section=>section.subsections?.map(item=>item.title)??[]))]})),
  ...troubleshootingGuides.map(guide=>({title:guide.title,description:guide.summary,href:`/bilgi-merkezi/sorun-cozme/${guide.slug}`,type:'Makale' as const,keywords:[guide.product,guide.category,...guide.keywords,...guide.symptoms,...guide.causes]})),
  ...getTopicHubs().map(hub=>({title:`${hub.name} Bilgi Merkezi`,description:hub.description,href:`/bilgi-merkezi/konu/${hub.slug}`,type:'Sayfa' as const,keywords:[hub.name,'konu merkezi','ürün rehberleri',...hub.articles.flatMap(article=>article.keywords??[])]})),
  ...getArticleCategories(articles).map(category=>({title:`${category.name} Rehberleri`,description:category.excerpt,href:`/bilgi-merkezi/kategori/${category.slug}`,type:'Sayfa' as const,keywords:[category.name,'kategori','konu merkezi','rehberler']})),
  ...pages,
];

export const featuredSearchItems:SearchItem[]=[
  searchItems.find(item=>item.href==='/hizmetler/vodafone-mobil-odeme'),
  searchItems.find(item=>item.href==='/hizmetler/razer-gold-tl'),
  searchItems.find(item=>item.href==='/bilgi-merkezi/mobil-odeme-guvenli-mi'),
  searchItems.find(item=>item.href==='/bilgi-merkezi/mobil-odeme-nasil-acilir'),
  searchItems.find(item=>item.href==='/araclar'),
  searchItems.find(item=>item.href==='/iletisim'),
].filter((item):item is SearchItem=>Boolean(item));

function normalize(value:string){return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i')}
export function searchContent(query:string,limit=12){const normalized=normalize(query.trim());if(!normalized)return[];const tokens=normalized.split(/\s+/).filter(Boolean);return searchItems.map(item=>{const title=normalize(item.title);const keywords=item.keywords.map(normalize);const haystack=normalize([item.title,item.description,...item.keywords].join(' '));const tokenMatches=tokens.filter(token=>haystack.includes(token)).length;const score=(title.startsWith(normalized)?10:title.includes(normalized)?7:0)+(keywords.some(k=>k.includes(normalized))?5:0)+(haystack.includes(normalized)?4:0)+(tokenMatches===tokens.length?3:tokenMatches);return{item,score}}).filter(entry=>entry.score>0).sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title,'tr')).slice(0,limit).map(entry=>entry.item)}
