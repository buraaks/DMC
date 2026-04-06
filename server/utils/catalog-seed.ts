import type { Brand, Product, SiteSettings } from '../../shared/catalog'

const seedBrands: Brand[] = [
  {
    id: 'brand-siemens',
    slug: 'siemens',
    name: 'Siemens',
    logoPath: '/uploads/brand-siemens.svg',
    sortOrder: 1,
  },
  {
    id: 'brand-schneider',
    slug: 'schneider-electric',
    name: 'Schneider Electric',
    logoPath: '/uploads/brand-schneider.svg',
    sortOrder: 2,
  },
  {
    id: 'brand-delta',
    slug: 'delta',
    name: 'Delta',
    logoPath: '/uploads/brand-delta.svg',
    sortOrder: 3,
  },
  {
    id: 'brand-yaskawa',
    slug: 'yaskawa',
    name: 'Yaskawa',
    logoPath: '/uploads/brand-yaskawa.svg',
    sortOrder: 4,
  },
  {
    id: 'brand-wieland',
    slug: 'wieland',
    name: 'Wieland',
    logoPath: '/uploads/brand-wieland.svg',
    sortOrder: 5,
  },
  {
    id: 'brand-wenglor',
    slug: 'wenglor',
    name: 'Wenglor',
    logoPath: '/uploads/brand-wenglor.svg',
    sortOrder: 6,
  },
  {
    id: 'brand-ewon',
    slug: 'ewon',
    name: 'Ewon',
    logoPath: '/uploads/brand-ewon.svg',
    sortOrder: 7,
  },
]

