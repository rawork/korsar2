import React from 'react';
import ReactDOM from 'react-dom';

const Form = props => {

    handleNewMessageKeyDown = (event) => {
        if (event.keyCode !== ENTER_KEY) {
            return;
        }

        event.preventDefault();

        const val = ReactDOM.findDOMNode(this.refs.newMessage).value.trim();

        if (val) {
            props.onKeyDown(val);
            ReactDOM.findDOMNode(this.refs.newMessage).value = '';
        }
    };

    return (
    <form>
        <input
            ref="newMessage"
            type="text"
            onKeyDown={this.handleNewMessageKeyDown}
            autoFocus={true}
            placeholder="Добавить сообщение"
        />
        <button type="submit" onClick={(event) => props.onClick(event)} className="btn">Отправить</button>
    </form>
    )
};

export default Form;


