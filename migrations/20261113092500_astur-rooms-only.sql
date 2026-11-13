-- Hello Astur: solo habitaciones RoomRaccoon (sin apartamentos)

DELETE FROM public.apartments WHERE house_id = '11111111-1111-1111-1111-111111111101';
DELETE FROM public.rooms WHERE house_id = '11111111-1111-1111-1111-111111111101';

UPDATE public.houses
SET name_es = 'Hello Astur',
    name_en = 'Hello Astur',
    booking_url = 'https://booking.roomraccoon.es/hello-astur/es/?roomTypes=92863%2C131280%2C88369%2C88640%2C88641%2C88642%2C92842%2C88370',
    property_type_es = 'Habitaciones Hello Astur',
    property_type_en = 'Hello Astur rooms',
    description_es = 'Hello Astur: habitaciones dobles, twin y para grupos en Asturias, con reserva directa RoomRaccoon.',
    description_en = 'Hello Astur: double, twin and group rooms in Asturias, with direct RoomRaccoon booking.',
    capacity = 24,
    bedrooms = 8,
    bathrooms = 4,
    updated_at = now()
WHERE id = '11111111-1111-1111-1111-111111111101';

INSERT INTO public.rooms (
  id, house_id, name_es, name_en, room_type, bathroom_type,
  description_es, description_en, capacity, sort_order, published, booking_url, cover_image_url
) VALUES
('44444444-4444-4444-4444-444444444101', '11111111-1111-1111-1111-111111111101', 'Doble (+ supletoria) - Baño privado', 'Double (+ extra bed) - Private bathroom', 'double', 'private', 'Habitación doble con posibilidad de cama supletoria y baño privado.', 'Double room with optional extra bed and private bathroom.', 3, 1, true, 'https://booking.roomraccoon.es/hello-astur/es/?roomTypes=92863&dateStart=11-11-2026&dateEnd=12-11-2026', '/Fotos/Astur/462143687.jpg'),
('44444444-4444-4444-4444-444444444102', '11111111-1111-1111-1111-111111111101', 'Doble + Supletoria (Adaptada)', 'Double + Extra Bed (Accessible)', 'double', 'private', 'Habitación doble adaptada con cama supletoria y baño privado.', 'Accessible double room with extra bed and private bathroom.', 3, 2, true, 'https://booking.roomraccoon.es/hello-astur/es/?roomTypes=131280&dateStart=11-11-2026&dateEnd=12-11-2026', '/Fotos/Astur/462143690.jpg'),
('44444444-4444-4444-4444-444444444103', '11111111-1111-1111-1111-111111111101', 'Doble con Baño Privado', 'Double with Private Bathroom', 'double', 'private', 'Habitación doble con baño privado en Hello Astur.', 'Double room with private bathroom at Hello Astur.', 2, 3, true, 'https://booking.roomraccoon.es/hello-astur/es/?roomTypes=88369&dateStart=11-11-2026&dateEnd=12-11-2026', '/Fotos/Astur/462143700.jpg'),
('44444444-4444-4444-4444-444444444104', '11111111-1111-1111-1111-111111111101', 'Grupos B - Baño compartido', 'Groups B - Shared bathroom', 'quadruple', 'shared', 'Habitación para grupos (categoría B) con baño compartido.', 'Group room (category B) with shared bathroom.', 4, 4, true, 'https://booking.roomraccoon.es/hello-astur/es/?roomTypes=88640&dateStart=11-11-2026&dateEnd=12-11-2026', '/Fotos/Astur/462143710.jpg'),
('44444444-4444-4444-4444-444444444105', '11111111-1111-1111-1111-111111111101', 'Grupos A - Baño compartido', 'Groups A - Shared bathroom', 'quadruple', 'shared', 'Habitación para grupos (categoría A) con baño compartido.', 'Group room (category A) with shared bathroom.', 4, 5, true, 'https://booking.roomraccoon.es/hello-astur/es/?roomTypes=88641&dateStart=11-11-2026&dateEnd=12-11-2026', '/Fotos/Astur/462143715.jpg'),
('44444444-4444-4444-4444-444444444106', '11111111-1111-1111-1111-111111111101', 'Grupos C - Baño compartido', 'Groups C - Shared bathroom', 'quadruple', 'shared', 'Habitación para grupos (categoría C) con baño compartido.', 'Group room (category C) with shared bathroom.', 4, 6, true, 'https://booking.roomraccoon.es/hello-astur/es/?roomTypes=88642&dateStart=11-11-2026&dateEnd=12-11-2026', '/Fotos/Astur/462143728.jpg'),
('44444444-4444-4444-4444-444444444107', '11111111-1111-1111-1111-111111111101', 'Twin (+ supletoria) - Baño privado', 'Twin (+ extra bed) - Private bathroom', 'twin', 'private', 'Habitación twin con posibilidad de cama supletoria y baño privado.', 'Twin room with optional extra bed and private bathroom.', 3, 7, true, 'https://booking.roomraccoon.es/hello-astur/es/?roomTypes=92842&dateStart=11-11-2026&dateEnd=12-11-2026', '/Fotos/Astur/462143749.jpg'),
('44444444-4444-4444-4444-444444444108', '11111111-1111-1111-1111-111111111101', 'Twin con Baño Privado', 'Twin with Private Bathroom', 'twin', 'private', 'Habitación twin con baño privado en Hello Astur.', 'Twin room with private bathroom at Hello Astur.', 2, 8, true, 'https://booking.roomraccoon.es/hello-astur/es/?roomTypes=88370&dateStart=11-11-2026&dateEnd=12-11-2026', '/Fotos/Astur/467967371.jpg');

