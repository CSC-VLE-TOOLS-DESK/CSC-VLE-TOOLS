/* CSC VLE TOOLS v27: shared border library.
   8 styles: Golden Royal, Ornate Red, Blue, Pink, Floral Pattern, Classic Double, Modern, Traditional.
   One SVG drawing is used everywhere: inside the biodata page, and drawn onto canvases for photo/album tools.
   CSC.borders.svg(id, W, H, opt) -> svg string      (W,H in "units"; A4 = 210 x 297)
   CSC.borders.image(id, pxW, pxH) -> Promise<Image> (for canvas drawImage)
   CSC.borders.options(selected)   -> <option> html
   CSC.borders.info[id]            -> {name, c1, c2, soft, ink} colours that match the style  */
(function () {
  'use strict';
  var CSC = window.CSC = window.CSC || {};
  var info = {
    gold: { name: 'Golden Royal', c1: '#8a5a00', c2: '#d4a017', soft: '#fff8e4', ink: '#5a3a00' },
    red: { name: 'Ornate Red', c1: '#8b0a1a', c2: '#d4a017', soft: '#fff1f0', ink: '#6b0614' },
    blue: { name: 'Blue', c1: '#0b2e79', c2: '#2f6bff', soft: '#eef3ff', ink: '#0b2e79' },
    pink: { name: 'Pink', c1: '#be185d', c2: '#f472b6', soft: '#fff0f7', ink: '#9d174d' },
    floral: { name: 'Floral Pattern', c1: '#166534', c2: '#e11d6a', soft: '#f2fbf3', ink: '#14532d' },
    double: { name: 'Classic Double', c1: '#1b2a49', c2: '#1b2a49', soft: '#f5f6f9', ink: '#1b2a49' },
    modern: { name: 'Modern', c1: '#0f172a', c2: '#0891b2', soft: '#effafd', ink: '#0f172a' },
    trad: { name: 'Traditional', c1: '#7b1e1e', c2: '#e8750a', soft: '#fff6ea', ink: '#7b1e1e' },
    none: { name: 'No border', c1: '#1a3fa6', c2: '#ff9800', soft: '#f4f7f6', ink: '#1a3fa6' }
  };
  var M = 6, CR = 22; // frame margin from the edge, space kept free at each corner for the corner ornament

  function r(n) { return Math.round(n * 100) / 100; }
  function rect(x, y, w, h, stroke, sw, extra) { return '<rect x="' + r(x) + '" y="' + r(y) + '" width="' + r(w) + '" height="' + r(h) + '" fill="none" stroke="' + stroke + '" stroke-width="' + sw + '" ' + (extra || '') + '/>'; }
  function frame(W, H, ins, stroke, sw, extra) { return rect(M + ins, M + ins, W - 2 * (M + ins), H - 2 * (M + ins), stroke, sw, extra); }
  function loop(L, step, fn) { var s = '', n = Math.max(0, Math.floor(L / step)), off = (L - n * step) / 2 + step / 2, i; for (i = 0; i < n; i++) s += fn(off + i * step, i); return s; }
  function heart(x, y, k, fill) { return '<path d="M0 -1.5C-1.8 -3.4 -4.5 -1.6 -2.6 .8L0 3.4L2.6 .8C4.5 -1.6 1.8 -3.4 0 -1.5Z" transform="translate(' + r(x) + ' ' + r(y) + ') scale(' + k + ')" fill="' + fill + '"/>'; }
  function petals(cx, cy, n, rx, ry, dist, fill, rot) { var s = '', i; for (i = 0; i < n; i++) s += '<ellipse cx="0" cy="' + (-dist) + '" rx="' + rx + '" ry="' + ry + '" transform="translate(' + cx + ' ' + cy + ') rotate(' + r(rot + i * 360 / n) + ')" fill="' + fill + '"/>'; return s; }

  /* Each style: defs, frame(W,H), edge(L) drawn along the top edge (y = 0 is the outer frame line, +y goes inward), corner() drawn at the top-left corner (0,0 = frame corner) */
  var S = {
    gold: {
      defs: '<linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a87400"/><stop offset=".3" stop-color="#ffe08a"/><stop offset=".6" stop-color="#d4a017"/><stop offset="1" stop-color="#8a5a00"/></linearGradient>',
      frame: function (W, H) { return frame(W, H, 0, 'url(#gg)', 1.9) + frame(W, H, 2.6, 'url(#gg)', .5) + frame(W, H, 4.8, 'url(#gg)', 1.1); },
      edge: function (L) { return loop(L, 4.2, function (x) { return '<circle cx="' + r(x) + '" cy="3.7" r=".62" fill="url(#gg)"/>'; }); },
      corner: function () { return '<path d="M0 22C0 10 10 0 22 0" fill="none" stroke="url(#gg)" stroke-width="1.3"/><path d="M0 15C0 7 7 0 15 0" fill="none" stroke="url(#gg)" stroke-width=".8"/><circle cx="7.2" cy="7.2" r="2.7" fill="url(#gg)"/><circle cx="7.2" cy="7.2" r="4.6" fill="none" stroke="url(#gg)" stroke-width=".5"/><circle cx="22" cy="0" r="1.2" fill="url(#gg)"/><circle cx="0" cy="22" r="1.2" fill="url(#gg)"/><path d="M12 12l3-1 1 3-3 1z" fill="url(#gg)"/>'; }
    },
    red: {
      defs: '',
      frame: function (W, H) { return frame(W, H, 0, '#8b0a1a', 2.7) + frame(W, H, 3.5, '#d4a017', .7); },
      edge: function (L) { return loop(L, 6, function (x) { return '<circle cx="' + r(x) + '" cy="6.2" r=".95" fill="#d4a017"/><path d="M' + r(x + 3) + ' 5.2l.9 1-.9 1-.9-1z" fill="#8b0a1a"/>'; }); },
      corner: function () { return '<path d="M0 24Q0 0 24 0" fill="none" stroke="#d4a017" stroke-width=".7"/>' + petals(9, 9, 8, 1.9, 4.4, 4.6, '#8b0a1a', 0) + petals(9, 9, 8, 1.3, 3, 3.2, '#d4a017', 22.5) + '<circle cx="9" cy="9" r="1.9" fill="#8b0a1a" stroke="#d4a017" stroke-width=".5"/><circle cx="22" cy="3.5" r="1" fill="#d4a017"/><circle cx="3.5" cy="22" r="1" fill="#d4a017"/>'; }
    },
    blue: {
      defs: '',
      frame: function (W, H) { return frame(W, H, 0, '#0b2e79', 2.2) + frame(W, H, 2.9, '#2f6bff', .55); },
      edge: function (L) { return loop(L, 5, function (x) { return '<rect x="' + r(x - .7) + '" y="4.4" width="1.4" height="1.4" fill="#0b2e79" transform="rotate(45 ' + r(x) + ' 5.1)"/>'; }); },
      corner: function () { return '<rect x="-1" y="-1" width="13" height="13" fill="#fff" stroke="#0b2e79" stroke-width="1.6"/><rect x="2.6" y="2.6" width="5.8" height="5.8" fill="#2f6bff"/><path d="M0 22A22 22 0 0 1 22 0" fill="none" stroke="#2f6bff" stroke-width=".8"/><path d="M0 17A17 17 0 0 1 17 0" fill="none" stroke="#0b2e79" stroke-width=".5"/>'; }
    },
    pink: {
      defs: '',
      frame: function (W, H) { return frame(W, H, 0, '#be185d', 1.7, 'rx="7"') + frame(W, H, 2.9, '#f472b6', .8, 'rx="5" stroke-dasharray="1.4 1.6"'); },
      edge: function (L) { return loop(L, 12, function (x, i) { return heart(x, 6.6, 1, i % 2 ? '#f472b6' : '#be185d'); }); },
      corner: function () { return heart(10, 10, 2.6, '#be185d') + heart(20, 5, 1.2, '#f472b6') + heart(5, 20, 1.2, '#f472b6') + '<circle cx="24" cy="2" r=".9" fill="#be185d"/><circle cx="2" cy="24" r=".9" fill="#be185d"/>'; }
    },
    floral: {
      defs: '',
      frame: function (W, H) { return frame(W, H, 0, '#166534', .8) + frame(W, H, 2.5, '#16a34a', .35); },
      edge: function (L) {
        var d = 'M0 5.6', n = Math.floor(L / 14), s = '', i; for (i = 0; i < n; i++) d += 'q3.5 -3.6 7 0t7 0';
        var off = (L - n * 14) / 2; s += '<g transform="translate(' + r(off) + ' 0)"><path d="' + d + '" fill="none" stroke="#166534" stroke-width=".55"/>';
        for (i = 0; i < n; i++) s += '<ellipse cx="' + (i * 14 + 3.5) + '" cy="3.3" rx="1.7" ry=".8" transform="rotate(-25 ' + (i * 14 + 3.5) + ' 3.3)" fill="#22c55e"/><ellipse cx="' + (i * 14 + 10.5) + '" cy="7.9" rx="1.7" ry=".8" transform="rotate(-25 ' + (i * 14 + 10.5) + ' 7.9)" fill="#22c55e"/><circle cx="' + (i * 14 + 7) + '" cy="5.6" r="1.5" fill="#e11d6a"/><circle cx="' + (i * 14 + 7) + '" cy="5.6" r=".55" fill="#fde047"/>';
        return s + '</g>';
      },
      corner: function () { return '<ellipse cx="20" cy="5" rx="5" ry="1.8" transform="rotate(-20 20 5)" fill="#22c55e"/><ellipse cx="5" cy="20" rx="5" ry="1.8" transform="rotate(-70 5 20)" fill="#22c55e"/><ellipse cx="17" cy="17" rx="4" ry="1.5" transform="rotate(45 17 17)" fill="#16a34a"/>' + petals(9, 9, 6, 2.6, 4.6, 4.6, '#e11d6a', 0) + petals(9, 9, 6, 1.6, 2.8, 2.8, '#fb7185', 30) + '<circle cx="9" cy="9" r="2.1" fill="#facc15"/><circle cx="9" cy="9" r=".8" fill="#b45309"/>'; }
    },
    double: {
      defs: '',
      frame: function (W, H) { return frame(W, H, 0, '#1b2a49', 1.7) + frame(W, H, 2.6, '#1b2a49', .45); },
      edge: function () { return ''; },
      corner: function () { return '<rect x="-1.2" y="-1.2" width="6" height="6" fill="#1b2a49"/><rect x="5.6" y="-1" width="1" height="4.6" fill="#1b2a49"/><rect x="-1" y="5.6" width="4.6" height="1" fill="#1b2a49"/>'; }
    },
    modern: {
      defs: '',
      frame: function (W, H) { return frame(W, H, 0, '#cbd5e1', .45) + '<rect x="' + r(W / 2 - 14) + '" y="' + (M - .9) + '" width="28" height="1.8" fill="#0891b2"/><rect x="' + r(W / 2 - 14) + '" y="' + r(H - M - .9) + '" width="28" height="1.8" fill="#0891b2"/>'; },
      edge: function () { return ''; },
      corner: function () { return '<path d="M-1.6 18V-1.6H18" fill="none" stroke="#0891b2" stroke-width="2.2" stroke-linecap="square"/><path d="M3 11V3h8" fill="none" stroke="#0f172a" stroke-width=".7"/>'; }
    },
    trad: {
      defs: '',
      frame: function (W, H) { return frame(W, H, 0, '#7b1e1e', 2.9) + frame(W, H, 3.5, '#e8750a', .8) + frame(W, H, 8.6, '#7b1e1e', .4); },
      edge: function (L) { return loop(L, 5, function (x, i) { return '<path d="M' + r(x - 2.2) + ' 4.8L' + r(x) + ' 7.9L' + r(x + 2.2) + ' 4.8Z" fill="' + (i % 2 ? '#7b1e1e' : '#e8750a') + '"/>'; }); },
      corner: function () { return '<circle cx="11" cy="11" r="9" fill="#fff6ea" stroke="#7b1e1e" stroke-width=".7"/>' + petals(11, 11, 8, 1.7, 3.6, 4.2, '#e8750a', 0) + petals(11, 11, 8, 1.1, 2.2, 2.4, '#7b1e1e', 22.5) + '<circle cx="11" cy="11" r="1.7" fill="#7b1e1e"/><circle cx="24" cy="2.5" r=".9" fill="#e8750a"/><circle cx="2.5" cy="24" r=".9" fill="#e8750a"/>'; }
    }
  };

  function svg(id, W, H, opt) {
    opt = opt || {}; var s = S[id]; if (!s) return '';
    W = r(W); H = r(H);
    var out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + (opt.w || '100%') + '" height="' + (opt.h || '100%') + '" preserveAspectRatio="none" style="display:block"><defs>' + s.defs + '</defs>' + s.frame(W, H);
    var Lt = W - 2 * M - 2 * CR, Lv = H - 2 * M - 2 * CR;
    if (Lt > 10) out += '<g transform="translate(' + (M + CR) + ' ' + M + ')">' + s.edge(Lt) + '</g><g transform="translate(' + (W - M - CR) + ' ' + (H - M) + ') rotate(180)">' + s.edge(Lt) + '</g>';
    if (Lv > 10) out += '<g transform="translate(' + M + ' ' + (H - M - CR) + ') rotate(-90)">' + s.edge(Lv) + '</g><g transform="translate(' + (W - M) + ' ' + (M + CR) + ') rotate(90)">' + s.edge(Lv) + '</g>';
    var c = s.corner();
    out += '<g transform="translate(' + M + ' ' + M + ')">' + c + '</g><g transform="translate(' + (W - M) + ' ' + M + ') scale(-1 1)">' + c + '</g><g transform="translate(' + M + ' ' + (H - M) + ') scale(1 -1)">' + c + '</g><g transform="translate(' + (W - M) + ' ' + (H - M) + ') scale(-1 -1)">' + c + '</g>';
    return out + '</svg>';
  }

  var cache = {};
  function image(id, pw, ph) {
    pw = Math.round(pw); ph = Math.round(ph);
    var key = id + pw + 'x' + ph;
    if (cache[key]) return cache[key];
    return cache[key] = new Promise(function (res) {
      if (id === 'none' || !S[id]) return res(null);
      var k = 297 / Math.max(pw, ph), im = new Image();
      im.onload = function () { res(im); };
      im.onerror = function () { res(null); };
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(id, pw * k, ph * k, { w: pw, h: ph }));
    });
  }

  function options(sel) { return Object.keys(info).map(function (k) { return '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + info[k].name + '</option>'; }).join(''); }

  CSC.borders = { info: info, svg: svg, image: image, options: options, margin: M };
})();
