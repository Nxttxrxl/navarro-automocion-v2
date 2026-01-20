
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCarDetails() {
    console.log('🔍 Buscando detalles del coche 4559HKV...\n');

    const { data: car, error } = await supabase
        .from('coches')
        .select('*')
        .eq('matricula', '4559HKV')
        .single();

    if (error) {
        console.error('Error fetching car:', error);
        return;
    }

    console.log('📋 Detalles del coche:');
    console.log(`   ID: ${car.id}`);
    console.log(`   Marca: ${car.marca}`);
    console.log(`   Modelo: ${car.modelo}`);
    console.log(`   Año: ${car.year}`);
    console.log(`   Imagen (DB): ${car.imagen}`);
    console.log(`   Created At: ${car.created_at || 'No fecha'}`);

    // Check if image is URL or filename
    const isUrl = car.imagen.startsWith('http');
    console.log(`   Tipo de imagen: ${isUrl ? 'URL Completa' : 'Filename relativo'}`);

    // Check HEAD of PNG and WebP
    const filename = car.imagen.split('/').pop(); // handle if it is a full url
    const baseUrl = 'https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/';

    // Construct URLs assuming it is stored in 'coches' bucket
    // Note: if car.imagen is full URL, this logic might need adjustment, but usually it's just filename.

    const possiblePng = isUrl ? car.imagen : `${baseUrl}${car.imagen}`;
    const possibleWebp = possiblePng.replace(/\.[^/.]+$/, "") + '.webp';

    console.log(`\n🔍 Verificando archivos:`);
    try {
        const res = await fetch(possiblePng, { method: 'HEAD' });
        console.log(`   PNG (${possiblePng}): ${res.status}`);
    } catch (e) { console.log('   PNG Error'); }

    try {
        const res = await fetch(possibleWebp, { method: 'HEAD' });
        console.log(`   WebP (${possibleWebp}): ${res.status}`);
    } catch (e) { console.log('   WebP Error'); }

}

checkCarDetails();
