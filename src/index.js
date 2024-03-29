import "./style.css";
import {User} from "./user";
import {CardList} from "./cardList";
import {EditForm} from "./editForm";
import {AvatarForm} from "./avatarForm";
import {CardForm} from "./cardForm";
/*************************************************************************************/
const user = new User();
const cardList = new CardList(document.querySelector('.places-list'), user);
/*************************************************************************************/
/**
 * Кнопка открытия формы добавления карточки
 */
const openButton = document.querySelector('.user-info__button');
openButton.addEventListener('click', function () {
    new CardForm(cardList);
});
/**
 * Кнопка открытия формы редактирования о себе
 * */
const editButton = document.querySelector('.button_edit');
editButton.addEventListener('click', function () {
    new EditForm(user);
});

/**
 * Кнопка для обновления аватара
 */
const updateAvatarButton = document.querySelector('.user-info__photo');
updateAvatarButton.addEventListener('click', function () {
    new AvatarForm(user);
});