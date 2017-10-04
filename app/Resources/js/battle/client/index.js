import React from 'react';
import { AppContainer } from 'react-hot-loader';
import ReactDOM  from 'react-dom';
import App from './views/app';

const render = (Component) =>
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById('battle')
    );

render(App);
if (module.hot) {
    module.hot.accept('./views/app', () => {
        require('./views/app');
        render(App);
    });
}