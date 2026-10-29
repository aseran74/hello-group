export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      houses: {
        Row: {
          id: string
          slug: string
          name_es: string
          name_en: string
          location_es: string
          location_en: string
          description_es: string
          description_en: string
          capacity: number
          bedrooms: number
          amenities: Json
          cover_image_url: string | null
          lat: number | null
          lng: number | null
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_es: string
          name_en: string
          location_es: string
          location_en: string
          description_es?: string
          description_en?: string
          capacity?: number
          bedrooms?: number
          amenities?: Json
          cover_image_url?: string | null
          lat?: number | null
          lng?: number | null
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['houses']['Insert']>
      }
      house_images: {
        Row: {
          id: string
          house_id: string
          url: string
          alt_es: string | null
          alt_en: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          house_id: string
          url: string
          alt_es?: string | null
          alt_en?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['house_images']['Insert']>
      }
      inquiries: {
        Row: {
          id: string
          house_id: string | null
          name: string
          email: string
          phone: string | null
          message: string
          locale: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          house_id?: string | null
          name: string
          email: string
          phone?: string | null
          message: string
          locale?: string
          status?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value?: Json
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>
      }
    }
  }
}
