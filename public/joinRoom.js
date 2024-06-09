window.onload = function () {
  let playerNameInput = document.getElementById("playerNameJoin");
  playerNameInput.value = localStorage.getItem("playerName") !== null ? localStorage.getItem("playerName") : "";
};

function joinRoom(event) {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("roomId");
  const gameType = urlParams.get("gameType");
  const playerName = document.getElementById("playerNameJoin").value;

  if (playerName.trim() === "") {
    return;
  }
  localStorage.setItem("playerName", playerName);

  window.location.href = `./${gameType}/index.html?roomId=${roomId}&playerName=${playerName}`;
}
