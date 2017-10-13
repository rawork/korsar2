const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');

const shotTime = 25;
const questionTime = 35;

let states = [];
let shooters = [];
let teams = [];
let timers = [];
let autoStepIntervals = [];
let beforeIntervals = [];
let stopIntervals = [];
let startTimes = [];
let stopTimes = [];

const getShotTimer = function(battle) {
    return teams[battle].filter(element => element.dead == 6).length < 3 ? 20 : 15;
};

const getQuestionTimer = function(battle) {
    return teams[battle].filter(element => element.dead == 6).length < 3 ? 35 : 25;
};

const getShotStopTime = function(battle) {
    return parseInt((new Date().getTime()/1000)) + getShotTimer(battle);
};

const getNextShooterNum = function(battle, currentNum, level = 0) {
    // из трех игроков двоих не нашли - закончить игру
    if (level >= 2) {
        return 0;
    }

    const newNum = currentNum >= 3 ? 1 : currentNum + 1;

    const nextTeam = teams[battle].find(team => {
        return team.num == newNum && team.dead < 6;
    });

    if (typeof nextTeam == 'undefined') {
        return getNextShooterNum(battle, newNum, level+1)
    }

    return newNum;
};

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('room', function(battle) {
        socket.join(battle);
        console.log('user connected to battle ' + battle);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('newMessage', function(message) {
        console.log('new message', message);
        socket.broadcast.emit('newMessage', message);
    });

    socket.on('next', function(battle) {
        console.log('next', battle);
        states[battle].shooter = getNextShooterNum(battle, states[battle].shooter);
        timers[battle] = shotTime;
        shooters[battle] = states[battle].shooter;
        io.in(battle).emit('next', {battle: battle, shooter: shooters[battle], timer: getShotTimer(battle)});
    });

    socket.on('question', function(battle) {
        console.log('question', battle);
        timers[battle] = questionTime;
    });

    socket.on('stop-game', function(data) {
        console.log('stop-game', data);
        io.emit('stop-game', data);
    });

    socket.on('init-battle', function(data) {
        if (data.battle in states) {
            console.log('already init battle ' + data.battle);
            return;
        }

        console.log('init battle ' + data.battle);

        states[data.battle] = data;
        teams[data.battle] = data.teams;
        shooters[data.battle] = data.shooter;
        timers[data.battle] = getShotTimer(data.battle);
        startTimes[data.battle] = data.timer.start*1000;
        stopTimes[data.battle] = (data.timer.start+data.timer.duration)*1000;

        if (new Date().getTime() < startTimes[data.battle]) {
            // Запустим интервал для проверки начала игры
            beforeIntervals[data.battle] = setInterval(function() {

                console.log('before timer in room' + data.battle);

                if (startTimes[data.battle] <= new Date().getTime()) {
                    clearInterval(beforeIntervals[data.battle]);
                    timers[data.battle] = getShotTimer(data.battle);
                    io.in(data.battle).emit('start game', {battle: data.battle, shooter: shooters[data.battle], timer: timers[data.battle]});
                }
            }, 15000);
        } else {
            // запустим интервал для принудительного автохода для отсутствующих игроков
            autoStepIntervals[data.battle] = setInterval(function() {

                console.log('shot/question timer in battle ' + data.battle + ': ' + timers[data.battle]);

                timers[data.battle]--;

                if (timers[data.battle] <= 0) {
                    io.in(data.battle).emit('automove', {battle: data.battle, shooter: shooters[data.battle]});

                    states[data.battle].shooter = getNextShooterNum(data.battle, states[data.battle].shooter);
                    timers[data.battle] = shotTime;
                    shooters[data.battle] = states[data.battle].shooter;

                    if (states[data.battle].shooter === 0) {
                        clearInterval(stopIntervals[data.battle]);
                        clearInterval(autoStepIntervals[data.battle]);
                        io.in(data.battle).emit('stop game', {stop: true});

                        return;
                    }

                    io.in(data.battle).emit('next', {battle: data.battle, shooter: shooters[data.battle], timer: getShotTimer(data.battle)});
                    io.in(data.battle).emit('update state', {battle: data.battle, state: states[data.battle]})
                }

            }, 1000);
            // обязательно запускаем интервал на проверку окончания игры
            stopIntervals[data.battle] = setInterval(function() {

                console.log('stop game timer in battle ' + data.battle);
                const curtime = new Date().getTime();

                if (stopTimes[data.battle] <= curtime) {
                    clearInterval(stopIntervals[data.battle]);
                    clearInterval(intervals[data.battle]);
                    io.in(data.battle).emit('stop game', {stop: true});
                }
            }, 15000);
        }

    });

    socket.on('shot', function(data){
        states[data.battle] = data.state;
        timers[data.battle] = getShotTimer(data.battle);
        socket.to(data.battle).emit('shot', data);
        socket.to(data.battle).emit('shot', data);
    });

    socket.on('update state', function(data) {

        states[data.battle] = data.state;
        shooters[data.battle] = data.state.shooter;
        timers[data.battle] = getShotTimer(data.battle);

        io.in(data.battle).emit('update state', {battle: data.battle, state: states[data.battle]});
    });
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});
