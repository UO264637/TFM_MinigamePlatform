const volumeIcon = document.getElementById("volume-icon");
const volumeControl = document.getElementById("volume-control");
const ambientMusic = new Audio("res/ambient_music.mp3");
ambientMusic.loop = true;
let globalVolume = 0.5;

volumeIcon.addEventListener("click", () => {
    if (ambientMusic.muted) {
        ambientMusic.muted = false;
        volumeIcon.textContent = "🔊";
    } else {
        ambientMusic.muted = true;
        volumeIcon.textContent = "🔇";
    }
});

volumeControl.addEventListener("input", (event) => {
    const volume = event.target.value;
    globalVolume = volume;
    ambientMusic.volume = volume;
    if (volume == 0) {
        volumeIcon.textContent = "🔇";
    } else {
        volumeIcon.textContent = "🔊";
    }
});

function playMusic() {
    ambientMusic.play();
    ambientMusic.volume = globalVolume;
}

function stopMusic() {
    ambientMusic.pause();
}

function playEffect(effectSrc) {
    let effect = new Audio(effectSrc);
    effect.volume = globalVolume;
    effect.play();
}
