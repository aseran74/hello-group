-- Permitir a usuarios autenticados (admin) subir/borrar en house-photos
-- Además de las políticas owner-only por defecto

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS storage_house_photos_auth_select ON storage.objects;
CREATE POLICY storage_house_photos_auth_select
  ON storage.objects
  FOR SELECT
  TO authenticated, anon
  USING (bucket = 'house-photos');

DROP POLICY IF EXISTS storage_house_photos_auth_insert ON storage.objects;
CREATE POLICY storage_house_photos_auth_insert
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket = 'house-photos');

DROP POLICY IF EXISTS storage_house_photos_auth_update ON storage.objects;
CREATE POLICY storage_house_photos_auth_update
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket = 'house-photos')
  WITH CHECK (bucket = 'house-photos');

DROP POLICY IF EXISTS storage_house_photos_auth_delete ON storage.objects;
CREATE POLICY storage_house_photos_auth_delete
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket = 'house-photos');

GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated, anon;
