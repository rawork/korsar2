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

    constructor(socket) {
        this.socket = socket;

        this.socket.on('newMessage', this.newMessage.bind(this))
        this.messages = [];
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

    @action newMessage(message) {
        this.messages.push(new Message(message));
    }

    @action addMessage(message) {
        this.socket.emit('newMessage', message);
    }

    @action saveMessage(message) {
        let data = new FormData();
        data.append( "message", message );
        fetch('/message', { method: 'POST', body: data, credentials: "same-origin", headers: { 'X-Requested-With': 'XMLHttpRequest' }})
            .then(res => { console.log(res); return res.json()})
            .then(json => this.addMessage(json));

        this.socket.emit('newMessage', data);
    }
}

export default ChatStore;