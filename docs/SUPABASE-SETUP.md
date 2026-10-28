# ตั้งค่า anonymous letters ด้วย Supabase

หน้า `compose.html` เปิดให้ผู้ส่งส่งข้อความได้โดยไม่ต้อง login ส่วนหน้า `inbox.html` ใช้ได้เฉพาะเจ้าของเว็บที่ยืนยันตัวตนด้วย Supabase Auth

## 1. สร้างโปรเจกต์และบัญชีเจ้าของ

1. สร้าง project ใน Supabase
2. เปิด **Authentication > Users** แล้วสร้างบัญชีเจ้าของเว็บด้วยอีเมลและรหัสผ่าน
3. คัดลอก User ID ของบัญชีนี้ไว้ จะใช้แทน `OWNER_USER_ID`
4. ไปที่ **Project Settings > API** แล้วเตรียม Project URL และ `anon` key

ห้ามใช้ `service_role` key ในไฟล์ frontend

## 2. สร้างตารางและ Row Level Security

เปิด **SQL Editor** แล้วแทนที่ `OWNER_USER_ID` ด้วย User ID จริงก่อนรัน:

```sql
create table public.letters (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null default 'OWNER_USER_ID'::uuid references auth.users(id),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now(),
  is_read boolean not null default false,
  is_archived boolean not null default false
);

alter table public.letters enable row level security;

create policy "Anyone can create a letter"
on public.letters
for insert
to anon, authenticated
with check (
  recipient_id = 'OWNER_USER_ID'::uuid
  and char_length(message) between 1 and 500
);

create policy "Only the owner can read letters"
on public.letters
for select
to authenticated
using (auth.uid() = recipient_id);

create policy "Only the owner can update letters"
on public.letters
for update
to authenticated
using (auth.uid() = recipient_id)
with check (auth.uid() = recipient_id);

create policy "Only the owner can delete letters"
on public.letters
for delete
to authenticated
using (auth.uid() = recipient_id);
```

ผู้เยี่ยมชมจึงมีสิทธิ์สร้างจดหมายเท่านั้น ส่วนบัญชีเจ้าของที่ `recipient_id` ตรงกับ User ID จึงอ่านและจัดการได้

## 3. ตั้งค่า public compose

เปิด `assets/js/compose.js` แล้วแทนค่า:

```js
const supabaseUrl = "https://YOUR_PROJECT_ID.supabase.co";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
```

ใช้ Project URL และ `anon` key ของโปรเจกต์ ค่า `anon` key เปิดเผยใน frontend ได้เมื่อ RLS ตั้งถูกต้อง แต่ห้ามใส่ `service_role` key

## 4. ตั้งค่าหน้า inbox ส่วนตัว

เปิด `assets/js/inbox.js` แล้วแทนค่าทั้งสามตัว:

```js
const supabaseUrl = "https://YOUR_PROJECT_ID.supabase.co";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
const ownerUserId = "YOUR_OWNER_USER_ID";
```

ใช้ URL และ `anon key` เดียวกับ `compose.js` ส่วน `ownerUserId` ต้องตรงกับ User ID ที่ใช้แทน `OWNER_USER_ID` ใน SQL

หน้า `inbox.html` ใช้ Supabase Auth แบบ email/password เฉพาะเจ้าของ:

1. เปิด `inbox.html`
2. เข้าสู่ระบบด้วยอีเมลและรหัสผ่านของบัญชีเจ้าของ
3. ระบบตรวจ session และ User ID ก่อนแสดงจดหมาย
4. อ่าน, ทำเครื่องหมายอ่านแล้ว, เก็บถาวร หรือลบจดหมายได้

หน้าสาธารณะและหน้า `compose.html` ไม่มีช่อง login ผู้ส่งยังส่งข้อความได้โดยไม่ต้องมีบัญชี

## 5. ตรวจสอบความปลอดภัย

- เปิด `inbox.html` ในหน้าต่างที่ยังไม่ได้ login ต้องไม่เห็นรายการจดหมาย
- ทดลอง login ด้วยบัญชีอื่นต้องถูกปฏิเสธ
- ผู้เยี่ยมชมต้องส่งจดหมายได้ แต่เรียกอ่านตาราง `letters` ไม่ได้
- อย่าใช้การซ่อน URL, รหัสผ่านใน JavaScript หรือชื่อไฟล์ลับแทน authentication
- อย่า commit password, `service_role` key หรือ secret ใด ๆ

ถ้าไม่ต้องการทำหน้า inbox เอง สามารถเข้า **Supabase Dashboard > Table Editor > letters** ด้วยบัญชีเจ้าของได้เช่นกัน
