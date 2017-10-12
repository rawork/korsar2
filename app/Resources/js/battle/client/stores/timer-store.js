import { observable, computed, action, asMap, autorun } from 'mobx';

class TimerStore {
    @observable start;
    @observable duration;
    @observable current;
    @observable stop;

    constructor(rootStore, socket) {
        this.rootStore = rootStore;
        this.socket = socket;
        this.start = 0;
        this.duration = 0;
        this.current = 0;
        this.stop = 0;

        this.socket.on('stop-game', this.stopTimer);
    }

    @action stopTimer() {
        this.start = 0;
        this.stop = 1;
        this.current = 2;
    }

    @computed get displayTimer() {
        if (this.isStopped) {
            return 'Завершена';
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
        return this.current >= this.stop;
    }

    @computed get isActive() {
        return this.isStarted && !this.isStopped;
    }

    getTimer() {
        return this.start;
    }

    @action putTimer(data) {
        this.start = data.start;
        this.duration = data.duration;
        this.stop = (this.start + this.duration * 60);
        this.current = data.moment;
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
        } else {
            this.socket.emit('stop-game');
        }

    }
}

export default TimerStore;