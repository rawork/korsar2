import React from 'react';

const Message = props => (
    <div>
        <span><a title={props.fullname} href="#">{props.name}</a>:</span>
        {props.message}
    </div>
);
export default Message;

