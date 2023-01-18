import User from './components/User';
import Message from './components/Message';

window.onload = () => {
  const ws = new WebSocket('ws://localhost:7070');
  const chooseUsernamePopup = document.querySelector('.choose-username-popup');
  const chooseUsernameForm = document.querySelector('.choose-username-form');
  const chatForm = document.getElementById('chat-form');
  const popupOverlay = document.querySelector('.alarm-popup');
  const popup = document.querySelector('.alarm-popup__container');
  const close = document.querySelector('.alarm-popup__close');

  const chat = document.querySelector('.chat');
  const users = chat.querySelector('.chat__users');
  const messages = chat.querySelector('.chat__messages');

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    console.log(message);
    console.log(data);

    if (data.renderUsers) {
      data.names.forEach((name) => {
        users.appendChild(new User(name).render());
      });
    }

    if (data.nameIsFree) {
      chooseUsernamePopup.classList.add('hidden');
      chat.classList.remove('hidden');
      const user = new User(data.name).render();
      user.classList.add('current-user');
      users.appendChild(user);
      document.querySelector(
        '.current-user',
      ).childNodes[1].textContent = `${user.textContent} <-- You`;
    } else if (data.nameIsFree === false) {
      popupOverlay.classList.remove('hidden');
      console.log('Имя занято. Выберите другое имя.');
    }

    if (data.renderNames) {
      users.appendChild(new User(data.name).render());
      return;
    }

    if (data.closeUser) {
      const usersArray = [...document.querySelectorAll('.user')];
      usersArray.forEach((user) => {
        if (user.querySelector('.user__name').textContent === data.name) {
          user.remove();
        }
      });
    }

    if (data.renderOwnMessage) {
      const ownMessage = new Message(
        data.name,
        data.message,
        data.date,
      ).render();
      ownMessage.classList.add('own-message');
      messages.appendChild(ownMessage);
    }

    if (data.renderMessage) {
      messages.appendChild(
        new Message(data.name, data.message, data.date).render(),
      );
    }

    if (data.renderMessages) {
      data.messages.forEach((mes) => {
        messages.appendChild(
          new Message(mes.name, mes.message, mes.date).render(),
        );
      });
    }
  };

  chooseUsernameForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const username = document.getElementById('username').value;
    ws.send(JSON.stringify({ username, chooseUsername: true }));
    evt.currentTarget.reset();
  });

  chatForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const messageText = document.getElementById('message').value;
    ws.send(
      JSON.stringify({
        chatMessage: true,
        messageText,
      }),
    );
    evt.currentTarget.reset();
  });

  popupOverlay.addEventListener('click', (event) => {
    if (event.target !== popup && !popup.contains(event.target)) {
      popupOverlay.classList.add('hidden');
    }
  });

  close.addEventListener('click', (event) => {
    console.log(event);
    popupOverlay.classList.add('hidden');
  });
};
