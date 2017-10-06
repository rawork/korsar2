import React from 'react';

const UserListArrow = props => {
    const additionalClass = props.current ? ' active' : '';

    return (
    <div className={`arrow arrow${props.num} ${additionalClass}`}></div>
    )
};
export default UserListArrow;