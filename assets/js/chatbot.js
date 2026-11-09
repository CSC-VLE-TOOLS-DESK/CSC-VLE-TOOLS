(function(){
  'use strict';
  if (window.__ssSimpleChatLoaded) return;
  window.__ssSimpleChatLoaded = true;

  var tools = [
    ['Photo Resizer','tools_photo_resizer.html',['photo','resize photo','passport photo']],
    ['Signature Resizer','tools_sign_resizer.html',['signature','sign resize']],
    ['Thumb Impression Resizer','tools_thumb_resizer.html',['thumb','fingerprint']],
    ['Image Compressor','tools_image_compressor.html',['image compress','compress image','jpg size']],
    ['Background Remover','tools_bg_remover.html',['background remover','remove background','bg remove']],
    ['Pro Studio','pro-studio.html',['pro studio','photo edit','crop photo']],
    ['PDF Merger','tools_pdf_merger.html',['merge pdf','pdf merger']],
    ['PDF Splitter','tools_pdf_splitter.html',['split pdf','pdf splitter']],
    ['PDF Compressor','tools_pdf_compressor.html',['compress pdf','pdf size']],
    ['PAN & Aadhaar Print','tools_pan_aadhaar_print.html',['pan card','aadhaar print','aadhar print']],
    ['PVC ID Card Print','tools_pvc_id_print.html',['pvc card','id card print']],
    ['Resume Generator','haryana-resume-generator.html',['resume','cv']],
    ['Age Calculator','tools_age_calculator.html',['age calculator','calculate age']],
    ['GST Invoice Generator','tools_invoice_generator.html',['invoice','gst bill']],
    ['Insurance Ledger','insurance-ledger.html',['insurance ledger','policy ledger']],
    ['Book Shop Ledger','book-shop-ledger.html',['book shop ledger','book ledger']],
    ['Medical Store Ledger','medical-store-ledger.html',['medical store','medicine ledger']],
    ['Kirana Store Ledger','kirana-store-ledger.html',['kirana ledger','grocery ledger']]
  ];

  function el(tag, cls, text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
  function addMessage(box, text, who){box.appendChild(el('div','ss-chat-msg '+(who==='user'?'ss-chat-user':'ss-chat-bot'),text));box.scrollTop=box.scrollHeight;}
  function addLinks(box, list){if(!list.length)return;var wrap=el('div','ss-chat-links');list.forEach(function(t){var a=el('a','',t[0]);a.href=t[1];wrap.appendChild(a);});box.appendChild(wrap);box.scrollTop=box.scrollHeight;}
  function matchTools(q){var s=q.toLowerCase(), found=[];tools.forEach(function(t){var hay=(t[0]+' '+t[2].join(' ')).toLowerCase();if(hay.indexOf(s)>=0||t[2].some(function(k){return s.indexOf(k)>=0;}))found.push(t);});return found.slice(0,5);}
  function answer(q, box){
    var s=q.toLowerCase().trim(), found;
    if(!s){addMessage(box,'Please type a question or choose one of the quick topics.');return;}
    if(/^(hi|hello|hey|namaste|नमस्ते)\b/.test(s)){addMessage(box,'Hello! Welcome to CSC VLE TOOLS. I can help you find tools and answer basic website questions.');return;}
    if(/free|cost|charge|payment|पैसे/.test(s)){addMessage(box,'Yes. The tools on this website are free to use. No account or login is required.');return;}
    if(/privacy|upload|server|safe|document.*store/.test(s)){addMessage(box,'Most tools process your files inside your browser. The website FAQ says photos and documents are not uploaded to our servers by those tools. Some tools may load helper libraries from public CDNs.');addLinks(box,[['Read About Us','about.html'],['Privacy Policy','privacy.html']]);return;}
    if(/official|government|govt|सरकारी/.test(s)){addMessage(box,'CSC VLE TOOLS is an independent project. It is not an official government website and is not affiliated with CSC e-Governance Services India Ltd or UIDAI.');addLinks(box,[['Disclaimer','disclaimer.html'],['Official Portal Links','#links']]);return;}
    if(/contact|support|feedback|help.*person/.test(s)){addMessage(box,'For feedback or support, please use these pages:');addLinks(box,[['Contact Us','contact.html'],['Send Feedback','feedback.html']]);return;}
    if(/how.*use|how.*work|guide|instructions/.test(s)){addMessage(box,'Open the tool you need, select or upload your file, adjust the available settings, preview the result, and download it. Each tool may have its own instructions on its page.');return;}
    found=matchTools(s);
    if(found.length){addMessage(box,'Here are the tools that may match your question:');addLinks(box,found.map(function(t){return [t[0],t[1]];}));return;}
    if(/photo|image|picture|passport|signature|thumb/.test(s)){addMessage(box,'For photo work, try Photo Resizer, Signature Resizer, Background Remover or Pro Studio.');addLinks(box,[['Photo Resizer','tools_photo_resizer.html'],['Signature Resizer','tools_sign_resizer.html'],['Background Remover','tools_bg_remover.html'],['Pro Studio','pro-studio.html']]);return;}
    if(/pdf/.test(s)){addMessage(box,'For PDF work, try PDF Merger, PDF Splitter or PDF Compressor.');addLinks(box,[['PDF Merger','tools_pdf_merger.html'],['PDF Splitter','tools_pdf_splitter.html'],['PDF Compressor','tools_pdf_compressor.html']]);return;}
    addMessage(box,'I am the simple website assistant, so I can answer common questions and find tools. Try asking for “photo resizer”, “merge PDF”, “Aadhaar print”, “invoice”, or “contact”.');
  }

  function init(){
    if(document.getElementById('ss-chat-launcher'))return;
    var css=document.createElement('link');css.rel='stylesheet';css.href='assets/css/chatbot.css?v=1';document.head.appendChild(css);
    var launch=el('button','', 'Chat with us');launch.id='ss-chat-launcher';launch.type='button';launch.setAttribute('aria-label','Open CSC VLE TOOLS help chat');
    var panel=el('section','');panel.id='ss-chat-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','CSC VLE TOOLS help chatbot');
    var head=el('div','ss-chat-head');var title=el('strong','', 'SevaSphere Assistant');var close=el('button','', '×');close.id='ss-chat-close';close.type='button';close.setAttribute('aria-label','Close chat');head.append(title,close);
    var messages=el('div','');messages.id='ss-chat-messages';
    var quick=el('div','ss-chat-quick');
    [['Find a tool','find a tool'],['Is it free?','Are the tools free?'],['Privacy','Are my files uploaded?'],['Contact','How can I contact you?']].forEach(function(item){var b=el('button','',item[0]);b.type='button';b.addEventListener('click',function(){addMessage(messages,item[1],'user');answer(item[1],messages);});quick.appendChild(b);});
    var form=el('form','');form.className='ss-chat-form';var input=el('input','');input.id='ss-chat-input';input.type='text';input.placeholder='Type your question…';input.maxLength=240;input.setAttribute('aria-label','Type your question');var send=el('button','', 'Send');send.id='ss-chat-send';send.type='submit';form.append(input,send);
    panel.append(head,messages,quick,form);document.body.append(launch,panel);
    function open(){panel.classList.add('ss-open');launch.setAttribute('aria-expanded','true');input.focus();if(!messages.childNodes.length)addMessage(messages,'Hello! Welcome to CSC VLE TOOLS. What would you like help with?');}
    function shut(){panel.classList.remove('ss-open');launch.setAttribute('aria-expanded','false');launch.focus();}
    launch.addEventListener('click',function(){panel.classList.contains('ss-open')?shut():open();});close.addEventListener('click',shut);
    form.addEventListener('submit',function(e){e.preventDefault();var q=input.value.trim();if(!q)return;addMessage(messages,q,'user');input.value='';answer(q,messages);input.focus();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&panel.classList.contains('ss-open'))shut();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();