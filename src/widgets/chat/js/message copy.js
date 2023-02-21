export default class Message {
  constructor(userName, message, date, isOwner = false) {
    this.userName = userName;
    this.message = message;
    this.isOwner = isOwner;
    console.log('class Message constructor:', userName, message, date);
    this.date = date;
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
    messageUser.textContent = this.userName;

    messageHeader.appendChild(messageUser);
    messageHeader.appendChild(messageDateTime);

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
}
