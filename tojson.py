import csv
import json

def convert_csv_to_json_map(csv_filepath, json_filepath):
    """
    Reads a CSV file, converts it to a JSON map where the first column
    (ZIP/GEOID) is the key, and the subsequent columns (Lat/Long) are the value,
    and saves the result to a JSON file.
    """
    zip_to_coords_map = {}
    
    # Define the expected header names 
    ZIP_HEADER = 'GEOID'
    LAT_HEADER = 'INTPTLAT'
    LNG_HEADER = 'INTPTLONG'

    print(f"Starting conversion of '{csv_filepath}'...")

    try:
        # --- FIX APPLIED HERE: Use 'utf-8-sig' to handle the BOM character ---
        with open(csv_filepath, mode='r', newline='', encoding='utf-8-sig') as csvfile:
            reader = csv.DictReader(csvfile)
            
            # Check if required columns exist now that the BOM is handled
            if not all(h in reader.fieldnames for h in [ZIP_HEADER, LAT_HEADER, LNG_HEADER]):
                 raise ValueError(f"CSV missing required headers. Found: {reader.fieldnames}")

            # Iterate over each row in the CSV
            for row in reader:
                zip_code = row.get(ZIP_HEADER)
                
                # Retrieve coordinates and convert them to floats
                try:
                    latitude = float(row.get(LAT_HEADER))
                    longitude = float(row.get(LNG_HEADER))
                except (ValueError, TypeError):
                    print(f"Skipping row with invalid coordinates for ZIP: {zip_code}")
                    continue

                # Add to the dictionary, ensuring keys are 5-digit strings
                zip_to_coords_map[str(zip_code).zfill(5)] = [latitude, longitude]

        # Write the entire dictionary to a JSON file
        with open(json_filepath, mode='w', encoding='utf-8') as jsonfile:
            json.dump(zip_to_coords_map, jsonfile, indent=2)

        print(f"Conversion complete! Saved {len(zip_to_coords_map)} records to '{json_filepath}'.")

    except FileNotFoundError:
        print(f"Error: The file '{csv_filepath}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# --- Configuration ---
INPUT_CSV_FILE = 'zip_codes.csv' 
OUTPUT_JSON_FILE = 'us_zip_to_coords_map.json'

# --- Run the conversion ---
convert_csv_to_json_map(INPUT_CSV_FILE, OUTPUT_JSON_FILE)