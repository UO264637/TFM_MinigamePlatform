function joinRoom(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    const gameType = urlParams.get('gameType');
    const playerName = document.getElementById('playerNameJoin').value;

    window.location.href = `./${gameType}/index.html?roomId=${roomId}&playerName=${playerName}`;
}