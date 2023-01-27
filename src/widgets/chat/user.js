export default class User {
  constructor(name, isOwner=false) {
    this.userName = name;
    this.isOwner = isOwner;
  }

  render() {
    const liEl = document.createElement('li');
    liEl.className = 'p-2 border-bottom';
    if  (this.isOwner) {
      liEl.style.backgroundColor = '#eee';
    };

    const divEl1 = document.createElement('div');
    divEl1.className = 'd-flex flex-row';

    const divEl2 = document.createElement('div');
    divEl2.className = 'pt-1';

    const userNameEl = document.createElement('p');
    userNameEl.className = 'fw-bold mb-0';
    userNameEl.textContent = this.userName;

    liEl.appendChild(divEl1);
    liEl.appendChild(divEl2);
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
