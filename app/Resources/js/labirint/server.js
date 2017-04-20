const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('move', function(data){
        io.emit('move', data);
    });

    socket.on('update state', function(state) {
        io.emit('update state', state);
    });
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});
