import { observable, computed, action, asMap, autorun } from 'mobx';

class TimerStore {
    @observable start;
    @observable duration;
    @observable current;
    @observable stop;

    constructor() {
        this.start = 0;
        this.duration = 0;
        this.current = 0;
        this.stop = 0;
        this.fetch();
    }

    @computed get displayTimer() {
        let seconds = this.stop - this.current;
        let minutes = (seconds-seconds%60)/60;
        seconds = seconds%60;

        if ( seconds == 0 && minutes == 0) {
            return 'finish';
        }

        return minutes + ":" + seconds;
    }

    @computed get isStarted() {
        return this.current >= this.start;
    }
    @computed get isStopped() {
        return this.current >= this.stop;
    }

    getTimer() {
        return this.start;
    }

    @action fetch() {
        fetch('/timer', { method: 'GET', credentials: "same-origin" })
            .then(res => { console.log(res); return res.json()})
            .then(json => this.putTimer(json));
    }

    @action putTimer(data) {
        this.start = data.start;
        this.duration = data.duration;
        this.stop = (this.start + this.duration * 60);
        this.current = data.current;
        this.measure();
    }

    @action measure() {
        let self = this;
        this.current += 1;

        if (!this.isStopped){
            setTimeout(function () {
                self.measure()
            }, 1000);
        }

    }
}

const timerStore = new TimerStore();

autorun(() => {
    console.log(timerStore.getTimer());
});

export default timerStore;
export { TimerStore };