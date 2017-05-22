import Node from './node'
import Route from './route'
import Resolver from './resolver'

class Router {

  public root:Route
  public currentScope:Route

  constructor() {
    this.root = new Route('/', null)
    this.currentScope = this.root
  }

  getRoutes() {
    return Resolver.getRoutes(this.root).map(function(route) {
      return route.getPath()
    })
  }

  route(path, closure:(parameters:any) => void) {
    if (!path || path.length === 0 || path === '/') {
      this.currentScope.closure = closure
    } else {
      return this.currentScope.findOrCreate(path, closure)
    }
  }

  scope(path:string, closure:(parameters:any) => void) {

    const current = this.currentScope

    // Find or create scope
    const scope = this.currentScope.findOrCreate(path)

    this.currentScope = scope
    closure.call(this.currentScope)
    this.currentScope = current

    return scope
  }

  go(path:string) {
    const result = Resolver.resolve(path, this)

    if (result) {
      const route = result.route
      const args  = result.args
      route.closure.call(route, args)
    }
  }

}

export default Router