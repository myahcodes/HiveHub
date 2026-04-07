function scaleApp() {
    const naturalWidth = 1400;
    const windowWidth = window.innerWidth;

    if (windowWidth < naturalWidth) {
        const scale = windowWidth / naturalWidth;
        document.body.style.transform = `scale(${scale})`;
        document.body.style.transformOrigin = 'top left';
        document.body.style.width = `${naturalWidth}px`;
        document.body.style.height = `${window.innerHeight / scale}px`;
    } else {
        document.body.style.transform = 'scale(1)';
        document.body.style.width = '100%';
        document.body.style.height = 'auto';
    }
}

scaleApp();
window.addEventListener('resize', scaleApp);
