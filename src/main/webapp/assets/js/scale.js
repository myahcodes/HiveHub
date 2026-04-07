function scaleApp() {
    const naturalWidth = 1400;
    const windowWidth = window.innerWidth;
    const root = document.getElementById('app-root');
    if (!root) return;

    if (windowWidth < naturalWidth) {
        const scale = windowWidth / naturalWidth;
        root.style.transform = `scale(${scale})`;
        root.style.transformOrigin = 'top left';
        root.style.width = `${naturalWidth}px`;
        document.body.style.height = `${root.offsetHeight * scale}px`;
    } else {
        root.style.transform = 'scale(1)';
        root.style.width = '100%';
        document.body.style.height = 'auto';
    }
}

scaleApp();
window.addEventListener('resize', scaleApp);
