import { createClient } from '@insforge/sdk'
import {
  clearAuthCookies,
  setAuthCookies,
} from '../../../utils/admin-auth-cookies'

type LoginBody = {
  email?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = String(config.public.insforgeUrl || '')
  const anonKey = String(config.public.insforgeAnonKey || '')

  if (!baseUrl || !anonKey) {
    throw createError({ statusCode: 500, statusMessage: 'InsForge no está configurado' })
  }

  const body = await readBody<LoginBody>(event)
  const email = body?.email?.trim()
  const password = body?.password

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email y contraseña son obligatorios' })
  }

  const client = createClient({ baseUrl, anonKey, isServerMode: true })
  const { data, error } = await client.auth.signInWithPassword({ email, password })

  if (error || !data?.accessToken || !data?.user) {
    clearAuthCookies(event)
    throw createError({
      statusCode: error?.statusCode || 401,
      statusMessage: error?.message || 'No se pudo iniciar sesión',
    })
  }

  setAuthCookies(event, {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? null,
  })

  return {
    user: data.user,
    accessToken: data.accessToken,
  }
})
