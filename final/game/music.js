document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("music");
    const musicButton = document.getElementById("music-button");
    const volumeUp = document.getElementById("volume-up");
    const volumeDown = document.getElementById("volume-down");

    music.volume = 0.2;

    musicButton.addEventListener("click", () => {
        if (music.paused) {
            music.play();
            musicButton.classList.remove("bi-play");
            musicButton.classList.add("bi-pause");
        } else {
            music.pause();
            musicButton.classList.add("bi-play");
            musicButton.classList.remove("bi-pause");
        }
    });

    volumeUp.addEventListener("click", () => {
        if (music.volume < 1) {
            music.volume += 0.05;
        }
    });

    volumeDown.addEventListener("click", () => {
        if (music.volume > 0.05) {
            music.volume -= 0.05;
        }
    });
});
