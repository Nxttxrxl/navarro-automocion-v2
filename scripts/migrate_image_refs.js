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
 * Migration Script: Update image references in database
 * Converts full Supabase URLs to just filenames
 */
async function migrateImageReferences() {
    console.log('🔄 Starting image reference migration...\n');

    try {
        // 1. Fetch all cars
        const { data: cars, error: fetchError } = await supabase
            .from('coches')
            .select('*');

        if (fetchError) throw fetchError;

        console.log(`📊 Found ${cars.length} records to process\n`);

        let updatedCount = 0;
        let skippedCount = 0;
        const updates = [];

        // 2. Process each car
        for (const car of cars) {
            if (!car.imagen) {
                console.log(`⏭️  Skipping ${car.marca} ${car.modelo} (no image)`);
                skippedCount++;
                continue;
            }

            // Check if already migrated (no URL)
            if (!car.imagen.includes('http')) {
                console.log(`✅ Already migrated: ${car.marca} ${car.modelo}`);
                skippedCount++;
                continue;
            }

            // Extract filename from URL
            const filename = decodeURIComponent(car.imagen.split('/').pop());

            console.log(`🔧 ${car.marca} ${car.modelo}`);
            console.log(`   Old: ${car.imagen}`);
            console.log(`   New: ${filename}`);

            updates.push({
                id: car.id,
                oldImage: car.imagen,
                newImage: filename
            });

            // Update the record
            const { error: updateError } = await supabase
                .from('coches')
                .update({ imagen: filename })
                .eq('id', car.id);

            if (updateError) {
                console.error(`   ❌ Error updating: ${updateError.message}`);
            } else {
                console.log(`   ✅ Updated successfully`);
                updatedCount++;
            }
            console.log('');
        }

        // 3. Summary
        console.log('═══════════════════════════════════════');
        console.log('           MIGRATION SUMMARY');
        console.log('═══════════════════════════════════════');
        console.log(`✅ Updated: ${updatedCount}`);
        console.log(`⏭️  Skipped: ${skippedCount}`);
        console.log(`📝 Total: ${cars.length}`);
        console.log('═══════════════════════════════════════\n');

        // 4. Save migration log
        const logContent = JSON.stringify(updates, null, 2);
        const fs = await import('fs');
        fs.writeFileSync('migration_log.json', logContent);
        console.log('📄 Migration log saved to migration_log.json\n');

    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the migration
migrateImageReferences();
