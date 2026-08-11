'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { calculatePayout, getRateByName, parseTurkishAmount, rateItems, validateAmount } from '../../lib/rates';
import useRememberedRate from '../personalization/useRememberedRate';

const money = (value: number) => value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const quickAmounts = ['500', '1000', '2500', '5000'];

const serviceNotes: Record<string, { result: string; check: string }> = {
  'Razer Gold TL': { result: 'TL kodlarında kod değeri, bölge ve kullanılmamış olma durumu görüşmede kontrol edilir.', check: 'Kodu satın almadan önce kabul edilen tutarı ve kod türünü yazılı olarak doğrulayın.' },
  'Razer Gold USD': { result: 'USD kodlarında para birimi ve bölge bilgisi sonucu doğrudan etkileyebilir.', check: 'Kodun ülke ve para birimi bilgisini paylaşmadan satın alma yapmayın.' },
  'Apple / iTunes': { result: 'Apple kodlarında mağaza bölgesi ve para birimi eşleşmesi önemlidir.', check: 'Kodun Türkiye mağazasına uygunluğunu ve değerini önceden teyit edin.' },
  Steam: { result: 'Steam kodlarında cüzdan bölgesi ve kod para birimi kontrol edilir.', check: 'Bölgesi belirsiz veya daha önce denenmiş kodları işlem için kullanmayın.' },
  Paycell: { result: 'Paycell işlemlerinde kullanılabilir bakiye ve işlem yöntemi birlikte değerlendirilir.', check: 'Uygulamadaki kullanılabilir bakiyeyi kontrol edip ekran görüntüsü yerine tutarı yazılı paylaşın.' },
  Pokus: { result: 'Pokus işlemlerinde bakiye türü ve mevcut işlem limiti sonucu etkileyebilir.', check: 'İşleme başlamadan önce kullanılabilir bakiye ile günlük limiti kontrol edin.' },
  'Vodafone Mobil Ödeme': { result: 'Vodafone tarafında hat limiti, işlem yöntemi ve güncel uygunluk birlikte kontrol edilir.', check: 'Mobil ödeme limitiniz açık olsa bile işlem oluşturmadan önce uygunluğu teyit edin.' },
  'Turkcell Mobil Ödeme': { result: 'Turkcell tarafında hat yaşı, kullanılabilir limit ve yöntem sonucu değiştirebilir.', check: 'Paycell bakiyesi ile mobil ödeme limitini birbirine karıştırmadan hangi bakiyeyi kullandığınızı belirtin.' },
  'Türk Telekom Mobil Ödeme': { result: 'Türk Telekom tarafında mobil ödeme limiti ile Pokus bakiyesi farklı değerlendirilir.', check: 'Hangi yöntemle işlem yapacağınızı netleştirmeden satın alma başlatmayın.' },
  'SMS Mobil Ödeme': { result: 'SMS işlemlerinde operatör limiti ve doğrulama adımı kişiye göre değişebilir.', check: 'Gelen doğrulama mesajını onaylamadan önce tutar ve hizmet bilgisini yeniden kontrol edin.' },
  'Kredi / Sanal Kart': { result: 'Kart işlemlerinde kart türü, işlem limiti ve doğrulama yöntemi birlikte değerlendirilir.', check: 'Kart bilgisi paylaşmayın; yalnızca yönlendirilen güvenli işlem adımını kullanın.' },
};

function amountError(value: string, serviceName?: string) {
  if (!value.trim()) return 'Tutar alanını boş bırakmayın.';
  const numeric = parseTurkishAmount(value);
  if (serviceName) return validateAmount(numeric, getRateByName(serviceName));
  if (!Number.isFinite(numeric)) return 'Rakamlarla geçerli bir tutar girin.';
  if (numeric <= 0) return 'Tutar sıfırdan büyük olmalıdır.';
  if (numeric > 1_000_000) return 'En fazla 1.000.000 TL üzerinden hesaplama yapılabilir.';
  return '';
}

function FieldMessage({ error, children, id }: { error?: string; children: React.ReactNode; id?: string }) {
  return <p id={id} className={`mt-3 min-h-5 text-xs leading-5 ${error ? 'text-rose-400' : 'text-slate-500'}`} aria-live="polite">{error || children}</p>;
}

function QuickAmounts({ onSelect }: { onSelect: (value: string) => void }) {
  return <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Hızlı tutar seçenekleri">{quickAmounts.map(value => <button key={value} type="button" onClick={() => onSelect(value)} className="focus-ring rounded-full border border-white/10 bg-white/[.035] px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-rose-400/30 hover:bg-rose-500/[.08]">{Number(value).toLocaleString('tr-TR')} TL</button>)}</div>;
}

