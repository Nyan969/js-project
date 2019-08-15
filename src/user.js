import {API} from './settings.js';

export class User {
    constructor() {
        fetch(`${API.URL}/users/me`, {
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
                this.updateInfo(result.name, result.about, result.avatar);
                this.userID = result._id;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    updateInfo(name, job, avatar) {
        document.querySelector('.user-info__name').textContent = name;
        document.querySelector('.user-info__job').textContent = job;
        if (avatar) {
            this.updateAvatar(avatar);
        }
    }

    updateAvatar(avatar) {
        document.querySelector('.user-info__photo').style.backgroundImage = `url(${avatar})`;
    }
}

