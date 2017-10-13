import React from 'react';

const Message = props => (
    <div>
        <span><a title={props.message.fullName} href="#">{props.message.get('name')}</a>:</span> {props.message.get('message')}
    </div>
);
export default Message;