function ContextNote({ serviceName }: { serviceName: string }) {
  const note = serviceNotes[serviceName] ?? { result: 'Sonuç, seçilen hizmetin bilgilendirme oranına göre hazırlanır.', check: 'İşleme başlamadan önce güncel uygunluğu yazılı olarak teyit edin.' };
  return <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/8 bg-white/[.025] p-4"><p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Bu sonuç ne anlatıyor?</p><p className="mt-2 text-xs leading-6 text-slate-300">{note.result}</p></div><div className="rounded-2xl border border-amber-400/15 bg-amber-500/[.05] p-4"><p className="text-[10px] font-black uppercase tracking-wider text-amber-300/80">İşlemden önce</p><p className="mt-2 text-xs leading-6 text-slate-300">{note.check}</p></div></div>;
}

export function TargetPayoutCalculator() {
  const [serviceName, setServiceName] = useRememberedRate();
  const [target, setTarget] = useState('1000');
  const selected = getRateByName(serviceName);
  const numericTarget = parseTurkishAmount(target);
  const error = amountError(target);
  const requiredAtStart = error ? 0 : numericTarget * 100 / selected.rate;
  const requiredAtMax = error ? 0 : numericTarget * 100 / selected.maxRate;
  return <div className="premium-card p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label htmlFor="target-service" className="text-xs font-bold text-slate-300">Hizmet<select id="target-service" value={serviceName} onChange={(event) => setServiceName(event.target.value)} className="field mt-2">{rateItems.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label><label htmlFor="target-payout" className="text-xs font-bold text-slate-300">Elinize geçmesini istediğiniz tutar<input id="target-payout" value={target} onChange={(event) => setTarget(event.target.value)} inputMode="decimal" maxLength={15} className="field mt-2" placeholder="1.000,00" aria-invalid={Boolean(error)} aria-describedby="target-payout-help" /></label></div><QuickAmounts onSelect={setTarget}/><FieldMessage id="target-payout-help" error={error}>Bu hesap, hedef tutara ulaşmak için yaklaşık ne kadar bakiye gerektiğini gösterir.</FieldMessage><div className="mt-5 grid gap-3 sm:grid-cols-2" role="status" aria-live="polite" aria-atomic="true"><ResultCard label={`%${selected.rate} oran kabul edilirse gereken bakiye`} value={`${money(requiredAtStart)} TL`} tone="rose"/><ResultCard label={`%${selected.maxRate} oran kabul edilirse gereken bakiye`} value={`${money(requiredAtMax)} TL`} tone="emerald"/></div><ContextNote serviceName={selected.name}/></div>;
}

export function RateComparisonCalculator() {
  const [amount, setAmount] = useState('1000');
  const numericAmount = parseTurkishAmount(amount);
  const error = amountError(amount);
  const rows = useMemo(() => rateItems.map(item => ({ item, low: error ? 0 : calculatePayout(numericAmount, item.rate), high: error ? 0 : calculatePayout(numericAmount, item.maxRate) })).sort((a,b)=>b.low-a.low), [numericAmount, error]);
  return <div className="premium-card p-6 sm:p-8"><label htmlFor="rate-comparison-amount" className="block text-xs font-bold text-slate-300">Karşılaştırılacak bakiye<input id="rate-comparison-amount" value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" maxLength={15} className="field mt-2" placeholder="1.000,00" aria-invalid={Boolean(error)} aria-describedby="rate-comparison-help" /></label><QuickAmounts onSelect={setAmount}/><FieldMessage id="rate-comparison-help" error={error}>Liste, aynı tutarın farklı hizmetlerde oluşturabileceği yaklaşık karşılığı gösterir; hizmet seçimi yalnızca yüksek sonuca göre yapılmamalıdır.</FieldMessage><div className="mt-5 overflow-x-auto rounded-2xl border border-white/10" role="region" aria-live="polite" aria-atomic="true" aria-label="Hizmet oran karşılaştırma sonuçları" tabIndex={0}><div className="min-w-[650px]"><div className="grid grid-cols-[1fr_auto_auto] gap-3 bg-white/[.05] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500"><span>Hizmet</span><span>Alt tahmin</span><span>Üst tahmin</span></div>{rows.map(({item,low,high},index)=><div key={item.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-white/8 px-4 py-4"><div><span className="mr-2 text-xs font-black text-rose-400">{String(index+1).padStart(2,'0')}</span><strong className="text-sm text-white">{item.name}</strong><p className="mt-1 text-[11px] text-slate-500">Bilgilendirme oranı {item.range}</p></div><span className="text-sm font-black text-white">{money(low)} TL</span><span className="text-sm font-black text-emerald-300">{money(high)} TL</span></div>)}</div></div><p className="mt-4 text-xs leading-6 text-slate-500">En yüksek görünen satır her zaman kullanılabilir seçenek anlamına gelmez. Elinizdeki bakiye türü, kod bölgesi ve güncel işlem uygunluğu ayrıca kontrol edilir.</p></div>;
}

