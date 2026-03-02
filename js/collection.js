(function () {
  'use strict';

  const PAGE_SIZE = 12;
  const PERIOD_ORDER = ['18th Century or before', '19th Century', '20th Century', '21st Century'];

  // ===== State =====
  let allItems = [];
  let activeFilters = {
    type: new Set(),
    period: new Set(),
    location: new Set(),
    namedIndividuals: new Set()
  };
  let searchQuery = '';
  let sortBy = 'default';
  let currentPage = 1;
  let openDropdown = null;

  // ===== Period normalization =====
  function normalizePeriod(p) {
    if (!p) return null;
    if (PERIOD_ORDER.includes(p)) return p;
    const pLow = p.toLowerCase().trim();
    const named = {
      'american revolutionary period': '18th Century or before',
      'batavian republic period':      '18th Century or before',
      'meiji era':                     '19th Century'
    };
    if (named[pLow]) return named[pLow];
    if (/21st/i.test(p)) return '21st Century';
    if (/20th/i.test(p)) return '20th Century';
    if (/19th/i.test(p)) return '19th Century';
    if (/18th|17th|16th|15th|14th|13th/i.test(p)) return '18th Century or before';
    const m = p.match(/\b(1[0-9]{3}|2[0-9]{3})s?\b/);
    if (m) {
      const y = parseInt(m[1], 10);
      if (y >= 2000) return '21st Century';
      if (y >= 1900) return '20th Century';
      if (y >= 1800) return '19th Century';
      return '18th Century or before';
    }
    return null;
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== Init =====
  async function init() {
    readUrlState();

    const [fiRes, dataRes] = await Promise.all([
      fetch('data/filter-index.json'),
      fetch('data/museum-data.json')
    ]);
    const filterIndex = await fiRes.json();
    allItems = await dataRes.json();

    buildDropdowns(filterIndex);

    const searchInput = document.getElementById('coll-search-input');
    if (searchQuery) searchInput.value = searchQuery;

    const sortEl = document.getElementById('coll-sort');
    if (sortBy !== 'default') sortEl.value = sortBy;

    wireEvents();
    render();
  }

  // ===== URL state =====
  function readUrlState() {
    const params = new URLSearchParams(window.location.search);
    searchQuery = params.get('q') || '';
    sortBy = params.get('sort') || 'default';
    currentPage = parseInt(params.get('page') || '1', 10);
    activeFilters = {
      type: new Set(params.getAll('type')),
      period: new Set(params.getAll('period')),
      location: new Set(params.getAll('location')),
      namedIndividuals: new Set(params.getAll('namedIndividuals'))
    };
  }

  function pushUrlState() {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (sortBy !== 'default') params.set('sort', sortBy);
    for (const [key, set] of Object.entries(activeFilters)) {
      set.forEach(v => params.append(key, v));
    }
    const qs = params.toString();
    history.replaceState(null, '', qs ? '?' + qs : window.location.pathname);
  }

  // ===== Build dropdowns =====
  function buildDropdowns(filterIndex) {
    buildTypeDropdown(filterIndex);
    buildPeriodDropdown();
    buildLocationDropdown(filterIndex);
    buildIndividualsDropdown(filterIndex);
  }

  function buildCheckboxList(elId, items, filterKey) {
    const el = document.getElementById(elId);
    el.innerHTML = items.map(item =>
      `<label class="coll-dd-option">
        <input type="checkbox" value="${escapeHtml(item.value)}"
               ${activeFilters[filterKey].has(item.value) ? 'checked' : ''}>
        <span class="coll-dd-label">${escapeHtml(item.value)}</span>
        <span class="coll-dd-count">${item.count}</span>
      </label>`
    ).join('');
    el.querySelectorAll('input').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) activeFilters[filterKey].add(cb.value);
        else activeFilters[filterKey].delete(cb.value);
        currentPage = 1;
        render();
        pushUrlState();
      });
    });
  }

  function buildTypeDropdown(filterIndex) {
    // Group case variants (e.g. "bond" + "Bond" → one entry)
    const grouped = {};
    (filterIndex.type || []).forEach(entry => {
      const key = entry.value.toLowerCase();
      if (!grouped[key]) grouped[key] = { value: entry.value, count: 0 };
      grouped[key].count += entry.count;
      if (/^[A-Z]/.test(entry.value)) grouped[key].value = entry.value;
    });
    const items = Object.values(grouped).sort((a, b) => b.count - a.count);
    buildCheckboxList('dropdown-type', items, 'type');
  }

  function buildPeriodDropdown() {
    // Count per canonical period from allItems
    const counts = {};
    PERIOD_ORDER.forEach(p => { counts[p] = 0; });
    allItems.forEach(item => {
      (item.period || []).forEach(p => {
        const norm = normalizePeriod(p);
        if (norm) counts[norm]++;
      });
    });
    const items = PERIOD_ORDER.map(p => ({ value: p, count: counts[p] || 0 }));
    buildCheckboxList('dropdown-period', items, 'period');
  }

  function buildLocationDropdown(filterIndex) {
    const locs = (filterIndex.location || [])
      .filter(e => !e.value.includes('|') && !e.value.includes(','))
      .sort((a, b) => b.count - a.count);
    buildCheckboxList('dropdown-location', locs, 'location');
  }

  function buildIndividualsDropdown(filterIndex) {
    const indivs = (filterIndex.namedIndividuals || [])
      .sort((a, b) => b.count - a.count);
    buildCheckboxList('dropdown-namedIndividuals', indivs, 'namedIndividuals');
  }

  // ===== Wire events =====
  function wireEvents() {
    // Filter button toggles
    document.querySelectorAll('.coll-filter-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const key = btn.dataset.filter;
        const panel = document.getElementById('dropdown-' + key);

        if (openDropdown && openDropdown !== panel) {
          openDropdown.classList.remove('open');
          document.querySelectorAll('.coll-filter-btn').forEach(b => b.classList.remove('active'));
        }

        const isOpen = panel.classList.toggle('open');
        btn.classList.toggle('active', isOpen);
        openDropdown = isOpen ? panel : null;
      });
    });

    // Close on outside click
    document.addEventListener('click', () => {
      if (openDropdown) {
        openDropdown.classList.remove('open');
        document.querySelectorAll('.coll-filter-btn').forEach(b => b.classList.remove('active'));
        openDropdown = null;
      }
    });

    document.getElementById('coll-filter-bar').addEventListener('click', e => {
      e.stopPropagation();
    });

    // Search
    document.getElementById('coll-search-form').addEventListener('submit', e => {
      e.preventDefault();
      searchQuery = document.getElementById('coll-search-input').value.trim();
      currentPage = 1;
      render();
      pushUrlState();
    });

    // Sort
    document.getElementById('coll-sort').addEventListener('change', e => {
      sortBy = e.target.value;
      currentPage = 1;
      render();
      pushUrlState();
    });

    // Clear all
    document.getElementById('coll-clear-btn').addEventListener('click', () => {
      activeFilters = {
        type: new Set(),
        period: new Set(),
        location: new Set(),
        namedIndividuals: new Set()
      };
      searchQuery = '';
      document.getElementById('coll-search-input').value = '';
      currentPage = 1;
      document.querySelectorAll('.coll-dropdown input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
      });
      render();
      pushUrlState();
    });
  }

  // ===== Filter + sort =====
  function getFilteredItems() {
    let items = allItems;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => {
        const t = (item.title || '').toLowerCase();
        const d = (item.description || '').toLowerCase();
        const k = (item.keywords || []).join(' ').toLowerCase();
        return t.includes(q) || d.includes(q) || k.includes(q);
      });
    }

    if (activeFilters.type.size > 0) {
      const typeLow = new Set([...activeFilters.type].map(t => t.toLowerCase()));
      items = items.filter(item =>
        (item.type || []).some(t => typeLow.has(t.toLowerCase()))
      );
    }

    if (activeFilters.period.size > 0) {
      items = items.filter(item =>
        (item.period || []).some(p => activeFilters.period.has(normalizePeriod(p)))
      );
    }

    if (activeFilters.location.size > 0) {
      items = items.filter(item =>
        (item.location || []).some(l => activeFilters.location.has(l))
      );
    }

    if (activeFilters.namedIndividuals.size > 0) {
      items = items.filter(item =>
        (item.namedIndividuals || []).some(n => activeFilters.namedIndividuals.has(n))
      );
    }

    return items;
  }

  function sortItems(items) {
    if (sortBy === 'title') {
      return [...items].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }
    if (sortBy === 'period-asc') {
      return [...items].sort((a, b) => {
        const aP = PERIOD_ORDER.indexOf(normalizePeriod((a.period || [])[0]));
        const bP = PERIOD_ORDER.indexOf(normalizePeriod((b.period || [])[0]));
        return (aP < 0 ? 99 : aP) - (bP < 0 ? 99 : bP);
      });
    }
    if (sortBy === 'period-desc') {
      return [...items].sort((a, b) => {
        const aP = PERIOD_ORDER.indexOf(normalizePeriod((a.period || [])[0]));
        const bP = PERIOD_ORDER.indexOf(normalizePeriod((b.period || [])[0]));
        return (bP < 0 ? -1 : bP) - (aP < 0 ? -1 : aP);
      });
    }
    return items;
  }

  // ===== Render =====
  function render() {
    const filtered = getFilteredItems();
    const sorted = sortItems(filtered);
    const total = sorted.length;
    const pageItems = sorted.slice(0, PAGE_SIZE);

    const isUnfiltered = !searchQuery &&
      Object.values(activeFilters).every(s => s.size === 0);

    renderTagline(total, isUnfiltered);
    renderGrid(pageItems, total);
    updateChips();
  }

  function renderTagline(total, isUnfiltered) {
    const el = document.getElementById('coll-tagline');
    el.textContent = isUnfiltered
      ? 'Showing ' + Math.min(total, PAGE_SIZE) + ' of ' + total + ' items'
      : total + ' result' + (total !== 1 ? 's' : '');
  }

  function renderGrid(items, total) {
    const grid = document.getElementById('coll-grid');
    const pagination = document.getElementById('coll-pagination');

    if (items.length === 0) {
      grid.innerHTML = '<div class="coll-empty"><p>No items match your search.</p></div>';
      pagination.innerHTML = '';
      return;
    }

    grid.innerHTML = items.map(item => {
      const title = escapeHtml(item.title || 'Untitled');
      const period = item.period && item.period.length ? escapeHtml(item.period[0]) : '';
      const location = item.location && item.location.length ? escapeHtml(item.location[0]) : '';
      const meta = [period, location].filter(Boolean).join(' &middot; ');
      return `<a class="coll-card" href="viewer.html?id=${encodeURIComponent(item.id)}">
        <div class="coll-card-img">
          <img src="thumbnails/${item.id}.jpg" alt="${title}" loading="lazy"
               onerror="this.parentElement.classList.add('no-img')">
        </div>
        <div class="coll-card-body">
          <p class="coll-card-title">${title}</p>
          ${meta ? `<p class="coll-card-meta">${meta}</p>` : ''}
        </div>
      </a>`;
    }).join('');

    // "View all in Gallery" link when results exceed the preview cap
    if (total > PAGE_SIZE) {
      const params = buildGalleryParams();
      pagination.innerHTML =
        `<a class="coll-view-all" href="gallery.html${params}">
          View all ${total} results in the Gallery &rarr;
        </a>`;
    } else {
      pagination.innerHTML = '';
    }
  }

  function buildGalleryParams() {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    for (const [key, set] of Object.entries(activeFilters)) {
      set.forEach(v => params.append(key, v));
    }
    const qs = params.toString();
    return qs ? '?' + qs : '';
  }

  // ===== Active filter chips =====
  function updateChips() {
    const chipsEl = document.getElementById('coll-chips');
    const rowEl = document.getElementById('coll-chips-row');
    const chips = [];

    if (searchQuery) {
      chips.push({ key: 'q', value: searchQuery, label: 'Search: ' + searchQuery });
    }

    const keyLabels = { type: 'Type', period: 'Period', location: 'Country', namedIndividuals: 'Person' };
    for (const [key, set] of Object.entries(activeFilters)) {
      set.forEach(v => chips.push({ key, value: v, label: keyLabels[key] + ': ' + v }));
    }

    const hasChips = chips.length > 0;
    rowEl.style.display = hasChips ? 'flex' : 'none';

    chipsEl.innerHTML = chips.map(c =>
      `<button class="coll-chip" data-key="${escapeHtml(c.key)}" data-value="${escapeHtml(c.value)}">
        ${escapeHtml(c.label)}
        <svg class="coll-chip-x" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>`
    ).join('');

    chipsEl.querySelectorAll('.coll-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const val = btn.dataset.value;
        if (key === 'q') {
          searchQuery = '';
          document.getElementById('coll-search-input').value = '';
        } else {
          activeFilters[key].delete(val);
          const dd = document.getElementById('dropdown-' + key);
          dd.querySelectorAll('input').forEach(cb => {
            if (cb.value === val) cb.checked = false;
          });
        }
        currentPage = 1;
        render();
        pushUrlState();
      });
    });
  }

  init().catch(err => console.error('Collection init error:', err));
})();
