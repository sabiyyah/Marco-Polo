const Marco = require('./marco');
const Polo = require('./polo');

class Game {
    constructor () {
        this.sockets = {};
        this.allPlayers = {};
        this.marco = {};
        this.polos = {};
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
    }

    addPlayer(player) {
        this.allPlayers[player.id] = player;
    }

    addMarco(socket, username) {
        this.sockets[socket.id] = socket;

        const x = 0;
        const y = 0;
        this.marco[socket.id] = new Marco(socket.id, username, x, y);
        this.addPlayer(this.marco[socket.id]);
    }

    addPolo(socket, username) {
        this.sockets[socket.id] = socket;

        const x = 0;
        const y = 0;
        this.polos[socket.id] = new Polo(socket.id, username, x, y)
        this.addPlayer(this.polos[socket.id]);
    }
}