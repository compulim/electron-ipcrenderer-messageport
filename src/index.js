import { HTMLEventEmitter } from 'websocket-util';

const DEFAULT_OPTIONS = {
  sendToHost: false
};

export default class IPCRendererMessagePort extends HTMLEventEmitter {
  constructor(ipcRenderer, channel, options = DEFAULT_OPTIONS) {
    super();

    this._backlog = [];
    this.ipcRenderer = ipcRenderer;
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.channel = channel;
    this.handleMessage = this.handleMessage.bind(this);

    ipcRenderer.on(channel, this.handleMessage);

    this.on('message', event => {
      this._onmessage && this._onmessage(event);
    });
  }

  set onmessage(handler) {
    this._onmessage = handler;
    this.start();
  }

  close() {
    this.ipcRenderer.removeListener(this.channel, this.handleMessage);
  }

  handleMessage(event, ...args) {
    const messageEvent = new CustomEvent('message');

    messageEvent.data = args[0];
    messageEvent.origin = 'ipc-renderer://./';
    messageEvent.source = this;

    if (this._backlog) {
      this._backlog.push(messageEvent);
    } else {
      this.emit('message', messageEvent);
    }
  }

  postMessage(data) {
    // We don't support transferList

    const send = this.options.sendToHost ? this.ipcRenderer.sendToHost : this.ipcRenderer.send;

    send.call(this.ipcRenderer, this.channel, data);
  }

  start() {
    if (this._backlog) {
      this._backlog.forEach(event => this.emit('message', event));
      this._backlog = null;
    }
  }
}
