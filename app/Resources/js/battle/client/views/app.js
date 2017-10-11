import React from 'react';
import { Provider } from 'mobx-react';
import { useStrict } from 'mobx';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080');

/* components */
import Home from './home';

/* stores */
import BattleStore from '../stores/battle-store';
import ChatStore from '../stores/chat-store';

useStrict(true);

const stores = {battleStore: new BattleStore(socket), chatStore: new ChatStore(socket) };

const App = props => (
    <Provider { ...stores }>
        <Home />
    </Provider>
);

export default App;