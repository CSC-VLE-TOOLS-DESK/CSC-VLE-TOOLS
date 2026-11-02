/* Web search: opens results or a typed website address in a NEW tab (other sites cannot be shown inside this page). */
(function () {
  var E = { google: ['Google', 'https://www.google.com/search?q='], bing: ['Bing', 'https://www.bing.com/search?q='], ddg: ['DuckDuckGo', 'https://duckduckgo.com/?q='],
    img: ['Google Images', 'https://www.google.com/search?tbm=isch&q='], yt: ['YouTube', 'https://www.youtube.com/results?search_query='],
    wiki: ['Wikipedia', 'https://en.wikipedia.org/w/index.php?search='], maps: ['Google Maps', 'https://www.google.com/maps/search/'] };
  /* Quick sites: edit this list to add or remove shortcuts. [name, note, address] */
  var SITES = [['Google', 'Search the web', 'https://www.google.com/'], ['YouTube', 'Videos', 'https://www.youtube.com/'], ['Gmail', 'Email', 'https://mail.google.com/'],
    ['DigiLocker', 'Documents', 'https://www.digilocker.gov.in/'], ['UMANG', 'Government services', 'https://web.umang.gov.in/'], ['India.gov.in', 'National portal', 'https://www.india.gov.in/'],
    ['IRCTC', 'Train tickets', 'https://www.irctc.co.in/'], ['Income Tax', 'e-Filing', 'https://www.incometax.gov.in/'], ['Parivahan', 'Driving licence, vehicles', 'https://parivahan.gov.in/'],
    ['Wikipedia', 'Encyclopedia', 'https://www.wikipedia.org/']];
  function target(q, k) {
    q = (q || '').trim(); if (!q) return '';
    if (!/\s/.test(q) && /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?([\/?#]\S*)?$/i.test(q)) return /^https?:\/\//i.test(q) ? q : 'https://' + q;
    return (E[k] || E.google)[1] + encodeURIComponent(q);
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  document.querySelectorAll('form[data-ws]').forEach(function (f) {
    var sel = f.querySelector('select'), inp = f.querySelector('input');
    sel.innerHTML = Object.keys(E).map(function (k) { return '<option value="' + k + '">' + E[k][0] + '</option>'; }).join('');
    try { var s = localStorage.getItem('csc_ws_engine'); if (s && E[s]) sel.value = s; } catch (e) { }
    sel.addEventListener('change', function () { try { localStorage.setItem('csc_ws_engine', sel.value); } catch (e) { } });
    f.addEventListener('submit', function (ev) {
      ev.preventDefault(); var u = target(inp.value, sel.value); if (!u) { inp.focus(); return; }
      var a = document.createElement('a'); a.href = u; a.target = '_blank'; a.rel = 'noopener noreferrer'; document.body.appendChild(a); a.click(); a.remove();
    });
  });
  document.querySelectorAll('[data-ws-sites]').forEach(function (box) {
    var n = +box.getAttribute('data-ws-sites') || SITES.length;
    box.innerHTML = SITES.slice(0, n).map(function (s) { return '<a href="' + esc(s[2]) + '" target="_blank" rel="noopener noreferrer">' + esc(s[0]) + (box.classList.contains('ws-grid') ? '<small>' + esc(s[1]) + '</small>' : '') + '</a>'; }).join('');
  });
  document.querySelectorAll('[data-ws-links]').forEach(function (box) {
    var L = (window.CSC && CSC.LINKS) || []; box.innerHTML = L.map(function (l) { return '<a href="' + esc(l[2]) + '" target="_blank" rel="noopener noreferrer"><i class="fa-solid ' + esc(l[3]) + '" aria-hidden="true"></i> ' + esc(l[0]) + '<small>' + esc(l[1]) + '</small></a>'; }).join('');
  });
})();
