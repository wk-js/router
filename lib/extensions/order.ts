import Route from '../route'
import Extension from './_extension'
import { clamp } from '../utils/number'

class Order extends Extension {

  public name: string = 'order'

  set(pathOrRoute: string | Route, index?: number): Route {
    const route:Route = super.set(pathOrRoute)

    const len = route.parent.children.length - 1
    const i   = route.parent.children.indexOf(route)
    const ii  = clamp(len - index, 0, len)

    route.parent.children.splice(i, 1)
    route.parent.children.splice(ii, 0, route)

    return route
  }

}

export default Order