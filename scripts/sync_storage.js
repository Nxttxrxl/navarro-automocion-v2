import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sanitizeFilename } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 * Sync local images to Supabase Storage
 */
async function syncStorage() {
    console.log('🚀 Starting storage synchronization...\n');

    const publicDir = path.join(__dirname, '..', 'public');
    const pngDir = path.join(publicDir, 'inventory_png');
    const webpDir = path.join(publicDir, 'inventory_webp');

    // Check directories exist
    if (!fs.existsSync(pngDir)) {
        console.error(`❌ Directory not found: ${pngDir}`);
        process.exit(1);
    }
    if (!fs.existsSync(webpDir)) {
        console.error(`❌ Directory not found: ${webpDir}`);
        process.exit(1);
    }

    const pngFiles = fs.readdirSync(pngDir).filter(f => f.endsWith('.png'));
    const webpFiles = fs.readdirSync(webpDir).filter(f => f.endsWith('.webp'));

    console.log(`📁 Found ${pngFiles.length} PNG files`);
    console.log(`📁 Found ${webpFiles.length} WebP files\n`);

    let uploadedPng = 0;
    let uploadedWebp = 0;
    let skippedPng = 0;
    let skippedWebp = 0;
    let errorCount = 0;

    // Upload PNG files
    console.log('📤 Uploading PNG files...\n');
    for (const file of pngFiles) {
        const filePath = path.join(pngDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        const sanitizedName = sanitizeFilename(file);

        console.log(`  📸 ${file}`);
        if (sanitizedName !== file) {
            console.log(`     Sanitized to: ${sanitizedName}`);
        }

        try {
            const { data, error } = await supabase.storage
                .from('coches')
                .upload(sanitizedName, fileBuffer, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (error) {
                if (error.message.includes('already exists')) {
                    console.log(`     ⏭️  Already exists (skipped)`);
                    skippedPng++;
                } else {
                    throw error;
                }
            } else {
                console.log(`     ✅ Uploaded successfully`);
                uploadedPng++;
            }
        } catch (error) {
            console.error(`     ❌ Error: ${error.message}`);
            errorCount++;
        }
        console.log('');
    }

    // Upload WebP files
    console.log('📤 Uploading WebP files...\n');
    for (const file of webpFiles) {
        const filePath = path.join(webpDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        const sanitizedName = sanitizeFilename(file);

        console.log(`  📸 ${file}`);
        if (sanitizedName !== file) {
            console.log(`     Sanitized to: ${sanitizedName}`);
        }

        try {
            const { data, error } = await supabase.storage
                .from('coches')
                .upload(sanitizedName, fileBuffer, {
                    contentType: 'image/webp',
                    upsert: true
                });

            if (error) {
                if (error.message.includes('already exists')) {
                    console.log(`     ⏭️  Already exists (skipped)`);
                    skippedWebp++;
                } else {
                    throw error;
                }
            } else {
                console.log(`     ✅ Uploaded successfully`);
                uploadedWebp++;
            }
        } catch (error) {
            console.error(`     ❌ Error: ${error.message}`);
            errorCount++;
        }
        console.log('');
    }

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('        SYNC SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`✅ PNG uploaded: ${uploadedPng}`);
    console.log(`✅ WebP uploaded: ${uploadedWebp}`);
    console.log(`⏭️  PNG skipped: ${skippedPng}`);
    console.log(`⏭️  WebP skipped: ${skippedWebp}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('═══════════════════════════════════════\n');
}

// Run the sync
syncStorage();
