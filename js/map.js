(function () {
  'use strict';

  /* ===== Country → Coordinates Lookup ===== */
  var COORDS = {
    'Albania':                        [41.33, 19.82],
    'Angola':                         [-8.84, 13.23],
    'Argentina':                      [-34.60, -58.38],
    'Austria':                        [48.21, 16.37],
    'Azerbaijan':                     [40.41, 49.87],
    'Belgium':                        [50.85, 4.35],
    'Brazil':                         [-15.79, -47.88],
    'Bulgaria':                       [42.70, 23.32],
    'Cameroon':                       [3.87, 11.52],
    'Chile':                          [-33.45, -70.67],
    'China':                          [39.90, 116.40],
    'Colombia':                       [4.71, -74.07],
    'Congo (Brazzaville)':            [-4.27, 15.28],
    'Congo, Democratic Republic of the': [-4.32, 15.31],
    'Costa Rica':                     [9.93, -84.08],
    'Cuba':                           [23.11, -82.37],
    'Egypt':                          [30.04, 31.24],
    'Equatorial Guinea':              [3.75, 8.78],
    'Ethiopia':                       [9.02, 38.75],
    'France':                         [48.86, 2.35],
    'Germany':                        [52.52, 13.41],
    'Greece':                         [37.97, 23.73],
    'Grenada':                        [12.05, -61.75],
    'Honduras':                       [14.07, -87.19],
    'Hungary':                        [47.50, 19.04],
    'India':                          [28.61, 77.21],
    'Indonesia':                      [-6.21, 106.85],
    'Iran':                           [35.69, 51.39],
    'Italy':                          [41.90, 12.50],
    'Japan':                          [35.68, 139.69],
    'Madagascar':                     [-18.88, 47.51],
    'Mexico':                         [19.43, -99.13],
    'Mongolia':                       [47.91, 106.91],
    'Morocco':                        [33.97, -6.85],
    'Myanmar (Burma)':                [19.76, 96.07],
    'Netherlands':                    [52.37, 4.90],
    'Panama':                         [8.98, -79.52],
    'Peru':                           [-12.05, -77.04],
    'Poland':                         [52.23, 21.01],
    'Portugal':                       [38.72, -9.14],
    'Romania':                        [44.43, 26.10],
    'Russia':                         [55.76, 37.62],
    'Spain':                          [40.42, -3.70],
    'Sweden':                         [59.33, 18.07],
    'Turkey':                         [39.93, 32.86],
    'United Kingdom':                 [51.51, -0.13],
    'United States':                  [39.83, -98.58],
    'Venezuela':                      [10.49, -66.88],
    'Vietnam':                        [21.03, 105.85]
  };

  /* ===== Location Normalization ===== */
  var LOCATION_ALIASES = {
    'USA':        'United States',
    'UK':         'United Kingdom',
    'Texas':      'United States',
    'New Jersey': 'United States',
    'Persia':     'Iran'
  };

  /* ===== Period Colors ===== */
  var PERIOD_COLORS = {
    '18th Century or before': '#8B4513',
    '19th Century':           '#B8860B',
    '20th Century':           '#4682B4',
    '21st Century':           '#2C2C2C'
  };
  var NO_PERIOD_COLOR = '#999999';

  /* ===== Helpers ===== */
  function normalizeLocation(loc) {
    return LOCATION_ALIASES[loc] || loc;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function getDominantPeriod(periodCounts) {
    var best = null;
    var bestCount = 0;
    for (var p in periodCounts) {
      if (periodCounts[p] > bestCount) {
        bestCount = periodCounts[p];
        best = p;
      }
    }
    return best;
  }

  function getMarkerColor(dominantPeriod) {
    if (!dominantPeriod || dominantPeriod === 'none') return NO_PERIOD_COLOR;
    return PERIOD_COLORS[dominantPeriod] || NO_PERIOD_COLOR;
  }

  function getMarkerRadius(count) {
    if (count >= 50) return 22;
    if (count >= 20) return 16;
    if (count >= 10) return 12;
    if (count >= 5)  return 9;
    return 7;
  }

  /* ===== State ===== */
  var map;
  var markers = [];
  var countryData = {};  // { country: { count, docs, periods: { periodName: count } } }
  var activePeriods = new Set([
    '18th Century or before', '19th Century',
    '20th Century', '21st Century', 'none'
  ]);

  /* ===== Init ===== */
  function init() {
    map = L.map('map', {
      center: [30, 10],
      zoom: 2,
      minZoom: 2,
      maxZoom: 8,
      worldCopyJump: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    loadData();
    bindFilterControls();
    bindMobileToggle();
  }

  /* ===== Load & Process Data ===== */
  function loadData() {
    fetch('data/museum-data.json')
      .then(function (res) { return res.json(); })
      .then(function (items) {
        processData(items);
        renderMarkers();
        updateStats();
      })
      .catch(function (err) {
        console.error('Failed to load museum data:', err);
      });
  }

  function processData(items) {
    countryData = {};

    items.forEach(function (item) {
      var locations = item.location || [];
      var periods = item.period || [];

      // Handle "Morocco, France" — split into two locations
      var expandedLocations = [];
      locations.forEach(function (loc) {
        if (loc.indexOf(',') !== -1) {
          loc.split(',').forEach(function (part) {
            expandedLocations.push(part.trim());
          });
        } else {
          expandedLocations.push(loc);
        }
      });

      // Deduplicate after normalization
      var seen = {};
      expandedLocations.forEach(function (rawLoc) {
        var loc = normalizeLocation(rawLoc);
        if (seen[loc]) return;
        seen[loc] = true;

        if (!COORDS[loc]) return; // skip unknown locations

        if (!countryData[loc]) {
          countryData[loc] = { count: 0, periods: {}, docs: [] };
        }
        countryData[loc].count++;
        countryData[loc].docs.push(item);

        if (periods.length === 0) {
          countryData[loc].periods['none'] = (countryData[loc].periods['none'] || 0) + 1;
        } else {
          periods.forEach(function (p) {
            countryData[loc].periods[p] = (countryData[loc].periods[p] || 0) + 1;
          });
        }
      });
    });
  }

  /* ===== Render Markers ===== */
  function renderMarkers() {
    // Clear existing
    markers.forEach(function (m) { map.removeLayer(m); });
    markers = [];

    for (var country in countryData) {
      var data = countryData[country];
      var coords = COORDS[country];
      if (!coords) continue;

      // Filter: count documents matching active periods
      var visibleCount = 0;
      var visiblePeriods = {};
      for (var p in data.periods) {
        if (activePeriods.has(p)) {
          visibleCount += data.periods[p];
          visiblePeriods[p] = data.periods[p];
        }
      }

      if (visibleCount === 0) continue;

      var dominant = getDominantPeriod(visiblePeriods);
      var color = getMarkerColor(dominant);
      var radius = getMarkerRadius(visibleCount);

      var marker = L.circleMarker(coords, {
        radius: radius,
        fillColor: color,
        color: '#fff',
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.8
      });

      marker.bindPopup(buildPopup(country, visibleCount, visiblePeriods), {
        maxWidth: 280
      });

      marker.bindTooltip(country + ' (' + visibleCount + ')', {
        direction: 'top',
        offset: [0, -radius]
      });

      marker.addTo(map);
      markers.push(marker);
    }
  }

  /* ===== Build Popup HTML ===== */
  function buildPopup(country, count, periods) {
    var html = '<div class="map-popup">';
    html += '<div class="map-popup-title">' + escapeHtml(country) + '</div>';
    html += '<div class="map-popup-count">' + count + ' document' + (count !== 1 ? 's' : '') + '</div>';
    html += '<div class="map-popup-periods">';

    // Sort periods in chronological order
    var periodOrder = ['18th Century or before', '19th Century', '20th Century', '21st Century', 'none'];
    var periodLabels = {
      '18th Century or before': '18th Century or before',
      '19th Century': '19th Century',
      '20th Century': '20th Century',
      '21st Century': '21st Century',
      'none': 'No period listed'
    };

    periodOrder.forEach(function (p) {
      if (periods[p]) {
        var color = p === 'none' ? NO_PERIOD_COLOR : (PERIOD_COLORS[p] || NO_PERIOD_COLOR);
        html += '<div class="map-popup-period">';
        html += '<span class="color-swatch" style="background:' + color + '"></span>';
        html += periodLabels[p] + ': ' + periods[p];
        html += '</div>';
      }
    });

    html += '</div>';

    // Build gallery link — use the original location value for the filter
    var locationParam = encodeURIComponent(country);
    html += '<a href="gallery.html?location=' + locationParam + '" class="map-popup-link">Browse documents &rarr;</a>';

    html += '</div>';
    return html;
  }

  /* ===== Filter Controls ===== */
  function bindFilterControls() {
    var checkboxes = document.querySelectorAll('.map-filter-options input[type="checkbox"]');
    checkboxes.forEach(function (cb) {
      cb.addEventListener('change', function () {
        activePeriods.clear();
        checkboxes.forEach(function (c) {
          if (c.checked) activePeriods.add(c.value);
        });
        renderMarkers();
        updateStats();
      });
    });
  }

  /* ===== Stats ===== */
  function updateStats() {
    var totalCountries = 0;
    var totalDocs = 0;

    for (var country in countryData) {
      var data = countryData[country];
      var visibleCount = 0;
      for (var p in data.periods) {
        if (activePeriods.has(p)) visibleCount += data.periods[p];
      }
      if (visibleCount > 0) {
        totalCountries++;
        totalDocs += visibleCount;
      }
    }

    var el = document.getElementById('map-stats');
    el.textContent = totalCountries + ' countries, ' + totalDocs + ' documents';
  }

  /* ===== Mobile: Collapse Controls ===== */
  function bindMobileToggle() {
    var controls = document.querySelector('.map-controls');
    var heading = controls.querySelector('h3');
    heading.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        controls.classList.toggle('collapsed');
      }
    });
  }

  /* ===== Boot ===== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
