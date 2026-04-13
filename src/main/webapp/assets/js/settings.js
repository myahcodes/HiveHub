document.addEventListener('DOMContentLoaded', () => {

    const hover_control = new Audio("./assets/audio/pop-on.mp3");
    const click_audio = new Audio("./assets/audio/classic-click.mp3");

    const options_effects = document.querySelectorAll(".option");
    options_effects.forEach(option => {
        option.addEventListener("mouseenter", () => {
            hover_control.currentTime = 0;
            hover_control.play();
        });
        option.addEventListener("click", () => {
            click_audio.currentTime = 0;
            click_audio.play();
        });
    });

    const options_panel = document.querySelector(".options");
    let clone = null;

    function removeClone() {
        if (clone) {
            clone.remove();
            clone = null;
        }
    }

    function appendTemplate(templateId) {
        removeClone();
        const template = document.querySelector(templateId);
        const clonePointer = template.content.cloneNode(true);
        clone = options_panel.appendChild(clonePointer.firstElementChild);
    }

    // ── Close on backdrop click ──
    document.body.addEventListener("click", (e) => {
        if (!clone) return;
        const container = clone.querySelector(".elements-container");
        const background = clone.querySelector(".option-background");
        if (background && !background.contains(e.target)) {
            removeClone();
        }
    });

    // ── Display ──
    document.querySelector("#display-option").addEventListener("click", (e) => {
        e.stopPropagation();
        appendTemplate("#display-change-template");
        ThemePicker(clone);
    });

    // ── Icon ──
    document.querySelector("#icon-option").addEventListener("click", (e) => {
        e.stopPropagation();
        appendTemplate("#icon-change-template");
    });

    // ── Bio ──
    document.querySelector("#bio-option").addEventListener("click", (e) => {
        e.stopPropagation();
        appendTemplate("#bio-change-template");
    });

    // ── Change Password ──
    document.querySelector("#password-option").addEventListener("click", (e) => {
        e.stopPropagation();
        appendTemplate("#password-change-template");

        // Add save button and message to the template after cloning
        const background = clone.querySelector(".option-background");
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.className = "settings-save-btn";
        const message = document.createElement("p");
        message.className = "settings-message";
        background.appendChild(saveBtn);
        background.appendChild(message);

        saveBtn.addEventListener("click", async () => {
            const inputs = clone.querySelectorAll("input");
            const currentPassword = inputs[0].value;
            const newPassword = inputs[1].value;
            const confirmPassword = inputs[2].value;

            if (!newPassword) {
                message.textContent = "Please enter a new password.";
                message.style.color = "red";
                return;
            }

            if (newPassword !== confirmPassword) {
                message.textContent = "Passwords do not match.";
                message.style.color = "red";
                return;
            }

            try {
                const res = await fetch('settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `action=updatePassword&currentPassword=${encodeURIComponent(currentPassword)}&newPassword=${encodeURIComponent(newPassword)}`
                });
                const data = await res.json();
                if (data.success) {
                    message.textContent = "Password updated!";
                    message.style.color = "#ffb84d";
                    setTimeout(removeClone, 1500);
                } else {
                    message.textContent = data.error || "Failed to update password.";
                    message.style.color = "red";
                }
            } catch (err) {
                message.textContent = "Network error.";
                message.style.color = "red";
            }
        });
    });

    // ── Update Email/Username ──
    document.querySelector("#email-option").addEventListener("click", (e) => {
        e.stopPropagation();
        appendTemplate("#email-change-template");

        const background = clone.querySelector(".option-background");

        // Add username field since their template only has email
        const usernameLabel = document.createElement("p");
        usernameLabel.textContent = "New username:";
        const usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.placeholder = "New username (optional)";

        const inputRow = clone.querySelector(".input-row");
        inputRow.insertBefore(usernameInput, inputRow.firstChild);
        inputRow.insertBefore(usernameLabel, usernameInput);

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.className = "settings-save-btn";
        const message = document.createElement("p");
        message.className = "settings-message";
        background.appendChild(saveBtn);
        background.appendChild(message);

        saveBtn.addEventListener("click", async () => {
            const username = usernameInput.value.trim();
            const inputs = clone.querySelectorAll("input[type='email']");
            const email = inputs[0].value.trim();

            if (!username && !email) {
                message.textContent = "Please enter a username or email.";
                message.style.color = "red";
                return;
            }

            if (username) {
                try {
                    const res = await fetch('settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `action=updateUsername&username=${encodeURIComponent(username)}`
                    });
                    const data = await res.json();
                    if (!data.success) {
                        message.textContent = data.error || "Failed to update username.";
                        message.style.color = "red";
                        return;
                    }
                } catch (err) {
                    message.textContent = "Network error.";
                    message.style.color = "red";
                    return;
                }
            }

            if (email) {
                try {
                    const res = await fetch('settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `action=updateEmail&email=${encodeURIComponent(email)}`
                    });
                    const data = await res.json();
                    if (!data.success) {
                        message.textContent = "Failed to update email.";
                        message.style.color = "red";
                        return;
                    }
                } catch (err) {
                    message.textContent = "Network error.";
                    message.style.color = "red";
                    return;
                }
            }

            message.textContent = "Updated successfully!";
            message.style.color = "#ffb84d";
            setTimeout(removeClone, 1500);
        });
    });

    // ── Deactivate ──
    document.querySelector("#delete-option").addEventListener("click", (e) => {
        e.stopPropagation();
        appendTemplate("#account-deletion-template");
    });

    // ── Event activity ──
    document.querySelector("#event-option").addEventListener("click", (e) => {
        e.stopPropagation();
        appendTemplate("#event-change-template");
    });

    // ── Logout ──
    document.getElementById('logout_button').addEventListener('click', () => {
        click_audio.currentTime = 0;
        click_audio.play();
        setTimeout(() => {
            window.location.href = 'logout';
        }, 300);
    });

}); // end DOMContentLoaded
