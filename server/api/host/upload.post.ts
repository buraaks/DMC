import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { getPublicUploadsDirectory } from '~~/server/utils/catalog-data'
import { requireHostAuth } from '~~/server/utils/host-auth'

function mimeTypeToExtension(mimeType?: string) {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/gif': '.gif',
  }

  return mimeType ? map[mimeType] || '' : ''
}

export default defineEventHandler(async (event) => {
  requireHostAuth(event)

  const files = await readMultipartFormData(event)
  const imageFile = files?.find(file => file.name === 'file' && file.data)

  if (!imageFile || !imageFile.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Yüklemek için bir görsel seçin.',
    })
  }

  const extension = extname(imageFile.filename || '') || mimeTypeToExtension(imageFile.type) || '.bin'
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}${extension}`
  const filePath = resolve(getPublicUploadsDirectory(), fileName)

  await writeFile(filePath, imageFile.data)

  return {
    path: `/uploads/${fileName}`,
  }
})
