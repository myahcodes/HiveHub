/*Reference containers*/
const pf_container = document.querySelector(".profile-container");
const buzz_container = document.querySelector(".buzz-container");
const footer = document.querySelector(".HH-footer");

/*Create profile picture element*/

const pfp_Icon = document.createElement('img');
pfp_Icon.src = 'assets/icons/defaultPfp.svg';
pfp_Icon.width = 64;
pfp_Icon.onerror = function () { console.log("Error loading profile picture."); };

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
pf_container.appendChild(pfp_Icon);

buzz_container.appendChild(new_buzz);
buzz_container.appendChild(old_buzz);
buzz_container.appendChild(buzz);
