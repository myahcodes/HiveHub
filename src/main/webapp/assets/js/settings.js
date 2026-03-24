const hover_control = new Audio("/webapp/assets/audio/pop-on.mp3");
const click_audio = new Audio("/webapp/assets/audio/classic-click.mp3");

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

// Display name options:

const options_panel = document.querySelector(".options");
const display_template = document.querySelector("#display-change-template");
const display_option = document.querySelector("#display-option");
let clone = null;

display_option.addEventListener("click", (e) => {
    e.stopPropagation();

    const clone_pointer = display_template.content.cloneNode(true);
    clone = options_panel.appendChild(clone_pointer.firstElementChild);
});

//icon options:

const icon_template = document.querySelector("#icon-change-template");
const icon_option = document.querySelector("#icon-option");

icon_option.addEventListener("click", (e) => {
    e.stopPropagation();

    const clone_pointer = icon_template.content.cloneNode(true);
    clone = options_panel.appendChild(clone_pointer.firstElementChild);
});

//Bio options:

const bio_template = document.querySelector("#bio-change-template");
const bio_option = document.querySelector("#bio-option");

bio_option.addEventListener("click", (e) => {
    e.stopPropagation();

    const clone_pointer = bio_template.content.cloneNode(true);
    clone = options_panel.appendChild(clone_pointer.firstElementChild);
});

//change password:

const password_template = document.querySelector("#password-change-template");
const password_option = document.querySelector("#password-option");

password_option.addEventListener("click", (e) => {
    e.stopPropagation();

    if (clone) {
        clone.remove();
        clone = null;
    }
    else {
        const clone_pointer = password_template.content.cloneNode(true);
        clone = options_panel.appendChild(clone_pointer.firstElementChild);
    }


});

//update email/username

const email_template = document.querySelector("#email-change-template");
const email_option = document.querySelector("#email-option");

email_option.addEventListener("click", (e) => {
    e.stopPropagation();

    const clone_pointer = email_template.content.cloneNode(true);
    clone = options_panel.appendChild(clone_pointer.firstElementChild);
});

//deactivate:

const account_deletion_template = document.querySelector("#account-deletion-template");
const delete_option = document.querySelector("#delete-option");

delete_option.addEventListener("click", (e) => {
    e.stopPropagation();

    const clone_pointer = account_deletion_template.content.cloneNode(true);
    clone = options_panel.appendChild(clone_pointer.firstElementChild);
});

//event activity:

const event_template = document.querySelector("#event-change-template");
const event_option = document.querySelector("#event-option");

event_option.addEventListener("click", (e) => {
    e.stopPropagation();

    const clone_pointer = event_template.content.cloneNode(true);
    clone = options_panel.appendChild(clone_pointer.firstElementChild);
});

//visibility: (toggle or dropdown)

document.body.addEventListener("click", (e) => {

    const options_elements = document.querySelector(".elements-container");

    if (!clone) return;

    if (e.target === clone || e.target === options_elements) {
        clone.remove();
        clone = null;
    }
});