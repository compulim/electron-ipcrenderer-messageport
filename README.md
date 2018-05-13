# electron-ipcrenderer-messageport

[![npm version](https://badge.fury.io/js/electron-ipcrenderer-messageport.svg)](https://badge.fury.io/js/electron-ipcrenderer-messageport) [![Build Status](https://travis-ci.org/compulim/electron-ipcrenderer-messageport.svg?branch=master)](https://travis-ci.org/compulim/electron-ipcrenderer-messageport)

Turns Electron [`IPCRenderer`](https://github.com/electron/electron/blob/master/docs/api/ipc-renderer.md) into [MessagePort](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort).

# Background

Instead of learning/using different API for different communication channels, we should unite them into a single interface pattern, either [MessagePort](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort) or [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

This package is expected to work in pair with [`electron-ipcmain-messageport`](https://npmjs.com/package/electron-ipcmain-messageport).

# How to use

```js
const IPCRendererMessagePort = require('electron-ipcrenderer-messageport');
const { ipcRenderer } = require('electron');
const messagePort = new IPCRendererMessagePort(ipcRenderer, 'channel_name');

messagePort.onmessage = event => {
  // Could be either a string or Buffer
  console.log(event.data);
};

messagePort.postMessage('Hello, World!');
```

Note: to match the paradigm of MessagePort, we do not support synchronous messages and callbacks.

If you need to send to `<webview>` instead of host (i.e. [`sendToHost`](https://electronjs.org/docs/api/ipc-renderer#ipcrenderersendtohostchannel-arg1-arg2-)), you can set `sendToHost` to `true`.

```js
const messagePort = new IPCRendererMessagePort(ipcRenderer, 'channel_name', { sendToHost: true });
```

# Contributions

Like us? [Star](https://github.com/compulim/electron-ipcrenderer-messageport/stargazers) us.

Want to make it better? [File](https://github.com/compulim/electron-ipcrenderer-messageport/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/electron-ipcrenderer-messageport/pulls) a pull request.
