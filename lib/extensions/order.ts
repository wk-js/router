import Route from '../route'
import Extension from './_extension'
import { clamp } from '../utils/number'

class Order extends Extension {

  public name: string = 'order'

  set(pathOrRoute: string | Route, index?: number): Route {
    let route:Route

    if (typeof pathOrRoute === 'string') {
      route = this.router.currentScope.find(pathOrRoute as string)
    } else {
      route = pathOrRoute
    }

    if (route && route.parent) {
      const len = route.parent.children.length - 1
      const i   = route.parent.children.indexOf(route)
      const ii  = clamp(len - index, 0, len)

      route.parent.children.splice(i, 1)
      route.parent.children.splice(ii, 0, route)
    }

    return route
  }

}

export default Order