import Image from "next/image";
import Link from "next/link";
import type { ServiceItem } from "../../lib/site";
import { siteConfig } from "../../lib/site";
import { ArrowIcon, CheckIcon, ShieldIcon } from "../ui/Icons";

export default function ServiceDetail({ service }: { service: ServiceItem }) {
  return <main className="bg-white">
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-blue-600/25 blur-[120px]" />
      <div className="absolute -bottom-48 -right-32 h-[36rem] w-[36rem] rounded-full bg-cyan-500/15 blur-[130px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-28">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[.16em] text-blue-200"><Link href="/hizmetler">Hizmetler</Link><span>/</span><span>{service.shortName}</span></div>
          <h1 className="mt-7 text-4xl font-black leading-[1.06] tracking-[-.045em] sm:text-5xl lg:text-6xl">{service.name}</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{service.summary}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-blue-50">Güncel oran alın <ArrowIcon /></a>
            <Link href="/oran-hesapla" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 bg-white/[.06] px-7 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/[.1]">Oran hesaplayın</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">{service.highlights.map(x=><span key={x} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-4 py-2 text-xs font-bold text-slate-200"><CheckIcon className="h-4 w-4 text-emerald-300" />{x}</span>)}</div>
        </div>
        <div className="relative"><div className="absolute -inset-6 rounded-[40px] bg-blue-500/15 blur-3xl"/><div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[34px] border border-white/10 bg-white/[.07] p-10 shadow-[0_35px_100px_rgba(0,0,0,.35)] backdrop-blur-2xl"><Image src={service.logo} alt={`${service.shortName} logosu`} width={560} height={220} priority className="h-auto w-full max-w-[440px] object-contain" /></div></div>
      </div>
    </section>

    <section className="border-b border-slate-200 bg-slate-50"><div className="mx-auto grid max-w-7xl gap-5 px-5 py-14 md:grid-cols-3 lg:px-8">{service.steps.map((step,i)=><div key={step.title} className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm"><span className="text-sm font-black tracking-[.16em] text-blue-700">0{i+1}</span><h2 className="mt-3 text-lg font-black text-slate-950">{step.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{step.text}</p></div>)}</div></section>

    <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-24">
      <article className="max-w-4xl">{service.sections.map((section,index)=><section key={section.title} className={index ? "mt-16" : ""}><h2 className="text-3xl font-black tracking-[-.035em] text-slate-950 sm:text-4xl">{section.title}</h2><div className="mt-6 space-y-5 text-base leading-8 text-slate-700">{section.paragraphs.map(p=><p key={p}>{p}</p>)}</div>{section.bullets && <div className="mt-6 space-y-3">{section.bullets.map(b=><div key={b} className="flex gap-3"><span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700"><CheckIcon className="h-4 w-4" /></span><p className="leading-7 text-slate-700">{b}</p></div>)}</div>}</section>)}</article>
      <aside className="lg:sticky lg:top-28 lg:self-start"><div className="rounded-[28px] bg-slate-950 p-7 text-white shadow-2xl"><ShieldIcon className="h-10 w-10 text-blue-300"/><p className="mt-5 text-xs font-black uppercase tracking-[.18em] text-blue-300">İşlem öncesi</p><h2 className="mt-3 text-2xl font-black">Mutlaka güncel oran alın</h2><p className="mt-4 text-sm leading-7 text-slate-300">Oranlar ve stok durumu değişebilir. Ürün satın almadan önce uygunluk bilgisi alın.</p><a href={siteConfig.whatsapp} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full min-h-13 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-slate-950">WhatsApp ile yazın</a></div></aside>
    </div>

    <section className="bg-[#f6f8fc] py-16 lg:py-24"><div className="mx-auto max-w-4xl px-5 lg:px-8"><p className="text-sm font-black uppercase tracking-[.18em] text-blue-700">Sık sorulan sorular</p><h2 className="mt-4 text-3xl font-black tracking-[-.035em] text-slate-950 sm:text-4xl">{service.shortName} hakkında merak edilenler</h2><div className="mt-8 space-y-4">{service.faq.map(item=><details key={item.question} className="group rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"><summary className="cursor-pointer list-none pr-8 text-lg font-black text-slate-950">{item.question}</summary><p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p></details>)}</div></div></section>
  </main>;
}
