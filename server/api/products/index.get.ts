import type { StockStatus } from '~~/shared/catalog'
import { filterProducts, listBrands, listProducts } from '~~/server/utils/catalog-data'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const [products, brands] = await Promise.all([
    listProducts(),
    listBrands(),
  ])

  const stockStatus = typeof query.stockStatus === 'string'
    ? query.stockStatus as StockStatus
    : typeof query.stock === 'string'
      ? query.stock as StockStatus
      : ''

  return filterProducts(products, brands, {
    search: typeof query.search === 'string' ? query.search : undefined,
    brand: typeof query.brand === 'string' ? query.brand : undefined,
    category: typeof query.category === 'string' ? query.category : undefined,
    stockStatus,
  })
})
