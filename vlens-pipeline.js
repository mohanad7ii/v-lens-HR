(function(){
  const PREFIX='vlens_candidate_status_';
  function importedCount(){
    try{const a=JSON.parse(localStorage.getItem('vlens_demo_candidates')||'[]');return Array.isArray(a)?a.length:0}catch(e){return 0}
  }
  function ids(){
    const out=Array.from({length:100},(_,i)=>String(i+1));
    for(let i=1;i<=importedCount();i++)out.push('demo-'+i);
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(k&&k.startsWith(PREFIX)){const id=k.slice(PREFIX.length);if(id&&!out.includes(id))out.push(id)}
    }
    return out;
  }
  function get(id){
    try{return JSON.parse(localStorage.getItem(PREFIX+id)||'null')}catch(e){return null}
  }
  function counts(){
    const c={review:0,short:0,interview:0,offer:0,hired:0,rejected:0,total:0};
    ids().forEach(id=>{const r=get(id),s=r&&c[r.status]!==undefined?r.status:'review';c[s]++;c.total++});
    return c;
  }
  function set(id,status,meta){
    const rec=Object.assign({status,updated:new Date().toLocaleString('ar-SA')},meta||{});
    localStorage.setItem(PREFIX+id,JSON.stringify(rec));
    const job=(meta&&meta.job)||localStorage.getItem('vlens_candidate_job_'+id);
    if(job){
      localStorage.setItem('vlens_candidate_job_'+id,job);
      const key='vlens_job_pipeline_'+encodeURIComponent(job);let p={};
      try{p=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
      p[id]=status;localStorage.setItem(key,JSON.stringify(p));
    }
    window.dispatchEvent(new CustomEvent('vlens:pipeline',{detail:{id,status,record:rec}}));
    return rec;
  }
  window.VLensPipeline={ids,get,counts,set};
})();