# Ana alan adı geçişi

Hedef ana alan adı `bozumcu.net.tr` olarak merkezî yapılandırmada tanımlıdır. Canlıya geçişte aşağıdaki sıra korunmalıdır:

1. `bozumcu.net.tr` ve `www.bozumcu.net.tr` Vercel projesine eklenir; DNS doğrulaması tamamlanır.
2. Vercel production ortamında `NEXT_PUBLIC_SITE_URL=https://bozumcu.net.tr` tanımlanır ve yeniden dağıtım yapılır.
3. Ana alan adı üzerinden ana sayfa, robots.txt, sitemap.xml ve en az üç makale URL'si 200 yanıtıyla doğrulanır.
4. Doğrulama tamamlandıktan sonra `PRIMARY_DOMAIN_REDIRECTS_ENABLED=true` yapılır. Bu anahtardan önce alternatif hostlar 308 yönlendirilmez; yalnız `noindex` başlığı alır.
5. Google Search Console'da Domain property doğrulanır ve yalnız `https://bozumcu.net.tr/sitemap.xml` gönderilir.
6. Eski URL karşılıkları aynı yolu koruyan tek adımlı 308 yönlendirmelerle denetlenir; alakasız sayfalar ana sayfaya topluca yönlendirilmez.

DNS ve Search Console sahipliği kod deposundan tamamlanamaz. Bu iki adım doğrulanmadan yönlendirme anahtarı açılmamalıdır.
