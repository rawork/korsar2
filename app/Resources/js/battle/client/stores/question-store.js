import { observable, computed, action, asMap, autorun } from 'mobx';

class QuestionStore {
    @observable question;
    @observable cell;
    @observable stop;
    @observable current;

    constructor(rootStore, socket) {
        this.rootStore = rootStore;
        this.socket = socket;
        this.question = null;
        this.cell = null;
        this.stop = 0;
        this.current = 0;
        this.answerNum = 0;
        this.questionTime = 25;
    }

    @computed get haveQuestion() {
        return this.question != null;
    }

    @computed get displayTimer() {
        return this.stop - this.current;
    }

    @computed get isStopped() {
        return this.current >= this.stop;
    }

    getQuestion() {
        return this.question;
    }

    @action onOpenQuestion(cellName) {
        this.cell = cellName;
        this.rootStore.userStore.shotTimer.stop();
        this.socket.emit('question', this.rootStore.battle);

        console.log('onOpenQuestion',  this.cell);

        fetch('/question?cell=' + this.cell, { method: 'GET', credentials: "same-origin", headers: { 'X-Requested-With': 'XMLHttpRequest' }})
            .then(res => res.json())
            .then(json => this.putQuestion(json));
    }

    @action onAnswer() {
        if (this.answerNum == 0) {
            return;
        }
        console.log('onAnswer', this.question, this.answerNum, this.cell);

        let data = new FormData();
        data.append( "question", this.question.id );
        data.append( "answer", this.answerNum );
        data.append( "cell", this.cell );
        this.clearQuestion();
        fetch('/question', { method: 'POST', body: data, credentials: "same-origin", headers: { 'X-Requested-With': 'XMLHttpRequest' }})
            .then(res => { console.log(res); return res.json()})
            .then(json => this.putAnswer(json));
    }

    @action putQuestion(data) {
        console.log('get question data', data);
        this.socket.emit('question', this.rootStore.battle);
        this.question = data.question;
        this.answerNum = 0;
        this.current =  parseInt(new Date().getTime()/1000);
        this.stop = this.current + (this.rootStore.userStore.users.length < 4 ? parseInt(25*2/3) : 25);
        this.measure();
    }

    @action putAnswer(data) {
        console.log('get answer result', data);

        // todo сделать обновление данных state - дать денег
        this.socket.emit('next', this.rootStore.battle);

    }

    @action clearQuestion() {
        this.question = null;
        this.cell = null;
        this.stop = 0;
        this.current = 0;
    }

    @action setAnswer(num) {
        this.answerNum = num;
    }

    @action measure() {
        let time = parseInt((new Date().getTime()/1000));

        let self = this;
        this.current = time;

        if (!this.isStopped){
            setTimeout(function () {
                self.measure()
            }, 1000);
        } else {
            this.clearQuestion();
            this.socket.emit('next', this.rootStore.battle);
        }

    }

}

export default QuestionStore;