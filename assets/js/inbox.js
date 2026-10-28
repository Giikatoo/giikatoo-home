"use strict";

const supabaseUrl = "https://xnhueaghtrwyjamxjtcf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuaHVlYWdodHJ3eWphbXhqdGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMTg5MjMsImV4cCI6MjEwODU5NDkyM30.G1J1k5LnzfbbEk1CauX5iNE568BMXiOPvJf4cCAL-HM";
const ownerUserId = "e8715b3f-3d3b-468d-b02f-aa6c94c54ebb";

const loginPanel = document.getElementById("login-panel");
const loginMailbox = document.getElementById("login-mailbox");
const lettersPanel = document.getElementById("letters-panel");
const loginForm = document.getElementById("login-form");
const signOutButton = document.getElementById("sign-out");
const refreshButton = document.getElementById("refresh-letters");
const lettersList = document.getElementById("letters-list");
const status = document.getElementById("inbox-status");
const loginStatus = document.getElementById("login-status");
const signInHandler = typeof handleInboxSignIn === "function" ? handleInboxSignIn : null;

if (!(loginPanel instanceof HTMLElement) ||
    !(loginMailbox instanceof HTMLElement) ||
    !(lettersPanel instanceof HTMLElement) ||
    !(loginForm instanceof HTMLFormElement) ||
    !(signOutButton instanceof HTMLButtonElement) ||
    !(refreshButton instanceof HTMLButtonElement) ||
    !(lettersList instanceof HTMLDivElement) ||
    !(status instanceof HTMLParagraphElement) ||
    !(loginStatus instanceof HTMLParagraphElement)) {
    throw new Error("The inbox is missing a required element.");
}

// Updates the inbox status message.
function showStatus(message, isError, target = status) {
    target.textContent = message;
    target.className = isError ? "inbox-status error" : "inbox-status";
}

// Shows the owner login form.
function showLogin() {
    loginPanel.hidden = false;
    loginMailbox.hidden = false;
    lettersPanel.hidden = true;
    signOutButton.hidden = true;
}

// Shows the private message list.
function showInbox() {
    loginPanel.hidden = true;
    loginMailbox.hidden = true;
    lettersPanel.hidden = false;
    signOutButton.hidden = false;
}

// Formats a message timestamp.
function formatDate(value) {
    return new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

// Renders messages and their actions.
function renderLetters(letters) {
    lettersList.replaceChildren();
    if (letters.length === 0) {
        showStatus("ยังไม่มีข้อความจ้า", false);
        return;
    }

    showStatus("", false);
    for (const letter of letters) {
        const article = document.createElement("article");
        article.className = `letter${letter.is_read ? "" : " unread"}`;

        const meta = document.createElement("time");
        meta.dateTime = letter.created_at;
        meta.textContent = formatDate(letter.created_at);

        const message = document.createElement("p");
        message.textContent = letter.message;

        const actions = document.createElement("div");
        actions.className = "letter-actions";
        const readButton = document.createElement("button");
        readButton.className = "inbox-button secondary";
        readButton.type = "button";
        readButton.textContent = letter.is_read ? "Mark unread" : "Mark read";
        // Toggles the message read state.
        readButton.addEventListener("click", () => updateLetter(letter, { is_read: !letter.is_read }));

        const deleteButton = document.createElement("button");
        deleteButton.className = "inbox-button danger";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        // Deletes the selected message.
        deleteButton.addEventListener("click", () => deleteLetter(letter.id));

        actions.append(readButton, deleteButton);
        article.append(meta, message, actions);
        lettersList.append(article);
    }
}

// Creates the configured Supabase client.
async function getClient() {
    if (supabaseUrl.includes("YOUR_PROJECT_ID") ||
        supabaseAnonKey.includes("YOUR_SUPABASE_ANON_KEY") ||
        ownerUserId.includes("YOUR_OWNER_USER_ID") ||
        !window.supabase) {
        throw new Error("Supabase inbox is not configured.");
    }
    return window.supabase.createClient(supabaseUrl, supabaseAnonKey);
}

let client;

// Loads the owner's active messages.
async function loadLetters() {
    showStatus("Loading...", false);
    const { data, error } = await client
        .from("letters")
        .select("id, message, created_at, is_read, recipient_id")
        .eq("recipient_id", ownerUserId)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }
    renderLetters(data || []);
}

// Updates a message field.
async function updateLetter(letter, changes) {
    const { error } = await client.from("letters").update(changes).eq("id", letter.id);
    if (error) {
        showStatus("ไม่สามารถอัปเดตข้อความได้", true);
        console.error(error);
        return;
    }
    await loadLetters();
}

// Deletes the selected message.
async function deleteLetter(id) {
    const { error } = await client.from("letters").delete().eq("id", id);
    if (error) {
        showStatus("ไม่สามารถลบข้อความได้", true);
        console.error(error);
        return;
    }
    await loadLetters();
}

// Signs the owner into Supabase.
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    if (!(email instanceof HTMLInputElement) || !(password instanceof HTMLInputElement)) {
        return;
    }

    if (!client || !signInHandler) {
        showStatus("ยังไม่ได้เชื่อมต่อระบบเข้าสู่ระบบ", true, loginStatus);
        return;
    }

    const result = await signInHandler(client, email.value, password.value, ownerUserId);
    if (!result.ok) {
        showStatus(result.message, true, loginStatus);
        return;
    }

    showStatus("", false, loginStatus);
    await startInbox();
});

// Signs the owner out of Supabase.
signOutButton.addEventListener("click", async () => {
    await client.auth.signOut();
    showLogin();
});

// Refreshes the message list.
refreshButton.addEventListener("click", () => loadLetters().catch((error) => {
    showStatus("ไม่สามารถโหลดข้อความได้", true);
    console.error(error);
}));

// Verifies the owner and starts the inbox.
async function startInbox() {
    const { data: { session } } = await client.auth.getSession();
    if (!session || session.user.id !== ownerUserId) {
        await client.auth.signOut();
        showLogin();
        showStatus("บัญชีนี้ไม่มีสิทธิ์เข้าถึง", true);
        return;
    }
    showInbox();
    await loadLetters();
}

// Initializes the private inbox.
getClient()
    // Stores the client and starts the inbox.
    .then((configuredClient) => {
        client = configuredClient;
        return startInbox();
    })
    // Reports initialization errors.
    .catch((error) => {
        showStatus("ยังไม่ได้ตั้งค่า Supabase inbox", true);
        console.error(error);
    });