export function CodeCountCalculator() {
  const [total, setTotal] = useState('5000');
  const [preset, setPreset] = useState('1000,500,250,100');
  const numericTotal = parseTurkishAmount(total);
  const denominations = [...new Set(preset.split(',').map(v=>Number(v.trim())).filter(v=>Number.isFinite(v)&&v>0&&v<=1_000_000))].sort((a,b)=>b-a);
  const error = amountError(total) || (denominations.length ? '' : 'Virgülle ayrılmış en az bir geçerli kod değeri girin.');
  const codePlan = denominations.reduce(
    (plan, value) => {
      const count = Math.floor(plan.remaining / value);
      return { remaining: plan.remaining - count * value, distribution: [...plan.distribution, { value, count }] };
    },
    { remaining: error ? 0 : numericTotal, distribution: [] as { value: number; count: number }[] },
  );
  const { distribution, remaining } = codePlan;
  const activeDistribution = distribution.filter((row) => row.count > 0);
  const resultGridClass = activeDistribution.length === 1
    ? 'mt-5 grid max-w-sm gap-3'
    : 'mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4';
  return <div className="premium-card p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label htmlFor="code-total" className="text-xs font-bold text-slate-300">Toplam bakiye<input id="code-total" value={total} onChange={(event) => setTotal(event.target.value)} inputMode="decimal" maxLength={15} className="field mt-2" aria-invalid={Boolean(error)} aria-describedby="code-count-help" /></label><label htmlFor="code-values" className="text-xs font-bold text-slate-300">Kullanılabilen kod değerleri<input id="code-values" value={preset} onChange={(event) => setPreset(event.target.value)} inputMode="text" className="field mt-2" placeholder="1000,500,250,100" aria-invalid={Boolean(error && denominations.length === 0)} aria-describedby="code-count-help" /></label></div><FieldMessage id="code-count-help" error={error}>Araç, büyük değerden başlayarak tam kod sayısını ve artan bakiyeyi hesaplar.</FieldMessage>{activeDistribution.length > 0 && <div className={resultGridClass} role="status" aria-live="polite" aria-atomic="true">{activeDistribution.map(row=><div key={row.value} className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><p className="text-xs font-bold text-slate-400">{money(row.value)} TL değerinde</p><strong className="mt-2 block text-3xl font-black text-amber-300">{row.count} kod</strong></div>)}</div>}<div className="mt-3 rounded-2xl border border-white/10 bg-white/[.025] p-4 text-sm text-slate-400">Tam koda ayrılamayan bakiye: <strong className="text-white">{money(remaining)} TL</strong></div><p className="mt-4 text-xs leading-6 text-slate-500">Bu dağılım yalnızca matematiksel planlama içindir. Satın alınabilecek kod değerleri marka, bölge ve satış kanalına göre farklı olabilir.</p></div>;
}

