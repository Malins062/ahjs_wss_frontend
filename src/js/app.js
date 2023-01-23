import ChatWidget from '../widgets/chat/chat';

// Адрес вебсокета
const URL_WEBSOCKET = 'ws://localhost:7070';

const chatWidget = new ChatWidget(document.querySelector('#widget-container'), URL_WEBSOCKET);
chatWidget.run();
