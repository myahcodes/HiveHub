/*Right Nav Data*/
const right_btns = [
    {class: 'homeBttn', url: 'Home.html', label: 'Home', top: 'px', right: 'px'},
    {class: 'buzzboardBttn', url: 'buzzboard.html', label: 'Buzzboard', top: 'px', right: 'px'},
    {class: 'discoveryBttn', url: 'discovery.html', label: 'Discovery', top: 'px', right: 'px'}
];

const left_btns = [
    {class: 'profileBttn', url: 'profile.html', label: 'Profile', top: 'px', left: 'px'},
    {class: '', url: 'hive.html', label: 'My Hive', top: 'px', left: 'px'}
];
/*Ref containers*/
const nav_right = document.querySelector("#right-nav");
const nav_left = document.querySelector("#left-nav");

/*Create Profile Button*/
function renderButtons(btnArray, container) {
    if (!container) return; // Safety check

    btnArray.forEach(data => {
        //Create the anchor link
        const link = document.createElement('a');
        link.href = data.url;
        link.title = data.label; //Tooltip on hover

        //Create the button
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-icon-btn';

        //Create the image
        const img = document.createElement('img');
        img.src = data.img;
        img.alt = data.label;

        //Nest them
        btn.appendChild(img);
        link.appendChild(btn);
        container.appendChild(link);
    });
}

// 2. Execute the render
renderButtons(right_btns, nav_right);
renderButtons(left_btns, nav_left);