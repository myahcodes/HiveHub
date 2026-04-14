
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
new_buzz.style.color = "var(--theme-color)";
new_buzz.style.padding = "4px 25px";

new_buzz.addEventListener('mouseenter', () => {
    hover_audio.currentTime = 0;
    hover_audio.play();

    new_buzz.style.cursor = "pointer";
    new_buzz.style.backgroundColor = "var(--theme-color)";
    new_buzz.style.color = "black";
});

new_buzz.addEventListener('mouseleave', () => {

    new_buzz.style.cursor = "default";
    new_buzz.style.backgroundColor = "black";
    new_buzz.style.color = "var(--theme-color)";
});

new_buzz.addEventListener("click", () => {
    click_audio.currentTime = 0;
    click_audio.play();
});

// old buzz button secton:

const old_buzz = document.createElement('button');
old_buzz.textContent = "Old";
old_buzz.style.color = "var(--theme-color)";
old_buzz.style.padding = "4px 25px";

old_buzz.addEventListener('mouseenter', () => {
    hover_audio.currentTime = 0;
    hover_audio.play();

    old_buzz.style.cursor = "pointer";
    old_buzz.style.backgroundColor = "var(--theme-color)";
    old_buzz.style.color = "black";
});

old_buzz.addEventListener('mouseleave', () => {

    old_buzz.style.cursor = "default";
    old_buzz.style.backgroundColor = "black";
    old_buzz.style.color = "var(--theme-color)";
});

old_buzz.addEventListener("click", () => {
    click_audio.currentTime = 0;
    click_audio.play();
});

const buzz = document.createElement('button');
buzz.textContent = "Buzz";
buzz.style.color = "var(--theme-color)";
buzz.style.padding = "4px 25px";

// buzz button section:

buzz.addEventListener('mouseenter', () => {
    hover_audio.currentTime = 0;
    hover_audio.play();

    buzz.style.cursor = "pointer";
    buzz.style.backgroundColor = "var(--theme-color)";
    buzz.style.color = "black";
});

buzz.addEventListener('mouseleave', () => {

    buzz.style.cursor = "default";
    buzz.style.backgroundColor = "black";
    buzz.style.color = "var(--theme-color)";
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

////Profile population working on
//function fillProfile(userData) {
//    const profileContainer = document.querySelector('.profile-container');
//    if (!profileContainer) {
//        console.error('Profile container not found');
//        return false;
//    }

//    const labelArea = profileContainer.querySelector('.label-area');
//    if (!labelArea) {
//        console.error('Label area not found inside profile container');
//        return false;
//    }

//    const displayNameElem = labelArea.querySelector('#display-name');
//    const usernameElem = labelArea.querySelector('#username');

//    if (displayNameElem) {
//        displayNameElem.textContent = userData.displayName || 'Unknown Name';
//    }
//    if (usernameElem) {
//        usernameElem.textContent = userData.username || 'Unknown Username';
//    }

//    return true;
//}

//// Mock user data – replace with real API call later
//const mockUserData = {
//    displayName: 'John Doe',
//    username: '@johndoe'
//};

//// Populate profile when the DOM is fully loaded
//document.addEventListener('DOMContentLoaded', () => {
//    fillProfile(mockUserData);

//    // Example of future server integration (commented out):
//    /*
//    fetch('/api/user/profile')
//        .then(response => response.json())
//        .then(data => fillProfile(data))
//        .catch(err => console.error('Failed to load profile:', err));
//    */
//});
async function loadProfile() {
    try {
        const response = await fetch('api/profile');
        if (response.status === 401) {
            window.location.href = 'Login.html';
            return;
        }
        const data = await response.json();
        document.getElementById('profile-name').textContent = data.firstName + ' ' + data.lastName;
        document.getElementById('profile-username').textContent = '@' + data.username;
        document.getElementById('profile-email').textContent = data.email;
        const container = document.getElementById('user-posts');
        container.innerHTML = '';
        if (data.posts.length === 0) {
            container.innerHTML = '<p style="color:#ffb84d; text-align:center;">No posts yet.</p>';
            return;
        }
        data.posts.forEach(post => {
            const buzz = document.createElement('div');
            buzz.className = 'buzz';
            buzz.innerHTML = `
                <div class="buzz-header">
                    <img src="assets/img/icons/defaultPfp.svg" alt="Profile" class="profile" />
                    <div class="user-info">
                        <span>@${data.username}</span>
                        <span class="user-info-divide">${new Date(post.createdAt).toLocaleDateString()}</span>
                        ${post.tags ? '<span class="distance">' + post.tags + '</span>' : ''}
                    </div>
                </div>
                <div class="buzz-content">
                    <h3 style="color:#ffb84d; margin-bottom:8px;">${post.title}</h3>
                    <div style="color:#ffb84d;">${post.body}</div>
                </div>
                <div class="buzz-actions">
                    <div style="display: flex; gap: 15px;">
                        <button class="action-bttns commentFeedIcon"></button>
                        <button class="action-bttns addToBuzzboardIcon"></button>
                    </div>
                    <div>
                        <button class="action-bttns shareIcon"></button>
                    </div>
                </div>
            `;
            container.appendChild(buzz);
        });
    } catch (err) {
        console.error('Failed to load profile:', err);
    }
}
loadProfile();