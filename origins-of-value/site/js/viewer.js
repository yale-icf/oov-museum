(function () {
  'use strict';

  let allItems = [];
  let currentItem = null;
  let currentIndex = -1;
  let viewer = null;

  const viewerTitle = document.getElementById('viewer-title');
  const metaTitle = document.getElementById('meta-title');
  const metaRows = document.getElementById('meta-rows');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const backBtn = document.getElementById('back-btn');

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
    loadItem(currentItem);
    updateNav();
    setupEvents();

    // Preserve gallery link with referrer params
    if (document.referrer && document.referrer.indexOf('index.html') !== -1) {
      var refURL = new URL(document.referrer);
      if (refURL.search) {
        backBtn.href = 'index.html' + refURL.search;
      }
    }
  }

  function loadItem(item) {
    // Update page title
    document.title = item.title + ' - Origins of Value';
    viewerTitle.textContent = item.title;

    // Initialize or update OpenSeadragon
    var dziUrl = 'tiles/' + item.id + '/' + item.id + '.dzi';

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

    var fields = [
      { label: 'Description', value: item.description },
      { label: 'Type', value: item.type, isTags: true },
      { label: 'Period', value: item.period, isTags: true },
      { label: 'Location', value: item.location, isTags: true },
      { label: 'Named Individuals', value: item.namedIndividuals, isTags: true },
      { label: 'Keywords', value: item.keywords, isTags: true },
      { label: 'Owner', value: item.owner }
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

    // Update URL without reload
    var params = new URLSearchParams(window.location.search);
    params.set('id', currentItem.id);
    history.replaceState(null, '', 'viewer.html?' + params.toString());

    loadItem(currentItem);
    updateNav();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setupEvents() {
    prevBtn.addEventListener('click', function () { navigate(-1); });
    nextBtn.addEventListener('click', function () { navigate(1); });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { navigate(-1); }
      else if (e.key === 'ArrowRight') { navigate(1); }
      else if (e.key === 'Escape') { window.location.href = backBtn.href; }
    });
  }

  init();
})();
