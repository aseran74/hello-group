import { createClient } from '@supabase/supabase-js'
import { SEED_HOUSES } from '../../app/data/seed-houses'
import { serverInquiries } from '../utils/server-inquiries'

type Body = {
  name?: string
  email?: string
  phone?: string | null
  houseId?: string | null
  message?: string
  locale?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  const name = body.name?.trim()
  const email = body.email?.trim()
  const message = body.message?.trim()
  const phone = body.phone?.trim() || null
  const houseId = body.houseId || null
  const locale = body.locale === 'en' ? 'en' : 'es'

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
  }

  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceKey = config.supabaseServiceKey || config.public.supabaseKey

  let inquiryId = `local-${Date.now()}`
  let houseName: string | null = null

  const configured =
    Boolean(supabaseUrl && serviceKey)
    && !supabaseUrl.includes('placeholder')
    && !String(serviceKey).includes('placeholder')

  if (configured) {
    const admin = createClient(supabaseUrl, serviceKey)
    const { data, error } = await admin
      .from('inquiries')
      .insert({
        name,
        email,
        phone,
        message,
        house_id: houseId,
        locale,
        status: 'new',
      })
      .select('id, house_id')
      .single()

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }
    inquiryId = data.id

    if (data.house_id) {
      const { data: house } = await admin
        .from('houses')
        .select('name_es')
        .eq('id', data.house_id)
        .maybeSingle()
      houseName = house?.name_es || null
    }
  }
  else {
    // Dev fallback without Supabase
    const seedHouse = SEED_HOUSES.find((h) => h.id === houseId)
    houseName = seedHouse?.name_es || null
    serverInquiries.push({
      id: inquiryId,
      name,
      email,
      phone,
      message,
      house_id: houseId,
      house_name: houseName,
      locale,
      status: 'new',
      created_at: new Date().toISOString(),
    })
  }

  const notifyTo = config.adminNotifyEmail
  const resendKey = config.resendApiKey

  if (notifyTo && resendKey) {
    try {
      await $fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: {
          from: 'Hello Group <onboarding@resend.dev>',
          to: [notifyTo],
          subject: `Nueva consulta · ${name}`,
          text: [
            `Nombre: ${name}`,
            `Email: ${email}`,
            `Teléfono: ${phone || '—'}`,
            `Casa: ${houseName || 'Sin preferencia'}`,
            `Idioma: ${locale}`,
            '',
            message,
            '',
            `ID: ${inquiryId}`,
          ].join('\n'),
        },
      })
    }
    catch (err) {
      console.error('[contact] email failed', err)
    }
  }
  else {
    console.info('[contact] inquiry received (email skipped — missing RESEND_API_KEY or ADMIN_NOTIFY_EMAIL)', {
      inquiryId,
      name,
      email,
      houseName,
    })
  }

  return { ok: true, id: inquiryId }
})
