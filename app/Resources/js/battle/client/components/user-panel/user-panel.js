import React from 'react';

const UserPanel = props => {
    const message = props.shotTimer > 0 ? 'Ваш ход, торопитесь выбрать клетку ' + props.shotTimer : '';
    return (
        <div className="user-panel">{message}</div>
    );
};

export default UserPanel;