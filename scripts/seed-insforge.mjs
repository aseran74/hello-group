import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createAdminClient } from '@insforge/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const baseUrl = process.env.INSFORGE_URL || 'https://jgvmm275.eu-central.insforge.app'
const apiKey = process.env.INSFORGE_API_KEY

if (!apiKey) {
  console.error('Missing INSFORGE_API_KEY')
  process.exit(1)
}

const admin = createAdminClient({ baseUrl, apiKey })
const houses = JSON.parse(readFileSync(join(__dirname, 'seed-houses.json'), 'utf8'))
const images = JSON.parse(readFileSync(join(__dirname, 'seed-house-images.json'), 'utf8'))

const { data: houseData, error: houseError } = await admin.database
  .from('houses')
  .upsert(houses, { onConflict: 'id' })
  .select('id, slug')

if (houseError) {
  console.error('houses upsert failed', houseError)
  process.exit(1)
}

const { data: imageData, error: imageError } = await admin.database
  .from('house_images')
  .upsert(images, { onConflict: 'id' })
  .select('id')

if (imageError) {
  console.error('house_images upsert failed', imageError)
  process.exit(1)
}

console.log(JSON.stringify({
  houses: houseData?.length ?? 0,
  images: imageData?.length ?? 0,
}, null, 2))
