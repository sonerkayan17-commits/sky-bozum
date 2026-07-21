export default function Loading() {
  return (
    <main className="min-h-[70vh] bg-[#090b10] py-14 text-white" aria-busy="true" aria-label="Sayfa yükleniyor">
      <div className="content-shell animate-pulse">
        <div className="h-4 w-36 rounded bg-white/[0.06]" />
        <div className="mt-6 h-12 max-w-2xl rounded-xl bg-white/[0.07]" />
        <div className="mt-4 h-5 max-w-xl rounded bg-white/[0.05]" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[0,1,2].map((item) => <div key={item} className="h-56 rounded-2xl border border-white/8 bg-white/[0.035]" />)}
        </div>
      </div>
      <span className="sr-only">İçerik yükleniyor</span>
    </main>
  );
}
