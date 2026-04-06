import { extname } from 'node:path'
import { createHttpError } from './http-error'

export const maxImageUploadSize = 5 * 1024 * 1024

const fileTypeMatchers = [
  {
    extension: '.jpg',
    contentType: 'image/jpeg',
    matches(data: Uint8Array) {
      return data.length >= 3
        && data[0] === 0xFF
        && data[1] === 0xD8
        && data[2] === 0xFF
    },
  },
  {
    extension: '.png',
    contentType: 'image/png',
    matches(data: Uint8Array) {
      return data.length >= 8
        && data[0] === 0x89
        && data[1] === 0x50
        && data[2] === 0x4E
        && data[3] === 0x47
        && data[4] === 0x0D
        && data[5] === 0x0A
        && data[6] === 0x1A
        && data[7] === 0x0A
    },
  },
  {
    extension: '.webp',
    contentType: 'image/webp',
    matches(data: Uint8Array) {
      return data.length >= 12
        && String.fromCharCode(...data.slice(0, 4)) === 'RIFF'
        && String.fromCharCode(...data.slice(8, 12)) === 'WEBP'
    },
  },
  {
    extension: '.gif',
    contentType: 'image/gif',
    matches(data: Uint8Array) {
      return data.length >= 6
        && ['GIF87a', 'GIF89a'].includes(String.fromCharCode(...data.slice(0, 6)))
    },
  },
] as const

function normalizeMimeType(mimeType?: string | null) {
  return mimeType?.split(';')[0].trim().toLowerCase() || ''
}

export function detectImageFileType(data: Uint8Array) {
  return fileTypeMatchers.find(fileType => fileType.matches(data)) || null
}

export function validateImageUpload(file: { data: Uint8Array, type?: string | null }) {
  if (file.data.length === 0) {
    throw createHttpError({
      statusCode: 400,
      statusMessage: 'Yüklenen dosya boş.',
    })
  }

  if (file.data.length > maxImageUploadSize) {
    throw createHttpError({
      statusCode: 400,
      statusMessage: 'Görsel boyutu 5 MB sınırını aşıyor.',
    })
  }

  const detectedFileType = detectImageFileType(file.data)

  if (!detectedFileType) {
    throw createHttpError({
      statusCode: 400,
      statusMessage: 'Sadece JPG, PNG, WEBP veya GIF görseller yüklenebilir.',
    })
  }

  const declaredMimeType = normalizeMimeType(file.type)

  if (declaredMimeType && declaredMimeType !== detectedFileType.contentType) {
    throw createHttpError({
      statusCode: 400,
      statusMessage: 'Dosya tipi doğrulanamadı.',
    })
  }

  return detectedFileType
}

export function getUploadContentType(filePath: string) {
  switch (extname(filePath).toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.webp':
      return 'image/webp'
    case '.gif':
      return 'image/gif'
    case '.svg':
      return 'image/svg+xml'
    default:
      return 'application/octet-stream'
  }
}
