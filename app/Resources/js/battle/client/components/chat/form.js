import React from 'react';

const Form = props => (
    <form onSubmit={(e) => props.onSubmitMessage(e)}>
        <input
            type="text"
            onChange={(e) => props.onChangeMessage(e)}
            value={props.newMessageText}
            autoFocus={true}
            placeholder="Добавить сообщение"
        />
        <button type="submit" className="btn">Отправить</button>
    </form>
);

export default Form;