import Router from '../router'
import Route from '../route'
import Extension from './_extension'

class History extends Extension {

  public name:string = 'history'
  public enable:boolean = true

  static SUPPORT_PUSH_STATE = window.history && window.history.pushState !== undefined
  static SUPPORT_REPLACE_STATE = window.history && window.history.replaceState !== undefined

  constructor(router:Router) {
    super(router)

    this._onPushState    = this._onPushState.bind(this)
    this._onReplaceState = this._onReplaceState.bind(this)
    this._onPopState     = this._onPopState.bind(this)

    this.router.events.on('push', this._onPushState)
    this.router.events.on('replace', this._onReplaceState)
    window.addEventListener('popstate', this._onPopState)
  }

  prepareHistory(result) {
    const arr = []
    const history = result.options.history

    if (typeof history === 'object') {
      arr.push( history.data, history.title, result.path )
    } else {
      arr.push( null, null, result.path )
    }

    return arr
  }

  _onPushState(result) {
    if (!this.enable || (typeof result.options.history === 'boolean' && !result.options.history)) return

    if (History.SUPPORT_PUSH_STATE) {
      window.history.pushState.apply(window.history, this.prepareHistory(result))
    }
  }

  _onReplaceState(result) {
    if (!this.enable || (typeof result.options.history === 'boolean' && !result.options.history)) return

    if (History.SUPPORT_REPLACE_STATE) {
      window.history.replaceState.apply(window.history, this.prepareHistory(result))
    }
  }

  _onPopState() {
    if (!this.enable) return

    this.router.backward()
  }

}

export default History