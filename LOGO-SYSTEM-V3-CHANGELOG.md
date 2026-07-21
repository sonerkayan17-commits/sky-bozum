# Sky Bozum Logo System V3

- Tüm `/logos/...` çağrıları `public/brands/<marka>/<marka>.svg` standardına taşındı.
- Apple, Razer Gold, Steam, Turkcell, Türk Telekom, Vodafone, Paycell ve Pokus dosyaları tek marka ağacında toplandı.
- Apple logosu koyu temada kaybolmaması için beyaz premium yüzeyde gösterildi.
- Dijital cüzdan alanına Vodafone Pay eklendi; Paycell ve Pokus ile birlikte üçlü standart oluşturuldu.
- Dijital cüzdan kartına “Anında Bakiye” rozeti ve açıklaması eklendi.
- Hizmet kartlarında 100px logo alanı, 20px padding, 16px radius ve object-contain standardı uygulandı.
- Hero, marka şeridi, hizmet kartları, operatör sayfası, referans ikonları ve merkezi servis verileri yeni yollara geçirildi.
- Eski `public/logos` klasörü kaldırıldı.

## Final Fix
- Apple SVG kontrastı düzeltildi; beyaz logo yüzeylerinde görünür hale getirildi.
- Apple marka şeridi ve hero alanındaki filtre/zemin çakışması giderildi.
- Hizmet kartı logo yüzeylerinde merkezleme ve object-contain standardı güçlendirildi.
- Mobil hover hareketi daha dengeli hale getirildi.
- Vodafone Pay, Paycell ve Pokus dijital cüzdan kartında doğrulandı.
- Eski /logos yolu bulunmadı; tüm /brands referansları doğrulandı.
