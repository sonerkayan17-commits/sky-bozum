'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { calculatePayout, parseTurkishAmount, rateDisclaimer, validateAmount } from '../lib/rates';
import { siteConfig } from '../lib/site-config';
import useRememberedRate from './personalization/useRememberedRate';
import usePublishedRates from './personalization/usePublishedRates';

const quickAmounts = [500, 1000, 2500, 5000];
const serviceChecks: Record<string, string> = {
  'Razer Gold TL': 'Kod değeri ve Türkiye bölgesi işlemden önce kontrol edilir.',
  'Razer Gold USD': 'Kodun USD ve doğru bölgeye ait olması gerekir.',
  'Apple / iTunes': 'Mağaza bölgesi ve para birimi sonucu etkiler.',
  Steam: 'Cüzdan bölgesi ile kod para birimi eşleşmelidir.',
  Paycell: 'Kullanılabilir bakiye ve işlem yöntemi birlikte değerlendirilir.',
  Pokus: 'Bakiye türü ve mevcut işlem limiti kontrol edilir.',
  'Vodafone Mobil Ödeme': 'Hat limiti, yöntem ve güncel uygunluk ayrıca doğrulanır.',
  'Turkcell Mobil Ödeme': 'Mobil ödeme limiti ile Paycell bakiyesi ayrı değerlendirilir.',
  'Türk Telekom Mobil Ödeme': 'Mobil ödeme limiti ile Pokus bakiyesi aynı değildir.',
  'SMS Mobil Ödeme': 'Operatör limiti ve SMS onay adımı kişiye göre değişebilir.',
  'Kredi / Sanal Kart': 'Kart bilgisi istenmez; yalnızca güvenli işlem adımı kullanılır.',
};

