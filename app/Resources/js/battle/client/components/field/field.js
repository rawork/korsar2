import React from 'react';

/* components */
import Cell from './cell';

const Field = props => {
    return (
    <div>
        <div className="battlefield" htmlFor={props.shotTimer}></div>
        {props.cells.map(fieldStore => {
            return (
                <Cell
                    key={fieldStore.cell.get('id')}
                    cell={fieldStore.cell}
                    isShooter={props.isShooter}
                    onOpenQuestion={(name) => props.onOpenQuestion(name)}

                />);
        })}
    </div>
    );
};

export default Field;