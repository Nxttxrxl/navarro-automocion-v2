import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env.local')

if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath))
    for (const k in envConfig) {
        process.env[k] = envConfig[k]
    }
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

const WEBP_DIR = path.resolve(__dirname, '../../COPIA_SEGURIDAD_FOTOS/inventory_webp')
const PNG_DIR = path.resolve(__dirname, '../../COPIA_SEGURIDAD_FOTOS/inventory_png')

async function verifyAllPhotos() {
    console.log("📸 VERIFICACIÓN COMPLETA DE FOTOS\n")

    // 1. Local folders
    const localWebp = fs.existsSync(WEBP_DIR) ? fs.readdirSync(WEBP_DIR).filter(f => f.endsWith('.webp')) : []
    const localPng = fs.existsSync(PNG_DIR) ? fs.readdirSync(PNG_DIR).filter(f => f.endsWith('.png')) : []

    console.log("📂 CARPETAS LOCALES:")
    console.log(`   inventory_webp: ${localWebp.length} archivos`)
    console.log(`   inventory_png: ${localPng.length} archivos`)

    // 2. Storage
    const { data: storageFiles } = await supabase.storage.from('coches').list('', { limit: 1000 })
    const storageWebp = storageFiles.filter(f => f.name.endsWith('.webp'))
    const storagePng = storageFiles.filter(f => f.name.endsWith('.png'))

    console.log(`\n☁️  SUPABASE STORAGE:`)
    console.log(`   WebP: ${storageWebp.length} archivos`)
    console.log(`   PNG: ${storagePng.length} archivos`)
    console.log(`   Total: ${storageWebp.length + storagePng.length}`)

    // 3. Database
    const { data: allCars } = await supabase.from('coches').select('*').order('marca', { ascending: true })
    const withImages = allCars.filter(c => c.imagen && c.imagen.length > 5)
    const withoutImages = allCars.filter(c => !c.imagen || c.imagen.length <= 5)

    console.log(`\n💾 BASE DE DATOS:`)
    console.log(`   Total coches: ${allCars.length}`)
    console.log(`   Con imagen: ${withImages.length}`)
    console.log(`   Sin imagen: ${withoutImages.length}`)

    // 4. List cars without images
    console.log(`\n❌ COCHES SIN FOTO (${withoutImages.length}):\n`)
    withoutImages.forEach((car, index) => {
        console.log(`${index + 1}. ${car.marca} ${car.modelo} (${car.year})`)
        console.log(`   ID: ${car.id} | Precio: ${car.precio ? car.precio.toLocaleString('es-ES') + '€' : 'N/A'}`)
        console.log(`   Matrícula: ${car.matricula || 'N/A'}`)
        console.log('')
    })

    // 5. Check for orphaned images
    const linkedImages = new Set(withImages.map(c => c.imagen))
    const orphanedWebp = storageWebp.filter(f => !linkedImages.has(f.name))

    if (orphanedWebp.length > 0) {
        console.log(`\n⚠️  IMÁGENES HUÉRFANAS EN STORAGE (${orphanedWebp.length}):\n`)
        orphanedWebp.forEach(f => console.log(`   - ${f.name}`))
    }

    // 6. Summary
    console.log(`\n📊 RESUMEN:`)
    console.log(`   ✅ Pares locales completos: ${Math.min(localWebp.length, localPng.length)}`)
    console.log(`   ✅ Pares en Storage: ${Math.min(storageWebp.length, storagePng.length)}`)
    console.log(`   ✅ Coches vinculados en DB: ${withImages.length}`)
    console.log(`   🎯 Objetivo: 54 pares`)
    console.log(`   📉 Diferencia: ${54 - withImages.length}`)
}

verifyAllPhotos()
