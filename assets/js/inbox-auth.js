"use strict";

// Authenticates the owner and rejects other accounts.
async function handleInboxSignIn(client, email, password, ownerUserId) {
    try {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) {
            return {
                ok: false,
                message: "รหัสผ่านไม่ถูกต้อง หรืออีเมลนี้ไม่มีสิทธิ์เข้าถึง"
            };
        }

        const { data: { session } } = await client.auth.getSession();
        if (!session || session.user.id !== ownerUserId) {
            await client.auth.signOut();
            return {
                ok: false,
                message: "อีเมลนี้ไม่มีสิทธิ์เข้าถึง"
            };
        }

        return { ok: true, message: "" };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: "ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่"
        };
    }
}

if (typeof module !== "undefined") {
    module.exports = { handleInboxSignIn };
}
