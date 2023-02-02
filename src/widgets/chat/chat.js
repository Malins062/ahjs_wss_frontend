import './chat.css';
import User from './user';

// Наименование стиля для скрытия объекта
const STYLE_HIDDEN = 'hidden';

// Стиль bootstrap для невалидного объекта
const STYLE_IS_INVALID = 'is-invalid';

export default class ChatWidget {
  constructor(parentEl, urlWebSocket) {
    this.parentEl = parentEl;
    this.urlWebSocket = urlWebSocket;
    this.ws = null;
  }

  static get formChatHTML() {
    return `
      <section style="background-color: #eee;">
      <div class="container py-5">
    
        <div class="row">
    
          <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0 border rounded-start">
    
            <h6 class="font-weight-bold mb-3 text-center text-lg-start">Участники</h5>
    
            <div class="card">
              <div class="card-body">
    
                <ul class="list-unstyled mb-0" data-id="users">
                </ul>
    
              </div>
            </div>
    
          </div>
    
          <div class="col-md-6 col-lg-7 col-xl-8 border rounded-3">
   
            <h6 class="font-weight-bold mb-3 text-center text-lg-start">Сообщения</h5>

            <ul class="list-unstyled" data-id="messages">
              <li class="d-flex justify-content-start text-left mb-1">
                <div class="card">
                  <div class="card-header d-flex justify-content-start p-1">
                    <p class="fw-bold small mb-0 mx-1">Brad Pitt</p>
                    <p class="text-muted small mb-0">12 mins ago</p>
                  </div>
                  <div class="card-body">
                    <p class="mb-0 text-start">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
              </li>
              <li class="d-flex justify-content-end mb-4">
                <div class="card">
                  <div class="card-header d-flex justify-content-between p-3">
                    <p class="fw-bold mb-0">Brad Pitt</p>
                    <p class="text-muted small mb-0"><i class="far fa-clock"></i> 10 mins ago</p>
                  </div>
                  <div class="card-body">
                    <p class="mb-0">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
              </li>
              <li class="bg-white mb-3">
                <div class="form-outline">
                  <textarea class="form-control" id="textAreaExample2" rows="4"></textarea>
                  <label class="form-label" for="textAreaExample2">Message</label>
                </div>
              </li>
              <button type="button" class="btn btn-info btn-rounded float-end">Send</button>
            </ul>
    
          </div>
    
        </div>
    
      </div>
    </section>
    `;
  }

  static get loadingHTML() {
    return `
      <div class="form-processing ${STYLE_HIDDEN}">
      <div class="overlay" id="overlay"></div>
      <div class="loadingProcess" id="loadingProcess"></div>
      </div>
    `;
  }

  static get formErrorHTML() {
    return `
      <div class="dialog-error ${STYLE_HIDDEN}">
        <div class="overlay" id="overlay"></div>
        <form class="form-ticket-delete row g-3">
          <div class="col-12">
            <div class="d-flex justify-content-center">
              <h5 class="form-title">Ошибка</h5>
            </div>
            <p></p>
          </div>
          <div class="col-12 d-flex justify-content-end">
            <button type="submit" value="submit" class="submit-buttom btn btn-primary ms-2">OK</button>
          </div>
        </form>
      </div>
      `;
  }

  static get formLoginHTML() {
    return `
      <div class="dialog-login" data-id="dialog-login">
        <div class="overlay" id="overlay"></div>
        <form class="form-login row g-3" data-id="form-login">
          <div class="col-12 d-flex justify-content-center">
            <h5 class="form-title">Выберите псевдоним</h5>
          </div>
          <div class="col-12">
            <input type="text" class="form-control" data-id = "username" required placeholder="Введите Ваше имя">
            <div class="invalid-feedback">
              Заданное имя уже занято. Выберите другое имя.
            </div>
          </div>
          <div class="col-12 d-flex justify-content-center">
            <button type="submit" value="submit" class="submit-buttom btn btn-primary ms-2">Продолжить</button>
          </div>
        </form>
      </div>
    `;
  }

