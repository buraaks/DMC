import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createProduct, deleteProduct, listProducts, updateProduct } from '../../server/utils/catalog-data'
import { defaultSiteSettings } from '../../shared/catalog'

const workspaces: string[] = []

async function createWorkspace() {
  const workspace = await mkdtemp(join(tmpdir(), 'dmc-catalog-'))
  workspaces.push(workspace)

  await mkdir(join(workspace, 'data'), { recursive: true })
  await mkdir(join(workspace, 'public', 'uploads'), { recursive: true })

  await writeFile(join(workspace, 'data', 'brands.json'), JSON.stringify([], null, 2))
  await writeFile(join(workspace, 'data', 'site-settings.json'), JSON.stringify(defaultSiteSettings, null, 2))
  await writeFile(join(workspace, 'data', 'products.json'), JSON.stringify([
    {
      id: 'prd-1',
      slug: 'simatic-s7-1200',
      name: 'SIMATIC S7-1200',
      shortDescription: 'PLC',
      technicalDetails: ['Detay'],
      brandId: '',
      category: 'PLC',
      stockStatus: 'stokta',
      whatsappMessage: 'Merhaba',
      imagePaths: ['/uploads/a.svg'],
      relatedProductIds: [],
      featured: false,
      seoTitle: 'SIMATIC S7-1200',
      seoDescription: 'SEO',
    },
  ], null, 2))

  return workspace
}

afterEach(async () => {
  workspaces.length = 0
})

describe('catalog data persistence', () => {
  it('creates unique slugs when names collide', async () => {
    const workspace = await createWorkspace()
    const product = await createProduct({
      name: 'SIMATIC S7-1200',
      shortDescription: 'Yeni PLC',
      category: 'PLC',
      stockStatus: 'stokta',
    }, workspace)

    expect(product.slug).toBe('simatic-s7-1200-2')
    expect((await listProducts(workspace))[0].id).toBe(product.id)
  })

  it('updates and deletes persisted products', async () => {
    const workspace = await createWorkspace()
    const createdProduct = await createProduct({
      name: 'Delta HMI',
      shortDescription: 'HMI',
      category: 'HMI',
      stockStatus: 'sinirli',
    }, workspace)

    await updateProduct(createdProduct.id, {
      name: 'Delta HMI Revize',
      stockStatus: 'stokta',
    }, workspace)

    const updatedProduct = (await listProducts(workspace)).find(product => product.id === createdProduct.id)
    expect(updatedProduct?.name).toBe('Delta HMI Revize')
    expect(updatedProduct?.stockStatus).toBe('stokta')

    await deleteProduct(createdProduct.id, workspace)
    expect((await listProducts(workspace)).some(product => product.id === createdProduct.id)).toBe(false)
  })
})
