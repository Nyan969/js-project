import {checkTextValid} from "./validations";
import {Popup} from "./popup";
import {API} from "./settings";
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
        this.popup = new Popup(this.close);
        this.popup.open(this.templateElement);
        this.connect();
    }

    connect() {
        document.forms.edit.addEventListener('submit', this.buttonClick);
        document.forms.edit.elements.name.addEventListener('input', checkTextValid);
        document.forms.edit.elements.job.addEventListener('input', checkTextValid);
    }

    buttonClick(event) {
        event.preventDefault();
        this.sendInfo(document.forms.edit.elements.name.value, document.forms.edit.elements.job.value);
    }

    sendInfo(name, job) {
        this.popup.preload(true);
        fetch(`${API.URL}/users/me`, {
            method: 'PATCH',
            headers: {
                authorization: API.TOKEN,
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
                this.user.updateInfo(name, job);
            })
            .finally(() => {
                this.popup.preload(false);
                this.popup.close();
            });
    }

    close() {
        document.forms.edit.removeEventListener('submit', this.buttonClick);
        document.forms.edit.elements.name.removeEventListener('input', checkTextValid);
        document.forms.edit.elements.job.removeEventListener('input', checkTextValid);
    }
}
