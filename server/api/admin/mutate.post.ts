import { getInsforgeAdmin, requireAdminUser } from '../../utils/insforge-admin'

const ALLOWED_TABLES = new Set([
  'houses',
  'house_images',
  'rooms',
  'room_images',
  'apartments',
  'apartment_images',
])

type MutateBody = {
  table: string
  op: 'insert' | 'update' | 'delete'
  values?: Record<string, unknown> | Record<string, unknown>[]
  match?: { column: string; value: string | number | boolean }
  select?: string
}

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const body = await readBody<MutateBody>(event)
  const table = String(body?.table || '')
  const op = body?.op

  if (!ALLOWED_TABLES.has(table)) {
    throw createError({ statusCode: 400, statusMessage: `Tabla no permitida: ${table}` })
  }
  if (op !== 'insert' && op !== 'update' && op !== 'delete') {
    throw createError({ statusCode: 400, statusMessage: 'Operación no válida' })
  }

  const admin = getInsforgeAdmin()
  const select = body.select || '*'

  if (op === 'insert') {
    if (!body.values) {
      throw createError({ statusCode: 400, statusMessage: 'Falta values para insert' })
    }
    const rows = Array.isArray(body.values) ? body.values : [body.values]
    const { data, error } = await admin.database.from(table).insert(rows).select(select)
    if (error) {
      throw createError({ statusCode: 502, statusMessage: error.message || 'Error al insertar' })
    }
    return { data }
  }

  if (!body.match?.column || body.match.value === undefined || body.match.value === null) {
    throw createError({ statusCode: 400, statusMessage: 'Falta match.column/value' })
  }

  if (op === 'update') {
    if (!body.values || Array.isArray(body.values)) {
      throw createError({ statusCode: 400, statusMessage: 'values debe ser un objeto para update' })
    }
    const { data, error } = await admin.database
      .from(table)
      .update(body.values)
      .eq(body.match.column, body.match.value)
      .select(select)
    if (error) {
      throw createError({ statusCode: 502, statusMessage: error.message || 'Error al actualizar' })
    }
    return { data }
  }

  const { data, error } = await admin.database
    .from(table)
    .delete()
    .eq(body.match.column, body.match.value)
    .select(select)
  if (error) {
    throw createError({ statusCode: 502, statusMessage: error.message || 'Error al eliminar' })
  }
  return { data }
})
