(function () {
  'use strict';

  async function init() {
    try {
      var res = await fetch('data/museum-data.json');
      var allItems = await res.json();
      renderHeroStats(allItems);
    } catch (err) {
      console.error('Failed to load homepage data:', err);
    }
  }

  function renderHeroStats(allItems) {
    var container = document.getElementById('hero-stats');
    if (!container) return;

    var countries = {};
    for (var i = 0; i < allItems.length; i++) {
      var item = allItems[i];
      if (item.location) {
        for (var j = 0; j < item.location.length; j++) {
          countries[item.location[j]] = true;
        }
      }
    }

    container.innerHTML =
      '<div class="hero-stat">' +
        '<span class="hero-stat-number">' + allItems.length + '</span>' +
        '<span class="hero-stat-label">Documents</span>' +
      '</div>' +
      '<div class="hero-stat">' +
        '<span class="hero-stat-number">' + Object.keys(countries).length + '</span>' +
        '<span class="hero-stat-label">Countries</span>' +
      '</div>';
  }

  init();
})();
