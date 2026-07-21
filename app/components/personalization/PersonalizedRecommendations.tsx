'use client';

import Image from 'next/image';
import Link from 'next/link';
import { articles, services } from '../../lib/site';
import { getTopInterest, interestLabels, type InterestKey } from '../../lib/personalization';
import { useVisitorExperience } from './VisitorExperienceProvider';

const serviceByInterest: Record<InterestKey, string> = {
  razer: 'razer-gold-tl', apple: 'itunes-apple', steam: 'steam', paycell: 'paycell', pokus: 'pokus',
  vodafone: 'vodafone-mobil-odeme', turkcell: 'turkcell-mobil-odeme', 'turk-telekom': 'turk-telekom-mobil-odeme',
  'mobil-odeme': 'sms-mobil-odeme', kartlar: 'kredi-karti-sanal-kart',
};

export default function PersonalizedRecommendations() {
  const { consent, profile, openPreferences } = useVisitorExperience();
  if (consent !== 'accepted') return null;

  const topInterest = getTopInterest(profile);
  const selectedService = services.find((service) => service.slug === (topInterest ? serviceByInterest[topInterest] : 'razer-gold-tl')) ?? services[0];
  const relatedArticles = articles.filter((article) => article.serviceSlug === selectedService.slug).slice(0, 2);
  const fallbackArticles = relatedArticles.length ? relatedArticles : articles.filter((article) => article.serviceSlug === 'razer-gold-tl').slice(0, 2);
  const recentItems = (profile?.recentPaths ?? []).map((path) => {
    const serviceSlug = path.startsWith('/hizmetler/') ? path.split('/').pop() : null;
    const articleSlug = path.startsWith('/bilgi-merkezi/') ? path.split('/').pop() : null;
    const service = serviceSlug ? services.find((item) => item.slug === serviceSlug) : null;
    const article = articleSlug ? articles.find((item) => item.slug === articleSlug) : null;
    if (service) return { path, type: 'Hizmet', title: service.name, text: service.description };
    if (article) return { path, type: 'Rehber', title: article.title, text: article.excerpt };
    return null;
  }).filter((item): item is NonNullable<typeof item> => Boolean(item)).slice(0, 3);

  return (
    <section className="border-y border-white/8 bg-[#0b0e14] py-14 text-white sm:py-16" aria-labelledby="personal-title">
      <div className="content-shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><p className="eyebrow">Size özel öneriler</p><h2 id="personal-title" className="mt-3 text-3xl font-black sm:text-4xl">{topInterest ? `${interestLabels[topInterest]} ilginize göre` : 'Başlangıç için seçtiklerimiz'}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Öneriler yalnızca bu tarayıcıdaki anonim gezinme tercihine göre sıralanır; oranlar ve işlem koşulları kişiye göre değiştirilmez.</p></div>
          <button type="button" onClick={openPreferences} className="self-start text-xs font-black text-rose-300 transition hover:text-rose-200">Tercihleri yönet</button>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
          <Link href={`/hizmetler/${selectedService.slug}`} className="interactive-card group flex min-h-56 flex-col justify-between rounded-3xl border border-rose-400/15 bg-gradient-to-br from-rose-500/10 to-orange-500/[.03] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-5"><div><span className="text-[10px] font-black uppercase tracking-[.18em] text-rose-300">Önerilen hizmet</span><h3 className="mt-3 text-2xl font-black">{selectedService.name}</h3><p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">{selectedService.description}</p></div><div className="relative hidden h-20 w-32 rounded-2xl border border-white/10 bg-white/95 p-3 sm:block"><Image src={selectedService.logo} alt="" fill sizes="128px" className="object-contain p-3" /></div></div>
            <span className="mt-6 text-sm font-black text-rose-300">Hizmeti incele →</span>
          </Link>
          <div className="grid gap-4">
            {fallbackArticles.map((article) => <Link key={article.slug} href={`/bilgi-merkezi/${article.slug}`} className="interactive-card rounded-2xl border border-white/8 bg-white/[.035] p-5"><span className="text-[10px] font-black uppercase tracking-[.16em] text-slate-500">{article.category} · {article.readTime}</span><h3 className="mt-2 text-lg font-black">{article.title}</h3><p className="mt-2 text-xs leading-5 text-slate-400">{article.excerpt}</p></Link>)}
          </div>
        </div>
        {recentItems.length > 0 && <div className="mt-8 border-t border-white/8 pt-7"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Kaldığınız yerden devam edin</p><h3 className="mt-2 text-xl font-black">Son inceledikleriniz</h3></div><span className="text-xs text-slate-500">Yalnız bu tarayıcıda</span></div><div className="mt-4 grid gap-3 md:grid-cols-3">{recentItems.map((item) => <Link key={item.path} href={item.path} className="interactive-card rounded-2xl border border-white/8 bg-white/[.025] p-4"><span className="text-[10px] font-black uppercase tracking-[.14em] text-rose-300">{item.type}</span><h4 className="mt-2 line-clamp-2 text-sm font-black">{item.title}</h4><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{item.text}</p></Link>)}</div></div>}
      </div>
    </section>
  );
}
