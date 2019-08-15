// Это класс для всплывающего окна
export class Popup {
    constructor(callback) {
        this.closeClickOutsidePopup = this.closeClickOutsidePopup.bind(this);
        this.close = this.close.bind(this);
        document.querySelector('.popup__close').addEventListener('click', this.close);
        this.loading = false;
        this.callback = callback;
    }

    open(templateElement) {
        document.querySelector('.templateContainer').appendChild(templateElement);
        document.querySelector('.popup').classList.add('popup_is-opened');
        document.querySelector('.popup__close').addEventListener('click', this.close);
        document.querySelector('.popup_is-opened').addEventListener('mousedown', this.closeClickOutsidePopup);
    }

    close() {
        if (!this.loading) {
            if (typeof this.callback === "function") {
                this.callback();
            }

            if (document.querySelector('.popup__content_image')) {
                document.querySelector('.popup__content_image').classList.add('popup__content');
                document.querySelector('.popup__content_image').classList.remove('popup__content_image')
            }

            document.querySelector('.popup__close').removeEventListener('click', this.close);
            document.querySelector('.popup_is-opened').removeEventListener('mousedown', this.closeClickOutsidePopup);

            document.querySelector('.popup').classList.remove('popup_is-opened');
            const container = document.querySelector('.templateContainer');
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
    }

    closeClickOutsidePopup(event) {
        if (!(event.target).closest('.popup__content') && !(event.target).closest('.popup__content_image') && (!this.loading)) {
            this.close();
        }
    }

    preload(loading) {
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