import React from 'react';

/* components */
import Cell from './cell';

const Field = props => {
    return (
    <div>
        <div className="battlefield"></div>
        {props.cells.map(fieldStore => {
            return (
                <Cell
                    key={fieldStore.cell.get('id')}
                    name={fieldStore.cell.get('name')}
                    type={fieldStore.cell.get('type')}
                    openQuestion={(name) => props.openQuestion(name)}
                />);
        })}
    </div>
    );
};

export default Field;