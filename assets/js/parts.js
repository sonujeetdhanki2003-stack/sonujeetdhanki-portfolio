/* Large files are stored on GitHub as numbered parts (each under the upload limit) and joined here in the browser.
   assets/parts/<name>.partN joins back into the file at assets/<dir>/<name>. Covers fetch() (the guide model) and media src. */
(function () {
  var MAN = {"assets/avatar/guide-v23.glb": {"parts": 2, "type": "model/gltf-binary"}, "assets/media/td-trailer.mp4": {"parts": 4, "type": "video/mp4"}, "assets/media/eco-trailer.mp4": {"parts": 3, "type": "video/mp4"}};
  var cache = {};
  function resolve(u) {
    var url;
    try { url = new URL(String(u), location.href); } catch (e) { return null; }
    for (var k in MAN) {
      var tail = '/' + k;
      if (url.pathname.slice(-tail.length) === tail) {
        return { key: k, root: url.origin + url.pathname.slice(0, url.pathname.length - tail.length) + '/' };
      }
    }
    return null;
  }
  function joined(hit) {
    var k = hit.key;
    if (!cache[k]) {
      var name = k.split('/').pop(), parts = [];
      for (var i = 0; i < MAN[k].parts; i++) {
        parts.push(fetch(hit.root + 'assets/parts/' + name + '.part' + i).then(function (r) {
          if (!r.ok) throw new Error('part ' + r.status); return r.blob(); }));
      }
      cache[k] = Promise.all(parts).then(function (bs) { return new Blob(bs, { type: MAN[k].type }); });
    }
    return cache[k];
  }
  var realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var u = typeof input === 'string' ? input : (input && input.url) || '';
    var hit = resolve(u);
    if (hit && (!init || !init.method || init.method === 'GET')) {
      return joined(hit).then(function (b) { return new Response(b, { status: 200, headers: { 'Content-Type': MAN[hit.key].type } }); });
    }
    return realFetch(input, init);
  };
  var desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
  function setSrc(el, v) {
    var hit = v && resolve(v);
    if (hit) { joined(hit).then(function (b) { desc.set.call(el, URL.createObjectURL(b)); }); }
    else { desc.set.call(el, v); }
  }
  if (desc && desc.set) {
    Object.defineProperty(HTMLMediaElement.prototype, 'src', { configurable: true, enumerable: desc.enumerable, get: desc.get,
      set: function (v) { setSrc(this, v); } });
  }
  function swapAttr(el) {
    var v = el.getAttribute('src');
    if (v && !/^blob:/.test(v) && resolve(v)) setSrc(el, v);
  }
  function scan() { var vs = document.querySelectorAll('video[src],audio[src]'); for (var i = 0; i < vs.length; i++) swapAttr(vs[i]); }
  document.addEventListener('DOMContentLoaded', scan);
  if (window.MutationObserver) {
    new MutationObserver(function (ms) { ms.forEach(function (m) { if (m.target && /^(VIDEO|AUDIO)$/.test(m.target.tagName)) swapAttr(m.target); }); })
      .observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['src'] });
  }
})();
