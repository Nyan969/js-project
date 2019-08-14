import "./style.css";
import {EditForm, AvatarForm, User} from "./blocks/profile/user";
import {CardList, CardForm} from "./blocks/places-list/cardList";
import {popup} from "./blocks/popup/popup";

/*************************************************************************************/
const user = new User();
const cardList = new CardList(document.querySelector('.places-list'), user);
/*************************************************************************************/
/**
 * Кнопка открытия формы добавления карточки
 */
const openButton = document.querySelector('.user-info__button');
openButton.addEventListener('click', function () {
    const cardForm = new CardForm(cardList, user);
    popup.open(cardForm.templateElement);
    cardForm.connect();
});
/**
 * Кнопка открытия формы редактирования о себе
 * */
const editButton = document.querySelector('.button_edit');
editButton.addEventListener('click', function () {
    const editForm = new EditForm(user);
    popup.open(editForm.templateElement);
    editForm.connect();
});

/**
 * Кнопка для обновления аватара
 */
const updateAvatarButton = document.querySelector('.user-info__photo');
updateAvatarButton.addEventListener('click', function () {
    const avatarForm = new AvatarForm(user);
    popup.open(avatarForm.templateElement);
    avatarForm.connect()
});