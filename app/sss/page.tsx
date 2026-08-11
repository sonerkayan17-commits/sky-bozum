import type { Metadata } from "next";
import { SkyFaqModule } from "./faq-module/components/SkyFaqModule";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description:
    "Sky Bozum hizmetleri, işlem süreci, oranlar, ödeme ve güvenlik hakkındaki güncel soruların net yanıtlarını inceleyin.",
  alternates: { canonical: "/sss" },
  openGraph: {
    title: "Sıkça Sorulan Sorular | Sky Bozum",
    description:
      "Mobil ödeme, dijital kod, oran, ödeme ve güvenlik süreçleri hakkındaki soruların yanıtları.",
    url: "/sss",
    type: "website",
  },
};

export default function SssPage() {
  return (
    <main className="dark min-h-screen bg-slate-950 text-white">
      <SkyFaqModule
        stickyOffset={112}
        title="Sıkça Sorulan Sorular"
        description="İşlem öncesinden ödeme sonrasına kadar merak ettiğiniz konuları sade, güvenli ve anlaşılır biçimde bulun."
        searchPlaceholder="Sorunuzu, hizmeti veya işlem türünü yazın…"
        className="border-b border-white/[0.06]"
        supportLinks={{
          contact: "/iletisim",
        }}
      />
    </main>
  );
}
