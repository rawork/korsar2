import React from 'react';

const UserListItem = props => {
    const activeClass = props.user.isOver ? ' killed' : '';
    return (
    <div className={`gamer gamer${props.user.get('num')}${activeClass}`}>
        <div className={`ship gamer_${props.user.get('color')}`}></div>
        <div className="info">
            <span className="dead">{props.user.get('dead')} сбито</span>,
            <span className="alive">{props.user.get('alive')} живо</span>
        </div>
        <img className="flag" src={props.user.get('flag')} />
        <div className="name">{props.user.get('name')}</div>
    </div>
    )
};
export default UserListItem;