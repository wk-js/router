import Route from '../route'
import Extension from './_extension'
import Path from '../path'

class Redirect extends Extension {

  public name: string = 'redirect'

  set(pathOrRoute: string | Route, options?: any): Route {
    const route: Route = super.set(pathOrRoute)

    let opts = { path: '' }

    if (typeof options === 'string') {
      opts.path = options
    } else if (typeof options === 'object') {
      opts = options
    }

    route.closure = () => {
      this.router.go(opts.path, Object.assign(opts, {
        replace: true
      }))
    }

    return route
  }

}

export default Redirect