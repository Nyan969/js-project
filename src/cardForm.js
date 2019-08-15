import {API} from './settings.js';
import {Popup} from "./popup";
import {checkLinkValid, checkTextValid} from "./validations";
//это класс для формы карточки
export class CardForm {
    constructor(cardList) {
        const template = document.querySelector('#FormCardTemplate');
        this.templateElement = document.importNode(template.content, true);
        this.cardList = cardList;
        this.buttonClick = this.buttonClick.bind(this);
        this.popup = new Popup(this.close);
        this.popup.open(this.templateElement);
        this.connect();
    }

    connect() {
        document.forms.new.addEventListener('submit', this.buttonClick);
        document.forms.new.elements.title.addEventListener('input', checkTextValid);
        document.forms.new.elements.link.addEventListener('input', checkLinkValid);
    }

    buttonClick(event) {
        event.preventDefault();
        this.sendImage(document.forms.new.elements.title.value, document.forms.new.elements.link.value);
    }

    sendImage(name, link) {
        this.popup.preload(true);
        fetch(`${API.URL}/cards`, {
            method: 'POST',
            headers: {
                authorization: API.TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                link: link
            })
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then((data) => {
                this.cardList.addCard(data)
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                this.popup.preload(false);
                this.popup.close();
            });
    }

    close() {
        document.forms.new.removeEventListener('submit', this.buttonClick);
        document.forms.new.elements.title.removeEventListener('input', checkTextValid);
        document.forms.new.elements.link.removeEventListener('input', checkLinkValid);
    }
}