## DMC Site UI + Veri Güncelleme Planı

### Özet
- Header altında kalan üst boşluk sorununu merkezi olarak çözüp `Ürünler` ve `İletişim` sayfalarının ilk bloklarını tam görünür hale getireceğiz.
- Ana sayfa hero alanını biraz küçültüp 3 görselli, sağ-sol kontrollü ve dokunmatik/yatay kaydırma destekli bir slider’a çevireceğiz.
- Ana sayfadaki öne çıkan ürünleri de yatay kaydırılabilir vitrine dönüştüreceğiz.
- Ürünlere esnek metin tabanlı fiyat alanı ekleyeceğiz; fiyat girilmemiş ürünlerde varsayılan metin gösterilecek.
- İletişim sayfasına başlığın hemen altına büyük Google Maps haritası ekleyeceğiz ve bunu host panelinden yönetilebilir yapacağız.
- WhatsApp butonlarındaki `WA` metnini gerçek WhatsApp ikonu ile değiştireceğiz.

### Uygulama Değişiklikleri
- Layout ve spacing:
  - Sabit header için tek bir üst ofset tanımlanacak; sayfa içi ekstra üst padding’ler azaltılıp çakışan boşluk kaldırılacak.
  - Bu düzen `default` layout üzerinden yönetilecek; `index`, `urunler`, `iletisim` ve ürün detayında ilk section’lar buna göre hizalanacak.

- Veri modeli ve kalıcılık:
  - `Product` modeline `priceText` alanı eklenecek.
  - `SiteSettings` modeline `mapUrl` alanı eklenecek.
  - `HeroContent` için `imagePaths: string[]` eklenecek; eski `imagePath` verisi okunurken fallback olarak desteklenecek.
  - Site ayarları normalize edilirken `hero.imagePaths` yoksa mevcut tekil görselden dizi üretilecek; kayıtta ilk görsel ayrıca legacy uyumluluk için `imagePath` olarak da tutulacak.
  - Ürün sanitize/persist akışı, depoda zaten bulunan opsiyonel ürün metadata’sını düşürmeden `priceText` ile birlikte koruyacak şekilde hizalanacak.

- Ana sayfa:
  - Hero alanı mevcut yüksekliğinden daha kompakt hale getirilecek.
  - Tek görsel yerine 3 slotlu hero slider kullanılacak; sol/sağ butonları, swipe ve yatay scroll-snap davranışı olacak.
  - İlk kurulumda 3 örnek görsel mevcut upload’lardaki görsellerden doldurulacak; sonrasında host panelinden değiştirilebilecek.
  - Öne çıkan ürünler grid yerine yatay kayan vitrine çevrilecek; masaüstünde oklar, mobilde swipe ile kullanılacak.
  - Ürün kartlarında fiyat CTA öncesinde gösterilecek; fiyat boşsa `Fiyat için iletişime geçin` metni çıkacak.

- Ürünler sayfası:
  - Üst bölümdeki kicker `Ürün Kataloğu` kaldırılacak.
  - Ana başlık `Tüm Ürünler` olacak.
  - Filtre alanları korunacak.
  - Liste kartlarında fiyat gösterimi ana sayfa kartlarıyla aynı kurala bağlanacak.

- İletişim sayfası:
  - Başlık ve açıklamanın hemen altına büyük bir harita bloğu eklenecek.
  - Harita, host panelindeki `mapUrl` alanından beslenecek.
  - `mapUrl` gömülebilir bir Google Maps adresiyse iframe doğrudan onu kullanacak; değilse iframe adres metninden türetilen embed ile çalışacak, dış link/buton ise `mapUrl` ile açılacak.
  - İletişim kartı içinde ayrıca `Haritada Aç` aksiyonu bulunacak.

- Host yönetim paneli:
  - İletişim ayarlarına `Google Maps Konum Linki` alanı eklenecek.
  - Anasayfa özelleştirmede tek banner görseli yerine 3 görsel slotu ve önizlemeleri olacak.
  - Ürün düzenleme formuna `Fiyat Bilgisi` metin alanı eklenecek.
  - Hosttan kaydedilen fiyat, harita linki ve hero görselleri storage’a kalıcı yazılacak.

- İkonlar ve küçük UI düzeltmeleri:
  - `SiteWhatsAppButton` içindeki `WA` yazısı kaldırılıp mevcut `SocialIcon` WhatsApp SVG’si veya eşdeğer gerçek ikon kullanılacak.
  - Sosyal/WhatsApp butonlarında ikon hizası tüm ekranlarda tutarlı hale getirilecek.

### Test Planı
- Unit testler:
  - Ürün oluşturma/güncellemede `priceText` değerinin korunması.
  - Site ayarları kaydında `mapUrl` ve `hero.imagePaths` alanlarının kalıcı yazılması.
  - Legacy `hero.imagePath` ile başlayan verinin yeni yapıya doğru normalize edilmesi.
  - Fiyat boş olduğunda fallback metninin kullanılacağı senaryonun yardımcı fonksiyon/normalize düzeyinde doğrulanması.

- Manuel kabul senaryoları:
  - `Ürünler` ve `İletişim` sayfası ilk bloğu header altında kırpılmadan görünmeli.
  - Ana sayfa hero slider 3 görselle açılmalı; oklarla ve yatay kaydırmayla değişmeli.
  - Öne çıkan ürünler yatay kaydırılabilmeli.
  - WhatsApp butonlarında gerçek ikon görünmeli.
  - İletişim sayfasındaki harita büyük blok olarak yüklenmeli ve konum doğru açılmalı.
  - Host panelinden fiyat, harita linki ve hero görselleri kaydedildikten sonra sayfa yenilense de veri korunmalı.

### Varsayımlar ve Seçilen Varsayılanlar
- Fiyat alanı serbest metin olacak; örnek formatlar `12.500 TL + KDV`, `Teklif isteyin`, `Adet bazlı fiyat`.
- Fiyat girilmemiş ürünlerde varsayılan metin `Fiyat için iletişime geçin` olacak.
- `Ürünler` sayfasındaki filtreler kaldırılmayacak; sadece üst başlık metni sadeleştirilecek.
- Slider uygulaması için yeni paket eklenmeyecek; hafif, yerel scroll-snap + buton mantığı kullanılacak.
- İlk 3 hero görseli mevcut repo/storage görsellerinden seçilecek; kalıcı yönetim host panelinden yapılacak.
