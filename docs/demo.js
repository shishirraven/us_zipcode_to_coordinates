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

  // Load from CDN only
  (async function init() {
    const cdn = 'https://unpkg.com/zip-coords-us/dist/zip-coords-us.min.js';
    statusEl.textContent = 'Loading library from CDN…';
    try {
      await loadScript(cdn);
      statusEl.textContent = 'Library loaded from CDN (unpkg)';
      lookupBtn.disabled = false;
    } catch (err) {
      statusEl.textContent = 'Library failed to load from CDN.';
      errorEl.hidden = false;
      errorEl.textContent = 'Could not load library from CDN. Check network or use a local build if offline.';
      lookupBtn.disabled = true;
      console.error(err);
      return;
    }
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

    const lib = window.ZipCoordsUS || window.zipCoordsUs || null;
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