export function CategoryPayoutCalculator({ category, title }: { category: 'Mobil Ödeme' | 'Kod'; title: string }) {
  const options = rateItems.filter(item=>item.category===category);
  const [service, setService] = useState(options[0]?.name ?? rateItems[0].name);
  const [amount, setAmount] = useState('1000');
  const item = getRateByName(service);
  const numeric = parseTurkishAmount(amount);
  const error = amountError(amount, service);
  const low = error ? 0 : calculatePayout(numeric,item.rate);
  const high = error ? 0 : calculatePayout(numeric,item.maxRate);
  const sameResult = item.rate === item.maxRate;
  return <div className="premium-card p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label htmlFor="category-service" className="text-xs font-bold text-slate-300">{title}<select id="category-service" value={service} onChange={e=>setService(e.target.value)} className="field mt-2">{options.map(option=><option key={option.id} value={option.name}>{option.name}</option>)}</select></label><label htmlFor="category-amount" className="text-xs font-bold text-slate-300">Hesaplanacak tutar<input id="category-amount" className="field mt-2" value={amount} onChange={e=>setAmount(e.target.value)} inputMode="decimal" aria-invalid={Boolean(error)} aria-describedby="category-payout-help" /></label></div><QuickAmounts onSelect={setAmount}/><FieldMessage id="category-payout-help" error={error}>{item.name} için bilgilendirme oranı {item.range}; gösterilen tutar teklif değil, işlem öncesi tahmindir.</FieldMessage><div className={`mt-5 grid gap-3 ${sameResult ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`} role="status" aria-live="polite" aria-atomic="true"><ResultCard label="Kullanılan oran aralığı" value={item.range} tone="rose"/><ResultCard label={sameResult ? 'Yaklaşık ödeme' : 'Alt tahmin'} value={`${money(low)} TL`} tone="amber"/>{!sameResult && <ResultCard label="Üst tahmin" value={`${money(high)} TL`} tone="emerald"/>}</div><ContextNote serviceName={item.name}/></div>;
}

export function DeviceCostCalculator() {
  const [price,setPrice]=useState('30000'); const [months,setMonths]=useState('24'); const [monthlyFee,setMonthlyFee]=useState('0'); const [downPayment,setDownPayment]=useState('0');
  const p=parseTurkishAmount(price), m=Number(months), fee=parseTurkishAmount(monthlyFee)||0, down=parseTurkishAmount(downPayment)||0;
  const error = !Number.isFinite(p) || p <= 0 ? 'Cihazın geçerli peşin fiyatını girin.' : p > 1_000_000 ? 'Cihaz fiyatı 1.000.000 TL sınırını aşamaz.' : down < 0 || down > p ? 'Peşinat, sıfır ile cihaz fiyatı arasında olmalıdır.' : fee < 0 ? 'Aylık ek bedel negatif olamaz.' : '';
  const financed=error?0:p-down; const monthly=error?0:financed/m+fee; const total=error?0:down+monthly*m; const extra=error?0:total-p;
  return <div className="premium-card p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label htmlFor="device-price" className="text-xs font-bold text-slate-300">Cihazın peşin fiyatı<input id="device-price" className="field mt-2" value={price} onChange={e=>setPrice(e.target.value)} inputMode="decimal" aria-invalid={Boolean(error)} aria-describedby="device-cost-help" /></label><label htmlFor="device-months" className="text-xs font-bold text-slate-300">Vade<select id="device-months" className="field mt-2" value={months} onChange={e=>setMonths(e.target.value)}>{[3,6,9,12,18,24,36].map(v=><option key={v} value={v}>{v} ay</option>)}</select></label><label htmlFor="device-down-payment" className="text-xs font-bold text-slate-300">Peşinat<input id="device-down-payment" className="field mt-2" value={downPayment} onChange={e=>setDownPayment(e.target.value)} inputMode="decimal" aria-invalid={Boolean(error)} aria-describedby="device-cost-help" /></label><label htmlFor="device-monthly-fee" className="text-xs font-bold text-slate-300">Aylık ek finansman / hizmet bedeli<input id="device-monthly-fee" className="field mt-2" value={monthlyFee} onChange={e=>setMonthlyFee(e.target.value)} inputMode="decimal" aria-invalid={Boolean(error)} aria-describedby="device-cost-help" /></label></div><FieldMessage id="device-cost-help" error={error}>Simülasyon yalnızca girdiğiniz rakamları toplar; operatörün resmî teklifini veya onay sonucunu tahmin etmez.</FieldMessage><div className="mt-5 grid gap-3 sm:grid-cols-3" role="status" aria-live="polite" aria-atomic="true"><ResultCard label="Aylık yaklaşık ödeme" value={`${money(monthly)} TL`} tone="rose"/><ResultCard label="Vade sonunda toplam" value={`${money(total)} TL`} tone="emerald"/><ResultCard label="Peşin fiyata ek maliyet" value={`${money(extra)} TL`} tone="amber"/></div><p className="mt-4 text-xs leading-6 text-slate-500">Aylık ek bedeli bilmiyorsanız alanı sıfır bırakabilirsiniz. Vergi, sigorta, kampanya indirimi veya sonradan yansıtılan başka kalemler bu hesaba kendiliğinden eklenmez.</p></div>;
}

