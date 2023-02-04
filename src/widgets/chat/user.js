const NAME_OWNER = 'Вы';

export default class User {
  constructor(name, isOwner=false) {
    this.userName = name;
    this.isOwner = isOwner;
  }

  render() {
    const liEl = document.createElement('li');
    liEl.className = 'p-0 user';
    if  (this.isOwner) {
      liEl.style.backgroundColor = '#eee';
    };

    const divEl = document.createElement('div');
    divEl.className = 'd-flex flex-row';

    const userNameEl = document.createElement('p');
    userNameEl.className = 'mb-0 user__name';
    if (this.isOwner) {
      userNameEl.textContent = NAME_OWNER;
      userNameEl.classList.add('fw-bold');
    } else {
      userNameEl.textContent = this.userName;
    }

    liEl.appendChild(divEl);
    liEl.appendChild(userNameEl);
    return liEl;
  }
}
