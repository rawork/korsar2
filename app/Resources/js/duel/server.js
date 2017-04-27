const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');

const stepTime = 60;

let gameState = null;
let interval = null;
let timer = null;
let marker = null;
let beforeInterval = null;
let stopInterval = null;
let startTime = null;
let stopTime = null;

io.on('connection', function(socket){
    console.log('a user connected to duel');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('init game', function(data) {
        if (gameState && startTime == data.starttime*1000) {
            return;
        }

        // console.log('init game');

        gameState = data.state;

        // console.log('init', gameState);

        timer = stepTime;
        startTime = data.starttime*1000;
        stopTime = data.stoptime*1000;

        const dt = new Date();

        if (dt.getTime() < startTime) {
            // Запустим интервал для проверки начала игры

            // console.log('init game before');
            beforeInterval = setInterval(function() {

                // console.log('before game timer');

                const curdate = new Date();
                const curtime = curdate.getTime();

                if (startTime <= curtime) {
                    clearInterval(beforeInterval);
                    interval = setInterval(function() {

                        console.log('after before step timer: ' +timer);
                        console.log('after before step state: ' +gameState);

                        timer--;

                        if (timer <= 0) {
                            timer = stepTime;
                            gameState.step = parseInt(gameState.step) + 1;

                            if (gameState.step > 25) {
                                clearInterval(stopInterval);
                                clearInterval(interval);
                                io.emit('stop game', {stop: true});
                            }

                            marker = gameState.who_run = (marker == 'user1' ? 'user2' : 'user1');
                            io.emit('update state', {state: gameState});
                        }

                    }, 1000);
                    io.emit('start game', {start: true});
                }
            }, 15000);
        } else {
            interval = setInterval(function() {

                // console.log('step timer: ' +timer);
                // console.log('step state: ' +gameState);

                timer--;

                if (timer <= 0) {
                    timer = stepTime;
                    gameState.step = parseInt(gameState.step) + 1;
                    if (gameState.step > 25) {
                        clearInterval(stopInterval);
                        clearInterval(interval);
                        io.emit('stop game', {stop: true});
                        return;
                    }

                    marker = gameState.who_run = (marker == 'user1' ? 'user2' : 'user1');
                    io.emit('update state', {state: gameState});
                }

            }, 1000);
        }


        // console.log('init game stop');
        // обязательно запускаем интервал на проверку окончания игры
        stopInterval = setInterval(function() {

            // console.log('stop game timer');

            const curdate = new Date();
            const curtime = curdate.getTime();

            if (stopTime <= curtime) {
                clearInterval(stopInterval);
                clearInterval(interval);
                io.emit('stop game', {state: gameState});

            }
        }, 15000);
    });

    socket.on('move', function(data){
        gameState = data.state;

        gameState.answers[data.marker] = parseInt(gameState.answers[data.marker]) + parseInt(data.num);
        gameState.step++;
        if (gameState.step > 25) {
            clearInterval(stopInterval);
            clearInterval(interval);
            io.emit('stop game', {state: gameState});
            return;
        }
        marker = gameState.who_run = (gameState.who_run == 'user1' ? 'user2' : 'user1');
        timer = stepTime;

        // console.log('move update', gameState);

        io.emit('update state', {state: gameState});
    });

});

http.listen(8080, function(){
    console.log('listening on *:8080');
});
