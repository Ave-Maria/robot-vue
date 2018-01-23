export function initWebsocket ({
  commit,
  dispatch,
  state
}) {
  console.log('initWebsocket')
  var ws
  if (window.WebSocketFactory || global.WebSocketFactory) {
    ws = createWebsocket('ws://0.0.0.0:50002')
    console.log('wf:' + JSON.stringify(ws))
  } else {
    if (process.env.NODE_ENV === 'production') {
      ws = new WebSocket('ws://0.0.0.0:50002')
    } else {
      ws = new WebSocket('ws://localhost:50002')
    }
    console.log('websocket:ws' + JSON.stringify(ws))
  }
  ws.onopen = function (evt) {
    ws.send('{"event": "helloserver", "data": "nice to meet you"}')
    // commit('UPDATE_SOCKET_STATE', 'connect')
    // console.log('websocket onopen state:' + state.socket.state)
  }
  ws.onmessage = function (evt) {
    // dispatch('handleMessage', JSON.parse(evt.data))
    // console.log('websocket onmessage:' + JSON.parse(evt.data).event)
  }
  ws.onerror = function (evt) {
    // commit('UPDATE_SOCKET_STATE', 'disconnect')
    // setTimeout(() => {
    //   dispatch('initWebsocket')
    //   console.log('error重连NEI')
    // }, 3000)
    // console.log('evt.event:' + evt.event)
    // console.log('evt.data:' + evt.data)
    // console.log('onerror socket state:' + state.socket.state)
  }
  ws.onclose = function (evt) {
    // console.log('onclose:' + state.socket.state)
    // if (state.socket.state === 'connect') {
    //   setTimeout(() => {
    //     dispatch('initWebsocket')
    //     console.log('closed重连NEI')
    //   }, 3000)
    // }
    // console.log('closed重连WAI')
  }
}

export function createWebsocket (url) {
  // window object
  var global = window
// WebSocket Object. All listener methods are cleaned up!
  console.log('WebSocketFactory')
  var WebSocket = global.WebSocket = function (url) {
    console.error(url)
    console.log('this.socket:' + JSON.stringify(WebSocketFactory.getInstance(url))) //eslint-disable-line
// get a new websocket object from factory (check com.strumsoft.websocket.WebSocketFactory.java)
    this.socket = WebSocketFactory.getInstance(url)  //eslint-disable-line
// store in registry
    if (this.socket) {
      WebSocket.store[this.socket.getId()] = this
      console.log('websocket.store:' + JSON.stringify(this.socket))
    } else {
      throw new Error('Websocket instantiation failed! Address might be wrong.')
    }
  }

  // instance event methods
  WebSocket.prototype.send = function (data) {
    this.socket.send(data)
    console.log('p.send:' + data)
  }

  WebSocket.prototype.close = function () {
    this.socket.close()
    console.log('p.close:')
  }

  WebSocket.prototype.getReadyState = function () {
    this.socket.getReadyState()
  }
  // Must be overloaded
  WebSocket.prototype.onopen = function () {
    throw new Error('onopen not implemented.')
  }

  // alerts message pushed from server
  WebSocket.prototype.onmessage = function (msg) {
    throw new Error('onmessage not implemented.')
  }

  // alerts message pushed from server
  WebSocket.prototype.onerror = function (msg) {
    throw new Error('onerror not implemented.')
  }

  // alert close event
  WebSocket.prototype.onclose = function () {
    throw new Error('onclose not implemented.')
  }

  // storage to hold websocket object for later invokation of event methods
  WebSocket.store = {}

  // static event methods to call event methods on target websocket objects
  WebSocket.onmessage = function (evt) {
    WebSocket.store[evt._target]['onmessage'].call(global, evt)
    console.log('onMessage:' + JSON.stringify(evt))
  }

  WebSocket.onopen = function (evt) {
    WebSocket.store[evt._target]['onopen'].call(global, evt)
    console.log('onOpen:' + JSON.stringify(evt))
  }

  WebSocket.onclose = function (evt) {
    WebSocket.store[evt._target]['onclose'].call(global, evt)
    console.log('onClose:' + JSON.stringify(evt))
  }

  WebSocket.onerror = function (evt) {
    WebSocket.store[evt._target]['onerror'].call(global, evt)
    console.log('onError:' + JSON.stringify(evt))
  }
  return new WebSocket(url)
}

