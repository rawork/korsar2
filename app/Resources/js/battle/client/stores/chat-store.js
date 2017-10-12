import { observable, computed, action, asMap, autorun } from 'mobx';

class Message {
    @observable message = observable.map();

    constructor(messageData = {}) {
        this.message.merge(messageData);
    }

    @computed get fullName() {
        return `${this.message.get("name")} ${this.message.get("lastname")}, ${this.message.get("role")}`;
    }
}

class ChatStore {
    @observable messages;
    @observable newMessageText;

    constructor(socket) {
        this.socket = socket;

        this.socket.on('newMessage', this.newMessage.bind(this));
        this.messages = [];
        this.newMessageText = '';
        this.fetch();
    }

    getMessages() {
        return this.messages;
    }

    @action fetch() {
        fetch('/messages', { method: 'GET', credentials: "same-origin", headers: { 'X-Requested-With': 'XMLHttpRequest' }})
            .then(res => res.json())
            .then(json => this.putMessages(json));
    }

    @action putMessages(data) {
        let messageArray = [];
        this.user = data.user;
        data.messages.forEach(message => {
            messageArray.push(new Message(message));
        });
        this.messages = messageArray;
    }

    @action onChangeMessage(e) {
        this.newMessageText = e.target.value;
    }

    @action newMessage(message) {
        console.log('New message emited', message);
        this.messages.push(new Message(message));
    }

    @action addMessage(data) {
        if (data.error) {
            console.log(data.error);
            return;
        }
        this.messages.push(new Message(data.message));
        this.newMessageText = '';
        this.socket.emit('newMessage', data.message);
    }

    @action onSubmitMessage(e) {
        e.preventDefault();
        if ('' == this.newMessageText) {
            return;
        }

        let data = new FormData();
        data.append( "message", this.newMessageText );

        fetch('/message', { method: 'POST', body: data, credentials: "same-origin", headers: { 'X-Requested-With': 'XMLHttpRequest' }})
            .then(res => res.json())
            .then(json => this.addMessage(json));
    }
}

export default ChatStore;