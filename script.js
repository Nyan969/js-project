const API = {
    token: '35f83a00-b4b7-4349-805e-b09f348c0ad8',
    url: 'http://95.216.175.5/cohort0'
};

// Это класс карточки.
class Card {
    constructor(name, link, likes, cardID, authorID) {
        this.name = name;
        this.link = link;
        this.likes = likes;
        this.cardID = cardID;
        this.authorID = authorID;
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
        fetch(`${API.url}/cards/like/${this.cardID}`, {
            method: method,
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

            fetch(`${API.url}/cards/${this.cardID}`, {
                method: 'DELETE',
                headers: {
                    authorization: API.token,
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
            if (item._id === user.userID) {
                this.domElement.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
            }
        });
        if (this.authorID === user.userID) {
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

// Это класс для отрисовки карточек.
class CardList {
    constructor(container) {
        this.container = container;

        fetch(`${API.url}/cards`, {
            headers: {
                authorization: API.token,
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
                    return new Card(item['name'], item['link'], item['likes'], item['_id'], item['owner']['_id']);
                });
                cards.forEach(item => {
                    this.container.appendChild(item.domElement);
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    sendImage(name, link) {
        popup.preloader(true);
        fetch(`${API.url}/cards`, {
            method: 'POST',
            headers: {
                authorization: API.token,
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
                this.addCard(new Card(data['name'], data['link'], data['likes'], data['_id'], data['owner']['_id']))
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                popup.preloader(false);
                popup.close();
            });
    }

    addCard(item) {
        this.container.appendChild(item.domElement);
    }
}

// Это класс для всплывающего окна
class Popup {
    constructor() {
        document.querySelector('.popup__close').addEventListener('click', this.close);
        this.loading = false;
    }

    open(templateElement) {
        document.querySelector('.templateContainer').appendChild(templateElement);
        document.querySelector('.popup').classList.add('popup_is-opened');
        document.querySelector('.popup__close').addEventListener('click', this.close);
        document.querySelector('.popup_is-opened').addEventListener('mousedown', this.closeClickOutsidePopup);
    }

    close() {
        if (!this.loading) {
            if (document.querySelector('.popup__content_image')) {
                document.querySelector('.popup__content_image').classList.add('popup__content');
                document.querySelector('.popup__content_image').classList.remove('popup__content_image')
            }

            document.querySelector('.popup__close').removeEventListener('click', this.close);
            document.querySelector('.popup_is-opened').removeEventListener('mousedown', popup.closeClickOutsidePopup);

            document.querySelector('.popup').classList.remove('popup_is-opened');
            const container = document.querySelector('.templateContainer');
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
    }

    closeClickOutsidePopup(event) {
        if (!(event.target).closest('.popup__content') && !(event.target).closest('.popup__content_image') && (!this.loading)) {
            popup.close();
        }
    }

    preloader(loading) {
        this.loading = loading;
        const button = document.querySelector('.popup__button');
        if (this.loading) {
            this.defaultBtnName = button.textContent;
            button.textContent = 'Загрузка...';
        } else {
            button.textContent = this.defaultBtnName;
        }
    }
}

//это класс для формы карточки
class CardForm {
    constructor() {
        const template = document.querySelector('#FormCardTemplate');
        this.templateElement = document.importNode(template.content, true);
    }

    connect() {
        document.forms.new.addEventListener('submit', this.buttonClick);
        document.forms.new.elements.title.addEventListener('input', checkTextValid);
        document.forms.new.elements.link.addEventListener('input', checkLinkValid);
    }

    buttonClick(event) {
        event.preventDefault();
        cardList.sendImage(document.forms.new.elements.title.value, document.forms.new.elements.link.value);
    }
}

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

class User {
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

/*************************************************************************************/
const user = new User();
const popup = new Popup();
const cardList = new CardList(document.querySelector('.places-list'));
/*************************************************************************************/
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
 * Кнопка открытия формы добавления карточки
 */
const openButton = document.querySelector('.user-info__button');
openButton.addEventListener('click', function () {
    const cardForm = new CardForm();
    popup.open(cardForm.templateElement);
    cardForm.connect();
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

/**
 * создает элемент для вывода сообщения об ошибке
 */
function createErrorElement(referenceElement, nameClass, textError) {
    if (document.querySelector(`.${nameClass}`) === null) {
        const errorElement = document.createElement('span');
        referenceElement.form.insertBefore(errorElement, referenceElement.nextSibling);
        errorElement.classList.add('place-card__error', nameClass);
    }
    const errorElement = document.querySelector(`.${nameClass}`);
    errorElement.textContent = textError;
}

//Проверка валидности у поля с ссылкой.
function checkLinkValid(event) {
    const name = event.target.name;
    const value = event.target.value;

    if (value === '' || value.match(/(https|http)(.+?)\.(jpeg|jpg|png)$/) === null) {
        const message = value === '' ? 'Это обязательное поле' : 'Здесь должна быть ссылка';

        createErrorElement(event.target, `place-card__error_${name}`, message);
    } else {
        const classErrors = [`.place-card__error_${name}`];
        removeErrorElement(classErrors);
    }

    checkDisabled(event.target.form);
}

//Проверка валидности у текстовых полей.
function checkTextValid(event) {
    const name = event.target.name;
    const value = event.target.value;
    if (value === '' || value.length < 2 || value.length > 30) {
        const message = value === '' ? 'Это обязательное поле' : 'Должно быть от 2 до 30 символов';
        createErrorElement(event.target, `place-card__error_${name}`, message);
    } else {
        const classErrors = [`.place-card__error_${name}`];
        removeErrorElement(classErrors);
    }
    checkDisabled(event.target.form);
}

/**
 * проверяет нужен ли disabled
 */
function checkDisabled(form) {
    let empty = false;
    for (let elem of form.elements) {
        if (elem.type === 'text' && elem.value === '') {
            empty = true;
            break;
        }
    }
    if (form.querySelectorAll('.place-card__error').length === 0 && !empty) {
        setDisabled(false, form.elements.button);
    } else {
        setDisabled(true, form.elements.button);
    }
}

/**
 * устанавливает/убирает disabled
 */
function setDisabled(buttonDisabled, elementButton) {
    if (buttonDisabled) {
        elementButton.disabled = true;
        elementButton.classList.add('popup__button_disabled');
    } else {
        elementButton.disabled = false;
        elementButton.classList.remove('popup__button_disabled');
    }
}

/**
 *убирает элемент для вывода сообщения об ошибке
 */
function removeErrorElement(classErrors) {
    classErrors = classErrors || ['place-card__error'];
    classErrors.forEach(item => {
        const elementError = document.querySelector(item);
        if (elementError) {
            elementError.remove();
        }
    })
}