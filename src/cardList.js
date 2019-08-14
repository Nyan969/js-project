import {API} from './settings.js';
import {Popup} from "./popup";
import {checkLinkValid, checkTextValid} from "./validations";

// Это класс для отрисовки карточек.
export class CardList {
    constructor(container, user) {
        this.container = container;
        this.user = user;

        fetch(`${API.URL}/cards`, {
            headers: {
                authorization: API.TOKEN,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then((result) => {
                const cards = result.map(item => {
                    return new Card(item['name'], item['link'], item['likes'], item['_id'], item['owner']['_id'], this.user);
                });
                cards.forEach(item => {
                    this.container.appendChild(item.domElement);
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    addCard(data) {
        const item = new Card(data['name'], data['link'], data['likes'], data['_id'], data['owner']['_id'], this.user);
        this.container.appendChild(item.domElement);
    }
}

// Это класс карточки.
class Card {
    constructor(name, link, likes, cardID, authorID, user) {
        this.name = name;
        this.link = link;
        this.likes = likes;
        this.cardID = cardID;
        this.authorID = authorID;
        this.user = user;
        this.openImage = this.openImage.bind(this);
        this.remove = this.remove.bind(this);
        this.like = this.like.bind(this);
        this.create();
    }

    like(event) {
        let method;
        if (!event.target.classList.contains('place-card__like-icon_liked')) { //если лайка нет
            method = 'PUT'
        } else { //если лайк есть
            method = 'DELETE'
        }
        fetch(`${API.URL}/cards/like/${this.cardID}`, {
            method: method,
            headers: {
                authorization: API.TOKEN,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((result) => {
                event.target.parentElement.parentElement.querySelector('.place-card__like-count').textContent = result['likes'].length;
                event.target.classList.toggle('place-card__like-icon_liked');
            })
            .catch((err) => {
                console.error(err);
            });
    }

    remove(event) {
        if (window.confirm("Вы действительно хотите удалить эту карточку?")) {
            this.cardElement = event.target.parentElement.parentElement;
            this.cardElement.querySelector('.place-card__like-icon').removeEventListener('click', this.like);
            this.cardElement.querySelector('.place-card__delete-icon').removeEventListener('click', this.remove);
            this.cardElement.querySelector('.place-card__image').removeEventListener('click', this.openImage);

            fetch(`${API.URL}/cards/${this.cardID}`, {
                method: 'DELETE',
                headers: {
                    authorization: API.TOKEN,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id: `${this.cardID}`
                })
            })
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then(() => {
                    this.cardElement.remove();
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }

    create() { //будет создавать DOM-элемент карточки.
        const cardTemplate = document.querySelector('#CardTemplate');
        const placeCardImage = cardTemplate.content.querySelector('.place-card__image');
        const placeCardName = cardTemplate.content.querySelector('.place-card__name');
        const placeCardLikeCount = cardTemplate.content.querySelector('.place-card__like-count');
        placeCardImage.setAttribute('style', `background-image: url(${this.link})`);
        placeCardName.textContent = this.name;
        placeCardLikeCount.textContent = this.likes.length;
        this.domElement = document.importNode(cardTemplate.content, true);
        this.likes.forEach(item => {
            if (item._id === this.user.userID) {
                this.domElement.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
            }
        });
        if (this.authorID === this.user.userID) {
            this.domElement.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
        } else {
            this.domElement.querySelector('.place-card__delete-icon').remove();
        }
        this.domElement.querySelector('.place-card__like-icon').addEventListener('click', this.like);
        this.domElement.querySelector('.place-card__image').addEventListener('click', this.openImage);
    }

    openImage(event) {
        if (!(event.target).closest('.place-card__delete-icon')) {
            const imageView = new ImageView(this.link);
            popup.open(imageView.templateElement);
        }
    }
}

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

//это класс для картинки
class ImageView {
    constructor(link) {
        document.querySelector('.popup__content').classList.add('popup__content_image');
        document.querySelector('.popup__content').classList.remove('popup__content');
        this.template = document.querySelector(`#ImageTemplate`);
        this.containerTemplate = this.template.content.querySelector('.popup__image');
        this.containerTemplate.setAttribute('src', link);
        this.templateElement = document.importNode(this.template.content, true);
    }
}
