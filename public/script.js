window.onload = function() {
    loadRoomsList();
};

function loadRoomsList() {
    fetch('https://tfm-minigame-platform-backend-c0zyll94u.vercel.app/api/waitingRooms')
        .then(response => response.json())
        .then(data => {
            const roomsList = document.getElementById('roomsList');
            roomsList.innerHTML = '';

            data.forEach(room => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `${room.players.join(' vs ')} - ${room.status}`;
                
                const joinButton = document.createElement('button');
                joinButton.textContent = 'Unirse';
                joinButton.addEventListener('click', () => {
                    toggleForm();
                    const roomId = document.getElementById('roomId');
                    roomId.value=room.roomId
                });

                listItem.appendChild(joinButton);
                roomsList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error al cargar la lista de juegos:', error));
}

function toggleForm() {
    const joinForm = document.getElementById('joinForm');
    const roomsList = document.getElementById('roomsList');

    joinForm.style.display = joinForm.style.display === 'none' ? 'flex' : 'none';
    roomsList.style.display = roomsList.style.display === 'none' ? 'block' : 'none';
}

function joinRoom(event) {
    event.preventDefault();
    const roomId = document.getElementById('roomId').value;
    const playerName = document.getElementById('playerNameJoin').value;

    window.location.href = `./TicTacToe/index.html?roomId=${roomId}&playerName=${playerName}`;
}

function createNewRoom(event) {
    event.preventDefault();
    const playerName = document.getElementById('playerNameCreate').value;

    fetch('https://tfm-minigame-platform-backend-c0zyll94u.vercel.app/api/createRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName }),
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = `./TicTacToe/index.html?roomId=${data.roomId}&playerName=${playerName}`;
    })
    .catch(error => console.error('Error al crear un nuevo juego:', error));
}