import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { getUploadsDirectory } from '~~/server/utils/catalog-data'
import { requireHostAuth } from '~~/server/utils/host-auth'
import { ensureRuntimeStorage } from '~~/server/utils/storage'
import { validateImageUpload } from '~~/server/utils/upload'

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

  const validatedFile = validateImageUpload({
    data: imageFile.data,
    type: imageFile.type,
  })

  await ensureRuntimeStorage()

  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}${validatedFile.extension}`
  const filePath = resolve(getUploadsDirectory(), fileName)

  await writeFile(filePath, imageFile.data)

  return {
    path: `/uploads/${fileName}`,
  }
})
