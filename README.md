# Hello Group

Web escaparate de casas rurales con encanto (Nuxt). Cinco alojamientos, i18n ES/EN, formulario de consultas y panel admin en modo demo.

## Desarrollo

```bash
npm install
npm run dev
```

**Supabase no es necesario por ahora.** El contenido de casas sale de `app/data/seed-houses.ts` y las consultas se guardan en memoria del servidor.

## Cuando actives Supabase

1. Descomenta / añade claves en `.env` (ver `.env.example`).
2. Aplica `supabase/migrations/20260329120000_init.sql`.
3. Volveremos a conectar Auth, CRUD y Storage.

## Assets

- Logo: `public/brand/logo.png`
- Vídeo, fotos y RoomRaccoon: ver [docs/ASSETS.md](docs/ASSETS.md)

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build producción
- `npm run preview` — preview del build

## Vercel

Preset Nitro: `vercel`. Repo: `aseran74/hello-group`.

Variables opcionales en Vercel:

- `RESEND_API_KEY`
- `ADMIN_NOTIFY_EMAIL`
- `NUXT_PUBLIC_GOOGLE_MAPS_API_KEY` (mapa en fichas)
- (más adelante) `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
