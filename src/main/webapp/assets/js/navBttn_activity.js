document.querySelectorAll('.left-bttns, .right-bttns').forEach(link => {
    const currentPath = window.location.pathname.toLowerCase();
    const linkPath = new URL(link.href).pathname.toLowerCase();

    if (currentPath === linkPath || (currentPath === '/' && linkPath.includes('home.html'))) {
        link.classList.add('active');
    }
});