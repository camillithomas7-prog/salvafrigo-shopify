/* Digital Product — minimal theme JS */
function dpHeaderOffset() {
  var h = document.querySelector('.dp-header');
  return h ? h.getBoundingClientRect().height + 10 : 10;
}

/* Scroll alle ancore interne.
   Non si usa scroll-behavior:smooth del CSS clonato perche' con le immagini in
   lazy-load il layout cambia durante l'animazione e Chrome la interrompe a meta'.
   Qui si salta subito e poi si ricalcola la posizione due volte. */
function dpScrollTo(target) {
  function go() {
    var y = target.getBoundingClientRect().top + window.pageYOffset - dpHeaderOffset();
    window.scrollTo({ top: Math.max(0, y), behavior: 'auto' });
  }
  var prev = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  go();
  setTimeout(go, 250);
  setTimeout(function () {
    go();
    document.documentElement.style.scrollBehavior = prev;
  }, 700);
}

document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href^="#"], a[href*="#"]:not([href^="http"])');
  if (!a) return;
  var href = a.getAttribute('href') || '';
  var id = href.slice(href.indexOf('#') + 1);
  if (!id) return;
  var t = null;
  try { t = document.getElementById(id) || document.querySelector('#' + CSS.escape(id) + ', .' + CSS.escape(id)); } catch (err) { t = null; }
  if (!t) return;
  // se il primo elemento con quell'id e' nascosto, cerca il gemello visibile
  if (!t.getClientRects().length) {
    var alt = document.querySelectorAll('#' + CSS.escape(id) + ', .' + CSS.escape(id));
    for (var i = 0; i < alt.length; i++) { if (alt[i].getClientRects().length) { t = alt[i]; break; } }
  }
  if (!t.getClientRects().length) return;
  e.preventDefault();
  dpScrollTo(t);
  if (history.replaceState) history.replaceState(null, '', href);
});

/* simple galleries: click a thumb to swap the main image */
document.querySelectorAll('[data-gallery]').forEach(function (g) {
  var main = g.querySelector('[data-gallery-main]');
  g.querySelectorAll('[data-gallery-thumb]').forEach(function (t) {
    t.addEventListener('click', function () {
      if (!main) return;
      main.src = t.dataset.full || t.querySelector('img').src;
      g.querySelectorAll('[data-gallery-thumb]').forEach(function (x) { x.classList.remove('is-active'); });
      t.classList.add('is-active');
    });
  });
});
/* tab groups */
document.querySelectorAll('[data-tabs]').forEach(function (box) {
  var btns = box.querySelectorAll('[data-tab]');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (x) { x.classList.remove('is-active'); });
      b.classList.add('is-active');
      box.querySelectorAll('[data-tab-panel]').forEach(function (p) {
        p.hidden = p.dataset.tabPanel !== b.dataset.tab;
      });
    });
  });
});


/* ===== Finestre legali: si aprono sopra la pagina, senza navigare altrove ===== */
(function () {
  var open = null, lastFocus = null;

  function show(key) {
    var m = document.getElementById('dp-policy-' + key);
    if (!m) return;
    lastFocus = document.activeElement;
    m.hidden = false;
    document.body.classList.add('dp-modal-open');
    open = m;
    var x = m.querySelector('.dp-modal__x');
    if (x) x.focus();
    var body = m.querySelector('.dp-modal__body');
    if (body) body.scrollTop = 0;
  }

  function hide() {
    if (!open) return;
    open.hidden = true;
    document.body.classList.remove('dp-modal-open');
    open = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-policy]');
    if (trigger) { e.preventDefault(); show(trigger.getAttribute('data-policy')); return; }
    if (open && e.target.closest('[data-close]')) { e.preventDefault(); hide(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) hide();
    /* il focus resta dentro la finestra finche' e' aperta */
    if (e.key === 'Tab' && open) {
      var f = open.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* apertura diretta via link: .../#policy-refund */
  if (/^#policy-/.test(location.hash)) show(location.hash.replace('#policy-', ''));
})();
