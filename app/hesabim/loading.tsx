export default function AccountLoading() {
  return (
    <main
      className="grid min-h-[calc(100svh-68px)] place-items-center bg-[#090b10] px-5 text-white"
      aria-busy="true"
      aria-label="Hesap alanı yükleniyor"
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[.025] p-6 text-center">
        <span className="text-[10px] font-black tracking-[.18em] text-rose-300">SKY BOZUM</span>
        <p className="mt-3 text-sm font-bold text-slate-300">Hesap bilgileriniz hazırlanıyor…</p>
      </div>
    </main>
  );
}
