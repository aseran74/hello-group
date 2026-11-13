-- Hello Madrid Feria: 3 apartamentos RoomRaccoon (Home 1, 2, 5)

DELETE FROM public.rooms WHERE house_id = '11111111-1111-1111-1111-111111111103';
DELETE FROM public.apartments WHERE house_id = '11111111-1111-1111-1111-111111111103';

UPDATE public.houses
SET name_es = 'Hello Madrid Feria',
    name_en = 'Hello Madrid Feria',
    booking_url = 'https://booking.roomraccoon.es/hello-madrid/es/?roomTypes=77055%2C85186%2C100279&dateStart=11-11-2026&dateEnd=12-11-2026',
    bedrooms = 3,
    bathrooms = 3,
    capacity = 6,
    property_type_es = 'Apartamentos Hello Madrid Feria',
    property_type_en = 'Hello Madrid Feria apartments',
    description_es = 'Hello Madrid Feria: tres apartamentos (Hello Home 1, 2 y 5) junto a IFEMA, listos para ferias y estancias urbanas.',
    description_en = 'Hello Madrid Feria: three apartments (Hello Home 1, 2 and 5) near IFEMA, ready for trade fairs and city stays.',
    updated_at = now()
WHERE id = '11111111-1111-1111-1111-111111111103';

INSERT INTO public.apartments (
  id, house_id, name_es, name_en, description_es, description_en,
  capacity, bedrooms, bathrooms, sort_order, published, booking_url, cover_image_url
) VALUES
(
  '22222222-2222-2222-2222-222222222301',
  '11111111-1111-1111-1111-111111111103',
  'Hello Home 1',
  'Hello Home 1',
  'Hello Home 1 en Mar Mediterráneo: luminoso y cómodo junto a IFEMA.',
  'Hello Home 1 on Mar Mediterraneo: bright and comfortable near IFEMA.',
  2, 1, 1, 1, true,
  'https://booking.roomraccoon.es/hello-madrid/es/?roomTypes=77055&dateStart=11-11-2026&dateEnd=12-11-2026',
  '/Fotos/Mediterraneo/Madrid-1/430760121.jpg'
),
(
  '22222222-2222-2222-2222-222222222302',
  '11111111-1111-1111-1111-111111111103',
  'Hello Home 2',
  'Hello Home 2',
  'Hello Home 2 en Mar Mediterráneo: espacio práctico para tu estancia en Madrid.',
  'Hello Home 2 on Mar Mediterraneo: a practical space for your Madrid stay.',
  2, 1, 1, 2, true,
  'https://booking.roomraccoon.es/hello-madrid/es/?roomTypes=85186&dateStart=11-11-2026&dateEnd=12-11-2026',
  '/Fotos/Mediterraneo/Madrid-2/339600171.jpg'
),
(
  '22222222-2222-2222-2222-222222222305',
  '11111111-1111-1111-1111-111111111103',
  'Hello Home 5',
  'Hello Home 5',
  'Hello Home 5 en Mar Mediterráneo: diseño Hello Group cerca de la feria.',
  'Hello Home 5 on Mar Mediterraneo: Hello Group design near the fairgrounds.',
  2, 1, 1, 3, true,
  'https://booking.roomraccoon.es/hello-madrid/es/?roomTypes=100279&dateStart=11-11-2026&dateEnd=12-11-2026',
  '/Fotos/Mediterraneo/Madrid-5/615979980.jpg'
);

INSERT INTO public.apartment_images (id, apartment_id, url, alt_es, alt_en, sort_order) VALUES
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222301', '/Fotos/Mediterraneo/Madrid-1/430760138.jpg', 'Hello Home 1', 'Hello Home 1', 1),
('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222301', '/Fotos/Mediterraneo/Madrid-1/430760154.jpg', 'Hello Home 1', 'Hello Home 1', 2),
('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222301', '/Fotos/Mediterraneo/Madrid-1/430760168.jpg', 'Hello Home 1', 'Hello Home 1', 3),
('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222301', '/Fotos/Mediterraneo/Madrid-1/431520993.jpg', 'Hello Home 1', 'Hello Home 1', 4),
('33333333-3333-3333-3333-333333333311', '22222222-2222-2222-2222-222222222302', '/Fotos/Mediterraneo/Madrid-2/339600174.jpg', 'Hello Home 2', 'Hello Home 2', 1),
('33333333-3333-3333-3333-333333333312', '22222222-2222-2222-2222-222222222302', '/Fotos/Mediterraneo/Madrid-2/339600180.jpg', 'Hello Home 2', 'Hello Home 2', 2),
('33333333-3333-3333-3333-333333333313', '22222222-2222-2222-2222-222222222302', '/Fotos/Mediterraneo/Madrid-2/360268510.jpg', 'Hello Home 2', 'Hello Home 2', 3),
('33333333-3333-3333-3333-333333333314', '22222222-2222-2222-2222-222222222302', '/Fotos/Mediterraneo/Madrid-2/360268517.jpg', 'Hello Home 2', 'Hello Home 2', 4),
('33333333-3333-3333-3333-333333333321', '22222222-2222-2222-2222-222222222305', '/Fotos/Mediterraneo/Madrid-5/615980017.jpg', 'Hello Home 5', 'Hello Home 5', 1),
('33333333-3333-3333-3333-333333333322', '22222222-2222-2222-2222-222222222305', '/Fotos/Mediterraneo/Madrid-5/615980137.jpg', 'Hello Home 5', 'Hello Home 5', 2),
('33333333-3333-3333-3333-333333333323', '22222222-2222-2222-2222-222222222305', '/Fotos/Mediterraneo/Madrid-5/615980083.jpg', 'Hello Home 5', 'Hello Home 5', 3),
('33333333-3333-3333-3333-333333333324', '22222222-2222-2222-2222-222222222305', '/Fotos/Mediterraneo/Madrid-5/615980146.jpg', 'Hello Home 5', 'Hello Home 5', 4);
