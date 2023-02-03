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

  HTML() {
    const html = `
      <li class="p-2 border-bottom" ${this.isOwner ? 'style="background-color: #eee;"' : ''}>
        <div class="d-flex flex-row">
          <div class="pt-1">
            <p class="fw-bold mb-0">${this.userName}</p>
          </div>
        </div>
      </li>
    `
    return html;
  }
}
