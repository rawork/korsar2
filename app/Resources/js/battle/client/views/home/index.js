import React from 'react';
import { observer, inject } from 'mobx-react';

import UserList from '../../components/user-list';
import TimeTable from '../../components/timetable';
import Chat from '../../components/chat';
import Field from '../../components/field';
import UserPanel from '../../components/user-panel';
import Modal from '../../components/modal';
import StartPage from '../../components/startpage';
import InitPage from '../../components/initpage';

const Home = inject('battleStore')(observer(({ battleStore }) => {
    if (battleStore.timerStore.isStarted) {
        return (
            <div className="relative">
                <TimeTable />
                <UserList />
                <Chat />
                <Field />
                <UserPanel />
                <Modal />
            </div>
        );
    } else if (battleStore.timerStore.current == 0) {
        return <InitPage />;
    }

    return <StartPage />;

}));

export default Home;