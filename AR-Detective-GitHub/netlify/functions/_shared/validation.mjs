import AR_DEFAULT_BANK from './default-bank.json' with {type:'json'};
const arClone=v=>JSON.parse(JSON.stringify(v));
const arNormalize=v=>v.normalize('NFC').replace(/\s+/g,' ').trim();
function arValidateBank(bank){
  if(!Array.isArray(bank)||bank.length!==8)throw Error('ต้องมีแฟ้มคดีครบ 8 แฟ้ม');
  const seen=new Map();
  bank.forEach((w,wi)=>{
    if(!w||!Array.isArray(w.levels)||w.levels.length!==6)throw Error(`แฟ้ม ${wi+1} ต้องมี 6 ด่าน`);
    w.levels.forEach((l,li)=>{
      const where=`แฟ้ม ${wi+1} ด่าน ${li+1}`;
      if(!l||!Array.isArray(l.questions)||l.questions.length!==5)throw Error(`${where} ต้องมีข้อสอบ 5 ข้อ`);
      l.questions.forEach((q,qi)=>{
        const at=`${where} ข้อ ${qi+1}`;
        if(!q||typeof q.story!=='string'||!q.story.trim()||q.story.length>3000)throw Error(`${at}: บทอ่านต้องมี 1–3,000 ตัวอักษร`);
        if(typeof q.question!=='string'||!q.question.trim()||q.question.length>300)throw Error(`${at}: คำถามต้องมี 1–300 ตัวอักษร`);
        if(!Array.isArray(q.answers)||q.answers.length!==4||q.answers.some(a=>typeof a!=='string'||!a.trim()||a.length>500))throw Error(`${at}: กรอกตัวเลือกให้ครบ 4 ข้อ (ไม่เกิน 500 ตัวอักษรต่อข้อ)`);
        if(new Set(q.answers.map(arNormalize)).size!==4)throw Error(`${at}: ตัวเลือกซ้ำกัน`);
        if(!Number.isInteger(q.correct)||q.correct<0||q.correct>3)throw Error(`${at}: เลือกเฉลย A–D ให้ถูกต้อง`);
        const key=arNormalize(q.question).replace(/[\s\p{P}\p{S}]/gu,'').toLocaleLowerCase('th');
        if(seen.has(key))throw Error(`${at}: คำถามซ้ำกับ${seen.get(key)} กรุณาเปลี่ยนคำถามให้ถามถึงเหตุการณ์เฉพาะของด่านนี้`);
        seen.set(key,at);
      });
    });
  });
  return true;
}
function arCleanBank(bank){
  arValidateBank(bank);
  return AR_DEFAULT_BANK.map((w,wi)=>({...arClone(w),levels:w.levels.map((l,li)=>({...arClone(l),questions:bank[wi].levels[li].questions.map((q,qi)=>({id:`case-${wi+1}-level-${li+1}-q-${qi+1}`,story:q.story.trim(),question:q.question.trim(),answers:q.answers.map(a=>a.trim()),correct:q.correct,evidence:'📄'}))}))}));
}

export { arCleanBank as cleanBank };
