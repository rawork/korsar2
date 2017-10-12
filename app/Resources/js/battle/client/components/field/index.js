import React from 'react';
import { observer, inject } from 'mobx-react';

import Field from './field';

const Component = inject('battleStore')(observer(({ battleStore }) => {
    return (
        <Field
            cells={battleStore.fieldStore.getCells()}
            isShooter={battleStore.userStore.isShooter}
            onOpenQuestion={(name) => battleStore.questionStore.onOpenQuestion(name)}
        />
    );
}));

Component.displayName = 'Field';
export default Component;