const wizardData = {
  'mobil-odeme': { title:'Mobil ödeme bakiyesi', text:'Önce operatörünüzü seçip tahmini karşılığı görün. Hat limiti ile kullanılabilir işlem tutarının aynı şey olmadığını unutmayın.', tool:'/araclar/mobil-odeme-hesaplama', guide:'/operatorler', caution:'İşlem onayı vermeden önce ekranda görünen tutarı ve operatörü yeniden kontrol edin.' },
  'gift-card': { title:'Dijital kod / gift card', text:'Markayı, kod değerini, para birimini ve mağaza bölgesini netleştirerek başlayın.', tool:'/araclar/gift-card-hesaplama', guide:'/bilgi-merkezi/magaza-hediye-kartlari-rehberi', caution:'Bölgesi belirsiz veya daha önce kullanılmış kod satın almayın.' },
  'cuzdan': { title:'Dijital cüzdan bakiyesi', text:'Paycell veya Pokus bakiyeniz varsa ana hesaplayıcıdan hizmeti seçin; cüzdan bakiyesi ile mobil ödeme limitini karıştırmayın.', tool:'/araclar#hesapla', guide:'/bilgi-merkezi/paycell-nedir-nasil-kullanilir', caution:'Kullanılabilir bakiye ve günlük işlem limitini uygulama içinden kontrol edin.' },
  'cihaz': { title:'Faturaya ek cihaz', text:'Peşin fiyat, peşinat, vade ve aylık ek bedeli ayrı ayrı girerek toplam maliyeti görün.', tool:'/araclar/faturaya-ek-cihaz-hesaplama', guide:'/bilgi-merkezi/kategori/cihaz-finansmani', caution:'Son kararı operatörün sözleşme ve ödeme planını gördükten sonra verin.' },
  'emin-degilim': { title:'Ürün türünü netleştirin', text:'Elinizdeki bakiyenin adını, uygulamayı veya kod markasını biliyorsanız hizmetler sayfasından başlayın; emin değilseniz iletişim kanalından yalnızca ürün türünü sorun.', tool:'/hizmetler', guide:'/iletisim', caution:'Kart bilgisi, şifre, SMS kodu veya kişisel doğrulama bilgisi paylaşmayın.' },
} as const;
export function TransactionWizard(){const [choice,setChoice]=useState<keyof typeof wizardData>('mobil-odeme');const result=wizardData[choice];return <div className="premium-card overflow-hidden"><div className="grid lg:grid-cols-[.9fr_1.1fr]"><div className="p-6 sm:p-8"><p className="text-xs font-black uppercase tracking-widest text-rose-400">1. Elinizde hangi değer var?</p><div className="mt-5 grid gap-3" role="radiogroup" aria-label="İşlem türü seçimi">{Object.entries(wizardData).map(([key,value])=><button key={key} type="button" onClick={()=>setChoice(key as keyof typeof wizardData)} role="radio" aria-checked={choice===key} className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70 ${choice===key?'border-rose-400/40 bg-rose-500/10':'border-white/8 bg-white/[.025] hover:bg-white/[.05]'}`}><strong className="text-sm text-white">{value.title}</strong></button>)}</div></div><div className="border-t border-white/8 bg-white/[.025] p-6 sm:p-8 lg:border-l lg:border-t-0" role="status" aria-live="polite" aria-atomic="true"><p className="text-xs font-black uppercase tracking-widest text-emerald-400">2. Buradan devam edin</p><h2 className="mt-4 text-3xl font-black">{result.title}</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">{result.text}</p><div className="mt-7 flex flex-wrap gap-3"><Link href={result.tool} className="btn-primary">Hesaplama aracını aç</Link><Link href={result.guide} className="btn-secondary">Konuyu ayrıntılı oku</Link></div><div className="mt-8 rounded-2xl border border-amber-400/15 bg-amber-500/[.05] p-4"><p className="text-[10px] font-black uppercase tracking-wider text-amber-300/80">Bu adımda dikkat</p><p className="mt-2 text-xs leading-6 text-slate-300">{result.caution}</p></div></div></div></div>}

function ResultCard({label,value,tone}:{label:string;value:string;tone:'rose'|'emerald'|'amber'}){const styles={rose:'border-rose-400/15 bg-rose-500/[.06] text-rose-300',emerald:'border-emerald-400/15 bg-emerald-500/[.06] text-emerald-300',amber:'border-amber-400/15 bg-amber-500/[.06] text-amber-300'}[tone];return <div className={`rounded-2xl border p-5 ${styles}`}><p className="text-xs font-bold text-slate-400">{label}</p><strong className="mt-2 block text-2xl font-black sm:text-3xl">{value}</strong></div>}
