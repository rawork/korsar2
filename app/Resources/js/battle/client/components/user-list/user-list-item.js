import React from 'react';

const UserListItem = props => (
    <div className={`gamer gamer${props.num}`}>
        <div className={`ship gamer_${props.color}`}></div>
        <div className="info">
            <span className="dead">{props.dead} сбито</span>,
            <span className="alive">{props.alive} живо</span>
        </div>
        <img className="flag" src={props.flag} />
        <div className="name">{props.name}</div>
    </div>

);
export default UserListItem;