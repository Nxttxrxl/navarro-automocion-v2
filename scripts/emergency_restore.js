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

async function emergencyRestore() {
    console.log("🚨 RESTAURACIÓN DE EMERGENCIA 🚨\n")

    // Load backup
    const backupPath = path.resolve(__dirname, 'current_inventory.json')
    if (!fs.existsSync(backupPath)) {
        console.error("❌ No se encontró el archivo de backup!")
        return
    }

    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
    console.log(`📦 Backup cargado: ${backup.length} coches\n`)

    // Clear current database
    console.log("🗑️  Limpiando base de datos actual...")
    await supabase.from('catalogo_web').delete().neq('id', 0)
    await supabase.from('coches').delete().neq('id', 0)
    console.log("   ✅ Limpieza completada\n")

    // Restore all cars
    console.log("📥 Restaurando coches...")
    let restored = 0
    let errors = 0

    for (const car of backup) {
        // Remove id and created_at to let DB generate new ones
        const { id, created_at, ...carData } = car

        const { error } = await supabase.from('coches').insert([carData])
        if (error) {
            console.error(`   ❌ Error restaurando ${car.marca} ${car.modelo}: ${error.message}`)
            errors++
        } else {
            restored++
            if (restored % 10 === 0) console.log(`   ... ${restored} coches restaurados`)
        }
    }

    console.log(`\n✅ Restauración completada: ${restored} coches, ${errors} errores\n`)

    // Rebuild catalog
    console.log("🔄 Reconstruyendo catálogo web...")
    const { data: allCars } = await supabase.from('coches').select('*')
    const visible = allCars.filter(c => c.imagen && c.imagen.length > 5)
    await supabase.from('catalogo_web').insert(visible)
    console.log(`   ✅ Catálogo actualizado: ${visible.length} coches visibles`)
}

emergencyRestore()
