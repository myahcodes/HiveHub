/*Right Nav Data*/
const right_btns = [
    { class: 'homeBttn', url: 'Home.html', label: 'Home', top: 'px', right: 'px' },
    { class: 'buzzboardBttn', url: 'buzzboard.html', label: 'Buzzboard', top: 'px', right: 'px' },
    { class: 'discoveryBttn', url: 'discovery.html', label: 'Discovery', top: 'px', right: 'px' },
    { class: 'postBttn', url: '', label: 'Posting page', top: 'px', right: 'px' }
];

const left_btns = [
    { class: 'profileBttn', url: 'profile.html', label: 'Profile', top: 'px', left: 'px' },
    { class: '', url: 'hive.html', label: 'My Hive', top: 'px', left: 'px' }
];
/*Ref containers*/
const nav_right = document.querySelector("#right-nav");
const nav_left = document.querySelector("#left-nav");

/*Create Profile Button*/
function renderButtons(btnArray, container) {
    if (!container) return; // Safety check

    btnArray.forEach(data => {
        // Create the anchor link
        const link = document.createElement('a');
        link.href = data.url;
        link.title = data.label;

        /* Apply Absolute Positioning to the Link */
        link.style.position = 'absolute';
        if (data.top) link.style.top = data.top;
        if (data.bottom) link.style.bottom = data.bottom;
        if (data.left) link.style.left = data.left;
        if (data.right) link.style.right = data.right;

        // Create the button
        const btn = document.createElement('button');

        btn.type = 'button';
        btn.className = 'nav-icon-btn';
        btn.setAttribute('aria-label', data.label);

        // Create the Div for the Sprite (instead of <img>)
        const iconDiv = document.createElement('div');
        // This adds both a general icon class and your specific sprite class
        iconDiv.className = `sprite-icon ${data.class}`;

        // Nest them: Link > Button > Sprite Div
        btn.appendChild(iconDiv);
        link.appendChild(btn);
        container.appendChild(link);
    });
}

    // 4. Execute the render
    renderButtons(right_btns, nav_right);
    renderButtons(left_btns, nav_left);


// 2. Execute the render
renderButtons(right_btns, nav_right);
renderButtons(left_btns, nav_left);