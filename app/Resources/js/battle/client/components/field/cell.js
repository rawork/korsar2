import React from 'react';

const Cell = props => {
    const activeClass = props.cell.get('type') + (props.cell.get('type') == "" && props.isShooter  ? ' active' : '');
    if (props.cell.get('type') == "" && props.isShooter) {
        return (
            <div
                className={`cell cell${props.cell.get('name')} ${activeClass}`}
                onClick={() => props.onOpenQuestion(props.cell.get('name'))}
            />
        )
    } else {
        return (
            <div
                className={`cell cell${props.cell.get('name')} ${activeClass}`}
            />
        )
    }
};
export default Cell;