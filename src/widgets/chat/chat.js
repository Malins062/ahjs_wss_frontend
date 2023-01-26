import './chat.css';

// Наименование стиля для скрытия объекта
const STYLE_HIDDEN = 'hidden';

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
    
          <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
    
            <h5 class="font-weight-bold mb-3 text-center text-lg-start">Участники</h5>
    
            <div class="card">
              <div class="card-body">
    
                <ul class="list-unstyled mb-0" data-id="users">
                  <li class="p-2 border-bottom" style="background-color: #eee;">
                    <div class="d-flex flex-row">
                      <div class="pt-1">
                        <p class="fw-bold mb-0">Вы</p>
                      </div>
                    </div>
                  </li>
                </ul>
    
              </div>
            </div>
    
          </div>
    
          <div class="col-md-6 col-lg-7 col-xl-8">
    
            <ul class="list-unstyled">
              <li class="d-flex justify-content-between mb-4">
                <div class="card">
                  <div class="card-header d-flex justify-content-between p-3">
                    <p class="fw-bold mb-0">Brad Pitt</p>
                    <p class="text-muted small mb-0"><i class="far fa-clock"></i> 12 mins ago</p>
                  </div>
                  <div class="card-body">
                    <p class="mb-0">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
              </li>
              <li class="d-flex justify-content-between mb-4">
                <div class="card w-100">
                  <div class="card-header d-flex justify-content-between p-3">
                    <p class="fw-bold mb-0">Lara Croft</p>
                    <p class="text-muted small mb-0"><i class="far fa-clock"></i> 13 mins ago</p>
                  </div>
                  <div class="card-body">
                    <p class="mb-0">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                      laudantium.
                    </p>
                  </div>
                </div>
              </li>
              <li class="d-flex justify-content-between mb-4">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp" alt="avatar"
                  class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60">
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
            <button type="submit" value="submit" class="submit-buttom btn btn-primary ms-2">ОК</button>
          </div>
        </form>
      </div>
      `;
  }

  static get formLoginHTML() {
    return `
      <div class="dialog-login">
        <div class="overlay" id="overlay"></div>
        <form class="form-login row g-3">
          <div class="col-12 d-flex justify-content-center">
            <h5 class="form-title">Выберите псевдоним</h5>
          </div>
          <div class="col-12">
            <input type="text" class="form-control" required placeholder="Введите Ваше имя">
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

    // Инициализация событий
    this.initEvents();
  }

  // Разметка HTML и отслеживание событий
  bindToDOM() {
    this.parentEl.innerHTML = '';
    this.parentEl.innerHTML += ChatWidget.loadingHTML;
    this.parentEl.innerHTML += ChatWidget.formErrorHTML;
    this.parentEl.innerHTML += ChatWidget.formLoginHTML;
    this.parentEl.innerHTML += ChatWidget.formChatHTML;

    this.ulUsers = this.parentEl.querySelector(ChatWidget.idSelector('users'));
  }

  initEvents() {
    // Обработка событий по вводу псевдонима
    const formLogin = this.parentEl.querySelector(ChatWidget.formLoginSelector);
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
  }

  wsError(evt) {
    console.log(`Ошибка: ${evt.message}`);
  }

  onSubmitLogin(evt) {
    evt.preventDefault();
  }

}
