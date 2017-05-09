import { EventEmitter } from 'events'

class History {

  public SUPPORT_PUSH_STATE    = window.history.pushState !== undefined
  public SUPPORT_REPLACE_STATE = window.history.replaceState !== undefined

  public events:EventEmitter

  constructor() {
    this._onPopState = this._onPopState.bind(this)

    this.events = new EventEmitter
    this.events.off = this.events.removeListener
  }

  push(data, title, url) {
    if (this.SUPPORT_PUSH_STATE) {
      window.history.pushState(data, title, url)
    }
    this.events.emit('push', data, title, url)
  }

  replace(data, title, url) {
    if (this.SUPPORT_REPLACE_STATE) {
      window.history.replaceState(data, title, url)
    }

    this.events.emit('replace', data, title, url)
  }

  _onPopState(e) {
    this.events.emit('pop', e)
  }

}

export default History