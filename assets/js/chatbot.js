/* CSC VLE TOOLS - Helper Chatbot (no AI API, no server).
   Reads the tool list from assets/js/site.js (window.CSC), so every new tool added there is found automatically.
   Contact details come from the SITE block in site.js. Edit only HELP, FAQ and SYN below. */
(function () {
  "use strict";
  var C = window.CSC || {}, SITE = C.SITE || {}, CATS = C.CATS || [];
  /* site.js stores tools as objects; turn them into [file, name, description, category]. */
  var TOOLS = (C.TOOLS || []).map(function (o) { return Array.isArray(o) ? o : [o.file, o.name, o.desc, o.cat]; });
  if (!TOOLS.length || document.getElementById("cscbot")) return;
  var NAME_KEY = "csc_visitor_name", MISS_KEY = "csc_bot_missed";
  var H = window.CSC_HELP || {}, G = H.guides || {}, PAGES = H.pages || [];

  /* Old duplicate pages: do not suggest these (the main tool is suggested instead). */
  var HIDE = { tools_pdf_merge: 1, tools_pdf_split: 1, tools_photo_name_joiner: 1, tools_photo_signature_joiner: 1, tools_passport_photo_sheet: 1, tools_resume_builder: 1 };

  /* Extra search words (English + Hinglish) per tool page. */
  var SYN = {
    tools_pan_aadhaar_print: "aadhaar aadhar adhar adhaar uid pan card print aadhaar print pan print",
    tools_pvc_id_print: "pvc plastic card atm card pvc print pvc card",
    tools_photo_resizer: "photo size resize kb pixel mm crop photo chhota dimension passport size form photo",
    tools_sign_resizer: "signature sign hastakshar signature size sign kb",
    tools_thumb_resizer: "thumb angutha fingerprint impression thumb size",
    tools_pdf_compressor: "compress pdf reduce pdf pdf size pdf kb pdf mb pdf chhota shrink",
    tools_pdf_merger: "merge pdf join pdf combine pdf pdf jodna",
    tools_pdf_splitter: "split pdf separate pages pdf alag extract pages",
    tools_jpg_to_pdf: "jpg to pdf image to pdf photo to pdf png to pdf scan to pdf",
    tools_word_to_pdf: "word to pdf doc to pdf docx to pdf",
    tools_ai_bg_remover: "remove background background remove bg remove ai cutout",
    tools_bg_remover: "remove background white background bg remove",
    tools_ai_passport_studio: "passport photo stamp photo photo sheet passport size photos print photos a4",
    tools_whatsapp_image_print: "whatsapp photo print whatsapp image print",
    tools_handwriting_converter: "handwriting hindi typing handwritten to text scan notes",
    tools_image_text_extractor: "ocr text from image image to text extract text copy text",
    "haryana-resume-generator": "resume cv biodata job bio data naukri",
    "haryana-application-generator": "application arzi letter patra leave application haryana application",
    tools_biodata_maker: "marriage biodata shaadi vivah matrimony",
    tools_bill_receipt_generator: "bill receipt invoice parchi rasid cash memo",
    tools_age_calculator: "age date of birth dob umar",
    tools_loan_emi_calculator: "emi loan interest kist",
    tools_qr_code_generator: "qr code barcode",
    tools_typing_test: "typing hindi typing english typing speed test",
    "shop-ledger": "ledger khata hisab shop",
    "kirana-store-ledger": "kirana general store grocery udhaar khata",
    "kids-corner": "kids bachche children varnmala games alphabet",
    tools_admit_card_holder: "admit card holder exam hall ticket",
    tools_whatsapp_ultimate: "whatsapp message direct chat without saving number"
  };

  /* Simple steps by category. Tool pages also have a Try Demo button. */
  var CAT_KIND = { resize: "photo", edit: "photo", sheets: "photo", pdf: "pdf", idprint: "id", idmake: "id", cards: "id", govt: "govt", docs: "docs", bill: "bill", calc: "calc", exam: "exam", studio: "studio", util: "util", kids: "kids" };
  var STEPS = {
    photo: ["Open the tool and upload your photo or image.", "Set the size, KB limit or background colour.", "Check the preview, then click Download."],
    pdf: ["Add your PDF or image files.", "Choose the options (order, pages or output size).", "Click the main button, then Download."],
    id: ["Upload the photo or scan and fill in the details.", "Adjust size and position. Tap Try Demo to see an example.", "Click Print (A4, scale 100%, background graphics on)."],
    govt: ["Choose the format and language.", "Fill in the details.", "Check the preview, then Print or Save as PDF."],
    docs: ["Fill in your details (use Add Section/Field for more).", "Pick a template, colour or border.", "Check the preview, then Print or Save as PDF."],
    bill: ["Enter your shop and item details.", "Check the totals.", "Print, Save as PDF or open Reports."],
    calc: ["Enter the values.", "Press Calculate.", "Read or copy the result."],
    exam: ["Choose the option you need.", "Fill in the details or start the test.", "Print, download or check your result."],
    studio: ["Upload your photo, scan or documents.", "Choose a style, layout or border.", "Preview, then Download or Print."],
    util: ["Enter the details.", "Press the main button.", "Copy, open or download the result."],
    kids: ["Open Kids Corner.", "Pick a game or the Varnmala.", "Tap the pictures to play."]
  };
  var STEPS_BY_TOOL = {
    tools_photo_resizer: ["Upload your photo.", "Enter the required width x height (px or mm) and maximum KB.", "Drag to fit, then click Download."],
    tools_pdf_compressor: ["Upload the PDF.", "Choose Small, Medium, High or As it is.", "Click Compress, then Download."],
    tools_pan_aadhaar_print: ["Upload the front and back (image or PDF).", "Set the 4 corner pins and press Set.", "Click Print: A4, scale 100%."],
    tools_ai_passport_studio: ["Upload one photo.", "Pick the photo size, count and background colour.", "Adjust brightness/contrast, then Print or Download."]
  };

  var FAQ0 = [
    { k: "photo size kb limit form upload how many kb required size document size", a: "Every form has its own limit, so always read the notice. As a rough guide: photo about 20-50 KB, signature about 10-20 KB, documents 100-500 KB. Use Photo Resizer or Signature Resizer and type the exact KB limit.", go: "tools_photo_resizer" },
    { k: "print setting printing scale a4 print kaise blurry dhundla print quality", a: "For a clean print: choose A4, set scale to 100% (not 'Fit to page'), turn on Background graphics, and look at the preview first. Use a larger original image if the print looks blurry." },
    { k: "file format jpg png pdf jpeg webp which format difference", a: "JPG is best for photos (small size). PNG is best for signatures and logos (sharp edges). PDF is best for documents and forms. Most government portals accept JPG and PDF." },
    { k: "free cost price charge paid paisa", a: "All tools are free to use and need no sign-up." },
    { k: "safe privacy secure upload data server stored", a: "Your files stay on your own device. The tools run in your browser and nothing is uploaded to our server." },
    { k: "mobile phone android iphone laptop computer", a: "The tools work on mobile and computer. A laptop or desktop is easier for printing." },
    { k: "dpi resolution pixels", a: "Use about 200-300 DPI for printing. Screen forms usually ask for pixels (for example 200 x 230), which Photo Resizer sets for you.", go: "tools_photo_resizer" },
    { k: "demo example try sample", a: "Open any tool and tap the Try Demo button to load example data, so you can see how it works." }
  ];

  var FAQ = (H.faq && H.faq.length) ? H.faq : FAQ0;
  var STOP = " a an the i me my to for of in on is are do does can how what want need please kya hai ko ka ki ke se me mujhe chahiye karna kaise kare karo tool tools online free want wants open show go dikhao kholo khol find search give tell ";
  var HOMEHINT = "Try words like: Aadhaar print, compress PDF, crop photo, passport photo, resume, PVC card.";

  /* ---------- helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9\u0900-\u097f ]+/g, " ").replace(/\s+/g, " ").trim(); }
  function toks(s) { return norm(s).split(" ").filter(function (t) { return t && STOP.indexOf(" " + t + " ") < 0; }); }
  function lev1(a, b) {
    if (a === b) return true; if (Math.abs(a.length - b.length) > 1 || a.length < 5) return false;
    var i = 0, j = 0, e = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++e > 1) return false;
      if (a.length > b.length) i++; else if (a.length < b.length) j++; else { i++; j++; }
    }
    return e + (a.length - i) + (b.length - j) <= 1;
  }
  function fileOf(t) { return t[0].replace(/\.html$/, ""); }
  function hrefOf(t) { return fileOf(t) + ".html"; }
  function catName(id) { var c = CATS.filter(function (x) { return x.id === id; })[0]; return c ? c.name : ""; }

  var LIST = TOOLS.filter(function (t) { return !HIDE[fileOf(t)]; }).map(function (t) {
    var id = fileOf(t), g = G[id] || [], syn = ((SYN[id] || "") + " " + (g[2] || "")).trim();
    return { t: t, id: id, kind: "tool", name: norm(t[1]), nameT: toks(t[1]), hay: toks(t[1] + " " + t[2] + " " + syn), syn: norm(syn), steps: g[0] ? g[0].split("|") : null, tip: g[1] || "" };
  });
  PAGES.forEach(function (p) {
    var id = p.u.replace(/\.html$/, "");
    LIST.push({ t: [id, p.n, p.d, "page"], id: id, kind: "page", name: norm(p.n), nameT: toks(p.n), hay: toks(p.n + " " + p.d + " " + (p.k || "")), syn: norm(p.k || ""), steps: p.s ? p.s.split("|") : null, tip: p.t || "" });
  });

  function scoreTool(q, qt, o) {
    var s = 0;
    if (q.indexOf(o.name) > -1) s += 12;
    var phrases = o.syn;
    qt.forEach(function (w) {
      if (o.nameT.indexOf(w) > -1) s += 4;
      else if (o.nameT.some(function (n) { return lev1(w, n); })) s += 3;
      if (o.hay.indexOf(w) > -1) s += 2;
      else if (o.hay.some(function (h) { return lev1(w, h); })) s += 1;
    });
    // two-word phrase bonus, e.g. "pdf compress", "print aadhaar"
    for (var i = 0; i < qt.length - 1; i++) {
      var p = qt[i] + " " + qt[i + 1], r = qt[i + 1] + " " + qt[i];
      if (phrases.indexOf(p) > -1 || phrases.indexOf(r) > -1) s += 6;
    }
    return s;
  }
  function findTools(text) {
    var q = norm(text), qt = toks(text), out = [];
    LIST.forEach(function (o) { var s = scoreTool(q, qt, o); if (s > 0) out.push([s, o]); });
    out.sort(function (a, b) { return b[0] - a[0]; });
    return out;
  }
  var faqScore = 0;
  function findFaq(text) {
    var qt = norm(text).split(" ").filter(function (w) { return w.length > 1 && " a an the i me my to for of in on is are do does can how what want need please it " .indexOf(" " + w + " ") < 0; }), best = null, bs = 0;
    FAQ.forEach(function (f) {
      var ft = f.k.split(" "), s = 0;
      qt.forEach(function (w) { if (ft.indexOf(w) > -1) s += 2; });
      if (s > bs) { bs = s; best = f; }
    });
    faqScore = bs;
    return bs >= (qt.length <= 2 ? 2 : 4) ? best : null;
  }
  function findCat(text) {
    var q = norm(text), best = null;
    CATS.forEach(function (c) { var n = norm(c.name); if (q.indexOf(n) > -1 || (c.id.length > 2 && q.split(" ").indexOf(c.id) > -1 && /categor|section|group/.test(q))) best = c; });
    return best;
  }

  /* ---------- UI ---------- */
  var css = "#cscbot{position:fixed;right:18px;bottom:16px;z-index:9990;font:14px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
    "#cscbot .cb-fab{width:58px;height:58px;border:0;border-radius:50%;cursor:pointer;color:#fff;font-size:26px;background:linear-gradient(135deg,#1a3fa6,#0f2a73);box-shadow:0 6px 18px rgba(15,42,115,.45);border:3px solid #ff9800;transition:transform .15s}" +
    "#cscbot .cb-fab:hover{transform:scale(1.08)}#cscbot .cb-fab:focus-visible,#cscbot button:focus-visible,#cscbot input:focus-visible{outline:3px solid #ff9800;outline-offset:2px}" +
    "#cscbot .cb-tip{position:absolute;right:68px;bottom:12px;background:#fff;color:#0f2a73;padding:7px 12px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.2);font-weight:600;white-space:nowrap;display:none}" +
    "#cscbot .cb-panel{position:absolute;right:0;bottom:70px;width:370px;max-width:calc(100vw - 24px);height:540px;max-height:calc(100vh - 100px);display:none;flex-direction:column;background:#fff;color:#1e293b;border-radius:16px;overflow:hidden;box-shadow:0 14px 40px rgba(0,0,0,.35);border:2px solid #1a3fa6}" +
    "#cscbot.open .cb-panel{display:flex}#cscbot.open .cb-tip{display:none!important}" +
    "#cscbot .cb-head{background:linear-gradient(135deg,#1a3fa6,#0f2a73);color:#fff;padding:11px 14px;display:flex;align-items:center;gap:10px;border-bottom:3px solid #ff9800}" +
    "#cscbot .cb-head b{font-size:15px;display:block}#cscbot .cb-head small{opacity:.85;font-size:11.5px}#cscbot .cb-head div{flex:1}" +
    "#cscbot .cb-x{background:none;border:0;color:#fff;font-size:24px;cursor:pointer;line-height:1}" +
    "#cscbot .cb-msgs{flex:1;overflow-y:auto;padding:12px;background:#f1f5f9}" +
    "#cscbot .cb-m{max-width:90%;padding:8px 11px;margin:0 0 8px;border-radius:12px;word-wrap:break-word;overflow-wrap:anywhere}" +
    "#cscbot .cb-b{background:#fff;border:1px solid #e2e8f0;border-top-left-radius:3px}#cscbot .cb-u{background:#1a3fa6;color:#fff;margin-left:auto;border-top-right-radius:3px}" +
    "#cscbot ol{margin:6px 0 4px 18px;padding:0}#cscbot li{margin:2px 0}" +
    "#cscbot .cb-a{display:inline-block;margin:6px 6px 0 0;padding:6px 12px;border-radius:999px;background:#1a3fa6;color:#fff!important;text-decoration:none;font-size:13px;font-weight:600}#cscbot .cb-a:hover{background:#0f2a73}#cscbot .cb-a.o{background:#ff9800;color:#2b1700!important}#cscbot .cb-a.g{background:#16a34a}" +
    "#cscbot .cb-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 10px;background:#f1f5f9;border-top:1px solid #e2e8f0;max-height:96px;overflow-y:auto}" +
    "#cscbot .cb-chip{border:1px solid #93a8e0;background:#fff;color:#1a3fa6;border-radius:999px;padding:4px 10px;font-size:12.5px;cursor:pointer}#cscbot .cb-chip:hover{background:#e0e8ff}" +
    "#cscbot .cb-in{display:flex;border-top:1px solid #e2e8f0;background:#fff}#cscbot .cb-in input{flex:1;border:0;padding:12px;font-size:14px;color:#1e293b;background:#fff;min-width:0}" +
    "#cscbot .cb-in button{border:0;background:#1a3fa6;color:#fff;padding:0 16px;font-size:14px;font-weight:600;cursor:pointer}" +
    "@media(max-width:520px){#cscbot{right:12px;bottom:12px}#cscbot .cb-panel{width:calc(100vw - 24px);height:calc(100vh - 92px)}}" +
    "@media print{#cscbot{display:none!important}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var root = document.createElement("div"); root.id = "cscbot"; root.className = "no-print";
  root.innerHTML = '<span class="cb-tip" id="cb-tip">Need help? Ask me 👋</span>' +
    '<section class="cb-panel" role="dialog" aria-label="CSC VLE TOOLS help chat">' +
    '<div class="cb-head"><span aria-hidden="true" style="font-size:26px">🤖</span><div><b>' + esc(SITE.name || "CSC VLE TOOLS") + ' Helper</b><small>Find tools, steps and help</small></div><button class="cb-x" type="button" aria-label="Close chat">×</button></div>' +
    '<div class="cb-msgs" aria-live="polite"></div><div class="cb-chips"></div>' +
    '<form class="cb-in"><input type="text" autocomplete="off" aria-label="Type your question" placeholder="Ask here, e.g. open Prompt Studio"><button type="submit">Send</button></form></section>' +
    '<button class="cb-fab" type="button" aria-label="Open help chat" aria-expanded="false">💬</button>';
  document.body.appendChild(root);

  var panel = root.querySelector(".cb-panel"), msgs = root.querySelector(".cb-msgs"), chips = root.querySelector(".cb-chips"),
    input = root.querySelector("input"), fab = root.querySelector(".cb-fab"), tip = root.querySelector(".cb-tip");
  var name = ""; try { name = localStorage.getItem(NAME_KEY) || ""; } catch (e) {}

  function add(html, who) { var d = document.createElement("div"); d.className = "cb-m " + (who === "u" ? "cb-u" : "cb-b"); d.innerHTML = html; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
  function setChips(a) { chips.innerHTML = ""; a.forEach(function (t) { var b = document.createElement("button"); b.type = "button"; b.className = "cb-chip"; b.textContent = t; b.onclick = function () { ask(t); }; chips.appendChild(b); }); }
  var DEFAULT_CHIPS = ["Print Aadhaar card", "Compress PDF", "Crop photo to KB", "PVC card print", "Passport photos", "Make resume", "Open Prompt Studio", "Help / examples"];

  function toolCard(o, withSteps) {
    var t = o.t, steps = o.steps || STEPS_BY_TOOL[o.id] || STEPS[CAT_KIND[t[3]] || t[3]] || STEPS.util;
    var h = "<b>" + esc(t[1]) + "</b><br><small>" + esc(t[2]) + "</small>";
    if (withSteps) h += "<ol>" + steps.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>";
    if (withSteps && o.tip) h += "<small>💡 " + esc(o.tip) + "</small><br>";
    return h + '<a class="cb-a o" href="' + esc(hrefOf(t)) + '">Open ' + esc(t[1]) + " →</a>";
  }
  function links(arr) { return arr.map(function (o) { return '<a class="cb-a" href="' + esc(hrefOf(o.t)) + '">' + esc(o.t[1]) + "</a>"; }).join(""); }
  function nameChips(arr, n) { return arr.slice(0, n).map(function (o) { return o.t[1]; }); }
  function logMiss(raw) { try { var a = JSON.parse(localStorage.getItem(MISS_KEY) || "[]"); a.push(String(raw).slice(0, 80)); localStorage.setItem(MISS_KEY, JSON.stringify(a.slice(-40))); } catch (e) {} }
  var HELP_CHIPS = ["Print Aadhaar card", "How to use PDF compressor", "Tip for Photo Resizer", "Photo size for form", "Open Prompt Studio", "Contact support"];
  function faqReply(f) {
    var g = "";
    if (f.go) { var fo = LIST.filter(function (x) { return x.id === f.go; })[0]; if (fo) g = '<br><a class="cb-a o" href="' + esc(hrefOf(fo.t)) + '">Open ' + esc(fo.t[1]) + " →</a>"; }
    return { html: esc(f.a) + g, chips: DEFAULT_CHIPS };
  }
  function helpCard() {
    return "<b>I can help you with:</b><ol><li>Finding a tool: <i>print Aadhaar card</i></li><li>How to use a tool: <i>how to use PDF compressor</i></li><li>Tips: <i>tip for Photo Resizer</i></li><li>Sizes and printing: <i>photo size for form</i></li><li>Opening pages: <i>open Prompt Studio</i></li><li>Support: <i>contact</i></li></ol>Tap an example below, or type your own question.";
  }

  function contactCard() {
    var h = "<b>Help &amp; support</b>";
    if (SITE.hours) h += "<br>🕒 " + esc(SITE.hours);
    if (SITE.location) h += "<br>📍 " + esc(SITE.location);
    if (SITE.phone) h += "<br>📞 " + esc(SITE.phone);
    if (SITE.email) h += '<br>✉️ <a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "</a>";
    h += "<br>";
    if (SITE.whatsappNumber) h += '<a class="cb-a g" target="_blank" rel="noopener" href="https://wa.me/' + esc(String(SITE.whatsappNumber).replace(/\D/g, "")) + '">WhatsApp us</a>';
    h += '<a class="cb-a" href="contact.html">Contact page</a><a class="cb-a" href="feedback.html">Send feedback</a>';
    return h;
  }

  function reply(raw) {
    var q = norm(raw), nm = raw.match(/(?:my name is|i am|i'm|mera naam|naam)\s+([A-Za-z\u0900-\u097f ]{2,24})$/i), words = q ? q.split(" ").length : 0;
    if (nm) {
      name = nm[1].trim().replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
      try { localStorage.setItem(NAME_KEY, name); } catch (e) {}
      return { html: "Nice to meet you, <b>" + esc(name) + "</b>! What do you want to do today?", chips: DEFAULT_CHIPS };
    }
    if (q === "missed") {
      var m = []; try { m = JSON.parse(localStorage.getItem(MISS_KEY) || "[]"); } catch (e) {}
      return { html: m.length ? "<b>Questions I could not answer on this device:</b><ol>" + m.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol><small>Send this list to Claude to teach the chatbot.</small>" : "No missed questions on this device yet." };
    }
    if (/^(hi|hii|hello|hey|helo|namaste|namaskar|good morning|good evening)\b/.test(q) && words <= 3) return { html: (name ? "Hello " + esc(name) : "Hello Dear Visitor") + "! How can I help you? Type <b>help</b> to see examples.", chips: DEFAULT_CHIPS };
    if (/\b(thanks|thank you|thx|shukriya|dhanyavad|dhanyawad)\b/.test(q)) return { html: "You are welcome! 😊 Ask me anything else.", chips: DEFAULT_CHIPS };
    if (/\b(help|menu|hint|hints|examples?|options|what can you do|kya kya)\b/.test(q) && words <= 5) return { html: helpCard(), chips: HELP_CHIPS };
    var found = findTools(raw), top = found[0];
    if (/\b(contact|support|helpline|helpdesk|help desk|whatsapp number|phone number|call|email|address|sampark|complaint|problem|bug)\b/.test(q) && !(top && top[0] >= 8)) return { html: contactCard() };
    if (/\b(portal|portals|quick links|official site|govt site|government site)\b/.test(q)) return { html: 'Official portal links are in the <b>Quick Links</b> menu at the top of the page.<br><a class="cb-a" href="index.html">Go to home page</a>' };
    if (/\b(all tools|tool list|list of tools|categories|category|browse)\b/.test(q)) {
      return { html: "Pick a category:<br>" + CATS.filter(function (c) { return c.id !== "all"; }).map(function (c) { return '<a class="cb-a" href="cat-' + esc(c.id) + '.html">' + esc(c.name) + "</a>"; }).join(""), chips: DEFAULT_CHIPS };
    }
    var how = /\b(how|kaise|steps|explain|guide|samjhao|tarika|use|usage)\b/.test(q), open = /^(open|go to|goto|take me|kholo|khol do|show|i want|want)\b/.test(q) && /\b(open|kholo|khol|go)\b/.test(q);
    var tipQ = /\b(tip|tips|hint|hints|advice|suggestion)\b/.test(q);
    var cat = findCat(raw), faq = findFaq(raw);
    if (cat && (!top || top[0] < 12)) {
      var ct = LIST.filter(function (o) { return o.kind === "tool" && o.t[3] === cat.id; });
      return { html: "<b>" + esc(cat.name) + "</b> has " + ct.length + " tools:<br>" + links(ct) + '<br><a class="cb-a o" href="cat-' + esc(cat.id) + '.html">Open category page →</a>', chips: nameChips(ct, 4), go: open ? "cat-" + cat.id + ".html" : null };
    }
    var fs = faq ? faqScore : 0;
    if (faq && fs >= 4 && !how && !open && !tipQ && !(top && top[0] >= 10) && /\b(size|kb|limit|format|difference|settings?|scale|safe|free|price|offline|backup)\b/.test(q)) return faqReply(faq);
    if (top && top[0] >= 5 && (!faq || top[0] >= 8 || how || tipQ || words <= 2)) {
      var o = top[1], near = found.filter(function (x) { return x[0] >= 5 && x[0] >= top[0] * 0.75; });
      if (near.length >= 2 && (top[0] < 12 || near.length >= 3) && !how && !open && !tipQ && words <= 2) {
        return { html: "I found a few tools. Which one do you mean?<br>" + links(near.slice(0, 6).map(function (x) { return x[1]; })), chips: nameChips(near.map(function (x) { return x[1]; }), 4) };
      }
      var more = found.slice(1, 4).filter(function (x) { return x[0] >= Math.max(5, top[0] * 0.6); }).map(function (x) { return x[1]; });
      if (tipQ) return { html: "<b>Tip for " + esc(o.t[1]) + "</b><br>💡 " + esc(o.tip || "Try the Demo button to see how it works, and check the preview before you print.") + '<br><a class="cb-a o" href="' + esc(hrefOf(o.t)) + '">Open ' + esc(o.t[1]) + " →</a>", chips: ["How to use " + o.t[1]].concat(nameChips(more, 2)) };
      var h = toolCard(o, o.kind === "tool" || how);
      if (more.length) h += "<br><br>Also related:<br>" + links(more);
      var ch = o.tip ? ["Tip for " + o.t[1]] : []; ch = ch.concat(nameChips(more, 2), ["Contact support"]);
      return { html: h, go: open ? hrefOf(o.t) : null, chips: ch };
    }
    if (faq) return faqReply(faq);
    if (top && top[0] >= 2) {
      var sug = found.slice(0, 3).map(function (x) { return x[1]; });
      return { html: "I am not fully sure. Did you mean one of these?<br>" + links(sug), chips: nameChips(sug, 3).concat(["Help / examples"]) };
    }
    logMiss(raw);
    return { html: "I am still learning, and I could not find that yet. 😊<br>" + helpCard() + '<br>Or <a href="feedback.html">tell us what you wanted</a> and we will add it.', chips: HELP_CHIPS };
  }

  function ask(text) {
    text = String(text || "").trim(); if (!text) return;
    add(esc(text), "u"); input.value = "";
    var r = reply(text);
    setTimeout(function () {
      add(r.html, "b"); if (r.chips) setChips(r.chips);
      if (r.go) { add("Opening the page…", "b"); setTimeout(function () { location.href = r.go; }, 900); }
    }, 220);
  }

  var started = false;
  function toggle(force) {
    var open = typeof force === "boolean" ? force : !root.classList.contains("open");
    root.classList.toggle("open", open); fab.textContent = open ? "×" : "💬"; fab.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && !started) {
      started = true;
      add((name ? "Welcome back, <b>" + esc(name) + "</b>! 👋" : "Hello Dear Visitor! 👋 <span lang=\"hi\">नमस्ते!</span>") +
        "<br>I can find a tool, explain how to use it step by step, give tips, answer questions about photo and PDF sizes and printing, or open a page for you. Type <b>help</b> for examples." +
        (name ? "" : "<br><small>Tip: type “my name is …” and I will greet you by name.</small>"), "b");
      setChips(DEFAULT_CHIPS);
    }
    if (open) setTimeout(function () { input.focus(); }, 50);
  }
  fab.onclick = function () { toggle(); };
  root.querySelector(".cb-x").onclick = function () { toggle(false); };
  root.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("open")) toggle(false); });
  setTimeout(function () { if (!root.classList.contains("open")) { tip.style.display = "block"; setTimeout(function () { tip.style.display = "none"; }, 6000); } }, 4000);
  window.CSCBot = { open: function () { toggle(true); }, ask: function (t) { toggle(true); ask(t); } };
})();
