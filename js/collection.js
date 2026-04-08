(function () {
  'use strict';

  const COUNTRIES = [
    { name: 'United Kingdom', count: 191 },
    { name: 'United States',  count: 132 },
    { name: 'Netherlands',    count: 88 }
  ];

  const PUBLICATIONS = [
    {
      shortTitle: 'The Great Mirror of Folly',
      year: '1720',
      count: 4,
      images: ['goetzmann0004', 'goetzmann0011', 'goetzmann0019'],
      query: 'groote tafereel',
      desc: 'A Dutch satirical compilation documenting the speculative mania of 1720.'
    },
    {
      shortTitle: 'South Sea Bubble Playing Cards',
      year: 'c. 1720',
      count: 1,
      images: ['goetzmann0028'],
      query: 'south sea playing card',
      desc: 'An English satirical card deck mocking the South Sea Company bubble.'
    },
    {
      shortTitle: 'Dutch Wind Cards',
      year: 'c. 1720',
      count: 1,
      images: ['goetzmann0079'],
      query: 'windkaart',
      desc: 'Dutch satirical playing cards lampooning speculative stock schemes of 1720.'
    }
  ];

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderCountries(items) {
    const grid = document.getElementById('country-grid');
    if (!grid) return;
    COUNTRIES.forEach(country => {
      let thumbId = '';
      for (let j = 0; j < items.length; j++) {
        if (items[j].location && items[j].location.indexOf(country.name) !== -1) {
          thumbId = items[j].id;
          break;
        }
      }
      const card = document.createElement('a');
      card.className = 'country-card';
      card.href = 'gallery.html?issuingCountry=' + encodeURIComponent(country.name);
      card.innerHTML =
        '<div class="country-card-image">' +
          (thumbId ? `<img src="thumbnails/${thumbId}.jpg" alt="${escapeHtml(country.name)}" loading="lazy">` : '') +
        '</div>' +
        '<div class="country-card-overlay">' +
          `<h3 class="country-card-name">${escapeHtml(country.name)}</h3>` +
          `<span class="country-card-count">${country.count} documents</span>` +
        '</div>';
      grid.appendChild(card);
    });
  }

  function renderPublications() {
    const grid = document.getElementById('publication-grid');
    if (!grid) return;
    PUBLICATIONS.forEach(pub => {
      const imgHtml = pub.images.map(id =>
        `<img src="thumbnails/${id}.jpg" alt="" loading="lazy">`
      ).join('');
      const card = document.createElement('a');
      card.className = 'pub-card';
      card.href = 'gallery.html?q=' + encodeURIComponent(pub.query);
      card.innerHTML =
        `<div class="pub-card-images pub-card-images--${pub.images.length}">${imgHtml}</div>` +
        '<div class="pub-card-body">' +
          '<span class="exhibit-card-label">Source Publication</span>' +
          `<h3 class="pub-card-title">${escapeHtml(pub.shortTitle)}</h3>` +
          `<p class="pub-card-desc">${escapeHtml(pub.desc)}</p>` +
          `<span class="exhibit-card-meta">${pub.count} item${pub.count !== 1 ? 's' : ''} &middot; ${escapeHtml(pub.year)}</span>` +
        '</div>';
      grid.appendChild(card);
    });
  }

  async function init() {
    const res = await fetch('data/museum-data.json');
    const items = await res.json();
    renderCountries(items);
    renderPublications();
  }

  init().catch(err => console.error('Collection init error:', err));
})();
