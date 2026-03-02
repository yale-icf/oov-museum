(function () {
  'use strict';

  /* ===== Period metadata ===== */
  var PERIOD_META = {
    '18th Century or before': {
      color: '#8B4513',
      desc:  'The earliest financial innovations — trading companies, government debt, and the first stock exchanges'
    },
    '19th Century': {
      color: '#B8860B',
      desc:  'The age of industrialization — railways, colonial bonds, and the rise of global capital markets'
    },
    '20th Century': {
      color: '#4682B4',
      desc:  'Modern securities — corporations, central banks, wartime debt, and post-war reconstruction'
    },
    '21st Century': {
      color: '#2C2C2C',
      desc:  'Contemporary financial documents from the modern era'
    }
  };

  /* ===== Period normalization (same logic as map.js) ===== */
  function normalizePeriod(p) {
    if (!p) return null;
    if (PERIOD_META[p]) return p;
    var pLow = p.toLowerCase().trim();
    var named = {
      'american revolutionary period': '18th Century or before',
      'batavian republic period':      '18th Century or before',
      'meiji era':                     '19th Century'
    };
    if (named[pLow]) return named[pLow];
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

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ===== Init ===== */
  async function init() {
    const [filterRes, dataRes] = await Promise.all([
      fetch('data/filter-index.json'),
      fetch('data/museum-data.json')
    ]);
    const filterIndex = await filterRes.json();
    const items       = await dataRes.json();

    // Update subtitle with live stats
    var locationSet = new Set();
    items.forEach(function (item) {
      (item.location || []).forEach(function (l) { locationSet.add(l); });
    });
    var subtitle = document.getElementById('coll-subtitle');
    subtitle.textContent =
      items.length + ' historical financial documents from ' +
      locationSet.size + ' countries, spanning four centuries';

    buildPeriods(items);
    buildTypes(filterIndex);
    buildCountries(filterIndex, items);
    buildIndividuals(filterIndex);
  }

  /* ===== Period bands ===== */
  function buildPeriods(items) {
    // Count documents per canonical period
    var counts = {};
    Object.keys(PERIOD_META).forEach(function (p) { counts[p] = 0; });

    items.forEach(function (item) {
      (item.period || []).forEach(function (p) {
        var norm = normalizePeriod(p);
        if (norm) counts[norm] = (counts[norm] || 0) + 1;
      });
    });

    var container = document.getElementById('coll-periods');
    container.innerHTML = '';

    Object.keys(PERIOD_META).forEach(function (period) {
      var meta  = PERIOD_META[period];
      var count = counts[period] || 0;

      var a = document.createElement('a');
      a.className = 'coll-period-card';
      a.href      = 'gallery.html?period=' + encodeURIComponent(period);
      a.style.background = meta.color;

      a.innerHTML =
        '<div class="coll-period-count">' + count + '</div>' +
        '<div class="coll-period-label">' + escapeHtml(period) + '</div>' +
        '<div class="coll-period-desc">'  + escapeHtml(meta.desc)  + '</div>';

      container.appendChild(a);
    });
  }

  /* ===== Document type chips ===== */
  function buildTypes(filterIndex) {
    var container = document.getElementById('coll-types');
    container.innerHTML = '';

    // Group case variants (e.g. "bond" + "Bond" → one entry)
    var grouped = {};
    (filterIndex.type || []).forEach(function (entry) {
      var key = entry.value.toLowerCase();
      if (!grouped[key]) {
        grouped[key] = { display: entry.value, count: 0 };
      }
      grouped[key].count += entry.count;
      // Prefer Title Case display name
      if (/^[A-Z]/.test(entry.value)) {
        grouped[key].display = entry.value;
      }
    });

    var types = Object.values(grouped)
      .sort(function (a, b) { return b.count - a.count; })
      .slice(0, 20);

    types.forEach(function (t) {
      var a = document.createElement('a');
      a.className = 'coll-type-chip';
      a.href      = 'gallery.html?type=' + encodeURIComponent(t.display);
      a.innerHTML =
        '<span class="coll-type-name">' + escapeHtml(t.display) + '</span>' +
        '<span class="coll-type-count">' + t.count + '</span>';
      container.appendChild(a);
    });
  }

  /* ===== Country grid ===== */
  function buildCountries(filterIndex, items) {
    var container = document.getElementById('coll-countries');
    container.innerHTML = '';

    // Top 12 single-country entries
    var topCountries = (filterIndex.location || [])
      .filter(function (e) { return !e.value.includes('|') && !e.value.includes(','); })
      .slice(0, 12);

    // Thumbnail lookup: country → first item id
    var thumbMap = {};
    items.forEach(function (item) {
      (item.location || []).forEach(function (loc) {
        if (!thumbMap[loc]) thumbMap[loc] = item.id;
      });
    });

    topCountries.forEach(function (entry) {
      var thumbId = thumbMap[entry.value] || '';

      var a = document.createElement('a');
      a.className = 'country-card';
      a.href      = 'gallery.html?location=' + encodeURIComponent(entry.value);

      a.innerHTML =
        '<div class="country-card-image">' +
          (thumbId
            ? '<img src="thumbnails/' + thumbId + '.jpg" alt="' + escapeHtml(entry.value) + '" loading="lazy">'
            : '') +
        '</div>' +
        '<div class="country-card-overlay">' +
          '<h3 class="country-card-name">' + escapeHtml(entry.value) + '</h3>' +
          '<span class="country-card-count">' + entry.count + ' documents</span>' +
        '</div>';

      container.appendChild(a);
    });
  }

  /* ===== Named individuals ===== */
  function buildIndividuals(filterIndex) {
    var container = document.getElementById('coll-individuals');
    container.innerHTML = '';

    (filterIndex.namedIndividuals || []).forEach(function (entry) {
      var a = document.createElement('a');
      a.className = 'coll-individual-chip';
      a.href      = 'gallery.html?namedIndividuals=' + encodeURIComponent(entry.value);
      a.innerHTML =
        '<span class="coll-individual-name">' + escapeHtml(entry.value) + '</span>' +
        '<span class="coll-individual-count">' + entry.count + '</span>';
      container.appendChild(a);
    });
  }

  /* ===== Search form ===== */
  document.getElementById('coll-search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var q = document.getElementById('coll-search-input').value.trim();
    if (q) window.location.href = 'gallery.html?q=' + encodeURIComponent(q);
  });

  init().catch(function (err) {
    console.error('Failed to load collection data:', err);
  });
})();
