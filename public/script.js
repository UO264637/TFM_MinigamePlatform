let selectedGameType = "";

window.onload = function() {
    loadGameList();
    loadRoomList();
};

function loadGameList() {
    fetch(baseUrl + '/api/gameTypes')
        .then(response => response.json())
        .then(data => {
            const gameList = document.getElementById('gameList');
            gameList.innerHTML = '';

            data.forEach(gameType => {
                const listItem = document.createElement('li');
                listItem.innerHTML = gameType.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2");
                listItem.classList.add(gameType);
                listItem.addEventListener('click', (e) => {
                    selectGameType(gameType);
                });
                
                const gameIcon = document.createElement('img');
                gameIcon.src = "./common/res/icons/" + gameType + "Icon.png";

                listItem.appendChild(gameIcon);
                gameList.appendChild(listItem);
            });
            document.getElementById("gameList").childNodes[0].classList.add("selected");
            selectedGameType = data[0];
        })
        .catch(error => console.error('Error loading game list:', error));
}

function loadRoomList() {
    fetch(baseUrl + '/api/waitingRooms')
        .then(response => response.json())
        .then(data => {
            const roomList = document.getElementById('roomList');
            roomList.innerHTML = '';

            data.forEach(room => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `${room.players.join(' vs ')} - ${room.status}`;
                listItem.classList.add(room.gameType);
                
                const joinButton = document.createElement('button');
                joinButton.textContent = 'Unirse';
                joinButton.addEventListener('click', () => {
                    toggleForm();
                    const roomId = document.getElementById('roomId');
                    const gameType = document.getElementById('gameType');
                    roomId.value=room.roomId
                    gameType.value = room.gameType;
                });

                listItem.appendChild(joinButton);
                roomList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading room list:', error));
}

function selectGameType(gameType) {
    const gameList = document.getElementById("gameList");
    const selectedGame = gameList.getElementsByClassName(gameType)[0];

    gameList.childNodes.forEach(liItem => {
        liItem.classList.remove("selected");
    });

    selectedGame.classList.add("selected")
    selectedGameType = gameType;
}

function toggleForm() {
    const joinForm = document.getElementById('joinForm');
    const roomList = document.getElementById('roomList');

    joinForm.style.display = joinForm.style.display === 'none' ? 'flex' : 'none';
    roomList.style.display = roomList.style.display === 'none' ? 'block' : 'none';
}

function joinRoom(event) {
    event.preventDefault();
    const roomId = document.getElementById('roomId').value;
    const playerName = document.getElementById('playerNameJoin').value;
    const gameType = document.getElementById('gameType').value;

    window.location.href = `./${gameType}/index.html?roomId=${roomId}&playerName=${playerName}`;
}

function createNewRoom(event) {
    event.preventDefault();
    const playerName = document.getElementById('playerNameCreate').value;

    fetch(baseUrl + '/api/createRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameType: selectedGameType }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(selectedGameType)
        window.location.href = `./${selectedGameType}/index.html?roomId=${data.roomId}&playerName=${playerName}`;
    })
    .catch(error => console.error('Error creating new room:', error));
}