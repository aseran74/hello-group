-- Habitaciones por propiedad + fotos de habitación

CREATE TABLE IF NOT EXISTS public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id uuid NOT NULL REFERENCES public.houses(id) ON DELETE CASCADE,
  name_es text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  room_type text NOT NULL DEFAULT 'double'
    CHECK (room_type IN ('single', 'double', 'triple')),
  bathroom_type text NOT NULL DEFAULT 'private'
    CHECK (bathroom_type IN ('private', 'shared')),
  description_es text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  capacity integer NOT NULL DEFAULT 2,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  cover_image_url text,
  cover_image_key text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.room_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  url text NOT NULL,
  storage_key text,
  alt_es text,
  alt_en text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rooms_house_sort_idx
  ON public.rooms (house_id, sort_order);

CREATE INDEX IF NOT EXISTS room_images_room_sort_idx
  ON public.room_images (room_id, sort_order);

DROP TRIGGER IF EXISTS rooms_set_updated_at ON public.rooms;
CREATE TRIGGER rooms_set_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rooms_public_select ON public.rooms;
CREATE POLICY rooms_public_select
  ON public.rooms
  FOR SELECT
  TO anon, authenticated
  USING (
    published = true
    AND EXISTS (
      SELECT 1 FROM public.houses h
      WHERE h.id = rooms.house_id
        AND h.published = true
    )
  );

DROP POLICY IF EXISTS rooms_admin_all ON public.rooms;
CREATE POLICY rooms_admin_all
  ON public.rooms
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS room_images_public_select ON public.room_images;
CREATE POLICY room_images_public_select
  ON public.room_images
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.rooms r
      JOIN public.houses h ON h.id = r.house_id
      WHERE r.id = room_images.room_id
        AND r.published = true
        AND h.published = true
    )
  );

DROP POLICY IF EXISTS room_images_admin_all ON public.room_images;
CREATE POLICY room_images_admin_all
  ON public.room_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.rooms TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.rooms TO authenticated;

GRANT SELECT ON public.room_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.room_images TO authenticated;
