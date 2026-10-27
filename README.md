# Giikatoo — personal page

หน้าแนะนำตัวแนวสมุดสเก็ตช์ วางข้อมูลโปรไฟล์และ Social & Contacts ไว้ทางซ้าย และหน้าต่าง Hobby & Interest ไว้ทางขวา ใช้ HTML, CSS และ JavaScript ธรรมดา

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
- รูปตัวการ์ตูนด้านบนเป็น SVG วาดใน HTML; สามารถแก้เส้นในแท็ก `<svg>` หรือแทนด้วยรูปของตัวเอง

### เปลี่ยนหน้าตา

แก้ `assets/css/style.css`:

- สีหลักอยู่ที่ตัวแปร `--paper`, `--ink` และ `--blue` ด้านบนไฟล์
- `@media (max-width: 700px)` และ `@media (max-width: 380px)` กำหนดการจัดวางบนมือถือ
- คลาส `.profile-paper`, `.social-links` และ `.desktop-window` ใช้ปรับส่วนต่าง ๆ ให้ตรงกับชื่อ

## โครงสร้าง

```text
giikatoo-home/
├── index.html             # เนื้อหาโปรไฟล์และลิงก์แพลตฟอร์ม
├── assets/
│   ├── css/style.css       # รูปแบบหน้าเว็บและ responsive layout
│   ├── images/             # ใส่ภาพของตัวเองได้
│   └── js/script.js        # คำนวณอายุจากวันเกิด
├── src/script.ts           # ตัวอย่าง TypeScript เก่าที่ยังไม่ได้ใช้
└── docs/FEATURE-PLAN.md    # แนวทางฟีเจอร์สำหรับโปรเจกต์ต่อยอด
```
