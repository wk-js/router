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

  route(path, closure:() => void) {
    return this.currentScope.findOrCreate(path, this.currentScope, closure)
  }

  scope(path:string, closure:() => void) {

    const current = this.currentScope

    // Find or create scope
    const scope = this.currentScope.findOrCreate(path)

    this.currentScope = scope
    closure.call(this.currentScope)
    this.currentScope = current

    return scope
  }

  go(path:string) {
    const route = Resolver.resolve(path, this)

    if (route) {
      route.closure.call(route)
    }
  }

}

export default Router