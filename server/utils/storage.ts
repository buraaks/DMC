import { randomUUID } from 'node:crypto'
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { isAbsolute, resolve, sep } from 'node:path'
import process from 'node:process'
import { get as getBlob, put } from '@vercel/blob'

const seedDataFiles = ['brands.json', 'products.json', 'site-settings.json'] as const
const blobDataDirectory = 'catalog-data'
const blobJsonCacheControlMaxAge = 60

function resolveAppPath(baseDir: string, targetPath: string) {
  return isAbsolute(targetPath) ? targetPath : resolve(baseDir, targetPath)
}

function hasBlobStorageToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())
}

function getBlobDataPath(fileName: string) {
  return `${blobDataDirectory}/${fileName}`
}

async function streamToString(stream: ReadableStream<Uint8Array>) {
  return new Response(stream).text()
}

async function readBlobJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  const blobResponse = await getBlob(getBlobDataPath(fileName), {
    access: 'private',
    useCache: false,
  })

  if (blobResponse?.statusCode === 200 && blobResponse.stream) {
    const raw = await streamToString(blobResponse.stream)
    return JSON.parse(raw) as T
  }

  await writeBlobJsonFile(fileName, fallback)
  return fallback
}

async function writeBlobJsonFile<T>(fileName: string, payload: T) {
  await put(getBlobDataPath(fileName), `${JSON.stringify(payload, null, 2)}\n`, {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: blobJsonCacheControlMaxAge,
    contentType: 'application/json; charset=utf-8',
  })
}

export function getStorageRootDirectory(baseDir = process.cwd()) {
  const configuredDirectory = process.env.DMC_STORAGE_DIR?.trim()
  return configuredDirectory
    ? resolveAppPath(baseDir, configuredDirectory)
    : resolve(baseDir, 'storage')
}

export function getStorageDataDirectory(baseDir = process.cwd()) {
  return resolve(getStorageRootDirectory(baseDir), 'data')
}

export function getStorageUploadsDirectory(baseDir = process.cwd()) {
  return resolve(getStorageRootDirectory(baseDir), 'uploads')
}

export function getSeedDataDirectory(baseDir = process.cwd()) {
  return resolve(baseDir, 'seed', 'data')
}

export function getSeedUploadsDirectory(baseDir = process.cwd()) {
  return resolve(baseDir, 'seed', 'uploads')
}

async function copyMissingFiles(sourceDirectory: string, targetDirectory: string) {
  let entries: Awaited<ReturnType<typeof readdir>>

  try {
    entries = await readdir(sourceDirectory, { withFileTypes: true })
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return
    }

    throw error
  }

  await mkdir(targetDirectory, { recursive: true })

  for (const entry of entries) {
    const sourcePath = resolve(sourceDirectory, entry.name)
    const targetPath = resolve(targetDirectory, entry.name)

    if (entry.isDirectory()) {
      await copyMissingFiles(sourcePath, targetPath)
      continue
    }

    try {
      await copyFile(sourcePath, targetPath, 1)
    }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw error
      }
    }
  }
}

export async function ensureRuntimeStorage(baseDir = process.cwd()) {
  const storageDataDirectory = getStorageDataDirectory(baseDir)
  const storageUploadsDirectory = getStorageUploadsDirectory(baseDir)

  await mkdir(storageDataDirectory, { recursive: true })
  await mkdir(storageUploadsDirectory, { recursive: true })

  const seedDataDirectory = getSeedDataDirectory(baseDir)

  for (const fileName of seedDataFiles) {
    const sourcePath = resolve(seedDataDirectory, fileName)
    const targetPath = resolve(storageDataDirectory, fileName)

    try {
      await copyFile(sourcePath, targetPath, 1)
    }
    catch (error) {
      const errorCode = (error as NodeJS.ErrnoException).code

      if (errorCode !== 'EEXIST' && errorCode !== 'ENOENT') {
        throw error
      }
    }
  }

  await copyMissingFiles(getSeedUploadsDirectory(baseDir), storageUploadsDirectory)
}

export function isBlobStorageEnabled() {
  return hasBlobStorageToken()
}

export async function readStorageDataFile<T>(fileName: string, fallback: T, baseDir = process.cwd()): Promise<T> {
  if (isBlobStorageEnabled()) {
    return readBlobJsonFile(fileName, fallback)
  }

  await ensureRuntimeStorage(baseDir)
  const filePath = resolve(getStorageDataDirectory(baseDir), fileName)

  try {
    const raw = await readFile(filePath, 'utf8')
    return JSON.parse(raw) as T
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeStorageDataFile(fileName, fallback, baseDir)
      return fallback
    }

    throw error
  }
}

export async function writeStorageDataFile<T>(fileName: string, payload: T, baseDir = process.cwd()) {
  if (isBlobStorageEnabled()) {
    await writeBlobJsonFile(fileName, payload)
    return
  }

  await ensureRuntimeStorage(baseDir)
  const filePath = resolve(getStorageDataDirectory(baseDir), fileName)
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

export async function saveUploadedImage(
  file: { data: Uint8Array, extension: string, contentType: string },
  baseDir = process.cwd(),
) {
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}${file.extension}`

  if (isBlobStorageEnabled()) {
    const blob = await put(`uploads/${fileName}`, file.data, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.contentType,
    })

    return blob.url
  }

  await ensureRuntimeStorage(baseDir)
  const filePath = resolve(getStorageUploadsDirectory(baseDir), fileName)
  await writeFile(filePath, file.data)

  return `/uploads/${fileName}`
}

export function resolveUploadStoragePath(relativePath: string, baseDir = process.cwd()) {
  const normalizedUploadsDirectory = resolve(getStorageUploadsDirectory(baseDir))
  const safeSegments = relativePath
    .split('/')
    .filter(Boolean)

  if (safeSegments.length === 0 || safeSegments.some(segment => segment === '.' || segment === '..' || segment.includes('\\'))) {
    return null
  }

  const resolvedPath = resolve(normalizedUploadsDirectory, ...safeSegments)
  const allowedPrefix = normalizedUploadsDirectory.endsWith(sep)
    ? normalizedUploadsDirectory
    : `${normalizedUploadsDirectory}${sep}`

  return resolvedPath === normalizedUploadsDirectory || resolvedPath.startsWith(allowedPrefix)
    ? resolvedPath
    : null
}