  static idSelector(id) {
    return `[data-id="${id}"]`;
  }

  static get formLoginSelector() {
    return '.form-login';
  }

  wsConnect() {
    if (this.ws) {
      this.ws.close(3001);
    } else {
      this.ws = new WebSocket(this.urlWebSocket);      

      this.wsOpen = this.wsOpen.bind(this);
      this.ws.addEventListener('open', this.wsOpen);

      this.wsClose = this.wsClose.bind(this);
      this.ws.addEventListener('close', (evt) => this.wsClose(evt));
      
      this.wsMessage = this.wsMessage.bind(this);
      this.ws.addEventListener('message', (message) => this.wsMessage(message));
      
      this.wsError = this.wsError.bind(this);
      this.ws.addEventListener('error', (evt) => this.wsError(evt));      
    }
  }

  // Запуск виджета
  run() {    
    // Отрисовка HTML
    this.bindToDOM();

    // Соединяемся с сокетом
    this.wsConnect();

    // Инициализация переменных и событий
    this.init();
  }

  // Разметка HTML и отслеживание событий
  bindToDOM() {
    this.parentEl.innerHTML = '';
    this.parentEl.innerHTML += ChatWidget.loadingHTML;
    this.parentEl.innerHTML += ChatWidget.formErrorHTML;
    this.parentEl.innerHTML += ChatWidget.formLoginHTML;
    this.parentEl.innerHTML += ChatWidget.formChatHTML;
  }

  init() {
    this.ulUsers = this.parentEl.querySelector(ChatWidget.idSelector('users'));
    this.dialogLogin = this.parentEl.querySelector(ChatWidget.idSelector('dialog-login'));


    // Строка ввода имени псевдонима
    this.inputUserName = this.parentEl.querySelector(ChatWidget.idSelector('username'));
    this.onChangeUserName = this.onChangeUserName.bind(this);
    this.inputUserName.addEventListener('keydown', this.onChangeUserName);

    // Обработка событий по подтверждению вводу псевдонима
    const formLogin = this.dialogLogin.querySelector(ChatWidget.idSelector('form-login'));
    this.onSubmitLogin = this.onSubmitLogin.bind(this);
    formLogin.addEventListener('submit', (evt) => this.onSubmitLogin(evt));
  }

  wsOpen() {
    console.log(`Соединение установлено. URL: ${this.urlWebSocket}`);
  }

  wsClose(evt) {
    if (evt.wasClean) {
      console.log('Соединение закрыто.');
      this.ws = null;
    } else {
      console.log('Обрыв соединения!');
    }
    console.log(`Код: ${evt.code}; причина: ${evt.reason}`);
  }

  wsMessage(message) {
    console.log('Сообщение:', message);
    const data = JSON.parse(message.data);
    console.log('Получены данные:', (data));

    if (data.renderUsers) {
      this.users = data.names;
      this.users.forEach((name) => {
        this.ulUsers.appendChild(new User(name).render());
      });
    }

    if (data.nameIsFree) {
      this.dialogLogin.classList.add(STYLE_HIDDEN);
      const user = new User(data.name).render();
      this.ulUsers.appendChild(user);
      // document.querySelector(
      //   '.current-user',
      // ).childNodes[1].textContent = `${user.textContent} <-- You`;
    } else if (data.nameIsFree === false) {
      // popupOverlay.classList.remove('hidden');
      this.inputUserName.classList.add(STYLE_IS_INVALID);
      console.log('Имя занято. Выберите другое имя.');
    }

  }

  wsError(evt) {
    console.log(`Ошибка: ${evt.message}`);
  }

  onSubmitLogin(evt) {
    evt.preventDefault();
    // console.log(this.inputUserName)
    const userName = this.inputUserName.value;
    this.ws.send(JSON.stringify({ userName, chooseUserName: true }));
    // evt.currentTarget.reset();    
  }

  onChangeUserName() {
    if (this.inputUserName.classList.contains(STYLE_IS_INVALID)) {
      this.inputUserName.classList.remove(STYLE_IS_INVALID);
    }
  }

}
