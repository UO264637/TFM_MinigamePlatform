describe('RoomManager', () => {
  let roomManager;

  beforeEach(() => {
    jest.resetModules();
    roomManager = require('../RoomManager');
  });

  test('Create room', () => {
    const roomId = roomManager.createRoom('TicTacToe');
    expect(roomId).toBe(1);
    expect(roomManager.rooms[roomId]).toEqual({
      gameType: 'TicTacToe',
      state: null,
      turnTimer: 0,
    });
  });

  test('Delete room', () => {
    const roomId = roomManager.createRoom('DanceBattle');
    roomManager.deleteRoom(roomId);
    expect(roomManager.rooms[roomId]).toBeUndefined();
  });

  test('Get room by ID', () => {
    const roomId = roomManager.createRoom('ObstacleRaze');
    const room = roomManager.getRoom(roomId);
    expect(room).toEqual({
      gameType: 'ObstacleRaze',
      state: null,
      turnTimer: 0,
    });
  });

  test('Get room by ID (does not exist)', () => {
    roomManager.createRoom('ObstacleRace');
    const room = roomManager.getRoom(111);
    expect(room).toBeNull();
  });


  test('Get room by socket ID', () => {
    const roomId = roomManager.createRoom('MazeChase');
    roomManager.rooms[roomId].state = {
      players: [{ id: 'socket1', playerName: 'player1' }],
    };
    const room = roomManager.getRoomBySocketId('socket1');
    expect(room).toEqual(roomManager.rooms[roomId]);
  });

  test('Get by socket ID (does not exist)', () => {
    const room = roomManager.getRoomBySocketId('non-existent-socket');
    expect(room).toBeNull();
  });

  test('Get waiting rooms', () => {
    const room1 = roomManager.createRoom('CabooseCount');
    const room2 = roomManager.createRoom('TicTacToc');
    const room3 = roomManager.createRoom('DanceBattle');
    roomManager.rooms[room1].state = {
      result: { status: 'waiting' },
      players: [{ id: 'socket1', playerName: 'player1' }],
      maxPlayers: 2,
    };
    roomManager.rooms[room2].state = {
      result: { status: 'playing' },
      players: [{ id: 'socket2', playerName: 'player2' }],
      maxPlayers: 2,
    };
    roomManager.rooms[room3].state = {
      result: { status: 'playing' },
      players: [{ id: 'socket3', playerName: 'player3' }, { id: 'socket4', playerName: 'player4' }],
      maxPlayers: 2,
    };
    const waitingRooms = roomManager.getWaitingRooms();
    expect(waitingRooms).toEqual([
      {
        roomId: room1.toString(),
        gameType: 'CabooseCount',
        players: ['player1'],
        status: 'waiting',
      },
    ]);
  });
});
