"use strict";

const form = document.getElementById("message-form");
const messageInput = document.getElementById("message");
const count = document.getElementById("character-count");
const status = document.getElementById("form-status");

const supabaseUrl = "https://xnhueaghtrwyjamxjtcf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuaHVlYWdodHJ3eWphbXhqdGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMTg5MjMsImV4cCI6MjEwODU5NDkyM30.G1J1k5LnzfbbEk1CauX5iNE568BMXiOPvJf4cCAL-HM";

if (!(form instanceof HTMLFormElement) ||
    !(messageInput instanceof HTMLTextAreaElement) ||
    !(count instanceof HTMLSpanElement) ||
    !(status instanceof HTMLParagraphElement)) {
    throw new Error("The anonymous message form is missing a required element.");
}

// Updates the message character count.
messageInput.addEventListener("input", () => {
    count.textContent = String(messageInput.value.length);
});

// Validates and sends the anonymous message.
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    const message = messageInput.value.trim();

    if (message.length < 3) {
        status.className = "form-status error";
        status.textContent = "Please write at least 3 characters.";
        messageInput.focus();
        return;
    }

    if (supabaseUrl.includes("YOUR_PROJECT_ID") || supabaseAnonKey.includes("YOUR_SUPABASE_ANON_KEY")) {
        status.className = "form-status error";
        status.textContent = "Supabase is not configured.";
        return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    if (!(submitButton instanceof HTMLButtonElement)) {
        throw new Error("The anonymous message form submit button is missing.");
    }

    submitButton.disabled = true;
    submitButton.textContent = "sending...";

    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/letters`, {
            method: "POST",
            headers: {
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${supabaseAnonKey}`,
                "Content-Type": "application/json",
                Prefer: "return=minimal"
            },
            body: JSON.stringify({
                message
            })
        });

        if (!response.ok) {
            throw new Error(`Supabase request failed with status ${response.status}.`);
        }

        form.reset();
        count.textContent = "0";
        status.className = "form-status success";
        status.textContent = "Message sent successfully. Thank you ! ! !";
    } catch (error) {
        console.error(error);
        status.className = "form-status error";
        status.textContent = "Failed. Please try again. TT";
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send";
    }
});
