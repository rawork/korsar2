import React from 'react';

/* styles */
import style from './styles.css';

const Timer = props => {
    return (
        <div className={style.timer}>{props.displayTimer}</div>
    );
};

export default Timer;