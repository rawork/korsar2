import React from 'react';
import { observer, inject } from 'mobx-react';

import Field from './field';

const Component = inject('fieldStore')(observer(({ fieldStore }) => {
    return (
        <Field
            cells={fieldStore.getCells()}
        />
    );
}));

Component.displayName = 'Field';
export default Component;