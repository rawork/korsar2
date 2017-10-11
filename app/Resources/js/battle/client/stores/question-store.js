import { observable, computed, action, asMap, autorun } from 'mobx';

class QuestionStore {
    @observable question;
    @observable cell;
    @observable stop;
    @observable current;

    constructor(rootStore) {
        this.rootStore = rootStore;
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

    @action openQuestion(cellName) {
        this.cell = cellName;

        fetch('/question?cell='+cellName, { method: 'GET', credentials: "same-origin", headers: { 'X-Requested-With': 'XMLHttpRequest' }})
            .then(res => { console.log(res); return res.json()})
            .then(json => this.putQuestion(json));
    }

    @action answer() {
        if (this.answerNum == 0) {
            return;
        } else {
            console.log(this.answerNum);
            this.clearQuestion();
            return;
        }
        let data = new FormData();
        data.append( "question", this.question.id );
        data.append( "answer", this.answerNum );
        fetch('/question', { method: 'POST', body: data, credentials: "same-origin", headers: { 'X-Requested-With': 'XMLHttpRequest' }})
            .then(res => { console.log(res); return res.json()})
            .then(json => this.putAnswer(json));
    }

    @action putQuestion(data) {
        this.question = data.question;
        this.answerNum = 0;
        this.current =  parseInt(new Date().getTime()/1000);
        this.stop = this.current + 25;
        this.measure();
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

    @action putAnswer(data) {

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
            //this.rootStore.userStore.nextStep()
        }

    }

}

export default QuestionStore;