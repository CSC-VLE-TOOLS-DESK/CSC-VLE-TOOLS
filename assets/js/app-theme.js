/* CSC VLE TOOLS v37 - Theme + Background drop-down for pages that use the --bg / --card / --tx / --pr colour variables
   (Haryana Application Generator). Same themes and the same saved choice as the ledgers (Stock, House Expense, Insurance, Medical ...). */
(function () {
  'use strict';
  var KEY = 'cscvle_ledger_theme', BGKEY = 'cscvle_ledger_bg', DEFAULT = 'cream';
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
  /* name: [label, light?, bg, card, border, text, muted, accent, soft] */
  var T = {
    cream:   ['Cream (light)', 1, '#fbf7ec', '#ffffff', '#e3dac2', '#1f2937', '#6b7280', '#0f766e', '#e3f3ea'],
    white:   ['White (light)', 1, '#f3f6fa', '#ffffff', '#d9e1ec', '#0f172a', '#64748b', '#1a3fa6', '#e6eefc'],
    ocean:   ['Ocean (light)', 1, '#e6f2fb', '#ffffff', '#b9d6ec', '#0b2a40', '#4f6f86', '#0b6aa8', '#d5e9f8'],
    forest:  ['Forest (light)', 1, '#eaf5ee', '#ffffff', '#c1dfcc', '#12301f', '#55705f', '#0b5c3b', '#d9eee1'],
    saffron: ['Saffron (light)', 1, '#fff3e3', '#ffffff', '#f0d2a6', '#3a2208', '#8a6a45', '#c2570c', '#ffe8c7'],
    rose:    ['Rose (light)', 1, '#fdeef2', '#ffffff', '#f2c7d3', '#3b1220', '#8a5566', '#be185d', '#fbdce5'],
    violet:  ['Violet (light)', 1, '#f1ecfb', '#ffffff', '#d5c9f0', '#241a45', '#6c5f8f', '#6d28d9', '#e5dcf8'],
    slate:   ['Slate (soft dark)', 0, '#1e293b', '#273449', '#3b4a63', '#f1f5f9', '#9fb0c8', '#4cc38a', '#16322a'],
    dark:    ['Dark', 0, '#10151b', '#18202a', '#2c3846', '#e8edf2', '#98a6b4', '#4cc38a', '#16322a']
  };
  function mix(h, to, t) {
    function p(x) { return [1, 3, 5].map(function (i) { return parseInt(x.substr(i, 2), 16); }); }
    var a = p(h), b = p(to);
    return '#' + a.map(function (v, i) { return ('0' + Math.round(v + (b[i] - v) * t).toString(16)).slice(-2); }).join('');
  }
  var VARS = ['--bg', '--card', '--bd', '--tx', '--mu', '--pr', '--pr2', '--on', '--brand', '--brand-strong', '--soft', '--csc-brand', '--csc-brand-strong', '--csc-brand-soft', '--csc-canvas'];
  function apply(name) {
    var t = T[name] || T[DEFAULT], r = document.documentElement, s = r.style;
    var bg = lsGet(BGKEY); if (!(bg && /^#[0-9a-f]{6}$/i.test(bg))) bg = t[2];
    r.setAttribute('data-theme', t[1] ? 'light' : 'dark');
    s.colorScheme = t[1] ? 'light' : 'dark';
    s.setProperty('--bg', bg); s.setProperty('--card', t[3]); s.setProperty('--bd', t[4]); s.setProperty('--tx', t[5]); s.setProperty('--mu', t[6]);
    s.setProperty('--pr', t[7]); s.setProperty('--pr2', t[8]); s.setProperty('--on', t[1] ? '#ffffff' : '#06140e');
    /* the shared portal colour names (cards, buttons, header) */
    s.setProperty('--surface', t[3]); s.setProperty('--line', t[4]); s.setProperty('--text', t[5]); s.setProperty('--muted', t[6]); s.setProperty('--on-brand', t[1] ? '#ffffff' : '#06140e');
    /* the site header and page heading follow the accent colour */
    s.setProperty('--brand', t[7]); s.setProperty('--brand-strong', mix(t[7], '#000000', 0.35)); s.setProperty('--soft', t[8]);
    s.setProperty('--csc-brand', t[7]); s.setProperty('--csc-brand-strong', mix(t[7], '#000000', 0.35)); s.setProperty('--csc-brand-soft', t[8]); s.setProperty('--csc-canvas', bg);
  }
  var cur = lsGet(KEY); if (!T[cur]) cur = DEFAULT;
  apply(cur);   /* before first paint: no dark flash */

  var css = '.apptheme{position:relative;display:inline-block;margin-left:auto}' +
    '.apptheme>button{background:#7c3aed;color:#fff;border:0;border-radius:10px;padding:9px 14px;font:inherit;font-size:.9rem;font-weight:800;cursor:pointer;box-shadow:0 4px 0 #5b21b6}' +
    '.apptheme>button:hover{filter:brightness(1.1)}.apptheme>button:active{transform:translateY(3px);box-shadow:none}' +
    '.apptheme .atm{position:absolute;right:0;top:calc(100% + 8px);z-index:400;min-width:240px;background:#fff;color:#111;border:1px solid #cbd5e1;border-radius:12px;padding:8px;box-shadow:0 12px 32px rgba(0,0,0,.3)}' +
    '.apptheme .atm[hidden]{display:none}' +
    '.apptheme .atm .tm{display:flex;align-items:center;gap:9px;width:100%;text-align:left;background:#fff;color:#111;border:1px solid transparent;border-radius:8px;padding:7px 9px;font:inherit;font-weight:600;font-size:.88rem;cursor:pointer}' +
    '.apptheme .atm .tm:hover{background:#f1f5f9}.apptheme .atm .tm.on{border-color:#7c3aed;background:#f5f0ff}' +
    '.apptheme .atm .tm i{width:18px;height:18px;border-radius:50%;border:1px solid #0003;flex:none}' +
    '.apptheme .atm .bgrow{display:flex;align-items:center;gap:8px;margin-top:6px;padding:8px 9px 4px;border-top:1px solid #e2e8f0;font-size:.85rem;font-weight:700;color:#111}' +
    '.apptheme .atm .bgrow label{margin:0;color:#111;font-size:.85rem}' +
    '.apptheme .atm .bgrow input[type=color]{width:36px;height:28px;padding:0;border:1px solid #94a3b8;border-radius:6px;background:#fff}' +
    '.apptheme .atm .bgrow button{margin-left:auto;background:#e2e8f0;color:#111;border:0;border-radius:7px;padding:5px 9px;cursor:pointer;font:inherit;font-size:.8rem}' +
    '@media print{.apptheme{display:none!important}}';

  function init() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var bar = document.querySelector('.tool-bar');
    if (!bar) return;
    var box = document.createElement('div'); box.className = 'apptheme';
    var btn = document.createElement('button'); btn.type = 'button'; btn.textContent = '🎨 Theme ▾'; btn.setAttribute('aria-haspopup', 'true'); btn.setAttribute('aria-expanded', 'false');
    var menu = document.createElement('div'); menu.className = 'atm'; menu.hidden = true;
    function build() {
      var c = lsGet(KEY); if (!T[c]) c = DEFAULT;
      menu.innerHTML = Object.keys(T).map(function (k) {
        return '<button type="button" class="tm' + (k === c ? ' on' : '') + '" data-k="' + k + '"><i style="background:' + T[k][2] + '"></i>' + T[k][0] + '</button>';
      }).join('') + '<div class="bgrow"><label for="atBg">Background</label><input type="color" id="atBg" value="' + (lsGet(BGKEY) || T[c][2]) + '"><button type="button" id="atBgReset">Reset</button></div>';
    }
    build();
    menu.addEventListener('click', function (e) {
      e.stopPropagation();
      var b = e.target.closest('.tm');
      if (b) { lsSet(KEY, b.getAttribute('data-k')); lsDel(BGKEY); apply(b.getAttribute('data-k')); build(); }
      if (e.target.id === 'atBgReset') { lsDel(BGKEY); apply(lsGet(KEY) || DEFAULT); build(); }
    });
    menu.addEventListener('input', function (e) { if (e.target.id === 'atBg') { lsSet(BGKEY, e.target.value); apply(lsGet(KEY) || DEFAULT); } });
    btn.onclick = function (e) { e.stopPropagation(); if (menu.hidden) build(); menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', String(!menu.hidden)); };
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu.hidden = true; });
    box.appendChild(btn); box.appendChild(menu); bar.appendChild(box);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  /* the site's own Theme menu re-writes its colours after load; put ours back */
  window.addEventListener('load', function () { apply(lsGet(KEY) && T[lsGet(KEY)] ? lsGet(KEY) : DEFAULT); });
})();
