import React from 'react';
import { observer, inject } from 'mobx-react';

import Modal from './modal';

const Component = inject('battleStore')(observer(({ battleStore }) => {
    return (
        <Modal
            showModal={battleStore.questionStore.haveQuestion}
            question={battleStore.questionStore.question}
            answerTimer={battleStore.questionStore.displayTimer}
            setAnswer={(num) => battleStore.questionStore.setAnswer(num)}
            onAnswer={() => battleStore.questionStore.onAnswer()}
        />
    );
}));

Component.displayName = 'Modal';
export default Component;