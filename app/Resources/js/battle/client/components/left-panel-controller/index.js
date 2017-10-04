import React from 'react';
import { inject } from 'mobx-react';

/* styles */
import style from './styles.css';

const LeftPanelController = inject('leftMenuStore')(({ leftMenuStore }) => (
    <div className={style.container}>
        <button onClick={() => leftMenuStore.openLeftPanel()}>Open left panel</button>
        <button onClick={() => leftMenuStore.closeLeftPanel()}>Close left panel</button>
    </div>
));

export default LeftPanelController;