const seedProducts: Product[] = [
  {
    id: 'prd-simatic-s7-1200',
    slug: 'simatic-s7-1200-cpu-1214c',
    name: 'SIMATIC S7-1200 CPU 1214C',
    shortDescription: 'Kompakt gövde, yüksek haberleşme esnekliği ve standart makine otomasyonları için güçlü PLC çözümü.',
    technicalDetails: [
      '14 DI / 10 DO entegre I/O',
      'PROFINET haberleşme desteği',
      'Genişletilebilir modüler yapı',
      'TIA Portal ile hızlı devreye alma',
    ],
    brandId: 'brand-siemens',
    category: 'PLC',
    stockStatus: 'stokta',
    whatsappMessage: 'Merhaba, SIMATIC S7-1200 CPU 1214C ürünü için fiyat ve stok bilgisi almak istiyorum.',
    imagePaths: [
      '/uploads/1775459583090-0b7e9436.png',
    ],
    relatedProductIds: [
      'prd-siemens-softstarter',
      'prd-delta-hmi',
    ],
    featured: true,
    seoTitle: 'SIMATIC S7-1200 CPU 1214C | DMC Otomasyon',
    seoDescription: 'SIMATIC S7-1200 CPU 1214C için teknik detay, stok durumu ve hızlı WhatsApp teklifi.',
  },
  {
    id: 'prd-siemens-softstarter',
    slug: 'siemens-sirius-3rw40-soft-starter',
    name: 'Siemens SIRIUS 3RW40 Soft Starter',
    shortDescription: 'Motor kalkış akımını yumuşak şekilde yöneten kompakt soft starter çözümü.',
    technicalDetails: [
      '3 faz motor uygulamaları için kompakt tasarım',
      'Yumuşak kalkış ve duruş desteği',
      'DIN ray montaj uyumlu',
      'Düşük bakım ihtiyacı',
    ],
    brandId: 'brand-siemens',
    category: 'Soft Starter',
    stockStatus: 'sinirli',
    whatsappMessage: 'Merhaba, Siemens SIRIUS 3RW40 Soft Starter ürünü hakkında teklif almak istiyorum.',
    imagePaths: [
      '/uploads/product-softstarter.svg',
      '/uploads/product-control-panel.svg',
    ],
    relatedProductIds: [
      'prd-simatic-s7-1200',
      'prd-yaskawa-ga700',
    ],
    featured: true,
    seoTitle: 'Siemens SIRIUS 3RW40 Soft Starter | DMC Otomasyon',
    seoDescription: 'Siemens soft starter serisi için uygulama uyumu, stok ve teklif bilgisi.',
  },
  {
    id: 'prd-altivar-320',
    slug: 'schneider-altivar-320-vfd',
    name: 'Schneider Altivar 320 VFD',
    shortDescription: 'Kompakt sürücü yapısı ile konveyör, pompa ve yardımcı eksen uygulamalarında güvenilir performans.',
    technicalDetails: [
      'V/F ve sensörsüz vektör kontrol',
      'Modbus ve CANopen haberleşme seçenekleri',
      'Kompakt pano uyumlu tasarım',
      'Makine otomasyonlarına uygun hızlı parametreleme',
    ],
    brandId: 'brand-schneider',
    category: 'Sürücü',
    stockStatus: 'stokta',
    whatsappMessage: 'Merhaba, Schneider Altivar 320 VFD için teklif ve teslim süresi öğrenmek istiyorum.',
    imagePaths: [
      '/uploads/product-schneider-drive.svg',
      '/uploads/product-control-panel.svg',
    ],
    relatedProductIds: [
      'prd-yaskawa-ga700',
    ],
    featured: true,
    seoTitle: 'Schneider Altivar 320 VFD | DMC Otomasyon',
    seoDescription: 'Schneider Altivar 320 sürücü için stok, uygulama ve teklif bilgileri.',
  },
  {
    id: 'prd-delta-hmi',
    slug: 'delta-dop-107bv-hmi',
    name: 'Delta DOP-107BV HMI',
    shortDescription: 'Makine operatör panelleri için ekonomik ve hızlı devreye alınabilen dokunmatik HMI çözümü.',
    technicalDetails: [
      '7 inç dokunmatik ekran',
      'Yüksek kontrastlı kullanıcı arayüzü',
      'PLC markalarıyla geniş haberleşme desteği',
      'Kolay proje aktarımı ve bakım',
    ],
    brandId: 'brand-delta',
    category: 'HMI',
    stockStatus: 'stokta',
    whatsappMessage: 'Merhaba, Delta DOP-107BV HMI ürünü hakkında fiyat almak istiyorum.',
    imagePaths: [
      '/uploads/product-delta-hmi.svg',
      '/uploads/product-control-panel.svg',
    ],
    relatedProductIds: [
      'prd-simatic-s7-1200',
    ],
    featured: true,
    seoTitle: 'Delta DOP-107BV HMI | DMC Otomasyon',
    seoDescription: 'Delta HMI serisi için teknik bilgi, stok durumu ve WhatsApp sipariş bağlantısı.',
  },
  {
    id: 'prd-yaskawa-ga700',
    slug: 'yaskawa-ga700-inverter',
    name: 'Yaskawa GA700 Inverter',
    shortDescription: 'Zorlu endüstriyel ortamlarda kararlı çalışma sağlayan yüksek performanslı inverter.',
    technicalDetails: [
      'Ağır hizmet uygulamaları için tork kontrol desteği',
      'Gelişmiş güvenlik ve motor koruma fonksiyonları',
      'Kolay devreye alma sihirbazı',
      'Uzun ömürlü soğutma mimarisi',
    ],
    brandId: 'brand-yaskawa',
    category: 'Sürücü',
    stockStatus: 'sinirli',
    whatsappMessage: 'Merhaba, Yaskawa GA700 Inverter için teklif talep ediyorum.',
    imagePaths: [
      '/uploads/product-yaskawa-drive.svg',
      '/uploads/product-control-panel.svg',
    ],
    relatedProductIds: [
      'prd-altivar-320',
    ],
    featured: true,
    seoTitle: 'Yaskawa GA700 Inverter | DMC Otomasyon',
    seoDescription: 'Yaskawa GA700 inverter için stok, teknik detay ve hızlı teklif bilgileri.',
  },
  {
    id: 'prd-wieland-samos',
    slug: 'wieland-samos-pro-compact',
    name: 'Wieland samos PRO Compact',
    shortDescription: 'Makine emniyeti uygulamalarında esnek konfigürasyon sunan kompakt güvenlik kontrolörü.',
    technicalDetails: [
      'Programlanabilir güvenlik modülü',
      'Makine emniyeti devrelerinde esnek giriş/çıkış yapısı',
      'Kompakt pano yerleşimine uygun',
      'Hızlı teşhis ve bakım desteği',
    ],
    brandId: 'brand-wieland',
    category: 'Güvenlik',
    stockStatus: 'temin',
    whatsappMessage: 'Merhaba, Wieland samos PRO Compact için termin ve teklif bilgisi alabilir miyim?',
    imagePaths: [
      '/uploads/product-wieland-safety.svg',
      '/uploads/product-control-panel.svg',
    ],
    relatedProductIds: [],
    featured: false,
    seoTitle: 'Wieland samos PRO Compact | DMC Otomasyon',
    seoDescription: 'Wieland güvenlik kontrolörü için teknik ve termin bilgisi.',
  },
  {
    id: 'prd-wenglor-sensor',
    slug: 'wenglor-px2-photoelectric-sensor',
    name: 'Wenglor PX2 Fotoelektrik Sensör',
    shortDescription: 'Hızlı tepki süresi ve kararlı algılama için endüstriyel sensör çözümü.',
    technicalDetails: [
      'Yüksek hassasiyetli algılama',
      'Kompakt metal gövde seçenekleri',
      'Uzun ömürlü saha performansı',
      'Kolay montaj ve bakım',
    ],
    brandId: 'brand-wenglor',
    category: 'Sensör',
    stockStatus: 'stokta',
    whatsappMessage: 'Merhaba, Wenglor PX2 Fotoelektrik Sensör için fiyat bilgisi almak istiyorum.',
    imagePaths: [
      '/uploads/product-wenglor-sensor.svg',
      '/uploads/product-control-panel.svg',
    ],
    relatedProductIds: [],
    featured: false,
    seoTitle: 'Wenglor PX2 Fotoelektrik Sensör | DMC Otomasyon',
    seoDescription: 'Wenglor sensör çözümleri için teknik detay ve teklif bilgileri.',
  },
]

