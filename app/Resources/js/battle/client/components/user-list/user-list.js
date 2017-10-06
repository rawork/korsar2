import React from 'react';

/* components */
import UserListItem from './user-list-item';
import UserListArrow from './user-list-arrow';
import UserListMark from './user-list-mark';

const UserList = props => {
    return (
        <div>
            {props.users.map(userStore => {
                return (
                    <UserListItem
                        key={userStore.user.get('shooter_id')}
                        num={userStore.user.get('num')}
                        color={userStore.user.get('color')}
                        name={userStore.user.get('name')}
                        flag={userStore.user.get('flag')}
                        alive={userStore.user.get('alive')}
                        dead={userStore.user.get('dead')}
                         />);
            })}
            {props.users.map(userStore => {
                return (
                    <UserListArrow
                        key={userStore.user.get('shooter_id')}
                        num={userStore.user.get('num')}
                        current={userStore.user.get('current')}
                         />);
            })}
            {props.users.map(userStore => {
                return (
                    <UserListMark
                        key={userStore.user.get('shooter_id')}
                        color={userStore.user.get('color')}
                         />);
            })}
        </div>
    );
};

export default UserList;