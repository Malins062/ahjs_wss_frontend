import './chat.css';
// import RequestSender from './requestsender';

// Наименование стиля для скрытия объекта
const STYLE_HIDDEN = 'hidden';

export default class ChatWidget {
  constructor(parentEl, urlWebSocket) {
    this.parentEl = parentEl;
    this.urlWebSocket = urlWebSocket;
    this.ws = new WebSocket(this.urlWebSocket);
  }

  static itemHTML(item) {
    const html = `
        <li class="tasks__item list-group-item mb-2" draggable="true" data-id="${item.id}">
          <div class="row d-flex">
            <div class="col-md-1">
              <div class="form-check">
                <input class="item__status form-check-input" type="checkbox" value="" id="flexCheckChecked" ${item.status ? 'checked' : ''}>
              </div>
            </div>
            <div class="col-md-7 d-flex justify-content-start">
              <h6 class="item__name mb-0">${item.name}</h6>
            </div>
            <div class="col-md-3 d-flex justify-content-center">
              <h6 class="item__name mb-0">${item.created}</h6>
            </div>
            <div class="col-md-1 d-flex justify-content-end">
              <button class="item__edit btn btn-primary btn-sm" title="Редактировать задачу">&#9998;</button>
              <button class="item__delete btn btn-danger btn-sm ms-1" data-bs-toggle="modal" 
                data-bs-target="#deleteTicketDialog" title="Удалить задачу">&#10005;</button>
          </div>         
          <div class="col-md-1"></div>
          <div class="item__description col-md-7 hidden">
            <p></p>
          </div>
        </li>`;
    return html;
  }

