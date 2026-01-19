/**
 * Generates SEO-friendly slug from car data
 * Format: marca-modelo-año-refID
 * Fallback: If year or model missing, use marca--refID
 * 
 * @param {Object} car - Car object from database
 * @returns {string} SEO-friendly slug
 */
export function generateSlug(car) {
    if (!car || !car.id) {
        throw new Error('Car object with ID is required');
    }

    // Clean and format text for URL
    const cleanText = (text) => {
        if (!text) return '';
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD') // Normalize accents
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    };

    const marca = cleanText(car.marca);
    const modelo = cleanText(car.modelo);
    const year = car.year ? cleanText(car.year) : '';
    const refId = `ref${car.id}`;

    // Build slug with fallback logic
    const parts = [marca, modelo, year].filter(Boolean);

    if (parts.length === 0) {
        // Fallback: only refID
        return refId;
    }

    return `${parts.join('-')}-${refId}`;
}

/**
 * Extracts numeric ID from slug
 * The ID is always after 'ref' prefix
 * 
 * @param {string} slug - URL slug (e.g., "audi-a3-2018-ref102")
 * @returns {number|null} Extracted ID or null if not found
 */
export function extractIdFromSlug(slug) {
    if (!slug) return null;

    // Match 'ref' followed by digits
    const match = slug.match(/ref(\d+)/);

    if (match && match[1]) {
        return parseInt(match[1], 10);
    }

    return null;
}
