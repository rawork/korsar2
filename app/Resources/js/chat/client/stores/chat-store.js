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

    constructor() {
        this.messages = [];
        this.fetch();
    }

    getMessages() {
        return this.messages;
    }

    @action fetch() {
        fetch('/messages', { method: 'GET', credentials: "same-origin", headers: { 'X-Requested-With': 'XMLHttpRequest' }})
            .then(res => { console.log(res); return res.json()})
            .then(json => this.putMessages(json));
    }

    @action putMessages(messages) {
        let messageArray = [];
        messages.forEach(message => {
            messageArray.push(new Message(message));
        });
        this.messages = messageArray;
    }
}

const chatStore = new ChatStore();

autorun(() => {
    console.log(chatStore.getMessages().toJS());
});

export default chatStore;
export { ChatStore };