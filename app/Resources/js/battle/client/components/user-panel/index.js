import React from 'react';
import { observer, inject } from 'mobx-react';

import UserPanel from './user-panel';

const Component = inject('battleStore')(observer(({ battleStore }) => {
    return (
        <UserPanel
            shotTimer={battleStore.userStore.shotTimer}
        />
    );
}));

Component.displayName = 'UserPanel';
export default Component;