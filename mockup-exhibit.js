/* ============================================================
   Origins of Value — "museum" mockup: exhibition objects grid
   Each exhibit page defines window.EXHIBIT_OBJECTS = [ ... ];
   then loads this script. It renders the thumbnail grid into
   #objgrid and builds the object popup.

   Object shape: { id, img, alt, title, meta, text: [paragraphs] }
   ============================================================ */
(function () {
  'use strict';

  var OBJECTS = window.EXHIBIT_OBJECTS || [];
  var grid = document.getElementById('objgrid');
  if (!grid || !OBJECTS.length) return;

  var current = 0;
  var lastFocus = null;

  function pad(i) { return (i + 1 < 10 ? '0' : '') + (i + 1); }

  // ---- popup markup (built once, shared by every page) ----
  var modal = document.createElement('div');
  modal.className = 'objmodal';
  modal.id = 'objmodal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'objmodal-title');
  modal.innerHTML =
    '<div class="objmodal-panel">' +
      '<button class="objmodal-close" id="objmodal-close" aria-label="Close">×</button>' +
      '<div class="objmodal-img"><img id="objmodal-img" src="" alt=""></div>' +
      '<div class="objmodal-body" id="objmodal-body">' +
        '<span class="n" id="objmodal-num"></span>' +
        '<h2 id="objmodal-title"></h2>' +
        '<div class="m" id="objmodal-meta"></div>' +
        '<div id="objmodal-text"></div>' +
        '<a class="piece-link" id="objmodal-link" href="#">View record in collection →</a>' +
        '<div class="objmodal-nav">' +
          '<button id="objmodal-prev">← Previous object</button>' +
          '<button id="objmodal-next">Next object →</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);

  var mImg    = document.getElementById('objmodal-img');
  var mNum    = document.getElementById('objmodal-num');
  var mTitle  = document.getElementById('objmodal-title');
  var mMeta   = document.getElementById('objmodal-meta');
  var mText   = document.getElementById('objmodal-text');
  var mLink   = document.getElementById('objmodal-link');
  var mBody   = document.getElementById('objmodal-body');
  var mClose  = document.getElementById('objmodal-close');
  var btnPrev = document.getElementById('objmodal-prev');
  var btnNext = document.getElementById('objmodal-next');

  // ---- thumbnail grid ----
  OBJECTS.forEach(function (o, i) {
    var card = document.createElement('button');
    card.className = 'objcard';
    card.type = 'button';

    var ph = document.createElement('div');
    ph.className = 'ph';
    var img = document.createElement('img');
    img.src = o.img;
    img.alt = o.alt || o.title;
    img.loading = 'lazy';
    ph.appendChild(img);
    card.appendChild(ph);

    var n = document.createElement('div');
    n.className = 'n';
    n.textContent = pad(i);
    card.appendChild(n);

    var t = document.createElement('div');
    t.className = 't';
    t.textContent = o.title;
    card.appendChild(t);

    var m = document.createElement('div');
    m.className = 'm';
    m.textContent = o.meta;
    card.appendChild(m);

    card.addEventListener('click', function () { open(i); });
    grid.appendChild(card);
  });

  // ---- popup behaviour ----
  function open(i) {
    current = i;
    var o = OBJECTS[i];

    mImg.src = o.img;
    mImg.alt = o.alt || o.title;
    mNum.textContent = pad(i) + ' / ' + pad(OBJECTS.length - 1);
    mTitle.textContent = o.title;
    mMeta.textContent = o.meta;
    mText.innerHTML = o.text.map(function (p) { return '<p>' + p + '</p>'; }).join('');
    mLink.href = 'mockup-record.html?id=' + encodeURIComponent(o.id);

    btnPrev.disabled = (i === 0);
    btnNext.disabled = (i === OBJECTS.length - 1);

    if (!modal.classList.contains('open')) lastFocus = document.activeElement;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    mBody.scrollTop = 0;   // a long previous writeup shouldn't leave the next one scrolled
    mClose.focus();
  }

  function close() {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus();
  }

  mClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { if (current > 0) open(current - 1); });
  btnNext.addEventListener('click', function () { if (current < OBJECTS.length - 1) open(current + 1); });

  // click the backdrop (but not the panel) to dismiss
  modal.addEventListener('click', function (e) {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft'  && current > 0) open(current - 1);
    if (e.key === 'ArrowRight' && current < OBJECTS.length - 1) open(current + 1);
  });

  // ?object=3 opens that object straight away, so a single piece can be linked to
  var want = parseInt(new URLSearchParams(window.location.search).get('object'), 10);
  if (want >= 1 && want <= OBJECTS.length) open(want - 1);
})();
