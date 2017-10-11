import React from 'react';

const StartPage = props => (
    <h2 className="before-message">
        До начала игры
        <br />
        <span >{props.displayTimer}</span>
    </h2>
);
export default StartPage;