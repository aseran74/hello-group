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
  booking_url: string
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
    booking_url: '',
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
    booking_url: room.booking_url || '',
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
    booking_url: form.booking_url.trim() || null,
  }
  if (form.cover_image_url) payload.cover_image_url = form.cover_image_url
  if (form.cover_image_key) payload.cover_image_key = form.cover_image_key
  return payload
}

function errMessage(err: unknown, fallback: string) {
  if (!err || typeof err !== 'object') return fallback
  const e = err as { data?: { statusMessage?: string; message?: string }; message?: string; statusMessage?: string }
  return e.data?.statusMessage || e.data?.message || e.statusMessage || e.message || fallback
}

export function useRoomAdmin() {
  const saving = ref(false)
  const uploading = ref(false)
  const message = ref<string | null>(null)
  const error = ref<string | null>(null)
  const { adminInsert, adminUpdate, adminDelete } = useAdminMutate()

  async function saveRoom(houseId: string, roomId: string | null, form: RoomForm) {
    saving.value = true
    message.value = null
    error.value = null
    try {
      const payload = formPayload(form, houseId)

      if (roomId) {
        const rows = await adminUpdate<Room>('rooms', payload, { column: 'id', value: roomId })
        const data = rows[0]
        if (!data) {
          error.value = 'Error al guardar habitación'
          return null
        }
        message.value = 'Habitación guardada'
        return { ...data, room_images: data.room_images || [] }
      }

      const rows = await adminInsert<Room>('rooms', [payload])
      const data = rows[0]
      if (!data) {
        error.value = 'La habitación no se creó (sin respuesta del servidor)'
        return null
      }
      message.value = 'Habitación creada'
      return { ...data, room_images: [] }
    }
    catch (e) {
      error.value = errMessage(e, 'Error inesperado al guardar')
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
      const uploaded = await uploadAdminPhoto(file, `houses/${houseId}/rooms/${roomId}`)
      if (form.cover_image_key) {
        try {
          const client = useInsforge()
          await client.storage.from(PHOTO_BUCKET).remove(form.cover_image_key).catch(() => null)
        }
        catch {
          // ignore storage cleanup
        }
      }
      form.cover_image_url = uploaded.url
      form.cover_image_key = uploaded.key
      await adminUpdate('rooms', {
        cover_image_url: uploaded.url,
        cover_image_key: uploaded.key,
      }, { column: 'id', value: roomId })
      message.value = 'Portada actualizada'
      return true
    }
    catch (e) {
      error.value = errMessage(e, 'Error al subir portada')
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
      const list = Array.from(files)
      const inserted: RoomImage[] = []

      for (let i = 0; i < list.length; i++) {
        const file = list[i]
        try {
          const uploaded = await uploadAdminPhoto(file, `houses/${houseId}/rooms/${roomId}`)
          const rows = await adminInsert<RoomImage>('room_images', [{
            room_id: roomId,
            url: uploaded.url,
            storage_key: uploaded.key,
            sort_order: currentCount + i + 1,
          }])
          if (rows[0]) inserted.push(rows[0])
          else error.value = 'Imagen subida pero no registrada'
        }
        catch (e) {
          error.value = errMessage(e, `Error al subir ${file.name}`)
        }
      }

      if (inserted.length) message.value = `${inserted.length} foto(s) añadidas`
      return inserted
    }
    catch (e) {
      error.value = errMessage(e, 'Error al subir fotos')
      return []
    }
    finally {
      uploading.value = false
    }
  }

  async function deleteRoomImage(image: RoomImage) {
    error.value = null
    try {
      if (image.storage_key) {
        try {
          const client = useInsforge()
          await client.storage.from(PHOTO_BUCKET).remove(image.storage_key).catch(() => null)
        }
        catch {
          // ignore
        }
      }
      await adminDelete('room_images', { column: 'id', value: image.id })
      message.value = 'Foto eliminada'
      return true
    }
    catch (e) {
      error.value = errMessage(e, 'No se pudo eliminar')
      return false
    }
  }

  async function deleteRoom(roomId: string) {
    error.value = null
    try {
      await adminDelete('rooms', { column: 'id', value: roomId })
      return true
    }
    catch (e) {
      error.value = errMessage(e, 'No se pudo eliminar la habitación')
      return false
    }
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