const seedSiteSettings: SiteSettings = {
  siteName: 'DMC Otomasyon',
  siteTagline: 'PLC, sürücü ve endüstriyel otomasyon ürünlerinde hızlı tedarik',
  logoPath: '/DMClogo.svg',
  footerNote: 'PLC, HMI, sürücü ve sensör ihtiyaçlarınız için hızlı geri dönüş ve teknik danışmanlık.',
  hero: {
    eyebrow: 'PLC / OTOMASYON / TEKNİK DESTEK',
    title: 'Endüstriyel otomasyon projeleri için güvenilir ürün ve hızlı teknik destek.',
    description: 'DMC Otomasyon; PLC, sürücü, HMI, sensör ve güvenlik ürünlerinde sahaya uygun bileşenleri doğru marka eşleşmeleriyle sunar.',
    imagePath: '/uploads/hero-industrial.svg',
    primaryCtaLabel: 'WhatsApp ile Ulaşın',
    secondaryCtaLabel: 'Ürünleri İnceleyin',
  },
  aboutTitle: 'Bütün endüstriyel tedarik ihtiyaçlarınız için',
  aboutBody: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  brandSectionTitle: 'Çalıştığımız markalar',
  featuredSectionTitle: 'Öne çıkan ürünler',
  contactTitle: 'Projeye uygun teklif ve ürün doğrulaması için bize ulaşın',
  contactIntro: 'Stok teyidi, alternatif ürün ve uygulama uyumu için bize WhatsApp, telefon veya e-posta üzerinden ulaşabilirsiniz.',
  featuredProductIds: [
    'prd-simatic-s7-1200',
    'prd-siemens-softstarter',
    'prd-altivar-320',
    'prd-delta-hmi',
    'prd-yaskawa-ga700',
  ],
  whatsappNumber: '905551234567',
  address: 'İkitelli Organize Sanayi Bölgesi, Başakşehir / İstanbul',
  phone: '+90 555 123 45 67',
  email: 'info@dmcotomasyon.com',
  socialLinks: {
    instagram: 'https://instagram.com/dmcotomasyon',
    whatsapp: 'https://wa.me/905551234567',
    facebook: 'https://facebook.com/dmcotomasyon',
    linkedin: 'https://linkedin.com/company/dmcotomasyon',
  },
}

export function cloneSeedBrands() {
  return structuredClone(seedBrands)
}

export function cloneSeedProducts() {
  return structuredClone(seedProducts)
}

export function cloneSeedSiteSettings() {
  return structuredClone(seedSiteSettings)
}
