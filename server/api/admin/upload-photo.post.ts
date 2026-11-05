import { createAdminClient, createClient } from '@insforge/sdk'
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = String(config.public.insforgeUrl || '')
  const anonKey = String(config.public.insforgeAnonKey || '')
  const apiKey = String(config.insforgeApiKey || '')

  if (!baseUrl || !apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'InsForge API key no configurada en el servidor. Reinicia npm run dev tras añadir INSFORGE_API_KEY.' })
  }

  // Si hay Bearer, validamos sesión; si no, exigimos userId (el cliente ya pasó por admin-auth)
  const authHeader = getHeader(event, 'authorization') || ''
  const accessToken = authHeader.replace(/^Bearer\s+/i, '').trim()

  if (accessToken && anonKey) {
    const userClient = createClient({ baseUrl, anonKey, accessToken })
    const { data: userData, error: userErr } = await userClient.auth.getCurrentUser()
    if (userErr || !userData?.user) {
      throw createError({ statusCode: 401, statusMessage: 'Sesión no válida. Vuelve a iniciar sesión.' })
    }
  }

  const form = await readMultipartFormData(event)
  if (!form?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No se recibió ningún archivo' })
  }

  const filePart = form.find((p) => p.name === 'file' && p.data)
  const folderPart = form.find((p) => p.name === 'folder')
  const userIdPart = form.find((p) => p.name === 'userId')

  if (!accessToken && !userIdPart?.data?.toString('utf8')) {
    throw createError({ statusCode: 401, statusMessage: 'Debes iniciar sesión' })
  }

  if (!filePart?.data) {
    throw createError({ statusCode: 400, statusMessage: 'Falta el archivo' })
  }

  const folder = String(folderPart?.data?.toString('utf8') || 'houses/misc').replace(/^\/+|\/+$/g, '')
  const original = filePart.filename || 'photo.jpg'
  const ext = original.includes('.') ? original.split('.').pop()!.toLowerCase().replace(/[^a-z0-9]/g, '') : 'jpg'
  const key = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}.${ext || 'jpg'}`
  const mime = filePart.type || 'application/octet-stream'
  const blob = new Blob([filePart.data], { type: mime })

  const admin = createAdminClient({ baseUrl, apiKey })
  const { data, error } = await admin.storage.from('house-photos').upload(key, blob)

  if (error || !data) {
    throw createError({
      statusCode: 502,
      statusMessage: error?.message || 'Error al subir a InsForge Storage',
    })
  }

  return {
    url: data.url,
    key: data.key,
    bucket: data.bucket,
    size: data.size,
    mimeType: data.mimeType,
  }
})
