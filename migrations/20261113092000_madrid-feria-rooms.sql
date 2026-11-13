-- Hello Madrid Feria: 3 habitaciones RoomRaccoon (apartamentos se mantienen)

DELETE FROM public.rooms WHERE house_id = '11111111-1111-1111-1111-111111111103';

UPDATE public.houses
SET booking_url = 'https://booking.roomraccoon.es/hello-madrid/es/?roomTypes=77055%2C85186%2C100279%2C114883%2C114884%2C114885&dateStart=11-11-2026&dateEnd=12-11-2026',
    capacity = 11,
    bedrooms = 6,
    bathrooms = 4,
    description_es = 'Hello Madrid Feria: tres apartamentos (Hello Home 1, 2 y 5) y habitaciones dobles/triple junto a IFEMA.',
    description_en = 'Hello Madrid Feria: three apartments (Hello Home 1, 2 and 5) plus double/triple rooms near IFEMA.',
    updated_at = now()
WHERE id = '11111111-1111-1111-1111-111111111103';

INSERT INTO public.rooms (
  id, house_id, name_es, name_en, room_type, bathroom_type,
  description_es, description_en, capacity, sort_order, published, booking_url, cover_image_url
) VALUES
(
  '44444444-4444-4444-4444-444444444301',
  '11111111-1111-1111-1111-111111111103',
  'Habitación Doble con Baño Compartido',
  'Double Room with Shared Bathroom',
  'double', 'shared',
  'Habitación doble con baño compartido en Hello Madrid Feria, cerca de IFEMA.',
  'Double room with shared bathroom at Hello Madrid Feria, near IFEMA.',
  2, 1, true,
  'https://booking.roomraccoon.es/hello-madrid/es/?roomTypes=114883&dateStart=11-11-2026&dateEnd=12-11-2026',
  '/Fotos/Mediterraneo/Madrid-1/597356687.jpg'
),
(
  '44444444-4444-4444-4444-444444444302',
  '11111111-1111-1111-1111-111111111103',
  'Habitación Doble con Baño Privado',
  'Double Room with Private Bathroom',
  'double', 'private',
  'Habitación doble con baño privado en Hello Madrid Feria, ideal para estancias cómodas.',
  'Double room with private bathroom at Hello Madrid Feria, ideal for a comfortable stay.',
  2, 2, true,
  'https://booking.roomraccoon.es/hello-madrid/es/?roomTypes=114884&dateStart=11-11-2026&dateEnd=12-11-2026',
  '/Fotos/Mediterraneo/Madrid-2/339600190.jpg'
),
(
  '44444444-4444-4444-4444-444444444303',
  '11111111-1111-1111-1111-111111111103',
  'Habitación Triple con Baño Compartido',
  'Triple Room with Shared Bathroom',
  'triple', 'shared',
  'Habitación triple con baño compartido en Hello Madrid Feria, pensada para grupos pequeños.',
  'Triple room with shared bathroom at Hello Madrid Feria, designed for small groups.',
  3, 3, true,
  'https://booking.roomraccoon.es/hello-madrid/es/?roomTypes=114885&dateStart=11-11-2026&dateEnd=12-11-2026',
  '/Fotos/Mediterraneo/Madrid-5/615980120.jpg'
);

INSERT INTO public.room_images (id, room_id, url, alt_es, alt_en, sort_order) VALUES
('55555555-5555-5555-5555-555555555301', '44444444-4444-4444-4444-444444444301', '/Fotos/Mediterraneo/Madrid-1/597356689.jpg', 'Doble baño compartido', 'Double shared bath', 1),
('55555555-5555-5555-5555-555555555302', '44444444-4444-4444-4444-444444444301', '/Fotos/Mediterraneo/Madrid-1/597356692.jpg', 'Doble baño compartido', 'Double shared bath', 2),
('55555555-5555-5555-5555-555555555303', '44444444-4444-4444-4444-444444444301', '/Fotos/Mediterraneo/Madrid-1/597356695.jpg', 'Doble baño compartido', 'Double shared bath', 3),
('55555555-5555-5555-5555-555555555311', '44444444-4444-4444-4444-444444444302', '/Fotos/Mediterraneo/Madrid-2/339600192.jpg', 'Doble baño privado', 'Double private bath', 1),
('55555555-5555-5555-5555-555555555312', '44444444-4444-4444-4444-444444444302', '/Fotos/Mediterraneo/Madrid-2/339600198.jpg', 'Doble baño privado', 'Double private bath', 2),
('55555555-5555-5555-5555-555555555313', '44444444-4444-4444-4444-444444444302', '/Fotos/Mediterraneo/Madrid-2/339600208.jpg', 'Doble baño privado', 'Double private bath', 3),
('55555555-5555-5555-5555-555555555321', '44444444-4444-4444-4444-444444444303', '/Fotos/Mediterraneo/Madrid-5/615980122.jpg', 'Triple baño compartido', 'Triple shared bath', 1),
('55555555-5555-5555-5555-555555555322', '44444444-4444-4444-4444-444444444303', '/Fotos/Mediterraneo/Madrid-5/615980126.jpg', 'Triple baño compartido', 'Triple shared bath', 2),
('55555555-5555-5555-5555-555555555323', '44444444-4444-4444-4444-444444444303', '/Fotos/Mediterraneo/Madrid-5/615980149.jpg', 'Triple baño compartido', 'Triple shared bath', 3);
