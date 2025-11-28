# zip-coords-us

[![npm version](https://img.shields.io/npm/v/zip-coords-us.svg)](https://www.npmjs.com/package/zip-coords-us)
[![license](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A **super-efficient, lightweight, and lazy-loaded** JavaScript library for converting 5-digit US ZIP Codes (ZCTAs) to their central latitude and longitude coordinates.

The library is compatible with **Node.js** (via NPM) and **Vanilla JavaScript** (via CDN). It uses a pre-indexed JSON map for **O(1) lookup time**, ensuring near-instantaneous retrieval after the first load.

---

## ✨ Features

* **⚡ O(1) Lookup Speed:** Uses a JSON dictionary where the ZIP code is the key, allowing for instant access once the map is loaded.
* **😴 Lazy Loading:** The data map is only loaded from the file into memory when the `convert()` function is called for the **very first time**, minimizing application startup time and memory footprint.
* **📦 Dual Compatibility:** Works as a CommonJS module in Node.js and as a global variable script via CDN.
* **🗺️ ZCTA Based:** Coordinates are derived from U.S. Census Bureau **ZCTAs** (ZIP Code Tabulation Areas).

---

## ⬇️ Installation

### 1. For Node.js / Module Bundlers

Install via npm:

```bash
npm install zip-coords-us
```

### 2\. For Vanilla JavaScript / CDN

You can load the minified file directly in your HTML via a CDN (like Unpkg or jsDelivr), making the library available as the global variable **`ZipCoordsUS`**:

```html
<script src="https://unpkg.com/zip-coords-us/dist/zip-coords-us.min.js"></script>
```

-----

## 🚀 Usage

### 1\. Node.js / NPM Module

Require the package and destructure the `convert` function:

```javascript
// index.js (Node.js)

const { convert } = require('zip-coords-us');

// First call loads the data, subsequent calls are instant
const coords = convert('10001'); 
console.log(`ZIP 10001: Lat ${coords.latitude}, Lng ${coords.longitude}`);
```

### 2\. CDN / Vanilla JavaScript

After loading the script via CDN, the function is available globally under the variable name `ZipCoordsUS`.

```html
<script>
    // Access the convert method from the global variable
    const coords = ZipCoordsUS.convert(90210);

    if (coords) {
        console.log(`ZIP 90210: Lat ${coords.latitude}, Lng ${coords.longitude}`);
    } else {
        console.log("ZIP code not found.");
    }
</script>
```

-----

## 📚 API Reference

### `convert(zip_code)`

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `zip_code` | `string` or `number` | The 5-digit US ZIP code (will be padded with zeros if necessary, e.g., 601 becomes "00601"). |

| Returns | Type | Description |
| :--- | :--- | :--- |
| **Found** | `object` | `{ latitude: number, longitude: number }` |
| **Not Found** | `null` | Returns `null` if the ZIP code is not in the map. |

-----

## 🛠️ Data Source & Methodology

The underlying JSON data map (`us_zip_to_coords_map.json`) was generated from the **U.S. Census Bureau's ZCTA Gazetteer Files**.

If you wish to download the raw CSV file to update the library's data yourself, you can find the files at the official source page:

👉 **[Download the ZCTA Gazetteer File CSV/TXT (U.S. Census Bureau)](https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html)**

**Note on ZCTAs:** The Census Bureau uses **ZIP Code Tabulation Areas (ZCTAs)** for statistical mapping, which are approximations of the general boundaries of USPS ZIP Codes.

-----

## 🤝 Contributing & License

### Contributing

We welcome contributions\! Please feel free to submit issues or pull requests to improve the library or update the data.

### License

Distributed under the **ISC License**. Copyright (c) 2025 **Shishir Raven**.

---

# zip-coords-us

Small, fast ZIP → coordinates lookup library for U.S. 5-digit ZIP codes.

## Summary
- Source is an ES module (index.js) that exports:
  - default: { convert, ZipCodeConverter }
  - named: convert, ZipCodeConverter
- Rollup produces:
  - UMD browser bundle: `dist/zip-coords-us.min.js` (global: `ZipCoordsUS`)
  - CommonJS bundle: `dist/index.js` (for Node)

## Quick Build
1. Install dependencies:
   - npm install
2. Build with Rollup:
   - npx rollup -c
3. The UMD file will be at `dist/zip-coords-us.min.js`.

## Browser Usage (UMD global)
- Include the local UMD bundle:
  <script src="dist/zip-coords-us.min.js"></script>
- Use the global:
  - ZipCoordsUS.convert('90210') → { latitude, longitude } or null

Example:
```html
<script src="dist/zip-coords-us.min.js"></script>
<script>
  // after the script loads:
  const coords = ZipCoordsUS.convert('10001');
  console.log(coords);
</script>
```

## ES Module Usage (bundlers / modern apps)
- Import the named/default exports:
```js
import ZipCoordsUS, { convert, ZipCodeConverter } from 'path/to/index.js';
// or
import { convert } from './index.js';
```

## Node / CommonJS Usage
- Require the generated CJS build:
```js
const pkg = require('./dist/index.js');
const coords = pkg.convert('90210');
```

## API
- convert(zip: string|number) => { latitude: number, longitude: number } | null
  - Accepts a 5-digit ZIP (string or number). Returns null if not present.
- ZipCodeConverter class is exported for direct use if needed.

## Demo
- `demo.html` uses the local UMD bundle at `dist/zip-coords-us.min.js`.
- Recommended: run a local static server and open the demo in a browser:
  - Python: `python -m http.server 8000`
  - Or: `npx serve .`

## Demo for Node
A small Node.js demo script is included to test the CommonJS build (`dist/index.js`) from the command line.

- Build first (produces `dist/index.js`):
  - npx rollup -c

- Run the demo:
  - node demo_for_node.js

The script runs a few example lookups (10001, 90210, 00000) and prints coordinates and elapsed times. If `dist/index.js` is missing, the script will print a short hint to rebuild the project.

## Troubleshooting
- "module is not defined" in the browser:
  - Means the loaded bundle contains raw CommonJS runtime code (not a proper UMD/IIFE).
  - Fixes:
    1. Ensure `index.js` uses ES module exports (export default / export const ...). Do not leave `module.exports` in the source.
    2. In `rollup.config.js` make sure the plugin order is correct: `resolve()` must run before `commonjs()` so CJS dependencies are converted. Example:
       - resolve({ browser: true }), commonjs({ include: /node_modules/ })
    3. Rebuild: `npx rollup -c`.
- `ZipCoordsUS` missing on window/global:
  - Ensure Rollup UMD output has `name: 'ZipCoordsUS'` and that the entry exports an object (default or named) the bundler can map to the UMD global.
  - Confirm the built `dist/zip-coords-us.min.js` does not throw any runtime errors (open browser console).
- If the demo reports the library loaded but does not expose `convert()`:
  - Check your `index.js` exports (default should include convert) and rebuild.

## Notes
- The project bundles the ZIP data into the UMD build via `@rollup/plugin-json`; the first browser load may be slower as the data is initialized, subsequent lookups are O(1).
- If you publish to a CDN (unpkg), verify the published package contains the UMD bundle file at the expected path (e.g. `/dist/zip-coords-us.min.js`) and that it is the UMD build, not the raw CommonJS entry.

If you want, I can also add a short CI/build script or a sample package.json entry for the build command.

## 📢 Docs & Interactive Demo (GitHub Pages)

A ready-to-publish docs site is included in the `docs/` folder. It contains:
- index.html — project documentation and quick links
- demo.html — an interactive ZIP → coordinates demo

To publish on GitHub Pages:
1. Push this repository to GitHub.
2. In the repository Settings → Pages, select the branch (usually `main`) and the folder `docs/` as the source.
3. Save — GitHub will provide a URL (e.g. `https://<your-username>.github.io/<repo-name>/`).

Local preview:
- Open `docs/index.html` in a browser, or serve with a static server:
  - Python: `python -m http.server 8000` (run from repo root)
  - Node: `npx serve .`

Demo notes:
- The demo attempts to load the local UMD build at `dist/zip-coords-us.min.js`. If you haven't built the bundle yet, it falls back to the unpkg CDN.
- To produce a local UMD bundle: `npx rollup -c` (ensure `dist/zip-coords-us.min.js` exists).