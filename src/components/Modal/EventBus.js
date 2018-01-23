import Vue from 'vue'
/**
 * 事件总线
 */
export let EventBus = new Vue()
export let EventMethods = {
  tip: function (message, duration, callback) {
    EventBus.$emit('tip', {message: message, duration: duration, callback: callback})
  },
  alert: function (message, title, callback) {
    if (typeof title === 'function') {
      callback = title
      title = undefined
    }
    EventBus.$emit('alert', {message: message, title: title, callback: callback})
  },
  confirm: function (message, title, callback, option) {
    if (typeof title === 'function') {
      callback = title
      title = undefined
    }
    EventBus.$emit('confirm', {message: message, title: title, callback: callback, option: option})
  },
  prompt: function (message, title, callback, options) {
    if (typeof title === 'function') {
      options = callback
      callback = title
      title = undefined
    }
    EventBus.$emit('prompt', {message: message, title: title, callback: callback, options: options || {}})
  }
}
