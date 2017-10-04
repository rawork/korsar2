import React from 'react';

const UserListItem = props => (
    <div className={`gamer gamer${props.num}`}>
        <div className={`ship gamer_${props.color}`}></div>
        <div className="info">
            <span className="dead">3 сбито</span>,
            <span className="alive">3 живо</span>
        </div>
        <img className="flag" src={props.flag} />
        <div className="name">{props.name}</div>
    </div>

);
export default UserListItem;