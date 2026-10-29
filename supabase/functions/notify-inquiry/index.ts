/**
 * Optional Supabase Edge Function alternative for email notifications.
 * The Nuxt API route `/api/contact` already sends email via Resend when configured.
 *
 * Deploy: supabase functions deploy notify-inquiry
 * Secrets: RESEND_API_KEY, ADMIN_NOTIFY_EMAIL
 */
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const payload = await req.json()
  const resendKey = Deno.env.get('RESEND_API_KEY')
  const to = Deno.env.get('ADMIN_NOTIFY_EMAIL')

  if (!resendKey || !to) {
    return new Response(JSON.stringify({ ok: false, reason: 'missing secrets' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Hello Group <onboarding@resend.dev>',
      to: [to],
      subject: `Nueva consulta · ${payload.name || 'Sin nombre'}`,
      text: JSON.stringify(payload, null, 2),
    }),
  })

  const body = await res.text()
  return new Response(body, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  })
})
