import { copyFile, mkdir, readdir } from 'node:fs/promises'
import { isAbsolute, resolve, sep } from 'node:path'
import process from 'node:process'

const seedDataFiles = ['brands.json', 'products.json', 'site-settings.json'] as const

function resolveAppPath(baseDir: string, targetPath: string) {
  return isAbsolute(targetPath) ? targetPath : resolve(baseDir, targetPath)
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
