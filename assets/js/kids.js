/* CSC VLE TOOLS - Kids Corner. Ten small learning games for KG, UKG and Class 1.
   All pictures live in assets/kids/NAME.png. To add a picture: drop the file there and add one line in PICS below. */
(function () {
  'use strict';

  /* ---------- Pictures: name -> [English, Hindi] ---------- */
  var PICS = {
    apple: ['Apple', 'सेब'], 'arrow-down': ['Arrow down', 'नीचे'], 'arrow-up': ['Arrow up', 'ऊपर'], baby: ['Baby', 'बच्चा'], ball: ['Ball', 'गेंद'],
    balloon: ['Balloon', 'गुब्बारा'], bat: ['Bat', 'बल्ला'], bed: ['Bed', 'बिस्तर'], bus: ['Bus', 'बस'], calendar: ['Calendar', 'कैलेंडर'],
    car: ['Car', 'कार'], cat: ['Cat', 'बिल्ली'], chick: ['Chick', 'चूज़ा'], cow: ['Cow', 'गाय'], 'dew-drops': ['Dew drops', 'ओस'],
    dog: ['Dog', 'कुत्ता'], duck: ['Duck', 'बतख'], egg: ['Egg', 'अंडा'], elephant: ['Elephant', 'हाथी'], 'empty-glass': ['Empty glass', 'खाली'],
    fire: ['Fire', 'आग'], fish: ['Fish', 'मछली'], flag: ['Flag', 'झंडा'], flower: ['Flower', 'फूल'], 'flower-pot': ['Flower pot', 'गमला'],
    fox: ['Fox', 'लोमड़ी'], frog: ['Frog', 'मेंढक'], 'full-glass': ['Full glass', 'भरा'], glasses: ['Spectacles', 'ऐनक'], grapes: ['Grapes', 'अंगूर'],
    'happy-face': ['Happy face', 'खुश'], hat: ['Hat', 'टोपी'], hen: ['Hen', 'मुर्गी'], house: ['House', 'घर'], 'ice-cream': ['Ice cream', 'आइसक्रीम'],
    juice: ['Juice', 'जूस'], kite: ['Kite', 'पतंग'], lion: ['Lion', 'शेर'], mango: ['Mango', 'आम'], moon: ['Moon', 'चाँद'],
    mouse: ['Mouse', 'चूहा'], nose: ['Nose', 'नाक'], 'old-man': ['Old man', 'बूढ़ा'], orange: ['Orange', 'संतरा'], owl: ['Owl', 'उल्लू'],
    parrot: ['Parrot', 'तोता'], pig: ['Pig', 'सुअर'], pigeon: ['Pigeon', 'कबूतर'], pomegranate: ['Pomegranate', 'अनार'], queen: ['Queen', 'रानी'],
    rabbit: ['Rabbit', 'खरगोश'], 'sad-face': ['Sad face', 'उदास'], ship: ['Ship', 'जहाज'], snowflake: ['Snowflake', 'बर्फ'], spoon: ['Spoon', 'चम्मच'],
    star: ['Star', 'तारा'], strawberry: ['Strawberry', 'स्ट्रॉबेरी'], sugarcane: ['Sugarcane', 'ईख'], sun: ['Sun', 'सूरज'], tamarind: ['Tamarind', 'इमली'],
    tiger: ['Tiger', 'बाघ'], tomato: ['Tomato', 'टमाटर'], turtle: ['Turtle', 'कछुआ'], umbrella: ['Umbrella', 'छतरी'], van: ['Van', 'वैन'],
    watch: ['Watch', 'घड़ी'], watermelon: ['Watermelon', 'तरबूज'], woman: ['Woman', 'औरत'], wool: ['Wool', 'ऊन'], 'xmas-tree': ['Christmas tree', 'क्रिसमस ट्री'],
    yacht: ['Yacht', 'नाव'], zebra: ['Zebra', 'ज़ेबरा']
  };
  function en(n) { return PICS[n][0]; }
  function hi(n) { return PICS[n][1]; }
  function img(n, cls) {
    return '<img class="kp ' + (cls || '') + '" src="assets/kids/' + n + '.png" alt="' + en(n) + '" width="400" height="400" decoding="async">';
  }

  /* ---------- Lesson data ---------- */
  var ABC = [['A', 'apple'], ['B', 'ball'], ['C', 'cat'], ['D', 'dog'], ['E', 'elephant'], ['F', 'fish'], ['G', 'grapes'], ['H', 'hat'], ['I', 'ice-cream'],
    ['J', 'juice'], ['K', 'kite'], ['L', 'lion'], ['M', 'mango'], ['N', 'nose'], ['O', 'orange'], ['P', 'parrot'], ['Q', 'queen'], ['R', 'rabbit'],
    ['S', 'sun'], ['T', 'tiger'], ['U', 'umbrella'], ['V', 'van'], ['W', 'watch'], ['X', 'xmas-tree'], ['Y', 'yacht'], ['Z', 'zebra']];
  var HINDI = [['अ', 'pomegranate'], ['आ', 'mango'], ['इ', 'tamarind'], ['ई', 'sugarcane'], ['उ', 'owl'], ['ऊ', 'wool'], ['ऐ', 'glasses'], ['ओ', 'dew-drops'],
    ['औ', 'woman'], ['क', 'pigeon'], ['ख', 'rabbit'], ['ग', 'flower-pot'], ['घ', 'house'], ['च', 'spoon'], ['छ', 'umbrella'], ['ज', 'ship'], ['झ', 'flag'],
    ['ट', 'tomato'], ['त', 'watermelon'], ['प', 'kite'], ['फ', 'flower'], ['ब', 'duck'], ['म', 'fish'], ['ह', 'elephant']];
  var COUNTABLE = ['apple', 'balloon', 'car', 'chick', 'fish', 'flower', 'star', 'strawberry'];
  var SPELL = ['bat', 'bed', 'bus', 'cat', 'cow', 'dog', 'egg', 'fox', 'hat', 'hen', 'pig', 'sun', 'fish', 'frog'];
  var OPPOSITES = [
    { a: ['arrow-up', 'Up', 'ऊपर'], b: ['arrow-down', 'Down', 'नीचे'] }, { a: ['full-glass', 'Full', 'भरा'], b: ['empty-glass', 'Empty', 'खाली'] },
    { a: ['happy-face', 'Happy', 'खुश'], b: ['sad-face', 'Sad', 'उदास'] }, { a: ['baby', 'New / Young', 'नया / छोटा'], b: ['old-man', 'Old', 'बूढ़ा'] },
    { a: ['fire', 'Hot', 'गरम'], b: ['snowflake', 'Cold', 'ठंडा'] }, { a: ['sun', 'Day', 'दिन'], b: ['moon', 'Night', 'रात'] },
    { a: ['elephant', 'Big', 'बड़ा'], b: ['mouse', 'Small', 'छोटा'] }, { a: ['rabbit', 'Fast', 'तेज़'], b: ['turtle', 'Slow', 'धीमा'] }
  ];
  var NUMW = [['zero', 'शून्य'], ['one', 'एक'], ['two', 'दो'], ['three', 'तीन'], ['four', 'चार'], ['five', 'पाँच'], ['six', 'छह'], ['seven', 'सात'], ['eight', 'आठ'], ['nine', 'नौ'], ['ten', 'दस'],
    ['eleven', 'ग्यारह'], ['twelve', 'बारह'], ['thirteen', 'तेरह'], ['fourteen', 'चौदह'], ['fifteen', 'पंद्रह'], ['sixteen', 'सोलह'], ['seventeen', 'सत्रह'], ['eighteen', 'अठारह'], ['nineteen', 'उन्नीस'], ['twenty', 'बीस']];
  var DAYS = [['Sunday', 'रविवार'], ['Monday', 'सोमवार'], ['Tuesday', 'मंगलवार'], ['Wednesday', 'बुधवार'], ['Thursday', 'गुरुवार'], ['Friday', 'शुक्रवार'], ['Saturday', 'शनिवार']];
  var SHAPES = [['circle', 'Circle', 'गोला'], ['square', 'Square', 'वर्ग'], ['triangle', 'Triangle', 'त्रिभुज'], ['rectangle', 'Rectangle', 'आयत'], ['star', 'Star', 'तारा'], ['heart', 'Heart', 'दिल'], ['diamond', 'Diamond', 'समचतुर्भुज'], ['oval', 'Oval', 'अंडाकार']];
  var COLORS = [['#e53935', 'Red', 'लाल'], ['#1e88e5', 'Blue', 'नीला'], ['#43a047', 'Green', 'हरा'], ['#fdd835', 'Yellow', 'पीला'], ['#fb8c00', 'Orange', 'नारंगी'], ['#ec407a', 'Pink', 'गुलाबी'], ['#8e24aa', 'Purple', 'बैंगनी'], ['#6d4c41', 'Brown', 'भूरा']];

  /* ---------- Small helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(a, n, not) { return shuffle(a.filter(function (x) { return !not || not.indexOf(x) < 0; })).slice(0, n); }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };
  var stars = store.get('kc_stars', {}), soundOn = store.get('kc_sound', true);

  /* speech + sounds (both optional; page works silently when unavailable) */
  var voices = [];
  function loadVoices() { try { voices = window.speechSynthesis.getVoices() || []; } catch (e) { } }
  if ('speechSynthesis' in window) { loadVoices(); window.speechSynthesis.onvoiceschanged = loadVoices; }
  function speak(text, lang) {
    if (!soundOn || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text); u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'; u.rate = 0.85; u.pitch = 1.1;
      var v = voices.filter(function (x) { return x.lang && x.lang.toLowerCase().replace('_', '-').indexOf(lang === 'hi' ? 'hi' : 'en') === 0; })[0];
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch (e) { }
  }
  var actx;
  function tone(freqs, dur) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var t = actx.currentTime;
      freqs.forEach(function (f, i) {
        var o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * dur); g.gain.exponentialRampToValueAtTime(0.18, t + i * dur + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + (i + 1) * dur);
        o.connect(g); g.connect(actx.destination); o.start(t + i * dur); o.stop(t + (i + 1) * dur + 0.02);
      });
    } catch (e) { }
  }
  var sGood = function () { tone([660, 880, 1100], 0.1); }, sBad = function () { tone([220, 180], 0.14); }, sWin = function () { tone([523, 659, 784, 1047], 0.13); };
  function celebrate(n) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var box = $('#kc-confetti'); if (!box) return;
    var bits = ['⭐', '🎈', '🌟', '🎉', '✨', '🍎', '🎊'];
    for (var i = 0; i < (n || 18); i++) {
      var s = document.createElement('span'); s.textContent = pick(bits);
      s.style.left = rnd(100) + '%'; s.style.fontSize = (18 + rnd(22)) + 'px'; s.style.animationDuration = (1.1 + Math.random() * 1.1) + 's'; s.style.animationDelay = (Math.random() * 0.25) + 's';
      box.appendChild(s); (function (e) { setTimeout(function () { e.remove(); }, 2600); })(s);
    }
  }
  function say(label) { var l = $('#kc-live'); if (l) l.textContent = label; }

  /* ---------- Activities ---------- */
  var ACT = [
    { id: 'abc', t: 'ABC Letters', h: 'अंग्रेज़ी वर्णमाला', lv: ['KG'], pic: 'apple', c: 'c1', d: 'Learn A to Z with a picture for every letter. Then play the quiz.', run: runAbc },
    { id: 'hindi', t: 'Hindi Alphabet', h: 'हिंदी वर्णमाला', lv: ['UKG'], pic: 'mango', c: 'c2', d: 'अ से अनार. Learn Hindi letters with pictures, then take the quiz.', run: runHindi },
    { id: 'numbers', t: 'Numbers 1 to 20', h: 'गिनती 1 से 20', lv: ['KG', 'UKG'], pic: 'balloon', c: 'c3', d: 'Tap a number to see that many pictures. English and Hindi names.', run: runNumbers },
    { id: 'count', t: 'Count & Pick', h: 'गिनो और चुनो', lv: ['KG'], pic: 'star', c: 'c4', d: 'Count the pictures and pick the right number.', run: runCount },
    { id: 'add', t: 'Add with Pictures', h: 'चित्रों से जोड़ो', lv: ['UKG'], pic: 'strawberry', c: 'c5', d: 'Simple addition with pictures. Sums up to 10.', run: runAdd },
    { id: 'words', t: 'Picture Words', h: 'चित्र से शब्द', lv: ['UKG'], pic: 'cat', c: 'c6', d: 'Look at the picture and tap the letters to spell the word.', run: runWords },
    { id: 'missing', t: 'Missing Letter', h: 'छूटा हुआ अक्षर', lv: ['Class 1'], pic: 'frog', c: 'c7', d: 'One letter is hidden. Pick the letter that completes the word.', run: runMissing },
    { id: 'opposites', t: 'Opposites', h: 'विलोम शब्द', lv: ['Class 1'], pic: 'elephant', c: 'c8', d: 'Up and down, hot and cold. Match each word to its opposite.', run: runOpposites },
    { id: 'days', t: 'Days of the Week', h: 'सप्ताह के दिन', lv: ['Class 1'], pic: 'calendar', c: 'c9', d: 'Learn the seven days, then answer what comes before and after.', run: runDays },
    { id: 'shapes', t: 'Shapes & Colours', h: 'आकार और रंग', lv: ['KG', 'UKG'], pic: 'kite', c: 'c10', d: 'Name the shape or the colour. Great first game for little ones.', run: runShapes }
  ];
  function byId(id) { for (var i = 0; i < ACT.length; i++) if (ACT[i].id === id) return ACT[i]; return null; }

  /* ---------- Home grid ---------- */
  var level = 'All', root, grid, stage;
  function totalStars() { var n = 0; for (var k in stars) n += stars[k] || 0; return n; }
  function starRow(n) { var s = ''; for (var i = 1; i <= 3; i++) s += '<i class="fa-solid fa-star' + (i <= n ? ' on' : '') + '" aria-hidden="true"></i>'; return '<span class="kc-stars" aria-label="' + n + ' of 3 stars">' + s + '</span>'; }
  function drawHome() {
    $('#kc-total').textContent = totalStars();
    var list = ACT.filter(function (a) { return level === 'All' || a.lv.indexOf(level) > -1; });
    grid.innerHTML = list.map(function (a) {
      return '<a class="kc-card ' + a.c + '" href="#' + a.id + '" data-id="' + a.id + '"><span class="kc-thumb">' + img(a.pic) + '</span>' +
        '<span class="kc-body"><span class="kc-lv">' + a.lv.join(' · ') + '</span><strong>' + a.t + '</strong><span class="kc-hi" lang="hi">' + a.h + '</span><small>' + a.d + '</small>' +
        '<span class="kc-foot">' + starRow(stars[a.id] || 0) + '<em>Play <i class="fa-solid fa-play" aria-hidden="true"></i></em></span></span></a>';
    }).join('');
    $$('.kc-tab').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lv') === level); });
  }
  function route() {
    var id = (location.hash || '').replace('#', ''), a = byId(id);
    if (!a) { root.classList.remove('playing'); stage.innerHTML = ''; drawHome(); document.title = 'Kids Corner | Learn & Play for KG, UKG and Class 1 | CSC VLE TOOLS'; return; }
    root.classList.add('playing'); document.title = a.t + ' | Kids Corner | CSC VLE TOOLS';
    stage.innerHTML = '<div class="ks-head ' + a.c + '"><a class="ks-back" href="#"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> All games</a>' +
      '<h2>' + a.t + ' <span lang="hi">' + a.h + '</span></h2><span class="ks-lv">' + a.lv.join(' · ') + '</span></div><div class="ks-body" id="ks-body"></div>';
    window.scrollTo({ top: Math.max(0, root.getBoundingClientRect().top + window.scrollY - 70), behavior: 'auto' });
    a.run($('#ks-body'), a);
  }

  /* ---------- Generic quiz engine ---------- */
  function finish(body, act, score, total, again) {
    var st = score >= total - 1 ? 3 : score >= Math.ceil(total * 0.6) ? 2 : 1;
    if ((stars[act.id] || 0) < st) { stars[act.id] = st; store.set('kc_stars', stars); }
    sWin(); celebrate(34);
    var next = ACT[(ACT.indexOf(act) + 1) % ACT.length];
    body.innerHTML = '<div class="kz-done"><div class="kz-trophy">' + (st === 3 ? '🏆' : st === 2 ? '🥈' : '🌱') + '</div><h3>' + (st === 3 ? 'Superstar!' : st === 2 ? 'Well done!' : 'Good try!') + '</h3>' +
      starRow(st).replace('kc-stars', 'kc-stars big') + '<p>You got <b>' + score + '</b> out of <b>' + total + '</b> on the first try.</p>' +
      '<div class="kz-actions"><button type="button" class="kb kb-go" id="kz-again"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Play again</button>' +
      '<a class="kb" href="#' + next.id + '">Next: ' + next.t + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a><a class="kb kb-alt" href="#">All games</a></div></div>';
    $('#kz-again').onclick = again; say('Finished. ' + score + ' out of ' + total);
  }
  /* cfg.make() returns {prompt, spoken:{t,l}, opts:[{html, v}], ans, cls}; cfg.total = rounds */
  function quiz(body, act, cfg, back) {
    var i = 0, score = 0, total = cfg.total || 8;
    function round() {
      var q = cfg.make(), tries = 0;
      body.innerHTML = (back ? '<div class="kz-tools"><button type="button" class="kb kb-alt" id="kz-learn"><i class="fa-solid fa-book-open" aria-hidden="true"></i> ' + back.label + '</button></div>' : '') + '<div class="kz"><div class="kz-bar" aria-hidden="true"><i style="width:' + (i / total * 100) + '%"></i></div>' +
        '<div class="kz-top"><span>Question ' + (i + 1) + ' of ' + total + '</span><span>⭐ ' + score + '</span></div>' +
        '<div class="kz-prompt">' + q.prompt + (q.spoken ? '<button type="button" class="kb-say" aria-label="Hear it"><i class="fa-solid fa-volume-high" aria-hidden="true"></i></button>' : '') + '</div>' +
        '<div class="kz-opts ' + (q.cls || '') + '">' + q.opts.map(function (o, k) { return '<button type="button" class="kz-opt" data-k="' + k + '">' + o.html + '</button>'; }).join('') + '</div>' +
        '<p class="kz-msg" aria-live="polite"></p></div>';
      var msg = $('.kz-msg', body), sp = $('.kb-say', body); if (back) $('#kz-learn').onclick = back.fn;
      if (sp) { sp.onclick = function () { speak(q.spoken.t, q.spoken.l); }; if (cfg.autoSpeak !== false) setTimeout(function () { speak(q.spoken.t, q.spoken.l); }, 250); }
      $$('.kz-opt', body).forEach(function (b) {
        b.onclick = function () {
          var o = q.opts[+b.getAttribute('data-k')];
          if (o.v === q.ans) {
            if (!tries) score++;
            $$('.kz-opt', body).forEach(function (x) { x.disabled = true; }); b.classList.add('good'); msg.textContent = pick(['Great!', 'Super!', 'Well done!', 'Correct!']); msg.className = 'kz-msg ok';
            sGood(); celebrate(8); say('Correct');
            setTimeout(function () { i++; if (i >= total) finish(body, act, score, total, function () { quiz(body, act, cfg, back); }); else round(); }, 1000);
          } else {
            tries++; b.disabled = true; b.classList.add('bad'); msg.textContent = 'Try again!'; msg.className = 'kz-msg no'; sBad(); say('Try again');
          }
        };
      });
    }
    round();
  }
  function opts3(correct, pool, fmt, keyfn) {
    keyfn = keyfn || function (x) { return x; };
    var wrong = sample(pool, 2, [correct]);
    return shuffle([correct].concat(wrong)).map(function (x) { return { html: fmt(x), v: keyfn(x) }; });
  }
  
  /* ---------- 1. ABC ---------- */
  function learnGrid(body, act, items, o) {
    var cur = 0;
    body.innerHTML = '<div class="kl"><div class="kl-stage" id="kl-stage"></div><div class="kl-tiles" id="kl-tiles" role="list" aria-label="' + o.label + '"></div>' +
      '<div class="kz-actions"><button type="button" class="kb kb-go" id="kl-quiz"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> Play the quiz</button>' +
      '<button type="button" class="kb kb-alt" id="kl-print"><i class="fa-solid fa-print" aria-hidden="true"></i> Print chart</button></div></div>';
    var tiles = $('#kl-tiles');
    tiles.innerHTML = items.map(function (it, k) { return '<button type="button" role="listitem" class="kl-tile" data-k="' + k + '" aria-label="' + it[0] + ' for ' + en(it[1]) + '">' + it[0] + '</button>'; }).join('');
    function show(k, say1) {
      cur = (k + items.length) % items.length; var it = items[cur], n = it[1];
      $('#kl-stage').innerHTML = '<button type="button" class="kl-nav" id="kl-prev" aria-label="Previous"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>' +
        '<div class="kl-card">' + img(n, 'big') + '<div class="kl-text">' + o.big(it) + '<div class="kl-line">' + o.line(it) + '</div></div>' +
        '<button type="button" class="kb-say lg" id="kl-say" aria-label="Hear it"><i class="fa-solid fa-volume-high" aria-hidden="true"></i> Listen</button></div>' +
        '<button type="button" class="kl-nav" id="kl-next" aria-label="Next"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>';
      $('#kl-prev').onclick = function () { show(cur - 1, true); }; $('#kl-next').onclick = function () { show(cur + 1, true); }; $('#kl-say').onclick = function () { o.speak(it); };
      $$('.kl-tile', tiles).forEach(function (t, j) { t.classList.toggle('on', j === cur); });
      if (say1) o.speak(it);
    }
    $$('.kl-tile', tiles).forEach(function (t) { t.onclick = function () { show(+t.getAttribute('data-k'), true); }; });
    $('#kl-quiz').onclick = function () { o.quiz(); };
    $('#kl-print').onclick = function () { printChart(o.title, items, o.cell); };
    show(0, false);
  }
  function printChart(title, items, cell) {
    var p = $('#kc-print'); p.innerHTML = '<h1>' + title + '</h1><p>CSC VLE TOOLS · Kids Corner</p><div class="pc-grid">' + items.map(function (it) { return '<div class="pc-cell">' + img(it[1]) + '<div>' + cell(it) + '</div></div>'; }).join('') + '</div>';
    document.body.classList.add('kc-printing');
    var imgs = $$('img', p), left = imgs.length, go = function () { setTimeout(function () { window.print(); }, 60); };
    imgs.forEach(function (im) { if (im.complete) left--; else im.onload = im.onerror = function () { if (--left <= 0) go(); }; });
    if (left <= 0) go();
  }
  window.addEventListener('afterprint', function () { document.body.classList.remove('kc-printing'); });

  function runAbc(body, act) {
    var play = function () {
      quiz(body, act, {
        total: 8, make: function () {
          var c = pick(ABC), pool = ABC.filter(function (x) { return x[0] !== c[0]; });
          return { prompt: '<span class="kz-q">Which picture starts with <b class="kz-big">' + c[0] + '</b> ?</span>', spoken: { t: 'Which picture starts with ' + c[0] + '?', l: 'en' }, cls: 'pics', ans: c[0],
            opts: shuffle([c].concat(sample(pool, 2))).map(function (x) { return { html: img(x[1]) + '<span>' + en(x[1]) + '</span>', v: x[0] }; }) };
        }
      }, { label: 'Back to letters', fn: learn });
    };
    var learn = function () {
      learnGrid(body, act, ABC, {
        label: 'Letters', title: 'ABC Chart', cell: function (it) { return '<b>' + it[0] + ' ' + it[0].toLowerCase() + '</b> ' + en(it[1]); },
        big: function (it) { return '<div class="kl-letter">' + it[0] + '<small>' + it[0].toLowerCase() + '</small></div>'; },
        line: function (it) { return '<b>' + it[0] + '</b> for ' + en(it[1]) + '<span lang="hi">' + hi(it[1]) + '</span>'; },
        speak: function (it) { speak(it[0] + ' for ' + en(it[1]), 'en'); }, quiz: play
      });
    };
    learn();
  }

  /* ---------- 2. Hindi alphabet ---------- */
  function runHindi(body, act) {
    var play = function () {
      quiz(body, act, {
        total: 8, make: function () {
          var c = pick(HINDI);
          return { prompt: '<span class="kz-q">इस चित्र का पहला अक्षर कौन सा है?</span><span class="kz-pic">' + img(c[1]) + '</span>', spoken: { t: hi(c[1]), l: 'hi' }, cls: 'letters', ans: c[0],
            opts: opts3(c, HINDI, function (x) { return '<span class="kz-letter" lang="hi">' + x[0] + '</span>'; }, function (x) { return x[0]; }) };
        }
      }, { label: 'Back to letters', fn: learn });
    };
    var learn = function () {
      learnGrid(body, act, HINDI, {
        label: 'Hindi letters', title: 'हिंदी वर्णमाला चार्ट', cell: function (it) { return '<b lang="hi">' + it[0] + '</b> <span lang="hi">' + hi(it[1]) + '</span>'; },
        big: function (it) { return '<div class="kl-letter" lang="hi">' + it[0] + '</div>'; },
        line: function (it) { return '<span lang="hi"><b>' + it[0] + '</b> से ' + hi(it[1]) + '</span><span>' + en(it[1]) + '</span>'; },
        speak: function (it) { speak(it[0] + ' से ' + hi(it[1]), 'hi'); }, quiz: play
      });
    };
    learn();
  }

  /* ---------- 3. Numbers 1-20 ---------- */
  function runNumbers(body, act) {
    var cur = 10;
    var play = function () {
      quiz(body, act, {
        total: 8, make: function () {
          var n = 1 + rnd(20), t = rnd(2);
          if (t) return { prompt: '<span class="kz-q">Find the number <b class="kz-big">' + NUMW[n][0] + '</b></span><span class="kz-sub" lang="hi">' + NUMW[n][1] + '</span>', spoken: { t: NUMW[n][0], l: 'en' }, cls: 'nums', ans: n,
            opts: opts3(n, nums(), function (x) { return '<span class="kz-letter">' + x + '</span>'; }) };
          var pool = n >= 20 ? 19 : n; var a = n === 20 ? 19 : n;
          return { prompt: '<span class="kz-q">What comes after <b class="kz-big">' + a + '</b> ?</span>', spoken: { t: 'What comes after ' + a + '?', l: 'en' }, cls: 'nums', ans: a + 1,
            opts: opts3(a + 1, nums(), function (x) { return '<span class="kz-letter">' + x + '</span>'; }) };
        }
      }, { label: 'Back to numbers', fn: learn });
    };
    function nums() { var a = []; for (var i = 1; i <= 20; i++) a.push(i); return a; }
    var learn = function () {
      body.innerHTML = '<div class="kl"><div class="kn-show" id="kn-show"></div><div class="kl-tiles nums" id="kn-tiles"></div>' +
        '<div class="kz-actions"><button type="button" class="kb kb-go" id="kl-quiz"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> Play the quiz</button></div></div>';
      var tiles = $('#kn-tiles'); tiles.innerHTML = nums().map(function (n) { return '<button type="button" class="kl-tile" data-n="' + n + '">' + n + '</button>'; }).join('');
      var pics = COUNTABLE.slice(), pi = 0;
      function show(n, sp) {
        cur = n; var p = pics[(pi++) % pics.length], h = '';
        for (var i = 0; i < n; i++) h += '<span class="kn-i" style="animation-delay:' + (i * 40) + 'ms">' + img(p) + '</span>';
        $('#kn-show').innerHTML = '<div class="kn-num"><b>' + n + '</b><span>' + NUMW[n][0] + '</span><span lang="hi">' + NUMW[n][1] + '</span>' +
          '<button type="button" class="kb-say" id="kn-say" aria-label="Hear it"><i class="fa-solid fa-volume-high" aria-hidden="true"></i></button></div><div class="kn-items">' + h + '</div>';
        $('#kn-say').onclick = function () { speak(n + ', ' + NUMW[n][0], 'en'); };
        $$('.kl-tile', tiles).forEach(function (t) { t.classList.toggle('on', +t.getAttribute('data-n') === n); });
        if (sp) speak(NUMW[n][0], 'en');
      }
      $$('.kl-tile', tiles).forEach(function (t) { t.onclick = function () { show(+t.getAttribute('data-n'), true); }; });
      $('#kl-quiz').onclick = play; show(cur, false);
    };
    learn();
  }

  /* ---------- 4. Count & Pick ---------- */
  function picsRow(n, p, cls) { var h = ''; for (var i = 0; i < n; i++) h += img(p, cls || 'sm'); return '<div class="kz-set">' + h + '</div>'; }
  function runCount(body, act) {
    quiz(body, act, {
      total: 8, make: function () {
        var n = 1 + rnd(10), p = pick(COUNTABLE);
        return { prompt: '<span class="kz-q">How many <b>' + en(p).toLowerCase() + (n > 1 ? 's' : '') + '</b> can you see?</span>' + picsRow(n, p), spoken: { t: 'How many ' + en(p) + 's can you see?', l: 'en' }, cls: 'nums', ans: n,
          opts: opts3(n, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function (x) { return '<span class="kz-letter">' + x + '</span>'; }) };
      }
    });
  }

  /* ---------- 5. Add with pictures ---------- */
  function runAdd(body, act) {
    quiz(body, act, {
      total: 8, make: function () {
        var a = 1 + rnd(6), b = 1 + rnd(Math.min(6, 10 - a)), p = pick(COUNTABLE), s = a + b;
        var pool = []; for (var i = 2; i <= 10; i++) pool.push(i);
        return { prompt: '<div class="kz-sum">' + picsRow(a, p, 'xs') + '<b>+</b>' + picsRow(b, p, 'xs') + '<b>=</b><b class="q">?</b></div><span class="kz-q">' + a + ' + ' + b + ' = ?</span>',
          spoken: { t: a + ' plus ' + b + ' equals?', l: 'en' }, cls: 'nums', ans: s, opts: opts3(s, pool, function (x) { return '<span class="kz-letter">' + x + '</span>'; }) };
      }
    });
  }

  /* ---------- 6. Picture words (tap letters to spell) ---------- */
  function runWords(body, act) {
    var i = 0, score = 0, total = 8, order = shuffle(SPELL).slice(0, total);
    function round() {
      var w = order[i], letters = w.toUpperCase().split(''), tiles = shuffle(letters.map(function (c, k) { return { c: c, k: k }; })), pos = 0, mistakes = 0;
      if (letters.length > 1 && tiles.every(function (t, k) { return t.c === letters[k]; })) tiles.reverse();
      body.innerHTML = '<div class="kz"><div class="kz-bar" aria-hidden="true"><i style="width:' + (i / total * 100) + '%"></i></div><div class="kz-top"><span>Word ' + (i + 1) + ' of ' + total + '</span><span>⭐ ' + score + '</span></div>' +
        '<div class="kz-prompt"><span class="kz-pic big">' + img(w) + '</span><button type="button" class="kb-say" aria-label="Hear it"><i class="fa-solid fa-volume-high" aria-hidden="true"></i></button></div>' +
        '<div class="kw-slots" aria-label="Your word">' + letters.map(function () { return '<span class="kw-slot"></span>'; }).join('') + '</div>' +
        '<div class="kw-tiles">' + tiles.map(function (t, k) { return '<button type="button" class="kw-tile" data-k="' + k + '">' + t.c + '</button>'; }).join('') + '</div>' +
        '<p class="kz-msg" aria-live="polite">Tap the letters in the right order.</p><div class="kz-actions"><button type="button" class="kb kb-alt" id="kw-clear">Clear</button></div></div>';
      var slots = $$('.kw-slot', body), btns = $$('.kw-tile', body), msg = $('.kz-msg', body);
      $('.kb-say', body).onclick = function () { speak(w, 'en'); }; setTimeout(function () { speak(w, 'en'); }, 250);
      function reset() { pos = 0; slots.forEach(function (s) { s.textContent = ''; s.className = 'kw-slot'; }); btns.forEach(function (b) { b.disabled = false; }); }
      $('#kw-clear').onclick = reset;
      btns.forEach(function (b) {
        b.onclick = function () {
          var t = tiles[+b.getAttribute('data-k')];
          if (t.c === letters[pos]) {
            slots[pos].textContent = t.c; slots[pos].className = 'kw-slot ok'; b.disabled = true; pos++; sGood();
            if (pos === letters.length) {
              if (!mistakes) score++; msg.textContent = w.toUpperCase() + '! ' + pick(['Great!', 'Super!', 'Well done!']); msg.className = 'kz-msg ok'; speak(w, 'en'); celebrate(10);
              setTimeout(function () { i++; if (i >= total) finish(body, act, score, total, function () { runWords(body, act); }); else round(); }, 1300);
            }
          } else { mistakes++; sBad(); msg.textContent = 'Not that one. Try another letter!'; msg.className = 'kz-msg no'; b.classList.add('bad'); setTimeout(function () { b.classList.remove('bad'); }, 500); }
        };
      });
    }
    round();
  }

  /* ---------- 7. Missing letter ---------- */
  function runMissing(body, act) {
    var words = SPELL.concat(['sun']);
    quiz(body, act, {
      total: 8, make: function () {
        var w = pick(words), k = rnd(w.length), c = w[k].toUpperCase(), shown = w.toUpperCase().split('').map(function (ch, j) { return j === k ? '<span class="kz-blank">?</span>' : '<span>' + ch + '</span>'; }).join('');
        var pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        return { prompt: '<span class="kz-pic big">' + img(w) + '</span><div class="kz-word">' + shown + '</div>', spoken: { t: w, l: 'en' }, cls: 'nums', ans: c,
          opts: opts3(c, pool, function (x) { return '<span class="kz-letter">' + x + '</span>'; }) };
      }
    });
  }

  /* ---------- 8. Opposites ---------- */
  function runOpposites(body, act) {
    quiz(body, act, {
      total: 8, make: function () {
        var p = pick(OPPOSITES), flip = rnd(2), a = flip ? p.b : p.a, b = flip ? p.a : p.b;
        var others = OPPOSITES.filter(function (x) { return x !== p; }), wrong = sample(others, 2).map(function (x) { return rnd(2) ? x.a : x.b; });
        return { prompt: '<span class="kz-pic big">' + img(a[0]) + '</span><span class="kz-q">Opposite of <b class="kz-big">' + a[1] + '</b></span><span class="kz-sub" lang="hi">' + a[2] + '</span>',
          spoken: { t: 'What is the opposite of ' + a[1] + '?', l: 'en' }, cls: 'pics', ans: b[1],
          opts: shuffle([b].concat(wrong)).map(function (x) { return { html: img(x[0]) + '<span>' + x[1] + '</span><span class="hi" lang="hi">' + x[2] + '</span>', v: x[1] }; }) };
      }
    });
  }

  /* ---------- 9. Days of the week ---------- */
  function runDays(body, act) {
    var play = function () {
      quiz(body, act, {
        total: 8, make: function () {
          var k = rnd(7), t = rnd(3), ans, q;
          if (t === 0) { ans = DAYS[(k + 1) % 7][0]; q = 'What day comes <b>after</b> ' + DAYS[k][0] + '?'; }
          else if (t === 1) { ans = DAYS[(k + 6) % 7][0]; q = 'What day comes <b>before</b> ' + DAYS[k][0] + '?'; }
          else { ans = DAYS[k][0]; q = 'Which is day number <b>' + (k + 1) + '</b> of the week?'; }
          return { prompt: '<span class="kz-q">' + q + '</span>', spoken: { t: q.replace(/<[^>]+>/g, ''), l: 'en' }, cls: 'words', ans: ans,
            opts: opts3(ans, DAYS.map(function (d) { return d[0]; }), function (x) { return '<span class="kz-word-opt">' + x + '</span>'; }) };
        }
      }, { label: 'Back to the week', fn: learn });
    };
    var learn = function () {
      body.innerHTML = '<div class="kl"><div class="kd-top">' + img('calendar', 'big') + '<p>There are <b>7 days</b> in a week. Tap a day to hear it.</p></div><div class="kd-week">' +
        DAYS.map(function (d, k) { return '<button type="button" class="kd-day d' + k + '" data-k="' + k + '"><span class="n">' + (k + 1) + '</span><b>' + d[0] + '</b><span lang="hi">' + d[1] + '</span></button>'; }).join('') +
        '</div><div class="kz-actions"><button type="button" class="kb kb-go" id="kl-quiz"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> Play the quiz</button></div></div>';
      $$('.kd-day', body).forEach(function (b) { b.onclick = function () { var d = DAYS[+b.getAttribute('data-k')]; speak(d[0], 'en'); b.classList.add('pop'); setTimeout(function () { b.classList.remove('pop'); }, 400); }; });
      $('#kl-quiz').onclick = play;
    };
    learn();
  }

  /* ---------- 10. Shapes & colours ---------- */
  function shapeSVG(kind, color) {
    var f = 'fill="' + color + '" stroke="rgba(0,0,0,.28)" stroke-width="4" stroke-linejoin="round"', p;
    switch (kind) {
      case 'circle': p = '<circle cx="60" cy="60" r="48" ' + f + '/>'; break;
      case 'square': p = '<rect x="14" y="14" width="92" height="92" rx="4" ' + f + '/>'; break;
      case 'triangle': p = '<polygon points="60,10 110,100 10,100" ' + f + '/>'; break;
      case 'rectangle': p = '<rect x="6" y="30" width="108" height="60" rx="4" ' + f + '/>'; break;
      case 'star': p = '<polygon points="60,8 74,44 112,46 82,70 92,108 60,86 28,108 38,70 8,46 46,44" ' + f + '/>'; break;
      case 'heart': p = '<path d="M60 104 C10 68 8 28 36 22 C50 19 58 28 60 36 C62 28 70 19 84 22 C112 28 110 68 60 104Z" ' + f + '/>'; break;
      case 'diamond': p = '<polygon points="60,6 108,60 60,114 12,60" ' + f + '/>'; break;
      default: p = '<ellipse cx="60" cy="60" rx="52" ry="34" ' + f + '/>';
    }
    return '<svg class="kz-shape" viewBox="0 0 120 120" role="img" aria-label="shape">' + p + '</svg>';
  }
  function runShapes(body, act) {
    quiz(body, act, {
      total: 8, make: function () {
        var s = pick(SHAPES), c = pick(COLORS);
        if (rnd(2)) return { prompt: shapeSVG(s[0], c[0]) + '<span class="kz-q">What <b>shape</b> is this?</span>', spoken: { t: 'What shape is this?', l: 'en' }, cls: 'words', ans: s[0],
          opts: opts3(s, SHAPES, function (x) { return '<span class="kz-word-opt">' + x[1] + '<small lang="hi">' + x[2] + '</small></span>'; }, function (x) { return x[0]; }) };
        return { prompt: shapeSVG(s[0], c[0]) + '<span class="kz-q">What <b>colour</b> is this?</span>', spoken: { t: 'What colour is this?', l: 'en' }, cls: 'swatches', ans: c[0],
          opts: opts3(c, COLORS, function (x) { return '<span class="kz-sw" style="background:' + x[0] + '"></span><span class="kz-word-opt">' + x[1] + '<small lang="hi">' + x[2] + '</small></span>'; }, function (x) { return x[0]; }) };
      }
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    root = $('#kc-root'); if (!root) return;
    grid = $('#kc-grid'); stage = $('#kc-stage');
    $$('.kc-tab').forEach(function (b) { b.onclick = function () { level = b.getAttribute('data-lv'); drawHome(); }; });
    var snd = $('#kc-sound'), setSnd = function () { snd.setAttribute('aria-pressed', soundOn); snd.innerHTML = '<i class="fa-solid ' + (soundOn ? 'fa-volume-high' : 'fa-volume-xmark') + '" aria-hidden="true"></i> Sound ' + (soundOn ? 'on' : 'off'); };
    snd.onclick = function () { soundOn = !soundOn; store.set('kc_sound', soundOn); if (!soundOn && 'speechSynthesis' in window) window.speechSynthesis.cancel(); setSnd(); };
    setSnd();
    $('#kc-reset').onclick = function () { if (confirm('Clear all stars and start fresh?')) { stars = {}; store.set('kc_stars', stars); drawHome(); } };
    window.addEventListener('hashchange', route); route();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
