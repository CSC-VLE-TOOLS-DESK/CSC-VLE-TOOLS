/* CSC VLE TOOLS - Home + Back buttons and Theme / Background switcher for the ledger pages.
   Home  -> index.html (main home page)
   Back  -> the page you came from (e.g. the category page). If the page was opened directly, Back goes to cat-bill.html.
   Theme -> saved on this device, shared by all ledgers. Shop Ledger keeps its own theme button. */
(function () {
  'use strict';
  var OWN = !!(document.currentScript && document.currentScript.hasAttribute('data-own-theme'));
  var FALLBACK = (document.documentElement.getAttribute('data-back') || 'cat-bill.html');
  var KEY = 'cscvle_ledger_theme', BGKEY = 'cscvle_ledger_bg';
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function goBack() {
    var same = false;
    try { same = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
    if (same && history.length > 1) history.back(); else location.href = FALLBACK;
  }
  window.CSCgoBack = goBack;

  /* name, label, light?, vars */
  var T = {
    cream:  ['Cream (light)', 1, { bg: '#fbf7ec', p: '#ffffff', b: '#e3dac2', t: '#1f2937', m: '#6b7280', hd: '#fff7e0', fld: '#ffffff', th: '#f3ecd6', hv: '#faf3dc' }],
    white:  ['White (light)', 1, { bg: '#f3f6fa', p: '#ffffff', b: '#d9e1ec', t: '#0f172a', m: '#64748b', hd: '#ffffff', fld: '#ffffff', th: '#e8eef6', hv: '#eef3fa' }],
    ocean:  ['Ocean (light)', 1, { bg: '#e6f2fb', p: '#ffffff', b: '#b9d6ec', t: '#0b2a40', m: '#4f6f86', hd: '#d5e9f8', fld: '#ffffff', th: '#d3e7f6', hv: '#e1effa' }],
    forest: ['Forest (light)', 1, { bg: '#eaf5ee', p: '#ffffff', b: '#c1dfcc', t: '#12301f', m: '#55705f', hd: '#d9eee1', fld: '#ffffff', th: '#d5ebdc', hv: '#e4f3e9' }],
    saffron:['Saffron (light)', 1, { bg: '#fff3e3', p: '#ffffff', b: '#f0d2a6', t: '#3a2208', m: '#8a6a45', hd: '#ffe8c7', fld: '#ffffff', th: '#fde6c4', hv: '#fff0da' }],
    rose:   ['Rose (light)', 1, { bg: '#fdeef2', p: '#ffffff', b: '#f2c7d3', t: '#3b1220', m: '#8a5566', hd: '#fbdce5', fld: '#ffffff', th: '#fadbe4', hv: '#fde7ed' }],
    violet: ['Violet (light)', 1, { bg: '#f1ecfb', p: '#ffffff', b: '#d5c9f0', t: '#241a45', m: '#6c5f8f', hd: '#e5dcf8', fld: '#ffffff', th: '#e3d9f6', hv: '#ede6fa' }],
    slate:  ['Slate (soft dark)', 0, { bg: '#1e293b', p: '#273449', b: '#3b4a63', t: '#f1f5f9', m: '#9fb0c8' }],
    dark:   ['Dark (original)', 0, null]
  };
  var DEFAULT = 'cream';

  var css = '' +
    '.appnav{display:inline-flex;gap:6px;align-items:center}' +
    '.appnav a,.appnav button{background:var(--bl,#2563eb);color:#fff;border:0;text-decoration:none;padding:7px 11px;border-radius:7px;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;line-height:1.2}' +
    '.appnav button:hover{filter:brightness(1.1)}' +
    '.themebox{position:relative;margin-left:auto}' +
    '.themebox>button{background:#7c3aed;color:#fff;border:0;border-radius:7px;padding:7px 11px;font-weight:700;cursor:pointer}' +
    '.thememenu{position:absolute;right:0;top:calc(100% + 6px);z-index:300;min-width:230px;background:#fff;color:#111;border:1px solid #cbd5e1;border-radius:10px;padding:8px;box-shadow:0 10px 30px #0003}' +
    '.thememenu[hidden]{display:none}' +
    '.thememenu .tm{display:flex;align-items:center;gap:8px;width:100%;text-align:left;background:#fff;color:#111;border:1px solid transparent;border-radius:7px;padding:6px 8px;font-weight:600;font-size:13px;cursor:pointer}' +
    '.thememenu .tm:hover{background:#f1f5f9}.thememenu .tm.on{border-color:#7c3aed;background:#f5f0ff}' +
    '.thememenu i{width:18px;height:18px;border-radius:50%;border:1px solid #0003;flex:0 0 auto}' +
    '.thememenu .bgrow{display:flex;align-items:center;gap:8px;margin-top:6px;padding:6px 8px;border-top:1px solid #e2e8f0;font-size:13px;font-weight:600}' +
    '.thememenu .bgrow input[type=color]{width:34px;height:26px;padding:0;border:1px solid #94a3b8;border-radius:5px;background:#fff}' +
    '.thememenu .bgrow button{margin-left:auto;background:#e2e8f0;color:#111;border:0;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px}' +
    /* light-theme repaint of the dark colours written into the ledger pages */
    'html[data-light] header{background:var(--hd)!important;border-bottom-color:var(--b)!important}' +
    'html[data-light] button,html[data-light] select,html[data-light] input,html[data-light] textarea{background:var(--fld);color:var(--t);border-color:var(--b)}' +
    'html[data-light] button:hover{background:var(--hv)}' +
    'html[data-light] .appnav a,html[data-light] .appnav button,html[data-light] a.home,html[data-light] .blu{background:#2563eb!important;color:#fff!important;border-color:#2563eb}' +
    'html[data-light] .themebox>button{background:#7c3aed!important;color:#fff!important}' +
    'html[data-light] .pri,html[data-light] .tabs button.on{background:#0f9d6a;color:#fff;border-color:#0f9d6a}' +
    'html[data-light] .pri:hover{background:#0b8a5c}' +
    'html[data-light] .dng{background:#fee2e2;color:#b91c1c;border-color:#fca5a5}' +
    'html[data-light] .pos{color:#047857}html[data-light] .neg{color:#b91c1c}html[data-light] .warn{color:#b45309}' +
    'html[data-light] .box h2{color:var(--t)}html[data-light] .form input,html[data-light] .form select{color:var(--t)}' +
    'html[data-light] th,html[data-light] tfoot td{background:var(--th);color:var(--m)}' +
    'html[data-light] tr:hover td,html[data-light] .tot div{background:var(--hv)}' +
    'html[data-light] #modal .mb{border-color:var(--b)}' +
    'html[data-light] .t-red{background:#fee2e2;color:#b91c1c}html[data-light] .t-yel{background:#fef3c7;color:#92400e}html[data-light] .t-grn{background:#d1fae5;color:#065f46}html[data-light] .t-blu{background:#dbeafe;color:#1e40af}html[data-light] .t-gry{background:#e5e7eb;color:#374151}' +
    'html[data-light] h1 span{color:#0f766e;border-color:#0f766e55}';

  function applyTheme(name) {
    var th = T[name] || T[DEFAULT], root = document.documentElement, v = th[2];
    var st = document.getElementById('appThemeVars');
    if (!st) { st = document.createElement('style'); st.id = 'appThemeVars'; document.head.appendChild(st); }
    if (!v) { st.textContent = ''; root.removeAttribute('data-light'); root.style.colorScheme = 'dark'; }
    else {
      var s = ':root{';
      Object.keys(v).forEach(function (k) { s += '--' + k + ':' + v[k] + ';'; });
      st.textContent = s + '}';
      if (th[1]) { root.setAttribute('data-light', '1'); root.style.colorScheme = 'light'; } else { root.removeAttribute('data-light'); root.style.colorScheme = 'dark'; }
    }
    var bg = lsGet(BGKEY);
    if (bg && /^#[0-9a-f]{6}$/i.test(bg)) document.documentElement.style.setProperty('--bg', bg); else document.documentElement.style.removeProperty('--bg');
  }

  function init() {
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    var name = lsGet(KEY); if (!T[name]) name = DEFAULT;
    var hasOwnTheme = OWN || !!document.getElementById('themeBtn');   /* Shop Ledger */
    if (!hasOwnTheme) applyTheme(name);

    var header = document.querySelector('header');
    if (!header) return;
    var home = header.querySelector('a.home');
    var nav = document.createElement('span'); nav.className = 'appnav';
    var back = document.createElement('button'); back.type = 'button'; back.textContent = '← Back'; back.title = 'Go back to the previous page';
    back.onclick = goBack;
    if (home) { home.parentNode.insertBefore(nav, home); nav.appendChild(home); }
    else {
      home = document.createElement('a'); home.className = 'home'; home.href = 'index.html'; home.textContent = '🏠 Home'; home.title = 'Go to the main home page';
      nav.appendChild(home);
      header.insertBefore(nav, header.firstChild);
    }
    nav.appendChild(back);
    if (hasOwnTheme) return;

    var box = document.createElement('div'); box.className = 'themebox';
    var btn = document.createElement('button'); btn.type = 'button'; btn.textContent = '🎨 Theme'; btn.setAttribute('aria-haspopup', 'true'); btn.setAttribute('aria-expanded', 'false');
    var menu = document.createElement('div'); menu.className = 'thememenu'; menu.hidden = true;
    function build() {
      var cur = lsGet(KEY); if (!T[cur]) cur = DEFAULT;
      menu.innerHTML = Object.keys(T).map(function (k) {
        var sw = T[k][2] ? T[k][2].bg : '#0b0f19';
        return '<button type="button" class="tm' + (k === cur ? ' on' : '') + '" data-k="' + k + '"><i style="background:' + sw + '"></i>' + T[k][0] + '</button>';
      }).join('') + '<div class="bgrow"><label for="appBg">Background</label><input type="color" id="appBg" value="' + (lsGet(BGKEY) || (T[cur][2] ? T[cur][2].bg : '#0b0f19')) + '"><button type="button" id="appBgReset">Reset</button></div>';
    }
    build();
    menu.addEventListener('click', function (e) {
      var b = e.target.closest('.tm');
      if (b) { lsSet(KEY, b.getAttribute('data-k')); try { localStorage.removeItem(BGKEY); } catch (x) {} applyTheme(b.getAttribute('data-k')); build(); }
      if (e.target.id === 'appBgReset') { try { localStorage.removeItem(BGKEY); } catch (x) {} applyTheme(lsGet(KEY) || DEFAULT); build(); }
    });
    menu.addEventListener('input', function (e) { if (e.target.id === 'appBg') { lsSet(BGKEY, e.target.value); document.documentElement.style.setProperty('--bg', e.target.value); } });
    btn.onclick = function (e) { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', String(!menu.hidden)); };
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu.hidden = true; });
    box.appendChild(btn); box.appendChild(menu); header.appendChild(box);
  }
  /* apply the saved theme immediately to avoid a dark flash */
  try { if (!OWN && document.head) applyTheme(T[lsGet(KEY)] ? lsGet(KEY) : DEFAULT); } catch (e) {}
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
