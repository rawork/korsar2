import { observable, computed, action, asMap, autorun } from 'mobx';

class Cell {
    @observable cell = observable.map();

    constructor(cellData = {}) {
        this.cell.merge(cellData);
    }

    @action shot() {
        this.cell.set("type", "cell-empty");
        // todo save to server, socketIO emit
    }
}

class FieldStore {
    @observable cells;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.cells = [];
        this.fetch();
    }

    getCells() {
        return this.cells;
    }

    @action fetch() {
        fetch('/field', { method: 'GET', credentials: "same-origin", headers: { 'X-Requested-With': 'XMLHttpRequest' }})
            .then(res => { console.log(res); return res.json()})
            .then(json => this.putCells(json));
    }

    @action putCells(cells) {
        let rawCellArray = [];
        let type = '';
        let color = '';
        let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        let k = 1;
        let name = '';
        for (let i = 1; i < 11; i++) {
            for(let j of letters) {
                let currentCell = cells.find(element => element.name === i+j, i+j);
                if (typeof currentCell != 'undefined') {
                    currentCell.id = k;
                    rawCellArray.push(currentCell);
                } else {
                    name = i + j;

                    rawCellArray.push({
                        "id": k,
                        "name": name,
                        "type": type,
                        "color": color,
                    })
                }
                k++;
            }
        }

        let cellArray = [];
        rawCellArray.forEach(cell => {
            cellArray.push(new Cell(cell));
        });
        this.cells = cellArray;
    }
}

// const fieldStore = new FieldStore();
//
// autorun(() => {
//     console.log(fieldStore.getCells().toJS());
// });
//
// export default fieldStore;
export default FieldStore;
// export { FieldStore };