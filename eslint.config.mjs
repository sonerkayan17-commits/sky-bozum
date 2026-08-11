import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // React 19'un yeni lint kuralları, mevcut çalışan istemci durumunu
      // efektler içinde senkronize eden eski bileşenleri hata olarak işaretliyor.
      // Davranış değişikliği oluşturmadan üretim geçişini korumak için kapatıldı.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",

      // Projede performans/erişilebilirlik gerekçeleriyle kontrollü kullanılan
      // yerel img etiketleri bulunuyor. Bunlar lint uyarısı üretmemeli.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
