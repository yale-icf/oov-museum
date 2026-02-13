(function () {
  'use strict';

  let allItems = [];
  let currentItem = null;
  let currentIndex = -1;
  let viewer = null;
  let currentPage = 0; // 0-indexed page within a multi-page item

  const viewerTitle = document.getElementById('viewer-title');
  const metaTitle = document.getElementById('meta-title');
  const metaRows = document.getElementById('meta-rows');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const backBtn = document.getElementById('back-btn');
  const pageNav = document.getElementById('page-nav');
  const pageInfo = document.getElementById('page-info');
  const pagePrev = document.getElementById('page-prev');
  const pageNext = document.getElementById('page-next');

  async function init() {
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');
    if (!itemId) {
      viewerTitle.textContent = 'No document specified';
      return;
    }

    try {
      const res = await fetch('data/museum-data.json');
      allItems = await res.json();
    } catch (err) {
      viewerTitle.textContent = 'Failed to load data';
      return;
    }

    currentIndex = allItems.findIndex(function (item) { return item.id === itemId; });
    if (currentIndex === -1) {
      viewerTitle.textContent = 'Document not found: ' + itemId;
      return;
    }

    currentItem = allItems[currentIndex];

    // Check for page URL param
    var pageParam = parseInt(params.get('page'), 10);
    if (currentItem.pages && pageParam >= 1 && pageParam <= currentItem.pages.length) {
      currentPage = pageParam - 1;
    } else {
      currentPage = 0;
    }

    loadItem(currentItem);
    updateNav();
    updatePageNav();
    setupEvents();

    // Preserve gallery link with referrer params
    if (document.referrer && document.referrer.indexOf('gallery.html') !== -1) {
      var refURL = new URL(document.referrer);
      if (refURL.search) {
        backBtn.href = 'gallery.html' + refURL.search;
      }
    }
  }

  function loadItem(item) {
    // Update page title
    document.title = item.title + ' - Origins of Value';
    viewerTitle.textContent = item.title;

    // For multi-page items, use the current page's tile source
    var tileId = item.id;
    if (item.pages && item.pages[currentPage]) {
      tileId = item.pages[currentPage].id;
    }
    var dziUrl = 'tiles/' + tileId + '/' + tileId + '.dzi';

    if (viewer) {
      viewer.open(dziUrl);
    } else {
      viewer = OpenSeadragon({
        id: 'osd-viewer',
        tileSources: dziUrl,
        prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.1/images/',
        showNavigator: true,
        navigatorPosition: 'BOTTOM_RIGHT',
        navigatorSizeRatio: 0.15,
        showFullPageControl: true,
        showZoomControl: true,
        showHomeControl: true,
        animationTime: 0.3,
        minZoomImageRatio: 0.8,
        maxZoomPixelRatio: 4,
        visibilityRatio: 0.5,
        constrainDuringPan: true,
        gestureSettingsMouse: { scrollToZoom: true },
        gestureSettingsTouch: { pinchToZoom: true }
      });
    }

    // Render metadata
    renderMetadata(item);
  }

  function renderMetadata(item) {
    metaTitle.textContent = item.title;
    metaRows.innerHTML = '';

    // For multi-page items, show the per-page description if available
    var description = item.description;
    if (item.pages && item.pages[currentPage] && item.pages[currentPage].description) {
      description = item.pages[currentPage].description;
    }

    var fields = [
      { label: 'Description', value: description },
      { label: 'Type', value: item.type, isTags: true },
      { label: 'Period', value: item.period, isTags: true },
      { label: 'Location', value: item.location, isTags: true },
      { label: 'Named Individuals', value: item.namedIndividuals, isTags: true },
      { label: 'Keywords', value: item.keywords, isTags: true },
      { label: 'Owner', value: item.owner },
      { label: 'Transcription & Translation', value: item.transcription, isTranscription: true }
    ];

    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      var val = f.value;

      // Skip empty
      if (!val || (Array.isArray(val) && val.length === 0)) continue;

      var row = document.createElement('div');
      row.className = 'metadata-row';

      var label = document.createElement('div');
      label.className = 'metadata-label';
      label.textContent = f.label;
      row.appendChild(label);

      var valueDiv = document.createElement('div');
      valueDiv.className = 'metadata-value';

      if (f.isTags && Array.isArray(val)) {
        for (var j = 0; j < val.length; j++) {
          var tag = document.createElement('span');
          tag.className = 'tag';
          tag.textContent = val[j];
          valueDiv.appendChild(tag);
        }
      } else if (f.isTranscription) {
        var pre = document.createElement('div');
        pre.className = 'transcription-text';
        pre.textContent = val;
        valueDiv.appendChild(pre);
      } else {
        valueDiv.textContent = val;
      }

      row.appendChild(valueDiv);
      metaRows.appendChild(row);
    }
  }

  function updateNav() {
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= allItems.length - 1;
  }

  function navigate(delta) {
    var newIndex = currentIndex + delta;
    if (newIndex < 0 || newIndex >= allItems.length) return;

    currentIndex = newIndex;
    currentItem = allItems[currentIndex];
    currentPage = 0;

    // Update URL without reload
    var params = new URLSearchParams(window.location.search);
    params.set('id', currentItem.id);
    params.delete('page');
    history.replaceState(null, '', 'viewer.html?' + params.toString());

    loadItem(currentItem);
    updateNav();
    updatePageNav();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updatePageNav() {
    if (!currentItem.pages || currentItem.pages.length <= 1) {
      pageNav.style.display = 'none';
      return;
    }

    pageNav.style.display = '';
    pageInfo.textContent = 'Page ' + (currentPage + 1) + ' of ' + currentItem.pages.length;
    pagePrev.disabled = currentPage <= 0;
    pageNext.disabled = currentPage >= currentItem.pages.length - 1;
  }

  function navigatePage(delta) {
    if (!currentItem.pages) return;
    var newPage = currentPage + delta;
    if (newPage < 0 || newPage >= currentItem.pages.length) return;

    currentPage = newPage;

    // Update URL param
    var params = new URLSearchParams(window.location.search);
    if (currentPage > 0) {
      params.set('page', currentPage + 1);
    } else {
      params.delete('page');
    }
    history.replaceState(null, '', 'viewer.html?' + params.toString());

    loadItem(currentItem);
    updatePageNav();
  }

  function setupEvents() {
    prevBtn.addEventListener('click', function () { navigate(-1); });
    nextBtn.addEventListener('click', function () { navigate(1); });
    pagePrev.addEventListener('click', function () { navigatePage(-1); });
    pageNext.addEventListener('click', function () { navigatePage(1); });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        // If multi-page, page navigation takes priority
        if (currentItem.pages && currentItem.pages.length > 1) {
          navigatePage(-1);
        } else {
          navigate(-1);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentItem.pages && currentItem.pages.length > 1) {
          navigatePage(1);
        } else {
          navigate(1);
        }
      } else if (e.key === 'Escape') {
        window.location.href = backBtn.href;
      }
    });
  }

  init();
})();
