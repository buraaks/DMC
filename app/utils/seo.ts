import type { Product, SiteSettings } from '../../shared/catalog'
import { ensureProductImagePaths } from '../../shared/catalog'

export interface BreadcrumbItem {
  name: string
  path: string
}

export function toAbsoluteUrl(baseUrl: string, path: string) {
  return new URL(path, baseUrl).toString()
}

export function buildBreadcrumbSchema(baseUrl: string, items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': toAbsoluteUrl(baseUrl, item.path),
    })),
  }
}

export function buildOrganizationSchema(baseUrl: string, settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': settings.siteName,
    'url': toAbsoluteUrl(baseUrl, '/'),
    'logo': toAbsoluteUrl(baseUrl, settings.logoPath),
    'telephone': settings.phone,
    'email': settings.email,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': settings.address,
      'addressLocality': 'Istanbul',
      'addressCountry': 'TR',
    },
    'sameAs': Object.values(settings.socialLinks).filter(Boolean),
  }
}

export function buildProductSchema(baseUrl: string, product: Product, brandName?: string) {
  const productPathIdentifier = product.productCode || product.slug

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'description': product.seoDescription || product.shortDescription,
    'image': ensureProductImagePaths(product.imagePaths).map(imagePath => toAbsoluteUrl(baseUrl, imagePath)),
    'sku': product.id,
    'brand': brandName
      ? {
          '@type': 'Brand',
          'name': brandName,
        }
      : undefined,
    'offers': {
      '@type': 'Offer',
      'availability': product.stockStatus === 'stokta'
        ? 'https://schema.org/InStock'
        : product.stockStatus === 'sinirli'
          ? 'https://schema.org/LimitedAvailability'
          : 'https://schema.org/PreOrder',
      'url': toAbsoluteUrl(baseUrl, `/urun/${productPathIdentifier}`),
      'priceCurrency': 'TRY',
    },
  }
}
