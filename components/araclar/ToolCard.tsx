export default function ToolCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-white/20">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg">
        ⚡
      </div>

      <h3 className="text-lg font-semibold tracking-tight">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-white/70">
        {description}
      </p>

      <div className="mt-6 inline-flex items-center text-sm font-medium text-white/90">
        Hesapla
        <span className="ml-2 transition group-hover:translate-x-1">→</span>
      </div>
    </article>
  );
}
