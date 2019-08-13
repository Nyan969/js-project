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
export const popup = new Popup();