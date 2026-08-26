export default function GlobalLoading() {
  return (
    <main
      className="min-h-[55vh] bg-[#090b10] px-5 py-12 text-white"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ef7087]">
          Sky Bozum
        </p>
        <div className="mt-5 h-9 w-full max-w-xl animate-pulse rounded-lg bg-white/8" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded bg-white/6" />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-white/8 bg-white/[0.025]"
            />
          ))}
        </div>
        <span className="sr-only">Sayfa yükleniyor</span>
      </div>
    </main>
  );
}
