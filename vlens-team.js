/* V-Lens shared recruitment team state for demo and UI assignments. */
(function(){
const KEY='vlens_demo_team',ACT='vlens_team_activity';
const defaults=[
{id:'m1',name:'مهند التويجري',role:'admin',title:'مدير النظام',online:true},
{id:'m2',name:'سارة القحطاني',role:'recruiter',title:'أخصائي توظيف',online:true},
{id:'m3',name:'عبدالعزيز المطيري',role:'manager',title:'مدير إدارة',online:true},
{id:'m4',name:'نورة الدوسري',role:'interviewer',title:'مقابل فني',online:true},
{id:'m5',name:'خالد الحربي',role:'interviewer',title:'مقابل فني',online:false},
{id:'m6',name:'ريم الغامدي',role:'coordinator',title:'منسق توظيف',online:false}
];
const perms={admin:['المرشحون','الوظائف','المقابلات','العروض','التقارير','الفريق','الحذف'],recruiter:['المرشحون','الوظائف','المقابلات','العروض','التقارير'],manager:['المقابلات','التقييم','العروض','التقارير'],interviewer:['المقابلات','التقييم'],coordinator:['المرشحون','الجدولة']};
function read(k,f){try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?f:v}catch(e){return f}}
function members(){const x=read(KEY,null);return Array.isArray(x)&&x.length?x:defaults.map(function(v){return Object.assign({},v)})}
function saveMembers(a){localStorage.setItem(KEY,JSON.stringify(a));window.dispatchEvent(new CustomEvent('vlens:team'))}
function log(text,type,memberId){const a=read(ACT,[]);a.unshift({text:text,type:type||'نشاط',memberId:memberId||'',at:new Date().toISOString()});localStorage.setItem(ACT,JSON.stringify(a.slice(0,60)))}
function invite(x){const a=members();x.id=x.id||'m'+Date.now();x.online=false;a.push(x);saveMembers(a);log('تمت دعوة '+x.name,'دعوة عضو',x.id);return x}
function update(id,patch){const a=members(),i=a.findIndex(function(x){return String(x.id)===String(id)});if(i<0)return null;a[i]=Object.assign({},a[i],patch);saveMembers(a);log('تم تحديث '+a[i].name,'تحديث عضو',id);return a[i]}
function jobKey(job){return 'vlens_job_owner_'+encodeURIComponent(job)}
function candidateKey(id){return 'vlens_candidate_owner_'+id}
function assignJob(job,memberId){localStorage.setItem(jobKey(job),memberId);const m=members().find(function(x){return String(x.id)===String(memberId)});log('تم إسناد وظيفة '+job+' إلى '+(m?m.name:'عضو الفريق'),'إسناد وظيفة',memberId);window.dispatchEvent(new CustomEvent('vlens:team'));return m}
function assignCandidate(id,name,memberId){localStorage.setItem(candidateKey(id),memberId);const m=members().find(function(x){return String(x.id)===String(memberId)});log('تم إسناد المرشح '+name+' إلى '+(m?m.name:'عضو الفريق'),'إسناد مرشح',memberId);window.dispatchEvent(new CustomEvent('vlens:team'));return m}
function ownerForJob(job){const id=localStorage.getItem(jobKey(job));return members().find(function(x){return String(x.id)===String(id)})||null}
function ownerForCandidate(id){const mid=localStorage.getItem(candidateKey(id));return members().find(function(x){return String(x.id)===String(mid)})||null}
function activity(){return read(ACT,[])}
function assignmentCounts(){const out={};members().forEach(function(m){out[m.id]={jobs:0,candidates:0}});for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i),mid=localStorage.getItem(k);if(!k||!out[mid])continue;if(k.indexOf('vlens_job_owner_')===0)out[mid].jobs++;if(k.indexOf('vlens_candidate_owner_')===0)out[mid].candidates++}return out}
window.VLensTeam={members:members,saveMembers:saveMembers,invite:invite,update:update,perms:perms,assignJob:assignJob,assignCandidate:assignCandidate,ownerForJob:ownerForJob,ownerForCandidate:ownerForCandidate,activity:activity,assignmentCounts:assignmentCounts,log:log};
})();