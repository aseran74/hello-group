/**
 * Proxy de geocodificación (OpenStreetMap Nominatim) para el admin.
 * Evita CORS y envía User-Agent correcto.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()
  if (!q) {
    throw createError({ statusCode: 400, statusMessage: 'Falta el parámetro q' })
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'json')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '6')
  url.searchParams.set('q', q)
  url.searchParams.set('countrycodes', 'es,co')

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'HelloGroupAdmin/1.0 (location picker)',
    },
  })

  if (!res.ok) {
    throw createError({ statusCode: 502, statusMessage: 'Error al geocodificar la dirección' })
  }

  const data = await res.json() as Array<Record<string, unknown>>
  return (data || []).map((row) => {
    const address = (row.address || {}) as Record<string, string>
    const city = address.city || address.town || address.village || address.municipality || address.state || ''
    return {
      display: String(row.display_name || ''),
      lat: Number(row.lat),
      lng: Number(row.lon),
      city,
    }
  }).filter((r) => !Number.isNaN(r.lat) && !Number.isNaN(r.lng))
})
