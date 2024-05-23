let selectedGameType = "";

window.onload = function () {
  loadGameList();
  loadRoomList();
};

setInterval({loadRoomList, filterRooms}, 5000);

function loadGameList() {
  fetch(baseUrl + "/api/gameTypes")
    .then((response) => response.json())
    .then((data) => {
      const gameList = document.getElementById("gameList");
      gameList.innerHTML = "";

      data.forEach((gameType) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = gameType.replace(
          /([A-Z]+)*([A-Z][a-z])/g,
          "$1 $2"
        );
        listItem.classList.add(gameType);
        listItem.addEventListener("click", (e) => {
          selectGameType(gameType);
        });

        const gameIcon = document.createElement("img");
        gameIcon.src = "./common/res/icons/" + gameType + "Icon.png";

        listItem.appendChild(gameIcon);
        gameList.appendChild(listItem);
      });
      document
        .getElementById("gameList")
        .childNodes[0].classList.add("selected");
      selectedGameType = data[0];
    })
    .catch((error) => console.error("Error loading game list:", error));
}

function loadRoomList() {
  fetch(baseUrl + "/api/waitingRooms")
    .then((response) => response.json())
    .then((data) => {
      const roomList = document.getElementById("roomList");
      roomList.innerHTML = "";

      data.forEach((room) => {
        const listItem = createRoomElement(room);
        roomList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error loading room list:", error));
}

function createRoomElement(room) {
  const listItem = document.createElement("li");
  const listHeader = document.createElement("h3");
  const p = document.createElement("p");
  const div = document.createElement("div");

  listHeader.innerHTML = `${room.players.join(" vs ")} - esperando`;
  p.innerHTML = room.gameType.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2");
  div.innerHTML = "Sala " + room.roomId;

  listItem.appendChild(listHeader);
  listItem.appendChild(p);
  listItem.appendChild(div);
  listItem.classList.add(room.gameType);

  listItem.addEventListener("click", () => {
    window.location.href = `./joinRoom.html?gameType=${room.gameType}&roomId=${room.roomId}`;
  });

  return listItem;
}

function selectGameType(gameType) {
  const gameList = document.getElementById("gameList");
  const selectedGame = gameList.getElementsByClassName(gameType)[0];

  gameList.childNodes.forEach((liItem) => {
    liItem.classList.remove("selected");
  });

  selectedGame.classList.add("selected");
  selectedGameType = gameType;
}

function createNewRoom(event) {
  event.preventDefault();
  const playerName = document.getElementById("playerNameCreate").value;

  fetch(baseUrl + "/api/createRoom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameType: selectedGameType }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(selectedGameType);
      window.location.href = `./${selectedGameType}/index.html?roomId=${data.roomId}&playerName=${playerName}`;
    })
    .catch((error) => console.error("Error creating new room:", error));
}

function filterRooms() {
  const filterValue = document.getElementById("filter").value.toLowerCase();
  const roomList = document.getElementById("roomList");
  const rooms = roomList.getElementsByTagName("li");

  for (const room of rooms) {
    let roomName = room
      .querySelector("h3")
      .textContent.toLowerCase()
      .replace("- esperando", "");
    let roomDescription = room.querySelector("p").textContent.toLowerCase();
    let roomNumber = room
      .querySelector("div")
      .textContent.toLowerCase()
      .replace("sala ", "");

    let displayStyle =
      roomName.includes(filterValue) ||
      roomDescription.includes(filterValue) ||
      roomNumber.includes(filterValue)
        ? "block"
        : "none";

    room.style.display = displayStyle;
  }
}

const gameList = document.getElementById("gameList");

gameList.addEventListener("wheel", function (event) {
  if (gameList.scrollWidth > gameList.clientWidth) {
    gameList.scrollLeft += event.deltaY;
    event.preventDefault();
  }
});
