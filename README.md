# Hello Group

Web escaparate de casas rurales (Nuxt + Supabase). Cinco casas, i18n ES/EN, panel admin y formulario de consultas.

## Desarrollo

```bash
npm install
cp .env.example .env   # rellena claves reales de Supabase
npm run dev
```

Sin Supabase real, la web usa datos seed (`app/data/seed-houses.ts`) y el formulario guarda consultas en memoria del servidor.

## Supabase

1. Crea un proyecto en Supabase.
2. Aplica `supabase/migrations/20260329120000_init.sql` (SQL Editor o CLI).
3. Crea un usuario admin en Authentication.
4. Rellena `.env` con URL, anon key y service role key.
5. (Opcional) Resend: `RESEND_API_KEY` + `ADMIN_NOTIFY_EMAIL`.

## Assets

- Logo: `public/brand/logo.svg` (origen: `public/gemini-svg.svg`)
- Vídeo, fotos y RoomRaccoon: ver [docs/ASSETS.md](docs/ASSETS.md)

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build producción
- `npm run preview` — preview del build
