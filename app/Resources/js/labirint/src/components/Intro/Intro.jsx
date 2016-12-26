import React, { PropTypes, Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import './Intro.css';
import { OAuthButton, SignOutButton } from 'components/AuthButtons';

const propTypes = {
  initialName: PropTypes.string
};

const defaultProps = {
  initialName: 'Аноним'
};

class Intro extends Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.renderGreetingWidget = this.renderGreetingWidget.bind(this);

    this.state = {
      name:            this.props.initialName,
      touched:         false,
      greetingWidget:  () => null,
      qnum:            1,
      question:        `Очередность хода игроков предопределяет Морской дьявол. Каждый из игроков видит 1 поле только 
        со своими кораблями.
        Вражеские корабли скрыты. Игроки по очереди совершают выстрелы. При попадании во вражеский корабль игрок делает
        повторный выстрел. Выстрел: За ограниченное время (например, 5-10 секунд) выбранный игрок от каждой из команд
        совершает прицеливание (выбор клетки) Очередность хода игроков предопределяет Морской дьявол. Каждый из игроков
        видит 1 поле только со своими кораблями.`,
      answers: [
        'Иду на улицу и стреляю по птицам из рогатки, а потом думаю, на каких островах мне провести очередной отпуск.',
        'Ем что-то вкусное, сладкое и вредное, а потом отправляюсь в бассейн и плаваю до посинения.',
        `Ору на всех, кто попадается под руку, затем извиняюсь и иду в кино на какой-нибудь фильм, 
          про острова, где все живут счастливо.`
      ],
      answer: 2
    };
  }

  handleNameChange(val) {
    const name = val.target.value;

    this.setState({ touched: true });

    if (name.length === 0) {
      this.setState({ name: this.props.initialName });
    } else {
      this.setState({ name });
    }
  }

  renderGreetingWidget() {
    if (!this.state.touched) {
      return null;
    }

    return (
      <div>
        <hr />
        <p>Здравствуйте, {this.state.name}!</p>
      </div>
    );
  }

  render() {
    return (
      <div className='App'>
        <h1>Hello World!</h1>
        <div>
          <p>Введите Ваше имя:</p>
          <div><input onChange={this.handleNameChange} /></div>
          {this.renderGreetingWidget()}
        </div>
        <h2>Авторизация</h2>
        <OAuthButton provider='github' />
        <SignOutButton />
        <div className='relative'>
          <div className='question'>
            <div className='timer'>0:25</div>
            <div className='title'><strong>Вопрос <span>{this.state.qnum}</span> из 25</strong></div>
            <div className='text'>
              {this.state.question}
            </div>
            <ul className='answers'>
              {this.state.answers.map((o, key) => {
                const num = key + 1;
                const idText = `answer${num}`;

                return (
                  <li key={key}>
                    <input type='radio' name='answer' id={idText}
                      value={num}
                    />
                    <label htmlFor={idText}>{o}</label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className='gamer'>
          <img src='/public/gamer1.jpg'/>
          <div className='name'>Константин Стародубозаборов</div>
          <div className='ship'>Адский галлеон синего пламени имени Владимира Ильича Ленина</div>
          <div className='action'>
            <Button>Ответить</Button>
          </div>
        </div>
        <div className='gamer enemy'>
          <img src='/public/gamer1.jpg' />
          <div className='name'>Константин Стародубозаборов</div>
          <div className='ship'>Адский галлеон синего пламени имени Владимира Ильича Ленина</div>
          <div className='action'>
            <div className='message'>Соперник отвечает</div>
          </div>
        </div>
      </div>
    );
  }
}

Intro.propTypes = propTypes;
Intro.defaultProps = defaultProps;

export default Intro;
