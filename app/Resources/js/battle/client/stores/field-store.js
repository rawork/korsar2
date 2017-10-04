import { observable, computed, action, asMap, autorun } from 'mobx';

class Cell {
    @observable cell = observable.map();

    constructor(cellData = {}) {
        this.user.merge(cellData);
    }

    @computed get userInfo() {
        return `${this.user.get("name")} - ${this.user.get("age")}`;
    }

    @computed get posXY() {
        return `${this.user.get('posX')}${this.user.get('posY')}`;
    }

    @action shot() {
        this.cell.set("checked", !this.user.get("checked"));
        // todo save to server, socketIO emit
    }
}

class FieldStore {
    @observable cells;

    constructor() {
        this.cells = [];
        this.fetch();
    }

    getCells() {
        return this.cells;
    }

    @action fetch() {
        fetch('/field', { method: 'GET', credentials: "same-origin"})
            .then(res => { console.log(res); return res.json()})
            .then(json => this.putCells(json));
    }

    @action putCells(cells) {
        let cellArray = [];
        cells.forEach(cell => {
            cellArray.push(new Cell(cell));
        });
        this.cells = cellArray;
    }
}

const fieldStore = new FieldStore();

autorun(() => {
    console.log(fieldStore.getCells().toJS());
});

export default fieldStore;
export { FieldStore };