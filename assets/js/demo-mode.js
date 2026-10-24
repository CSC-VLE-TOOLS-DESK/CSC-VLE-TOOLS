/* CSC VLE TOOLS universal practice demo — safe, client-side only. */
(function(){
  'use strict';
  if (window.__cscvleDemoInstalled) return;
  window.__cscvleDemoInstalled = true;
  var saved = new Map(), active = false;
  var style = document.createElement('style');
  style.textContent = `
    #ss-demo-launch{position:fixed;right:22px;bottom:22px;z-index:2147483000;border:0;border-radius:999px;padding:13px 19px;background:#1a3fa6;color:#fff;font:700 14px/1.2 system-ui,sans-serif;box-shadow:0 8px 24px #063d2b44;cursor:pointer;letter-spacing:.1px}
    #ss-demo-launch:hover{background:#0f2a73;transform:translateY(-1px)}
    #ss-demo-panel{position:fixed;right:22px;bottom:82px;z-index:2147483000;width:min(340px,calc(100vw - 32px));padding:16px;border:1px solid #a8d9c3;border-radius:16px;background:#f7fffb;color:#12392c;box-shadow:0 16px 48px #102f2440;font:14px/1.45 system-ui,sans-serif;display:none}
    #ss-demo-panel strong{display:block;font-size:15px;margin-bottom:5px;color:#0f2a73}#ss-demo-panel p{margin:5px 0 12px}#ss-demo-panel .ss-demo-actions{display:flex;gap:8px;flex-wrap:wrap}#ss-demo-panel button{border:0;border-radius:8px;padding:9px 12px;font-weight:700;cursor:pointer}#ss-demo-load{background:#1a3fa6;color:white}#ss-demo-reset{background:#e5eee9;color:#173e30}#ss-demo-close{float:right;background:transparent;color:#456b5a;padding:0 4px;font-size:20px}
    #ss-demo-notice{position:fixed;right:22px;bottom:146px;z-index:2147483000;max-width:min(340px,calc(100vw - 32px));padding:10px 13px;border-radius:10px;background:#12392c;color:#fff;font:13px/1.4 system-ui,sans-serif;box-shadow:0 8px 24px #063d2b33;display:none}
    .ss-demo-filled{outline:2px solid #43a982!important;outline-offset:1px!important}
    @media(max-width:520px){#ss-demo-launch{right:12px;bottom:12px}#ss-demo-panel{right:12px;bottom:70px}#ss-demo-notice{right:12px;bottom:132px}}
  `;
  document.head.appendChild(style);
  var panel=document.createElement('section'); panel.id='ss-demo-panel'; panel.setAttribute('aria-label','CSC VLE TOOLS Demo Mode');
  panel.innerHTML='<button id="ss-demo-close" type="button" aria-label="Close demo panel">×</button><strong>CSC VLE TOOLS Demo Mode</strong><p>Load example values into this tool to practise. Your original field values can be restored with Reset Demo. Nothing is uploaded or sent.</p><div class="ss-demo-actions"><button id="ss-demo-load" type="button">Load Sample Data</button><button id="ss-demo-reset" type="button">Reset Demo</button></div><p id="ss-demo-help" style="font-size:12px;color:#466b5a;margin:10px 0 0">After loading, use the tool’s own Calculate, Preview, or Generate button.</p>';
  var launch=document.createElement('button'); launch.id='ss-demo-launch'; launch.type='button'; launch.textContent='▶ Try Demo'; launch.setAttribute('aria-haspopup','dialog');
  var notice=document.createElement('div'); notice.id='ss-demo-notice'; notice.setAttribute('role','status');
  function attach(){if(!document.body||document.getElementById('ss-demo-launch'))return;document.body.append(launch,panel,notice);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();
  function norm(s){return String(s||'').toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();}
  function fieldText(el){var bits=[el.name,el.id,el.placeholder,el.getAttribute('aria-label'),el.title].filter(Boolean);if(el.labels)Array.from(el.labels).forEach(l=>bits.push(l.innerText));var p=el.closest('.form-group,.input-group,.field,.form-row,.mb-3,.col,div');if(p){var label=p.querySelector('label');if(label)bits.push(label.innerText);}return norm(bits.join(' '));}
  function sample(el){var t=fieldText(el), type=(el.type||'').toLowerCase();
    if(type==='email'||/e ?mail/.test(t))return 'demo@example.com';
    if(type==='tel'||/mobile|phone|contact|whatsapp/.test(t))return '9876543210';
    if(type==='date'||/date of birth|birth date|dob/.test(t))return '2000-05-15';
    if(type==='datetime-local')return '2026-10-24T10:30';
    if(type==='time')return '10:30';
    if(type==='month')return '2026-10';
    if(type==='number'||/amount|price|fee|charge|rate|salary|income|expense|total|quantity|qty|age|year|percent|percentage|marks|score|width|height|size|gst|tax|discount|loan|principal|interest|emi/.test(t)){
      if(/age/.test(t))return '26'; if(/year/.test(t))return '2026'; if(/quantity|qty/.test(t))return '2'; if(/percent|percentage|gst|tax/.test(t))return '18'; if(/width/.test(t))return '600'; if(/height/.test(t))return '800'; if(/salary|income|loan|principal|amount|price|fee|charge|rate|expense|total|emi/.test(t))return '1250'; return '2';
    }
    if(type==='url'||/website|url|link/.test(t))return 'https://example.com';
    if(/pin ?code|postal|zip/.test(t))return '124001';
    if(/state/.test(t))return 'Haryana';
    if(/district|city|town/.test(t))return 'Rohtak';
    if(/address|location/.test(t))return 'Model Town, Rohtak, Haryana';
    if(/shop|business|company|organization|organisation|firm/.test(t))return 'CSC VLE TOOLS Demo Store';
    if(/father|guardian/.test(t))return 'Amit Sharma';
    if(/surname|last name/.test(t))return 'Sharma';
    if(/first name|applicant|customer|student|candidate|person name|full name|\bname\b/.test(t))return 'Rahul Sharma';
    if(/invoice|receipt|reference|application no|registration/.test(t))return 'DEMO-2026-001';
    if(/subject/.test(t))return 'Application for Service';
    if(/message|description|remarks|note|purpose|details|reason|content/.test(t))return 'This is sample information for practice only.';
    if(/product|item|service/.test(t))return 'Document Printing';
    if(/designation|occupation|job|post/.test(t))return 'Service Operator';
    if(type==='color')return '#1a3fa6';
    if(type==='checkbox'||type==='radio'||type==='file'||type==='password'||type==='hidden'||el.disabled||el.readOnly)return null;
    if(el.tagName==='SELECT')return null;
    if(/search|filter/.test(t))return null;
    return 'Demo Sample';
  }
  function notify(msg){notice.textContent=msg;notice.style.display='block';clearTimeout(notify.timer);notify.timer=setTimeout(()=>notice.style.display='none',4200);}
  function load(){
    var controls=Array.from(document.querySelectorAll('input,textarea,select')).filter(el=>el.isConnected && el.type!=='hidden' && el.type!=='file' && el.type!=='password' && !el.disabled && !el.readOnly && el.getClientRects().length);
    var count=0;
    controls.forEach(el=>{
      if(el.type==='checkbox'||el.type==='radio')return;
      if(!saved.has(el))saved.set(el,{value:el.value,checked:el.checked});
      var val;
      if(el.tagName==='SELECT'){
        var opts=Array.from(el.options).filter(o=>!o.disabled && String(o.value).trim()!=='' && !/select|choose|please|--/.test(norm(o.textContent)));
        if(!opts.length)return; val=opts.find(o=>/haryana|general|standard|simple|male|female|yes|normal|a4|india/.test(norm(o.textContent)))?.value || opts[0].value;
      } else val=sample(el);
      if(val===null)return;
      if(el.type==='date' && !/^\d{4}-\d{2}-\d{2}$/.test(val))return;
      el.value=val; el.classList.add('ss-demo-filled');
      el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));count++;
    });
    active=true;launch.textContent='✓ Demo Loaded';
    document.getElementById('ss-demo-help').textContent=count?count+' field(s) filled with practice values. File uploads must be selected manually.':'This page has no editable practice fields yet. Its tool may need to be built before it can run a sample.';
    notify(count?('Demo sample loaded into '+count+' field(s). Review it, then run the tool’s own action.'):'No editable fields found on this page yet.');
  }
  function reset(){var count=0;saved.forEach((v,el)=>{if(!el.isConnected)return;el.value=v.value;el.checked=v.checked;el.classList.remove('ss-demo-filled');el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));count++;});saved.clear();active=false;launch.textContent='▶ Try Demo';notify(count?'Demo values reset. Original field values restored.':'There are no demo values to reset.');}
  launch.addEventListener('click',()=>{panel.style.display=panel.style.display==='block'?'none':'block';});
  document.addEventListener('click',e=>{if(e.target.id==='ss-demo-load'){if(active)reset();load();}if(e.target.id==='ss-demo-reset')reset();if(e.target.id==='ss-demo-close')panel.style.display='none';});
})();
