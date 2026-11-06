-- Hello Group: global FAQ / quick replies

CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_es text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  message_es text NOT NULL DEFAULT '',
  message_en text NOT NULL DEFAULT '',
  shortcuts text[] NOT NULL DEFAULT '{}'::text[],
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS faqs_published_sort_idx
  ON public.faqs (published, sort_order);

DROP TRIGGER IF EXISTS faqs_set_updated_at ON public.faqs;
CREATE TRIGGER faqs_set_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS faqs_public_select ON public.faqs;
CREATE POLICY faqs_public_select
  ON public.faqs
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS faqs_admin_all ON public.faqs;
CREATE POLICY faqs_admin_all
  ON public.faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.faqs TO authenticated;

INSERT INTO public.faqs (slug, title_es, title_en, message_es, message_en, shortcuts, sort_order, published)
VALUES
  (
    'horario',
    'Horarios de entrada y salida',
    'Check-in and check-out times',
    '¡Hola! El check-in es a partir de las 15:00 h y el check-out antes de las 11:00 h.',
    'Hi! Check-in is from 3:00 pm and check-out is before 11:00 am.',
    ARRAY['/horario'],
    10,
    true
  ),
  (
    'earlylate',
    'Entrada anticipada o salida tardía',
    'Early check-in or late check-out',
    'Depende de la ocupación del día. Si no hay otra reserva saliendo o entrando, intentamos facilitarlo encantados. Escríbenos el día anterior y te lo confirmamos sin problema. 👍',
    'It depends on that day’s occupancy. If there is no other booking checking out or in, we are happy to try to arrange it. Message us the day before and we will confirm.',
    ARRAY['/earlylate', 'entrada anticipada', 'cuando hay que salir'],
    20,
    true
  ),
  (
    'acceso',
    'Acceso y entrega de llaves',
    'Access and key handover',
    'El acceso es 100% autónomo con cerradura inteligente. El mismo día de tu llegada recibirás por e-mail tu código personal y las instrucciones para abrir.',
    'Access is fully self check-in with a smart lock. On the day of arrival you will receive your personal code and opening instructions by email.',
    ARRAY['/acceso', 'cuando podemos entrar'],
    30,
    true
  ),
  (
    'maletas',
    'Consigna de equipaje',
    'Luggage storage',
    'Lo sentimos pero no disponemos de consigna privada en el edificio.',
    'Sorry, we do not have private luggage storage in the building.',
    ARRAY['/maletas'],
    40,
    true
  ),
  (
    'parking',
    'Aparcamiento',
    'Parking',
    'Lo sentimos pero no disponemos de parking si bien la zona es libre de parquímetros del ayuntamiento y no se necesita por tanto pagar tickets por horas para aparcar.',
    'Sorry, we do not have private parking. The area is free of municipal parking meters, so you do not need to pay hourly tickets to park.',
    ARRAY['/parking', 'garaje'],
    50,
    true
  ),
  (
    'transporte',
    'Cómo llegar en transporte público',
    'Getting here by public transport',
    E'En Metro, la parada más cercana es San Lorenzo que está a unos 200 metros de distancia, es la línea 4. A su vez, estamos a solo una parada de Mar de Cristal, línea 8, que enlaza muy bien tanto con el aeropuerto Madrid Barajas así como con el intercambiador de transportes de Nuevos Ministerios, donde poder enlazar con la línea 10 que va directamente al centro de Madrid o a la estación de tren de Chamartín.\nEn el 2027, enlazará en Mar de Cristal con la nueva línea que se está terminando de construir y se llamará Diagonal e irá en transversal a la ciudad hasta el sureste de Madrid.\nEn autobús, están cerca las paradas de las líneas de autobús 72, 87 y de madrugada el N2 desde Cibeles.',
    E'The nearest Metro stop is San Lorenzo, about 200 metres away on line 4. We are also just one stop from Mar de Cristal on line 8, which connects well to Madrid-Barajas Airport and to Nuevos Ministerios, where you can transfer to line 10 for central Madrid or Chamartín train station.\nIn 2027, Mar de Cristal will also connect with the new Diagonal line currently under construction, running across the city toward south-east Madrid.\nBy bus, nearby lines include 72, 87 and the night bus N2 from Cibeles.',
    ARRAY['/transporte', 'metro'],
    60,
    true
  ),
  (
    'wifi',
    'Conexión Wi-Fi',
    'Wi-Fi connection',
    'Tenemos red Wi-Fi gratuita y en la entrada a los apartamentos tenéis carteles con los nombres de Usuario y Contraseña.',
    'We have free Wi-Fi. At the apartment entrance you will find signs with the username and password.',
    ARRAY['/wifi', 'internet'],
    70,
    true
  ),
  (
    'clima',
    'Climatización (Frío / Calor)',
    'Heating and air conditioning',
    'Sí, cada habitación cuenta con aire acondicionado y calefacción individualizada.',
    'Yes, each room has individual air conditioning and heating.',
    ARRAY['/clima', 'frio', 'calor'],
    80,
    true
  ),
  (
    'cocina',
    'Menaje y cocina',
    'Kitchen and utensils',
    'La cocina está totalmente equipada: nevera, microondas, cafetera [tipo de cápsulas], tostadora, vajilla completa.',
    'The kitchen is fully equipped: fridge, microwave, coffee machine [capsule type], toaster and full crockery set.',
    ARRAY['/cocina', 'utensilios'],
    90,
    true
  ),
  (
    'lavadora',
    'Lavadora, plancha y secador',
    'Washing machine, iron and hair dryer',
    'Sí, dispones de lavadora y secador de pelo. ¡No hace falta que cargues con nada de eso en la maleta!',
    'Yes, there is a washing machine and a hair dryer. No need to pack those!',
    ARRAY['/lavadora', 'secador de pelo'],
    100,
    true
  ),
  (
    'toallas',
    'Ropa de cama y toallas',
    'Bed linen and towels',
    '¡Por supuesto! Incluimos un juego de sábanas limpias y toallas de baño por huésped, además de gel de ducha, champú y papel higiénico.',
    'Of course! We include a set of clean sheets and bath towels per guest, plus shower gel, shampoo and toilet paper.',
    ARRAY['/toallas', 'gel'],
    110,
    true
  ),
  (
    'ascensor',
    'Ascensor y accesibilidad',
    'Lift and accessibility',
    'Lo sentimos pero el edificio no dispone de ascensor.',
    'Sorry, the building does not have a lift.',
    ARRAY['/ascensor'],
    120,
    true
  ),
  (
    'mascotas',
    'Política de mascotas',
    'Pet policy',
    '¡Las mascotas son bienvenidas! Tienen un suplemento de 5€ por día.',
    'Pets are welcome! There is a €5 per day surcharge.',
    ARRAY['/mascotas', 'animales', 'animal', 'perro', 'gato'],
    130,
    true
  ),
  (
    'cuna',
    'Cuna y viaje con bebés',
    'Travel cot and babies',
    '¡Sí! Disponemos de cuna de viaje bajo petición. Por favor, es muy importante nos confirme si la necesitas para dejártela montada y preparada antes de tu llegada.',
    'Yes! We can provide a travel cot on request. Please confirm if you need one so we can set it up before your arrival.',
    ARRAY['/cuna', 'bebé'],
    140,
    true
  ),
  (
    'registro',
    'Registro de viajeros (Check-in online)',
    'Traveller registration (online check-in)',
    'Por normativa legal de las autoridades, todos los huéspedes mayores de edad deben completar el registro previo con su DNI/pasaporte en este enlace: [Enlace Check-in]. ¡Se hace en 1 minuto!',
    'By legal requirement, all adult guests must complete pre-registration with their ID/passport using this link: [Check-in link]. It takes about one minute!',
    ARRAY['/registro'],
    150,
    true
  ),
  (
    'fumadores',
    'Fumadores',
    'Smoking policy',
    'Está prohibido fumar dentro de los apartamentos si bien, algunos de ellos tienen terraza al exterior donde se pudiera fumar.',
    'Smoking is not allowed inside the apartments. Some have an outdoor terrace where smoking may be possible.',
    ARRAY['/fumadores', 'fumar'],
    160,
    true
  )
ON CONFLICT (slug) DO NOTHING;
