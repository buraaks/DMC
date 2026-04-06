import { requireHostAuth } from '~~/server/utils/host-auth'
import { saveUploadedImage } from '~~/server/utils/storage'
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

  const imagePath = await saveUploadedImage({
    data: imageFile.data,
    extension: validatedFile.extension,
    contentType: validatedFile.contentType,
  })

  return {
    path: imagePath,
  }
})
