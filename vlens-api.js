/* V-Lens backend client — browser-safe publishable key only. */
window.VLensAPI = (() => {
  const url = 'https://ochhwmpmnjbifuogpkmu.supabase.co';
  const key = 'sb_publishable_SAPZ0EARqPyMIRXeJqm-9A_Ktf_AdaA';
  const token=()=>localStorage.getItem('vlens_access_token')||'';
  const refreshToken=()=>localStorage.getItem('vlens_refresh_token')||'';
  function decodeJwt(t){try{return JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')))}catch(e){return null}}
  function tokenValid(){const p=decodeJwt(token());return !!(p&&p.exp&&p.exp*1000>Date.now()+30000)}
  function clearSession(){localStorage.removeItem('vlens_access_token');localStorage.removeItem('vlens_refresh_token');sessionStorage.removeItem('vlens_demo');sessionStorage.removeItem('vlens_offline_demo')}
  async function refreshSession(){if(!refreshToken())return false;try{const data=await fetch(url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:refreshToken()})}).then(async r=>{if(!r.ok)throw new Error(await r.text());return r.json()});localStorage.setItem('vlens_access_token',data.access_token);if(data.refresh_token)localStorage.setItem('vlens_refresh_token',data.refresh_token);sessionStorage.setItem('vlens_demo','1');return true}catch(e){clearSession();return false}}
  async function ensureSession(){if(tokenValid()){sessionStorage.setItem('vlens_demo','1');return true}return refreshSession()}
  async function requireAuth(){if(sessionStorage.getItem('vlens_offline_demo')==='1')return true;const ok=await ensureSession();if(!ok){location.replace('login.html');return false}return true}
  async function request(path, options = {}) {
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
  async function signUp(email,password,fullName){const data=await request('/auth/v1/signup',{method:'POST',body:JSON.stringify({email,password,data:{full_name:fullName||''}})});if(data.access_token){localStorage.setItem('vlens_access_token',data.access_token);localStorage.setItem('vlens_refresh_token',data.refresh_token);sessionStorage.setItem('vlens_demo','1')}return data}
  async function bootstrapProfile(){return request('/rest/v1/rpc/bootstrap_admin',{method:'POST',body:'{}'})}
  async function signIn(email,password){
    const data=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});
    localStorage.setItem('vlens_access_token',data.access_token);
    localStorage.setItem('vlens_refresh_token',data.refresh_token);
    sessionStorage.setItem('vlens_demo','1');
    try{await bootstrapProfile()}catch(e){}
    return data;
  }
  function signOut(){clearSession();location.replace('login.html')}
  const listJobs=()=>request('/rest/v1/jobs?select=*&order=created_at.desc');
  const createJob=(job)=>request('/rest/v1/jobs',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(job)});
  const listCandidates=()=>request('/rest/v1/candidates?select=*&order=created_at.desc');
  const listApplications=()=>request('/rest/v1/applications?select=*&order=applied_at.desc');
  const listInterviews=()=>request('/rest/v1/interviews?select=*&order=scheduled_at.asc');
  const listOffers=()=>request('/rest/v1/offers?select=*&order=created_at.desc');
  return {signUp,signIn,signOut,bootstrapProfile,ensureSession,requireAuth,clearSession,listJobs,createJob,listCandidates,listApplications,listInterviews,listOffers,request,isAuthenticated:()=>!!token()};
})();