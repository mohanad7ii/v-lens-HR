(function(){
function hide(el){if(el)el.style.display='none'}
function disable(el,title){if(!el)return;el.disabled=true;el.setAttribute('aria-disabled','true');el.title=title||'ليس لديك صلاحية لهذا الإجراء';el.style.opacity='.48';el.style.pointerEvents='none'}
async function apply(){
 if(!window.VLensAPI||!VLensAPI.isAuthenticated())return;
 try{
  const p=await VLensAPI.getPermissions();window.VLensPermissions=p;
  document.documentElement.dataset.role=p.role;
  const deny='ليس لديك صلاحية لهذا الإجراء';
  if(!p.canManageJobs){document.querySelectorAll('a.add[href*="jobs"],button[data-action="add-job"],#addJob,.newJob,.createJob').forEach(x=>disable(x,deny))}
  if(!p.canManageCandidates){document.querySelectorAll('a.add[href*="upload"],button[data-action="upload"],#uploadBtn,.uploadBtn,.addCandidate').forEach(x=>disable(x,deny))}
  if(!p.canEvaluate){document.querySelectorAll('#evalForm button[type="submit"],.evaluation button,.interviewDecision').forEach(x=>disable(x,deny))}
  if(!p.canManageOffers){document.querySelectorAll('.offerAction,#offerForm button[type="submit"],button[onclick*="offer"],button[onclick*="Offer"]').forEach(x=>disable(x,deny))}
  if(!p.canDelete){document.querySelectorAll('.delete,.danger[data-action="delete"],button[onclick*="delete"],button[onclick*="Delete"]').forEach(x=>hide(x))}
  if(!p.canManageTeam){document.querySelectorAll('button[id*="invite"],.invite,.inviteBtn,[data-action="invite"]').forEach(x=>disable(x,deny))}
  document.querySelectorAll('[data-role-label]').forEach(x=>x.textContent=p.role==='admin'?'مدير النظام':p.role==='manager'?'مدير إدارة':'أخصائي توظيف');
 }catch(e){console.warn('Role UI unavailable',e)}
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,80));setTimeout(apply,700);
})();