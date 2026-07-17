import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetail from "../../components/services/ServiceDetail";
import { getService, services } from "../../lib/site";

export function generateStaticParams() { return services.map(service => ({ slug: service.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const service = getService(slug); if (!service) return {};
  return { title: service.name, description: service.summary, alternates: { canonical: `/hizmetler/${service.slug}` }, openGraph: { title: service.name, description: service.summary, type: "article", url: `/hizmetler/${service.slug}` } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const service = getService(slug); if (!service) notFound(); return <ServiceDetail service={service} />; }
