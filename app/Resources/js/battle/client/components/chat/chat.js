import React from 'react';

/* components */
import Message from './message';
import Form from './form';

/* styles */
import style from './styles.css';

const Chat = props => {
    return (
        <div className={style['chat-container']}>
            <div className={style['text-container']}>
                {props.messages.map(chatStore => {
                    return (
                        <Message
                            key={chatStore.message.get('id')}
                            fullname={chatStore.message.fullName}
                            name={chatStore.message.get('name')}
                            message={chatStore.message.get('message')}
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