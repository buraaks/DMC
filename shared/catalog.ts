export const HOST_SESSION_COOKIE = 'dmc_host_session'
export const brandPlaceholderLogoPath = '/uploads/brand-placeholder.svg'
export const productPlaceholderImagePath = '/uploads/product-placeholder.svg'

export const stockStatusOptions = ['stokta', 'sinirli', 'temin'] as const

export type StockStatus = typeof stockStatusOptions[number]

export interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  technicalDetails: string[]
  brandId: string
  category: string
  stockStatus: StockStatus
  whatsappMessage: string
  imagePaths: string[]
  relatedProductIds: string[]
  featured: boolean
  seoTitle: string
  seoDescription: string
}

export interface Brand {
  id: string
  slug: string
  name: string
  logoPath: string
  sortOrder: number
}

export interface HeroContent {
  eyebrow: string
  title: string
  description: string
  imagePath: string
  primaryCtaLabel: string
  secondaryCtaLabel: string
}

export interface SocialLinks {
  instagram: string
  whatsapp: string
  facebook: string
  linkedin: string
}

export interface SiteSettings {
  siteName: string
  siteTagline: string
  logoPath: string
  footerNote: string
  hero: HeroContent
  aboutTitle: string
  aboutBody: string
  brandSectionTitle: string
  featuredSectionTitle: string
  contactTitle: string
  contactIntro: string
  featuredProductIds: string[]
  whatsappNumber: string
  address: string
  phone: string
  email: string
  socialLinks: SocialLinks
}

export interface ProductFilters {
  search?: string
  brand?: string
  category?: string
  stockStatus?: StockStatus | ''
}

export const stockStatusLabels: Record<StockStatus, string> = {
  stokta: 'Stokta',
  sinirli: 'Sınırlı Stok',
  temin: 'Temin Edilir',
}

export const defaultSiteSettings: SiteSettings = {
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
  aboutTitle: 'Sahada çalışan sistemler için doğru ürün, doğru yönlendirme.',
  aboutBody: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  brandSectionTitle: 'Çalıştığımız markalar',
  featuredSectionTitle: 'Öne çıkan ürünler',
  contactTitle: 'Projeye uygun teklif ve ürün doğrulaması için bize ulaşın',
  contactIntro: 'Stok teyidi, alternatif ürün ve uygulama uyumu için bize WhatsApp, telefon veya e-posta üzerinden ulaşabilirsiniz.',
  featuredProductIds: [],
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

const turkishCharacterMap: Record<string, string> = {
  ı: 'i',
  ğ: 'g',
  ü: 'u',
  ş: 's',
  ö: 'o',
  ç: 'c',
}

export function isStockStatus(value: unknown): value is StockStatus {
  return typeof value === 'string' && stockStatusOptions.includes(value as StockStatus)
}

export function ensureStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/g)
      .map(item => item.trim())
      .filter(Boolean)
  }

  return []
}

export function createSlugFromText(value: string): string {
  const normalized = Array.from(value.trim().toLocaleLowerCase('tr'))
    .map(character => turkishCharacterMap[character] || character)
    .join('')

  return normalized
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .trim()
}

export function ensureProductImagePaths(imagePaths: string[]): string[] {
  return imagePaths.length > 0 ? imagePaths : [productPlaceholderImagePath]
}

export function getPrimaryProductImagePath(imagePaths: string[]): string {
  return ensureProductImagePaths(imagePaths)[0]
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const normalizedPhone = phone.replace(/\D/g, '')
  const params = new URLSearchParams()

  if (message.trim()) {
    params.set('text', message.trim())
  }

  const query = params.toString()
  return `https://wa.me/${normalizedPhone}${query ? `?${query}` : ''}`
}

export function sortBrands(brands: Brand[]): Brand[] {
  return [...brands].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder
    }

    return left.name.localeCompare(right.name, 'tr')
  })
}

export function filterCatalogProducts(products: Product[], brands: Brand[], filters: ProductFilters): Product[] {
  const normalizedSearch = filters.search?.trim().toLowerCase()
  const brandLookup = new Map(brands.map(brand => [brand.id, brand]))

  return products.filter((product) => {
    const matchesSearch = !normalizedSearch || [
      product.name,
      product.shortDescription,
      product.category,
      brandLookup.get(product.brandId)?.name,
    ]
      .filter(Boolean)
      .some(field => field?.toLowerCase().includes(normalizedSearch))

    const matchesBrand = !filters.brand || brandLookup.get(product.brandId)?.slug === filters.brand
    const matchesCategory = !filters.category || product.category === filters.category
    const matchesStockStatus = !filters.stockStatus || product.stockStatus === filters.stockStatus

    return matchesSearch && matchesBrand && matchesCategory && matchesStockStatus
  })
}

export function resolveRelatedCatalogProducts(product: Product, products: Product[]) {
  const explicitMatches = product.relatedProductIds
    .map(relatedId => products.find(candidate => candidate.id === relatedId))
    .filter((candidate): candidate is Product => Boolean(candidate))

  if (explicitMatches.length > 0) {
    return explicitMatches.slice(0, 4)
  }

  return products
    .filter(candidate => candidate.id !== product.id && candidate.category === product.category)
    .slice(0, 4)
}
