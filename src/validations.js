//Проверка валидности у поля с ссылкой.
export function checkLinkValid(event) {
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
export function checkTextValid(event) {
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