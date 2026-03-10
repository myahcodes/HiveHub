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

const profile_options = document.querySelector(".Profile-options");
const display_template = document.querySelector("#display-change-template");
const display_option = document.querySelector("#display-option");
let clone = null;

display_option.addEventListener("click", () => {

    if (clone) {
        clone.remove();
        clone = null;
    }
    else {
        const clone_pointer = display_template.content.cloneNode(true);
        clone = profile_options.appendChild(clone_pointer.firstElementChild);
    }
});

//icon options:

//Bio options:

//change password:

//update email/username

//deactivate:

//event activity:

//visibility:

const options_modal = document.querySelector(".option-wrapper");
const options_elements = options_modal.firstElementChild;

document.body.addEventListener("click", (e) => {
    if (clone && e.target === options_elements) {
        clone.remove();
        clone = null;
    }
});