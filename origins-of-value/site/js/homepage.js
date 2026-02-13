(function () {
  'use strict';

  var FEATURED_IDS = [
    'goetzmann1021', // VOC Dutch East India Company Bond, 1622
    'goetzmann0302', // Banque Industrielle de Chine, 1913
    'goetzmann0028', // South Sea Bubble Playing Cards, 1720s
    'goetzmann0300'  // St. Petersburg Bank Stock, 1911
  ];

  var COUNTRIES = [
    { name: 'United Kingdom', count: 191 },
    { name: 'United States', count: 132 },
    { name: 'Netherlands', count: 88 },
    { name: 'Russia', count: 36 },
    { name: 'France', count: 31 },
    { name: 'China', count: 28 }
  ];

  // Load featured items and country thumbnails from museum data
  async function loadFeatured() {
    try {
      var res = await fetch('data/museum-data.json');
      var allItems = await res.json();
      var featured = [];

      for (var i = 0; i < FEATURED_IDS.length; i++) {
        for (var j = 0; j < allItems.length; j++) {
          if (allItems[j].id === FEATURED_IDS[i]) {
            featured.push(allItems[j]);
            break;
          }
        }
      }

      renderFeatured(featured);
      renderCountries(allItems);
      renderHeroStats(allItems);
    } catch (err) {
      console.error('Failed to load featured items:', err);
    }
  }

  function renderFeatured(items) {
    var grid = document.getElementById('featured-grid');
    if (!grid) return;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var card = document.createElement('a');
      card.className = 'featured-card';
      card.href = 'viewer.html?id=' + encodeURIComponent(item.id);

      var periodText = '';
      if (item.period && item.period.length > 0) {
        periodText = item.period[0];
      }

      var locationText = '';
      if (item.location && item.location.length > 0) {
        locationText = item.location[0];
      }

      card.innerHTML =
        '<div class="featured-card-image">' +
          '<img src="thumbnails/' + item.id + '.jpg" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
        '</div>' +
        '<div class="featured-card-body">' +
          '<h3 class="featured-card-title">' + escapeHtml(item.title) + '</h3>' +
          '<p class="featured-card-meta">' + escapeHtml(periodText) + (locationText ? ' &mdash; ' + escapeHtml(locationText) : '') + '</p>' +
        '</div>';

      grid.appendChild(card);
    }

    // Lazy load featured card images
    lazyLoadImages();
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderCountries(allItems) {
    var grid = document.getElementById('country-grid');
    if (!grid) return;

    for (var i = 0; i < COUNTRIES.length; i++) {
      var country = COUNTRIES[i];

      // Find a representative thumbnail for this country
      var thumbId = '';
      for (var j = 0; j < allItems.length; j++) {
        if (allItems[j].location && allItems[j].location.indexOf(country.name) !== -1) {
          thumbId = allItems[j].id;
          break;
        }
      }

      var card = document.createElement('a');
      card.className = 'country-card';
      card.href = 'gallery.html?location=' + encodeURIComponent(country.name);

      card.innerHTML =
        '<div class="country-card-image">' +
          (thumbId ? '<img src="thumbnails/' + thumbId + '.jpg" alt="' + escapeHtml(country.name) + '" loading="lazy">' : '') +
        '</div>' +
        '<div class="country-card-overlay">' +
          '<h3 class="country-card-name">' + escapeHtml(country.name) + '</h3>' +
          '<span class="country-card-count">' + country.count + ' documents</span>' +
        '</div>';

      grid.appendChild(card);
    }

    lazyLoadImages();
  }

  function renderHeroStats(allItems) {
    var container = document.getElementById('hero-stats');
    if (!container) return;

    var countries = {};
    var periods = {};
    for (var i = 0; i < allItems.length; i++) {
      var item = allItems[i];
      if (item.location) {
        for (var j = 0; j < item.location.length; j++) {
          countries[item.location[j]] = true;
        }
      }
      if (item.period) {
        for (var k = 0; k < item.period.length; k++) {
          periods[item.period[k]] = true;
        }
      }
    }

    var countryCount = Object.keys(countries).length;
    var periodCount = Object.keys(periods).length;

    container.innerHTML =
      '<div class="hero-stat">' +
        '<span class="hero-stat-number">' + allItems.length + '</span>' +
        '<span class="hero-stat-label">Documents</span>' +
      '</div>' +
      '<div class="hero-stat">' +
        '<span class="hero-stat-number">' + countryCount + '</span>' +
        '<span class="hero-stat-label">Countries</span>' +
      '</div>' +
      '<div class="hero-stat">' +
        '<span class="hero-stat-number">' + periodCount + '</span>' +
        '<span class="hero-stat-label">Time Periods</span>' +
      '</div>';
  }

  function lazyLoadImages() {
    var images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
      var imgObserver = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            var img = entries[i].target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            img.addEventListener('load', function () {
              this.classList.add('loaded');
            });
            imgObserver.unobserve(img);
          }
        }
      }, { rootMargin: '200px' });

      for (var i = 0; i < images.length; i++) {
        imgObserver.observe(images[i]);
      }
    } else {
      // Fallback: load all immediately
      for (var i = 0; i < images.length; i++) {
        images[i].src = images[i].getAttribute('data-src');
        images[i].removeAttribute('data-src');
        images[i].classList.add('loaded');
      }
    }
  }

  // Initialize
  loadFeatured();
})();
