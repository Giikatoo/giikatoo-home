"use strict";
// สร้างข้อมูลจำลองโดยอิงตาม Interface
const myProfile = {
    name: "นักพัฒนาหน้าใหม่",
    role: "Frontend Developer",
    level: 1
};
// ดึง HTML Element มาใช้งาน พร้อมระบุ Type ชัดเจน
const greetingElement = document.getElementById("greeting");
const actionBtn = document.getElementById("actionBtn");
// แสดงผลข้อความบนหน้าเว็บ
if (greetingElement) {
    greetingElement.textContent = `ยินดีต้อนรับคุณ ${myProfile.name} (${myProfile.role}) สู่โลก TypeScript! 🚀`;
}
// เพิ่ม Event ฟังเสียงคลิกปุ่ม
actionBtn?.addEventListener("click", () => {
    alert(`ยินดีด้วย! คุณคลิกปุ่มสำเร็จ (Level: ${myProfile.level})`);
});
