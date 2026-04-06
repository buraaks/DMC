import { readFile, stat } from 'node:fs/promises'
import { ensureRuntimeStorage, resolveUploadStoragePath } from '~~/server/utils/storage'
import { getUploadContentType } from '~~/server/utils/upload'

export default defineEventHandler(async (event) => {
  await ensureRuntimeStorage()

  const uploadPath = getRouterParam(event, 'path')

  if (!uploadPath) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Dosya bulunamadı.',
    })
  }

  const filePath = resolveUploadStoragePath(uploadPath)

  if (!filePath) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz dosya yolu.',
    })
  }

  try {
    const fileStats = await stat(filePath)

    if (!fileStats.isFile()) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Dosya bulunamadı.',
      })
    }

    setResponseHeader(event, 'content-type', getUploadContentType(filePath))
    setResponseHeader(event, 'cache-control', 'public, max-age=3600')

    return readFile(filePath)
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Dosya bulunamadı.',
      })
    }

    throw error
  }
})
