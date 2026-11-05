(function(){
  'use strict';
  /* v2.7: click-to-play games. Nothing heavy loads until the visitor taps Play. */
  document.querySelectorAll('.gcard__play').forEach(function(btn){
    btn.addEventListener('click', function(){
      var stage = btn.closest('.gcard__stage'); if(!stage) return;
      var f = document.createElement('iframe');
      f.src = btn.getAttribute('data-game-src');
      f.title = btn.getAttribute('data-game-title') + ' (browser game)';
      f.setAttribute('allow', 'fullscreen; gamepad; autoplay');
      f.setAttribute('loading', 'eager');
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      stage.appendChild(f);
      var poster = stage.querySelector('.gcard__poster'); if (poster) poster.remove();
      btn.remove();
      var card = stage.closest('.gcard');
      var fs = card && card.querySelector('.gcard__full');
      if (fs && document.fullscreenEnabled && f.requestFullscreen !== undefined) {
        fs.hidden = false;
        fs.addEventListener('click', function(){ (f.requestFullscreen ? f.requestFullscreen() : null); });
      }
    });
  });
  /* v2.7: contact form. No backend: it opens WhatsApp with the words filled in. */
  var form = document.getElementById('cform');
  if (form) {
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var name = (form.elements.name.value || '').trim().slice(0, 60);
      var msg = (form.elements.message.value || '').trim().slice(0, 800);
      var err = form.querySelector('.cform__err');
      if (!msg) { if (err) { err.textContent = 'Write a message first.'; } form.elements.message.focus(); return; }
      if (err) err.textContent = '';
      var text = 'Hi Sonujeet' + (name ? ', it\'s ' + name : '') + '. ' + msg;
      window.open('https://wa.me/919890533574?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }
  /* v2.7: download hub. Android shows the APK first, Windows shows the zip first, everyone else sees both in order. */
  var ua = navigator.userAgent || '';
  var isAndroid = /Android/i.test(ua), isWin = /Windows/i.test(ua) && !isAndroid;
  if (isAndroid || isWin) {
    var want = isAndroid ? 'android' : 'windows';
    document.querySelectorAll('.dl__row').forEach(function(row){
      var first = row.querySelector('.dl__btn[data-os="' + want + '"]');
      if (first) { row.querySelector('.dl__btns').prepend(first); first.classList.add('is-first'); }
    });
  }
})();
