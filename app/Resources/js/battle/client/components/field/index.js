import React from 'react';
import { observer, inject } from 'mobx-react';

import Field from './field';

const Component = inject('battleStore')(observer(({ battleStore }) => {
    return (
        <Field
            cells={battleStore.fieldStore.getCells()}
            openQuestion={(name) => battleStore.questionStore.openQuestion(name)}
        />
    );
}));

Component.displayName = 'Field';
export default Component;