import zipCodeMap from './data/us_zip_to_coords_map.json';

/**
 * Super efficient ZIP Code to Coordinate Converter.
 * The data map is loaded statically when the module initializes.
 */
class ZipCodeConverter {
    
    /**
     * Converts a 5-digit ZIP code string/number to its coordinates.
     * @param {(string|number)} zip_code - The ZIP code (e.g., '90210' or 90210).
     * @returns {object|null} An object {latitude: number, longitude: number} or null if not found.
     */
    static convert(zip_code) {
        // Normalize the ZIP code input to a 5-digit string key
        const zipKey = String(zip_code).padStart(5, '0');

        // Perform O(1) lookup
        const coords = zipCodeMap[zipKey];

        if (coords && Array.isArray(coords) && coords.length === 2) {
            return {
                latitude: coords[0],
                longitude: coords[1]
            };
        } else {
            return null;
        }
    }
}

// Provide ES module exports (default + named) so Rollup's UMD output assigns the library to the global `ZipCoordsUS`.
export const convert = ZipCodeConverter.convert;
export { ZipCodeConverter };
export default {
    convert,
    ZipCodeConverter
};