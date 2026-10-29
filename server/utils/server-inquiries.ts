export type ServerInquiry = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  house_id: string | null
  house_name: string | null
  locale: string
  status: string
  created_at: string
}

/** In-memory store used only when Supabase is not configured (local demo). */
export const serverInquiries: ServerInquiry[] = []
