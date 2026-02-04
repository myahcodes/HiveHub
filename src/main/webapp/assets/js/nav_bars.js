/*Right Nav Data*/
const right_btns = [
    { class: 'homeIcon', url: 'Home.html', label: 'Home', top: '20px', right: '10px' },
    { class: 'buzzboardIcon', url: 'buzzboard.html', label: 'Buzzboard', top: '20px', right: '157px' },
    { class: 'searchGlasses', url: 'discovery.html', label: 'Discovery', top: '147px', right: '10px' },
    { class: 'postIcon', url: '', label: 'Posting page', top: '147px', right: '157px' }
];
/*Left Nav Data*/
const left_btns = [
    { class: 'profileBttn', url: 'profile.html', label: 'Profile', top: '20px', left: '10px' },
    { class: 'hiveIcon', url: 'hive.html', label: 'My Hive', top: '20px', left: '157px' }
];
/*Ref containers*/
const nav_right = document.querySelector("#right-nav");
const nav_left = document.querySelector("#left-nav");

function renderButtons(btnArray, container) {
    if (!container) return;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    btnArray.forEach(data => {
        const link = document.createElement('a');
        link.href = data.url;
        link.title = data.label;
        link.style.position = 'absolute';

        if (data.top) link.style.top = data.top;
        if (data.left) link.style.left = data.left;
        if (data.right) link.style.right = data.right;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-icon-btn';

        const iconDiv = document.createElement('div');

        const isActive = data.url === currentPage;

        if (isActive) {
            iconDiv.classList.add('sprite-base', `${data.class}Slct`);
        } else {
            iconDiv.classList.add('sprite-base', data.class);

            btn.addEventListener('mouseenter', () => {
                iconDiv.classList.replace(data.class, `${data.class}Slct`);
            });

            btn.addEventListener('mouseleave', () => {
                iconDiv.classList.replace(`${data.class}Slct`, data.class);
            });
        }

        btn.appendChild(iconDiv);
        link.appendChild(btn);
        container.appendChild(link);
    });
}

renderButtons(right_btns, nav_right);
renderButtons(left_btns, nav_left);