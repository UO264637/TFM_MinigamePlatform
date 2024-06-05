const { BaseGame, Statuses } = require("./BaseGame");

const Roles = {
  HAUNTER: "haunter",
  PURSUED: "pursued",
};

class MazeChase extends BaseGame {
  initializeGameState(room) {
    const state = {
      map: Math.floor(Math.random() * 3) + 1,
      players: [],
      maxPlayers: 2,
      result: {
        status: Statuses.WAITING,
      },
    };
    room.state = state;
    room[Roles.HAUNTER + "timer"] = 0;
    room[Roles.PURSUED + "timer"] = 0;
  }

  handleGameStart(room) {
    const rolesKeys = Object.keys(Roles);
    const randomIndex = Math.round(Math.random());

    room.state.players[0].role = Roles[rolesKeys[randomIndex]];
    room.state.players[0].timer = 0;
    room.state.players[1].role = Roles[rolesKeys[1-randomIndex]];
    room.state.players[1].timer = 0;

    if (room.state.result.status == Statuses.WAITING) {
      this.updateGameState(room, "gameStart");
      room.state.result.status = Statuses.PLAYING;
      setTimeout(() => {
        this.startTurnTimer(room, 60);
      }, 3000);
    }
  }

  handleAction(room, socketId, data) {
    if (room.state.result.status === Statuses.PLAYING) {
      const player = room.state.players.find((p) => p.id === socketId);
      if (data.nextDirection != null) {
        player.nextDirection = data.nextDirection;
        player.x = data.x;
        player.y = data.y;
      } else if (player.timer <= 0 && data.skill) {
        player.skill = true;
        this.startSkillTimer(room, player);
      } else if (data.haunted) {
        this.invertRoles(room);
      }
      this.updateGameState(room, "gameState");
      player.skill = false;
      room.state.invert = false;
      player.nextDirection = null;
    }
  }

  startSkillTimer(room, player) {
    let secondsLeft = 10;

    room[player.role + "timer"] = setInterval(() => {
      secondsLeft--;
      player.timer = secondsLeft;

      if (secondsLeft <= 0) {
        this.handleSkillTimeout(room, player.role);
      }
    }, 1000);
  }

  handleSkillTimeout(room, role) {
    clearInterval(room[role + "timer"]);
  }

  invertRoles(room) {
    let aux = room.state.players[0].role;
    room.state.players[0].role = room.state.players[1].role;
    room.state.players[1].role = aux;
    room.state.invert = true;

    const haunter = room.state.players.find((p) => p.role === Roles.HAUNTER);
    haunter.nextDirection = null;
  }

  handleTurnTimeout(room) {
    clearInterval(room.turnTimer);
    const pursued = room.state.players.find((p) => p.role === Roles.PURSUED);

    room.state.result.status = Statuses.WIN;
    room.state.result.winner = pursued;

    setTimeout(() => {
      this.updateGameState(room, "gameFinished");
      this.updateGameState(room, "gameState");
    }, 1000);
    this.updateGameState(room, "gameState");
  }
}

module.exports = MazeChase;
