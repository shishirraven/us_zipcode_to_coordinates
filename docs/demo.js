(function () {
  const statusEl = document.getElementById('status');
  const errorEl = document.getElementById('error');
  const resultEl = document.getElementById('result');
  const coordsText = document.getElementById('coordsText');
  const mapsLink = document.getElementById('mapsLink');
  const zipInput = document.getElementById('zipInput');
  const lookupBtn = document.getElementById('lookupBtn');

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => resolve(url);
      s.onerror = () => reject(new Error('Failed to load ' + url));
      document.head.appendChild(s);
    });
  }

  // Try local build first, then unpkg as fallback
  (async function init() {
    const local = '../dist/zip-coords-us.min.js';
    const cdn = 'https://unpkg.com/zip-coords-us/dist/zip-coords-us.min.js';
    try {
      await loadScript(local);
      statusEl.textContent = 'Library loaded from local dist/zip-coords-us.min.js';
    } catch (e1) {
      try {
        await loadScript(cdn);
        statusEl.textContent = 'Library loaded from CDN (unpkg)';
      } catch (e2) {
        statusEl.textContent = 'Library not available. Build the project to get a local bundle or ensure network access to CDN.';
        errorEl.hidden = false;
        errorEl.textContent = 'Could not load the library. Run `npx rollup -c` to produce `dist/zip-coords-us.min.js`, or enable network access to the CDN.';
        lookupBtn.disabled = true;
        return;
      }
    }
    // ready
    lookupBtn.disabled = false;
  })();

  function padZip(s) {
    s = String(s).trim();
    s = s.replace(/\D/g, '');
    if (!s) return '';
    return s.padStart(5, '0').slice(-5);
  }

  function showResult(lat, lng) {
    resultEl.hidden = false;
    coordsText.textContent = `Latitude: ${lat}, Longitude: ${lng}`;
    mapsLink.href = `https://www.google.com/maps?q=${encodeURIComponent(lat + ',' + lng)}`;
  }

  function showNotFound(zip) {
    resultEl.hidden = true;
    errorEl.hidden = false;
    errorEl.textContent = `No coordinates found for zip "${zip}".`;
  }

  lookupBtn.addEventListener('click', () => {
    errorEl.hidden = true;
    const raw = zipInput.value;
    const zip = padZip(raw);
    if (!zip || zip.length !== 5) {
      errorEl.hidden = false;
      errorEl.textContent = 'Please enter a valid 5-digit ZIP code.';
      return;
    }

    // Use UMD global if available
    const lib = window.ZipCoordsUS || (window.zipCoordsUs) || null;
    if (!lib || typeof lib.convert !== 'function') {
      errorEl.hidden = false;
      errorEl.textContent = 'Library not loaded or has unexpected shape.';
      return;
    }

    const coords = lib.convert(zip);
    if (!coords) {
      showNotFound(zip);
    } else {
      showResult(coords.latitude, coords.longitude);
    }
  });

  // allow Enter key
  zipInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') lookupBtn.click();
  });
})();
