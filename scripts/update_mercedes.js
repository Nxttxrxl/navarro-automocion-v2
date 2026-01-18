import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Update Mercedes E350 with correct data
 */
async function updateMercedesE350() {
    console.log('🔧 Updating Mercedes E350 record...\n');

    try {
        // Find the Mercedes E350
        const { data: cars, error: fetchError } = await supabase
            .from('coches')
            .select('*')
            .ilike('marca', '%MERCEDES%')
            .ilike('modelo', '%E350%');

        if (fetchError) throw fetchError;

        if (!cars || cars.length === 0) {
            console.log('⚠️  Mercedes E350 not found in database');
            console.log('Creating new record...\n');

            // Create new record
            const { data, error: insertError } = await supabase
                .from('coches')
                .insert([{
                    matricula: '1919KVD',
                    marca: 'MERCEDES',
                    modelo: 'E350 COUPE',
                    cv: 299,
                    motor: '2.0 EQ Boost',
                    year: 2019,
                    precio: 28500,
                    imagen: 'MERCEDES E350 COUPE 1919KVD.png'
                }])
                .select();

            if (insertError) throw insertError;

            console.log('✅ Mercedes E350 created successfully');
            console.log(JSON.stringify(data[0], null, 2));
            return;
        }

        console.log(`📊 Found ${cars.length} Mercedes E350 record(s)\n`);

        // Update each record
        for (const car of cars) {
            console.log(`Updating record ID: ${car.id}`);
            console.log(`Current data:`, car);

            const { data, error: updateError } = await supabase
                .from('coches')
                .update({
                    matricula: '1919KVD',
                    cv: 299,
                    motor: '2.0 EQ Boost',
                    year: 2019,
                    precio: car.precio || 28500,
                    imagen: 'MERCEDES E350 COUPE 1919KVD.png'
                })
                .eq('id', car.id)
                .select();

            if (updateError) throw updateError;

            console.log('\n✅ Updated successfully');
            console.log('New data:', data[0]);
            console.log('');
        }

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run the update
updateMercedesE350();
