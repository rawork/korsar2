import React from 'react';

const Cell = props => {
    const activeClass = props.type + (props.type == "" && props.isShooter  ? ' active' : '');
    if (props.type == "" && props.isShooter) {
        return (
            <div
                className={`cell cell${props.name} ${activeClass}`}
                onClick={() => props.onOpenQuestion(props.name)}
            />
        )
    } else {
        return (
            <div
                className={`cell cell${props.name} ${activeClass}`}
            />
        )
    }
};
export default Cell;