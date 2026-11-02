/* Typing Pro: lessons + timed test, English and Hindi (Inscript), on-screen keyboard, finger and hand guide. */
(function () {
  'use strict';
  var FING = { LP: ['Left little finger', '#a855f7'], LR: ['Left ring finger', '#3b82f6'], LM: ['Left middle finger', '#22c55e'], LI: ['Left index finger', '#f59e0b'],
    RI: ['Right index finger', '#f59e0b'], RM: ['Right middle finger', '#22c55e'], RR: ['Right ring finger', '#3b82f6'], RP: ['Right little finger', '#a855f7'], TH: ['Thumb (space bar)', '#94a3b8'] };
  /* [code, normal, shift, hindi normal, hindi shift, finger] */
  var ROWS = [
    [['Backquote', '`', '~', 'ॊ', 'ऒ', 'LP'], ['Digit1', '1', '!', '१', 'ऍ', 'LP'], ['Digit2', '2', '@', '२', 'ॅ', 'LR'], ['Digit3', '3', '#', '३', '्र', 'LM'], ['Digit4', '4', '$', '४', 'र्', 'LI'], ['Digit5', '5', '%', '५', 'ज्ञ', 'LI'],
      ['Digit6', '6', '^', '६', 'त्र', 'RI'], ['Digit7', '7', '&', '७', 'क्ष', 'RI'], ['Digit8', '8', '*', '८', 'श्र', 'RM'], ['Digit9', '9', '(', '९', '(', 'RR'], ['Digit0', '0', ')', '०', ')', 'RP'], ['Minus', '-', '_', '-', 'ः', 'RP'], ['Equal', '=', '+', 'ृ', 'ऋ', 'RP']],
    [['KeyQ', 'q', 'Q', 'ौ', 'औ', 'LP'], ['KeyW', 'w', 'W', 'ै', 'ऐ', 'LR'], ['KeyE', 'e', 'E', 'ा', 'आ', 'LM'], ['KeyR', 'r', 'R', 'ी', 'ई', 'LI'], ['KeyT', 't', 'T', 'ू', 'ऊ', 'LI'], ['KeyY', 'y', 'Y', 'ब', 'भ', 'RI'], ['KeyU', 'u', 'U', 'ह', 'ङ', 'RI'],
      ['KeyI', 'i', 'I', 'ग', 'घ', 'RM'], ['KeyO', 'o', 'O', 'द', 'ध', 'RR'], ['KeyP', 'p', 'P', 'ज', 'झ', 'RP'], ['BracketLeft', '[', '{', 'ड', 'ढ', 'RP'], ['BracketRight', ']', '}', '़', 'ञ', 'RP'], ['Backslash', '\\', '|', 'ॉ', 'ऑ', 'RP']],
    [['KeyA', 'a', 'A', 'ो', 'ओ', 'LP'], ['KeyS', 's', 'S', 'े', 'ए', 'LR'], ['KeyD', 'd', 'D', '्', 'अ', 'LM'], ['KeyF', 'f', 'F', 'ि', 'इ', 'LI'], ['KeyG', 'g', 'G', 'ु', 'उ', 'LI'], ['KeyH', 'h', 'H', 'प', 'फ', 'RI'], ['KeyJ', 'j', 'J', 'र', 'ऱ', 'RI'],
      ['KeyK', 'k', 'K', 'क', 'ख', 'RM'], ['KeyL', 'l', 'L', 'त', 'थ', 'RR'], ['Semicolon', ';', ':', 'च', 'छ', 'RP'], ['Quote', "'", '"', 'ट', 'ठ', 'RP']],
    [['KeyZ', 'z', 'Z', 'ॆ', 'ऎ', 'LP'], ['KeyX', 'x', 'X', 'ं', 'ँ', 'LR'], ['KeyC', 'c', 'C', 'म', 'ण', 'LM'], ['KeyV', 'v', 'V', 'न', 'ऩ', 'LI'], ['KeyB', 'b', 'B', 'व', 'ऴ', 'LI'], ['KeyN', 'n', 'N', 'ल', 'ळ', 'RI'], ['KeyM', 'm', 'M', 'स', 'श', 'RI'],
      ['Comma', ',', '<', ',', 'ष', 'RM'], ['Period', '.', '>', '.', '।', 'RR'], ['Slash', '/', '?', 'य', 'य़', 'RP']]
  ];
  var KEYBYCODE = {}, EN = {}, HI = {};
  ROWS.forEach(function (r) { r.forEach(function (k) { KEYBYCODE[k[0]] = k; EN[k[1]] = [k, 0]; EN[k[2]] = EN[k[2]] || [k, 1]; if (!HI[k[3]]) HI[k[3]] = [k, 0]; if (!HI[k[4]]) HI[k[4]] = [k, 1]; }); });
  var EN_TEXT = [
    'CSC centres bring digital services to every village. Citizens can apply for certificates, pay bills and book tickets without travelling far.',
    'Typing is a skill that grows with practice. Sit straight, keep your fingers on the home row and look at the screen, not at the keys.',
    'A good operator is polite, quick and careful. Always check the name, date of birth and mobile number before you submit any form.',
    'Digital India helps people save time and money. Online forms, e-wallets and bank apps are now part of daily life in small towns as well.',
    'Please keep your documents ready. You will need an Aadhaar card, a passport size photo and a valid mobile number to finish the application.',
    'Practice every day for fifteen minutes. Speed will come slowly, but accuracy must come first. A few correct words are better than many wrong ones.'];
  var HI_TEXT = [
    'सीएससी केंद्र ग्रामीण क्षेत्र के लोगों को डिजिटल सेवाएँ उपलब्ध कराते हैं।',
    'भारत एक विशाल देश है जहाँ अनेक भाषाएँ बोली जाती हैं।',
    'समय पर अपना कार्य पूरा करना सफलता की कुंजी है।',
    'स्वच्छ भारत अभियान से हमारा देश स्वस्थ और सुंदर बनेगा।',
    'कंप्यूटर सीखकर युवा रोजगार के नए अवसर पा सकते हैं।',
    'किसान हमारे अन्नदाता हैं और उनकी मेहनत का सम्मान करना चाहिए।',
    'ऑनलाइन आवेदन करने से समय और धन दोनों की बचत होती है।'];
  var EN_WORDS = 'the and for you are with this that from have they will your work time form date name card bank page file send save open read book line good make home city help data user list name phone number address photo sign print copy paste check submit apply fees'.split(' ');
  var HI_WORDS = 'भारत देश समय काम पानी किताब सरकार सेवा केंद्र नाम पता फोटो फॉर्म बैंक खाता घर गाँव शहर लोग स्कूल कक्षा परीक्षा आवेदन'.split(' ');
  var LESSONS = {
    en: [
      { n: 'Home row', k: 'asdfjkl;', t: 'a s d f   j k l ;  (keys under your fingers)' }, { n: 'Home row + g h', k: 'asdfghjkl', t: 'Index fingers reach g and h' },
      { n: 'Top row', k: 'qwertyuiop', t: 'Reach up from the home row' }, { n: 'Bottom row', k: 'zxcvbnm,.', t: 'Reach down from the home row' },
      { n: 'Numbers', k: '1234567890', t: 'Top number row' }, { n: 'Capital letters', k: 'asdfghjklqwertyuiop', cap: 1, t: 'Hold Shift with the little finger of the other hand' }, { n: 'Common words', words: EN_WORDS, t: 'Real words' }],
    hi: [
      { n: 'Home row (मध्य पंक्ति)', c: 'प र क त च ट'.split(' '), m: 'ो े ि ु'.split(' '), t: 'ो े ि ु प र क त च ट' }, { n: 'Top row (ऊपर की पंक्ति)', c: 'ब ह ग द ज ड'.split(' '), m: 'ौ ै ा ी ू'.split(' '), t: 'ौ ै ा ी ू ब ह ग द ज ड' },
      { n: 'Bottom row (नीचे की पंक्ति)', c: 'म न व ल स य'.split(' '), m: ['ं'], t: 'म न व ल स य ं' }, { n: 'Vowels (Shift)', v: 'अ आ इ ई उ ऊ ए ऐ ओ औ'.split(' '), t: 'Hold Shift: अ आ इ ई उ ऊ ए ऐ ओ औ' }, { n: 'Common words (शब्द)', words: HI_WORDS, t: 'Real words' }]
  };
  var css = '.tp{max-width:980px;margin:0 auto}.tp *{box-sizing:border-box}.tp .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 10px}.tp .tab{border:2px solid #d8e3ff;background:#fff;color:#1a3fa6;font:inherit;font-weight:800;padding:9px 16px;border-radius:12px;cursor:pointer;box-shadow:0 3px 0 #c5d3f5}.tp .tab[aria-pressed=true]{background:#1a3fa6;color:#fff;border-color:#1a3fa6;box-shadow:0 3px 0 #0f2a75}' +
    '.tp select,.tp .btn2{font:inherit;padding:9px 12px;border-radius:12px;border:2px solid #d8e3ff;background:#fff}.tp .btn2{font-weight:800;cursor:pointer;background:linear-gradient(#ffa726,#e68900);border-color:#e68900;color:#2b1700;box-shadow:0 3px 0 #b36b00}' +
    '.tp .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:0 0 10px}.tp .st{background:#fff;border:2px solid #d8e3ff;border-radius:14px;text-align:center;padding:8px 4px}.tp .st b{display:block;font-size:1.5rem;color:#1a3fa6}.tp .st small{color:#5b6785}' +
    '.tp .text{background:#fff;border:2px solid #d8e3ff;border-radius:16px;padding:14px;font-size:1.35rem;line-height:2.1;max-height:190px;overflow:auto;font-family:"Mukta","Noto Sans Devanagari","Nirmala UI",Mangal,Georgia,serif;word-break:break-word}' +
    '.tp .text span{border-radius:4px}.tp .text .ok{color:#15803d}.tp .text .bad{background:#fecaca;color:#b91c1c}.tp .text .cur{background:#fde68a;outline:2px solid #f59e0b}.tp textarea{width:100%;margin-top:10px;min-height:92px;font-size:1.3rem;padding:12px;border:3px solid #1a3fa6;border-radius:14px;font-family:inherit}' +
    '.tp .kb{margin:12px auto 0;max-width:760px;user-select:none}.tp .kr{display:flex;gap:4px;margin-bottom:4px;justify-content:center}.tp .k{flex:1 1 0;min-width:0;max-width:52px;height:46px;border-radius:8px;border:2px solid;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;background:#fff;line-height:1.1;box-shadow:0 3px 0 rgba(0,0,0,.18);transition:transform .05s}' +
    '.tp .k small{font-size:.62rem;opacity:.7}.tp .k.on{transform:translateY(2px) scale(1.08);box-shadow:0 0 0 4px rgba(245,158,11,.55);background:#fef3c7!important;animation:tpp .7s infinite}.tp .k.wide{max-width:none;flex:2.2 1 0}.tp .k.space{max-width:none;flex:7 1 0}@keyframes tpp{50%{box-shadow:0 0 0 7px rgba(245,158,11,.25)}}' +
    '.tp .hint{background:#eef3ff;border:2px solid #d8e3ff;border-radius:14px;padding:10px 14px;margin-top:10px;font-weight:700;color:#1a3fa6;text-align:center}.tp .hands{max-width:520px;margin:8px auto 0;display:block}.tp .fing{transition:all .12s}.tp .fing.on{stroke:#111;stroke-width:3;filter:drop-shadow(0 0 6px #f59e0b)}' +
    '.tp .res{background:#ecfdf5;border:3px solid #22c55e;border-radius:18px;padding:16px;margin-top:12px;text-align:center}.tp .res h3{margin:0 0 8px;color:#15803d}.tp .leg{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:8px;font-size:.78rem}.tp .leg i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:4px;vertical-align:-1px}' +
    '@media(max-width:560px){.tp .k{height:38px;font-size:.7rem}.tp .k small{display:none}.tp .st b{font-size:1.15rem}.tp .text{font-size:1.15rem}}';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }
  function drill(L, lang) {
    var out = [], len = 0, i, w;
    function add(t) { out.push(t); len += t.length + 1; }
    while (len < 70) {
      if (L.words) add(pick(L.words));
      else if (lang === 'en') { w = ''; for (i = 0; i < 2 + rnd(4); i++) w += L.k.charAt(rnd(L.k.length)); add(L.cap ? w.charAt(0).toUpperCase() + w.slice(1) : w); }
      else if (L.v) { w = ''; for (i = 0; i < 2 + rnd(2); i++) w += pick(L.v); add(w); }
      else { w = ''; for (i = 0; i < 2; i++) w += pick(L.c) + (rnd(3) ? pick(L.m) : ''); add(w); }
    }
    return out.join(' ');
  }
  function clusters(s) {
    var cps = Array.from(s), res = [], pos = 0, seg;
    if (window.Intl && Intl.Segmenter) { seg = new Intl.Segmenter('hi', { granularity: 'grapheme' }); Array.from(seg.segment(s)).forEach(function (g) { var n = Array.from(g.segment).length; res.push([pos, pos + n]); pos += n; }); }
    else { var re = /(\P{M}\p{M}*)/gu, m; while ((m = re.exec(s))) { var n2 = Array.from(m[0]).length; res.push([pos, pos + n2]); pos += n2; } }
    return { cps: cps, cl: res };
  }
  window.TypingPro = function (root) {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var S = { mode: 'lesson', lang: 'en', dur: 60, li: 0, target: '', start: 0, keys: 0, bad: 0, done: false, timer: 0, builtin: true };
    root.innerHTML = '<div class="tp"><div class="row" id="tp-m"><button class="tab" data-m="lesson" type="button">Lessons</button><button class="tab" data-m="test" type="button">Speed Test</button><span style="flex:1"></span><button class="tab" data-l="en" type="button">English</button><button class="tab" data-l="hi" type="button">हिंदी</button></div>' +
      '<div class="row"><select id="tp-sel" aria-label="Choose lesson or time"></select><button class="btn2" id="tp-new" type="button">New text</button><label id="tp-bl" style="font-size:.85rem"><input type="checkbox" id="tp-bi" checked> Built-in Hindi keyboard (Inscript)</label></div>' +
      '<div class="stats"><div class="st"><b id="s-w">0</b><small>Speed (WPM)</small></div><div class="st"><b id="s-a">100%</b><small>Accuracy</small></div><div class="st"><b id="s-e">0</b><small>Mistakes</small></div><div class="st"><b id="s-t">0:00</b><small id="s-tl">Time</small></div></div>' +
      '<div class="text" id="tp-text" aria-live="off"></div><textarea id="tp-in" rows="3" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Type here" placeholder="Click here and start typing. The timer starts with your first key."></textarea>' +
      '<div class="hint" id="tp-hint"></div><div class="kb" id="tp-kb"></div><svg class="hands" id="tp-hands" viewBox="0 0 420 150" role="img" aria-label="Finger guide"></svg><div class="leg" id="tp-leg"></div><div id="tp-res"></div></div>';
    var $ = function (s) { return root.querySelector(s); };
    /* keyboard */
    var kb = $('#tp-kb'), keyEls = {};
    function buildKB() {
      kb.innerHTML = ''; keyEls = {};
      ROWS.forEach(function (r, ri) {
        var d = document.createElement('div'); d.className = 'kr';
        if (ri === 3) d.appendChild(mk('Shift', 'wide', '#e5e7eb'));
        r.forEach(function (k) { var e = mk(S.lang === 'hi' ? k[3] : k[1], '', FING[k[5]][1], S.lang === 'hi' ? k[4] : k[2]); e.setAttribute('data-c', k[0]); keyEls[k[0]] = e; d.appendChild(e); });
        if (ri === 3) d.appendChild(mk('Shift', 'wide', '#e5e7eb'));
        kb.appendChild(d);
      });
      var sp = document.createElement('div'); sp.className = 'kr'; sp.appendChild(mk('Space', 'space', FING.TH[1])); kb.appendChild(sp); keyEls.Space = sp.firstChild;
    }
    function mk(t, cls, col, sub) { var e = document.createElement('div'); e.className = 'k ' + cls; e.style.borderColor = col; e.style.background = col + '22'; e.innerHTML = esc(t) + (sub ? '<small>' + esc(sub) + '</small>' : ''); return e; }
    /* hands */
    var hands = $('#tp-hands');
    function buildHands() {
      var f = [['LP', 22, 62, 34, 70], ['LR', 56, 38, 36, 94], ['LM', 92, 26, 38, 106], ['LI', 130, 38, 36, 94], ['RI', 254, 38, 36, 94], ['RM', 292, 26, 38, 106], ['RR', 332, 38, 36, 94], ['RP', 368, 62, 34, 70]], h = '';
      f.forEach(function (x) { h += '<rect class="fing" id="f-' + x[0] + '" x="' + x[1] + '" y="' + x[2] + '" width="' + x[3] + '" height="' + x[4] + '" rx="16" fill="' + FING[x[0]][1] + '" stroke="#475569" stroke-width="1.5"/>'; });
      h += '<rect class="fing" id="f-TH" x="150" y="112" width="120" height="30" rx="15" fill="' + FING.TH[1] + '" stroke="#475569" stroke-width="1.5"/><text x="210" y="132" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">Thumbs (Space)</text>';
      h += '<rect x="22" y="128" width="146" height="20" rx="10" fill="#e2e8f0"/><rect x="252" y="128" width="146" height="20" rx="10" fill="#e2e8f0"/>';
      hands.innerHTML = h;
      $('#tp-leg').innerHTML = Object.keys(FING).map(function (k) { return '<span><i style="background:' + FING[k][1] + '"></i>' + FING[k][0] + '</span>'; }).join('');
    }
    function nextKey(ch) {
      if (ch === ' ') return { k: ['Space', ' ', ' ', ' ', ' ', 'TH'], shift: 0 };
      var m = (S.lang === 'hi' ? HI : EN)[ch]; return m ? { k: m[0], shift: m[1] } : null;
    }
    function guide(ch) {
      Object.keys(keyEls).forEach(function (c) { keyEls[c].classList.remove('on'); });
      Array.prototype.forEach.call(hands.querySelectorAll('.fing'), function (e) { e.classList.remove('on'); });
      var h = $('#tp-hint'); if (ch === undefined) { h.textContent = ''; return; }
      var n = nextKey(ch);
      if (!n) { h.textContent = 'Type the highlighted character'; return; }
      keyEls[n.k[0]] && keyEls[n.k[0]].classList.add('on'); var fe = hands.querySelector('#f-' + n.k[5]); if (fe) fe.classList.add('on');
      var other = n.k[5].charAt(0) === 'L' ? 'right' : 'left';
      h.textContent = 'Next: ' + (ch === ' ' ? 'Space' : ch) + '  →  use your ' + FING[n.k[5]][0].toLowerCase() + (n.shift ? ' and hold Shift with your ' + other + ' little finger' : '');
    }
    /* text and progress */
    var ta = $('#tp-in'), box = $('#tp-text'), info;
    function setText(t) {
      S.target = t; info = clusters(t); S.start = 0; S.keys = 0; S.bad = 0; S.done = false; clearInterval(S.timer); ta.value = ''; ta.disabled = false; $('#tp-res').innerHTML = '';
      box.innerHTML = info.cl.map(function (c, i) { return '<span data-i="' + i + '">' + esc(info.cps.slice(c[0], c[1]).join('')) + '</span>'; }).join('');
      paint(); stats(); guide(info.cps[0]); ta.focus();
    }
    function typedCPs() { return Array.from(ta.value); }
    function paint() {
      var ty = typedCPs(), spans = box.children, i, c, ok, cur = -1;
      for (i = 0; i < info.cl.length; i++) {
        c = info.cl[i]; spans[i].className = '';
        if (ty.length >= c[1]) { ok = true; for (var j = c[0]; j < c[1]; j++) if (ty[j] !== info.cps[j]) ok = false; spans[i].className = ok ? 'ok' : 'bad'; }
        else if (ty.length >= c[0] && cur < 0) { cur = i; spans[i].className = 'cur'; }
      }
      if (cur < 0 && ty.length < info.cps.length) { /* in a cluster only */ }
      var s = cur >= 0 ? spans[cur] : spans[Math.min(info.cl.length - 1, 0)]; if (s && s.offsetTop > box.scrollTop + box.clientHeight - 50) box.scrollTop = s.offsetTop - 40;
    }
    function errorsNow() { var ty = typedCPs(), e = 0; for (var i = 0; i < ty.length; i++) if (ty[i] !== info.cps[i]) e++; return e; }
    function stats() {
      var ty = typedCPs(), mins = S.start ? Math.max((Date.now() - S.start) / 60000, 1 / 600) : 0, un = errorsNow();
      var wpm = mins ? Math.max(0, Math.round(((ty.length - un) / 5) / mins)) : 0, acc = S.keys ? Math.max(0, Math.round((S.keys - S.bad) / S.keys * 100)) : 100;
      $('#s-w').textContent = wpm; $('#s-a').textContent = acc + '%'; $('#s-e').textContent = S.bad;
      var el = S.start ? (Date.now() - S.start) / 1000 : 0, show = S.mode === 'test' ? Math.max(0, S.dur - el) : el; $('#s-tl').textContent = S.mode === 'test' ? 'Time left' : 'Time';
      $('#s-t').textContent = Math.floor(show / 60) + ':' + ('0' + Math.floor(show % 60)).slice(-2);
      return { wpm: wpm, acc: acc };
    }
    function finish() {
      if (S.done) return; S.done = true; clearInterval(S.timer); ta.disabled = true; guide(); var r = stats(), best = 0, key = 'csc_tp_best_' + S.lang + '_' + S.dur;
      if (S.mode === 'test') { try { best = +localStorage.getItem(key) || 0; if (r.wpm > best) localStorage.setItem(key, r.wpm); } catch (e) { } }
      var msg = S.mode === 'lesson' ? (r.acc >= 90 ? 'Great job! You can go to the next lesson.' : 'Try again. Aim for 90% accuracy or more.') : (r.wpm > best ? 'New best speed!' : 'Best so far: ' + best + ' WPM');
      $('#tp-res').innerHTML = '<div class="res"><h3>Finished</h3><p style="font-size:1.2rem;margin:0 0 8px"><b>' + r.wpm + ' WPM</b> &nbsp; Accuracy <b>' + r.acc + '%</b> &nbsp; Mistakes <b>' + S.bad + '</b></p><p style="margin:0 0 10px">' + msg + '</p><button class="btn2" id="tp-again" type="button">Try again</button> <button class="btn2" id="tp-next" type="button">' + (S.mode === 'lesson' ? 'Next lesson' : 'New text') + '</button></div>';
      $('#tp-again').onclick = function () { setText(S.target); }; $('#tp-next').onclick = function () { if (S.mode === 'lesson') { S.li = Math.min(S.li + 1, LESSONS[S.lang].length - 1); $('#tp-sel').value = S.li; } load(); };
    }
    function begin() { if (S.start) return; S.start = Date.now(); S.timer = setInterval(function () { stats(); if (S.mode === 'test' && Date.now() - S.start >= S.dur * 1000) finish(); }, 250); }
    var before = 0;
    ta.addEventListener('input', function () {
      var ty = typedCPs(); begin();
      if (ty.length > before) { for (var i = before; i < ty.length; i++) { S.keys++; if (ty[i] !== info.cps[i]) S.bad++; } }
      before = ty.length; paint(); stats(); guide(ty.length < info.cps.length ? info.cps[ty.length] : undefined);
      if (ty.length >= info.cps.length) finish();
    });
    ta.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) { if (/^(v|x|c)$/i.test(e.key)) e.preventDefault(); return; }
      if (S.lang === 'hi' && $('#tp-bi').checked && KEYBYCODE[e.code]) {
        e.preventDefault(); var k = KEYBYCODE[e.code], ch = e.shiftKey ? k[4] : k[3]; ta.value += ch; ta.dispatchEvent(new Event('input')); return;
      }
      var kc = keyEls[e.code]; if (kc) { kc.style.transform = 'translateY(2px)'; setTimeout(function () { kc.style.transform = ''; }, 90); }
    });
    ta.addEventListener('paste', function (e) { e.preventDefault(); }); ta.addEventListener('drop', function (e) { e.preventDefault(); });
    ta.addEventListener('focus', function () { var v = ta.value; ta.value = ''; ta.value = v; });
    function lessonText() { var L = LESSONS[S.lang][S.li]; return drill(L, S.lang); }
    function testText() { var pool = (S.lang === 'hi' ? HI_TEXT : EN_TEXT).slice(), out = [], need = S.dur / 60 * (S.lang === 'hi' ? 260 : 330); while (out.join(' ').length < need) { if (!pool.length) pool = (S.lang === 'hi' ? HI_TEXT : EN_TEXT).slice(); out.push(pool.splice(rnd(pool.length), 1)[0]); } return out.join(' '); }
    function load() { before = 0; setText(S.mode === 'lesson' ? lessonText() : testText()); if (S.mode === 'lesson') $('#tp-hint').insertAdjacentHTML('beforeend', '<br><small>' + esc(LESSONS[S.lang][S.li].t) + '</small>'); }
    function fillSel() {
      var s = $('#tp-sel'); s.innerHTML = S.mode === 'lesson' ? LESSONS[S.lang].map(function (l, i) { return '<option value="' + i + '">Lesson ' + (i + 1) + ': ' + esc(l.n) + '</option>'; }).join('') : [[60, '1 minute'], [120, '2 minutes'], [300, '5 minutes'], [600, '10 minutes']].map(function (d) { return '<option value="' + d[0] + '">' + d[1] + '</option>'; }).join('');
      s.value = S.mode === 'lesson' ? S.li : S.dur;
    }
    function sync() {
      Array.prototype.forEach.call(root.querySelectorAll('[data-m]'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-m') === S.mode); });
      Array.prototype.forEach.call(root.querySelectorAll('[data-l]'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-l') === S.lang); });
      $('#tp-bl').style.display = S.lang === 'hi' ? '' : 'none'; buildKB(); fillSel();
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-m')) { S.mode = b.getAttribute('data-m'); sync(); load(); } else if (b.hasAttribute('data-l')) { S.lang = b.getAttribute('data-l'); S.li = 0; sync(); load(); }
    });
    $('#tp-sel').onchange = function () { if (S.mode === 'lesson') S.li = +this.value; else S.dur = +this.value; load(); };
    $('#tp-new').onclick = load;
    buildHands(); sync(); load();
  };
})();
