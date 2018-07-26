
exports.onConnection = function(io) {
    io.on('connection', (socket) => {
        this.eventRoom(io, socket);
        this.disconnecting(io, socket);
    });
};

exports.eventRoom = function(io, socket) {
    socket.on('event-room', (room) => {
        socket.join(room, () => {
            io.sockets.in(room).emit('event-numclient', io.sockets.adapter.rooms[room].length);
        });
    });
};

exports.disconnecting = function(io, socket) {
    socket.on('disconnecting', () => {
        Object.keys(socket.rooms).map(room => {
            // Set timeout to let the socket to disconnect
            setTimeout(() => {
                if (io.sockets.adapter.rooms[room]) {
                    io.sockets.in(room).emit('event-numclient', io.sockets.adapter.rooms[room].length);
                }
            }, 100);
        });
    });
};

exports.emit = function(io, room, key, data) {
    if(typeof data === 'object') {
        io.sockets.in(room).emit(key, Object.assign({}, data));
    } else {
        io.sockets.in(room).emit(key, data);
    }
};
