import React from 'react';

const Cell = props => {
    const activeClass = props.type + (props.type == ""  ? ' active' : '');
    if (props.type == "") {
        return (
            <div
                className={`cell cell${props.name} ${activeClass}`}
                onClick={() => props.openQuestion(props.name)}
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