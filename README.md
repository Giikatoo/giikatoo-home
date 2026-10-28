# Giikatoo — personal page

หน้าแนะนำตัวแนวสมุดสเก็ตช์ วางข้อมูลโปรไฟล์และ Social & Contacts ไว้ทางซ้าย และหน้าต่าง Hobby & Interest ไว้ทางขวา ใช้ HTML, CSS และ JavaScript ธรรมดา มีหน้า `compose.html` สำหรับส่งข้อความ anonymous

## เปิดดู

เปิด `index.html` ด้วยเบราว์เซอร์ หรือใช้ส่วนขยาย Live Server ใน VS Code เพื่อดูการเปลี่ยนแปลงระหว่างแก้ไข

## ปรับข้อมูลของตัวเอง

### ชื่อ เพศ และวันเกิด / อายุ

แก้ชื่อและเพศใน `<article class="profile-paper">` ภายใน `index.html` วันเกิดมีสองจุดที่ต้องแก้ให้ตรงกัน:

1. เปลี่ยน `data-birthdate="2006-05-18"` ใน `<span id="age">` โดยใช้รูปแบบ `YYYY-MM-DD`
2. เปลี่ยนวันที่ใน `<time datetime="2006-05-18">18/5/2006</time>` โดยค่า `datetime` ใช้ `YYYY-MM-DD` ส่วนข้อความในแท็กใช้รูปแบบวันที่ที่ต้องการแสดง

`assets/js/script.js` คำนวณอายุเป็นจำนวนปีเต็มจากวันเกิดถึงวันที่เปิดหน้าเว็บ โดยตรวจแล้วว่าวันเกิดปีนี้ผ่านไปหรือยัง ไม่ต้องแก้อายุด้วยตัวเอง

### เปลี่ยน Social & Contacts ให้เป็นลิงก์ของคุณ

ใน `<nav class="social-links">` ให้เปลี่ยนค่า `href` ของแต่ละรายการ:

- Mail: เปลี่ยน `mailto:hello@example.com` เป็นอีเมลของคุณ
- Facebook: เปลี่ยน `https://facebook.com/your-name` เป็น URL โปรไฟล์จริง
- GitHub: เปลี่ยน `https://github.com/your-name`
- X: เปลี่ยน `https://x.com/your-name`
- YouTube: เปลี่ยน `https://youtube.com/@your-name`

ค่าที่ลงท้ายด้วย `your-name` และ `hello@example.com` เป็นตัวอย่างเท่านั้น ตรวจสอบ URL และอีเมลของคุณก่อนเผยแพร่; แต่ละรายการเป็นลิงก์ที่กดได้และแพลตฟอร์มภายนอกจะเปิดแท็บใหม่

ซองจดหมายด้านบนก็เปิดอีเมลเช่นกัน ให้เปลี่ยน `href="mailto:hello@example.com"` ใน `<a class="mail-stamp">` ให้ตรงกับอีเมลจริงด้วย

### แก้ Hobby & Interest และรูปวาด

- แก้รายการใน `<ul>` ภายใน `<div class="window-content">` เพื่อใส่ความสนใจของคุณ
- เปลี่ยนข้อความ `Some of my deep interests` ด้านล่างได้ตามต้องการ
- เปลี่ยนรูปโปรไฟล์ได้ที่ `src` ของ `<img class="profile-img">` ใน `index.html` โดยเก็บรูปไว้ใน `assets/images/` และเขียน path ให้ตรงกับตำแหน่งไฟล์

### เปลี่ยนหน้าตา

แก้ `assets/css/style.css`:

- สีอยู่ที่ตัวแปร `--background`, `--text`, `--accent` และ `--teal` ด้านบนไฟล์ แต่ละสีมีค่าเดียวและนำกลับมาใช้ในทุกส่วน
- `.profile-layout` ใช้คอลัมน์สองฝั่งบนจอใหญ่ และเปลี่ยนเป็นคอลัมน์เดียวเมื่อหน้าจอกว้างไม่เกิน `700px`
- `.profile-img` ปรับความมนของมุมรูปได้ที่ `border-radius` และขนาดรูปเปลี่ยนตาม breakpoint
- `@media (max-width: 700px)` และ `@media (max-width: 380px)` ใช้จัดวางสำหรับมือถือและมือถือจอเล็ก
- ระยะระหว่างรูปกับข้อมูลโปรไฟล์ปรับด้วย `--profile-top-gap`
- ระยะเลื่อนหน้าต่าง Hobby & Interest ขึ้น/ลง ปรับด้วย `--hobby-top-offset`; ค่า `0px` คือไม่เลื่อน
- ตำแหน่ง Socials & Contacts จากขอบซ้ายของคอลัมน์ปรับด้วย `--social-indent`
- `.profile-paper`, `.social-links` และ `.desktop-window` ใช้ปรับหน้าตาแต่ละส่วน
- ลิงก์ Social ใช้ตัวอักษรขนาด 18px ตัวหนา และมีเส้นใต้เพื่อให้เห็นว่ากดได้; ปรับรูปแบบได้ที่ `.social-links a`

## Anonymous letters และ Supabase

ไอคอนซองจดหมายด้านบนเป็นลิงก์ไป [compose.html](./compose.html) โดยพื้นที่กดจำกัดอยู่ที่ไอคอน ไม่รวมข้อความกำกับ แบบฟอร์มจะตรวจข้อความและส่งไปยัง Supabase เมื่อใส่ Project URL กับ `anon` key แล้ว

ทำตามขั้นตอนฐานข้อมูล, RLS และการตั้งค่า key ใน [docs/SUPABASE-SETUP.md](./docs/SUPABASE-SETUP.md) ก่อนเปิดใช้จริง หากยังไม่ตั้งค่า หน้าเขียนข้อความจะแจ้งสถานะอย่างชัดเจนและจะไม่ทำทีว่าบันทึกสำเร็จ

## โครงสร้าง

```text
giikatoo-home/
├── index.html             # เนื้อหาโปรไฟล์และลิงก์แพลตฟอร์ม
├── compose.html           # หน้าเขียนข้อความ anonymous
├── inbox.html              # หน้ากล่องจดหมายส่วนตัวของเจ้าของ
├── assets/
│   ├── css/style.css       # รูปแบบหน้าเว็บและ responsive layout
│   ├── images/             # ใส่ภาพของตัวเองได้
│   └── js/                 # คำนวณอายุ ส่งข้อความ และอ่าน inbox
├── docs/SUPABASE-SETUP.md  # วิธีสร้างตารางและ RLS
├── src/script.ts           # ตัวอย่าง TypeScript เก่าที่ยังไม่ได้ใช้
└── docs/FEATURE-PLAN.md    # แนวทางฟีเจอร์สำหรับโปรเจกต์ต่อยอด
```
