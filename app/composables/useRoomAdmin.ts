import { ROOM_TYPES, type BathroomType, type RoomType } from '~/data/feature-catalog'
import type { Room, RoomImage } from '~/types/house'

const PHOTO_BUCKET = 'house-photos'

export type RoomForm = {
  name_es: string
  name_en: string
  room_type: RoomType
  bathroom_type: BathroomType
  description_es: string
  description_en: string
  capacity: number
  sort_order: number
  published: boolean
  cover_image_url: string | null
  cover_image_key: string | null
}

export function emptyRoomForm(sortOrder = 1): RoomForm {
  return {
    name_es: '',
    name_en: '',
    room_type: 'double',
    bathroom_type: 'private',
    description_es: '',
    description_en: '',
    capacity: 2,
    sort_order: sortOrder,
    published: true,
    cover_image_url: null,
    cover_image_key: null,
  }
}

export function roomToForm(room: Room): RoomForm {
  return {
    name_es: room.name_es,
    name_en: room.name_en,
    room_type: room.room_type,
    bathroom_type: room.bathroom_type,
    description_es: room.description_es,
    description_en: room.description_en,
    capacity: room.capacity,
    sort_order: room.sort_order,
    published: room.published,
    cover_image_url: room.cover_image_url,
    cover_image_key: room.cover_image_key ?? null,
  }
}

function formPayload(form: RoomForm, houseId: string) {
  const typeMeta = ROOM_TYPES.find((r) => r.key === form.room_type)
  const payload: Record<string, unknown> = {
    house_id: houseId,
    name_es: form.name_es.trim() || `Habitación ${form.sort_order}`,
    name_en: form.name_en.trim() || `Room ${form.sort_order}`,
    room_type: form.room_type,
    bathroom_type: form.bathroom_type,
    description_es: form.description_es.trim(),
    description_en: form.description_en.trim(),
    capacity: Number(form.capacity) || typeMeta?.capacity || 2,
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

export function useRoomAdmin() {
  const saving = ref(false)
  const uploading = ref(false)
  const message = ref<string | null>(null)
  const error = ref<string | null>(null)

  async function saveRoom(houseId: string, roomId: string | null, form: RoomForm) {
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

      if (roomId) {
        const { data, error: err } = await client.database
          .from('rooms')
          .update(payload)
          .eq('id', roomId)
          .select('*')
          .single()
        if (err) {
          error.value = errMessage(err, 'Error al guardar habitación')
          return null
        }
        message.value = 'Habitación guardada'
        return { ...(data as Room), room_images: (data as Room).room_images || [] }
      }

      const { data, error: err } = await client.database
        .from('rooms')
        .insert([payload])
        .select('*')
        .single()
      if (err) {
        error.value = errMessage(err, 'Error al crear habitación')
        return null
      }
      if (!data) {
        error.value = 'La habitación no se creó (sin respuesta del servidor)'
        return null
      }
      message.value = 'Habitación creada'
      return { ...(data as Room), room_images: [] }
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Error inesperado al guardar'
      return null
    }
    finally {
      saving.value = false
    }
  }

  async function uploadRoomCover(roomId: string, houseId: string, form: RoomForm, file: File) {
    uploading.value = true
    error.value = null
    try {
      const { uploadAdminPhoto } = useAdminUpload()
      const client = useInsforge()
      const uploaded = await uploadAdminPhoto(file, `houses/${houseId}/rooms/${roomId}`)
      if (form.cover_image_key) {
        await client.storage.from(PHOTO_BUCKET).remove(form.cover_image_key).catch(() => null)
      }
      form.cover_image_url = uploaded.url
      form.cover_image_key = uploaded.key
      const { error: dbErr } = await client.database
        .from('rooms')
        .update({ cover_image_url: uploaded.url, cover_image_key: uploaded.key })
        .eq('id', roomId)
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

  async function uploadRoomGallery(roomId: string, houseId: string, files: FileList | File[], currentCount = 0) {
    uploading.value = true
    error.value = null
    try {
      const { uploadAdminPhoto } = useAdminUpload()
      const client = useInsforge()
      const list = Array.from(files)
      const inserted: RoomImage[] = []

      for (let i = 0; i < list.length; i++) {
        const file = list[i]
        try {
          const uploaded = await uploadAdminPhoto(file, `houses/${houseId}/rooms/${roomId}`)
          const { data: row, error: dbErr } = await client.database
            .from('room_images')
            .insert([{
              room_id: roomId,
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
          inserted.push(row as RoomImage)
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

  async function deleteRoomImage(image: RoomImage) {
    error.value = null
    const client = useInsforge()
    if (image.storage_key) {
      await client.storage.from(PHOTO_BUCKET).remove(image.storage_key).catch(() => null)
    }
    const { error: err } = await client.database.from('room_images').delete().eq('id', image.id)
    if (err) {
      error.value = err.message || 'No se pudo eliminar'
      return false
    }
    message.value = 'Foto eliminada'
    return true
  }

  async function deleteRoom(roomId: string) {
    error.value = null
    const client = useInsforge()
    const { error: err } = await client.database.from('rooms').delete().eq('id', roomId)
    if (err) {
      error.value = err.message || 'No se pudo eliminar la habitación'
      return false
    }
    return true
  }

  return {
    saving,
    uploading,
    message,
    error,
    saveRoom,
    uploadRoomCover,
    uploadRoomGallery,
    deleteRoomImage,
    deleteRoom,
    emptyRoomForm,
    roomToForm,
  }
}
