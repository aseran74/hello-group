-- Hello Madrid Norte: solo habitaciones RoomRaccoon (sin apartamentos)
-- Añade room_type quadruple

ALTER TABLE public.rooms DROP CONSTRAINT IF EXISTS rooms_room_type_check;
ALTER TABLE public.rooms
  ADD CONSTRAINT rooms_room_type_check
  CHECK (room_type IN ('single', 'double', 'twin', 'triple', 'quadruple'));

DELETE FROM public.apartments WHERE house_id = '11111111-1111-1111-1111-111111111104';
DELETE FROM public.rooms WHERE house_id = '11111111-1111-1111-1111-111111111104';

UPDATE public.houses
SET name_es = 'Hello Madrid Norte',
    name_en = 'Hello Madrid Norte',
    booking_url = 'https://booking.roomraccoon.es/hello-herrera-oria/es/?roomTypes=131685%2C131593%2C131683%2C131684%2C131682&dateStart=11-11-2026&dateEnd=12-11-2026',
    property_type_es = 'Habitaciones Hello Madrid Norte',
    property_type_en = 'Hello Madrid Norte rooms',
    description_es = 'Hello Madrid Norte: habitaciones twin, dobles, triple y cuádruple con baño compartido en Herrera Oria.',
    description_en = 'Hello Madrid Norte: twin, double, triple and quadruple rooms with shared bathroom in Herrera Oria.',
    capacity = 13,
    bedrooms = 5,
    bathrooms = 1,
    updated_at = now()
WHERE id = '11111111-1111-1111-1111-111111111104';

INSERT INTO public.rooms (
  id, house_id, name_es, name_en, room_type, bathroom_type,
  description_es, description_en, capacity, sort_order, published, booking_url, cover_image_url
) VALUES
(
  '44444444-4444-4444-4444-444444444401',
  '11111111-1111-1111-1111-111111111104',
  'Twin con Baño Compartido',
  'Twin with Shared Bathroom',
  'twin', 'shared',
  'Habitación twin con baño compartido en Hello Madrid Norte (Herrera Oria).',
  'Twin room with shared bathroom at Hello Madrid Norte (Herrera Oria).',
  2, 1, true,
  'https://booking.roomraccoon.es/hello-herrera-oria/es/?roomTypes=131682&dateStart=11-11-2026&dateEnd=12-11-2026',
  '/Fotos/Madrid-Norte/912264196.jpg'
),
(
  '44444444-4444-4444-4444-444444444402',
  '11111111-1111-1111-1111-111111111104',
  'Doble con Baño Compartido',
  'Double with Shared Bathroom',
  'double', 'shared',
  'Habitación doble con baño compartido en Hello Madrid Norte.',
  'Double room with shared bathroom at Hello Madrid Norte.',
  2, 2, true,
  'https://booking.roomraccoon.es/hello-herrera-oria/es/?roomTypes=131593&dateStart=11-11-2026&dateEnd=12-11-2026',
  '/Fotos/Madrid-Norte/913911163.jpg'
),
(
  '44444444-4444-4444-4444-444444444403',
  '11111111-1111-1111-1111-111111111104',
  'Doble con Terraza y Baño Compartido',
  'Double with Terrace and Shared Bathroom',
  'double', 'shared',
  'Habitación doble con terraza y baño compartido en Hello Madrid Norte.',
  'Double room with terrace and shared bathroom at Hello Madrid Norte.',
  2, 3, true,
  'https://booking.roomraccoon.es/hello-herrera-oria/es/?roomTypes=131683&dateStart=11-11-2026&dateEnd=12-11-2026',
  '/Fotos/Madrid-Norte/913912245.jpg'
),
(
  '44444444-4444-4444-4444-444444444404',
  '11111111-1111-1111-1111-111111111104',
  'Cuádruple con Terraza y Baño Compartido',
  'Quadruple with Terrace and Shared Bathroom',
  'quadruple', 'shared',
  'Habitación cuádruple con terraza y baño compartido en Hello Madrid Norte.',
  'Quadruple room with terrace and shared bathroom at Hello Madrid Norte.',
  4, 4, true,
  'https://booking.roomraccoon.es/hello-herrera-oria/es/?roomTypes=131685&dateStart=11-11-2026&dateEnd=12-11-2026',
  '/Fotos/Madrid-Norte/914528232.jpg'
),
(
  '44444444-4444-4444-4444-444444444405',
  '11111111-1111-1111-1111-111111111104',
  'Triple con Baño Compartido',
  'Triple with Shared Bathroom',
  'triple', 'shared',
  'Habitación triple con baño compartido en Hello Madrid Norte.',
  'Triple room with shared bathroom at Hello Madrid Norte.',
  3, 5, true,
  'https://booking.roomraccoon.es/hello-herrera-oria/es/?roomTypes=131684&dateStart=11-11-2026&dateEnd=12-11-2026',
  '/Fotos/Madrid-Norte/916211454.jpg'
);

INSERT INTO public.room_images (id, room_id, url, alt_es, alt_en, sort_order) VALUES
('55555555-5555-5555-5555-555555555401', '44444444-4444-4444-4444-444444444401', '/Fotos/Madrid-Norte/912264206.jpg', 'Twin', 'Twin', 1),
('55555555-5555-5555-5555-555555555402', '44444444-4444-4444-4444-444444444401', '/Fotos/Madrid-Norte/912264211.jpg', 'Twin', 'Twin', 2),
('55555555-5555-5555-5555-555555555411', '44444444-4444-4444-4444-444444444402', '/Fotos/Madrid-Norte/913911164.jpg', 'Doble', 'Double', 1),
('55555555-5555-5555-5555-555555555412', '44444444-4444-4444-4444-444444444402', '/Fotos/Madrid-Norte/913911714.jpg', 'Doble', 'Double', 2),
('55555555-5555-5555-5555-555555555421', '44444444-4444-4444-4444-444444444403', '/Fotos/Madrid-Norte/913912235.jpg', 'Doble terraza', 'Double terrace', 1),
('55555555-5555-5555-5555-555555555422', '44444444-4444-4444-4444-444444444403', '/Fotos/Madrid-Norte/913912236.jpg', 'Doble terraza', 'Double terrace', 2),
('55555555-5555-5555-5555-555555555431', '44444444-4444-4444-4444-444444444404', '/Fotos/Madrid-Norte/914529014.jpg', 'Cuádruple', 'Quadruple', 1),
('55555555-5555-5555-5555-555555555432', '44444444-4444-4444-4444-444444444404', '/Fotos/Madrid-Norte/914529019.jpg', 'Cuádruple', 'Quadruple', 2),
('55555555-5555-5555-5555-555555555441', '44444444-4444-4444-4444-444444444405', '/Fotos/Madrid-Norte/916211455.jpg', 'Triple', 'Triple', 1),
('55555555-5555-5555-5555-555555555442', '44444444-4444-4444-4444-444444444405', '/Fotos/Madrid-Norte/916211457.jpg', 'Triple', 'Triple', 2);
