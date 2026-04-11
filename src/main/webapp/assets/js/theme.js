function applyTheme() {
    const theme = localStorage.getItem("themeColor");

    if (theme) {
        document.documentElement.style.setProperty("--theme-color", theme);
    }
}

applyTheme();