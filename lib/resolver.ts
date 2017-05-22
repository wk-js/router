import Route from './route'
import Router from './router'

class Resolver {

  static resolve(path:string, router:Router) : Route {
    const route = router.root.find(path) as Route

    if (route) return route

    // TODO: See dynamic property part
  }

}

export default Resolver