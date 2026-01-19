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

async function listCarsWithoutImages() {
    console.log("📋 COCHES SIN FOTOS\n")

    const { data: cars } = await supabase.from('coches').select('*').order('marca', { ascending: true })

    const withoutImages = cars.filter(c => !c.imagen || c.imagen.length <= 5)

    console.log(`Total coches sin foto: ${withoutImages.length}\n`)

    withoutImages.forEach((car, index) => {
        console.log(`${index + 1}. ${car.marca} ${car.modelo} (${car.year})`)
        console.log(`   ID: ${car.id}`)
        console.log(`   Precio: ${car.precio ? car.precio.toLocaleString('es-ES') + '€' : 'N/A'}`)
        console.log(`   Imagen: "${car.imagen || 'vacío'}"`)
        console.log('')
    })
}

listCarsWithoutImages()
