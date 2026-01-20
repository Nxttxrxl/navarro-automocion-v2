
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWebP() {
    console.log('🔍 Verificando disponibilidad de WebP para coches antiguos...\n');

    // Fetch 5 random cars (likely old ones with low IDs)
    const { data: cars, error } = await supabase
        .from('coches')
        .select('id, matricula, imagen')
        .limit(5)
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching cars:', error);
        return;
    }

    for (const car of cars) {
        if (!car.imagen) continue;

        const pngUrl = `https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${car.imagen}`;
        // Construct WebP URL (assuming standard naming convention)
        const webpName = car.imagen.replace(/\.[^/.]+$/, "") + '.webp';
        const webpUrl = `https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${webpName}`;

        console.log(`🚗 Coche ID ${car.id} (${car.matricula})`);

        // Check PNG
        try {
            const resPng = await fetch(pngUrl, { method: 'HEAD' });
            console.log(`   PNG: ${resPng.status === 200 ? '✅ OK' : '❌ ' + resPng.status}`);
        } catch (e) { console.log('   PNG: Error de red'); }

        // Check WebP
        try {
            const resWebp = await fetch(webpUrl, { method: 'HEAD' });
            console.log(`   WebP: ${resWebp.status === 200 ? '✅ OK (Existe)' : '❌ ' + resWebp.status + ' (No encontrado)'}`);
        } catch (e) { console.log('   WebP: Error de red'); }

        console.log('');
    }
}

checkWebP();
