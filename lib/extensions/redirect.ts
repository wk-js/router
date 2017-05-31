import Route from '../route'
import Extension from './_extension'

class Redirect extends Extension {

  public name: string = 'redirection'
  public redirections = {}

  set(pathOrRoute: string | Route, options?: any): Route {
    const route: Route = super.set(pathOrRoute)

    let opts = { path: '' }

    if (typeof options === 'string') {
      opts.path = options
    } else if (typeof options === 'object') {
      opts = options
    }

    this.redirections['/' + route.getPath()] = {
      route: route,
      options: opts
    }

    return route
  }

  resolve(path: string, options): Route | null {

    if (this.redirections[path]) {
      const route = this.redirections[path].route
      const opts  = this.redirections[path].options
      const root  = route.root

      Object.assign(options, opts)
      return root.find(opts.path)
    }

    return null
  }

}

export default Redirect