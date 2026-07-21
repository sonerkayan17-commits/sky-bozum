import type { Metadata } from 'next';
import Link from 'next/link';
import TrustChecklist from '../components/TrustChecklist';
import { buildWhatsAppUrl } from '../lib/conversion';

export const metadata: Metadata = {
  title: 'Güven Merkezi | Sky Bozum',
  description: 'Sky Bozum işlem süreci, güvenlik kontrolleri, resmi iletişim kanalları ve dolandırıcılıktan korunma rehberi.',
  alternates: { canonical: '/guven-merkezi' },
};

const principles = [
  ['Önce yazılı uygunluk', 'Kod, bakiye veya ürün satın almadan önce hizmetin güncel olarak uygun olup olmadığını yazılı şekilde doğrulayın.'],
  ['Tahmini ve kesin tutar ayrımı', 'Sitedeki hesaplamalar bilgilendirme amaçlıdır. Kesin oran ve ödeme tutarı işlem öncesinde paylaşılır.'],
  ['Hassas bilgileri koruyun', 'Kodun tamamını, kart güvenlik bilgisini, şifreyi veya tek kullanımlık SMS kodunu herkese açık alanlarda paylaşmayın.'],
  ['Size ait olmayan araçlarla işlem yapmayın', 'Başkasına ait hat, kart, hesap, kimlik veya kod ile işlem talebi oluşturmayın.'],
];

const faq = [
  ['Sky Bozum benden hangi bilgileri istemez?', 'Kart şifresi, internet bankacılığı şifresi, e-Devlet şifresi ve hesabınıza giriş yapmamızı sağlayacak kişisel erişim bilgileri istenmez.'],
  ['Sitedeki oran kesin midir?', 'Hayır. Gösterilen oranlar bilgilendirme aralığıdır; stok, ürün türü ve işlem koşullarına göre değişebilir.'],
  ['Kodumu ne zaman paylaşmalıyım?', 'Hizmet uygunluğu ve oran yazılı olarak onaylandıktan sonra, yalnızca resmi WhatsApp görüşmesindeki yönlendirmeye göre paylaşmalısınız.'],
  ['Şüpheli bir durumda ne yapmalıyım?', 'İşlemi durdurun, yeni bilgi paylaşmayın ve sitedeki resmi iletişim kanallarından doğrulama isteyin.'],
];

export default function TrustCenterPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
  };
  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b border-white/8 py-16 sm:py-24">
        <div className="content-shell max-w-5xl">
          <nav className="text-xs font-bold text-slate-500"><Link href="/" className="hover:text-emerald-300">Ana Sayfa</Link> <span className="mx-2">/</span> Güven Merkezi</nav>
          <p className="mt-8 text-xs font-extrabold uppercase tracking-[.18em] text-emerald-400">Şeffaf işlem ilkeleri</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Güvenli işlem, doğru bilgiden başlar.</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400">İşlemden önce neyi doğrulamanız, hangi bilgileri paylaşmamanız ve kesin tutarın nasıl belirlendiğini açık biçimde öğrenin.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href={buildWhatsAppUrl('Merhaba, Güven Merkezi üzerinden resmi iletişim ve işlem süreci hakkında bilgi almak istiyorum.')} target="_blank" rel="noopener noreferrer" className="btn-primary focus-ring">Resmi WhatsApp hattı</a><Link href="/sss" className="btn-secondary focus-ring">Sık sorulan sorular</Link></div>
        </div>
      </section>

      <section className="content-shell py-14">
        <div className="grid gap-4 md:grid-cols-2">{principles.map(([title, text], index) => <article key={title} className="premium-card p-6"><span className="text-xs font-black text-emerald-400">0{index + 1}</span><h2 className="mt-3 text-xl font-black">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-400">{text}</p></article>)}</div>
      </section>

      <section className="content-shell grid gap-8 pb-16 lg:grid-cols-[1fr_.9fr]">
        <div className="premium-card p-6 sm:p-8"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-rose-400">Dolandırıcılıktan korunma</p><h2 className="mt-3 text-2xl font-black">Bu işaretlerde işlemi durdurun</h2><ul className="mt-5 space-y-4 text-sm leading-7 text-slate-400"><li>• Size ait olmayan hesap veya ödeme aracını kullanmanız isteniyorsa.</li><li>• Kesin oran verilmeden kodu hemen paylaşmanız isteniyorsa.</li><li>• Şifre, SMS doğrulama kodu veya uzaktan erişim talep ediliyorsa.</li><li>• İletişim, sitede belirtilen resmi kanallar dışında sürdürülüyorsa.</li></ul></div>
        <TrustChecklist context="Güven Merkezi" />
      </section>

      <section className="border-t border-white/8 bg-[#0d1016] py-14"><div className="content-shell max-w-5xl"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-400">Sık sorulanlar</p><div className="mt-6 space-y-3">{faq.map(([question, answer]) => <details key={question} className="premium-card px-5"><summary className="cursor-pointer py-5 font-extrabold">{question}</summary><p className="border-t border-white/8 pb-5 pt-4 text-sm leading-7 text-slate-400">{answer}</p></details>)}</div></div></section>
    </main>
  );
}
