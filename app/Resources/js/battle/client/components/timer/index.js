import React from 'react';
import { observer, inject } from 'mobx-react';

import Timer from './timer';

const Component = inject('timerStore')(observer(({ timerStore }) => {
    return (
        <Timer
            displayTimer={timerStore.displayTimer}
        />
    );
}));

Component.displayName = 'Timer';
export default Component;