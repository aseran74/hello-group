/** Subida de fotos admin vía API Nitro (API key en servidor). */
export function useAdminUpload() {
  async function uploadAdminPhoto(file: File, folder: string) {
    const { ensureSession, ensureAccessToken, user } = useAdminAuth()
    await ensureSession()
    if (!user.value) {
      throw new Error('Sesión caducada. Vuelve a iniciar sesión en /admin/login')
    }

    const token = await ensureAccessToken()

    const body = new FormData()
    body.append('file', file)
    body.append('folder', folder)
    body.append('userId', user.value.id)

    try {
      return await $fetch<{ url: string; key: string }>('/api/admin/upload-photo', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body,
      })
    }
    catch (e: unknown) {
      const err = e as { data?: { statusMessage?: string; message?: string }; message?: string }
      throw new Error(err?.data?.statusMessage || err?.data?.message || err?.message || 'Error al subir la foto')
    }
  }

  return { uploadAdminPhoto }
}
