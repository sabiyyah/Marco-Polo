let io;

const Room = require("./models/room");

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object
// const codeToRoomMap = {}; // maps game ID to socket room

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
};

const updateLobbiesAll = (socket) => {
  socket.emit("updateLobbies");
}

const userJoinRoom = (user, gameId) => {
  const userSocket = userToSocketMap[user._id];
  userSocket.join(gameId);
};

const userLeaveGame = (socket) => {
  io.emit("updateLobbiesAll");
  let roomKeys = Object.keys(socket.rooms);
  let socketIdIndex = roomKeys.indexOf( socket.id );
  roomKeys.splice( socketIdIndex, 1 );
  let user = getUserFromSocketID(socket.id);
  
  if (user) {
    let gameId = roomKeys[0];
    let userId = user._id;
    Room.findOne({ gameId: gameId }).then((room) => {
      if (room) {
        room.numberJoined--;
        const index = room.players.indexOf(userId);
        if (index) {
          room.players.splice(index, 1);
        }
        room.save();
      }
    });
  }
}

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("updateLobbies", () => io.emit("updateLobbiesAll"));
      socket.on("logout", () => userLeaveGame(socket));
      socket.on('disconnecting', () => userLeaveGame(socket));
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,
  userJoinRoom: userJoinRoom,
  updateLobbiesAll : updateLobbiesAll,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
