function scaleApp() {
    const naturalWidth = 1400;
    const windowWidth = window.innerWidth;

    if (windowWidth < naturalWidth) {
        const scale = windowWidth / naturalWidth;
        document.documentElement.style.transform = `scale(${scale})`;
        document.documentElement.style.transformOrigin = 'top left';
        document.documentElement.style.width = `${naturalWidth}px`;
        document.documentElement.style.height = `${window.innerHeight / scale}px`;
    } else {
        document.documentElement.style.transform = 'scale(1)';
        document.documentElement.style.width = '100%';
        document.documentElement.style.height = 'auto';
    }
}

scaleApp();
window.addEventListener('resize', scaleApp);
