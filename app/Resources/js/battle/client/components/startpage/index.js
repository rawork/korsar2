import React from 'react';
import { observer, inject } from 'mobx-react';

import StartPage from './startpage';

const Component = inject('battleStore')(observer(({ battleStore }) => {
    return (
        <StartPage
            displayTimer={battleStore.timerStore.displayTimer}
        />
    );
}));

Component.displayName = 'StartPage';
export default Component;