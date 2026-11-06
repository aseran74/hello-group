export type Faq = {
  id: string
  slug: string
  title_es: string
  title_en: string
  message_es: string
  message_en: string
  shortcuts: string[]
  sort_order: number
  published: boolean
  created_at?: string
  updated_at?: string
}

export type LocalizedFaq = {
  id: string
  slug: string
  title: string
  message: string
  shortcuts: string[]
  sort_order: number
}

export type FaqForm = {
  slug: string
  title_es: string
  title_en: string
  message_es: string
  message_en: string
  shortcutsText: string
  sort_order: number
  published: boolean
}