export default function Calculator({ embedded = false }: { embedded?: boolean }) {
  const [serviceName, setServiceName] = useRememberedRate();
  const [amount, setAmount] = useState('1000');
  const publishedRates = usePublishedRates();
  const selected = publishedRates.find((item) => item.name === serviceName) ?? publishedRates[0];
  const numericAmount = parseTurkishAmount(amount);
  const error = amount.trim() ? validateAmount(numericAmount, selected) : 'Tutar alanını boş bırakmayın.';
  const lowPayout = useMemo(() => error ? 0 : calculatePayout(numericAmount, selected.rate), [error, numericAmount, selected.rate]);
  const highPayout = useMemo(() => error ? 0 : calculatePayout(numericAmount, selected.maxRate), [error, numericAmount, selected.maxRate]);
  const isFixed = selected.rate === selected.maxRate;
  const message = encodeURIComponent(`Merhaba, ${selected.name} için ${numericAmount.toLocaleString('tr-TR')} TL tutarında işlem uygunluğunu öğrenmek istiyorum. Hesaplayıcı ${isFixed ? `${lowPayout.toLocaleString('tr-TR')} TL` : `${lowPayout.toLocaleString('tr-TR')}–${highPayout.toLocaleString('tr-TR')} TL`} aralığı gösterdi. Güncel oranı ve kabul koşullarını paylaşır mısınız?`);

  const HeadingTag = embedded ? 'h2' : 'h1';

  return <section id={embedded ? undefined : 'oran-hesapla'} className={embedded ? 'calculator-embedded' : 'content-shell scroll-mt-24 py-14 sm:py-20'} aria-labelledby="calculator-title">
    {embedded ? <HeadingTag id="calculator-title" className="sr-only">Hızlı oran hesaplayıcı</HeadingTag> : <div className="mx-auto max-w-5xl text-center"><p className="eyebrow">Sky Bozum oran hesaplayıcı</p><HeadingTag id="calculator-title" className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Elinizdeki bakiyenin yaklaşık karşılığını görün.</HeadingTag><p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-400">Hizmeti ve tutarı seçin. Araç, güncel bilgilendirme oranına göre yaklaşık ödeme aralığını gösterir; satın alma veya ödeme onayı oluşturmaz.</p></div>}
    <div className={`premium-card mx-auto max-w-6xl overflow-hidden ${embedded ? '' : 'mt-10'}`}><div className="grid xl:grid-cols-[1.12fr_.88fr]">
      <div className="p-6 sm:p-8 lg:p-10"><div className="grid gap-5 sm:grid-cols-2"><label htmlFor="calculator-service" className="block"><span className="mb-2 block text-xs font-bold text-slate-400">Elinizdeki hizmet</span><select id="calculator-service" value={serviceName} onChange={(event) => setServiceName(event.target.value)} className="field focus-ring text-sm font-bold">{publishedRates.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label><label htmlFor="calculator-amount" className="block"><span className="mb-2 block text-xs font-bold text-slate-400">Hesaplanacak tutar</span><div className="relative"><input id="calculator-amount" type="text" inputMode="decimal" autoComplete="off" maxLength={15} placeholder="1.000,00" value={amount} onChange={(event) => setAmount(event.target.value)} aria-invalid={Boolean(error)} aria-describedby="amount-help" className="field focus-ring pr-12 text-sm font-bold"/><span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-500">TL</span></div></label></div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Hızlı tutar seçenekleri">{quickAmounts.map((quickAmount) => <button key={quickAmount} type="button" onClick={() => setAmount(String(quickAmount))} className="focus-ring rounded-full border border-white/10 bg-white/[.035] px-4 py-2 text-xs font-black text-slate-300 transition hover:border-rose-400/30 hover:text-white">{quickAmount.toLocaleString('tr-TR')} TL</button>)}</div>
      <p id="amount-help" aria-live="polite" className={`mt-3 text-xs ${error ? 'text-rose-400' : 'text-slate-500'}`}>{error || `${selected.name} için kullanılan bilgilendirme oranı ${selected.range}.`}</p>
      <div className={`mt-7 grid gap-3 ${isFixed ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`} role="status" aria-live="polite" aria-atomic="true"><div className="rounded-2xl border border-amber-400/20 bg-amber-500/[0.06] p-5"><p className="text-xs font-bold text-amber-300/80">Oran aralığı</p><strong className="mt-2 block text-3xl font-black text-amber-300">{selected.range}</strong></div><div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-5"><p className="text-xs font-bold text-emerald-300/80">{isFixed ? 'Yaklaşık ödeme' : 'Alt tahmin'}</p><strong className="mt-2 block text-3xl font-black text-emerald-400">{lowPayout.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</strong></div>{!isFixed && <div className="rounded-2xl border border-sky-400/20 bg-sky-500/[0.06] p-5"><p className="text-xs font-bold text-sky-300/80">Üst tahmin</p><strong className="mt-2 block text-3xl font-black text-sky-300">{highPayout.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</strong></div>}</div>
      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[.025] p-4"><p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Bu hizmette kontrol edilen nokta</p><p className="mt-2 text-xs leading-6 text-slate-300">{serviceChecks[selected.name]}</p></div>
      {error ? <span aria-disabled="true" className="mt-6 inline-flex h-13 w-full cursor-not-allowed items-center justify-center rounded-xl bg-slate-800 px-5 text-sm font-extrabold text-slate-500">Önce geçerli bir tutar girin</span> : <a href={`${siteConfig.whatsapp.split('?')[0]}?text=${message}`} target="_blank" rel="noopener noreferrer" className="btn-primary focus-ring mt-6 h-13 w-full">Uygunluğu ve güncel oranı sor</a>}
      <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">Bu düğme işlem başlatmaz; seçiminizi ve yaklaşık sonucu WhatsApp mesajına hazırlar.</p>{embedded && <div className="tc2-calc-next"><span>SONRAKİ ADIM</span><div><Link href="/araclar/hedef-odeme-hesaplama">Hedef ödemeyi hesapla <b>→</b></Link><Link href="/araclar/oran-karsilastirma">Oranları karşılaştır <b>→</b></Link><Link href="/araclar/islem-sihirbazi">Doğru işlemi bul <b>→</b></Link></div></div>}</div>
      <aside className="border-t border-white/8 bg-white/[0.02] p-6 sm:p-8 lg:p-10 xl:border-l xl:border-t-0"><p className="eyebrow">Sonucu doğru okuyun</p><ol className="mt-6 space-y-5">{[['Oran aralığını görün','Tek yüzdeli hizmetlerde tek tahmin, aralıklı hizmetlerde alt ve üst tahmin gösterilir.'],['Ürün türünü kontrol edin','Aynı marka altında bölge, para birimi veya bakiye türü farklı olabilir.'],['Satın almadan önce sorun','Kod veya ödeme oluşturmadan önce kabul koşullarını yazılı olarak netleştirin.'],['Teyit sonrası ilerleyin','Kesin oran ancak hizmet uygunluğu kontrol edildiğinde paylaşılır.']].map(([title,text],index)=><li key={title} className="flex gap-4"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-xs font-black text-rose-400">0{index+1}</span><div><h2 className="text-sm font-extrabold">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div></li>)}</ol><div className="mt-8 rounded-2xl border border-white/8 bg-black/20 p-5"><h2 className="text-sm font-black">Başka bir hesap mı gerekiyor?</h2><p className="mt-2 text-xs leading-6 text-slate-500">Net hedefiniz için gereken bakiyeyi bulun veya hizmetleri aynı tutar üzerinden karşılaştırın.</p><div className="mt-4 grid gap-2"><Link href="/araclar/hedef-odeme-hesaplama" className="focus-ring rounded-xl border border-white/8 px-4 py-3 text-xs font-black text-slate-300 hover:bg-white/[.04]">Hedef ödemeden geriye hesapla →</Link><Link href="/araclar/oran-karsilastirma" className="focus-ring rounded-xl border border-white/8 px-4 py-3 text-xs font-black text-slate-300 hover:bg-white/[.04]">Hizmet sonuçlarını karşılaştır →</Link></div></div><p className="mt-7 border-t border-white/8 pt-5 text-xs leading-6 text-slate-500">{rateDisclaimer}</p></aside>
    </div></div>
  </section>;
}
