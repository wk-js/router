import Router from '../router'
import Route from '../route'
import Extension from './_extension'

class History extends Extension {

  public name:string = 'history'
  public SUPPORT_PUSH_STATE = window.history.pushState !== undefined
  public SUPPORT_REPLACE_STATE = window.history.replaceState !== undefined

  constructor(router:Router) {
    super(router)

    this._onPopState = this._onPopState.bind(this)
    window.addEventListener('popstate', this._onPopState)
  }

  updatePath() {}

  push(data, title, url) {
    if (this.SUPPORT_PUSH_STATE) {
      window.history.pushState(data, title, url)
    }
  }

  replace(data, title, url) {
    if (this.SUPPORT_REPLACE_STATE) {
      window.history.replaceState(data, title, url)
    }
  }

  _onPopState() {
    this.router.backward()
  }

}

export default History