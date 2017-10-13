import { observable, computed, action, asMap, autorun } from 'mobx';

import UserStore from './user-store';
import FieldStore from './field-store';
import TimerStore from './timer-store';
import QuestionStore from './question-store';

class BattleStore {
    @observable user;
    @observable battle;
    @observable shotTimer;

    constructor(socket) {
        this.socket = socket;
        this.userStore = new UserStore(this, socket);
        this.timerStore = new TimerStore(this, socket);
        this.questionStore = new QuestionStore(this, socket);
        this.fieldStore = new FieldStore(this);
        this.fetchData();
    }

    @action fetchData() {
        fetch('/api/battle/data', { method: 'GET', credentials: "same-origin", headers: { 'X-Requested-With': 'XMLHttpRequest' }})
            .then(res => res.json())
            .then(json => this.putData(json));
    }

    @action putData(data) {
        this.socket.emit('room', data.battle);
        this.socket.emit('init-battle', data);
        this.user = data.user;
        this.battle = data.battle;

        this.timerStore.putTimer(data.timer);
        this.userStore.putUsers(data.teams, data.shooter, this.user);
        this.fieldStore.putCells(data.field);
    }
}

export default BattleStore;