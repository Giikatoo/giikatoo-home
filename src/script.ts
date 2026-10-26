// กำหนดโครงสร้างข้อมูล (Interface) แบบ TypeScript
interface UserProfile {
    name: string;
    role: string;
    level: number;
}

// สร้างข้อมูลจำลองโดยอิงตาม Interface
const myProfile: UserProfile = {
    name: "นักพัฒนาหน้าใหม่",
    role: "Frontend Developer",
    level: 1
};

// ดึง HTML Element มาใช้งาน พร้อมระบุ Type ชัดเจน
const greetingElement = document.getElementById("greeting") as HTMLHeadingElement;
const actionBtn = document.getElementById("actionBtn") as HTMLButtonElement;

// แสดงผลข้อความบนหน้าเว็บ
if (greetingElement) {
    greetingElement.textContent = `ยินดีต้อนรับคุณ ${myProfile.name} (${myProfile.role}) สู่โลก TypeScript! 🚀`;
}

// เพิ่ม Event ฟังเสียงคลิกปุ่ม
actionBtn?.addEventListener("click", () => {
    alert(`ยินดีด้วย! คุณคลิกปุ่มสำเร็จ (Level: ${myProfile.level})`);
});