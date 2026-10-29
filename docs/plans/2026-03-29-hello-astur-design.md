# Hello Group — diseño validado

Web escaparate Nuxt + Supabase para cinco casas rurales de la misma empresa.

## Decisiones

- Escaparate + contacto; reservas con widget RoomRaccoon (más adelante).
- Panel admin con CRUD y bandeja de consultas.
- Aviso por email (Resend) + bandeja en admin.
- i18n ES (default) + EN.
- Marca: Hello Group (logo `public/brand/logo.svg`). Hero: vídeo (placeholder hasta asset real).

## Stack

Nuxt 4, Tailwind, @nuxtjs/i18n, @nuxtjs/supabase, Resend vía `/api/contact`.

## Rutas

Público: `/`, `/casas`, `/casas/[slug]`, `/nosotros`, `/contacto`.  
Admin: `/admin`, `/admin/login`, `/admin/casas`, `/admin/casas/[id]`, `/admin/consultas`.

Ver plan de implementación y `docs/ASSETS.md` para sustitución de medios.
