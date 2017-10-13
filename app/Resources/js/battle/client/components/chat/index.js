import React from 'react';
import { observer, inject } from 'mobx-react';

import Chat from './chat';

const Component = inject('chatStore')(observer(({ chatStore }) => {
    return (
        <Chat
            messages={chatStore.messages}
            messagesCount={chatStore.messagesCount}
            newMessageText={chatStore.newMessageText}
            onChangeMessage={(e) => chatStore.onChangeMessage(e)}
            onSubmitMessage={(e) => chatStore.onSubmitMessage(e)}
        />
    );
}));

Component.displayName = 'Chat';
export default Component;