import { observable, computed, action, asMap, autorun } from 'mobx';

class User {
    @observable user = observable.map();

    constructor(userData = {}, checked = false) {
        this.user.merge(userData);
        this.user.set("checked", checked);
    }

    @computed get userInfo() {
        return `${this.user.get("name")} - ${this.user.get("age")}`;
    }

}

class UserStore {
    @observable users;

    constructor() {
        this.users = [];
        this.fetch();
    }

    @computed get selectedCount() {
        return this.users.filter(userStore => {
            return userStore.user.get("checked");
        }).length;
    }

    getUsers() {
        return this.users;
    }

    @action fetch() {
        fetch('/users', { method: 'GET', credentials: "same-origin"})
            .then(res => { console.log(res); return res.json()})
            .then(json => this.putUsers(json));
    }

    @action putUsers(users) {
        let userArray = [];
        users.forEach(user => {
            userArray.push(new User(user));
        });
        this.users = userArray;
    }
}

const userStore = new UserStore();

autorun(() => {
    console.log(userStore.getUsers().toJS());
});

export default userStore;
export { UserStore };