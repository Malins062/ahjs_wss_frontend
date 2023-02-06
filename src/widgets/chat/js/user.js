import AVATAR from '../img/avatar.png';

const NAME_OWNER = 'Вы';

export default class User {
  constructor(name, isOwner=false) {
    this.userName = name;
    this.isOwner = isOwner;
  }

  render() {
    const liEl = document.createElement('li');
    liEl.className = 'clearfix user';
    if  (this.isOwner) {
      liEl.classList.add('active');
    };

    const avatarEl = document.createElement('img');
    avatarEl.src = AVATAR;

    const aboutEl = document.createElement('div');
    aboutEl.className = 'about';

    const userNameEl = document.createElement('div');
    userNameEl.className = 'name';
    if (this.isOwner) {
      userNameEl.textContent = NAME_OWNER;
      userNameEl.classList.add('fw-bold');
    } else {
      userNameEl.textContent = this.userName;
    }

    aboutEl.appendChild(userNameEl);
    liEl.appendChild(avatarEl);
    liEl.appendChild(aboutEl);
    return liEl;
  }
}
