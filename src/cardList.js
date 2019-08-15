import {API} from './settings.js';
import {Card} from './card.js'
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