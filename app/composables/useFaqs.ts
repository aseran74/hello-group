import { SEED_FAQS } from '~/data/seed-faqs'
import type { Faq, FaqForm, LocalizedFaq } from '~/types/faq'

function normalizeShortcuts(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export function normalizeFaq(row: Record<string, unknown>): Faq {
  return {
    id: String(row.id),
    slug: String(row.slug ?? ''),
    title_es: String(row.title_es ?? ''),
    title_en: String(row.title_en ?? ''),
    message_es: String(row.message_es ?? ''),
    message_en: String(row.message_en ?? ''),
    shortcuts: normalizeShortcuts(row.shortcuts),
    sort_order: Number(row.sort_order ?? 0),
    published: row.published !== false,
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  }
}

export function localizeFaq(faq: Faq, locale: string): LocalizedFaq {
  const isEn = locale.startsWith('en')
  return {
    id: faq.id,
    slug: faq.slug,
    title: isEn ? faq.title_en || faq.title_es : faq.title_es,
    message: isEn ? faq.message_en || faq.message_es : faq.message_es,
    shortcuts: faq.shortcuts,
    sort_order: faq.sort_order,
  }
}

export function parseShortcutsText(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function faqToForm(faq: Faq): FaqForm {
  return {
    slug: faq.slug,
    title_es: faq.title_es,
    title_en: faq.title_en,
    message_es: faq.message_es,
    message_en: faq.message_en,
    shortcutsText: faq.shortcuts.join(', '),
    sort_order: faq.sort_order,
    published: faq.published,
  }
}

export function emptyFaqForm(): FaqForm {
  return {
    slug: '',
    title_es: '',
    title_en: '',
    message_es: '',
    message_en: '',
    shortcutsText: '',
    sort_order: 200,
    published: true,
  }
}

function formPayload(form: FaqForm) {
  return {
    slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
    title_es: form.title_es.trim(),
    title_en: form.title_en.trim(),
    message_es: form.message_es.trim(),
    message_en: form.message_en.trim(),
    shortcuts: parseShortcutsText(form.shortcutsText),
    sort_order: Number(form.sort_order) || 0,
    published: Boolean(form.published),
  }
}

export function useFaqs() {
  const { locale } = useI18n()
  const saving = ref(false)
  const message = ref<string | null>(null)
  const error = ref<string | null>(null)

  async function fetchFromInsforge(opts: { publishedOnly?: boolean; id?: string } = {}) {
    if (!hasInsforgeConfig()) return null

    try {
      const client = useInsforge()
      let query = client.database.from('faqs').select('*')
      if (opts.id) query = query.eq('id', opts.id)
      if (opts.publishedOnly) query = query.eq('published', true)

      const { data, error: err } = await query.order('sort_order', { ascending: true })
      if (err || !data) return null
      return (data as Record<string, unknown>[]).map(normalizeFaq)
    }
    catch {
      return null
    }
  }

  async function fetchFaqs(opts: { publishedOnly?: boolean } = {}) {
    const publishedOnly = opts.publishedOnly ?? true
    const remote = await fetchFromInsforge({ publishedOnly })
    const list = remote ?? SEED_FAQS.filter((faq) => (publishedOnly ? faq.published : true))
    return list
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((faq) => localizeFaq(faq, locale.value))
  }

  async function fetchRawFaqs() {
    const remote = await fetchFromInsforge({ publishedOnly: false })
    if (remote) return remote.slice().sort((a, b) => a.sort_order - b.sort_order)
    return SEED_FAQS.slice().sort((a, b) => a.sort_order - b.sort_order)
  }

  async function fetchRawFaq(id: string) {
    const remote = await fetchFromInsforge({ id, publishedOnly: false })
    if (remote?.[0]) return remote[0]
    return SEED_FAQS.find((faq) => faq.id === id) || null
  }

  async function saveFaq(id: string | null, form: FaqForm) {
    saving.value = true
    message.value = null
    error.value = null
    try {
      const client = useInsforge()
      const payload = formPayload(form)
      if (!payload.slug || !payload.title_es || !payload.message_es) {
        error.value = 'Slug, título (ES) y mensaje (ES) son obligatorios'
        return null
      }

      if (id) {
        const { data, error: err } = await client.database
          .from('faqs')
          .update(payload)
          .eq('id', id)
          .select('*')
          .single()
        if (err) {
          error.value = err.message || 'Error al guardar'
          return null
        }
        message.value = 'Guardado'
        return normalizeFaq(data as Record<string, unknown>)
      }

      const { data, error: err } = await client.database
        .from('faqs')
        .insert([payload])
        .select('*')
        .single()
      if (err) {
        error.value = err.message || 'Error al crear'
        return null
      }
      message.value = 'Creada'
      return normalizeFaq(data as Record<string, unknown>)
    }
    finally {
      saving.value = false
    }
  }

  async function togglePublished(faq: Faq) {
    error.value = null
    const client = useInsforge()
    const { data, error: err } = await client.database
      .from('faqs')
      .update({ published: !faq.published })
      .eq('id', faq.id)
      .select('*')
      .single()
    if (err) {
      error.value = err.message || 'No se pudo actualizar'
      return null
    }
    return normalizeFaq(data as Record<string, unknown>)
  }

  async function deleteFaq(id: string) {
    error.value = null
    const client = useInsforge()
    const { error: err } = await client.database.from('faqs').delete().eq('id', id)
    if (err) {
      error.value = err.message || 'No se pudo eliminar'
      return false
    }
    return true
  }

  return {
    saving,
    message,
    error,
    fetchFaqs,
    fetchRawFaqs,
    fetchRawFaq,
    saveFaq,
    togglePublished,
    deleteFaq,
    faqToForm,
    emptyFaqForm,
    hasInsforgeConfig,
  }
}
