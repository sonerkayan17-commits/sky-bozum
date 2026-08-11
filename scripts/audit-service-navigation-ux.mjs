import fs from "node:fs";

const page = fs.readFileSync("app/components/services/ServiceDetail.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");

const checks = [
  ["Hizmet menüsü global başlığın altında", page.includes("top-[var(--site-header-height)]")],
  ["Hizmet menüsü yükseklik değişkeni", css.includes("--service-section-nav-height:58px")],
  ["Hizmet anchor boşluğu", css.includes(".service-section-anchor{scroll-margin-top:calc(var(--site-header-height) + var(--service-section-nav-height) + 16px)}")],
  ["Nasıl çalışır anchor", page.includes('id="nasil-calisir" className="service-section-anchor')],
  ["Hesapla anchor", page.includes('id="hesapla" className="service-section-anchor')],
  ["Rehberler anchor", page.includes('id="rehberler" className="service-section-anchor')],
  ["Sorun çözme anchor", page.includes('id="sorun-cozme" className="service-section-anchor')],
  ["İşlem başlat anchor", page.includes('id="islem-baslat" className="service-section-anchor')],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? "✓" : "✗"} ${label}`);
  if (!ok) failed += 1;
}
if (failed) process.exit(1);
console.log(`Hizmet navigasyonu UX denetimi: ${checks.length}/${checks.length} başarılı`);
