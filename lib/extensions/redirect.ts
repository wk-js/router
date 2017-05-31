import Route from '../route'
import Extension from './_extension'
import Path from '../path'

class Redirect extends Extension {

<<<<<<< HEAD
  public name: string = 'redirect'
=======
  public name: string = 'redirection'
>>>>>>> a8df6e79410249d63ce28466a1e8b90e3ca76adc
  public redirections = {}

  set(pathOrRoute: string | Route, options?: any): Route {
    const route: Route = super.set(pathOrRoute)

    let opts = { path: '' }

    if (typeof options === 'string') {
      opts.path = options
    } else if (typeof options === 'object') {
      opts = options
    }

<<<<<<< HEAD
    this.redirections[Path.slash(route.getPath())] = {
=======
    this.redirections['/' + route.getPath()] = {
>>>>>>> a8df6e79410249d63ce28466a1e8b90e3ca76adc
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