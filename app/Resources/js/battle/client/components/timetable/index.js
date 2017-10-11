import React from 'react';
import { observer, inject } from 'mobx-react';

import TimeTable from './timetable';

const Component = inject('battleStore')(observer(({ battleStore }) => {
    return (
        <TimeTable
            displayTimer={battleStore.timerStore.displayTimer}
        />
    );
}));

Component.displayName = 'TimeTable';
export default Component;