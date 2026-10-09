(function(){
function hide(el){if(el)el.style.display='none'}
function disable(el,title){if(!el)return;el.disabled=true;el.setAttribute('aria-disabled','true');el.title=title||'ليس لديك صلاحية لهذا الإجراء';el.style.opacity='.48';el.style.pointerEvents='none'}
async function apply(){
 if(!window.VLensAPI||!VLensAPI.isAuthenticated())return;
 try{
  const p=await VLensAPI.getPermissions();window.VLensPermissions=p;
  document.documentElement.dataset.role=p.role;
  document.querySelectorAll('.user small,.user span').forEach(x=>{if(/مدير التوظيف|Recruitment Manager|أخصائي توظيف|مدير إدارة|مدير النظام/.test(x.textContent))x.setAttribute('data-role-label','')});
  const deny='ليس لديك صلاحية لهذا الإجراء';
  if(!p.canManageJobs){document.querySelectorAll('a.add[href*="jobs"],button[data-action="add-job"],#addJob,.newJob,.createJob').forEach(x=>disable(x,deny))}
  if(!p.canManageCandidates){document.querySelectorAll('a.add[href*="upload"],button[data-action="upload"],#uploadBtn,.uploadBtn,.addCandidate').forEach(x=>disable(x,deny))}
  if(!p.canEvaluate){document.querySelectorAll('#evalForm button[type="submit"],.evaluation button,.interviewDecision').forEach(x=>disable(x,deny))}
  if(!['admin','recruiter'].includes(p.role)){document.querySelectorAll('.offerAction,#offerForm button[type="submit"],#createOfferForm button[type="submit"],#interviewForm button[type="submit"],.interviewSave,button[onclick*="offer"],button[onclick*="Offer"]').forEach(x=>disable(x,deny))}
  if(!p.canDelete){document.querySelectorAll('.delete,.danger[data-action="delete"],button[onclick*="delete"],button[onclick*="Delete"]').forEach(x=>hide(x))}
  if(!p.canManageTeam){document.querySelectorAll('button[id*="invite"],.invite,.inviteBtn,[data-action="invite"],.teamAdminAction').forEach(x=>disable(x,deny))}
  document.querySelectorAll('[data-role-label]').forEach(x=>x.textContent=p.role==='admin'?'مدير النظام':p.role==='manager'?'مدير إدارة':'أخصائي توظيف');
  if(p.role==='manager'){document.querySelectorAll('a[href="upload-cvs.html"]').forEach(x=>hide(x))}
  if(!p.canManageTeam&&location.pathname.endsWith('/team.html'))document.querySelectorAll('.invite,.inviteBtn,button').forEach(x=>{if(/دعوة|Invite/.test(x.textContent))disable(x,deny)});
 }catch(e){console.warn('Role UI unavailable',e)}
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,80));setTimeout(apply,700);
})();
(function(){
function init(){
 const side=document.querySelector('aside.side');if(!side||side.dataset.vlensModern)return;
 const style=document.createElement('style');style.textContent=`
 .app{grid-template-columns:252px minmax(0,1fr)!important}
 .side[data-vlens-modern]{background:linear-gradient(155deg,#08192f,#0e2a50 70%,#102f61)!important;color:#f8fbff!important;padding:26px 15px 18px!important;box-shadow:-8px 0 30px #07182a16!important;z-index:20!important;overflow-y:auto!important;display:flex!important;flex-direction:column!important;gap:0!important}
 .side[data-vlens-modern] .brand{border-bottom:1px solid #ffffff1b!important;margin:0 0 24px!important;padding:0 10px 24px!important;display:flex!important;gap:12px!important;align-items:center!important;color:#fff!important}
 .side[data-vlens-modern] .brand b{font-size:19px!important;letter-spacing:.6px!important}
 .side[data-vlens-modern] .brand small{font-size:10px!important;color:#a6bcd9!important}
 .side[data-vlens-modern] .logo{width:42px!important;height:42px!important;background:linear-gradient(135deg,#139af8,#2054d5)!important;color:white!important;box-shadow:0 7px 18px #07172c88!important;border-radius:12px!important}
 .side[data-vlens-modern] .nav{display:flex!important;flex-direction:column!important;gap:5px!important}
 .side[data-vlens-modern] .nav a{display:flex!important;align-items:center!important;gap:13px!important;padding:12px 13px!important;min-height:47px!important;color:#b9c9e0!important;font-size:12px!important;font-weight:600!important;border-radius:11px!important;background:transparent!important;text-decoration:none!important;transition:background .2s,color .2s!important;margin:0!important}
 .side[data-vlens-modern] .nav a:hover{background:#ffffff13!important;color:#fff!important}
 .side[data-vlens-modern] .nav a.active,.side[data-vlens-modern] .nav a[aria-current=page]{background:linear-gradient(100deg,#24477c,#1266d6)!important;color:#fff!important;box-shadow:0 5px 17px #061b3a77!important}
 .side[data-vlens-modern] .nav .vlens-nav-icon{width:22px!important;height:22px!important;flex:0 0 22px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important}
 .side[data-vlens-modern] .nav .vlens-nav-icon svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
 .side[data-vlens-modern] .nav i{display:none!important}
 .side[data-vlens-modern] .aiSide{position:static!important;margin-top:28px!important;border:1px solid #ffffff20!important;background:#ffffff08!important}
 .side[data-vlens-modern] .aiSide a{background:#1264bf!important}
 .vlens-side-footer{margin-top:auto;padding:17px 4px 2px;display:flex;gap:8px;border-top:1px solid #ffffff20;align-items:center}
 .vlens-side-footer button{border:1px solid #ffffff28;background:#ffffff10;color:white;border-radius:11px;padding:10px 12px;font-size:12px;cursor:pointer;flex:1}
 .vlens-side-footer button:hover{background:#ffffff22}
 .vlens-side-toggle{display:none;position:fixed;top:14px;right:14px;z-index:102;border:0;border-radius:11px;padding:10px 13px;background:#102c53;color:white;font-size:20px;box-shadow:0 4px 15px #071a3550}
 .vlens-side-backdrop{display:none}
 @media(max-width:900px){.vlens-side-toggle{display:block!important}.side[data-vlens-modern]{position:fixed!important;right:0!important;top:0!important;bottom:0!important;height:100dvh!important;width:270px!important;transform:translateX(105%)!important;transition:transform .25s ease!important;z-index:101!important}.side[data-vlens-modern].vlens-open{transform:translateX(0)!important}.vlens-side-backdrop.vlens-open{display:block;position:fixed;inset:0;background:#06152999;z-index:100}}
 `;document.head.appendChild(style);side.dataset.vlensModern='2';
 const paths={'dashboard.html':'M3 10 12 3l9 7v11h-6v-7H9v7H3z','candidates.html':'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 8v6 M17 11h6','upload-cvs.html':'M12 16V3 M7 8l5-5 5 5 M4 16v5h16v-5','jobs.html':'M3 7h18v14H3z M9 7V4h6v3 M3 12h18','interviews.html':'M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16 M8 15h3 M8 18h7','offers.html':'M6 3h9l5 5v13H6z M15 3v6h5 M9 14h8 M9 18h6','reports.html':'M4 20V10 M10 20V4 M16 20v-8 M22 20V7','team.html':'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M19 8a3 3 0 0 1 0 6 M22 21v-2a4 4 0 0 0-3-4','settings.html':'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M19.4 15a8 8 0 0 0 .1-6l2-1-2-3-2 1a8 8 0 0 0-5-3l-.5-2h-3l-.5 2a8 8 0 0 0-5 3l-2-1-2 3 2 1a8 8 0 0 0 .1 6l-2 1 2 3 2-1a8 8 0 0 0 5 3l.5 2h3l.5-2a8 8 0 0 0 5-3l2 1 2-3z'};
 const page=location.pathname.split('/').pop();
 side.querySelectorAll('.nav a').forEach(a=>{const href=(a.getAttribute('href')||'').split('?')[0];const key=href==='job.html'?'jobs.html':href;const path=paths[key];if(!path)return;const active=href===page||(page==='job.html'&&href==='jobs.html')||(page==='candidate.html'&&href==='candidates.html');a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');a.querySelector('i')?.remove();const icon=document.createElement('span');icon.className='vlens-nav-icon';icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+path+'"/></svg>';a.prepend(icon)});
 const footer=document.createElement('div');footer.className='vlens-side-footer';const lang=document.createElement('button');lang.type='button';lang.id='vlGlobalLang';lang.setAttribute('aria-label','تغيير اللغة Change language');lang.textContent=(localStorage.getItem('vlens_lang')==='en'?'عربي':'English')+' 🌐';lang.onclick=()=>{localStorage.setItem('vlens_lang',localStorage.getItem('vlens_lang')==='en'?'ar':'en');location.reload()};const theme=document.createElement('button');theme.type='button';theme.textContent='☀︎';theme.title='الوضع الفاتح';theme.onclick=()=>{const on=document.body.classList.toggle('vlens-soft-mode');localStorage.setItem('vlens_soft_mode',on?'1':'0');theme.textContent=on?'☾':'☀︎';theme.setAttribute('aria-pressed',String(on))};if(localStorage.getItem('vlens_soft_mode')==='1'){document.body.classList.add('vlens-soft-mode');theme.textContent='☾';theme.setAttribute('aria-pressed','true')}else theme.setAttribute('aria-pressed','false');footer.append(lang,theme);side.appendChild(footer);
 const toggle=document.createElement('button');toggle.type='button';toggle.className='vlens-side-toggle';toggle.setAttribute('aria-label','فتح القائمة');toggle.textContent='☰';const backdrop=document.createElement('div');backdrop.className='vlens-side-backdrop';const close=()=>{side.classList.remove('vlens-open');backdrop.classList.remove('vlens-open')};toggle.onclick=()=>{side.classList.toggle('vlens-open');backdrop.classList.toggle('vlens-open')};backdrop.onclick=close;side.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.body.append(toggle,backdrop);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* V-Lens HR unified enterprise design system — all authenticated workspace pages */
(function(){
 function mountEnterpriseTheme(){
  if(document.getElementById('vlens-enterprise-global'))return;
  const css=document.createElement('style');css.id='vlens-enterprise-global';
  css.textContent=`
  :root{--vl-brand:#155cf4;--vl-brand-dark:#1048cc;--vl-ink:#122346;--vl-muted:#73839c;--vl-border:#e3eaf5;--vl-surface:#fff;--vl-canvas:#f3f7ff}
  html{scroll-behavior:smooth}
  body{font-family:"Segoe UI",Tahoma,Arial,sans-serif!important;background:var(--vl-canvas)!important;color:var(--vl-ink)!important}
  body .main{min-width:0!important}
  body .content{max-width:1600px!important;margin-inline:auto!important}
  body .side[data-vlens-modern]{background:linear-gradient(170deg,#08162d,#0b1d3b 68%,#07152d)!important;border-inline-start:1px solid #ffffff14!important}
  body .side[data-vlens-modern] .brand b{font-size:19px!important;letter-spacing:0!important}
  body .side[data-vlens-modern] .brand small{color:#aebfdf!important;font-size:9px!important}
  body .side[data-vlens-modern] .logo{background:linear-gradient(140deg,#378bff,#1749e6)!important}
  body .side[data-vlens-modern] .nav a{border-radius:10px!important;min-height:47px!important}
  body .side[data-vlens-modern] .nav a.active,body .side[data-vlens-modern] .nav a[aria-current=page]{background:linear-gradient(105deg,#2345c5,#1264fa)!important;box-shadow:0 7px 18px #0746b055!important}
  body .top{background:#fff!important;border-bottom:1px solid var(--vl-border)!important;box-shadow:0 2px 16px #173c7310!important}
  body .top .search,body input[type=search]{background:#f4f7fc!important;border:1px solid #dce5f2!important;border-radius:10px!important}
  body .card,body .panel,body .stat,body .jobCard,body .candidateCard,body .offer,body .table,body .tools{background-color:#fff;border:1px solid var(--vl-border)!important;border-radius:13px!important;box-shadow:0 3px 17px #173b7010!important}
  body .card:hover,body .panel:hover{border-color:#d4dff0!important}
  body .stat b{color:#10234a!important}
  body .stat span,body .muted{color:var(--vl-muted)!important}
  body .icon,body .quickIcon{background:#eaf1ff!important;color:var(--vl-brand)!important;border-radius:11px!important}
  body a.add,body .btn.primary,body button.primary,body .submit,body .saveBtn{background:linear-gradient(115deg,#155cf4,#286bff)!important;color:#fff!important;border-radius:10px!important;border-color:transparent!important}
  body button,body a.btn{transition:background .18s,box-shadow .18s,transform .18s}
  body button:focus-visible,body a:focus-visible,body input:focus-visible,body select:focus-visible,body textarea:focus-visible{outline:2px solid #2b69f5!important;outline-offset:2px!important}
  body input:not([type=checkbox]):not([type=radio]),body select,body textarea{border-radius:10px;border-color:#dce5f2}
  body table{border-collapse:separate;border-spacing:0}
  body th,body thead{background:#f7f9fd!important;color:#61718c!important}
  body td,body th{border-bottom-color:#eaf0f7!important}
  body .badge,body .pill{border-radius:999px!important}
  body .sectionTitle a,body .viewAll{color:var(--vl-brand)!important}
  body .hero{border:1px solid #dce7fa!important;border-radius:16px!important}
  body .vlens-side-footer button{border-radius:9px!important}
  @media(min-width:701px){body .app{grid-template-columns:252px minmax(0,1fr)!important}body .content{padding-inline:24px!important}body .top{min-height:68px!important}}
  @media(max-width:1000px) and (min-width:701px){body .app{grid-template-columns:225px minmax(0,1fr)!important}body .content{padding-inline:16px!important}}
  @media(max-width:700px){body .content{padding-inline:12px!important}body .card,body .panel{max-width:100%}body .side[data-vlens-modern]{max-width:90vw}}
  @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}body button,body a.btn{transition:none}}
  `;
  document.head.appendChild(css);
  const side=document.querySelector('aside.side .brand small');
  if(side)side.textContent='Smarter Hiring. Stronger Teams.';
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountEnterpriseTheme);
 else mountEnterpriseTheme();
})();

/* Working accessible workspace appearance toggle */
(function(){function init(){if(document.getElementById('vlens-appearance-style'))return;const el=document.createElement('style');el.id='vlens-appearance-style';el.textContent=`
body.vlens-soft-mode{--vl-canvas:#e9f0fb!important;--vl-surface:#f8fbff!important;--vl-ink:#122346!important}
body.vlens-soft-mode .main{background:#e9f0fb!important}
body.vlens-soft-mode .content{background:transparent!important}
body.vlens-soft-mode .top{background:#eef4ff!important;border-bottom-color:#cfdcf0!important}
body.vlens-soft-mode .card,body.vlens-soft-mode .panel,body.vlens-soft-mode .stat,body.vlens-soft-mode .table,body.vlens-soft-mode .tools,body.vlens-soft-mode .jobCard,body.vlens-soft-mode .candidateCard,body.vlens-soft-mode .offer{background:#f8fbff!important;border-color:#cfdbed!important;box-shadow:0 4px 16px #1d467219!important}
body.vlens-soft-mode input,body.vlens-soft-mode select,body.vlens-soft-mode textarea{background:#fff!important}
body.vlens-soft-mode .hero{border-color:#c9d8f2!important}
`;document.head.appendChild(el)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();

/* Responsive enterprise layout: tablets, phones and wide data tables */
(function(){
 function init(){
  if(document.getElementById('vlens-responsive-20261009'))return;
  const style=document.createElement('style');
  style.id='vlens-responsive-20261009';
  style.textContent=`
  html,body{max-width:100%;overflow-x:clip}
  .app,.main,.content{min-width:0}
  .main{max-width:100%}
  .content .grid,.content .lower,.content .stats,.content .execGrid,.content .quickGrid{min-width:0}
  .content .grid>*,.content .lower>*,.content .stats>*,.content .execGrid>*,.content .quickGrid>*{min-width:0}
  .panel,.card,.tools{max-width:100%}
  .panel table,.card table,.tools table{width:100%}
  .table, .tableWrap, .table-wrapper, .tableContainer, .table-responsive{overflow-x:auto;max-width:100%;-webkit-overflow-scrolling:touch}
  .table table, .tableWrap table, .table-wrapper table, .tableContainer table, .table-responsive table{min-width:620px}
  img,video,canvas,svg{max-width:100%}
  .top{min-width:0}
  .top .search{min-width:0}
  @media(min-width:701px) and (max-width:900px){
   body .app{display:block!important;grid-template-columns:minmax(0,1fr)!important}
   body .main{margin:0!important;width:100%!important}
   body .top{padding-inline-start:65px!important}
   body .content{padding:18px!important}
   body .side[data-vlens-modern]{width:270px!important}
   body .vlens-side-toggle{display:block!important}
  }
  @media(max-width:700px){
   body .app{display:block!important;grid-template-columns:1fr!important}
   body .main{width:100%!important;min-width:0!important}
   body .content{padding:12px!important}
   body .top{padding-inline-start:60px!important;gap:8px!important}
   body .top .search{flex:1 1 140px!important;width:auto!important}
   body .side[data-vlens-modern]{display:flex!important;position:fixed!important;top:0!important;right:0!important;left:auto!important;bottom:0!important;width:min(290px,88vw)!important;height:100dvh!important;transform:translateX(110%)!important;overflow-y:auto!important;z-index:1001!important;box-shadow:-14px 0 40px #06152a44!important}
   body .side[data-vlens-modern].vlens-open{transform:translateX(0)!important}
   body .side[data-vlens-modern] .nav{display:flex!important;flex-direction:column!important;width:100%!important;min-width:0!important;gap:5px!important}
   body .side[data-vlens-modern] .nav a{flex-direction:row!important;justify-content:flex-start!important;align-items:center!important;width:100%!important;min-width:0!important;height:auto!important;min-height:46px!important;padding:10px 12px!important;font-size:12px!important;white-space:normal!important}
   body .side[data-vlens-modern] .brand{display:flex!important}
   body .side[data-vlens-modern] .aiSide{display:block!important}
   body .side[data-vlens-modern] .vlens-side-footer{display:flex!important}
   body .vlens-side-toggle{display:block!important;z-index:1003!important;top:11px!important;right:11px!important}
   body .vlens-side-backdrop.vlens-open{z-index:1000!important}
   body .stats,body .execGrid,body .quickGrid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
   body .grid,body .lower{grid-template-columns:minmax(0,1fr)!important}
   body .hero{flex-wrap:wrap!important}
   body .hero h1{font-size:20px!important}
   body .panel{padding:14px!important}
   body .stat{padding:12px!important}
   body .stat b{font-size:21px!important}
  }
  @media(max-width:390px){
   body .stats,body .execGrid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
   body .quickGrid{grid-template-columns:1fr!important}
   body .top{padding-inline-start:58px!important}
  }
  `;
  document.head.appendChild(style);
  const toggle=document.querySelector('.vlens-side-toggle');
  const side=document.querySelector('aside.side');
  if(toggle&&side){
   toggle.setAttribute('aria-controls','vlens-workspace-navigation');
   side.id='vlens-workspace-navigation';
   toggle.setAttribute('aria-expanded',String(side.classList.contains('vlens-open')));
   toggle.addEventListener('click',()=>toggle.setAttribute('aria-expanded',String(side.classList.contains('vlens-open'))));
   document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&side.classList.contains('vlens-open')){
     side.classList.remove('vlens-open');
     document.querySelector('.vlens-side-backdrop')?.classList.remove('vlens-open');
     toggle.setAttribute('aria-expanded','false');
     toggle.focus();
    }
   });
   side.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggle.setAttribute('aria-expanded','false')));
   document.querySelector('.vlens-side-backdrop')?.addEventListener('click',()=>toggle.setAttribute('aria-expanded','false'));
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0));
 else setTimeout(init,0);
})();
