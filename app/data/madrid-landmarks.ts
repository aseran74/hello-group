export type MadridLandmark = {
  id: string
  lat: number
  lng: number
  label_es: string
  label_en: string
}

/** Puntos de referencia en Madrid para distancias desde la propiedad */
export const MADRID_LANDMARKS: MadridLandmark[] = [
  {
    id: 'wanda',
    lat: 40.43619,
    lng: -3.59946,
    label_es: 'Wanda Metropolitano',
    label_en: 'Wanda Metropolitano',
  },
  {
    id: 'bernabeu',
    lat: 40.45306,
    lng: -3.68835,
    label_es: 'Santiago Bernabéu',
    label_en: 'Santiago Bernabéu',
  },
  {
    id: 'prado',
    lat: 40.41378,
    lng: -3.69213,
    label_es: 'Museo del Prado',
    label_en: 'Prado Museum',
  },
  {
    id: 'ifema',
    lat: 40.46755,
    lng: -3.61647,
    label_es: 'IFEMA',
    label_en: 'IFEMA',
  },
  {
    id: 'la-paz',
    lat: 40.48105,
    lng: -3.68655,
    label_es: 'Hospital La Paz',
    label_en: 'La Paz Hospital',
  },
  {
    id: 'sol',
    lat: 40.41694,
    lng: -3.70327,
    label_es: 'Puerta del Sol',
    label_en: 'Puerta del Sol',
  },
]

/** Centro aproximado de Madrid para decidir si mostrar distancias */
export const MADRID_CENTER = { lat: 40.4168, lng: -3.7038 }
export const MADRID_RADIUS_KM = 45
