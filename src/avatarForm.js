import {checkLinkValid} from "./validations";
import {Popup} from "./popup";
import {API} from "./settings";
//это класс для формы обновления аватара
export class AvatarForm {
    constructor(user) {
        const template = document.querySelector('#FormAvatarTemplate');
        this.templateElement = document.importNode(template.content, true);
        this.user = user;
        this.buttonClick = this.buttonClick.bind(this);
        this.popup = new Popup(this.close);
        this.popup.open(this.templateElement);
        this.connect();
    }

    connect() {
        document.forms.avatar.addEventListener('submit', this.buttonClick);
        document.forms.avatar.elements.link.addEventListener('input', checkLinkValid);
    }

    buttonClick(event) {
        event.preventDefault();
        this.setAvatar(document.forms.avatar.elements.link.value);
    }

    close() {
        document.forms.avatar.removeEventListener('submit', this.buttonClick);
        document.forms.avatar.elements.link.removeEventListener('input', checkLinkValid);
    }

    setAvatar(avatar) {
        this.popup.preload(true);
        fetch(`${API.URL}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                authorization: API.TOKEN,
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
                this.user.updateAvatar(avatar);

            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                this.popup.preload(false);
                this.popup.close();
            });
    }
}