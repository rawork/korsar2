import React from 'react';

const Modal = props => {
    if (props.showModal) {
        return (
            <div className="modal active">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="answer-timer">{props.answerTimer}</div>
                        <div className="question">{props.question.question}</div>
                        <div className="answers">
                            <input name="question" value={props.question.id} type="hidden" />
                            <input type="radio" id="answer_1" name="answer" value="1" />
                            <label htmlFor="answer_1" onClick={() => props.setAnswer(1)}>{props.question.answer1}</label>
                            <br />
                            <br />
                            <input type="radio" id="answer_2" name="answer" value="2" />
                            <label htmlFor="answer_2" onClick={() => props.setAnswer(2)}>{props.question.answer2}</label>
                            <br />
                            <br />
                            <input type="radio" id="answer_3" name="answer" value="3" />
                            <label htmlFor="answer_3" onClick={() => props.setAnswer(3)}>{props.question.answer3}</label>
                        </div>
                        <button className="btn" onClick={() => props.answer()}>Ответить</button>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="modal"></div>
        );
    }
};

export default Modal;

