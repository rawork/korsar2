import React from 'react';

/* styles */
import style from './styles.css';

const TimeTable = props => {
    return (
        <div className={style.timer}>{props.displayTimer}</div>
    );
};

export default TimeTable;