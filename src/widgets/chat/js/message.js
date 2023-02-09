const NAME_OWNER = 'Вы';

export default class Message {
  constructor(userName, message, date, isOwner=false) {
    this.userName = userName;
    this.message = message;
    this.isOwner = isOwner;
    this.date = new Date(date);
  }

  render() {
    const messageEl = document.createElement('li');
    messageEl.className = 'clearfix';

    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-data';
    if (this.isOwner) {
      messageHeader.classList.add('text-end');
    }

    const messageDateTime = document.createElement('span');
    messageDateTime.className = 'message-data-time';
    messageDateTime.textContent = this.formatDate()

    const messageUser = document.createElement('span');
    messageUser.className = 'message-data-user px-1';
    messageUser.textContent = this.userName

    messageHeader.appendChild(messageDateTime);
    messageHeader.appendChild(messageUser);

    const messageText = document.createElement('div');
    messageText.className = 'message';
    if (this.isOwner) {
      messageText.classList.add('my-message');
      messageText.classList.add('float-right');
    } else {
      messageText.classList.add('other-message');
    }
    messageText.textContent = this.message;

    messageEl.appendChild(messageHeader);
    messageEl.appendChild(messageText);
    return messageEl;
  }

  formatDate() {
    const day = this.date.getDate() < 10
      ? `0${this.date.getDate()}`
      : this.date.getDate();
    const month = this.date.getMonth() < 10
      ? `0${this.date.getMonth() + 1}`
      : this.date.getMonth();
    const year = String(this.date.getFullYear()).slice(-2);
    const hour = this.date.getHours() < 10
      ? `0${this.date.getHours()}`
      : this.date.getHours();
    const minute = this.date.getMinutes() < 10
      ? `0${this.date.getMinutes()}`
      : this.date.getMinutes();
    const formattedDate = `${hour}:${minute} ${day}.${month}.${year}`;

    return formattedDate;
  }
}