INSERT INTO public.room_images (id, room_id, url, alt_es, alt_en, sort_order) VALUES
('55555555-5555-5555-5555-555555555101', '44444444-4444-4444-4444-444444444101', '/Fotos/Astur/467967360.jpg', 'Doble supletoria', 'Double extra', 1),
('55555555-5555-5555-5555-555555555102', '44444444-4444-4444-4444-444444444101', '/Fotos/Astur/467967373.jpg', 'Doble supletoria', 'Double extra', 2),
('55555555-5555-5555-5555-555555555111', '44444444-4444-4444-4444-444444444102', '/Fotos/Astur/467967397.jpg', 'Doble adaptada', 'Double accessible', 1),
('55555555-5555-5555-5555-555555555112', '44444444-4444-4444-4444-444444444102', '/Fotos/Astur/467967446.jpg', 'Doble adaptada', 'Double accessible', 2),
('55555555-5555-5555-5555-555555555121', '44444444-4444-4444-4444-444444444103', '/Fotos/Astur/467967447.jpg', 'Doble privada', 'Double private', 1),
('55555555-5555-5555-5555-555555555122', '44444444-4444-4444-4444-444444444103', '/Fotos/Astur/467967448.jpg', 'Doble privada', 'Double private', 2),
('55555555-5555-5555-5555-555555555131', '44444444-4444-4444-4444-444444444104', '/Fotos/Astur/467967457.jpg', 'Grupos B', 'Groups B', 1),
('55555555-5555-5555-5555-555555555132', '44444444-4444-4444-4444-444444444104', '/Fotos/Astur/467967460.jpg', 'Grupos B', 'Groups B', 2),
('55555555-5555-5555-5555-555555555141', '44444444-4444-4444-4444-444444444105', '/Fotos/Astur/467967462.jpg', 'Grupos A', 'Groups A', 1),
('55555555-5555-5555-5555-555555555142', '44444444-4444-4444-4444-444444444105', '/Fotos/Astur/467967476.jpg', 'Grupos A', 'Groups A', 2),
('55555555-5555-5555-5555-555555555151', '44444444-4444-4444-4444-444444444106', '/Fotos/Astur/467967482.jpg', 'Grupos C', 'Groups C', 1),
('55555555-5555-5555-5555-555555555152', '44444444-4444-4444-4444-444444444106', '/Fotos/Astur/467967486.jpg', 'Grupos C', 'Groups C', 2),
('55555555-5555-5555-5555-555555555161', '44444444-4444-4444-4444-444444444107', '/Fotos/Astur/478545986.jpg', 'Twin supletoria', 'Twin extra', 1),
('55555555-5555-5555-5555-555555555162', '44444444-4444-4444-4444-444444444107', '/Fotos/Astur/478545987.jpg', 'Twin supletoria', 'Twin extra', 2),
('55555555-5555-5555-5555-555555555171', '44444444-4444-4444-4444-444444444108', '/Fotos/Astur/478545990.jpg', 'Twin privada', 'Twin private', 1),
('55555555-5555-5555-5555-555555555172', '44444444-4444-4444-4444-444444444108', '/Fotos/Astur/478545991.jpg', 'Twin privada', 'Twin private', 2);
