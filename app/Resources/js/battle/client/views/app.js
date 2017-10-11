import React from 'react';
import { Provider } from 'mobx-react';
import { useStrict } from 'mobx';

/* components */
import Home from './home';

/* stores */
import battleStore from '../stores/battle-store';
import chatStore from '../stores/chat-store';

useStrict(true);

const stores = { battleStore, chatStore };

const App = props => (
    <Provider { ...stores }>
        <Home />
    </Provider>
);

export default App;