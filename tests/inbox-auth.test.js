const { handleInboxSignIn } = require("../assets/js/inbox-auth.js");

describe("handleInboxSignIn", () => {
    const ownerUserId = "owner-user-id";

    test("reports an invalid password or unauthorized email", async () => {
        const client = {
            auth: {
                signInWithPassword: jest.fn().mockResolvedValue({
                    error: { message: "Invalid login credentials" }
                })
            }
        };

        await expect(
            handleInboxSignIn(client, "owner@example.com", "wrong", ownerUserId)
        ).resolves.toEqual({
            ok: false,
            message: "YOU ARE NOT THE REAL GIIKATOO, NOW GET OUT"
        });
        expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
            email: "owner@example.com",
            password: "wrong"
        });
    });

    test("rejects a signed-in account that is not the owner", async () => {
        const client = {
            auth: {
                signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
                getSession: jest.fn().mockResolvedValue({
                    data: { session: { user: { id: "another-user-id" } } }
                }),
                signOut: jest.fn().mockResolvedValue({ error: null })
            }
        };

        await expect(
            handleInboxSignIn(client, "other@example.com", "password", ownerUserId)
        ).resolves.toEqual({
            ok: false,
            message: "YOU ARE NOT THE REAL GIIKATOO, NOW GET OUT"
        });
        expect(client.auth.signOut).toHaveBeenCalledTimes(1);
    });

    test("accepts the owner account", async () => {
        const client = {
            auth: {
                signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
                getSession: jest.fn().mockResolvedValue({
                    data: { session: { user: { id: ownerUserId } } }
                })
            }
        };

        await expect(
            handleInboxSignIn(client, "owner@example.com", "password", ownerUserId)
        ).resolves.toEqual({ ok: true, message: "" });
    });
});
