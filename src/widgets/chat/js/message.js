const NAME_OWNER = 'Вы';

export default class Message {
  constructor(userName, message, date, isOwner=false) {
    this.userName = userName;
    this.message = message;
    this.isOwner = isOwner;
    console.log('class Message constructor:', userName, message, date);
    this.date = Message.getFormattedDateTime(date);
    console.log(this.date);
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
    messageDateTime.textContent = this.date;

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

  static getFormattedDateTime(date) {
    const day = date.getDate() < 10
      ? `0${date.getDate()}`
      : date.getDate();
    const month = date.getMonth() < 10
      ? `0${date.getMonth() + 1}`
      : date.getMonth();
    const year = String(date.getFullYear()).slice(-2);
    const hour = date.getHours() < 10
      ? `0${date.getHours()}`
      : date.getHours();
    const minute = date.getMinutes() < 10
      ? `0${date.getMinutes()}`
      : date.getMinutes();
    const formattedDate = `${hour}:${minute} ${day}.${month}.${year}`;

    return formattedDate;
  }
}
