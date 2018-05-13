import { EventEmitter } from 'events';
import IPCRendererMessagePort from '.';

function setupMock() {
  const ipcRenderer = new EventEmitter();

  ipcRenderer.send = jest.fn();
  ipcRenderer.sendToHost = jest.fn();

  return {
    ipcRenderer
  };
}

test('postMessage', () => {
  const { ipcRenderer } = setupMock();
  const messagePort = new IPCRendererMessagePort(ipcRenderer, 'channel_name');

  messagePort.postMessage('Hello, World!');

  expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
  expect(ipcRenderer.send).toHaveBeenCalledWith('channel_name', 'Hello, World!');
});

test('receive "message" event', () => {
  const { ipcRenderer } = setupMock();
  const messagePort = new IPCRendererMessagePort(ipcRenderer, 'channel_name');
  const handleMessage = jest.fn();

  messagePort.on('message', handleMessage);
  ipcRenderer.emit('channel_name', {}, 'Hello, World!')

  expect(handleMessage).toHaveBeenCalledTimes(0);

  ipcRenderer.emit('channel_name', {}, 'Aloha!')

  messagePort.start();

  expect(handleMessage).toHaveBeenCalledTimes(2);
  expect(handleMessage.mock.calls[0][0]).toHaveProperty('data', 'Hello, World!');
  expect(handleMessage.mock.calls[0][0]).toHaveProperty('origin', 'ipc-renderer://./');
  expect(handleMessage.mock.calls[1][0]).toHaveProperty('data', 'Aloha!');
  expect(handleMessage.mock.calls[1][0]).toHaveProperty('origin', 'ipc-renderer://./');
});

test('"onmessage" handler', () => {
  const { ipcRenderer } = setupMock();
  const messagePort = new IPCRendererMessagePort(ipcRenderer, 'channel_name');
  const handleMessage = jest.fn();

  messagePort.onmessage = handleMessage;

  ipcRenderer.emit('channel_name', {}, 'Hello, World!')

  expect(handleMessage).toHaveBeenCalledTimes(1);
  expect(handleMessage.mock.calls[0][0]).toHaveProperty('data', 'Hello, World!');
  expect(handleMessage.mock.calls[0][0]).toHaveProperty('origin', 'ipc-renderer://./');
});

test('close', () => {
  const { ipcRenderer } = setupMock();
  const messagePort = new IPCRendererMessagePort(ipcRenderer, 'channel_name');
  const handleMessage = jest.fn();

  messagePort.onmessage = handleMessage;
  messagePort.close();

  ipcRenderer.emit('channel_name', {}, 'Hello, World!')

  expect(handleMessage).toHaveBeenCalledTimes(0);
});
