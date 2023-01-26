export default class User {
  constructor(username) {
    this.username = username;
  }

  render() {
    this.userEl = document.createElement('li');
    this.userEl.className = 'chat__user user';
    this.userAvatar = document.createElement('div');
    this.userAvatar.className = 'user__avatar';
    this.usernameEl = document.createElement('span');
    this.usernameEl.className = 'user__name';
    this.usernameEl.textContent = this.username;

    this.userEl.appendChild(this.userAvatar);
    this.userEl.appendChild(this.usernameEl);
    return this.userEl;
  }

  renderHTML() {
    const html = `
      <li class="p-2 border-bottom" style="background-color: #eee;">
        <div class="d-flex flex-row">
          <div class="pt-1">
            <p class="fw-bold mb-0">Вы</p>
          </div>
        </div>
      </li>
    `
    return html;
  }
}
