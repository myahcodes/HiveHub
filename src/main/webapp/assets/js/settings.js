const hover_control = new Audio("/webapp/assets/audio/47313572-pop-on-269286.mp3");
const click_audio = new Audio("/webapp/assets/audio/classic-click.mp3");

const option_container = document.querySelectorAll(".options *");

option_container.forEach(element => {
    element.addEventListener("mouseenter", () => {
        hover_control.currentTime = 0;
        hover_control.play();
    });

    element.addEventListener("click", () => {
        click_audio.currentTime = 0;
        click_audio.play();
    });
});





