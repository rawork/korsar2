import React from 'react';
import { Provider } from 'mobx-react';
import { useStrict } from 'mobx';

/* components */
import Home from './home';

/* stores */
import userStore from '../stores/user-store';
import timerStore from '../stores/timer-store';
import chatStore from '../stores/chat-store';
import fieldStore from '../stores/field-store';

useStrict(true);

const stores = { userStore, timerStore, chatStore, fieldStore };

const App = props => (
    <Provider { ...stores }>
        <Home />
    </Provider>
);

export default App;