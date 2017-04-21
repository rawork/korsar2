const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', '..', '..', '..', 'data', 'labirint', 'labirint.json');
const labirintData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const stepTime = 30;

let states = [];
let markers = [];
let intervals = [];
let timers = [];

let autoStep = function(marker, state, num) {
    let index = parseInt(marker.replace('marker', ''));

    let foundNext = false;
    let j = 0;
    while (!foundNext) {
        if (index < 4) {
            index++;
        } else {
            index = 1;
        }

        if (parseInt(state.wait['marker'+index]) == 1) {
            state.wait['marker'+index] = 0;
        } else if (parseInt(state.lives['marker'+index]) > 0
            && parseInt(state.positions['marker'+index]) < 100 ) {
            foundNext = true;
        }

        j++;
        if (j > 5) {
            break;
        }
    }

    state.who_run = 'marker'+index;

    state.positions[marker] = parseInt(state.positions[marker]) + parseInt(num);

    if (state.positions[marker] > 100) {
        state.positions[marker] = 100;
    }

    if ('step'+state.positions[marker] in labirintData.steps) {
        const rule = labirintData.steps['step'+state.positions[marker]];
        switch (rule.type) {
            case 'death':
                state.positions[marker] = 0;
                state.lives[marker] = parseInt(state.lives[marker]) - 1;
                break;
            case 'go':
                state.positions[marker] = parseInt(rule.step);
                break;
            case 'time':
                state.wait[marker] = 1;
                break;
            case 'money':
                state.money[marker] = parseInt(state.money[marker]) + parseInt(rule.money)
                break;
            case 'chest':
                state.chest[marker] = parseInt(state.chest[marker]) + 1
                break;
            case 'rom':
                state.rom[marker] = parseInt(state.rom[marker]) + 1
                break;
            case 'coffee':
                state.coffee[marker] = parseInt(state.coffee[marker]) + 1
                break;
        }
    }

    //console.log('autostep', state);

    return state;
}

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('init game', function(data) {

        if (data.ship in states) {
            return;
        }

        //console.log('init game');

        states[data.ship] = data.state;
        markers[data.ship] = data.state.who_run;
        timers[data.ship] = stepTime;

        intervals[data.ship] = setInterval(function() {

            //console.log(timers[data.ship]);

            timers[data.ship]--;

            if (timers[data.ship] == 0) {
                timers[data.ship] = stepTime;
                const num = Math.floor(Math.random()*6+1);
                io.emit('automove', {ship: data.ship, marker: markers[data.ship], num});
                state = autoStep(markers[data.ship], states[data.ship], num);
                markers[data.ship] = state.who_run;
                io.emit('change marker', {ship: data.ship, marker: markers[data.ship]});
                io.emit('update state', {ship: data.ship, state: state})
            }

        }, 1000);
    });

    socket.on('move', function(data){
        timers[data.ship] = stepTime;
        io.emit('move', data);
    });

    socket.on('stop game', function (data) {
        clearInterval(intervals[data.ship]);
    });

    socket.on('update state', function(data) {

        states[data.ship] = data.state;
        markers[data.ship] = data.state.who_run;
        timers[data.ship] = stepTime;

        io.emit('update state', {ship: data.ship, state: states[data.ship]});
    });
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});
