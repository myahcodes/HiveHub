const hover_control = new Audio("/webapp/assets/audio/47313572-pop-on-269286.mp3");
const click_audio = new Audio("/webapp/assets/audio/classic-click.mp3");

const options_effects = document.querySelectorAll(".option");

options_effects.forEach(option => {
    option.addEventListener("mouseenter", () => {
        hover_control.currentTime = 0;
        hover_control.play();
    });

    option.addEventListener("click", () => {
        click_audio.currentTime = 0;
        click_audio.play();
    });
});