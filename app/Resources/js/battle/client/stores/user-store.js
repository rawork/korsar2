import { observable, computed, action, asMap, autorun } from 'mobx';

class User {
    @observable user = observable.map();
    @observable isCurrent;

    constructor(userData = {}, currentUser) {
        this.user.merge(userData);
        this.isCurrent = this.user.get('id') == currentUser;
    }

    @computed get isOver() {
        return this.user.get('dead') == 6;
    }

    @action stop() {
        this.user.set('current', false);
    }

}

class UserStore {
    @observable users;
    @observable currentShooter;
    @observable shotStopTime;
    @observable shotCurrentTime;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.users = [];
        this.currentShooter = 0;
        this.shotStopTime = 0;
        this.shotCurrentTime = 0;
        this.fetch();
    }

    @computed get isShooter() {
        const currentShooter = this.users.find(userStore => {
            return userStore.user.get("current") ;
        });
        if (typeof currentShooter != 'undefined') {
            return currentShooter.user.get('num') == this.currentShooter && currentShooter.isCurrent;
        }

        return false;
    }

    @computed get shotTimer() {
        return this.shotStopTime - this.shotCurrentTime;
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
            this.stop();
            // todo emit 'stopGame';
            // updateState
        } else {
            // todo emit 'nextShooter'
            // updateState
            this.setShotTimer();
        }

    }

    @action stop() {
        this.users.forEach(userStore => {
            userStore.stop();
        })
    }

    @action fetch() {
        fetch('/users', { method: 'GET', credentials: "same-origin", headers: { 'X-Requested-With': 'XMLHttpRequest' }})
            .then(res => res.json())
            .then(json => this.putUsers(json));
    }

    @action setShotTimer() {
        let shotTime = 15;
        if (this.users.filter(userStore => userStore.user.get('dead') < 6).length < 3) {
            shotTime = 10;
        }
        this.shotCurrentTime = parseInt((new Date().getTime()/1000));
        this.shotStopTime = this.shotCurrentTime + shotTime;
        this.measure();
    }

    @action putUsers(data) {
        console.log(data);
        let userArray = [];
        this.currentShooter = data.current;
        data.teams.forEach(user => {
            userArray.push(new User(user, data.iam));
        });
        this.users = userArray;
        if (this.isShooter) {
            this.setShotTimer()
        }
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
}

export default UserStore;