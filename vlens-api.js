/* V-Lens backend client — browser-safe publishable key only. */
window.VLensAPI = (() => {
  const url = 'https://ochhwmpmnjbifuogpkmu.supabase.co';
  const key = 'sb_publishable_SAPZ0EARqPyMIRXeJqm-9A_Ktf_AdaA';
  const token=()=>localStorage.getItem('vlens_access_token')||'';
  const refreshToken=()=>localStorage.getItem('vlens_refresh_token')||'';
  const userId=()=>{const p=decodeJwt(token());return p&&p.sub||null};
  function decodeJwt(t){try{return JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')))}catch(e){return null}}
  function tokenValid(){const p=decodeJwt(token());return !!(p&&p.exp&&p.exp*1000>Date.now()+30000)}
  function clearSession(){localStorage.removeItem('vlens_access_token');localStorage.removeItem('vlens_refresh_token');sessionStorage.removeItem('vlens_demo');sessionStorage.removeItem('vlens_offline_demo')}
  async function refreshSession(){if(!refreshToken())return false;try{const data=await fetch(url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:refreshToken()})}).then(async r=>{if(!r.ok)throw new Error(await r.text());return r.json()});localStorage.setItem('vlens_access_token',data.access_token);if(data.refresh_token)localStorage.setItem('vlens_refresh_token',data.refresh_token);sessionStorage.setItem('vlens_demo','1');return true}catch(e){clearSession();return false}}
  async function ensureSession(){if(tokenValid()){sessionStorage.setItem('vlens_demo','1');return true}return refreshSession()}
  async function requireAuth(){if(sessionStorage.getItem('vlens_offline_demo')==='1')return true;const ok=await ensureSession();if(!ok){location.replace('login.html');return false}return true}
  async function request(path, options = {}) {
    if(path.startsWith('/rest/')||path.startsWith('/storage/')||path.startsWith('/functions/')){if(!(await ensureSession()))throw new Error('Authentication required')}
    const headers = Object.assign({
      apikey: key,
      Authorization: 'Bearer ' + (token() || key),
      'Content-Type': 'application/json'
    }, options.headers || {});
    const res = await fetch(url + path, Object.assign({}, options, {headers}));
    if (!res.ok) throw new Error((await res.text()) || ('HTTP ' + res.status));
    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }
  async function signUp(email,password,fullName){
    const res=await fetch(url+'/auth/v1/signup',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email,password,data:{full_name:fullName||''},gotrue_meta_security:{},redirect_to:'https://mohanad7ii.github.io/v-lens-HR/auth-callback.html'})});
    const data=await res.json().catch(()=>({}));
    if(!res.ok){const msg=data.msg||data.message||data.error_description||data.error||('HTTP '+res.status);const err=new Error(msg);err.status=res.status;throw err}
    if(data.access_token){localStorage.setItem('vlens_access_token',data.access_token);localStorage.setItem('vlens_refresh_token',data.refresh_token);sessionStorage.setItem('vlens_demo','1');try{await bootstrapProfile()}catch(e){}}
    return data
  }
  function consumeAuthCallback(){const p=new URLSearchParams(location.hash.slice(1));const access=p.get('access_token'),refresh=p.get('refresh_token'),type=p.get('type')||'';if(!access)return false;localStorage.setItem('vlens_access_token',access);if(refresh)localStorage.setItem('vlens_refresh_token',refresh);sessionStorage.setItem('vlens_demo','1');sessionStorage.setItem('vlens_auth_callback_type',type);history.replaceState(null,'',location.pathname);return true}
  async function bootstrapProfile(){return request('/rest/v1/rpc/bootstrap_admin',{method:'POST',body:'{}'})}
  async function updatePassword(password){if(!(await ensureSession()))throw new Error('Authentication required');if(!password||password.length<8)throw new Error('Password must be at least 8 characters');return request('/auth/v1/user',{method:'PUT',body:JSON.stringify({password})})}
  async function signIn(email,password){
    const data=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});
    localStorage.setItem('vlens_access_token',data.access_token);
    localStorage.setItem('vlens_refresh_token',data.refresh_token);
    sessionStorage.setItem('vlens_demo','1');
    try{await bootstrapProfile()}catch(e){}
    return data;
  }
  function signOut(){clearSession();location.replace('login.html')}
  async function uploadCV(file){
    if(!(await ensureSession()))throw new Error('Authentication required');
    const uid=(decodeJwt(token())||{}).sub;if(!uid)throw new Error('Authentication required');
    const ext=(file.name.split('.').pop()||'pdf').toLowerCase();
    const base=file.name.replace(/\.[^.]+$/,'').replace(/[^a-zA-Z0-9_-]+/g,'-').slice(0,50)||'cv';
    const path=uid+'/'+Date.now()+'-'+base+'.'+ext;
    const res=await fetch(url+'/storage/v1/object/candidate-cvs/'+encodeURI(path),{method:'POST',headers:{apikey:key,Authorization:'Bearer '+token(),'Content-Type':file.type||'application/octet-stream','x-upsert':'false'},body:file});
    if(!res.ok)throw new Error((await res.text())||('Upload failed '+res.status));
    return {path,name:file.name,size:file.size,type:file.type};
  }
  async function createCandidateFromCV(fileInfo, parsed={}){
    const companyId=await requireCreateRole();
    const fallback=(fileInfo.name||'مرشح').replace(/\.(pdf|docx?|PDF|DOCX?)$/,'').replace(/[_-]+/g,' ').trim();
    const payload={
      full_name:parsed.full_name||fallback||'مرشح جديد',
      email:parsed.email||null, phone:parsed.phone||null,
      headline:parsed.headline||'مرشح من سيرة ذاتية',
      education:parsed.education||null,
      experience_years:Number(parsed.experience_years)||0,
      skills:Array.isArray(parsed.skills)?parsed.skills:[],
      languages:Array.isArray(parsed.languages)?parsed.languages:[],
      certifications:Array.isArray(parsed.certifications)?parsed.certifications:[],
      source:'cv_upload', cv_path:fileInfo.path, cv_text:parsed.cv_text||null
    };
    const rows=await request('/rest/v1/candidates',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});
    return Array.isArray(rows)?rows[0]:rows;
  }
  async function parseCV(candidateId){
    if(!(await ensureSession()))throw new Error('Authentication required');
    const res=await fetch(url+'/functions/v1/parse-cv',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+token(),'Content-Type':'application/json'},body:JSON.stringify({candidate_id:candidateId})});
    const data=await res.json().catch(()=>({}));
    if(!res.ok)throw new Error(data.error||('CV parsing failed '+res.status));
    return data;
  }
  async function inviteTeamMember(name,email,role){if(!(await ensureSession()))throw new Error('Authentication required');const res=await fetch(url+'/functions/v1/invite-team-member',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+token(),'Content-Type':'application/json'},body:JSON.stringify({name,email,role})});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.error||('Invite failed '+res.status));return data}
  async function calculateMatch(candidateId,jobId){return request('/rest/v1/rpc/calculate_match_score',{method:'POST',body:JSON.stringify({p_candidate_id:candidateId,p_job_id:jobId})})}
  async function scoreApplication(applicationId){return request('/rest/v1/rpc/score_application',{method:'POST',body:JSON.stringify({p_application_id:applicationId})})}
  async function getMyProfile(){const u=userId();if(!u)return null;const rows=await request('/rest/v1/profiles?id=eq.'+encodeURIComponent(u)+'&select=id,full_name,role,is_active,company_id&limit=1');return rows&&rows[0]||null}
  async function requireCompany(){const p=await getMyProfile();if(!p||p.is_active!==true||!p.company_id)throw new Error('Your account must be active and linked to a company before adding records. / يجب تفعيل حسابك وربطه بشركة قبل إضافة السجلات.');return p.company_id}
  async function requireCreateRole(){const p=await getMyProfile();if(!p||p.is_active!==true||!p.company_id)throw new Error('يجب تفعيل الحساب وربطه بشركة قبل إضافة السجلات. / Active company membership required.');if(!['admin','recruiter'].includes(p.role))throw new Error('ليس لديك صلاحية إنشاء هذا السجل. / Permission denied.');return p.company_id}
  async function getPermissions(){const p=await getMyProfile();const role=p&&p.is_active!==false&&p.role?p.role:'viewer';return {profile:p,role,canManageJobs:['admin','recruiter'].includes(role),canManageCandidates:['admin','recruiter'].includes(role),canEvaluate:['admin','recruiter','manager'].includes(role),canManageOffers:['admin','recruiter','manager'].includes(role),canDelete:role==='admin',canManageTeam:role==='admin'}}
  const listJobs=()=>request('/rest/v1/jobs?select=*&order=created_at.desc');
  const createJob=async(job)=>{const companyId=await requireCreateRole();return request('/rest/v1/jobs',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({...job,company_id:companyId})})};
  const listCandidates=()=>request('/rest/v1/candidates?select=*&order=created_at.desc');
  const listApplications=()=>request('/rest/v1/applications?select=*&order=applied_at.desc');
  const listInterviews=()=>request('/rest/v1/interviews?select=*&order=scheduled_at.asc');
  const listOffers=()=>request('/rest/v1/offers?select=*&order=created_at.desc');
  const createInterview=async(interview)=>{const companyId=await requireCreateRole();return request('/rest/v1/interviews',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({...interview,company_id:companyId})})};
  const createOffer=async(offer)=>{const companyId=await requireCreateRole();return request('/rest/v1/offers',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({...offer,company_id:companyId})})};
  return {signUp,signIn,updatePassword,signOut,consumeAuthCallback,bootstrapProfile,ensureSession,requireAuth,clearSession,uploadCV,createCandidateFromCV,parseCV,inviteTeamMember,calculateMatch,scoreApplication,getMyProfile,getPermissions,listJobs,createJob,listCandidates,listApplications,listInterviews,createInterview,listOffers,createOffer,request,userId,isAuthenticated:()=>tokenValid()};
})();
/* Shared demo pipeline state */
window.VLensPipeline=(()=>{
  const labels={review:'قيد المراجعة',short:'قائمة مختصرة',interview:'مقابلة',offer:'عرض وظيفي',hired:'تم التوظيف',rejected:'مستبعد'};
  function imported(){try{const a=JSON.parse(localStorage.getItem('vlens_demo_candidates')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
  function ids(){return Array.from({length:100},(_,i)=>String(i+1)).concat(imported().map((_,i)=>'demo-'+(i+1)))}
  function get(id){try{return JSON.parse(localStorage.getItem('vlens_candidate_status_'+id)||'null')||{status:'review'}}catch(e){return{status:'review'}}}
  function syncJob(id,status,job){job=job||localStorage.getItem('vlens_candidate_job_'+id);if(!job)return;const key='vlens_job_pipeline_'+encodeURIComponent(job);let p={};try{p=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}p[id]=status;localStorage.setItem(key,JSON.stringify(p))}
  function set(id,status,meta={}){const rec={status,updated:new Date().toLocaleString('ar-SA'),...meta};localStorage.setItem('vlens_candidate_status_'+id,JSON.stringify(rec));syncJob(id,status,meta.job);window.dispatchEvent(new CustomEvent('vlens:pipeline',{detail:{id,status,record:rec}}));return rec}
  function counts(){const out={review:0,short:0,interview:0,offer:0,hired:0,rejected:0,total:0};ids().forEach(id=>{const s=get(id).status||'review';if(out[s]===undefined)out.review++;else out[s]++;out.total++});return out}
  return {labels,imported,ids,get,set,counts,syncJob};
})();
