import React from 'react';

const Cell = props => {

    // let cellTypes = ['ship-red','ship-brown','ship-green','ship-red-killed', 'ship-brown-killed', 'ship-green-killed', 'cell-empty', 'imperial-part'];
    const activeClass = props.type + (props.type == ""  ? ' active' : '');

    return (
        <div className={`cell cell${props.name} ${activeClass}`}></div>

)};
export default Cell;