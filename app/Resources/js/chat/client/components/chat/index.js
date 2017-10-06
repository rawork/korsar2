import React from 'react';
import { observer, inject } from 'mobx-react';

import Chat from './chat';

const Component = inject('chatStore')(observer(({ chatStore }) => {
    return (
        <Chat
            messages={chatStore.getMessages()}
        />
    );
}));

Component.displayName = 'Chat';
export default Component;