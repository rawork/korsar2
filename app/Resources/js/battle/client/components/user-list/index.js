import React from 'react';
import { observer, inject } from 'mobx-react';

import UserList from './user-list';

const Component = inject('battleStore')(observer(({ battleStore }) => {
    return (
        <UserList
            users={battleStore.userStore.getUsers()}
            currentShooter={battleStore.userStore.currentShooter} />
    );
}));

Component.displayName = 'UserList';
export default Component;