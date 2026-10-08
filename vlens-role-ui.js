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
  if(!p.canManageOffers){document.querySelectorAll('.offerAction,#offerForm button[type="submit"],button[onclick*="offer"],button[onclick*="Offer"]').forEach(x=>disable(x,deny))}
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
function sidebarRefresh(){
 const side=document.querySelector('aside.side');if(!side||side.dataset.vlensModern==='1')return;side.dataset.vlensModern='1';
 const style=document.createElement('style');style.textContent=`
 .side[data-vlens-modern="1"]{background:linear-gradient(165deg,#091a30 0%,#102d53 64%,#142f5b 100%)!important;color:#f8fbff!important;padding:25px 14px!important;box-shadow:-8px 0 26px #091a3012!important;z-index:20!important;overflow-y:auto!important}
 .side[data-vlens-modern="1"] .brand{border-bottom:1px solid #ffffff19!important;margin-bottom:23px!important;padding:3px 12px 24px!important;color:white!important;font-size:20px!important;font-weight:800!important;letter-spacing:.2px!important}
 .side[data-vlens-modern="1"] .brand small{font-size:10px!important;color:#a9bfd9!important}
 .side[data-vlens-modern="1"] .logo{background:linear-gradient(135deg,#1489ed,#2056b6)!important;box-shadow:0 8px 18px #07162b66!important}
 .side[data-vlens-modern="1"] .nav{display:flex!important;flex-direction:column!important;gap:5px!important}
 .side[data-vlens-modern="1"] .nav a{display:flex!important;align-items:center!important;gap:13px!important;padding:13px 14px!important;min-height:46px!important;color:#c0cee1!important;font-size:12px!important;font-weight:600!important;border-radius:11px!important;background:transparent!important;text-decoration:none!important;transition:background .18s,color .18s!important}
 .side[data-vlens-modern="1"] .nav a:hover{background:#ffffff12!important;color:white!important}
 .side[data-vlens-modern="1"] .nav a.active,.side[data-vlens-modern="1"] .nav a[aria-current="page"]{background:linear-gradient(100deg,#224775,#1265d5)!important;color:white!important;box-shadow:0 5px 14px #061c3970!important}
 .side[data-vlens-modern="1"] .nav a .vlens-nav-icon{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 22px!important;width:22px!important;font-size:18px!important;line-height:1!important;color:inherit!important}
 .side[data-vlens-modern="1"] .nav a i{display:none!important}
 .side[data-vlens-modern="1"] .aiSide{position:static!important;margin-top:32px!important;border:1px solid #ffffff22!important;background:#ffffff09!important}
 .side[data-vlens-modern="1"] .aiSide a{background:#155eac!important}
 .vlens-side-toggle{display:none;position:fixed;top:13px;right:13px;z-index:102;border:0;border-radius:10px;padding:10px 13px;background:#102b50;color:white;font-size:18px;box-shadow:0 3px 12px #071a3550}
 @media(max-width:900px){.vlens-side-toggle{display:block!important}.side[data-vlens-modern="1"]{position:fixed!important;right:0!important;top:0!important;bottom:0!important;height:100dvh!important;width:270px!important;transform:translateX(105%)!important;transition:transform .25s ease!important;z-index:101!important}.side[data-vlens-modern="1"].vlens-open{transform:translateX(0)!important}.vlens-side-backdrop{display:none;position:fixed;inset:0;background:#06152991;z-index:100}.vlens-side-backdrop.vlens-open{display:block}}
 `;document.head.appendChild(style);side.dataset.vlensModern='1';
 const icons={'dashboard.html':'⌂','candidates.html':'♙','upload-cvs.html':'⇧','jobs.html':'▣','job.html':'▣','interviews.html':'▦','offers.html':'▤','reports.html':'▥','team.html':'♧','settings.html':'⚙'};
 const page=location.pathname.split('/').pop();
 side.querySelectorAll('.nav a').forEach(a=>{const href=(a.getAttribute('href')||'').split('?')[0];const icon=icons[href];if(!icon)return;a.classList.toggle('active',href===page||(page==='job.html'&&href==='jobs.html'));if(href===page)a.setAttribute('aria-current','page');const old=a.querySelector('i');if(old)old.remove();const span=document.createElement('span');span.className='vlens-nav-icon';span.textContent=icon;a.prepend(span)});
 const toggle=document.createElement('button');toggle.type='button';toggle.className='vlens-side-toggle';toggle.setAttribute('aria-label','فتح القائمة');toggle.textContent='☰';
 const backdrop=document.createElement('div');backdrop.className='vlens-side-backdrop';
 const close=()=>{side.classList.remove('vlens-open');backdrop.classList.remove('vlens-open');toggle.setAttribute('aria-label','فتح القائمة')};
 toggle.addEventListener('click',()=>{const opened=side.classList.toggle('vlens-open');backdrop.classList.toggle('vlens-open',opened);toggle.setAttribute('aria-label',opened?'إغلاق القائمة':'فتح القائمة')});backdrop.addEventListener('click',close);side.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.body.append(toggle,backdrop);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sidebarRefresh);else sidebarRefresh();
})();
