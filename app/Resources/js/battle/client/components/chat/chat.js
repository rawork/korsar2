import React from 'react';

/* components */
import Message from './message';
import Form from './form';

/* styles */
import style from './styles.css';

const Chat = props => {
    return (
        <div className={style['chat-container']}>
            <div className={style['text-container']} htmlFor={props.messagesCount}>
                {props.messages.map(messageStore => {
                    return (
                        <Message
                            key={messageStore.message.get('id')}
                            message={messageStore.message}
                             />);
                })}
            </div>
            <Form
                newMessageText={props.newMessageText}
                onChangeMessage={(e) => props.onChangeMessage(e)}
                onSubmitMessage={(e) => props.onSubmitMessage(e)}
            />
        </div>
    );
};

export default Chat;