import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { join, resolve, basename, sep } from 'node:path'
import sharp from 'sharp'
import { readMultipartFormData, createError, type H3Event } from 'h3'

const UPLOADS_ROOT = resolve(process.cwd(), 'public', 'uploads')
const PENDING_DIR = join(UPLOADS_ROOT, 'pending')
const PROFIEL_DIR = join(UPLOADS_ROOT, 'profiel')

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_BYTES = 5 * 1024 * 1024

async function ensureDirs(): Promise<void> {
  await fs.mkdir(PENDING_DIR, { recursive: true })
  await fs.mkdir(PROFIEL_DIR, { recursive: true })
}

interface Fields {
  [key: string]: string
}

export interface MultipartResult {
  fields: Fields
  pendingPhotoPath: string
  pendingPhotoUrl: string
  cleanup: () => Promise<void>
}

export async function readMultipartWithPhoto(event: H3Event): Promise<MultipartResult> {
  await ensureDirs()

  const parts = await readMultipartFormData(event)
  if (!parts) throw createError({ statusCode: 400, statusMessage: 'Geen form-data ontvangen' })

  const fields: Fields = {}
  let photoBuf: Buffer | null = null
  let photoMime = ''

  for (const part of parts) {
    if (!part.name) continue
    if (part.name === 'profile_picture') {
      if (!part.data || part.data.length === 0) continue
      photoBuf = part.data
      photoMime = part.type || ''
    } else if (part.data && typeof part.filename === 'undefined') {
      fields[part.name] = part.data.toString('utf8')
    }
  }

  if (!photoBuf) {
    throw createError({ statusCode: 400, statusMessage: 'Profielfoto is verplicht' })
  }
  if (photoBuf.length > MAX_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Foto is te groot (max 5 MB)' })
  }
  if (!ALLOWED_MIME.has(photoMime)) {
    throw createError({ statusCode: 400, statusMessage: 'Alleen JPG, PNG of WEBP toegestaan' })
  }

  let processed: Buffer
  try {
    processed = await sharp(photoBuf)
      .rotate() // honor EXIF first so the subsequent re-encode strips metadata
      .resize(512, 512, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer()
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Kon afbeelding niet verwerken' })
  }

  const filename = `${randomUUID()}.jpg`
  const absPath = join(PENDING_DIR, filename)
  await fs.writeFile(absPath, processed)

  return {
    fields,
    pendingPhotoPath: absPath,
    pendingPhotoUrl: `/uploads/pending/${filename}`,
    cleanup: async () => {
      try { await fs.unlink(absPath) } catch {}
    }
  }
}

export async function promotePendingPhoto(pendingUrl: string): Promise<string> {
  await ensureDirs()
  const safeBase = basename(pendingUrl)
  if (!/^[a-f0-9-]+\.jpg$/i.test(safeBase)) {
    throw createError({ statusCode: 400, statusMessage: 'Ongeldige fotoreferentie' })
  }
  const from = join(PENDING_DIR, safeBase)
  const to = join(PROFIEL_DIR, safeBase)
  // Path-traversal guard: resolved target must remain inside PROFIEL_DIR.
  if (!to.startsWith(PROFIEL_DIR + sep)) {
    throw createError({ statusCode: 400, statusMessage: 'Ongeldige fotoreferentie' })
  }
  try {
    await fs.rename(from, to)
  } catch (e: any) {
    if (e?.code === 'ENOENT') {
      throw createError({ statusCode: 400, statusMessage: 'Pending foto niet gevonden' })
    }
    throw e
  }
  return `/uploads/profiel/${safeBase}`
}

export async function cleanupOldPendingPhotos(): Promise<void> {
  try {
    await ensureDirs()
    const entries = await fs.readdir(PENDING_DIR)
    const now = Date.now()
    const cutoff = 60 * 60 * 1000
    await Promise.all(
      entries.map(async (name) => {
        const p = join(PENDING_DIR, name)
        try {
          const stat = await fs.stat(p)
          if (now - stat.mtimeMs > cutoff) await fs.unlink(p)
        } catch {}
      })
    )
  } catch {}
}
