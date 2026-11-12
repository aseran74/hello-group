type MutateOp = 'insert' | 'update' | 'delete'

type MutateInput = {
  table: string
  op: MutateOp
  values?: Record<string, unknown> | Record<string, unknown>[]
  match?: { column: string; value: string | number | boolean }
  select?: string
}

export function useAdminMutate() {
  async function adminMutate<T = Record<string, unknown>>(input: MutateInput): Promise<T[]> {
    const { ensureAccessToken, user } = useAdminAuth()
    if (!(await ensureAccessToken()) || !user.value) {
      throw new Error('Sesión caducada. Vuelve a iniciar sesión en /admin/login')
    }

    const token = await ensureAccessToken()
    const res = await $fetch<{ data: T[] }>('/api/admin/mutate', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: input,
    })
    return Array.isArray(res?.data) ? res.data : []
  }

  async function adminInsert<T = Record<string, unknown>>(
    table: string,
    values: Record<string, unknown> | Record<string, unknown>[],
    select = '*',
  ) {
    return adminMutate<T>({ table, op: 'insert', values, select })
  }

  async function adminUpdate<T = Record<string, unknown>>(
    table: string,
    values: Record<string, unknown>,
    match: { column: string; value: string | number | boolean },
    select = '*',
  ) {
    return adminMutate<T>({ table, op: 'update', values, match, select })
  }

  async function adminDelete(
    table: string,
    match: { column: string; value: string | number | boolean },
  ) {
    return adminMutate({ table, op: 'delete', match, select: 'id' })
  }

  return { adminMutate, adminInsert, adminUpdate, adminDelete }
}
