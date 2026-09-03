# AR Detective : คดีลับจับใจความ

ชุดสำหรับอัปโหลดไฟล์เข้า GitHub แล้วเชื่อม Netlify

## อัปโหลดเข้า GitHub

1. แตก ZIP นี้ก่อน อย่าอัปโหลด ZIP ทั้งก้อน
2. เปิดโฟลเดอร์ AR-Detective-GitHub จะเห็น client, netlify, test, package.json, build.mjs และ netlify.toml
3. ในหน้าโครงการ GitHub เลือก Add file → Upload files
4. เลือกไฟล์และโฟลเดอร์ทั้งหมดภายใน AR-Detective-GitHub แล้วลากไปวาง รวมทั้งโฟลเดอร์ client และ netlify
5. กด Commit changes เพื่อบันทึก
6. หน้าแรกของโครงการ GitHub ต้องเห็น package.json และ netlify.toml ทันที โดยไม่ต้องคลิกเข้าโฟลเดอร์เพิ่ม

## เชื่อม Netlify

เลือกสร้างเว็บไซต์จาก GitHub แล้วเลือกโครงการนี้
หากหน้าจอถามค่า ให้ใช้:
- Base directory: เว้นว่าง
- Build command: npm run build
- Publish directory: public
- Functions directory: netlify/functions

ไฟล์ netlify.toml เตรียมค่าเหล่านี้ไว้แล้ว Netlify จะสร้างโฟลเดอร์ public จากไฟล์ต้นฉบับระหว่างติดตั้ง จึงไม่ต้องแนบ public ใน GitHub

## บัญชีครู

เมื่อติดตั้งเว็บแล้ว ยังต้องเปิด Netlify Identity เชิญบัญชีครู และกำหนดบทบาท teacher ตาม INSTALL-ONLINE.md ก่อนแก้ข้อสอบบนเว็บได้
นี่คือชุดระบบออนไลน์ที่ใช้ Netlify เก็บข้อสอบ ยังไม่ได้เชื่อม Google Sheets

## ขนาดไฟล์

ชุดนี้เก็บภาพแต่ละไฟล์เพียงครั้งเดียว และไม่รวมไฟล์เว็บที่สร้างซ้ำ ทุกไฟล์แยกมีขนาดต่ำกว่า 25 MiB
คงตัวละคร ภาพ PNG เพลง คลังข้อสอบ 240 ข้อ และระบบครูไว้ครบ
ข้อมูลลิมิต: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
