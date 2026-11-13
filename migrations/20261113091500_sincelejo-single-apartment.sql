-- Sincelejo: un solo apartamento con RoomRaccoon

DELETE FROM public.rooms WHERE house_id = '11111111-1111-1111-1111-111111111105';
DELETE FROM public.apartments WHERE house_id = '11111111-1111-1111-1111-111111111105' AND id <> '22222222-2222-2222-2222-222222222501';

UPDATE public.houses
SET booking_url = 'https://booking.roomraccoon.es/hello-astur/es/?roomTypes=127561',
    bedrooms = 2,
    bathrooms = 2,
    capacity = 4,
    updated_at = now()
WHERE id = '11111111-1111-1111-1111-111111111105';

INSERT INTO public.apartments (
  id, house_id, name_es, name_en, description_es, description_en,
  capacity, bedrooms, bathrooms, sort_order, published, booking_url, cover_image_url
) VALUES (
  '22222222-2222-2222-2222-222222222501',
  '11111111-1111-1111-1111-111111111105',
  'Apartamento Sincelejo',
  'Sincelejo Apartment',
  'Apartamento Sincelejo: comodidad, espacio y buen descanso con el sello Hello Group.',
  'Sincelejo apartment: comfort, space and a good rest with the Hello Group touch.',
  4, 2, 2, 1, true,
  'https://booking.roomraccoon.es/hello-astur/es/?roomTypes=127561',
  '/Fotos/Sincelejo/593765313.jpg'
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

DELETE FROM public.apartment_images WHERE apartment_id = '22222222-2222-2222-2222-222222222501';

INSERT INTO public.apartment_images (id, apartment_id, url, alt_es, alt_en, sort_order) VALUES
('33333333-3333-3333-3333-333333333501', '22222222-2222-2222-2222-222222222501', '/Fotos/Sincelejo/593765319.jpg', 'Sincelejo', 'Sincelejo', 1),
('33333333-3333-3333-3333-333333333502', '22222222-2222-2222-2222-222222222501', '/Fotos/Sincelejo/593765346.jpg', 'Sincelejo', 'Sincelejo', 2),
('33333333-3333-3333-3333-333333333503', '22222222-2222-2222-2222-222222222501', '/Fotos/Sincelejo/597358251.jpg', 'Sincelejo', 'Sincelejo', 3),
('33333333-3333-3333-3333-333333333504', '22222222-2222-2222-2222-222222222501', '/Fotos/Sincelejo/597358252.jpg', 'Sincelejo', 'Sincelejo', 4),
('33333333-3333-3333-3333-333333333505', '22222222-2222-2222-2222-222222222501', '/Fotos/Sincelejo/597358253.jpg', 'Sincelejo', 'Sincelejo', 5),
('33333333-3333-3333-3333-333333333506', '22222222-2222-2222-2222-222222222501', '/Fotos/Sincelejo/607656370.jpg', 'Sincelejo', 'Sincelejo', 6),
('33333333-3333-3333-3333-333333333507', '22222222-2222-2222-2222-222222222501', '/Fotos/Sincelejo/607656373.jpg', 'Sincelejo', 'Sincelejo', 7);
