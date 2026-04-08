(function () {
  'use strict';

  const HIGHLIGHTS = [
    {
      id: 'goetzmann1021',
      title: 'Dutch East India Company (VOC) \u2013 Middelburg Chamber Obligation Receipts, 1622\u20131623',
      period: '17th Century',
      location: 'Netherlands'
    },
    {
      id: 'goetzmann0302',
      title: 'Banque Industrielle de Chine, 500 Franc Share',
      period: '20th Century',
      location: 'China'
    },
    {
      id: 'goetzmann0028',
      title: 'Temple Mills (South Sea Bubble Playing Card, King of Diamonds)',
      period: '18th Century',
      location: 'Great Britain'
    },
    {
      id: 'goetzmann0300',
      title: 'St. Petersburg Private Commercial Bank, 200 Ruble Share',
      period: '20th Century',
      location: 'Russia'
    }
  ];

  const COUNTRIES = [
    { name: 'United Kingdom', count: 191, thumb: 'goetzmann0540' },
    { name: 'United States',  count: 132, thumb: 'goetzmann0181' },
    { name: 'Netherlands',    count: 88,  thumb: 'goetzmann0004' }
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

  function renderHighlights() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;
    HIGHLIGHTS.forEach(item => {
      const card = document.createElement('a');
      card.className = 'featured-card';
      card.href = 'viewer.html?id=' + encodeURIComponent(item.id);
      card.innerHTML =
        '<div class="featured-card-image">' +
          `<img src="thumbnails/${item.id}.jpg" alt="${escapeHtml(item.title)}" loading="lazy">` +
        '</div>' +
        '<div class="featured-card-body">' +
          `<h3 class="featured-card-title">${escapeHtml(item.title)}</h3>` +
          `<p class="featured-card-meta">${escapeHtml(item.period)} &mdash; ${escapeHtml(item.location)}</p>` +
        '</div>';
      grid.appendChild(card);
    });
  }

  function renderCountries() {
    const grid = document.getElementById('country-grid');
    if (!grid) return;
    COUNTRIES.forEach(country => {
      const card = document.createElement('a');
      card.className = 'country-card';
      card.href = 'gallery.html?issuingCountry=' + encodeURIComponent(country.name);
      card.innerHTML =
        '<div class="country-card-image">' +
          `<img src="thumbnails/${country.thumb}.jpg" alt="${escapeHtml(country.name)}" loading="lazy">` +
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

  renderHighlights();
  renderCountries();
  renderPublications();
})();
