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
        this.stoped = false;
        this.socket = socket;
    }

    @computed get currentValue() {
        return this.stopTime - this.currentTime;
    }

    @computed get isStopped() {
        return this.currentTime >= this.stopTime;
    }

    @action measure() {
        if (this.stoped) {
            this.socket.emit('question', this.rootStore.battle);
        }
        let self = this;
        this.currentTime = parseInt((new Date().getTime()/1000));

        if (!this.isStopped){
            setTimeout(function () {
                self.measure()
            }, 1000);
        } else {
            this.socket.emit('next', this.rootStore.battle);
        }

    }

    @action stop() {
        this.stoped = false;
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
        this.socket.on('next', (data) => this.setNext(data));
        this.socket.on('stop-game', () => this.stop());
        this.socket.on('update state', (data) => this.setState(data));
    }

    @computed get isShooter() {
        console.log('isShooter', this.currentShooter);
        if (this.currentShooter == null || this.currentShooter == 0 ) {
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

    getUsers() {
        return this.users;
    }

    @action setNext(data) {
        console.log('next', data, this.isShooter);
        this.currentShooter = data.shooter;
        if (this.isShooter) {
            this.setShotTimer(data.timer)
        }
    }

    @action setState(data) {
        console.log('update state', data);
    }

    @action next(){
        console.log('next shooter');
        if (this.currentShooter === 0) {
            // updateState
            this.socket.emit('stop-game');
        } else {
            // updateState
            this.socket.emit('next', this.rootStore.battle);
        }
    }

    @action putUsers(teams, shooterNum, userId) {
        let userArray = [];
        teams.forEach(team => {
            userArray.push(new User(team, userId));
        });
        this.users = userArray;
        this.currentShooter = shooterNum;
        if (this.isShooter) {
            this.setShotTimer(15)
        }
    }

    @action setShotTimer(shotTimer) {
        this.shotTimer.stopTime = parseInt((new Date().getTime()/1000)) + shotTimer;
        this.shotTimer.currentTime = parseInt((new Date().getTime()/1000));
        this.shotTimer.measure();
    }

    @action stop() {
        this.currentShooter = 0;
    }
}

export default UserStore;