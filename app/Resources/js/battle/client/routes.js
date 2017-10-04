import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './views/app';

export default () => (
    <BrowserRouter>
        <Route exact path='/' component={App} />
    </BrowserRouter>
);