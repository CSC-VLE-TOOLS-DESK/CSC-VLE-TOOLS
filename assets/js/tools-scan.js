/* CSC VLE TOOLS v27: Mobile Cam Scanner.
   Take a photo of a paper, drag 4 corners, straighten it, clean it (Magic colour / Grey / Black & White) and save as PDF or JPG.
   Runs in the browser. Pictures are not uploaded. */
(function () {
  'use strict';
  var CSC = window.CSC, T = CSC.tools, esc = CSC.esc;
  function q(root, s) { return root.querySelector(s); }
  function mk(w, h) { var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function fileCanvas(file, max) {
    return CSC.fileToImage(file).then(function (im) {
      var s = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight)), c = mk(im.naturalWidth * s, im.naturalHeight * s);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(im._url); return c;
    });
  }
  function rotate(src, cw) {
    var c = mk(src.height, src.width), x = c.getContext('2d'); x.translate(c.width / 2, c.height / 2); x.rotate((cw ? 1 : -1) * Math.PI / 2); x.drawImage(src, -src.width / 2, -src.height / 2); return c;
  }

  /* perspective warp: quad (pixel pts TL,TR,BR,BL) -> upright rectangle */
  function warp(src, p, ow, oh) {
    var x0 = p[0][0], y0 = p[0][1], x1 = p[1][0], y1 = p[1][1], x2 = p[2][0], y2 = p[2][1], x3 = p[3][0], y3 = p[3][1];
    var dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3, a, b, c, d, e, f, g = 0, h = 0;
    if (Math.abs(dx3) < 1e-9 && Math.abs(dy3) < 1e-9) { a = x1 - x0; b = x3 - x0; d = y1 - y0; e = y3 - y0; }
    else { var den = dx1 * dy2 - dx2 * dy1; g = (dx3 * dy2 - dx2 * dy3) / den; h = (dx1 * dy3 - dx3 * dy1) / den; a = x1 - x0 + g * x1; b = x3 - x0 + h * x3; d = y1 - y0 + g * y1; e = y3 - y0 + h * y3; }
    c = x0; f = y0;
    var sw = src.width, sh = src.height, sd = src.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, sw, sh).data, out = mk(ow, oh), ox = out.getContext('2d'), od = ox.createImageData(ow, oh), o = od.data, i, j;
    for (j = 0; j < oh; j++) for (i = 0; i < ow; i++) {
      var u = i / (ow - 1 || 1), v = j / (oh - 1 || 1), w = g * u + h * v + 1, X = (a * u + b * v + c) / w, Y = (d * u + e * v + f) / w;
      X = clamp(X, 0, sw - 1.001); Y = clamp(Y, 0, sh - 1.001);
      var xi = X | 0, yi = Y | 0, fx = X - xi, fy = Y - yi, k = (yi * sw + xi) * 4, k2 = k + sw * 4, t = (j * ow + i) * 4, m;
      for (m = 0; m < 3; m++) o[t + m] = (sd[k + m] * (1 - fx) + sd[k + 4 + m] * fx) * (1 - fy) + (sd[k2 + m] * (1 - fx) + sd[k2 + 4 + m] * fx) * fy;
      o[t + 3] = 255;
    }
    ox.putImageData(od, 0, 0); return out;
  }

  /* clean-up filters. Paper colour is estimated from a blurred copy, so shadows go away. */
  function clean(src, mode) {
    if (mode === 'orig') return src;
    var w = src.width, h = src.height, c = mk(w, h), x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(src, 0, 0); var id = x.getImageData(0, 0, w, h), d = id.data, i;
    if (mode === 'enh') {
      var lo = 255, hi = 0, hist = new Uint32Array(256), n = w * h; for (i = 0; i < d.length; i += 4) hist[(d[i] * 77 + d[i + 1] * 150 + d[i + 2] * 29) >> 8]++;
      var a = 0; lo = 0; while (lo < 254 && (a += hist[lo]) < n * .01) lo++; a = 0; hi = 255; while (hi > 1 && (a += hist[hi]) < n * .01) hi--; var k = 255 / Math.max(40, hi - lo);
      for (i = 0; i < d.length; i += 4) { d[i] = clamp((d[i] - lo) * k, 0, 255); d[i + 1] = clamp((d[i + 1] - lo) * k, 0, 255); d[i + 2] = clamp((d[i + 2] - lo) * k, 0, 255); }
      x.putImageData(id, 0, 0); return c;
    }
    var sm = mk(Math.max(8, w / 24), Math.max(8, h / 24)), sx = sm.getContext('2d'); sx.imageSmoothingQuality = 'high'; sx.drawImage(src, 0, 0, sm.width, sm.height);
    var bg = mk(w, h), bx = bg.getContext('2d', { willReadFrequently: true }); bx.imageSmoothingEnabled = true; bx.imageSmoothingQuality = 'high'; bx.drawImage(sm, 0, 0, w, h);
    var bd = bx.getImageData(0, 0, w, h).data;
    for (i = 0; i < d.length; i += 4) {
      var bl = Math.max(60, bd[i] * .299 + bd[i + 1] * .587 + bd[i + 2] * .114), l = d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114, r = l / bl;
      if (mode === 'bw') { var v = r > .84 ? 255 : r < .6 ? 0 : (r - .6) / .24 * 255; d[i] = d[i + 1] = d[i + 2] = v; }
      else if (mode === 'gray') { var g = clamp((r - .42) / .55, 0, 1) * 255; d[i] = d[i + 1] = d[i + 2] = g; }
      else { var s = 255 / bl * 0.97; d[i] = clamp(((d[i] * s) - 128) * 1.12 + 128 + 6, 0, 255); d[i + 1] = clamp(((d[i + 1] * s) - 128) * 1.12 + 128 + 6, 0, 255); d[i + 2] = clamp(((d[i + 2] * s) - 128) * 1.12 + 128 + 6, 0, 255); }
    }
    x.putImageData(id, 0, 0); return c;
  }

  /* rough automatic edge finder: box around the area with most edges */
  function autoPts(src) {
    var w = 160, h = Math.round(160 * src.height / src.width), c = mk(w, h), x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(src, 0, 0, w, h);
    var d = x.getImageData(0, 0, w, h).data, gr = new Float32Array(w * h), i, j; for (i = 0; i < w * h; i++) gr[i] = d[i * 4] * .299 + d[i * 4 + 1] * .587 + d[i * 4 + 2] * .114;
    var col = new Float32Array(w), row = new Float32Array(h), tot = 0, cnt = 0;
    for (j = 1; j < h - 1; j++) for (i = 1; i < w - 1; i++) { var m = Math.abs(gr[j * w + i + 1] - gr[j * w + i - 1]) + Math.abs(gr[(j + 1) * w + i] - gr[(j - 1) * w + i]); tot += m; cnt++; if (m > 40) { col[i]++; row[j]++; } }
    function span(a, n, minC) { var s = 0, e = n - 1; while (s < n && a[s] < minC) s++; while (e > s && a[e] < minC) e--; return [s, e]; }
    var cs = span(col, w, h * .06), rs = span(row, h, w * .06);
    if (cs[1] - cs[0] < w * .3 || rs[1] - rs[0] < h * .3) return null;
    var l = cs[0] / w, r = (cs[1] + 1) / w, t = rs[0] / h, b = (rs[1] + 1) / h; return [[l, t], [r, t], [r, b], [l, b]];
  }

  T.mobile_cam_scanner = function (root) {
    var pages = [], cur = -1, stream = null;
    var FILTERS = [['magic', 'Magic colour'], ['orig', 'Original'], ['gray', 'Grey'], ['bw', 'Black & White'], ['enh', 'Enhance']];
    root.innerHTML = '<div class="card no-print"><div class="t-actions">' +
      '<button class="btn" id="cam"><i class="fa-solid fa-camera"></i> Open camera</button>' +
      '<label class="btn alt" style="cursor:pointer"><i class="fa-solid fa-mobile-screen"></i> Take photo (phone)<input id="cap" type="file" accept="image/*" capture="environment" style="display:none"></label>' +
      '<label class="btn alt" style="cursor:pointer"><i class="fa-solid fa-images"></i> Choose pictures<input id="fil" type="file" accept="image/*" multiple style="display:none"></label></div>' +
      '<p class="hint">Place the paper on a dark table in good light. Take the photo, then drag the 4 corners to the paper edges. Everything stays on your device.</p>' +
      '<div id="live" hidden style="margin-top:10px"><video id="vid" autoplay playsinline muted style="width:100%;max-width:520px;border-radius:10px;background:#000"></video><div class="t-actions"><button class="btn" id="snap"><i class="fa-solid fa-circle-dot"></i> Capture</button><button class="btn alt" id="stop">Close camera</button></div></div></div>' +
      '<div id="work" hidden><div class="t-grid" style="margin-top:14px"><div class="card"><h3 style="margin:0 0 6px;color:var(--brand)">1. Drag corners</h3><canvas id="ed" style="width:100%;max-width:560px;touch-action:none;border-radius:8px;background:#222;display:block;margin:auto"></canvas>' +
      '<div class="t-actions"><button class="btn alt" id="auto">Auto fit</button><button class="btn alt" id="rst">Reset</button><button class="btn alt" id="rl">⟲ Rotate</button><button class="btn alt" id="rr">⟳ Rotate</button></div></div>' +
      '<div class="card"><h3 style="margin:0 0 6px;color:var(--brand)">2. Scan result</h3><div class="field"><label for="flt">Look</label><select id="flt">' + FILTERS.map(function (f) { return '<option value="' + f[0] + '">' + f[1] + '</option>'; }).join('') + '</select></div><div style="text-align:center"><canvas id="res" style="max-width:100%;max-height:520px;border:1px solid var(--line);background:#fff"></canvas></div></div></div>' +
      '<div class="card" style="margin-top:14px"><h3 style="margin:0 0 6px;color:var(--brand)">Pages <span id="cnt"></span></h3><div id="th" style="display:flex;gap:10px;flex-wrap:wrap"></div>' +
      '<div class="row2" style="margin-top:10px"><div class="field"><label for="ps">PDF page size</label><select id="ps"><option value="a4">A4 (fit the page)</option><option value="fit">Same shape as the scan</option></select></div></div>' +
      '<div class="t-actions"><button class="btn" id="pdf"><i class="fa-solid fa-file-pdf"></i> Download PDF</button><button class="btn alt" id="jpg">Download JPG (this page)</button><button class="btn alt" id="pr"><i class="fa-solid fa-print"></i> Print</button><button class="btn alt" id="del">Delete this page</button></div></div></div>';

    var ed = q(root, '#ed'), ex = ed.getContext('2d'), res = q(root, '#res'), drag = -1;
    function stopCam() { if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; } q(root, '#live').hidden = true; }
    q(root, '#cam').onclick = async function () {
      try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false }); q(root, '#vid').srcObject = stream; q(root, '#live').hidden = false; }
      catch (e) { CSC.toast('Camera not available (' + (e.name || 'error') + '). Use “Take photo (phone)” or “Choose pictures”.', true); }
    };
    q(root, '#stop').onclick = stopCam;
    q(root, '#snap').onclick = function () { var v = q(root, '#vid'); if (!v.videoWidth) return; var c = mk(v.videoWidth, v.videoHeight); c.getContext('2d').drawImage(v, 0, 0); addPage(c); };
    function files(fl) { [].slice.call(fl).forEach(function (f) { fileCanvas(f, 2400).then(addPage, function (e) { CSC.toast(e.message, true); }); }); }
    q(root, '#cap').onchange = function () { files(this.files); this.value = ''; };
    q(root, '#fil').onchange = function () { files(this.files); this.value = ''; };
    function addPage(c) { var p = { src: c, pts: autoPts(c) || [[.05, .05], [.95, .05], [.95, .95], [.05, .95]], flt: 'magic', out: null }; pages.push(p); select(pages.length - 1); }
    function select(i) { cur = i; q(root, '#work').hidden = !pages.length; if (i < 0) return; q(root, '#flt').value = pages[i].flt; drawEd(); compute(); thumbs(); }
    function drawEd() {
      var p = pages[cur]; if (!p) return; var s = Math.min(1, 1100 / Math.max(p.src.width, p.src.height)); ed.width = Math.round(p.src.width * s); ed.height = Math.round(p.src.height * s);
      ex.drawImage(p.src, 0, 0, ed.width, ed.height); var pts = p.pts.map(function (a) { return [a[0] * ed.width, a[1] * ed.height]; }), r = Math.max(10, ed.width / 40);
      ex.fillStyle = 'rgba(0,0,0,.4)'; ex.fillRect(0, 0, ed.width, ed.height); ex.save(); ex.beginPath(); pts.forEach(function (a, i) { i ? ex.lineTo(a[0], a[1]) : ex.moveTo(a[0], a[1]); }); ex.closePath(); ex.clip(); ex.drawImage(p.src, 0, 0, ed.width, ed.height); ex.restore();
      ex.lineWidth = Math.max(2, ed.width / 300); ex.strokeStyle = '#22d3ee'; ex.beginPath(); pts.forEach(function (a, i) { i ? ex.lineTo(a[0], a[1]) : ex.moveTo(a[0], a[1]); }); ex.closePath(); ex.stroke();
      pts.forEach(function (a) { ex.beginPath(); ex.arc(a[0], a[1], r, 0, 7); ex.fillStyle = 'rgba(34,211,238,.35)'; ex.fill(); ex.stroke(); });
    }
    function pos(e) { var b = ed.getBoundingClientRect(); return [(e.clientX - b.left) / b.width, (e.clientY - b.top) / b.height]; }
    ed.addEventListener('pointerdown', function (e) { var p = pages[cur]; if (!p) return; var m = pos(e), best = -1, bd = 1e9; p.pts.forEach(function (a, i) { var dd = Math.hypot((a[0] - m[0]) * ed.width, (a[1] - m[1]) * ed.height); if (dd < bd) { bd = dd; best = i; } }); if (bd < ed.width / 8) { drag = best; ed.setPointerCapture(e.pointerId); e.preventDefault(); } });
    ed.addEventListener('pointermove', function (e) { if (drag < 0) return; var m = pos(e); pages[cur].pts[drag] = [clamp(m[0], 0, 1), clamp(m[1], 0, 1)]; drawEd(); });
    function up() { if (drag < 0) return; drag = -1; compute(); }
    ed.addEventListener('pointerup', up); ed.addEventListener('pointercancel', up);
    function compute() {
      var p = pages[cur]; if (!p) return; var W = p.src.width, H = p.src.height, pt = p.pts.map(function (a) { return [a[0] * W, a[1] * H]; });
      var wd = Math.max(Math.hypot(pt[1][0] - pt[0][0], pt[1][1] - pt[0][1]), Math.hypot(pt[2][0] - pt[3][0], pt[2][1] - pt[3][1])), ht = Math.max(Math.hypot(pt[3][0] - pt[0][0], pt[3][1] - pt[0][1]), Math.hypot(pt[2][0] - pt[1][0], pt[2][1] - pt[1][1])), k = Math.min(1, 1800 / Math.max(wd, ht));
      if (wd < 20 || ht < 20) return;
      p.out = clean(warp(p.src, pt, Math.round(wd * k), Math.round(ht * k)), p.flt); res.width = p.out.width; res.height = p.out.height; res.getContext('2d').drawImage(p.out, 0, 0); thumbs();
    }
    function thumbs() {
      var host = q(root, '#th'); host.innerHTML = ''; q(root, '#cnt').textContent = '(' + pages.length + ')';
      pages.forEach(function (p, i) { var t = mk(90, 120), x = t.getContext('2d'); x.fillStyle = '#eee'; x.fillRect(0, 0, 90, 120); var s = p.out || p.src, k = Math.min(86 / s.width, 116 / s.height); x.drawImage(s, 45 - s.width * k / 2, 60 - s.height * k / 2, s.width * k, s.height * k); t.style.cssText = 'border:3px solid ' + (i === cur ? 'var(--brand)' : 'var(--line)') + ';border-radius:6px;cursor:pointer'; t.title = 'Page ' + (i + 1); t.onclick = function () { select(i); }; host.appendChild(t); });
    }
    q(root, '#flt').onchange = function () { if (pages[cur]) { pages[cur].flt = this.value; compute(); } };
    q(root, '#auto').onclick = function () { var p = pages[cur]; if (!p) return; var a = autoPts(p.src); if (!a) CSC.toast('Could not find the edges. Drag the corners by hand.', true); else { p.pts = a; drawEd(); compute(); } };
    q(root, '#rst').onclick = function () { var p = pages[cur]; if (p) { p.pts = [[.03, .03], [.97, .03], [.97, .97], [.03, .97]]; drawEd(); compute(); } };
    function rot(cw) { var p = pages[cur]; if (!p) return; p.src = rotate(p.src, cw); p.pts = p.pts.map(function (a) { return cw ? [1 - a[1], a[0]] : [a[1], 1 - a[0]]; }); p.pts = cw ? [p.pts[3], p.pts[0], p.pts[1], p.pts[2]] : [p.pts[1], p.pts[2], p.pts[3], p.pts[0]]; drawEd(); compute(); }
    q(root, '#rl').onclick = function () { rot(false); }; q(root, '#rr').onclick = function () { rot(true); };
    q(root, '#del').onclick = function () { if (cur < 0) return; pages.splice(cur, 1); select(Math.min(cur, pages.length - 1)); if (!pages.length) q(root, '#work').hidden = true; };
    function outs() { var l = pages.map(function (p) { return p.out; }).filter(Boolean); if (!l.length) CSC.toast('Take or choose a picture first', true); return l; }
    q(root, '#jpg').onclick = async function () { var p = pages[cur]; if (p && p.out) CSC.download(await CSC.canvasBlob(p.out, 'image/jpeg', .92), 'CSC_VLE_TOOLS_scan.jpg'); };
    q(root, '#pdf').onclick = async function () {
      var l = outs(); if (!l.length) return;
      try {
        await CSC.loadScript(CSC.libs.pdflib); var doc = await PDFLib.PDFDocument.create(), fit = q(root, '#ps').value === 'fit';
        for (var i = 0; i < l.length; i++) {
          var c = l[i], jb = await CSC.canvasBlob(c, 'image/jpeg', .9), im = await doc.embedJpg(await jb.arrayBuffer()), pw, ph, w, h, x, y;
          if (fit) { pw = c.width * .5; ph = c.height * .5; w = pw; h = ph; x = y = 0; } else { var land = c.width > c.height; pw = land ? 841.89 : 595.28; ph = land ? 595.28 : 841.89; var m = 18, k = Math.min((pw - 2 * m) / c.width, (ph - 2 * m) / c.height); w = c.width * k; h = c.height * k; x = (pw - w) / 2; y = (ph - h) / 2; }
          doc.addPage([pw, ph]).drawImage(im, { x: x, y: y, width: w, height: h });
        }
        CSC.download(new Blob([await doc.save()], { type: 'application/pdf' }), 'CSC_VLE_TOOLS_scan.pdf');
      } catch (e) { CSC.toast(e.message, true); }
    };
    q(root, '#pr').onclick = function () { var l = outs(); if (l.length) CSC.printHTML(l.map(function (c) { return '<div style="width:210mm;height:297mm;display:flex;align-items:center;justify-content:center;page-break-after:always"><img src="' + c.toDataURL('image/jpeg', .9) + '" style="max-width:194mm;max-height:281mm"></div>'; }).join('')); };
    window.addEventListener('pagehide', stopCam);
  };
})();
