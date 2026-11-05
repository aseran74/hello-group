type AdminUser = {
  id: string
  email?: string
  emailVerified?: boolean
  profile?: { name?: string | null; avatar_url?: string | null }
}

const user = ref<AdminUser | null>(null)
const accessToken = ref<string | null>(null)
const ready = ref(false)
let bootstrapped = false

export function useAdminAuth() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function refresh() {
    if (!hasInsforgeConfig()) {
      user.value = null
      accessToken.value = null
      ready.value = true
      return null
    }
    const client = useInsforge()
    const { data, error: err } = await client.auth.getCurrentUser()
    if (err || !data?.user) {
      user.value = null
      accessToken.value = null
    }
    else {
      user.value = data.user as AdminUser
      if (!accessToken.value) {
        const refreshed = await client.auth.refreshSession()
        if (refreshed.data && 'accessToken' in refreshed.data) {
          accessToken.value = (refreshed.data as { accessToken?: string }).accessToken || null
        }
      }
    }
    ready.value = true
    return user.value
  }

  async function ensureSession() {
    if (!bootstrapped) {
      bootstrapped = true
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

    const client = useInsforge()
    const refreshed = await client.auth.refreshSession()
    const token = refreshed.data && 'accessToken' in refreshed.data
      ? (refreshed.data as { accessToken?: string }).accessToken || null
      : null
    accessToken.value = token
    return token
  }

  async function signIn(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const client = useInsforge()
      const { data, error: err } = await client.auth.signInWithPassword({ email, password })
      if (err) {
        error.value = err.message || 'No se pudo iniciar sesión'
        user.value = null
        accessToken.value = null
        return false
      }
      user.value = (data?.user as AdminUser | null) ?? null
      accessToken.value = data?.accessToken ?? null
      ready.value = true
      return !!user.value
    }
    finally {
      loading.value = false
    }
  }

  async function signUp(email: string, password: string, name?: string) {
    loading.value = true
    error.value = null
    try {
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
      user.value = (data?.user as AdminUser | null) ?? null
      accessToken.value = data?.accessToken ?? null
      ready.value = true
      return !!user.value
    }
    finally {
      loading.value = false
    }
  }

  async function signOut() {
    if (hasInsforgeConfig()) {
      const client = useInsforge()
      await client.auth.signOut()
    }
    user.value = null
    accessToken.value = null
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
