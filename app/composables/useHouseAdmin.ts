import type { House, HouseImage } from '~/types/house'
import {
  activitiesFromKeys,
  activityKeysFromList,
  amenitiesFromKeys,
  amenityKeysFromList,
} from '~/utils/features'

const PHOTO_BUCKET = 'house-photos'
const HOUSE_SELECT = '*, house_images(*), rooms(*, room_images(*)), apartments(*, apartment_images(*))'

export type HouseForm = {
  slug: string
  name_es: string
  name_en: string
  location_es: string
  location_en: string
  address_es: string
  address_en: string
  property_type_es: string
  property_type_en: string
  description_es: string
  description_en: string
  capacity: number
  bedrooms: number
  bathrooms: number
  size_m2: number | null
  price_label_es: string
  price_label_en: string
  garage: boolean
  amenity_keys: string[]
  activity_keys: string[]
  lat: number | null
  lng: number | null
  sort_order: number
  published: boolean
  booking_url: string
  cover_image_url: string | null
  cover_image_key: string | null
}

export function houseToForm(house: House & { cover_image_key?: string | null }): HouseForm {
  return {
    slug: house.slug,
    name_es: house.name_es,
    name_en: house.name_en,
    location_es: house.location_es,
    location_en: house.location_en,
    address_es: house.address_es,
    address_en: house.address_en,
    property_type_es: house.property_type_es,
    property_type_en: house.property_type_en,
    description_es: house.description_es,
    description_en: house.description_en,
    capacity: house.capacity,
    bedrooms: house.bedrooms,
    bathrooms: house.bathrooms,
    size_m2: house.size_m2,
    price_label_es: house.price_label_es,
    price_label_en: house.price_label_en,
    garage: house.garage,
    amenity_keys: amenityKeysFromList(house.amenities || []),
    activity_keys: activityKeysFromList(house.activities || []),
    lat: house.lat,
    lng: house.lng,
    sort_order: house.sort_order,
    published: house.published,
    booking_url: house.booking_url || '',
    cover_image_url: house.cover_image_url,
    cover_image_key: house.cover_image_key ?? null,
  }
}

export function emptyHouseForm(): HouseForm {
  return {
    slug: '',
    name_es: '',
    name_en: '',
    location_es: '',
    location_en: '',
    address_es: '',
    address_en: '',
    property_type_es: '',
    property_type_en: '',
    description_es: '',
    description_en: '',
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    size_m2: null,
    price_label_es: 'Consultar tarifa',
    price_label_en: 'Ask for rates',
    garage: false,
    amenity_keys: [],
    activity_keys: [],
    lat: null,
    lng: null,
    sort_order: 10,
    published: true,
    booking_url: '',
    cover_image_url: null,
    cover_image_key: null,
  }
}

function formPayload(form: HouseForm) {
  return {
    slug: form.slug.trim(),
    name_es: form.name_es.trim(),
    name_en: form.name_en.trim(),
    location_es: form.location_es.trim(),
    location_en: form.location_en.trim(),
    address_es: form.address_es.trim(),
    address_en: form.address_en.trim(),
    property_type_es: form.property_type_es.trim(),
    property_type_en: form.property_type_en.trim(),
    description_es: form.description_es.trim(),
    description_en: form.description_en.trim(),
    capacity: Number(form.capacity) || 1,
    bedrooms: Number(form.bedrooms) || 0,
    bathrooms: Number(form.bathrooms) || 0,
    size_m2: form.size_m2 == null || form.size_m2 === ('' as unknown) ? null : Number(form.size_m2),
    price_label_es: form.price_label_es.trim(),
    price_label_en: form.price_label_en.trim(),
    garage: Boolean(form.garage),
    amenities: amenitiesFromKeys(form.amenity_keys),
    activities: activitiesFromKeys(form.activity_keys),
    lat: form.lat == null || Number.isNaN(Number(form.lat)) ? null : Number(form.lat),
    lng: form.lng == null || Number.isNaN(Number(form.lng)) ? null : Number(form.lng),
    sort_order: Number(form.sort_order) || 0,
    published: Boolean(form.published),
    booking_url: form.booking_url.trim() || null,
    cover_image_url: form.cover_image_url,
    cover_image_key: form.cover_image_key,
  }
}

