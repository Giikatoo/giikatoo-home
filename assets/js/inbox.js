"use strict";

const supabaseUrl = "https://xnhueaghtrwyjamxjtcf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuaHVlYWdodHJ3eWphbXhqdGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMTg5MjMsImV4cCI6MjEwODU5NDkyM30.G1J1k5LnzfbbEk1CauX5iNE568BMXiOPvJf4cCAL-HM";
const ownerUserId = "e8715b3f-3d3b-468d-b02f-aa6c94c54ebb";

const loginPanel = document.getElementById("login-panel");
const lettersPanel = document.getElementById("letters-panel");
const loginForm = document.getElementById("login-form");
const signOutButton = document.getElementById("sign-out");
const refreshButton = document.getElementById("refresh-letters");
const lettersList = document.getElementById("letters-list");
const status = document.getElementById("inbox-status");

if (!(loginPanel instanceof HTMLElement) ||
    !(lettersPanel instanceof HTMLElement) ||
    !(loginForm instanceof HTMLFormElement) ||
    !(signOutButton instanceof HTMLButtonElement) ||
    !(refreshButton instanceof HTMLButtonElement) ||
    !(lettersList instanceof HTMLDivElement) ||
    !(status instanceof HTMLParagraphElement)) {
    throw new Error("The inbox is missing a required element.");
}

function showStatus(message, isError) {
    status.textContent = message;
    status.className = isError ? "inbox-status error" : "inbox-status";
}

function showLogin() {
    loginPanel.hidden = false;
    lettersPanel.hidden = true;
    signOutButton.hidden = true;
}

function showInbox() {
    loginPanel.hidden = true;
    lettersPanel.hidden = false;
    signOutButton.hidden = false;
}

function formatDate(value) {
    return new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

function renderLetters(letters) {
    lettersList.replaceChildren();
    if (letters.length === 0) {
        showStatus("ยังไม่มีข้อความ", false);
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
        readButton.addEventListener("click", () => updateLetter(letter, { is_read: !letter.is_read }));

        const archiveButton = document.createElement("button");
        archiveButton.className = "inbox-button secondary";
        archiveButton.type = "button";
        archiveButton.textContent = "Archive";
        archiveButton.addEventListener("click", () => updateLetter(letter, { is_archived: true }));

        const deleteButton = document.createElement("button");
        deleteButton.className = "inbox-button danger";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteLetter(letter.id));

        actions.append(readButton, archiveButton, deleteButton);
        article.append(meta, message, actions);
        lettersList.append(article);
    }
}

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

async function loadLetters() {
    showStatus("Loading...", false);
    const { data, error } = await client
        .from("letters")
        .select("id, message, created_at, is_read, is_archived, recipient_id")
        .eq("recipient_id", ownerUserId)
        .eq("is_archived", false)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }
    renderLetters(data || []);
}

async function updateLetter(letter, changes) {
    const { error } = await client.from("letters").update(changes).eq("id", letter.id);
    if (error) {
        showStatus("ไม่สามารถอัปเดตข้อความได้", true);
        console.error(error);
        return;
    }
    await loadLetters();
}

async function deleteLetter(id) {
    if (!window.confirm("Delete this message?")) {
        return;
    }
    const { error } = await client.from("letters").delete().eq("id", id);
    if (error) {
        showStatus("ไม่สามารถลบข้อความได้", true);
        console.error(error);
        return;
    }
    await loadLetters();
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    if (!(email instanceof HTMLInputElement) || !(password instanceof HTMLInputElement)) {
        return;
    }

    const { error } = await client.auth.signInWithPassword({
        email: email.value,
        password: password.value
    });
    if (error) {
        showStatus("เข้าสู่ระบบไม่สำเร็จ", true);
        return;
    }
    await startInbox();
});

signOutButton.addEventListener("click", async () => {
    await client.auth.signOut();
    showLogin();
});

refreshButton.addEventListener("click", () => loadLetters().catch((error) => {
    showStatus("ไม่สามารถโหลดข้อความได้", true);
    console.error(error);
}));

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

getClient()
    .then((configuredClient) => {
        client = configuredClient;
        return startInbox();
    })
    .catch((error) => {
        showStatus("ยังไม่ได้ตั้งค่า Supabase inbox", true);
        console.error(error);
    });
