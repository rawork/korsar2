import { observable, computed, action, asMap, autorun } from 'mobx';

class User {
    @observable user = observable.map();
    @observable isCurrent;

    constructor(teamData = {}, userId) {
        this.user.merge(teamData);
        this.isCurrent = this.user.get('shooter_id') == userId;
    }

    @computed get isOver() {
        return this.user.get('dead') == 6;
    }
}

class ShotTimer {
    @observable stopTime;
    @observable currentTime;

    constructor(rootStore, socket){
        this.rootStore = rootStore;
        this.stopTime = 0;
        this.currentTime = 0;
        this.socket = socket;
    }

    @computed get currentValue() {
        return this.stopTime - this.currentTime;
    }
}

class UserStore {
    @observable users;
    @observable currentShooter;
    @observable shotTimer;

    constructor(rootStore, socket) {
        this.rootStore = rootStore;
        this.users = [];
        this.currentShooter = 0;
        this.shotTimer = new ShotTimer(rootStore, socket);

        this.socket = socket;
        this.socket.on('next', this.setNext);
        this.socket.on('stop-game', this.stop);
    }

    @action setNext(data) {
        this.currentShooter = data.shooter;
        if (this.isShooter && this.rootStore.timerStore.isActive) {
            this.setShotTimer(data.timer)
        }
    }

    @computed get isShooter() {
        console.log('isShooter', this.currentShooter);
        if (typeof this.currentShooter == 'undefined' || this.currentShooter == 0 ) {
            return false;
        }
        const shooter = this.users.find(userStore => {
            return userStore.user.get('num') ==  this.currentShooter;
        });

        if (typeof shooter != 'undefined') {
            return shooter.isCurrent;
        }

        return false;
    }

    @computed get isStopped() {
        return this.shotCurrentTime >= this.shotStopTime;
    }

    getUsers() {
        return this.users;
    }

    @action addMoney(){

    }

    getNextShooterNum(currentNum, level = 0) {
        // из трех игроков двоих не нашли - закончить игру
        if (level >= 2) {
            return 0;
        }

        let newNum = currentNum + 1;
        if (newNum > 3) {
            newNum = 1
        }

        const nextShooter = this.users.find(userStore => {
            return userStore.user.get('num') == newNum;
        });

        if (typeof nextShooter == 'undefined') {
            return getNextShooterNum(newNum, level+1)
        }

        return newNum;
    }

    @action next(){
        console.log('next shooter');

        this.currentShooter = this.getNextShooterNum(this.currentShooter);
        console.log('currentShooter', this.currentShooter);
        if (this.currentShooter === 0) {
            // updateState
            this.socket.emit('stop-game');
        } else {
            // updateState
            this.socket.emit('next', this.currentShooter);
        }

    }

    @action putUsers(teams, shooterNum, userId) {
        let userArray = [];
        this.currentShooter = shooterNum;
        teams.forEach(team => {
            userArray.push(new User(team, userId));
        });
        this.users = userArray;
        if (this.isShooter && this.rootStore.timerStore.isActive) {
            this.setShotTimer()
        }
    }

    @action setShotTimer(shotStopTime) {
        this.shotStopTime = shotStopTime;
        this.shotCurrentTime = parseInt((new Date().getTime()/1000));
        // let shotTime = 15;
        // if (this.users.filter(userStore => !userStore.isOver).length < 3) {
        //     shotTime = 10;
        // }
        //
        // this.shotStopTime = this.shotCurrentTime + shotTime;
        this.measure();
    }

    @action measure() {
        let time = parseInt((new Date().getTime()/1000));

        let self = this;
        this.shotCurrentTime = time;

        if (!this.isStopped){
            setTimeout(function () {
                self.measure()
            }, 1000);
        } else {
            this.next();
        }

    }

    @action stop() {
        this.currentShooter = 0;
    }
}

export default UserStore;