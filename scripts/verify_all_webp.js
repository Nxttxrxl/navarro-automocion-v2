
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllWebP() {
    console.log('🔍 Iniciando auditoría completa de WebP (todos los coches)...\n');

    // Fetch ALL cars
    const { data: cars, error } = await supabase
        .from('coches')
        .select('id, matricula, imagen');

    if (error) {
        console.error('Error fetching cars:', error);
        return;
    }

    console.log(`📋 Total coches encontrados: ${cars.length}`);

    let existsCount = 0;
    let missingCount = 0;
    const missingList = [];

    const baseUrl = 'https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/';

    // Process in batches to avoid network limits
    const BATCH_SIZE = 20;

    for (let i = 0; i < cars.length; i += BATCH_SIZE) {
        const batch = cars.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (car) => {
            if (!car.imagen) return { status: 'no_image', car };

            // Determine WebP URL
            let webpUrl;
            // If DB image name already ends in .webp, check that EXACT file
            if (car.imagen.toLowerCase().endsWith('.webp')) {
                // Handle full URL vs filename
                if (car.imagen.startsWith('http')) webpUrl = car.imagen;
                else webpUrl = `${baseUrl}${car.imagen}`;
            } else {
                // If it ends in png/jpg, replace extension with webp
                const cleanName = car.imagen.replace(/\.[^/.]+$/, "");
                const filenameWebp = `${cleanName}.webp`;

                if (car.imagen.startsWith('http')) {
                    // Complex if full url but unlikely for old import
                    webpUrl = car.imagen.replace(/\.[^/.]+$/, ".webp");
                } else {
                    webpUrl = `${baseUrl}${filenameWebp}`;
                }
            }

            try {
                const res = await fetch(webpUrl, { method: 'HEAD' });
                if (res.status === 200) return { status: 'ok', car };
                else return { status: 'missing', car, url: webpUrl };
            } catch (e) {
                return { status: 'error', car };
            }
        });

        const results = await Promise.all(promises);

        results.forEach(r => {
            if (r.status === 'ok') existsCount++;
            else {
                missingCount++;
                if (r.status === 'missing') missingList.push(`${r.car.id} (${r.car.matricula})`);
            }
        });

        process.stdout.write(`.`); // Progress dot
    }

    console.log('\n\n═══════════════════════════════════════');
    console.log(`✅ WebP existente: ${existsCount}`);
    console.log(`❌ WebP faltante:  ${missingCount}`);
    console.log('═══════════════════════════════════════');

    if (missingCount > 0) {
        console.log('\nLista de faltantes:');
        console.log(missingList.join('\n'));
    } else {
        console.log('\n🌟 ¡PERFECTO! Todos los coches tienen versión WebP.');
    }
}

checkAllWebP();
