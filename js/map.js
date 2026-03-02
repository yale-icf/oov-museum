(function () {
  'use strict';

  /* ===== GeoJSON name → canonical country key ===== */
  // Maps feature.properties.name values (from world.geojson) to our countryData keys
  var GEOJSON_NAME_MAP = {
    'USA':                                'United States',
    'Republic of Serbia':                 'Serbia',
    'England':                            'United Kingdom',
    'Republic of the Congo':              'Congo (Brazzaville)',
    'Democratic Republic of the Congo':   'Congo, Democratic Republic of the',
    'Myanmar':                            'Myanmar (Burma)',
    'Czech Republic':                     'Czechoslovakia'
  };

  /* ===== Museum data location aliases ===== */
  // Normalizes variant location names from the Excel data to canonical keys
  var LOCATION_ALIASES = {
    'USA':                          'United States',
    'UK':                           'United Kingdom',
    'Great Britain':                'United Kingdom',
    'Texas':                        'United States',
    'New Jersey':                   'United States',
    'Persia':                       'Iran',
    'Republic of the Congo':        'Congo (Brazzaville)',
    'Democratic Republic of Congo': 'Congo, Democratic Republic of the'
  };

  /* ===== Period Colors ===== */
  var PERIOD_COLORS = {
    '18th Century or before': '#8B4513',
    '19th Century':           '#B8860B',
    '20th Century':           '#4682B4',
    '21st Century':           '#2C2C2C'
  };
  var NO_PERIOD_COLOR = '#999999';

  var NO_DATA_STYLE = {
    fillColor:   '#d8d4cd',
    fillOpacity: 0.25,
    color:       '#bbb',
    weight:      0.5
  };

  /* ===== Helpers ===== */
  function normalizeLocation(loc) {
    return LOCATION_ALIASES[loc] || loc;
  }

  function getDataKey(geojsonName) {
    return GEOJSON_NAME_MAP[geojsonName] || geojsonName;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function getDominantPeriod(periodCounts) {
    var best = null, bestCount = 0;
    for (var p in periodCounts) {
      if (periodCounts[p] > bestCount) { bestCount = periodCounts[p]; best = p; }
    }
    return best;
  }

  function getMarkerColor(dominantPeriod) {
    if (!dominantPeriod || dominantPeriod === 'none') return NO_PERIOD_COLOR;
    return PERIOD_COLORS[dominantPeriod] || NO_PERIOD_COLOR;
  }

  function normalizePeriod(p) {
    if (!p) return null;
    if (PERIOD_COLORS[p]) return p;
    var pLow = p.toLowerCase().trim();
    var namedPeriods = {
      'american revolutionary period': '18th Century or before',
      'batavian republic period':      '18th Century or before',
      'meiji era':                     '19th Century'
    };
    if (namedPeriods[pLow]) return namedPeriods[pLow];
    if (/21st/i.test(p)) return '21st Century';
    if (/20th/i.test(p)) return '20th Century';
    if (/19th/i.test(p)) return '19th Century';
    if (/18th|17th|16th|15th|14th|13th/i.test(p)) return '18th Century or before';
    var m = p.match(/\b(1[0-9]{3}|2[0-9]{3})s?\b/);
    if (m) {
      var y = parseInt(m[1], 10);
      if (y >= 2000) return '21st Century';
      if (y >= 1900) return '20th Century';
      if (y >= 1800) return '19th Century';
      return '18th Century or before';
    }
    return null;
  }

  /* ===== State ===== */
  var map;
  var choroplethLayer = null;
  var countryLayers   = {};  // canonical key → Leaflet layer
  var countryData     = {};  // canonical key → { count, periods, docs }
  var worldGeojson    = null;
  var activePeriods   = new Set([
    '18th Century or before', '19th Century',
    '20th Century', '21st Century'
  ]);

  /* ===== Init ===== */
  function init() {
    map = L.map('map', {
      center: [30, 10],
      zoom:   2,
      minZoom: 2,
      maxZoom: 8,
      worldCopyJump: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains:  'abcd',
      maxZoom:     19
    }).addTo(map);

    loadData();
    bindFilterControls();
    bindMobileToggle();
  }

  /* ===== Load Data ===== */
  function loadData() {
    Promise.all([
      fetch('data/museum-data.json').then(function (r) { return r.json(); }),
      fetch('data/countries.geojson').then(function (r) { return r.json(); })
    ]).then(function (results) {
      worldGeojson = results[1];
      processData(results[0]);
      buildChoropleth();
      updateChoroplethStyles();
      updateStats();
    }).catch(function (err) {
      console.error('Failed to load data:', err);
    });
  }

  /* ===== Process Museum Data ===== */
  function processData(items) {
    countryData = {};

    items.forEach(function (item) {
      var locations = item.location || [];
      var periods   = item.period   || [];

      // Expand any comma/pipe-joined location strings into individual entries
      var expanded = [];
      locations.forEach(function (loc) {
        if (loc.indexOf(',') !== -1 || loc.indexOf('|') !== -1) {
          loc.split(/[,|]/).forEach(function (part) { expanded.push(part.trim()); });
        } else {
          expanded.push(loc);
        }
      });

      var seen = {};
      expanded.forEach(function (rawLoc) {
        var loc = normalizeLocation(rawLoc);
        if (!loc || seen[loc]) return;
        seen[loc] = true;

        if (!countryData[loc]) countryData[loc] = { count: 0, periods: {}, docs: [] };
        countryData[loc].count++;
        countryData[loc].docs.push(item);

        if (periods.length === 0) {
          countryData[loc].periods['none'] = (countryData[loc].periods['none'] || 0) + 1;
        } else {
          periods.forEach(function (p) {
            var norm = normalizePeriod(p) || 'none';
            countryData[loc].periods[norm] = (countryData[loc].periods[norm] || 0) + 1;
          });
        }
      });
    });
  }

  /* ===== Choropleth ===== */
  function buildChoropleth() {
    countryLayers = {};

    choroplethLayer = L.geoJSON(worldGeojson, {
      style: function () { return NO_DATA_STYLE; },

      onEachFeature: function (feature, layer) {
        var geojsonName = feature.properties.name;
        var dataKey     = getDataKey(geojsonName);
        countryLayers[dataKey] = layer;

        // Tooltip on hover
        layer.bindTooltip(function () {
          var data = countryData[dataKey];
          if (!data) return null;
          var visible = getVisibleCount(dataKey);
          if (visible === 0) return null;
          return '<strong>' + escapeHtml(dataKey) + '</strong><br>' +
                 visible + ' document' + (visible !== 1 ? 's' : '');
        }, { sticky: true });

        layer.on('mouseover', function () {
          if (countryData[dataKey] && getVisibleCount(dataKey) > 0) {
            layer.setStyle({ fillOpacity: 0.85, weight: 2, color: '#fff' });
            layer.bringToFront();
          }
        });

        layer.on('mouseout', function () {
          updateLayerStyle(dataKey, layer);
        });

        layer.on('click', function (e) {
          var visiblePeriods = getVisiblePeriods(dataKey);
          var visibleCount   = 0;
          for (var p in visiblePeriods) visibleCount += visiblePeriods[p];
          if (visibleCount === 0) return;
          L.popup({ maxWidth: 280 })
            .setLatLng(e.latlng)
            .setContent(buildPopup(dataKey, visibleCount, visiblePeriods))
            .openOn(map);
        });
      }
    }).addTo(map);
  }

  function getVisiblePeriods(dataKey) {
    var data = countryData[dataKey];
    if (!data) return {};
    var vp = {};
    for (var p in data.periods) {
      if (activePeriods.has(p)) vp[p] = data.periods[p];
    }
    return vp;
  }

  function getVisibleCount(dataKey) {
    var vp = getVisiblePeriods(dataKey);
    var n = 0;
    for (var p in vp) n += vp[p];
    return n;
  }

  function getCountryStyle(dataKey) {
    var vp    = getVisiblePeriods(dataKey);
    var count = 0;
    for (var p in vp) count += vp[p];
    if (count === 0) return NO_DATA_STYLE;

    var color = getMarkerColor(getDominantPeriod(vp));
    return { fillColor: color, fillOpacity: 0.6, color: '#fff', weight: 1 };
  }

  function updateLayerStyle(dataKey, layer) {
    layer.setStyle(getCountryStyle(dataKey));
  }

  function updateChoroplethStyles() {
    if (!choroplethLayer) return;
    choroplethLayer.eachLayer(function (layer) {
      var dataKey = getDataKey(layer.feature.properties.name);
      updateLayerStyle(dataKey, layer);
    });
  }

  /* ===== Build Popup HTML ===== */
  function buildPopup(country, count, periods) {
    var html = '<div class="map-popup">';
    html += '<div class="map-popup-title">' + escapeHtml(country) + '</div>';
    html += '<div class="map-popup-count">' + count + ' document' + (count !== 1 ? 's' : '') + '</div>';
    html += '<div class="map-popup-periods">';

    var periodOrder  = ['18th Century or before', '19th Century', '20th Century', '21st Century'];
    var periodLabels = {
      '18th Century or before': '18th Century or before',
      '19th Century':           '19th Century',
      '20th Century':           '20th Century',
      '21st Century':           '21st Century'
    };

    periodOrder.forEach(function (p) {
      if (periods[p]) {
        var color = PERIOD_COLORS[p] || NO_PERIOD_COLOR;
        html += '<div class="map-popup-period">' +
                '<span class="color-swatch" style="background:' + color + '"></span>' +
                periodLabels[p] + ': ' + periods[p] +
                '</div>';
      }
    });

    html += '</div>';
    html += '<a href="gallery.html?location=' + encodeURIComponent(country) +
            '" class="map-popup-link">Browse documents &rarr;</a>';
    html += '</div>';
    return html;
  }

  /* ===== Filter Controls ===== */
  function bindFilterControls() {
    var checkboxes = document.querySelectorAll('.map-filter-options input[type="checkbox"]');
    checkboxes.forEach(function (cb) {
      cb.addEventListener('change', function () {
        activePeriods.clear();
        checkboxes.forEach(function (c) { if (c.checked) activePeriods.add(c.value); });
        updateChoroplethStyles();
        updateStats();
      });
    });
  }

  /* ===== Stats ===== */
  function updateStats() {
    var totalCountries = 0, totalDocs = 0;
    for (var country in countryData) {
      var n = getVisibleCount(country);
      if (n > 0) { totalCountries++; totalDocs += n; }
    }
    document.getElementById('map-stats').textContent =
      totalCountries + ' countries, ' + totalDocs + ' documents';
  }

  /* ===== Mobile: Collapse Controls ===== */
  function bindMobileToggle() {
    var controls = document.querySelector('.map-controls');
    var heading  = controls.querySelector('h3');
    heading.addEventListener('click', function () {
      if (window.innerWidth <= 768) controls.classList.toggle('collapsed');
    });
  }

  /* ===== Boot ===== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
