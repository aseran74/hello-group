-- Hello Group: houses + gallery images

CREATE TABLE IF NOT EXISTS public.houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_es text NOT NULL,
  name_en text NOT NULL,
  location_es text NOT NULL DEFAULT '',
  location_en text NOT NULL DEFAULT '',
  address_es text NOT NULL DEFAULT '',
  address_en text NOT NULL DEFAULT '',
  property_type_es text NOT NULL DEFAULT '',
  property_type_en text NOT NULL DEFAULT '',
  description_es text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  capacity integer NOT NULL DEFAULT 2,
  bedrooms integer NOT NULL DEFAULT 1,
  bathrooms integer NOT NULL DEFAULT 1,
  size_m2 integer,
  price_label_es text NOT NULL DEFAULT '',
  price_label_en text NOT NULL DEFAULT '',
  garage boolean NOT NULL DEFAULT false,
  amenities jsonb NOT NULL DEFAULT '[]'::jsonb,
  activities jsonb NOT NULL DEFAULT '[]'::jsonb,
  cover_image_url text,
  cover_image_key text,
  lat double precision,
  lng double precision,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.house_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id uuid NOT NULL REFERENCES public.houses(id) ON DELETE CASCADE,
  url text NOT NULL,
  storage_key text,
  alt_es text,
  alt_en text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS houses_published_sort_idx
  ON public.houses (published, sort_order);

CREATE INDEX IF NOT EXISTS house_images_house_sort_idx
  ON public.house_images (house_id, sort_order);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS houses_set_updated_at ON public.houses;
CREATE TRIGGER houses_set_updated_at
  BEFORE UPDATE ON public.houses
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_images ENABLE ROW LEVEL SECURITY;

-- Public read of published houses
DROP POLICY IF EXISTS houses_public_select ON public.houses;
CREATE POLICY houses_public_select
  ON public.houses
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Authenticated admins: full access
DROP POLICY IF EXISTS houses_admin_all ON public.houses;
CREATE POLICY houses_admin_all
  ON public.houses
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public read images of published houses
DROP POLICY IF EXISTS house_images_public_select ON public.house_images;
CREATE POLICY house_images_public_select
  ON public.house_images
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.houses h
      WHERE h.id = house_images.house_id
        AND h.published = true
    )
  );

DROP POLICY IF EXISTS house_images_admin_all ON public.house_images;
CREATE POLICY house_images_admin_all
  ON public.house_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.houses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.houses TO authenticated;

GRANT SELECT ON public.house_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.house_images TO authenticated;
