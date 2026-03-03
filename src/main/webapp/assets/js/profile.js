
//cosemtic references:

const click_audio = new Audio("/webapp/assets/audio/click-sound.mp3");
const hover_audio = new Audio("/webapp/assets/audio/pop-on.mp3");

/*Reference containers*/
const pf_container = document.querySelector(".profile-container");
const buzz_container = document.querySelector(".buzz-container");
const footer = document.querySelector(".HH-footer");

/*Create profile picture element*/
const pfp_outline = document.createElement("img");
pfp_outline.src = "/webapp/assets/img/icons/combBlank.svg";
pfp_outline.width = 150;
pfp_outline.float = "center";
pfp_outline.onerror = function () { console.log("Error loading profile picture border."); };

pfp_outline.addEventListener('mouseenter', () => {
    pfp_outline.classList.add('shake');

    pfp_outline.addEventListener('animationend', () =>
        pfp_outline.classList.remove('shake'),
        { once: true }
    );
});

const pfp_Icon = document.createElement("img");
pfp_Icon.src = "/webapp/assets/img/icons/defaultPfp.svg";
pfp_Icon.width = 150;
pfp_Icon.float = "center";
pfp_Icon.onerror = function () { console.log("Error loading profile picture."); };

/*Create settings icon*/
const settings_icon = document.createElement('img');

/*Create My Buzz elements*/

const new_buzz = document.createElement('button');
new_buzz.textContent = "New";
new_buzz.style.padding = "4px 25px";

new_buzz.addEventListener('mouseenter', () => {
    hover_audio.currentTime = 0;
    hover_audio.play();

    new_buzz.style.cursor = "pointer";
    new_buzz.style.backgroundColor = "#ffb84d";
    new_buzz.style.color = "black";
});

new_buzz.addEventListener('mouseleave', () => {

    new_buzz.style.cursor = "default";
    new_buzz.style.backgroundColor = "black";
    new_buzz.style.color = "#ffb84d";
});

new_buzz.addEventListener("click", () => {
    click_audio.currentTime = 0;
    click_audio.play();
});

// old buzz button secton:

const old_buzz = document.createElement('button');
old_buzz.textContent = "Old";
old_buzz.style.padding = "4px 25px";

old_buzz.addEventListener('mouseenter', () => {
    hover_audio.currentTime = 0;
    hover_audio.play();

    old_buzz.style.cursor = "pointer";
    old_buzz.style.backgroundColor = "#ffb84d";
    old_buzz.style.color = "black";
});

old_buzz.addEventListener('mouseleave', () => {

    old_buzz.style.cursor = "default";
    old_buzz.style.backgroundColor = "black";
    old_buzz.style.color = "#ffb84d";
});

old_buzz.addEventListener("click", () => {
    click_audio.currentTime = 0;
    click_audio.play();
});

const buzz = document.createElement('button');
buzz.textContent = "Buzz";
buzz.style.padding = "4px 25px";

// buzz button section:

buzz.addEventListener('mouseenter', () => {
    hover_audio.currentTime = 0;
    hover_audio.play();

    buzz.style.cursor = "pointer";
    buzz.style.backgroundColor = "#ffb84d";
    buzz.style.color = "black";
});

buzz.addEventListener('mouseleave', () => {

    buzz.style.cursor = "default";
    buzz.style.backgroundColor = "black";
    buzz.style.color = "#ffb84d";
});

buzz.addEventListener("click", () => {
    click_audio.currentTime = 0;
    click_audio.play();
});

/*Place elements*/
pf_container.appendChild(pfp_outline);
pf_container.appendChild(pfp_Icon);

buzz_container.appendChild(new_buzz);
buzz_container.appendChild(old_buzz);
buzz_container.appendChild(buzz);
