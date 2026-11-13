-- Persist RoomRaccoon booking URLs + reset Canillas to 2 apartments

ALTER TABLE public.houses ADD COLUMN IF NOT EXISTS booking_url text;
ALTER TABLE public.apartments ADD COLUMN IF NOT EXISTS booking_url text;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS booking_url text;

DELETE FROM public.rooms WHERE house_id = '11111111-1111-1111-1111-111111111102';
DELETE FROM public.apartments WHERE house_id = '11111111-1111-1111-1111-111111111102';

UPDATE public.houses
SET booking_url = 'https://booking.roomraccoon.es/hello-home-canillas/es/?dateStart=11-11-2026&dateEnd=12-11-2026',
    bedrooms = 2,
    bathrooms = 2,
    capacity = 4,
    updated_at = now()
WHERE id = '11111111-1111-1111-1111-111111111102';

INSERT INTO public.apartments (
  id, house_id, name_es, name_en, description_es, description_en,
  capacity, bedrooms, bathrooms, sort_order, published, booking_url, cover_image_url
) VALUES
(
  '22222222-2222-2222-2222-222222222201',
  '11111111-1111-1111-1111-111111111102',
  'Apartamento Cibeles',
  'Cibeles Apartment',
  'Apartamento Cibeles en Canillas: luz, diseño y descanso con el sello Hello Group.',
  'Cibeles apartment in Canillas: light, design and rest with the Hello Group touch.',
  2, 1, 1, 1, true,
  'https://booking.roomraccoon.es/hello-home-canillas/es/?dateStart=11-11-2026&dateEnd=12-11-2026#75054',
  '/Fotos/Canillas/Cibeles/457537558.jpg'
),
(
  '22222222-2222-2222-2222-222222222202',
  '11111111-1111-1111-1111-111111111102',
  'Apartamento Neptuno',
  'Neptuno Apartment',
  'Apartamento Neptuno en Canillas: espacio luminoso y cómodo para tu estancia.',
  'Neptuno apartment in Canillas: bright and comfortable space for your stay.',
  2, 1, 1, 2, true,
  'https://booking.roomraccoon.es/hello-home-canillas/es/?roomTypes=74902&dateStart=11-11-2026&dateEnd=12-11-2026',
  '/Fotos/Canillas/Neptuno/457537518.jpg'
)
ON CONFLICT (id) DO UPDATE SET
  name_es = EXCLUDED.name_es,
  name_en = EXCLUDED.name_en,
  description_es = EXCLUDED.description_es,
  description_en = EXCLUDED.description_en,
  capacity = EXCLUDED.capacity,
  bedrooms = EXCLUDED.bedrooms,
  bathrooms = EXCLUDED.bathrooms,
  sort_order = EXCLUDED.sort_order,
  published = EXCLUDED.published,
  booking_url = EXCLUDED.booking_url,
  cover_image_url = EXCLUDED.cover_image_url,
  updated_at = now();

DELETE FROM public.apartment_images WHERE apartment_id IN (
  '22222222-2222-2222-2222-222222222201',
  '22222222-2222-2222-2222-222222222202'
);

INSERT INTO public.apartment_images (id, apartment_id, url, alt_es, alt_en, sort_order) VALUES
('33333333-3333-3333-3333-333333333201', '22222222-2222-2222-2222-222222222201', '/Fotos/Canillas/Cibeles/457537562.jpg', 'Cibeles', 'Cibeles', 1),
('33333333-3333-3333-3333-333333333202', '22222222-2222-2222-2222-222222222201', '/Fotos/Canillas/Cibeles/457537569.jpg', 'Cibeles', 'Cibeles', 2),
('33333333-3333-3333-3333-333333333203', '22222222-2222-2222-2222-222222222201', '/Fotos/Canillas/Cibeles/457537801.jpg', 'Cibeles', 'Cibeles', 3),
('33333333-3333-3333-3333-333333333211', '22222222-2222-2222-2222-222222222202', '/Fotos/Canillas/Neptuno/457537526.jpg', 'Neptuno', 'Neptuno', 1),
('33333333-3333-3333-3333-333333333212', '22222222-2222-2222-2222-222222222202', '/Fotos/Canillas/Neptuno/457537547.jpg', 'Neptuno', 'Neptuno', 2),
('33333333-3333-3333-3333-333333333213', '22222222-2222-2222-2222-222222222202', '/Fotos/Canillas/Neptuno/597535533.jpg', 'Neptuno', 'Neptuno', 3),
('33333333-3333-3333-3333-333333333214', '22222222-2222-2222-2222-222222222202', '/Fotos/Canillas/Neptuno/806499329.jpg', 'Neptuno', 'Neptuno', 4);
