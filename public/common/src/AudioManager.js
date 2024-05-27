const volumeIcon = document.getElementById("volume-icon");
const volumeControl = document.getElementById("volume-control");
const ambientMusic = new Audio("res/ambient_music.mp3");
let globalVolume = localStorage.getItem("globalVolume") !== null ? parseFloat(localStorage.getItem("globalVolume")) : 0.5;
let isMuted = localStorage.getItem("isMuted") == "true";
ambientMusic.volume = globalVolume;
ambientMusic.muted = isMuted;

volumeControl.value = globalVolume.toString();
volumeIcon.textContent = (isMuted || globalVolume == 0) ? "🔇" : "🔊";

volumeIcon.addEventListener("click", () => {
  if (ambientMusic.muted) {
    ambientMusic.muted = false;
    localStorage.setItem("isMuted", false);
    volumeIcon.textContent = "🔊";
  } else {
    ambientMusic.muted = true;
    localStorage.setItem("isMuted", true);
    volumeIcon.textContent = "🔇";
  }
});

volumeControl.addEventListener("input", (event) => {
  const volume = event.target.value;
  globalVolume = volume;
  ambientMusic.volume = volume;
  localStorage.setItem("globalVolume", volume);
  if (volume == 0) {
    volumeIcon.textContent = "🔇";
  } else {
    volumeIcon.textContent = "🔊";
  }
});

function playMusic() {
  //ambientMusic.play();
  ambientMusic.volume = globalVolume;
}

function stopMusic() {
  ambientMusic.pause();
}

function playEffect(effectSrc) {
  if (!ambientMusic.muted) {
    let effect = new Audio(effectSrc);
    effect.volume = globalVolume;
    effect.play();
  }
}
