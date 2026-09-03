import {login,logout,getUser,handleAuthCallback,acceptInvite,updateUser,requestPasswordRecovery} from '@netlify/identity';

const overlay=document.createElement('div');overlay.className='online-gate';overlay.id='online-loading';
overlay.innerHTML='<div class="online-card"><h2>กำลังเปิดแฟ้มคดี</h2><p id="online-load-message">กำลังโหลดข้อสอบล่าสุดจากครู…</p><button id="online-retry" hidden>ลองอีกครั้ง</button></div>';
document.body.append(overlay);document.getElementById('online-retry').onclick=()=>location.reload();
const dialog=document.createElement('dialog');dialog.id='online-auth';dialog.innerHTML=`<form id="online-auth-form"><h2 id="online-auth-title">เข้าสู่ระบบครู</h2><p id="online-auth-note">เฉพาะบัญชีที่ได้รับเชิญและมีสิทธิ์ครู</p><label id="online-email-label">อีเมล<input id="online-email" type="email" autocomplete="username" required></label><label>รหัสผ่าน<input id="online-password" type="password" autocomplete="current-password" required></label><p id="online-auth-error" role="status"></p><div class="online-actions"><button id="online-auth-submit" type="submit">เข้าสู่ระบบ</button><button id="online-forgot" type="button">ลืมรหัสผ่าน</button><button id="online-auth-close" type="button">ปิด</button></div></form>`;
document.body.append(dialog);
let authMode='login',inviteToken=null,started=false;
const $=id=>document.getElementById(id);
function showAuth(mode='login',token=null){
  authMode=mode;inviteToken=token;$('online-auth-error').textContent='';$('online-password').value='';
  const setting=mode!=='login';$('online-email-label').hidden=setting;$('online-email').required=!setting;$('online-password').autocomplete=setting?'new-password':'current-password';$('online-password').minLength=setting?10:1;
  $('online-auth-title').textContent=setting?'ตั้งรหัสผ่านบัญชีครู':'เข้าสู่ระบบครู';$('online-auth-submit').textContent=setting?'บันทึกรหัสผ่าน':'เข้าสู่ระบบ';$('online-auth-note').textContent=setting?'ตั้งรหัสผ่านอย่างน้อย 10 ตัวอักษร':'เฉพาะบัญชีที่ได้รับเชิญและมีสิทธิ์ครู';$('online-forgot').hidden=setting;if(!dialog.open)dialog.showModal();
}
$('online-auth-close').onclick=()=>dialog.close();
$('online-auth-form').onsubmit=async event=>{
  event.preventDefault();const submit=$('online-auth-submit');submit.disabled=true;$('online-auth-error').textContent='กำลังดำเนินการ…';
  try{
    if(authMode==='invite')await acceptInvite(inviteToken,$('online-password').value);
    else if(authMode==='recovery')await updateUser({password:$('online-password').value});
    else await login($('online-email').value.trim(),$('online-password').value);
    $('online-password').value='';dialog.close();await window.openTeacherSettings();
  }catch{$('online-auth-error').textContent='เข้าสู่ระบบหรือตั้งรหัสผ่านไม่สำเร็จ ตรวจอีเมล รหัสผ่าน และลิงก์เชิญแล้วลองใหม่';}finally{submit.disabled=false;}
};
$('online-forgot').onclick=async()=>{const email=$('online-email').value.trim();if(!email){$('online-auth-error').textContent='กรอกอีเมลบัญชีครูก่อน';return;}try{await requestPasswordRecovery(email);$('online-auth-error').textContent='หากมีบัญชีนี้ ระบบจะส่งลิงก์ตั้งรหัสผ่านไปที่อีเมล';}catch{$('online-auth-error').textContent='ส่งคำขอไม่สำเร็จ กรุณาลองใหม่';}};
async function api(path,options={}){
  const response=await fetch(path,{credentials:'same-origin',cache:'no-store',...options});
  const type=response.headers.get('content-type')||'';
  if(!type.includes('application/json'))throw Error('เว็บยังไม่ได้ติดตั้งระบบข้อสอบออนไลน์ครบถ้วน');
  const data=await response.json();if(!response.ok)throw Error(data.error||'เชื่อมต่อไม่สำเร็จ');return data;
}
window.AROnline={
  bank:null,
  async requireTeacher(){
    await getUser();const user=await api('/api/teacher-session');
    if(user.teacher)return true;
    showAuth();if(user.authenticated)$('online-auth-error').textContent='บัญชีนี้ยังไม่มีสิทธิ์ครู กรุณาให้เจ้าของเว็บกำหนดบทบาท teacher';return false;
  },
  async publish(worlds,baseRevision){await getUser();return api('/api/question-bank',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({worlds,baseRevision})});},
  async signOut(){await logout();location.reload();}
};
async function start(){
  try{
    const bank=await api('/api/question-bank');
    if(!bank||typeof bank.revision!=='string'||!Array.isArray(bank.worlds)||bank.worlds.length!==8)throw Error('คลังข้อสอบตอบกลับไม่ครบถ้วน');
    window.AROnline.bank=bank;
    for(const source of [...document.querySelectorAll('script[type="application/x-ar-game"]')]){const active=document.createElement('script');active.textContent=source.textContent;document.body.append(active);}
    started=true;overlay.remove();
    const callback=await handleAuthCallback();
    if(callback?.type==='invite')showAuth('invite',callback.token);
    else if(callback?.type==='recovery')showAuth('recovery');
    else if(location.pathname==='/admin')await window.openTeacherSettings();
  }catch(error){
    if(started){showAuth();$('online-auth-error').textContent='ลิงก์เข้าสู่ระบบไม่พร้อมใช้งาน กรุณาขอลิงก์ใหม่';}
    else{$('online-load-message').textContent=error.message+' — กรุณาลองใหม่เพื่อรับข้อสอบล่าสุด';$('online-retry').hidden=false;}
  }
}
start();
