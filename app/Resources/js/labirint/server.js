const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

io.sockets.on('connection', function (socket) {
    socket.on('user message', function (msg) {
        socket.broadcast.emit('user message', socket.nickname, msg);
    });

    socket.on('nickname', function (nick, fn) {
        if (nicknames[nick]) {
            fn(true);
        } else {
            fn(false);
            nicknames[nick] = socket.nickname = nick;
            socket.broadcast.emit('announcement', nick + ' connected');
            io.sockets.emit('nicknames', nicknames);
        }
    });

    socket.on('disconnect', function () {
        if (!socket.nickname) return;

        delete nicknames[socket.nickname];
        socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
        socket.broadcast.emit('nicknames', nicknames);
    });
});

http.listen(3000, function(){
    console.log('listening on *:8080');
});
