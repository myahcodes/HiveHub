
function ThemePicker(clone) {
    const root = document.documentElement;
    const theme_container = clone.querySelector("#color-options");

    theme_container.addEventListener("change", (e) => {
        if (e.target.name === 'color') {

            const current_theme = e.target.value;

            root.style.setProperty("--theme-color", current_theme);

            localStorage.setItem("themeColor", current_theme);
        }
    });
}