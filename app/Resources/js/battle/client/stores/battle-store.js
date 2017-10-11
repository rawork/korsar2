import { observable, computed, action, asMap, autorun } from 'mobx';

import UserStore from './user-store';
import FieldStore from './field-store';
import TimerStore from './timer-store';
import QuestionStore from './question-store';

class BattleStore {
    constructor(socket) {
        this.userStore = new UserStore(this, socket);
        this.fieldStore = new FieldStore(this, socket);
        this.timerStore = new TimerStore(this, socket);
        this.questionStore = new QuestionStore(this, socket);
    }
}

export default BattleStore;