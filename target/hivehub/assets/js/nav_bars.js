/*Right Nav Data*/
const right_btns = [
    { img; '', url: 'home.html', label: 'Go Home' },
    { img; '', url: 'buzzboard.html', label: 'Go Home' },
];

/*Ref containers*/
const nav_right = document.querySelector("#right-nav");
const nav_left = document.querySelector("#left-nav");

/*Create Profile Button*/
const btn_prof = document.createElement("button");
btn_prof.id = "profile_button";

btn_prof.