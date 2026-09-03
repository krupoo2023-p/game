export function createBankHandler({getUser,getStore,validate,defaults,uuid=()=>crypto.randomUUID(),now=()=>new Date().toISOString()}){
  const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','Netlify-CDN-Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
  return async function(request){
    try{
      if(!['GET','PUT'].includes(request.method))return reply({error:'ไม่รองรับคำขอนี้'},405);
      if(request.method==='PUT'){
        if(request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'คำขอไม่ได้มาจากเว็บไซต์นี้'},403);
        const user=await getUser();
        if(!user)return reply({error:'กรุณาเข้าสู่ระบบครู'},401);
        if(!user.roles?.includes('teacher'))return reply({error:'บัญชีนี้ไม่มีสิทธิ์เผยแพร่ข้อสอบ'},403);
        if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'ต้องส่งข้อมูลข้อสอบแบบ JSON'},415);
        if(Number(request.headers.get('content-length'))>2500000)return reply({error:'ข้อมูลมีขนาดใหญ่เกินไป'},413);
        const raw=await request.text();if(raw.length>2500000)return reply({error:'ข้อมูลมีขนาดใหญ่เกินไป'},413);
        let input;try{input=JSON.parse(raw);}catch{return reply({error:'อ่านข้อมูลข้อสอบไม่ได้'},400);}
        let worlds;try{worlds=validate(input.worlds);}catch(error){return reply({error:error.message},400);}
        const store=getStore(),current=await store.getWithMetadata('published',{type:'json'});
        const revision=current?.data.revision||'initial-v1';
        if(input.baseRevision!==revision)return reply({error:'มีการเผยแพร่ชุดใหม่จากอีกหน้าจอแล้ว สำรองข้อสอบที่แก้ไว้ แล้วรีเฟรชก่อนแก้ไขต่อ'},409);
        const published={revision:uuid(),updatedAt:now(),worlds};
        const result=await store.setJSON('published',published,current?{onlyIfMatch:current.etag}:{onlyIfNew:true});
        if(!result.modified)return reply({error:'มีการเผยแพร่พร้อมกัน กรุณารีเฟรชก่อนเผยแพร่อีกครั้ง'},409);
        return reply({revision:published.revision,updatedAt:published.updatedAt});
      }
      const stored=await getStore().get('published',{type:'json'});
      return reply(stored||{revision:'initial-v1',updatedAt:null,worlds:defaults});
    }catch(error){console.error('Question bank service:',error?.name);return reply({error:'เชื่อมต่อคลังข้อสอบไม่ได้ กรุณาลองอีกครั้ง'},503);}
  };
}
