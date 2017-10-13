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
        this.scrolled = false;
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
        this.addScrollObserver();
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

    addScrollObserver() {
        // Get a reference to the div you want to auto-scroll.
        const someElement = document.querySelector('.text-container');
        // Create an observer and pass it a callback.
        const observer = new MutationObserver(scrollToBottom);
        // Tell it to look for new children that will change the height.
        const config = {childList: true};

        // First, define a helper function.
        function animateScroll(duration) {
            const start = someElement.scrollTop;
            const end = someElement.scrollHeight;
            const change = end - start;
            const increment = 20;

            function easeInOut(currentTime, start, change, duration) {
                // by Robert Penner
                currentTime /= duration / 2;
                if (currentTime < 1) {
                    return change / 2 * currentTime * currentTime + start;
                }
                currentTime -= 1;
                return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
            }

            function animate(elapsedTime) {
                elapsedTime += increment;
                let position = easeInOut(elapsedTime, start, change, duration);
                someElement.scrollTop = position;
                if (elapsedTime < duration) {
                    setTimeout(function() {
                        animate(elapsedTime);
                    }, increment)
                }
            }

            animate(0);
        }

        // Here's our main callback function we passed to the observer
        function scrollToBottom() {
            const duration = 300 // Or however many milliseconds you want to scroll to last
            animateScroll(duration);
        }

        observer.observe(someElement, config);

        this.scrolled = true;

    }
}

export default ChatStore;