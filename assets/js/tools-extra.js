/* CSC VLE TOOLS v40: Margin Calculator, Simple Calculator, RGB to HEX, Stop Watch,
   Privacy Policy Generator, Disclaimer Generator, About Us Generator */
(function () {
  'use strict';
  var CSC = window.CSC, T = CSC.tools, esc = CSC.esc;

  /* ---------- small shared helpers ---------- */
  (function css() {
    if (document.getElementById('tx-css')) return;
    var s = document.createElement('style'); s.id = 'tx-css';
    s.textContent =
      '.tx-chk{display:flex;gap:8px;align-items:flex-start;margin:6px 0;font-size:.92rem;line-height:1.35;cursor:pointer}' +
      '.tx-chk input{margin-top:3px;flex:none;width:18px;height:18px}' +
      '.tx-grp{font-weight:800;font-size:.85rem;color:#3b4654;margin:14px 0 4px}' +
      '.tx-doc{background:#fff;color:#1b2430;border:1px solid var(--line,#d5dce4);border-radius:10px;padding:16px 18px;line-height:1.6;max-height:70vh;overflow:auto}' +
      '.tx-doc h1{font-size:1.3rem;margin:0 0 4px}.tx-doc h2{font-size:1.05rem;margin:18px 0 6px}.tx-doc p{margin:6px 0}.tx-doc ul{margin:6px 0 6px 20px;padding:0}.tx-doc .dt{color:#5d6b7a;font-size:.88rem}' +
      '.tx-note{background:#fff7e6;border:1px solid #f1cf8c;color:#6b3f00;border-radius:10px;padding:9px 12px;font-size:.88rem;margin-top:12px}' +
      '.tx-big{font:700 clamp(2.2rem,9vw,3.6rem)/1.1 ui-monospace,Consolas,"Courier New",monospace;text-align:center;letter-spacing:.02em;padding:18px 6px;background:var(--soft,#eef2f7);border-radius:14px;font-variant-numeric:tabular-nums}' +
      '.tx-calc{max-width:380px;margin:0 auto}' +
      '.tx-disp{background:#13213a;color:#fff;border-radius:14px;padding:12px 14px;text-align:right;min-height:92px;display:flex;flex-direction:column;justify-content:flex-end;margin-bottom:10px;overflow:hidden}' +
      '.tx-ex{font:600 1.05rem/1.3 ui-monospace,Consolas,monospace;color:#9fb0c8;min-height:1.4em;word-break:break-all}' +
      '.tx-rs{font:700 2.1rem/1.2 ui-monospace,Consolas,monospace;word-break:break-all}' +
      '.tx-keys{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}' +
      '.tx-k{font:700 1.25rem/1 inherit;border:0;border-radius:12px;padding:16px 0;cursor:pointer;color:#13213a;background:linear-gradient(180deg,#fff,#e6edf7);box-shadow:0 3px 0 #b4c6ec;transition:transform .08s}' +
      '.tx-k:active{transform:translateY(3px);box-shadow:0 0 0 #b4c6ec}' +
      '.tx-k.op{color:#fff;background:linear-gradient(180deg,#5b86f0,#1a3fa6);box-shadow:0 3px 0 #102a73}' +
      '.tx-k.cl{color:#fff;background:linear-gradient(180deg,#fb7185,#e11d48);box-shadow:0 3px 0 #881337}' +
      '.tx-k.eq{grid-column:1/-1;color:#fff;background:linear-gradient(180deg,#fbbf24,#ea580c);box-shadow:0 3px 0 #9a3412}' +
      '.tx-sw{height:150px;border-radius:14px;border:1px solid rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.6rem}' +
      '.tx-cr{display:flex;gap:8px;align-items:center;margin:8px 0}.tx-cr b{width:46px;font-size:.85rem}.tx-cr input[type=text]{flex:1;min-width:0}' +
      '.tx-pal{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.tx-pal button{width:34px;height:34px;border-radius:8px;border:2px solid #fff;box-shadow:0 0 0 1px #94a3b8;cursor:pointer;padding:0}' +
      '.tx-lap td,.tx-lap th{padding:6px 8px}.tx-best{color:#0f7a4d;font-weight:800}.tx-worst{color:#b3261e;font-weight:800}';
    document.head.appendChild(s);
  })();

  var inr = function (n) { return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 0 }); };
  var pct = function (n) { return (Math.round(n * 100) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 }) + '%'; };
  var num = function (v) { var n = parseFloat(v); return isNaN(n) ? NaN : n; };
  function $q(root, s) { return root.querySelector(s); }
  function field(id, label, attrs) { return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" ' + (attrs || '') + '></div>'; }
  function sel(id, label, opts, val) {
    return '<div class="field"><label for="' + id + '">' + label + '</label><select id="' + id + '">' + opts.map(function (o) {
      return '<option value="' + esc(o[0]) + '"' + (o[0] === val ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
    }).join('') + '</select></div>';
  }
  function chk(id, label, on) { return '<label class="tx-chk"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '><span>' + label + '</span></label>'; }
  function res(items) { return '<div class="t-res">' + items.map(function (i) { return '<div><b>' + i[1] + '</b><span>' + esc(i[0]) + '</span></div>'; }).join('') + '</div>'; }
  function copyText(t, okMsg) {
    function fallback() {
      var a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} a.remove(); CSC.toast(ok ? (okMsg || 'Copied') : 'Could not copy. Select the text and press Ctrl+C', !ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { CSC.toast(okMsg || 'Copied'); }, fallback); else fallback();
  }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function longDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); if (!m) return iso || '';
    var names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return parseInt(m[3], 10) + ' ' + names[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }

  /* ======================= Margin Calculator ======================= */
  T.margin_calculator = function (root) {
    root.innerHTML = '<div class="t-grid"><div class="card">' +
      sel('mode', 'What do you want to find?', [['ps', 'Profit and margin (I know cost and selling price)'], ['cm', 'Selling price (cost + margin %)'], ['ck', 'Selling price (cost + markup %)'], ['pm', 'Cost price (selling price + margin %)']], 'ps') +
      '<div data-for="ps cm ck">' + field('cost', 'Cost price (₹ per item)', 'type="number" min="0" step="any" value="80" inputmode="decimal"') + '</div>' +
      '<div data-for="ps pm">' + field('price', 'Selling price (₹ per item, before GST)', 'type="number" min="0" step="any" value="100" inputmode="decimal"') + '</div>' +
      '<div data-for="cm pm">' + field('mg', 'Margin % (profit ÷ selling price)', 'type="number" step="any" value="20" inputmode="decimal"') + '</div>' +
      '<div data-for="ck">' + field('mk', 'Markup % (profit ÷ cost price)', 'type="number" step="any" value="25" inputmode="decimal"') + '</div>' +
      '<div class="row2">' + field('qty', 'Quantity', 'type="number" min="1" step="any" value="1" inputmode="decimal"') + field('gst', 'GST % on selling price (optional)', 'type="number" min="0" step="any" value="0" inputmode="decimal"') + '</div>' +
      '<p class="hint"><b>Margin</b> = profit ÷ selling price. <b>Markup</b> = profit ÷ cost price. A 25% markup is a 20% margin.</p>' +
      '</div><div class="card" id="out"></div></div>';
    var els = ['mode', 'cost', 'price', 'mg', 'mk', 'qty', 'gst'].reduce(function (o, i) { o[i] = $q(root, '#' + i); return o; }, {});
    function show() {
      var m = els.mode.value;
      [].forEach.call(root.querySelectorAll('[data-for]'), function (d) { d.style.display = d.getAttribute('data-for').split(' ').indexOf(m) >= 0 ? '' : 'none'; });
    }
    function calc() {
      show();
      var m = els.mode.value, cost = num(els.cost.value), sp = num(els.price.value), mg = num(els.mg.value), mk = num(els.mk.value), q = num(els.qty.value), g = num(els.gst.value);
      var out = $q(root, '#out'), why = '';
      if (!(q > 0)) q = 1; if (!(g > 0)) g = 0;
      if (m === 'ps') { if (!(cost >= 0) || !(sp > 0)) why = 'Enter the cost price and the selling price.'; }
      else if (m === 'cm') { if (!(cost > 0) || isNaN(mg)) why = 'Enter the cost price and the margin %.'; else if (mg >= 100) why = 'Margin must be below 100%.'; else sp = cost / (1 - mg / 100); }
      else if (m === 'ck') { if (!(cost > 0) || isNaN(mk)) why = 'Enter the cost price and the markup %.'; else if (mk <= -100) why = 'Markup must be above -100%.'; else sp = cost * (1 + mk / 100); }
      else { if (!(sp > 0) || isNaN(mg)) why = 'Enter the selling price and the margin %.'; else if (mg >= 100) why = 'Margin must be below 100%.'; else cost = sp * (1 - mg / 100); }
      if (why) { out.innerHTML = '<p class="hint">' + esc(why) + '</p>'; return; }
      var profit = sp - cost, margin = profit / sp * 100, markup = cost > 0 ? profit / cost * 100 : NaN;
      var items = [['Selling price', inr(sp)], ['Cost price', inr(cost)], [profit >= 0 ? 'Profit per item' : 'Loss per item', inr(Math.abs(profit))], ['Margin', pct(margin)], ['Markup', isNaN(markup) ? '-' : pct(markup)]];
      var html = res(items);
      if (q !== 1) html += '<h3 style="margin-top:16px">For ' + esc(String(q)) + ' items</h3>' + res([['Total cost', inr(cost * q)], ['Total sales', inr(sp * q)], [profit >= 0 ? 'Total profit' : 'Total loss', inr(Math.abs(profit * q))]]);
      if (g > 0) html += '<h3 style="margin-top:16px">With GST ' + esc(String(g)) + '%</h3>' + res([['GST per item', inr(sp * g / 100)], ['Price with GST', inr(sp * (1 + g / 100))]].concat(q !== 1 ? [['Bill total with GST', inr(sp * (1 + g / 100) * q)]] : []));
      if (profit < 0) html += '<p class="err" style="margin-top:12px">This sale is at a loss.</p>';
      out.innerHTML = html;
    }
    ['mode', 'cost', 'price', 'mg', 'mk', 'qty', 'gst'].forEach(function (i) { els[i].addEventListener('input', calc); els[i].addEventListener('change', calc); });
    calc();
  };

  /* ======================= Simple Calculator ======================= */
  function tokenize(s) {
    var out = [], i = 0, ch;
    while (i < s.length) {
      ch = s.charAt(i);
      if (/\s/.test(ch)) { i++; continue; }
      if (/[0-9.]/.test(ch)) {
        var j = i, dots = 0; while (j < s.length && /[0-9.]/.test(s.charAt(j))) { if (s.charAt(j) === '.') dots++; j++; }
        if (dots > 1 || s.substring(i, j) === '.') throw new Error('Check the number');
        out.push(parseFloat(s.substring(i, j))); i = j; continue;
      }
      if ('+−×÷()%'.indexOf(ch) >= 0) { out.push(ch); i++; continue; }
      throw new Error('Check the expression');
    }
    return out;
  }
  function evalExpr(s) {
    var tk = tokenize(s), i = 0, open = 0, k;
    for (k = 0; k < tk.length; k++) { if (tk[k] === '(') open++; else if (tk[k] === ')') open--; }
    while (open > 0) { tk.push(')'); open--; }
    function peek() { return tk[i]; } function next() { return tk[i++]; }
    function E() {
      var l = T2();
      while (peek() === '+' || peek() === '−') {
        var op = next(), r = T2(), rv = r.v; if (r.p) rv = l.v * r.v;
        l = { v: op === '+' ? l.v + rv : l.v - rv, p: false };
      }
      return l;
    }
    function T2() {
      var l = F();
      while (peek() === '×' || peek() === '÷') {
        var op = next(), r = F();
        if (op === '÷' && r.v === 0) throw new Error('Cannot divide by zero');
        l = { v: op === '×' ? l.v * r.v : l.v / r.v, p: false };
      }
      return l;
    }
    function F() {
      var t = next(), v;
      if (t === '−') { var f = F(); v = { v: -f.v, p: f.p }; }
      else if (t === '+') { return F(); }
      else if (t === '(') { var e = E(); if (next() !== ')') throw new Error('Check the brackets'); v = { v: e.v, p: false }; }
      else if (typeof t === 'number') { v = { v: t, p: false }; }
      else throw new Error('Check the expression');
      while (peek() === '%') { next(); v = { v: v.v / 100, p: true }; }
      return v;
    }
    var r = E(); if (i < tk.length) throw new Error('Check the expression');
    if (!isFinite(r.v)) throw new Error('Result is too large');
    return parseFloat(r.v.toPrecision(12));
  }
  function showNum(v) { return Number(v).toLocaleString('en-IN', { maximumFractionDigits: 10 }); }
  T.simple_calculator = function (root) {
    var keys = [['C', 'cl'], ['(', 'op'], [')', 'op'], ['⌫', 'op'], ['7'], ['8'], ['9'], ['÷', 'op'], ['4'], ['5'], ['6'], ['×', 'op'], ['1'], ['2'], ['3'], ['−', 'op'], ['0'], ['.'], ['%', 'op'], ['+', 'op'], ['=', 'eq']];
    root.innerHTML = '<div class="t-grid"><div class="card"><div class="tx-calc"><div class="tx-disp"><div class="tx-ex" id="ex" aria-live="polite"></div><div class="tx-rs" id="rs">0</div></div><div class="tx-keys">' +
      keys.map(function (k) { return '<button type="button" class="tx-k ' + (k[1] || '') + '" data-k="' + esc(k[0]) + '" aria-label="' + esc(k[0]) + '">' + esc(k[0]) + '</button>'; }).join('') +
      '</div><div class="t-actions"><button class="btn alt" id="cp" type="button">Copy result</button></div><p class="hint">You can also type on the keyboard. Enter = equals, Backspace = delete, Esc = clear. Example: 200 + 10% = 220.</p></div></div>' +
      '<div class="card"><h3 style="margin-top:0">History</h3><div id="hs"><p class="hint">Your last calculations appear here. Tap one to use it again.</p></div><div class="t-actions"><button class="btn alt" id="hc" type="button">Clear history</button></div></div></div>';
    var expr = '', last = null, hist = [], ex = $q(root, '#ex'), rs = $q(root, '#rs'), justEq = false;
    function live() {
      ex.textContent = expr; var v = null;
      if (expr) { try { v = evalExpr(expr); } catch (e) { v = null; } }
      rs.textContent = v === null ? (expr ? '' : '0') : showNum(v);
      if (v === null && expr) { try { evalExpr(expr); } catch (e2) { rs.textContent = /zero|large/.test(e2.message) ? e2.message : ''; } }
      last = v;
    }
    function press(k) {
      var isOp = '+−×÷'.indexOf(k) >= 0, isNum = /[0-9.]/.test(k);
      if (k === 'C') { expr = ''; justEq = false; }
      else if (k === '⌫') { expr = expr.slice(0, -1); justEq = false; }
      else if (k === '=') {
        try { var v = evalExpr(expr); hist.unshift({ e: expr, r: v }); hist = hist.slice(0, 10); expr = String(v); justEq = true; renderHist(); }
        catch (e) { rs.textContent = e.message; return; }
      } else {
        if (justEq && isNum) expr = ''; justEq = false;
        if (isOp && /[+−×÷]$/.test(expr)) expr = expr.slice(0, -1);
        if (isOp && expr === '' && k !== '−') return;
        if (k === '%' && (expr === '' || /[+−×÷(]$/.test(expr))) return;
        expr += k;
      }
      live();
    }
    function renderHist() {
      $q(root, '#hs').innerHTML = hist.length ? hist.map(function (h, i) { return '<button type="button" class="btn alt" data-h="' + i + '" style="display:block;width:100%;text-align:right;margin:0 0 6px"><span class="hint" style="display:block;margin:0">' + esc(h.e) + ' =</span><b>' + esc(showNum(h.r)) + '</b></button>'; }).join('') : '<p class="hint">Your last calculations appear here. Tap one to use it again.</p>';
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-k]'); if (b) { press(b.getAttribute('data-k')); return; }
      var h = e.target.closest('[data-h]'); if (h) { expr = String(hist[+h.getAttribute('data-h')].r); justEq = true; live(); }
    });
    $q(root, '#cp').onclick = function () { if (last !== null) copyText(String(last), 'Result copied'); else CSC.toast('Nothing to copy yet', true); };
    $q(root, '#hc').onclick = function () { hist = []; renderHist(); };
    function onKey(e) {
      if (!document.body.contains(root)) { document.removeEventListener('keydown', onKey); return; }
      var t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var k = e.key, map = { '*': '×', 'x': '×', 'X': '×', '/': '÷', '-': '−' };
      if (/^[0-9.+()%]$/.test(k)) { press(k); e.preventDefault(); }
      else if (map[k]) { press(map[k]); e.preventDefault(); }
      else if (k === 'Enter' || k === '=') { press('='); e.preventDefault(); }
      else if (k === 'Backspace') { press('⌫'); e.preventDefault(); }
      else if (k === 'Escape' || k === 'Delete') { press('C'); e.preventDefault(); }
    }
    document.addEventListener('keydown', onKey);
    live();
  };

  /* ======================= RGB to HEX Converter ======================= */
  function clamp255(n) { n = Math.round(n); return n < 0 ? 0 : (n > 255 ? 255 : (isNaN(n) ? 0 : n)); }
  function toHex(r, g, b) { return '#' + [r, g, b].map(function (v) { return ('0' + clamp255(v).toString(16)).slice(-2); }).join('').toUpperCase(); }
  function parseHex(s) {
    s = String(s || '').trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{3}$/.test(s)) s = s.split('').map(function (c) { return c + c; }).join('');
    if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
    return [parseInt(s.substr(0, 2), 16), parseInt(s.substr(2, 2), 16), parseInt(s.substr(4, 2), 16)];
  }
  function toHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255; var mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s = 0, l = (mx + mn) / 2, d = mx - mn;
    if (d) { s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); if (mx === r) h = (g - b) / d + (g < b ? 6 : 0); else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
  }
  function lum(r, g, b) { var a = [r, g, b].map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; }
  function ratio(l1, l2) { var a = Math.max(l1, l2), b = Math.min(l1, l2); return (a + 0.05) / (b + 0.05); }
  T.rgb_hex_converter = function (root) {
    var PAL = 'csc_rgbhex_palette', pal = [];
    try { pal = JSON.parse(localStorage.getItem(PAL) || '[]') || []; } catch (e) { pal = []; }
    root.innerHTML = '<div class="t-grid"><div class="card">' +
      '<div class="field"><label for="pk">Pick a colour</label><input id="pk" type="color" value="#1A3FA6" style="width:100%;height:54px;padding:2px"></div>' +
      '<div class="field"><label for="hx">HEX code</label><input id="hx" type="text" value="#1A3FA6" maxlength="7" spellcheck="false" autocomplete="off"></div>' +
      ['r', 'g', 'b'].map(function (c, i) { return '<div class="tx-cr"><b>' + ['Red', 'Green', 'Blue'][i] + '</b><input id="' + c + 'r" type="range" min="0" max="255" value="0" aria-label="' + c + '"><input id="' + c + 'n" type="number" min="0" max="255" value="0" style="width:74px"></div>'; }).join('') +
      '<div class="t-actions"><button class="btn alt" id="rnd" type="button">Random colour</button><button class="btn alt" id="eye" type="button" style="display:none">Pick from screen</button><button class="btn" id="sv" type="button">Save to palette</button></div>' +
      '<div class="tx-grp">Saved palette</div><div class="tx-pal" id="pal"></div><div class="t-actions"><button class="btn alt" id="pc" type="button">Clear palette</button></div>' +
      '</div><div class="card"><div class="tx-sw" id="sw">Aa Sample text</div><div id="vals"></div><div id="ctr"></div></div></div>';
    var R = 0, G = 0, B = 0;
    function set(r, g, b, fromKey) {
      R = clamp255(r); G = clamp255(g); B = clamp255(b);
      var hex = toHex(R, G, B), hsl = toHsl(R, G, B);
      $q(root, '#pk').value = hex.toLowerCase(); if (fromKey !== 'hx') $q(root, '#hx').value = hex;
      ['r', 'g', 'b'].forEach(function (c, i) { var v = [R, G, B][i]; $q(root, '#' + c + 'r').value = v; if (fromKey !== c + 'n') $q(root, '#' + c + 'n').value = v; });
      var L = lum(R, G, B), cw = ratio(L, 1), cb = ratio(L, 0), tcol = cw >= cb ? '#FFFFFF' : '#000000';
      var sw = $q(root, '#sw'); sw.style.background = hex; sw.style.color = tcol;
      var rows = [['HEX', hex], ['RGB', 'rgb(' + R + ', ' + G + ', ' + B + ')'], ['HSL', 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)'], ['CSS variable', '--color: ' + hex + ';'], ['HEX without #', hex.slice(1)]];
      $q(root, '#vals').innerHTML = '<div style="margin-top:14px">' + rows.map(function (r, i) { return '<div class="tx-cr"><b style="width:96px">' + r[0] + '</b><input type="text" readonly value="' + esc(r[1]) + '" aria-label="' + r[0] + '"><button class="btn alt" type="button" data-cp="' + esc(r[1]) + '">Copy</button></div>'; }).join('') + '</div>';
      function badge(rt) { return rt.toFixed(2) + ':1 ' + (rt >= 7 ? '(AAA, very good)' : rt >= 4.5 ? '(AA, good)' : rt >= 3 ? '(large text only)' : '(low, hard to read)'); }
      $q(root, '#ctr').innerHTML = '<p class="hint" style="margin-top:12px"><b>Text contrast</b><br>White text on this colour: ' + badge(cw) + '<br>Black text on this colour: ' + badge(cb) + '</p>';
    }
    function pal2() {
      $q(root, '#pal').innerHTML = pal.length ? pal.map(function (h) { return '<button type="button" data-pl="' + h + '" style="background:' + h + '" title="' + h + '" aria-label="Use ' + h + '"></button>'; }).join('') : '<span class="hint">No saved colours yet.</span>';
    }
    root.addEventListener('click', function (e) {
      var c = e.target.closest('[data-cp]'); if (c) { copyText(c.getAttribute('data-cp'), 'Copied ' + c.getAttribute('data-cp')); return; }
      var p = e.target.closest('[data-pl]'); if (p) { var v = parseHex(p.getAttribute('data-pl')); if (v) set(v[0], v[1], v[2]); }
    });
    $q(root, '#pk').addEventListener('input', function () { var v = parseHex(this.value); if (v) set(v[0], v[1], v[2]); });
    $q(root, '#hx').addEventListener('input', function () { var v = parseHex(this.value); if (v) set(v[0], v[1], v[2], 'hx'); });
    $q(root, '#hx').addEventListener('blur', function () { this.value = toHex(R, G, B); });
    ['r', 'g', 'b'].forEach(function (c) {
      function f(key) { return function () { set(num($q(root, '#rr').value || R), num($q(root, '#gr').value || G), num($q(root, '#br').value || B)); }; }
      $q(root, '#' + c + 'r').addEventListener('input', function () { set($q(root, '#rr').value, $q(root, '#gr').value, $q(root, '#br').value); });
      $q(root, '#' + c + 'n').addEventListener('input', function () { set($q(root, '#rn').value, $q(root, '#gn').value, $q(root, '#bn').value, c + 'n'); });
    });
    $q(root, '#rnd').onclick = function () { set(Math.random() * 256, Math.random() * 256, Math.random() * 256); };
    $q(root, '#sv').onclick = function () { var h = toHex(R, G, B); if (pal.indexOf(h) < 0) { pal.unshift(h); pal = pal.slice(0, 24); try { localStorage.setItem(PAL, JSON.stringify(pal)); } catch (e) {} pal2(); CSC.toast('Saved ' + h); } else CSC.toast('Already saved'); };
    $q(root, '#pc').onclick = function () { pal = []; try { localStorage.removeItem(PAL); } catch (e) {} pal2(); };
    if (window.EyeDropper) {
      var eb = $q(root, '#eye'); eb.style.display = '';
      eb.onclick = function () { new window.EyeDropper().open().then(function (r) { var v = parseHex(r.sRGBHex); if (v) set(v[0], v[1], v[2]); }).catch(function () {}); };
    }
    set(26, 63, 166); pal2();
  };

  /* ======================= Stop Watch ======================= */
  T.stopwatch = function (root) {
    root.innerHTML = '<div class="t-grid"><div class="card"><div class="tx-big" id="d" role="timer" aria-live="off">00:00:00.00</div>' +
      '<div class="t-actions" style="justify-content:center"><button class="btn" id="go" type="button" style="min-width:110px">Start</button><button class="btn alt" id="lp" type="button" disabled>Lap</button><button class="btn alt" id="rs" type="button" disabled>Reset</button></div>' +
      '<p class="hint" style="text-align:center">Keyboard: Space = start / pause, L = lap, R = reset.</p></div>' +
      '<div class="card"><h3 style="margin-top:0">Laps</h3><div id="laps"><p class="hint">Press Lap while the watch runs to record a lap.</p></div><div class="t-actions"><button class="btn alt" id="cp" type="button">Copy laps</button><button class="btn alt" id="dl" type="button">Download CSV</button></div></div></div>';
    var run = false, base = 0, t0 = 0, raf = 0, laps = [], lastLap = 0;
    var d = $q(root, '#d'), go = $q(root, '#go'), lp = $q(root, '#lp'), rs = $q(root, '#rs');
    function now() { return base + (run ? performance.now() - t0 : 0); }
    function fmt(ms) {
      var cs = Math.floor(ms / 10) % 100, s = Math.floor(ms / 1000) % 60, m = Math.floor(ms / 60000) % 60, h = Math.floor(ms / 3600000);
      var p = function (n) { return ('0' + n).slice(-2); }; return p(h) + ':' + p(m) + ':' + p(s) + '.' + p(cs);
    }
    function tick() { d.textContent = fmt(now()); if (run) raf = requestAnimationFrame(tick); }
    function start() { run = true; t0 = performance.now(); go.textContent = 'Pause'; lp.disabled = false; rs.disabled = false; cancelAnimationFrame(raf); tick(); }
    function pause() { base = now(); run = false; go.textContent = 'Resume'; cancelAnimationFrame(raf); tick(); }
    function lap() {
      var t = now(); laps.push({ lap: t - lastLap, total: t }); lastLap = t; renderLaps();
    }
    function reset() { run = false; base = 0; lastLap = 0; laps = []; cancelAnimationFrame(raf); go.textContent = 'Start'; lp.disabled = true; rs.disabled = true; tick(); renderLaps(); }
    function renderLaps() {
      var box = $q(root, '#laps');
      if (!laps.length) { box.innerHTML = '<p class="hint">Press Lap while the watch runs to record a lap.</p>'; return; }
      var min = Infinity, max = -Infinity; laps.forEach(function (l) { if (l.lap < min) min = l.lap; if (l.lap > max) max = l.lap; });
      var rows = laps.map(function (l, i) {
        var c = laps.length > 1 ? (l.lap === min ? 'tx-best' : (l.lap === max ? 'tx-worst' : '')) : '';
        return '<tr><td>' + (i + 1) + '</td><td class="' + c + '">' + fmt(l.lap) + '</td><td>' + fmt(l.total) + '</td></tr>';
      }).reverse().join('');
      box.innerHTML = '<div style="overflow:auto"><table class="t-tbl tx-lap"><tr><th>Lap</th><th>Lap time</th><th>Total</th></tr>' + rows + '</table></div>' + (laps.length > 1 ? '<p class="hint">Green = fastest lap, red = slowest lap.</p>' : '');
    }
    go.onclick = function () { if (run) pause(); else start(); };
    lp.onclick = function () { if (run) lap(); };
    rs.onclick = reset;
    $q(root, '#cp').onclick = function () {
      if (!laps.length) { CSC.toast('No laps yet', true); return; }
      copyText('Lap\tLap time\tTotal\n' + laps.map(function (l, i) { return (i + 1) + '\t' + fmt(l.lap) + '\t' + fmt(l.total); }).join('\n'), 'Laps copied');
    };
    $q(root, '#dl').onclick = function () {
      if (!laps.length) { CSC.toast('No laps yet', true); return; }
      CSC.download(new Blob(['Lap,Lap time,Total\n' + laps.map(function (l, i) { return (i + 1) + ',' + fmt(l.lap) + ',' + fmt(l.total); }).join('\n')], { type: 'text/csv' }), 'stopwatch-laps.csv');
    };
    function onKey(e) {
      if (!document.body.contains(root)) { document.removeEventListener('keydown', onKey); return; }
      var t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === ' ' || e.code === 'Space') { if (t && t.tagName === 'BUTTON') return; e.preventDefault(); go.click(); }
      else if (e.key === 'l' || e.key === 'L') { lp.click(); }
      else if (e.key === 'r' || e.key === 'R') { if (!rs.disabled) rs.click(); }
    }
    document.addEventListener('keydown', onKey);
    tick();
  };

  /* ======================= Document generators (shared) ======================= */
  function docText(doc) {
    var L = [doc.title.toUpperCase(), doc.date, ''];
    doc.sections.forEach(function (s, i) {
      L.push((i + 1) + '. ' + s.h);
      (s.p || []).forEach(function (p) { L.push(p); L.push(''); });
      if (s.ul && s.ul.length) { s.ul.forEach(function (u) { L.push('- ' + u); }); L.push(''); }
    });
    return L.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }
  function docHtml(doc, full) {
    var b = '<h1>' + esc(doc.title) + '</h1><p class="dt">' + esc(doc.date) + '</p>';
    doc.sections.forEach(function (s) {
      b += '<h2>' + esc(s.h) + '</h2>';
      (s.p || []).forEach(function (p) { b += '<p>' + esc(p) + '</p>'; });
      if (s.ul && s.ul.length) b += '<ul>' + s.ul.map(function (u) { return '<li>' + esc(u) + '</li>'; }).join('') + '</ul>';
    });
    if (!full) return b;
    return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(doc.title) + '</title>' +
      '<style>body{font:16px/1.65 Arial,Helvetica,sans-serif;color:#1b2430;max-width:780px;margin:24px auto;padding:0 16px}h1{font-size:1.6rem}h2{font-size:1.15rem;margin-top:24px}.dt{color:#5d6b7a}ul{padding-left:22px}</style></head><body>' + b + '</body></html>';
  }
  function printHtml(html) {
    var f = document.createElement('iframe'); f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'; document.body.appendChild(f);
    var d = f.contentWindow.document; d.open(); d.write(html); d.close();
    setTimeout(function () { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { CSC.toast('Printing is not available here', true); } setTimeout(function () { f.remove(); }, 2000); }, 300);
  }
  var NOTE = '<div class="tx-note"><b>Please read:</b> This is a general template made from your answers. It is not legal advice. Read it fully, change anything that does not match your business, and have a lawyer check it if your website collects sensitive data or you earn money from it.</div>';
  function genShell(root, formHtml, build, fileBase) {
    root.innerHTML = '<div class="t-grid"><div class="card">' + formHtml + '<div class="t-actions"><button class="btn" id="mk" type="button">Create</button></div></div>' +
      '<div class="card" id="outc"><p class="hint">Fill in your details on the left and press <b>Create</b>. Your document will show here.</p></div></div>';
    var doc = null;
    function val(id) { var e = $q(root, '#' + id); return e ? (e.type === 'checkbox' ? e.checked : e.value.trim()) : ''; }
    $q(root, '#mk').onclick = function () {
      var r; try { r = build(val); } catch (e) { r = { error: e.message }; }
      if (r.error) { CSC.toast(r.error, true); return; }
      doc = r;
      $q(root, '#outc').innerHTML = '<div class="t-actions" style="margin:0 0 10px"><button class="btn" id="c1" type="button">Copy text</button><button class="btn alt" id="c2" type="button">Copy HTML code</button><button class="btn alt" id="d1" type="button">Download .txt</button><button class="btn alt" id="d2" type="button">Download .html</button><button class="btn alt" id="pr" type="button">Print / Save as PDF</button></div>' +
        '<div class="tx-doc" id="doc">' + docHtml(doc, false) + '</div>' + NOTE;
      $q(root, '#c1').onclick = function () { copyText(docText(doc), 'Text copied'); };
      $q(root, '#c2').onclick = function () { copyText(docHtml(doc, false), 'HTML code copied. Paste it in the HTML editor of your website.'); };
      $q(root, '#d1').onclick = function () { CSC.download(new Blob([docText(doc)], { type: 'text/plain' }), fileBase + '.txt'); };
      $q(root, '#d2').onclick = function () { CSC.download(new Blob([docHtml(doc, true)], { type: 'text/html' }), fileBase + '.html'); };
      $q(root, '#pr').onclick = function () { printHtml(docHtml(doc, true)); };
      try { $q(root, '#outc').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
    };
  }
  function nm(v) { return v('nm') || 'Our website'; }
  function ctc(v) { var a = []; if (v('em')) a.push('email: ' + v('em')); if (v('ph')) a.push('phone: ' + v('ph')); if (v('ad')) a.push('address: ' + v('ad')); return a; }

  /* ======================= Privacy Policy Generator ======================= */
  T.privacy_policy_generator = function (root) {
    genShell(root,
      field('nm', 'Website or business name *', 'type="text" placeholder="Example: CSC VLE TOOLS"') +
      field('ur', 'Website address (URL)', 'type="text" placeholder="https://www.example.com"') +
      '<div class="row2">' + field('em', 'Contact email *', 'type="email" placeholder="you@example.com"') + field('ph', 'Phone (optional)', 'type="text"') + '</div>' +
      field('ad', 'Address (optional)', 'type="text" placeholder="Shop name, city, state"') +
      '<div class="row2">' + field('co', 'Country', 'type="text" value="India"') + field('dt', 'Date', 'type="date" value="' + today() + '"') + '</div>' +
      '<div class="tx-grp">What information do you collect?</div>' +
      chk('c_contact', 'Name, email and phone that visitors give in a form or message', true) + chk('c_acct', 'Account details (visitors can sign up)') +
      chk('c_files', 'Files or photos that visitors add or send') + chk('c_local', 'Files stay in the visitor\u2019s browser (tools work on the device and do not upload)') +
      chk('c_usage', 'Usage and device data (IP address, browser, pages visited)', true) + chk('c_loc', 'Approximate location (from IP address)') + chk('c_pay', 'Payments (handled by a payment partner)') + chk('c_cook', 'Cookies', true) +
      '<div class="tx-grp">Which services do you use?</div>' +
      chk('s_ana', 'Google Analytics or other analytics') + chk('s_ads', 'Advertising (Google AdSense or others)') + chk('s_aff', 'Affiliate links') + chk('s_emb', 'Embedded videos or social buttons (YouTube, Facebook)') + chk('s_pay', 'Payment gateway (Razorpay, UPI, PayU)') + chk('s_host', 'Website hosting by a third party (GitHub Pages, Google, etc.)') +
      '<div class="tx-grp">Other</div>' +
      chk('o_del', 'Visitors can ask to see, correct or delete their data', true) + chk('o_kids', 'Website is not for children', true) + sel('age', 'Minimum age', [['13', '13 years'], ['18', '18 years']], '18'),
      function (v) {
        if (!v('nm')) return { error: 'Please enter the website or business name' };
        if (!v('em')) return { error: 'Please enter a contact email' };
        var name = v('nm'), url = v('ur'), who = name + (url ? ' (' + url + ')' : ''), S = [];
        S.push({ h: 'Introduction', p: ['This Privacy Policy explains how ' + who + ' (\u201cwe\u201d, \u201cus\u201d, \u201cour\u201d) collects, uses and protects information when you visit our website or use our services.', 'By using the website you agree to this policy. If you do not agree, please do not use the website. We try to follow the laws that apply to us in ' + (v('co') || 'India') + '.'] });
        var c = [];
        if (v('c_contact')) c.push('Contact details you give us, such as your name, email address and phone number, when you fill in a form, write to us or message us.');
        if (v('c_acct')) c.push('Account details, if you create an account (for example your name, email address and password).');
        if (v('c_files')) c.push('Files and photos that you add to our website or send to us.');
        if (v('c_usage')) c.push('Usage and device information, such as your IP address, browser type, device, the pages you visit and the time you spend on them.');
        if (v('c_loc')) c.push('Your approximate location (for example your city), worked out from your IP address.');
        if (v('c_pay')) c.push('Payment details. Payments are handled by our payment partner. We do not store your full card, bank or UPI details.');
        var sec2 = { h: 'Information we collect', p: [], ul: c };
        sec2.p.push(c.length ? 'Depending on how you use the website, we may collect the following:' : 'We do not knowingly collect personal information from visitors to this website.');
        if (v('c_local')) sec2.p.push('Files that you open in our tools are processed in your own browser on your own device. They are not uploaded to our servers.');
        S.push(sec2);
        var u = ['To run, maintain and improve the website and our services', 'To reply to your messages and requests', 'To keep the website safe and to stop misuse or fraud', 'To understand how the website is used', 'To follow the law when required'];
        if (v('c_pay')) u.splice(1, 0, 'To process your payments and orders');
        S.push({ h: 'How we use your information', p: ['We use the information we collect only for these purposes:'], ul: u });
        if (v('c_cook')) S.push({ h: 'Cookies', p: ['Cookies are small files that a website stores on your device. We use cookies to make the website work, to remember your choices and to understand how the website is used.', 'You can delete or block cookies in your browser settings. If you turn cookies off, some parts of the website may not work properly.'] });
        var t = [];
        if (v('s_ana')) t.push('Analytics: we use analytics services such as Google Analytics to understand how visitors use the website.');
        if (v('s_ads')) t.push('Advertising: ad partners such as Google AdSense may use cookies to show ads. You can manage your ad settings in your Google account.');
        if (v('s_aff')) t.push('Affiliate links: some links may take you to other websites where we may earn a commission. Those websites have their own privacy policies.');
        if (v('s_emb')) t.push('Embedded content: videos or buttons from sites such as YouTube or Facebook may set their own cookies when you view or use them.');
        if (v('s_pay')) t.push('Payment services: payments are processed by third-party payment gateways under their own terms and privacy policies.');
        if (v('s_host')) t.push('Hosting: our website is hosted by a third-party provider, which may process technical data needed to deliver the website.');
        if (t.length) S.push({ h: 'Third-party services', p: ['We use some third-party services. They have their own privacy policies, and we are not responsible for how they handle information:'], ul: t });
        S.push({ h: 'Sharing of information', p: ['We do not sell your personal information. We may share information with service providers who help us run the website, and with the authorities if the law requires it or to protect our rights, our users or the public.'] });
        S.push({ h: 'How long we keep information', p: ['We keep information only for as long as we need it for the purposes in this policy, or for as long as the law requires.'] });
        S.push({ h: 'Security', p: ['We take reasonable steps to protect your information. However, no website or method of storage is completely secure, so we cannot promise absolute security.'] });
        if (v('o_del')) S.push({ h: 'Your choices and rights', p: ['You may ask us to show you the personal information we hold about you, to correct it, or to delete it. Write to us at ' + v('em') + ' and we will reply within a reasonable time.'] });
        if (v('o_kids')) S.push({ h: 'Children', p: ['Our website is not meant for children under ' + v('age') + ' years. We do not knowingly collect information from them. If you think a child has given us information, please tell us and we will delete it.'] });
        S.push({ h: 'Links to other websites', p: ['Our website may contain links to other websites. We are not responsible for the content or privacy practices of those websites.'] });
        S.push({ h: 'Changes to this policy', p: ['We may update this Privacy Policy from time to time. The date at the top shows when it was last changed. Please check this page now and then.'] });
        S.push({ h: 'Governing law', p: ['This policy is governed by the laws of ' + (v('co') || 'India') + '.'] });
        var ct = ctc(v); S.push({ h: 'Contact us', p: ['If you have any questions about this Privacy Policy, please contact ' + name + ' (' + ct.join(', ') + ').'] });
        return { title: 'Privacy Policy', date: 'Last updated: ' + longDate(v('dt')), sections: S };
      }, 'privacy-policy');
  };

  /* ======================= Disclaimer Generator ======================= */
  T.disclaimer_generator = function (root) {
    genShell(root,
      field('nm', 'Website or business name *', 'type="text" placeholder="Example: CSC VLE TOOLS"') +
      field('ur', 'Website address (URL)', 'type="text" placeholder="https://www.example.com"') +
      '<div class="row2">' + field('em', 'Contact email *', 'type="email"') + field('dt', 'Date', 'type="date" value="' + today() + '"') + '</div>' +
      '<div class="tx-grp">Which disclaimers do you need?</div>' +
      chk('g_gen', 'General information only', true) + chk('g_adv', 'Not legal, financial, tax or medical advice', true) + chk('g_acc', 'Tools and calculators: results may have mistakes', true) +
      chk('g_gov', 'We are not a government website', true) + chk('g_ext', 'External links', true) + chk('g_aff', 'Affiliate links and advertisements') +
      chk('g_tes', 'Testimonials and results may vary') + chk('g_err', 'Errors, changes and downtime') + chk('g_cop', 'Copyright and trademarks (names belong to their owners)') + chk('g_lia', 'Limitation of liability', true),
      function (v) {
        if (!v('nm')) return { error: 'Please enter the website or business name' };
        if (!v('em')) return { error: 'Please enter a contact email' };
        var name = v('nm'), who = name + (v('ur') ? ' (' + v('ur') + ')' : ''), S = [];
        if (v('g_gen')) S.push({ h: 'General information', p: ['The information on ' + who + ' is given for general information only. We try to keep it correct and up to date, but we make no promise or guarantee about its completeness, accuracy or reliability. Anything you do based on this website is at your own risk.'] });
        if (v('g_adv')) S.push({ h: 'No professional advice', p: ['Nothing on this website is legal, financial, tax, medical or other professional advice. Please speak to a qualified professional before you make decisions that depend on such advice.'] });
        if (v('g_acc')) S.push({ h: 'Tools and calculators', p: ['The tools, calculators and generators on this website are provided to help you. Results may contain mistakes or may not match the latest rules. Please check every result yourself, and against the official instructions, before you submit, print or rely on it.'] });
        if (v('g_gov')) S.push({ h: 'Not a government website', p: [name + ' is a private website. We are not a government website, and we are not connected with, approved by or working for any government department, board, commission or official portal. Names and links of departments or portals are shown only to help you find them. For official work, please use the official websites.'] });
        if (v('g_ext')) S.push({ h: 'External links', p: ['Our website may link to websites that we do not own or control. We are not responsible for their content, accuracy, privacy practices or availability. A link does not mean that we approve of that website.'] });
        if (v('g_aff')) S.push({ h: 'Affiliate links and advertisements', p: ['Some links on this website may be affiliate links, and the website may show advertisements. If you click or buy through them, we may earn a small commission at no extra cost to you. We only mention things that we believe may be useful, but you should do your own checking before you buy.'] });
        if (v('g_tes')) S.push({ h: 'Testimonials and results', p: ['Any testimonials or examples on this website show individual experiences. Results may vary from person to person and are not a promise or guarantee of the same results for you.'] });
        if (v('g_err')) S.push({ h: 'Errors, changes and availability', p: ['We may make mistakes, and we may change, pause or remove any part of this website at any time without notice. We do not promise that the website will always be available, error-free or free of viruses.'] });
        if (v('g_cop')) S.push({ h: 'Copyright and trademarks', p: ['All names, logos and trademarks of other companies, departments or products that appear on this website belong to their respective owners. Their use here is only for identification and does not mean that we are connected with them or approved by them.'] });
        if (v('g_lia')) S.push({ h: 'Limitation of liability', p: ['To the fullest extent allowed by law, ' + name + ' and its owners will not be responsible for any loss, damage or expense of any kind that comes from your use of this website or from relying on anything on it.'] });
        if (!S.length) return { error: 'Please tick at least one disclaimer' };
        S.push({ h: 'Contact us', p: ['If you have any questions about this disclaimer, please write to ' + v('em') + '.'] });
        return { title: 'Disclaimer', date: 'Last updated: ' + longDate(v('dt')), sections: S };
      }, 'disclaimer');
  };

  /* ======================= About Us Generator ======================= */
  T.about_us_generator = function (root) {
    var seed = 0;
    genShell(root,
      field('nm', 'Business or website name *', 'type="text" placeholder="Example: Sharma CSC Centre"') +
      field('tg', 'Tagline (optional)', 'type="text" placeholder="Example: Your digital help desk"') +
      sel('ty', 'Type of business', [['csc', 'CSC / Common Service Centre'], ['cafe', 'Cyber cafe / Photo studio'], ['web', 'Online tools or website'], ['shop', 'Shop or store'], ['svc', 'Service provider'], ['edu', 'Coaching or education'], ['blog', 'Blog or content']], 'csc') +
      '<div class="row2">' + field('ow', 'Owner or founder name', 'type="text"') + field('yr', 'Year started', 'type="number" min="1900" max="2100" placeholder="2020"') + '</div>' +
      '<div class="row2">' + field('lo', 'Town / city and state', 'type="text" placeholder="Rohtak, Haryana"') + field('wh', 'Who do you serve?', 'type="text" placeholder="students, job seekers, families"') + '</div>' +
      '<div class="field"><label for="of">What do you offer? (one per line)</label><textarea id="of" rows="5" placeholder="Photo resize and print\nAadhaar and PAN services\nOnline form filling"></textarea></div>' +
      '<div class="field"><label for="ms">Your promise or mission (optional)</label><textarea id="ms" rows="2" placeholder="Fast, honest and affordable service for everyone."></textarea></div>' +
      '<div class="row2">' + field('em', 'Email (optional)', 'type="email"') + field('ph', 'Phone / WhatsApp (optional)', 'type="text"') + '</div>' +
      sel('tn', 'Style', [['fr', 'Friendly'], ['pr', 'Professional'], ['sh', 'Short']], 'fr'),
      function (v) {
        if (!v('nm')) return { error: 'Please enter the business or website name' };
        seed++; var pick = function (a) { return a[(seed - 1) % a.length]; };
        var name = v('nm'), ty = v('ty'), tn = v('tn'), lo = v('lo'), yr = v('yr'), ow = v('ow'), wh = v('wh'), ms = v('ms');
        var offers = v('of').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
        var kind = { csc: 'Common Service Centre', cafe: 'cyber cafe and photo studio', web: 'online tools website', shop: 'shop', svc: 'service provider', edu: 'learning centre', blog: 'website' }[ty];
        var S = [];
        var p1 = pick([name + ' is a ' + kind + (lo ? ' in ' + lo : '') + (yr ? ', started in ' + yr : '') + '. ', 'Welcome to ' + name + '! We are a ' + kind + (lo ? ' based in ' + lo : '') + (yr ? ' and we have been serving since ' + yr : '') + '. ', 'Since ' + (yr || 'the day we opened') + ', ' + name + ' has worked as a ' + kind + (lo ? ' in ' + lo : '') + '. ']);
        if (ow) p1 += pick(['Our work is led by ' + ow + '. ', ow + ' started ' + name + ' with a simple idea: to make everyday work easy for people. ', 'We are guided by ' + ow + ', the founder. ']);
        if (wh) p1 += pick(['We mainly help ' + wh + '.', 'Most of the people we serve are ' + wh + '.', 'Our customers are mostly ' + wh + '.']);
        S.push({ h: 'Who we are', p: [p1.trim()] });
        if (v('tg') && tn !== 'sh') S[0].p.unshift(v('tg') + '.');
        if (offers.length) S.push({ h: tn === 'pr' ? 'Our services' : 'What we do', p: [tn === 'sh' ? '' : pick(['Here is how we can help you:', 'You can come to us for:', 'We offer the following services:'])].filter(Boolean), ul: offers });
        if (tn !== 'sh') {
          var m = ms || pick(['We want to give you fast, honest and fair service every time.', 'Our aim is to save your time and make official and everyday work simple.', 'We believe good service means clear answers, fair prices and respect for every customer.']);
          S.push({ h: tn === 'pr' ? 'Our commitment' : 'Why choose us', p: [m], ul: tn === 'pr' ? ['Clear information and fair prices', 'Careful handling of your documents and details', 'Prompt and polite service'] : ['Friendly help, in simple language', 'Fair prices with no hidden charges', 'Your documents and details are handled with care'] });
        }
        var ct = []; if (v('em')) ct.push('email ' + v('em')); if (v('ph')) ct.push('call or WhatsApp ' + v('ph'));
        S.push({ h: 'Get in touch', p: [ct.length ? 'Questions? You can ' + ct.join(' or ') + (lo ? ', or visit us in ' + lo : '') + '. We will be happy to help.' : 'Questions? Please visit us' + (lo ? ' in ' + lo : '') + '. We will be happy to help.'] });
        return { title: 'About ' + name, date: '', sections: S };
      }, 'about-us');
    /* an extra button to rewrite with different words */
    var mk = $q(root, '#mk'); var again = document.createElement('button'); again.type = 'button'; again.className = 'btn alt'; again.textContent = 'Write it again (different words)';
    again.onclick = function () { mk.click(); }; mk.parentNode.appendChild(again);
  };
})();
