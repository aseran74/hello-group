-- Twin bed type for rooms + apartments as separate units under a house

ALTER TABLE public.rooms
  DROP CONSTRAINT IF EXISTS rooms_room_type_check;

ALTER TABLE public.rooms
  ADD CONSTRAINT rooms_room_type_check
  CHECK (room_type IN ('single', 'double', 'twin', 'triple'));

CREATE TABLE IF NOT EXISTS public.apartments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id uuid NOT NULL REFERENCES public.houses(id) ON DELETE CASCADE,
  name_es text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  description_es text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  capacity integer NOT NULL DEFAULT 2,
  bedrooms integer NOT NULL DEFAULT 1,
  bathrooms integer NOT NULL DEFAULT 1,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  cover_image_url text,
  cover_image_key text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.apartment_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id uuid NOT NULL REFERENCES public.apartments(id) ON DELETE CASCADE,
  url text NOT NULL,
  storage_key text,
  alt_es text,
  alt_en text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS apartments_house_sort_idx
  ON public.apartments (house_id, sort_order);

CREATE INDEX IF NOT EXISTS apartment_images_apartment_sort_idx
  ON public.apartment_images (apartment_id, sort_order);

DROP TRIGGER IF EXISTS apartments_set_updated_at ON public.apartments;
CREATE TRIGGER apartments_set_updated_at
  BEFORE UPDATE ON public.apartments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apartment_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS apartments_public_select ON public.apartments;
CREATE POLICY apartments_public_select
  ON public.apartments
  FOR SELECT
  TO anon, authenticated
  USING (
    published = true
    AND EXISTS (
      SELECT 1 FROM public.houses h
      WHERE h.id = apartments.house_id
        AND h.published = true
    )
  );

DROP POLICY IF EXISTS apartments_admin_all ON public.apartments;
CREATE POLICY apartments_admin_all
  ON public.apartments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS apartment_images_public_select ON public.apartment_images;
CREATE POLICY apartment_images_public_select
  ON public.apartment_images
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.apartments a
      JOIN public.houses h ON h.id = a.house_id
      WHERE a.id = apartment_images.apartment_id
        AND a.published = true
        AND h.published = true
    )
  );

DROP POLICY IF EXISTS apartment_images_admin_all ON public.apartment_images;
CREATE POLICY apartment_images_admin_all
  ON public.apartment_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.apartments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.apartments TO authenticated;

GRANT SELECT ON public.apartment_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.apartment_images TO authenticated;
