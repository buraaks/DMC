import type { Brand, Product, ProductFilters, SiteSettings, StockStatus } from '../../shared/catalog'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import {

  createSlugFromText,
  defaultSiteSettings,
  ensureStringArray,
  isStockStatus,
  sortBrands,
} from '../../shared/catalog'

const productsFileName = 'products.json'
const brandsFileName = 'brands.json'
const siteSettingsFileName = 'site-settings.json'

export function getDataDirectory(baseDir = process.cwd()) {
  return resolve(baseDir, 'data')
}

export function getPublicUploadsDirectory(baseDir = process.cwd()) {
  return resolve(baseDir, 'public', 'uploads')
}

async function ensureStorage(baseDir = process.cwd()) {
  await mkdir(getDataDirectory(baseDir), { recursive: true })
  await mkdir(getPublicUploadsDirectory(baseDir), { recursive: true })
}

async function readJsonFile<T>(fileName: string, fallback: T, baseDir = process.cwd()): Promise<T> {
  await ensureStorage(baseDir)
  const filePath = resolve(getDataDirectory(baseDir), fileName)

  try {
    const raw = await readFile(filePath, 'utf8')
    return JSON.parse(raw) as T
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeJsonFile(fileName, fallback, baseDir)
      return fallback
    }

    throw error
  }
}