function errMessage(err: unknown, fallback: string) {
  if (!err || typeof err !== 'object') return fallback
  const e = err as { data?: { statusMessage?: string; message?: string }; message?: string; statusMessage?: string }
  return e.data?.statusMessage || e.data?.message || e.statusMessage || e.message || fallback
}

export function useHouseAdmin() {
  const saving = ref(false)
  const uploading = ref(false)
  const message = ref<string | null>(null)
  const error = ref<string | null>(null)
  const { adminInsert, adminUpdate, adminDelete } = useAdminMutate()

  async function saveHouse(id: string | null, form: HouseForm) {
    saving.value = true
    message.value = null
    error.value = null
    try {
      const payload = formPayload(form)
      if (!payload.slug || !payload.name_es) {
        error.value = 'Slug y nombre (ES) son obligatorios'
        return null
      }

      if (id) {
        const rows = await adminUpdate<House>('houses', payload, { column: 'id', value: id }, HOUSE_SELECT)
        const data = rows[0]
        if (!data) {
          error.value = 'Error al guardar'
          return null
        }
        message.value = 'Guardado'
        return data
      }

      const rows = await adminInsert<House>('houses', [payload], HOUSE_SELECT)
      const data = rows[0]
      if (!data) {
        error.value = 'Error al crear'
        return null
      }
      message.value = 'Creada'
      return data
    }
    catch (e) {
      error.value = errMessage(e, 'Error inesperado al guardar')
      return null
    }
    finally {
      saving.value = false
    }
  }

  async function uploadCover(houseId: string, form: HouseForm, file: File) {
    uploading.value = true
    error.value = null
    try {
      const { uploadAdminPhoto } = useAdminUpload()
      const uploaded = await uploadAdminPhoto(file, `houses/${houseId}`)

      if (form.cover_image_key) {
        try {
          const client = useInsforge()
          await client.storage.from(PHOTO_BUCKET).remove(form.cover_image_key).catch(() => null)
        }
        catch {
          // ignore
        }
      }

      form.cover_image_url = uploaded.url
      form.cover_image_key = uploaded.key

      await adminUpdate('houses', {
        cover_image_url: uploaded.url,
        cover_image_key: uploaded.key,
      }, { column: 'id', value: houseId })

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

  async function uploadGallery(houseId: string, files: FileList | File[], currentCount = 0) {
    uploading.value = true
    error.value = null
    try {
      const { uploadAdminPhoto } = useAdminUpload()
      const list = Array.from(files)
      const inserted: HouseImage[] = []

      for (let i = 0; i < list.length; i++) {
        const file = list[i]
        try {
          const uploaded = await uploadAdminPhoto(file, `houses/${houseId}`)
          const rows = await adminInsert<HouseImage>('house_images', [{
            house_id: houseId,
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

  async function deleteGalleryImage(image: HouseImage & { storage_key?: string | null }) {
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
      await adminDelete('house_images', { column: 'id', value: image.id })
      message.value = 'Foto eliminada'
      return true
    }
    catch (e) {
      error.value = errMessage(e, 'No se pudo eliminar')
      return false
    }
  }

  async function deleteHouse(id: string) {
    error.value = null
    try {
      await adminDelete('houses', { column: 'id', value: id })
      return true
    }
    catch (e) {
      error.value = errMessage(e, 'No se pudo eliminar la casa')
      return false
    }
  }

  async function togglePublished(house: House) {
    error.value = null
    try {
      const next = !house.published
      const rows = await adminUpdate<House>(
        'houses',
        { published: next },
        { column: 'id', value: house.id },
        '*, house_images(*)',
      )
      const data = rows[0]
      if (!data) {
        error.value = 'No se pudo cambiar el estado'
        return null
      }
      message.value = next ? 'Publicada' : 'Ocultada'
      return data
    }
    catch (e) {
      error.value = errMessage(e, 'No se pudo cambiar el estado')
      return null
    }
  }

  return {
    saving,
    uploading,
    message,
    error,
    saveHouse,
    uploadCover,
    uploadGallery,
    deleteGalleryImage,
    deleteHouse,
    togglePublished,
    houseToForm,
    emptyHouseForm,
  }
}
