/* V-Lens backend client — browser-safe publishable key only. */
window.VLensAPI = (() => {
  const url = 'https://ochhwmpmnjbifuogpkmu.supabase.co';
  const key = 'sb_publishable_SAPZ0EARqPyMIRXeJqm-9A_Ktf_AdaA';
  const token = () => localStorage.getItem('vlens_access_token') || '';
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
  async function signIn(email,password){
    const data=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});
    localStorage.setItem('vlens_access_token',data.access_token);
    localStorage.setItem('vlens_refresh_token',data.refresh_token);
    sessionStorage.setItem('vlens_demo','1');
    return data;
  }
  function signOut(){localStorage.removeItem('vlens_access_token');localStorage.removeItem('vlens_refresh_token');sessionStorage.removeItem('vlens_demo')}
  const listJobs=()=>request('/rest/v1/jobs?select=*&order=created_at.desc');
  const createJob=(job)=>request('/rest/v1/jobs',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(job)});
  const listCandidates=()=>request('/rest/v1/candidates?select=*&order=created_at.desc');
  const listApplications=()=>request('/rest/v1/applications?select=*&order=applied_at.desc');
  const listInterviews=()=>request('/rest/v1/interviews?select=*&order=scheduled_at.asc');
  const listOffers=()=>request('/rest/v1/offers?select=*&order=created_at.desc');
  return {signIn,signOut,listJobs,createJob,listCandidates,listApplications,listInterviews,listOffers,request,isAuthenticated:()=>!!token()};
})();