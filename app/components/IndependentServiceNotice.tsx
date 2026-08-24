import Link from './DeferredLink';

export default function IndependentServiceNotice({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? 'rounded-2xl border border-amber-300/15 bg-amber-300/[0.035] p-5' : 'border-y border-white/8 bg-[#0b0e14] py-7'} aria-labelledby={compact ? undefined : 'independent-service-title'}>
      <div className={compact ? '' : 'content-wide grid gap-5 lg:grid-cols-[1.25fr_.75fr] lg:items-center'}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">Hizmet modelimiz hakkında açık bilgi</p>
          <h2 id={compact ? undefined : 'independent-service-title'} className={`${compact ? 'mt-2 text-lg' : 'mt-2 text-xl sm:text-2xl'} font-black tracking-tight text-white`}>Operatör bakiyesi değil, bağımsız dijital ürün rehberi.</h2>
          <p className="mt-3 text-xs leading-6 text-slate-400 sm:text-sm sm:leading-7">Sky Bozum; Turkcell, Vodafone, Türk Telekom, Paycell, Pokus veya Vodafone Pay bakiyesini doğrudan satın almaz ve bu markalar adına bozum hizmeti yürütmez. Bu markaların geçtiği sayfalar, desteklenen mağazalardan dijital ürün veya EPIN satın alma adımlarını ve güvenlik kontrollerini açıklayan bağımsız rehberlerdir.</p>
        </div>
        <div className={`${compact ? 'mt-4' : ''} rounded-2xl border border-white/8 bg-black/20 p-4`}>
          <p className="text-xs leading-6 text-slate-400">Satın aldığınız kullanılmamış ve koşullara uygun kodu kendi hesabınızda kullanabilir, Sky Bozum’a değerlendirme için sunabilir veya başka bir alıcıyla işlem yapabilirsiniz.</p>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">Sky Bozum’un adı geçen markalarla ortaklık, temsilcilik, sponsorluk, yetkili satıcılık veya resmî referans ilişkisi yoktur. Marka ve logolar yalnız ilgili hizmetleri tanımlamak amacıyla kullanılır.</p>
          {!compact && <Link href="/iletisim#guvenlik" className="focus-ring mt-3 inline-flex rounded text-xs font-black text-amber-300 hover:text-amber-200">Hizmet ve güvenlik açıklamasını inceleyin →</Link>}
        </div>
      </div>
    </section>
  );
}
