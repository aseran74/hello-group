# Assets y huecos pendientes — Hello Group

## Logo

El logo oficial está en `public/brand/logo.png` (origen: `Logo-removebg-preview (1).png`).
Se usa en header (navbar píldora), footer y hero vía el componente `BrandLogo`.

## Vídeo del hero

1. Vídeo actual: `public/hero/Hero-video.mp4` (referenciado en `HeroVideo.vue`).
2. Opcional: sustituye el póster `public/placeholders/hero-poster.svg` por un JPG/WebP y actualiza `heroPoster` en `app/components/HeroVideo.vue`.
3. Si el vídeo falla al cargar, la web muestra automáticamente el póster.

## Fotos de los 5 alojamientos

Fotos locales en `public/Fotos/`:

- `Astur/`
- `Canillas/` (Cibeles, Neptuno)
- `Mediterraneo/` (Madrid-1, Madrid-2, Madrid-5)
- `Madrid-Norte/`
- `Sincelejo/`

El seed (`app/data/seed-houses.ts`) apunta a estas carpetas para portada y galería.

## Widget RoomRaccoon

1. Abre `app/components/RoomRaccoonSlot.vue`.
2. Pega el snippet/código del widget dentro de `div[data-roomraccoon-root]`.
3. Si RoomRaccoon pide un script global, añádelo en `nuxt.config.ts` → `app.head.script` o en un plugin client-only.

El contenedor `#roomraccoon-widget` ya está en cada ficha de casa.

## i18n

- Textos de UI: `i18n/locales/es.json` y `en.json`.
- Contenido de casas: columnas `_es` / `_en` en Supabase (editables en admin).
