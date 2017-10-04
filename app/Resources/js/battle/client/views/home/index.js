import React from 'react';

import UserList from '../../components/user-list';
import Timer from '../../components/timer';
import Chat from '../../components/chat';
import Field from '../../components/field';

const Home = () => (
    <div className="relative">
        <Timer />
        <UserList />
        <Chat />
        <Field />
    </div>
);
export default Home;