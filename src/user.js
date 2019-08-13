import {checkLinkValid, checkTextValid} from "./validations";
import {popup} from "./popup";
import {API} from './settings.js';
import {user} from "./index";

//это класс для формы редактирования
class EditForm {
    constructor() {
        this.template = document.querySelector(`#FormEditTemplate`);
        this.containerName = this.template.content.querySelector('.popup__input_type_name');
        this.containerJob = this.template.content.querySelector('.popup__input_type_job');
        this.containerName.value = document.querySelector('.user-info__name').innerText;
        this.containerJob.value = document.querySelector('.user-info__job').innerText;
        this.templateElement = document.importNode(this.template.content, true);
    }

    connect() {
        document.forms.edit.addEventListener('submit', this.buttonClick);
        document.forms.edit.elements.name.addEventListener('input', checkTextValid);
        document.forms.edit.elements.job.addEventListener('input', checkTextValid);
    }

    buttonClick(event) {
        event.preventDefault();
        user.sendInfo(document.forms.edit.elements.name.value, document.forms.edit.elements.job.value);
    }
}

//это класс для формы обновления аватара
class AvatarForm {
    constructor() {
        const template = document.querySelector('#FormAvatarTemplate');
        this.templateElement = document.importNode(template.content, true);
    }

    connect() {
        document.forms.avatar.addEventListener('submit', this.buttonClick);
        document.forms.avatar.elements.link.addEventListener('input', checkLinkValid);
    }

    buttonClick(event) {
        event.preventDefault();
        user.updateAvatar(document.forms.avatar.elements.link.value);
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
                user.updateInfo(name, job);
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
/**
 * Кнопка открытия формы редактирования о себе
 * */
const editButton = document.querySelector('.button_edit');
editButton.addEventListener('click', function () {
    const editForm = new EditForm();
    popup.open(editForm.templateElement);
    editForm.connect();
});

/**
 * Кнопка для обновления аватара
 */
const updateAvatarButton = document.querySelector('.user-info__photo');
updateAvatarButton.addEventListener('click', function () {
    const avatarForm = new AvatarForm();
    popup.open(avatarForm.templateElement);
    avatarForm.connect()
});
