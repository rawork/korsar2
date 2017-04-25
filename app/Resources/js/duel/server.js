const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');

const stepTime = 60;

let state = {};
let interval = null;
let timer = null;
let marker = null;
let beforeInterval = null;
let stopInterval = null;
let startTime = null;
let stopTime = null;

function startStepInterval(io) {
    interval = setInterval(function() {

        console.log('step timer: ' +timer);

        timer--;

        if (timer <= 0) {
            timer = stepTime;
            state.step++;
            if (state.step > 25) {
                clearInterval(stopInterval);
                clearInterval(interval);
                io.emit('stop game', {stop: true});
                return;
            }

            marker = state.who_run = marker == 'user1' ? 'user2' : 'user1';
            io.emit('update state', {state: state});
        }

    }, 1000);
};

io.on('connection', function(socket){
    console.log('a user connected to duel');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('init game', function(data) {
        if (state) {
            return;
        }

        state = data.state;
        timer = stepTime;
        startTime = data.starttime*1000;
        stopTime = data.stoptime*1000;

        const dt = new Date();

        if (dt.getTime() < startTime) {
            // Запустим интервал для проверки начала игры
            beforeInterval = setInterval(function() {

                console.log('before timer');

                const curdate = new Date();
                const curtime = curdate.getTime();

                if (startTime <= curtime) {
                    clearInterval(beforeInterval);
                    startStepInterval(io);
                    io.emit('start game', {start: true});
                }
            }, 15000);
        } else {
            startStepInterval(io);
        }

        // обязательно запускаем интервал на проверку окончания игры
        stopInterval = setInterval(function() {

            console.log('stop game timer');

            const curdate = new Date();
            const curtime = curdate.getTime();

            if (stopTime <= curtime) {
                clearInterval(stopInterval);
                clearInterval(interval);
                io.emit('stop game', {stop: true});

            }
        }, 15000);
    });

    socket.on('move', function(data){
        timer = stepTime;
        state = data.state;
        state.answers[data.marker] += data.num;
        marker = state.who_run = (data.state.who_run == 'user1' ? 'user2' : 'user1');
        timer = stepTime;

        io.emit('update state', {state: state});
    });

});

http.listen(8080, function(){
    console.log('listening on *:8080');
});
