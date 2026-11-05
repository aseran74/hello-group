type AdminUser = {
  id: string
  email?: string
  emailVerified?: boolean
  profile?: { name?: string | null; avatar_url?: string | null }
}

type SessionPayload = {
  user: AdminUser | null
  accessToken: string | null
}

export function useAdminAuth() {
  const user = useState<AdminUser | null>('admin-auth-user', () => null)
  const accessToken = useState<string | null>('admin-auth-token', () => null)
  const ready = useState<boolean>('admin-auth-ready', () => false)
  const bootstrapped = useState<boolean>('admin-auth-bootstrapped', () => false)

  const loading = ref(false)
  const error = ref<string | null>(null)

  function applySession(payload: SessionPayload) {
    user.value = payload.user
    accessToken.value = payload.accessToken
    ready.value = true
    if (import.meta.client && hasInsforgeConfig()) {
      try {
        const client = useInsforge()
        client.setAccessToken(payload.accessToken)
      }
      catch {
        // config missing
      }
    }
  }

  async function fetchSession(): Promise<SessionPayload> {
    const requestFetch = import.meta.server ? useRequestFetch() : $fetch
    try {
      return await requestFetch<SessionPayload>('/api/admin/auth/session')
    }
    catch {
      return { user: null, accessToken: null }
    }
  }

  async function refresh() {
    if (!hasInsforgeConfig()) {
      applySession({ user: null, accessToken: null })
      return null
    }
    const session = await fetchSession()
    applySession(session)
    return user.value
  }

  async function ensureSession() {
    if (!bootstrapped.value) {
      bootstrapped.value = true
      await refresh()
    }
    else if (!ready.value) {
      await refresh()
    }
    return user.value
  }

  async function ensureAccessToken() {
    await ensureSession()
    if (accessToken.value) return accessToken.value
    if (!user.value) return null

    const session = await fetchSession()
    applySession(session)
    return accessToken.value
  }

  async function signIn(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<SessionPayload>('/api/admin/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      applySession({
        user: data.user,
        accessToken: data.accessToken,
      })
      bootstrapped.value = true
      return !!user.value
    }
    catch (e: unknown) {
      const err = e as { data?: { statusMessage?: string; message?: string }; message?: string }
      error.value = err?.data?.statusMessage || err?.data?.message || err?.message || 'No se pudo iniciar sesión'
      applySession({ user: null, accessToken: null })
      return false
    }
    finally {
      loading.value = false
    }
  }

  async function signUp(email: string, password: string, name?: string) {
    loading.value = true
    error.value = null
    try {
      if (!hasInsforgeConfig()) {
        error.value = 'InsForge no está configurado'
        return false
      }
      const client = useInsforge()
      const { data, error: err } = await client.auth.signUp({
        email,
        password,
        name: name || 'Admin Hello Group',
      })
      if (err) {
        error.value = err.message || 'No se pudo crear la cuenta'
        return false
      }
      if (data?.requireEmailVerification) {
        error.value = 'Revisa tu email para verificar la cuenta antes de entrar.'
        return false
      }
      // Tras registro exitoso, establece cookies vía login server-side
      return await signIn(email, password)
    }
    catch (e: unknown) {
      const err = e as { data?: { statusMessage?: string; message?: string }; message?: string }
      error.value = err?.data?.statusMessage || err?.data?.message || err?.message || 'No se pudo crear la cuenta'
      return false
    }
    finally {
      loading.value = false
    }
  }

  async function signOut() {
    try {
      await $fetch('/api/admin/auth/logout', { method: 'POST' })
    }
    catch {
      // ignore
    }
    applySession({ user: null, accessToken: null })
    await navigateTo('/admin/login')
  }

  return {
    user,
    accessToken,
    ready,
    loading,
    error,
    refresh,
    ensureSession,
    ensureAccessToken,
    signIn,
    signUp,
    signOut,
  }
}
