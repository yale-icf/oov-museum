(function () {
  'use strict';

  const PER_PAGE = 40;
  let allItems = [];
  let filterIndex = {};
  let filteredItems = [];
  let currentPage = 1;
  let activeFilters = { type: [], location: [], period: [], namedIndividuals: [] };
  let searchQuery = '';
  let observer = null;

  // DOM refs
  const galleryGrid = document.getElementById('gallery-grid');
  const pagination = document.getElementById('pagination');
  const searchInput = document.getElementById('search-input');
  const resultCount = document.getElementById('result-count');
  const emptyState = document.getElementById('empty-state');
  const loading = document.getElementById('loading');
  const activeFiltersContainer = document.getElementById('active-filters');
  const clearFiltersBtn = document.getElementById('clear-filters');

  // ===== Init =====
  async function init() {
    try {
      const [dataRes, filterRes] = await Promise.all([
        fetch('data/museum-data.json'),
        fetch('data/filter-index.json')
      ]);
      allItems = await dataRes.json();
      filterIndex = await filterRes.json();
    } catch (err) {
      loading.innerHTML = '<p style="color:red">Failed to load data. Make sure you\'re running a local server.</p>';
      return;
    }

    loading.style.display = 'none';
    buildFilterSidebar();
    restoreStateFromURL();
    setupEventListeners();
    setupLazyLoading();
    applyFilters();
  }

  // ===== Filter Sidebar =====
  function buildFilterSidebar() {
    const filterFields = [
      { key: 'type', el: document.getElementById('filter-type') },
      { key: 'period', el: document.getElementById('filter-period') },
      { key: 'location', el: document.getElementById('filter-location') },
      { key: 'namedIndividuals', el: document.getElementById('filter-namedIndividuals') }
    ];

    for (const { key, el } of filterFields) {
      const facets = filterIndex[key] || [];
      el.innerHTML = '';
      for (const facet of facets) {
        const label = document.createElement('label');
        label.className = 'filter-option';
        label.innerHTML =
          '<input type="checkbox" data-field="' + key + '" value="' + escapeAttr(facet.value) + '">' +
          '<span class="label-text">' + escapeHtml(facet.value) + '</span>' +
          '<span class="count">' + facet.count + '</span>';
        el.appendChild(label);
      }
    }
  }

  // ===== Events =====
  function setupEventListeners() {
    // Search
    let debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        searchQuery = searchInput.value.trim().toLowerCase();
        currentPage = 1;
        applyFilters();
        updateURL();
      }, 200);
    });

    // Filter checkboxes
    document.getElementById('sidebar').addEventListener('change', function (e) {
      if (e.target.type === 'checkbox') {
        const field = e.target.dataset.field;
        const value = e.target.value;
        if (e.target.checked) {
          if (!activeFilters[field].includes(value)) {
            activeFilters[field].push(value);
          }
        } else {
          activeFilters[field] = activeFilters[field].filter(function (v) { return v !== value; });
        }
        currentPage = 1;
        applyFilters();
        updateURL();
      }
    });

    // Clear filters
    clearFiltersBtn.addEventListener('click', function () {
      activeFilters = { type: [], location: [], period: [], namedIndividuals: [] };
      searchQuery = '';
      searchInput.value = '';
      currentPage = 1;
      uncheckAll();
      applyFilters();
      updateURL();
    });

    // Mobile: collapse filter sections
    if (window.innerWidth <= 768) {
      document.querySelectorAll('.filter-section h3').forEach(function (h3) {
        h3.parentElement.classList.add('collapsed');
        h3.addEventListener('click', function () {
          h3.parentElement.classList.toggle('collapsed');
        });
      });
    }
  }

  function uncheckAll() {
    document.querySelectorAll('.sidebar input[type="checkbox"]').forEach(function (cb) {
      cb.checked = false;
    });
  }

  // ===== Filtering =====
  function applyFilters() {
    filteredItems = allItems.filter(function (item) {
      // Text search
      if (searchQuery) {
        const haystack = (
          item.title + ' ' + item.description + ' ' +
          (item.keywords || []).join(' ') + ' ' +
          (item.namedIndividuals || []).join(' ')
        ).toLowerCase();
        if (haystack.indexOf(searchQuery) === -1) return false;
      }

      // Facet filters
      for (var field in activeFilters) {
        var selected = activeFilters[field];
        if (selected.length > 0) {
          var values = item[field] || [];
          var hasMatch = false;
          for (var i = 0; i < selected.length; i++) {
            if (values.indexOf(selected[i]) !== -1) { hasMatch = true; break; }
          }
          if (!hasMatch) return false;
        }
      }

      return true;
    });

    renderActiveFilters();
    renderGallery();
    renderPagination();
    updateResultCount();
  }

  // ===== Active Filter Chips =====
  function renderActiveFilters() {
    activeFiltersContainer.innerHTML = '';
    var hasAny = false;

    for (var field in activeFilters) {
      var selected = activeFilters[field];
      for (var i = 0; i < selected.length; i++) {
        hasAny = true;
        var chip = document.createElement('span');
        chip.className = 'active-filter-chip';
        chip.dataset.field = field;
        chip.dataset.value = selected[i];
        chip.innerHTML = escapeHtml(selected[i]) + ' <span class="remove">&times;</span>';
        chip.addEventListener('click', removeFilterChip);
        activeFiltersContainer.appendChild(chip);
      }
    }
  }

  function removeFilterChip(e) {
    var chip = e.currentTarget;
    var field = chip.dataset.field;
    var value = chip.dataset.value;
    activeFilters[field] = activeFilters[field].filter(function (v) { return v !== value; });

    // Uncheck the checkbox
    var cb = document.querySelector('input[data-field="' + field + '"][value="' + CSS.escape(value) + '"]');
    if (cb) cb.checked = false;

    currentPage = 1;
    applyFilters();
    updateURL();
  }

  // ===== Gallery Rendering =====
  function renderGallery() {
    galleryGrid.innerHTML = '';

    if (filteredItems.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    var start = (currentPage - 1) * PER_PAGE;
    var end = Math.min(start + PER_PAGE, filteredItems.length);
    var pageItems = filteredItems.slice(start, end);

    for (var i = 0; i < pageItems.length; i++) {
      var item = pageItems[i];
      galleryGrid.appendChild(createCard(item));
    }

    // Re-observe for lazy loading
    if (observer) {
      galleryGrid.querySelectorAll('img[data-src]').forEach(function (img) {
        observer.observe(img);
      });
    }
  }

  function createCard(item) {
    var a = document.createElement('a');
    a.className = 'card';
    a.href = 'viewer.html?id=' + encodeURIComponent(item.id);

    var imageDiv = document.createElement('div');
    imageDiv.className = 'card-image';
    var img = document.createElement('img');
    img.dataset.src = 'thumbnails/' + item.file;
    img.alt = item.title;
    img.loading = 'lazy';
    imageDiv.appendChild(img);
    a.appendChild(imageDiv);

    var body = document.createElement('div');
    body.className = 'card-body';

    var title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = item.title;
    body.appendChild(title);

    var tags = document.createElement('div');
    tags.className = 'card-tags';

    // Type tags
    if (item.type) {
      for (var t = 0; t < item.type.length && t < 2; t++) {
        var tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = item.type[t];
        tags.appendChild(tag);
      }
    }

    // Period tag
    if (item.period && item.period.length > 0) {
      var ptag = document.createElement('span');
      ptag.className = 'tag period-tag';
      ptag.textContent = item.period[0];
      tags.appendChild(ptag);
    }

    body.appendChild(tags);
    a.appendChild(body);
    return a;
  }

  // ===== Lazy Loading =====
  function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.addEventListener('load', function () { img.classList.add('loaded'); });
            img.addEventListener('error', function () { img.classList.add('loaded'); img.alt = 'Image not available'; });
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });
    } else {
      // Fallback: load all immediately
      observer = {
        observe: function (img) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
        }
      };
    }
  }

  // ===== Pagination =====
  function renderPagination() {
    pagination.innerHTML = '';
    var totalPages = Math.ceil(filteredItems.length / PER_PAGE);
    if (totalPages <= 1) return;

    // Prev
    var prev = document.createElement('button');
    prev.textContent = '\u2190 Prev';
    prev.disabled = currentPage === 1;
    prev.addEventListener('click', function () { goToPage(currentPage - 1); });
    pagination.appendChild(prev);

    // Page buttons
    var pages = getPageRange(currentPage, totalPages);
    for (var i = 0; i < pages.length; i++) {
      if (pages[i] === '...') {
        var dots = document.createElement('span');
        dots.className = 'page-info';
        dots.textContent = '...';
        pagination.appendChild(dots);
      } else {
        var btn = document.createElement('button');
        btn.textContent = pages[i];
        if (pages[i] === currentPage) btn.className = 'active';
        btn.addEventListener('click', (function (p) {
          return function () { goToPage(p); };
        })(pages[i]));
        pagination.appendChild(btn);
      }
    }

    // Next
    var next = document.createElement('button');
    next.textContent = 'Next \u2192';
    next.disabled = currentPage === totalPages;
    next.addEventListener('click', function () { goToPage(currentPage + 1); });
    pagination.appendChild(next);
  }

  function getPageRange(current, total) {
    if (total <= 7) {
      var arr = [];
      for (var i = 1; i <= total; i++) arr.push(i);
      return arr;
    }
    var pages = [1];
    if (current > 3) pages.push('...');
    for (var p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
      pages.push(p);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  function goToPage(page) {
    currentPage = page;
    renderGallery();
    renderPagination();
    updateURL();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ===== Result Count =====
  function updateResultCount() {
    resultCount.textContent = filteredItems.length + ' of ' + allItems.length + ' documents';
  }

  // ===== URL State =====
  function updateURL() {
    var params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (currentPage > 1) params.set('page', currentPage);
    for (var field in activeFilters) {
      if (activeFilters[field].length > 0) {
        params.set(field, activeFilters[field].join('|'));
      }
    }
    var qs = params.toString();
    var url = window.location.pathname + (qs ? '?' + qs : '');
    history.replaceState(null, '', url);
  }

  function restoreStateFromURL() {
    var params = new URLSearchParams(window.location.search);

    if (params.has('q')) {
      searchQuery = params.get('q').toLowerCase();
      searchInput.value = params.get('q');
    }

    if (params.has('page')) {
      currentPage = parseInt(params.get('page'), 10) || 1;
    }

    var fields = ['type', 'location', 'period', 'namedIndividuals'];
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      if (params.has(field)) {
        activeFilters[field] = params.get(field).split('|').filter(Boolean);
        // Check the corresponding checkboxes
        for (var j = 0; j < activeFilters[field].length; j++) {
          var cb = document.querySelector('input[data-field="' + field + '"][value="' + CSS.escape(activeFilters[field][j]) + '"]');
          if (cb) cb.checked = true;
        }
      }
    }
  }

  // ===== Utilities =====
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ===== Start =====
  init();
})();
