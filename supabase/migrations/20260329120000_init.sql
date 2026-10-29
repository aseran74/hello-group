-- Hello Astur schema
create extension if not exists "pgcrypto";

create table if not exists public.houses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_es text not null,
  name_en text not null,
  location_es text not null,
  location_en text not null,
  description_es text not null default '',
  description_en text not null default '',
  capacity integer not null default 2 check (capacity > 0),
  bedrooms integer not null default 1 check (bedrooms >= 0),
  amenities jsonb not null default '[]'::jsonb,
  cover_image_url text,
  lat double precision,
  lng double precision,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.house_images (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  url text not null,
  alt_es text,
  alt_en text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  house_id uuid references public.houses(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  locale text not null default 'es',
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists houses_published_sort_idx on public.houses (published, sort_order);
create index if not exists house_images_house_idx on public.house_images (house_id, sort_order);
create index if not exists inquiries_status_created_idx on public.inquiries (status, created_at desc);

alter table public.houses enable row level security;
alter table public.house_images enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_settings enable row level security;

-- Public read for published houses
create policy "Public read published houses"
  on public.houses for select
  using (published = true or auth.role() = 'authenticated');

create policy "Admin write houses"
  on public.houses for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Public read images of published houses"
  on public.house_images for select
  using (
    exists (
      select 1 from public.houses h
      where h.id = house_id and (h.published = true or auth.role() = 'authenticated')
    )
  );

create policy "Admin write house images"
  on public.house_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Anyone can insert inquiries"
  on public.inquiries for insert
  with check (true);

create policy "Admin read/update inquiries"
  on public.inquiries for select
  using (auth.role() = 'authenticated');

create policy "Admin update inquiries"
  on public.inquiries for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Public read site settings"
  on public.site_settings for select
  using (true);

create policy "Admin write site settings"
  on public.site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('houses', 'houses', true),
  ('brand', 'brand', true),
  ('hero', 'hero', true)
on conflict (id) do nothing;

create policy "Public read media"
  on storage.objects for select
  using (bucket_id in ('houses', 'brand', 'hero'));

create policy "Authenticated upload media"
  on storage.objects for insert
  with check (bucket_id in ('houses', 'brand', 'hero') and auth.role() = 'authenticated');

create policy "Authenticated update media"
  on storage.objects for update
  using (bucket_id in ('houses', 'brand', 'hero') and auth.role() = 'authenticated');

create policy "Authenticated delete media"
  on storage.objects for delete
  using (bucket_id in ('houses', 'brand', 'hero') and auth.role() = 'authenticated');

-- Seed 5 houses
insert into public.houses (
  id, slug, name_es, name_en, location_es, location_en,
  description_es, description_en, capacity, bedrooms, amenities,
  cover_image_url, lat, lng, sort_order, published
) values
(
  '11111111-1111-1111-1111-111111111101',
  'casa-del-puerto',
  'Casa del Puerto',
  'Casa del Puerto',
  'Cangas de Onís',
  'Cangas de Onís',
  'Casa de piedra junto al valle, con vistas a los Picos y un jardín para desayunar al aire libre.',
  'A stone house by the valley, with views towards the Picos and a garden for outdoor breakfasts.',
  6, 3,
  '[{"key":"wifi","label_es":"Wi‑Fi","label_en":"Wi‑Fi"},{"key":"fireplace","label_es":"Chimenea","label_en":"Fireplace"},{"key":"parking","label_es":"Parking","label_en":"Parking"},{"key":"garden","label_es":"Jardín","label_en":"Garden"}]'::jsonb,
  '/placeholders/house-1.svg', 43.35, -5.13, 1, true
),
(
  '11111111-1111-1111-1111-111111111102',
  'la-braña',
  'La Braña',
  'La Braña',
  'Somiedo',
  'Somiedo',
  'Refugio en la montaña verde, ideal para caminantes y noches de silencio total.',
  'A green-mountain refuge for walkers and nights of complete quiet.',
  4, 2,
  '[{"key":"wifi","label_es":"Wi‑Fi","label_en":"Wi‑Fi"},{"key":"heating","label_es":"Calefacción","label_en":"Heating"},{"key":"kitchen","label_es":"Cocina equipada","label_en":"Equipped kitchen"}]'::jsonb,
  '/placeholders/house-2.svg', 43.1, -6.25, 2, true
),
(
  '11111111-1111-1111-1111-111111111103',
  'casa-marina',
  'Casa Marina',
  'Casa Marina',
  'Llanes',
  'Llanes',
  'A pocos minutos de las playas del oriente, con luz atlántica y terraza amplia.',
  'Minutes from the eastern beaches, with Atlantic light and a wide terrace.',
  8, 4,
  '[{"key":"wifi","label_es":"Wi‑Fi","label_en":"Wi‑Fi"},{"key":"terrace","label_es":"Terraza","label_en":"Terrace"},{"key":"bbq","label_es":"Barbacoa","label_en":"BBQ"},{"key":"parking","label_es":"Parking","label_en":"Parking"}]'::jsonb,
  '/placeholders/house-3.svg', 43.42, -4.75, 3, true
),
(
  '11111111-1111-1111-1111-111111111104',
  'el-huerto',
  'El Huerto',
  'El Huerto',
  'Villaviciosa',
  'Villaviciosa',
  'Entre sidra y manzanos: una casa familiar con huerto y ambiente de aldea.',
  'Among cider and apple trees: a family home with a kitchen garden and village calm.',
  5, 3,
  '[{"key":"wifi","label_es":"Wi‑Fi","label_en":"Wi‑Fi"},{"key":"garden","label_es":"Huerto","label_en":"Garden"},{"key":"pets","label_es":"Mascotas a consultar","label_en":"Pets on request"}]'::jsonb,
  '/placeholders/house-4.svg', 43.48, -5.43, 4, true
),
(
  '11111111-1111-1111-1111-111111111105',
  'casa-del-bosque',
  'Casa del Bosque',
  'Casa del Bosque',
  'Taramundi',
  'Taramundi',
  'Envuelta en bosque y niebla, perfecta para desconectar y leer junto a la ventana.',
  'Wrapped in forest and mist — perfect for switching off and reading by the window.',
  4, 2,
  '[{"key":"wifi","label_es":"Wi‑Fi","label_en":"Wi‑Fi"},{"key":"fireplace","label_es":"Chimenea","label_en":"Fireplace"},{"key":"views","label_es":"Vistas al bosque","label_en":"Forest views"}]'::jsonb,
  '/placeholders/house-5.svg', 43.36, -7.11, 5, true
)
on conflict (id) do nothing;

insert into public.site_settings (key, value)
values
  ('brand', '{"name":"Hello Group"}'::jsonb),
  ('about_es', '{"lead":"Hello Group reúne cinco casas rurales bajo una misma idea.","body":""}'::jsonb),
  ('about_en', '{"lead":"Hello Group brings together five rural homes under one idea.","body":""}'::jsonb)
on conflict (key) do nothing;