  static itemsHTML(items) {
    let html = '';
    if (items) {
      items.forEach((item) => {
        html += this.itemHTML(item);
      });
    }
    return html;
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
    
                <ul class="list-unstyled mb-0">
                  <li class="p-2 border-bottom" style="background-color: #eee;">
                    <div class="d-flex flex-row">
                      <div class="pt-1">
                        <p class="fw-bold mb-0">Вы</p>
                      </div>
                    </div>
                  </li>
                  <li class="p-2 border-bottom">
                    <div class="d-flex flex-row">
                      <div class="pt-1">
                        <p class="fw-bold mb-0">Danny Smith</p>
                      </div>
                    </div>
                  </li>
                  <li class="p-2 border-bottom">
                    <div class="d-flex flex-row">
                      <div class="pt-1">
                        <p class="fw-bold mb-0">Alex Steward</p>
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

  static get itemAddSelector() {
    return '.item__add';
  }

  static get itemSelector() {
    return '.tasks__item';
  }

  static get listItemsSelector() {
    return '.tasks__list';
  }

  static get delItemSelector() {
    return '.item__delete';
  }

  static get editItemSelector() {
    return '.item__edit';
  }

  static get loadingSelector() {
    return '.form-processing';
  }

  static get descriptionItemSelector() {
    return '.item__description';
  }

  static get nameItemSelector() {
    return '.item__name';
  }

  static get statusItemSelector() {
    return '.item__status';
  }

  static get formTicketSelector() {
    return '.form-ticket';
  }

  static get formTicketDeleteSelector() {
    return '.form-ticket-delete';
  }

  static get formTitleSelector() {
    return '.form-title';
  }

  static get dialogLoadingSelector() {
    return '.dialog-loading';
  }

  static get dialogErrorSelector() {
    return '.dialog-error';
  }

  static get dialogDeleteSelector() {
    return '.dialog-delete';
  }

  static get dialogAddEditSelector() {
    return '.dialog-add-edit';
  }

  static get cancelButtonSelector() {
    return '.cancel-button';
  }

  static get submitButtonSelector() {
    return '.submit-button';
  }

  static get formLoginSelector() {
    return '.form-login';
  }

  // Запуск виджета
  run() {
    if (!this.ws) {
      console.error('WebSocket does not exists!');
      return;
    }

    // Отрисовка HTML
    this.bindToDOM();

    // Инициализация событий
    this.initEvents();
  }

  // Разметка HTML и отслеживание событий
  async bindToDOM() {
    this.parentEl.innerHTML = '';
    this.parentEl.innerHTML += ChatWidget.loadingHTML;
    this.parentEl.innerHTML += ChatWidget.formErrorHTML;
    this.parentEl.innerHTML += ChatWidget.formLoginHTML;
    this.parentEl.innerHTML += ChatWidget.formChatHTML;

    // const formProcess = this.parentEl.querySelector(HelpDeskWidget.loadingSelector);
    // const formError = this.parentEl.querySelector(HelpDeskWidget.dialogErrorSelector);
    // this.XHR = new RequestSender(this.urlServer,
    //   {
    //     form: formProcess,
    //     hide: STYLE_HIDDEN,
    //   },
    //   {
    //     form: formError,
    //     hide: STYLE_HIDDEN,
    //   });

    // this.tasksList.items = await this.XHR.getAllTickets();

    // this.parentEl.innerHTML += HelpDeskWidget.tasksListHTML(this.tasksList);
    // this.tasksListItems = this.parentEl.querySelector(HelpDeskWidget.listItemsSelector);

    // this.initEvents();
  }

  initEvents() {
    // Обработка событий по вводу псевдонима
    const formLogin = this.parentEl.querySelector(ChatWidget.formLoginSelector);
    this.onSubmitLogin = this.onSubmitLogin.bind(this);
    formLogin.addEventListener('click', this.onSubmitLogin);


  }

  onSubmitLogin() {
    
  }

  initItemEvents(item) {
    const idItem = item.dataset.id;

    // Событие по клику задачу
    item.addEventListener('click', async () => {
      const divDescription = item.querySelector(HelpDeskWidget.descriptionItemSelector);

      if (!divDescription) {
        return;
      }

      if (divDescription.classList.contains(STYLE_HIDDEN)) {
        const pDescription = divDescription.querySelector('p');
        const itemData = await this.XHR.getTicket(idItem);
        pDescription.innerText = itemData ? itemData.description : '';
      }

      divDescription.classList.toggle(STYLE_HIDDEN);
    });

    // Событие изменения статуса задачи
    const statusItem = item.querySelector(HelpDeskWidget.statusItemSelector);
    statusItem.addEventListener('click', async (evt) => {
      evt.stopPropagation();
      const body = `status=${statusItem.checked}`;
      await this.XHR.setStatusTicket(idItem, body);
    });

    // Событие удаления задачи
    const deleteItem = item.querySelector(HelpDeskWidget.delItemSelector);
    deleteItem.addEventListener('click', (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      this.onClickDeleteItem(idItem);
    });

    // Событие редактирования задачи
    const editItem = item.querySelector(HelpDeskWidget.editItemSelector);
    editItem.addEventListener('click', async (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      const itemData = await this.XHR.getTicket(idItem);
      this.onClickEditItem(itemData);
    });
  }

  async onClickNewItem() {
    const dialog = this.parentEl.querySelector(HelpDeskWidget.dialogAddEditSelector);
    dialog.classList.remove(STYLE_HIDDEN);

    // Заголовок формы
    const titleForm = dialog.querySelector(HelpDeskWidget.formTitleSelector);
    titleForm.innerText = FORMS.titles.add;

    // Имя тикета
    const inputName = dialog.querySelector(HelpDeskWidget.idSelector(FORMS.idInputName));
    inputName.value = '';

    // Описание тикета
    const inputDescription = dialog.querySelector(
      HelpDeskWidget.idSelector(FORMS.idInputDescription),
    );
    inputDescription.value = '';

    // Отработка кнопки "Отмена" для всех форм кроме формы отображения ошибки
    const cancelButton = dialog.querySelector(HelpDeskWidget.cancelButtonSelector);
    cancelButton.addEventListener('click', () => dialog.classList.add(STYLE_HIDDEN));

    // Отработка подтверждения формы
    dialog.addEventListener('submit', async (evt) => {
      evt.preventDefault();

      const body = `name=${encodeURIComponent(inputName.value)}&description=${encodeURIComponent(inputDescription.value)}`;
      const result = await this.XHR.addTicket(body);

      dialog.classList.add(STYLE_HIDDEN);

      if (result !== undefined && result !== null && result.constructor === Object) {
        this.addItemHTML(result);
      }
    });
  }

  async onClickEditItem(item) {
    const dialog = this.parentEl.querySelector(HelpDeskWidget.dialogAddEditSelector);
    dialog.classList.remove(STYLE_HIDDEN);

    // Заголовок формы
    const titleForm = dialog.querySelector(HelpDeskWidget.formTitleSelector);
    titleForm.innerText = FORMS.titles.change;

    // Имя тикета
    const inputName = dialog.querySelector(HelpDeskWidget.idSelector(FORMS.idInputName));
    inputName.value = item ? item.name : '';

    // Описание тикета
    const inputDescription = dialog.querySelector(
      HelpDeskWidget.idSelector(FORMS.idInputDescription),
    );
    inputDescription.value = item ? item.description : '';

    // Отработка кнопки "Отмена" для всех форм кроме формы отображения ошибки
    const cancelButton = dialog.querySelector(HelpDeskWidget.cancelButtonSelector);
    cancelButton.addEventListener('click', () => dialog.classList.add(STYLE_HIDDEN));

    // Отработка подтверждения формы
    dialog.addEventListener('submit', async (evt) => {
      evt.preventDefault();

      const body = `name=${inputName.value}&description=${inputDescription.value}`;
      const result = await this.XHR.changeTicket(item.id, body);

      dialog.classList.add(STYLE_HIDDEN);

      if (result !== undefined && result !== null && result.constructor === Object) {
        // console.log('Изменение задачи id=', result.id, ' result=', result);
        this.changeItemHTML(result);
      }
    });
  }

  async onClickDeleteItem(id) {
    const dialog = this.parentEl.querySelector(HelpDeskWidget.dialogDeleteSelector);
    dialog.classList.remove(STYLE_HIDDEN);

    // Отработка кнопки "Отмена" для всех форм кроме формы отображения ошибки
    const cancelButton = dialog.querySelector(HelpDeskWidget.cancelButtonSelector);
    cancelButton.addEventListener('click', () => dialog.classList.add(STYLE_HIDDEN));

    // Отработка подтверждения формы
    dialog.addEventListener('submit', async (evt) => {
      evt.preventDefault();

      const result = await this.XHR.deleteTicket(id);

      dialog.classList.add(STYLE_HIDDEN);

      if (result !== undefined && result !== null && result.constructor === Object) {
        // console.log('Удаление задачи id=', result.id, ' result=', result);
        this.deleteItemHTML(result.id);
      }
    });
  }

  addItemHTML(item) {
    const itemHTML = HelpDeskWidget.itemHTML(item);
    this.tasksListItems.insertAdjacentHTML('beforeEnd', itemHTML);
    const liItem = this.tasksListItems.querySelector(HelpDeskWidget.idSelector(item.id));
    this.initItemEvents(liItem);
  }

  deleteItemHTML(id) {
    const liItem = this.tasksListItems.querySelector(HelpDeskWidget.idSelector(id));
    liItem.remove();
  }

  changeItemHTML(item) {
    const liItem = this.tasksListItems.querySelector(HelpDeskWidget.idSelector(item.id));
    const itemName = liItem.querySelector(HelpDeskWidget.nameItemSelector);
    itemName.innerText = item.name;
  }
}
