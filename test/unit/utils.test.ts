import type { Brand, Product } from '../../shared/catalog'
import { describe, expect, it } from 'vitest'
import { buildBreadcrumbSchema, buildProductSchema, toAbsoluteUrl } from '../../app/utils/seo'
import { buildWhatsAppLink, filterCatalogProducts, resolveRelatedCatalogProducts } from '../../shared/catalog'

const brands: Brand[] = [
  {
    id: 'brand-siemens',
    slug: 'siemens',
    name: 'Siemens',
    logoPath: '/uploads/brand-siemens.svg',
    sortOrder: 1,
  },
]

const products: Product[] = [
  {
    id: 'prd-1',
    slug: 'simatic-s7-1200',
    name: 'SIMATIC S7-1200',
    shortDescription: 'PLC kontrol birimi',
    technicalDetails: ['Profinet'],
    brandId: 'brand-siemens',
    category: 'PLC',
    stockStatus: 'stokta',
    whatsappMessage: 'Merhaba',
    imagePaths: ['/uploads/product-siemens-plc.svg'],
    relatedProductIds: ['prd-2'],
    featured: true,
    seoTitle: 'SIMATIC S7-1200',
    seoDescription: 'SIMATIC açıklama',
  },
  {
    id: 'prd-2',
    slug: 'simatic-et-200',
    name: 'SIMATIC ET 200',
    shortDescription: 'I/O modulu',
    technicalDetails: ['Moduler'],
    brandId: 'brand-siemens',
    category: 'PLC',
    stockStatus: 'sinirli',
    whatsappMessage: 'Merhaba',
    imagePaths: ['/uploads/product-control-panel.svg'],
    relatedProductIds: [],
    featured: false,
    seoTitle: 'SIMATIC ET 200',
    seoDescription: 'ET 200 açıklama',
  },
]

describe('catalog helpers', () => {
  it('builds whatsapp links with normalized numbers', () => {
    expect(buildWhatsAppLink('+90 555 123 45 67', 'Merhaba dunya'))
      .toBe('https://wa.me/905551234567?text=Merhaba+dunya')
  })

  it('filters products by search and brand slug', () => {
    expect(filterCatalogProducts(products, brands, { search: 'simatic', brand: 'siemens' }))
      .toHaveLength(2)

    expect(filterCatalogProducts(products, brands, { category: 'PLC', stockStatus: 'stokta' }))
      .toEqual([products[0]])
  })

  it('prefers explicit related products', () => {
    expect(resolveRelatedCatalogProducts(products[0], products).map(product => product.id))
      .toEqual(['prd-2'])
  })
})

describe('seo helpers', () => {
  it('creates absolute urls and breadcrumb schema', () => {
    expect(toAbsoluteUrl('https://dmc.example.com', '/urunler'))
      .toBe('https://dmc.example.com/urunler')

    expect(buildBreadcrumbSchema('https://dmc.example.com', [
      { name: 'Anasayfa', path: '/' },
      { name: 'Ürünler', path: '/urunler' },
    ]).itemListElement).toHaveLength(2)
  })

  it('builds product schema images and offer url', () => {
    const schema = buildProductSchema('https://dmc.example.com', products[0], 'Siemens')

    expect(schema.image).toContain('https://dmc.example.com/uploads/product-siemens-plc.svg')
    expect(schema.offers.url).toBe('https://dmc.example.com/urun/simatic-s7-1200')
  })
})
