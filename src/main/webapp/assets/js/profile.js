
/*Reference containers*/
const pf_container = document.querySelector(".profile-container");
const buzz_container = document.querySelector(".buzz-container");
const footer = document.querySelector(".HH-footer");

/*Create profile picture element*/
const pfp_outline = document.createElement("img");
pfp_outline.src = "/webapp/assets/img/icons/combBlank.svg";
pfp_outline.width = 150;
pfp_outline.float = "center";
console.log(pfp_outline.src);
pfp_outline.onerror = function () { console.log("Error loading profile picture border."); };

pfp_outline.addEventListener('mouseover', () => {
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

const old_buzz = document.createElement('button');
old_buzz.textContent = "Old";
old_buzz.style.padding = "4px 25px";

const buzz = document.createElement('button');
buzz.textContent = "Buzz";
buzz.style.padding = "4px 25px";

/*Place elements*/
pf_container.appendChild(pfp_outline);
pf_container.appendChild(pfp_Icon);

buzz_container.appendChild(new_buzz);
buzz_container.appendChild(old_buzz);
buzz_container.appendChild(buzz);
