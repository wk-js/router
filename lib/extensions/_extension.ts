import Router from '../router'
import Route from '../route'

abstract class Extension {

  public name:string = '_extenstion'

  constructor(public router:Router) {}

  set(pathOrRoute: string | Route) : Route {
    let route: Route

    if (typeof pathOrRoute === 'string') {
      route = this.router.currentScope.findOrCreate(pathOrRoute as string)
    } else {
      route = pathOrRoute
    }

    return route
  }

  resolve(path: string, options): Route | null { return null }

}

export default Extension