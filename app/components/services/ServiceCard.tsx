import Image from "next/image";
import Link from "next/link";
import type { ServiceItem } from "../../lib/site";
import { ArrowIcon } from "../ui/Icons";

const tones = {
  emerald: "from-emerald-50 via-white to-lime-50 border-emerald-200/70",
  blue: "from-blue-50 via-white to-cyan-50 border-blue-200/70",
  violet: "from-violet-50 via-white to-fuchsia-50 border-violet-200/70",
  orange: "from-orange-50 via-white to-amber-50 border-orange-200/70",
  rose: "from-rose-50 via-white to-red-50 border-rose-200/70",
  slate: "from-slate-100 via-white to-slate-50 border-slate-200",
};

export default function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <Link href={`/hizmetler/${service.slug}`} className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-[30px] border bg-white p-5 shadow-[0_15px_50px_rgba(15,23,42,.07)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,.14)]">
      <div className={`relative flex h-44 items-center justify-center overflow-hidden rounded-[24px] border bg-gradient-to-br ${tones[service.tone]}`}>
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/70 blur-2xl" />
        <Image src={service.logo} alt={`${service.shortName} logosu`} width={360} height={150} className="relative z-10 h-28 w-[78%] object-contain transition duration-500 group-hover:scale-110" />
        {service.popular && <span className="absolute left-4 top-4 rounded-full bg-slate-950 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.15em] text-white">Popüler</span>}
        <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md transition group-hover:translate-x-1 group-hover:bg-slate-950 group-hover:text-white"><ArrowIcon /></span>
      </div>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-7">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-black uppercase tracking-[.18em] text-blue-700">{service.category}</p>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{service.rate}</span>
        </div>
        <h3 className="mt-3 text-2xl font-black tracking-[-.03em] text-slate-950">{service.shortName}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
        <div className="mt-auto flex items-center gap-2 pt-7 text-sm font-black text-slate-950">Hizmeti incele <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" /></div>
      </div>
    </Link>
  );
}
