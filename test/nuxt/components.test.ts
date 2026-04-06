import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ProductCard from '../../app/components/site/ProductCard.vue'

describe('product card', () => {
  it('renders product information and order cta', async () => {
    const wrapper = await mountSuspended(ProductCard, {
      props: {
        product: {
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
          relatedProductIds: [],
          featured: true,
          seoTitle: 'SIMATIC S7-1200',
          seoDescription: 'SEO açıklaması',
        },
        brandName: 'Siemens',
        whatsappNumber: '905551234567',
      },
    })

    expect(wrapper.text()).toContain('SIMATIC S7-1200')
    expect(wrapper.text()).toContain('WhatsApp Sipariş')
    expect(wrapper.text()).toContain('Siemens')
  })
})
