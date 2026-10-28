"use strict";

// Authenticates the owner and rejects other accounts.
async function handleInboxSignIn(client, email, password, ownerUserId) {
    try {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) {
            return {
                ok: false,
                message: "YOU ARE NOT THE REAL GIIKATOO, NOW GET OUT👹👹👹"
            };
        }

        const { data: { session } } = await client.auth.getSession();
        if (!session || session.user.id !== ownerUserId) {
            await client.auth.signOut();
            return {
                ok: false,
                message: "YOU ARE NOT THE REAL GIIKATOO, NOW GET OUT👹👹👹"
            };
        }

        return { ok: true, message: "" };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: "YOU ARE NOT THE REAL GIIKATOO, NOW GET OUT👹👹👹"
        };
    }
}

if (typeof module !== "undefined") {
    module.exports = { handleInboxSignIn };
}