async function writeJsonFile<T>(fileName: string, payload: T, baseDir = process.cwd()) {
  await ensureStorage(baseDir)
  const filePath = resolve(getDataDirectory(baseDir), fileName)
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

export async function listProducts(baseDir = process.cwd()): Promise<Product[]> {
  return readJsonFile<Product[]>(productsFileName, [], baseDir)
}

export async function listBrands(baseDir = process.cwd()): Promise<Brand[]> {
  const brands = await readJsonFile<Brand[]>(brandsFileName, [], baseDir)
  return sortBrands(brands)
}

export async function getSiteSettings(baseDir = process.cwd()): Promise<SiteSettings> {
  const products = await listProducts(baseDir)
  const settings = await readJsonFile<SiteSettings>(siteSettingsFileName, defaultSiteSettings, baseDir)
  return normalizeSiteSettings(settings, products)
}

export function filterProducts(products: Product[], brands: Brand[], filters: ProductFilters): Product[] {
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

export function ensureUniqueSlug(slug: string, products: Product[], currentProductId?: string) {
  const baseSlug = slug || 'urun'
  let candidate = baseSlug
  let counter = 2

  while (products.some(product => product.id !== currentProductId && product.slug === candidate)) {
    candidate = `${baseSlug}-${counter}`
    counter += 1
  }

  return candidate
}

function ensureUniqueBrandSlug(slug: string, brands: Brand[], currentBrandId?: string) {
  const baseSlug = slug || 'marka'
  let candidate = baseSlug
  let counter = 2

  while (brands.some(brand => brand.id !== currentBrandId && brand.slug === candidate)) {
    candidate = `${baseSlug}-${counter}`
    counter += 1
  }

  return candidate
}

function sanitizeStockStatus(value: unknown): StockStatus {
  return isStockStatus(value) ? value : 'temin'
}

function sanitizeBrand(input: Partial<Brand>, brands: Brand[], currentBrand?: Brand): Brand {
  const name = input.name?.trim() || currentBrand?.name || 'Yeni Marka'
  const sortOrder = Number(input.sortOrder)

  return {
    id: currentBrand?.id || input.id || randomUUID(),
    slug: ensureUniqueBrandSlug(createSlugFromText(input.slug?.trim() || name), brands, currentBrand?.id),
    name,
    logoPath: input.logoPath?.trim() || currentBrand?.logoPath || '/uploads/brand-placeholder.svg',
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : currentBrand?.sortOrder || brands.length + 1,
  }
}

function sanitizeProduct(input: Partial<Product>, products: Product[], currentProduct?: Product): Product {
  const name = input.name?.trim() || currentProduct?.name || 'Yeni Ürün'
  const shortDescription = input.shortDescription?.trim() || currentProduct?.shortDescription || ''

  return {
    id: currentProduct?.id || input.id || randomUUID(),
    slug: ensureUniqueSlug(createSlugFromText(input.slug?.trim() || name), products, currentProduct?.id),
    name,
    shortDescription,
    technicalDetails: ensureStringArray(input.technicalDetails ?? currentProduct?.technicalDetails),
    brandId: input.brandId?.trim() || currentProduct?.brandId || '',
    category: input.category?.trim() || currentProduct?.category || '',
    stockStatus: sanitizeStockStatus(input.stockStatus ?? currentProduct?.stockStatus),
    whatsappMessage: input.whatsappMessage?.trim() || currentProduct?.whatsappMessage || `Merhaba, ${name} ürünü hakkında bilgi almak istiyorum.`,
    imagePaths: ensureStringArray(input.imagePaths ?? currentProduct?.imagePaths),
    relatedProductIds: ensureStringArray(input.relatedProductIds ?? currentProduct?.relatedProductIds)
      .filter(relatedId => relatedId !== (currentProduct?.id || input.id)),
    featured: Boolean(input.featured ?? currentProduct?.featured),
    seoTitle: input.seoTitle?.trim() || currentProduct?.seoTitle || `${name} | DMC Otomasyon`,
    seoDescription: input.seoDescription?.trim() || currentProduct?.seoDescription || shortDescription || `${name} için teklif ve stok bilgisi alın.`,
  }
}

function normalizeSiteSettings(input: Partial<SiteSettings>, products: Product[]): SiteSettings {
  const featuredProductIds = ensureStringArray(input.featuredProductIds)
    .filter(id => products.some(product => product.id === id))
    .slice(0, 5)

  return {
    siteName: input.siteName?.trim() || defaultSiteSettings.siteName,
    siteTagline: input.siteTagline?.trim() || defaultSiteSettings.siteTagline,
    logoPath: input.logoPath?.trim() || defaultSiteSettings.logoPath,
    footerNote: input.footerNote?.trim() || defaultSiteSettings.footerNote,
    hero: {
      eyebrow: input.hero?.eyebrow?.trim() || defaultSiteSettings.hero.eyebrow,
      title: input.hero?.title?.trim() || defaultSiteSettings.hero.title,
      description: input.hero?.description?.trim() || defaultSiteSettings.hero.description,
      imagePath: input.hero?.imagePath?.trim() || defaultSiteSettings.hero.imagePath,
      primaryCtaLabel: input.hero?.primaryCtaLabel?.trim() || defaultSiteSettings.hero.primaryCtaLabel,
      secondaryCtaLabel: input.hero?.secondaryCtaLabel?.trim() || defaultSiteSettings.hero.secondaryCtaLabel,
    },
    aboutTitle: input.aboutTitle?.trim() || defaultSiteSettings.aboutTitle,
    aboutBody: input.aboutBody?.trim() || defaultSiteSettings.aboutBody,
    brandSectionTitle: input.brandSectionTitle?.trim() || defaultSiteSettings.brandSectionTitle,
    featuredSectionTitle: input.featuredSectionTitle?.trim() || defaultSiteSettings.featuredSectionTitle,
    contactTitle: input.contactTitle?.trim() || defaultSiteSettings.contactTitle,
    contactIntro: input.contactIntro?.trim() || defaultSiteSettings.contactIntro,
    featuredProductIds: featuredProductIds.length ? featuredProductIds : defaultSiteSettings.featuredProductIds,
    whatsappNumber: input.whatsappNumber?.trim() || defaultSiteSettings.whatsappNumber,
    address: input.address?.trim() || defaultSiteSettings.address,
    phone: input.phone?.trim() || defaultSiteSettings.phone,
    email: input.email?.trim() || defaultSiteSettings.email,
    socialLinks: {
      instagram: input.socialLinks?.instagram?.trim() || defaultSiteSettings.socialLinks.instagram,
      whatsapp: input.socialLinks?.whatsapp?.trim() || defaultSiteSettings.socialLinks.whatsapp,
      facebook: input.socialLinks?.facebook?.trim() || defaultSiteSettings.socialLinks.facebook,
      linkedin: input.socialLinks?.linkedin?.trim() || defaultSiteSettings.socialLinks.linkedin,
    },
  }
}

export function resolveRelatedProducts(product: Product, products: Product[]) {
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

export async function getProductBySlug(slug: string, baseDir = process.cwd()) {
  const products = await listProducts(baseDir)
  return products.find(product => product.slug === slug) || null
}

export async function getProductById(id: string, baseDir = process.cwd()) {
  const products = await listProducts(baseDir)
  return products.find(product => product.id === id) || null
}

async function writeSiteSettings(settings: SiteSettings, baseDir = process.cwd()) {
  await writeJsonFile(siteSettingsFileName, settings, baseDir)
}

async function syncFeaturedProducts(products: Product[], changedProduct: Product, baseDir = process.cwd()) {
  const settings = await getSiteSettings(baseDir)
  const featuredSet = new Set(settings.featuredProductIds)

  if (changedProduct.featured) {
    featuredSet.delete(changedProduct.id)
    settings.featuredProductIds = [changedProduct.id, ...featuredSet].slice(0, 5)
  }
  else {
    settings.featuredProductIds = settings.featuredProductIds.filter(id => id !== changedProduct.id)
  }

  await writeSiteSettings(settings, baseDir)
}

export async function createProduct(input: Partial<Product>, baseDir = process.cwd()) {
  const products = await listProducts(baseDir)
  const product = sanitizeProduct(input, products)
  const nextProducts = [product, ...products]
  await writeJsonFile(productsFileName, nextProducts, baseDir)
  await syncFeaturedProducts(nextProducts, product, baseDir)
  return product
}

export async function updateProduct(id: string, input: Partial<Product>, baseDir = process.cwd()) {
  const products = await listProducts(baseDir)
  const currentProduct = products.find(product => product.id === id)

  if (!currentProduct) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Ürün bulunamadı.',
    })
  }

  const nextProduct = sanitizeProduct({ ...currentProduct, ...input, id }, products, currentProduct)
  const nextProducts = products.map(product => product.id === id ? nextProduct : product)
  await writeJsonFile(productsFileName, nextProducts, baseDir)
  await syncFeaturedProducts(nextProducts, nextProduct, baseDir)
  return nextProduct
}

