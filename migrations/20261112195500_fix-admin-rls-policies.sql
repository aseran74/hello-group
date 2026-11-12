-- Explicit authenticated CRUD policies + revoke anon writes
-- (PostgREST + FOR ALL alone was causing RLS denials when JWT wasn't applied)

-- ROOMS
DROP POLICY IF EXISTS rooms_admin_all ON public.rooms;
DROP POLICY IF EXISTS rooms_admin_select ON public.rooms;
DROP POLICY IF EXISTS rooms_admin_insert ON public.rooms;
DROP POLICY IF EXISTS rooms_admin_update ON public.rooms;
DROP POLICY IF EXISTS rooms_admin_delete ON public.rooms;
CREATE POLICY rooms_admin_select ON public.rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY rooms_admin_insert ON public.rooms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY rooms_admin_update ON public.rooms FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY rooms_admin_delete ON public.rooms FOR DELETE TO authenticated USING (true);
REVOKE INSERT, UPDATE, DELETE ON public.rooms FROM anon;
GRANT SELECT ON public.rooms TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.rooms TO authenticated;

-- ROOM_IMAGES
DROP POLICY IF EXISTS room_images_admin_all ON public.room_images;
DROP POLICY IF EXISTS room_images_admin_select ON public.room_images;
DROP POLICY IF EXISTS room_images_admin_insert ON public.room_images;
DROP POLICY IF EXISTS room_images_admin_update ON public.room_images;
DROP POLICY IF EXISTS room_images_admin_delete ON public.room_images;
CREATE POLICY room_images_admin_select ON public.room_images FOR SELECT TO authenticated USING (true);
CREATE POLICY room_images_admin_insert ON public.room_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY room_images_admin_update ON public.room_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY room_images_admin_delete ON public.room_images FOR DELETE TO authenticated USING (true);
REVOKE INSERT, UPDATE, DELETE ON public.room_images FROM anon;
GRANT SELECT ON public.room_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.room_images TO authenticated;

-- APARTMENTS
DROP POLICY IF EXISTS apartments_admin_all ON public.apartments;
DROP POLICY IF EXISTS apartments_admin_select ON public.apartments;
DROP POLICY IF EXISTS apartments_admin_insert ON public.apartments;
DROP POLICY IF EXISTS apartments_admin_update ON public.apartments;
DROP POLICY IF EXISTS apartments_admin_delete ON public.apartments;
CREATE POLICY apartments_admin_select ON public.apartments FOR SELECT TO authenticated USING (true);
CREATE POLICY apartments_admin_insert ON public.apartments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY apartments_admin_update ON public.apartments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY apartments_admin_delete ON public.apartments FOR DELETE TO authenticated USING (true);
REVOKE INSERT, UPDATE, DELETE ON public.apartments FROM anon;
GRANT SELECT ON public.apartments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.apartments TO authenticated;

-- APARTMENT_IMAGES
DROP POLICY IF EXISTS apartment_images_admin_all ON public.apartment_images;
DROP POLICY IF EXISTS apartment_images_admin_select ON public.apartment_images;
DROP POLICY IF EXISTS apartment_images_admin_insert ON public.apartment_images;
DROP POLICY IF EXISTS apartment_images_admin_update ON public.apartment_images;
DROP POLICY IF EXISTS apartment_images_admin_delete ON public.apartment_images;
CREATE POLICY apartment_images_admin_select ON public.apartment_images FOR SELECT TO authenticated USING (true);
CREATE POLICY apartment_images_admin_insert ON public.apartment_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY apartment_images_admin_update ON public.apartment_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY apartment_images_admin_delete ON public.apartment_images FOR DELETE TO authenticated USING (true);
REVOKE INSERT, UPDATE, DELETE ON public.apartment_images FROM anon;
GRANT SELECT ON public.apartment_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.apartment_images TO authenticated;

-- HOUSES
DROP POLICY IF EXISTS houses_admin_all ON public.houses;
DROP POLICY IF EXISTS houses_admin_select ON public.houses;
DROP POLICY IF EXISTS houses_admin_insert ON public.houses;
DROP POLICY IF EXISTS houses_admin_update ON public.houses;
DROP POLICY IF EXISTS houses_admin_delete ON public.houses;
CREATE POLICY houses_admin_select ON public.houses FOR SELECT TO authenticated USING (true);
CREATE POLICY houses_admin_insert ON public.houses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY houses_admin_update ON public.houses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY houses_admin_delete ON public.houses FOR DELETE TO authenticated USING (true);
REVOKE INSERT, UPDATE, DELETE ON public.houses FROM anon;
GRANT SELECT ON public.houses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.houses TO authenticated;

-- HOUSE_IMAGES
DROP POLICY IF EXISTS house_images_admin_all ON public.house_images;
DROP POLICY IF EXISTS house_images_admin_select ON public.house_images;
DROP POLICY IF EXISTS house_images_admin_insert ON public.house_images;
DROP POLICY IF EXISTS house_images_admin_update ON public.house_images;
DROP POLICY IF EXISTS house_images_admin_delete ON public.house_images;
CREATE POLICY house_images_admin_select ON public.house_images FOR SELECT TO authenticated USING (true);
CREATE POLICY house_images_admin_insert ON public.house_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY house_images_admin_update ON public.house_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY house_images_admin_delete ON public.house_images FOR DELETE TO authenticated USING (true);
REVOKE INSERT, UPDATE, DELETE ON public.house_images FROM anon;
GRANT SELECT ON public.house_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.house_images TO authenticated;
