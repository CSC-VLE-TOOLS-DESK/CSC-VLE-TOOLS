/* CSC VLE TOOLS v27: Couple Photo, Family Photo, Document Album and ID Card Album Cover tools.
   Needs site.js and borders.js. Everything runs in the browser; photos are not uploaded. */
(function () {
  'use strict';
  var CSC = window.CSC, T = CSC.tools, esc = CSC.esc, B = CSC.borders;
  function q(root, s) { return root.querySelector(s); }
  function mk(w, h) { var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
  function lum(hex) { var n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; }

  /* file -> canvas (longest side <= max) */
  function fileCanvas(file, max) {
    return CSC.fileToImage(file).then(function (im) {
      var s = Math.min(1, (max || 1800) / Math.max(im.naturalWidth, im.naturalHeight)), c = mk(im.naturalWidth * s, im.naturalHeight * s);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(im._url); return c;
    });
  }
  /* simple auto-enhance: stretch levels (1%..99%) + a little colour */
  function enhance(src) {
    var c = mk(src.width, src.height), x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(src, 0, 0);
    var id = x.getImageData(0, 0, c.width, c.height), d = id.data, hist = new Uint32Array(256), i, n = c.width * c.height;
    for (i = 0; i < d.length; i += 4) hist[(d[i] * 77 + d[i + 1] * 150 + d[i + 2] * 29) >> 8]++;
    var lo = 0, hi = 255, a = 0; while (lo < 255 && (a += hist[lo]) < n * 0.01) lo++; a = 0; while (hi > 0 && (a += hist[hi]) < n * 0.01) hi--;
    if (hi - lo < 40) { lo = 0; hi = 255; }
    var k = 255 / (hi - lo);
    for (i = 0; i < d.length; i += 4) {
      var r = (d[i] - lo) * k, g = (d[i + 1] - lo) * k, b = (d[i + 2] - lo) * k, l = r * .299 + g * .587 + b * .114;
      r = l + (r - l) * 1.12; g = l + (g - l) * 1.12; b = l + (b - l) * 1.12;
      d[i] = r < 0 ? 0 : r > 255 ? 255 : r; d[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g; d[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
    }
    x.putImageData(id, 0, 0); return c;
  }

  /* ---------- AI cut-out (same MODNet model as the AI Background Remover tool; needs internet the first time) ---------- */
  var TF = null, mdl = null, prc = null;
  async function aiCut(src, say) {
    try {
      if (!TF) { say('Loading AI library…'); TF = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2'); TF.env.allowLocalModels = false; try { TF.env.backends.onnx.wasm.numThreads = 1; } catch (e) { } }
      if (!mdl) { say('Loading AI model… first time only'); mdl = await TF.AutoModel.from_pretrained('Xenova/modnet', { quantized: false }); prc = await TF.AutoProcessor.from_pretrained('Xenova/modnet'); }
      say('Removing background…');
      var url = URL.createObjectURL(await CSC.canvasBlob(src, 'image/png')), img = await TF.RawImage.fromURL(url);
      var pv = (await prc(img)).pixel_values, out = (await mdl({ input: pv })).output;
      var m = await TF.RawImage.fromTensor(out[0].mul(255).to('uint8')).resize(src.width, src.height);
      var c = mk(src.width, src.height), x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(src, 0, 0);
      var id = x.getImageData(0, 0, c.width, c.height), i; for (i = 0; i < c.width * c.height; i++) id.data[i * 4 + 3] = m.data[i];
      x.putImageData(id, 0, 0); URL.revokeObjectURL(url); return c;
    } catch (e) {
      say('AI could not run (' + (e.message || e) + '). Using simple background remover instead.');
      var px = src.getContext('2d').getImageData(2, 2, 1, 1).data;
      return CSC.removeBg(src, [px[0], px[1], px[2]], 40, true, 60);
    }
  }

  /* ---------- drawing helpers ---------- */
  function cover(x, src, rx, ry, rw, rh, it) {
    it = it || {}; var z = it.zoom || 1, s = Math.max(rw / src.width, rh / src.height) * z, dw = src.width * s, dh = src.height * s;
    x.drawImage(src, rx + (rw - dw) / 2 + (it.ox || 0) / 100 * rw / 2, ry + (rh - dh) / 2 + (it.oy || 0) / 100 * rh / 2, dw, dh);
  }
  function pathRR(x, rx, ry, w, h, r) { x.beginPath(); x.moveTo(rx + r, ry); x.arcTo(rx + w, ry, rx + w, ry + h, r); x.arcTo(rx + w, ry + h, rx, ry + h, r); x.arcTo(rx, ry + h, rx, ry, r); x.arcTo(rx, ry, rx + w, ry, r); x.closePath(); }
  function pathArch(x, rx, ry, w, h) { var r = w / 2; x.beginPath(); x.moveTo(rx, ry + h); x.lineTo(rx, ry + r); x.arc(rx + r, ry + r, r, Math.PI, 0); x.lineTo(rx + w, ry + h); x.closePath(); }
  function pathCircle(x, cx, cy, r) { x.beginPath(); x.arc(cx, cy, r, 0, 7); x.closePath(); }
  function pathHeart(x, cx, top, w) { var h = w * 0.92; x.beginPath(); x.moveTo(cx, top + h * 0.3); x.bezierCurveTo(cx, top, cx - w / 2, top, cx - w / 2, top + h * 0.33); x.bezierCurveTo(cx - w / 2, top + h * 0.62, cx - w * 0.18, top + h * 0.8, cx, top + h); x.bezierCurveTo(cx + w * 0.18, top + h * 0.8, cx + w / 2, top + h * 0.62, cx + w / 2, top + h * 0.33); x.bezierCurveTo(cx + w / 2, top, cx, top, cx, top + h * 0.3); x.closePath(); }
  function fitText(x, t, cx, y, maxW, size, font, weight) {
    var s = size; x.font = (weight || 'bold') + ' ' + s + 'px ' + font; while (x.measureText(t).width > maxW && s > 12) { s -= 2; x.font = (weight || 'bold') + ' ' + s + 'px ' + font; } x.fillText(t, cx, y);
  }

  var BGS = [['Royal Red', '#7a0c1c', '#c1121f'], ['Maroon Gold', '#4a0a14', '#8b1a2b'], ['Navy', '#0a1a4a', '#1f4fd0'], ['Pink Rose', '#fbcfe8', '#f472b6'], ['Cream', '#fff8e8', '#f3e1b8'], ['Mint', '#e6f7ee', '#b7e4c7'], ['Sky', '#e0f2fe', '#93c5fd'], ['Purple', '#3b0764', '#7e22ce'], ['White', '#ffffff', '#f1f5f9'], ['Black', '#111111', '#2b2b2b']];
  var FONTS = [['Elegant (Georgia)', 'Georgia,serif'], ['Script (Brush)', '"Brush Script MT","Segoe Script",cursive'], ['Clean (Arial)', 'Arial,sans-serif'], ['Classic (Times)', '"Times New Roman",serif']];
  var SIZES = [['A4 Portrait', 1240, 1754], ['A4 Landscape', 1754, 1240], ['4 x 6 inch Portrait', 1200, 1800], ['6 x 4 inch Landscape', 1800, 1200], ['Square (Instagram)', 1400, 1400], ['WhatsApp Status', 1080, 1920]];

  /* =============== Couple + Family photo studio =============== */
  function studio(root, kind) {
    var fam = kind === 'family', MAXP = fam ? 8 : 2, items = [], tok = 0, busy = false;
    var layouts = fam ? [['grid', 'Photo grid'], ['hero', 'Big centre photo + row'], ['circles', 'Round photos'], ['stand', 'Standing together (AI cut-out)']]
      : [['arch', 'Two arches + heart'], ['circle', 'Two round frames'], ['heart', 'Heart shape'], ['diag', 'Diagonal split'], ['stand', 'Standing together (AI cut-out)']];
    root.innerHTML = '<div class="t-grid sticky-pv"><div class="card no-print">' +
      '<div class="field"><label>Photos (' + (fam ? 'up to 8 family members' : 'person 1 and person 2') + ')</label><div id="dz"></div></div><div id="rows"></div>' +
      '<div class="row2"><div class="field"><label for="lay">Layout</label><select id="lay">' + layouts.map(function (l) { return '<option value="' + l[0] + '">' + l[1] + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="sz">Size</label><select id="sz">' + SIZES.map(function (s, i) { return '<option value="' + i + '">' + s[0] + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="field"><label>Background</label><div id="bgs" style="display:flex;flex-wrap:wrap;gap:6px"></div></div>' +
      '<div class="row2"><div class="field"><label for="bgc">Custom colour</label><input type="color" id="bgc" value="#7a0c1c"></div><div class="field"><label for="bgi">Or background picture</label><input type="file" id="bgi" accept="image/*"></div></div>' +
      '<div class="row2"><div class="field"><label for="bd">Border style</label><select id="bd">' + B.options('gold') + '</select></div><div class="field"><label for="fn">Text style</label><select id="fn">' + FONTS.map(function (f, i) { return '<option value="' + i + '">' + f[0] + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="field"><label for="tt">Heading</label><input id="tt" value="' + (fam ? 'Our Family' : 'Happy Married Life') + '"></div>' +
      '<div class="field"><label for="st">' + (fam ? 'Family name / line' : 'Names line (e.g. Rahul &amp; Priya)') + '</label><input id="st" placeholder="' + (fam ? 'Sharma Family' : 'Rahul & Priya') + '"></div>' +
      '<div class="field"><label for="ft">Bottom line (date / place)</label><input id="ft" placeholder="12 February 2027, Rohtak"></div>' +
      '<div class="field"><label><input type="checkbox" id="en" checked> Auto enhance photos (brightness, contrast, colour)</label></div>' +
      '<div class="t-actions"><button class="btn alt" id="ai" type="button"><i class="fa-solid fa-robot"></i> AI cut-out (remove photo backgrounds)</button></div><p class="hint" id="msg">AI cut-out is needed only for the “Standing together” layout. It needs internet the first time.</p>' +
      '<div class="t-actions"><button class="btn" id="dl"><i class="fa-solid fa-download"></i> Download high quality PNG</button><button class="btn alt" id="dj">JPG</button><button class="btn alt" id="pr"><i class="fa-solid fa-print"></i> Print</button></div></div>' +
      '<div class="card"><div id="pv" class="t-preview" style="text-align:center"></div></div></div>';
    var bgSel = 0, bgImg = null, say = function (t) { q(root, '#msg').textContent = t; };
    q(root, '#dz').appendChild(CSC.dropzone({ accept: 'image/*', multiple: true, label: 'Choose photos (click or drop)', icon: 'fa-images', onFiles: addFiles }));
    BGS.forEach(function (b, i) { var e = CSC.h('button', { type: 'button', title: b[0], 'aria-label': b[0], style: 'width:34px;height:34px;border-radius:8px;border:2px solid #fff;box-shadow:0 0 0 1px #888;cursor:pointer;background:linear-gradient(135deg,' + b[1] + ',' + b[2] + ')', onclick: function () { bgSel = i; bgImg = null; q(root, '#bgc').value = b[1]; draw(); } }); q(root, '#bgs').appendChild(e); });
    q(root, '#bgi').onchange = function () { var f = this.files[0]; if (!f) { bgImg = null; return draw(); } fileCanvas(f, 1600).then(function (c) { bgImg = c; draw(); }); };

    async function addFiles(fl) {
      var room = MAXP - items.length, skipped = Math.max(0, fl.length - room);
      for (var i = 0; i < fl.length && items.length < MAXP; i++) {
        try { var c = await fileCanvas(fl[i], 1800); items.push({ src: c, enh: null, cut: null, name: '', zoom: 1, ox: 0, oy: 0 }); } catch (e) { CSC.toast(e.message, true); }
      }
      if (skipped > 0) CSC.toast('Only ' + MAXP + ' photos can be used. ' + skipped + ' extra photo(s) were left out.', true);
      rows(); draw();
    }
    function rows() {
      var host = q(root, '#rows'); host.innerHTML = '';
      items.forEach(function (it, i) {
        var th = mk(60, 60); cover(th.getContext('2d'), it.src, 0, 0, 60, 60, it);
        var d = CSC.h('div', { style: 'display:grid;grid-template-columns:60px minmax(0,1fr);gap:8px;margin:8px 0;padding:8px;border:1px solid var(--line);border-radius:10px' });
        d.appendChild(th);
        var r = CSC.h('div', { html: '<input placeholder="' + (fam ? 'Name / relation (Papa, Mummy…)' : (i ? 'Name of person 2' : 'Name of person 1')) + '" value="' + esc(it.name) + '" data-k="name" aria-label="Name">' +
          '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;font-size:.78rem;margin-top:4px"><label>Zoom<input type="range" data-k="zoom" min="1" max="3" step=".05" value="' + it.zoom + '"></label><label>Left–Right<input type="range" data-k="ox" min="-100" max="100" value="' + it.ox + '"></label><label>Up–Down<input type="range" data-k="oy" min="-100" max="100" value="' + it.oy + '"></label></div>' +
          '<div class="t-actions" style="margin-top:4px"><button type="button" class="btn alt" data-m="-1" aria-label="Move earlier">↑</button><button type="button" class="btn alt" data-m="1" aria-label="Move later">↓</button><button type="button" class="btn alt" data-m="x" aria-label="Remove photo">✕</button></div>' });
        [].forEach.call(r.querySelectorAll('[data-k]'), function (e) { e.oninput = function () { var k = e.getAttribute('data-k'); it[k] = k === 'name' ? e.value : +e.value; if (k !== 'name') cover(th.getContext('2d'), it.src, 0, 0, 60, 60, it); draw(); }; });
        [].forEach.call(r.querySelectorAll('[data-m]'), function (b) { b.onclick = function () { var m = b.getAttribute('data-m'); if (m === 'x') items.splice(i, 1); else { var j = i + +m; if (j < 0 || j >= items.length) return; items.splice(j, 0, items.splice(i, 1)[0]); } rows(); draw(); }; });
        d.appendChild(r); host.appendChild(d);
      });
    }
    ['lay', 'sz', 'bgc', 'bd', 'fn', 'tt', 'st', 'ft', 'en'].forEach(function (id) { q(root, '#' + id).oninput = q(root, '#' + id).onchange = function () { if (id === 'bgc') { bgSel = -1; bgImg = null; } draw(); }; });
    q(root, '#ai').onclick = async function () {
      if (!items.length) return CSC.toast('Add photos first', true);
      for (var i = 0; i < items.length; i++) { say('Photo ' + (i + 1) + ' of ' + items.length + '…'); if (!items[i].cut) items[i].cut = await aiCut(items[i].src, say); }
      say('Done. Choose “Standing together” layout.'); q(root, '#lay').value = 'stand'; draw();
    };

    /* shapes: returns list of {t:'arch'|'circle'|'rr'|'heartHalf'..., x,y,w,h, idx} */
    function plan(L, W, H, n) {
      var s = [], top = H * 0.17, bot = H * 0.84, ah = bot - top, i;
      if (!fam) {
        if (L === 'arch') { var pw = Math.min(W * 0.36, ah / 1.35), ph = Math.min(ah * .9, pw * 1.4); [0, 1].forEach(function (k) { s.push({ t: 'arch', x: W / 2 + (k ? 1 : -1) * (W * 0.04 + (k ? 0 : pw)) , y: top + (ah - ph) / 2 - H * .02, w: pw, h: ph, i: k }); }); s.forEach(function (a, k) { a.x = k ? W / 2 + W * 0.035 : W / 2 - W * 0.035 - pw; }); s.heart = { x: W / 2, y: top + (ah - ph) / 2 + ph * .45, r: pw * .2 }; }
        else if (L === 'circle') { var r = Math.min(W * 0.235, ah * 0.4), cy = top + ah * .47; s.push({ t: 'circle', x: W / 2 - r * .72, y: cy, w: r, i: 0 }, { t: 'circle', x: W / 2 + r * .72, y: cy, w: r, i: 1 }); }
        else if (L === 'heart') { var hw = Math.min(W * 0.84, ah * 1.05); s.push({ t: 'heart', x: W / 2, y: top + (ah - hw * .92) / 2, w: hw }); }
        else if (L === 'diag') { s.push({ t: 'diag', x: W * .09, y: top, w: W * .82, h: ah }); }
        else s = standPlan(W, H, n);
      } else {
        var cols = n <= 2 ? Math.max(n, 1) : n <= 4 ? 2 : n <= 6 ? 3 : 4, rowsN = Math.ceil(Math.max(n, 1) / cols);
        if (L === 'grid' || L === 'circles') {
          var g = W * 0.025, cw = Math.min((W * 0.86 - g * (cols - 1)) / cols, (ah - g * (rowsN - 1)) / rowsN), tw = cw * cols + g * (cols - 1), th = cw * rowsN + g * (rowsN - 1), x0 = (W - tw) / 2, y0 = top + (ah - th) / 2 - H * .015;
          for (i = 0; i < n; i++) { var cc = i % cols, rr = Math.floor(i / cols), inRow = rr === rowsN - 1 ? n - rr * cols : cols, sh = (cols - inRow) * (cw + g) / 2; s.push({ t: L === 'grid' ? 'rr' : 'circle', x: L === 'grid' ? x0 + sh + cc * (cw + g) : x0 + sh + cc * (cw + g) + cw / 2, y: L === 'grid' ? y0 + rr * (cw + g) : y0 + rr * (cw + g) + cw / 2, w: L === 'grid' ? cw : cw / 2, h: cw, i: i }); }
        } else if (L === 'hero') {
          var big = Math.min(W * 0.6, ah * 0.58); s.push({ t: 'rr', x: (W - big) / 2, y: top, w: big, h: big, i: 0 });
          var rest = n - 1, per = Math.min(rest, 4), rws = Math.ceil(rest / 4) || 1, sm = Math.min((W * 0.86 - W * .02 * (per - 1)) / Math.max(per, 1), (ah - big - H * .03) / rws - W * .02, W * .24);
          for (i = 1; i < n; i++) { var k = i - 1, rw = Math.floor(k / 4), inR = Math.min(4, rest - rw * 4), tw2 = sm * inR + W * .02 * (inR - 1); s.push({ t: 'circle', x: (W - tw2) / 2 + (k % 4) * (sm + W * .02) + sm / 2, y: top + big + H * .03 + rw * (sm + W * .02) + sm / 2, w: sm / 2, h: sm, i: i }); }
        } else s = standPlan(W, H, n);
      }
      return s;
    }
    function standPlan(W, H, n) {
      var s = [], base = H * 0.80, i, mid = (n - 1) / 2, hh = Math.min(H * 0.55, W * 0.95 / Math.max(n, 1) * 1.6), step = Math.min(W * 0.86 / Math.max(n, 1), hh * .62);
      for (i = 0; i < n; i++) { var k = fam && n > 2 ? (1 - Math.abs(i - mid) / (n / 2) * .22) : 1; s.push({ t: 'stand', x: W / 2 + (i - mid) * step, y: base, h: hh * k, i: i, z: -Math.abs(i - mid) }); }
      return s.sort(function (a, b) { return a.z - b.z; });
    }

    async function render(scale) {
      var sz = SIZES[+q(root, '#sz').value], W = sz[1] * scale, H = sz[2] * scale, c = mk(W, H), x = c.getContext('2d'), bd = q(root, '#bd').value, font = FONTS[+q(root, '#fn').value][1];
      var b = bgSel >= 0 ? BGS[bgSel] : [0, q(root, '#bgc').value, q(root, '#bgc').value];
      var g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, b[1]); g.addColorStop(1, b[2]); x.fillStyle = g; x.fillRect(0, 0, W, H);
      if (bgImg) { cover(x, bgImg, 0, 0, W, H); x.fillStyle = 'rgba(0,0,0,.12)'; x.fillRect(0, 0, W, H); }
      var dark = bgImg ? true : lum(b[1]) < 0.55, ink = dark ? '#fff7dc' : '#4a1020', gold = bd !== 'none' && B.info[bd] ? B.info[bd].c2 : '#d4a017';
      x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = ink;
      var title = q(root, '#tt').value.trim(), sub = q(root, '#st').value.trim(), foot = q(root, '#ft').value.trim(), en = q(root, '#en').checked;
      if (title) { x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = W * .004; fitText(x, title, W / 2, H * 0.075, W * 0.76, W * 0.075, font); x.shadowBlur = 0; }
      if (sub) { x.fillStyle = dark ? gold : ink; fitText(x, sub, W / 2, H * 0.123, W * 0.7, W * 0.04, font, 'normal'); x.fillStyle = ink; }
      var list = items.map(function (it) { if (en && !it.enh) it.enh = enhance(it.src); return { it: it, img: en ? it.enh : it.src }; });
      var P = plan(q(root, '#lay').value, W, H, list.length), lw = W * 0.005;
      function ring(path) { x.save(); path(); x.lineWidth = lw * 2.4; x.strokeStyle = '#fff'; x.stroke(); x.lineWidth = lw * .9; x.strokeStyle = gold; x.stroke(); x.restore(); }
      function label(i, cx, y, mw) { var nm = items[i] && items[i].name.trim(); if (!nm) return; x.fillStyle = ink; x.shadowColor = 'rgba(0,0,0,.3)'; x.shadowBlur = W * .003; fitText(x, nm, cx, y, mw, W * 0.034, font); x.shadowBlur = 0; }
      function fillEmpty(path) { x.save(); path(); x.fillStyle = 'rgba(255,255,255,.18)'; x.fill(); x.restore(); }
      var cut = function (i) { return list[i] && list[i].it.cut ? list[i].it.cut : list[i] && list[i].img; };
      P.forEach(function (s) {
        var o = list[s.i], path;
        if (s.t === 'arch') { path = function () { pathArch(x, s.x, s.y, s.w, s.h); }; if (o) { x.save(); path(); x.clip(); cover(x, o.img, s.x, s.y, s.w, s.h, o.it); x.restore(); } else fillEmpty(path); ring(path); label(s.i, s.x + s.w / 2, s.y + s.h + H * 0.035, s.w * 1.1); }
        else if (s.t === 'circle') { var rr = s.h ? s.w : s.w; path = function () { pathCircle(x, s.x, s.y, rr); }; if (o) { x.save(); path(); x.clip(); cover(x, o.img, s.x - rr, s.y - rr, rr * 2, rr * 2, o.it); x.restore(); } else fillEmpty(path); ring(path); label(s.i, s.x, s.y + rr + H * 0.03, rr * 2.1); }
        else if (s.t === 'rr') { path = function () { pathRR(x, s.x, s.y, s.w, s.h, s.w * .06); }; if (o) { x.save(); path(); x.clip(); cover(x, o.img, s.x, s.y, s.w, s.h, o.it); x.restore(); } else fillEmpty(path); ring(path); label(s.i, s.x + s.w / 2, s.y + s.h + H * 0.022, s.w * 1.05); }
        else if (s.t === 'heart') { path = function () { pathHeart(x, s.x, s.y, s.w); }; x.save(); path(); x.clip(); var hh = s.w * .92; if (list[0]) cover(x, list[0].img, s.x - s.w / 2, s.y, s.w / 2, hh, list[0].it); else fillEmpty(path); if (list[1]) cover(x, list[1].img, s.x, s.y, s.w / 2, hh, list[1].it); x.restore(); ring(path); x.save(); x.clip(); x.fillStyle = '#fff'; x.fillRect(s.x - lw, s.y, lw * 2, hh); x.restore(); label(0, s.x - s.w * .25, s.y + hh + H * 0.03, s.w * .5); label(1, s.x + s.w * .25, s.y + hh + H * 0.03, s.w * .5); }
        else if (s.t === 'diag') { var A = [[s.x, s.y], [s.x + s.w * .62, s.y], [s.x + s.w * .38, s.y + s.h], [s.x, s.y + s.h]], Bq = [[s.x + s.w * .62, s.y], [s.x + s.w, s.y], [s.x + s.w, s.y + s.h], [s.x + s.w * .38, s.y + s.h]];
          [A, Bq].forEach(function (poly, k) { var p2 = function () { x.beginPath(); poly.forEach(function (p, j) { j ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); x.closePath(); }; if (list[k]) { x.save(); p2(); x.clip(); cover(x, list[k].img, s.x, s.y, s.w, s.h, list[k].it); x.restore(); } else fillEmpty(p2); p2(); x.lineWidth = lw * 2.4; x.strokeStyle = '#fff'; x.stroke(); });
          x.strokeStyle = gold; x.lineWidth = lw * .8; x.strokeRect(s.x, s.y, s.w, s.h); label(0, s.x + s.w * .22, s.y + s.h + H * 0.03, s.w * .4); label(1, s.x + s.w * .78, s.y + s.h + H * 0.03, s.w * .4); }
        else if (s.t === 'stand') { var src = cut(s.i); if (!src) return; var k = s.h / src.height, dw = src.width * k, ox = (o.it.ox || 0) / 100 * dw / 4, z = o.it.zoom || 1;
          x.save(); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = W * .015; x.shadowOffsetY = H * .004; x.drawImage(src, s.x - dw * z / 2 + ox, s.y - s.h * z, dw * z, s.h * z); x.restore(); label(s.i, s.x, s.y + H * 0.03, dw * .9); }
      });
      if (P.heart) { x.save(); x.fillStyle = '#e11d48'; x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = W * .01; pathHeart(x, P.heart.x, P.heart.y - P.heart.r * .9, P.heart.r * 2); x.fill(); x.lineWidth = lw * 1.6; x.strokeStyle = '#fff'; x.stroke(); x.restore(); }
      if (foot) { x.fillStyle = ink; fitText(x, foot, W / 2, H * 0.915, W * 0.7, W * 0.032, font, 'normal'); }
      if (bd !== 'none') { var im = await B.image(bd, W, H); if (im) x.drawImage(im, 0, 0, W, H); }
      return c;
    }
    async function draw() {
      var my = ++tok; if (busy) return; busy = true;
      try { do { my = tok; var c = await render(0.5 * (SIZES[+q(root, '#sz').value][1] > 1600 ? .7 : .8)); if (my === tok) { c.style.cssText = 'max-width:100%;height:auto;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.25)'; q(root, '#pv').innerHTML = ''; q(root, '#pv').appendChild(c); } } while (my !== tok); } finally { busy = false; }
    }
    async function out(type) {
      if (!items.length) return CSC.toast('Add photos first', true);
      CSC.toast('Making high quality picture…'); var c = await render(1), jpg = type === 'jpg';
      if (jpg) { var f = mk(c.width, c.height), fx = f.getContext('2d'); fx.fillStyle = '#fff'; fx.fillRect(0, 0, f.width, f.height); fx.drawImage(c, 0, 0); c = f; }
      return c;
    }
    q(root, '#dl').onclick = async function () { var c = await out('png'); if (c) CSC.download(await CSC.canvasBlob(c, 'image/png'), 'CSC_VLE_TOOLS_' + kind + '_photo.png'); };
    q(root, '#dj').onclick = async function () { var c = await out('jpg'); if (c) CSC.download(await CSC.canvasBlob(c, 'image/jpeg', .93), 'CSC_VLE_TOOLS_' + kind + '_photo.jpg'); };
    q(root, '#pr').onclick = async function () { var c = await out('jpg'); if (!c) return; var land = c.width > c.height; CSC.printHTML('<div style="width:' + (land ? '297mm;height:210mm' : '210mm;height:297mm') + ';display:flex;align-items:center;justify-content:center"><img src="' + c.toDataURL('image/jpeg', .9) + '" style="max-width:100%;max-height:100%"></div>', '@page{size:A4 ' + (land ? 'landscape' : 'portrait') + ';margin:0}'); };
    draw();
  }
  T.ai_couple_photo = function (root) { studio(root, 'couple'); };
  T.ai_family_photo = function (root) { studio(root, 'family'); };

  /* =============== PDF helper: JPEG canvases -> one PDF (A4 pages) =============== */
  async function pagesToPDF(canvases, name) {
    await CSC.loadScript(CSC.libs.pdflib);
    var doc = await PDFLib.PDFDocument.create();
    for (var i = 0; i < canvases.length; i++) {
      var c = canvases[i], land = c.width > c.height, pw = land ? 841.89 : 595.28, ph = land ? 595.28 : 841.89, jb = await CSC.canvasBlob(c, 'image/jpeg', .9), im = await doc.embedJpg(await jb.arrayBuffer());
      doc.addPage([pw, ph]).drawImage(im, { x: 0, y: 0, width: pw, height: ph });
    }
    CSC.download(new Blob([await doc.save()], { type: 'application/pdf' }), name);
  }
  function printPages(canvases) {
    CSC.printHTML(canvases.map(function (c) { return '<div style="width:210mm;height:297mm;page-break-after:always;overflow:hidden"><img src="' + c.toDataURL('image/jpeg', .9) + '" style="width:210mm;height:297mm;display:block"></div>'; }).join(''));
  }
  function whiteCanvas(w, h) { var c = mk(w, h), x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); return c; }
  var PW = 1240, PH = 1754; // A4 at 150 dpi

  /* =============== Document Album Creator =============== */
  T.document_album_creator = function (root) {
    var docs = [], tok = 0;
    root.innerHTML = '<div class="t-grid sticky-pv"><div class="card no-print">' +
      '<div class="field"><label>Document pictures (Aadhaar, PAN, marksheets… JPG / PNG / photos)</label><div id="dz"></div></div><div id="rows"></div>' +
      '<div class="row2"><div class="field"><label for="per">Documents on one page</label><select id="per"><option value="1">1 (large)</option><option value="2" selected>2 (top and bottom)</option><option value="4">4 (2 x 2)</option><option value="6">6 (2 x 3)</option></select></div>' +
      '<div class="field"><label for="bd">Page border</label><select id="bd">' + B.options('gold') + '</select></div></div>' +
      '<div class="row2"><div class="field"><label for="hd">Page heading (optional)</label><input id="hd" placeholder="Name / Application No."></div><div class="field"><label for="ft">Footer (optional)</label><input id="ft" placeholder="Shop name, phone"></div></div>' +
      '<div class="field"><label><input type="checkbox" id="cv" checked> Add cover page</label></div>' +
      '<div id="cvf"><div class="row2"><div class="field"><label for="ct">Cover title</label><input id="ct" value="DOCUMENT ALBUM"></div><div class="field"><label for="cn">Name</label><input id="cn" placeholder="Person / family name"></div></div>' +
      '<div class="row2"><div class="field"><label for="cs">Cover sub-line</label><input id="cs" placeholder="Important documents"></div><div class="field"><label for="cc">Cover colour</label><input type="color" id="cc" value="#7a0c1c"></div></div></div>' +
      '<div class="field"><label><input type="checkbox" id="en" checked> Make documents clearer (auto contrast)</label></div>' +
      '<div class="field"><label><input type="checkbox" id="cap" checked> Show caption under each document</label></div>' +
      '<div class="t-actions"><button class="btn" id="pdf"><i class="fa-solid fa-file-pdf"></i> Download PDF</button><button class="btn alt" id="pr"><i class="fa-solid fa-print"></i> Print</button><button class="btn alt" id="zip">Pages as JPG (ZIP)</button></div><p class="hint">Pages are A4 and made on your device. Photos are not uploaded.</p></div>' +
      '<div class="card"><div id="pv" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center"></div></div></div>';
    q(root, '#dz').appendChild(CSC.dropzone({ accept: 'image/*', multiple: true, label: 'Choose document pictures', icon: 'fa-file-image', onFiles: async function (fl) { for (var i = 0; i < fl.length; i++) { try { docs.push({ c: await fileCanvas(fl[i], 2000), rot: 0, cap: fl[i].name.replace(/\.[^.]+$/, ''), e: null }); } catch (e) { CSC.toast(e.message, true); } } rows(); draw(); } }));
    function rows() {
      var host = q(root, '#rows'); host.innerHTML = '';
      docs.forEach(function (d, i) {
        var r = CSC.h('div', { style: 'display:grid;grid-template-columns:1fr auto;gap:6px;margin:6px 0;align-items:center', html: '<input value="' + esc(d.cap) + '" aria-label="Caption ' + (i + 1) + '"><span style="white-space:nowrap"><button type="button" class="btn alt" data-a="r" aria-label="Rotate">⟳</button><button type="button" class="btn alt" data-a="u" aria-label="Move earlier">↑</button><button type="button" class="btn alt" data-a="d" aria-label="Move later">↓</button><button type="button" class="btn alt" data-a="x" aria-label="Remove">✕</button></span>' });
        r.querySelector('input').oninput = function () { d.cap = this.value; draw(); };
        [].forEach.call(r.querySelectorAll('[data-a]'), function (b) { b.onclick = function () { var a = b.getAttribute('data-a'); if (a === 'r') d.rot = (d.rot + 90) % 360; else if (a === 'x') docs.splice(i, 1); else { var j = i + (a === 'u' ? -1 : 1); if (j < 0 || j >= docs.length) return; docs.splice(j, 0, docs.splice(i, 1)[0]); } rows(); draw(); }; });
        host.appendChild(r);
      });
    }
    ['per', 'bd', 'hd', 'ft', 'cv', 'ct', 'cn', 'cs', 'cc', 'en', 'cap'].forEach(function (id) { q(root, '#' + id).oninput = q(root, '#' + id).onchange = function () { if (id === 'cv') q(root, '#cvf').style.display = this.checked ? '' : 'none'; draw(); }; });
    function oriented(d) { var src = d.c; if (q(root, '#en').checked) { d.e = d.e || enhance(d.c); src = d.e; } if (!d.rot) return src; var c = d.rot === 180 ? mk(src.width, src.height) : mk(src.height, src.width), x = c.getContext('2d'); x.translate(c.width / 2, c.height / 2); x.rotate(d.rot * Math.PI / 180); x.drawImage(src, -src.width / 2, -src.height / 2); return c; }
    async function pages(scale) {
      var W = PW * scale, H = PH * scale, bd = q(root, '#bd').value, per = +q(root, '#per').value, out = [], im = await B.image(bd, W, H), hd = q(root, '#hd').value.trim(), ft = q(root, '#ft').value.trim(), cap = q(root, '#cap').checked;
      if (q(root, '#cv').checked) out.push(await coverPage(W, H, bd, q(root, '#ct').value, q(root, '#cn').value, q(root, '#cs').value, q(root, '#cc').value, q(root, '#hd').value));
      var cols = per === 1 ? 1 : per === 2 ? 1 : 2, rws = per === 1 ? 1 : per === 2 ? 2 : per === 4 ? 2 : 3;
      for (var p = 0; p < docs.length; p += per) {
        var c = whiteCanvas(W, H), x = c.getContext('2d'); x.fillStyle = B.info[bd].soft; x.fillRect(0, 0, W, H);
        var top = H * (hd ? 0.12 : 0.07), bot = H * (ft ? 0.92 : 0.94), ax = W * 0.1, aw = W * 0.8, ah = bot - top, gap = W * 0.025, cw = (aw - gap * (cols - 1)) / cols, ch = (ah - gap * (rws - 1)) / rws;
        x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = B.info[bd].ink;
        if (hd) fitText(x, hd, W / 2, H * 0.075, W * .7, W * .04, 'Georgia,serif'); if (ft) fitText(x, ft, W / 2, H * 0.955, W * .7, W * .025, 'Arial,sans-serif', 'normal');
        for (var k = 0; k < per && p + k < docs.length; k++) {
          var d = docs[p + k], s = oriented(d), cx = ax + (k % cols) * (cw + gap), cy = top + Math.floor(k / cols) * (ch + gap), capH = cap && d.cap ? ch * .08 : 0, bw = cw, bh = ch - capH, sc = Math.min(bw / s.width, bh / s.height), dw = s.width * sc, dh = s.height * sc;
          x.save(); x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = W * .006; x.fillStyle = '#fff'; x.fillRect(cx + (bw - dw) / 2, cy + (bh - dh) / 2, dw, dh); x.restore(); x.drawImage(s, cx + (bw - dw) / 2, cy + (bh - dh) / 2, dw, dh);
          x.strokeStyle = '#999'; x.lineWidth = W * .0015; x.strokeRect(cx + (bw - dw) / 2, cy + (bh - dh) / 2, dw, dh);
          if (capH) { x.fillStyle = B.info[bd].ink; fitText(x, d.cap, cx + cw / 2, cy + bh + capH * .55, cw, W * .022, 'Arial,sans-serif', 'normal'); }
        }
        if (im) x.drawImage(im, 0, 0, W, H); out.push(c);
      }
      return out;
    }
    async function draw() {
      var my = ++tok; if (!docs.length && !q(root, '#cv').checked) { q(root, '#pv').innerHTML = '<p class="hint">Add document pictures to see the album.</p>'; return; }
      var list = await pages(.3); if (my !== tok) return; var host = q(root, '#pv'); host.innerHTML = '';
      list.forEach(function (c, i) { c.style.cssText = 'width:200px;max-width:45%;height:auto;box-shadow:0 4px 12px rgba(0,0,0,.3);border-radius:4px'; c.title = 'Page ' + (i + 1); host.appendChild(c); });
    }
    async function ready() { if (!docs.length && !q(root, '#cv').checked) { CSC.toast('Add document pictures first', true); return null; } CSC.toast('Making pages…'); return pages(1); }
    q(root, '#pdf').onclick = async function () { var l = await ready(); if (l) try { await pagesToPDF(l, 'CSC_VLE_TOOLS_document_album.pdf'); } catch (e) { CSC.toast(e.message, true); } };
    q(root, '#pr').onclick = async function () { var l = await ready(); if (l) printPages(l); };
    q(root, '#zip').onclick = async function () { var l = await ready(); if (!l) return; try { await CSC.loadScript(CSC.libs.jszip); var z = new JSZip(); for (var i = 0; i < l.length; i++) z.file('page-' + (i + 1) + '.jpg', await CSC.canvasBlob(l[i], 'image/jpeg', .9)); CSC.download(await z.generateAsync({ type: 'blob' }), 'CSC_VLE_TOOLS_album_pages.zip'); } catch (e) { CSC.toast(e.message, true); } };
    draw();
  };

  /* cover page (used by the Document Album and the ID Card Album Cover) */
  async function coverPage(W, H, bd, title, name, sub, col, org, photo) {
    var c = mk(W, H), x = c.getContext('2d'), i = B.info[bd], g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#fff'); g.addColorStop(1, i.soft); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = col; x.fillRect(W * .14, H * .2, W * .72, H * .3); x.strokeStyle = i.c2; x.lineWidth = W * .004; x.strokeRect(W * .15, H * .2 + W * .01, W * .70, H * .3 - W * .02);
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff'; fitText(x, title || 'ALBUM', W / 2, H * .31, W * .64, W * .08, 'Georgia,serif');
    if (sub) { x.fillStyle = '#ffe9a8'; fitText(x, sub, W / 2, H * .41, W * .6, W * .035, 'Georgia,serif', 'italic'); }
    if (photo) { var r = W * .13, cy = H * .62; x.save(); pathCircle(x, W / 2, cy, r); x.clip(); cover(x, photo, W / 2 - r, cy - r, r * 2, r * 2); x.restore(); pathCircle(x, W / 2, cy, r); x.lineWidth = W * .006; x.strokeStyle = i.c2; x.stroke(); }
    x.fillStyle = i.ink; if (name) fitText(x, name, W / 2, photo ? H * .79 : H * .64, W * .7, W * .06, 'Georgia,serif');
    if (org) { x.fillStyle = i.ink; fitText(x, org, W / 2, H * .88, W * .7, W * .03, 'Arial,sans-serif', 'normal'); }
    var im = await B.image(bd, W, H); if (im) x.drawImage(im, 0, 0, W, H); return c;
  }

  /* =============== ID Card Album Cover Creator =============== */
  T.idcard_album_cover = function (root) {
    var photo = null, f1 = null, f2 = null, tok = 0;
    root.innerHTML = '<div class="t-grid sticky-pv"><div class="card no-print">' +
      '<div class="row2"><div class="field"><label for="ct">Cover title</label><input id="ct" value="ID CARD ALBUM"></div><div class="field"><label for="cs">Sub-line</label><input id="cs" value="Identity Documents"></div></div>' +
      '<div class="row2"><div class="field"><label for="cn">Name</label><input id="cn" placeholder="Name of card holder"></div><div class="field"><label for="co">Shop / organisation, phone</label><input id="co" placeholder="CSC Centre, Rohtak 98xxxxxx"></div></div>' +
      '<div class="row2"><div class="field"><label for="bd">Border style</label><select id="bd">' + B.options('red') + '</select></div><div class="field"><label for="cc">Cover colour</label><input type="color" id="cc" value="#7a0c1c"></div></div>' +
      '<div class="field"><label for="ph">Photo (optional, round)</label><input type="file" id="ph" accept="image/*"></div>' +
      '<div class="row2"><div class="field"><label for="a1">ID card front (optional)</label><input type="file" id="a1" accept="image/*"></div><div class="field"><label for="a2">ID card back (optional)</label><input type="file" id="a2" accept="image/*"></div></div>' +
      '<div class="field"><label><input type="checkbox" id="pg" checked> Add a second page with the card(s) at real size (85.6 × 54 mm)</label></div>' +
      '<div class="t-actions"><button class="btn" id="pdf"><i class="fa-solid fa-file-pdf"></i> Download PDF</button><button class="btn alt" id="png">Cover as PNG</button><button class="btn alt" id="pr"><i class="fa-solid fa-print"></i> Print</button></div></div>' +
      '<div class="card"><div id="pv" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center"></div></div></div>';
    ['ct', 'cs', 'cn', 'co', 'bd', 'cc', 'pg'].forEach(function (id) { q(root, '#' + id).oninput = q(root, '#' + id).onchange = draw; });
    [['ph', function (c) { photo = c; }], ['a1', function (c) { f1 = c; }], ['a2', function (c) { f2 = c; }]].forEach(function (p) { q(root, '#' + p[0]).onchange = function () { var f = this.files[0]; if (!f) { p[1](null); return draw(); } fileCanvas(f, 1600).then(function (c) { p[1](c); draw(); }, function (e) { CSC.toast(e.message, true); }); }; });
    async function pages(s) {
      var W = PW * s, H = PH * s, bd = q(root, '#bd').value, out = [await coverPage(W, H, bd, q(root, '#ct').value, q(root, '#cn').value, q(root, '#cs').value, q(root, '#cc').value, q(root, '#co').value, photo)];
      if (q(root, '#pg').checked && (f1 || f2)) {
        var c = whiteCanvas(W, H), x = c.getContext('2d'), mmw = W / 210, cw = 85.6 * mmw, ch = 54 * mmw, cards = [f1, f2].filter(Boolean), im = await B.image(bd, W, H); x.fillStyle = B.info[bd].soft; x.fillRect(0, 0, W, H);
        x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = B.info[bd].ink; fitText(x, q(root, '#cn').value || q(root, '#ct').value, W / 2, H * .09, W * .7, W * .045, 'Georgia,serif');
        cards.forEach(function (cd, i) { var y = H * (cards.length === 1 ? .3 : .2 + i * .3); x.save(); x.shadowColor = 'rgba(0,0,0,.3)'; x.shadowBlur = W * .006; x.fillStyle = '#fff'; x.fillRect((W - cw) / 2, y, cw, ch); x.restore(); cover(x, cd, (W - cw) / 2, y, cw, ch); x.strokeStyle = '#999'; x.lineWidth = 1; x.strokeRect((W - cw) / 2, y, cw, ch); x.fillStyle = B.info[bd].ink; fitText(x, (cards.length === 2 ? (i ? 'Back' : 'Front') : 'ID Card'), W / 2, y + ch + H * .025, W * .3, W * .022, 'Arial,sans-serif', 'normal'); });
        if (im) x.drawImage(im, 0, 0, W, H); out.push(c);
      }
      return out;
    }
    async function draw() { var my = ++tok, l = await pages(.3); if (my !== tok) return; var host = q(root, '#pv'); host.innerHTML = ''; l.forEach(function (c) { c.style.cssText = 'width:240px;max-width:48%;height:auto;box-shadow:0 4px 12px rgba(0,0,0,.3);border-radius:4px'; host.appendChild(c); }); }
    q(root, '#pdf').onclick = async function () { try { await pagesToPDF(await pages(1), 'CSC_VLE_TOOLS_id_album_cover.pdf'); } catch (e) { CSC.toast(e.message, true); } };
    q(root, '#png').onclick = async function () { var l = await pages(1); CSC.download(await CSC.canvasBlob(l[0], 'image/png'), 'CSC_VLE_TOOLS_id_album_cover.png'); };
    q(root, '#pr').onclick = async function () { printPages(await pages(1)); };
    draw();
  };
})();
