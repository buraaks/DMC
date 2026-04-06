import { describe, expect, it } from 'vitest'
import { hasConfiguredHostPassword } from '../../server/utils/host-password'
import { detectImageFileType, validateImageUpload } from '../../server/utils/upload'

const pngBytes = Uint8Array.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00])

describe('upload validation', () => {
  it('detects valid raster uploads', () => {
    expect(detectImageFileType(pngBytes)).toMatchObject({
      extension: '.png',
      contentType: 'image/png',
    })
  })

  it('rejects unsupported image types', () => {
    expect(() => validateImageUpload({
      data: new TextEncoder().encode('<svg></svg>'),
      type: 'image/svg+xml',
    })).toThrow('Sadece JPG, PNG, WEBP veya GIF')
  })

  it('rejects mismatched mime types', () => {
    expect(() => validateImageUpload({
      data: pngBytes,
      type: 'image/jpeg',
    })).toThrow('Dosya tipi doğrulanamadı')
  })
})

describe('host auth configuration', () => {
  it('fails closed when host password is missing', () => {
    expect(hasConfiguredHostPassword('')).toBe(false)
    expect(hasConfiguredHostPassword(undefined)).toBe(false)
    expect(hasConfiguredHostPassword('test123')).toBe(true)
  })
})
