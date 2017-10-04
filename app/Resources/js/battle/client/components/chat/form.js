import React from 'react';

const Form = props => (
    <form>
        <input type="text" placeholder="Добавить сообщение" />
        <button onClick={() => props.onClick()} className="btn">Отправить</button>
    </form>
);
export default Form;


