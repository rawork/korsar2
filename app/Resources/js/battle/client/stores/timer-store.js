import { observable, computed, action, asMap, autorun } from 'mobx';

class TimerStore {
    @observable start;
    @observable duration;
    @observable current;
    @observable stop;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.start = 0;
        this.duration = 0;
        this.current = 0;
        this.stop = 0;
        this.fetch();
    }

    @computed get displayTimer() {
        if (this.isStopped) {
            return 'finish';
        }

        const totalSeconds = this.isStarted
            ? this.stop - this.current
            : this.start - this.current;

        const seconds = totalSeconds % 60;
        const minutes = (totalSeconds - seconds)/60;

        return minutes + ":" + seconds;

    }

    @computed get isStarted() {
        return this.current >= this.start && this.current > 0;
    }

    @computed get isStopped() {
        return this.current >= this.stop && this.stop > 0;
    }

    getTimer() {
        return this.start;
    }

    @action fetch() {
        fetch('/timer', { method: 'GET', credentials: "same-origin", headers: { 'X-Requested-With': 'XMLHttpRequest' }})
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
        let time = parseInt((new Date().getTime()/1000));

        let self = this;
        this.current = time;

        if (!this.isStopped){
            setTimeout(function () {
                self.measure()
            }, 1000);
        }

    }
}

// const timerStore = new TimerStore();
//
// autorun(() => {
//     console.log(timerStore.getTimer());
// });

// export default timerStore;
export default TimerStore;
// export { TimerStore };