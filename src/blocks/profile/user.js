import {checkLinkValid, checkTextValid} from "../../validations";
import {popup} from "../popup/popup";
import {API} from '../../settings.js';

//это класс для формы редактирования
export class EditForm {
    constructor(user) {
        this.template = document.querySelector(`#FormEditTemplate`);
        this.containerName = this.template.content.querySelector('.popup__input_type_name');
        this.containerJob = this.template.content.querySelector('.popup__input_type_job');
        this.containerName.value = document.querySelector('.user-info__name').innerText;
        this.containerJob.value = document.querySelector('.user-info__job').innerText;
        this.templateElement = document.importNode(this.template.content, true);
        this.user = user;
        this.buttonClick = this.buttonClick.bind(this);
    }

    connect() {
        document.forms.edit.addEventListener('submit', this.buttonClick);
        document.forms.edit.elements.name.addEventListener('input', checkTextValid);
        document.forms.edit.elements.job.addEventListener('input', checkTextValid);
    }

    buttonClick(event) {
        event.preventDefault();
        this.user.sendInfo(document.forms.edit.elements.name.value, document.forms.edit.elements.job.value);
    }
}

//это класс для формы обновления аватара
export class AvatarForm {
    constructor(user) {
        const template = document.querySelector('#FormAvatarTemplate');
        this.templateElement = document.importNode(template.content, true);
        this.user = user;
        this.buttonClick = this.buttonClick.bind(this);
    }

    connect() {
        document.forms.avatar.addEventListener('submit', this.buttonClick);
        document.forms.avatar.elements.link.addEventListener('input', checkLinkValid);
    }

    buttonClick(event) {
        event.preventDefault();
        this.user.updateAvatar(document.forms.avatar.elements.link.value);
    }
}

export class User {
    constructor() {
        fetch(`${API.url}/users/me`, {
            headers: {
                authorization: API.token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((result) => {
                this.updateInfo(result.name, result.about, result.avatar);
                this.userID = result._id;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    sendInfo(name, job) {
        popup.preloader(true);
        fetch(`${API.url}/users/me`, {
            method: 'PATCH',
            headers: {
                authorization: API.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                about: job
            })
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .then(() => {
                this.updateInfo(name, job);
            })
            .finally(() => {
                popup.preloader(false);
                popup.close();
            });
    }

    updateInfo(name, job, avatar) {
        document.querySelector('.user-info__name').textContent = name;
        document.querySelector('.user-info__job').textContent = job;
        if (avatar) {
            document.querySelector('.user-info__photo').style.backgroundImage = `url(${avatar})`;
        }
    }

    updateAvatar(avatar) {
        popup.preloader(true);
        fetch(`${API.url}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                authorization: API.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                avatar: avatar,
            })
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(() => {
                document.querySelector('.user-info__photo').style.backgroundImage = `url(${avatar})`;
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                popup.preloader(false);
                popup.close();
            });
    }
}

