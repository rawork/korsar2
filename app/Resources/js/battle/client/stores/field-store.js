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
    }

    getCells() {
        return this.cells;
    }

    @action putCells(cells) {
        let rawCellArray = [];
        let name = '';
        let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        let k = 1;
        for (let i = 1; i < 11; i++) {
            for(let j of letters) {
                let stateCell = cells.find(element => element.name === i+j, i+j);
                if (typeof stateCell != 'undefined') {
                    stateCell.id = k;
                    rawCellArray.push(stateCell);
                } else {
                    name = i + j;

                    rawCellArray.push({
                        "id": k,
                        "name": name,
                        "type": '',
                        "color": '',
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

export default FieldStore;