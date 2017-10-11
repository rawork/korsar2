import { observable, computed, action, asMap, autorun } from 'mobx';

import UserStore from './user-store';
import FieldStore from './field-store';
import TimerStore from './timer-store';
import QuestionStore from './question-store';

class BattleStore {
    constructor() {
        this.userStore = new UserStore(this);
        this.fieldStore = new FieldStore(this);
        this.timerStore = new TimerStore(this);
        this.questionStore = new QuestionStore(this);
    }
}

const battleStore = new BattleStore();

export default battleStore;
export { BattleStore };