import type { Apartment, ApartmentImage } from '~/types/house'

const PHOTO_BUCKET = 'house-photos'

export type ApartmentForm = {
  name_es: string
  name_en: string
  description_es: string
  description_en: string
  capacity: number
  bedrooms: number
  bathrooms: number
  sort_order: number
  published: boolean
  cover_image_url: string | null
  cover_image_key: string | null
}

export function emptyApartmentForm(sortOrder = 1): ApartmentForm {
  return {
    name_es: '',
    name_en: '',
    description_es: '',
    description_en: '',
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    sort_order: sortOrder,
    published: true,
    cover_image_url: null,
    cover_image_key: null,
  }
}

export function apartmentToForm(apartment: Apartment): ApartmentForm {
  return {
    name_es: apartment.name_es,
    name_en: apartment.name_en,
    description_es: apartment.description_es,
    description_en: apartment.description_en,
    capacity: apartment.capacity,
    bedrooms: apartment.bedrooms,
    bathrooms: apartment.bathrooms,
    sort_order: apartment.sort_order,
    published: apartment.published,
    cover_image_url: apartment.cover_image_url,
    cover_image_key: apartment.cover_image_key ?? null,
  }
}

function formPayload(form: ApartmentForm, houseId: string) {
  const payload: Record<string, unknown> = {
    house_id: houseId,
    name_es: form.name_es.trim() || `Apartamento ${form.sort_order}`,
    name_en: form.name_en.trim() || `Apartment ${form.sort_order}`,
    description_es: form.description_es.trim(),
    description_en: form.description_en.trim(),
    capacity: Number(form.capacity) || 1,
    bedrooms: Number(form.bedrooms) || 1,
    bathrooms: Number(form.bathrooms) || 1,
    sort_order: Number(form.sort_order) || 0,
    published: Boolean(form.published),
  }
  if (form.cover_image_url) payload.cover_image_url = form.cover_image_url
  if (form.cover_image_key) payload.cover_image_key = form.cover_image_key
  return payload
}

function errMessage(err: unknown, fallback: string) {
  if (!err || typeof err !== 'object') return fallback
  const e = err as { message?: string; error?: string; nextActions?: string }
  return [e.message || e.error || fallback, e.nextActions].filter(Boolean).join(' — ')
}

export function useApartmentAdmin() {
  const saving = ref(false)
  const uploading = ref(false)
  const message = ref<string | null>(null)
  const error = ref<string | null>(null)

  async function saveApartment(houseId: string, apartmentId: string | null, form: ApartmentForm) {
    saving.value = true
    message.value = null
    error.value = null
    try {
      const { ensureSession, user } = useAdminAuth()
      await ensureSession()
      if (!user.value) {
        error.value = 'Sesión caducada. Vuelve a iniciar sesión en /admin/login'
        return null
      }

      const client = useInsforge()
      const payload = formPayload(form, houseId)

      if (apartmentId) {
        const { data, error: err } = await client.database
          .from('apartments')
          .update(payload)
          .eq('id', apartmentId)
          .select('*')
          .single()
        if (err) {
          error.value = errMessage(err, 'Error al guardar apartamento')
          return null
        }
        message.value = 'Apartamento guardado'
        return { ...(data as Apartment), apartment_images: (data as Apartment).apartment_images || [] }
      }

      const { data, error: err } = await client.database
        .from('apartments')
        .insert([payload])
        .select('*')
        .single()
      if (err) {
        error.value = errMessage(err, 'Error al crear apartamento')
        return null
      }
      if (!data) {
        error.value = 'El apartamento no se creó (sin respuesta del servidor)'
        return null
      }
      message.value = 'Apartamento creado'
      return { ...(data as Apartment), apartment_images: [] }
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Error inesperado al guardar'
      return null
    }
    finally {
      saving.value = false
    }
  }

  async function uploadApartmentCover(apartmentId: string, houseId: string, form: ApartmentForm, file: File) {
    uploading.value = true
    error.value = null
    try {
      const { uploadAdminPhoto } = useAdminUpload()
      const client = useInsforge()
      const uploaded = await uploadAdminPhoto(file, `houses/${houseId}/apartments/${apartmentId}`)
      if (form.cover_image_key) {
        await client.storage.from(PHOTO_BUCKET).remove(form.cover_image_key).catch(() => null)
      }
      form.cover_image_url = uploaded.url
      form.cover_image_key = uploaded.key
      const { error: dbErr } = await client.database
        .from('apartments')
        .update({ cover_image_url: uploaded.url, cover_image_key: uploaded.key })
        .eq('id', apartmentId)
      if (dbErr) {
        error.value = errMessage(dbErr, 'Portada subida pero no guardada')
        return false
      }
      message.value = 'Portada actualizada'
      return true
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al subir portada'
      return false
    }
    finally {
      uploading.value = false
    }
  }

  async function uploadApartmentGallery(
    apartmentId: string,
    houseId: string,
    files: FileList | File[],
    currentCount = 0,
  ) {
    uploading.value = true
    error.value = null
    try {
      const { uploadAdminPhoto } = useAdminUpload()
      const client = useInsforge()
      const list = Array.from(files)
      const inserted: ApartmentImage[] = []

      for (let i = 0; i < list.length; i++) {
        const file = list[i]
        try {
          const uploaded = await uploadAdminPhoto(file, `houses/${houseId}/apartments/${apartmentId}`)
          const { data: row, error: dbErr } = await client.database
            .from('apartment_images')
            .insert([{
              apartment_id: apartmentId,
              url: uploaded.url,
              storage_key: uploaded.key,
              sort_order: currentCount + i + 1,
            }])
            .select('*')
            .single()
          if (dbErr || !row) {
            error.value = errMessage(dbErr, 'Imagen subida pero no registrada')
            continue
          }
          inserted.push(row as ApartmentImage)
        }
        catch (e) {
          error.value = e instanceof Error ? e.message : `Error al subir ${file.name}`
        }
      }

      if (inserted.length) message.value = `${inserted.length} foto(s) añadidas`
      return inserted
    }
    finally {
      uploading.value = false
    }
  }

  async function deleteApartmentImage(image: ApartmentImage) {
    error.value = null
    const client = useInsforge()
    if (image.storage_key) {
      await client.storage.from(PHOTO_BUCKET).remove(image.storage_key).catch(() => null)
    }
    const { error: err } = await client.database.from('apartment_images').delete().eq('id', image.id)
    if (err) {
      error.value = err.message || 'No se pudo eliminar'
      return false
    }
    message.value = 'Foto eliminada'
    return true
  }

  async function deleteApartment(apartmentId: string) {
    error.value = null
    const client = useInsforge()
    const { error: err } = await client.database.from('apartments').delete().eq('id', apartmentId)
    if (err) {
      error.value = err.message || 'No se pudo eliminar el apartamento'
      return false
    }
    return true
  }

  return {
    saving,
    uploading,
    message,
    error,
    saveApartment,
    uploadApartmentCover,
    uploadApartmentGallery,
    deleteApartmentImage,
    deleteApartment,
    emptyApartmentForm,
    apartmentToForm,
  }
}
