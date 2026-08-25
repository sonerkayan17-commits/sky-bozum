export default function IndependentServiceNotice({ compact = false, id }: { compact?: boolean; id?: string }) {
  return (
    <section id={id} className={`${compact ? 'rounded-2xl border border-amber-300/15 bg-amber-300/[0.035] p-5' : 'scroll-mt-24 border-y border-white/8 bg-[#0b0e14] py-7'}`} aria-labelledby={compact ? undefined : 'independent-service-title'}>
      <div className={compact ? '' : 'content-wide grid gap-5 lg:grid-cols-[1.25fr_.75fr] lg:items-center'}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">Hizmet modelimiz hakkında açık bilgi</p>
          <h2 id={compact ? undefined : 'independent-service-title'} className={`${compact ? 'mt-2 text-lg' : 'mt-2 text-xl sm:text-2xl'} font-black tracking-tight text-white`}>Operatör bakiyesi değil, bağımsız dijital ürün rehberi.</h2>
          <p className="mt-3 text-xs leading-6 text-slate-400 sm:text-sm sm:leading-7">Sky Bozum, operatör mobil ödeme limitini veya dijital cüzdan bakiyesini doğrudan nakde çevirmez. Bu sayfalar; Turkcell, Vodafone, Türk Telekom, Paycell, Pokus veya Vodafone Pay ile Razer Gold ve benzeri dijital kodların güvenli biçimde nasıl satın alınacağını adım adım açıklar. Satın aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum&apos;a satabilirsiniz.</p>
        </div>
        <div className={`${compact ? 'mt-4' : ''} rounded-2xl border border-white/8 bg-black/20 p-4`}>
          <p className="text-xs leading-6 text-slate-400">Satın aldığınız kullanılmamış kodu kendi hesabınızda kullanabilir veya kodun türü, bölgesi ve stok durumu yazılı olarak onaylandıktan sonra Sky Bozum’a satabilirsiniz.</p>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">Sky Bozum’un adı geçen markalarla ortaklık, temsilcilik, sponsorluk, yetkili satıcılık veya resmî referans ilişkisi yoktur. Marka ve logolar yalnız ilgili hizmetleri tanımlamak amacıyla kullanılır.</p>
        </div>
      </div>
    </section>
  );
}