export async function deleteProduct(id: string, baseDir = process.cwd()) {
  const products = await listProducts(baseDir)
  const nextProducts = products
    .filter(product => product.id !== id)
    .map(product => ({
      ...product,
      relatedProductIds: product.relatedProductIds.filter(relatedId => relatedId !== id),
    }))

  await writeJsonFile(productsFileName, nextProducts, baseDir)
  const settings = await getSiteSettings(baseDir)
  settings.featuredProductIds = settings.featuredProductIds.filter(featuredId => featuredId !== id)
  await writeSiteSettings(settings, baseDir)
}

export async function createBrand(input: Partial<Brand>, baseDir = process.cwd()) {
  const brands = await listBrands(baseDir)
  const brand = sanitizeBrand(input, brands)
  const nextBrands = sortBrands([...brands, brand])
  await writeJsonFile(brandsFileName, nextBrands, baseDir)
  return brand
}

export async function updateBrand(id: string, input: Partial<Brand>, baseDir = process.cwd()) {
  const brands = await listBrands(baseDir)
  const currentBrand = brands.find(brand => brand.id === id)

  if (!currentBrand) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Marka bulunamadı.',
    })
  }

  const nextBrand = sanitizeBrand({ ...currentBrand, ...input, id }, brands, currentBrand)
  const nextBrands = sortBrands(brands.map(brand => brand.id === id ? nextBrand : brand))
  await writeJsonFile(brandsFileName, nextBrands, baseDir)
  return nextBrand
}

export async function deleteBrand(id: string, baseDir = process.cwd()) {
  const brands = await listBrands(baseDir)
  const nextBrands = brands.filter(brand => brand.id !== id)
  await writeJsonFile(brandsFileName, nextBrands, baseDir)

  const products = await listProducts(baseDir)
  const nextProducts = products.map(product => product.brandId === id ? { ...product, brandId: '' } : product)
  await writeJsonFile(productsFileName, nextProducts, baseDir)
}

export async function updateSiteConfiguration(input: Partial<SiteSettings>, baseDir = process.cwd()) {
  const products = await listProducts(baseDir)
  const nextSettings = normalizeSiteSettings(input, products)
  await writeSiteSettings(nextSettings, baseDir)
  return nextSettings
}
