# Assets y huecos pendientes — Hello Group

## Logo

El logo oficial está en `public/brand/logo.png` (origen: `Logo-removebg-preview (1).png`).
Se usa en header (navbar píldora), footer y hero vía el componente `BrandLogo`.

## Vídeo del hero

1. Vídeo actual: `public/hero/Hero-video.mp4` (referenciado en `HeroVideo.vue`).
2. Opcional: sustituye el póster `public/placeholders/hero-poster.svg` por un JPG/WebP y actualiza `heroPoster` en `app/components/HeroVideo.vue`.
3. Si el vídeo falla al cargar, la web muestra automáticamente el póster.

## Fotos de las 5 casas

1. Entra en `/admin` (usuario creado en Supabase Auth).
2. Edita cada casa y usa **Subir imagen** (bucket `houses`).
3. La primera imagen puede usarse como portada (`cover_image_url`).

Hasta entonces se usan los SVG de `public/placeholders/house-1.svg` … `house-5.svg`.

## Widget RoomRaccoon

1. Abre `app/components/RoomRaccoonSlot.vue`.
2. Pega el snippet/código del widget dentro de `div[data-roomraccoon-root]`.
3. Si RoomRaccoon pide un script global, añádelo en `nuxt.config.ts` → `app.head.script` o en un plugin client-only.

El contenedor `#roomraccoon-widget` ya está en cada ficha de casa.

## i18n

- Textos de UI: `i18n/locales/es.json` y `en.json`.
- Contenido de casas: columnas `_es` / `_en` en Supabase (editables en admin).
